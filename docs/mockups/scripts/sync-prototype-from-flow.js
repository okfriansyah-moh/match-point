#!/usr/bin/env node
/**
 * Sync gallery prototype.html screens from interactive flow markup.
 * Does NOT modify flow/*.html — reads flow + gallery-screens-extracted.html.
 *
 * Usage: node docs/mockups/scripts/sync-prototype-from-flow.js
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const MOCKUPS = path.join(__dirname, "..");
const PROTOTYPE = path.join(MOCKUPS, "prototype.html");
const EXTRACTED = path.join(MOCKUPS, "gallery-screens-extracted.html");
const USER_FLOW = path.join(MOCKUPS, "flow/user.html");

execSync("node docs/mockups/scripts/build-gallery-screens.js", {
  cwd: path.join(MOCKUPS, "..", ".."),
  stdio: "inherit",
});

function extractAllFlowSteps(html) {
  const steps = [];
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
    const inner = block
      .replace(/^<div class="flow-step[^"]*"[^>]*>\s*/s, "")
      .replace(/<\/div>\s*$/s, "");
    const stepIdMatch = start.openTag.match(/data-step="([^"]+)"/);
    steps.push({
      index: i,
      stepId: stepIdMatch ? stepIdMatch[1] : null,
      inner: inner.trim(),
    });
  }

  return steps;
}

function mapStepsById(steps) {
  const out = {};
  steps.forEach((step) => {
    if (step.stepId) out[step.stepId] = step;
    out["#" + step.index] = step;
  });
  return out;
}

function extractScreenBlock(html, screenId) {
  const marker = `id="screen-${screenId}"`;
  const start = html.indexOf(marker);
  if (start < 0) return null;
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

function listExtractedScreenIds(html) {
  return [...html.matchAll(/<div class="screen" id="screen-([^"]+)">/g)].map(
    (m) => m[1],
  );
}

function patchGalleryNav(html, screenId) {
  let out = html;
  if (screenId === "share-card") {
    out = out.replace(
      /data-flow-back="return"/g,
      'data-goto="player-passport"',
    );
  }
  if (screenId === "player-passport") {
    out = out.replace(/data-flow-goto="6"/g, 'data-goto="profile"');
  }
  if (screenId === "endorsement") {
    out = out.replace(/data-flow-back="6"/g, 'data-goto="profile"');
  }
  return out;
}

function wrapGalleryScreen(screenId, inner) {
  const patched = patchGalleryNav(inner, screenId);
  const indented = patched
    .split("\n")
    .map((line) => "                  " + line)
    .join("\n");
  return (
    `              <div class="screen" id="screen-${screenId}">\n` +
    `                <div class="gallery-callout-wrap">\n` +
    `                  <div class="gallery-callout-layer" aria-hidden="true"></div>\n` +
    `${indented}\n` +
    `                </div>\n` +
    `              </div>`
  );
}

function replaceScreenInPrototype(proto, screenId, newBlock) {
  const existing = extractScreenBlock(proto, screenId);
  if (!existing) {
    return { proto, replaced: false, reason: "missing in prototype" };
  }
  if (existing === newBlock) {
    return { proto, replaced: false, reason: "unchanged" };
  }
  return {
    proto: proto.replace(existing, newBlock),
    replaced: true,
    reason: "updated",
  };
}

const extractedHtml = fs.readFileSync(EXTRACTED, "utf8");
const userHtml = fs.readFileSync(USER_FLOW, "utf8");
const userSteps = mapStepsById(extractAllFlowSteps(userHtml));

let proto = fs.readFileSync(PROTOTYPE, "utf8");
const results = [];

const extractedIds = listExtractedScreenIds(extractedHtml);
extractedIds.forEach((screenId) => {
  let block = extractScreenBlock(extractedHtml, screenId);
  if (!block) return;
  block = patchGalleryNav(block, screenId);
  const r = replaceScreenInPrototype(proto, screenId, block);
  proto = r.proto;
  results.push({ screenId, source: "extracted", ...r });
});

/** Flow steps with gallery twins not fully covered by build-gallery-screens.js */
const FLOW_ONLY = [
  { screenId: "community-create", stepId: "create-club" },
  { screenId: "profile", stepId: "profile" },
  { screenId: "endorsement", stepId: "endorse" },
  { screenId: "share-card", stepId: "share" },
  { screenId: "home-dashboard", stepId: "dashboard" },
  { screenId: "leaderboard", stepId: "leaderboard" },
];

FLOW_ONLY.forEach(({ screenId, stepId }) => {
  const step = userSteps[stepId];
  if (!step?.inner) {
    results.push({ screenId, source: "flow", replaced: false, reason: "missing step" });
    return;
  }
  const block = wrapGalleryScreen(screenId, step.inner);
  const r = replaceScreenInPrototype(proto, screenId, block);
  proto = r.proto;
  results.push({ screenId, source: "flow", ...r });
});

fs.writeFileSync(PROTOTYPE, proto);

const updated = results.filter((r) => r.replaced);
const skipped = results.filter((r) => !r.replaced);

console.log("sync-prototype-from-flow");
console.log("=========================");
console.log(`Updated: ${updated.length}`);
updated.forEach((r) => console.log(`  ✓ ${r.screenId} (${r.source})`));
if (skipped.length) {
  console.log(`Skipped: ${skipped.length}`);
  skipped.forEach((r) =>
    console.log(`  · ${r.screenId} (${r.source}) — ${r.reason}`),
  );
}
