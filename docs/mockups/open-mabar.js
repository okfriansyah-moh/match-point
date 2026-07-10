/* Match Point — open mabar / pickup discovery (AYO Main Bareng + KUYY open match class) */
window.MP_OpenMabar = (function () {
  const t = (k) => (window.MP_I18N ? MP_I18N.t(k) : k);
  const lang = () => (window.MP_I18N ? MP_I18N.getLang() : "en");
  const L = (o) => (o ? o[lang()] || o.en : "");

  const LISTINGS = [
    {
      id: "m1",
      title: { id: "Jumat Malam Padel — 2 slot", en: "Friday Night Padel — 2 slots open" },
      host: "Andi Pratama",
      venue: "Senayan Padel Club",
      when: { id: "Jumat 19:00", en: "Fri 19:00" },
      distance: "1.2 km",
      bracket: "Intermediate",
      sport: "padel",
      visibility: "public",
      slots: { open: 2, max: 4 },
      costShare: "Rp 62k",
    },
    {
      id: "m2",
      title: { id: "Open match tennis — beginner friendly", en: "Open tennis match — beginner friendly" },
      host: "Kemang Tennis Society",
      venue: "Kemang Courts",
      when: { id: "Sabtu 07:00", en: "Sat 07:00" },
      distance: "3.4 km",
      bracket: "Beginner",
      sport: "tennis",
      visibility: "public",
      slots: { open: 1, max: 2 },
      costShare: "Rp 45k",
    },
    {
      id: "m3",
      title: { id: "Pickle doubles — cari partner", en: "Pickle doubles — need a partner" },
      host: "Dina Wijaya",
      venue: "Pickle Blok M",
      when: { id: "Minggu 10:00", en: "Sun 10:00" },
      distance: "5.1 km",
      bracket: "Open",
      sport: "pickleball",
      visibility: "private",
      slots: { open: 1, max: 4 },
      costShare: "—",
    },
  ];

  const PLAYERS = [
    { name: "Rudi Hartono", bracket: "Intermediate", rating: "14.2", community: "Senayan Padel Club", played: 8 },
    { name: "Sari Dewi", bracket: "Intermediate", rating: "13.8", community: "Padel Jakarta Selatan", played: 12 },
    { name: "Marco Jourdan", bracket: "Advanced", rating: "16.1", community: "Kemang Tennis Society", played: 5 },
  ];

  let selectedId = "m1";
  let playTab = "events";

  function get(id) {
    return LISTINGS.find((x) => x.id === id) || LISTINGS[0];
  }

  function listingCard(m) {
    return (
      '<article class="mp-mabar-card mb-2" data-mabar-id="' +
      m.id +
      '">' +
      '<div class="mp-mabar-card-top">' +
      '<span class="badge badge-mabar">' +
      t("mabar.openBadge") +
      "</span>" +
      '<span class="badge badge-info">' +
      m.bracket +
      "</span>" +
      (m.visibility === "private"
        ? '<span class="badge badge-pending">' + t("mabar.private") + "</span>"
        : "") +
      "</div>" +
      "<strong>" +
      L(m.title) +
      "</strong>" +
      '<p class="text-sm text-muted">' +
      m.host +
      " · " +
      m.venue +
      " · " +
      L(m.when) +
      " · " +
      m.distance +
      "</p>" +
      '<p class="text-sm">' +
      t("mabar.slots") +
      ": <strong>" +
      m.slots.open +
      "/" +
      m.slots.max +
      "</strong>" +
      (m.costShare !== "—" ? " · " + t("mabar.costShare") + " " + m.costShare : "") +
      "</p>" +
      '<button type="button" class="btn btn-outline btn-sm btn-block mt-1" data-flow-goto="34" data-mabar-detail="' +
      m.id +
      '">' +
      t("mabar.viewDetail") +
      " →</button>" +
      "</article>"
    );
  }

  function renderBoard(root) {
    if (!root) return;
    root.innerHTML = LISTINGS.map(listingCard).join("");
  }

  function renderDetail(root, id) {
    if (!root) return;
    const m = get(id || selectedId);
    selectedId = m.id;
    root.innerHTML =
      '<div class="card mb-2">' +
      "<h2 class=\"section-title\">" +
      L(m.title) +
      "</h2>" +
      '<p class="text-sm text-muted">' +
      m.venue +
      " · " +
      L(m.when) +
      " · " +
      m.distance +
      "</p>" +
      '<div class="info-strip mb-2"><strong>' +
      t("mabar.bracketBand") +
      ":</strong> " +
      m.bracket +
      " · MP " +
      t("mabar.eligible") +
      "</div>" +
      '<p class="text-sm mb-1"><strong>' +
      t("mabar.host") +
      ":</strong> " +
      m.host +
      "</p>" +
      '<div class="mp-mabar-roster mb-2" data-mabar-roster>' +
      '<div class="mp-mabar-slot is-filled"><span>Andi P.</span><small>host</small></div>' +
      '<div class="mp-mabar-slot is-filled"><span>Budi S.</span></div>' +
      '<div class="mp-mabar-slot is-open"><span>' +
      t("mabar.openSlot") +
      "</span></div>" +
      '<div class="mp-mabar-slot is-open"><span>' +
      t("mabar.openSlot") +
      "</span></div>" +
      "</div>" +
      (m.costShare !== "—"
        ? '<p class="form-hint">' + t("mabar.costShareHint") + " " + m.costShare + "</p>"
        : "") +
      '<button type="button" class="btn btn-primary btn-block btn-lg" data-mabar-join>' +
      t("mabar.joinCta") +
      "</button>" +
      '<button type="button" class="btn btn-outline btn-block mt-1" data-flow-goto="4">' +
      t("mabar.afterJoinSubmit") +
      " →</button>" +
      "</div>";
  }

  function renderFindPlayers(root) {
    if (!root) return;
    root.innerHTML =
      '<p class="form-hint mb-2">' +
      t("mabar.findPlayersHint") +
      "</p>" +
      PLAYERS.map(
        (p) =>
          '<div class="mp-player-match-row mb-1">' +
          '<div class="avatar avatar-sm">' +
          p.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2) +
          "</div>" +
          '<div class="mp-player-match-main"><strong>' +
          p.name +
          '</strong><small>' +
          p.bracket +
          " · MP " +
          p.rating +
          " · " +
          p.community +
          "</small></div>" +
          '<button type="button" class="btn btn-outline btn-sm" data-flow-goto="36" data-challenge-target="' +
          p.name +
          '">' +
          t("challenge.issue") +
          "</button>" +
          "</div>",
      ).join("");
  }

  function setPlayTab(tab) {
    playTab = tab;
    applyPlayDiscovery();
  }

  function applyPlayDiscovery() {
    document.querySelectorAll("[data-play-discovery]").forEach((feed) => {
      const eventsPane = feed.querySelector("[data-play-pane-events]");
      const mabarPane = feed.querySelector("[data-play-pane-mabar]");
      const playersPane = feed.querySelector("[data-play-pane-players]");
      const eventFilters = feed.querySelector("[data-event-filters]");
      if (eventsPane) eventsPane.hidden = playTab !== "events";
      if (mabarPane) mabarPane.hidden = playTab !== "mabar";
      if (playersPane) playersPane.hidden = playTab !== "players";
      if (eventFilters) eventFilters.hidden = playTab !== "events";
      feed.querySelectorAll("[data-play-tab]").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.playTab === playTab);
      });
    });
  }

  function applyDOM() {
    document.querySelectorAll("[data-open-mabar-board]").forEach(renderBoard);
    document.querySelectorAll("[data-open-mabar-detail]").forEach((el) => {
      renderDetail(el, el.dataset.openMabarDetail || selectedId);
    });
    document.querySelectorAll("[data-find-players-list]").forEach(renderFindPlayers);
    applyPlayDiscovery();
  }

  function init() {
    applyDOM();
    document.body.addEventListener("click", (e) => {
      const tab = e.target.closest("[data-play-tab]");
      if (tab) {
        setPlayTab(tab.dataset.playTab);
        return;
      }
      const detail = e.target.closest("[data-mabar-detail]");
      if (detail) {
        selectedId = detail.dataset.mabarDetail;
        const goto = detail.closest("[data-flow-goto-mabar-detail]");
        if (goto && goto.dataset.flowGotoMabarDetail) {
          /* flow navigation handled by data-flow-goto on button */
        }
        document.querySelectorAll("[data-open-mabar-detail]").forEach((el) => {
          renderDetail(el, selectedId);
        });
      }
    });
    window.addEventListener("mp:lang", applyDOM);
    window.addEventListener("mp:sport", applyDOM);
  }

  return { LISTINGS, get, renderBoard, renderDetail, renderFindPlayers, setPlayTab, applyDOM, init };
})();
