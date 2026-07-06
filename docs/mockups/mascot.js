/* Match Point mascot — Rally (SVG + CSS animation) */
window.MP_Mascot = (function () {
  const BASE = "assets/mascot/rally.svg";

  function resolvePath() {
    if (location.pathname.includes("/flow/")) return "../" + BASE;
    return BASE;
  }

  function mount(el, opts) {
    if (!el) return;
    opts = opts || {};
    const mood = opts.mood || "idle";
    const size = opts.size || "md";
    el.className = "mp-mascot mp-mascot-" + size + " mp-mascot-" + mood;
    el.innerHTML =
      '<img src="' +
      resolvePath() +
      '" alt="Rally" class="mp-mascot-img" width="120" height="120" />' +
      (opts.speech
        ? '<div class="mp-mascot-speech">' + opts.speech + "</div>"
        : "");
  }

  function initAll() {
    document.querySelectorAll("[data-mascot]").forEach((el) => {
      mount(el, {
        mood: el.dataset.mascotMood || "idle",
        size: el.dataset.mascotSize || "md",
        speech: el.dataset.mascotSpeech || "",
      });
    });
  }

  function init() {
    initAll();
    window.addEventListener("mp:lang", initAll);
  }

  return { init, mount };
})();
