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

function extractScreenIds(appJs) {
  const m = appJs.match(/const screenIds = \[([\s\S]*?)\];/);
  if (!m) throw new Error("screenIds not found");
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

function findNestedScreens(proto) {
  const start = proto.indexOf('id="proto-frame"');
  if (start < 0) return [];
  const chunk = proto.slice(start, proto.indexOf("<!-- /proto-frame -->"));
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

const appJs = fs.readFileSync(path.join(MOCKUPS, "app.js"), "utf8");
const proto = fs.readFileSync(path.join(MOCKUPS, "prototype.html"), "utf8");
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

console.log("Gallery verification");
console.log("==================");
console.log(`Screens in app.js: ${screenIds.length}`);
console.log(`Design notes defined: ${Object.keys(notes).length}`);
console.log(`Hydration handlers: ${hydrateScreens.length}`);

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

if (nestedScreens.length) {
  console.log("\nNested screens (hidden when parent inactive):");
  nestedScreens.forEach((n) => console.log(`  ${n.child} inside ${n.parent}`));
}

const ok =
  !missingDom.length &&
  !missingNotes.length &&
  !weakNotes.length &&
  !genericPurpose.length &&
  !nestedScreens.length;

console.log(ok ? "\n✓ All checks passed" : "\n✗ Issues found");
process.exit(ok ? 0 : 1);
