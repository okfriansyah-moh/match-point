/* Match Point — player community membership, approval status & admin role */
window.MP_Role = (function () {
  const STORAGE_KEY = "mp-club";
  // status: "none" | "pending" | "active"
  let state = { status: "none", isClubAdmin: false, clubName: "" };

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const status = ["none", "pending", "active"].includes(s.status)
        ? s.status
        : s.hasClub
          ? "active"
          : "none";
      state = {
        status,
        isClubAdmin: !!s.isClubAdmin,
        clubName: s.clubName || "",
      };
    } catch (_) {
      state = { status: "none", isClubAdmin: false, clubName: "" };
    }
  }

  function save() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, hasClub: state.status === "active" }),
    );
  }

  function apply() {
    const active = state.status === "active";
    document.body.dataset.clubStatus = state.status;
    document.body.dataset.hasClub = active ? "1" : "0";
    document.body.dataset.clubAdmin = state.isClubAdmin ? "1" : "0";

    document.querySelectorAll("[data-show-if-club]").forEach((el) => {
      el.hidden = !active;
    });
    document.querySelectorAll("[data-show-if-no-club]").forEach((el) => {
      el.hidden = state.status !== "none";
    });
    document.querySelectorAll("[data-show-if-club-pending]").forEach((el) => {
      el.hidden = state.status !== "pending";
    });
    document.querySelectorAll("[data-show-if-club-admin]").forEach((el) => {
      el.hidden = !(active && state.isClubAdmin);
    });

    document.querySelectorAll(".club-name-dynamic").forEach((el) => {
      if (state.clubName) el.textContent = state.clubName;
    });

    window.dispatchEvent(new CustomEvent("mp:role", { detail: { ...state } }));
  }

  /* Community creation goes through the generic approval flow:
     requestClub() → pending → approveClub() → active (admin). */
  function requestClub(opts) {
    state.status = "pending";
    state.isClubAdmin = false;
    state.clubName = (opts && opts.name) || "Komunitasku";
    save();
    apply();
  }

  function approveClub() {
    if (state.status === "none") return;
    state.status = "active";
    state.isClubAdmin = true;
    save();
    apply();
  }

  function setClub(opts) {
    state.status = "active";
    state.isClubAdmin = opts.admin !== false;
    state.clubName = opts.name || "Komunitasku";
    save();
    apply();
  }

  function joinClub(opts) {
    state.status = "active";
    state.isClubAdmin = false;
    state.clubName = (opts && opts.name) || "Komunitasku";
    save();
    apply();
  }

  function clearClub() {
    state = { status: "none", isClubAdmin: false, clubName: "" };
    localStorage.removeItem(STORAGE_KEY);
    apply();
  }

  function init() {
    load();
    apply();
  }

  return {
    init,
    apply,
    setClub,
    joinClub,
    requestClub,
    approveClub,
    clearClub,
    get: () => ({ ...state }),
  };
})();
