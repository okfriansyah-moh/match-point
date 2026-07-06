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
    /* Chrome levels per screen:
       - none: login gates (data-no-chrome)
       - immersive: live referee — slim header + sport orb only
       - slim: operational focus (setup, manual bracket) — same slim header
       - full: dashboard, lists, wizards — header actions + section nav */
    function chromeLevel(app) {
      if (
        app.classList.contains("login-gate-app") ||
        app.hasAttribute("data-no-chrome")
      )
        return "none";
      if (app.hasAttribute("data-referee-immersive")) return "immersive";
      if (app.hasAttribute("data-chrome-slim")) return "slim";
      return "full";
    }

    const slimControlsHTML =
      '<button type="button" class="sport-orb" data-i18n-title="sport.switch" title="Ganti olahraga"><span data-sport-icon>🏓</span></button>';

    function injectChrome() {
      const chromeProfile = config.chromeProfile || {
        name: "Budi Santoso",
        handle: "@budisantoso",
        avatar: "🧑🏽",
        title: "Budi Santoso",
      };

      const NAV_ITEMS = (
        config.navItems || [
          { key: "home", i18n: "nav.home", icon: "🏠" },
          { key: "rank", i18n: "nav.rank", icon: "🏆" },
          { key: "match", i18n: "nav.play", icon: "➕", auth: true },
          { key: "events", i18n: "nav.events", icon: "🎯" },
          { key: "community", i18n: "nav.group.community", icon: "👥" },
        ]
      ).filter(
        (it) =>
          NAV_STEP[it.key] !== undefined ||
          (config.navRedirect && config.navRedirect[it.key]),
      );

      const sportOrbHTML =
        config.chromeSport !== false
          ? '<button type="button" class="sport-orb" data-i18n-title="sport.switch" title="Ganti olahraga"><span data-sport-icon>🏓</span></button>'
          : "";

      const controlsHTML =
        '<div class="notif-wrap">' +
        '<button type="button" class="icon-btn" data-auth-only data-notif-toggle data-i18n-title="chrome.notifications" title="Notifikasi">🔔</button>' +
        '<div class="notif-panel" hidden><div class="notif-panel-head"><strong data-i18n="notif.title">Notifikasi</strong></div>' +
        '<div class="notif-item"><span>🏆</span><div><strong>Rank Mabar updated</strong><small>+15 pts dari Americano</small></div></div>' +
        '<div class="notif-item"><span>🎯</span><div><strong>Acara besok</strong><small>Minggu Mexicano · 08:00</small></div></div>' +
        '<div class="notif-item"><span>👥</span><div><strong>Komunitas disetujui</strong><small>Padel Jakarta Selatan aktif</small></div></div></div></div>' +
        sportOrbHTML +
        '<div class="profile-menu-wrap">' +
        '<button type="button" class="avatar avatar-sm avatar-photo" data-profile-toggle aria-haspopup="true" title="' +
        chromeProfile.title +
        '">' +
        chromeProfile.avatar +
        "</button>" +
        '<div class="profile-menu" hidden>' +
        '<div class="profile-menu-head"><strong>' +
        chromeProfile.name +
        "</strong><span>" +
        chromeProfile.handle +
        "</span></div>" +
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
        const level = chromeLevel(app);
        if (level === "none") return;

        app.dataset.chromeLevel = level;
        const header = app.querySelector(".app-header");

        if (level === "full") {
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
          return;
        }

        app.classList.add(
          level === "immersive" ? "chrome-immersive" : "chrome-slim",
        );
        if (header && !header.querySelector(".sport-orb")) {
          let actions = header.querySelector(".app-header-actions");
          if (!actions) {
            actions = document.createElement("div");
            actions.className = "app-header-actions app-header-actions-slim";
            header.appendChild(actions);
          }
          actions.insertAdjacentHTML("beforeend", slimControlsHTML);
        }
      });
    }

    function syncActiveChrome() {
      const activeApp = document.querySelector(".flow-step.active .app");
      document.body.classList.remove("mp-chrome-slim", "mp-chrome-immersive");
      if (!activeApp) return;
      const level = chromeLevel(activeApp);
      if (level === "immersive") document.body.classList.add("mp-chrome-immersive");
      else if (level === "slim") document.body.classList.add("mp-chrome-slim");
    }

    const REFEREE_DEMOS = {
      americano: {
        format: "americano",
        eventType: "americano",
        name: "Americano Night",
        capacity: 8,
        scoring: "race_to_n",
        raceTo: 24,
      },
      mexicano: {
        format: "mexicano",
        eventType: "mexicano",
        name: "Mexicano Session",
        capacity: 8,
        scoring: "race_to_n",
        raceTo: 24,
      },
      singles_rr: {
        format: "round_robin",
        eventType: "singles",
        category: "singles_men",
        division: "men",
        structure: "round_robin",
        name: "Men's Singles RR",
        capacity: 6,
        scoring: "normal_sets",
        bestOf: 3,
      },
      doubles_league: {
        format: "league",
        eventType: "doubles",
        category: "mixed",
        division: "mixed",
        structure: "league",
        name: "Mixed Doubles League",
        capacity: 8,
        scoring: "normal_sets",
        bestOf: 3,
      },
    };

    function seedRefereeDemo(kind) {
      if (!window.MP_Tournament || !REFEREE_DEMOS[kind]) return;
      const ev = MP_Tournament.get();
      if (ev?.demoKind === kind) return;
      MP_Tournament.createEvent({ ...REFEREE_DEMOS[kind], demoKind: kind });
      MP_Tournament.generateSchedule();
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
        !guest &&
        window.MP_Role &&
        MP_Role.isMemberOf
          ? MP_Role.isMemberOf(name)
          : !guest && role.status === "active" && role.clubName === name;
      document.querySelectorAll("[data-show-if-member-of]").forEach((el) => {
        el.hidden = !memberOf(el.dataset.showIfMemberOf);
      });
      document.querySelectorAll("[data-hide-if-member-of]").forEach((el) => {
        el.hidden = memberOf(el.dataset.hideIfMemberOf);
      });

      syncBottomNav(current);
      syncActiveChrome();

      if (window.MP_Communities) {
        document.querySelectorAll("[data-community-page]").forEach((el) => {
          MP_Communities.applyCommunityPage(el);
        });
      }
      if (window.MP_Rank) MP_Rank.applyDOM();
      if (window.MP_Tournament) MP_Tournament.init();

      if (window.MP_Tournament) {
        const activeReferee = document.querySelector(".flow-step.active [data-referee-live]");
        if (activeReferee) {
          const demo = activeReferee.dataset.refereeDemo;
          if (demo) seedRefereeDemo(demo);
          const ev = MP_Tournament.get();
          if (ev && !ev.sessionReady) MP_Tournament.generateSchedule();
        }
      }

      if (window.MP_Referee) {
        if (current === 8 && window.MP_EventWizard && window.MP_Tournament) {
          const w = MP_EventWizard.get();
          const ev = MP_Tournament.get();
          if (w.roster?.length && ev) {
            MP_Tournament.configureSession({
              name: ev.name || MP_EventWizard.suggestedName(),
              playerNames: w.roster.map((p) => p.name),
            });
          }
        }
        const activeRefereeLive = document.querySelector(".flow-step.active [data-referee-live]");
        if (activeRefereeLive) MP_Referee.resetLiveView();
        else MP_Referee.applyAll();
      }

      if (window.MP_EventWizard) {
        window.__wizardFlowIdx = current;
        MP_EventWizard.applyUI(current);
      }

      if (window.MP_PlatformApproval) {
        MP_PlatformApproval.onStep(current);
      }

      if (current === 2 || current === 3 || current === 4 || current === 5) {
        const inboxRoot = document.querySelector("[data-platform-inbox]");
        const matchRoot = document.querySelector("[data-platform-matches]");
        if (inboxRoot && window.MP_PlatformLists) MP_PlatformLists.renderInbox(inboxRoot);
        if (matchRoot && window.MP_PlatformLists) MP_PlatformLists.renderMatches(matchRoot);
      }

      if (current === 1 && window.MP_PlatformLists?.updateDashboardStats) {
        MP_PlatformLists.updateDashboardStats();
      }

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

    function mapWizardStep(idx) {
      if (config.wizardStepMap && config.wizardStepMap[idx] != null)
        return config.wizardStepMap[idx];
      return idx;
    }

    function go(n, opts) {
      opts = opts || {};
      closeMenus();
      const prev = current;
      if (n === 1 && prev === 0 && window.MP_EventWizard) MP_EventWizard.reset();
      const wizardEntry = config.wizardStepMap?.[1];
      if (
        wizardEntry != null &&
        n === wizardEntry &&
        prev !== wizardEntry &&
        window.MP_EventWizard
      )
        MP_EventWizard.reset();
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

      const notifToggle = e.target.closest("[data-notif-toggle]");
      if (notifToggle) {
        e.preventDefault();
        const panel = notifToggle.parentElement.querySelector(".notif-panel");
        if (panel) panel.hidden = !panel.hidden;
        return;
      }

      // Settings → edit profile step when configured
      const settingsEl = e.target.closest("[data-menu-settings]");
      if (settingsEl) {
        e.preventDefault();
        closeMenus();
        if (config.settingsStep != null) go(config.settingsStep, { toast: false });
        else showToast(i18n.t("menu.settingsToast"));
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

      const rejectClubEl = e.target.closest("[data-club-reject]");
      if (rejectClubEl && window.MP_Role) {
        e.preventDefault();
        MP_Role.rejectClub("Nama tidak memenuhi pedoman komunitas.");
        showToast(i18n.t("club.rejectedToast"));
        return;
      }

      const resubmitEl = e.target.closest("[data-club-resubmit]");
      if (resubmitEl && window.MP_Role) {
        e.preventDefault();
        MP_Role.resubmitClub();
        showToast(i18n.t("club.resubmitToast"));
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

      const communityViewEl = e.target.closest("[data-community-view]");
      if (communityViewEl && window.MP_Communities) {
        e.preventDefault();
        MP_Communities.setView(communityViewEl.dataset.communityView);
        const next = parseInt(communityViewEl.dataset.flowGoto || "15", 10);
        go(next, { toast: false });
        return;
      }

      const wizardTypeEl = e.target.closest("[data-wizard-pick-type]");
      if (wizardTypeEl && window.MP_EventWizard) {
        e.preventDefault();
        MP_EventWizard.set({
          eventType: wizardTypeEl.dataset.wizardPickType,
          division: "",
          structure: "",
        });
        go(mapWizardStep(MP_EventWizard.stepAfterType()), { toast: false });
        return;
      }

      const wizardDivEl = e.target.closest("[data-wizard-pick-division]");
      if (wizardDivEl && window.MP_EventWizard) {
        e.preventDefault();
        MP_EventWizard.set({ division: wizardDivEl.dataset.wizardPickDivision });
        return;
      }

      const wizardNextEl = e.target.closest("[data-wizard-next]");
      if (wizardNextEl && window.MP_EventWizard) {
        e.preventDefault();
        const state = MP_EventWizard.get();
        const next = parseInt(wizardNextEl.dataset.wizardNext, 10);
        if (next === 3 && MP_EventWizard.isCompetitive() && !state.division) {
          showToast(i18n.t("wizard.pickDivision"));
          return;
        }
        if (next === 5 && MP_EventWizard.isCompetitive() && !state.structure) {
          showToast(i18n.t("wizard.pickStructure"));
          return;
        }
        if (!isNaN(next)) go(mapWizardStep(next), { toast: false });
        return;
      }

      const wizardPartEl = e.target.closest("[data-wizard-pick-participants]");
      if (wizardPartEl && window.MP_EventWizard) {
        e.preventDefault();
        MP_EventWizard.set({
          participants: parseInt(wizardPartEl.dataset.wizardPickParticipants, 10),
        });
        return;
      }

      const wizardNextPartEl = e.target.closest("[data-wizard-next-participants]");
      if (wizardNextPartEl && window.MP_EventWizard) {
        e.preventDefault();
        const input = document.querySelector("[data-wizard-participants-input]");
        const n = parseInt(input?.value, 10) || MP_EventWizard.get().participants;
        MP_EventWizard.set({ participants: n });
        go(mapWizardStep(MP_EventWizard.stepAfterParticipants()), { toast: false });
        return;
      }

      const wizardStructEl = e.target.closest("[data-wizard-pick-structure]");
      if (wizardStructEl && window.MP_EventWizard) {
        e.preventDefault();
        MP_EventWizard.set({ structure: wizardStructEl.dataset.wizardPickStructure });
        return;
      }

      const wizardBackEl = e.target.closest("[data-wizard-back]");
      if (wizardBackEl && window.MP_EventWizard) {
        e.preventDefault();
        go(mapWizardStep(MP_EventWizard.wizardBackTarget(wizardBackEl.dataset.wizardBack)), {
          toast: false,
        });
        return;
      }

      const rosterFilterEl = e.target.closest("[data-wizard-roster-filter]");
      if (rosterFilterEl && window.MP_EventWizard) {
        e.preventDefault();
        MP_EventWizard.set({ rosterFilter: rosterFilterEl.dataset.wizardRosterFilter });
        return;
      }

      const rosterAddEl = e.target.closest("[data-wizard-roster-add]");
      if (rosterAddEl && window.MP_EventWizard) {
        e.preventDefault();
        const player = MP_EventWizard.getPlayerById(rosterAddEl.dataset.wizardRosterAdd);
        if (!player) return;
        const state = MP_EventWizard.get();
        if (state.roster.length >= state.participants) {
          showToast(i18n.t("wizard.rosterFull"));
          return;
        }
        MP_EventWizard.addToRoster(player);
        showToast(i18n.t("wizard.rosterAdded"));
        return;
      }

      const rosterRemoveEl = e.target.closest("[data-wizard-roster-remove]");
      if (rosterRemoveEl && window.MP_EventWizard) {
        e.preventDefault();
        MP_EventWizard.removeFromRoster(rosterRemoveEl.dataset.wizardRosterRemove);
        return;
      }

      const rosterGuestEl = e.target.closest("[data-wizard-roster-add-guest]");
      if (rosterGuestEl && window.MP_EventWizard) {
        e.preventDefault();
        const input = document.querySelector("[data-wizard-roster-guest-name]");
        const name = input?.value?.trim();
        if (!name) {
          showToast(i18n.t("wizard.rosterGuestRequired"));
          return;
        }
        const state = MP_EventWizard.get();
        if (state.roster.length >= state.participants) {
          showToast(i18n.t("wizard.rosterFull"));
          return;
        }
        MP_EventWizard.addGuestName(name);
        if (input) input.value = "";
        showToast(i18n.t("wizard.rosterAdded"));
        return;
      }

      const rosterSkipEl = e.target.closest("[data-wizard-roster-skip]");
      if (rosterSkipEl && window.MP_EventWizard) {
        e.preventDefault();
        go(parseInt(rosterSkipEl.dataset.flowGoto || "6", 10), { toast: false });
        return;
      }

      const formatEl = e.target.closest("[data-pick-format]");
      if (formatEl) {
        e.preventDefault();
        const fmt = formatEl.dataset.pickFormat;
        try {
          sessionStorage.setItem("mp-pick-format", fmt);
        } catch (_) {
          /* no-op */
        }
        if (formatEl.hasAttribute("data-publish-event") && window.MP_Tournament) {
          const form = formatEl.closest(".app-body") || document;
          const name = form.querySelector("[data-event-name]")?.value || "League Season";
          MP_Tournament.createEvent({ format: fmt, name, category: "doubles", scoring: "normal_sets", capacity: 8 });
          showToast(i18n.t("league.generateBtn"));
        } else {
          showToast(MP_Tournament?.FORMATS?.find((f) => f.id === fmt)?.label || fmt);
        }
        const next = parseInt(formatEl.dataset.flowGoto || "2", 10);
        if (!isNaN(next)) go(next, { toast: false });
        return;
      }

      const finalizeEl = e.target.closest("[data-event-finalize]");
      if (finalizeEl && window.MP_Tournament) {
        e.preventDefault();
        MP_Tournament.finalize({ delta: 20, mabarBonus: 5 });
        showToast(i18n.t("rank.finalizeToast"));
        const next = parseInt(finalizeEl.dataset.flowGoto, 10);
        if (!isNaN(next)) go(next, { toast: false });
        return;
      }

      const advanceRoundEl = e.target.closest("[data-advance-round]");
      if (advanceRoundEl && window.MP_Tournament) {
        e.preventDefault();
        MP_Tournament.advanceRound();
        MP_Tournament.init();
        if (window.MP_Referee) MP_Referee.applyAll();
        showToast(i18n.t("tournament.roundAdvanced"));
        return;
      }

      const refereeGenEl = e.target.closest("[data-referee-generate]");
      if (refereeGenEl && window.MP_Tournament && window.MP_Referee) {
        e.preventDefault();
        const form =
          refereeGenEl.closest("[data-referee-setup-form]") ||
          document.querySelector("[data-referee-setup-form]");
        const opts = MP_Referee.collectSetup(form);
        MP_Tournament.configureSession(opts);
        MP_Tournament.generateSchedule();
        MP_Referee.applyAll();
        showToast(i18n.t("referee.generateBtn"));
        const next = parseInt(refereeGenEl.dataset.flowGoto, 10);
        if (!isNaN(next)) go(next, { toast: false });
        return;
      }

      const courtPlusEl = e.target.closest("[data-referee-court-plus]");
      if (courtPlusEl && window.MP_Tournament) {
        e.preventDefault();
        MP_Tournament.addCourt();
        MP_Referee.applyAll();
        return;
      }

      const courtMinusEl = e.target.closest("[data-referee-court-minus]");
      if (courtMinusEl && window.MP_Tournament) {
        e.preventDefault();
        MP_Tournament.removeCourt();
        MP_Referee.applyAll();
        return;
      }

      const refereeTabEl = e.target.closest("[data-referee-tab]");
      if (refereeTabEl && window.MP_Referee) {
        e.preventDefault();
        const tab = refereeTabEl.dataset.refereeTab;
        const matchId = refereeTabEl.dataset.refereeSelectMatch;
        if (matchId) MP_Referee.selectMatch(matchId);
        else MP_Referee.setTab(tab);
        return;
      }

      const fsOpenEl = e.target.closest("[data-referee-fs-open]");
      if (fsOpenEl && window.MP_Referee) {
        e.preventDefault();
        e.stopPropagation();
        MP_Referee.openFullscreen(fsOpenEl.dataset.refereeFsOpen);
        return;
      }

      const selectMatchEl = e.target.closest("[data-referee-select-match]");
      if (selectMatchEl && window.MP_Referee && !e.target.closest("button[data-referee-fs-open]")) {
        e.preventDefault();
        MP_Referee.selectMatch(selectMatchEl.dataset.refereeSelectMatch);
        return;
      }

      const bumpScoreEl = e.target.closest("[data-referee-bump-score]");
      if (bumpScoreEl && window.MP_Tournament) {
        e.preventDefault();
        const id = bumpScoreEl.dataset.refereeBumpScore;
        const side = parseInt(bumpScoreEl.dataset.side, 10);
        const delta = parseInt(bumpScoreEl.dataset.delta, 10);
        if (delta > 0) {
          MP_Tournament.bumpMatchScore(id, side, delta);
        } else {
          const m = MP_Tournament.findMatch(id);
          if (m) {
            const cur = side === 1 ? m.score1 || 0 : m.score2 || 0;
            MP_Tournament.setMatchScoreSide(id, side, Math.max(0, cur + delta));
          }
        }
        MP_Referee.applyAll();
        return;
      }

      const setScoreEl = e.target.closest("[data-referee-set-score]");
      if (setScoreEl && window.MP_Tournament) {
        e.preventDefault();
        const id = setScoreEl.dataset.refereeSetScore;
        const side = parseInt(setScoreEl.dataset.refereeSide, 10);
        const val = parseInt(setScoreEl.dataset.refereeValue, 10);
        MP_Tournament.setMatchScoreSide(id, side, val);
        MP_Referee.applyAll();
        return;
      }

      const confirmScoreEl = e.target.closest("[data-referee-confirm-score]");
      if (confirmScoreEl && window.MP_Tournament) {
        e.preventDefault();
        MP_Tournament.confirmMatchScore(confirmScoreEl.dataset.refereeConfirmScore);
        MP_Referee.closeFullscreen();
        MP_Referee.applyAll();
        showToast(i18n.t("referee.scoreSaved"));
        return;
      }

      const fsCloseEl = e.target.closest("[data-referee-fs-close]");
      if (fsCloseEl && window.MP_Referee) {
        e.preventDefault();
        MP_Referee.closeFullscreen();
        MP_Referee.applyAll();
        return;
      }

      const fsBumpEl = e.target.closest("[data-referee-fs-bump]");
      if (fsBumpEl && window.MP_Tournament) {
        e.preventDefault();
        MP_Tournament.bumpMatchScore(fsBumpEl.dataset.refereeFsBump, parseInt(fsBumpEl.dataset.side, 10), 1);
        MP_Referee.applyAll();
        return;
      }

      const fsAddEl = e.target.closest("[data-referee-fs-add]");
      if (fsAddEl && window.MP_Tournament) {
        e.preventDefault();
        MP_Tournament.bumpMatchScore(
          fsAddEl.dataset.refereeFsAdd,
          parseInt(fsAddEl.dataset.side, 10),
          parseInt(fsAddEl.dataset.add, 10),
        );
        MP_Referee.applyAll();
        return;
      }

      const copyLinkEl = e.target.closest("[data-referee-copy-link]");
      if (copyLinkEl) {
        e.preventDefault();
        const input = document.querySelector("[data-referee-share-url]");
        if (input?.value) {
          navigator.clipboard?.writeText(input.value).catch(() => {});
          showToast(i18n.t("referee.copyBtn"));
        }
        return;
      }

      const playerEl = e.target.closest("[data-player-profile]");
      if (playerEl && config.playerStep != null) {
        e.preventDefault();
        try {
          sessionStorage.setItem("mp-view-player", playerEl.dataset.playerProfile || "Rudi Hartono");
        } catch (_) {
          /* no-op */
        }
        go(config.playerStep, { toast: false });
        return;
      }

      const publishEl = e.target.closest("[data-publish-event]");
      if (publishEl && window.MP_Tournament) {
        e.preventDefault();
        const form = publishEl.closest(".app-body") || document;
        let fmt = "americano";
        let name = "Community Event";
        let category = "doubles";
        let scoring = "race_to_n";
        let raceTo = 24;
        let bestOf = 3;
        let eventType = "";
        let structure = "";
        let division = "";
        let roster = [];
        let capacity;
        if (window.MP_EventWizard && MP_EventWizard.get().eventType) {
          const opts = MP_EventWizard.toTournamentOpts(form);
          fmt = opts.format;
          name = opts.name;
          category = opts.category;
          scoring = opts.scoring;
          raceTo = opts.raceTo;
          bestOf = opts.bestOf;
          eventType = opts.eventType;
          structure = opts.structure;
          division = opts.division;
          roster = opts.roster || [];
          capacity = opts.capacity;
        } else {
          try {
            fmt = sessionStorage.getItem("mp-pick-format") || fmt;
          } catch (_) {
            /* no-op */
          }
          name = form.querySelector("[data-event-name]")?.value || name;
          category = form.querySelector("[data-event-category]")?.value || category;
          scoring =
            form.querySelector("[data-event-scoring]")?.value ||
            MP_Tournament.defaultScoringForFormat(fmt);
          raceTo = parseInt(form.querySelector("[data-event-race-to]")?.value, 10) || raceTo;
          bestOf = parseInt(form.querySelector("[data-event-best-of]")?.value, 10) || bestOf;
        }
        const tierText = form.querySelector("[data-event-tier]")?.value || "";
        let tier = null;
        if (tierText.includes("Tier 1")) tier = 1;
        else if (tierText.includes("Tier 2")) tier = 2;
        else if (tierText.includes("Tier 3")) tier = 3;
        const isGlobal = Boolean(form.querySelector("[data-event-tier]"));
        const scope = isGlobal || tier ? "global" : "community";
        MP_Tournament.createEvent({
          format: fmt,
          name,
          category,
          eventType,
          structure,
          division,
          scoring,
          raceTo,
          bestOf,
          tier,
          scope,
          rankTarget: tier ? "global" : "mabar",
          capacity: capacity ?? (window.MP_EventWizard ? MP_EventWizard.get().participants : undefined),
          roster,
        });
        showToast(i18n.t("flow.publishBtn"));
        const next = parseInt(publishEl.dataset.flowGoto, 10);
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
        if (backEl.dataset.flowBack === "smart") {
          const target = guest && NAV_STEP.home !== undefined ? NAV_STEP.home : current - 1;
          go(Math.max(0, target), { toast: false });
          return;
        }
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

    if (config.wizardStepMap) {
      window.__wizardStepMapRev = {};
      Object.keys(config.wizardStepMap).forEach((k) => {
        window.__wizardStepMapRev[config.wizardStepMap[k]] = parseInt(k, 10);
      });
    }

    if (config.appChrome) injectChrome();

    i18n.apply(i18n.getLang());
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === i18n.getLang());
    });

    if (window.MP_Device) MP_Device.init();
    if (window.MP_Sport) MP_Sport.init();
    if (window.MP_Approval) MP_Approval.init();
    if (window.MP_Rank) MP_Rank.init();
    if (window.MP_Tournament) MP_Tournament.init();
    if (window.MP_Role) MP_Role.init();
    if (window.MP_Communities) {
      MP_Communities.init();
      document.querySelectorAll("[data-find-community]").forEach((el) => {
        MP_Communities.initFilters(el);
      });
    }

    window.addEventListener("mp:role", updateUI);

    const urlStep = parseInt(
      new URLSearchParams(location.search).get("step"),
      10,
    );
    if (guest && config.guestStartStep != null)
      go(config.guestStartStep, { toast: false });
    else if (!isNaN(urlStep) && isAuthed()) go(urlStep, { toast: false });
    else if (isAuthed()) {
      const landing =
        config.authedStartStep ??
        NAV_STEP.home ??
        NAV_STEP.dashboard;
      if (landing !== undefined) go(landing, { toast: false });
      else go(0, { toast: false });
    }
    else go(0, { toast: false });
    updateUI();
  }

  return {
    init,
    go: (n) => goFn && goFn(n),
    setGuest: (v) => setGuestFn && setGuestFn(v),
  };
})();
