#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const MOCKUPS = path.join(__dirname, "..");
const OUT = path.join(MOCKUPS, "gallery-screens-extracted.html");

function extractAllFlowSteps(html) {
  const parts = [];
  const re = /<div class="flow-step[^"]*"[^>]*>/g;
  let match;
  const starts = [];
  while ((match = re.exec(html)) !== null) {
    starts.push(match.index);
  }
  for (let i = 0; i < starts.length; i++) {
    const start = starts[i];
    const slice = html.slice(start);
    let depth = 0;
    let end = 0;
    const openRe = /<div[\s>]/g;
    const closeRe = /<\/div>/g;
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
    const inner = block.replace(/^<div class="flow-step[^"]*"[^>]*>\s*/s, "").replace(/<\/div>\s*$/s, "");
    parts.push(inner.trim());
  }
  return parts;
}

function wrapScreen(id, inner) {
  const indented = inner
    .split("\n")
    .map((l) => "                  " + l)
    .join("\n");
  return `              <div class="screen" id="screen-${id}">
                <div class="gallery-callout-wrap">
                  <div class="gallery-callout-layer" aria-hidden="true"></div>
${indented}
                </div>
              </div>`;
}

const userHtml = fs.readFileSync(path.join(MOCKUPS, "flow/user.html"), "utf8");
const userIds = [
  null, null, null, null, null, null, null, null, null,
  "events-feed", "event-americano", "event-mexicano", null,
  "find-community", null, "event-register", null, "verify-otp",
  "format-round-robin", "format-league", "global-tournament", "player-other",
  null, null, "boc-fixture-detail", "sparring-detail",
];
const userSteps = extractAllFlowSteps(userHtml);
let out = "";
userSteps.forEach((inner, i) => {
  const id = userIds[i];
  if (id) out += wrapScreen(id, inner) + "\n\n";
});

let dash = userSteps[1];
if (dash) {
  const guestDash = dash.replace(
    '<div class="app-body">',
    '<div class="app-body"><div class="guest-banner" style="display:flex;padding:0.5rem 1rem;background:rgba(224,159,62,0.15);margin-bottom:0.75rem;border-radius:8px;font-size:0.85rem">👀 Guest preview — sign in for full access</div>',
  );
  out += wrapScreen("home-dashboard-guest", guestDash) + "\n\n";
}

const clubHtml = fs.readFileSync(path.join(MOCKUPS, "flow/club.html"), "utf8");
const clubIds = [
  "club-admin-dashboard", "club-wizard-1", "club-wizard-2", "club-wizard-3",
  "club-wizard-4", "club-wizard-roster", "club-wizard-publish", "club-registrations",
  "club-referee-setup", "club-live-referee", "tournament-bracket-club", "club-sparring-create",
];
extractAllFlowSteps(clubHtml).forEach((inner, i) => {
  const id = clubIds[i];
  if (id && id !== "tournament-bracket-club") out += wrapScreen(id, inner) + "\n\n";
});

const platHtml = fs.readFileSync(path.join(MOCKUPS, "flow/platform.html"), "utf8");
const platIds = [
  "platform-login", null, "platform-approval-inbox", "platform-approval-detail",
  "platform-approval-result", null, "platform-analytics",
  "platform-global-wizard-1", "platform-global-wizard-2", "platform-global-wizard-3",
  "platform-global-wizard-4", "platform-global-wizard-5", "platform-global-wizard-6",
  "platform-global-reg", "platform-global-live", "platform-profile", "platform-settings",
  "platform-boc-wizard", "platform-boc-fixtures",
];
extractAllFlowSteps(platHtml).forEach((inner, i) => {
  const id = platIds[i];
  if (id) out += wrapScreen(id, inner) + "\n\n";
});

fs.writeFileSync(OUT, out);
console.log("screens:", (out.match(/id="screen-/g) || []).length, "bytes", out.length);
