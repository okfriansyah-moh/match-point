/* Match Point — community catalog for discovery & page resolver (mockup) */
window.MP_Communities = (function () {
  const STORAGE_KEY = "mp-view-community";

  const COMMUNITIES = {
    senayan: {
      id: "senayan",
      name: "Senayan Padel Club",
      sport: "padel",
      sportIcon: "🏓",
      logo: "SP",
      members: 88,
      matches: 412,
      events: 3,
      distance: 1.2,
      city: "Senayan, Jakarta Selatan",
      access: "open",
      filterTags: ["padel", "open", "jakarta"],
    },
    kemang: {
      id: "kemang",
      name: "Kemang Tennis Society",
      sport: "tennis",
      sportIcon: "🎾",
      logo: "KT",
      members: 64,
      matches: 289,
      events: 2,
      distance: 2.8,
      city: "Kemang, Jakarta Selatan",
      access: "open",
      filterTags: ["tennis", "open", "jakarta"],
    },
    blokm: {
      id: "blokm",
      name: "Pickle Blok M",
      sport: "pickleball",
      sportIcon: "🥎",
      logo: "PB",
      members: 31,
      matches: 156,
      events: 1,
      distance: 3.5,
      city: "Blok M, Jakarta Selatan",
      access: "open",
      filterTags: ["pickleball", "open", "jakarta"],
    },
    bsd: {
      id: "bsd",
      name: "BSD Padel House",
      sport: "padel",
      sportIcon: "🏓",
      logo: "BP",
      members: 120,
      matches: 620,
      events: 4,
      distance: 18,
      city: "BSD, Tangerang",
      access: "invite",
      filterTags: ["padel", "jakarta"],
    },
  };

  function setView(id) {
    try {
      sessionStorage.setItem(STORAGE_KEY, id);
    } catch (_) {
      /* no-op */
    }
  }

  function getViewId() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) || "senayan";
    } catch (_) {
      return "senayan";
    }
  }

  function get(id) {
    return COMMUNITIES[id] || COMMUNITIES.senayan;
  }

  function applyCommunityPage(root) {
    if (!root) return;
    const c = get(getViewId());
    const accessLabel = c.access === "open" ? "🟢 Open" : "🔒 Invite only";

    root.querySelectorAll(".cp-name, .app-header-left .app-logo").forEach((el) => {
      if (el.classList.contains("cp-name") || el.closest(".app-header-left"))
        el.textContent = c.name;
    });
    const headerLogo = root.querySelector(".app-header-left .app-logo");
    if (headerLogo) headerLogo.textContent = c.name;

    const badge = root.querySelector(".app-header .badge");
    if (badge) badge.textContent = c.sportIcon + " " + c.sport.charAt(0).toUpperCase() + c.sport.slice(1);

    const logo = root.querySelector(".cp-logo");
    if (logo) logo.textContent = c.logo;

    const meta = root.querySelector(".cp-meta");
    if (meta)
      meta.textContent = `${c.sportIcon} ${c.sport.charAt(0).toUpperCase() + c.sport.slice(1)} · ${c.city} · ${accessLabel}`;

    root.querySelectorAll("[data-club-join]").forEach((btn) => {
      btn.dataset.clubJoin = c.name;
    });
    root.querySelectorAll("[data-show-if-member-of]").forEach((el) => {
      el.dataset.showIfMemberOf = c.name;
    });
    root.querySelectorAll("[data-hide-if-member-of]").forEach((el) => {
      el.dataset.hideIfMemberOf = c.name;
    });

    const stats = root.querySelectorAll(".community-stats .stat-val");
    if (stats.length >= 4) {
      stats[0].textContent = c.members;
      stats[1].textContent = c.matches;
      stats[2].textContent = c.events;
      stats[3].textContent = c.distance;
    }
  }

  function initFilters(container) {
    if (!container) return;
    const rows = container.querySelectorAll("[data-community-row]");
    const chips = container.querySelectorAll(".filter-chip[data-filter]");

    function applyFilters() {
      const active = container.querySelector(".filter-chip.active");
      const key = active ? active.dataset.filter : "all";
      const q = (container.querySelector(".community-search")?.value || "").toLowerCase();

      const sorted = [...rows].sort((a, b) => {
        const da = parseFloat(a.dataset.distance || "999");
        const db = parseFloat(b.dataset.distance || "999");
        return da - db;
      });
      const list = container.querySelector(".community-list");
      if (list) sorted.forEach((r) => list.appendChild(r));

      rows.forEach((row) => {
        const tags = (row.dataset.filterTags || "").split(",");
        const name = (row.dataset.communityName || "").toLowerCase();
        const matchFilter = key === "all" || tags.includes(key);
        const matchSearch = !q || name.includes(q);
        row.hidden = !(matchFilter && matchSearch);
      });
    }

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        applyFilters();
      });
    });

    const search = container.querySelector(".community-search");
    if (search) search.addEventListener("input", applyFilters);

    applyFilters();
  }

  function initEventFeed(container) {
    if (!container) return;
    const cards = container.querySelectorAll("[data-event-card]");
    const chips = container.querySelectorAll("[data-event-filter]");

    function applyEventFilter() {
      const active = container.querySelector("[data-event-filter].active");
      const key = active ? active.dataset.eventFilter : "all";

      cards.forEach((card) => {
        const tags = (card.dataset.eventTags || "").split(",");
        let show = false;
        if (key === "all") show = !tags.includes("past");
        else show = tags.includes(key);
        card.hidden = !show;
      });
    }

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        applyEventFilter();
      });
    });

    applyEventFilter();
  }

  function init() {
    document.querySelectorAll("[data-community-page]").forEach(applyCommunityPage);
    document.querySelectorAll("[data-find-community]").forEach(initFilters);
    document.querySelectorAll("[data-events-feed]").forEach(initEventFeed);
  }

  return { COMMUNITIES, get, setView, getViewId, applyCommunityPage, initFilters, initEventFeed, init };
})();
