/* Match Point — community catalog for discovery & page resolver (mockup) */
window.MP_Communities = (function () {
  const STORAGE_KEY = "mp-view-community";

  const COMMUNITIES = {
    senayan: {
      id: "senayan",
      name: "Senayan Padel Club",
      sport: "padel",
      type: "club",
      sportIcon: "🏓",
      logo: "SP",
      members: 88,
      matches: 412,
      events: 3,
      distance: 1.2,
      city: "Senayan, Jakarta Selatan",
      access: "open",
      filterTags: ["padel", "open", "jakarta"],
      fitTagline: "Pemain campuran yang mau sparring rutin dan cepat kenal member aktif.",
      fitLevel: "Level campur · newcomer friendly",
      fitCadence: "Americano + open play tiap minggu",
      fitOutcome: "Biasanya langsung masuk event sosial dan ladder lokal.",
      fitChips: ["Mixed levels", "Weekly events", "Competitive ladder"],
      bocMeta: { season: 1, group: "A", participant: true },
      sparringMeta: { mode: "ranked", communities: ["senayan", "kemang", "bsd"], badges: ["sparring_ranked"] },
    },
    kemang: {
      id: "kemang",
      name: "Kemang Tennis Society",
      sport: "tennis",
      type: "club",
      sportIcon: "🎾",
      logo: "KT",
      members: 64,
      matches: 289,
      events: 2,
      distance: 2.8,
      city: "Kemang, Jakarta Selatan",
      access: "open",
      filterTags: ["tennis", "open", "jakarta"],
      fitTagline: "Tennis sosial dengan ritme main konsisten dan member kota selatan.",
      fitLevel: "Beginner sampai intermediate",
      fitCadence: "Social hit tiap akhir pekan",
      fitOutcome: "Cocok buat cari partner tetap dan naik confidence pelan-pelan.",
      fitChips: ["Social play", "Weekly events", "Open access"],
    },
    blokm: {
      id: "blokm",
      name: "Pickle Blok M",
      sport: "pickleball",
      type: "academy",
      sportIcon: "🥎",
      logo: "PB",
      members: 31,
      matches: 156,
      events: 1,
      distance: 3.5,
      city: "Blok M, Jakarta Selatan",
      access: "open",
      filterTags: ["pickleball", "open", "jakarta"],
      fitTagline: "Komunitas santai untuk coba pickleball tanpa tekanan rank besar.",
      fitLevel: "Open for first-timers",
      fitCadence: "Sesi santai mingguan",
      fitOutcome: "Bagus untuk match pertama dan bangun rating awal.",
      fitChips: ["Social play", "Mixed levels", "Weekly events"],
    },
    bsd: {
      id: "bsd",
      name: "BSD Padel House",
      sport: "padel",
      type: "venue",
      sportIcon: "🏓",
      logo: "BP",
      members: 120,
      matches: 620,
      events: 4,
      distance: 18,
      city: "BSD, Tangerang",
      access: "invite",
      filterTags: ["padel", "jakarta"],
      fitTagline: "Padel yang lebih kompetitif dengan akses lewat jaringan member.",
      fitLevel: "Intermediate sampai advanced",
      fitCadence: "League + challenge sessions",
      fitOutcome: "Pas untuk pemain yang cari sparring serius dan level naik.",
      fitChips: ["Invite-led access", "Competitive ladder", "Advanced mix"],
    },
  };

  // Community type taxonomy (four-journey OS): club · academy · venue · league
  const TYPE_LABELS = {
    club: { id: "Klub", en: "Club" },
    academy: { id: "Akademi", en: "Academy" },
    venue: { id: "Venue", en: "Venue" },
    league: { id: "Liga", en: "League" },
  };

  function typeLabel(c) {
    const entry = TYPE_LABELS[c.type] || TYPE_LABELS.club;
    const lang = window.MP_I18N ? MP_I18N.getLang() : "en";
    return entry[lang] || entry.en;
  }

  function getByName(name) {
    const n = String(name || "").trim().toLowerCase();
    return (
      Object.values(COMMUNITIES).find((c) => c.name.toLowerCase() === n) ||
      COMMUNITIES.senayan
    );
  }

  function renderFitChips(c) {
    const chipMap = {
      "Mixed levels": "find.fitOpenLevels",
      "Weekly events": "find.fitWeekly",
      "Competitive ladder": "find.fitCompetitive",
      "Invite-led access": "find.fitInviteOnly",
      "Social play": "find.fitSocial",
      "Advanced mix": "find.fitCompetitive",
      "Open access": "find.filterOpen",
    };
    return (c.fitChips || [])
      .map((label) => {
        const key = chipMap[label];
        const text = window.MP_I18N && key ? MP_I18N.t(key) : label;
        return '<span class="fit-chip">' + text + "</span>";
      })
      .join("");
  }

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

    root.querySelectorAll(".cp-name").forEach((el) => {
      el.textContent = c.name;
    });

    const logo = root.querySelector(".cp-logo");
    if (logo) logo.textContent = c.logo;

    const meta = root.querySelector(".cp-meta");
    if (meta)
      meta.textContent = `${c.sportIcon} ${c.sport.charAt(0).toUpperCase() + c.sport.slice(1)} · ${typeLabel(c)} · ${c.city} · ${accessLabel}`;

    root.querySelectorAll("[data-community-type-badge]").forEach((el) => {
      el.textContent = typeLabel(c);
    });

    root.querySelectorAll("[data-community-fit-tagline]").forEach((el) => {
      el.textContent = c.fitTagline || "";
    });
    root.querySelectorAll("[data-community-fit-level]").forEach((el) => {
      el.textContent = c.fitLevel || "";
    });
    root.querySelectorAll("[data-community-fit-cadence]").forEach((el) => {
      el.textContent = c.fitCadence || "";
    });
    root.querySelectorAll("[data-community-fit-outcome]").forEach((el) => {
      el.textContent = c.fitOutcome || "";
    });
    root.querySelectorAll("[data-community-fit-row]").forEach((el) => {
      el.innerHTML = renderFitChips(c);
    });

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

    rows.forEach((row) => {
      const c = row.dataset.communityView
        ? get(row.dataset.communityView)
        : getByName(row.dataset.communityName);
      const fitRow = row.querySelector("[data-community-fit-row]");
      if (fitRow) fitRow.innerHTML = renderFitChips(c);
    });

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
    const activityChips = container.querySelectorAll("[data-activity-filter]");

    function applyEventFilter() {
      const active = container.querySelector("[data-event-filter].active");
      const key = active ? active.dataset.eventFilter : "all";
      const actActive = container.querySelector("[data-activity-filter].active");
      const actKey = actActive ? actActive.dataset.activityFilter : "all";

      cards.forEach((card) => {
        const tags = (card.dataset.eventTags || "").split(",");
        const activity = card.dataset.activityType || "social";
        let show = false;
        if (key === "all") show = !tags.includes("past");
        else show = tags.includes(key);
        if (show && actKey !== "all") show = activity === actKey;
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

    activityChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        activityChips.forEach((c) => c.classList.remove("active"));
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

  return { COMMUNITIES, get, setView, getViewId, typeLabel, applyCommunityPage, initFilters, initEventFeed, init };
})();
