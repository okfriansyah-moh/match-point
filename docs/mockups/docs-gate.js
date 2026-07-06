/* Match Point — password gate for restricted strategy docs (static mockup) */
window.MP_DocsGate = (function () {
  const STORAGE_KEY = "mp-global-docs-unlock";
  const PASS_HASH = "e60ab33577457b131a39168955250b0fb9c1b404de3c94529ab9ba9428b88464";

  function t(key, fallback) {
    return window.MP_I18N ? MP_I18N.t(key) : fallback;
  }

  async function sha256(text) {
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(text),
    );
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function isUnlocked() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === PASS_HASH;
    } catch (_) {
      return false;
    }
  }

  function unlock() {
    try {
      sessionStorage.setItem(STORAGE_KEY, PASS_HASH);
    } catch (_) {
      /* no-op */
    }
  }

  function buildGate() {
    const gate = document.createElement("div");
    gate.className = "docs-gate-overlay";
    gate.id = "docs-gate";
    gate.innerHTML =
      '<div class="docs-gate-card card">' +
      '<div class="docs-gate-icon">🔒</div>' +
      '<h2 data-i18n="global.gateTitle">Restricted document</h2>' +
      '<p data-i18n="global.gateDesc">Global readiness &amp; strategy — enter the team password to continue.</p>' +
      '<form class="docs-gate-form" id="docs-gate-form">' +
      '<label class="form-label" for="docs-gate-password" data-i18n="global.gateLabel">Password</label>' +
      '<input type="password" id="docs-gate-password" class="form-input" autocomplete="current-password" required />' +
      '<p class="form-error docs-gate-error" id="docs-gate-error" hidden data-i18n="global.gateError">Incorrect password. Try again.</p>' +
      '<button type="submit" class="btn btn-primary btn-block" data-i18n="global.gateSubmit">Unlock document</button>' +
      "</form>" +
      '<a href="index.html" class="docs-gate-back" data-i18n="global.gateBack">← Back to hub</a>' +
      "</div>";
    return gate;
  }

  function showContent() {
    document.getElementById("docs-gate")?.remove();
    document.body.classList.remove("docs-locked");
    const shell = document.querySelector(".docs-shell");
    if (shell) shell.hidden = false;
  }

  function hideContent() {
    document.body.classList.add("docs-locked");
    const shell = document.querySelector(".docs-shell");
    if (shell) shell.hidden = true;
    if (!document.getElementById("docs-gate")) {
      document.body.appendChild(buildGate());
      if (window.MP_I18N) MP_I18N.apply(MP_I18N.getLang());
    }
    document.getElementById("docs-gate-form")?.addEventListener("submit", onSubmit);
  }

  async function onSubmit(e) {
    e.preventDefault();
    const input = document.getElementById("docs-gate-password");
    const err = document.getElementById("docs-gate-error");
    const pw = input ? input.value : "";
    const hash = await sha256(pw);
    if (hash === PASS_HASH) {
      unlock();
      if (err) err.hidden = true;
      showContent();
      window.MP_Mascot?.initAll?.() || window.MP_Mascot?.init?.();
      window.MP_Feedback?.init?.();
      return;
    }
    if (err) err.hidden = false;
    if (input) {
      input.value = "";
      input.focus();
    }
  }

  function init() {
    if (isUnlocked()) {
      showContent();
      return;
    }
    hideContent();
  }

  return { init, isUnlocked };
})();
