/* Platform admin — unified approval review (inbox + matches share one flow) */
window.MP_PlatformApproval = (function () {
  const SESSION_KEY = "mp-platform-review";
  const i18n = () => window.MP_I18N;

  function t(key, fallback) {
    return i18n() ? i18n().t(key, i18n().getLang()) : fallback;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function getSession() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    } catch (_) {
      return null;
    }
  }

  function setSession(data) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  }

  function openReview(item, returnStep) {
    setSession({
      id: item.id,
      returnStep: returnStep || 2,
      decision: null,
    });
  }

  function getItem() {
    const session = getSession();
    if (!session || !window.MP_PlatformLists) return null;
    return MP_PlatformLists.getById(session.id);
  }

  function typeLabel(type) {
    const map = {
      community: t("platform.approvalTypeCommunity", "New community"),
      event: t("platform.approvalTypeEvent", "Featured event"),
      global: t("platform.approvalTypeGlobal", "Global tournament"),
      match_gps: t("platform.approvalTypeGps", "Match · GPS review"),
      match_dispute: t("platform.approvalTypeDispute", "Match dispute"),
      match_review: t("platform.approvalTypeMatch", "Match verification"),
    };
    return map[type] || type;
  }

  function detailBody(item) {
    const extra = item.detail || {};
    if (item.approvalType === "community") {
      return (
        '<p class="text-sm text-muted" style="margin:0.35rem 0">' +
        esc(extra.sport || "🏓 Padel · Jakarta Selatan · Senayan · 🟢 Open") +
        "</p>" +
        '<p class="text-sm text-muted">' +
        esc(extra.submitter || "Pengaju: Budi Santoso · @budisantoso · Trust 0.94") +
        "</p>"
      );
    }
    if (item.approvalType === "match_dispute") {
      return (
        '<div class="info-strip mb-2"><span>⚖</span><span>' +
        t("platform.disputeStrip", "Conflicting scores — decision required with audit note.") +
        "</span></div>" +
        '<div class="card mb-2"><strong>' +
        esc(extra.scoreA || "Budi: 6-2, 6-1") +
        "</strong><br><span class=\"text-sm text-muted\">" +
        esc(extra.scoreB || "Andi: 4-6, 6-3, 10-8") +
        "</span></div>" +
        '<div class="form-group"><label class="form-label">' +
        t("platform.decisionLabel", "Admin decision") +
        '</label><select class="form-select" data-platform-decision-select>' +
        '<option value="approve_a">' +
        esc(extra.optionA || "Approve score Budi (6-2, 6-1)") +
        "</option>" +
        '<option value="approve_b">' +
        esc(extra.optionB || "Approve score Andi (4-6, 6-3, 10-8)") +
        "</option>" +
        '<option value="reject">' +
        t("platform.rejectMatchData", "Reject match — invalid data") +
        "</option></select></div>"
      );
    }
    if (item.approvalType === "match_gps" || item.approvalType === "match_review") {
      return (
        '<div class="card mb-2"><strong>' +
        t("platform.matchContext", "Match context") +
        "</strong>" +
        '<p class="text-sm text-muted" style="margin:0.35rem 0 0">' +
        esc(extra.context || item.meta) +
        "</p></div>"
      );
    }
    return (
      '<p class="text-sm text-muted" style="margin:0.35rem 0">' +
      esc(item.meta) +
      "</p>"
    );
  }

  function approveLabel(item) {
    if (item.approvalType === "community")
      return t("platform.approveBtn", "✓ Approve community");
    if (item.approvalType === "match_dispute")
      return t("platform.resolveApproveBtn", "✓ Apply decision");
    return t("platform.approveGeneric", "✓ Approve");
  }

  function rejectLabel(item) {
    if (item.approvalType?.startsWith("match"))
      return t("platform.rejectMatchBtn", "✕ Reject match");
    return t("platform.rejectBtn", "✕ Reject — send reason");
  }

  function syncBackButtons() {
    const session = getSession();
    const returnStep = session?.returnStep ?? 2;
    document.querySelectorAll("[data-platform-approval-back]").forEach((btn) => {
      btn.dataset.flowBack = String(returnStep);
    });
  }

  function renderDetail(root) {
    if (!root) return;
    const item = getItem();
    if (!item) {
      root.innerHTML =
        '<p class="form-hint">' +
        t("platform.noReviewItem", "Select an item from the queue to review.") +
        "</p>";
      return;
    }
    root.innerHTML =
      '<div class="card mb-2">' +
      '<span class="badge badge-muted mb-1">' +
      typeLabel(item.approvalType) +
      "</span>" +
      "<strong>" +
      esc(item.title) +
      "</strong>" +
      detailBody(item) +
      '<div class="approval-track">' +
      '<span class="approval-node done">' +
      t("approval.submitted", "Submitted") +
      "</span>" +
      '<span class="approval-arrow">→</span>' +
      '<span class="approval-node current">' +
      t("approval.pending", "Pending Review") +
      "</span>" +
      '<span class="approval-arrow">→</span>' +
      '<span class="approval-node">' +
      t("approval.approved", "Approved") +
      "</span></div></div>" +
      '<div class="form-group"><label class="form-label" data-i18n="platform.reasonLabel">' +
      t("platform.reasonLabel", "Reviewer note (required, sent to submitter)") +
      '</label><textarea class="form-textarea" rows="2" data-platform-review-note>' +
      esc(item.detail?.defaultNote || "") +
      "</textarea></div>" +
      '<div class="btn-stack">' +
      '<button type="button" class="btn btn-primary btn-block btn-lg" data-platform-approve data-flow-goto="4">' +
      approveLabel(item) +
      "</button>" +
      '<button type="button" class="btn btn-danger btn-block" data-platform-reject data-flow-goto="4">' +
      rejectLabel(item) +
      "</button></div>";
    if (window.MP_I18N) MP_I18N.apply(MP_I18N.getLang(), root);
    syncBackButtons();
  }

  function renderResult(root) {
    if (!root) return;
    const session = getSession();
    const item = getItem();
    const approved = session?.decision === "approved";
    const rejected = session?.decision === "rejected";
    const icon = approved ? "✅" : rejected ? "🚫" : "✅";
    const title = approved
      ? item?.approvalType === "community"
        ? t("platform.approvedTitle", "Community approved ✓")
        : t("platform.approvedGeneric", "Request approved ✓")
      : t("platform.rejectedTitle", "Request rejected");
    const desc = approved
      ? item?.approvalType === "community"
        ? t("platform.approvedDesc", "Submitter becomes community admin. Logged to audit.")
        : item?.approvalType === "match_dispute"
          ? t("platform.disputeResolvedDesc", "Decision applied · ranks updated · audit logged.")
          : t("platform.approvedGenericDesc", "Decision recorded in audit log.")
      : t("platform.rejectedDesc", "Reason sent to submitter · logged to audit.");

    const backStep = session?.returnStep ?? 2;
    const backLabel =
      backStep === 5
        ? t("platform.backMatchesBtn", "← Back to Matches queue")
        : t("platform.backInboxBtn", "← Back to Approval Inbox");

    root.innerHTML =
      '<div style="font-size:3.5rem">' +
      icon +
      "</div>" +
      '<h2 class="section-title">' +
      title +
      "</h2>" +
      '<p class="section-sub">' +
      desc +
      "</p>" +
      '<div class="approval-track" style="justify-content:center">' +
      '<span class="approval-node done">' +
      t("approval.submitted", "Submitted") +
      "</span>" +
      '<span class="approval-arrow">→</span>' +
      '<span class="approval-node done">' +
      t("approval.pending", "Pending Review") +
      "</span>" +
      '<span class="approval-arrow">→</span>' +
      '<span class="approval-node ' +
      (rejected ? "rejected" : "done") +
      '">' +
      (rejected
        ? t("approval.rejected", "Rejected")
        : t("approval.approved", "Approved")) +
      "</span></div>" +
      '<div class="audit-log mt-2 text-left" data-platform-audit-log></div>' +
      '<div class="btn-stack mt-2">' +
      '<button type="button" class="btn btn-primary btn-block btn-lg" data-flow-goto="' +
      backStep +
      '">' +
      backLabel +
      "</button>" +
      '<button type="button" class="btn btn-outline btn-block" data-flow-goto="1" data-i18n="platform.backOverviewBtn">' +
      t("platform.backOverviewBtn", "Dashboard overview") +
      "</button></div>";

    if (item && approved) {
      MP_PlatformLists?.markResolved(item.id, "approved");
    }
    if (item && rejected) {
      MP_PlatformLists?.markResolved(item.id, "rejected");
    }
    if (window.MP_I18N) MP_I18N.apply(MP_I18N.getLang(), root);
    syncBackButtons();
  }

  function bind() {
    document.body.addEventListener("click", (e) => {
      const reviewBtn = e.target.closest("[data-platform-review-id]");
      if (reviewBtn) {
        e.preventDefault();
        const item = MP_PlatformLists?.getById(reviewBtn.dataset.platformReviewId);
        if (!item) return;
        const returnStep = parseInt(reviewBtn.dataset.platformReturnStep || "2", 10);
        openReview(item, returnStep);
        if (window.MP_Flow?.go) MP_Flow.go(3, { toast: false });
        return;
      }

      const approveBtn = e.target.closest("[data-platform-approve]");
      if (approveBtn) {
        e.preventDefault();
        e.stopPropagation();
        const session = getSession();
        if (session) setSession({ ...session, decision: "approved" });
        if (window.MP_Flow?.go) MP_Flow.go(4, { toast: false });
        return;
      }

      const rejectBtn = e.target.closest("[data-platform-reject]");
      if (rejectBtn) {
        e.preventDefault();
        e.stopPropagation();
        const session = getSession();
        if (session) setSession({ ...session, decision: "rejected" });
        if (window.MP_Flow?.go) MP_Flow.go(4, { toast: false });
        return;
      }
    });
  }

  function onStep(step) {
    if (step === 3) renderDetail(document.querySelector("[data-platform-approval-detail]"));
    if (step === 4) renderResult(document.querySelector("[data-platform-approval-result]"));
  }

  function init() {
    bind();
    window.addEventListener("mp:lang", () => {
      onStep(3);
      onStep(4);
    });
  }

  return { init, openReview, onStep, getItem };
})();
