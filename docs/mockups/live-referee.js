/* Match Point — referee live session (tabs: standings · courts · score · fullscreen) */
window.MP_Referee = (function () {
  const i18n = () => window.MP_I18N;

  let activeMatchId = null;
  let activeTab = "courts";
  let fsOpen = false;

  function t(key, fallback) {
    return i18n() ? i18n().t(key) : fallback;
  }

  function T() {
    return window.MP_Tournament;
  }

  function getSport() {
    return (window.MP_Sport && MP_Sport.get()) || "padel";
  }

  function shareUrl(ev) {
    const slug = (ev?.name || "session").toLowerCase().replace(/\s+/g, "-").slice(0, 24);
    return "https://matchpoint.app/live/" + (ev?.id || "demo") + "/" + slug;
  }

  function formatSide(team, ev) {
    if (!team?.length) return "—";
    const sep = T()?.isDoublesMatch?.(ev) && team.length > 1 ? " + " : " ";
    return team.map((p) => p.name).join(sep);
  }

  function formatSubtitle(ev) {
    const parts = [];
    if (ev.eventType) parts.push(ev.eventType.charAt(0).toUpperCase() + ev.eventType.slice(1));
    else if (ev.format) parts.push(ev.format.replace(/_/g, " "));
    if (ev.division) parts.push(ev.division);
    if (ev.structure && ev.structure !== ev.format) parts.push(ev.structure.replace(/_/g, " "));
    parts.push(new Date().toLocaleDateString());
    return parts.join(" · ");
  }

  function applySportTheme(root) {
    const shell = root.closest(".referee-live-shell");
    if (shell) shell.dataset.sport = getSport();
  }

  function applyTabState(root) {
    root.querySelectorAll("[data-referee-view]").forEach((el) => {
      el.hidden = el.dataset.refereeView !== activeTab;
    });
    const tabBar = root.closest(".referee-live-shell")?.querySelector(".referee-tab-bar");
    if (tabBar) {
      tabBar.querySelectorAll("[data-referee-tab]").forEach((btn) => {
        const on = btn.dataset.refereeTab === activeTab;
        btn.classList.toggle("active", on);
        btn.setAttribute("aria-selected", on ? "true" : "false");
      });
    }
  }

  function renderSetup(root) {
    const tour = T();
    if (!tour) return;
    let ev = tour.get();
    if (!ev) {
      ev = tour.createEvent({ format: "americano", name: "Americano Session", capacity: 8 });
    }
    const form = root.querySelector("[data-referee-setup-form]");
    if (!form) return;

    const nameEl = form.querySelector("[data-referee-event-name]");
    if (nameEl) nameEl.value = ev.name || "";

    const scoringEl = form.querySelector("[data-referee-scoring-mode]");
    if (scoringEl) scoringEl.textContent = ev.scoring || "race_to_n";

    const maxWrap = form.querySelector("[data-show-race-to]");
    const setsWrap = form.querySelector("[data-show-sets]");
    const setsScoring = tour.isSetsScoring?.(ev);
    if (maxWrap) maxWrap.hidden = setsScoring;
    if (setsWrap) setsWrap.hidden = !setsScoring;

    const maxEl = form.querySelector("[data-referee-max-score]");
    if (maxEl) maxEl.value = ev.maxScore ?? ev.raceTo ?? 24;

    const bestEl = form.querySelector("[data-referee-best-of]");
    if (bestEl) bestEl.value = ev.bestOf || 3;

    const courtCountEl = form.querySelector("[data-referee-court-count]");
    if (courtCountEl) courtCountEl.textContent = ev.courtCount || 2;

    const playerCountEl = form.querySelector("[data-referee-player-count]");
    if (playerCountEl) playerCountEl.value = (ev.players || []).length;

    const formatBadge = form.querySelector("[data-referee-format-badge]");
    if (formatBadge) {
      formatBadge.textContent = (ev.format || "").replace(/_/g, " ") + (ev.eventType ? " · " + ev.eventType : "");
    }

    const playersWrap = form.querySelector("[data-referee-players-list]");
    const doubles = tour.isDoublesMatch?.(ev) && !tour.isSocial?.(ev);
    if (playersWrap) {
      playersWrap.innerHTML = (ev.players || [])
        .map(
          (p, i) =>
            '<div class="form-group referee-player-row">' +
            '<label class="form-label text-sm">' +
            (doubles && i % 2 === 0
              ? t("referee.teamN", "Team") + " " + (Math.floor(i / 2) + 1)
              : doubles
                ? ""
                : t("referee.playerN", "Player") + " " + (i + 1)) +
            "</label>" +
            '<input class="form-input" data-referee-player-name data-player-idx="' +
            i +
            '" value="' +
            (p.name || "") +
            '" /></div>'
        )
        .join("");
    }

    const courtsWrap = form.querySelector("[data-referee-courts-list]");
    if (courtsWrap) {
      courtsWrap.innerHTML = (ev.courtNames || [])
        .map(
          (name, i) =>
            '<div class="form-group"><label class="form-label text-sm">' +
            t("referee.courtN", "Court") +
            " " +
            (i + 1) +
            '</label><input class="form-input" data-referee-court-name data-court-idx="' +
            i +
            '" value="' +
            name +
            '" /></div>'
        )
        .join("");
    }

    updateSetupStats(form, ev);
  }

  function updateSetupStats(form, ev) {
    if (!form || !ev) return;
    const est = T()?.estimateSession?.(ev);
    const matchesEl = form.querySelector("[data-referee-stat-matches]");
    const durationEl = form.querySelector("[data-referee-stat-duration]");
    const perPlayerEl = form.querySelector("[data-referee-stat-per-player]");
    if (matchesEl && est) matchesEl.textContent = est.matches;
    if (durationEl && est) durationEl.textContent = est.duration;
    if (perPlayerEl && est) perPlayerEl.textContent = est.perPlayer;
  }

  function collectSetup(form) {
    const names = [];
    form.querySelectorAll("[data-referee-player-name]").forEach((el) => {
      if (el.value.trim()) names.push(el.value.trim());
    });
    const courtNames = [];
    form.querySelectorAll("[data-referee-court-name]").forEach((el) => {
      courtNames.push(el.value.trim() || "Court");
    });
    const ev = T()?.get();
    const setsScoring = ev && T().isSetsScoring(ev);
    return {
      name: form.querySelector("[data-referee-event-name]")?.value?.trim(),
      maxScore: setsScoring
        ? undefined
        : parseInt(form.querySelector("[data-referee-max-score]")?.value, 10) || 24,
      bestOf: parseInt(form.querySelector("[data-referee-best-of]")?.value, 10) || 3,
      courtCount: courtNames.length || 2,
      courtNames,
      playerNames: names,
    };
  }

  function renderLive(root) {
    const tour = T();
    const ev = tour?.get();
    if (!root || !ev) return;

    applySportTheme(root);
    applyTabState(root);

    const titleEl = root.closest(".referee-live-shell")?.querySelector("[data-referee-title]");
    if (titleEl) titleEl.textContent = ev.name || "Live Session";

    const subEl = root.querySelector("[data-referee-subtitle]");
    if (subEl) subEl.textContent = formatSubtitle(ev);

    const badgeEl = root.closest(".referee-live-shell")?.querySelector("[data-referee-round-badge]");
    if (badgeEl) {
      badgeEl.textContent = "LIVE · " + (tour.getRoundLabel?.() || "R" + ev.round);
    }

    const shareEl = root.querySelector("[data-referee-share-url]");
    if (shareEl) shareEl.value = shareUrl(ev);

    const standingsEl = root.querySelector("[data-referee-standings]");
    if (standingsEl) standingsEl.innerHTML = renderStandingsTable(ev);

    const roundLabel = root.querySelector("[data-referee-round-label]");
    if (roundLabel) roundLabel.textContent = tour.getRoundLabel?.() || t("referee.roundN", "Round") + " " + (ev.round || 1);

    const matchesEl = root.querySelector("[data-referee-matches]");
    if (matchesEl) matchesEl.innerHTML = renderMatches(ev);

    const pickerEl = root.querySelector("[data-referee-score-picker]");
    if (pickerEl) pickerEl.innerHTML = renderScorePicker(ev, activeMatchId);

    if (fsOpen) {
      const fsRoot = document.querySelector("[data-referee-fullscreen]");
      if (fsRoot) renderFullscreen(fsRoot, ev);
    }
  }

  function renderStandingsTable(ev) {
    const standings = T()?.getStandings?.() || ev.players || [];
    const setsMode = T()?.isSetsScoring?.(ev);
    const ptsCol = setsMode ? "Pts" : "P+";
    let html =
      '<div class="referee-table-wrap"><table class="referee-table"><thead><tr>' +
      "<th>#</th><th>" +
      t("referee.colName", "Name") +
      "</th><th>W</th><th>T</th><th>L</th>" +
      '<th class="col-pts-plus">' +
      ptsCol +
      "</th><th>P-</th><th>+/-</th></tr></thead><tbody>";
    standings.forEach((p, i) => {
      const diff = (p.pf || 0) - (p.pa || 0);
      const mainPts = setsMode ? p.pts || 0 : p.pf || 0;
      html +=
        "<tr><td>" +
        (i + 1) +
        '</td><td><span class="referee-name">' +
        p.name +
        "</span></td><td>" +
        (p.w || 0) +
        "</td><td>" +
        (p.t || 0) +
        "</td><td>" +
        (p.l || 0) +
        '</td><td class="col-pts-plus">' +
        mainPts +
        "</td><td>" +
        (p.pa || 0) +
        "</td><td>" +
        (diff >= 0 ? "+" : "") +
        diff +
        "</td></tr>";
    });
    html += "</tbody></table></div>";
    html +=
      '<p class="form-hint mt-1">' +
      (setsMode
        ? t("referee.standingsSetsHint", "League points · sets won/lost per match")
        : t("referee.standingsHint", "P+ = points scored · race to ") +
          (ev.maxScore ?? ev.raceTo ?? 24) +
          " " +
          t("referee.perMatch", "per match")) +
      "</p>";
    return html;
  }

  function renderMatches(ev) {
    const matches = T()?.getCurrentRoundMatches?.() || ev.courts || [];
    const courtNames = ev.courtNames || [];
    if (!matches.length) {
      return '<p class="form-hint">' + t("referee.noMatches", "Generate schedule to see matches.") + "</p>";
    }
    return matches
      .map((m) => {
        const courtName = courtNames[m.courtIndex] ?? courtNames[(m.court || 1) - 1] ?? "Court " + (m.court || 1);
        const id = m.id || "r" + ev.round + "c" + m.court;
        const active = activeMatchId === id ? " active" : "";
        const done = m.done ? " done" : "";
        const s1 = m.score1 != null ? m.score1 : "–";
        const s2 = m.score2 != null ? m.score2 : "–";
        const unit = T()?.isSetsScoring?.(ev) ? " sets" : "";
        return (
          '<div class="referee-match-card' +
          active +
          done +
          '" data-referee-select-match="' +
          id +
          '" role="button" tabindex="0">' +
          (m.label ? '<div class="referee-match-label">' + m.label + "</div>" : "") +
          '<div class="referee-match-court">' +
          courtName +
          "</div>" +
          '<div class="referee-match-teams">' +
          '<div class="referee-team">' +
          formatSide(m.team1, ev).replace(/ \+ /g, "<br>") +
          "</div>" +
          '<div class="referee-vs">vs</div>' +
          '<div class="referee-team">' +
          formatSide(m.team2, ev).replace(/ \+ /g, "<br>") +
          "</div></div>" +
          '<div class="referee-match-scoreline">' +
          s1 +
          " – " +
          s2 +
          unit +
          "</div>" +
          '<div class="referee-match-actions">' +
          '<button type="button" class="btn btn-outline btn-sm" data-referee-fs-open="' +
          id +
          '">' +
          t("referee.fullscreenBtn", "⛶ Full screen") +
          "</button>" +
          '<button type="button" class="btn btn-primary btn-sm" data-referee-tab="score" data-referee-select-match="' +
          id +
          '">' +
          t("referee.enterScoreBtn", "Enter score") +
          "</button></div></div>"
        );
      })
      .join("");
  }

  function renderScoreStepper(matchId, side, label, value, max) {
    return (
      '<div class="referee-score-stepper-row">' +
      '<span class="referee-picker-label">' +
      label +
      '</span><div class="referee-score-stepper">' +
      '<button type="button" class="referee-stepper-btn" data-referee-bump-score="' +
      matchId +
      '" data-side="' +
      side +
      '" data-delta="-1" aria-label="-1">−</button>' +
      '<span class="referee-stepper-val" aria-live="polite">' +
      value +
      "</span>" +
      '<button type="button" class="referee-stepper-btn" data-referee-bump-score="' +
      matchId +
      '" data-side="' +
      side +
      '" data-delta="1" aria-label="+1">+</button>' +
      "</div>" +
      '<span class="referee-stepper-cap">' +
      t("referee.raceTo", "Race to") +
      " " +
      max +
      "</span></div>"
    );
  }

  function renderScorePicker(ev, matchId) {
    if (!matchId) {
      return (
        '<div class="referee-score-empty">' +
        '<p class="referee-score-empty-icon" aria-hidden="true">🏟</p>' +
        '<p class="referee-score-empty-title">' +
        t("referee.scoreEmptyTitle", "No court selected") +
        "</p>" +
        '<p class="form-hint">' +
        t(
          "referee.scoreEmptyHint",
          "Open Courts, tap a match card, then return here to enter the score.",
        ) +
        "</p>" +
        '<button type="button" class="btn btn-outline btn-block mt-1" data-referee-tab="courts">' +
        t("referee.goToCourts", "Go to Courts →") +
        "</button></div>"
      );
    }
    const match = T()?.findMatch?.(matchId);
    if (!match) return "";
    const max = T()?.scoreCap?.(ev) ?? 24;
    const setsMode = T()?.isSetsScoring?.(ev);
    const team1Name = formatSide(match.team1, ev);
    const team2Name = formatSide(match.team2, ev);
    const s1 = match.score1 != null ? match.score1 : 0;
    const s2 = match.score2 != null ? match.score2 : 0;
    const label1 = setsMode ? team1Name + " · " + t("referee.setsWon", "Sets won") : team1Name;
    const label2 = setsMode ? team2Name + " · " + t("referee.setsWon", "Sets won") : team2Name;

    let html =
      '<div class="referee-picker-head"><strong>' +
      team1Name +
      "</strong><span>vs</span><strong>" +
      team2Name +
      "</strong></div>" +
      '<p class="form-hint referee-score-flow-hint">' +
      (setsMode
        ? t("referee.scoreFlowSets", "Step 1: adjust sets won with +/−. Step 2: tap Confirm to save and update standings.")
        : t(
            "referee.scoreFlowRace",
            "Step 1: set each side's score with +/−. Step 2: tap Confirm to lock the result and refresh standings.",
          )) +
      "</p>";

    html += renderScoreStepper(matchId, 1, label1, s1, setsMode ? ev.bestOf || 3 : max);
    html += renderScoreStepper(matchId, 2, label2, s2, setsMode ? ev.bestOf || 3 : max);

    html +=
      '<div class="referee-score-actions">' +
      '<button type="button" class="btn btn-outline btn-block" data-referee-fs-open="' +
      matchId +
      '">' +
      t("referee.fullscreenBtn", "⛶ Full screen") +
      "</button>" +
      '<button type="button" class="btn btn-primary btn-block" data-referee-confirm-score="' +
      matchId +
      '">' +
      t("referee.confirmScore", "Confirm score") +
      "</button></div>";
    return html;
  }

  function renderFullscreen(root, ev) {
    const match = T()?.findMatch?.(activeMatchId);
    if (!match) {
      closeFullscreen();
      return;
    }
    root.hidden = false;
    root.setAttribute("aria-hidden", "false");
    const max = T()?.scoreCap?.(ev) ?? 24;
    const setsMode = T()?.isSetsScoring?.(ev);
    const t1 = formatSide(match.team1, ev);
    const t2 = formatSide(match.team2, ev);
    const s1 = match.score1 != null ? match.score1 : 0;
    const s2 = match.score2 != null ? match.score2 : 0;
    const targetLabel = setsMode ? "BO" + (ev.bestOf || 3) : "/" + max;
    const sport = getSport();

    root.innerHTML =
      '<div class="referee-fs-inner" data-sport="' +
      sport +
      '">' +
      '<button type="button" class="referee-fs-close" data-referee-fs-close aria-label="Close">✕</button>' +
      '<div class="referee-fs-court">' +
      (ev.courtNames?.[match.courtIndex] || "Court") +
      " · " +
      (T()?.getRoundLabel?.() || "R" + ev.round) +
      "</div>" +
      '<div class="referee-fs-board">' +
      '<button type="button" class="referee-fs-side" data-referee-fs-bump="' +
      activeMatchId +
      '" data-side="1">' +
      '<div class="referee-fs-names">' +
      t1 +
      "</div>" +
      '<div class="referee-fs-score">' +
      s1 +
      "</div>" +
      '<div class="referee-fs-bump">+1</div></button>' +
      '<div class="referee-fs-mid"><span class="referee-fs-vs">vs</span><span class="referee-fs-target">' +
      targetLabel +
      "</span></div>" +
      '<button type="button" class="referee-fs-side" data-referee-fs-bump="' +
      activeMatchId +
      '" data-side="2">' +
      '<div class="referee-fs-names">' +
      t2 +
      "</div>" +
      '<div class="referee-fs-score">' +
      s2 +
      "</div>" +
      '<div class="referee-fs-bump">+1</div></button></div>' +
      '<div class="referee-fs-quick">' +
      [1, 2, 3].map(
        (n) =>
          '<button type="button" class="referee-fs-quick-btn" data-referee-fs-add="' +
          activeMatchId +
          '" data-side="1" data-add="' +
          n +
          '">L+' +
          n +
          "</button>",
      ).join("") +
      [1, 2, 3].map(
        (n) =>
          '<button type="button" class="referee-fs-quick-btn" data-referee-fs-add="' +
          activeMatchId +
          '" data-side="2" data-add="' +
          n +
          '">R+' +
          n +
          "</button>",
      ).join("") +
      '<button type="button" class="referee-fs-quick-btn referee-fs-confirm" data-referee-confirm-score="' +
      activeMatchId +
      '">' +
      t("referee.confirmScore", "Confirm") +
      "</button></div></div>";
  }

  function applyAll() {
    document.querySelectorAll("[data-referee-setup]").forEach((el) => renderSetup(el));
    document.querySelectorAll("[data-referee-live]").forEach((el) => renderLive(el));
  }

  function selectMatch(id) {
    activeMatchId = id;
    activeTab = "score";
    applyAll();
  }

  function setTab(tab) {
    if (!["standings", "courts", "score"].includes(tab)) return;
    activeTab = tab;
    applyAll();
  }

  function resetLiveView() {
    activeTab = "courts";
    applyAll();
  }

  function openFullscreen(id) {
    if (!id) return;
    activeMatchId = id;
    fsOpen = true;
    document.body.classList.add("referee-fs-active");
    const fs = document.querySelector("[data-referee-fullscreen]");
    if (fs) {
      fs.hidden = false;
      fs.setAttribute("aria-hidden", "false");
    }
    applyAll();
  }

  function closeFullscreen() {
    fsOpen = false;
    document.body.classList.remove("referee-fs-active");
    const fs = document.querySelector("[data-referee-fullscreen]");
    if (fs) {
      fs.hidden = true;
      fs.setAttribute("aria-hidden", "true");
      fs.innerHTML = "";
    }
  }

  function init() {
    applyAll();
    window.addEventListener("mp:lang", applyAll);
    window.addEventListener("mp:sport", applyAll);
  }

  return {
    shareUrl,
    renderSetup,
    renderLive,
    collectSetup,
    applyAll,
    selectMatch,
    setTab,
    resetLiveView,
    openFullscreen,
    closeFullscreen,
    init,
    getActiveMatchId: () => activeMatchId,
    getActiveTab: () => activeTab,
  };
})();
