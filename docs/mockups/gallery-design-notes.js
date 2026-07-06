/* Gallery design rationale panel + callout overlays */
window.MP_GalleryNotes = (function () {
  const STORAGE_NAV = "mp-gallery-nav-collapsed";
  const STORAGE_PANEL = "mp-gallery-notes-collapsed";
  const STORAGE_CALLOUTS = "mp-gallery-callouts-visible";

  let activeScreen = null;
  let calloutsVisible = true;
  let panelOpen = true;

  function data() {
    return window.MP_GalleryNotesData || { screens: {}, SHARED: {} };
  }

  function lang() {
    return (window.MP_I18N && MP_I18N.getLang()) || "en";
  }

  function t(bi) {
    if (!bi) return "";
    if (typeof bi === "string") return bi;
    return bi[lang()] || bi.en || bi.id || "";
  }

  function i18n(k) {
    return window.MP_I18N ? MP_I18N.t(k) : k;
  }

  function calloutGlyph(n) {
    const glyphs = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳";
    return n <= glyphs.length ? glyphs[n - 1] : String(n);
  }

  function panelEl() {
    return document.getElementById("proto-design-panel");
  }

  function isPanelCollapsed() {
    const p = panelEl();
    return p && p.classList.contains("is-collapsed");
  }

  function isMobilePreview() {
    return document.body.classList.contains("mp-device-mobile");
  }

  function shouldShowCallouts() {
    if (!calloutsVisible) return false;
    if (isPanelCollapsed()) return false;
    if (isMobilePreview()) return false;
    return true;
  }

  function ensureWrap(screenEl) {
    const app = screenEl.querySelector(".app, .login-gate-app");
    if (!app) return null;
    let wrap = screenEl.querySelector(".gallery-callout-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "gallery-callout-wrap";
      const layer = document.createElement("div");
      layer.className = "gallery-callout-layer";
      layer.setAttribute("aria-hidden", "true");
      app.parentNode.insertBefore(wrap, app);
      wrap.appendChild(layer);
      wrap.appendChild(app);
    }
    return wrap;
  }

  function renderPanel(screenId) {
    const panel = panelEl();
    if (!panel) return;
    const body = panel.querySelector(".proto-design-panel-body");
    if (!body) return;

    const screen = data().screens[screenId];
    if (!screen) {
      body.innerHTML = `<p class="text-sm text-muted">${i18n("gallery.notes.missing")}</p>`;
      return;
    }

    const title = window.MP_I18N
      ? MP_I18N.t(MP_I18N.screenTitleKey(screenId))
      : screenId;
    const titleEl = panel.querySelector(".panel-screen-title");
    if (titleEl) titleEl.textContent = title;

    let html = "";

    if (screen.purpose) {
      html += section("gallery.notes.purpose", `<p>${esc(t(screen.purpose))}</p>`);
    }

    if (screen.components && screen.components.length) {
      let rows = "";
      screen.components.forEach((comp) => {
        const n = comp.callout;
        rows += `<div class="gallery-callout-row" id="callout-${n}" data-callout-row="${n}">
          <span class="gallery-callout-row-num">${calloutGlyph(n)}</span>
          <span class="gallery-callout-row-name">${esc(t(comp.name))}</span>
          <span class="gallery-callout-row-what">${esc(t(comp.what))}</span>
          <span class="gallery-callout-row-why"><em>${esc(t(comp.why))}</em></span>
        </div>`;
      });
      html += section("gallery.notes.components", rows);
    }

    if (screen.layout) {
      html += section("gallery.notes.layout", `<p>${esc(t(screen.layout))}</p>`);
    }

    if (screen.colors && screen.colors.length) {
      let sw = '<div class="note-swatch-list">';
      screen.colors.forEach((col) => {
        sw += `<span class="note-swatch"><span class="note-swatch-dot" style="background:${esc(col.hex)}"></span>${esc(col.token)} ${esc(col.hex)} — ${esc(t(col.use))}</span>`;
      });
      sw += "</div>";
      html += section("gallery.notes.colors", sw);
    }

    if (screen.mechanics) {
      let mech = "";
      if (screen.mechanics.purpose) {
        mech += `<p class="gallery-mech-intro">${esc(t(screen.mechanics.purpose))}</p>`;
      }
      if (screen.mechanics.sections) {
        screen.mechanics.sections.forEach((sec) => {
          mech += `<h4 class="gallery-mech-subhead">${esc(t(sec.title))}</h4><ul class="gallery-mech-list">`;
          (sec.items || []).forEach((item) => {
            mech += `<li>${esc(t(item))}</li>`;
          });
          mech += "</ul>";
        });
      } else if (screen.mechanics.scenarios) {
        mech += '<ul class="gallery-mech-list">';
        screen.mechanics.scenarios.forEach((s) => {
          mech += `<li>${esc(t(s))}</li>`;
        });
        mech += "</ul>";
      }
      html += section("gallery.notes.mechanics", mech);
    }

    body.innerHTML = html;
    bindPanelRows();
  }

  function section(key, inner) {
    return `<details class="gallery-note-section" open><summary>${esc(i18n(key))}</summary><div class="gallery-note-section-body">${inner}</div></details>`;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function injectCallouts(screenId) {
    activeScreen = screenId;
    const screenEl = document.getElementById("screen-" + screenId);
    if (!screenEl) return;

    const wrap = ensureWrap(screenEl);
    if (!wrap) return;

    const layer = wrap.querySelector(".gallery-callout-layer");
    layer.innerHTML = "";
    layer.classList.remove("has-callouts");

    wrap.classList.toggle("callouts-hidden", !shouldShowCallouts());
    if (!shouldShowCallouts()) return;

    const screen = data().screens[screenId];
    if (!screen || !screen.components) return;

    screen.components.forEach((comp) => {
      let el = null;
      let x;
      let y;

      if (comp.anchor) {
        try {
          el = screenEl.querySelector(comp.anchor);
        } catch (_) {
          console.warn("[MP_GalleryNotes] bad selector", comp.anchor);
        }
      }

      if (el) {
        const rect = el.getBoundingClientRect();
        const wrapRect = wrap.getBoundingClientRect();
        x = rect.left - wrapRect.left + rect.width / 2;
        y = rect.top - wrapRect.top + Math.min(14, rect.height / 2);
      } else if (comp.position) {
        x = (comp.position.left / 100) * wrap.clientWidth;
        y = (comp.position.top / 100) * wrap.clientHeight;
      } else {
        return;
      }

      const badge = document.createElement("button");
      badge.type = "button";
      badge.className = "gallery-callout";
      badge.dataset.callout = comp.callout;
      badge.textContent = comp.callout;
      badge.style.left = x + "px";
      badge.style.top = y + "px";
      badge.setAttribute("aria-label", t(comp.name));
      layer.appendChild(badge);
      layer.classList.add("has-callouts");
    });

    bindCalloutBadges(wrap);
  }

  function setActive(n) {
    document.querySelectorAll(".gallery-callout.is-active").forEach((b) => b.classList.remove("is-active"));
    document.querySelectorAll(".gallery-callout-row.is-active").forEach((r) => r.classList.remove("is-active"));
    document.querySelectorAll(".callout-target-active").forEach((e) => e.classList.remove("callout-target-active"));

    const badge = document.querySelector(`.gallery-callout[data-callout="${n}"]`);
    const row = document.getElementById("callout-" + n);
    if (badge) badge.classList.add("is-active");
    if (row) {
      row.classList.add("is-active");
      row.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    const screen = data().screens[activeScreen];
    if (screen && screen.components) {
      const comp = screen.components.find((c) => c.callout === n);
      if (comp && comp.anchor) {
        const screenEl = document.getElementById("screen-" + activeScreen);
        const el = screenEl && screenEl.querySelector(comp.anchor);
        if (el) el.classList.add("callout-target-active");
      }
    }

    const wrap = document.querySelector("#screen-" + activeScreen + " .gallery-callout-wrap");
    if (wrap) wrap.classList.add("callouts-dim");
  }

  function clearActive() {
    document.querySelectorAll(".gallery-callout.is-active, .gallery-callout-row.is-active, .callout-target-active").forEach((e) => e.classList.remove("is-active", "callout-target-active"));
    const wrap = document.querySelector("#screen-" + activeScreen + " .gallery-callout-wrap");
    if (wrap) wrap.classList.remove("callouts-dim");
  }

  function bindCalloutBadges() {
    document.querySelectorAll(".gallery-callout").forEach((badge) => {
      badge.onmouseenter = () => setActive(Number(badge.dataset.callout));
      badge.onmouseleave = () => clearActive();
      badge.onclick = (e) => {
        e.preventDefault();
        setActive(Number(badge.dataset.callout));
      };
    });
  }

  function bindPanelRows() {
    document.querySelectorAll(".gallery-callout-row").forEach((row) => {
      row.onmouseenter = () => setActive(Number(row.dataset.calloutRow));
      row.onmouseleave = () => clearActive();
    });
  }

  function render(screenId) {
    renderPanel(screenId);
    requestAnimationFrame(() => injectCallouts(screenId));
  }

  function togglePanel(open) {
    const panel = panelEl();
    if (!panel) return;
    if (open === undefined) open = panel.classList.contains("is-collapsed");
    panelOpen = open;
    panel.classList.toggle("is-collapsed", !open);
    document.body.classList.toggle("mp-gallery-notes-open", open);
    localStorage.setItem(STORAGE_PANEL, open ? "0" : "1");
    const btn = document.getElementById("gallery-notes-toggle");
    if (btn) btn.classList.toggle("active", open);
    if (activeScreen) injectCallouts(activeScreen);
  }

  function toggleCallouts(visible) {
    if (visible === undefined) visible = !calloutsVisible;
    calloutsVisible = visible;
    document.body.classList.toggle("mp-gallery-callouts-off", !visible);
    localStorage.setItem(STORAGE_CALLOUTS, visible ? "1" : "0");
    const btn = document.getElementById("gallery-callouts-toggle");
    if (btn) btn.classList.toggle("active", visible);
    if (activeScreen) injectCallouts(activeScreen);
  }

  function toggleNav(collapsed) {
    const shell = document.querySelector(".proto-shell");
    if (!shell) return;
    if (collapsed === undefined) collapsed = !shell.classList.contains("proto-nav-collapsed");
    shell.classList.toggle("proto-nav-collapsed", collapsed);
    localStorage.setItem(STORAGE_NAV, collapsed ? "1" : "0");
  }

  function initChrome() {
    const shell = document.querySelector(".proto-shell");
    if (localStorage.getItem(STORAGE_NAV) === "1" && shell) {
      shell.classList.add("proto-nav-collapsed");
    }
    panelOpen = localStorage.getItem(STORAGE_PANEL) !== "1";
    calloutsVisible = localStorage.getItem(STORAGE_CALLOUTS) !== "0";
    document.body.classList.toggle("mp-gallery-notes-open", panelOpen);
    togglePanel(panelOpen);
    toggleCallouts(calloutsVisible);

    const closeBtn = document.getElementById("gallery-notes-close");
    if (closeBtn) closeBtn.addEventListener("click", () => togglePanel(false));

    const notesBtn = document.getElementById("gallery-notes-toggle");
    if (notesBtn) notesBtn.addEventListener("click", () => togglePanel(true));

    const calloutsBtn = document.getElementById("gallery-callouts-toggle");
    if (calloutsBtn) calloutsBtn.addEventListener("click", () => toggleCallouts());

    window.addEventListener("mp:lang", () => {
      if (activeScreen) renderPanel(activeScreen);
    });

    window.addEventListener("resize", () => {
      if (activeScreen) injectCallouts(activeScreen);
    });

    window.addEventListener("mp:device", () => {
      if (activeScreen) injectCallouts(activeScreen);
    });
  }

  return {
    render,
    injectCallouts,
    init: initChrome,
    togglePanel,
    toggleCallouts,
    toggleNav,
  };
})();
