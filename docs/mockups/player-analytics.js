/* Match Point — WPR-style player analytics (confidence, history chart, match stats) */
window.MP_PlayerAnalytics = (function () {
  const STATS_KEY = "mp-match-stats";

  const DEMO_MATCHES = [
    { id: "m1", sport: "padel", result: "w", score: "6-4, 3-6, 10-7", tiebreak: true, ranked: true, ts: Date.now() - 2 * 86400000 },
    { id: "m2", sport: "padel", result: "w", score: "6-2, 6-1", tiebreak: false, ranked: true, ts: Date.now() - 5 * 86400000 },
    { id: "m3", sport: "padel", result: "l", score: "4-6, 6-4, 8-10", tiebreak: true, ranked: true, ts: Date.now() - 8 * 86400000 },
    { id: "m4", sport: "padel", result: "w", score: "6-3, 6-4", tiebreak: false, ranked: false, ts: Date.now() - 12 * 86400000 },
    { id: "m5", sport: "tennis", result: "w", score: "7-6, 6-4", tiebreak: true, ranked: true, ts: Date.now() - 3 * 86400000 },
    { id: "m6", sport: "tennis", result: "l", score: "3-6, 4-6", tiebreak: false, ranked: true, ts: Date.now() - 10 * 86400000 },
    { id: "m7", sport: "badminton", result: "w", score: "21-18, 21-15", tiebreak: false, ranked: true, ts: Date.now() - 4 * 86400000 },
  ];

  function t(key) {
    return window.MP_I18N ? MP_I18N.t(key) : key;
  }

  function getSport() {
    return (window.MP_Sport && MP_Sport.get()) || "padel";
  }

  function loadMatches() {
    try {
      const raw = JSON.parse(localStorage.getItem(STATS_KEY) || "null");
      if (raw && raw.length) return raw;
    } catch (_) {}
    return DEMO_MATCHES.slice();
  }

  function saveMatches(list) {
    localStorage.setItem(STATS_KEY, JSON.stringify(list));
  }

  function recordMatch(entry) {
    const list = loadMatches();
    list.unshift({ ...entry, ts: entry.ts || Date.now() });
    saveMatches(list.slice(0, 200));
    return list;
  }

  function aggregateStats(sport) {
    sport = sport || getSport();
    const matches = loadMatches().filter((m) => m.sport === sport);
    let w = 0;
    let l = 0;
    let tbW = 0;
    let tbL = 0;
    let practiceW = 0;
    let practiceL = 0;
    let rankedW = 0;
    let rankedL = 0;
    let streak = 0;
    let longestStreak = 0;
    const weekAgo = Date.now() - 7 * 86400000;
    let weekCount = 0;

    matches.forEach((m) => {
      if (m.ts >= weekAgo) weekCount++;
      const win = m.result === "w";
      if (win) {
        w++;
        streak++;
        longestStreak = Math.max(longestStreak, streak);
      } else {
        l++;
        streak = 0;
      }
      if (m.tiebreak) {
        if (win) tbW++;
        else tbL++;
      }
      if (m.ranked) {
        if (win) rankedW++;
        else rankedL++;
      } else {
        if (win) practiceW++;
        else practiceL++;
      }
    });

    const total = w + l;
    return {
      wins: w,
      losses: l,
      total,
      winPct: total ? Math.round((w / total) * 100) : 0,
      longestStreak,
      tiebreakW: tbW,
      tiebreakL: tbL,
      practiceW,
      practiceL,
      rankedW,
      rankedL,
      weekCount,
    };
  }

  function renderConfidenceCard(container, sport) {
    if (!container || !window.MP_Rank) return;
    sport = sport || getSport();
    const disp = MP_Rank.getMpRatingDisplay(sport);
    const conf = MP_Rank.getConfidenceScore(sport);
    const lang = (window.MP_I18N && MP_I18N.getLang()) || "id";
    const unrated = disp.state === "unrated";

    container.innerHTML =
      '<div class="mp-confidence-card' +
      (disp.stable ? " mp-confidence-stable" : "") +
      '">' +
      '<div class="mp-confidence-rating">' +
      (unrated
        ? '<span class="mp-confidence-value">' + (lang === "en" ? "Unrated" : "Belum dinilai") + "</span>"
        : '<span class="mp-confidence-value">' +
          disp.mpRating.toFixed(2) +
          (disp.stable ? " ✓" : "") +
          "</span>") +
      "</div>" +
      (conf != null
        ? '<p class="mp-confidence-sub"><span class="mp-confidence-pct">' +
          conf +
          "%</span> <span data-mp-confidence-label></span></p>"
        : '<p class="mp-confidence-sub text-muted">' +
          t("rank.confidencePending") +
          "</p>") +
      (disp.refHint ? '<p class="mp-confidence-ref text-muted">' + disp.refHint + "</p>" : "") +
      "</div>";
    MP_Rank.applyDOM();
  }

  function renderRatingChart(container, sport, range) {
    if (!container || !window.MP_Rank) return;
    sport = sport || getSport();
    range = range || container.dataset.chartRange || "1y";
    const pts = MP_Rank.getRatingHistory(sport, range);
    const w = 320;
    const h = 120;
    const pad = { t: 12, r: 8, b: 24, l: 36 };
    const innerW = w - pad.l - pad.r;
    const innerH = h - pad.t - pad.b;

    if (!pts.length) {
      container.innerHTML = '<p class="form-hint">' + t("rank.historyEmpty") + "</p>";
      return;
    }

    const vals = pts.map((p) => p.mpRating);
    const minV = Math.min(...vals) - 0.3;
    const maxV = Math.max(...vals) + 0.3;
    const span = maxV - minV || 1;
    const coords = pts.map((p, i) => {
      const x = pad.l + (pts.length === 1 ? innerW / 2 : (i / (pts.length - 1)) * innerW);
      const y = pad.t + innerH - ((p.mpRating - minV) / span) * innerH;
      return x.toFixed(1) + "," + y.toFixed(1);
    });
    const last = pts[pts.length - 1];

    const ranges = ["3y", "1y", "1m", "1w"];
    const tabs = ranges
      .map((r) => {
        const labels = { "3y": "rank.range3y", "1y": "rank.range1y", "1m": "rank.range1m", "1w": "rank.range1w" };
        return (
          '<button type="button" class="filter-chip' +
          (r === range ? " active" : "") +
          '" data-chart-range="' +
          r +
          '">' +
          t(labels[r]) +
          "</button>"
        );
      })
      .join("");

    container.innerHTML =
      '<div class="mp-rating-chart" data-chart-sport="' +
      sport +
      '">' +
      '<div class="mp-chart-head"><strong data-i18n="rank.historyTitle">' +
      t("rank.historyTitle") +
      "</strong>" +
      '<span class="mp-chart-end">' +
      (last.mpRating != null ? last.mpRating.toFixed(2) : "—") +
      "</span></div>" +
      '<div class="filter-chips mb-1 mp-chart-ranges">' +
      tabs +
      "</div>" +
      '<svg class="mp-chart-svg" viewBox="0 0 ' +
      w +
      " " +
      h +
      '" role="img" aria-label="Rating history">' +
      '<polyline fill="none" stroke="currentColor" stroke-width="2.5" points="' +
      coords.join(" ") +
      '"/>' +
      '<circle cx="' +
      coords[coords.length - 1].split(",")[0] +
      '" cy="' +
      coords[coords.length - 1].split(",")[1] +
      '" r="4" fill="currentColor"/>' +
      "</svg></div>";

    container.querySelectorAll("[data-chart-range]").forEach((btn) => {
      btn.addEventListener("click", () => {
        container.dataset.chartRange = btn.dataset.chartRange;
        renderRatingChart(container, sport, btn.dataset.chartRange);
      });
    });
  }

  function statBar(label, pct) {
    return (
      '<div class="mp-stat-bar-row">' +
      '<div class="mp-stat-bar-label"><span>' +
      label +
      '</span><span>' +
      pct +
      "%</span></div>" +
      '<div class="mp-stat-bar-track"><div class="mp-stat-bar-fill" style="width:' +
      pct +
      '%"></div></div></div>'
    );
  }

  function renderStatsDashboard(container, sport, compact) {
    if (!container) return;
    sport = sport || getSport();
    const s = aggregateStats(sport);
    const total = s.total || 1;

    const grid =
      '<div class="mp-stats-grid">' +
      '<div class="mp-stat-card"><div class="mp-stat-val">' +
      s.wins +
      " – " +
      s.losses +
      '</div><div class="mp-stat-lbl">' +
      t("stats.record") +
      "</div></div>" +
      '<div class="mp-stat-card"><div class="mp-stat-val">' +
      s.winPct +
      '%</div><div class="mp-stat-lbl">' +
      t("stats.winPct") +
      "</div></div>" +
      '<div class="mp-stat-card"><div class="mp-stat-val">' +
      s.longestStreak +
      '</div><div class="mp-stat-lbl">' +
      t("stats.longestStreak") +
      "</div></div>" +
      '<div class="mp-stat-card"><div class="mp-stat-val">' +
      s.tiebreakW +
      " – " +
      s.tiebreakL +
      '</div><div class="mp-stat-lbl">' +
      t("stats.tiebreak") +
      "</div></div></div>";

    const bars = compact
      ? ""
      : statBar(t("stats.winsBar"), Math.round((s.wins / total) * 100)) +
        statBar(t("stats.lossesBar"), Math.round((s.losses / total) * 100)) +
        statBar(t("stats.rankedWins"), s.rankedW + s.rankedL ? Math.round((s.rankedW / (s.rankedW + s.rankedL)) * 100) : 0) +
        statBar(t("stats.practiceWins"), s.practiceW + s.practiceL ? Math.round((s.practiceW / (s.practiceW + s.practiceL)) * 100) : 0);

    container.innerHTML =
      '<div class="mp-stats-dashboard' +
      (compact ? " mp-stats-compact" : "") +
      '">' +
      '<p class="text-sm text-muted mb-1">' +
      t("stats.weekMatches").replace("{n}", s.weekCount) +
      "</p>" +
      grid +
      bars +
      "</div>";
  }

  function renderProfilePanel(root, sport) {
    if (!root) return;
    sport = sport || getSport();
    const conf = root.querySelector("[data-analytics-confidence]");
    const chart = root.querySelector("[data-analytics-chart]");
    const stats = root.querySelector("[data-analytics-stats]");
    if (conf) renderConfidenceCard(conf, sport);
    if (chart) renderRatingChart(chart, sport, chart.dataset.chartRange || "1y");
    if (stats) renderStatsDashboard(stats, sport, stats.hasAttribute("data-compact"));
  }

  function init() {
    document.addEventListener("click", (e) => {
      const tab = e.target.closest("[data-performance-tab]");
      if (!tab) return;
      const wrap = tab.closest("[data-performance-tabs]");
      if (!wrap) return;
      const id = tab.dataset.performanceTab;
      wrap.querySelectorAll("[data-performance-tab]").forEach((b) => b.classList.toggle("active", b === tab));
      wrap.querySelectorAll("[data-performance-pane]").forEach((p) => {
        p.hidden = p.dataset.performancePane !== id;
      });
      if (id === "stats") {
        const pane = wrap.querySelector('[data-performance-pane="stats"] [data-analytics-stats-full]');
        if (pane) renderStatsDashboard(pane, getSport(), false);
      }
    });
  }

  return {
    init,
    loadMatches,
    recordMatch,
    aggregateStats,
    renderConfidenceCard,
    renderRatingChart,
    renderStatsDashboard,
    renderProfilePanel,
  };
})();
