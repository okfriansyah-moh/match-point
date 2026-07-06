/* Battle of Communities — group draw, fixtures, squad submission (mockup) */
window.MP_BoC = (function () {
  const STORAGE_KEY = "mp-boc-season";
  const COMMUNITIES = () =>
    window.MP_Communities
      ? Object.values(MP_Communities.COMMUNITIES || {})
      : [
          { id: "senayan", name: "Senayan Padel Club" },
          { id: "kemang", name: "Kemang Tennis Society" },
          { id: "bsd", name: "BSD Tennis Club" },
          { id: "blokm", name: "Blok M Pickleball" },
        ];

  function t(key, fb) {
    return window.MP_I18N ? MP_I18N.t(key, MP_I18N.getLang()) : fb;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch (_) {
      return null;
    }
  }

  function save(season) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(season));
  }

  function seededShuffle(arr, seed) {
    const a = arr.slice();
    let s = seed;
    for (let i = a.length - 1; i > 0; i--) {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      const j = s % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function defaultSeason() {
    return {
      id: "boc-" + Date.now(),
      name: "BoC Season 1 — Padel Jakarta",
      sport: "padel",
      division: "mixed",
      gamesPerSet: 8,
      gameDeficit: 1,
      squadDeadlineDays: 3,
      draw: null,
      fixtures: [],
      squads: {},
    };
  }

  function getSeason() {
    let s = load();
    if (!s) {
      s = defaultSeason();
      save(s);
    }
    return s;
  }

  function runDraw(opts) {
    const season = getSeason();
    const pool = (opts.communityIds || COMMUNITIES().map((c) => c.id)).slice();
    const groupCount = opts.groupCount || 4;
    const perGroup = Math.ceil(pool.length / groupCount);
    const seed = opts.seed || Date.now() % 100000;
    const shuffled = seededShuffle(pool, seed);
    const groups = [];
    const labels = "ABCDEFGHIJ".split("");
    for (let g = 0; g < groupCount; g++) {
      groups.push({
        id: labels[g] || "G" + (g + 1),
        communityIds: shuffled.slice(g * perGroup, (g + 1) * perGroup),
      });
    }
    season.draw = {
      method: "random_seeded",
      groupCount,
      perGroup,
      groups,
      audit: {
        at: new Date().toISOString(),
        by: "admin@matchpoint.id",
        seed,
      },
    };
    season.fixtures = buildFixtures(season);
    save(season);
    return season;
  }

  function buildFixtures(season) {
    const fixtures = [];
    if (!season.draw) return fixtures;
    let n = 0;
    season.draw.groups.forEach((g) => {
      const ids = g.communityIds;
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const days = 14 + n * 7;
          const scheduled = new Date();
          scheduled.setDate(scheduled.getDate() + days);
          const deadline = new Date(scheduled);
          deadline.setDate(deadline.getDate() - (season.squadDeadlineDays || 3));
          fixtures.push({
            id: "fx-" + ++n,
            groupId: g.id,
            homeCommunityId: ids[i],
            awayCommunityId: ids[j],
            scheduledAt: scheduled.toISOString(),
            squadDeadlineAt: deadline.toISOString(),
            status: "scheduled",
            homePoints: 0,
            awayPoints: 0,
          });
        }
      }
    });
    return fixtures;
  }

  function communityName(id) {
    const c = COMMUNITIES().find((x) => x.id === id);
    return c ? c.name : id;
  }

  function getFixture(id) {
    return getSeason().fixtures.find((f) => f.id === id);
  }

  function submitSquad(fixtureId, communityId, slots) {
    const season = getSeason();
    if (!season.squads) season.squads = {};
    const key = fixtureId + ":" + communityId;
    season.squads[key] = { slots, at: new Date().toISOString() };
    const fx = season.fixtures.find((f) => f.id === fixtureId);
    if (fx) {
      const homeKey = fixtureId + ":" + fx.homeCommunityId;
      const awayKey = fixtureId + ":" + fx.awayCommunityId;
      if (season.squads[homeKey] && season.squads[awayKey]) fx.status = "squads_locked";
    }
    save(season);
    return season;
  }

  function isLate(fixture) {
    if (!fixture) return false;
    const deadline = new Date(fixture.squadDeadlineAt);
    const home = getSeason().squads?.[fixture.id + ":" + fixture.homeCommunityId];
    const away = getSeason().squads?.[fixture.id + ":" + fixture.awayCommunityId];
    const now = new Date();
    if (now < deadline) return false;
    return !home || !away;
  }

  function renderDraw(root) {
    if (!root) return;
    const season = getSeason();
    if (!season.draw) {
      root.innerHTML =
        '<p class="section-sub">' +
        t("boc.drawEmpty", "Configure groups and run the in-app draw.") +
        '</p><div class="form-group"><label class="form-label">' +
        t("boc.groupCount", "Number of groups") +
        '</label><input class="form-input" type="number" value="4" min="2" max="26" data-boc-group-count /></div>' +
        '<button type="button" class="btn btn-primary btn-block" data-boc-run-draw>' +
        t("boc.runDraw", "Run group draw") +
        "</button>";
      return;
    }
    const groups = season.draw.groups
      .map(
        (g) =>
          '<div class="card mb-1"><strong>' +
          t("boc.group", "Group") +
          " " +
          esc(g.id) +
          '</strong><ul class="pa-perm-list">' +
          g.communityIds
            .map((id) => "<li>" + esc(communityName(id)) + "</li>")
            .join("") +
          "</ul></div>",
      )
      .join("");
    root.innerHTML =
      '<div class="info-strip mb-2"><span>🎲</span><span>' +
      t("boc.drawDone", "Draw complete — audit logged.") +
      " seed " +
      season.draw.audit.seed +
      "</span></div>" +
      groups +
      '<button type="button" class="btn btn-outline btn-block mt-2" data-boc-run-draw>' +
      t("boc.redraw", "Re-run draw") +
      "</button>";
  }

  function renderWizard(root) {
    if (!root) return;
    root.innerHTML =
      '<div class="wizard-progress mb-2"><span class="wizard-dot current">1</span><span class="wizard-line"></span><span class="wizard-dot">2</span><span class="wizard-line"></span><span class="wizard-dot">3</span></div>' +
      '<p class="section-sub" data-i18n="boc.wizardSub">' +
      t("boc.wizardSub", "Create a Battle of Communities season — automated group draw & fixtures.") +
      "</p>" +
      '<div class="form-group"><label class="form-label">' +
      t("boc.seasonName", "Season name") +
      '</label><input class="form-input" data-boc-name value="BoC Season 1 — Padel Jakarta" /></div>' +
      '<div class="form-group"><label class="form-label">' +
      t("boc.groupCount", "Number of groups") +
      '</label><input class="form-input" type="number" data-boc-groups value="4" min="2" max="20" /></div>' +
      '<div class="form-group"><label class="form-label">' +
      t("boc.gamesPerSet", "Games per set") +
      '</label><input class="form-input" type="number" data-boc-games value="8" min="4" max="12" /></div>' +
      '<div data-boc-draw-mount></div>' +
      '<button type="button" class="btn btn-primary btn-block btn-lg mt-2" data-boc-publish data-flow-goto="18">' +
      t("boc.publishSeason", "Publish season →") +
      "</button>";
    const mount = root.querySelector("[data-boc-draw-mount]");
    renderDraw(mount);
  }

  function renderFixtureList(root) {
    if (!root) return;
    const season = getSeason();
    const rows = season.fixtures
      .slice(0, 12)
      .map((fx) => {
        const late = isLate(fx);
        return (
          '<div class="match-card mp-boc-fixture" data-boc-fixture="' +
          esc(fx.id) +
          '"><div><div class="match-players">' +
          esc(communityName(fx.homeCommunityId)) +
          " vs " +
          esc(communityName(fx.awayCommunityId)) +
          '</div><div class="match-meta">' +
          t("boc.group", "Group") +
          " " +
          fx.groupId +
          " · " +
          new Date(fx.scheduledAt).toLocaleDateString() +
          "</div></div>" +
          (late ? '<span class="badge badge-danger">−1 game</span>' : '<span class="badge badge-success">✓</span>') +
          "</div>"
        );
      })
      .join("");
    root.innerHTML =
      '<p class="section-sub">' +
      season.fixtures.length +
      " " +
      t("boc.fixtures", "fixtures") +
      "</p>" +
      rows;
  }

  function renderDetail(root, fixtureId) {
    if (!root) return;
    const fx = getFixture(fixtureId) || getSeason().fixtures[0];
    if (!fx) {
      root.innerHTML = "<p class=\"text-muted\">" + t("boc.noFixtures", "No fixtures yet.") + "</p>";
      return;
    }
    const season = getSeason();
    const rubric = window.MP_InterCommunity?.defaultRubric?.() || { slots: [] };
    const lateHome = isLate(fx) && !season.squads?.[fx.id + ":" + fx.homeCommunityId];
    const lateAway = isLate(fx) && !season.squads?.[fx.id + ":" + fx.awayCommunityId];
    root.innerHTML =
      '<div class="mp-boc-scoreboard mb-2">' +
      '<div class="mp-boc-side"><span class="badge badge-boc">BoC</span><strong>' +
      esc(communityName(fx.homeCommunityId)) +
      "</strong>" +
      (lateHome ? '<span class="badge badge-danger">−' + season.gameDeficit + " game</span>" : "") +
      "</div>" +
      '<div class="mp-boc-mid">' +
      fx.homePoints +
      " – " +
      fx.awayPoints +
      "</div>" +
      '<div class="mp-boc-side"><strong>' +
      esc(communityName(fx.awayCommunityId)) +
      "</strong>" +
      (lateAway ? '<span class="badge badge-danger">−' + season.gameDeficit + " game</span>" : "") +
      "</div></div>" +
      '<p class="form-hint">' +
      t("boc.deadline", "Squad deadline") +
      ": " +
      new Date(fx.squadDeadlineAt).toLocaleString() +
      "</p>" +
      (window.MP_InterCommunity
        ? '<div data-squad-form="' +
          esc(fx.id) +
          ":" +
          esc(fx.homeCommunityId) +
          '"></div>'
        : "") +
      '<button type="button" class="btn btn-primary btn-block mt-2" data-flow-back>' +
      t("boc.backFixtures", "← Back to fixtures") +
      "</button>";
    const squadMount = root.querySelector("[data-squad-form]");
    if (squadMount && window.MP_InterCommunity) {
      MP_InterCommunity.renderSquadForm(squadMount, fx.id, fx.homeCommunityId, { ranked: true });
    }
  }

  function bind(root) {
    if (!root || root.dataset.bocBound) return;
    root.dataset.bocBound = "1";
    root.addEventListener("click", (e) => {
      if (e.target.closest("[data-boc-run-draw]")) {
        const gc =
          parseInt(root.querySelector("[data-boc-group-count]")?.value, 10) ||
          parseInt(root.querySelector("[data-boc-groups]")?.value, 10) ||
          4;
        runDraw({ groupCount: gc });
        const mount = root.querySelector("[data-boc-draw-mount]") || root;
        renderDraw(mount);
      }
      if (e.target.closest("[data-boc-publish]")) {
        const season = getSeason();
        season.name = root.querySelector("[data-boc-name]")?.value || season.name;
        season.gamesPerSet = parseInt(root.querySelector("[data-boc-games]")?.value, 10) || 8;
        if (!season.draw) runDraw({ groupCount: parseInt(root.querySelector("[data-boc-groups]")?.value, 10) || 4 });
        save(season);
      }
      const fxBtn = e.target.closest("[data-boc-fixture]");
      if (fxBtn) {
        sessionStorage.setItem("mp-boc-fixture", fxBtn.dataset.bocFixture);
        if (/user\.html/.test(location.pathname) && window.MP_Flow?.go) MP_Flow.go(25);
      }
    });
  }

  function renderEventsFeedExtras(container) {
    if (!container || container.querySelector("[data-boc-feed-card]")) return;
    let season = getSeason();
    if (!season.fixtures.length) {
      runDraw({ groupCount: 4 });
      season = getSeason();
    }
    season.fixtures.slice(0, 2).forEach((fx) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "match-card mp-event-boc";
      card.dataset.bocFeedCard = "1";
      card.dataset.flowGoto = "25";
      card.innerHTML =
        '<div><div class="match-players">🛡 ' +
        esc(communityName(fx.homeCommunityId)) +
        " vs " +
        esc(communityName(fx.awayCommunityId)) +
        '</div><div class="match-meta">' +
        t("boc.label", "Battle of Communities") +
        " · " +
        t("boc.group", "Group") +
        " " +
        fx.groupId +
        "</div></div>" +
        '<span class="badge badge-boc">BoC</span>';
      card.addEventListener("click", () => {
        sessionStorage.setItem("mp-boc-fixture", fx.id);
      });
      const feed =
        container.querySelector(".events-list") ||
        container.querySelector("[data-events-list]") ||
        container;
      if (feed.firstChild) feed.insertBefore(card, feed.firstChild);
      else feed.appendChild(card);
    });
  }

  function onStep(step) {
    const wizard = document.querySelector("[data-platform-boc-wizard]");
    if (wizard && step === 17) {
      bind(wizard);
      renderWizard(wizard);
    }
    const fixtures = document.querySelector("[data-platform-boc-fixtures]");
    if (fixtures && step === 18) {
      bind(fixtures);
      renderFixtureList(fixtures);
    }
    const detail = document.querySelector("[data-user-boc-detail]");
    if (detail && step === 25) {
      const id = sessionStorage.getItem("mp-boc-fixture");
      renderDetail(detail, id);
    }
  }

  function init() {
    document.querySelectorAll("[data-platform-boc-wizard],[data-platform-boc-fixtures],[data-user-boc-detail]").forEach(bind);
  }

  return {
    init,
    onStep,
    getSeason,
    runDraw,
    getFixture,
    submitSquad,
    isLate,
    renderWizard,
    renderFixtureList,
    renderDetail,
    renderEventsFeedExtras,
    communityName,
  };
})();
