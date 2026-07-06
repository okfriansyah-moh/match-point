/* Match Point mascots — Pipo (padel), Tenni (tennis), Dink (pickleball) */
window.MP_Mascot = (function () {
  const SPORTS = ["padel", "tennis", "pickleball"];

  const MASCOTS = {
    padel: {
      file: "pipo-padel.svg",
      nameKey: "mascot.pipo.name",
      taglineKey: "mascot.pipo.tagline",
    },
    tennis: {
      file: "tenni-tennis.svg",
      nameKey: "mascot.tenni.name",
      taglineKey: "mascot.tenni.tagline",
    },
    pickleball: {
      file: "dink-pickleball.svg",
      nameKey: "mascot.dink.name",
      taglineKey: "mascot.dink.tagline",
    },
    rally: {
      file: "rally.svg",
      nameKey: "mascot.rally.name",
      taglineKey: "mascot.rally.tagline",
    },
  };

  function t(key) {
    return window.MP_I18N ? MP_I18N.t(key) : key;
  }

  function resolvePath(file) {
    const rel = "assets/mascot/" + file;
    const script = document.querySelector('script[src*="mascot.js"]');
    if (script && script.src) {
      return new URL(rel, script.src).href;
    }
    if (location.pathname.includes("/flow/")) return "../" + rel;
    return rel;
  }

  function resolveSport(el) {
    const mode = el.dataset.mascotSport || "padel";
    if (mode === "auto" && window.MP_Sport) return MP_Sport.get();
    if (SPORTS.includes(mode) || mode === "rally") return mode;
    return "padel";
  }

  function meta(sport) {
    return MASCOTS[sport] || MASCOTS.padel;
  }

  function mount(el, opts) {
    if (!el) return;
    opts = opts || {};
    const sport = opts.sport || resolveSport(el);
    const m = meta(sport);
    const mood = opts.mood || el.dataset.mascotMood || "idle";
    const size = opts.size || el.dataset.mascotSize || "md";
    const showName = opts.showName || el.hasAttribute("data-mascot-show-name");

    el.className =
      "mp-mascot mp-mascot-" +
      size +
      " mp-mascot-" +
      mood +
      " mp-mascot-sport-" +
      sport;
    el.dataset.mascotSport = sport;

    const name = t(m.nameKey);
    const tagline = t(m.taglineKey);
    el.innerHTML =
      '<img src="' +
      resolvePath(m.file) +
      '" alt="' +
      name +
      '" class="mp-mascot-img" width="120" height="120" />' +
      (showName
        ? '<div class="mp-mascot-label"><span class="mp-mascot-name">' +
          name +
          '</span><span class="mp-mascot-tagline">' +
          tagline +
          "</span></div>"
        : "") +
      (opts.speech
        ? '<div class="mp-mascot-speech">' + opts.speech + "</div>"
        : "");
  }

  function mountTrio(el) {
    if (!el) return;
    const size = el.dataset.mascotSize || "md";
    const mood = el.dataset.mascotMood || "idle";
    el.className = "mp-mascot-trio mp-mascot-trio-" + size;
    el.innerHTML = SPORTS.map(function (sport) {
      const m = meta(sport);
      const name = t(m.nameKey);
      const tagline = t(m.taglineKey);
      return (
        '<div class="mp-mascot-card mp-mascot-' +
        mood +
        " mp-mascot-sport-" +
        sport +
        '">' +
        '<img src="' +
        resolvePath(m.file) +
        '" alt="' +
        name +
        '" class="mp-mascot-img" width="120" height="120" />' +
        '<div class="mp-mascot-label"><span class="mp-mascot-name">' +
        name +
        '</span><span class="mp-mascot-tagline">' +
        tagline +
        "</span></div></div>"
      );
    }).join("");
  }

  function initAll() {
    document.querySelectorAll("[data-mascot-trio]").forEach(mountTrio);
    document.querySelectorAll("[data-mascot]").forEach(function (el) {
      mount(el, {
        mood: el.dataset.mascotMood,
        size: el.dataset.mascotSize,
        speech: el.dataset.mascotSpeech || "",
        showName: el.hasAttribute("data-mascot-show-name"),
      });
    });
  }

  function refreshAuto() {
    document.querySelectorAll('[data-mascot-sport="auto"]').forEach(function (el) {
      mount(el);
    });
  }

  function init() {
    initAll();
    window.addEventListener("mp:lang", initAll);
    window.addEventListener("mp:sport", refreshAuto);
  }

  return { init, initAll, mount, mountTrio, sports: SPORTS, mascots: MASCOTS };
})();
