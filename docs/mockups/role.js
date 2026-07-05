/* Match Point — player community membership, approval status & admin role */
window.MP_Role = (function () {
  const STORAGE_KEY = "mp-club";
  // status: "none" | "pending" | "active" | "rejected"
  let state = {
    status: "none",
    isClubAdmin: false,
    clubName: "",
    communities: [],
  };

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const status = ["none", "pending", "active", "rejected"].includes(s.status)
        ? s.status
        : s.hasClub
          ? "active"
          : "none";
      state = {
        status,
        isClubAdmin: !!s.isClubAdmin,
        clubName: s.clubName || "",
        communities: Array.isArray(s.communities) ? s.communities : [],
      };
      if (state.status === "active" && state.clubName && !state.communities.length) {
        state.communities = [{ name: state.clubName, admin: state.isClubAdmin }];
      }
    } catch (_) {
      state = { status: "none", isClubAdmin: false, clubName: "", communities: [] };
    }
  }

  function save() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        hasClub: state.status === "active",
      }),
    );
  }

  function isMemberOf(name) {
    if (state.status !== "active") return false;
    if (state.clubName === name) return true;
    return state.communities.some((c) => c.name === name);
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
    document.querySelectorAll("[data-show-if-club-rejected]").forEach((el) => {
      el.hidden = state.status !== "rejected";
    });
    document.querySelectorAll("[data-show-if-club-admin]").forEach((el) => {
      el.hidden = !(active && state.isClubAdmin);
    });

    document.querySelectorAll(".club-name-dynamic").forEach((el) => {
      if (state.clubName) el.textContent = state.clubName;
    });

    document.querySelectorAll("[data-multi-communities]").forEach((el) => {
      if (!active || !state.communities.length) {
        el.innerHTML = "";
        return;
      }
      el.innerHTML = state.communities
        .map(
          (c) =>
            `<div class="community-row compact"><div class="avatar avatar-sm">${c.name.slice(0, 2).toUpperCase()}</div><div class="community-row-body"><strong>${c.name}</strong>${c.admin ? ' <span class="badge badge-success">Admin</span>' : ""}</div></div>`,
        )
        .join("");
    });

    window.dispatchEvent(new CustomEvent("mp:role", { detail: { ...state } }));
  }

  function requestClub(opts) {
    state.status = "pending";
    state.isClubAdmin = false;
    state.clubName = (opts && opts.name) || "Komunitasku";
    save();
    apply();
    if (window.MP_Approval) {
      MP_Approval.submit({
        type: "community_create",
        label: state.clubName,
        meta: "Komunitas baru · menunggu review",
      });
    }
  }

  function approveClub() {
    if (state.status === "none") return;
    state.status = "active";
    state.isClubAdmin = true;
    if (!state.communities.find((c) => c.name === state.clubName)) {
      state.communities.push({ name: state.clubName, admin: true });
    }
    save();
    apply();
  }

  function rejectClub(note) {
    state.status = "rejected";
    state.isClubAdmin = false;
    state.rejectNote = note || "";
    save();
    apply();
  }

  function resubmitClub() {
    state.status = "pending";
    save();
    apply();
  }

  function setClub(opts) {
    state.status = "active";
    state.isClubAdmin = opts.admin !== false;
    state.clubName = opts.name || "Komunitasku";
    if (!state.communities.find((c) => c.name === state.clubName)) {
      state.communities.push({ name: state.clubName, admin: state.isClubAdmin });
    }
    save();
    apply();
  }

  function joinClub(opts) {
    const name = (opts && opts.name) || "Komunitasku";
    if (!state.communities.find((c) => c.name === name)) {
      state.communities.push({ name, admin: false });
    }
    state.status = "active";
    state.isClubAdmin = false;
    if (!state.clubName) state.clubName = name;
    save();
    apply();
  }

  function clearClub() {
    state = { status: "none", isClubAdmin: false, clubName: "", communities: [] };
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
    rejectClub,
    resubmitClub,
    clearClub,
    isMemberOf,
    get: () => ({ ...state }),
  };
})();
