/* Match Point — light/dark theme, persisted */
window.MP_Theme = (function () {
  const STORAGE_KEY = "mp-theme";

  function get() {
    return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  }

  function apply(theme) {
    document.body.classList.toggle("mp-dark", theme === "dark");
    localStorage.setItem(STORAGE_KEY, theme);
    document.querySelectorAll("[data-theme-icon]").forEach((el) => {
      el.textContent = theme === "dark" ? "☀️" : "🌙";
    });
    document.querySelectorAll("[data-theme-label]").forEach((el) => {
      el.dataset.i18n = theme === "dark" ? "theme.toLight" : "theme.toDark";
      if (window.MP_I18N)
        el.textContent = MP_I18N.t(el.dataset.i18n, MP_I18N.getLang());
    });
    window.dispatchEvent(new CustomEvent("mp:theme", { detail: { theme } }));
  }

  function toggle() {
    apply(get() === "dark" ? "light" : "dark");
  }

  function init() {
    apply(get());
  }

  return { init, apply, toggle, get };
})();

/* Match Point — device preview modes: mobile | tablet | desktop (web) */
window.MP_Device = (function () {
  const STORAGE_KEY = "mp-device";
  const PICKED_KEY = "mp-device-picked";
  const MODES = ["mobile", "tablet", "desktop"];

  function detectDefault() {
    if (window.innerWidth < 640) return "mobile";
    if (window.innerWidth < 1024) return "tablet";
    return "desktop";
  }

  function markPicked() {
    localStorage.setItem(PICKED_KEY, "1");
  }

  function userPickedMode() {
    return localStorage.getItem(PICKED_KEY) === "1";
  }

  function resolveInitialMode() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const validSaved = saved && MODES.includes(saved) ? saved : null;
    if (!userPickedMode() && window.innerWidth >= 1024) return "desktop";
    return validSaved || detectDefault();
  }

  function apply(mode) {
    if (!MODES.includes(mode)) mode = "desktop";
    document.body.classList.remove(
      "mp-device-mobile",
      "mp-device-tablet",
      "mp-device-desktop",
    );
    document.body.classList.add("mp-device-" + mode);
    localStorage.setItem(STORAGE_KEY, mode);

    document.querySelectorAll(".device-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.device === mode);
    });

    document.querySelectorAll("[data-device-label]").forEach((el) => {
      const labels = { mobile: "Phone", tablet: "Tablet", desktop: "Web" };
      el.textContent = labels[mode] || mode;
    });

    window.dispatchEvent(new CustomEvent("mp:device", { detail: { mode } }));
  }

  function ensureDeviceBar() {
    if (document.getElementById("mp-device-bar")) return;
    if (!document.querySelector(".flow-app, .proto-viewport")) return;

    const bar = document.createElement("nav");
    bar.id = "mp-device-bar";
    bar.className = "mp-device-bar";
    bar.setAttribute("aria-label", "Device preview");
    bar.innerHTML =
      '<span class="mp-device-bar-label">View</span>' +
      '<div class="device-toggle device-toggle-compact">' +
      '<button type="button" class="device-btn" data-device="mobile" title="Phone preview">📱</button>' +
      '<button type="button" class="device-btn" data-device="tablet" title="Tablet preview">📋</button>' +
      '<button type="button" class="device-btn" data-device="desktop" title="Web — full screen">🖥</button>' +
      "</div>";

    document.body.appendChild(bar);
  }

  function bindDeviceButtons() {
    document.querySelectorAll(".device-btn").forEach((btn) => {
      if (btn.dataset.mpDeviceBound) return;
      btn.dataset.mpDeviceBound = "1";
      btn.addEventListener("click", () => {
        markPicked();
        apply(btn.dataset.device);
      });
    });
  }

  function init() {
    if (window.MP_Theme) MP_Theme.init();
    ensureDeviceBar();
    apply(resolveInitialMode());
    bindDeviceButtons();
    if (window.MP_Feedback) MP_Feedback.init();

    window.addEventListener("resize", () => {
      if (userPickedMode()) return;
      apply(window.innerWidth >= 1024 ? "desktop" : detectDefault());
    });
  }

  return {
    init,
    apply,
    get: () => localStorage.getItem(STORAGE_KEY) || detectDefault(),
  };
})();
