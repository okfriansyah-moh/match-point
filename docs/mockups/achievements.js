/* Match Point — achievements / trophies mockup */
window.MP_Achievements = (function () {
  const lang = () => (window.MP_I18N ? MP_I18N.getLang() : "en");
  const L = (o) => (o ? o[lang()] || o.en : "");

  const TROPHIES = [
    {
      id: "americano-winner",
      icon: "🏆",
      title: { id: "Juara Grup Americano", en: "Americano Group Winner" },
      meta: { id: "Senayan · Jun 2026", en: "Senayan · Jun 2026" },
      earned: true,
      featured: true,
    },
    {
      id: "streak-6",
      icon: "🔥",
      title: { id: "Streak 6 minggu", en: "6-week streak" },
      meta: { id: "Main tiap minggu", en: "Played every week" },
      earned: true,
    },
    {
      id: "cross-community",
      icon: "🌐",
      title: { id: "Pemain Lintas Komunitas", en: "Cross-community Player" },
      meta: { id: "Main di 3 komunitas", en: "Played in 3 communities" },
      earned: true,
    },
    {
      id: "verified-10",
      icon: "🎯",
      title: { id: "10 Match Terverifikasi", en: "10 Verified Matches" },
      meta: { id: "GPS check lolos", en: "GPS checks passed" },
      earned: true,
    },
    {
      id: "multi-sport",
      icon: "🥇",
      title: { id: "Multi-sport Rookie", en: "Multi-sport Rookie" },
      meta: { id: "Rating di 2+ olahraga", en: "Rated in 2+ sports" },
      earned: false,
    },
    {
      id: "first-endorsement",
      icon: "🤝",
      title: { id: "Endorsement Pertama", en: "First Endorsement" },
      meta: { id: "Diberikan member aktif", en: "Given by an active member" },
      earned: true,
    },
  ];

  function earned() {
    return TROPHIES.filter((a) => a.earned);
  }

  function trophyCardHTML(a, opts) {
    opts = opts || {};
    const featured = opts.featured || a.featured;
    return (
      '<article class="mp-trophy-card' +
      (featured ? " mp-trophy-card--featured" : "") +
      (a.earned ? "" : " is-locked") +
      '">' +
      '<div class="mp-trophy-card-icon" aria-hidden="true">' +
      a.icon +
      "</div>" +
      '<div class="mp-trophy-card-body">' +
      "<strong>" +
      L(a.title) +
      "</strong>" +
      "<small>" +
      L(a.meta) +
      "</small>" +
      (a.earned
        ? '<span class="mp-trophy-card-badge">' +
          (window.MP_I18N ? MP_I18N.t("passport.earned") : "Earned") +
          "</span>"
        : '<span class="mp-trophy-card-badge is-locked">' +
          (window.MP_I18N ? MP_I18N.t("passport.locked") : "Locked") +
          "</span>") +
      "</div></article>"
    );
  }

  function renderTrophyCase(root, opts) {
    if (!root) return;
    opts = opts || {};
    let list = TROPHIES;
    if (opts.earnedOnly) list = earned();
    if (opts.limit) list = list.slice(0, opts.limit);

    const lead =
      opts.hideLead
        ? ""
        : '<div class="mp-trophy-case-lead">' +
          "<h3>" +
          (window.MP_I18N ? MP_I18N.t("passport.prideTitle") : "Hall of fame") +
          "</h3>" +
          "<p>" +
          (window.MP_I18N ? MP_I18N.t("passport.prideSubtitle") : "") +
          "</p></div>";

    root.innerHTML =
      lead +
      '<div class="mp-trophy-case">' +
      list.map((a) => trophyCardHTML(a, opts)).join("") +
      "</div>";
  }

  function renderShareHighlights(root) {
    if (!root) return;
    const picks = earned().slice(0, 3);
    root.innerHTML = picks
      .map(
        (a) =>
          '<span class="share-pride-chip">' +
          '<span aria-hidden="true">' +
          a.icon +
          "</span>" +
          L(a.title) +
          "</span>",
      )
      .join("");
  }

  function render(root, opts) {
    if (!root) return;
    if (root.dataset.pride !== undefined || opts.pride) {
      renderTrophyCase(root, opts);
      return;
    }
    opts = opts || {};
    let list = TROPHIES;
    if (opts.limit) list = list.slice(0, opts.limit);
    const cards = list
      .map(
        (a) =>
          '<div class="mp-trend-card" style="min-width:150px;text-align:center' +
          (a.earned ? "" : ";opacity:0.45") +
          '">' +
          '<div style="font-size:1.6rem" aria-hidden="true">' +
          a.icon +
          "</div>" +
          '<strong style="font-size:0.78rem;display:block">' +
          L(a.title) +
          "</strong>" +
          '<small style="color:var(--ink-muted);font-size:0.68rem">' +
          L(a.meta) +
          "</small></div>",
      )
      .join("");
    root.innerHTML = '<div class="mp-trend-rail">' + cards + "</div>";
  }

  function applyDOM() {
    document.querySelectorAll("[data-achievements]").forEach((root) => {
      const pride = root.hasAttribute("data-pride");
      render(root, {
        pride,
        limit: parseInt(root.dataset.limit || "0", 10) || 0,
      });
    });
    document.querySelectorAll("[data-share-pride]").forEach(renderShareHighlights);
  }

  function init() {
    applyDOM();
    window.addEventListener("mp:lang", applyDOM);
  }

  return {
    TROPHIES,
    earned,
    render,
    renderTrophyCase,
    renderShareHighlights,
    applyDOM,
    init,
  };
})();
