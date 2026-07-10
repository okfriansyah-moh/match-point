/* Match Point — format/sport-aware scoring profiles (mockup engine) */
window.MP_ScoringRules = (function () {
  const GAME_POINTS = [0, 15, 30, 40];

  const PROFILES = {
    race_points: {
      id: "race_points",
      labelKey: "score.profileRace",
      hintKey: "score.hintRace",
    },
    game_tennis: {
      id: "game_tennis",
      labelKey: "score.profileGame",
      hintKey: "score.hintGame",
    },
    rally_21: {
      id: "rally_21",
      labelKey: "score.profileRally21",
      hintKey: "score.hintRally21",
      cap: 30,
      target: 21,
    },
    rally_11: {
      id: "rally_11",
      labelKey: "score.profileRally11",
      hintKey: "score.hintRally11",
      cap: 99,
      target: 11,
    },
    sets_won: {
      id: "sets_won",
      labelKey: "score.profileSets",
      hintKey: "score.hintSets",
    },
  };

  function isSocial(ev) {
    if (!ev) return false;
    return (
      ev.format === "americano" ||
      ev.format === "mexicano" ||
      ev.eventType === "americano" ||
      ev.eventType === "mexicano"
    );
  }

  function resolveProfile(ev) {
    if (!ev) return "race_points";
    if (isSocial(ev)) return "race_points";
    if (ev.sport === "badminton") return "rally_21";
    if (ev.sport === "table_tennis") return "rally_11";
    if (["padel", "tennis", "pickleball"].includes(ev.sport)) {
      if (ev.scoring && ev.scoring !== "race_to_n") return "sets_won";
      return "game_tennis";
    }
    if (ev.scoring && ev.scoring !== "race_to_n") return "sets_won";
    return "race_points";
  }

  function ensureMatchState(m) {
    if (!m.gameState) {
      m.gameState = { deuce: false, advSide: 0 };
    }
    if (!m.setScores) {
      m.setScores = { sets1: 0, sets2: 0, game1: 0, game2: 0 };
    }
    return m;
  }

  function formatPoint(value, profile, gameState) {
    profile = profile || "race_points";
    if (profile === "game_tennis") {
      if (gameState?.deuce) {
        if (gameState.advSide === 1) return "AD";
        if (gameState.advSide === 2) return "40";
      }
      if (value === 50) return "AD";
      return String(value);
    }
    return String(value != null ? value : 0);
  }

  function formatScoreline(s1, s2, profile, gameState) {
    return (
      formatPoint(s1, profile, gameState) +
      " – " +
      formatPoint(s2, profile, gameState)
    );
  }

  function targetLabel(ev, profile) {
    profile = profile || resolveProfile(ev);
    if (profile === "race_points") {
      return "/" + (ev.maxScore ?? ev.raceTo ?? 24);
    }
    if (profile === "rally_21") return "/21";
    if (profile === "rally_11") return "/11";
    if (profile === "sets_won") return "BO" + (ev.bestOf || 3);
    return "";
  }

  function nextGamePoint(current, opponent) {
    if (current === 40 && opponent < 40) return { value: 50, won: true };
    if (current === 40 && opponent === 40) return { value: 40, deuce: true };
    if (current === 50) return { value: 50, won: true };
    if (current === 40 && opponent === 50) return { value: 40, deuce: true, clearAdv: true };
    const idx = GAME_POINTS.indexOf(current);
    if (idx >= 0 && idx < GAME_POINTS.length - 1) {
      return { value: GAME_POINTS[idx + 1], won: false };
    }
    return { value: current, won: false };
  }

  function bumpGameTennis(m, side, delta) {
    ensureMatchState(m);
    const gs = m.gameState;
    let s1 = m.score1 != null ? m.score1 : 0;
    let s2 = m.score2 != null ? m.score2 : 0;

    if (delta < 0) {
      if (side === 1) s1 = Math.max(0, s1 === 50 ? 40 : GAME_POINTS[Math.max(GAME_POINTS.indexOf(s1) - 1, 0)] || 0);
      else s2 = Math.max(0, s2 === 50 ? 40 : GAME_POINTS[Math.max(GAME_POINTS.indexOf(s2) - 1, 0)] || 0);
      gs.deuce = s1 === 40 && s2 === 40;
      gs.advSide = 0;
      m.score1 = s1;
      m.score2 = s2;
      return m;
    }

    if (gs.deuce) {
      if (gs.advSide === 0) {
        gs.advSide = side;
        if (side === 1) s1 = 50;
        else s2 = 50;
      } else if (gs.advSide === side) {
        m.setScores.sets1 += side === 1 ? 1 : 0;
        m.setScores.sets2 += side === 2 ? 1 : 0;
        s1 = 0;
        s2 = 0;
        gs.deuce = false;
        gs.advSide = 0;
      } else {
        gs.deuce = true;
        gs.advSide = 0;
        s1 = 40;
        s2 = 40;
      }
    } else {
      const cur = side === 1 ? s1 : s2;
      const opp = side === 1 ? s2 : s1;
      const next = nextGamePoint(cur, opp);
      if (next.won) {
        m.setScores.sets1 += side === 1 ? 1 : 0;
        m.setScores.sets2 += side === 2 ? 1 : 0;
        s1 = 0;
        s2 = 0;
        gs.deuce = false;
        gs.advSide = 0;
      } else if (next.deuce) {
        s1 = 40;
        s2 = 40;
        gs.deuce = true;
        gs.advSide = 0;
      } else {
        if (side === 1) s1 = next.value;
        else s2 = next.value;
      }
    }
    m.score1 = s1;
    m.score2 = s2;
    return m;
  }

  function bumpRally(m, side, delta, profile) {
    const p = PROFILES[profile] || PROFILES.rally_21;
    const cap = p.cap || 30;
    const target = p.target || 21;
    let s1 = m.score1 != null ? m.score1 : 0;
    let s2 = m.score2 != null ? m.score2 : 0;
    if (side === 1) s1 = Math.max(0, Math.min(s1 + delta, cap));
    else s2 = Math.max(0, Math.min(s2 + delta, cap));
    m.score1 = s1;
    m.score2 = s2;
    m._rallyTarget = target;
    return m;
  }

  function bumpRace(m, side, delta, cap) {
    if (side === 1) m.score1 = Math.min((m.score1 || 0) + delta, cap);
    else m.score2 = Math.min((m.score2 || 0) + delta, cap);
    return m;
  }

  function bumpSets(m, side, delta, cap) {
    if (side === 1) m.score1 = Math.min((m.score1 || 0) + delta, cap);
    else m.score2 = Math.min((m.score2 || 0) + delta, cap);
    return m;
  }

  function bumpMatch(m, side, delta, ev) {
    if (!m) return null;
    const profile = resolveProfile(ev);
    const cap =
      profile === "race_points"
        ? ev.maxScore ?? ev.raceTo ?? 24
        : profile === "sets_won"
          ? ev.bestOf || 3
          : profile === "rally_21"
            ? 30
            : profile === "rally_11"
              ? 99
              : 24;

    if (profile === "game_tennis") return bumpGameTennis(m, side, delta);
    if (profile === "rally_21" || profile === "rally_11") return bumpRally(m, side, delta, profile);
    if (profile === "sets_won") return bumpSets(m, side, delta, cap);
    return bumpRace(m, side, delta, cap);
  }

  function rallyWon(s1, s2, target) {
    if (s1 >= target && s1 - s2 >= 2) return 1;
    if (s2 >= target && s2 - s1 >= 2) return 2;
    return 0;
  }

  function canConfirm(m, ev) {
    if (!m || m.score1 == null || m.score2 == null) return false;
    const profile = resolveProfile(ev);
    const s1 = m.score1;
    const s2 = m.score2;

    if (profile === "race_points") {
      const cap = ev.maxScore ?? ev.raceTo ?? 24;
      return (s1 >= cap || s2 >= cap) && s1 !== s2;
    }
    if (profile === "rally_21") return rallyWon(s1, s2, 21) > 0;
    if (profile === "rally_11") return rallyWon(s1, s2, 11) > 0;
    if (profile === "sets_won") {
      const need = Math.ceil((ev.bestOf || 3) / 2);
      return s1 >= need || s2 >= need;
    }
    if (profile === "game_tennis") {
      ensureMatchState(m);
      const need = Math.ceil((ev.bestOf || 3) / 2);
      return m.setScores.sets1 >= need || m.setScores.sets2 >= need;
    }
    return s1 !== s2;
  }

  function resultScores(m, ev) {
    const profile = resolveProfile(ev);
    if (profile === "game_tennis" && m.setScores) {
      return { score1: m.setScores.sets1, score2: m.setScores.sets2 };
    }
    return { score1: m.score1, score2: m.score2 };
  }

  function profileMeta(ev) {
    const id = resolveProfile(ev);
    return { ...PROFILES[id], id };
  }

  function deuceLabel(m) {
    ensureMatchState(m);
    const gs = m.gameState;
    if (!gs.deuce) return "";
    if (gs.advSide === 1) return "AD";
    if (gs.advSide === 2) return "AD";
    return "Deuce";
  }

  return {
    PROFILES,
    resolveProfile,
    formatPoint,
    formatScoreline,
    targetLabel,
    bumpMatch,
    canConfirm,
    resultScores,
    profileMeta,
    deuceLabel,
    ensureMatchState,
    isSocial,
  };
})();
