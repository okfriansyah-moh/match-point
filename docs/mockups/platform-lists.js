/* Platform admin — scalable inbox & match queues (filter · search · paginate) */
window.MP_PlatformLists = (function () {
  const PAGE_SIZE = 8;
  const i18n = () => window.MP_I18N;

  function t(key, fallback) {
    return i18n() ? i18n().t(key, i18n().getLang()) : fallback;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ── Seed + generated mock data ── */
  const INBOX_SEED = [
    {
      id: "in-1",
      status: "pending",
      queue: "inbox",
      approvalType: "community",
      type: "community",
      icon: "🏘",
      title: "Padel Jakarta Selatan",
      meta: "Komunitas baru · Budi Santoso · 2 jam lalu",
      track: true,
      risk: "Low",
      sla: "18h left",
      confidence: "0.94",
      tags: [],
      detail: {
        sport: "🏓 Padel · Jakarta Selatan · Senayan · 🟢 Open Community",
        submitter: "Pengaju: Budi Santoso · @budisantoso · Trust 0.94",
        defaultNote: "Nama & venue valid, tidak duplikat dengan komunitas existing.",
      },
    },
    {
      id: "in-2",
      status: "pending",
      queue: "inbox",
      approvalType: "global",
      type: "global",
      icon: "🌍",
      title: "Indonesia Padel Masters",
      meta: "Global Tier 1 · cross-community",
      risk: "High",
      sla: "4h left",
      confidence: "0.71",
      tags: ["global"],
    },
    {
      id: "in-3",
      status: "pending",
      queue: "inbox",
      approvalType: "event",
      type: "event",
      icon: "⭐",
      title: "Featured Event",
      meta: "Senayan Padel Club · 5 jam lalu",
      risk: "Medium",
      sla: "9h left",
      confidence: "0.82",
      tags: [],
    },
    {
      id: "in-4",
      status: "approved",
      queue: "inbox",
      approvalType: "community",
      type: "community",
      icon: "🏘",
      title: "Bekasi Tennis Society",
      meta: "Disetujui oleh Tim MP · kemarin",
      risk: "Low",
      sla: "Closed",
      confidence: "0.93",
      tags: [],
    },
    {
      id: "in-5",
      status: "rejected",
      queue: "inbox",
      approvalType: "community",
      type: "community",
      icon: "🏘",
      title: '"Klub Judi Padel"',
      meta: "Nama tidak pantas · alasan dikirim ke pengaju",
      risk: "High",
      sla: "Closed",
      confidence: "0.98",
      tags: [],
    },
  ];

  const MATCH_SEED = [
    {
      id: "m-1",
      status: "pending",
      queue: "match",
      approvalType: "match_gps",
      kind: "gps",
      icon: "📍",
      title: "Budi vs Andi · 6-2, 6-1",
      meta: "GPS fail 2.3km · Padel Jakarta · 1 jam lalu",
      priority: "normal",
      risk: "Medium",
      sla: "6h left",
      confidence: "0.78",
      detail: { context: "GPS fail 2.3km · submitted from Senayan courts" },
    },
    {
      id: "m-2",
      status: "pending",
      queue: "match",
      approvalType: "match_dispute",
      kind: "dispute",
      icon: "⚖",
      title: "Sari vs Dina · skor tidak cocok",
      meta: "Dispute #D-4421 · prioritas tinggi",
      priority: "high",
      risk: "High",
      sla: "52m left",
      confidence: "0.61",
      detail: {
        scoreA: "Sari: 6-4, 6-2",
        scoreB: "Dina: 4-6, 6-3, 10-8",
        optionA: "Approve score Sari (6-4, 6-2)",
        optionB: "Approve score Dina (4-6, 6-3, 10-8)",
      },
    },
  ];

  const COMMUNITY_NAMES = [
    "Kemang Padel Society",
    "BSD Tennis Club",
    "Bandung Padel Open",
    "Surabaya Racket Hub",
    "Medan Smash Club",
    "Yogyakarta Courts",
    "Makassar Padel Union",
    "Denpasar Tennis",
  ];

  const EVENT_NAMES = [
    "Weekend Mexicano",
    "Club Championship",
    "Open Americano Night",
    "Charity Doubles",
  ];

  function hoursAgo(n) {
    if (n < 24) return n + " jam lalu";
    return Math.floor(n / 24) + " hari lalu";
  }

  function buildInboxData() {
    const items = INBOX_SEED.map((x) => ({ ...x }));
    let id = 100;
    for (let i = 0; i < 42; i++) {
      const status =
        i % 7 === 0 ? "rejected" : i % 4 === 0 ? "approved" : "pending";
      const type = i % 5 === 0 ? "event" : i % 8 === 0 ? "global" : "community";
      const icon =
        type === "event" ? "⭐" : type === "global" ? "🌍" : "🏘";
      const title =
        type === "event"
          ? EVENT_NAMES[i % EVENT_NAMES.length]
          : type === "global"
            ? "Regional Open #" + (i + 1)
            : COMMUNITY_NAMES[i % COMMUNITY_NAMES.length];
      items.push({
        id: "in-" + id++,
        status,
        queue: "inbox",
        approvalType: type === "global" ? "global" : type === "event" ? "event" : "community",
        type,
        icon,
        title,
        meta:
          (type === "community" ? "Komunitas baru · " : "") +
          "Pengaju #" +
          (i + 7) +
          " · " +
          hoursAgo(i + 3),
        risk:
          type === "global" ? "High" : i % 3 === 0 ? "Medium" : "Low",
        sla:
          status === "pending"
            ? (Math.max(1, 18 - (i % 12)) + "h left")
            : "Closed",
        confidence:
          status === "rejected"
            ? "0.96"
            : type === "global"
              ? "0.74"
              : "0.8" + (i % 10),
        tags: type === "global" ? ["global"] : [],
      });
    }
    return items;
  }

  function buildMatchData() {
    const items = MATCH_SEED.map((x) => ({ ...x }));
    const players = [
      ["Rudi", "Hartono"],
      ["Maya", "Putri"],
      ["Doni", "Wijaya"],
      ["Lina", "Sari"],
      ["Fajar", "Nugroho"],
      ["Gita", "Pratiwi"],
      ["Hendra", "Kusuma"],
      ["Ira", "Melati"],
    ];
    let id = 100;
    for (let i = 0; i < 21; i++) {
      const kind =
        i % 5 === 0 ? "dispute" : i % 3 === 0 ? "gps" : "review";
      const [a, b] = players[i % players.length];
      items.push({
        id: "m-" + id++,
        status: "pending",
        queue: "match",
        approvalType:
          kind === "dispute"
            ? "match_dispute"
            : kind === "gps"
              ? "match_gps"
              : "match_review",
        kind,
        icon: kind === "dispute" ? "⚖" : kind === "gps" ? "📍" : "🎾",
        title: a + " vs " + b + " · 6-" + (i % 4) + ", 6-" + (i % 3),
        meta:
          (kind === "gps"
            ? "GPS fail " + (1.2 + (i % 5)).toFixed(1) + "km"
            : kind === "dispute"
              ? "Dispute #D-" + (4400 + i)
              : "Butuh verifikasi skor") +
          " · " +
          hoursAgo(i + 1),
        priority: kind === "dispute" && i % 2 === 0 ? "high" : "normal",
        risk:
          kind === "dispute" ? "High" : kind === "gps" ? "Medium" : "Low",
        sla:
          kind === "dispute"
            ? (30 + (i % 8) * 15) + "m left"
            : Math.max(1, 12 - (i % 7)) + "h left",
        confidence:
          kind === "dispute"
            ? "0.6" + (i % 3)
            : kind === "gps"
              ? "0.7" + (i % 2)
              : "0.8" + (i % 2),
      });
    }
    return items;
  }

  let inboxData = buildInboxData();
  let matchData = buildMatchData();
  let allData = () => [...inboxData, ...matchData];

  function getById(id) {
    return allData().find((x) => x.id === id) || null;
  }

  function markResolved(id, status) {
    const lists = [inboxData, matchData];
    for (const list of lists) {
      const item = list.find((x) => x.id === id);
      if (item) {
        item.status = status;
        break;
      }
    }
    updateDashboardStats();
  }

  function getPendingCounts() {
    return {
      inbox: inboxData.filter((x) => x.status === "pending").length,
      match: matchData.filter((x) => x.status === "pending").length,
    };
  }

  function updateDashboardStats() {
    const c = getPendingCounts();
    document
      .querySelectorAll("[data-platform-stat-inbox-pending]")
      .forEach((el) => {
        el.textContent = String(c.inbox);
      });
    document
      .querySelectorAll("[data-platform-stat-match-pending]")
      .forEach((el) => {
        el.textContent = String(c.match);
      });
    document
      .querySelectorAll("[data-platform-stat-match-pending-inline]")
      .forEach((el) => {
        el.textContent = String(c.match);
      });
    const cardDesc = document.querySelector("[data-platform-inbox-card-desc]");
    if (cardDesc) {
      const lang = i18n()?.getLang() || "en";
      const tpl =
        lang === "id"
          ? "{n} pengajuan — komunitas baru, acara featured"
          : "{n} requests — new communities, featured events";
      cardDesc.textContent = tpl.replace("{n}", String(c.inbox));
    }
  }

  const inboxState = { filter: "pending", query: "", page: 1, showResolved: false };
  const matchState = { filter: "all", query: "", page: 1 };

  function counts(items, key) {
    const c = { pending: 0, approved: 0, rejected: 0, all: items.length };
    items.forEach((it) => {
      if (it.status) c[it.status]++;
    });
    return c;
  }

  function matchCounts(items) {
    return {
      all: items.length,
      dispute: items.filter((x) => x.kind === "dispute").length,
      gps: items.filter((x) => x.kind === "gps").length,
      review: items.filter((x) => x.kind === "review").length,
    };
  }

  function filterInbox(items) {
    const q = inboxState.query.trim().toLowerCase();
    return items.filter((it) => {
      if (it.queue === "match") return false;
      if (inboxState.filter !== "all" && it.status !== inboxState.filter)
        return false;
      if (!q) return true;
      return (
        it.title.toLowerCase().includes(q) || it.meta.toLowerCase().includes(q)
      );
    });
  }

  function filterMatches(items) {
    const q = matchState.query.trim().toLowerCase();
    return items.filter((it) => {
      if (it.queue !== "match") return false;
      if (it.status !== "pending") return false;
      if (matchState.filter !== "all" && it.kind !== matchState.filter)
        return false;
      if (!q) return true;
      return (
        it.title.toLowerCase().includes(q) || it.meta.toLowerCase().includes(q)
      );
    });
  }

  function paginate(list, page) {
    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const p = Math.min(Math.max(1, page), pages);
    const start = (p - 1) * PAGE_SIZE;
    return {
      items: list.slice(start, start + PAGE_SIZE),
      page: p,
      pages,
      total,
      from: total ? start + 1 : 0,
      to: Math.min(start + PAGE_SIZE, total),
    };
  }

  function paginationHTML(pg, prefix) {
    if (pg.pages <= 1) return "";
    const prev = pg.page > 1 ? pg.page - 1 : null;
    const next = pg.page < pg.pages ? pg.page + 1 : null;
    let nums = "";
    const window = 3;
    let start = Math.max(1, pg.page - 1);
    let end = Math.min(pg.pages, start + window - 1);
    start = Math.max(1, end - window + 1);
    for (let i = start; i <= end; i++) {
      nums +=
        '<button type="button" class="platform-page-num' +
        (i === pg.page ? " active" : "") +
        '" data-' +
        prefix +
        '-page="' +
        i +
        '">' +
        i +
        "</button>";
    }
    return (
      '<div class="platform-pagination">' +
      '<button type="button" class="platform-page-btn" data-' +
      prefix +
      '-page="' +
      (prev || pg.page) +
      '"' +
      (prev ? "" : " disabled") +
      ">" +
      t("platform.prevPage", "← Prev") +
      "</button>" +
      '<div class="platform-page-nums">' +
      nums +
      "</div>" +
      '<button type="button" class="platform-page-btn" data-' +
      prefix +
      '-page="' +
      (next || pg.page) +
      '"' +
      (next ? "" : " disabled") +
      ">" +
      t("platform.nextPage", "Next →") +
      "</button>" +
      "</div>"
    );
  }

  function rangeLabel(pg) {
    return (
      t("platform.showingRange", "Showing {from}–{to} of {total}")
        .replace("{from}", pg.from)
        .replace("{to}", pg.to)
        .replace("{total}", pg.total) +
      (pg.pages > 1
        ? " · " +
          t("platform.pageOf", "Page {page} of {pages}")
            .replace("{page}", pg.page)
            .replace("{pages}", pg.pages)
        : "")
    );
  }

  function itemStatusClass(it) {
    if (it.status === "approved") return "platform-queue-item--approved";
    if (it.status === "rejected") return "platform-queue-item--rejected";
    if (it.approvalType === "match_dispute") return "platform-queue-item--dispute";
    if (it.approvalType === "match_gps") return "platform-queue-item--gps";
    if (it.approvalType === "match_review") return "platform-queue-item--review";
    return "platform-queue-item--pending";
  }

  function triageMetaHTML(it) {
    const pairs = [
      ["platform.riskLabel", "Risk", it.risk || "Low"],
      ["platform.slaLabel", "SLA", it.sla || "12h left"],
      ["platform.confidenceLabel", "Confidence", it.confidence || "0.80"],
    ];
    return (
      '<div class="platform-triage-meta">' +
      pairs
        .map(
          ([key, fallback, value]) =>
            '<span class="triage-pill">' + t(key, fallback) + ": " + esc(value) + "</span>",
        )
        .join("") +
      "</div>"
    );
  }

  function inboxItemHTML(it, returnStep) {
    const status = it.status;
    const pending = status === "pending";
    const statusClass = itemStatusClass(it);
    const tag = pending ? "button" : "div";
    const attrs =
      pending
        ? ' type="button" class="platform-queue-item platform-queue-item--compact ' +
          statusClass +
          '" data-platform-review-id="' +
          it.id +
          '" data-platform-return-step="' +
          returnStep +
          '"'
        : ' class="platform-queue-item platform-queue-item--compact ' +
          statusClass +
          " is-static\"";
    const statusIcon =
      it.icon ||
      (status === "pending"
        ? "⏳"
        : status === "approved"
          ? "✓"
          : "✕");
    const aside = pending
      ? '<span class="btn btn-primary btn-sm">' +
        t("platform.reviewBtn", "Review →") +
        "</span>"
      : '<span class="badge badge-' +
        (status === "approved"
          ? "success"
          : status === "rejected"
            ? "danger"
            : "pending") +
        '">' +
        t(
          status === "approved"
            ? "approval.approved"
            : status === "rejected"
              ? "approval.rejected"
              : "approval.pending",
          status,
        ) +
        "</span>";
    const tags = (it.tags || [])
      .map((tg) =>
        tg === "global" ? '<span class="badge badge-global">Global</span>' : "",
      )
      .join("");
    const kindBadge =
      pending && it.queue === "match"
        ? '<span class="badge badge-warning">' +
          (it.kind === "dispute"
            ? "Dispute"
            : it.kind === "gps"
              ? "GPS"
              : "Review") +
          "</span>"
        : "";
    const track =
      pending && it.track
        ? '<div class="approval-track platform-queue-track">' +
          '<span class="approval-node done">' +
          t("approval.submitted", "Submitted") +
          "</span>" +
          '<span class="approval-arrow">→</span>' +
          '<span class="approval-node current">' +
          t("approval.pending", "Pending Review") +
          "</span></div>"
        : "";
    const priority =
      it.priority === "high"
        ? ' <span class="badge badge-danger" style="font-size:0.58rem;vertical-align:middle">' +
          t("platform.priorityHigh", "High") +
          "</span>"
        : "";
    return (
      "<" +
      tag +
      attrs +
      ">" +
      '<div class="platform-queue-status"><span class="platform-queue-status-icon">' +
      statusIcon +
      "</span></div>" +
      '<div class="platform-queue-main">' +
      '<div class="platform-queue-title">' +
      esc(it.title) +
      priority +
      "</div>" +
      '<div class="platform-queue-meta">' +
      esc(it.meta) +
      "</div>" +
      triageMetaHTML(it) +
      track +
      "</div>" +
      '<div class="platform-queue-aside">' +
      tags +
      kindBadge +
      aside +
      "</div></" +
      tag +
      ">"
    );
  }

  function searchBarHTML(prefix, placeholder, value) {
    return (
      '<div class="platform-list-toolbar">' +
      '<input type="search" class="form-input platform-list-search" data-' +
      prefix +
      '-search placeholder="' +
      esc(placeholder) +
      '" value="' +
      esc(value) +
      '" autocomplete="off" />' +
      "</div>"
    );
  }

  function toolbarHTML(prefix, filters, active, searchPh, query) {
    const chips = filters
      .map(
        ([key, label, count]) =>
          '<button type="button" class="platform-filter-chip' +
          (active === key ? " active" : "") +
          '" data-' +
          prefix +
          '-filter="' +
          key +
          '">' +
          label +
          (count != null ? ' <span class="platform-filter-count">' + count + "</span>" : "") +
          "</button>",
      )
      .join("");
    return (
      '<div class="platform-list-toolbar">' +
      '<input type="search" class="form-input platform-list-search" data-' +
      prefix +
      '-search placeholder="' +
      esc(searchPh) +
      '" value="' +
      esc(query) +
      '" autocomplete="off" />' +
      '<div class="platform-list-filters">' +
      chips +
      "</div></div>"
    );
  }

  function renderInbox(root) {
    if (!root) return;
    const all = inboxData;
    const c = counts(all);
    const pendingAll = all.filter((x) => x.status === "pending");
    const resolvedAll = all.filter((x) => x.status !== "pending");

    let body = "";
    body += '<div class="platform-inbox-summary">';
    body +=
      '<button type="button" class="platform-inbox-chip platform-inbox-chip--pending' +
      (inboxState.filter === "pending" ? " is-active" : "") +
      '" data-inbox-filter="pending"><span class="platform-inbox-chip-dot"></span><strong>' +
      c.pending +
      "</strong><span>" +
      t("approval.pending", "Pending Review") +
      "</span></button>";
    body +=
      '<button type="button" class="platform-inbox-chip platform-inbox-chip--approved' +
      (inboxState.filter === "approved" ? " is-active" : "") +
      '" data-inbox-filter="approved"><strong>' +
      c.approved +
      "</strong><span>" +
      t("approval.approved", "Approved") +
      "</span></button>";
    body +=
      '<button type="button" class="platform-inbox-chip platform-inbox-chip--rejected' +
      (inboxState.filter === "rejected" ? " is-active" : "") +
      '" data-inbox-filter="rejected"><strong>' +
      c.rejected +
      "</strong><span>" +
      t("approval.rejected", "Rejected") +
      "</span></button>";
    body +=
      '<button type="button" class="platform-inbox-chip platform-inbox-chip--all' +
      (inboxState.filter === "all" ? " is-active" : "") +
      '" data-inbox-filter="all"><strong>' +
      c.all +
      "</strong><span>" +
      t("platform.filterAll", "All") +
      "</span></button>";
    body += "</div>";

    body += searchBarHTML(
      "inbox",
      t("platform.searchInbox", "Search communities, events…"),
      inboxState.query,
    );

    const filtered = filterInbox(all);
    const pg = paginate(filtered, inboxState.page);
    body += '<p class="platform-list-range">' + rangeLabel(pg) + "</p>";

    if (!pg.items.length) {
      body +=
        '<div class="platform-list-empty">' +
        t("platform.emptyInbox", "No items match your filter.") +
        "</div>";
    } else if (inboxState.filter === "pending" || inboxState.filter === "all") {
      const pendingItems = pg.items.filter((x) => x.status === "pending");
      const resolvedOnPage = pg.items.filter((x) => x.status !== "pending");
      if (pendingItems.length) {
        body += '<section class="platform-inbox-section">';
        body +=
          '<div class="platform-inbox-section-head"><h3>' +
          t("platform.inboxNeedsReview", "Needs review") +
          '</h3><span class="badge badge-pending">' +
          c.pending +
          "</span></div>";
        body +=
          '<div class="platform-queue platform-queue--pending platform-queue--scroll">' +
          pendingItems.map((it) => inboxItemHTML(it, 2)).join("") +
          "</div></section>";
      }
      if (resolvedOnPage.length && inboxState.filter === "all") {
        body += '<section class="platform-inbox-section">';
        body +=
          '<div class="platform-inbox-section-head"><h3>' +
          t("platform.inboxResolved", "Resolved") +
          '</h3><span class="badge badge-muted">' +
          (c.approved + c.rejected) +
          "</span></div>";
        body +=
          '<div class="platform-queue platform-queue--resolved platform-queue--scroll">' +
          resolvedOnPage.map((it) => inboxItemHTML(it, 2)).join("") +
          "</div></section>";
      }
    } else {
      const queueClass =
        inboxState.filter === "approved"
          ? "platform-queue--resolved"
          : "platform-queue--resolved";
      body +=
        '<div class="platform-queue ' +
        queueClass +
        ' platform-queue--scroll">' +
        pg.items.map((it) => inboxItemHTML(it, 2)).join("") +
        "</div>";
    }

    body += paginationHTML(pg, "inbox");

    if (
      (inboxState.filter === "pending" || inboxState.filter === "all") &&
      resolvedAll.length > 0 &&
      !inboxState.showResolved &&
      inboxState.filter === "pending"
    ) {
      body +=
        '<button type="button" class="btn btn-outline btn-block mt-2" data-inbox-show-resolved>' +
        t("platform.loadResolved", "Show {n} resolved items")
          .replace("{n}", resolvedAll.length) +
        "</button>";
    }

    root.innerHTML = body;
    updateHeaderBadge(c.pending);
  }

  function renderMatches(root) {
    if (!root) return;
    const all = matchData;
    const c = matchCounts(all);
    const filtered = filterMatches(all);
    const pg = paginate(filtered, matchState.page);

    let body = "";
    body += '<div class="platform-inbox-summary">';
    body +=
      '<span class="platform-inbox-chip platform-inbox-chip--pending"><strong>' +
      c.all +
      "</strong><span>" +
      t("platform.matchesTotal", "Pending queue") +
      "</span></span>";
    body +=
      '<span class="platform-inbox-chip platform-inbox-chip--rejected"><strong>' +
      c.dispute +
      "</strong><span>" +
      t("platform.matchesDisputes", "Disputes") +
      "</span></span>";
    body +=
      '<span class="platform-inbox-chip platform-inbox-chip--pending"><strong>' +
      c.gps +
      "</strong><span>" +
      t("platform.matchesGps", "GPS fail") +
      "</span></span>";
    body += "</div>";

    body += toolbarHTML(
      "match",
      [
        ["all", t("platform.filterAll", "All"), c.all],
        ["dispute", t("platform.matchesDisputes", "Disputes"), c.dispute],
        ["gps", t("platform.matchesGps", "GPS fail"), c.gps],
        ["review", t("platform.matchesReview", "Review"), c.review],
      ],
      matchState.filter,
      t("platform.searchMatches", "Search players, dispute ID…"),
      matchState.query,
    );

    body += '<p class="platform-list-range">' + rangeLabel(pg) + "</p>";

    if (!pg.items.length) {
      body +=
        '<div class="platform-list-empty">' +
        t("platform.emptyMatches", "No matches in this filter.") +
        "</div>";
    } else {
      body +=
        '<div class="platform-queue platform-queue--matches platform-queue--scroll">' +
        pg.items.map((it) => inboxItemHTML(it, 5)).join("") +
        "</div>";
    }

    body += paginationHTML(pg, "match");
    root.innerHTML = body;

    const title = document.querySelector("[data-platform-matches-title]");
    if (title) {
      title.textContent =
        t("platform.matchesTitle", "Pending Matches") + " (" + c.all + ")";
    }
  }

  function updateHeaderBadge(n) {
    document
      .querySelectorAll('[data-platform-inbox-badge]')
      .forEach((el) => {
        el.textContent = String(n);
      });
  }

  function bind(root, kind) {
    if (!root || root.dataset.bound) return;
    root.dataset.bound = "1";
    root.addEventListener("click", (e) => {
      const filterBtn = e.target.closest("[data-inbox-filter], [data-match-filter]");
      if (filterBtn) {
        e.preventDefault();
        if (kind === "inbox") {
          inboxState.filter = filterBtn.dataset.inboxFilter;
          inboxState.page = 1;
          renderInbox(root);
        } else {
          matchState.filter = filterBtn.dataset.matchFilter;
          matchState.page = 1;
          renderMatches(root);
        }
        return;
      }
      const pageBtn = e.target.closest("[data-inbox-page], [data-match-page]");
      if (pageBtn && !pageBtn.disabled) {
        e.preventDefault();
        const p = parseInt(
          pageBtn.dataset.inboxPage || pageBtn.dataset.matchPage,
          10,
        );
        if (kind === "inbox") {
          inboxState.page = p;
          renderInbox(root);
        } else {
          matchState.page = p;
          renderMatches(root);
        }
        return;
      }
      if (e.target.closest("[data-inbox-show-resolved]")) {
        e.preventDefault();
        inboxState.showResolved = true;
        inboxState.filter = "all";
        inboxState.page = 1;
        renderInbox(root);
      }
    });
    root.addEventListener("input", (e) => {
      if (e.target.matches("[data-inbox-search]")) {
        inboxState.query = e.target.value;
        inboxState.page = 1;
        renderInbox(root);
      }
      if (e.target.matches("[data-match-search]")) {
        matchState.query = e.target.value;
        matchState.page = 1;
        renderMatches(root);
      }
    });
  }

  function init() {
    const inboxRoot = document.querySelector("[data-platform-inbox]");
    const matchRoot = document.querySelector("[data-platform-matches]");
    if (inboxRoot) {
      bind(inboxRoot, "inbox");
      renderInbox(inboxRoot);
    }
    if (matchRoot) {
      bind(matchRoot, "match");
      renderMatches(matchRoot);
    }
    updateDashboardStats();
    window.addEventListener("mp:lang", () => {
      if (inboxRoot) renderInbox(inboxRoot);
      if (matchRoot) renderMatches(matchRoot);
    });
  }

  return { init, renderInbox, renderMatches, getById, markResolved, updateDashboardStats };
})();
