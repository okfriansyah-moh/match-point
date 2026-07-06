/* Gallery design notes — SHARED rank mechanics + screen merge */
window.MP_GalleryNotesData = (function () {
  function L(id, en) {
    return { id, en };
  }

  function c(n, anchor, name, what, why, position) {
    return {
      callout: n,
      anchor,
      name: L(name.id || name, name.en || name),
      what: L(what.id || what, what.en || what),
      why: L(why.id || why, why.en || why),
      position,
    };
  }

  const SHARED = {
    rankMovement: {
      purpose: L(
        "Tiga lapisan per olahraga: MP Rating (skill terpercaya dari Glicko), poin MP (Mabar/Global dari 0), dan hint referensi ≈ WPR/UTR/DUPR — dihitung dari matchmu, bukan diimpor. Kelas bracket (Beginner/Intermediate/…) terikat rentang MP Rating.",
        "Three layers per sport: MP Rating (trusted Glicko skill), MP pts (Mabar/Global from 0), and ≈ WPR/UTR/DUPR reference hints — computed from your matches, not imported. Bracket classes (Beginner/Intermediate/…) bind to MP Rating ranges.",
      ),
      sections: [
        {
          title: L("Tiga angka di profilmu", "Three numbers on your profile"),
          items: [
            L(
              "MP Rating — skill dari match terverifikasi. Belum dinilai → Provisional (est.) → Stable ✓. Dipakai bracket turnamen.",
              "MP Rating — skill from verified matches. Unrated → Provisional (est.) → Stable ✓. Used for tournament brackets.",
            ),
            L(
              "Poin MP (Mabar / Global) — leaderboard klub & prestise lintas Indonesia. Mulai 0, bukan 1200.",
              "MP pts (Mabar / Global) — club leaderboard & cross-community prestige. Starts at 0, not 1200.",
            ),
            L(
              "Tingkat perjalanan (Pemula / Berkembang / Mapan…) — dari poin ladder + stabilitas.",
              "Journey tier (Rookie / Rising / Established…) — from ladder pts + stability.",
            ),
          ],
        },
        {
          title: L("Kelas bracket ↔ MP Rating", "Bracket classes ↔ MP Rating"),
          items: [
            L(
              "Nama sama di semua olahraga: Open / Beginner / Intermediate / Advanced / Elite.",
              "Same names every sport: Open / Beginner / Intermediate / Advanced / Elite.",
            ),
            L(
              "Padel Beginner · MP Rating 2.5 – 4.0. Tenis Beginner · MP Rating 1.0 – 3.49.",
              "Padel Beginner · MP Rating 2.5 – 4.0. Tennis Beginner · MP Rating 1.0 – 3.49.",
            ),
            L(
              "Hint ≈ WPR / ≈ UTR hanya referensi — bukan gate pendaftaran.",
              "≈ WPR / ≈ UTR hints are reference only — not registration gates.",
            ),
          ],
        },
        {
          title: L("Adil lintas klub", "Fair across clubs"),
          items: [
            L(
              "Badge Klub vs Lintas klub ✓ — MP Rating 4.0 di Klub A belum sama dengan 4.0 di Klub B sebelum main bersama.",
              "Klub vs Lintas klub ✓ badge — MP Rating 4.0 at Club A is not equal to 4.0 at Club B before cross-play.",
            ),
            L(
              "Match lintas komunitas mengkalibrasi via Glicko. Global / BoC butuh Lintas klub ✓ untuk bracket menengah+.",
              "Cross-community matches calibrate via Glicko. Global / BoC need Lintas klub ✓ for mid+ brackets.",
            ),
          ],
        },
        {
          title: L("Cerita Budi — dari nol", "Budi's story — from zero"),
          items: [
            L("Daftar: Mabar 0, Global 0, MP Rating Belum dinilai.", "Signup: Mabar 0, Global 0, MP Rating Unrated."),
            L("Match 5 stable: MP Rating ✓, Berkembang, bracket Beginner klub terbuka.", "Match 5 stable: MP Rating ✓, Rising, club Beginner brackets unlock."),
            L("Sparring lintas klub → Lintas klub ✓ untuk turnamen Global.", "Inter-club sparring → Lintas klub ✓ for Global tournaments."),
          ],
        },
        {
          title: L("Bobot acara", "Event weights"),
          items: [
            L("BoC 100%, Sparring ranked 70%, casual 40% — delta dari Glicko, bukan +15 flat.", "BoC 100%, Sparring ranked 70%, casual 40% — delta from Glicko, not flat +15."),
          ],
        },
      ],
    },
  };

  const screens = {
    "auth-login": {
      journey: "player",
      purpose: L("Login — akses komunitas, ranking, dan event.", "Login — access communities, rankings, and events."),
      components: [
        c(
          1,
          ".auth-card",
          { id: "Kartu login", en: "Login card" },
          { id: "Email/username + password.", en: "Email/username + password." },
          { id: "Entry point pemain & admin.", en: "Player & admin entry." },
        ),
        c(
          2,
          ".btn-primary",
          { id: "CTA login", en: "Login CTA" },
          { id: "→ dashboard pemain.", en: "→ player dashboard." },
          { id: "Thumb zone bawah.", en: "Bottom thumb zone." },
        ),
      ],
      mechanics: SHARED.rankMovement,
    },
    "auth-register": {
      journey: "player",
      purpose: L(
        "Pendaftaran — username unik + HP OTP. MP Rating Belum dinilai sampai match pertama.",
        "Registration — unique username + phone OTP. MP Rating Unrated until first match.",
      ),
      components: [
        c(1, ".auth-card, form", { id: "Form daftar", en: "Register form" }, { id: "Username + HP.", en: "Username + phone." }, { id: "Anti-Sybil global.", en: "Anti-Sybil global." }),
        c(2, ".btn-primary", { id: "CTA daftar", en: "Register CTA" }, { id: "→ OTP verify.", en: "→ OTP verify." }, { id: "Onboarding gate.", en: "Onboarding gate." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "home-dashboard": {
      journey: "player",
      purpose: L(
        "Dashboard — MP Rating, poin Mabar/Global, event aktif.",
        "Dashboard — MP Rating, Mabar/Global pts, active events.",
      ),
      components: [
        c(1, ".rank-dual, .rank-chip", { id: "Dual rank", en: "Dual rank" }, { id: "Mabar + Global pts dari 0.", en: "Mabar + Global pts from 0." }, { id: "Lapisan 2.", en: "Layer 2." }),
        c(2, "[data-mp-rating], .mp-mascot-strip", { id: "MP Rating strip", en: "MP Rating / mascot" }, { id: "Skill + sport switch.", en: "Skill + sport switch." }, { id: "Lapisan 1.", en: "Layer 1." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "home-dashboard-guest": {
      journey: "guest",
      purpose: L(
        "Dashboard tamu — rank read-only, CTA login.",
        "Guest dashboard — read-only rank, login CTA.",
      ),
      components: [
        c(1, "#guest-banner, .guest-banner", { id: "Banner tamu", en: "Guest banner" }, { id: "Browse mode.", en: "Browse mode." }, { id: "Atas konten.", en: "Above content." }),
        c(2, "[data-requires-auth]", { id: "CTA terkunci", en: "Locked CTA" }, { id: "Modal login.", en: "Login modal." }, { id: "Conversion.", en: "Conversion." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "errors": {
      journey: "shared",
      purpose: L(
        "Aturan keadilan ranking — decay, flooding, komunitas tertutup.",
        "Ranking fairness rules — decay, flooding, closed communities.",
      ),
      components: [
        c(1, ".docs-list, .card", { id: "Kebijakan", en: "Policies" }, { id: "Edge cases rank.", en: "Rank edge cases." }, { id: "Transparansi.", en: "Transparency." }),
        c(2, "h2, .section-title", { id: "Judul", en: "Title" }, { id: "Fair play rules.", en: "Fair play rules." }, { id: "Edukasi.", en: "Education." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "leaderboard": {
      journey: "player",
      purpose: L(
        "Leaderboard Mabar — sort by pts; tooltip MP Rating.",
        "Mabar leaderboard — sort by pts; MP Rating tooltip.",
      ),
      components: [
        c(1, ".lb-table, table", { id: "Tabel rank", en: "Rank table" }, { id: "Sort by Mabar pts.", en: "Sort by Mabar pts." }, { id: "Lapisan 2.", en: "Layer 2." }),
        c(2, ".lb-header, .section-title", { id: "Header", en: "Header" }, { id: "Klub scope.", en: "Club scope." }, { id: "Context.", en: "Context." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "event-register": {
      journey: "player",
      purpose: L(
        "Pendaftaran acara dengan panel eligibility — gate MP Rating & anti-sandbagging.",
        "Event registration with eligibility panel — MP Rating gate & anti-sandbagging.",
      ),
      components: [
        c(
          1,
          "[data-eligibility-panel]",
          { id: "Panel eligibility", en: "Eligibility panel" },
          {
            id: "MP Rating + badge Klub/Lintas klub; checkEligibility min/max.",
            en: "MP Rating + Klub/Lintas klub badge; checkEligibility min/max.",
          },
          { id: "Di atas tombol daftar.", en: "Above register button." },
        ),
        c(
          2,
          "[data-bracket-class-display]",
          { id: "Kelas bracket", en: "Bracket class badge" },
          {
            id: "Beginner · MP Rating 2.5 – 4.0 — label + rentang terpercaya.",
            en: "Beginner · MP Rating 2.5 – 4.0 — class + trusted range.",
          },
          { id: "Pada kartu acara.", en: "On event card." },
        ),
      ],
      mechanics: SHARED.rankMovement,
    },
    "profile": {
      journey: "player",
      purpose: L(
        "Profil: MP Rating, poin MP, tingkat perjalanan, endorsement.",
        "Profile: MP Rating, MP pts, journey tier, endorsement.",
      ),
      components: [
        c(
          1,
          "[data-mp-rating]",
          { id: "MP Rating", en: "MP Rating" },
          { id: "Angka skill terpercaya + ✓ jika stable.", en: "Trusted skill number + ✓ when stable." },
          { id: "Lapisan 1 ranking.", en: "Ranking layer 1." },
        ),
        c(
          2,
          ".rank-dual, [data-rank-mabar-pts]",
          { id: "Poin MP", en: "MP pts" },
          { id: "Mabar + Global ladder.", en: "Mabar + Global ladder." },
          { id: "Lapisan 2.", en: "Layer 2." },
        ),
        c(
          3,
          "[data-analytics-confidence], [data-analytics-chart]",
          { id: "WPR analytics", en: "WPR analytics" },
          { id: "Confidence % + rating history chart.", en: "Confidence % + rating history chart." },
          { id: "Player app parity.", en: "Player app parity." },
        ),
      ],
      mechanics: SHARED.rankMovement,
    },
    "player-performance": {
      journey: "player",
      purpose: L(
        "Performa penuh — confidence, grafik MP Rating, stat match.",
        "Full performance — confidence, MP Rating chart, match stats.",
      ),
      components: [
        c(1, ".mp-confidence-card", { id: "Confidence card", en: "Confidence card" }, { id: "98% confidence score.", en: "98% confidence score." }, { id: "WPR-style.", en: "WPR-style." }),
        c(2, ".mp-rating-chart", { id: "Rating chart", en: "Rating chart" }, { id: "3y/1y/1m/1w ranges.", en: "3y/1y/1m/1w ranges." }, { id: "SVG history.", en: "SVG history." }),
        c(3, ".mp-stats-dashboard", { id: "Match stats", en: "Match stats" }, { id: "W-L, streak, tie-break.", en: "W-L, streak, tie-break." }, { id: "Practice vs ranked.", en: "Practice vs ranked." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "my-matches": {
      journey: "player",
      purpose: L(
        "Riwayat match + tab Performa (stats dashboard).",
        "Match history + Performance tab (stats dashboard).",
      ),
      components: [
        c(1, "[data-performance-tab]", { id: "Tabs", en: "Tabs" }, { id: "Matches vs Performance.", en: "Matches vs Performance." }, { id: "WPR stats.", en: "WPR stats." }),
        c(2, "[data-analytics-stats-full]", { id: "Stats grid", en: "Stats grid" }, { id: "W-L, streak, bars.", en: "W-L, streak, bars." }, { id: "player-analytics.js.", en: "player-analytics.js." }),
      ],
      mechanics: SHARED.rankMovement,
    },
  };

  Object.assign(screens, window.MP_GalleryNotesScreens || {});

  Object.keys(screens).forEach((id) => {
    if (screens[id] && screens[id].mechanics) screens[id].mechanics = SHARED.rankMovement;
  });

  return { screens, SHARED, L, c };
})();
