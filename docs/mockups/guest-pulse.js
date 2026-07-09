/* Match Point — guest Discovery Pulse (public, conversion-driven) mockup
   design-system/match-point/pages/guest-home.md — show a live, breathing
   platform; soft gates inline, never modal walls. */
window.MP_GuestPulse = (function () {
  const t = (k) => (window.MP_I18N ? MP_I18N.t(k) : k);
  const lang = () => (window.MP_I18N ? MP_I18N.getLang() : "en");
  const L = (o) => (o ? o[lang()] || o.en : "");

  const LIVE = [
    { value: "523", key: "guest.communities" },
    { value: "2.4k", key: "guest.playingToday" },
    { value: "1,180", key: "guest.matchesWeek" },
  ];

  const OPEN_EVENTS = [
    {
      name: { id: "Americano Terbuka", en: "Open Americano" },
      meta: { id: "Sabtu 08:00 · Senayan · 6 slot", en: "Sat 08:00 · Senayan · 6 slots" },
      sport: "padel",
    },
    {
      name: { id: "Social Hit Tennis", en: "Tennis Social Hit" },
      meta: { id: "Minggu 07:30 · Kemang · 4 slot", en: "Sun 07:30 · Kemang · 4 slots" },
      sport: "tennis",
    },
    {
      name: { id: "Pickleball Open Play", en: "Pickleball Open Play" },
      meta: { id: "Minggu 16:00 · Blok M · 8 slot", en: "Sun 16:00 · Blok M · 8 slots" },
      sport: "pickleball",
    },
  ];

  function renderLiveStrip(root) {
    if (!root) return;
    root.innerHTML =
      '<div class="mp-live-strip">' +
      LIVE.map(
        (s) =>
          '<span class="mp-live-stat"><b>' +
          s.value +
          "</b><small>" +
          t(s.key) +
          "</small></span>",
      ).join("") +
      "</div>";
  }

  function renderTrending(root) {
    if (!root) return;
    const list = window.MP_Communities
      ? Object.values(MP_Communities.COMMUNITIES)
          .slice()
          .sort((a, b) => b.members - a.members)
          .slice(0, 3)
      : [];
    root.innerHTML =
      '<div class="mp-trend-rail">' +
      list
        .map(
          (c) =>
            '<div class="mp-trend-card" data-flow-goto="15" data-community-view="' +
            c.id +
            '" role="button" tabindex="0">' +
            '<strong style="display:block;font-size:0.9rem">' +
            c.name +
            "</strong>" +
            '<small style="color:var(--ink-muted)">' +
            (window.MP_Sport ? MP_Sport.label(c.sport) : c.sport) +
            " · " +
            c.city +
            "</small>" +
            '<div style="margin-top:0.5rem;font-family:var(--mono);font-variant-numeric:tabular-nums;font-size:0.8rem;color:var(--accent)">' +
            c.members +
            " " +
            t("guest.members") +
            "</div></div>",
        )
        .join("") +
      "</div>";
  }

  function renderOpenEvents(root) {
    if (!root) return;
    root.innerHTML = OPEN_EVENTS.map(
      (e) =>
        '<div class="mp-pulse-card">' +
        '<span class="mp-pulse-icon" style="--sport-color: var(--sport-' +
        e.sport.replace("_", "-") +
        ')">🎯</span>' +
        '<div class="mp-pulse-main"><strong>' +
        L(e.name) +
        "</strong><small>" +
        L(e.meta) +
        "</small></div>" +
        '<button type="button" class="btn btn-outline btn-sm" data-guest-login>' +
        t("guest.rsvpGate") +
        "</button></div>",
    ).join("");
  }

  function renderHow(root) {
    if (!root) return;
    root.innerHTML =
      '<div class="mp-how-steps">' +
      [1, 2, 3]
        .map(
          (n) =>
            '<div class="mp-how-step"><span class="mp-how-step-num">' +
            n +
            "</span><strong style=\"display:block;font-size:0.82rem\">" +
            t("guest.how" + n) +
            "</strong></div>",
        )
        .join("") +
      "</div>";
  }

  function applyDOM(ctx) {
    if (ctx && ctx.guest === false) return;
    document.querySelectorAll("[data-guest-live-strip]").forEach(renderLiveStrip);
    document.querySelectorAll("[data-guest-trending]").forEach(renderTrending);
    document.querySelectorAll("[data-guest-open-events]").forEach(renderOpenEvents);
    document.querySelectorAll("[data-guest-how]").forEach(renderHow);
  }

  function init() {
    applyDOM({});
    window.addEventListener("mp:lang", () => applyDOM({}));
  }

  return { applyDOM, renderTrending, renderOpenEvents, init };
})();
