/* Match Point — MP Rating + Mabar/Global ladder (Glicko-lite mock) */
window.MP_Rank = (function () {
  const STORAGE_KEY = "mp-ranks";
  const CROSS_COMMUNITY_MATCH_MIN = 3;
  const CROSS_COMMUNITY_DIVERSITY_PCT = 20;
  const ANCHOR_K_BOOST = 1.5;

  const SPORT_PROFILES = {
    padel: { display: "wpr", refLabel: "WPR", min: 0, max: 21, enabled: true },
    tennis: { display: "utr", refLabel: "UTR", min: 1, max: 16.5, enabled: true },
    pickleball: { display: "dupr", refLabel: "DUPR", min: 2, max: 8, enabled: true },
    badminton: { display: "mp", refLabel: "MP", min: 0, max: 10, enabled: true },
    table_tennis: { display: "mp", refLabel: "MP", min: 0, max: 10, enabled: true },
  };

  const BRACKET_META = {
    open: { en: "Open", id: "Terbuka", requireStable: false, allowUnrated: false },
    beginner: { en: "Beginner", id: "Pemula", requireStable: false, allowUnrated: false },
    intermediate: { en: "Intermediate", id: "Menengah", requireStable: true, allowUnrated: false },
    advanced: { en: "Advanced", id: "Mahir", requireStable: true, allowUnrated: false },
    elite: { en: "Elite", id: "Atlet", requireStable: true, allowUnrated: false, minVerified: 20 },
  };

  const BRACKET_CLASSES = {
    tennis: {
      open: { minMpRating: null, maxMpRating: null },
      beginner: { minMpRating: 1.0, maxMpRating: 3.49 },
      intermediate: { minMpRating: 3.5, maxMpRating: 5.49 },
      advanced: { minMpRating: 5.5, maxMpRating: 7.49 },
      elite: { minMpRating: 7.5, maxMpRating: null },
    },
    padel: {
      open: { minMpRating: null, maxMpRating: null },
      beginner: { minMpRating: 2.5, maxMpRating: 4.0 },
      intermediate: { minMpRating: 4.0, maxMpRating: 6.0 },
      advanced: { minMpRating: 6.0, maxMpRating: 8.0 },
      elite: { minMpRating: 8.0, maxMpRating: null },
    },
    pickleball: {
      open: { minMpRating: null, maxMpRating: null },
      beginner: { minMpRating: 2.0, maxMpRating: 3.0 },
      intermediate: { minMpRating: 3.0, maxMpRating: 4.0 },
      advanced: { minMpRating: 4.0, maxMpRating: 5.0 },
      elite: { minMpRating: 5.0, maxMpRating: null },
    },
    badminton: {
      open: { minMpRating: null, maxMpRating: null },
      beginner: { minMpRating: 0, maxMpRating: 3.0 },
      intermediate: { minMpRating: 3.0, maxMpRating: 5.0 },
      advanced: { minMpRating: 5.0, maxMpRating: 7.0 },
      elite: { minMpRating: 7.0, maxMpRating: null },
    },
    table_tennis: {
      open: { minMpRating: null, maxMpRating: null },
      beginner: { minMpRating: 0, maxMpRating: 3.0 },
      intermediate: { minMpRating: 3.0, maxMpRating: 5.0 },
      advanced: { minMpRating: 5.0, maxMpRating: 7.0 },
      elite: { minMpRating: 7.0, maxMpRating: null },
    },
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
      calibrationScope: "cross_community",
      crossCommunityMatches: 12,
      opponentDiversityPct: 35,
      homeCommunityId: "club-padel-jkt",
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
      calibrationScope: "cross_community",
      crossCommunityMatches: 8,
      opponentDiversityPct: 28,
      homeCommunityId: "club-tennis-jkt",
    },
    pickleball: {
      mabar: 0,
      mabarRank: 0,
      global: 0,
      globalRank: 0,
      matches: 0,
      skill: null,
      rd: 150,
      reliability: 0,
      verifiedMatches: 0,
      calibrationScope: "club_local",
      crossCommunityMatches: 0,
      opponentDiversityPct: 0,
      homeCommunityId: null,
    },
    badminton: {
      mabar: 420,
      mabarRank: 24,
      global: 380,
      globalRank: 512,
      matches: 12,
      skill: 4.2,
      rd: 72,
      reliability: 58,
      verifiedMatches: 8,
      calibrationScope: "club_local",
      crossCommunityMatches: 1,
      opponentDiversityPct: 8,
      homeCommunityId: "club-badminton-jkt",
    },
    table_tennis: {
      mabar: 0,
      mabarRank: 0,
      global: 0,
      globalRank: 0,
      matches: 0,
      skill: null,
      rd: 150,
      reliability: 0,
      verifiedMatches: 0,
      calibrationScope: "club_local",
      crossCommunityMatches: 0,
      opponentDiversityPct: 0,
      homeCommunityId: null,
    },
  };

  const HISTORY_KEY = "mp-rating-history";

  let ranks = {};

  function sportIds() {
    return Object.keys(SPORT_PROFILES).filter((id) => SPORT_PROFILES[id].enabled !== false);
  }

  function load() {
    try {
      ranks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (_) {
      ranks = {};
    }
    Object.keys(SPORT_PROFILES).forEach((s) => {
      if (!ranks[s]) ranks[s] = { ...DEFAULT[s] };
      else ranks[s] = { ...DEFAULT[s], ...ranks[s] };
      if (ranks[s].matches === 0 && ranks[s].skill === 0) ranks[s].skill = null;
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

  function prof(sport) {
    return SPORT_PROFILES[sport] || SPORT_PROFILES.padel;
  }

  function clampSkill(sport, value) {
    const p = prof(sport);
    return Math.max(p.min, Math.min(p.max, value));
  }

  function expectedScore(rA, rB) {
    return 1 / (1 + Math.pow(10, (rB - rA) / 400));
  }

  function kFactor(rd, matches) {
    if (matches < 5 || rd > 80) return 32;
    if (rd > 50) return 24;
    return 16;
  }

  function isUnrated(sport) {
    const r = get(sport);
    return r.skill == null && (r.matches || 0) === 0;
  }

  function isProvisional(sport) {
    if (isUnrated(sport)) return false;
    const r = get(sport);
    return r.matches < 5 || (r.reliability || 0) < 60;
  }

  function isStable(sport) {
    return !isUnrated(sport) && !isProvisional(sport);
  }

  function refHint(sport, mpRating) {
    if (mpRating == null) return "";
    const p = prof(sport);
    return "≈ " + p.refLabel + " " + mpRating.toFixed(1);
  }

  function formatMpRange(sport, min, max) {
    if (min == null && max == null) return "Any";
    if (max == null) return "≥ " + min.toFixed(1);
    if (min == null) return "≤ " + max.toFixed(1);
    return min.toFixed(1) + " – " + max.toFixed(1);
  }

  function skillBand(sport, skill) {
    sport = sport || getSport();
    if (skill == null) return "—";
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

  function getJourneyTier(sport) {
    const r = get(sport);
    const pts = r.mabar || 0;
    if (isUnrated(sport)) return { id: "Pemula", en: "Rookie" };
    if (pts < 50) return { id: "Pemula", en: "Rookie" };
    if (pts < 200) return { id: "Berkembang", en: "Rising" };
    if (pts < 500) return { id: "Mapan", en: "Established" };
    if (pts < 1000) return { id: "Andal", en: "Competitive" };
    return { id: "Juara klub", en: "Club champion" };
  }

  function getMpRatingDisplay(sport) {
    sport = sport || getSport();
    const r = get(sport);
    const p = prof(sport);
    if (isUnrated(sport)) {
      return {
        state: "unrated",
        mpRating: null,
        label: "MP Rating",
        refHint: "",
        band: "—",
        reliability: 0,
        provisional: false,
        stable: false,
        calibrationScope: r.calibrationScope || "club_local",
        journey: getJourneyTier(sport),
      };
    }
    const mpRating = r.skill;
    return {
      state: isProvisional(sport) ? "provisional" : "stable",
      mpRating,
      label: "MP Rating",
      refHint: refHint(sport, mpRating),
      band: skillBand(sport, mpRating),
      reliability: r.reliability || 0,
      provisional: isProvisional(sport),
      stable: isStable(sport),
      calibrationScope: r.calibrationScope || "club_local",
      journey: getJourneyTier(sport),
    };
  }

  function getSkillDisplay(sport) {
    const d = getMpRatingDisplay(sport);
    return {
      value: d.mpRating != null ? d.mpRating : 0,
      label: d.label,
      band: d.band,
      reliability: d.reliability,
      provisional: d.provisional,
      state: d.state,
      refHint: d.refHint,
      confidence: getConfidenceScore(sport),
    };
  }

  function getConfidenceScore(sport) {
    if (isUnrated(sport)) return null;
    const r = get(sport);
    const rd = Math.min(150, r.rd || 150);
    const score = Math.round(57 + (100 - rd) * 0.38 + (r.reliability || 0) * 0.25);
    return Math.min(99, Math.max(0, score));
  }

  function loadHistory() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || "{}");
    } catch (_) {
      return {};
    }
  }

  function saveHistory(h) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
  }

  function seedRatingHistory(sport) {
    const r = DEFAULT[sport] || get(sport);
    if (!r || r.skill == null) return [];
    const now = Date.now();
    const pts = [];
    const months = 24;
    const start = (r.skill || 5) - 1.8;
    for (let i = months; i >= 0; i--) {
      const t = now - i * 30 * 24 * 60 * 60 * 1000;
      const progress = (months - i) / months;
      const noise = Math.sin(i * 0.7) * 0.15;
      const mpRating = Math.max(prof(sport).min, start + (r.skill - start) * progress + noise);
      pts.push({ ts: t, mpRating: Math.round(mpRating * 100) / 100, rd: Math.max(35, (r.rd || 80) + (months - i) * 2) });
    }
    if (pts.length) pts[pts.length - 1].mpRating = r.skill;
    return pts;
  }

  function ensureHistorySeeded() {
    const h = loadHistory();
    let changed = false;
    sportIds().forEach((sport) => {
      if (!h[sport] || !h[sport].length) {
        const seeded = seedRatingHistory(sport);
        if (seeded.length) {
          h[sport] = seeded;
          changed = true;
        }
      }
    });
    if (changed) saveHistory(h);
    return h;
  }

  function appendRatingHistory(sport, snapshot) {
    sport = sport || getSport();
    const h = loadHistory();
    if (!h[sport]) h[sport] = [];
    const r = get(sport);
    h[sport].push({
      ts: snapshot?.ts || Date.now(),
      mpRating: snapshot?.mpRating != null ? snapshot.mpRating : r.skill,
      rd: snapshot?.rd != null ? snapshot.rd : r.rd,
    });
    if (h[sport].length > 500) h[sport] = h[sport].slice(-500);
    saveHistory(h);
    return h[sport];
  }

  function getRatingHistory(sport, range) {
    sport = sport || getSport();
    ensureHistorySeeded();
    const h = loadHistory();
    let pts = h[sport] || [];
    const now = Date.now();
    const ranges = { "3y": 3 * 365 * 86400000, "1y": 365 * 86400000, "1m": 30 * 86400000, "1w": 7 * 86400000 };
    const ms = ranges[range] || ranges["1y"];
    pts = pts.filter((p) => p.ts >= now - ms);
    if (!pts.length && !isUnrated(sport)) {
      const r = get(sport);
      return [{ ts: now, mpRating: r.skill, rd: r.rd }];
    }
    return pts;
  }

  function getBracketDisplay(sport, classId) {
    sport = sport || getSport();
    const meta = BRACKET_META[classId] || BRACKET_META.open;
    const range = (BRACKET_CLASSES[sport] || BRACKET_CLASSES.tennis)[classId] || BRACKET_CLASSES.tennis.open;
    const mpRatingRange = formatMpRange(sport, range.minMpRating, range.maxMpRating);
    const hint =
      range.minMpRating != null || range.maxMpRating != null
        ? refHint(sport, range.minMpRating != null ? range.minMpRating : range.maxMpRating)
        : "";
    return {
      classId,
      classEn: meta.en,
      classId_label: meta.id,
      mpRatingRange,
      refHint: hint,
      minMpRating: range.minMpRating,
      maxMpRating: range.maxMpRating,
      requireStable: meta.requireStable,
    };
  }

  function getBracketForRating(sport, mpRating) {
    sport = sport || getSport();
    if (mpRating == null) return "open";
    const classes = BRACKET_CLASSES[sport] || BRACKET_CLASSES.tennis;
    const order = ["elite", "advanced", "intermediate", "beginner", "open"];
    for (let i = 0; i < order.length - 1; i++) {
      const id = order[i];
      const r = classes[id];
      if (r.minMpRating != null && mpRating >= r.minMpRating) {
        if (r.maxMpRating == null || mpRating <= r.maxMpRating) return id;
        if (r.maxMpRating != null && mpRating > r.maxMpRating) return id;
      }
    }
    for (const id of ["beginner", "intermediate", "advanced"]) {
      const r = classes[id];
      if (r.minMpRating != null && r.maxMpRating != null && mpRating >= r.minMpRating && mpRating <= r.maxMpRating) return id;
    }
    return "open";
  }

  function updateCalibrationScope(sport) {
    const r = ranks[sport];
    if (!r) return;
    if (
      (r.crossCommunityMatches || 0) >= CROSS_COMMUNITY_MATCH_MIN &&
      (r.opponentDiversityPct || 0) >= CROSS_COMMUNITY_DIVERSITY_PCT
    ) {
      r.calibrationScope = "cross_community";
    } else {
      r.calibrationScope = "club_local";
    }
  }

  function applySkillDelta(sport, opponentSkill, score, opts) {
    sport = sport || getSport();
    opts = opts || {};
    const r = ranks[sport] || { ...DEFAULT[sport] };
    const p = prof(sport);
    let weight = opts.weight || 1;
    if (opts.crossCommunity && opts.anchorMatch) weight *= ANCHOR_K_BOOST;

    const opp = opponentSkill != null ? opponentSkill : p.min + (p.max - p.min) * 0.5;
    let playerSkill = r.skill;

    if (playerSkill == null) {
      playerSkill = clampSkill(sport, opp + (score >= 0.5 ? -0.5 : 0.5));
    }

    const k = kFactor(r.rd || 150, r.matches || 0) * weight;
    const exp = expectedScore(playerSkill * 100, opp * 100);
    const delta = (k * ((score != null ? score : 1) - exp)) / 100;
    r.skill = clampSkill(sport, playerSkill + delta);
    r.rd = Math.max(30, (r.rd || 150) - 2);
    r.matches = (r.matches || 0) + 1;
    r.reliability = Math.min(100, (r.reliability || 0) + (opts.verified ? 3 : 1));
    if (opts.verified) r.verifiedMatches = (r.verifiedMatches || 0) + 1;

    if (opts.crossCommunity) {
      r.crossCommunityMatches = (r.crossCommunityMatches || 0) + 1;
      const total = r.matches || 1;
      const cross = r.crossCommunityMatches;
      r.opponentDiversityPct = Math.round((cross / total) * 100);
    }

    ranks[sport] = r;
    updateCalibrationScope(sport);
    save();
    if (r.skill != null) {
      appendRatingHistory(sport, { mpRating: r.skill, rd: r.rd });
    }
    applyDOM();
    return r;
  }

  function deriveLadderDelta(sport, opponentSkill, score, eventWeight) {
    const r = get(sport);
    const p = prof(sport);
    const skill = r.skill != null ? r.skill : p.min + (p.max - p.min) * 0.4;
    const opp = opponentSkill != null ? opponentSkill : skill;
    const k = kFactor(r.rd || 80, r.matches || 0);
    const exp = expectedScore(skill * 100, opp * 100);
    const raw = k * ((score != null ? score : 1) - exp) * 0.8;
    return Math.round(raw * (eventWeight || 1));
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

  function processMatchResult(opts) {
    opts = opts || {};
    const sport = opts.sport || getSport();
    const event = opts.event || {};
    const weight =
      event.rankWeight != null
        ? event.rankWeight
        : event.eventType === "battle_of_communities"
          ? 1
          : event.sparringMode === "ranked"
            ? 0.7
            : 0.4;
    const score = opts.score != null ? opts.score : 1;
    const crossCommunity =
      opts.crossCommunity ||
      event.scope === "global" ||
      event.scope === "inter_community" ||
      !!opts.opponentCommunityId;
    const homeId = get(sport).homeCommunityId;
    const anchorMatch =
      crossCommunity && opts.opponentCommunityId && homeId && opts.opponentCommunityId !== homeId;

    applySkillDelta(sport, opts.opponentSkill, score, {
      verified: opts.verified !== false,
      weight,
      crossCommunity,
      anchorMatch,
    });

    const ladderDelta = deriveLadderDelta(sport, opts.opponentSkill, score, weight);
    if (event.rankTarget === "global" || event.tier) {
      const tierMult = event.tier === 1 ? 3 : event.tier === 2 ? 2 : 1;
      applyGlobalDelta(sport, Math.max(0, ladderDelta) * tierMult);
      if (opts.mabarBonus) applyMabarDelta(sport, opts.mabarBonus);
    } else {
      applyMabarDelta(sport, Math.max(0, ladderDelta));
    }
    return get(sport);
  }

  function finalizeEvent(event, opts) {
    opts = opts || {};
    return processMatchResult({
      sport: event.sport,
      event,
      opponentSkill: opts.opponentSkill,
      score: opts.score || 1,
      verified: opts.verified,
      opponentCommunityId: opts.opponentCommunityId,
      mabarBonus: opts.mabarBonus,
    });
  }

  function eligibilityFromBracket(sport, classId) {
    const d = getBracketDisplay(sport, classId);
    const meta = BRACKET_META[classId];
    return {
      bracketClass: classId,
      minMpRating: d.minMpRating,
      maxMpRating: d.maxMpRating,
      minRating: d.minMpRating,
      maxRating: d.maxMpRating,
      requireStable: meta.requireStable,
      requireReliability: meta.requireStable ? 60 : null,
      requireCrossCommunity: false,
    };
  }

  function checkEligibility(event, playerSkill) {
    const el = event?.eligibility || {};
    const sport = event?.sport || getSport();
    const r = get(sport);
    const skill = playerSkill != null ? playerSkill : r.skill;

    if (isUnrated(sport) && !el.allowUnrated && el.bracketClass !== "open") {
      return {
        ok: false,
        reason: "unrated",
        messageKey: "rank.eligibilityUnrated",
        message: "Play 1 verified match first, or join an Open event.",
      };
    }

    if (skill == null && el.bracketClass !== "open") {
      return {
        ok: false,
        reason: "unrated",
        messageKey: "rank.eligibilityUnrated",
        message: "Play 1 verified match first, or join an Open event.",
      };
    }

    const minR = el.minMpRating != null ? el.minMpRating : el.minRating;
    const maxR = el.maxMpRating != null ? el.maxMpRating : el.maxRating;

    if (maxR != null && skill != null && skill > maxR && !el.allowPlayDown) {
      const disp = getBracketDisplay(sport, "intermediate");
      return {
        ok: false,
        reason: "skill_too_high",
        messageKey: "rank.blockedBracket",
        message:
          "Your MP Rating " +
          skill.toFixed(2) +
          " exceeds Beginner max " +
          maxR.toFixed(1) +
          ". Try Intermediate or Open.",
        suggestedClass: getBracketForRating(sport, skill),
      };
    }
    if (minR != null && skill != null && skill < minR) {
      return {
        ok: false,
        reason: "skill_too_low",
        messageKey: "rank.eligibilityTooLow",
        message: "Minimum MP Rating " + minR.toFixed(1) + " required.",
      };
    }

    const meta = el.bracketClass ? BRACKET_META[el.bracketClass] : null;
    if (meta && meta.requireStable && isProvisional(sport)) {
      return {
        ok: false,
        reason: "provisional",
        messageKey: "rank.eligibilityProvisional",
        message: "Beginner brackets only until 5 verified matches.",
      };
    }

    if (meta && meta.minVerified && (r.verifiedMatches || 0) < meta.minVerified) {
      return {
        ok: false,
        reason: "insufficient_verified",
        messageKey: "rank.eligibilityVerified",
        message: meta.minVerified + "+ verified matches required for Elite.",
      };
    }

    const scope = event.scope || "community";
    const needsCross =
      el.requireCrossCommunity ||
      ((scope === "global" || scope === "inter_community") &&
        el.bracketClass &&
        ["intermediate", "advanced", "elite"].includes(el.bracketClass));
    if (needsCross && r.calibrationScope !== "cross_community") {
      return {
        ok: false,
        reason: "club_local_only",
        messageKey: "rank.eligibilityCrossClub",
        message: "Cross-club calibrated MP Rating required. Play inter-club events first.",
      };
    }

    if (el.requireReliability && (r.reliability || 0) < el.requireReliability && isProvisional(sport)) {
      return {
        ok: false,
        reason: "provisional",
        messageKey: "rank.eligibilityProvisional",
        message: "Provisional MP Rating — more verified matches needed.",
      };
    }

    return { ok: true };
  }

  function applyDOM() {
    const sport = getSport();
    const r = get(sport);
    const disp = getMpRatingDisplay(sport);
    const journey = disp.journey;
    const lang = (window.MP_I18N && MP_I18N.getLang()) || "id";
    const t = (key, fallback) =>
      window.MP_I18N ? MP_I18N.t(key, lang) : fallback || key;
    const journeyLabel = lang === "en" ? journey.en : journey.id;
    const scopeLabel =
      disp.calibrationScope === "cross_community"
        ? lang === "en"
          ? "Cross-club ✓"
          : "Lintas klub ✓"
        : lang === "en"
          ? "Club"
          : "Klub";

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

    document.querySelectorAll("[data-mp-rating]").forEach((el) => {
      if (disp.state === "unrated") {
        el.textContent = lang === "en" ? "Unrated" : "Belum dinilai";
      } else if (disp.provisional) {
        el.textContent = disp.mpRating.toFixed(2) + (lang === "en" ? " (est.)" : " (est.)");
      } else {
        el.textContent = disp.mpRating.toFixed(2) + " ✓";
      }
    });
    document.querySelectorAll("[data-mp-rating-ref]").forEach((el) => {
      el.textContent = disp.refHint || "";
      el.hidden = !disp.refHint;
    });
    document.querySelectorAll("[data-mp-rating-scope]").forEach((el) => {
      el.textContent = scopeLabel;
    });
    document.querySelectorAll("[data-journey-tier]").forEach((el) => {
      el.textContent = journeyLabel;
    });

    document.querySelectorAll("[data-skill-value]").forEach((el) => {
      if (disp.mpRating == null) el.textContent = "—";
      else el.textContent = disp.mpRating.toFixed(2);
    });
    document.querySelectorAll("[data-skill-label]").forEach((el) => {
      el.textContent = "MP Rating";
    });
    document.querySelectorAll("[data-skill-band]").forEach((el) => {
      el.textContent = disp.band;
    });
    document.querySelectorAll("[data-skill-reliability]").forEach((el) => {
      el.textContent = (r.reliability || 0) + "%";
    });
    const conf = getConfidenceScore(sport);
    document.querySelectorAll("[data-mp-confidence]").forEach((el) => {
      if (conf == null) {
        el.textContent = lang === "en" ? "—" : "—";
        el.hidden = el.hasAttribute("data-hide-if-unrated");
      } else {
        el.textContent = conf + "%";
        el.hidden = false;
      }
    });
    document.querySelectorAll("[data-mp-confidence-label]").forEach((el) => {
      const key = "rank.confidenceScore";
      el.textContent = window.MP_I18N ? MP_I18N.t(key) : "confidence score";
    });
    document.querySelectorAll("[data-provisional-badge]").forEach((el) => {
      el.hidden = disp.state !== "provisional";
    });
    document.querySelectorAll("[data-unrated-badge]").forEach((el) => {
      el.hidden = disp.state !== "unrated";
    });
    const storyStateKey =
      disp.state === "unrated"
        ? "rank.storyUnratedState"
        : disp.state === "provisional"
          ? "rank.storyProvisionalState"
          : "rank.storyReady";
    const storyBodyKey =
      disp.state === "unrated"
        ? "rank.storyUnratedBody"
        : disp.state === "provisional"
          ? "rank.storyProvisionalBody"
          : "rank.storyReadyBody";
    document.querySelectorAll("[data-rank-story-state]").forEach((el) => {
      el.textContent = t(storyStateKey);
    });
    document.querySelectorAll("[data-rank-story-body]").forEach((el) => {
      el.textContent = t(storyBodyKey);
    });
    document.querySelectorAll("[data-rank-story-badge]").forEach((el) => {
      el.textContent = scopeLabel;
    });

    applyAllSportsDOM();
  }

  function applyAllSportsDOM() {
    sportIds().forEach((sport) => {
      const r = get(sport);
      const disp = getMpRatingDisplay(sport);
      const lang = (window.MP_I18N && MP_I18N.getLang()) || "id";
      document.querySelectorAll('[data-sport-pts="' + sport + '"]').forEach((el) => {
        el.textContent = r.mabar;
      });
      document.querySelectorAll('[data-sport-mp-rating="' + sport + '"]').forEach((el) => {
        if (disp.state === "unrated") el.textContent = lang === "en" ? "Unrated" : "Belum dinilai";
        else if (disp.provisional) el.textContent = disp.mpRating.toFixed(1) + " (est.)";
        else el.textContent = disp.mpRating.toFixed(1) + " ✓";
      });
      const conf = getConfidenceScore(sport);
      document.querySelectorAll('[data-sport-confidence="' + sport + '"]').forEach((el) => {
        el.textContent = conf != null ? conf + "%" : "—";
        el.hidden = conf == null && el.hasAttribute("data-hide-if-unrated");
      });
    });
  }

  function applyEligibilityPanel() {
    const root =
      document.querySelector(".flow-step.active") ||
      document.querySelector(".screen.active");
    if (!root) return;
    const panel = root.querySelector("[data-eligibility-panel]");
    const block = root.querySelector("[data-eligibility-block]");
    const bracketEl = root.querySelector("[data-bracket-class-display]");
    if (!panel && !bracketEl) return;
    applyDOM();
    const ev = window.MP_Tournament?.get?.();
    const sport = ev?.sport || getSport();
    const bracketClass =
      ev?.bracketClass || ev?.eligibility?.bracketClass || "beginner";
    const bracketDisp = getBracketDisplay(sport, bracketClass);
    const disp = getMpRatingDisplay(sport);
    const lang = (window.MP_I18N && MP_I18N.getLang()) || "en";
    const t = (key, fallback) =>
      window.MP_I18N ? MP_I18N.t(key, lang) : fallback || key;
    if (bracketEl) {
      const cls = lang === "id" ? bracketDisp.classId_label : bracketDisp.classEn;
      bracketEl.textContent = cls + " · MP Rating " + bracketDisp.mpRatingRange;
    }
    if (!panel) return;
    const demoEvent = ev || { sport };
    if (!demoEvent.eligibility) {
      demoEvent.eligibility = eligibilityFromBracket(sport, bracketClass);
    }
    const check = checkEligibility(demoEvent);
    const verdict = panel.querySelector("[data-eligibility-verdict]");
    if (verdict) {
      const verdictTitle = verdict.querySelector("[data-eligibility-verdict-title]");
      const verdictBody = verdict.querySelector("[data-eligibility-verdict-body]");
      const verdictBadge = verdict.querySelector("[data-eligibility-verdict-badge]");
      let state = "is-ok";
      let titleKey = "rank.verdictEligibleTitle";
      let bodyText = t("rank.verdictEligibleBody");
      let badge = "✓";
      if (!check.ok && disp.state === "unrated") {
        state = "is-warn";
        titleKey = "rank.verdictUnratedTitle";
        bodyText = t("rank.verdictUnratedBody");
        badge = "↗";
      } else if (check.ok && disp.state === "provisional") {
        state = "is-warn";
        titleKey = "rank.verdictProvisionalTitle";
        bodyText = t("rank.verdictProvisionalBody");
        badge = "~";
      } else if (!check.ok) {
        state = "is-blocked";
        titleKey = "rank.verdictBlockedTitle";
        bodyText =
          check.messageKey && window.MP_I18N ? MP_I18N.t(check.messageKey, lang) : check.message;
        badge = "!";
      }
      verdict.classList.remove("is-ok", "is-warn", "is-blocked");
      verdict.classList.add(state);
      if (verdictTitle) verdictTitle.textContent = t(titleKey);
      if (verdictBody) verdictBody.textContent = bodyText;
      if (verdictBadge) verdictBadge.textContent = badge;
    }
    if (block) {
      block.hidden = check.ok;
      const msg = block.querySelector("[data-eligibility-msg]");
      if (msg && !check.ok) {
        if (check.messageKey && window.MP_I18N) msg.textContent = MP_I18N.t(check.messageKey);
        else msg.textContent = check.message;
      }
    }
    const actions = document.getElementById("reg-actions");
    if (actions) actions.style.opacity = check.ok ? "1" : "0.45";
  }

  function init() {
    load();
    ensureHistorySeeded();
    applyDOM();
    window.addEventListener("mp:sport", applyDOM);
    window.addEventListener("mp:lang", applyDOM);
  }

  return {
    init,
    get,
    getConfidenceScore,
    getRatingHistory,
    appendRatingHistory,
    ensureHistorySeeded,
    getMpRatingDisplay,
    getSkillDisplay,
    skillBand,
    getJourneyTier,
    getBracketDisplay,
    getBracketForRating,
    eligibilityFromBracket,
    applyMabarDelta,
    applyGlobalDelta,
    applySkillDelta,
    processMatchResult,
    finalizeEvent,
    isUnrated,
    isProvisional,
    isStable,
    checkEligibility,
    applyEligibilityPanel,
    applyDOM,
    SPORT_PROFILES,
    BRACKET_CLASSES,
    BRACKET_META,
    sportIds,
  };
})();
