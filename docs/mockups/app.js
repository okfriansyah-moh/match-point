/* Match Point Mockup — navigation + i18n + gallery design notes */
(function () {
  const i18n = window.MP_I18N;
  const screens = document.querySelectorAll(".screen");
  const navLinks = document.querySelectorAll("[data-screen]");
  const titleEl = document.getElementById("screen-title");
  const navEl = document.getElementById("proto-nav");
  const navToggle = document.getElementById("nav-toggle");
  const shell = document.querySelector(".proto-shell");

  const screenIds = [
    "auth-login",
    "auth-register",
    "verify-otp",
    "home-dashboard",
    "profile",
    "profile-provisional",
    "profile-endorse-empty",
    "edit-profile",
    "find-community",
    "communities",
    "community-create",
    "community-detail",
    "community-members",
    "admin-transfer",
    "leaderboard",
    "leaderboard-official",
    "leaderboard-snapshot",
    "submit-match",
    "match-approved",
    "match-pending",
    "match-duplicate",
    "match-disputed",
    "my-matches",
    "events-feed",
    "event-register",
    "event-americano",
    "event-mexicano",
    "format-round-robin",
    "format-league",
    "global-tournament",
    "tournament",
    "tournament-create",
    "tournament-bracket",
    "endorsement",
    "share-card",
    "player-other",
    "player-performance",
    "boc-fixture-detail",
    "sparring-detail",
    "home-dashboard-guest",
    "club-admin-dashboard",
    "club-wizard-1",
    "club-wizard-2",
    "club-wizard-3",
    "club-wizard-4",
    "club-wizard-roster",
    "club-wizard-publish",
    "club-registrations",
    "club-referee-setup",
    "club-live-referee",
    "club-sparring-create",
    "platform-login",
    "platform-approval-inbox",
    "platform-approval-detail",
    "platform-approval-result",
    "platform-analytics",
    "platform-global-wizard-1",
    "platform-global-wizard-2",
    "platform-global-wizard-3",
    "platform-global-wizard-4",
    "platform-global-wizard-5",
    "platform-global-wizard-6",
    "platform-global-reg",
    "platform-global-live",
    "platform-profile",
    "platform-settings",
    "platform-boc-wizard",
    "platform-boc-fixtures",
    "admin",
    "admin-community",
    "admin-pending",
    "admin-dispute",
    "admin-adjustment",
    "errors",
  ];

  function updateTitle(screenId) {
    if (!titleEl) return;
    const key = i18n.screenTitleKey(screenId);
    const text = i18n.t(key);
    titleEl.textContent = text === key ? screenId : text;
  }

  function showScreen(id) {
    if (!screenIds.includes(id)) id = "auth-login";
    screens.forEach((s) =>
      s.classList.toggle("active", s.id === "screen-" + id),
    );
    navLinks.forEach((l) =>
      l.classList.toggle("active", l.dataset.screen === id),
    );
    updateTitle(id);
    if (navEl) navEl.classList.remove("open");
    history.replaceState(null, "", "#" + id);
    if (window.MP_GalleryChrome) {
      const screen = document.getElementById("screen-" + id);
      const app = screen && screen.querySelector(".app");
      if (app) MP_GalleryChrome.upgradeApp(app, id);
      if (window.MP_Mascot) MP_Mascot.initAll();
    }
    if (window.MP_GalleryNotes) MP_GalleryNotes.render(id);
    if (window.MP_GalleryHydrate) MP_GalleryHydrate.hydrate(id);
    if (window.MP_EventWizard?.onScreenChange) MP_EventWizard.onScreenChange(id);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => showScreen(link.dataset.screen));
  });

  document.querySelectorAll("[data-goto]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showScreen(el.dataset.goto);
    });
  });

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      if (window.innerWidth <= 900) {
        navEl.classList.toggle("open");
      } else if (window.MP_GalleryNotes) {
        MP_GalleryNotes.toggleNav();
      } else if (shell) {
        shell.classList.toggle("proto-nav-collapsed");
      }
    });
  }

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => i18n.setLang(btn.dataset.lang));
  });

  window.addEventListener("mp:lang", () => {
    const active = document.querySelector(".nav-link.active");
    if (active) updateTitle(active.dataset.screen);
    i18n.apply(i18n.getLang());
  });

  i18n.apply(i18n.getLang());
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === i18n.getLang());
  });

  if (window.MP_Device) MP_Device.init();

  const hash = location.hash.slice(1);
  showScreen(hash && screenIds.includes(hash) ? hash : "auth-login");

  window.addEventListener("hashchange", () => {
    const h = location.hash.slice(1);
    if (screenIds.includes(h)) showScreen(h);
  });
})();
