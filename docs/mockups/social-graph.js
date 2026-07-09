/* Match Point — social graph (friends, follows, suggestions) mockup */
window.MP_SocialGraph = (function () {
  const t = (k) => (window.MP_I18N ? MP_I18N.t(k) : k);
  const lang = () => (window.MP_I18N ? MP_I18N.getLang() : "en");
  const L = (o) => (o ? o[lang()] || o.en : "");

  const FRIENDS = [
    {
      name: "Sari Wijaya",
      avatar: "👩🏻",
      sport: "padel",
      note: { id: "Main bareng 12×", en: "Played together 12×" },
      online: true,
    },
    {
      name: "Andi Pratama",
      avatar: "🧔🏽",
      sport: "tennis",
      note: { id: "Senayan Padel Club", en: "Senayan Padel Club" },
      online: true,
    },
    {
      name: "Maya Putri",
      avatar: "👩🏽",
      sport: "pickleball",
      note: { id: "Main bareng 5×", en: "Played together 5×" },
      online: false,
    },
    {
      name: "Rizky Ramadhan",
      avatar: "🧑🏻",
      sport: "padel",
      note: { id: "BSD Padel House", en: "BSD Padel House" },
      online: false,
    },
    {
      name: "Dewi Lestari",
      avatar: "👩🏼",
      sport: "badminton",
      note: { id: "Kemang Tennis Society", en: "Kemang Tennis Society" },
      online: true,
    },
  ];

  const SUGGESTED = [
    {
      name: "Fajar Nugroho",
      avatar: "🧑🏾",
      sport: "padel",
      note: { id: "3 teman bersama", en: "3 mutual friends" },
    },
    {
      name: "Linda Halim",
      avatar: "👩🏻‍🦱",
      sport: "tennis",
      note: { id: "Komunitas yang sama", en: "Same community" },
    },
    {
      name: "Yoga Saputra",
      avatar: "👨🏽",
      sport: "table_tennis",
      note: { id: "Sering main di Senayan", en: "Plays at Senayan often" },
    },
  ];

  function rowHTML(p, suggested) {
    const action = suggested
      ? '<button type="button" class="btn btn-outline btn-sm" data-toggle-active data-follow-btn>' +
        t("social.follow") +
        "</button>"
      : '<span class="mp-msg-time">' + (p.online ? t("messages.online") : "") + "</span>";
    return (
      '<div class="mp-msg-row" role="listitem">' +
      '<span class="avatar avatar-photo">' + p.avatar + "</span>" +
      '<div class="mp-msg-row-main"><strong>' +
      p.name +
      "</strong><small>" +
      (window.MP_Sport ? MP_Sport.label(p.sport) : p.sport) +
      " · " +
      L(p.note) +
      "</small></div>" +
      action +
      "</div>"
    );
  }

  function renderFriends(root) {
    if (!root) return;
    root.innerHTML = FRIENDS.map((p) => rowHTML(p, false)).join("");
  }

  function renderSuggested(root) {
    if (!root) return;
    root.innerHTML = SUGGESTED.map((p) => rowHTML(p, true)).join("");
  }

  function applyDOM() {
    document.querySelectorAll("[data-friends-list]").forEach(renderFriends);
    document.querySelectorAll("[data-friends-suggested]").forEach(renderSuggested);
  }

  function init() {
    applyDOM();
    window.addEventListener("mp:lang", applyDOM);
  }

  return { FRIENDS, SUGGESTED, renderFriends, renderSuggested, applyDOM, init };
})();
