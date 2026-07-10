/* Match Point — court booking teaser (Phase 4 roadmap; no payments) */
window.MP_Booking = (function () {
  const t = (k) => (window.MP_I18N ? MP_I18N.t(k) : k);
  const STORAGE_KEY = "mp-booking";

  const COURTS = ["Court 1", "Court 2", "Court 3"];
  const TIMES = ["07:00", "08:00", "09:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
  const TAKEN = { "Court 1": ["08:00", "18:00"], "Court 2": ["07:00", "19:00"], "Court 3": ["17:00"] };

  function getSelection() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
    } catch (_) {
      return null;
    }
  }

  function setSelection(sel) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sel));
    } catch (_) {
      /* no-op */
    }
  }

  function phaseBannerHTML() {
    return (
      '<div class="mp-phase-banner mb-2" data-i18n="booking.phaseBanner">' +
      t("booking.phaseBanner") +
      "</div>"
    );
  }

  function renderRoadmap(root) {
    if (!root) return;
    root.innerHTML =
      phaseBannerHTML() +
      '<h2 class="section-title" data-i18n="booking.roadmapTitle">' +
      t("booking.roadmapTitle") +
      "</h2>" +
      '<p class="section-sub" data-i18n="booking.roadmapSub">' +
      t("booking.roadmapSub") +
      "</p>" +
      '<ul class="docs-list text-left mb-2">' +
      "<li data-i18n=\"booking.roadmapItem1\">" +
      t("booking.roadmapItem1") +
      "</li>" +
      "<li data-i18n=\"booking.roadmapItem2\">" +
      t("booking.roadmapItem2") +
      "</li>" +
      "<li data-i18n=\"booking.roadmapItem3\">" +
      t("booking.roadmapItem3") +
      "</li>" +
      "<li data-i18n=\"booking.roadmapItem4\">" +
      t("booking.roadmapItem4") +
      "</li></ul>" +
      '<div class="btn-stack">' +
      '<button type="button" class="btn btn-primary btn-block" data-flow-goto="33">' +
      t("booking.findMabar") +
      " →</button>" +
      '<button type="button" class="btn btn-outline btn-block" data-flow-goto="10">' +
      t("booking.browseEvents") +
      " →</button></div>";
  }

  function renderSlots(root) {
    if (!root) return;
    const sel = getSelection();
    root.innerHTML =
      phaseBannerHTML() +
      COURTS.map(
        (court) =>
          '<div style="margin-bottom:1rem">' +
          '<strong style="font-size:0.82rem;display:block;margin-bottom:0.4rem">' +
          court +
          "</strong>" +
          '<div class="mp-slot-grid">' +
          TIMES.map((time) => {
            const taken = (TAKEN[court] || []).includes(time);
            const selected = sel && sel.court === court && sel.time === time;
            return (
              '<button type="button" class="mp-slot' +
              (taken ? " is-taken" : "") +
              (selected ? " is-selected" : "") +
              '"' +
              (taken ? " disabled" : ' data-slot-court="' + court + '" data-slot-time="' + time + '"') +
              ">" +
              time +
              "</button>"
            );
          }).join("") +
          "</div></div>",
      ).join("");
  }

  function renderSummary(root) {
    if (!root) return;
    const sel = getSelection() || { court: "Court 2", time: "18:00" };
    root.innerHTML =
      phaseBannerHTML() +
      '<div class="mp-pulse-card" style="cursor:default">' +
      '<div class="mp-pulse-main">' +
      "<strong>" +
      sel.court +
      " · Senayan Padel Club</strong>" +
      "<small>" +
      t("booking.date") +
      ": Sabtu / Saturday · " +
      t("booking.time") +
      ": " +
      sel.time +
      "</small>" +
      "</div>" +
      '<span class="mp-pulse-meta">Rp 250k</span>' +
      "</div>" +
      '<div class="btn-stack mt-2">' +
      '<button type="button" class="btn btn-primary btn-block" data-flow-goto="33">' +
      t("booking.findMabar") +
      " →</button>" +
      '<button type="button" class="btn btn-outline btn-block" data-flow-goto="10">' +
      t("booking.browseEvents") +
      " →</button></div>";
  }

  function applyDOM() {
    document.querySelectorAll("[data-booking-slots]").forEach(renderSlots);
    document.querySelectorAll("[data-booking-summary]").forEach(renderSummary);
    document.querySelectorAll("[data-booking-roadmap]").forEach(renderRoadmap);
  }

  function init() {
    applyDOM();
    document.body.addEventListener("click", (e) => {
      const slot = e.target.closest("[data-slot-court]");
      if (!slot) return;
      setSelection({ court: slot.dataset.slotCourt, time: slot.dataset.slotTime });
      applyDOM();
    });
    window.addEventListener("mp:lang", applyDOM);
  }

  return { getSelection, renderSlots, renderSummary, renderRoadmap, applyDOM, init };
})();
