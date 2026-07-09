/* Match Point — Community HQ module grid (club admin home) mockup
   design-system/match-point/pages/community-hq.md — bento grid inside the
   same visual world as the community page (locked same-world rule). */
window.MP_CommunityHQ = (function () {
  const t = (k) => (window.MP_I18N ? MP_I18N.t(k) : k);

  const svg = (body) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    body +
    "</svg>";
  const ICONS = {
    calendar:
      svg('<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>'),
    users:
      svg('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
    feed: svg('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'),
    swords:
      svg('<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/>'),
    court:
      svg('<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/><path d="M15 21V9"/>'),
    wallet:
      svg('<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>'),
    store:
      svg('<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/>'),
    queue:
      svg('<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1"/><path d="m9 14 2 2 4-4"/>'),
    live: svg('<polygon points="6 3 20 12 6 21 6 3"/>'),
  };

  const KPIS = [
    { value: "88", labelKey: "hq.kpiMembers", delta: "+4" },
    { value: "36", labelKey: "hq.kpiActive", delta: "+9" },
    { value: "2d", labelKey: "hq.kpiNextEvent", delta: "" },
    { value: "3", labelKey: "hq.kpiPending", delta: "", warn: true },
  ];

  const MODULES = [
    { icon: "calendar", labelKey: "hq.modEvents", kpi: "3", subKey: "hq.upcoming", goto: 1 },
    { icon: "queue", labelKey: "hq.modRegs", kpi: "12/16", subKey: "hq.slots", goto: 7 },
    { icon: "live", labelKey: "hq.modLive", kpi: "R3/7", subKey: "hq.liveRound", goto: 9 },
    { icon: "users", labelKey: "hq.modMembers", kpi: "88", subKey: "hq.newThisMonth" },
    { icon: "feed", labelKey: "hq.modFeed", kpi: "12", subKey: "hq.postsWeek" },
    { icon: "swords", labelKey: "hq.modSparring", kpi: "2", subKey: "hq.openRequests", goto: 11 },
    { icon: "court", labelKey: "hq.modBooking", kpi: "", soon: true },
    { icon: "wallet", labelKey: "hq.modFinance", kpi: "", soon: true },
  ];

  function renderKpis(root) {
    if (!root) return;
    root.innerHTML =
      '<div class="mp-hq-kpis">' +
      KPIS.map(
        (k) =>
          '<div class="mp-hq-kpi"><b>' +
          k.value +
          "</b><small>" +
          t(k.labelKey) +
          "</small>" +
          (k.delta
            ? ' <span class="mp-hq-delta' + (k.warn ? " is-warn" : "") + '">' + k.delta + "</span>"
            : "") +
          "</div>",
      ).join("") +
      "</div>";
  }

  function renderGrid(root) {
    if (!root) return;
    root.innerHTML =
      '<div class="mp-hq-grid">' +
      MODULES.map((m) => {
        const attrs = m.soon
          ? ' class="mp-hq-module is-soon" aria-disabled="true"'
          : ' class="mp-hq-module"' +
            (m.goto != null ? ' data-flow-goto="' + m.goto + '"' : "");
        return (
          "<button type=\"button\"" +
          attrs +
          ">" +
          '<span class="mp-hq-module-icon">' +
          ICONS[m.icon] +
          "</span><strong>" +
          t(m.labelKey) +
          "</strong>" +
          (m.soon
            ? '<span class="mp-hq-delta is-warn">' + t("hq.comingSoon") + "</span>"
            : '<span class="mp-hq-module-kpi"><b>' +
              m.kpi +
              "</b><small>" +
              t(m.subKey) +
              "</small></span>") +
          "</button>"
        );
      }).join("") +
      "</div>";
  }

  function applyDOM() {
    document.querySelectorAll("[data-hq-kpis]").forEach(renderKpis);
    document.querySelectorAll("[data-hq-grid]").forEach(renderGrid);
  }

  function init() {
    applyDOM();
    window.addEventListener("mp:lang", applyDOM);
  }

  return { applyDOM, renderGrid, renderKpis, init };
})();
