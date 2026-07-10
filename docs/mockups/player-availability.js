/* Match Point — player availability / OOT (ILTL-style) */
window.MP_PlayerAvailability = (function () {
  const t = (k) => (window.MP_I18N ? MP_I18N.t(k) : k);
  const STORAGE_KEY = "mp-availability";

  const STATUSES = ["available", "busy", "oot"];

  function get() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {
      /* no-op */
    }
    return { status: "available", returnDate: "" };
  }

  function set(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_) {
      /* no-op */
    }
    applyDOM();
  }

  function statusLabel(status) {
    if (status === "busy") return t("avail.busy");
    if (status === "oot") return t("avail.oot");
    return t("avail.available");
  }

  function chipHTML(status) {
    const cls =
      status === "oot" ? "badge-pending" : status === "busy" ? "badge-info" : "badge-success";
    return '<span class="badge ' + cls + '" data-avail-chip>' + statusLabel(status) + "</span>";
  }

  function renderForm(root) {
    if (!root) return;
    const cur = get();
    root.innerHTML =
      '<div class="card">' +
      '<p class="section-sub mb-2">' +
      t("avail.sub") +
      "</p>" +
      '<div class="mp-avail-options">' +
      STATUSES.map(
        (s) =>
          '<label class="mp-avail-option' +
          (cur.status === s ? " is-selected" : "") +
          '">' +
          '<input type="radio" name="mp-avail" value="' +
          s +
          '"' +
          (cur.status === s ? " checked" : "") +
          " />" +
          "<span>" +
          statusLabel(s) +
          "</span></label>",
      ).join("") +
      "</div>" +
      '<div class="form-group mt-2" data-avail-return-wrap' +
      (cur.status !== "oot" ? ' hidden' : "") +
      ">" +
      '<label class="form-label">' +
      t("avail.returnDate") +
      '</label><input class="form-input" type="date" data-avail-return value="' +
      (cur.returnDate || "2026-07-20") +
      '" /></div>' +
      '<button type="button" class="btn btn-primary btn-block mt-2" data-avail-save>' +
      t("avail.save") +
      "</button>" +
      "</div>";
  }

  function applyDOM() {
    const cur = get();
    document.querySelectorAll("[data-player-availability]").forEach(renderForm);
    document.querySelectorAll("[data-avail-display]").forEach((el) => {
      el.innerHTML = chipHTML(cur.status);
    });
    document.querySelectorAll("[data-hide-if-oot]").forEach((el) => {
      el.hidden = cur.status === "oot";
    });
  }

  function init() {
    applyDOM();
    document.body.addEventListener("change", (e) => {
      if (e.target.name === "mp-avail") {
        const wrap = e.target.closest("[data-player-availability]");
        const returnWrap = wrap && wrap.querySelector("[data-avail-return-wrap]");
        if (returnWrap) returnWrap.hidden = e.target.value !== "oot";
      }
    });
    document.body.addEventListener("click", (e) => {
      if (e.target.closest("[data-avail-save]")) {
        const form = e.target.closest("[data-player-availability]");
        if (!form) return;
        const status =
          form.querySelector('input[name="mp-avail"]:checked')?.value || "available";
        const returnDate = form.querySelector("[data-avail-return]")?.value || "";
        set({ status, returnDate });
      }
    });
    window.addEventListener("mp:lang", applyDOM);
  }

  return { get, set, statusLabel, chipHTML, renderForm, applyDOM, init };
})();
