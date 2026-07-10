/* Match Point — event creation wizard state (mockup) */
window.MP_EventWizard = (function () {
  const KEY = "mp-event-wizard";

  const RR_VARIANTS = [
    { id: "full", labelKey: "wizard.rrFull", descKey: "wizard.rrFullDesc" },
    { id: "pools", labelKey: "wizard.rrPools", descKey: "wizard.rrPoolsDesc" },
    { id: "timed", labelKey: "wizard.rrTimed", descKey: "wizard.rrTimedDesc" },
  ];

  const PLAYER_DIR = [
    { id: "p1", name: "Rudi Hartono", source: "community", mabarRank: 1, meta: "Mabar #1" },
    { id: "p2", name: "Sari Wijaya", source: "community", mabarRank: 2, meta: "Mabar #2" },
    { id: "p3", name: "Budi Santoso", source: "community", mabarRank: 12, meta: "Mabar #12" },
    { id: "p4", name: "Dewi Lestari", source: "community", mabarRank: 8, meta: "Mabar #8" },
    { id: "p5", name: "Maya Putri", source: "community", mabarRank: 15, meta: "Mabar #15" },
    { id: "p6", name: "Andi Wijaya", source: "community", mabarRank: 22, meta: "Mabar #22" },
    { id: "p7", name: "Lisa Hartono", source: "community", mabarRank: 31, meta: "Mabar #31" },
    { id: "e1", name: "Alex Chen", source: "external", globalRank: 42, meta: "Global #42 · no community" },
    { id: "e2", name: "Priya Sharma", source: "external", globalRank: 88, meta: "Global #88 · tennis" },
    { id: "e3", name: "Tomás Ruiz", source: "external", globalRank: 120, meta: "Global #120 · padel" },
    { id: "e4", name: "Walk-in guest", source: "external", guest: true, meta: "No account · admin-added" },
  ];

  const BRACKET_IDS = ["open", "beginner", "intermediate", "advanced", "elite"];

  const CLUB_WIZARD_SCREENS = {
    1: "club-wizard-1",
    2: "club-wizard-2",
    3: "club-wizard-3",
    4: "club-wizard-4",
    5: "club-wizard-roster",
    6: "club-wizard-publish",
  };

  const PLATFORM_WIZARD_SCREENS = {
    1: "platform-global-wizard-1",
    2: "platform-global-wizard-2",
    3: "platform-global-wizard-3",
    4: "platform-global-wizard-4",
    5: "platform-global-wizard-5",
    6: "platform-global-wizard-6",
  };

  const WIZARD_SCREEN_IDX = {};
  Object.entries(CLUB_WIZARD_SCREENS).forEach(([k, v]) => {
    WIZARD_SCREEN_IDX[v] = parseInt(k, 10);
  });
  Object.entries(PLATFORM_WIZARD_SCREENS).forEach(([k, v]) => {
    WIZARD_SCREEN_IDX[v] = parseInt(k, 10);
  });

  function defaults() {
    return {
      eventType: "",
      division: "",
      bracketClass: "open",
      participants: 16,
      structure: "",
      rrVariant: "full",
      roster: [],
      rosterFilter: "all",
      rosterSearch: "",
    };
  }

  function load() {
    try {
      return { ...defaults(), ...JSON.parse(sessionStorage.getItem(KEY) || "{}") };
    } catch (_) {
      return defaults();
    }
  }

  function save(state) {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  }

  function get() {
    return load();
  }

  function set(partial) {
    const s = { ...load(), ...partial };
    save(s);
    applyUI(window.__wizardFlowIdx);
    return s;
  }

  function reset() {
    save(defaults());
    applyUI(window.__wizardFlowIdx);
  }

  function isSocial(type) {
    type = type || load().eventType;
    return type === "americano" || type === "mexicano";
  }

  function isCompetitive(type) {
    type = type || load().eventType;
    return type === "singles" || type === "doubles";
  }

  function stepAfterType() {
    return isSocial() ? 3 : 2;
  }

  function stepAfterDivision() {
    return 3;
  }

  function stepAfterParticipants() {
    return isCompetitive() ? 4 : 5;
  }

  function stepAfterStructure() {
    return 5;
  }

  function stepAfterRoster() {
    return 6;
  }

  function rosterPublishStep() {
    return 6;
  }

  function resolveEngineFormat(state) {
    state = state || load();
    if (state.eventType === "americano") return "americano";
    if (state.eventType === "mexicano") return "mexicano";
    if (state.structure === "league") return "league";
    if (state.structure === "box_league") return "box_league";
    if (state.structure === "group_knockout") return "group_knockout";
    if (state.structure === "round_robin") return "round_robin";
    return "round_robin";
  }

  function resolveCategory(state) {
    state = state || load();
    if (isSocial(state.eventType)) return "doubles";
    if (state.eventType === "doubles") {
      if (state.division === "men") return "doubles_men";
      if (state.division === "women") return "doubles_women";
      return "mixed";
    }
    if (state.division === "women") return "singles_women";
    return "singles_men";
  }

  function resolveScoring(state) {
    state = state || load();
    if (isSocial(state.eventType)) return "race_to_n";
    if (state.structure === "league" || state.structure === "round_robin") return "normal_sets";
    return "best_of_n";
  }

  function divisionLabel(state) {
    state = state || load();
    const map = {
      men: "Men",
      women: "Women",
      mixed: "Mixed",
      open: "Open",
    };
    return map[state.division] || "";
  }

  function typeLabel(state) {
    state = state || load();
    const map = {
      americano: "Americano",
      mexicano: "Mexicano",
      singles: "Singles",
      doubles: "Doubles",
    };
    return map[state.eventType] || "";
  }

  function structureLabel(state) {
    state = state || load();
    const map = {
      round_robin: "Round Robin",
      group_knockout: "Group → Knockout",
      league: "League",
      box_league: "Box League",
    };
    return map[state.structure] || "";
  }

  function rrVariantLabel(state) {
    state = state || load();
    const v = RR_VARIANTS.find((r) => r.id === state.rrVariant);
    return v ? (window.MP_I18N ? MP_I18N.t(v.labelKey) : state.rrVariant) : "";
  }

  function bracketShortName(sport, bracketClass) {
    if (!window.MP_Rank) return bracketClass || "open";
    const d = MP_Rank.getBracketDisplay(sport, bracketClass || "open");
    const lang = (window.MP_I18N && MP_I18N.getLang()) || "en";
    return lang === "id" ? d.classId_label : d.classEn;
  }

  function bracketLabel(state) {
    state = state || load();
    const sport = (window.MP_Sport && MP_Sport.get()) || "padel";
    const bracketClass = state.bracketClass || "open";
    if (!window.MP_Rank) return bracketClass;
    const d = MP_Rank.getBracketDisplay(sport, bracketClass);
    const cls = bracketShortName(sport, bracketClass);
    const range =
      d.mpRatingRange === "Any"
        ? window.MP_I18N
          ? MP_I18N.t("wizard.bracketAny")
          : "Any"
        : "MP Rating " + d.mpRatingRange;
    return cls + " · " + range;
  }

  function buildSummary(state) {
    state = state || load();
    const parts = [typeLabel(state)];
    if (state.division && isCompetitive(state.eventType)) {
      parts.push(divisionLabel(state));
    }
    if (state.bracketClass && state.bracketClass !== "open") {
      parts.push(bracketShortName((window.MP_Sport && MP_Sport.get()) || "padel", state.bracketClass));
    }
    if (isCompetitive(state.eventType) && state.structure) {
      parts.push(structureLabel(state));
      if (state.structure === "round_robin") parts.push(rrVariantLabel(state));
    }
    parts.push(state.participants + " " + (isCompetitive(state.eventType) && state.eventType === "doubles" ? "teams" : "players"));
    return parts.join(" · ");
  }

  function suggestedName(state) {
    state = state || load();
    const sport = (window.MP_Sport && MP_Sport.get()) || "padel";
    const sportName = sport.charAt(0).toUpperCase() + sport.slice(1);
    if (state.eventType === "americano") return "Americano Night · " + sportName;
    if (state.eventType === "mexicano") return "Mexicano Session · " + sportName;
    const div = divisionLabel(state);
    const struct = structureLabel(state);
    const bracket =
      state.bracketClass && state.bracketClass !== "open"
        ? bracketShortName(sport, state.bracketClass)
        : "";
    return [struct || typeLabel(state), div, bracket, sportName].filter(Boolean).join(" · ");
  }

  function resolveFlowIdx(flowIdx) {
    if (window.__wizardStepMapRev && window.__wizardStepMapRev[flowIdx] != null)
      return window.__wizardStepMapRev[flowIdx];
    return flowIdx;
  }

  function getWizardPhase(flowIdx, state) {
    flowIdx = resolveFlowIdx(flowIdx);
    state = state || load();
    if (!flowIdx || flowIdx > 6) return 0;
    if (isSocial(state.eventType)) {
      if (flowIdx === 1) return 1;
      if (flowIdx === 3) return 2;
      if (flowIdx === 5 || flowIdx === 6) return 3;
      return 0;
    }
    if (flowIdx >= 5) return 4;
    return flowIdx;
  }

  function getWizardTotalPhases(state) {
    state = state || load();
    return isSocial(state.eventType) ? 3 : 4;
  }

  function wizardBackTarget(which) {
    const state = load();
    if (which === "participants") return isSocial(state.eventType) ? 1 : 2;
    if (which === "roster") return isCompetitive(state.eventType) ? 4 : 3;
    if (which === "publish") return 5;
    return 0;
  }

  function searchPlayers(query, filter) {
    query = (query || "").toLowerCase().trim();
    filter = filter || load().rosterFilter || "all";
    const rosterIds = new Set(load().roster.map((p) => p.id));
    return PLAYER_DIR.filter((p) => {
      if (rosterIds.has(p.id)) return false;
      if (filter !== "all" && p.source !== filter) return false;
      if (!query) return true;
      return p.name.toLowerCase().includes(query) || (p.meta || "").toLowerCase().includes(query);
    });
  }

  function addToRoster(player) {
    const state = load();
    if (state.roster.some((p) => p.id === player.id)) return state;
    if (state.roster.length >= state.participants) return state;
    return set({ roster: [...state.roster, { ...player, addedBy: "admin" }] });
  }

  function removeFromRoster(id) {
    const state = load();
    return set({ roster: state.roster.filter((p) => p.id !== id) });
  }

  function addGuestName(name) {
    name = (name || "").trim();
    if (!name) return load();
    const id = "guest-" + Date.now();
    return addToRoster({
      id,
      name,
      source: "external",
      guest: true,
      meta: window.MP_I18N ? MP_I18N.t("wizard.rosterGuestMeta") : "Guest · admin-added",
    });
  }

  function rosterCountLabel(state) {
    state = state || load();
    const n = state.roster.length;
    const cap = state.participants;
    const open = Math.max(0, cap - n);
    const t = window.MP_I18N;
    if (t) return n + " / " + cap + " · " + open + " " + t.t("wizard.rosterSlotsOpen");
    return n + " / " + cap;
  }

  function renderRosterResults(container, state) {
    if (!container) return;
    const results = searchPlayers(state.rosterSearch, state.rosterFilter);
    const t = window.MP_I18N;
    if (!results.length) {
      container.innerHTML =
        '<p class="form-hint">' +
        (t ? t.t("wizard.rosterNoResults") : "No players found") +
        "</p>";
      return;
    }
    container.innerHTML = results
      .map((p) => {
        const badge =
          p.source === "community"
            ? '<span class="badge badge-success">' + (t ? t.t("wizard.rosterInCommunity") : "Community") + "</span>"
            : '<span class="badge badge-info">' + (t ? t.t("wizard.rosterOutside") : "Outside") + "</span>";
        return (
          '<div class="roster-search-row">' +
          '<div class="roster-search-info"><div class="match-players">' +
          p.name +
          "</div><div class=\"match-meta\">" +
          (p.meta || "") +
          "</div></div>" +
          badge +
          '<button type="button" class="btn btn-outline btn-sm" data-wizard-roster-add="' +
          p.id +
          '">+</button></div>'
        );
      })
      .join("");
  }

  function renderRosterList(container, state) {
    if (!container) return;
    const t = window.MP_I18N;
    if (!state.roster.length) {
      container.innerHTML =
        '<p class="form-hint" data-wizard-roster-empty>' +
        (t ? t.t("wizard.rosterEmpty") : "No players added yet — search above or skip.") +
        "</p>";
      return;
    }
    container.innerHTML = state.roster
      .map((p) => {
        const badge =
          p.source === "community"
            ? '<span class="badge badge-success">' + (t ? t.t("wizard.rosterAdminAdded") : "Admin") + "</span>"
            : '<span class="badge badge-info">' + (t ? t.t("wizard.rosterOutside") : "Outside") + "</span>";
        return (
          '<div class="match-card">' +
          '<div><div class="match-players">' +
          p.name +
          '</div><div class="match-meta">' +
          (p.meta || "") +
          " · " +
          (t ? t.t("wizard.rosterByAdmin") : "by admin") +
          "</div></div>" +
          badge +
          '<button type="button" class="btn btn-outline btn-sm" data-wizard-roster-remove="' +
          p.id +
          '">×</button></div>'
        );
      })
      .join("");
  }

  function renderRegistrations(root, state) {
    if (!root) return;
    const list = root.querySelector("[data-admin-reg-list]");
    const countEl = root.querySelector("[data-admin-reg-count]");
    if (!list) return;
    const t = window.MP_I18N;
    const selfRegs = [
      { name: "Sari Wijaya", meta: t ? t.t("wizard.regSelfMeta") : "Self-registered · 1h ago", self: true },
    ].filter((s) => !state.roster.some((r) => r.name === s.name));
    const rows = [
      ...state.roster.map((p) => ({
        name: p.name,
        meta: (p.meta || "") + " · " + (t ? t.t("wizard.rosterByAdmin") : "by admin"),
        admin: true,
      })),
      ...selfRegs,
    ];
    const filled = rows.length;
    const cap = state.participants || 16;
    if (countEl) countEl.textContent = filled + " / " + cap;
    const bar = root.querySelector(".reg-capacity-fill");
    if (bar) bar.style.width = Math.min(100, (filled / cap) * 100) + "%";
    const badge = root.querySelector("[data-admin-reg-badge]");
    if (badge) badge.textContent = filled + " / " + cap;
    list.innerHTML = rows
      .map((r) => {
        const badgeCls = r.admin ? "badge-info" : "badge-success";
        const badgeTxt = r.admin
          ? t
            ? t.t("wizard.rosterAdminAdded")
            : "Admin-added"
          : t
            ? t.t("wizard.regSelfBadge")
            : "Self-registered";
        return (
          '<div class="match-card"><div><div class="match-players">' +
          r.name +
          '</div><div class="match-meta">' +
          r.meta +
          '</div></div><span class="badge ' +
          badgeCls +
          '">' +
          badgeTxt +
          "</span></div>"
        );
      })
      .join("");
    if (!rows.length) {
      list.innerHTML =
        '<p class="form-hint">' + (t ? t.t("wizard.regNoneYet") : "No registrations yet.") + "</p>";
    }
  }

  function applyUI(flowIdx) {
    const state = load();
    const phase = getWizardPhase(flowIdx, state);
    const total = getWizardTotalPhases(state);

    document.querySelectorAll("[data-wizard-summary]").forEach((el) => {
      el.textContent = buildSummary(state);
    });

    document.querySelectorAll("[data-wizard-suggested-name]").forEach((el) => {
      if (el.tagName === "INPUT") el.value = suggestedName(state);
      else el.textContent = suggestedName(state);
    });

    document.querySelectorAll("[data-show-wizard-doubles-only]").forEach((el) => {
      el.hidden = state.eventType !== "doubles";
    });

    document.querySelectorAll("[data-show-wizard-rr-variant]").forEach((el) => {
      el.hidden = state.structure !== "round_robin";
    });

    document.querySelectorAll("[data-show-scoring-social]").forEach((el) => {
      el.hidden = !isSocial(state.eventType);
    });

    document.querySelectorAll("[data-show-scoring-competitive]").forEach((el) => {
      el.hidden = isSocial(state.eventType);
    });

    document.querySelectorAll("[data-wizard-step-indicator]").forEach((el) => {
      const step = parseInt(el.dataset.wizardStepIndicator, 10);
      const hide = step > total;
      el.hidden = hide;
      if (hide) return;
      el.classList.toggle("done", step < phase);
      el.classList.toggle("current", step === phase);
    });

    document.querySelectorAll(".wizard-line").forEach((line, i) => {
      line.hidden = i >= total - 1;
    });

    document.querySelectorAll("[data-wizard-participant-val]").forEach((el) => {
      el.classList.toggle("active", parseInt(el.dataset.wizardParticipantVal, 10) === state.participants);
    });

    document.querySelectorAll("[data-wizard-participants-input]").forEach((el) => {
      el.value = state.participants;
    });

    document.querySelectorAll("[data-wizard-capacity-display]").forEach((el) => {
      const wait = Math.max(2, Math.floor(state.participants * 0.25));
      const unit = state.eventType === "doubles" ? "tim" : "pemain";
      el.value = state.participants + " " + unit + " · waitlist " + wait;
    });

    document.querySelectorAll("[data-wizard-type-card]").forEach((el) => {
      el.classList.toggle("primary", el.dataset.wizardTypeCard === state.eventType);
    });

    document.querySelectorAll("[data-wizard-division-chip]").forEach((el) => {
      el.classList.toggle("active", el.dataset.wizardDivisionChip === state.division);
    });

    document.querySelectorAll("[data-wizard-bracket-chip]").forEach((el) => {
      el.classList.toggle("active", el.dataset.wizardBracketChip === state.bracketClass);
    });

    document.querySelectorAll("[data-wizard-bracket-preview]").forEach((el) => {
      el.textContent = bracketLabel(state);
    });

    document.querySelectorAll("[data-wizard-structure-card]").forEach((el) => {
      el.classList.toggle("primary", el.dataset.wizardStructureCard === state.structure);
    });

    document.querySelectorAll("[data-wizard-rr-variant]").forEach((el) => {
      if (el.tagName === "SELECT") el.value = state.rrVariant;
    });

    document.querySelectorAll("[data-wizard-roster-count]").forEach((el) => {
      el.textContent = rosterCountLabel(state);
    });

    document.querySelectorAll("[data-wizard-step='5'] .reg-capacity-fill").forEach((el) => {
      const pct = state.participants ? (state.roster.length / state.participants) * 100 : 0;
      el.style.width = Math.min(100, pct) + "%";
    });

    document.querySelectorAll("[data-wizard-roster-filter]").forEach((el) => {
      el.classList.toggle("active", el.dataset.wizardRosterFilter === state.rosterFilter);
    });

    document.querySelectorAll("[data-wizard-roster-search]").forEach((el) => {
      if (el.value !== state.rosterSearch) el.value = state.rosterSearch;
    });

    if (resolveFlowIdx(flowIdx) === 5) {
      document.querySelectorAll("[data-wizard-roster-results]").forEach((el) => {
        renderRosterResults(el, state);
      });
      document.querySelectorAll("[data-wizard-roster-list]").forEach((el) => {
        renderRosterList(el, state);
      });
    }

    document.querySelectorAll("[data-wizard-roster-summary]").forEach((el) => {
      if (!state.roster.length) {
        el.hidden = true;
        return;
      }
      el.hidden = false;
      const t = window.MP_I18N;
      el.textContent =
        state.roster.length +
        " " +
        (t ? t.t("wizard.rosterPreFilled") : "players pre-filled by admin");
    });

    document.querySelectorAll("[data-admin-reg-panel]").forEach((el) => {
      renderRegistrations(el, state);
    });

    const stepLabel =
      (window.MP_I18N ? MP_I18N.t("operator.wizardStep") : "Step") +
      " " +
      phase +
      "/" +
      total;

    document.querySelectorAll(".mp-operator-shell").forEach((app) => {
      let bar = app.querySelector("[data-operator-context]");
      if (!bar) {
        const header = app.querySelector(".app-header");
        if (!header) return;
        bar = document.createElement("div");
        bar.className = "mp-operator-context";
        bar.setAttribute("data-operator-context", "");
        bar.innerHTML =
          '<span class="mp-operator-crumb club-name-dynamic">Padel Jakarta Selatan</span>' +
          '<span class="mp-operator-step" data-wizard-step-label></span>';
        header.insertAdjacentElement("afterend", bar);
      }
      const lbl = bar.querySelector("[data-wizard-step-label]");
      if (lbl && flowIdx && flowIdx >= 1 && flowIdx <= 6) lbl.textContent = stepLabel;
      else if (lbl && app.querySelector("[data-admin-reg-panel]")) {
        lbl.textContent = window.MP_I18N ? MP_I18N.t("operator.registrations") : "Registrations";
      }
    });

    document.querySelectorAll("[data-wizard-scoring-preview]").forEach((el) => {
      const sport = (window.MP_Sport && MP_Sport.get()) || "padel";
      const mockEv = {
        eventType: state.eventType,
        sport,
        format: resolveEngineFormat(state),
        scoring: resolveScoring(state),
      };
      if (window.MP_ScoringRules) {
        const meta = MP_ScoringRules.profileMeta(mockEv);
        const sportLabel = sport.replace(/_/g, " ");
        const type = typeLabel(state);
        const profileLabel = window.MP_I18N ? MP_I18N.t(meta.labelKey) : meta.id;
        el.innerHTML =
          "<strong>" +
          sportLabel +
          " · " +
          type +
          "</strong><span>" +
          profileLabel +
          "</span>";
      }
    });
  }

  function toTournamentOpts(form) {
    const state = load();
    const name =
      form?.querySelector("[data-event-name]")?.value || suggestedName(state);
    const raceTo = parseInt(form?.querySelector("[data-event-race-to]")?.value, 10) || 24;
    const bestOf = parseInt(form?.querySelector("[data-event-best-of]")?.value, 10) || 3;
    const scoringContainer = isSocial(state.eventType)
      ? form?.querySelector("[data-show-scoring-social]")
      : form?.querySelector("[data-show-scoring-competitive]");
    const scoring =
      scoringContainer?.querySelector("[data-event-scoring]")?.value ||
      resolveScoring(state);
    const sport = (window.MP_Sport && MP_Sport.get()) || "padel";
    const bracketClass = state.bracketClass || "open";
    const eligibility =
      window.MP_Rank && MP_Rank.eligibilityFromBracket
        ? MP_Rank.eligibilityFromBracket(sport, bracketClass)
        : { bracketClass };
    return {
      format: resolveEngineFormat(state),
      name,
      category: resolveCategory(state),
      eventType: state.eventType,
      division: state.division,
      bracketClass,
      eligibility,
      structure: state.structure,
      rrVariant: state.rrVariant,
      scoring,
      raceTo,
      bestOf,
      capacity: state.participants,
      roster: state.roster,
    };
  }

  function getPlayerById(id) {
    return PLAYER_DIR.find((p) => p.id === id);
  }

  function wizardContext() {
    const id =
      document.querySelector(".screen.active")?.id?.replace("screen-", "") || "";
    return id.startsWith("platform-global-wizard") ? "platform" : "club";
  }

  function wizardScreens() {
    return wizardContext() === "platform" ? PLATFORM_WIZARD_SCREENS : CLUB_WIZARD_SCREENS;
  }

  function navToScreen(screenId) {
    if (!screenId) return;
    location.hash = screenId;
  }

  function navToWizardStep(step) {
    navToScreen(wizardScreens()[step]);
  }

  function onScreenChange(screenId) {
    const idx = WIZARD_SCREEN_IDX[screenId];
    if (idx) {
      window.__wizardFlowIdx = idx;
      applyUI(idx);
      return;
    }
    if (screenId === "event-register" && window.MP_Rank?.applyEligibilityPanel) {
      MP_Rank.applyEligibilityPanel();
    }
    if (screenId === "tournament-create") {
      applyUI();
    }
  }

  function protoToast(msg) {
    if (!msg) return;
    const toast = document.getElementById("flow-toast");
    if (toast) {
      toast.textContent = msg;
      toast.classList.add("show");
      clearTimeout(protoToast._t);
      protoToast._t = setTimeout(() => toast.classList.remove("show"), 2800);
      return;
    }
    /* gallery has no toast element */
  }

  function publishEvent(btn) {
    if (!window.MP_Tournament) return;
    const form = btn.closest(".app-body") || document;
    const state = load();
    const isSimpleCreate = Boolean(btn.closest("#screen-tournament-create"));
    let opts;
    if (!isSimpleCreate && state.eventType) {
      opts = toTournamentOpts(form);
    } else if (isSimpleCreate) {
      const fmt = form.querySelector("[data-event-format]")?.value || "single_elim";
      const name = form.querySelector("[data-event-name]")?.value || "Community Event";
      const sport = (window.MP_Sport && MP_Sport.get()) || "padel";
      const bracketClass = state.bracketClass || "open";
      opts = {
        format: fmt,
        name,
        category: form.querySelector("[data-event-category]")?.value || "doubles",
        bracketClass,
        eligibility: window.MP_Rank
          ? MP_Rank.eligibilityFromBracket(sport, bracketClass)
          : { bracketClass },
        scoring: MP_Tournament.defaultScoringForFormat(fmt),
        capacity: parseInt(form.querySelector("[data-event-capacity]")?.value, 10) || 16,
      };
    } else {
      const fmt = form.querySelector("[data-event-format]")?.value || "americano";
      const name = form.querySelector("[data-event-name]")?.value || "Community Event";
      const sport = (window.MP_Sport && MP_Sport.get()) || "padel";
      const bracketClass = state.bracketClass || "open";
      opts = {
        format: fmt,
        name,
        category: form.querySelector("[data-event-category]")?.value || "doubles",
        bracketClass,
        eligibility: window.MP_Rank
          ? MP_Rank.eligibilityFromBracket(sport, bracketClass)
          : { bracketClass },
        scoring: MP_Tournament.defaultScoringForFormat(fmt),
        capacity: 16,
      };
    }
    const tierText = form.querySelector("[data-event-tier]")?.value || "";
    if (tierText.includes("Tier 1")) opts.tier = 1;
    else if (tierText.includes("Tier 2")) opts.tier = 2;
    else if (tierText.includes("Tier 3")) opts.tier = 3;
    const isGlobal = Boolean(form.querySelector("[data-event-tier]"));
    if (isGlobal || opts.tier) {
      opts.scope = "global";
      opts.rankTarget = "global";
    } else if (!opts.scope) {
      opts.scope = "community";
    }
    MP_Tournament.createEvent(opts);
    if (opts.format === "single_elim" || opts.format === "double_elim") {
      MP_Tournament.generateSchedule();
    }
    protoToast(window.MP_I18N ? MP_I18N.t("flow.publishBtn") : "Published");
    const goto =
      btn.dataset.goto ||
      btn.dataset.flowGoto ||
      (wizardContext() === "platform" ? "platform-global-reg" : "club-registrations");
    if (goto && !/^\d+$/.test(goto)) navToScreen(goto);
    else if (goto) navToWizardStep(parseInt(goto, 10));
  }

  function init() {
    applyUI();
    window.addEventListener("mp:lang", () => applyUI(window.__wizardFlowIdx));
    window.addEventListener("mp:sport", () => applyUI(window.__wizardFlowIdx));

    document.addEventListener("change", (e) => {
      if (e.target.matches("[data-wizard-rr-variant]")) {
        set({ rrVariant: e.target.value });
      }
    });

    document.addEventListener("input", (e) => {
      if (e.target.matches("[data-wizard-participants-input]")) {
        const n = parseInt(e.target.value, 10);
        if (!isNaN(n) && n >= 4) set({ participants: n });
      }
      if (e.target.matches("[data-wizard-roster-search]")) {
        set({ rosterSearch: e.target.value });
      }
    });

    document.body.addEventListener("click", (e) => {
      const typeEl = e.target.closest("[data-wizard-pick-type]");
      if (typeEl) {
        e.preventDefault();
        set({ eventType: typeEl.dataset.wizardPickType, division: "", structure: "" });
        navToWizardStep(stepAfterType());
        return;
      }

      const divEl = e.target.closest("[data-wizard-pick-division]");
      if (divEl) {
        e.preventDefault();
        set({ division: divEl.dataset.wizardPickDivision });
        return;
      }

      const bracketEl = e.target.closest("[data-wizard-pick-bracket]");
      if (bracketEl) {
        e.preventDefault();
        set({ bracketClass: bracketEl.dataset.wizardPickBracket });
        return;
      }

      const nextEl = e.target.closest("[data-wizard-next]");
      if (nextEl) {
        e.preventDefault();
        const state = load();
        const next = parseInt(nextEl.dataset.wizardNext, 10);
        if (next === 3 && isCompetitive() && !state.division) {
          protoToast(window.MP_I18N ? MP_I18N.t("wizard.pickDivision") : "Pick a division");
          return;
        }
        if (next === 5 && isCompetitive() && !state.structure) {
          protoToast(window.MP_I18N ? MP_I18N.t("wizard.pickStructure") : "Pick a format");
          return;
        }
        if (!isNaN(next)) navToWizardStep(next);
        return;
      }

      const partEl = e.target.closest("[data-wizard-pick-participants]");
      if (partEl) {
        e.preventDefault();
        set({ participants: parseInt(partEl.dataset.wizardPickParticipants, 10) });
        return;
      }

      const nextPartEl = e.target.closest("[data-wizard-next-participants]");
      if (nextPartEl) {
        e.preventDefault();
        const input = document.querySelector("[data-wizard-participants-input]");
        const n = parseInt(input?.value, 10) || load().participants;
        set({ participants: n });
        navToWizardStep(stepAfterParticipants());
        return;
      }

      const structEl = e.target.closest("[data-wizard-pick-structure]");
      if (structEl) {
        e.preventDefault();
        set({ structure: structEl.dataset.wizardPickStructure });
        return;
      }

      const backEl = e.target.closest("[data-wizard-back]");
      if (backEl) {
        e.preventDefault();
        navToWizardStep(wizardBackTarget(backEl.dataset.wizardBack));
        return;
      }

      const filterEl = e.target.closest("[data-wizard-roster-filter]");
      if (filterEl) {
        e.preventDefault();
        set({ rosterFilter: filterEl.dataset.wizardRosterFilter });
        return;
      }

      const addEl = e.target.closest("[data-wizard-roster-add]");
      if (addEl) {
        e.preventDefault();
        const player = getPlayerById(addEl.dataset.wizardRosterAdd);
        if (!player) return;
        const state = load();
        if (state.roster.length >= state.participants) {
          protoToast(window.MP_I18N ? MP_I18N.t("wizard.rosterFull") : "Capacity full");
          return;
        }
        addToRoster(player);
        protoToast(window.MP_I18N ? MP_I18N.t("wizard.rosterAdded") : "Player added");
        return;
      }

      const removeEl = e.target.closest("[data-wizard-roster-remove]");
      if (removeEl) {
        e.preventDefault();
        removeFromRoster(removeEl.dataset.wizardRosterRemove);
        return;
      }

      const guestEl = e.target.closest("[data-wizard-roster-add-guest]");
      if (guestEl) {
        e.preventDefault();
        const input = document.querySelector("[data-wizard-roster-guest-name]");
        const name = input?.value?.trim();
        if (!name) {
          protoToast(window.MP_I18N ? MP_I18N.t("wizard.rosterGuestRequired") : "Enter a name");
          return;
        }
        const state = load();
        if (state.roster.length >= state.participants) {
          protoToast(window.MP_I18N ? MP_I18N.t("wizard.rosterFull") : "Capacity full");
          return;
        }
        addGuestName(name);
        if (input) input.value = "";
        protoToast(window.MP_I18N ? MP_I18N.t("wizard.rosterAdded") : "Player added");
        return;
      }

      const skipEl = e.target.closest("[data-wizard-roster-skip]");
      if (skipEl) {
        e.preventDefault();
        const goto = skipEl.dataset.goto || skipEl.dataset.flowGoto || "6";
        if (/^\d+$/.test(goto)) navToWizardStep(parseInt(goto, 10));
        else navToScreen(goto);
        return;
      }

      const publishEl = e.target.closest("[data-publish-event]");
      if (publishEl) {
        e.preventDefault();
        publishEvent(publishEl);
      }
    });

    const hash = location.hash.slice(1);
    if (hash) onScreenChange(hash);
  }

  return {
    BRACKET_IDS,
    PLAYER_DIR,
    getPlayerById,
    addToRoster,
    removeFromRoster,
    addGuestName,
    searchPlayers,
    rosterCountLabel,
    renderRegistrations,
    RR_VARIANTS,
    get,
    set,
    reset,
    isSocial,
    isCompetitive,
    stepAfterType,
    stepAfterDivision,
    stepAfterParticipants,
    stepAfterStructure,
    stepAfterRoster,
    rosterPublishStep,
    resolveEngineFormat,
    buildSummary,
    suggestedName,
    bracketLabel,
    applyUI,
    wizardBackTarget,
    toTournamentOpts,
    onScreenChange,
    init,
  };
})();
