/* Match Point — natural interactive flow (immersive, multi-sport) */
window.MP_Flow = (function () {
  const i18n = window.MP_I18N;
  let goFn = null;
  let setGuestFn = null;

  function init(config) {
    const steps = config.steps;
    // Map nav keys to the first step that declares them — stays correct
    // when steps are added or reordered.
    const NAV_STEP = {};
    steps.forEach((s, i) => {
      if (s.nav && NAV_STEP[s.nav] === undefined) NAV_STEP[s.nav] = i;
    });
    let current = 0;
    let guest =
      config.guest || new URLSearchParams(location.search).get("guest") === "1";

    const stepEls = document.querySelectorAll(".flow-step");
    const progressBar = document.getElementById("flow-progress-bar");
    const guestBanner = document.getElementById("guest-banner");
    const modal = document.getElementById("auth-modal");
    const toast = document.getElementById("flow-toast");
    const previewFab = document.getElementById("flow-preview-fab");
    const previewPanel = document.getElementById("flow-preview-panel");
    const previewClose = document.getElementById("flow-preview-close");

    function showToast(msg) {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add("show");
      clearTimeout(showToast._t);
      showToast._t = setTimeout(() => toast.classList.remove("show"), 2800);
    }

    // Session persists across pages (user.html ↔ club.html) so navigating
    // back never dumps a signed-in user on the login gate.
    function isAuthed() {
      try {
        return localStorage.getItem("mp-auth") === "1";
      } catch (_) {
        return false;
      }
    }

    function setAuthed(v) {
      try {
        if (v) localStorage.setItem("mp-auth", "1");
        else localStorage.removeItem("mp-auth");
      } catch (_) {
        /* no-op */
      }
    }

    function syncBottomNav(stepIndex) {
      const step = steps[stepIndex];
      const navKey = step && step.nav;
      document
        .querySelectorAll(
          ".bottom-nav-item, .app-nav-desktop-item, .mp-topnav-item",
        )
        .forEach((el) => {
          const key = el.dataset.nav;
          el.classList.toggle("active", navKey && key === navKey);
        });
    }

    function closeMenus() {
      document.querySelectorAll(".profile-menu").forEach((m) => {
        m.hidden = true;
      });
    }

    /* One global chrome on every screen (except login gates):
       - header right: 🔔 bell · sport orb · avatar dropdown — identical everywhere
       - web/tablet: persistent centered section tabs (.mp-topnav)
       - mobile: frozen bottom nav with the same sections
       Profile lives in the avatar dropdown on all devices. */
    function injectChrome() {
      const NAV_ITEMS = [
        { key: "home", i18n: "nav.home", icon: "🏠" },
        { key: "rank", i18n: "nav.rank", icon: "🏆" },
        { key: "match", i18n: "nav.play", icon: "➕", auth: true },
        { key: "events", i18n: "nav.events", icon: "🎯" },
        { key: "community", i18n: "nav.group.community", icon: "👥" },
      ].filter(
        (it) =>
          NAV_STEP[it.key] !== undefined ||
          (config.navRedirect && config.navRedirect[it.key]),
      );

      const controlsHTML =
        '<button type="button" class="icon-btn" data-auth-only data-i18n-title="chrome.notifications" title="Notifikasi">🔔</button>' +
        '<button type="button" class="sport-orb" data-i18n-title="sport.switch" title="Ganti olahraga"><span data-sport-icon>🏓</span></button>' +
        '<div class="profile-menu-wrap">' +
        '<button type="button" class="avatar avatar-sm avatar-photo" data-profile-toggle aria-haspopup="true" title="Budi Santoso">🧑🏽</button>' +
        '<div class="profile-menu" hidden>' +
        '<div class="profile-menu-head"><strong>Budi Santoso</strong><span>@budisantoso</span></div>' +
        '<button type="button" class="profile-menu-item" data-nav="profile" data-i18n="menu.viewProfile">Lihat Profil</button>' +
        '<button type="button" class="profile-menu-item" data-menu-settings data-i18n="menu.settings">Akun &amp; Pengaturan</button>' +
        '<div class="profile-menu-divider"></div>' +
        '<div class="profile-menu-row"><span data-i18n="menu.language">Language</span>' +
        '<div class="lang-toggle"><button type="button" class="lang-btn" data-lang="id">ID</button>' +
        '<button type="button" class="lang-btn active" data-lang="en">EN</button></div></div>' +
        '<button type="button" class="profile-menu-item" data-theme-toggle>' +
        '<span data-theme-icon>🌙</span> <span data-theme-label data-i18n="theme.toDark">Dark Mode</span></button>' +
        '<div class="profile-menu-divider"></div>' +
        '<button type="button" class="profile-menu-item danger" data-menu-logout data-i18n="flow.logout">Keluar</button>' +
        "</div></div>";

      document.querySelectorAll(".flow-step .app").forEach((app) => {
        // Auth screens (login gate, sign-up, OTP) get no app chrome
        if (
          app.classList.contains("login-gate-app") ||
          app.hasAttribute("data-no-chrome")
        )
          return;

        const header = app.querySelector(".app-header");
        if (header && !header.querySelector(".profile-menu-wrap")) {
          let actions = header.querySelector(".app-header-actions");
          if (!actions) {
            actions = document.createElement("div");
            actions.className = "app-header-actions";
            header.appendChild(actions);
          }
          actions.insertAdjacentHTML("beforeend", controlsHTML);
        }

        if (NAV_ITEMS.length && !app.querySelector(".mp-topnav")) {
          const nav = document.createElement("nav");
          nav.className = "mp-topnav";
          nav.innerHTML = NAV_ITEMS.map(
            (it) =>
              '<button type="button" class="mp-topnav-item"' +
              (it.auth ? " data-requires-auth" : "") +
              ' data-nav="' +
              it.key +
              '" data-i18n="' +
              it.i18n +
              '"></button>',
          ).join("");
          if (header) header.insertAdjacentElement("afterend", nav);
          else app.prepend(nav);
        }

        if (NAV_ITEMS.length && !app.querySelector(".bottom-nav")) {
          const bn = document.createElement("nav");
          bn.className = "bottom-nav";
          bn.innerHTML = NAV_ITEMS.map(
            (it) =>
              '<button type="button" class="bottom-nav-item"' +
              (it.auth ? " data-requires-auth" : "") +
              ' data-nav="' +
              it.key +
              '"><span>' +
              it.icon +
              '</span><span data-i18n="' +
              it.i18n +
              '"></span></button>',
          ).join("");
          app.appendChild(bn);
        }
      });
    }

    function updateUI() {
      stepEls.forEach((el, i) => el.classList.toggle("active", i === current));
      const pct = ((current + 1) / steps.length) * 100;
      if (progressBar) progressBar.style.width = pct + "%";

      if (guestBanner) {
        guestBanner.style.display = guest && current > 0 ? "flex" : "none";
        if (guest) {
          const loginBtn = guestBanner.querySelector("[data-guest-login]");
          if (loginBtn)
            loginBtn.style.display = current === 0 ? "none" : "inline-flex";
        }
      }

      document.querySelectorAll("[data-requires-auth]").forEach((el) => {
        el.classList.toggle("guest-locked", guest);
      });

      // Identity control only makes sense when signed in
      document.querySelectorAll(".profile-menu-wrap").forEach((el) => {
        el.hidden = guest;
      });

      // Guest vs signed-in content split
      document.body.classList.toggle("mp-guest", guest);
      // Guests are never community members, whatever role state is stored —
      // runs after MP_Role.apply() (this fn is the mp:role listener) so it wins.
      if (guest) {
        document
          .querySelectorAll(
            "[data-show-if-club], [data-show-if-club-pending], [data-show-if-club-admin]",
          )
          .forEach((el) => {
            el.hidden = true;
          });
        document.querySelectorAll("[data-show-if-no-club]").forEach((el) => {
          el.hidden = false;
        });
      }
      // Auth/guest gates run last so they win over role-based visibility
      document.querySelectorAll("[data-auth-only]").forEach((el) => {
        el.hidden = guest;
      });
      document.querySelectorAll("[data-guest-only]").forEach((el) => {
        el.hidden = !guest;
      });

      // Per-community access: content marked with a community name is only
      // visible to members of THAT community (public/private data split)
      const role =
        window.MP_Role && MP_Role.get
          ? MP_Role.get()
          : { status: "none", clubName: "" };
      const memberOf = (name) =>
        !guest && role.status === "active" && role.clubName === name;
      document.querySelectorAll("[data-show-if-member-of]").forEach((el) => {
        el.hidden = !memberOf(el.dataset.showIfMemberOf);
      });
      document.querySelectorAll("[data-hide-if-member-of]").forEach((el) => {
        el.hidden = memberOf(el.dataset.hideIfMemberOf);
      });

      syncBottomNav(current);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function showAuthModal() {
      if (modal) modal.classList.add("open");
    }

    function hideAuthModal() {
      if (modal) modal.classList.remove("open");
    }

    function login() {
      guest = false;
      setAuthed(true);
      hideAuthModal();
      if (guestBanner) guestBanner.style.display = "none";
      // Player journey starts fresh; admin journeys keep role state intact
      if (window.MP_Role && config.resetRoleOnLogin !== false)
        MP_Role.clearClub();
      showToast(i18n.t("flow.toast.login"));
      updateUI();
    }

    function go(n, opts) {
      opts = opts || {};
      closeMenus();
      const prev = current;
      current = Math.max(0, Math.min(steps.length - 1, n));
      if (current !== prev && opts.toast !== false) {
        const hint = steps[current].hintKey
          ? i18n.t(steps[current].hintKey)
          : i18n.t(steps[current].titleKey);
        showToast(hint);
      }
      updateUI();
    }

    goFn = go;
    setGuestFn = function (v) {
      guest = v;
      updateUI();
    };

    document.body.addEventListener("click", (e) => {
      const authTarget = e.target.closest("[data-requires-auth]");
      if (authTarget && guest) {
        e.preventDefault();
        e.stopPropagation();
        showAuthModal();
        return;
      }

      // Any "sign in" CTA shown while browsing as guest → back to login gate
      const guestLoginEl = e.target.closest("[data-guest-login]");
      if (guestLoginEl) {
        e.preventDefault();
        go(0, { toast: false });
        return;
      }

      // Profile dropdown toggle
      const profToggle = e.target.closest("[data-profile-toggle]");
      if (profToggle) {
        e.preventDefault();
        const menu = profToggle.parentElement.querySelector(".profile-menu");
        const wasHidden = menu ? menu.hidden : true;
        closeMenus();
        if (menu) menu.hidden = !wasHidden;
        return;
      }

      // Language switch (delegated — covers buttons injected into the dropdown)
      const langEl = e.target.closest(".lang-btn[data-lang]");
      if (langEl) {
        e.preventDefault();
        i18n.setLang(langEl.dataset.lang);
        return;
      }

      // Light/dark theme toggle
      const themeEl = e.target.closest("[data-theme-toggle]");
      if (themeEl && window.MP_Theme) {
        e.preventDefault();
        MP_Theme.toggle();
        return;
      }

      // Settings (mock) from the profile dropdown
      const settingsEl = e.target.closest("[data-menu-settings]");
      if (settingsEl) {
        e.preventDefault();
        closeMenus();
        showToast(i18n.t("menu.settingsToast"));
        return;
      }

      // Logout from the profile dropdown
      const logoutEl = e.target.closest("[data-menu-logout]");
      if (logoutEl) {
        e.preventDefault();
        closeMenus();
        guest = true;
        setAuthed(false);
        if (window.MP_Role) MP_Role.clearClub();
        // Pages without their own login gate send the user back to the app
        if (config.logoutUrl) {
          location.href = config.logoutUrl;
          return;
        }
        go(0, { toast: false });
        showToast(i18n.t("flow.toast.logout"));
        return;
      }

      // Click outside → close any open dropdown
      if (!e.target.closest(".profile-menu")) {
        closeMenus();
      }

      // Generic tab groups: <div data-tabs><button data-tab="x">…<div data-tab-pane="x">
      const tabEl = e.target.closest("[data-tab]");
      if (tabEl) {
        const root = tabEl.closest("[data-tabs]");
        if (root) {
          e.preventDefault();
          const key = tabEl.dataset.tab;
          root.querySelectorAll("[data-tab]").forEach((t) => {
            t.classList.toggle("active", t === tabEl);
          });
          root.querySelectorAll("[data-tab-pane]").forEach((p) => {
            p.hidden = p.dataset.tabPane !== key;
          });
          return;
        }
      }

      // Generic toggle chips (e.g. sport multi-select on sign-up)
      const togEl = e.target.closest("[data-toggle-active]");
      if (togEl) {
        e.preventDefault();
        togEl.classList.toggle("active");
        return;
      }

      // Generic reveal: show target, optionally hide another element
      const revealEl = e.target.closest("[data-reveal]");
      if (revealEl) {
        e.preventDefault();
        const target = document.querySelector(revealEl.dataset.reveal);
        if (target) target.hidden = false;
        if (revealEl.dataset.hide) {
          const hideEl = document.querySelector(revealEl.dataset.hide);
          if (hideEl) hideEl.hidden = true;
        }
        if (revealEl.dataset.revealToast)
          showToast(i18n.t(revealEl.dataset.revealToast));
        return;
      }

      // Community approval flow (demo): request → pending → approved
      const approveEl = e.target.closest("[data-club-approve]");
      if (approveEl && window.MP_Role) {
        e.preventDefault();
        MP_Role.approveClub();
        showToast(i18n.t("club.approvedToast"));
        const next = parseInt(approveEl.dataset.flowGoto, 10);
        if (!isNaN(next)) go(next, { toast: false });
        return;
      }

      const joinEl = e.target.closest("[data-club-join]");
      if (joinEl && window.MP_Role) {
        e.preventDefault();
        MP_Role.joinClub({ name: joinEl.dataset.clubJoin || "Komunitasku" });
        showToast(i18n.t("club.joinedToast"));
        const next = parseInt(joinEl.dataset.flowGoto, 10);
        if (!isNaN(next)) go(next, { toast: false });
        return;
      }

      const gotoEl = e.target.closest("[data-flow-goto]");
      if (gotoEl) {
        e.preventDefault();
        const idx = parseInt(gotoEl.dataset.flowGoto, 10);
        if (!isNaN(idx)) go(idx);
        return;
      }

      const backEl = e.target.closest("[data-flow-back]");
      if (backEl) {
        e.preventDefault();
        const idx = parseInt(backEl.dataset.flowBack, 10);
        if (!isNaN(idx)) go(idx, { toast: false });
        else go(current - 1, { toast: false });
        return;
      }

      const navEl = e.target.closest(
        ".bottom-nav-item[data-nav], .app-nav-desktop-item[data-nav], .mp-topnav-item[data-nav], .profile-menu-item[data-nav]",
      );
      if (navEl) {
        const key = navEl.dataset.nav;
        if (NAV_STEP[key] !== undefined) {
          e.preventDefault();
          closeMenus();
          go(NAV_STEP[key]);
          return;
        }
        // Section lives on another page (e.g. club admin → player journey)
        if (config.navRedirect && config.navRedirect[key]) {
          e.preventDefault();
          closeMenus();
          location.href = config.navRedirect[key];
          return;
        }
      }

      const loginEl = e.target.closest("[data-login]");
      if (loginEl) {
        e.preventDefault();
        login();
        // data-login-goto: where to land after auth (e.g. OTP verify → home)
        const next = parseInt(loginEl.dataset.loginGoto, 10);
        if (!isNaN(next)) go(next, { toast: false });
        else if (current === 0) go(1);
        return;
      }

      const finishEl = e.target.closest("[data-flow-finish]");
      if (finishEl) {
        e.preventDefault();
        location.href = config.finishUrl || "index.html";
      }
    });

    document.getElementById("modal-login")?.addEventListener("click", () => {
      login();
      go(NAV_STEP.home !== undefined ? NAV_STEP.home : 0, { toast: false });
    });

    document.querySelectorAll("[data-modal-close]").forEach((el) => {
      el.addEventListener("click", hideAuthModal);
    });

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) hideAuthModal();
      });
    }

    document.getElementById("flow-logout")?.addEventListener("click", () => {
      guest = true;
      setAuthed(false);
      if (window.MP_Role) MP_Role.clearClub();
      go(0, { toast: false });
      showToast(i18n.t("flow.toast.logout"));
    });

    // Community creation is approval-gated: submit → pending (platform reviews)
    document
      .getElementById("club-create-btn")
      ?.addEventListener("click", () => {
        const name =
          document.getElementById("club-name-input")?.value ||
          "Padel Jakarta Selatan";
        if (window.MP_Role) MP_Role.requestClub({ name });
        showToast(i18n.t("club.requestedToast"));
        go(1, { toast: false });
      });

    document.getElementById("guest-continue")?.addEventListener("click", () => {
      guest = true;
      // Never "browse" into the login gate itself — land on the first real screen
      const target =
        config.guestStartStep != null && config.guestStartStep > 0
          ? config.guestStartStep
          : 1;
      go(target);
    });

    previewFab?.addEventListener("click", () => {
      previewPanel?.classList.toggle("open");
      previewPanel?.setAttribute(
        "aria-hidden",
        previewPanel.classList.contains("open") ? "false" : "true",
      );
    });
    previewClose?.addEventListener("click", () => {
      previewPanel?.classList.remove("open");
      previewPanel?.setAttribute("aria-hidden", "true");
    });
    document.addEventListener("click", (e) => {
      if (!previewPanel?.classList.contains("open")) return;
      if (
        e.target.closest(".flow-preview-panel") ||
        e.target.closest(".flow-preview-fab")
      )
        return;
      previewPanel.classList.remove("open");
      previewPanel.setAttribute("aria-hidden", "true");
    });
    window.addEventListener("mp:device", () => {
      previewPanel?.classList.remove("open");
      previewPanel?.setAttribute("aria-hidden", "true");
    });

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => i18n.setLang(btn.dataset.lang));
    });

    window.addEventListener("mp:lang", () => {
      document.querySelectorAll(".lang-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.lang === i18n.getLang());
      });
      updateUI();
    });

    if (config.appChrome) injectChrome();

    i18n.apply(i18n.getLang());
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === i18n.getLang());
    });

    if (window.MP_Device) MP_Device.init();
    if (window.MP_Sport) MP_Sport.init();
    if (window.MP_Role) MP_Role.init();

    window.addEventListener("mp:role", updateUI);

    const urlStep = parseInt(
      new URLSearchParams(location.search).get("step"),
      10,
    );
    if (guest && config.guestStartStep != null)
      go(config.guestStartStep, { toast: false });
    else if (!isNaN(urlStep) && isAuthed()) go(urlStep, { toast: false });
    else if (isAuthed() && NAV_STEP.home !== undefined)
      // Returning signed-in session (e.g. back from club admin) skips the gate
      go(NAV_STEP.home, { toast: false });
    else go(0, { toast: false });
    updateUI();
  }

  return {
    init,
    go: (n) => goFn && goFn(n),
    setGuest: (v) => setGuestFn && setGuestFn(v),
  };
})();
