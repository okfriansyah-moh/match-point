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
    "player-passport",
    "social-feed",
    "social-stories",
    "social-post-detail",
    "social-compose",
    "messages-inbox",
    "messages-thread",
    "friends-list",
    "player-highlights",
    "court-booking",
    "booking-confirm",
    "home-dashboard-guest",
    "social-feed-guest",
    "passport-teaser-guest",
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
    "platform-overview",
    "platform-community-pipeline",
    "platform-moderation-inbox",
    "platform-graph-health",
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
  const FLOW_STEP_TO_SCREEN = {
    0: "auth-login",
    1: "home-dashboard",
    2: "community-create",
    3: "leaderboard",
    4: "submit-match",
    5: "match-approved",
    6: "profile",
    7: "endorsement",
    8: "share-card",
    9: "communities",
    10: "events-feed",
    11: "event-americano",
    12: "event-mexicano",
    13: "tournament-bracket",
    14: "find-community",
    15: "community-detail",
    16: "event-register",
    17: "auth-register",
    18: "verify-otp",
    19: "format-round-robin",
    20: "format-league",
    21: "global-tournament",
    22: "player-other",
    23: "edit-profile",
    24: "leaderboard-snapshot",
    25: "boc-fixture-detail",
    26: "sparring-detail",
    27: "social-feed",
    28: "messages-inbox",
    29: "player-passport",
    30: "court-booking",
    31: "booking-confirm",
    32: "friends-list",
  };

  function updateTitle(screenId) {
    if (!titleEl) return;
    const key = i18n.screenTitleKey(screenId);
    const text = i18n.t(key);
    titleEl.textContent = text === key ? screenId : text;
  }

  function syncTabGroups(root) {
    root.querySelectorAll("[data-tabs]").forEach((group) => {
      const active = group.querySelector("[data-tab].active") || group.querySelector("[data-tab]");
      if (!active) return;
      const key = active.dataset.tab;
      group.querySelectorAll("[data-tab]").forEach((tab) => {
        tab.classList.toggle("active", tab === active);
      });
      group.querySelectorAll("[data-tab-pane]").forEach((pane) => {
        pane.hidden = pane.dataset.tabPane !== key;
      });
    });
  }

  function resolveFlowTarget(flowStep) {
    const step = parseInt(flowStep, 10);
    return Number.isNaN(step) ? null : FLOW_STEP_TO_SCREEN[step] || null;
  }

  function isActivationKey(event) {
    return event.key === "Enter" || event.key === " ";
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
    const screen = document.getElementById("screen-" + id);
    if (screen) syncTabGroups(screen);
    if (window.MP_GalleryChrome) {
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

  document.addEventListener("click", (e) => {
    const gotoEl = e.target.closest("[data-goto]");
    if (gotoEl) {
      e.preventDefault();
      showScreen(gotoEl.dataset.goto);
      return;
    }

    const flowGotoEl = e.target.closest("[data-flow-goto]");
    if (flowGotoEl) {
      const target = resolveFlowTarget(flowGotoEl.dataset.flowGoto);
      if (target) {
        e.preventDefault();
        showScreen(target);
        return;
      }
    }

    const loginEl = e.target.closest("[data-login], [data-guest-login]");
    if (loginEl) {
      e.preventDefault();
      showScreen(resolveFlowTarget(loginEl.dataset.loginGoto) || "home-dashboard");
      return;
    }

    const tabEl = e.target.closest("[data-tab]");
    if (tabEl) {
      const group = tabEl.closest("[data-tabs]");
      if (!group) return;
      e.preventDefault();
      group.querySelectorAll("[data-tab]").forEach((tab) => {
        tab.classList.toggle("active", tab === tabEl);
      });
      group.querySelectorAll("[data-tab-pane]").forEach((pane) => {
        pane.hidden = pane.dataset.tabPane !== tabEl.dataset.tab;
      });
      return;
    }

    const playerEl = e.target.closest("[data-player-profile]");
    if (playerEl) {
      e.preventDefault();
      try {
        sessionStorage.setItem(
          "mp-view-player",
          playerEl.dataset.playerProfile || "Rudi Hartono",
        );
      } catch (_) {
        /* no-op */
      }
      showScreen("player-other");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!isActivationKey(e)) return;
    const trigger = e.target.closest(
      "[data-goto], [data-flow-goto], [data-login], [data-guest-login], [data-tab], [data-player-profile], [role=\"button\"]",
    );
    if (!trigger) return;
    if (/^(BUTTON|A|INPUT|SELECT|TEXTAREA)$/.test(trigger.tagName)) return;
    if (trigger.hasAttribute("contenteditable")) return;
    e.preventDefault();
    trigger.click();
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
