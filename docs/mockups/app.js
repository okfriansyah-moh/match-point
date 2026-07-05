/* Match Point Mockup — navigation + i18n */
(function () {
  const i18n = window.MP_I18N;
  const screens = document.querySelectorAll(".screen");
  const navLinks = document.querySelectorAll("[data-screen]");
  const titleEl = document.getElementById("screen-title");
  const navEl = document.getElementById("proto-nav");
  const navToggle = document.getElementById("nav-toggle");

  const screenIds = [
    "auth-login",
    "auth-register",
    "home-dashboard",
    "profile",
    "profile-provisional",
    "profile-endorse-empty",
    "edit-profile",
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
    "tournament",
    "tournament-create",
    "tournament-bracket",
    "endorsement",
    "share-card",
    "admin",
    "admin-community",
    "admin-pending",
    "admin-dispute",
    "admin-adjustment",
    "errors",
  ];

  function updateTitle(screenId) {
    if (!titleEl) return;
    titleEl.textContent = i18n.t(i18n.screenTitleKey(screenId));
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
    navToggle.addEventListener("click", () => navEl.classList.toggle("open"));
  }

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => i18n.setLang(btn.dataset.lang));
  });

  window.addEventListener("mp:lang", () => {
    const active = document.querySelector(".nav-link.active");
    if (active) updateTitle(active.dataset.screen);
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
