/* Match Point — player challenge flow (ILTL-style) */
window.MP_PlayerChallenge = (function () {
  const t = (k) => (window.MP_I18N ? MP_I18N.t(k) : k);
  const STORAGE_KEY = "mp-challenges";
  const PREFILL_KEY = "mp-challenge-prefill";

  const INBOX = [
    {
      id: "c1",
      from: "Rudi Hartono",
      to: "Budi Santoso",
      status: "pending",
      when: { id: "Sabtu 08:00", en: "Sat 08:00" },
      venue: "Senayan Padel Club",
      dir: "in",
    },
    {
      id: "c2",
      from: "Budi Santoso",
      to: "Sari Dewi",
      status: "accepted",
      when: { id: "Minggu 10:00", en: "Sun 10:00" },
      venue: "Kemang Courts",
      dir: "out",
    },
  ];

  let targetName = "Rudi Hartono";

  function pendingCount() {
    return INBOX.filter((c) => c.status === "pending" && c.dir === "in").length;
  }

  function setTarget(name) {
    targetName = name || targetName;
    try {
      sessionStorage.setItem(PREFILL_KEY, JSON.stringify({ opponent: targetName }));
    } catch (_) {
      /* no-op */
    }
    applyDOM();
  }

  function getPrefill() {
    try {
      return JSON.parse(sessionStorage.getItem(PREFILL_KEY) || "null");
    } catch (_) {
      return null;
    }
  }

  function renderIssue(root) {
    if (!root) return;
    const pre = getPrefill();
    const opponent = (pre && pre.opponent) || targetName;
    root.innerHTML =
      '<div class="card mb-2">' +
      '<p class="section-sub">' +
      t("challenge.issueSub") +
      "</p>" +
      '<div class="form-group"><label class="form-label">' +
      t("challenge.opponent") +
      '</label><input class="form-input" value="' +
      opponent +
      '" readonly /></div>' +
      '<div class="form-group"><label class="form-label">' +
      t("challenge.proposedTime") +
      '</label><input class="form-input" type="text" value="Sabtu 08:00" /></div>' +
      '<div class="form-group"><label class="form-label">' +
      t("challenge.venue") +
      '</label><input class="form-input" value="Senayan Padel Club" /></div>' +
      '<p class="form-hint">' +
      t("challenge.eligibilityHint") +
      "</p>" +
      '<button type="button" class="btn btn-primary btn-block btn-lg" data-challenge-sent data-flow-goto="37">' +
      t("challenge.send") +
      "</button>" +
      "</div>";
  }

  function rowHTML(c) {
    const statusBadge =
      c.status === "pending"
        ? '<span class="badge badge-pending">' + t("challenge.statusPending") + "</span>"
        : c.status === "accepted"
          ? '<span class="badge badge-success">' + t("challenge.statusAccepted") + "</span>"
          : '<span class="badge badge-danger">' + t("challenge.statusDeclined") + "</span>";
    const actions =
      c.status === "pending" && c.dir === "in"
        ? '<div class="btn-row mt-1">' +
          '<button type="button" class="btn btn-primary btn-sm" data-challenge-accept data-flow-goto="4">' +
          t("challenge.accept") +
          "</button>" +
          '<button type="button" class="btn btn-outline btn-sm">' +
          t("challenge.decline") +
          "</button></div>"
        : c.status === "accepted"
          ? '<button type="button" class="btn btn-outline btn-sm btn-block mt-1" data-flow-goto="4">' +
            t("challenge.submitResult") +
            " →</button>"
          : "";
    const label =
      c.dir === "in"
        ? t("challenge.from") + " " + c.from
        : t("challenge.to") + " " + c.to;
    return (
      '<div class="mp-challenge-row card mb-2">' +
      '<div class="flex justify-between items-center mb-1">' +
      "<strong>" +
      label +
      "</strong>" +
      statusBadge +
      "</div>" +
      '<p class="text-sm text-muted">' +
      c.venue +
      " · " +
      (c.when.id && window.MP_I18N && MP_I18N.getLang() === "id" ? c.when.id : c.when.en) +
      "</p>" +
      actions +
      "</div>"
    );
  }

  function renderInbox(root) {
    if (!root) return;
    root.innerHTML =
      '<p class="form-hint mb-2">' +
      t("challenge.inboxSub") +
      "</p>" +
      INBOX.map(rowHTML).join("");
  }

  function updateBadges() {
    const n = pendingCount();
    document.querySelectorAll("[data-challenge-badge]").forEach((el) => {
      el.textContent = n ? String(n) : "";
      el.hidden = !n;
    });
  }

  function applyDOM() {
    document.querySelectorAll("[data-player-challenge]").forEach(renderIssue);
    document.querySelectorAll("[data-challenge-inbox]").forEach(renderInbox);
    updateBadges();
  }

  function init() {
    applyDOM();
    document.body.addEventListener("click", (e) => {
      const tgt = e.target.closest("[data-challenge-target]");
      if (tgt) setTarget(tgt.dataset.challengeTarget);
      const accept = e.target.closest("[data-challenge-accept]");
      if (accept) {
        const pre = getPrefill() || {};
        try {
          sessionStorage.setItem(
            PREFILL_KEY,
            JSON.stringify({ ...pre, opponent: "Rudi Hartono", accepted: true }),
          );
        } catch (_) {
          /* no-op */
        }
      }
    });
    window.addEventListener("mp:lang", applyDOM);
  }

  return {
    INBOX,
    pendingCount,
    setTarget,
    getPrefill,
    renderIssue,
    renderInbox,
    applyDOM,
    init,
  };
})();
