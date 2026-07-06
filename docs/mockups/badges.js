/* Match Point — badges & visual identity at a glance */
window.MP_Badges = (function () {
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderBadge(type, label) {
    const cls =
      {
        boc: "badge-boc",
        boc_champion: "badge-boc-champion",
        sparring: "badge-sparring",
        sparring_ranked: "badge-sparring-ranked",
        sparring_victor: "badge-sparring-victor",
        group: "badge-group",
        top10: "badge-top10",
      }[type] || "badge-info";
    return '<span class="badge ' + cls + '">' + esc(label) + "</span>";
  }

  function communityBadges(meta) {
    if (!meta) return "";
    const parts = [];
    if (meta.bocSeason) parts.push(renderBadge("boc", "BoC"));
    if (meta.bocGroup) parts.push(renderBadge("group", "Group " + meta.bocGroup));
    if (meta.champion) parts.push(renderBadge("boc_champion", "Champion"));
    if (meta.sparringVictor) parts.push(renderBadge("sparring_victor", "Sparring Victor"));
    if (meta.sparring) parts.push(renderBadge(meta.sparringRanked ? "sparring_ranked" : "sparring", "Sparring"));
    return parts.slice(0, 3).join(" ");
  }

  function applyCommunityPage() {
    document.querySelectorAll("[data-community-badges]").forEach((el) => {
      const meta = {
        bocSeason: el.dataset.bocSeason === "1",
        bocGroup: el.dataset.bocGroup || "",
        champion: el.dataset.champion === "1",
        sparringVictor: el.dataset.sparringVictor === "1",
        sparring: el.dataset.sparring === "1",
        sparringRanked: el.dataset.sparringRanked === "1",
      };
      el.innerHTML = communityBadges(meta);
    });
    document.querySelectorAll("[data-crest-ring]").forEach((el) => {
      el.classList.add("crest-mp-ring");
    });
  }

  function applyLeaderboard() {
    document.querySelectorAll(".lb-row").forEach((row, i) => {
      if (i < 10) row.classList.add("lb-top10");
    });
  }

  function init() {
    applyCommunityPage();
    applyLeaderboard();
    window.addEventListener("mp:lang", applyCommunityPage);
  }

  return { init, renderBadge, communityBadges, applyCommunityPage };
})();
