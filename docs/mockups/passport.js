/* Match Point — Player Passport: unified 5-sport identity rollup (mockup)
   render(root, { teaser:true }) = blurred guest variant with a single
   conversion CTA (design-system/match-point/pages/player-passport.md). */
window.MP_Passport = (function () {
  const t = (k) => (window.MP_I18N ? MP_I18N.t(k) : k);
  const lang = () => (window.MP_I18N ? MP_I18N.getLang() : "en");
  const L = (o) => (o ? o[lang()] || o.en : "");

  const DEMO = {
    padel: { mabar: 1240, global: 1180, matches: 42, trend: "▲", rank: 12, globalRank: 142 },
    tennis: { mabar: 980, global: 940, matches: 17, trend: "▲", rank: 8, globalRank: 31 },
    pickleball: { mabar: 720, global: null, matches: 5, trend: "▬", rank: null, globalRank: null },
    badminton: { mabar: null, global: null, matches: 0, trend: "", rank: null, globalRank: null },
    table_tennis: { mabar: null, global: null, matches: 0, trend: "", rank: null, globalRank: null },
  };

  function currentSport() {
    return window.MP_Sport ? MP_Sport.get() : "padel";
  }

  function currentSportData() {
    return DEMO[currentSport()] || DEMO.padel;
  }

  function sportRows() {
    const sports = window.MP_Sport
      ? MP_Sport.sports
      : ["padel", "tennis", "pickleball", "badminton", "table_tennis"];
    const active = currentSport();
    return sports
      .map((s) => {
        const d = DEMO[s] || DEMO.padel;
        const label = window.MP_Sport ? MP_Sport.label(s) : s;
        const played = d.matches > 0;
        const band =
          played && window.MP_Rank && MP_Rank.skillBand
            ? L(MP_Rank.skillBand(s))
            : "";
        const nums = played
          ? '<div class="mp-passport-sport-nums">' +
            "<span><b>" +
            (d.mabar != null ? d.mabar : "—") +
            "</b><small>" +
            t("passport.mabar") +
            "</small></span>" +
            "<span><b>" +
            (d.global != null ? d.global : "—") +
            "</b><small>" +
            t("passport.global") +
            "</small></span>" +
            "<span><b>" +
            d.matches +
            "</b><small>" +
            t("passport.matches") +
            "</small></span>" +
            "</div>"
          : '<span class="mp-passport-sport-empty">' +
            t("passport.noRecord") +
            " · " +
            t("passport.startRecord") +
            "</span>";
        return (
          '<div class="mp-passport-sport' +
          (played ? "" : " is-empty") +
          (s === active ? " is-active" : "") +
          '" style="--sport-color: var(--sport-' +
          s.replace("_", "-") +
          ')">' +
          '<div class="mp-passport-sport-name">' +
          label +
          (band ? "<small>" + band + "</small>" : "") +
          (s === active
            ? '<span class="mp-passport-sport-active">' + t("passport.primarySport") + "</span>"
            : "") +
          "</div>" +
          nums +
          "</div>"
        );
      })
      .join("");
  }

  function prideStripHTML() {
    return (
      '<div class="mp-passport-pride-strip">' +
      '<div class="mp-passport-pride-stat">' +
      '<span aria-hidden="true">🔥</span>' +
      "<strong>6</strong><small>" + t("passport.streakWeeks") + "</small></div>" +
      '<div class="mp-passport-pride-stat">' +
      '<span aria-hidden="true">🏆</span>' +
      "<strong>4</strong><small>" + t("passport.trophiesEarned") + "</small></div>" +
      '<div class="mp-passport-pride-stat">' +
      '<span aria-hidden="true">🌐</span>' +
      "<strong>3</strong><small>" + t("passport.communities") + "</small></div>" +
      "</div>"
    );
  }

  const DEMO_HANDLE = "budisantoso";
  const passportQrSeed = () => "matchpoint.id/u/" + DEMO_HANDLE;

  function hashSeed(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function qrModuleReserved(x, y, n) {
    if (x < 9 && y < 9) return true;
    if (x >= n - 8 && y < 9) return true;
    if (x < 9 && y >= n - 8) return true;
    if (x === 6 || y === 6) return true;
    return false;
  }

  function uniqueQrSVG(className, seed) {
    const n = 29;
    const mod = 4;
    const cells = Array.from({ length: n }, () => Array(n).fill(0));

    function paintFinder(ox, oy) {
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          const edge = x === 0 || x === 6 || y === 0 || y === 6;
          const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
          cells[oy + y][ox + x] = edge || core ? 1 : 0;
        }
      }
    }

    paintFinder(0, 0);
    paintFinder(n - 7, 0);
    paintFinder(0, n - 7);

    for (let i = 8; i < n - 8; i++) {
      cells[6][i] = i % 2;
      cells[i][6] = i % 2;
    }

    let h = hashSeed(seed || passportQrSeed());
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (cells[y][x] || qrModuleReserved(x, y, n)) continue;
        h = Math.imul(h ^ (x + 1) * 2654435761 ^ (y + 1) * 1597334677, 2246822519) >>> 0;
        cells[y][x] = h & 1 ? 1 : 0;
      }
    }

    const cx = Math.floor(n / 2);
    const cy = Math.floor(n / 2);
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const ring = Math.max(Math.abs(dx), Math.abs(dy)) === 2;
        const dot = dx === 0 && dy === 0;
        if (ring || dot) cells[cy + dy][cx + dx] = 1;
      }
    }

    let rects = "";
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (!cells[y][x]) continue;
        rects +=
          '<rect x="' +
          x * mod +
          '" y="' +
          y * mod +
          '" width="' +
          (mod - 0.6) +
          '" height="' +
          (mod - 0.6) +
          '"/>';
      }
    }

    const dim = n * mod;
    return (
      '<svg class="' +
      className +
      '" viewBox="0 0 ' +
      dim +
      " " +
      dim +
      '" role="img" aria-label="QR code" data-qr-seed="' +
      (seed || passportQrSeed()) +
      '">' +
      '<rect width="' +
      dim +
      '" height="' +
      dim +
      '" fill="#fff" rx="2"/>' +
      '<g fill="#0a1f14">' +
      rects +
      "</g></svg>"
    );
  }

  function qrBlockHTML(opts) {
    opts = opts || {};
    const seed = passportQrSeed();
    return (
      '<div class="mp-passport-qr' +
      (opts.compact ? " mp-passport-qr--compact" : "") +
      '">' +
      uniqueQrSVG("mp-passport-qr-svg", seed) +
      '<div class="mp-passport-qr-copy">' +
      "<strong>" +
      t("passport.qrTitle") +
      "</strong>" +
      "<small>" +
      t("passport.qrHint") +
      "</small>" +
      '<code class="mp-passport-qr-url">' +
      seed +
      "</code>" +
      "</div></div>"
    );
  }

  function heroHTML() {
    const sport = currentSport();
    const d = currentSportData();
    const sportLabel = window.MP_Sport ? MP_Sport.label(sport) : sport;
    return (
      '<div class="mp-passport-hero" style="--sport-color: var(--sport-' +
      sport.replace("_", "-") +
      ')">' +
      '<div class="mp-passport-hero-glow" aria-hidden="true"></div>' +
      '<div class="mp-passport-hero-row">' +
      '<span class="avatar avatar-photo">🧑🏽</span>' +
      '<div class="mp-passport-name"><strong>Budi Santoso</strong>' +
      "<span>@budisantoso · Jakarta</span></div>" +
      '<div class="mp-passport-rating"><strong>' +
      (d.mabar || 1240) +
      "</strong><small>" +
      t("passport.mpRating") +
      "</small></div></div>" +
      '<div class="mp-passport-chips">' +
      '<span class="mp-passport-chip mp-passport-chip--sport">' +
      sportLabel +
      "</span>" +
      '<span class="mp-passport-chip">✓ ' + t("passport.trust") + " 92</span>" +
      '<span class="mp-passport-chip">64 ' + t("passport.matches") + "</span>" +
      "</div></div>"
    );
  }

  function shareCardHTML() {
    const d = currentSportData();
    const sport = currentSport();
    const sportLabel = window.MP_Sport ? MP_Sport.label(sport) : sport;
    const seed = passportQrSeed();
    const pride = '<div class="share-pride-row" data-share-pride></div>';
    return (
      '<div class="share-card-preview" style="--sport-color: var(--sport-' +
      sport.replace("_", "-") +
      ')">' +
      '<div class="share-card-glow" aria-hidden="true"></div>' +
      '<div class="share-card-top">' +
      '<div class="share-card-brand">' +
      t("share.brand") +
      "</div>" +
      '<div class="share-card-avatar">BS</div>' +
      '<div class="share-card-name">Budi Santoso</div>' +
      '<div class="share-card-sport">' +
      sportLabel +
      " · " +
      t("passport.mpRating") +
      "</div>" +
      '<div class="share-card-rating">' +
      (d.mabar || 1680) +
      "</div>" +
      '<div class="share-card-ranks">' +
      '<div class="share-card-rank-item"><div class="share-card-rank-val">' +
      (d.mabar || 1680) +
      '</div><div class="share-card-rank-lbl">Mabar #' +
      (d.rank || 12) +
      "</div></div>" +
      '<div class="share-card-rank-item"><div class="share-card-rank-val">' +
      (d.global || 1570) +
      '</div><div class="share-card-rank-lbl">Global #' +
      (d.globalRank || 142) +
      "</div></div></div></div>" +
      '<div class="share-card-mid">' +
      '<div class="share-card-pride-label">' +
      t("share.prideLabel") +
      "</div>" +
      pride +
      "</div>" +
      '<div class="share-card-qr-wrap">' +
      uniqueQrSVG("share-qr-svg", seed) +
      '<code class="share-card-qr-id">@' +
      DEMO_HANDLE +
      "</code>" +
      '<small class="share-card-qr-hint">' +
      t("share.qrHint") +
      "</small>" +
      "</div>" +
      '<div class="share-card-foot">' +
      '<div class="share-card-streak">🔥 ' +
      t("passport.streakWeeks") +
      " · 6</div>" +
      '<p class="share-card-footer">' +
      seed +
      " · 600×600 PNG</p></div></div>"
    );
  }

  function render(root, opts) {
    if (!root) return;
    opts = opts || {};
    const core =
      '<div class="mp-passport-stack">' +
      heroHTML() +
      prideStripHTML() +
      '<div class="mp-passport-sports">' +
      sportRows() +
      "</div>" +
      qrBlockHTML() +
      "</div>";
    if (opts.teaser) {
      root.innerHTML =
        '<div class="mp-guest-teaser">' +
        '<div class="mp-guest-teaser-content">' +
        core +
        "</div>" +
        '<div class="mp-guest-teaser-overlay">' +
        "<strong>" + t("guest.passportTitle") + "</strong>" +
        "<small>" + t("guest.passportDesc") + "</small>" +
        '<button type="button" class="btn btn-primary" data-guest-login>' +
        t("guest.passportCta") +
        "</button></div></div>";
    } else {
      root.innerHTML = core;
    }
  }

  function renderShareCard(root) {
    if (!root) return;
    root.innerHTML = '<div class="share-card-stage">' + shareCardHTML() + "</div>";
    if (window.MP_Achievements)
      MP_Achievements.renderShareHighlights(root.querySelector("[data-share-pride]"));
  }

  function applyDOM() {
    document.querySelectorAll("[data-passport]").forEach((root) => {
      render(root, { teaser: root.dataset.passport === "teaser" });
    });
    document.querySelectorAll("[data-share-card]").forEach(renderShareCard);
  }

  function init() {
    applyDOM({});
    window.addEventListener("mp:lang", () => applyDOM({}));
    window.addEventListener("mp:sport", () => applyDOM({}));
  }

  return { render, renderShareCard, applyDOM, init };
})();
