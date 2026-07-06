/* Match Point mockup — floating feedback (WhatsApp + Email, Option C) */
window.MP_Feedback = (function () {
  const WA_NUMBER = "6285694390095";
  const EMAIL = "rufusrolla@gmail.com";
  const FORMSUBMIT = "https://formsubmit.co/ajax/" + EMAIL;

  function t(key, fallback) {
    if (!window.MP_I18N) return fallback;
    const val = MP_I18N.t(key, MP_I18N.getLang());
    return val && val !== key ? val : fallback;
  }

  function getContext() {
    const params = new URLSearchParams(location.search);
    let step = params.get("step");
    if (step == null) {
      document.querySelectorAll(".flow-step").forEach((el, i) => {
        if (el.classList.contains("active")) step = String(i);
      });
    }
    let flowName = document.title || location.pathname;
    const activeStep = document.querySelector(".flow-step.active");
    if (activeStep) {
      const hint = document.getElementById("flow-step-hint");
      if (hint) flowName = hint.textContent.trim() || flowName;
    }
    const device =
      (window.MP_Device && MP_Device.get()) ||
      (document.body.classList.contains("mp-device-mobile")
        ? "mobile"
        : document.body.classList.contains("mp-device-tablet")
          ? "tablet"
          : "desktop");
    const lang = window.MP_I18N ? MP_I18N.getLang() : "en";
    const theme = window.MP_Theme && MP_Theme.get() === "dark" ? "dark" : "light";
    return {
      url: location.href,
      step: step != null ? step : "—",
      flow: flowName,
      device,
      lang,
      theme,
      time: new Date().toLocaleString(),
      ua: navigator.userAgent.slice(0, 120),
    };
  }

  function buildMessage(data) {
    const ctx = getContext();
    const stars = "★".repeat(data.rating) + "☆".repeat(5 - data.rating);
    return (
      "Match Point Mockup Feedback " +
      stars +
      "\n\n" +
      (data.intent ? "Trying to: " + data.intent + "\n\n" : "") +
      "Feedback:\n" +
      data.comment +
      "\n\n" +
      (data.contact ? "Contact: " + data.contact + "\n\n" : "") +
      "---\n" +
      "Page: " +
      ctx.url +
      "\n" +
      "Flow: " +
      ctx.flow +
      " · step " +
      ctx.step +
      "\n" +
      "Device: " +
      ctx.device +
      " | Lang: " +
      ctx.lang +
      " | Theme: " +
      ctx.theme +
      "\n" +
      "Time: " +
      ctx.time
    );
  }

  function toast(msg) {
    let el = document.getElementById("mp-feedback-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "mp-feedback-toast";
      el.className = "mp-feedback-toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => el.classList.remove("show"), 3200);

    const flowToast = document.getElementById("flow-toast");
    if (flowToast) {
      flowToast.textContent = msg;
      flowToast.classList.add("show");
      setTimeout(() => flowToast.classList.remove("show"), 3200);
    }
  }

  function showPanelError(msg) {
    const panel = document.getElementById("mp-feedback-panel");
    if (!panel) return;
    let err = panel.querySelector("[data-feedback-error]");
    if (!err) {
      err = document.createElement("p");
      err.className = "mp-feedback-error";
      err.dataset.feedbackError = "1";
      const stars = panel.querySelector("[data-feedback-stars]");
      if (stars) stars.insertAdjacentElement("afterend", err);
      else panel.querySelector(".mp-feedback-head")?.insertAdjacentElement("afterend", err);
    }
    err.textContent = msg;
    err.hidden = false;
  }

  function clearPanelError() {
    const err = document.querySelector("[data-feedback-error]");
    if (err) err.hidden = true;
  }

  function sendWhatsApp(data) {
    clearPanelError();
    const text = encodeURIComponent(buildMessage(data));
    window.open("https://wa.me/" + WA_NUMBER + "?text=" + text, "_blank", "noopener");
    toast(t("feedback.thanks", "Thanks for your feedback!"));
    closePanel();
  }

  function openMailto(data) {
    const ctx = getContext();
    const stars = "★".repeat(data.rating) + "☆".repeat(5 - data.rating);
    const subject = encodeURIComponent("[Match Point Mockup] " + stars + " " + ctx.flow);
    const body = encodeURIComponent(buildMessage(data));
    const mailto = "mailto:" + EMAIL + "?subject=" + subject + "&body=" + body;
    window.open(mailto, "_blank");
  }

  function setEmailSending(sending) {
    const btn = document.querySelector("[data-feedback-email]");
    if (!btn) return;
    btn.disabled = sending;
    btn.style.opacity = sending ? "0.65" : "";
  }

  function sendEmail(data) {
    clearPanelError();
    const pageUrl =
      location.protocol === "file:"
        ? ""
        : location.origin + location.pathname + (location.search || "");
    const payload = {
      _subject: "[Match Point Mockup] " + "★".repeat(data.rating) + "☆".repeat(5 - data.rating),
      _template: "table",
      _captcha: "false",
      rating: String(data.rating),
      intent: data.intent || "",
      message: data.comment,
      contact: data.contact || "",
      page: getContext().url,
      flow: getContext().flow,
      step: getContext().step,
      device: getContext().device,
      lang: getContext().lang,
      theme: getContext().theme,
      time: getContext().time,
    };
    if (pageUrl) payload._url = pageUrl;
    if (data.contact && data.contact.includes("@")) {
      payload._replyto = data.contact;
    }

    setEmailSending(true);
    toast(t("feedback.emailSending", "Sending email…"));

    fetch(FORMSUBMIT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json().catch(() => ({})))
      .then((res) => {
        setEmailSending(false);
        const ok = res && (res.success === true || res.success === "true");
        if (ok) {
          toast(t("feedback.thanks", "Thanks for your feedback!"));
          closePanel();
          return;
        }
        const msg = (res && res.message) || "";
        if (/activation/i.test(msg)) {
          toast(
            t(
              "feedback.emailActivateDomain",
              "Activation needed for this site — check rufusrolla@gmail.com and click Activate Form. Your mail app opens as backup.",
            ),
          );
          openMailto(data);
          closePanel();
          return;
        }
        if (/web server/i.test(msg) || location.protocol === "file:") {
          toast(
            t(
              "feedback.emailNeedServer",
              "Direct email needs localhost or a deployed URL. Opening your mail app instead…",
            ),
          );
          openMailto(data);
          closePanel();
          return;
        }
        toast(t("feedback.emailFallback", "Could not send automatically. Opening your mail app…"));
        openMailto(data);
        closePanel();
      })
      .catch(() => {
        setEmailSending(false);
        toast(t("feedback.emailFallback", "Opening your email app…"));
        openMailto(data);
        closePanel();
      });
  }

  function readRating(panel) {
    let rating = 0;
    panel.querySelectorAll("[data-feedback-rating].active").forEach((s) => {
      rating = Math.max(rating, parseInt(s.dataset.value, 10) || 0);
    });
    if (!rating && panel.dataset.feedbackRating) {
      rating = parseInt(panel.dataset.feedbackRating, 10) || 0;
    }
    return rating;
  }

  function readForm() {
    const panel = document.getElementById("mp-feedback-panel");
    if (!panel) return null;
    const rating = readRating(panel);
    const comment = (panel.querySelector("[data-feedback-comment]")?.value || "").trim();
    if (!rating || !comment) return null;
    return {
      rating,
      comment,
      intent: (panel.querySelector("[data-feedback-intent]")?.value || "").trim(),
      contact: (panel.querySelector("[data-feedback-contact]")?.value || "").trim(),
    };
  }

  function closePanel() {
    const panel = document.getElementById("mp-feedback-panel");
    const overlay = document.getElementById("mp-feedback-overlay");
    if (panel) panel.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
    clearPanelError();
  }

  function openPanel() {
    const panel = document.getElementById("mp-feedback-panel");
    const overlay = document.getElementById("mp-feedback-overlay");
    if (panel) panel.classList.add("open");
    if (overlay) overlay.classList.add("open");
  }

  function togglePanel() {
    const panel = document.getElementById("mp-feedback-panel");
    if (!panel) return;
    if (panel.classList.contains("open")) closePanel();
    else openPanel();
  }

  function ensureUI() {
    if (document.getElementById("mp-feedback-fab")) return;

    const fab = document.createElement("button");
    fab.type = "button";
    fab.id = "mp-feedback-fab";
    fab.className = "mp-feedback-fab";
    fab.setAttribute("aria-label", t("feedback.fabLabel", "Share your feedback here"));
    fab.innerHTML =
      '<span class="mp-feedback-fab-icon" aria-hidden="true">💬</span>' +
      '<span class="mp-feedback-fab-label" data-i18n="feedback.fabLabel">' +
      t("feedback.fabLabel", "Share your feedback here") +
      "</span>";

    const panel = document.createElement("div");
    panel.id = "mp-feedback-panel";
    panel.className = "mp-feedback-panel";
    panel.innerHTML =
      '<div class="mp-feedback-head">' +
      "<strong>" +
      t("feedback.title", "Mockup feedback") +
      '</strong><button type="button" class="mp-feedback-close" data-feedback-close aria-label="Close">✕</button></div>' +
      '<p class="text-sm text-muted mp-feedback-privacy" data-i18n="feedback.privacy">' +
      t(
        "feedback.privacy",
        "Feedback goes directly to the product team via WhatsApp or email — not stored on this demo site.",
      ) +
      "</p>" +
      '<label class="form-label">' +
      t("feedback.ratingLabel", "Overall rating") +
      '</label><div class="mp-feedback-stars" data-feedback-stars>' +
      [1, 2, 3, 4, 5]
        .map(
          (n) =>
            '<button type="button" class="mp-feedback-star" data-feedback-rating data-value="' +
            n +
            '" aria-label="' +
            n +
            ' stars">★</button>',
        )
        .join("") +
      "</div>" +
      '<div class="form-group"><label class="form-label">' +
      t("feedback.intentLabel", "What were you trying to do?") +
      '</label><input class="form-input" data-feedback-intent placeholder="' +
      t("feedback.intentPh", "e.g. Review match in inbox") +
      '" /></div>' +
      '<div class="form-group"><label class="form-label">' +
      t("feedback.commentLabel", "Feedback") +
      '</label><textarea class="form-textarea" rows="3" data-feedback-comment placeholder="' +
      t("feedback.commentPh", "Bugs, confusing UI, ideas…") +
      '"></textarea></div>' +
      '<div class="form-group"><label class="form-label">' +
      t("feedback.contactLabel", "Name / contact (optional)") +
      '</label><input class="form-input" data-feedback-contact /></div>' +
      '<div class="btn-stack">' +
      '<button type="button" class="btn btn-primary btn-block" data-feedback-whatsapp>💬 ' +
      t("feedback.sendWhatsApp", "Send via WhatsApp") +
      "</button>" +
      '<button type="button" class="btn btn-outline btn-block" data-feedback-email>✉️ ' +
      t("feedback.sendEmail", "Send via Email") +
      "</button>" +
      '<p class="form-hint text-center mt-1 mb-0" data-i18n="feedback.emailHint">Automatic email works on localhost or any deployed URL (GitHub Pages, Netlify, etc.) — not when opening a local file directly.</p></div>';

    document.body.appendChild(fab);

    const overlay = document.createElement("div");
    overlay.id = "mp-feedback-overlay";
    overlay.className = "mp-feedback-overlay";
    overlay.addEventListener("click", closePanel);
    document.body.appendChild(overlay);

    document.body.appendChild(panel);

    fab.addEventListener("click", togglePanel);

    panel.addEventListener("click", (e) => {
      if (e.target.closest("[data-feedback-close]")) closePanel();
      const star = e.target.closest("[data-feedback-rating]");
      if (star) {
        clearPanelError();
        const val = parseInt(star.dataset.value, 10);
        panel.dataset.feedbackRating = String(val);
        panel.querySelectorAll("[data-feedback-rating]").forEach((s) => {
          s.classList.toggle("active", parseInt(s.dataset.value, 10) <= val);
        });
      }
      if (e.target.closest("[data-feedback-whatsapp]")) {
        const data = readForm();
        if (!data) {
          const rating = readRating(panel);
          const comment = (panel.querySelector("[data-feedback-comment]")?.value || "").trim();
          if (!rating) {
            showPanelError(t("feedback.needRating", "Please tap a star rating (1–5)."));
          } else if (!comment) {
            showPanelError(t("feedback.needComment", "Please add your feedback text."));
          } else {
            showPanelError(t("feedback.required", "Please add a rating and feedback."));
          }
          toast(t("feedback.required", "Please add a rating and feedback."));
          return;
        }
        sendWhatsApp(data);
      }
      if (e.target.closest("[data-feedback-email]")) {
        const data = readForm();
        if (!data) {
          const rating = readRating(panel);
          const comment = (panel.querySelector("[data-feedback-comment]")?.value || "").trim();
          if (!rating) {
            showPanelError(t("feedback.needRating", "Please tap a star rating (1–5)."));
          } else if (!comment) {
            showPanelError(t("feedback.needComment", "Please add your feedback text."));
          } else {
            showPanelError(t("feedback.required", "Please add a rating and feedback."));
          }
          toast(t("feedback.required", "Please add a rating and feedback."));
          return;
        }
        sendEmail(data);
      }
    });
  }

  function init() {
    ensureUI();
    if (window.MP_I18N) MP_I18N.apply(MP_I18N.getLang());
    window.addEventListener("mp:lang", () => {
      const old = document.getElementById("mp-feedback-fab");
      if (old) {
        old.remove();
        document.getElementById("mp-feedback-overlay")?.remove();
        document.getElementById("mp-feedback-panel")?.remove();
        document.getElementById("mp-feedback-toast")?.remove();
        ensureUI();
        if (window.MP_I18N) MP_I18N.apply(MP_I18N.getLang());
      }
    });
  }

  return { init, getContext, buildMessage };
})();
