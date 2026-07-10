/* Match Point — club performance points + rewards (ILTL-inspired) */
window.MP_ClubRewards = (function () {
  const t = (k) => (window.MP_I18N ? MP_I18N.t(k) : k);
  const lang = () => (window.MP_I18N ? MP_I18N.getLang() : "en");
  const L = (o) => (o ? o[lang()] || o.en : "");

  const POINTS = 2840;

  const REWARDS = [
    {
      id: "r1",
      title: { id: "Sesi coaching 1 jam", en: "1-hour coaching session" },
      cost: 500,
    },
    {
      id: "r2",
      title: { id: "Slot acara featured", en: "Featured event slot" },
      cost: 800,
    },
    {
      id: "r3",
      title: { id: "Diskon merchandise 15%", en: "15% merch discount" },
      cost: 300,
    },
  ];

  function renderPanel(root) {
    if (!root) return;
    root.innerHTML =
      '<div class="mp-rewards-panel card mb-2">' +
      '<div class="flex justify-between items-center mb-1">' +
      "<strong>" +
      t("rewards.title") +
      "</strong>" +
      '<span class="badge badge-boc">' +
      POINTS.toLocaleString() +
      " " +
      t("rewards.pts") +
      "</span></div>" +
      '<p class="form-hint mb-2">' +
      t("rewards.sub") +
      "</p>" +
      '<ul class="mp-rewards-list">' +
      REWARDS.map(
        (r) =>
          "<li>" +
          "<span>" +
          L(r.title) +
          "</span>" +
          '<button type="button" class="btn btn-outline btn-sm"' +
          (POINTS < r.cost ? " disabled" : "") +
          ">" +
          t("rewards.redeem") +
          " · " +
          r.cost +
          "</button></li>",
      ).join("") +
      "</ul></div>";
  }

  function applyDOM() {
    document.querySelectorAll("[data-club-rewards]").forEach(renderPanel);
  }

  function init() {
    applyDOM();
    window.addEventListener("mp:lang", applyDOM);
  }

  return { POINTS, REWARDS, renderPanel, applyDOM, init };
})();
