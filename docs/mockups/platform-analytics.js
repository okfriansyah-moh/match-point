/* Platform admin — comprehensive analytics across the Match Point lifecycle */
window.MP_PlatformAnalytics = (function () {
  const i18n = () => window.MP_I18N;

  function t(key, fallback, vars) {
    if (!i18n()) return fallback;
    let s = i18n().t(key, i18n().getLang());
    if (vars) {
      Object.keys(vars).forEach((k) => {
        s = s.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]);
      });
    }
    return s || fallback;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  const DATA = {
    "7d": {
      kpis: [
        { val: "10,842", lbl: "platform.analytics.players", delta: "+128" },
        { val: "523", lbl: "platform.analytics.communities", delta: "+4" },
        { val: "847", lbl: "platform.analytics.matches", delta: "+62" },
        { val: "2,410", lbl: "platform.analytics.dau", delta: "+8%" },
        { val: "2.1%", lbl: "platform.analytics.disputeRatio", delta: "-0.3%" },
        { val: "94%", lbl: "platform.analytics.gpsPass", delta: "+1%" },
      ],
      registrations: [42, 38, 51, 45, 48, 55, 49],
      matchesDaily: [98, 112, 105, 128, 119, 134, 151],
      matchStatus: [
        { label: "Verified", pct: 78, color: "var(--success)" },
        { label: "Pending", pct: 12, color: "var(--warning)" },
        { label: "Dispute", pct: 6, color: "var(--danger)" },
        { label: "GPS fail", pct: 4, color: "#eab308" },
      ],
      sports: [
        { label: "Padel", pct: 58, color: "#e11d48" },
        { label: "Tennis", pct: 32, color: "#0ea5e9" },
        { label: "Pickleball", pct: 10, color: "#22c55e" },
      ],
      events: [
        { label: "Americano", n: 84 },
        { label: "Mexicano", n: 62 },
        { label: "Singles", n: 41 },
        { label: "Doubles", n: 118 },
        { label: "Global", n: 6 },
      ],
      funnel: [
        { label: "Registered", n: 128, pct: 100 },
        { label: "Phone verified", n: 112, pct: 88 },
        { label: "Joined community", n: 89, pct: 70 },
        { label: "Logged match", n: 64, pct: 50 },
      ],
      approvals: [
        { label: "Inbox approved", n: 18 },
        { label: "Inbox rejected", n: 4 },
        { label: "Match approved", n: 41 },
        { label: "Disputes resolved", n: 6 },
      ],
      rankMoves: { up: 312, down: 198, provisional: 47 },
      activity: [
        { time: "10:42", type: "match", text: "Budi vs Andi · verified · Padel Jakarta" },
        { time: "10:38", type: "approval", text: "Community approved · BSD Tennis Club" },
        { time: "10:31", type: "dispute", text: "Dispute #D-4421 resolved · score Budi" },
        { time: "10:18", type: "register", text: "+3 new players · OTP verified" },
        { time: "10:05", type: "event", text: "Americano Minggu · 16 players · Kemang" },
        { time: "09:52", type: "rank", text: "Global rank update · Tier 2 tournament" },
        { time: "09:41", type: "gps", text: "GPS fail flagged · 2.3 km · auto-queued" },
        { time: "09:28", type: "community", text: "New community submitted · Bandung Padel Open" },
      ],
    },
    "30d": {
      kpis: [
        { val: "10,842", lbl: "platform.analytics.players", delta: "+412" },
        { val: "523", lbl: "platform.analytics.communities", delta: "+18" },
        { val: "3,241", lbl: "platform.analytics.matches", delta: "+284" },
        { val: "2,410", lbl: "platform.analytics.dau", delta: "+12%" },
        { val: "2.4%", lbl: "platform.analytics.disputeRatio", delta: "-0.1%" },
        { val: "93%", lbl: "platform.analytics.gpsPass", delta: "±0%" },
      ],
      registrations: [38, 42, 45, 40, 48, 52, 49, 55, 51, 47, 53, 58, 54, 50],
      matchesDaily: [95, 102, 108, 115, 120, 118, 125, 130, 128, 135, 140, 138, 142, 151],
      matchStatus: [
        { label: "Verified", pct: 76, color: "var(--success)" },
        { label: "Pending", pct: 14, color: "var(--warning)" },
        { label: "Dispute", pct: 7, color: "var(--danger)" },
        { label: "GPS fail", pct: 3, color: "#eab308" },
      ],
      sports: [
        { label: "Padel", pct: 56, color: "#e11d48" },
        { label: "Tennis", pct: 34, color: "#0ea5e9" },
        { label: "Pickleball", pct: 10, color: "#22c55e" },
      ],
      events: [
        { label: "Americano", n: 312 },
        { label: "Mexicano", n: 248 },
        { label: "Singles", n: 156 },
        { label: "Doubles", n: 428 },
        { label: "Global", n: 14 },
      ],
      funnel: [
        { label: "Registered", n: 412, pct: 100 },
        { label: "Phone verified", n: 358, pct: 87 },
        { label: "Joined community", n: 291, pct: 71 },
        { label: "Logged match", n: 224, pct: 54 },
      ],
      approvals: [
        { label: "Inbox approved", n: 72 },
        { label: "Inbox rejected", n: 14 },
        { label: "Match approved", n: 186 },
        { label: "Disputes resolved", n: 23 },
      ],
      rankMoves: { up: 1240, down: 890, provisional: 182 },
      activity: [
        { time: "Kemarin", type: "event", text: "Indonesia Padel Masters · reg 48/64" },
        { time: "Kemarin", type: "approval", text: "Featured event approved · Senayan" },
        { time: "2 hari", type: "match", text: "847 matches logged platform-wide (7d rolling)" },
        { time: "3 hari", type: "community", text: "12 communities pending → 8 approved" },
        { time: "5 hari", type: "rank", text: "Monthly Global snapshot · padel" },
        { time: "1 minggu", type: "dispute", text: "Dispute ratio 2.4% · below threshold" },
      ],
    },
    "90d": {
      kpis: [
        { val: "10,842", lbl: "platform.analytics.players", delta: "+1,204" },
        { val: "523", lbl: "platform.analytics.communities", delta: "+52" },
        { val: "9,847", lbl: "platform.analytics.matches", delta: "+892" },
        { val: "2,410", lbl: "platform.analytics.dau", delta: "+18%" },
        { val: "2.6%", lbl: "platform.analytics.disputeRatio", delta: "+0.2%" },
        { val: "92%", lbl: "platform.analytics.gpsPass", delta: "-1%" },
      ],
      registrations: [35, 38, 42, 45, 48, 50, 52, 55, 54, 58, 56, 60],
      matchesDaily: [88, 92, 95, 100, 105, 110, 115, 118, 122, 128, 132, 140],
      matchStatus: [
        { label: "Verified", pct: 74, color: "var(--success)" },
        { label: "Pending", pct: 15, color: "var(--warning)" },
        { label: "Dispute", pct: 8, color: "var(--danger)" },
        { label: "GPS fail", pct: 3, color: "#eab308" },
      ],
      sports: [
        { label: "Padel", pct: 55, color: "#e11d48" },
        { label: "Tennis", pct: 35, color: "#0ea5e9" },
        { label: "Pickleball", pct: 10, color: "#22c55e" },
      ],
      events: [
        { label: "Americano", n: 892 },
        { label: "Mexicano", n: 704 },
        { label: "Singles", n: 412 },
        { label: "Doubles", n: 1180 },
        { label: "Global", n: 28 },
      ],
      funnel: [
        { label: "Registered", n: 1204, pct: 100 },
        { label: "Phone verified", n: 1042, pct: 87 },
        { label: "Joined community", n: 812, pct: 67 },
        { label: "Logged match", n: 628, pct: 52 },
      ],
      approvals: [
        { label: "Inbox approved", n: 198 },
        { label: "Inbox rejected", n: 38 },
        { label: "Match approved", n: 542 },
        { label: "Disputes resolved", n: 68 },
      ],
      rankMoves: { up: 3840, down: 2910, provisional: 520 },
      activity: [
        { time: "Q2", type: "rank", text: "Global rank snapshots · 5 sports" },
        { time: "90 hari", type: "community", text: "+52 communities · 523 total active" },
        { time: "90 hari", type: "match", text: "9,847 matches · 2.6% dispute rate" },
        { time: "Trend", type: "register", text: "Player growth +12.4% QoQ" },
      ],
    },
  };

  let period = "30d";

  function barChart(bars, maxH) {
    const max = Math.max(...bars, 1);
    return (
      '<div class="pa-bars" role="img">' +
      bars
        .map((v) => {
          const h = Math.round((v / max) * (maxH || 100));
          return '<div class="pa-bar-col"><div class="pa-bar-fill" style="height:' + h + '%"></div></div>';
        })
        .join("") +
      "</div>"
    );
  }

  function donutChart(segments) {
    let acc = 0;
    const stops = segments
      .map((s) => {
        const start = acc;
        acc += s.pct;
        return s.color + " " + start + "% " + acc + "%";
      })
      .join(", ");
    const legend = segments
      .map(
        (s) =>
          '<div class="pa-legend-item"><span class="pa-legend-dot" style="background:' +
          s.color +
          '"></span><span>' +
          esc(s.label) +
          '</span><strong>' +
          s.pct +
          "%</strong></div>",
      )
      .join("");
    return (
      '<div class="pa-donut-wrap">' +
      '<div class="pa-donut" style="background:conic-gradient(' +
      stops +
      ')"></div>' +
      '<div class="pa-legend">' +
      legend +
      "</div></div>"
    );
  }

  function hBarChart(items) {
    const max = Math.max(...items.map((i) => i.n), 1);
    return (
      '<div class="pa-hbars">' +
      items
        .map((it) => {
          const w = Math.round((it.n / max) * 100);
          return (
            '<div class="pa-hbar-row"><span class="pa-hbar-label">' +
            esc(it.label) +
            '</span><div class="pa-hbar-track"><div class="pa-hbar-fill" style="width:' +
            w +
            '%"></div></div><span class="pa-hbar-val">' +
            it.n +
            "</span></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function funnelHTML(steps) {
    return (
      '<div class="pa-funnel">' +
      steps
        .map(
          (s) =>
            '<div class="pa-funnel-step" style="width:' +
            s.pct +
            '%"><span class="pa-funnel-n">' +
            s.n +
            '</span><span class="pa-funnel-lbl">' +
            esc(s.label) +
            "</span></div>",
        )
        .join("") +
      "</div>"
    );
  }

  function activityIcon(type) {
    const map = {
      match: "🎾",
      approval: "✓",
      dispute: "⚖",
      register: "👤",
      event: "🎯",
      rank: "🏆",
      gps: "📍",
      community: "🏘",
    };
    return map[type] || "•";
  }

  function syncInboxCounts(d) {
    if (!window.MP_PlatformLists) return d;
    try {
      const inbox = MP_PlatformLists.getInboxItems?.() || [];
      const pending = inbox.filter((i) => i.status === "pending").length;
      if (pending && d.kpis) {
        /* keep KPIs as platform-wide; queue chip uses live count in header */
      }
    } catch (_) {}
    return d;
  }

  function render(root) {
    if (!root) return;
    const d = syncInboxCounts(DATA[period] || DATA["30d"]);

    root.innerHTML =
      '<div class="pa-toolbar">' +
      '<div class="pa-period">' +
      ["7d", "30d", "90d"]
        .map(
          (p) =>
            '<button type="button" class="filter-chip' +
            (period === p ? " active" : "") +
            '" data-pa-period="' +
            p +
            '">' +
            t("platform.analytics.period" + p, p) +
            "</button>",
        )
        .join("") +
      "</div>" +
      '<span class="text-sm text-muted">' +
      t("platform.analytics.updated", "Updated just now") +
      "</span></div>" +

      '<div class="pa-kpi-grid">' +
      d.kpis
        .map(
          (k) =>
            '<div class="stat-box pa-kpi"><div class="stat-val">' +
            esc(k.val) +
            '</div><div class="stat-lbl">' +
            t(k.lbl, k.lbl) +
            '</div><div class="pa-kpi-delta">' +
            esc(k.delta) +
            "</div></div>",
        )
        .join("") +
      "</div>" +

      '<p class="pa-section-label">' +
      t("platform.analytics.sectionLifecycle", "User lifecycle") +
      "</p>" +
      '<div class="pa-grid-2">' +
      '<div class="card pa-chart-card"><h3 class="pa-chart-title">' +
      t("platform.analytics.registrations", "New registrations") +
      "</h3>" +
      barChart(d.registrations) +
      '<p class="form-hint">' +
      t("platform.analytics.registrationsHint", "OTP-verified signups per day") +
      "</p></div>" +
      '<div class="card pa-chart-card"><h3 class="pa-chart-title">' +
      t("platform.analytics.onboardingFunnel", "Onboarding funnel") +
      "</h3>" +
      funnelHTML(d.funnel) +
      "</div></div>" +

      '<p class="pa-section-label">' +
      t("platform.analytics.sectionMatch", "Match pipeline") +
      "</p>" +
      '<div class="pa-grid-2">' +
      '<div class="card pa-chart-card"><h3 class="pa-chart-title">' +
      t("platform.analytics.matchesLogged", "Matches logged") +
      "</h3>" +
      barChart(d.matchesDaily) +
      '<p class="form-hint">' +
      t("platform.analytics.matchesHint", "Submit → verify → rank update") +
      "</p></div>" +
      '<div class="card pa-chart-card"><h3 class="pa-chart-title">' +
      t("platform.analytics.matchStatus", "Match status mix") +
      "</h3>" +
      donutChart(d.matchStatus) +
      "</div></div>" +

      '<p class="pa-section-label">' +
      t("platform.analytics.sectionCommunity", "Communities & sports") +
      "</p>" +
      '<div class="pa-grid-2">' +
      '<div class="card pa-chart-card"><h3 class="pa-chart-title">' +
      t("platform.analytics.sportMix", "Activity by sport") +
      "</h3>" +
      donutChart(d.sports) +
      "</div>" +
      '<div class="card pa-chart-card"><h3 class="pa-chart-title">' +
      t("platform.analytics.eventsByType", "Events by format") +
      "</h3>" +
      hBarChart(d.events) +
      "</div></div>" +

      '<p class="pa-section-label">' +
      t("platform.analytics.sectionOps", "Platform operations") +
      "</p>" +
      '<div class="pa-grid-2">' +
      '<div class="card pa-chart-card"><h3 class="pa-chart-title">' +
      t("platform.analytics.adminThroughput", "Admin actions") +
      "</h3>" +
      hBarChart(d.approvals) +
      "</div>" +
      '<div class="card pa-chart-card"><h3 class="pa-chart-title">' +
      t("platform.analytics.rankActivity", "Rank point movements") +
      "</h3>" +
      '<div class="pa-rank-stats">' +
      '<div class="pa-rank-stat up"><span class="pa-rank-n">+' +
      d.rankMoves.up +
      '</span><span>' +
      t("platform.analytics.rankUp", "Points gained") +
      "</span></div>" +
      '<div class="pa-rank-stat down"><span class="pa-rank-n">-' +
      d.rankMoves.down +
      '</span><span>' +
      t("platform.analytics.rankDown", "Points lost") +
      "</span></div>" +
      '<div class="pa-rank-stat prov"><span class="pa-rank-n">' +
      d.rankMoves.provisional +
      '</span><span>' +
      t("platform.analytics.provisional", "Provisional players") +
      "</span></div></div></div></div>" +

      '<p class="pa-section-label">' +
      t("platform.analytics.sectionActivity", "Live activity feed") +
      "</p>" +
      '<div class="card pa-activity-card"><table class="pa-table"><thead><tr><th>' +
      t("platform.analytics.colTime", "Time") +
      "</th><th>" +
      t("platform.analytics.colEvent", "Event") +
      "</th></tr></thead><tbody>" +
      d.activity
        .map(
          (a) =>
            "<tr><td class=\"pa-time\">" +
            esc(a.time) +
            '</td><td><span class="pa-act-icon">' +
            activityIcon(a.type) +
            "</span> " +
            esc(a.text) +
            "</td></tr>",
        )
        .join("") +
      "</tbody></table></div>";
  }

  function bind(root) {
    if (!root || root.dataset.paBound) return;
    root.dataset.paBound = "1";
    root.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-pa-period]");
      if (!btn) return;
      period = btn.dataset.paPeriod;
      render(root);
    });
  }

  function init() {
    const root = document.querySelector("[data-platform-analytics]");
    if (root) {
      bind(root);
      render(root);
    }
  }

  function onStep(step) {
    if (step === 6) {
      const root = document.querySelector("[data-platform-analytics]");
      if (root) render(root);
    }
  }

  return { init, render, onStep };
})();
