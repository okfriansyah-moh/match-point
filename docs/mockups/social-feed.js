/* Match Point — shared social feed renderer (mockup)
   One data source, four surfaces: social-feed (member), social-feed-guest
   (read-only preview), community-detail feed, platform moderation inbox.
   Modes: "member" | "guest" — guest sees public posts only, actions soft-gate
   to login via data-guest-login (flow.js delegated handler). */
window.MP_SocialFeed = (function () {
  const t = (k) => (window.MP_I18N ? MP_I18N.t(k) : k);
  const lang = () => (window.MP_I18N ? MP_I18N.getLang() : "en");
  const L = (o) => (o ? o[lang()] || o.en : "");

  const svg = (body) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    body +
    "</svg>";
  const ICONS = {
    like: svg(
      '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    ),
    comment: svg('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'),
    share: svg(
      '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/>',
    ),
    lock: svg(
      '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    ),
  };

  const POSTS = [
    {
      id: "p1",
      author: { name: "Sari Wijaya", avatar: "👩🏻", handle: "@sariwijaya" },
      communityId: "senayan",
      sport: "padel",
      type: "result",
      ts: "2h",
      visibility: "public",
      body: {
        id: "Comeback manis di Americano Night! Dari 0-4 jadi juara grup 🙌",
        en: "Sweet comeback at Americano Night! From 0-4 down to group winner 🙌",
      },
      result: {
        label: { id: "Americano Night · Grup A", en: "Americano Night · Group A" },
        score: "24 – 18",
      },
      likes: 32,
      comments: [
        {
          author: { name: "Budi Santoso", avatar: "🧑🏽" },
          body: { id: "Gila rally terakhirnya! 🔥", en: "That last rally was insane! 🔥" },
        },
        {
          author: { name: "Maya Putri", avatar: "👩🏽" },
          body: { id: "Rematch minggu depan ya", en: "Rematch next week, ok?" },
        },
      ],
    },
    {
      id: "p2",
      author: { name: "Kemang Tennis Society", avatar: "🎾", handle: "@kemangtennis" },
      communityId: "kemang",
      sport: "tennis",
      type: "photo",
      ts: "5h",
      visibility: "public",
      body: {
        id: "Social hit Sabtu pagi — 16 pemain, 3 lapangan, langit cerah.",
        en: "Saturday morning social hit — 16 players, 3 courts, clear skies.",
      },
      media: "📸",
      likes: 54,
      comments: [
        {
          author: { name: "Andi Pratama", avatar: "🧔🏽" },
          body: { id: "Minggu depan ikut!", en: "Count me in next week!" },
        },
      ],
    },
    {
      id: "p3",
      author: { name: "Budi Santoso", avatar: "🧑🏽", handle: "@budisantoso" },
      communityId: "senayan",
      sport: "padel",
      type: "text",
      ts: "8h",
      visibility: "members",
      body: {
        id: "Ada yang mau sparring internal Kamis malam? Court sudah dibooking.",
        en: "Anyone up for internal sparring Thursday night? Court's booked.",
      },
      likes: 12,
      comments: [],
    },
    {
      id: "p4",
      author: { name: "Maya Putri", avatar: "👩🏽", handle: "@mayaputri" },
      communityId: "blokm",
      sport: "pickleball",
      type: "result",
      ts: "1d",
      visibility: "public",
      body: {
        id: "Match pickleball pertamaku — langsung ketagihan!",
        en: "My first pickleball match ever — instantly hooked!",
      },
      result: {
        label: { id: "Open play · Pickle Blok M", en: "Open play · Pickle Blok M" },
        score: "11 – 9 · 11 – 7",
      },
      likes: 21,
      comments: [
        {
          author: { name: "Dewi Lestari", avatar: "👩🏼" },
          body: { id: "Welcome to the club! 🥎", en: "Welcome to the club! 🥎" },
        },
      ],
    },
    {
      id: "p5",
      author: { name: "Rizky Ramadhan", avatar: "🧑🏻", handle: "@rizkyr" },
      communityId: "bsd",
      sport: "padel",
      type: "text",
      ts: "1d",
      visibility: "public",
      flagged: {
        reason: { id: "Spam / promosi berulang", en: "Spam / repeated promo" },
        reports: 4,
      },
      body: {
        id: "JUAL raket murah!! DM sekarang, stok terbatas!!! 🔥🔥🔥",
        en: "SELLING cheap rackets!! DM now, limited stock!!! 🔥🔥🔥",
      },
      likes: 1,
      comments: [],
    },
    {
      id: "p6",
      author: { name: "Dewi Lestari", avatar: "👩🏼", handle: "@dewilestari" },
      communityId: "kemang",
      sport: "badminton",
      type: "photo",
      ts: "2d",
      visibility: "public",
      body: {
        id: "Sesi badminton lintas komunitas pertama — seru banget!",
        en: "First cross-community badminton session — such a blast!",
      },
      media: "🏸",
      likes: 38,
      comments: [
        {
          author: { name: "Sari Wijaya", avatar: "👩🏻" },
          body: { id: "Next time ajak aku!", en: "Invite me next time!" },
        },
      ],
    },
    {
      id: "p7",
      author: { name: "Andi Pratama", avatar: "🧔🏽", handle: "@andipratama" },
      communityId: "senayan",
      sport: "table_tennis",
      type: "text",
      ts: "2d",
      visibility: "public",
      flagged: {
        reason: { id: "Bahasa kasar", en: "Abusive language" },
        reports: 2,
      },
      body: {
        id: "Wasit kemarin parah banget, nggak becus semua!!",
        en: "Yesterday's referee was terrible, completely useless!!",
      },
      likes: 3,
      comments: [],
    },
    {
      id: "p8",
      author: { name: "BSD Padel House", avatar: "🏓", handle: "@bsdpadel" },
      communityId: "bsd",
      sport: "padel",
      type: "text",
      ts: "3d",
      visibility: "members",
      body: {
        id: "League internal musim 3 dibuka — daftar sebelum Jumat.",
        en: "Internal league season 3 is open — register before Friday.",
      },
      likes: 17,
      comments: [],
    },
  ];

  const STORIES = [
    { id: "s1", author: { name: "Sari W.", avatar: "👩🏻" }, public: true, seen: false },
    { id: "s2", author: { name: "Budi S.", avatar: "🧑🏽" }, public: true, seen: false },
    { id: "s3", author: { name: "Kemang TS", avatar: "🎾" }, public: true, seen: true },
    { id: "s4", author: { name: "Maya P.", avatar: "👩🏽" }, public: false, seen: false },
    { id: "s5", author: { name: "Andi P.", avatar: "🧔🏽" }, public: false, seen: true },
  ];

  function communityName(id) {
    if (window.MP_Communities && MP_Communities.COMMUNITIES[id])
      return MP_Communities.COMMUNITIES[id].name;
    return id;
  }

  function sportChip(post) {
    const label = window.MP_Sport ? MP_Sport.label(post.sport) : post.sport;
    return (
      '<span class="mp-feed-sport-chip" style="--sport-color: var(--sport-' +
      post.sport.replace("_", "-") +
      ')">' +
      label +
      "</span>"
    );
  }

  function actionBtn(icon, key, guest, extra) {
    return (
      '<button type="button" class="mp-feed-action"' +
      (guest ? ' data-guest-login aria-label="' + t("social.signInToInteract") + '"' : "") +
      (extra || "") +
      ">" +
      ICONS[icon] +
      "<span>" +
      t("social." + key) +
      "</span></button>"
    );
  }

  function teaserStubHTML(post) {
    return (
      '<article class="mp-feed-post mp-feed-post--guest">' +
      '<div class="mp-feed-post-head">' +
      '<span class="avatar avatar-photo">' + post.author.avatar + "</span>" +
      '<div class="mp-feed-post-who"><strong>' +
      post.author.name +
      "</strong><small>" +
      communityName(post.communityId) +
      " · " +
      post.ts +
      "</small></div>" +
      "</div>" +
      '<div class="mp-feed-post-body">' +
      '<div class="mp-guest-teaser"><div class="mp-guest-teaser-content">' +
      L(post.body) +
      "</div>" +
      '<div class="mp-guest-teaser-overlay">' +
      ICONS.lock +
      "<strong>" + t("social.membersOnly") + "</strong>" +
      "<small>" + t("social.membersOnlyDesc") + "</small>" +
      '<button type="button" class="btn btn-primary btn-sm" data-guest-login>' +
      t("social.joinToSee") +
      "</button></div></div></div></article>"
    );
  }

  function postHTML(post, mode) {
    const guest = mode === "guest";
    if (guest && post.visibility === "members") return teaserStubHTML(post);

    let inner =
      '<div class="mp-feed-post-head">' +
      '<span class="avatar avatar-photo">' + post.author.avatar + "</span>" +
      '<div class="mp-feed-post-who"><strong>' +
      post.author.name +
      "</strong><small>" +
      communityName(post.communityId) +
      " · " +
      post.ts +
      " " +
      sportChip(post) +
      "</small></div>" +
      "</div>";

    inner += '<div class="mp-feed-post-body">' + L(post.body) + "</div>";
    if (post.media)
      inner +=
        '<div class="mp-feed-post-media" aria-hidden="true">' + post.media + "</div>";
    if (post.result)
      inner +=
        '<div class="mp-feed-result"><span>' +
        L(post.result.label) +
        "</span><b>" +
        post.result.score +
        "</b></div>";

    // Facebook-style engagement row — counts above the action bar make the
    // divider between content and actions read clearly.
    const commentCount = (post.comments || []).length;
    if (post.likes || commentCount) {
      inner += '<div class="mp-feed-post-meta">';
      if (post.likes)
        inner +=
          '<span class="mp-feed-post-meta-likes">' +
          ICONS.like +
          '<b data-like-count="' + post.id + '">' + post.likes + "</b></span>";
      if (commentCount)
        inner +=
          '<button type="button" class="mp-feed-post-meta-comments"' +
          (guest ? " data-guest-login" : ' data-goto-post="' + post.id + '"') +
          ">" +
          commentCount +
          " " +
          t(commentCount === 1 ? "social.oneComment" : "social.commentsCount") +
          "</button>";
      inner += "</div>";
    }

    inner +=
      '<div class="mp-feed-post-actions">' +
      actionBtn("like", "like", guest, ' data-like="' + post.id + '"') +
      actionBtn(
        "comment",
        "comment",
        guest,
        ' data-goto-post="' + post.id + '"',
      ) +
      actionBtn("share", "share", guest) +
      "</div>";

    return (
      '<article class="mp-feed-post' +
      (guest ? " mp-feed-post--guest" : "") +
      '" data-post-id="' +
      post.id +
      '">' +
      inner +
      "</article>"
    );
  }

  function visiblePosts(opts) {
    let list = POSTS.filter((p) => !p.flagged || opts.mode !== "guest");
    if (opts.communityId)
      list = list.filter((p) => p.communityId === opts.communityId);
    if (opts.mode === "guest")
      list = list.filter((p) => p.visibility === "public" || p.visibility === "members");
    if (opts.limit) list = list.slice(0, opts.limit);
    return list;
  }

  function renderFeed(root, opts) {
    if (!root) return;
    opts = opts || {};
    const mode = opts.mode || "member";
    let html = "";
    if (opts.composer && mode === "member") {
      html +=
        '<div class="mp-feed-composer" data-goto-compose>' +
        '<span class="avatar avatar-photo">🧑🏽</span>' +
        '<span class="mp-feed-composer-hint">' +
        t("social.composerHint") +
        "</span></div>";
    }
    html += visiblePosts({ ...opts, mode }).map((p) => postHTML(p, mode)).join("");
    if (mode === "guest") {
      html +=
        '<div class="mp-feed-post mp-feed-post--guest" style="padding:1rem;text-align:center">' +
        "<strong>" + t("social.joinToSee") + "</strong><br>" +
        '<button type="button" class="btn btn-primary btn-sm" style="margin-top:0.6rem" data-guest-login>' +
        t("guest.signupFree") +
        "</button></div>";
    }
    root.innerHTML = '<div class="mp-feed">' + html + "</div>";
  }

  function renderStories(root, opts) {
    if (!root) return;
    opts = opts || {};
    const guest = opts.mode === "guest";
    let items = "";
    if (!guest) {
      items +=
        '<button type="button" class="mp-story" data-goto-compose>' +
        '<span class="mp-story-ring is-seen"><span class="avatar avatar-photo">➕</span></span>' +
        "<span>" + t("social.yourStory") + "</span></button>";
    }
    STORIES.forEach((s) => {
      if (guest && !s.public) return;
      items +=
        '<button type="button" class="mp-story">' +
        '<span class="mp-story-ring' + (s.seen ? " is-seen" : "") + '">' +
        '<span class="avatar avatar-photo">' + s.author.avatar + "</span></span>" +
        "<span>" + s.author.name + "</span></button>";
    });
    if (guest) {
      items +=
        '<button type="button" class="mp-story" data-guest-login>' +
        '<span class="mp-story-ring is-locked"><span class="avatar avatar-photo">🔒</span></span>' +
        "<span>" + t("social.joinToSee") + "</span></button>";
    }
    root.innerHTML = '<div class="mp-story-rail">' + items + "</div>";
  }

  function renderComments(root, postId) {
    if (!root) return;
    const post = POSTS.find((p) => p.id === postId) || POSTS[0];
    root.innerHTML = post.comments
      .map(
        (c) =>
          '<div class="mp-feed-comment">' +
          '<span class="avatar avatar-photo">' + c.author.avatar + "</span>" +
          '<div class="mp-feed-comment-bubble"><strong>' +
          c.author.name +
          "</strong>" +
          L(c.body) +
          "</div></div>",
      )
      .join("");
  }

  function flaggedPosts() {
    return POSTS.filter((p) => p.flagged);
  }

  function applyDOM(ctx) {
    const guest = !!(ctx && ctx.guest);
    document.querySelectorAll("[data-social-feed]").forEach((root) => {
      const declared = root.dataset.feedMode || "auto";
      const mode = declared === "auto" ? (guest ? "guest" : "member") : declared;
      renderFeed(root, {
        mode,
        communityId: root.dataset.feedCommunity || "",
        limit: parseInt(root.dataset.feedLimit || "0", 10) || 0,
        composer: root.hasAttribute("data-feed-composer"),
      });
    });
    document.querySelectorAll("[data-social-stories]").forEach((root) => {
      const declared = root.dataset.storiesMode || "auto";
      renderStories(root, {
        mode: declared === "auto" ? (guest ? "guest" : "member") : declared,
      });
    });
    document.querySelectorAll("[data-social-comments]").forEach((root) => {
      renderComments(root, root.dataset.socialComments);
    });
  }

  function init() {
    applyDOM({ guest: document.body.classList.contains("mp-guest") });
    window.addEventListener("mp:lang", () =>
      applyDOM({ guest: document.body.classList.contains("mp-guest") }),
    );
  }

  return {
    POSTS,
    STORIES,
    renderFeed,
    renderStories,
    renderComments,
    flaggedPosts,
    applyDOM,
    init,
  };
})();
