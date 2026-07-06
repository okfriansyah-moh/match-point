/* Match Point — shared i18n (mockups + flow) */
window.MP_I18N = (function () {
  const STORAGE_KEY = "mp-lang";

  const strings = {
    "nav.brand.sub": { id: "UI Mockup Prototype", en: "UI Mockup Prototype" },
    "nav.group.auth": { id: "Masuk", en: "Sign In" },
    "nav.group.player": { id: "Pemain", en: "Player" },
    "nav.group.community": { id: "Komunitas", en: "Community" },
    "nav.group.ranking": { id: "Ranking", en: "Ranking" },
    "nav.group.match": { id: "Pertandingan", en: "Matches" },
    "nav.group.social": { id: "Turnamen & Sosial", en: "Tournament & Social" },
    "nav.group.admin": { id: "Admin", en: "Admin" },
    "nav.login": { id: "Login", en: "Log In" },
    "nav.register": { id: "Registrasi", en: "Sign Up" },
    "nav.dashboard": { id: "Dashboard", en: "Dashboard" },
    "nav.profile": { id: "Profil Lengkap", en: "Full Profile" },
    "nav.profileProv": { id: "Profil Provisional", en: "Provisional Profile" },
    "nav.profileEndorse": {
      id: "Endorsement Kosong",
      en: "No Endorsements Yet",
    },
    "nav.editProfile": { id: "Edit Profil", en: "Edit Profile" },
    "nav.communities": { id: "Daftar Komunitas", en: "Communities" },
    "nav.communityCreate": { id: "Buat Komunitas", en: "Create Community" },
    "nav.communityDetail": { id: "Detail Komunitas", en: "Community Detail" },
    "nav.communityMembers": { id: "Kelola Anggota", en: "Manage Members" },
    "nav.adminTransfer": { id: "Transfer Admin", en: "Transfer Admin" },
    "nav.leaderboardMabar": {
      id: "Leaderboard Mabar",
      en: "Mabar Leaderboard",
    },
    "nav.leaderboardOfficial": {
      id: "Leaderboard Global",
      en: "Global Leaderboard",
    },
    "nav.snapshot": { id: "Snapshot Bulanan", en: "Monthly Snapshot" },
    "nav.submitMatch": { id: "Submit Match", en: "Submit Match" },
    "nav.matchApproved": { id: "Auto Approved", en: "Auto Approved" },
    "nav.matchPending": { id: "Pending (GPS)", en: "Pending (GPS)" },
    "nav.matchDuplicate": { id: "Duplicate Error", en: "Duplicate Error" },
    "nav.matchDisputed": { id: "Disputed", en: "Disputed" },
    "nav.myMatches": { id: "Pertandingan Saya", en: "My Matches" },
    "nav.tournament": { id: "Daftar Turnamen", en: "Tournaments" },
    "nav.tournamentCreate": { id: "Buat Turnamen", en: "Create Tournament" },
    "nav.bracket": { id: "Bracket", en: "Bracket" },
    "nav.endorsement": { id: "Endorsement", en: "Endorsement" },
    "nav.shareCard": { id: "Share Card", en: "Share Card" },
    "nav.adminOverview": { id: "Overview", en: "Overview" },
    "nav.adminCommunity": { id: "Stats Komunitas", en: "Community Stats" },
    "nav.adminPending": { id: "Pending Matches", en: "Pending Matches" },
    "nav.adminDispute": { id: "Resolve Dispute", en: "Resolve Dispute" },
    "nav.adminAdjustment": { id: "Point Adjustment", en: "Point Adjustment" },
    "nav.errors": { id: "Edge Cases", en: "Edge Cases" },

    "title.auth-login": { id: "Login", en: "Log In" },
    "title.auth-register": { id: "Registrasi", en: "Sign Up" },
    "title.home-dashboard": { id: "Dashboard", en: "Dashboard" },
    "title.profile": { id: "Profil Pemain", en: "Player Profile" },
    "title.profile-provisional": {
      id: "Profil Provisional",
      en: "Provisional Profile",
    },
    "title.profile-endorse-empty": {
      id: "Endorsement Kosong",
      en: "No Endorsements",
    },
    "title.edit-profile": { id: "Edit Profil", en: "Edit Profile" },
    "title.communities": { id: "Daftar Komunitas", en: "Communities" },
    "title.community-create": { id: "Buat Komunitas", en: "Create Community" },
    "title.community-detail": {
      id: "Detail Komunitas",
      en: "Community Detail",
    },
    "title.community-members": { id: "Kelola Anggota", en: "Manage Members" },
    "title.admin-transfer": { id: "Transfer Admin", en: "Transfer Admin" },
    "title.leaderboard": { id: "Leaderboard Mabar", en: "Mabar Leaderboard" },
    "title.leaderboard-official": {
      id: "Leaderboard Global",
      en: "Global Leaderboard",
    },
    "title.leaderboard-snapshot": {
      id: "Snapshot Bulanan",
      en: "Monthly Snapshot",
    },
    "title.submit-match": { id: "Submit Match", en: "Submit Match" },
    "title.match-approved": {
      id: "Match — Auto Approved",
      en: "Match — Auto Approved",
    },
    "title.match-pending": {
      id: "Match — Pending Review",
      en: "Match — Pending Review",
    },
    "title.match-duplicate": {
      id: "Match — Duplicate",
      en: "Match — Duplicate",
    },
    "title.match-disputed": { id: "Match — Disputed", en: "Match — Disputed" },
    "title.my-matches": { id: "Pertandingan Saya", en: "My Matches" },
    "title.tournament": { id: "Daftar Turnamen", en: "Tournaments" },
    "title.tournament-create": { id: "Buat Turnamen", en: "Create Tournament" },
    "title.tournament-bracket": {
      id: "Bracket Turnamen",
      en: "Tournament Bracket",
    },
    "title.events": { id: "Acara", en: "Events" },
    "title.americano": { id: "Americano Live", en: "Americano Live" },
    "title.mexicano": { id: "Mexicano Live", en: "Mexicano Live" },
    "title.admin-create-event": { id: "Buat Acara", en: "Create Event" },
    "title.admin-publish-event": { id: "Publish Acara", en: "Publish Event" },
    "title.admin-live-session": { id: "Live Session", en: "Live Session" },
    "title.create-club": { id: "Buat Komunitas", en: "Create Community" },
    "title.club-admin": { id: "Admin Klub", en: "Club Admin" },
    "nav.home": { id: "Beranda", en: "Home" },
    "nav.rank": { id: "Rank", en: "Rank" },
    "nav.play": { id: "Main", en: "Play" },
    "nav.events": { id: "Acara", en: "Events" },
    "nav.profile": { id: "Profil", en: "Profile" },
    "club.noClubTitle": { id: "Belum punya komunitas", en: "No community yet" },
    "club.noClubDesc": {
      id: "Buat klub padel/tennis-mu — jadi admin, kelola turnamen.",
      en: "Create your club — become admin, run tournaments.",
    },
    "club.createCta": { id: "+ Buat Komunitas", en: "+ Create Community" },
    "club.manageCta": { id: "Kelola Komunitas →", en: "Manage Community →" },
    "club.createTitle": { id: "Buat Komunitas", en: "Create Community" },
    "club.createSub": {
      id: "Kamu jadi admin klub.",
      en: "You become club admin.",
    },
    "club.nameLabel": { id: "Nama Komunitas", en: "Community name" },
    "club.sportLabel": { id: "Olahraga utama", en: "Primary sport" },
    "club.cityLabel": { id: "Kota / venue", en: "City / venue" },
    "club.openLabel": { id: "Open Community", en: "Open Community" },
    "club.createBtn": { id: "Buat & Jadi Admin", en: "Create & Become Admin" },
    "club.skipBtn": { id: "Lewati — main dulu tanpa klub", en: "Skip for now" },
    "club.backHome": { id: "← Beranda", en: "← Home" },
    "club.adminNote": {
      id: "Admin klub ≠ admin Match Point platform.",
      en: "Club admin ≠ platform admin.",
    },
    "club.createdToast": { id: "Komunitas dibuat!", en: "Community created!" },
    "club.adminDashSub": {
      id: "Kelola member & acara klub.",
      en: "Manage members & club events.",
    },
    "home.nearbySub": {
      id: "Klub yang bisa kamu gabung di sekitarmu",
      en: "Clubs you can join around you",
    },
    "home.eventsNear": {
      id: "🎯 Acara dekat kamu",
      en: "🎯 Events near you",
    },
    "home.seeAll": { id: "Lihat semua", en: "See all" },
    "home.recent": { id: "Aktivitas terakhir", en: "Recent activity" },
    "home.topMabar": { id: "Top 5 Mabar", en: "Top 5 Mabar" },
    "home.topGlobal": { id: "🏆 Top 5 Global", en: "🏆 Global Top 5" },
    "home.eventsSub": {
      id: "Sesi live & registrasi terbuka di dekatmu",
      en: "Live sessions & open registrations near you",
    },
    "home.fullRank": { id: "Leaderboard lengkap →", en: "Full leaderboard →" },
    "title.endorsement": { id: "Endorsement Skills", en: "Skill Endorsement" },
    "title.share-card": { id: "Share Ranking Card", en: "Share Ranking Card" },
    "title.admin": { id: "Admin Overview", en: "Admin Overview" },
    "title.admin-community": { id: "Stats Komunitas", en: "Community Stats" },
    "title.admin-pending": { id: "Pending Matches", en: "Pending Matches" },
    "title.admin-dispute": { id: "Selesaikan Dispute", en: "Resolve Dispute" },
    "title.admin-adjustment": {
      id: "Point Adjustment",
      en: "Point Adjustment",
    },
    "title.errors": { id: "Edge Cases", en: "Edge Cases" },

    "login.hook": {
      id: "Rank-mu di klub ini… valid di klub lain?",
      en: "Your rank here… does it travel to other clubs?",
    },
    "login.subhook": {
      id: "Satu reputasi portabel lintas semua komunitas padel, tennis & pickleball.",
      en: "One portable reputation across every padel, tennis & pickleball community.",
    },
    "login.stat1": { id: "pemain aktif", en: "active players" },
    "login.stat2": { id: "komunitas", en: "communities" },
    "login.stat3": { id: "match/bulan", en: "matches/mo" },
    "login.browse": {
      id: "👀 Lihat isi dulu — tanpa login",
      en: "👀 Browse inside first — no login",
    },
    "login.title": { id: "Masuk ke Match Point", en: "Sign in to Match Point" },
    "login.subtitle": {
      id: "Reputasi portabel menunggu kamu",
      en: "Your portable reputation awaits",
    },
    "login.orEmail": { id: "atau email", en: "or email" },
    "login.email": { id: "Email", en: "Email" },
    "login.password": { id: "Password", en: "Password" },
    "login.submit": { id: "Masuk", en: "Log In" },
    "login.noAccount": {
      id: "Belum punya akun?",
      en: "Don't have an account?",
    },
    "login.signUp": { id: "Daftar gratis", en: "Sign up free" },
    "login.google": { id: "Lanjut dengan Google", en: "Continue with Google" },
    "login.apple": { id: "Lanjut dengan Apple", en: "Continue with Apple" },
    "login.sms": { id: "Verifikasi SMS", en: "SMS Verification" },
    "login.forgot": { id: "Lupa password?", en: "Forgot password?" },
    "login.previewGlobal": {
      id: "Lintas komunitas · 1570 pts",
      en: "Cross-community · 1570 pts",
    },

    "register.title": { id: "Daftar Akun", en: "Create Account" },
    "register.subtitle": {
      id: "Username global unik — dipakai untuk login",
      en: "Globally unique username — used for login",
    },
    "register.submit": { id: "Buat Akun", en: "Create Account" },
    "register.nameLabel": { id: "Nama lengkap", en: "Full name" },
    "register.usernameLabel": { id: "Username", en: "Username" },
    "register.usernameOk": {
      id: "✓ Tersedia — unik global, dipakai login & leaderboard",
      en: "✓ Available — globally unique, used for login & leaderboards",
    },
    "register.phoneLabel": { id: "No. HP", en: "Phone number" },
    "register.phoneHint": {
      id: "Dipakai untuk verifikasi SMS & trust score profilmu.",
      en: "Used for SMS verification & your profile trust score.",
    },
    "register.passwordHint": {
      id: "Minimal 8 karakter.",
      en: "At least 8 characters.",
    },
    "register.cityLabel": { id: "Kota", en: "City" },
    "register.cityHint": {
      id: "Untuk rekomendasi komunitas & acara terdekat.",
      en: "Used to recommend nearby communities & events.",
    },
    "register.sportsLabel": {
      id: "Olahraga yang kamu mainkan",
      en: "Sports you play",
    },
    "register.terms": {
      id: "Saya setuju dengan Syarat Layanan & aturan fair-play Match Point.",
      en: "I agree to Match Point's Terms of Service & fair-play rules.",
    },
    "register.haveAccount": {
      id: "Sudah punya akun?",
      en: "Already have an account?",
    },

    "title.auth-register": { id: "Daftar Akun", en: "Create Account" },
    "title.verify-otp": { id: "Verifikasi HP", en: "Verify Phone" },
    "flow.hint.signup": {
      id: "Isi data akun — username unik, HP untuk verifikasi",
      en: "Fill in your details — unique username, phone for verification",
    },
    "flow.hint.verifyOtp": {
      id: "Kode SMS dikirim ke HP-mu",
      en: "SMS code sent to your phone",
    },
    "otp.title": { id: "Verifikasi No. HP", en: "Verify your phone" },
    "otp.desc": {
      id: "Kode 6 digit dikirim via SMS ke +62 812-••••-7890.",
      en: "A 6-digit code was sent via SMS to +62 812-••••-7890.",
    },
    "otp.resend": {
      id: "Kirim ulang kode (0:24)",
      en: "Resend code (0:24)",
    },
    "otp.verifyBtn": {
      id: "Verifikasi & Buat Akun",
      en: "Verify & Create Account",
    },
    "otp.editPhone": { id: "Ubah nomor", en: "Change number" },

    "guest.banner": {
      id: "Mode tamu — lihat saja. Login untuk submit match, endorse & share.",
      en: "Guest mode — view only. Sign in to submit matches, endorse & share.",
    },
    "guest.bannerInline": {
      id: "Mode tamu — lihat saja. Masuk untuk submit match & event.",
      en: "Guest mode — browse only. Sign in to submit matches & join events.",
    },
    "guest.lockTitle": { id: "Perlu akun", en: "Account required" },
    "guest.lockBody": {
      id: "Login atau daftar untuk menggunakan fitur ini.",
      en: "Sign in or register to use this feature.",
    },
    "guest.lockCta": { id: "Masuk / Daftar", en: "Log In / Sign Up" },
    "guest.homeTitle": {
      id: "Kamu lagi lihat-lihat 👀",
      en: "You're just browsing 👀",
    },
    "guest.homeDesc": {
      id: "Jelajahi komunitas, ranking & acara secara bebas. Masuk untuk gabung komunitas dan dapat rank Mabar-mu.",
      en: "Explore communities, rankings & events freely. Sign in to join a community and earn your Mabar rank.",
    },
    "guest.heroTitle": {
      id: "Jelajahi Match Point",
      en: "Explore Match Point",
    },
    "guest.heroMeta": {
      id: "Mode tamu — ranking, komunitas & acara terbuka untuk dilihat",
      en: "Guest mode — rankings, communities & events are open to view",
    },
    "guest.sportHint": {
      id: "Masuk untuk lihat rank-mu",
      en: "Sign in to see your rank",
    },
    "guest.lbHint": {
      id: "Masuk & gabung komunitas untuk muncul di ranking ini.",
      en: "Sign in & join a community to appear on this leaderboard.",
    },

    "flow.pickRole": { id: "Pilih perjalanan", en: "Choose your journey" },
    "flow.userTitle": { id: "Perjalanan Pemain", en: "Player Journey" },
    "flow.userDesc": {
      id: "Login → cari/gabung komunitas → rank Mabar → daftar acara → match",
      en: "Log in → find/join community → Mabar rank → register events → play",
    },
    "flow.adminTitle": { id: "Perjalanan Admin", en: "Admin Journey" },
    "flow.adminDesc": {
      id: "Review match, selesaikan dispute, adjustment poin",
      en: "Review matches, resolve disputes, adjust points",
    },
    "flow.start": { id: "Mulai", en: "Start" },
    "flow.backMockups": { id: "← Kembali ke Mockups", en: "← Back to Mockups" },
    "flow.guestPreview": { id: "Pratinjau Tamu", en: "Guest Preview" },
    "flow.guestPreviewDesc": {
      id: "Jelajahi komunitas terdekat tanpa akun",
      en: "Browse nearby communities without an account",
    },
    "flow.pickRoleSub": {
      id: "Komunitas dulu, satu aksi per layar — padel, tennis & pickleball.",
      en: "Community-first, one action per screen — padel, tennis & pickleball.",
    },
    "flow.clubAdminTitle": { id: "Admin Klub", en: "Club Admin" },
    "flow.clubAdminDesc": {
      id: "Kelola komunitas · registrasi peserta · turnamen manual",
      en: "Run your community · registrations · manual tournaments",
    },
    "flow.platformTitle": {
      id: "Admin Match Point",
      en: "Match Point Platform Admin",
    },
    "flow.platformDesc": {
      id: "Approval inbox · dispute · audit lintas komunitas",
      en: "Approval inbox · disputes · cross-community audit",
    },
    "flow.platformLoginHook": {
      id: "Tim Match Point — dispute lintas komunitas & audit platform.",
      en: "Match Point team — cross-community disputes & platform audit.",
    },
    "flow.platformLoginSub": {
      id: "Superadmin platform · bukan admin klub komunitas.",
      en: "Platform superadmin · not a community club admin.",
    },
    "flow.platformClubNote": {
      id: "Buat turnamen? Itu peran admin klub di journey Club Admin — bukan di sini.",
      en: "Creating tournaments? That's the club admin journey — not here.",
    },
    "flow.hint.createClub": {
      id: "Buat komunitas · jadi admin klub",
      en: "Create community · become club admin",
    },
    "flow.hint.clubAdmin": {
      id: "Dashboard admin klub",
      en: "Club admin dashboard",
    },
    "flow.adminLoginHook": {
      id: "Kelola komunitas. Selesaikan dispute. Jaga ranking tetap adil.",
      en: "Manage communities. Resolve disputes. Keep rankings fair.",
    },
    "flow.adminLoginSub": {
      id: "Community admin & superadmin — audit trail setiap keputusan.",
      en: "Community admin & superadmin — every decision audited.",
    },
    "flow.adminLoginBtn": { id: "Masuk ke Dashboard", en: "Enter Dashboard" },
    "flow.step": { id: "Langkah", en: "Step" },
    "flow.of": { id: "dari", en: "of" },
    "flow.next": { id: "Lanjut", en: "Next" },
    "flow.prev": { id: "Kembali", en: "Back" },
    "flow.finish": { id: "Selesai", en: "Finish" },
    "flow.logout": { id: "Keluar", en: "Log Out" },
    "flow.toast.login": {
      id: "Berhasil masuk — selamat datang, Budi!",
      en: "Signed in — welcome, Budi!",
    },
    "flow.toast.logout": {
      id: "Kamu keluar — mode tamu aktif",
      en: "Signed out — guest mode active",
    },
    "flow.guestLoginCta": {
      id: "Masuk untuk fitur penuh",
      en: "Sign in for full access",
    },

    "flow.hint.login": {
      id: "Masuk atau jelajahi tanpa akun",
      en: "Sign in or browse without an account",
    },
    "flow.hint.dashboard": {
      id: "Beranda — rank, aktivitas, aksi cepat",
      en: "Home — ranks, activity, quick actions",
    },
    "flow.hint.leaderboard": {
      id: "Leaderboard Mabar · Padel Jakarta Selatan",
      en: "Mabar leaderboard · Padel Jakarta Selatan",
    },
    "flow.hint.submit": {
      id: "Catat hasil match — ~30 detik",
      en: "Log match result — ~30 seconds",
    },
    "flow.hint.approved": {
      id: "Match disetujui · rank +18 poin",
      en: "Match approved · rank +18 pts",
    },
    "flow.hint.profile": {
      id: "Profil publik & endorsement skills",
      en: "Public profile & skill endorsements",
    },
    "flow.hint.endorse": {
      id: "Dukung skill rekan mainmu",
      en: "Endorse a teammate's skills",
    },
    "flow.hint.share": {
      id: "Bagikan kartu ranking ke sosmed",
      en: "Share your ranking card",
    },
    "flow.hint.communities": {
      id: "Komunitas tempat kamu main",
      en: "Communities you play in",
    },
    "flow.hint.tournament": {
      id: "Turnamen · bracket & hasil",
      en: "Tournament · bracket & results",
    },
    "flow.hint.events": {
      id: "Discovery — acara live & registrasi terbuka di dekatmu",
      en: "Discovery — live & open-registration events near you",
    },
    "flow.hint.americano": {
      id: "Americano · rotasi partner · poin individual",
      en: "Americano · partner rotation · individual points",
    },
    "flow.hint.mexicano": {
      id: "Mexicano · pairing by ranking · makin kompetitif",
      en: "Mexicano · pairing by ranking · gets competitive",
    },
    "flow.hint.adminCreateEvent": {
      id: "Buat acara · pilih format & olahraga",
      en: "Create event · pick format & sport",
    },
    "flow.hint.adminPublish": {
      id: "Konfigurasi & publish ke pemain",
      en: "Configure & publish to players",
    },

    "wizard.step1Title": { id: "Buat Acara — Tipe", en: "Create Event — Type" },
    "wizard.step2Title": { id: "Kategori Pemain", en: "Player Category" },
    "wizard.step3Title": { id: "Jumlah Peserta", en: "Participants" },
    "wizard.step4Title": { id: "Format Kompetisi", en: "Competition Format" },
    "wizard.stepLabel": { id: "Langkah 1/4", en: "Step 1/4" },
    "wizard.step2Label": { id: "Langkah 2/4", en: "Step 2/4" },
    "wizard.step3Label": { id: "Langkah 3/4", en: "Step 3/4" },
    "wizard.step4Label": { id: "Langkah 4/4", en: "Step 4/4" },
    "wizard.step1Sub": {
      id: "Pilih jenis acara — sosial (Americano/Mexicano) atau kompetitif (Single/Double).",
      en: "Pick event type — social (Americano/Mexicano) or competitive (Singles/Doubles).",
    },
    "wizard.step2Sub": {
      id: "Siapa yang main? Pilih kategori untuk Single atau Double.",
      en: "Who plays? Pick a category for Singles or Doubles.",
    },
    "wizard.step3Sub": {
      id: "Berapa pemain (atau tim) yang akan ikut?",
      en: "How many players (or teams) will join?",
    },
    "wizard.step4Sub": {
      id: "Bagaimana pertandingan berjalan?",
      en: "How should matches run?",
    },
    "wizard.americanoDesc": {
      id: "Rotasi partner · poin individual · club night",
      en: "Partner rotation · individual points · club night",
    },
    "wizard.mexicanoDesc": {
      id: "Pairing by ranking · makin kompetitif",
      en: "Pairing by leaderboard · gets competitive",
    },
    "wizard.singlesDesc": {
      id: "1v1 · turnamen atau liga",
      en: "1v1 · tournament or league",
    },
    "wizard.doublesDesc": {
      id: "2v2 · men's · women's · mixed",
      en: "2v2 · men's · women's · mixed",
    },
    "wizard.divMen": { id: "👨 Men's", en: "👨 Men's" },
    "wizard.divWomen": { id: "👩 Women's", en: "👩 Women's" },
    "wizard.divMixed": { id: "🤝 Mixed", en: "🤝 Mixed" },
    "wizard.divHint": {
      id: "Mixed hanya untuk Double. Tennis, padel & pickleball pakai aturan yang sama.",
      en: "Mixed is doubles only. Same flow for tennis, padel & pickleball.",
    },
    "wizard.customCount": { id: "Atau ketik jumlah", en: "Or enter a number" },
    "wizard.participantHint": {
      id: "Americano/Mexicano: jumlah pemain individual. Single/Double: jumlah pemain atau pasangan tim.",
      en: "Americano/Mexicano: individual players. Singles/Doubles: players or teams.",
    },
    "wizard.continueBtn": { id: "Lanjut", en: "Continue" },
    "wizard.continuePublish": {
      id: "Lanjut → Review & Publish",
      en: "Continue → Review & Publish",
    },
    "wizard.rrDesc": {
      id: "Semua lawan semua · klasemen",
      en: "Everyone plays everyone · standings",
    },
    "wizard.groupKoDesc": {
      id: "Fase grup lalu eliminasi",
      en: "Group stage then knockout",
    },
    "wizard.leagueDesc": {
      id: "Musim · jadwal · klasemen",
      en: "Season · fixtures · standings",
    },
    "wizard.rrVariantLabel": {
      id: "Varian Round Robin",
      en: "Round Robin variant",
    },
    "wizard.rrFull": {
      id: "Full Round Robin — semua vs semua",
      en: "Full Round Robin — all vs all",
    },
    "wizard.rrPools": {
      id: "Pool Round Robin — 2 pool → semifinal",
      en: "Pool Round Robin — 2 pools → semis",
    },
    "wizard.rrTimed": {
      id: "Timed Rotation — rotasi per sesi",
      en: "Timed Rotation — rotate each session",
    },
    "wizard.rrVariantHint": {
      id: "Pilih sub-format setelah memilih Round Robin.",
      en: "Pick a sub-format after choosing Round Robin.",
    },
    "wizard.summaryLabel": { id: "Ringkasan acara", en: "Event summary" },
    "wizard.raceToLabel": { id: "Race to (poin)", en: "Race to (points)" },
    "wizard.pickDivision": {
      id: "Pilih kategori pemain dulu",
      en: "Pick a player category first",
    },
    "wizard.pickStructure": {
      id: "Pilih format kompetisi dulu",
      en: "Pick a competition format first",
    },
    "wizard.hintStep1": {
      id: "Langkah 1 — Americano, Mexicano, Singles, atau Doubles",
      en: "Step 1 — Americano, Mexicano, Singles, or Doubles",
    },
    "wizard.hintStep2": {
      id: "Langkah 2 — Men's, Women's, atau Mixed",
      en: "Step 2 — Men's, Women's, or Mixed",
    },
    "wizard.hintStep3": {
      id: "Langkah 3 — berapa peserta?",
      en: "Step 3 — how many participants?",
    },
    "wizard.hintStep4": {
      id: "Langkah 4 — Round Robin, Group→KO, atau League",
      en: "Step 4 — Round Robin, Group→KO, or League",
    },
    "wizard.continueRoster": {
      id: "Lanjut → Daftar pemain",
      en: "Continue → Add players",
    },
    "wizard.rosterTitle": { id: "Daftar Pemain", en: "Player Roster" },
    "wizard.rosterOptional": { id: "Opsional", en: "Optional" },
    "wizard.rosterSub": {
      id: "Registrasi dua arah — admin bisa isi nama sekarang; pemain lain tetap bisa daftar sendiri setelah publish.",
      en: "Two-way registration — pre-fill names now; other players can still self-register after publish.",
    },
    "wizard.rosterFilled": { id: "Slot terisi (admin)", en: "Slots filled (admin)" },
    "wizard.rosterSearchPh": { id: "Cari pemain…", en: "Search players…" },
    "wizard.rosterFilterAll": { id: "Semua", en: "All" },
    "wizard.rosterFilterCommunity": { id: "Dalam komunitas", en: "In community" },
    "wizard.rosterFilterOutside": { id: "Luar komunitas", en: "Outside community" },
    "wizard.rosterGuestLabel": { id: "Atau ketik nama (tanpa akun)", en: "Or type a name (no account)" },
    "wizard.rosterGuestPh": { id: "Nama walk-in / tamu", en: "Walk-in / guest name" },
    "wizard.rosterAddGuest": { id: "+ Tambah", en: "+ Add" },
    "wizard.rosterSelected": { id: "Sudah ditambahkan", en: "Added to roster" },
    "wizard.rosterSkip": {
      id: "Lewati — buka untuk self-registration",
      en: "Skip — open for self-registration",
    },
    "wizard.rosterInCommunity": { id: "Komunitas", en: "Community" },
    "wizard.rosterOutside": { id: "Luar", en: "Outside" },
    "wizard.rosterAdminAdded": { id: "Admin", en: "Admin" },
    "wizard.rosterByAdmin": { id: "oleh admin", en: "by admin" },
    "wizard.rosterEmpty": {
      id: "Belum ada pemain — cari di atas atau lewati langkah ini.",
      en: "No players yet — search above or skip this step.",
    },
    "wizard.rosterNoResults": { id: "Pemain tidak ditemukan", en: "No players found" },
    "wizard.rosterGuestMeta": { id: "Tamu · ditambah admin", en: "Guest · admin-added" },
    "wizard.rosterSlotsOpen": { id: "slot terbuka", en: "slots open" },
    "wizard.rosterPreFilled": { id: "pemain diisi admin", en: "players pre-filled by admin" },
    "wizard.rosterAdded": { id: "Pemain ditambahkan", en: "Player added" },
    "wizard.rosterFull": { id: "Kapasitas penuh", en: "Capacity full" },
    "wizard.rosterGuestRequired": { id: "Ketik nama dulu", en: "Enter a name first" },
    "wizard.dualRegNote": {
      id: "Setelah publish, pemain bisa daftar sendiri. Slot yang belum terisi tetap terbuka.",
      en: "After publish, players can self-register. Unfilled slots stay open.",
    },
    "wizard.hintRoster": {
      id: "Opsional — cari pemain komunitas atau luar komunitas",
      en: "Optional — search community or external players",
    },
    "wizard.regDualSub": {
      id: "Registrasi dua arah — admin-added + self-registration. Kelola waitlist sebelum sesi.",
      en: "Two-way registration — admin-added + self-signup. Manage waitlist before the session.",
    },
    "wizard.regSelfMeta": { id: "Self-registration · 1 jam lalu", en: "Self-registered · 1h ago" },
    "wizard.regSelfBadge": { id: "Self-register", en: "Self-registered" },
    "wizard.regNoneYet": { id: "Belum ada pendaftaran.", en: "No registrations yet." },

    "referee.setupTitle": { id: "Setup Sesi", en: "Session Setup" },
    "referee.setupBadge": { id: "Sebelum live", en: "Before live" },
    "referee.setupSub": {
      id: "Konfirmasi nama turnamen, pemain, lapangan & max skor — lalu generate jadwal rotasi.",
      en: "Confirm tournament name, players, courts & max score — then generate the rotation schedule.",
    },
    "referee.tournamentName": { id: "Nama turnamen", en: "Tournament name" },
    "referee.playerCount": { id: "Jumlah pemain", en: "Number of players" },
    "referee.courtCount": { id: "Jumlah lapangan", en: "Number of courts" },
    "referee.maxScore": { id: "Max skor (race to)", en: "Max score (race to)" },
    "referee.maxScoreHint": { id: "Set 0 untuk non race-to format.", en: "Set 0 to turn off race-to cap." },
    "referee.playerNames": { id: "Nama pemain", en: "Player names" },
    "referee.courtNames": { id: "Nama lapangan", en: "Court names" },
    "referee.playerN": { id: "Pemain", en: "Player" },
    "referee.courtN": { id: "Lapangan", en: "Court" },
    "referee.statMatches": { id: "Total pertandingan", en: "Matches total" },
    "referee.statDuration": { id: "Estimasi durasi", en: "Estimated duration" },
    "referee.statPerPlayer": { id: "Match per pemain", en: "Matches per player" },
    "referee.generateBtn": { id: "Generate jadwal → Mulai live", en: "Generate schedule → Go live" },
    "referee.hintSetup": { id: "Setup lapangan & pemain sebelum wasit", en: "Set up courts & players before refereeing" },
    "referee.hintLive": { id: "Mode wasit · skor live · klasemen detail", en: "Referee mode · live scores · detailed standings" },
    "referee.shareLabel": { id: "Share link ke pemain", en: "Share link to other players" },
    "referee.copyBtn": { id: "Copy", en: "Copy" },
    "referee.colName": { id: "Nama", en: "Name" },
    "referee.standingsHint": { id: "P+ = poin dicetak · race to ", en: "P+ = points scored · race to " },
    "referee.perMatch": { id: "per match", en: "per match" },
    "referee.roundN": { id: "Round", en: "Round" },
    "referee.noMatches": { id: "Generate jadwal untuk lihat pertandingan.", en: "Generate schedule to see matches." },
    "referee.tapMatch": { id: "Tap pertandingan di atas untuk input skor sebagai wasit.", en: "Tap a match above to enter scores as referee." },
    "referee.tabCourts": { id: "Lapangan", en: "Courts" },
    "referee.tabScore": { id: "Skor", en: "Score" },
    "referee.tabStandings": { id: "Klasemen", en: "Standings" },
    "referee.courtsHint": {
      id: "Tap kartu lapangan untuk memilih match, lalu buka tab Skor.",
      en: "Tap a court card to select the match, then open the Score tab.",
    },
    "referee.scoreEmptyTitle": { id: "Belum ada lapangan dipilih", en: "No court selected" },
    "referee.scoreEmptyHint": {
      id: "Buka tab Lapangan, tap kartu match, lalu kembali ke Skor untuk input poin.",
      en: "Open Courts, tap a match card, then return here to enter the score.",
    },
    "referee.goToCourts": { id: "Ke Lapangan →", en: "Go to Courts →" },
    "referee.enterScoreBtn": { id: "Input skor", en: "Enter score" },
    "referee.scoreFlowRace": {
      id: "Langkah 1: atur skor tiap sisi dengan +/−. Langkah 2: tap Konfirmasi untuk simpan & update klasemen.",
      en: "Step 1: set each side's score with +/−. Step 2: tap Confirm to save and refresh standings.",
    },
    "referee.scoreFlowSets": {
      id: "Langkah 1: atur set menang dengan +/−. Langkah 2: tap Konfirmasi untuk simpan & update klasemen.",
      en: "Step 1: adjust sets won with +/−. Step 2: tap Confirm to save and update standings.",
    },
    "referee.raceTo": { id: "Race to", en: "Race to" },
    "referee.pickerHint": { id: "Tap skor tiap tim — klasemen update langsung.", en: "Tap score for each team — standings update instantly." },
    "referee.confirmScore": { id: "Konfirmasi skor", en: "Confirm score" },
    "referee.fullscreenBtn": { id: "⛶ Layar penuh", en: "⛶ Full screen" },
    "referee.scoreSaved": { id: "Skor tersimpan", en: "Score saved" },
    "referee.teamN": { id: "Tim", en: "Team" },
    "referee.bestOf": { id: "Best of (set)", en: "Best of (sets)" },
    "referee.setsWon": { id: "Set menang", en: "Sets won" },
    "referee.standingsSetsHint": {
      id: "Poin liga · set menang/kalah per match",
      en: "League points · sets won/lost per match",
    },
    "referee.pickerSetsHint": {
      id: "Tap set menang tiap sisi — klasemen update langsung",
      en: "Tap sets won per side — standings update instantly",
    },
    "tournament.roundAdvanced": { id: "Round berikutnya", en: "Next round" },
    "flow.hint.adminLive": {
      id: "Kelola sesi live · rotasi & skor",
      en: "Manage live session · rotations & scores",
    },

    "flow.adminCreateEvent": {
      id: "Buat Acara / Turnamen",
      en: "Create Event / Tournament",
    },
    "flow.adminCreateEventDesc": {
      id: "Americano, Mexicano, Singles, atau Doubles — langkah demi langkah",
      en: "Americano, Mexicano, Singles, or Doubles — step by step",
    },
    "flow.adminEventIntro": {
      id: "Pilih format — Match Point hitung rotasi & leaderboard otomatis.",
      en: "Pick a format — Match Point auto-calculates rotations & leaderboard.",
    },
    "flow.americanoDesc": {
      id: "Partner acak tiap round · poin kumulatif · 16 pemain",
      en: "Random partners each round · cumulative points · 16 players",
    },
    "flow.mexicanoDesc": {
      id: "Round 2+ by leaderboard · 1+4 vs 2+3 · makin seimbang",
      en: "Round 2+ by leaderboard · 1+4 vs 2+3 · tighter matchups",
    },
    "flow.americanoAdminDesc": {
      id: "Partner acak tiap round · sosial · ideal club night",
      en: "Random partners each round · social · ideal club night",
    },
    "flow.mexicanoAdminDesc": {
      id: "Pairing by leaderboard · #1+#4 vs #2+#3",
      en: "Pairing by leaderboard · #1+#4 vs #2+#3",
    },
    "flow.bracketAdminDesc": {
      id: "Single elimination · advance manual",
      en: "Single elimination · manual advance",
    },
    "flow.bracketTitle": {
      id: "Bracket · Single Elimination",
      en: "Bracket · Single Elimination",
    },
    "flow.bracketFormat": {
      id: "Single Elimination",
      en: "Single Elimination",
    },
    "flow.eventsIntro": {
      id: "Acara live & registrasi terbuka di dekatmu dan di komunitasmu",
      en: "Events near you & in your communities",
    },
    "flow.americanoLiveHint": {
      id: "Partner & lawan rotasi otomatis · skor tim = poin individualmu",
      en: "Auto partner & opponent rotation · team score = your individual points",
    },
    "flow.mexicanoLiveHint": {
      id: "Round 4: #1+#4 vs #2+#3 · ranking menentukan pairing berikutnya",
      en: "Round 4: #1+#4 vs #2+#3 · ranking drives next pairings",
    },
    "flow.mexicanoPairHint": {
      id: "Winners play winners — pertandingan makin ketat seiring poin",
      en: "Winners play winners — matches tighten as points accumulate",
    },
    "flow.publishPreview": {
      id: "Setelah publish, acara muncul di Beranda pemain komunitas.",
      en: "After publishing, the event appears on players' Home screens.",
    },
    "flow.publishBtn": {
      id: "Publish Acara — Tampilkan ke Pemain",
      en: "Publish Event — Show to Players",
    },
    "flow.completeTitle": {
      id: "Kamu sudah explore Match Point!",
      en: "You've explored Match Point!",
    },
    "flow.completeDesc": {
      id: "Padel & tennis · match · rank · event · admin — satu reputasi lintas komunitas.",
      en: "Padel & tennis · matches · ranks · events · admin — one cross-community reputation.",
    },
    "flow.cta.eventsTitle": {
      id: "Acara",
      en: "Events",
    },
    "flow.cta.eventsDesc": {
      id: "Live, buka registrasi & acara komunitasmu",
      en: "Live, open registration & your community events",
    },
    "flow.cta.joinSession": {
      id: "Gabung Sesi Live →",
      en: "Join Live Session →",
    },

    "flow.hint.adminLogin": {
      id: "Portal admin — masuk untuk kelola",
      en: "Admin portal — sign in to manage",
    },
    "flow.hint.adminOverview": {
      id: "Overview platform · metrik & alert",
      en: "Platform overview · metrics & alerts",
    },
    "flow.hint.adminPending": {
      id: "23 match menunggu review admin",
      en: "23 matches awaiting admin review",
    },
    "flow.hint.adminDispute": {
      id: "Selesaikan dispute #D-4421",
      en: "Resolve dispute #D-4421",
    },
    "flow.hint.adminAdjustment": {
      id: "Koreksi poin dengan audit trail",
      en: "Point correction with audit trail",
    },
    "flow.hint.adminCommunity": {
      id: "Analytics komunitas Padel Jakarta",
      en: "Padel Jakarta community analytics",
    },
    "flow.hint.adminSettings": {
      id: "Akun & preferensi admin platform",
      en: "Platform admin account & preferences",
    },

    "flow.cta.submitTitle": { id: "Catat Hasil Match", en: "Log Match Result" },
    "flow.cta.submitDesc": {
      id: "Menang? Submit skor — rank Mabar update otomatis",
      en: "Won? Submit score — Mabar rank updates instantly",
    },
    "flow.cta.shareTitle": { id: "Bagikan Rank-mu", en: "Share Your Rank" },
    "flow.cta.shareDesc": {
      id: "Kartu 600×600 siap WhatsApp & Instagram",
      en: "600×600 card ready for WhatsApp & Instagram",
    },
    "flow.cta.leaderboardBtn": {
      id: "Lihat Peringkat Lengkap",
      en: "View Full Rankings",
    },
    "flow.cta.submitBtn": {
      id: "Kirim & Update Rank",
      en: "Submit & Update Rank",
    },
    "flow.cta.endorseBtn": {
      id: "Kirim Endorsement ke Rudi",
      en: "Send Endorsement to Rudi",
    },
    "flow.cta.tournamentBtn": {
      id: "Lihat Turnamen Aktif",
      en: "Browse Active Tournaments",
    },
    "flow.cta.homeBtn": { id: "Kembali ke Beranda", en: "Back to Home" },
    "flow.cta.finishBtn": {
      id: "Selesai — Kembali ke Menu",
      en: "Done — Back to Menu",
    },

    "hub.title": {
      id: "Reputasi pemain lintas komunitas",
      en: "Cross-community player reputation",
    },
    "hub.desc": {
      id: "Mockup HTML + alur interaktif untuk Match Point — komunitas dulu, rank Mabar + Global per olahraga, turnamen manual, approval platform.",
      en: "HTML mockups + interactive flows for Match Point — community-first, Mabar + Global ranks per sport, manual tournaments, platform approvals.",
    },
    "hub.openProto": { id: "Buka Mockup Gallery", en: "Open Mockup Gallery" },
    "hub.openFlow": { id: "Buka Alur Interaktif", en: "Open Interactive Flow" },

    /* ---- Community-first: approval flow ---- */
    "approval.submitted": { id: "Diajukan", en: "Submitted" },
    "approval.pending": { id: "Menunggu Review", en: "Pending Review" },
    "approval.approved": { id: "Disetujui", en: "Approved" },
    "approval.rejected": { id: "Ditolak", en: "Rejected" },
    "club.requestBtn": {
      id: "Ajukan Komunitas — Review Platform",
      en: "Submit Community — Platform Review",
    },
    "club.approvalNote": {
      id: "Semua komunitas baru direview tim platform sebelum tayang (biasanya < 24 jam).",
      en: "Every new community is reviewed by the platform team before going live (usually < 24h).",
    },
    "club.requestedToast": {
      id: "Pengajuan terkirim — menunggu persetujuan platform",
      en: "Request sent — awaiting platform approval",
    },
    "club.approvedToast": {
      id: "Komunitas disetujui — kamu sekarang admin!",
      en: "Community approved — you're now the admin!",
    },
    "club.joinedToast": {
      id: "Kamu bergabung ke komunitas!",
      en: "You joined the community!",
    },
    "club.pendingTitle": {
      id: "Menunggu persetujuan platform",
      en: "Awaiting platform approval",
    },
    "club.pendingDesc": {
      id: "Pengajuan komunitasmu sedang direview tim Match Point. Kamu tetap bisa main & gabung komunitas lain.",
      en: "Your community request is being reviewed by the Match Point team. You can still play & join other communities.",
    },
    "club.pendingDemo": {
      id: "✓ Simulasikan disetujui (demo)",
      en: "✓ Simulate approval (demo)",
    },
    "club.findCta": { id: "🔍 Cari Komunitas", en: "🔍 Find Community" },
    "club.joinDesc": {
      id: "Atau cari komunitas terdekat dan gabung dulu.",
      en: "Or find a nearby community and join first.",
    },

    /* ---- Home states ---- */
    "home.communityStats": { id: "Komunitasmu", en: "Your community" },
    "home.statMembers": { id: "Member", en: "Members" },
    "home.statMatches": { id: "Match", en: "Matches" },
    "home.statYourRank": { id: "Rank Mabar-mu", en: "Your Mabar rank" },
    "home.statNextEvent": { id: "Acara berikut", en: "Next event" },
    "home.soon": { id: "Segera — coba di acara", en: "Soon — try at events" },
    "sport.switch": { id: "Ganti olahraga", en: "Switch sport" },
    "chrome.notifications": { id: "Notifikasi", en: "Notifications" },
    "menu.language": { id: "Bahasa", en: "Language" },
    "theme.toDark": { id: "Mode Gelap", en: "Dark Mode" },
    "theme.toLight": { id: "Mode Terang", en: "Light Mode" },
    "menu.viewProfile": { id: "Lihat Profil", en: "View Profile" },
    "menu.settings": { id: "Akun & Pengaturan", en: "Account & Settings" },
    "menu.settingsToast": {
      id: "Mock — pengaturan belum tersedia di prototype",
      en: "Mock — settings not available in this prototype",
    },
    "home.heroNoClub": {
      id: "Belum ada komunitas — gabung untuk dapat rank Mabar",
      en: "No community yet — join one to earn a Mabar rank",
    },
    "home.playFindDesc": {
      id: "Gabung → dapat rank Mabar & acara",
      en: "Join → get a Mabar rank & events",
    },
    "home.playPendingDesc": {
      id: "Sambil menunggu approval — gabung komunitas lain",
      en: "While you wait for approval — join another community",
    },
    "home.findNearestCta": {
      id: "Cari komunitas terdekat →",
      en: "Find nearby communities →",
    },
    "home.globalRankNote": {
      id: "Ranking global per olahraga — sekunder, Mabar utama.",
      en: "Global rank per sport — secondary; Mabar comes first.",
    },

    "profile.communities": { id: "Komunitas", en: "Communities" },

    /* ---- Find community ---- */
    "title.find-community": { id: "Cari Komunitas", en: "Find Community" },
    "flow.hint.findCommunity": {
      id: "Cari & gabung komunitas terdekat",
      en: "Find & join nearby communities",
    },
    "find.title": { id: "Cari Komunitas", en: "Find Community" },
    "find.sub": {
      id: "Terdekat dulu — berdasar lokasimu di Jakarta Selatan.",
      en: "Nearest first — based on your location in South Jakarta.",
    },
    "find.searchPlaceholder": {
      id: "Cari nama komunitas / kota…",
      en: "Search community name / city…",
    },
    "find.filterAll": { id: "Semua", en: "All" },
    "find.filterOpen": { id: "🟢 Open", en: "🟢 Open" },
    "find.filterCity": { id: "📍 Jakarta", en: "📍 Jakarta" },
    "find.nearYou": {
      id: "👥 Komunitas terdekat",
      en: "👥 Communities near you",
    },
    "find.joinBtn": { id: "Gabung", en: "Join" },
    "find.viewBtn": { id: "Lihat", en: "View" },
    "find.requestNew": {
      id: "Tidak ketemu? Ajukan komunitas baru →",
      en: "Can't find it? Request a new community →",
    },

    "communities.mine": { id: "Komunitasku", en: "My communities" },
    "communities.none": {
      id: "Kamu belum gabung komunitas — pilih yang terdekat di bawah atau ajukan yang baru.",
      en: "You haven't joined a community yet — pick a nearby one below or request a new one.",
    },

    /* ---- Community page ---- */
    "title.community-page": { id: "Halaman Komunitas", en: "Community Page" },
    "flow.hint.communityPage": {
      id: "Profil komunitas · leaderboard · acara · member",
      en: "Community profile · leaderboard · events · members",
    },
    "community.joinCta": {
      id: "Gabung Komunitas Ini",
      en: "Join This Community",
    },
    "community.eventsTitle": {
      id: "📅 Acara Mendatang",
      en: "📅 Upcoming Events",
    },
    "community.createEventCta": {
      id: "+ Buat acara →",
      en: "+ Create event →",
    },
    "community.membersTitle": { id: "Member", en: "Members" },
    "community.lbTitle": {
      id: "🏆 Leaderboard Mabar",
      en: "🏆 Mabar Leaderboard",
    },
    "community.openNote": {
      id: "🟢 Open community — match dihitung ke ranking global.",
      en: "🟢 Open community — matches count toward global ranking.",
    },
    "community.statEvents": { id: "Acara aktif", en: "Active events" },
    "community.nearbyCta": {
      id: "Komunitas lain di dekatmu →",
      en: "Other communities near you →",
    },
    "community.galleryTitle": {
      id: "📸 Galeri Komunitas",
      en: "📸 Community Gallery",
    },
    "community.publicBadge": { id: "🌐 Publik", en: "🌐 Public" },
    "community.memberBadge": {
      id: "👥 Khusus member",
      en: "👥 Members only",
    },
    "community.memberDetailBadge": {
      id: "👥 Detail khusus member",
      en: "👥 Details for members",
    },
    "community.feedTitle": {
      id: "📣 Feed Komunitas",
      en: "📣 Community Feed",
    },
    "community.memberChip": {
      id: "✓ Kamu member — akses penuh terbuka",
      en: "✓ You're a member — full access unlocked",
    },
    "community.lockedTitle": {
      id: "Feed khusus member",
      en: "Members-only feed",
    },
    "community.lockedBody": {
      id: "Post, foto lengkap, diskusi & kontak komunitas terbuka setelah kamu gabung komunitas ini.",
      en: "Posts, full photos, discussions & community contacts unlock once you join this community.",
    },
    "community.composerPh": {
      id: "Bagikan sesuatu ke komunitas…",
      en: "Share something with the community…",
    },

    /* ---- Leaderboard Mabar | Global ---- */
    "lb.realtimeNote": {
      id: "Track Mabar diperbarui real-time setelah match disetujui.",
      en: "Mabar track updates in real time once a match is approved.",
    },
    "lb.globalNote": {
      id: "Ranking lintas komunitas per olahraga — sekunder, Mabar tetap jalur utama.",
      en: "Cross-community ranking per sport — secondary; Mabar is the primary track.",
    },

    /* ---- Event registration ---- */
    "title.event-register": { id: "Pendaftaran Acara", en: "Event Registration" },
    "flow.hint.register": {
      id: "Daftar acara — join, waitlist, batal",
      en: "Register for the event — join, waitlist, cancel",
    },
    "events.registerCta": { id: "Daftar →", en: "Register →" },
    "events.registeredBadge": { id: "Terdaftar", en: "Registered" },
    "events.regOpenBadge": { id: "Registrasi buka", en: "Registration open" },
    "events.filterAll": { id: "Semua", en: "All" },
    "events.filterLive": { id: "Live", en: "Live" },
    "events.filterOpen": { id: "Buka", en: "Open" },
    "events.filterRegistered": { id: "Terdaftar", en: "Registered" },
    "events.filterPast": { id: "Selesai", en: "Past" },
    "events.joinLiveCta": { id: "Gabung Live →", en: "Join Live →" },
    "events.viewCta": { id: "Lihat →", en: "View →" },
    "events.viewResultsCta": { id: "Lihat hasil →", en: "View results →" },
    "events.pastBadge": { id: "Selesai", en: "Past" },
    "events.hostedBy": { id: "Diselenggarakan", en: "Hosted by" },
    "reg.capacityLabel": { id: "Slot terisi", en: "Slots filled" },
    "reg.registerBtn": {
      id: "Daftar Sekarang — Gratis",
      en: "Register Now — Free",
    },
    "reg.waitlistBtn": {
      id: "Penuh? Masuk Waitlist",
      en: "Full? Join Waitlist",
    },
    "reg.leaveBtn": { id: "Batalkan pendaftaran", en: "Cancel registration" },
    "reg.backEvents": { id: "← Semua acara", en: "← All events" },
    "reg.confirmedTitle": { id: "Kamu terdaftar! 🎉", en: "You're registered! 🎉" },
    "reg.confirmedDesc": {
      id: "Line-up round diumumkan admin komunitas saat sesi dimulai.",
      en: "Round line-ups are announced by the community admin when the session starts.",
    },
    "reg.registeredToast": {
      id: "Pendaftaran berhasil — sampai jumpa di lapangan!",
      en: "Registered — see you on court!",
    },
    "reg.closeNote": {
      id: "Registrasi ditutup 1 jam sebelum mulai — lalu admin menjalankan sesi live manual.",
      en: "Registration closes 1h before start — then the admin runs the live session manually.",
    },
    "reg.formatNote": {
      id: "Format dipilih admin saat membuat acara.",
      en: "The format is chosen by the admin when creating the event.",
    },

    /* ---- Club admin: registrations & manual live ---- */
    "club.regTitle": { id: "Pendaftaran Peserta", en: "Player Registrations" },
    "club.regSub": {
      id: "Kelola peserta sebelum sesi — promosikan waitlist secara manual.",
      en: "Manage players before the session — promote from the waitlist manually.",
    },
    "club.promoteBtn": {
      id: "↑ Naikkan dari waitlist",
      en: "↑ Promote from waitlist",
    },
    "club.closeRegBtn": {
      id: "Tutup Registrasi → Mulai Sesi Live",
      en: "Close Registration → Start Live Session",
    },
    "club.manualHint": {
      id: "Rotasi & skor diinput manual oleh admin — cepat, tanpa mesin otomatis.",
      en: "Rotations & scores are entered manually by the admin — fast, no auto engine.",
    },
    "club.manualRoundBtn": {
      id: "Susun Round 4 — Manual",
      en: "Set Up Round 4 — Manually",
    },
    "club.saveScoreBtn": { id: "Simpan Skor Court 1", en: "Save Court 1 Score" },
    "club.membersBtn": { id: "Kelola Member", en: "Manage Members" },
    "club.eventNameLabel": { id: "Nama Acara", en: "Event name" },
    "club.capacityLabel": {
      id: "Kapasitas & waitlist",
      en: "Capacity & waitlist",
    },
    "club.regRequiredLabel": {
      id: "Wajib registrasi — pemain daftar sebelum sesi",
      en: "Registration required — players sign up before the session",
    },
    "club.backDash": { id: "← Dashboard", en: "← Dashboard" },
    "club.adminChip": {
      id: "👑 Kamu admin komunitas ini",
      en: "👑 You're this community's admin",
    },
    "club.manageTitle": {
      id: "⚙️ Kelola Komunitas",
      en: "⚙️ Manage Community",
    },
    "club.adminBadge": { id: "👑 Admin", en: "👑 Admin" },
    "club.backHome": {
      id: "Kembali ke Beranda",
      en: "Back to Home",
    },
    "club.finishHome": {
      id: "Selesai — kembali ke Beranda",
      en: "Done — back to Home",
    },
    "club.toBracketBtn": {
      id: "Bracket Turnamen (manual) →",
      en: "Tournament Bracket (manual) →",
    },
    "club.advanceBtn": {
      id: "Majukan Pemenang → Final",
      en: "Advance Winner → Final",
    },
    "club.bracketManualNote": {
      id: "Bracket maju manual — admin konfirmasi tiap hasil.",
      en: "Bracket advances manually — the admin confirms each result.",
    },
    "flow.hint.adminRegs": {
      id: "Pendaftaran peserta · waitlist manual",
      en: "Player registrations · manual waitlist",
    },
    "flow.hint.adminBracket": {
      id: "Bracket manual · konfirmasi hasil",
      en: "Manual bracket · confirm results",
    },
    "title.admin-registrations": {
      id: "Pendaftaran Peserta",
      en: "Registrations",
    },
    "title.admin-bracket": { id: "Bracket Manual", en: "Manual Bracket" },

    /* ---- Platform approval inbox ---- */
    "title.approval-inbox": { id: "Approval Inbox", en: "Approval Inbox" },
    "flow.hint.approvalInbox": {
      id: "Satu antrian generik untuk semua persetujuan",
      en: "One generic queue for every approval",
    },
    "platform.inboxTitle": { id: "Approval Inbox", en: "Approval Inbox" },
    "platform.inboxSub": {
      id: "Antrian generik — komunitas baru, acara featured, dispute. Status: Diajukan → Menunggu → Disetujui/Ditolak.",
      en: "Generic queue — new communities, featured events, disputes. Status: Submitted → Pending → Approved/Rejected.",
    },
    "platform.reviewBtn": { id: "Review →", en: "Review →" },
    "platform.inboxCardDesc": {
      id: "5 pengajuan — komunitas baru, acara featured",
      en: "5 requests — new communities, featured events",
    },
    "platform.inboxReuseNote": {
      id: "Komponen approval yang sama dipakai untuk komunitas, acara, dan dispute.",
      en: "The same approval component is reused for communities, events, and disputes.",
    },
    "title.approval-detail": {
      id: "Review Pengajuan",
      en: "Review Request",
    },
    "title.approval-result": {
      id: "Hasil Persetujuan",
      en: "Approval Result",
    },
    "flow.hint.approvalDetail": {
      id: "Review pengajuan komunitas — setujui / tolak dengan alasan",
      en: "Review the community request — approve / reject with a reason",
    },
    "flow.hint.approvalResult": {
      id: "Keputusan tercatat di audit log",
      en: "Decision recorded in the audit log",
    },
    "platform.backInboxBtn": {
      id: "← Kembali ke Approval Inbox",
      en: "← Back to Approval Inbox",
    },
    "platform.backOverviewBtn": {
      id: "Dashboard Overview",
      en: "Overview Dashboard",
    },
    "platform.approveBtn": {
      id: "✓ Setujui Komunitas",
      en: "✓ Approve Community",
    },
    "platform.rejectBtn": {
      id: "✕ Tolak — kirim alasan",
      en: "✕ Reject — send reason",
    },
    "platform.reasonLabel": {
      id: "Catatan reviewer (wajib, dikirim ke pengaju)",
      en: "Reviewer note (required, sent to the requester)",
    },
    "platform.approvedTitle": {
      id: "Komunitas disetujui ✓",
      en: "Community approved ✓",
    },
    "platform.approvedDesc": {
      id: "Pengaju otomatis jadi admin komunitas. Keputusan tercatat di audit log.",
      en: "The requester automatically becomes the community admin. The decision is written to the audit log.",
    },
    "platform.readonlyNote": {
      id: "📱 Di ponsel, Platform Admin sebaiknya read-only — keputusan besar di web.",
      en: "📱 On phones, Platform Admin is best kept read-only — big decisions on web.",
    },

    /* ---- Monetization copy (empty states) ---- */
    "upsell.title": {
      id: "Gratis untuk komunitas",
      en: "Free for communities",
    },
    "upsell.body": {
      id: "Rank Mabar, match log, acara dasar & gabung komunitas — gratis. Ke depan: featured placement, badge verified, ekspor turnamen, analytics.",
      en: "Mabar rank, match log, basic events & joining communities — free. Coming: featured placement, verified badge, tournament exports, analytics.",
    },

    "notif.title": { id: "Notifikasi", en: "Notifications" },
    "menu.settingsToast": { id: "Buka pengaturan akun", en: "Open account settings" },

    "club.rejectedTitle": { id: "Pengajuan ditolak", en: "Request rejected" },
    "club.rejectedDesc": { id: "Tim platform menolak pengajuan. Perbaiki dan ajukan ulang.", en: "Platform team rejected the request. Fix and resubmit." },
    "club.resubmitBtn": { id: "Ajukan ulang", en: "Resubmit" },
    "club.rejectedToast": { id: "Pengajuan ditolak (demo)", en: "Request rejected (demo)" },
    "club.resubmitToast": { id: "Pengajuan dikirim ulang", en: "Request resubmitted" },
    "club.autoHint": { id: "Match Point menghitung rotasi & pairing otomatis — admin bisa override skor.", en: "Match Point auto-calculates rotation & pairing — admin can override scores." },
    "club.advanceRoundBtn": { id: "Round berikutnya →", en: "Next round →" },

    "match.categoryLabel": { id: "Kategori", en: "Category" },
    "match.scoringLabel": { id: "Mode skor", en: "Scoring mode" },

    "format.doubleElim": { id: "Winners + losers bracket", en: "Winners + losers bracket" },
    "format.roundRobin": { id: "Round Robin", en: "Round Robin" },
    "format.groupKo": { id: "Groups then knockout", en: "Groups then knockout" },
    "format.league": { id: "League", en: "League" },
    "format.rrHint": { id: "All pairings scheduled · standings update live", en: "All pairings scheduled · standings update live" },

    "flow.hint.roundRobin": { id: "Round robin · standings", en: "Round robin · standings" },
    "flow.hint.league": { id: "League season · next match", en: "League season · next match" },
    "flow.hint.leagueAdmin": { id: "Buat musim liga", en: "Create league season" },
    "flow.hint.leagueStandings": { id: "Klasemen liga", en: "League standings" },
    "flow.hint.globalTournament": { id: "Turnamen global lintas komunitas", en: "Cross-community global tournament" },
    "flow.hint.globalWizard": { id: "Wizard turnamen global", en: "Global tournament wizard" },
    "flow.hint.globalReg": { id: "Registrasi lintas komunitas", en: "Cross-community registration" },
    "flow.hint.globalLive": { id: "Sesi live global", en: "Global live session" },
    "flow.hint.playerOther": { id: "Profil pemain lain", en: "Other player profile" },
    "flow.hint.settings": { id: "Akun & pengaturan", en: "Account & settings" },
    "flow.hint.snapshot": { id: "Snapshot bulanan Global", en: "Global monthly snapshot" },
    "flow.platformDualTier": { id: "Acara komunitas → Club Admin. Turnamen global (nasional/regional, lintas komunitas, rank Global) → Platform Admin di atas.", en: "Community events → Club Admin. Global tournaments (national/regional, cross-community, Global rank) → Platform Admin above." },

    "lb.globalActive": { id: "Ranking lintas komunitas per olahraga — kompetitif, turnamen tiered mengisi rank Global.", en: "Cross-community ranking per sport — competitive; tiered tournaments feed Global rank." },
    "lb.snapshotBtn": { id: "Monthly snapshot →", en: "Monthly snapshot →" },
    "lb.snapshotNote": { id: "Snapshot rank Global · rekam bulanan immutable", en: "Global rank snapshot · immutable monthly record" },
    "title.global-tournament": { id: "Turnamen Global", en: "Global Tournament" },
    "title.player-other": { id: "Profil Pemain", en: "Player Profile" },
    "title.leaderboard-snapshot": { id: "Monthly Snapshot", en: "Monthly Snapshot" },
    "profile.provisional": { id: "Provisional · <5 match", en: "Provisional · <5 matches" },
    "profile.communitiesTitle": { id: "Komunitas", en: "Communities" },
    "profile.homeCommunity": { id: "Komunitas utama", en: "Home community" },

    "league.cardTitle": { id: "📅 Liga Aktif — Musim 2025", en: "📅 Active League — Season 2025" },
    "league.cardSub": { id: "Round robin · 8 tim · Minggu 12:00", en: "Round robin · 8 teams · Sunday 12:00" },
    "league.viewBtn": { id: "Lihat liga", en: "View league" },
    "league.nextTitle": { id: "Pertandingan berikutnya", en: "Next match" },
    "league.seasonName": { id: "Nama musim", en: "Season name" },
    "league.duration": { id: "Durasi (minggu)", en: "Duration (weeks)" },
    "league.generateBtn": { id: "Generate jadwal round-robin", en: "Generate round-robin schedule" },

    "rank.finalizeBtn": { id: "Finalisasi → Update Mabar Rank", en: "Finalize → Update Mabar Rank" },
    "rank.finalizeGlobalBtn": { id: "Finalisasi → Update Global Rank", en: "Finalize → Update Global Rank" },
    "rank.finalizeToast": { id: "Rank diperbarui ✓", en: "Rank updated ✓" },
    "tournament.roundAdvanced": { id: "Round berikutnya disusun", en: "Next round generated" },

    "platform.globalTournamentTitle": { id: "Buat Turnamen Global", en: "Create Global Tournament" },
    "platform.globalTournamentDesc": { id: "Tier 1–3 · lintas komunitas · rank Global", en: "Tier 1–3 · cross-community · Global rank" },
    "platform.createGlobalBtn": { id: "Buat Global Tournament", en: "Create Global Tournament" },
    "platform.globalRegTitle": { id: "Registrasi Global", en: "Global Registration" },
    "platform.globalLiveTitle": { id: "Global Live", en: "Global Live" },
    "platform.overviewTitle": { id: "Ringkasan platform", en: "Platform overview" },
    "platform.quickActions": { id: "Aksi cepat", en: "Quick actions" },
    "platform.navInbox": { id: "Inbox", en: "Inbox" },
    "platform.navMatches": { id: "Match", en: "Matches" },
    "platform.navAnalytics": { id: "Analitik", en: "Analytics" },
    "platform.accountTitle": { id: "Akun Admin", en: "Admin account" },
    "platform.accountRole": { id: "Superadmin platform", en: "Platform superadmin" },
    "platform.inboxEmptyHint": {
      id: "Ketuk item untuk review — komunitas, acara featured, dispute.",
      en: "Tap an item to review — communities, featured events, disputes.",
    },
    "platform.inboxNeedsReview": { id: "Perlu review", en: "Needs review" },
    "platform.inboxResolved": { id: "Selesai", en: "Resolved" },
    "platform.filterAll": { id: "Semua", en: "All" },
    "platform.searchInbox": { id: "Cari komunitas, acara…", en: "Search communities, events…" },
    "platform.searchMatches": { id: "Cari pemain, ID dispute…", en: "Search players, dispute ID…" },
    "platform.showingRange": { id: "Menampilkan {from}–{to} dari {total}", en: "Showing {from}–{to} of {total}" },
    "platform.pageOf": { id: "Halaman {page} dari {pages}", en: "Page {page} of {pages}" },
    "platform.prevPage": { id: "← Sebelumnya", en: "← Prev" },
    "platform.nextPage": { id: "Berikutnya →", en: "Next →" },
    "platform.loadResolved": { id: "Lihat {n} item selesai", en: "Show {n} resolved items" },
    "platform.emptyInbox": { id: "Tidak ada item untuk filter ini.", en: "No items match your filter." },
    "platform.emptyMatches": { id: "Tidak ada match untuk filter ini.", en: "No matches in this filter." },
    "platform.matchesTitle": { id: "Match Pending", en: "Pending Matches" },
    "platform.matchesTotal": { id: "Antrian pending", en: "Pending queue" },
    "platform.matchesDisputes": { id: "Dispute", en: "Disputes" },
    "platform.matchesGps": { id: "GPS gagal", en: "GPS fail" },
    "platform.matchesReview": { id: "Review", en: "Review" },
    "platform.approveShort": { id: "Setujui", en: "Approve" },
    "platform.rejectShort": { id: "Tolak", en: "Reject" },
    "platform.resolveShort": { id: "Resolve", en: "Resolve" },
    "platform.priorityHigh": { id: "Tinggi", en: "High" },
    "platform.toastApproved": { id: "Match disetujui (demo)", en: "Match approved (demo)" },
    "platform.toastRejected": { id: "Match ditolak (demo)", en: "Match rejected (demo)" },
    "platform.approvalTypeCommunity": { id: "Komunitas baru", en: "New community" },
    "platform.approvalTypeEvent": { id: "Acara featured", en: "Featured event" },
    "platform.approvalTypeGlobal": { id: "Turnamen global", en: "Global tournament" },
    "platform.approvalTypeGps": { id: "Match · review GPS", en: "Match · GPS review" },
    "platform.approvalTypeDispute": { id: "Dispute match", en: "Match dispute" },
    "platform.approvalTypeMatch": { id: "Verifikasi match", en: "Match verification" },
    "platform.disputeStrip": {
      id: "Skor bertentangan — keputusan admin wajib dengan catatan audit.",
      en: "Conflicting scores — decision required with audit note.",
    },
    "platform.decisionLabel": { id: "Keputusan admin", en: "Admin decision" },
    "platform.rejectMatchData": { id: "Tolak match — data tidak valid", en: "Reject match — invalid data" },
    "platform.matchContext": { id: "Konteks match", en: "Match context" },
    "platform.resolveApproveBtn": { id: "✓ Terapkan keputusan", en: "✓ Apply decision" },
    "platform.approveGeneric": { id: "✓ Setujui", en: "✓ Approve" },
    "platform.rejectMatchBtn": { id: "✕ Tolak match", en: "✕ Reject match" },
    "platform.noReviewItem": {
      id: "Pilih item dari antrian untuk direview.",
      en: "Select an item from the queue to review.",
    },
    "platform.approvedGeneric": { id: "Pengajuan disetujui ✓", en: "Request approved ✓" },
    "platform.approvedGenericDesc": {
      id: "Keputusan tercatat di audit log.",
      en: "Decision recorded in audit log.",
    },
    "platform.rejectedTitle": { id: "Pengajuan ditolak", en: "Request rejected" },
    "platform.rejectedDesc": {
      id: "Alasan dikirim ke pengaju · tercatat di audit.",
      en: "Reason sent to submitter · logged to audit.",
    },
    "platform.disputeResolvedDesc": {
      id: "Keputusan diterapkan · rank diperbarui · audit tercatat.",
      en: "Decision applied · ranks updated · audit logged.",
    },
    "platform.backMatchesBtn": {
      id: "← Kembali ke antrian Match",
      en: "← Back to Matches queue",
    },
    "platform.globalBadge": { id: "Global", en: "Global" },
    "platform.globalTierLabel": { id: "Tier (Global Points)", en: "Tier (Global Points)" },
    "platform.globalSeedingHint": {
      id: "Seeding dari Global rank · K-factor 64 · hasil → Global rank",
      en: "Seeding from Global rank · K-factor 64 · results → Global rank",
    },
    "platform.globalCrossCommunityHint": {
      id: "Lintas komunitas — peserta dari semua klub terdaftar · rank Global.",
      en: "Cross-community — entrants from all registered clubs · Global rank.",
    },
    "platform.globalRegSub": {
      id: "Peserta lintas komunitas — Senayan, Kemang, BSD, Bandung…",
      en: "Cross-community entrants — Senayan, Kemang, BSD, Bandung…",
    },
    "platform.globalLiveStartBtn": { id: "Mulai Global Live →", en: "Start Global Live →" },
  };

  function t(key, lang) {
    const entry = strings[key];
    if (!entry) return key;
    const l = lang || getLang();
    return entry[l] || entry.id || key;
  }

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || "en";
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    apply(lang);
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
    window.dispatchEvent(new CustomEvent("mp:lang", { detail: { lang } }));
  }

  function apply(lang) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const val = t(key, lang);
      if (val) el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      el.placeholder = t(key, lang);
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      el.title = t(el.dataset.i18nTitle, lang);
    });
  }

  function screenTitleKey(screenId) {
    return "title." + screenId;
  }

  return { strings, t, getLang, setLang, apply, screenTitleKey };
})();
