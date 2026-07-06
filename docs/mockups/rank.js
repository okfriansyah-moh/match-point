/* Match Point — Mabar + Global rank + skill rating (Glicko-lite mock) */
window.MP_Rank = (function () {
  const STORAGE_KEY = "mp-ranks";

  const SPORT_PROFILES = {
    padel: { display: "wpr", label: "WPR", min: 0, max: 21, bandKey: "nprp" },
    tennis: { display: "utr", label: "UTR", min: 1, max: 16.5, bandKey: "ntrp" },
    pickleball: { display: "dupr", label: "DUPR", min: 2, max: 8, bandKey: "dupr" },
  };

  const DEFAULT = {
    padel: {
      mabar: 1680,
      mabarRank: 12,
      global: 1570,
      globalRank: 142,
      matches: 47,
      skill: 7.8,
      rd: 45,
      reliability: 82,
      verifiedMatches: 38,
    },
    tennis: {
      mabar: 1520,
      mabarRank: 8,
      global: 1480,
      globalRank: 201,
      matches: 31,
      skill: 4.25,
      rd: 55,
      reliability: 74,
      verifiedMatches: 22,
    },
    pickleball: {
      mabar: 1200,
      mabarRank: 0,
      global: 1200,
      globalRank: 0,
      matches: 2,
      skill: 3.2,
      rd: 120,
      reliability: 25,
      verifiedMatches: 0,
    },
  };

  let ranks = {};

  function load() {
    try {
      ranks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (_) {
      ranks = {};
    }
    ["padel", "tennis", "pickleball"].forEach((s) => {
      if (!ranks[s]) ranks[s] = { ...DEFAULT[s] };
      else ranks[s] = { ...DEFAULT[s], ...ranks[s] };
    });
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ranks));
  }

  function getSport() {
    return (window.MP_Sport && MP_Sport.get()) || "padel";
  }

  function get(sport) {
    sport = sport || getSport();
    return { ...(ranks[sport] || DEFAULT[sport] || DEFAULT.padel) };
  }

  function expectedScore(rA, rB) {
    return 1 / (1 + Math.pow(10, (rB - rA) / 400));
  }

  function kFactor(rd, matches) {
    if (matches < 5 || rd > 80) return 32;
    if (rd > 50) return 24;
    return 16;
  }

  function skillBand(sport, skill) {
    sport = sport || getSport();
    if (sport === "tennis") {
      if (skill < 2.5) return "NTRP ~2.0";
      if (skill < 4) return "NTRP ~3.0";
      if (skill < 5.5) return "NTRP ~3.5";
      if (skill < 7) return "NTRP ~4.0";
      return "NTRP 4.5+";
    }
    if (sport === "padel") {
      if (skill < 4) return "Club ~2.5";
      if (skill < 7) return "Club ~3.5";
      if (skill < 10) return "Club ~4.0";
      return "Club 4.5+";
    }
    if (skill < 3) return "Beginner";
    if (skill < 4) return "Intermediate";
    return "Advanced";
  }

  function getSkillDisplay(sport) {
    const r = get(sport);
    const prof = SPORT_PROFILES[sport] || SPORT_PROFILES.padel;
    return {
      value: r.skill,
      label: prof.label,
      band: skillBand(sport, r.skill),
      reliability: r.reliability,
      provisional: isProvisional(sport),
    };
  }

  function applySkillDelta(sport, opponentSkill, score, opts) {
    sport = sport || getSport();
    const r = get(sport);
    const k = kFactor(r.rd, r.matches) * (opts?.weight || 1);
    const exp = expectedScore(r.skill * 100, (opponentSkill || r.skill) * 100);
    const delta = k * ((score || 1) - exp) / 100;
    r.skill = Math.max(0.5, Math.min(16.5, (r.skill || 3) + delta));
    r.rd = Math.max(30, (r.rd || 80) - 2);
    r.matches = (r.matches || 0) + 1;
    r.reliability = Math.min(100, (r.reliability || 30) + (opts?.verified ? 3 : 1));
    if (opts?.verified) r.verifiedMatches = (r.verifiedMatches || 0) + 1;
    ranks[sport] = r;
    save();
    applyDOM();
    return r;
  }

  function applyMabarDelta(sport, delta, opts) {
    sport = sport || getSport();
    const r = get(sport);
    r.mabar = Math.max(0, (r.mabar || 0) + delta);
    if (opts && opts.rank) r.mabarRank = opts.rank;
    ranks[sport] = r;
    save();
    applyDOM();
    window.dispatchEvent(new CustomEvent("mp:rank", { detail: { sport, ...r } }));
    return r;
  }

  function applyGlobalDelta(sport, delta, opts) {
    sport = sport || getSport();
    const r = get(sport);
    r.global = Math.max(0, (r.global || 0) + delta);
    if (opts && opts.rank) r.globalRank = opts.rank;
    ranks[sport] = r;
    save();
    applyDOM();
    window.dispatchEvent(new CustomEvent("mp:rank", { detail: { sport, ...r } }));
    return r;
  }

  function finalizeEvent(event, opts) {
    opts = opts || {};
    const sport = event.sport || getSport();
    const weight = event.rankWeight || (event.eventType === "battle_of_communities" ? 1 : event.sparringMode === "ranked" ? 0.7 : 0.4);
    const delta = Math.round((opts.delta || 15) * weight);
    if (event.rankTarget === "global" || event.tier) {
      applyGlobalDelta(sport, delta * (event.tier === 1 ? 3 : event.tier === 2 ? 2 : 1));
      if (opts.mabarBonus) applyMabarDelta(sport, opts.mabarBonus);
    } else {
      applyMabarDelta(sport, delta);
    }
    applySkillDelta(sport, opts.opponentSkill, opts.score || 1, { verified: opts.verified, weight });
    return get(sport);
  }

  function isProvisional(sport) {
    const r = get(sport);
    return r.matches < 5 || (r.reliability || 0) < 60;
  }

  function checkEligibility(event, playerSkill) {
    const el = event?.eligibility;
    if (!el) return { ok: true };
    const skill = playerSkill != null ? playerSkill : get(getSport()).skill;
    if (el.maxRating != null && skill > el.maxRating && !el.allowPlayDown) {
      return {
        ok: false,
        reason: "skill_too_high",
        message: "Your rating " + skill.toFixed(2) + " exceeds max " + el.maxRating + " for this bracket.",
      };
    }
    if (el.minRating != null && skill < el.minRating) {
      return { ok: false, reason: "skill_too_low", message: "Minimum rating " + el.minRating + " required." };
    }
    if (el.requireReliability && (get().reliability || 0) < el.requireReliability && isProvisional()) {
      return { ok: false, reason: "provisional", message: "Provisional rating — more verified matches needed." };
    }
    return { ok: true };
  }

  function applyDOM() {
    const sport = getSport();
    const r = get(sport);
    const disp = getSkillDisplay(sport);

    document.querySelectorAll("[data-rank-mabar]").forEach((el) => {
      el.textContent = r.mabarRank ? "#" + r.mabarRank : "—";
    });
    document.querySelectorAll("[data-rank-mabar-pts]").forEach((el) => {
      el.textContent = r.mabar;
    });
    document.querySelectorAll("[data-rank-global]").forEach((el) => {
      el.textContent = r.globalRank ? "#" + r.globalRank : "—";
    });
    document.querySelectorAll("[data-rank-global-pts]").forEach((el) => {
      el.textContent = r.global;
    });
    document.querySelectorAll("[data-skill-value]").forEach((el) => {
      el.textContent = disp.value.toFixed(2);
    });
    document.querySelectorAll("[data-skill-label]").forEach((el) => {
      el.textContent = disp.label;
    });
    document.querySelectorAll("[data-skill-band]").forEach((el) => {
      el.textContent = disp.band;
    });
    document.querySelectorAll("[data-skill-reliability]").forEach((el) => {
      el.textContent = (r.reliability || 0) + "%";
    });
    document.querySelectorAll("[data-provisional-badge]").forEach((el) => {
      el.hidden = !isProvisional(sport);
    });
  }

  function applyEligibilityPanel() {
    const panel = document.querySelector(".flow-step.active [data-eligibility-panel]");
    const block = document.querySelector(".flow-step.active [data-eligibility-block]");
    if (!panel) return;
    applyDOM();
    const demoEvent = {
      eligibility: { maxRating: 3.49, allowPlayDown: false, minRating: 0 },
    };
    const check = checkEligibility(demoEvent);
    if (block) {
      block.hidden = check.ok;
      const msg = block.querySelector("[data-eligibility-msg]");
      if (msg && !check.ok) msg.textContent = check.message;
    }
    const actions = document.getElementById("reg-actions");
    if (actions) actions.style.opacity = check.ok ? "1" : "0.45";
  }

  function init() {
    load();
    applyDOM();
    window.addEventListener("mp:sport", applyDOM);
  }

  return {
    init,
    get,
    getSkillDisplay,
    skillBand,
    applyMabarDelta,
    applyGlobalDelta,
    applySkillDelta,
    finalizeEvent,
    isProvisional,
    checkEligibility,
    applyEligibilityPanel,
    applyDOM,
    SPORT_PROFILES,
  };
})();
