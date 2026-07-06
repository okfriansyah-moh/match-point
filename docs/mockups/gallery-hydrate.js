/* Gallery prototype — hydrate JS-rendered screens on navigation */
window.MP_GalleryHydrate = (function () {
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

  const GLOBAL_TOURNAMENT = {
    format: "single_elim",
    name: "Indonesia Padel Masters",
    capacity: 16,
    tier: 1,
    scope: "global",
  };

  let inited = false;

  function screenEl(id) {
    return document.getElementById("screen-" + id);
  }

  function $screen(id, sel) {
    const s = screenEl(id);
    return s ? s.querySelector(sel) : null;
  }

  function seedRefereeDemo(kind) {
    if (!window.MP_Tournament || !REFEREE_DEMOS[kind]) return;
    const ev = MP_Tournament.get();
    if (ev?.demoKind === kind && ev.sessionReady) return;
    MP_Tournament.createEvent({ ...REFEREE_DEMOS[kind], demoKind: kind });
    MP_Tournament.generateSchedule();
  }

  function seedGlobalTournament() {
    if (!window.MP_Tournament) return;
    const ev = MP_Tournament.get();
    if (ev?.name === GLOBAL_TOURNAMENT.name && ev.bracket) return;
    MP_Tournament.createEvent(GLOBAL_TOURNAMENT);
    MP_Tournament.generateSchedule();
  }

  function ensureBocSeason() {
    if (!window.MP_BoC) return;
    const season = MP_BoC.getSeason();
    if (!season.draw || !season.fixtures?.length) {
      MP_BoC.runDraw({ groupCount: 4 });
    }
  }

  function seedApprovalSession(itemId, decision) {
    if (!window.MP_PlatformLists || !window.MP_PlatformApproval) return;
    const item = MP_PlatformLists.getById(itemId);
    if (!item) return;
    MP_PlatformApproval.openReview(item, 2);
    if (decision) {
      sessionStorage.setItem(
        "mp-platform-review",
        JSON.stringify({ id: item.id, returnStep: 2, decision }),
      );
    }
  }

  function hydrateReferee(screenId) {
    const root = $screen(screenId, "[data-referee-live]");
    if (!root || !window.MP_Referee || !window.MP_Tournament) return;
    seedRefereeDemo(root.dataset.refereeDemo || "americano");
    MP_Referee.renderLive(root);
  }

  function hydrateBracket(screenId) {
    if (!window.MP_Tournament) return;
    seedGlobalTournament();
    const ev = MP_Tournament.get();
    const bracket = $screen(screenId, "[data-tournament-bracket]");
    if (bracket && ev?.bracket) MP_Tournament.renderBracket(bracket, ev.bracket);
  }

  const HANDLERS = {
    "platform-approval-inbox": () => {
      const root = $screen("platform-approval-inbox", "[data-platform-inbox]");
      if (root && window.MP_PlatformLists) MP_PlatformLists.renderInbox(root);
    },
    "platform-approval-detail": () => {
      seedApprovalSession("in-1");
      if (window.MP_PlatformApproval) MP_PlatformApproval.onStep(3);
    },
    "platform-approval-result": () => {
      seedApprovalSession("in-1", "approved");
      if (window.MP_PlatformApproval) MP_PlatformApproval.onStep(4);
    },
    "platform-analytics": () => {
      const root = $screen("platform-analytics", "[data-platform-analytics]");
      if (root && window.MP_PlatformAnalytics) MP_PlatformAnalytics.render(root);
    },
    "platform-boc-wizard": () => {
      ensureBocSeason();
      const root = $screen("platform-boc-wizard", "[data-platform-boc-wizard]");
      if (!root || !window.MP_BoC) return;
      MP_BoC.renderWizard(root);
    },
    "platform-boc-fixtures": () => {
      ensureBocSeason();
      const root = $screen("platform-boc-fixtures", "[data-platform-boc-fixtures]");
      if (!root || !window.MP_BoC) return;
      MP_BoC.renderFixtureList(root);
    },
    "club-sparring-create": () => {
      const root = $screen("club-sparring-create", "[data-club-sparring-create]");
      if (root && window.MP_InterCommunity) {
        MP_InterCommunity.renderSparringCreate(root);
      }
    },
    "global-tournament": () => hydrateBracket("global-tournament"),
    "platform-global-live": () => hydrateBracket("platform-global-live"),
    "event-americano": () => hydrateReferee("event-americano"),
    "event-mexicano": () => hydrateReferee("event-mexicano"),
    "format-round-robin": () => hydrateReferee("format-round-robin"),
    "format-league": () => hydrateReferee("format-league"),
    "club-live-referee": () => hydrateReferee("club-live-referee"),
    "club-referee-setup": () => {
      seedRefereeDemo("americano");
      const root = $screen("club-referee-setup", ".app");
      if (root && window.MP_Referee) MP_Referee.renderSetup(root);
    },
    "boc-fixture-detail": () => {
      ensureBocSeason();
      const root = $screen("boc-fixture-detail", "[data-user-boc-detail]");
      if (!root || !window.MP_BoC) return;
      const season = MP_BoC.getSeason();
      const fixtureId =
        sessionStorage.getItem("mp-boc-fixture") || season.fixtures?.[0]?.id;
      if (fixtureId) sessionStorage.setItem("mp-boc-fixture", fixtureId);
      MP_BoC.renderDetail(root, fixtureId);
    },
    "sparring-detail": () => {
      if (window.MP_InterCommunity) MP_InterCommunity.init();
      const root = $screen("sparring-detail", "[data-user-sparring-detail]");
      if (!root || !window.MP_InterCommunity) return;
      let list = [];
      try {
        list = JSON.parse(localStorage.getItem("mp-sparring-events") || "[]");
      } catch (_) {}
      const id = list[0]?.id;
      if (id) sessionStorage.setItem("mp-sparring-id", id);
      MP_InterCommunity.renderSparringDetail(root);
    },
    "club-registrations": () => {
      const root = $screen("club-registrations", ".app");
      if (!root || !window.MP_EventWizard) return;
      if (!MP_EventWizard.get().roster?.length) {
        MP_EventWizard.set({
          participants: 16,
          roster: [{ id: "p1", name: "Budi Santoso", meta: "Senayan" }],
        });
      }
      MP_EventWizard.renderRegistrations(root, MP_EventWizard.get());
    },
    "platform-global-reg": () => {
      const root = $screen("platform-global-reg", ".app");
      if (!root || !window.MP_EventWizard) return;
      MP_EventWizard.reset();
      MP_EventWizard.set({
        participants: 64,
        roster: [
          { id: "p1", name: "Budi Santoso", meta: "Senayan" },
          { id: "p2", name: "Sari Wijaya", meta: "Kemang" },
        ],
      });
      MP_EventWizard.renderRegistrations(root, MP_EventWizard.get());
    },
    "event-register": () => {
      if (window.MP_Rank?.applyEligibilityPanel) MP_Rank.applyEligibilityPanel();
      if (window.MP_Rank?.applyDOM) MP_Rank.applyDOM();
    },
    profile: () => {
      const root = $screen("profile", ".app-body");
      if (root && window.MP_PlayerAnalytics) MP_PlayerAnalytics.renderProfilePanel(root);
    },
    "my-matches": () => {
      const root = $screen("my-matches", ".app-body");
      if (root && window.MP_PlayerAnalytics) {
        const stats = root.querySelector("[data-analytics-stats-full]");
        const chart = root.querySelector("[data-analytics-chart]");
        if (stats) MP_PlayerAnalytics.renderStatsDashboard(stats, null, false);
        if (chart) MP_PlayerAnalytics.renderRatingChart(chart);
      }
    },
    "player-performance": () => {
      const root = $screen("player-performance", "[data-analytics-panel]");
      if (root && window.MP_PlayerAnalytics) MP_PlayerAnalytics.renderProfilePanel(root);
    },
    "player-other": () => {
      const chart = $screen("player-other", "[data-analytics-chart]");
      if (chart && window.MP_PlayerAnalytics) MP_PlayerAnalytics.renderRatingChart(chart);
    },
  };

  function init() {
    if (inited) return;
    inited = true;
    if (window.MP_PlatformLists) MP_PlatformLists.init();
    if (window.MP_PlatformApproval) MP_PlatformApproval.init();
    if (window.MP_PlatformAnalytics) MP_PlatformAnalytics.init();
    if (window.MP_BoC) MP_BoC.init();
    if (window.MP_InterCommunity) MP_InterCommunity.init();
  }

  function hydrate(screenId) {
    if (!screenId || !HANDLERS[screenId]) return;
    init();
    HANDLERS[screenId]();
    const el = screenEl(screenId);
    if (el && window.MP_I18N) MP_I18N.apply(MP_I18N.getLang(), el);
  }

  return { init, hydrate, screens: Object.keys(HANDLERS) };
})();
