/* Inter-community rubric, squad forms, sparring — shared by BoC + Sparring */
window.MP_InterCommunity = (function () {
  const SPAR_KEY = "mp-sparring-events";

  function t(key, fb) {
    return window.MP_I18N ? MP_I18N.t(key, MP_I18N.getLang()) : fb;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function defaultRubric(module) {
    const slots = [
      { kind: "doubles", warPoints: 1, role: null },
      { kind: "doubles", warPoints: module === "king_queen" ? 2 : 1, role: module === "king_queen" ? "king_queen" : null },
      { kind: "doubles", warPoints: 1, role: null },
      { kind: "singles", warPoints: 1, role: null },
    ];
    return {
      templateId: module === "king_queen" ? "king_queen_3d_1s" : "3d_1s",
      gamesPerSet: 8,
      slots,
      winCondition: "most_war_points",
    };
  }

  function loadSparring() {
    try {
      return JSON.parse(localStorage.getItem(SPAR_KEY) || "[]");
    } catch (_) {
      return [];
    }
  }

  function saveSparring(list) {
    localStorage.setItem(SPAR_KEY, JSON.stringify(list));
  }

  function createSparring(opts) {
    const ev = {
      id: "spar-" + Date.now(),
      eventType: "community_sparring",
      brand: "match_point",
      name: opts.name || "Community Sparring",
      sparringMode: opts.sparringMode || "casual",
      format: opts.format || "round_robin",
      communities: opts.communities || [],
      rubric: opts.sparringMode === "ranked" ? defaultRubric(opts.module) : null,
      rankWeight: opts.sparringMode === "ranked" ? 0.7 : 0.4,
      standings: {},
      fixtures: [],
      createdAt: new Date().toISOString(),
    };
    ev.fixtures = buildSparringFixtures(ev);
    const list = loadSparring();
    list.unshift(ev);
    saveSparring(list);
    return ev;
  }

  function buildSparringFixtures(ev) {
    const ids = ev.communities.filter((c) => c.status === "confirmed").map((c) => c.id);
    const fixtures = [];
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        fixtures.push({
          id: ev.id + "-f" + fixtures.length,
          homeCommunityId: ids[i],
          awayCommunityId: ids[j],
          homePoints: 0,
          awayPoints: 0,
        });
      }
    }
    return fixtures;
  }

  function getSparring(id) {
    return loadSparring().find((e) => e.id === id) || loadSparring()[0];
  }

  function communityName(id) {
    if (window.MP_BoC) return MP_BoC.communityName(id);
    return id;
  }

  function renderSquadForm(root, fixtureId, communityId, opts) {
    if (!root || root.dataset.squadBound) return;
    root.dataset.squadBound = "1";
    opts = opts || {};
    const rubric = defaultRubric(opts.module);
    const players = ["Budi Santoso", "Rudi Hartono", "Sari Wijaya", "Andi Pratama", "Dina", "Carla"];
    const slots = rubric.slots
      .map((slot, i) => {
        const label =
          slot.role === "king_queen"
            ? "👑 " + t("boc.kingQueen", "King/Queen slot") + " (2 pts)"
            : slot.kind === "singles"
              ? t("boc.singles", "Singles")
              : t("boc.doubles", "Doubles");
        return (
          '<div class="form-group"><label class="form-label">' +
          label +
          '</label><select class="form-select" data-squad-slot="' +
          i +
          '">' +
          players.map((p) => "<option>" + esc(p) + "</option>").join("") +
          "</select></div>"
        );
      })
      .join("");
    root.innerHTML =
      '<p class="text-sm font-bold">' +
      t("boc.submitSquad", "Submit squad") +
      " — " +
      esc(communityName(communityId)) +
      "</p>" +
      slots +
      '<button type="button" class="btn btn-primary btn-block" data-squad-save data-fixture="' +
      esc(fixtureId) +
      '" data-community="' +
      esc(communityId) +
      '">' +
      t("boc.saveSquad", "Save squad") +
      "</button>";
    root.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-squad-save]");
      if (!btn) return;
      const slotsOut = [];
      root.querySelectorAll("[data-squad-slot]").forEach((sel, i) => {
        slotsOut.push({ slot: i, player: sel.value });
      });
      if (window.MP_BoC) MP_BoC.submitSquad(btn.dataset.fixture, btn.dataset.community, slotsOut);
      btn.textContent = t("boc.squadSaved", "Squad saved ✓");
      btn.disabled = true;
    });
  }

  function renderSparringCreate(root) {
    if (!root) return;
    const comms = [
      { id: "senayan", name: "Senayan Padel Club" },
      { id: "kemang", name: "Kemang Tennis Society" },
      { id: "bsd", name: "BSD Tennis Club" },
    ];
    root.innerHTML =
      '<p class="section-sub" data-i18n="sparring.createSub">' +
      t("sparring.createSub", "Invite 2+ communities — casual or ranked sparring.") +
      "</p>" +
      '<div class="form-group"><label class="form-label">' +
      t("sparring.name", "Event name") +
      '</label><input class="form-input" data-spar-name value="Jakarta Sparring Weekend" /></div>' +
      '<div class="filter-chips mb-2" data-spar-mode><button type="button" class="filter-chip active" data-spar-mode-val="casual">' +
      t("sparring.casual", "Casual") +
      '</button><button type="button" class="filter-chip" data-spar-mode-val="ranked">' +
      t("sparring.ranked", "Ranked") +
      "</button></div>" +
      '<p class="text-sm font-bold mb-1">' +
      t("sparring.invite", "Invite communities") +
      "</p>" +
      comms
        .map(
          (c) =>
            '<label class="match-card" style="display:flex;align-items:center;gap:0.5rem;cursor:pointer"><input type="checkbox" data-spar-comm value="' +
            esc(c.id) +
            '" checked /> ' +
            esc(c.name) +
            "</label>",
        )
        .join("") +
      '<button type="button" class="btn btn-primary btn-block btn-lg mt-2" data-spar-publish>' +
      t("sparring.publish", "Publish sparring →") +
      "</button>";
    root.addEventListener("click", (e) => {
      const modeBtn = e.target.closest("[data-spar-mode-val]");
      if (modeBtn) {
        root.querySelectorAll("[data-spar-mode-val]").forEach((b) => b.classList.remove("active"));
        modeBtn.classList.add("active");
      }
      if (e.target.closest("[data-spar-publish]")) {
        const mode =
          root.querySelector("[data-spar-mode-val].active")?.dataset.sparModeVal || "casual";
        const communities = [];
        root.querySelectorAll("[data-spar-comm]:checked").forEach((cb) => {
          communities.push({ id: cb.value, status: "confirmed" });
        });
        if (communities.length < 2) {
          alert(t("sparring.minComm", "Select at least 2 communities."));
          return;
        }
        const ev = createSparring({
          name: root.querySelector("[data-spar-name]")?.value,
          sparringMode: mode,
          communities,
        });
        sessionStorage.setItem("mp-sparring-id", ev.id);
        if (window.MP_Flow && typeof MP_Flow.go === "function") MP_Flow.go(26, { toast: true });
      }
    });
  }

  function renderSparringDetail(root) {
    if (!root) return;
    const ev = getSparring(sessionStorage.getItem("mp-sparring-id"));
    if (!ev) {
      root.innerHTML = "<p class=\"text-muted\">" + t("sparring.none", "No sparring event.") + "</p>";
      return;
    }
    const modeBadge =
      ev.sparringMode === "ranked"
        ? '<span class="badge badge-sparring-ranked">' + t("sparring.ranked", "Ranked") + "</span>"
        : '<span class="badge badge-sparring">' + t("sparring.casual", "Casual") + "</span>";
    const standings = {};
    ev.communities.forEach((c) => {
      standings[c.id] = 0;
    });
    ev.fixtures.forEach((fx) => {
      if (fx.homePoints > fx.awayPoints) standings[fx.homeCommunityId] = (standings[fx.homeCommunityId] || 0) + 1;
      else if (fx.awayPoints > fx.homePoints) standings[fx.awayCommunityId] = (standings[fx.awayCommunityId] || 0) + 1;
    });
    const table = Object.keys(standings)
      .sort((a, b) => standings[b] - standings[a])
      .map(
        (id, i) =>
          "<tr" +
          (i === 0 ? ' class="lb-top10"' : "") +
          "><td>" +
          (i + 1) +
          "</td><td>" +
          esc(communityName(id)) +
          "</td><td><strong>" +
          standings[id] +
          "</strong></td></tr>",
      )
      .join("");
    const fixtures = ev.fixtures
      .map(
        (fx) =>
          '<div class="match-card"><div class="match-players">' +
          esc(communityName(fx.homeCommunityId)) +
          " vs " +
          esc(communityName(fx.awayCommunityId)) +
          '</div><div class="match-meta">' +
          fx.homePoints +
          " – " +
          fx.awayPoints +
          "</div></div>",
      )
      .join("");
    root.innerHTML =
      '<div class="flex items-center gap-1 mb-2">' +
      modeBadge +
      "<h2 class=\"section-title\" style=\"margin:0\">" +
      esc(ev.name) +
      "</h2></div>" +
      '<p class="form-hint">' +
      ev.communities.length +
      " " +
      t("sparring.communities", "communities") +
      " · " +
      ev.format +
      "</p>" +
      '<p class="text-sm font-bold mt-2">' +
      t("sparring.standings", "Standings") +
      '</p><table class="pa-table mb-2"><thead><tr><th>#</th><th>' +
      t("sparring.community", "Community") +
      '</th><th>' +
      t("sparring.wins", "W") +
      "</th></tr></thead><tbody>" +
      table +
      "</tbody></table>" +
      fixtures;
  }

  function renderEventsFeedExtras(container) {
    if (!container || container.querySelector("[data-spar-feed-card]")) return;
    const list = loadSparring().slice(0, 2);
    list.forEach((ev) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "match-card mp-event-sparring";
      card.dataset.sparFeedCard = "1";
      card.dataset.flowGoto = "26";
      card.innerHTML =
        '<div><div class="match-players">⚔ ' +
        esc(ev.name) +
        '</div><div class="match-meta">' +
        t("sparring.label", "Community Sparring") +
        " · " +
        ev.sparringMode +
        "</div></div>" +
        '<span class="badge badge-sparring">' +
        ev.communities.length +
        " clubs</span>";
      card.addEventListener("click", () => {
        sessionStorage.setItem("mp-sparring-id", ev.id);
      });
      const feed = container.querySelector(".events-list") || container.querySelector("[data-events-list]") || container;
      if (feed.firstChild) feed.insertBefore(card, feed.firstChild);
      else feed.appendChild(card);
    });
    if (!list.length) {
      createSparring({
        name: "Demo: 3-Club Sparring",
        sparringMode: "ranked",
        communities: [
          { id: "senayan", status: "confirmed" },
          { id: "kemang", status: "confirmed" },
          { id: "bsd", status: "confirmed" },
        ],
      });
      renderEventsFeedExtras(container);
    }
  }

  function onStep(step) {
    const create = document.querySelector("[data-club-sparring-create]");
    if (create && step === 11) renderSparringCreate(create);
    const detail = document.querySelector("[data-user-sparring-detail]");
    if (detail && step === 26) renderSparringDetail(detail);
  }

  function init() {
    if (!loadSparring().length) {
      createSparring({
        name: "Demo: 3-Club Sparring",
        sparringMode: "ranked",
        communities: [
          { id: "senayan", status: "confirmed" },
          { id: "kemang", status: "confirmed" },
          { id: "bsd", status: "confirmed" },
        ],
      });
    }
  }

  return {
    init,
    onStep,
    defaultRubric,
    createSparring,
    getSparring,
    renderSquadForm,
    renderSparringCreate,
    renderSparringDetail,
    renderEventsFeedExtras,
  };
})();

// Alias for plan naming
window.MP_Sparring = window.MP_InterCommunity;
