#!/usr/bin/env node
/**
 * Verify gallery prototype completeness:
 * - every screenId in app.js has design notes
 * - every note has >= 2 components with anchors
 * - every screen element exists in prototype.html
 */
const fs = require("fs");
const path = require("path");

const MOCKUPS = path.join(__dirname, "..");
const PROTOTYPE_HTML = fs.readFileSync(path.join(MOCKUPS, "prototype.html"), "utf8");
const EXTRACTED_HTML = fs.readFileSync(
  path.join(MOCKUPS, "gallery-screens-extracted.html"),
  "utf8",
);
const USER_FLOW_HTML = fs.readFileSync(path.join(MOCKUPS, "flow/user.html"), "utf8");
const CLUB_FLOW_HTML = fs.readFileSync(path.join(MOCKUPS, "flow/club.html"), "utf8");
const PLATFORM_FLOW_HTML = fs.readFileSync(
  path.join(MOCKUPS, "flow/platform.html"),
  "utf8",
);

function extractScreenIds(appJs) {
  const m = appJs.match(/const screenIds = \[([\s\S]*?)\];/);
  if (!m) throw new Error("screenIds not found");
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

function findOrphanScreens(proto) {
  const frameStart = proto.indexOf('id="proto-frame"');
  const designPanel = proto.indexOf('id="proto-design-panel"');
  if (frameStart < 0 || designPanel < 0) return [];
  const chunk = proto.slice(frameStart, designPanel);
  const inFrame = new Set(
    [...chunk.matchAll(/id="(screen-[^"]+)"/g)].map((m) => m[1]),
  );
  const orphans = [];
  for (const id of screenIds) {
    if (!inFrame.has("screen-" + id)) orphans.push(id);
  }
  return orphans;
}

function findNestedScreens(proto) {
  const start = proto.indexOf('id="proto-frame"');
  if (start < 0) return [];
  const designPanel = proto.indexOf('id="proto-design-panel"');
  const chunk = proto.slice(start, designPanel > start ? designPanel : undefined);
  const re = /<div class="screen[^"]*" id="(screen-[^"]+)">|<div[^>]*>|<\/div>/g;
  let depth = 0;
  const stack = [];
  const nested = [];
  let m;
  while ((m = re.exec(chunk))) {
    if (m[0].startsWith('<div class="screen')) {
      if (stack.length) nested.push({ child: m[1], parent: stack[stack.length - 1].id });
      stack.push({ id: m[1], depth });
    } else if (m[0] === "</div>") {
      depth--;
      while (stack.length && stack[stack.length - 1].depth > depth) stack.pop();
    } else {
      depth++;
    }
  }
  return nested;
}

function loadNotesData() {
  const g = { window: {} };
  const run = (file) => {
    const src = fs.readFileSync(path.join(MOCKUPS, file), "utf8");
    // eslint-disable-next-line no-new-func
    new Function("window", src)(g.window);
  };
  run("gallery-design-notes-screens.js");
  run("gallery-design-notes-data.js");
  return g.window.MP_GalleryNotesData?.screens || {};
}

function extractFlowSteps(html) {
  const steps = {};
  const re = /<div class="flow-step[^"]*"[^>]*>/g;
  let match;
  const starts = [];

  while ((match = re.exec(html)) !== null) {
    starts.push({ index: match.index, openTag: match[0] });
  }

  for (let i = 0; i < starts.length; i++) {
    const start = starts[i];
    const slice = html.slice(start.index);
    let depth = 0;
    let end = 0;
    let pos = 0;

    while (pos < slice.length) {
      const nextOpen = slice.slice(pos).search(/<div[\s>]/);
      const nextClose = slice.slice(pos).search(/<\/div>/);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        pos += nextOpen + 4;
      } else {
        depth--;
        pos += nextClose + 6;
        if (depth === 0) {
          end = pos;
          break;
        }
      }
    }

    const block = slice.slice(0, end);
    const stepIdMatch = start.openTag.match(/data-step="([^"]+)"/);
    if (stepIdMatch) steps[stepIdMatch[1]] = block;
    steps["#" + i] = block; // index alias for steps without data-step
  }

  return steps;
}

function extractScreen(html, screenId) {
  const marker = `id="screen-${screenId}"`;
  const start = html.indexOf(marker);
  if (start < 0) return "";
  const divStart = html.lastIndexOf('<div class="screen"', start);
  const slice = html.slice(divStart);
  let depth = 0;
  let end = 0;
  let pos = 0;

  while (pos < slice.length) {
    const nextOpen = slice.slice(pos).search(/<div[\s>]/);
    const nextClose = slice.slice(pos).search(/<\/div>/);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos += nextOpen + 4;
    } else {
      depth--;
      pos += nextClose + 6;
      if (depth === 0) {
        end = pos;
        break;
      }
    }
  }

  return slice.slice(0, end);
}

function selectorNeedle(selector) {
  if (selector.startsWith("#")) return `id="${selector.slice(1)}"`;
  if (selector.startsWith("[")) return selector.slice(1, -1);
  if (selector.startsWith(".")) return selector.slice(1);
  return selector;
}

const appJs = fs.readFileSync(path.join(MOCKUPS, "app.js"), "utf8");
const proto = PROTOTYPE_HTML;
const screenIds = extractScreenIds(appJs);
let notes;
try {
  notes = loadNotesData();
} catch (e) {
  console.error("FAIL load notes:", e.message);
  process.exit(1);
}

const missingNotes = [];
const weakNotes = [];
const missingDom = [];
const genericPurpose = [];

for (const id of screenIds) {
  if (!proto.includes(`id="screen-${id}"`)) missingDom.push(id);
  const note = notes[id];
  if (!note) {
    missingNotes.push(id);
    continue;
  }
  const comps = note.components || [];
  if (comps.length < 2) weakNotes.push(id);
  const purposeEn = note.purpose?.en || "";
  if (/see mockup components/i.test(purposeEn)) genericPurpose.push(id);
}

const hydrateJs = fs.readFileSync(path.join(MOCKUPS, "gallery-hydrate.js"), "utf8");
const hydrateScreens = [...hydrateJs.matchAll(/"([a-z0-9-]+)":\s*\(\)/g)].map((m) => m[1]);

const nestedScreens = findNestedScreens(proto);
const orphanScreens = findOrphanScreens(proto);
const userSteps = extractFlowSteps(USER_FLOW_HTML);
const syncIssues = [];

const syncChecks = [
  {
    screenId: "events-feed",
    sourceStep: "events",
    targetHtml: EXTRACTED_HTML,
    selectors: ["[data-events-feed]", '[data-event-filter="live"]', "[data-events-list]"],
  },
  {
    screenId: "event-register",
    sourceStep: "event-register",
    targetHtml: EXTRACTED_HTML,
    selectors: [
      "[data-eligibility-panel]",
      "[data-skill-value]",
      "[data-skill-reliability]",
      "#reg-actions",
    ],
  },
  {
    screenId: "home-dashboard-guest",
    sourceStep: "dashboard",
    targetHtml: EXTRACTED_HTML,
    selectors: [
      "[data-guest-login]",
      "[data-guest-only]",
      "[data-show-if-club-pending]",
      '[data-flow-goto="14"]',
    ],
    targetOnlySelectors: [".guest-banner", "[data-login]", '[data-login-goto="1"]'],
  },
  {
    screenId: "home-dashboard-guest",
    sourceStep: "dashboard",
    targetHtml: PROTOTYPE_HTML,
    selectors: [
      "[data-guest-login]",
      "[data-guest-only]",
      "[data-show-if-club-pending]",
      '[data-flow-goto="14"]',
    ],
    targetOnlySelectors: [".guest-banner", "[data-login]", '[data-login-goto="1"]'],
  },
  {
    screenId: "home-dashboard",
    sourceStep: "dashboard",
    targetHtml: PROTOTYPE_HTML,
    selectors: [
      "[data-guest-login]",
      "[data-show-if-club-pending]",
      '[data-flow-goto="2"]',
      '[data-flow-goto="14"]',
      '[data-flow-goto="3"]',
    ],
  },
  {
    screenId: "leaderboard",
    sourceStep: "leaderboard",
    targetHtml: PROTOTYPE_HTML,
    selectors: [
      "[data-tabs]",
      '[data-tab="global"]',
      '[data-tab-pane="global"]',
      "[data-player-profile]",
      '[data-flow-goto="24"]',
    ],
  },
  {
    screenId: "social-feed",
    sourceStep: "social-feed",
    targetHtml: PROTOTYPE_HTML,
    selectors: ["[data-social-feed]", "[data-social-stories]", "data-feed-composer"],
  },
  {
    screenId: "player-passport",
    sourceStep: "player-passport",
    targetHtml: PROTOTYPE_HTML,
    selectors: ["[data-passport]", "[data-achievements]", "[data-friends-list]"],
  },
  {
    screenId: "club-admin-dashboard",
    sourceSteps: extractFlowSteps(CLUB_FLOW_HTML),
    sourceStep: "#0",
    targetHtml: PROTOTYPE_HTML,
    selectors: ["[data-hq-kpis]", "[data-hq-grid]"],
  },
  {
    screenId: "platform-overview",
    sourceSteps: extractFlowSteps(PLATFORM_FLOW_HTML),
    sourceStep: "#1",
    targetHtml: PROTOTYPE_HTML,
    selectors: ["[data-eco-kpis]", "[data-eco-loops]", "[data-eco-pipeline-counts]"],
  },
];

syncChecks.forEach((check) => {
  const source = (check.sourceSteps || userSteps)[check.sourceStep];
  const target = extractScreen(check.targetHtml, check.screenId);
  if (!source) {
    syncIssues.push(`${check.screenId}: missing flow step "${check.sourceStep}"`);
    return;
  }
  if (!target) {
    syncIssues.push(`${check.screenId}: missing target screen`);
    return;
  }
  check.selectors.forEach((selector) => {
    const needle = selectorNeedle(selector);
    if (!source.includes(needle)) {
      syncIssues.push(`${check.screenId}: flow step missing ${selector}`);
    } else if (!target.includes(needle)) {
      syncIssues.push(`${check.screenId}: target missing ${selector}`);
    }
  });
  (check.targetOnlySelectors || []).forEach((selector) => {
    const needle = selectorNeedle(selector);
    if (!target.includes(needle)) {
      syncIssues.push(`${check.screenId}: target missing ${selector}`);
    }
  });
});

console.log("Gallery verification");
console.log("==================");
console.log(`Screens in app.js: ${screenIds.length}`);
console.log(`Design notes defined: ${Object.keys(notes).length}`);
console.log(`Hydration handlers: ${hydrateScreens.length}`);
console.log(`Sync checks: ${syncChecks.length}`);

if (missingDom.length) {
  console.log("\nMissing DOM (#screen-*):", missingDom.join(", "));
}
if (missingNotes.length) {
  console.log("\nMissing design notes:", missingNotes.join(", "));
}
if (weakNotes.length) {
  console.log("\nWeak notes (<2 callouts):", weakNotes.join(", "));
}
if (genericPurpose.length) {
  console.log("\nGeneric stub purpose:", genericPurpose.join(", "));
}

const scripts = ["gallery-design-notes-screens.js", "gallery-hydrate.js"];
for (const s of scripts) {
  if (!proto.includes(`src="${s}"`)) {
    console.log(`\nWARN: ${s} not loaded in prototype.html`);
  }
}

if (orphanScreens.length) {
  console.log("\nScreens outside #proto-frame:", orphanScreens.join(", "));
}
if (nestedScreens.length) {
  console.log("\nNested screens (hidden when parent inactive):");
  nestedScreens.forEach((n) => console.log(`  ${n.child} inside ${n.parent}`));
}
if (syncIssues.length) {
  console.log("\nSync issues:");
  syncIssues.forEach((issue) => console.log(`  ${issue}`));
}

const ok =
  !missingDom.length &&
  !missingNotes.length &&
  !weakNotes.length &&
  !genericPurpose.length &&
  !orphanScreens.length &&
  !nestedScreens.length &&
  !syncIssues.length;

console.log(ok ? "\n✓ All checks passed" : "\n✗ Issues found");
process.exit(ok ? 0 : 1);
