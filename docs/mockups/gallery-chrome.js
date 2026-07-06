/* Match Point gallery — align static prototype chrome with interactive flows */
window.MP_GalleryChrome = (function () {
  const MASCOT_BTN =
    '<button type="button" class="mp-mascot-switch mp-mascot-header-slot" data-mascot data-mascot-switch data-mascot-sport="auto" data-mascot-size="sm" data-i18n-title="sport.switch" title="Switch sport"></button>';

  const HEADER_ACTIONS =
    '<div class="notif-wrap">' +
    '<button type="button" class="icon-btn" data-i18n-title="chrome.notifications" title="Notifications">🔔</button>' +
    "</div>" +
    MASCOT_BTN +
    '<div class="avatar avatar-sm avatar-photo" title="Budi Santoso">🧑🏽</div>';

  const TOPNAV_ITEMS = [
    { key: "home", i18n: "nav.home" },
    { key: "rank", i18n: "nav.rank" },
    { key: "play", i18n: "nav.play" },
    { key: "events", i18n: "nav.events" },
    { key: "community", i18n: "nav.group.community" },
  ];

  const BOTTOM_NAV_ITEMS = [
    { icon: "🏠", i18n: "nav.home", active: false },
    { icon: "🏆", i18n: "nav.rank", active: false },
    { icon: "➕", i18n: "nav.play", active: false },
    { icon: "🎯", i18n: "nav.events", active: false },
    { icon: "👥", i18n: "nav.group.community", active: false },
  ];

  function topNavHTML(activeKey) {
    return (
      '<nav class="mp-topnav">' +
      TOPNAV_ITEMS.map(
        (it) =>
          '<button type="button" class="mp-topnav-item' +
          (it.key === activeKey ? " active" : "") +
          '" data-i18n="' +
          it.i18n +
          '"></button>',
      ).join("") +
      "</nav>"
    );
  }

  function bottomNavHTML(activeKey) {
    const keys = ["home", "rank", "play", "events", "community"];
    return (
      '<nav class="bottom-nav">' +
      BOTTOM_NAV_ITEMS.map((it, i) => {
        const key = keys[i];
        return (
          '<button type="button" class="bottom-nav-item' +
          (key === activeKey ? " active" : "") +
          '"><span>' +
          it.icon +
          '</span><span data-i18n="' +
          it.i18n +
          '"></span></button>'
        );
      }).join("") +
      "</nav>"
    );
  }

  function screenNavKey(screenId) {
    const map = {
      "home-dashboard": "home",
      profile: "community",
      "profile-provisional": "community",
      "profile-endorse-empty": "community",
      "edit-profile": "community",
      communities: "community",
      "community-create": "community",
      "community-detail": "community",
      "community-members": "community",
      "admin-transfer": "community",
      leaderboard: "rank",
      "leaderboard-official": "rank",
      "leaderboard-snapshot": "rank",
      "submit-match": "play",
      "match-approved": "play",
      "match-pending": "play",
      "match-duplicate": "play",
      "match-disputed": "play",
      "my-matches": "play",
      tournament: "events",
      "tournament-create": "events",
      "tournament-bracket": "events",
      endorsement: "community",
      "share-card": "community",
    };
    return map[screenId] || null;
  }

  function upgradeHeader(app) {
    const header = app.querySelector(".app-header");
    if (!header || header.querySelector(".mp-mascot-switch")) return;

    let actions = header.querySelector(".app-header-actions");
    if (!actions) {
      actions = document.createElement("div");
      actions.className = "app-header-actions";
      header.appendChild(actions);
    }
    actions.insertAdjacentHTML("beforeend", HEADER_ACTIONS);
  }

  function upgradeNav(app, screenId) {
    const navKey = screenNavKey(screenId);
    if (!navKey) return;

    const oldDesktop = app.querySelector(".app-nav-desktop");
    if (oldDesktop) {
      oldDesktop.insertAdjacentHTML("afterend", topNavHTML(navKey));
      oldDesktop.remove();
    } else if (!app.querySelector(".mp-topnav")) {
      const header = app.querySelector(".app-header");
      if (header) header.insertAdjacentHTML("afterend", topNavHTML(navKey));
    } else {
      app.querySelectorAll(".mp-topnav-item").forEach((btn, i) => {
        btn.classList.toggle("active", TOPNAV_ITEMS[i].key === navKey);
      });
    }

    const bottom = app.querySelector(".bottom-nav");
    if (bottom) {
      bottom.outerHTML = bottomNavHTML(navKey);
    } else {
      app.insertAdjacentHTML("beforeend", bottomNavHTML(navKey));
    }
  }

  function upgradeApp(app, screenId) {
    if (app.classList.contains("login-gate-app")) return;
    app.classList.add("mp-shell");
    upgradeHeader(app);
    upgradeNav(app, screenId);
  }

  function syncDashboardClubState(sport) {
    const dash = document.getElementById("screen-home-dashboard");
    if (!dash) return;
    const hasClub = sport !== "pickleball";
    dash.querySelectorAll("[data-show-if-club]").forEach((el) => {
      el.hidden = !hasClub;
    });
    dash.querySelectorAll("[data-show-if-no-club]").forEach((el) => {
      el.hidden = hasClub;
    });
  }

  function init() {
    document.querySelectorAll(".screen").forEach((screen) => {
      const app = screen.querySelector(".app");
      if (app) upgradeApp(app, screen.id.replace("screen-", ""));
    });

    if (window.MP_Sport) {
      syncDashboardClubState(MP_Sport.get());
      window.addEventListener("mp:sport", (e) => {
        syncDashboardClubState(e.detail.sport);
      });
    }

    if (window.MP_Mascot) MP_Mascot.initAll();
    if (window.MP_I18N) MP_I18N.apply(MP_I18N.getLang());
  }

  return { init, upgradeApp, syncDashboardClubState };
})();
