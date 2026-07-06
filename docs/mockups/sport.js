/* Match Point — multi-sport context (padel · tennis · future) */
window.MP_Sport = (function () {
  const STORAGE_KEY = "mp-sport";
  const SPORTS = ["padel", "tennis", "pickleball"];
  let current = "padel";

  const META = {
    padel: { icon: "🏓", labelId: "Padel", labelEn: "Padel" },
    tennis: { icon: "🎾", labelId: "Tennis", labelEn: "Tennis" },
    pickleball: { icon: "🥎", labelId: "Pickleball", labelEn: "Pickleball" },
  };

  function getLang() {
    return window.MP_I18N ? window.MP_I18N.getLang() : "id";
  }

  function label(sport) {
    const m = META[sport] || META.padel;
    return getLang() === "en" ? m.labelEn : m.labelId;
  }

  function apply(sport) {
    if (!SPORTS.includes(sport)) sport = "padel";
    current = sport;
    localStorage.setItem(STORAGE_KEY, sport);
    document.body.dataset.sport = sport;

    document.querySelectorAll(".sport-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.sport === sport);
      btn.setAttribute(
        "aria-selected",
        btn.dataset.sport === sport ? "true" : "false",
      );
    });

    document.querySelectorAll(".sport-pane").forEach((el) => {
      const show = el.dataset.sport === sport || el.dataset.sport === "all";
      el.hidden = !show;
    });

    document.querySelectorAll(".sport-dynamic").forEach((el) => {
      const val = el.dataset[sport];
      if (val != null) el.textContent = val;
    });

    document.querySelectorAll("[data-sport-icon]").forEach((el) => {
      el.textContent = META[sport]?.icon || "🏓";
    });

    window.dispatchEvent(new CustomEvent("mp:sport", { detail: { sport } }));
  }

  // One tap on the ball orb rotates the whole universe to the next sport
  function cycle() {
    const i = SPORTS.indexOf(current);
    apply(SPORTS[(i + 1) % SPORTS.length]);
  }

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    apply(saved && SPORTS.includes(saved) ? saved : "padel");

    document.body.addEventListener("click", (e) => {
      const mascotSwitch = e.target.closest(".mp-mascot-switch");
      if (mascotSwitch) {
        e.preventDefault();
        cycle();
        return;
      }
      const orb = e.target.closest(".sport-orb");
      if (orb) {
        e.preventDefault();
        cycle();
        return;
      }
      const btn = e.target.closest(".sport-btn");
      if (btn && btn.dataset.sport) {
        e.preventDefault();
        apply(btn.dataset.sport);
      }
    });

    window.addEventListener("mp:lang", () => apply(current));
  }

  return { init, apply, cycle, get: () => current, sports: SPORTS, label };
})();
