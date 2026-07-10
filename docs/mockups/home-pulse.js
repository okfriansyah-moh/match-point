/* Match Point — authenticated daily hook home (pulse cards) mockup
   design-system/match-point/pages/home-dashboard.md — content must be
   today-specific: urgent countdown first, then rating delta, streak,
   friend activity, community update. */
window.MP_HomePulse = (function () {
  const t = (k) => (window.MP_I18N ? MP_I18N.t(k) : k);
  const lang = () => (window.MP_I18N ? MP_I18N.getLang() : "en");
  const L = (o) => (o ? o[lang()] || o.en : "");

  const svg = (body) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    body +
    "</svg>";
  const ICONS = {
    calendar:
      svg('<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>'),
    trend: svg('<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>'),
    flame:
      svg('<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>'),
    users:
      svg('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
    megaphone: svg('<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>'),
  };

  function card(opts) {
    return (
      '<div class="mp-pulse-card' +
      (opts.urgent ? " mp-pulse-card--urgent" : "") +
      '"' +
      (opts.goto != null ? ' data-flow-goto="' + opts.goto + '"' : "") +
      ' role="button" tabindex="0">' +
      '<span class="mp-pulse-icon">' + opts.icon + "</span>" +
      '<div class="mp-pulse-main"><strong>' +
      opts.title +
      "</strong><small>" +
      opts.sub +
      "</small></div>" +
      (opts.meta ? '<span class="mp-pulse-meta">' + opts.meta + "</span>" : "") +
      "</div>"
    );
  }

  function cards() {
    const sport = window.MP_Sport ? MP_Sport.get() : "padel";
    const sportLabel = window.MP_Sport ? MP_Sport.label(sport) : "Padel";
    const rank = window.MP_Rank ? MP_Rank.get(sport) : { matches: 8 };
    const rated = rank && rank.skill != null;
    const delta = rated ? "+12" : "—";

    return [
      card({
        urgent: true,
        icon: ICONS.calendar,
        title: t("pulse.nextEvent") + " · Minggu Mexicano",
        sub: t("pulse.tomorrow") + " · 08:00 · Senayan Padel Club",
        meta: "16:24:09",
        goto: 10,
      }),
      card({
        icon: ICONS.trend,
        title: t("pulse.ratingDelta") + " · " + sportLabel,
        sub: t("pulse.sinceLastVisit"),
        meta:
          '<span class="' +
          (rated ? "mp-pulse-delta-up" : "") +
          '">' +
          (rated ? "▲ " + delta : delta) +
          "</span>",
        goto: 3,
      }),
      card({
        icon: ICONS.flame,
        title: t("pulse.streak") + " · 6 " + t("pulse.weeks"),
        sub: L({
          id: "Main minggu ini untuk jaga streak-mu.",
          en: "Play this week to keep your streak alive.",
        }),
        meta: "🔥 6",
        goto: 10,
      }),
      card({
        icon: ICONS.users,
        title: t("pulse.openMabar"),
        sub: t("pulse.openMabarSub"),
        meta: "3",
        goto: 33,
      }),
      card({
        icon: ICONS.users,
        title: t("pulse.friendActivity"),
        sub: L({
          id: "Sari & Andi main Americano semalam — Sari naik +8.",
          en: "Sari & Andi played Americano last night — Sari gained +8.",
        }),
        goto: 27,
      }),
      card({
        icon: ICONS.megaphone,
        title: t("pulse.communityUpdate"),
        sub: L({
          id: "Senayan Padel Club: 4 member baru minggu ini.",
          en: "Senayan Padel Club: 4 new members this week.",
        }),
        goto: 15,
      }),
    ].join("");
  }

  function render(root) {
    if (!root) return;
    root.innerHTML = '<div class="mp-pulse-stack">' + cards() + "</div>";
  }

  function applyDOM(ctx) {
    if (ctx && ctx.guest) return; // member-only surface
    document.querySelectorAll("[data-home-pulse]").forEach(render);
  }

  function init() {
    applyDOM({ guest: document.body.classList.contains("mp-guest") });
    window.addEventListener("mp:lang", () => applyDOM({}));
    window.addEventListener("mp:sport", () => applyDOM({}));
  }

  return { render, applyDOM, init };
})();
