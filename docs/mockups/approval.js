/* Match Point — reusable approval flow state (mockup / localStorage) */
window.MP_Approval = (function () {
  const STORAGE_KEY = "mp-approvals";

  let items = [];

  function load() {
    try {
      items = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (_) {
      items = [];
    }
    if (!items.length) seedDemo();
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function seedDemo() {
    items = [
      {
        id: "a1",
        type: "community_create",
        label: "Padel Jakarta Selatan",
        state: "pending",
        meta: "Komunitas baru · Budi Santoso",
      },
      {
        id: "a2",
        type: "featured_event",
        label: "Jakarta Padel Open — featured",
        state: "pending",
        meta: "Acara featured · Senayan Padel Club",
      },
      {
        id: "a3",
        type: "global_tournament",
        label: "Indonesia Padel Masters",
        state: "pending",
        meta: "Global Tier 1 · cross-community",
      },
      {
        id: "a4",
        type: "community_create",
        label: "Bekasi Tennis Society",
        state: "approved",
        meta: "Komunitas baru · disetujui kemarin",
      },
      {
        id: "a5",
        type: "community_create",
        label: '"Klub Judi Padel"',
        state: "rejected",
        meta: "Nama tidak pantas · ditolak",
      },
    ];
    save();
  }

  function typeBadge(type) {
    const map = {
      community_create: "🏘 Komunitas",
      featured_event: "🎯 Featured",
      global_tournament: "🌍 Global",
      club_transfer: "👑 Transfer",
      global_tier_request: "⭐ Tier",
    };
    return map[type] || type;
  }

  function stateBadge(state) {
    const map = {
      submitted: "badge-info",
      pending: "badge-pending",
      approved: "badge-success",
      rejected: "badge-danger",
    };
    return map[state] || "badge-pending";
  }

  function approve(id) {
    const item = items.find((i) => i.id === id);
    if (item) {
      item.state = "approved";
      save();
    }
    return item;
  }

  function reject(id, note) {
    const item = items.find((i) => i.id === id);
    if (item) {
      item.state = "rejected";
      item.note = note || "";
      save();
    }
    return item;
  }

  function submit(opts) {
    const item = {
      id: "a" + Date.now(),
      type: opts.type || "community_create",
      label: opts.label || "Request",
      state: "pending",
      meta: opts.meta || "",
    };
    items.unshift(item);
    save();
    return item;
  }

  function getPending() {
    return items.filter((i) => i.state === "pending");
  }

  function getAll() {
    return [...items];
  }

  function applyTrack(root, state) {
    if (!root) return;
    const nodes = root.querySelectorAll(".approval-node");
    const order = ["submitted", "pending", "approved"];
    const isRejected = state === "rejected";
    nodes.forEach((node, i) => {
      node.classList.remove("done", "current", "rejected");
      const key = order[i];
      if (isRejected && i === 1) {
        node.classList.add("rejected");
        node.textContent = node.dataset.i18nRejected
          ? window.MP_I18N?.t("approval.rejected")
          : "Ditolak";
      } else if (state === "approved" || (order.indexOf(state) > i && state !== "rejected")) {
        node.classList.add("done");
      } else if (key === state) {
        node.classList.add("current");
      }
    });
  }

  function init() {
    load();
  }

  return {
    init,
    load,
    getAll,
    getPending,
    submit,
    approve,
    reject,
    typeBadge,
    stateBadge,
    applyTrack,
  };
})();
