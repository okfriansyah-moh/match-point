/* Match Point — referee live session (tabs: standings · courts · score · fullscreen) */
window.MP_Referee = (function () {
  const i18n = () => window.MP_I18N;
  const FS_ICON =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>';

  let activeMatchId = null;
  let activeTab = "courts";
  let fsOpen = false;

  function t(key, fallback) {
    return i18n() ? i18n().t(key) : fallback;
  }

  function T() {
    return window.MP_Tournament;
  }

  function S() {
    return window.MP_ScoringRules;
  }

  function getEventSport(ev) {
    return ev?.sport || (window.MP_Sport && MP_Sport.get()) || "padel";
  }

  function getProfile(ev) {
    return S() ? S().resolveProfile(ev) : T()?.isSetsScoring?.(ev) ? "sets_won" : "race_points";
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
    const sport = getEventSport(ev);
    parts.push(sport.replace(/_/g, " "));
    if (ev.eventType) parts.push(ev.eventType.charAt(0).toUpperCase() + ev.eventType.slice(1));
    else if (ev.format) parts.push(ev.format.replace(/_/g, " "));
    if (S()) {
      const meta = S().profileMeta(ev);
      parts.push(t(meta.labelKey, meta.id));
    }
    return parts.join(" · ");
  }

  function applySportTheme(root, ev) {
    const shell = root.closest(".referee-live-shell");
    if (shell) shell.dataset.sport = getEventSport(ev);
  }

  function renderBreadcrumb(shell, ev) {
    const bar = shell?.querySelector("[data-referee-breadcrumb]");
    if (!bar || !ev) return;
    const tour = T();
    const round = tour?.getRoundLabel?.() || "R" + (ev.round || 1);
    bar.className = "mp-operator-context";
    bar.innerHTML =
      '<button type="button" class="mp-operator-crumb mp-operator-crumb-btn" data-flow-goto="0">' +
      t("operator.manageCommunity", "Manage Community") +
      "</button>" +
      '<span class="mp-operator-sep">›</span>' +
      '<span class="mp-operator-crumb">' +
      (ev.name || "Live") +
      "</span>" +
      '<span class="mp-operator-sep">›</span>' +
      '<span class="mp-operator-step">' +
      round +
      "</span>";
  }

  function applyTabState(root) {
    root.querySelectorAll("[data-referee-view]").forEach((el) => {
      el.hidden = el.dataset.refereeView !== activeTab;
    });
    const shell = root.closest(".referee-live-shell");
    const tabBar = shell?.querySelector(".referee-tab-bar");
    if (tabBar) {
      tabBar.querySelectorAll("[data-referee-tab]").forEach((btn) => {
        const on = btn.dataset.refereeTab === activeTab;
        btn.classList.toggle("active", on);
        btn.setAttribute("aria-selected", on ? "true" : "false");
      });
    }
    const sessionBar = shell?.querySelector("[data-referee-session-bar]");
    if (sessionBar) sessionBar.hidden = activeTab !== "courts";
  }

  function displayScore(m, ev) {
    if (m.score1 == null || m.score2 == null) return "– – –";
    if (T()?.formatMatchScore) return T().formatMatchScore(m, ev);
    return m.score1 + " – " + m.score2;
  }

  function formatStepperValue(m, side, ev, profile) {
    const val = side === 1 ? (m.score1 != null ? m.score1 : 0) : m.score2 != null ? m.score2 : 0;
    if (S()) return S().formatPoint(val, profile, m.gameState);
    return val;
  }

  function renderSetup(root) {
    const tour = T();
    if (!tour) return;
    let ev = tour.get();
    if (!ev) {
      ev = tour.createEvent({ format: "americano", name: "Americano Session", capacity: 8 });
    }
    const form = root.querySelector("[data-referee-setup-form]") || root.closest("[data-referee-setup-form]");
    if (!form) return;

    const nameEl = form.querySelector("[data-referee-event-name]");
    if (nameEl) nameEl.value = ev.name || "";

    const scoringEl = form.querySelector("[data-referee-scoring-mode]");
    if (scoringEl) {
      const meta = S() ? S().profileMeta(ev) : null;
      scoringEl.textContent = meta ? t(meta.labelKey, meta.id) : ev.scoring || "race_to_n";
    }

    const profile = getProfile(ev);
    const raceMode = profile === "race_points";
    const maxWrap = form.querySelector("[data-show-race-to]");
    const setsWrap = form.querySelector("[data-show-sets]");
    if (maxWrap) maxWrap.hidden = !raceMode;
    if (setsWrap) setsWrap.hidden = raceMode;

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
      formatBadge.textContent =
        getEventSport(ev) +
        " · " +
        (ev.format || "").replace(/_/g, " ") +
        (ev.eventType ? " · " + ev.eventType : "");
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
            '" /></div>',
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
            '" /></div>',
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
    const profile = getProfile(ev);
    const raceMode = profile === "race_points";
    return {
      name: form.querySelector("[data-referee-event-name]")?.value?.trim(),
      maxScore: raceMode
        ? parseInt(form.querySelector("[data-referee-max-score]")?.value, 10) || 24
        : undefined,
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

    const shell = root.closest(".referee-live-shell");
    applySportTheme(root, ev);
    renderBreadcrumb(shell, ev);
    applyTabState(root);

    const titleEl = shell?.querySelector("[data-referee-title]");
    if (titleEl) titleEl.textContent = ev.name || "Live Session";

    const subEl = root.querySelector("[data-referee-subtitle]");
    if (subEl) subEl.textContent = formatSubtitle(ev);

    const badgeEl = shell?.querySelector("[data-referee-round-badge]");
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
    if (matchesEl) {
      matchesEl.className = "referee-matches-grid";
      matchesEl.innerHTML = renderMatches(ev);
    }

    const pickerEl = root.querySelector("[data-referee-score-picker]");
    if (pickerEl) pickerEl.innerHTML = renderScorePicker(ev, activeMatchId);

    if (fsOpen) {
      const fsRoot = document.querySelector("[data-referee-fullscreen]");
      if (fsRoot) renderFullscreen(fsRoot, ev);
    }
  }

  function renderStandingsTable(ev) {
    const standings = T()?.getStandings?.() || ev.players || [];
    const profile = getProfile(ev);
    const ptsCol = profile === "sets_won" ? "Pts" : "P+";
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
      const mainPts = profile === "sets_won" ? p.pts || 0 : p.pf || 0;
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
    const meta = S() ? S().profileMeta(ev) : null;
    html +=
      '<p class="form-hint mt-1">' +
      (meta ? t(meta.hintKey, "") : t("referee.standingsHint", "Standings update after each confirmed match.")) +
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
        const scoreline = displayScore(m, ev);
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
          scoreline +
          "</div>" +
          '<div class="referee-match-actions">' +
          '<button type="button" class="btn btn-outline btn-sm referee-fs-btn" data-referee-fs-open="' +
          id +
          '">' +
          FS_ICON +
          " " +
          t("referee.fullscreenBtn", "Full screen") +
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

  function scoreFlowHint(ev, profile) {
    if (profile === "game_tennis") return t("referee.scoreFlowGame", "Tap + to advance game points (15, 30, 40, AD). Confirm when a set is won.");
    if (profile === "rally_21") return t("referee.scoreFlowRally21", "Rally scoring to 21 — win by 2, cap 30.");
    if (profile === "rally_11") return t("referee.scoreFlowRally11", "Rally scoring to 11 — win by 2.");
    if (profile === "sets_won") return t("referee.scoreFlowSets", "Adjust sets won, then confirm.");
    return t("referee.scoreFlowRace", "Set each side's score with +/−, then confirm.");
  }

  function renderScoreStepper(matchId, side, label, m, ev, profile) {
    const val = formatStepperValue(m, side, ev, profile);
    const cap = T()?.scoreCap?.(ev) ?? 24;
    const capLabel =
      profile === "game_tennis"
        ? t("score.gamePoints", "Game points")
        : profile === "rally_21"
          ? t("score.rally21", "Rally · /21")
          : profile === "rally_11"
            ? t("score.rally11", "Rally · /11")
            : t("referee.raceTo", "Race to") + " " + cap;
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
      val +
      "</span>" +
      '<button type="button" class="referee-stepper-btn" data-referee-bump-score="' +
      matchId +
      '" data-side="' +
      side +
      '" data-delta="1" aria-label="+1">+</button>' +
      "</div>" +
      '<span class="referee-stepper-cap">' +
      capLabel +
      "</span></div>"
    );
  }

  function renderScorePicker(ev, matchId) {
    if (!matchId) {
      return (
        '<div class="referee-score-empty">' +
        '<p class="referee-score-empty-title">' +
        t("referee.scoreEmptyTitle", "No court selected") +
        "</p>" +
        '<p class="form-hint">' +
        t("referee.scoreEmptyHint", "Open Courts, tap a match card, then return here to enter the score.") +
        "</p>" +
        '<button type="button" class="btn btn-outline btn-block mt-1" data-referee-tab="courts">' +
        t("referee.goToCourts", "Go to Courts →") +
        "</button></div>"
      );
    }
    const match = T()?.findMatch?.(matchId);
    if (!match) return "";
    const profile = getProfile(ev);
    const team1Name = formatSide(match.team1, ev);
    const team2Name = formatSide(match.team2, ev);
    const label1 = team1Name;
    const label2 = team2Name;
    const deuce = S() ? S().deuceLabel(match) : "";

    let html =
      '<div class="referee-picker-head"><strong>' +
      team1Name +
      "</strong><span>vs</span><strong>" +
      team2Name +
      "</strong></div>";
    if (profile === "game_tennis" && match.setScores) {
      html +=
        '<p class="referee-set-strip">' +
        t("referee.setsLabel", "Sets") +
        ": " +
        match.setScores.sets1 +
        " – " +
        match.setScores.sets2 +
        (deuce ? ' · <span class="referee-deuce">' + deuce + "</span>" : "") +
        "</p>";
    }
    html += '<p class="form-hint referee-score-flow-hint">' + scoreFlowHint(ev, profile) + "</p>";

    html += renderScoreStepper(matchId, 1, label1, match, ev, profile);
    html += renderScoreStepper(matchId, 2, label2, match, ev, profile);

    const canConfirm = T()?.canConfirmMatch?.(matchId);
    html +=
      '<div class="referee-score-actions">' +
      '<button type="button" class="btn btn-outline btn-block referee-fs-btn" data-referee-fs-open="' +
      matchId +
      '">' +
      FS_ICON +
      " " +
      t("referee.fullscreenBtn", "Full screen") +
      "</button>" +
      '<button type="button" class="btn btn-primary btn-block"' +
      (canConfirm ? "" : " disabled") +
      ' data-referee-confirm-score="' +
      matchId +
      '">' +
      t("referee.confirmScore", "Confirm score") +
      "</button></div>";
    return html;
  }

  function renderFullscreenQuick(profile, matchId) {
    if (profile === "game_tennis") {
      return (
        '<button type="button" class="referee-fs-quick-btn referee-fs-confirm" data-referee-confirm-score="' +
        matchId +
        '">' +
        t("referee.confirmScore", "Confirm") +
        "</button>"
      );
    }
    if (profile === "race_points") {
      return (
        [1, 2, 3]
          .map(
            (n) =>
              '<button type="button" class="referee-fs-quick-btn" data-referee-fs-add="' +
              matchId +
              '" data-side="1" data-add="' +
              n +
              '">L+' +
              n +
              "</button>",
          )
          .join("") +
        [1, 2, 3]
          .map(
            (n) =>
              '<button type="button" class="referee-fs-quick-btn" data-referee-fs-add="' +
              matchId +
              '" data-side="2" data-add="' +
              n +
              '">R+' +
              n +
              "</button>",
          )
          .join("") +
        '<button type="button" class="referee-fs-quick-btn referee-fs-confirm" data-referee-confirm-score="' +
        matchId +
        '">' +
        t("referee.confirmScore", "Confirm") +
        "</button>"
      );
    }
    return (
      '<button type="button" class="referee-fs-quick-btn referee-fs-confirm" data-referee-confirm-score="' +
      matchId +
      '">' +
      t("referee.confirmScore", "Confirm") +
      "</button>"
    );
  }

  function renderFullscreen(root, ev) {
    const match = T()?.findMatch?.(activeMatchId);
    if (!match) {
      closeFullscreen();
      return;
    }
    root.hidden = false;
    root.setAttribute("aria-hidden", "false");
    const profile = getProfile(ev);
    const t1 = formatSide(match.team1, ev);
    const t2 = formatSide(match.team2, ev);
    const s1 = formatStepperValue(match, 1, ev, profile);
    const s2 = formatStepperValue(match, 2, ev, profile);
    const targetLabel = S() ? S().targetLabel(ev, profile) : "/" + (ev.maxScore ?? 24);
    const sport = getEventSport(ev);
    root.dataset.sport = sport;
    const bumpLabel = profile === "game_tennis" ? t("score.point", "+ Point") : "+1";

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
      '<div class="referee-fs-bump">' +
      bumpLabel +
      "</div></button>" +
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
      '<div class="referee-fs-bump">' +
      bumpLabel +
      "</div></button></div>" +
      '<div class="referee-fs-quick">' +
      renderFullscreenQuick(profile, activeMatchId) +
      "</div></div>";
  }

  function applyAll() {
    document.querySelectorAll("[data-referee-setup]").forEach((el) => {
      const form = el.querySelector("[data-referee-setup-form]") || el;
      renderSetup(form);
    });
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
