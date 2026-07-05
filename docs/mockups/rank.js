/* Match Point — Mabar + Global rank demo (localStorage, mockup only) */
window.MP_Rank = (function () {
  const STORAGE_KEY = "mp-ranks";

  const DEFAULT = {
    padel: { mabar: 1680, mabarRank: 12, global: 1570, globalRank: 142, matches: 47 },
    tennis: { mabar: 1520, mabarRank: 8, global: 1480, globalRank: 201, matches: 31 },
    pickleball: { mabar: 0, mabarRank: 0, global: 1200, globalRank: 0, matches: 2 },
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
    const delta = opts.delta || 15;
    if (event.rankTarget === "global" || event.tier) {
      applyGlobalDelta(sport, delta * (event.tier === 1 ? 3 : event.tier === 2 ? 2 : 1));
      if (opts.mabarBonus) applyMabarDelta(sport, opts.mabarBonus);
    } else {
      applyMabarDelta(sport, delta);
    }
    return get(sport);
  }

  function isProvisional(sport) {
    return get(sport).matches < 5;
  }

  function applyDOM() {
    const sport = getSport();
    const r = get(sport);

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
    document.querySelectorAll("[data-provisional-badge]").forEach((el) => {
      el.hidden = !isProvisional(sport);
    });
  }

  function init() {
    load();
    applyDOM();
    window.addEventListener("mp:sport", applyDOM);
  }

  return {
    init,
    get,
    applyMabarDelta,
    applyGlobalDelta,
    finalizeEvent,
    isProvisional,
    applyDOM,
  };
})();
