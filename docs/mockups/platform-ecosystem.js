/* Match Point — Ecosystem Operator Console data + renderers (mockup)
   design-system/match-point/pages/platform-overview.md — density 8, graph
   KPIs, network loops, community pipeline, social moderation queue (seeded
   from MP_SocialFeed.flaggedPosts()). */
window.MP_Ecosystem = (function () {
  const t = (k) => (window.MP_I18N ? MP_I18N.t(k) : k);
  const lang = () => (window.MP_I18N ? MP_I18N.getLang() : "en");
  const L = (o) => (o ? o[lang()] || o.en : "");

  const KPIS = [
    { value: "10,842", labelKey: "ecosystem.kpiPlayers", delta: "+1.8%", up: true },
    { value: "523", labelKey: "ecosystem.kpiCommunities", delta: "+4", up: true },
    { value: "1,180", labelKey: "ecosystem.kpiMatches", delta: "+6.2%", up: true },
    { value: "3,402", labelKey: "ecosystem.kpiPosts", delta: "+12%", up: true },
    { value: "4,216", labelKey: "ecosystem.kpiDau", delta: "-0.9%", up: false },
    { value: "0.6%", labelKey: "ecosystem.kpiDispute", delta: "-0.1", up: true },
  ];

  const LOOPS = [
    {
      label: { id: "Komunitas → Pemain", en: "Communities → Players" },
      spark: [4, 6, 5, 7, 8, 9, 11],
    },
    {
      label: { id: "Pemain → Konten", en: "Players → Content" },
      spark: [3, 4, 6, 6, 8, 10, 12],
    },
    {
      label: { id: "Konten → Discovery", en: "Content → Discovery" },
      spark: [2, 3, 3, 5, 6, 7, 9],
    },
    {
      label: { id: "Match → Rating", en: "Matches → Ratings" },
      spark: [6, 7, 7, 8, 9, 9, 10],
    },
    {
      label: { id: "Konversi → Identitas", en: "Conversion → Identity" },
      spark: [2, 2, 4, 4, 5, 7, 8],
    },
  ];

  const PIPELINE = [
    { name: "Pickle Kelapa Gading", sport: "pickleball", stage: "pending", days: 1 },
    { name: "Tangsel Tennis League", sport: "tennis", stage: "pending", days: 2 },
    { name: "PB Cempaka Putih", sport: "badminton", stage: "pending", days: 3 },
    { name: "Padel Antasari", sport: "padel", stage: "approved", days: 0 },
    { name: "Spin City TT", sport: "table_tennis", stage: "approved", days: 1 },
    { name: "Jakarta Smash Club", sport: "badminton", stage: "rejected", days: 4 },
  ];

  function pipelineCounts() {
    const c = { pending: 0, approved: 0, rejected: 0 };
    PIPELINE.forEach((p) => c[p.stage]++);
    return c;
  }

  function moderationQueue() {
    return window.MP_SocialFeed ? MP_SocialFeed.flaggedPosts() : [];
  }

  function renderKpis(root) {
    if (!root) return;
    root.innerHTML =
      '<div class="mp-platform-kpi-grid">' +
      KPIS.map(
        (k) =>
          '<div class="mp-platform-kpi"><b>' +
          k.value +
          "</b>" +
          '<span class="mp-platform-kpi-delta ' +
          (k.up ? "up" : "down") +
          '">' +
          (k.up ? "▲ " : "▼ ") +
          k.delta +
          "</span><small>" +
          t(k.labelKey) +
          "</small></div>",
      ).join("") +
      "</div>";
  }

  function renderLoops(root) {
    if (!root) return;
    root.innerHTML = LOOPS.map((loop) => {
      const max = Math.max.apply(null, loop.spark);
      const bars = loop.spark
        .map((v) => '<i style="height:' + Math.round((v / max) * 100) + '%"></i>')
        .join("");
      return (
        '<div class="mp-loop-row"><span>' +
        L(loop.label) +
        '</span><span class="mp-loop-spark" aria-hidden="true">' +
        bars +
        "</span></div>"
      );
    }).join("");
  }

  function renderPipelineCounts(root) {
    if (!root) return;
    const c = pipelineCounts();
    root.innerHTML =
      '<div class="mp-hq-kpis" style="grid-template-columns:repeat(3,1fr)">' +
      '<div class="mp-hq-kpi"><b>' + c.pending + "</b><small>" + t("ecosystem.pipePending") + "</small></div>" +
      '<div class="mp-hq-kpi"><b>' + c.approved + "</b><small>" + t("ecosystem.pipeApproved") + "</small></div>" +
      '<div class="mp-hq-kpi"><b>' + c.rejected + "</b><small>" + t("ecosystem.pipeRejected") + "</small></div>" +
      "</div>";
  }

  function stageBadge(stage) {
    const map = {
      pending: ["ecosystem.pipePending", "badge-warning"],
      approved: ["ecosystem.pipeApproved", "badge-public"],
      rejected: ["ecosystem.pipeRejected", "badge-danger"],
    };
    const m = map[stage];
    return '<span class="badge ' + m[1] + '">' + t(m[0]) + "</span>";
  }

  function renderPipelineList(root) {
    if (!root) return;
    const filter = root.dataset.pipelineStage || "all";
    const list = PIPELINE.filter((p) => filter === "all" || p.stage === filter);
    root.innerHTML = list
      .map(
        (p) =>
          '<div class="mp-loop-row"><span><strong style="font-size:0.85rem">' +
          p.name +
          '</strong><br><small style="color:var(--ink-muted)">' +
          (window.MP_Sport ? MP_Sport.label(p.sport) : p.sport) +
          " · " +
          p.days +
          "d</small></span>" +
          '<span style="margin-left:auto">' +
          stageBadge(p.stage) +
          "</span></div>",
      )
      .join("");
  }

  function renderModerationCount(root) {
    if (!root) return;
    root.textContent = moderationQueue().length;
  }

  function renderModerationList(root) {
    if (!root) return;
    root.innerHTML = moderationQueue()
      .map(
        (p) =>
          '<div class="mp-feed-post" style="margin-bottom:0.75rem">' +
          '<div class="mp-feed-post-head">' +
          '<span class="avatar avatar-photo">' + p.author.avatar + "</span>" +
          '<div class="mp-feed-post-who"><strong>' +
          p.author.name +
          "</strong><small>" +
          L(p.flagged.reason) +
          " · " +
          p.flagged.reports +
          " reports</small></div>" +
          '<span class="badge badge-danger">' + t("social.flaggedBadge") + "</span>" +
          "</div>" +
          '<div class="mp-feed-post-body">' + L(p.body) + "</div>" +
          '<div class="mp-feed-post-actions">' +
          '<button type="button" class="mp-feed-action" data-moderate-keep="' + p.id + '">' +
          t("ecosystem.approve") +
          "</button>" +
          '<button type="button" class="mp-feed-action" style="color:var(--danger)" data-moderate-remove="' + p.id + '">' +
          t("ecosystem.removePost") +
          "</button></div></div>",
      )
      .join("");
  }

  function applyDOM() {
    document.querySelectorAll("[data-eco-kpis]").forEach(renderKpis);
    document.querySelectorAll("[data-eco-loops]").forEach(renderLoops);
    document.querySelectorAll("[data-eco-pipeline-counts]").forEach(renderPipelineCounts);
    document.querySelectorAll("[data-eco-pipeline-list]").forEach(renderPipelineList);
    document.querySelectorAll("[data-eco-moderation-count]").forEach(renderModerationCount);
    document.querySelectorAll("[data-eco-moderation-list]").forEach(renderModerationList);
  }

  function init() {
    applyDOM();
    document.body.addEventListener("click", (e) => {
      const stageChip = e.target.closest("[data-pipeline-filter]");
      if (stageChip) {
        const wrap = stageChip.closest("[data-pipeline-filters]");
        if (wrap)
          wrap.querySelectorAll("[data-pipeline-filter]").forEach((c) => {
            c.classList.toggle("active", c === stageChip);
          });
        document.querySelectorAll("[data-eco-pipeline-list]").forEach((root) => {
          root.dataset.pipelineStage = stageChip.dataset.pipelineFilter;
          renderPipelineList(root);
        });
      }
      const modBtn = e.target.closest("[data-moderate-keep], [data-moderate-remove]");
      if (modBtn) {
        const post = modBtn.closest(".mp-feed-post");
        if (post) {
          post.style.opacity = "0.4";
          post.querySelectorAll(".mp-feed-action").forEach((b) => (b.disabled = true));
        }
      }
    });
    window.addEventListener("mp:lang", applyDOM);
  }

  return { KPIS, PIPELINE, pipelineCounts, moderationQueue, applyDOM, init };
})();
