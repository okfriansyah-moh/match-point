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
        "Daily Hook Home — pulse personal (countdown acara, delta rating, streak, aktivitas teman) menjawab 'kenapa buka tiap hari?'; cerita rank pindah ke tab Rank.",
        "Daily Hook Home — a personal pulse (event countdown, rating delta, streak, friend activity) answers 'why open this every day?'; the rank story moved to the Rank tab.",
      ),
      components: [
        c(1, "[data-home-pulse], .mp-pulse-card--urgent", { id: "Pulse harian", en: "Daily pulse" }, { id: "Kartu urgent (countdown) dulu, lalu delta rating, streak, teman, kabar komunitas — dirender home-pulse.js.", en: "Urgent card (countdown) first, then rating delta, streak, friends, community update — rendered by home-pulse.js." }, { id: "Konten spesifik-hari-ini menciptakan kebiasaan harian.", en: "Today-specific content builds the daily habit." }),
        c(2, "[data-social-feed], .mp-play-row", { id: "Sosial + aksi", en: "Social strip + actions" }, { id: "Dua post highlight via renderer bersama, CTA submit match + booking teaser.", en: "Two highlight posts via the shared renderer, submit-match CTA + booking teaser." }, { id: "Loop players→content masuk ke home tanpa pindah tab.", en: "Brings the players→content loop into home without switching tabs." }),
        c(3, ".mp-club-banner", { id: "CTA stateful", en: "Stateful CTA" }, { id: "Guest → eksplor; no-club → join/create; member → main.", en: "Guest → explore; no-club → join/create; member → play." }, { id: "Satu intent dominan per state.", en: "One dominant intent per state." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "home-dashboard-guest": {
      journey: "guest",
      purpose: L(
        "Discovery Pulse — platform terasa hidup (statistik live, komunitas trending, acara terbuka, preview sosial, teaser passport) dengan tangga konversi soft-gate, tanpa tur paksa.",
        "Discovery Pulse — the platform feels alive (live stats, trending communities, open events, social preview, passport teaser) with a soft-gate conversion ladder, no forced tour.",
      ),
      components: [
        c(1, "[data-guest-live-strip], [data-guest-trending]", { id: "Bukti hidup", en: "Alive proof" }, { id: "Strip statistik live + rail komunitas trending (guest-pulse.js).", en: "Live stats strip + trending community rail (guest-pulse.js)." }, { id: "Langkah 1 tangga konversi: lihat platform hidup.", en: "Conversion ladder step 1: see an alive platform." }),
        c(2, "[data-feed-mode=\"guest\"], [data-passport=\"teaser\"]", { id: "Soft gate", en: "Soft gates" }, { id: "Feed read-only + passport blur; aksi interaktif memicu login inline, bukan dinding modal.", en: "Read-only feed + blurred passport; interactive actions trigger inline login, not a modal wall." }, { id: "Gate lunak menjaga rasa aman eksplorasi.", en: "Soft gates keep exploration feeling safe." }),
        c(3, "[data-guest-how], [data-flow-goto=\"14\"]", { id: "Cara kerja + CTA", en: "How-it-works + CTA" }, { id: "3 langkah Join→Play→Identity lalu Find community / Sign up free.", en: "3 steps Join→Play→Identity then Find community / Sign up free." }, { id: "Menutup tangga konversi dengan satu CTA primer.", en: "Closes the conversion ladder with one primary CTA." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "social-feed": {
      journey: "player",
      purpose: L(
        "Feed sosial lintas komunitas — stories rail, composer, post hasil match/foto/teks via renderer bersama social-feed.js (mode member).",
        "Cross-community social feed — stories rail, composer, match-result/photo/text posts via the shared social-feed.js renderer (member mode).",
      ),
      components: [
        c(1, "[data-social-stories], .mp-story-ring", { id: "Stories rail", en: "Stories rail" }, { id: "Ring conic accent untuk story belum dilihat; ring redup untuk yang sudah.", en: "Conic accent ring for unseen stories; muted ring for seen." }, { id: "Sinyal konten segar di detik pertama.", en: "Signals fresh content in the first second." }),
        c(2, "[data-feed-composer], .mp-feed-post", { id: "Composer + post", en: "Composer + posts" }, { id: "Composer di atas, kartu post dengan chip olahraga + action bar 44px.", en: "Composer on top, post cards with sport chip + 44px action bar." }, { id: "Loop players→content→discovery.", en: "Powers the players→content→discovery loop." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "social-feed-guest": {
      journey: "guest",
      purpose: L(
        "Preview feed read-only untuk tamu — post publik tampil penuh, post members-only diblur, aksi like/comment soft-gate ke login.",
        "Read-only feed preview for guests — public posts render fully, members-only posts blur, like/comment actions soft-gate to login.",
      ),
      components: [
        c(1, ".mp-guest-teaser", { id: "Post terkunci", en: "Locked posts" }, { id: "Post members-only jadi stub blur + CTA join.", en: "Members-only posts become blurred stubs + join CTA." }, { id: "Menunjukkan ada lebih banyak di balik gate.", en: "Shows there is more behind the gate." }),
        c(2, ".mp-feed-post--guest, [data-guest-login]", { id: "Aksi soft-gate", en: "Soft-gated actions" }, { id: "Action bar redup; tap → login, bukan modal wall.", en: "Dimmed action bar; tap → login, not a modal wall." }, { id: "Konversi tanpa mematikan eksplorasi.", en: "Converts without killing exploration." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "social-stories": {
      journey: "player",
      purpose: L(
        "Viewer stories — rail ring di atas, konten story rasio 9:12 dengan atribusi pemain/komunitas.",
        "Stories viewer — ring rail on top, 9:12 story content with player/community attribution.",
      ),
      components: [
        c(1, ".mp-story-rail", { id: "Rail ring", en: "Ring rail" }, { id: "Scroll horizontal, ring 60px + label nama.", en: "Horizontal scroll, 60px rings + name labels." }, { id: "Pola stories yang sudah familiar.", en: "The familiar stories pattern." }),
        c(2, ".mp-feed-post-media", { id: "Konten story", en: "Story content" }, { id: "Media rasio potret + caption highlight.", en: "Portrait-ratio media + highlight caption." }, { id: "Ruang penuh untuk momen match.", en: "Full space for the match moment." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "social-post-detail": {
      journey: "player",
      purpose: L(
        "Detail post dengan komentar — post tunggal, thread komentar bubble, composer komentar.",
        "Post detail with comments — single post, bubble comment thread, comment composer.",
      ),
      components: [
        c(1, "[data-social-comments]", { id: "Thread komentar", en: "Comment thread" }, { id: "Bubble avatar + nama dari data post bersama.", en: "Avatar bubbles + names from the shared post data." }, { id: "Percakapan memperdalam loop konten.", en: "Conversation deepens the content loop." }),
        c(2, ".mp-feed-composer", { id: "Composer komentar", en: "Comment composer" }, { id: "Input pill di bawah thread.", en: "Pill input under the thread." }, { id: "Aksi balas selalu terlihat.", en: "Reply action always visible." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "social-compose": {
      journey: "player",
      purpose: L(
        "Buat post — teks + lampiran Foto / Hasil Match / Polling; hasil match menghubungkan konten ke rank.",
        "Create post — text + Photo / Match result / Poll attachments; match results link content back to rank.",
      ),
      components: [
        c(1, "textarea.input", { id: "Input teks", en: "Text input" }, { id: "Placeholder mengarahkan ke momen match.", en: "Placeholder steers toward match moments." }, { id: "Prompt konten yang on-brand.", en: "On-brand content prompt." }),
        c(2, ".mp-feed-result, .btn-outline", { id: "Lampiran", en: "Attachments" }, { id: "Chip Foto / Hasil Match / Polling + preview hasil.", en: "Photo / Match result / Poll chips + result preview." }, { id: "Hasil match adalah konten khas Match Point.", en: "Match results are Match Point's signature content." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "messages-inbox": {
      journey: "player",
      purpose: L(
        "Kotak masuk DM — baris percakapan dengan avatar, cuplikan, waktu, dan badge unread; member-only.",
        "DM inbox — conversation rows with avatar, snippet, time, and unread badge; member-only.",
      ),
      components: [
        c(1, ".mp-msg-row", { id: "Baris percakapan", en: "Conversation rows" }, { id: "Avatar 42px, nama + cuplikan, waktu mono.", en: "42px avatar, name + snippet, mono timestamp." }, { id: "Baris 60px ramah jempol.", en: "60px rows are thumb-friendly." }),
        c(2, ".mp-msg-unread", { id: "Badge unread", en: "Unread badge" }, { id: "Pil accent dengan hitungan.", en: "Accent pill with count." }, { id: "Alasan kembali membuka aplikasi.", en: "A reason to come back." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "messages-thread": {
      journey: "player",
      purpose: L(
        "Thread DM — bubble kiri/kanan (accent untuk milikku), status online, composer kirim.",
        "DM thread — left/right bubbles (accent for mine), online status, send composer.",
      ),
      components: [
        c(1, ".mp-msg-bubble.is-mine", { id: "Bubble percakapan", en: "Chat bubbles" }, { id: "Milikku = accent hijau, lawan = surface-2.", en: "Mine = accent green, theirs = surface-2." }, { id: "Arah percakapan terbaca tanpa label.", en: "Conversation direction reads without labels." }),
        c(2, ".mp-feed-composer", { id: "Composer", en: "Composer" }, { id: "Input pill + tombol kirim.", en: "Pill input + send button." }, { id: "Pola composer yang sama di seluruh sosial.", en: "Same composer pattern across social." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "friends-list": {
      journey: "player",
      purpose: L(
        "Daftar teman + saran — graph sosial (main bareng, komunitas sama) dari social-graph.js.",
        "Friends + suggestions — the social graph (played together, same community) from social-graph.js.",
      ),
      components: [
        c(1, "[data-friends-list]", { id: "Teman", en: "Friends" }, { id: "Baris dengan konteks 'main bareng 12×' / komunitas.", en: "Rows with 'played together 12×' / community context." }, { id: "Konteks graph, bukan sekadar kontak.", en: "Graph context, not just contacts." }),
        c(2, "[data-friends-suggested]", { id: "Saran", en: "Suggested" }, { id: "Kandidat follow dari mutual + venue.", en: "Follow candidates from mutuals + venues." }, { id: "Menumbuhkan graph jaringan.", en: "Grows the network graph." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "player-highlights": {
      journey: "player",
      purpose: L(
        "Highlight pemain — grid foto match 3 kolom + hasil menonjol; tampil juga di profil publik.",
        "Player highlights — 3-column match photo grid + a standout result; also shown on the public profile.",
      ),
      components: [
        c(1, ".mp-feed-post-media", { id: "Grid foto", en: "Photo grid" }, { id: "Tile persegi rasio 1:1.", en: "Square 1:1 tiles." }, { id: "Identitas visual pemain.", en: "The player's visual identity." }),
        c(2, ".mp-feed-result", { id: "Hasil unggulan", en: "Featured result" }, { id: "Skor mono + konteks acara.", en: "Mono score + event context." }, { id: "Bukti prestasi yang bisa dibagikan.", en: "Shareable proof of achievement." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "player-passport": {
      journey: "player",
      purpose: L(
        "Player Passport — identitas 5 olahraga dalam satu layar: hero MP Rating, rollup Mabar/Global per olahraga, pencapaian, teman.",
        "Player Passport — the 5-sport identity in one glance: MP Rating hero, per-sport Mabar/Global rollup, achievements, friends.",
      ),
      components: [
        c(1, ".mp-passport-hero", { id: "Hero identitas", en: "Identity hero" }, { id: "Gradien warna olahraga aktif, rating mono, chip trust + olahraga utama.", en: "Active sport-color gradient, mono rating, trust + primary sport chips." }, { id: "Identitas portabel adalah wedge produk.", en: "The portable identity is the product wedge." }),
        c(2, ".mp-passport-pride-strip, .mp-trophy-case", { id: "Galeri kebanggaan", en: "Hall of fame" }, { id: "Strip streak/trofi/komunitas + kartu pencapaian terverifikasi (earned badge).", en: "Streak/trophy/community strip + verified achievement cards (earned badge)." }, { id: "Passport = sesuatu yang bisa dibanggakan.", en: "Passport = something worth showing off." }),
        c(3, ".mp-passport-sport, [data-friends-list]", { id: "Rollup + sosial", en: "Rollup + social" }, { id: "Bar per olahraga dengan tint identitas + teman/saran.", en: "Per-sport identity-tinted rows + friends/suggestions." }, { id: "Skill lintas olahraga + jejak sosial.", en: "Cross-sport skill + social footprint." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "passport-teaser-guest": {
      journey: "guest",
      purpose: L(
        "Teaser passport untuk tamu — hero + rollup diblur di balik overlay 'Klaim passport-mu'; langkah konversi utama tamu.",
        "Guest passport teaser — hero + rollup blurred behind a 'Claim your passport' overlay; the guest's primary conversion step.",
      ),
      components: [
        c(1, ".mp-guest-teaser", { id: "Overlay blur", en: "Blur overlay" }, { id: "Konten passport demo diblur + satu CTA klaim.", en: "Demo passport content blurred + one claim CTA." }, { id: "Menjual identitas tanpa memalsukan data.", en: "Sells the identity without faking data." }),
        c(2, "[data-guest-how]", { id: "Cara kerja", en: "How it works" }, { id: "3 langkah Join→Play→Identity.", en: "3 steps Join→Play→Identity." }, { id: "Jalur jelas dari teaser ke akun.", en: "A clear path from teaser to account." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "court-booking": {
      journey: "player",
      purpose: L(
        "Teaser booking lapangan — grid slot referensi UI; Fase 4 roadmap, CTA ke open mabar & acara.",
        "Court booking teaser — slot grid UI reference; Phase 4 roadmap, CTAs to open mabar & events.",
      ),
      components: [
        c(1, "[data-booking-slots], .mp-slot", { id: "Grid slot", en: "Slot grid" }, { id: "Jam mono tabular; banner Fase 4 di atas grid.", en: "Tabular mono times; Phase 4 banner above grid." }, { id: "Spesifikasi AYO/KUYY untuk fase berikutnya.", en: "AYO/KUYY spec for a later phase." }),
        c(2, ".mp-phase-banner", { id: "Banner fase", en: "Phase banner" }, { id: "Menjelaskan booking ditunda; graph dulu.", en: "Explains booking is deferred; graph first." }, { id: "Reclub-style sequencing.", en: "Reclub-style sequencing." }),
        c(3, "[data-goto=\"open-mabar-board\"]", { id: "CTA open mabar", en: "Open mabar CTA" }, { id: "Alihkan ke organize-play sekarang.", en: "Routes to organize-play now." }, { id: "Play-to-rank loop.", en: "Play-to-rank loop." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "open-mabar-board": {
      journey: "player",
      purpose: L(
        "Open mabar / pickup discovery — AYO Main Bareng + KUYY open match di bracket MP Rating.",
        "Open mabar / pickup discovery — AYO Main Bareng + KUYY open match at MP Rating bracket.",
      ),
      components: [
        c(1, "[data-open-mabar-board], .mp-mabar-card", { id: "Daftar mabar", en: "Mabar list" }, { id: "Kartu slot, bracket, patungan demo.", en: "Slot cards, bracket, demo cost share." }, { id: "Tanpa checkout booking.", en: "No booking checkout." }),
        c(2, "[data-play-tab=\"mabar\"]", { id: "Tab Play", en: "Play tab" }, { id: "Segmen di events-feed.", en: "Segment on events-feed." }, { id: "Satu hub discovery.", en: "One discovery hub." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "open-mabar-detail": {
      journey: "player",
      purpose: L(
        "Detail open mabar — roster slot, host, bracket band, gabung tanpa bayar lapangan.",
        "Open mabar detail — slot roster, host, bracket band, join without court checkout.",
      ),
      components: [
        c(1, "[data-open-mabar-detail], .mp-mabar-roster", { id: "Roster", en: "Roster" }, { id: "Slot terisi/kosong + host.", en: "Filled/open slots + host." }, { id: "Transparansi sebelum gabung.", en: "Transparency before joining." }),
        c(2, "[data-mabar-join]", { id: "CTA gabung", en: "Join CTA" }, { id: "Request slot → submit match setelah main.", en: "Request slot → submit match after play." }, { id: "Play-to-rank loop.", en: "Play-to-rank loop." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "open-mabar-create": {
      journey: "player",
      purpose: L(
        "Host open mabar — venue teks, waktu, bracket gate; tanpa modul booking.",
        "Host open mabar — venue text, time, bracket gate; no booking module.",
      ),
      components: [
        c(1, ".form-group", { id: "Form host", en: "Host form" }, { id: "Venue, waktu, kelas bracket.", en: "Venue, time, bracket class." }, { id: "Organize-play tanpa inventory.", en: "Organize-play without inventory." }),
        c(2, "[data-flow-goto=\"34\"]", { id: "Publish", en: "Publish" }, { id: "Ke detail setelah publish demo.", en: "To detail after demo publish." }, { id: "Mirip Reclub create meet.", en: "Like Reclub create meet." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "player-challenge": {
      journey: "player",
      purpose: L(
        "Tantang pemain — alur ILTL-style; eligibility dari MP Rating.",
        "Challenge a player — ILTL-style flow; eligibility from MP Rating.",
      ),
      components: [
        c(1, "[data-player-challenge]", { id: "Form tantangan", en: "Challenge form" }, { id: "Lawan, waktu, venue.", en: "Opponent, time, venue." }, { id: "Prefill dari leaderboard/find players.", en: "Prefill from leaderboard/find players." }),
        c(2, "[data-challenge-inbox]", { id: "Inbox", en: "Inbox" }, { id: "Pending/accepted + terima → submit match.", en: "Pending/accepted + accept → submit match." }, { id: "Menutup loop kompetisi.", en: "Closes the competition loop." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "challenge-inbox": {
      journey: "player",
      purpose: L(
        "Kotak tantangan — masuk/keluar, terima lalu arahkan ke catat hasil.",
        "Challenge inbox — in/out, accept then route to submit result.",
      ),
      components: [
        c(1, "[data-challenge-inbox], .mp-challenge-row", { id: "Daftar", en: "List" }, { id: "Status badge + aksi terima/tolak.", en: "Status badge + accept/decline actions." }, { id: "ILTL-style challenge hub.", en: "ILTL-style challenge hub." }),
        c(2, "[data-challenge-badge]", { id: "Badge", en: "Badge" }, { id: "Counter pending di header.", en: "Pending counter in header." }, { id: "Sinyal aksi harian.", en: "Daily action signal." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "player-availability": {
      journey: "player",
      purpose: L(
        "Ketersediaan pemain / OOT — sembunyikan dari saran mabar & tantangan.",
        "Player availability / OOT — hide from mabar suggestions & challenges.",
      ),
      components: [
        c(1, "[data-player-availability], .mp-avail-option", { id: "Status", en: "Status" }, { id: "Siap / Sibuk / OOT + tanggal kembali.", en: "Available / Busy / OOT + return date." }, { id: "ILTL OOT parity.", en: "ILTL OOT parity." }),
        c(2, "[data-avail-display]", { id: "Chip profil", en: "Profile chip" }, { id: "Tampil di player-other.", en: "Shown on player-other." }, { id: "Konteks sosial fair-play.", en: "Fair-play social context." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "booking-roadmap": {
      journey: "player",
      purpose: L(
        "Roadmap modul booking Fase 4 — venue directory, DP/checkout, reschedule (AYO/KUYY-class).",
        "Phase 4 booking module roadmap — venue directory, DP/checkout, reschedule (AYO/KUYY-class).",
      ),
      components: [
        c(1, "[data-booking-roadmap]", { id: "Daftar fitur", en: "Feature list" }, { id: "4 bullet roadmap + CTA organize-play.", en: "4 bullet roadmap + organize-play CTAs." }, { id: "Jujur soal fase produk.", en: "Honest about product phase." }),
        c(2, ".btn-stack", { id: "CTA alternatif", en: "Alt CTAs" }, { id: "Open mabar & acara sebagai jalur sekarang.", en: "Open mabar & events as the path now." }, { id: "Reclub-style defer booking.", en: "Reclub-style defer booking." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "platform-overview": {
      journey: "platform",
      purpose: L(
        "Ecosystem Operator Console — KPI graph (pemain, komunitas, match, post, DAU, dispute), status network loop, triage SLA, pipeline komunitas, dan moderasi sosial dalam satu overview.",
        "Ecosystem Operator Console — graph KPIs (players, communities, matches, posts, DAU, disputes), network-loop status, SLA triage, community pipeline, and social moderation in one overview.",
      ),
      components: [
        c(1, "[data-eco-kpis], .mp-platform-kpi", { id: "KPI graph", en: "Graph KPIs" }, { id: "6 metrik ekosistem 24 jam dengan delta ▲/▼ mono.", en: "Six 24h ecosystem metrics with mono ▲/▼ deltas." }, { id: "Menjawab 'apakah ekosistem sehat & tumbuh?'", en: "Answers 'is the ecosystem healthy and growing?'" }),
        c(2, "[data-eco-loops]", { id: "Network loops", en: "Network loops" }, { id: "Sparkline mini per loop (komunitas→pemain→konten→rating).", en: "Mini sparklines per loop (communities→players→content→ratings)." }, { id: "Loop adalah moat produk — dipantau eksplisit.", en: "The loops are the product moat — monitored explicitly." }),
        c(3, "[data-eco-pipeline-counts], [data-eco-moderation-count]", { id: "Pipeline + moderasi", en: "Pipeline + moderation" }, { id: "Counter pending/approved/rejected + post ditandai, link ke modul.", en: "Pending/approved/rejected counters + flagged posts, linking to their modules." }, { id: "Antrean operasional jadi modul kelas satu.", en: "Operational queues become first-class modules." }),
        c(4, ".triage-card", { id: "Triage SLA", en: "SLA triage" }, { id: "3 item paling berisiko dipertahankan dari desain lama.", en: "Top-3 riskiest items retained from the prior design." }, { id: "Trust & fair play tetap di depan.", en: "Trust & fair play stays up front." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "platform-community-pipeline": {
      journey: "platform",
      purpose: L(
        "Funnel onboarding komunitas — counter tahap + daftar berfilter (pending/approved/rejected) dengan umur antrean.",
        "Community onboarding funnel — stage counters + a filterable list (pending/approved/rejected) with queue age.",
      ),
      components: [
        c(1, "[data-pipeline-filters]", { id: "Filter tahap", en: "Stage filters" }, { id: "Chip All/Pending/Approved/Rejected me-render ulang daftar.", en: "All/Pending/Approved/Rejected chips re-render the list." }, { id: "Satu layar untuk seluruh funnel.", en: "One screen for the whole funnel." }),
        c(2, "[data-eco-pipeline-list]", { id: "Daftar pipeline", en: "Pipeline list" }, { id: "Baris komunitas + olahraga + umur hari + badge tahap.", en: "Community rows + sport + day age + stage badge." }, { id: "Loop community→players dimulai dari sini.", en: "The community→players loop starts here." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "platform-moderation-inbox": {
      journey: "platform",
      purpose: L(
        "Antrean moderasi sosial — post yang dilaporkan (dari seed social-feed.js) dengan alasan, jumlah laporan, dan aksi Setujui/Hapus.",
        "Social moderation queue — reported posts (seeded from social-feed.js) with reason, report count, and Approve/Remove actions.",
      ),
      components: [
        c(1, "[data-eco-moderation-list]", { id: "Antrean laporan", en: "Reports queue" }, { id: "Kartu post lengkap + badge Dilaporkan + alasan.", en: "Full post cards + Reported badge + reason." }, { id: "Moderator menilai konten dalam konteks aslinya.", en: "Moderators judge content in its original context." }),
        c(2, "[data-moderate-keep], [data-moderate-remove]", { id: "Aksi moderasi", en: "Moderation actions" }, { id: "Setujui / Hapus (merah) per post.", en: "Approve / Remove (red) per post." }, { id: "Warna semantik + posisi terpisah cegah salah tap.", en: "Semantic color + separation prevents mis-taps." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "platform-graph-health": {
      journey: "platform",
      purpose: L(
        "Drill-down kesehatan graph — KPI penuh, sparkline network loop, dan komposisi aktivitas per olahraga.",
        "Graph health drill-down — full KPIs, network-loop sparklines, and per-sport activity mix.",
      ),
      components: [
        c(1, "[data-eco-loops]", { id: "Loop detail", en: "Loop detail" }, { id: "5 loop dengan tren 7 titik.", en: "Five loops with 7-point trends." }, { id: "Diagnosis loop mana yang melemah.", en: "Diagnoses which loop is weakening." }),
        c(2, ".mp-loop-row", { id: "Mix olahraga", en: "Sport mix" }, { id: "Persentase aktivitas 5 olahraga.", en: "Activity share across the 5 sports." }, { id: "Kesehatan multi-sport, bukan padel saja.", en: "Multi-sport health, not just padel." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "booking-confirm": {
      journey: "player",
      purpose: L(
        "Konfirmasi booking demo — ringkasan slot terpilih + CTA ajak teman (kembali ke loop sosial).",
        "Demo booking confirmation — selected-slot summary + invite-friends CTA (back into the social loop).",
      ),
      components: [
        c(1, "[data-booking-summary]", { id: "Ringkasan", en: "Summary" }, { id: "Court, tanggal, jam dari pilihan sessionStorage.", en: "Court, date, time from the sessionStorage selection." }, { id: "Kontinuitas dari layar slot.", en: "Continuity from the slot screen." }),
        c(2, ".btn-primary[data-flow-goto=\"27\"]", { id: "Ajak teman", en: "Invite friends" }, { id: "CTA utama menuju sosial, bukan dead-end.", en: "Primary CTA routes to social, not a dead end." }, { id: "Booking memperkuat loop komunitas.", en: "Booking reinforces the community loop." }),
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
        "Leaderboard yang menjelaskan fairness ranking sebelum meminta pemain menafsirkan angka sendiri.",
        "Leaderboard that explains ranking fairness before asking players to interpret the numbers themselves.",
      ),
      components: [
        c(1, "[data-tabs], .leaderboard-list", { id: "Tab ladder", en: "Ladder tabs" }, { id: "Switch Mabar vs Global dengan daftar rank yang sama pola.", en: "Switches Mabar vs Global with the same ladder pattern." }, { id: "Menyatukan model rank lokal dan lintas klub.", en: "Unifies local and cross-club ranking." }),
        c(2, ".rank-story-card, .btn-stack", { id: "Trust context", en: "Trust context" }, { id: "Penjelasan reusable soal MP Rating, posisi lokal, sinyal global, dan confidence.", en: "Reusable explanation of MP Rating, local standing, global signal, and confidence." }, { id: "Membuat fairness lebih legible.", en: "Makes fairness more legible." }),
      ],
      mechanics: SHARED.rankMovement,
    },
    "event-register": {
      journey: "player",
      purpose: L(
        "Pendaftaran acara yang menampilkan verdict eligibility dulu, baru angka pendukungnya.",
        "Event registration that shows the eligibility verdict first, then the supporting numbers.",
      ),
      components: [
        c(
          1,
          "[data-eligibility-verdict], [data-eligibility-panel]",
          { id: "Verdict eligibility", en: "Eligibility verdict" },
          {
            id: "Status eligible / provisional / blocked muncul sebelum detail MP Rating.",
            en: "Eligible / provisional / blocked status appears before MP Rating details.",
          },
          { id: "Pemain tidak perlu reverse-engineer alasan blokir.", en: "Players do not need to reverse-engineer the block reason." },
        ),
        c(
          2,
          "[data-bracket-class-display], .reg-capacity, #reg-actions",
          { id: "Bracket & aksi", en: "Bracket and actions" },
          {
            id: "Kelas bracket, kapasitas, lalu CTA daftar atau waitlist.",
            en: "Bracket class, capacity, then register or waitlist CTA.",
          },
          { id: "Membantu keputusan sebelum checkout sosial.", en: "Supports the decision before the social commitment." },
        ),
      ],
      mechanics: SHARED.rankMovement,
    },
    "profile": {
      journey: "player",
      purpose: L(
        "Profil yang menjelaskan progress rank sebagai readiness, bukan kekurangan.",
        "Profile that frames ranking progress as readiness, not deficiency.",
      ),
      components: [
        c(
          1,
          ".rank-story-card, [data-mp-rating]",
          { id: "Progress rank", en: "Ranking progress" },
          { id: "MP Rating + cerita state ready/provisional/unrated.", en: "MP Rating plus a ready/provisional/unrated state story." },
          { id: "Menenangkan anxiety saat early journey.", en: "Calms anxiety in the early journey." },
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
