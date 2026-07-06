/* Match Point — client-side tournament demo engine (mockup only) */
window.MP_Tournament = (function () {
  const STORAGE_KEY = "mp-event";

  const FORMATS = [
    { id: "americano", label: "Americano", icon: "🔄", descKey: "flow.americanoAdminDesc" },
    { id: "mexicano", label: "Mexicano", icon: "📈", descKey: "flow.mexicanoAdminDesc" },
    { id: "single_elim", label: "Single Elimination", icon: "🏆", descKey: "flow.bracketAdminDesc" },
    { id: "double_elim", label: "Double Elimination", icon: "🏆", descKey: "format.doubleElim" },
    { id: "round_robin", label: "Round Robin", icon: "🔁", descKey: "format.roundRobin" },
    { id: "group_knockout", label: "Group → Knockout", icon: "📊", descKey: "format.groupKo" },
    { id: "league", label: "League", icon: "📅", descKey: "format.league" },
    { id: "box_league", label: "Box League", icon: "📦", descKey: "format.boxLeague" },
  ];

  const SCORING_MODES = [
    { id: "race_to_n", label: "Race to N" },
    { id: "normal_sets", label: "Normal sets" },
    { id: "best_of_n", label: "Best of N" },
    { id: "single_set", label: "Single set" },
    { id: "super_tiebreak", label: "Super tiebreak" },
  ];

  const CATEGORIES = ["singles", "doubles", "mixed"];

  let current = null;

  function load() {
    try {
      current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch (_) {
      current = null;
    }
  }

  function save() {
    if (current) localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    else localStorage.removeItem(STORAGE_KEY);
  }

  function blankStats() {
    return { w: 0, t: 0, l: 0, pf: 0, pa: 0, pts: 0 };
  }

  function demoPlayers(n) {
    const names = [
      "Budi", "Rudi", "Sari", "Dina", "Andi", "Carla", "Henry", "Dewi",
      "Maya", "Doni", "Rina", "Eko", "Fira", "Gita", "Hadi", "Ira",
    ];
    return names.slice(0, n).map((name, i) => ({
      id: "p" + (i + 1),
      name,
      seed: i + 1,
      ...blankStats(),
    }));
  }

  function normalizePlayers(players) {
    return players.map((p, i) => ({
      id: String(p.id || "p" + (i + 1)),
      name: p.name || "Player " + (i + 1),
      seed: p.seed || i + 1,
      ...blankStats(),
      ...(p.w != null ? { w: p.w, t: p.t, l: p.l, pf: p.pf, pa: p.pa, pts: p.pts } : {}),
    }));
  }

  function isSocial(ev) {
    ev = ev || current;
    if (!ev) return false;
    return ev.format === "americano" || ev.format === "mexicano" || ev.eventType === "americano" || ev.eventType === "mexicano";
  }

  function isDoublesMatch(ev) {
    ev = ev || current;
    if (!ev) return true;
    if (isSocial(ev)) return true;
    if (ev.eventType === "doubles") return true;
    const cat = ev.category || "";
    return cat.includes("doubles") || cat === "mixed" || cat === "doubles_men" || cat === "doubles_women";
  }

  function isSetsScoring(ev) {
    ev = ev || current;
    if (!ev) return false;
    return ev.scoring && ev.scoring !== "race_to_n";
  }

  function scoreCap(ev) {
    ev = ev || current;
    if (!ev) return 24;
    if (isSetsScoring(ev)) {
      if (ev.scoring === "single_set") return 1;
      return ev.bestOf || 3;
    }
    return ev.maxScore ?? ev.raceTo ?? 24;
  }

  function defaultCourtCount(players, doubles) {
    const n = players.length;
    if (doubles) return Math.max(1, Math.min(4, Math.floor(n / 4)));
    return Math.max(1, Math.min(4, Math.floor(n / 2)));
  }

  function createEvent(opts) {
    opts = opts || {};
    const raw =
      opts.roster && opts.roster.length
        ? opts.roster.map((p, i) => ({ id: p.id, name: p.name, seed: i + 1 }))
        : demoPlayers(opts.capacity || 8);
    const players = normalizePlayers(raw);
    const doubles = opts.eventType === "doubles" || (opts.category && String(opts.category).includes("doubles")) || opts.category === "mixed";
    const courtCount = opts.courtCount || defaultCourtCount(players, doubles && !isSocial({ format: opts.format }));

    const sport = (window.MP_Sport && MP_Sport.get()) || "padel";
    const bracketClass =
      opts.bracketClass || opts.eligibility?.bracketClass || "open";

    current = {
      id: "ev" + Date.now(),
      format: opts.format || "americano",
      eventType: opts.eventType || "",
      structure: opts.structure || "",
      division: opts.division || "",
      bracketClass,
      name: opts.name || "Community Event",
      sport,
      category: opts.category || "doubles",
      scoring: opts.scoring || defaultScoringForFormat(opts.format),
      raceTo: opts.raceTo || 24,
      maxScore: opts.raceTo || opts.maxScore || 24,
      bestOf: opts.bestOf || 3,
      capacity: opts.capacity || players.length,
      courtCount,
      courtNames: opts.courtNames || Array.from({ length: courtCount }, (_, i) => "Court " + (i + 1)),
      tier: opts.tier || null,
      scope: opts.scope || "community",
      rankTarget: opts.tier ? "global" : "mabar",
      round: 1,
      totalRounds: 0,
      phase: "group",
      players,
      teams: [],
      rounds: [],
      sessionReady: false,
      published: true,
      demoKind: opts.demoKind || "",
      eventType: opts.eventType || "",
      sparringMode: opts.sparringMode || null,
      rankWeight: opts.rankWeight != null ? opts.rankWeight : null,
      eligibility:
        opts.eligibility ||
        (window.MP_Rank && bracketClass
          ? MP_Rank.eligibilityFromBracket(sport, bracketClass)
          : null),
      scope: opts.scope || (opts.eventType === "battle_of_communities" || opts.eventType === "community_sparring" ? "inter_community" : "community"),
    };

    current.teams = buildTeams(current.players, isDoublesMatch(current));
    current.totalRounds = estimateTotalRounds(current);

    if (current.format === "single_elim" || current.format === "double_elim") {
      current.bracket = generateBracket(players, current.format === "double_elim");
    }

    save();
    return current;
  }

  function buildTeams(players, doubles) {
    if (!doubles) {
      return players.map((p) => ({
        id: "t-" + p.id,
        name: p.name,
        players: [p],
      }));
    }
    const teams = [];
    for (let i = 0; i < players.length; i += 2) {
      const a = players[i];
      const b = players[i + 1];
      if (b) {
        teams.push({
          id: "team" + (teams.length + 1),
          name: a.name + " / " + b.name,
          players: [a, b],
        });
      } else {
        teams.push({ id: "team" + (teams.length + 1), name: a.name, players: [a] });
      }
    }
    return teams;
  }

  function estimateTotalRounds(ev) {
    ev = ev || current;
    if (!ev) return 1;
    if (isSocial(ev)) return Math.max(ev.players.length - 1, 1);
    const entities = isDoublesMatch(ev) ? ev.teams?.length || Math.ceil(ev.players.length / 2) : ev.players.length;
    if (ev.format === "group_knockout") return Math.ceil(entities / 2) + 2;
    if (ev.format === "league" || ev.format === "box_league" || ev.format === "round_robin") return Math.max(entities - 1, 1);
    return Math.max(entities - 1, 1);
  }

  function get() {
    if (!current) load();
    return current;
  }

  function configureSession(opts) {
    if (!current) return null;
    if (opts.name) current.name = opts.name;
    if (opts.scoring) current.scoring = opts.scoring;
    if (opts.bestOf != null) current.bestOf = opts.bestOf;
    if (opts.maxScore != null) {
      current.maxScore = opts.maxScore;
      if (!isSetsScoring(current)) current.raceTo = opts.maxScore;
    }
    if (opts.courtCount != null) current.courtCount = opts.courtCount;
    if (opts.courtNames) current.courtNames = opts.courtNames;
    if (opts.playerNames && opts.playerNames.length) {
      current.players = normalizePlayers(
        opts.playerNames.map((name, i) => ({
          id: current.players[i]?.id || "p" + (i + 1),
          name,
          ...(current.players[i] || {}),
        })),
      );
      current.capacity = current.players.length;
      current.teams = buildTeams(current.players, isDoublesMatch(current));
      current.totalRounds = estimateTotalRounds(current);
    }
    save();
    return current;
  }

  function estimateSession(ev) {
    return fixEstimateSession(ev);
  }

  function fixEstimateSession(ev) {
    ev = ev || get();
    if (!ev) return null;
    const courts = ev.courtCount || 2;
    const entityCount = isDoublesMatch(ev) && !isSocial(ev)
      ? (ev.teams?.length || Math.ceil((ev.players?.length || 8) / 2))
      : (ev.players?.length || 8);
    let matches = 0;
    if (isSocial(ev)) {
      matches = (ev.totalRounds || Math.max(entityCount - 1, 1)) * courts;
    } else if (ev.format === "group_knockout") {
      matches = entityCount + Math.floor(entityCount / 2);
    } else {
      matches = (entityCount * (entityCount - 1)) / 2;
    }
    const perPlayer = isSocial(ev) ? (ev.totalRounds || entityCount - 1) : entityCount - 1;
    const mins = Math.max(Math.round(matches), 1) * 10 + 5;
    return {
      matches: Math.round(matches),
      duration: Math.floor(mins / 60) + "h " + (mins % 60) + "m",
      perPlayer: Math.max(perPlayer, 1),
    };
  }

  function makeMatch(id, courtIndex, team1, team2, extra) {
    return {
      id,
      court: courtIndex + 1,
      courtIndex,
      team1,
      team2,
      score1: null,
      score2: null,
      done: false,
      ...extra,
    };
  }

  function generateAmericanoRotation(players, courts, round) {
    const n = players.length;
    const result = [];
    const shuffled = [...players].sort((a, b) => {
      const ha = (parseInt(String(a.id).replace(/\D/g, ""), 10) + round * 7) % n;
      const hb = (parseInt(String(b.id).replace(/\D/g, ""), 10) + round * 3) % n;
      return ha - hb;
    });
    for (let c = 0; c < courts; c++) {
      if (n < 4) break;
      const base = (c * 4 + round) % n;
      const p = (i) => shuffled[(base + i) % n];
      result.push(makeMatch("r" + round + "c" + (c + 1), c, [p(0), p(1)], [p(2), p(3)]));
    }
    return result;
  }

  function generateMexicanoPairing(players, courts, round) {
    const sorted = [...players].sort((a, b) => (b.pf || b.pts || 0) - (a.pf || a.pts || 0));
    const result = [];
    for (let c = 0; c < (courts || 1); c++) {
      const off = c * 4;
      if (sorted.length < off + 4) break;
      result.push(
        makeMatch("r" + round + "c" + (c + 1), c, [sorted[off], sorted[off + 3]], [sorted[off + 1], sorted[off + 2]], {
          label: "#" + (off + 1) + "+#" + (off + 4) + " vs #" + (off + 2) + "+#" + (off + 3),
        }),
      );
    }
    return result.length ? result : generateAmericanoRotation(players, 1, round || 1);
  }

  function allPairings(entities) {
    const fixtures = [];
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        fixtures.push({ a: entities[i], b: entities[j] });
      }
    }
    return fixtures;
  }

  function entityToTeamSide(entity) {
    if (entity.players) return entity.players;
    return [entity];
  }

  function chunkIntoRounds(fixtures, courtsPerRound) {
    const rounds = [];
    let pool = [...fixtures];
    let r = 1;
    while (pool.length) {
      const batch = pool.splice(0, courtsPerRound);
      const matches = batch.map((f, i) =>
        makeMatch("r" + r + "m" + (i + 1), i % courtsPerRound, entityToTeamSide(f.a), entityToTeamSide(f.b), {
          teamAId: f.a.id,
          teamBId: f.b.id,
        }),
      );
      rounds.push({ round: r, matches, label: "Round " + r });
      r++;
    }
    return rounds;
  }

  function generateCompetitiveSchedule() {
    const courts = current.courtCount || 2;
    const entities = isDoublesMatch(current) ? current.teams : current.players;
    const fixtures = allPairings(entities);

    if (current.format === "group_knockout") {
      const half = Math.ceil(entities.length / 2);
      const groupA = entities.slice(0, half);
      const groupB = entities.slice(half);
      const groupFixtures = [...allPairings(groupA), ...allPairings(groupB)];
      current.phase = "group";
      current.rounds = chunkIntoRounds(groupFixtures, courts);
      current.totalRounds = current.rounds.length;
    } else if (current.format === "league") {
      current.phase = "league";
      current.rounds = chunkIntoRounds(fixtures, courts).map((rd, i) => ({
        ...rd,
        round: i + 1,
        label: "GW " + (i + 1),
      }));
      current.totalRounds = current.rounds.length;
    } else if (current.format === "box_league") {
      const boxSize = 4;
      const boxes = [];
      for (let i = 0; i < entities.length; i += boxSize) {
        boxes.push(entities.slice(i, i + boxSize));
      }
      current.phase = "box_league";
      current.boxes = boxes.map((box, bi) => ({
        id: "box" + (bi + 1),
        label: "Box " + String.fromCharCode(65 + bi),
        players: box,
        promoteZone: 2,
        relegateZone: 2,
      }));
      const boxFixtures = [];
      current.boxes.forEach((box) => {
        boxFixtures.push(...allPairings(box.players));
      });
      current.rounds = chunkIntoRounds(boxFixtures, courts).map((rd, i) => ({
        ...rd,
        round: i + 1,
        label: "Box RR " + (i + 1),
      }));
      current.totalRounds = current.rounds.length;
    } else {
      current.phase = "round_robin";
      current.rounds = chunkIntoRounds(fixtures, courts);
      current.totalRounds = current.rounds.length;
    }

    current.round = 1;
    current.sessionReady = true;
    syncCourtsFromRound();
    save();
    return current;
  }

  function generateSocialSchedule() {
    const courts = current.courtCount || 2;
    const n = current.players.length;
    current.totalRounds = Math.max(n - 1, 1);
    current.rounds = [];
    for (let r = 1; r <= current.totalRounds; r++) {
      const pairings =
        current.format === "mexicano" && r > 1
          ? generateMexicanoPairing(current.players, courts, r)
          : generateAmericanoRotation(current.players, courts, r);
      current.rounds.push({ round: r, matches: pairings, label: "Round " + r });
    }
    current.round = 1;
    current.sessionReady = true;
    syncCourtsFromRound();
    save();
    return current;
  }

  function generateSchedule() {
    if (!current) return null;
    current.teams = buildTeams(current.players, isDoublesMatch(current));
    if (isSocial(current)) return generateSocialSchedule();
    return generateCompetitiveSchedule();
  }

  function syncCourtsFromRound() {
    if (!current?.rounds?.length) return;
    const rd = current.rounds.find((r) => r.round === current.round);
    current.courts = rd ? rd.matches : [];
  }

  function getCurrentRoundMatches() {
    if (!current) return [];
    if (current.rounds?.length) {
      const rd = current.rounds.find((r) => r.round === current.round);
      return rd ? rd.matches : [];
    }
    return current.courts || [];
  }

  function getRoundLabel() {
    if (!current?.rounds?.length) return "Round " + (current?.round || 1);
    const rd = current.rounds.find((r) => r.round === current.round);
    return rd?.label || "Round " + current.round;
  }

  function findMatch(matchId) {
    if (!current?.rounds) return null;
    for (const rd of current.rounds) {
      const m = rd.matches.find((x) => x.id === matchId);
      if (m) return m;
    }
    return (current.courts || []).find((x) => x.id === matchId) || null;
  }

  function findPlayer(id) {
    return current?.players?.find((p) => String(p.id) === String(id));
  }

  function revertMatchStats(m) {
    if (!m.done || m.score1 == null || m.score2 == null) return;
    const s1 = m.score1;
    const s2 = m.score2;
    const applyRevert = (players, scored, conceded, won) => {
      players.forEach((tp) => {
        const p = findPlayer(tp.id);
        if (!p) return;
        if (isSetsScoring()) {
          p.pf -= scored;
          p.pa -= conceded;
        } else {
          p.pf -= scored;
          p.pa -= conceded;
        }
        p.pts = isSetsScoring() ? p.w * 3 + p.t : p.pf;
        if (won === "tie") p.t--;
        else if (won === "win") p.w--;
        else p.l--;
      });
    };
    if (s1 > s2) {
      applyRevert(m.team1, s1, s2, "win");
      applyRevert(m.team2, s2, s1, "loss");
    } else if (s1 === s2) {
      applyRevert(m.team1, s1, s2, "tie");
      applyRevert(m.team2, s2, s1, "tie");
    } else {
      applyRevert(m.team1, s1, s2, "loss");
      applyRevert(m.team2, s2, s1, "win");
    }
  }

  function applyPlayerResult(p, scored, conceded, result) {
    if (isSetsScoring()) {
      p.pf += scored;
      p.pa += conceded;
      if (result === "win") {
        p.w++;
        p.pts += 3;
      } else if (result === "tie") {
        p.t++;
        p.pts += 1;
      } else p.l++;
    } else {
      p.pf += scored;
      p.pa += conceded;
      p.pts = p.pf;
      if (result === "win") p.w++;
      else if (result === "tie") p.t++;
      else p.l++;
    }
  }

  function applyMatchScore(matchId, score1, score2) {
    const m = findMatch(matchId);
    if (!m || score1 == null || score2 == null) return null;
    if (m.done) revertMatchStats(m);
    m.score1 = score1;
    m.score2 = score2;
    m.done = true;

    let r1 = "loss";
    let r2 = "loss";
    if (score1 > score2) {
      r1 = "win";
    } else if (score1 < score2) {
      r2 = "win";
    } else {
      r1 = r2 = "tie";
    }

    m.team1.forEach((tp) => {
      const p = findPlayer(tp.id);
      if (p) applyPlayerResult(p, score1, score2, r1);
    });
    m.team2.forEach((tp) => {
      const p = findPlayer(tp.id);
      if (p) applyPlayerResult(p, score2, score1, r2);
    });

    syncCourtsFromRound();
    save();
    return current;
  }

  function setMatchScoreSide(matchId, side, value) {
    const m = findMatch(matchId);
    if (!m) return null;
    const cap = scoreCap();
    if (side === 1) m.score1 = Math.min(value, cap);
    else m.score2 = Math.min(value, cap);
    save();
    return m;
  }

  function confirmMatchScore(matchId) {
    const m = findMatch(matchId);
    if (!m || m.score1 == null || m.score2 == null) return null;
    return applyMatchScore(matchId, m.score1, m.score2);
  }

  function bumpMatchScore(matchId, side, add) {
    const m = findMatch(matchId);
    if (!m) return null;
    const cap = scoreCap();
    if (side === 1) m.score1 = Math.min((m.score1 || 0) + add, cap);
    else m.score2 = Math.min((m.score2 || 0) + add, cap);
    save();
    return m;
  }

  function getStandings() {
    if (!current?.players) return [];
    return [...current.players].sort((a, b) => {
      if (isSetsScoring()) {
        const d = (b.pts || 0) - (a.pts || 0);
        if (d !== 0) return d;
      }
      const d = (b.pf || 0) - (a.pf || 0);
      if (d !== 0) return d;
      return (b.pf - b.pa) - (a.pf - a.pa);
    });
  }

  function addCourt() {
    if (!current) return;
    current.courtCount = (current.courtCount || 1) + 1;
    current.courtNames = current.courtNames || [];
    current.courtNames.push("Court " + current.courtCount);
    save();
  }

  function removeCourt() {
    if (!current || current.courtCount <= 1) return;
    current.courtCount--;
    current.courtNames.pop();
    save();
  }

  function generateBracket(players, double) {
    const matches = [];
    for (let i = 0; i < players.length; i += 2) {
      if (players[i + 1]) {
        matches.push({
          id: "m" + i,
          p1: players[i],
          p2: players[i + 1],
          winner: i === 0 ? players[i] : null,
          score: i === 0 ? "6-3, 6-4" : null,
        });
      }
    }
    return { type: double ? "double" : "single", rounds: [{ name: "Semifinal", matches }], final: null };
  }

  function generateRoundRobin(players) {
    const fixtures = [];
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        fixtures.push({ p1: players[i], p2: players[j], played: fixtures.length < 2 });
      }
    }
    return fixtures;
  }

  function advanceRound() {
    if (!current) return null;
    if (current.rounds?.length && current.round < current.totalRounds) {
      current.round++;
      syncCourtsFromRound();
    }
    save();
    return current;
  }

  function finalize(opts) {
    if (!current) return null;
    current.finalized = true;
    save();
    if (window.MP_Rank) {
      MP_Rank.finalizeEvent(current, opts || { delta: 20, mabarBonus: 5 });
    }
    return current;
  }

  function formatScoreDisplay(m) {
    const cap = scoreCap();
    const unit = isSetsScoring() ? " sets" : "";
    if (m.score1 != null && m.score2 != null) {
      return m.score1 + " – " + m.score2 + (isSetsScoring() ? unit : " <small>/ " + cap + "</small>");
    }
    return '<span class="live-pulse">Live</span>';
  }

  function renderCourts(container, courts) {
    if (!container || !courts) return;
    container.innerHTML = courts
      .map((c) => {
        const cn = current?.courtNames?.[c.courtIndex] || "Court " + c.court;
        const t1 = c.team1.map((p) => p.name).join(isDoublesMatch() && c.team1.length > 1 ? " + " : "");
        const t2 = c.team2.map((p) => p.name).join(isDoublesMatch() && c.team2.length > 1 ? " + " : "");
        return (
          '<div class="rotation-court">' +
          '<span class="rotation-court-label">' + cn + "</span>" +
          '<div class="rotation-match"><span>' + t1 + '</span><span class="rotation-vs">vs</span><span>' + t2 + "</span></div>" +
          '<div class="rotation-score">' + formatScoreDisplay(c) + "</div></div>"
        );
      })
      .join("");
  }

  function renderBracket(container, bracket) {
    if (!container || !bracket) return;
    let html = "";
    bracket.rounds.forEach((round) => {
      html += '<div class="bracket-round">' + round.name + "</div>";
      round.matches.forEach((m) => {
        const w = m.winner ? 'class="winner"' : "";
        html += '<div class="bracket-match"><span ' + w + ">" + m.p1.name + "</span> vs " + m.p2.name + ' → <strong>' + (m.score || "<em>belum</em>") + "</strong></div>";
      });
    });
    container.innerHTML = html;
  }

  function renderStandings(container, standings) {
    if (!container || !standings) return;
    container.innerHTML =
      '<ul class="leaderboard-list compact">' +
      standings
        .map(
          (s, i) =>
            '<li class="lb-row"><span class="lb-rank' + (i === 0 ? " gold" : "") + '">' + (i + 1) +
            '</span><div class="lb-info"><div class="lb-name">' + s.name + '</div></div><span class="lb-points">' +
            (isSetsScoring() ? (s.pts || 0) : (s.pf || s.pts || 0)) + "</span></li>",
        )
        .join("") +
      "</ul>";
  }

  function defaultScoringForFormat(format) {
    if (format === "americano" || format === "mexicano") return "race_to_n";
    if (format === "single_elim" || format === "double_elim") return "best_of_n";
    return "normal_sets";
  }

  function defaultInterCommunityRubric(module) {
    if (window.MP_InterCommunity) return MP_InterCommunity.defaultRubric(module || "normal");
    return {
      templateId: module === "king_queen" ? "king_queen_3d_1s" : "3d_1s",
      gamesPerSet: 8,
      slots: [
        { kind: "doubles", warPoints: 1 },
        { kind: "doubles", warPoints: module === "king_queen" ? 2 : 1, role: module === "king_queen" ? "king_queen" : null },
        { kind: "doubles", warPoints: 1 },
        { kind: "singles", warPoints: 1 },
      ],
      winCondition: "most_war_points",
      scope: "inter_community",
    };
  }

  function createInterCommunityEvent(opts) {
    opts = opts || {};
    const rubric =
      opts.rubric ||
      (opts.eventType === "battle_of_communities" || opts.sparringMode === "ranked"
        ? defaultInterCommunityRubric(opts.module)
        : null);
    return createEvent({
      ...opts,
      scope: "inter_community",
      rubric,
      penalties:
        opts.penalties ||
        (opts.sparringMode === "ranked" || opts.eventType === "battle_of_communities"
          ? { gamesPerSet: 8, gameDeficit: 1, squadDeadlineDays: 3 }
          : null),
    });
  }

  function init() {
    load();
    document.querySelectorAll("[data-tournament-live]").forEach((root) => {
      const ev = get();
      if (!ev) return;
      if (root.hasAttribute("data-referee-live")) return;
      const courts = root.querySelector("[data-tournament-courts]");
      const bracket = root.querySelector("[data-tournament-bracket]");
      const standings = root.querySelector("[data-tournament-standings]");
      const liveMatches = getCurrentRoundMatches();
      if (courts && liveMatches.length) renderCourts(courts, liveMatches);
      if (bracket && ev.bracket) renderBracket(bracket, ev.bracket);
      if (standings) renderStandings(standings, getStandings());
    });
    if (window.MP_Referee) MP_Referee.applyAll();
  }

  return {
    FORMATS,
    SCORING_MODES,
    CATEGORIES,
    createEvent,
    get,
    configureSession,
    estimateSession: fixEstimateSession,
    generateSchedule,
    getCurrentRoundMatches,
    getRoundLabel,
    findMatch,
    applyMatchScore,
    setMatchScoreSide,
    confirmMatchScore,
    bumpMatchScore,
    getStandings,
    addCourt,
    removeCourt,
    advanceRound,
    finalize,
    isSocial,
    isDoublesMatch,
    isSetsScoring,
    scoreCap,
    generateAmericanoRotation,
    generateMexicanoPairing,
    generateBracket,
    generateRoundRobin,
    renderCourts,
    renderBracket,
    renderStandings,
    defaultScoringForFormat,
    defaultInterCommunityRubric,
    createInterCommunityEvent,
    init,
  };
})();
