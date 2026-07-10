#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const MOCKUPS = path.join(__dirname, "..");
const OUT = path.join(MOCKUPS, "gallery-screens-extracted.html");

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
  });
  return out;
}

function wrapScreen(id, inner) {
  const indented = inner
    .split("\n")
    .map((line) => "                  " + line)
    .join("\n");
  return `              <div class="screen" id="screen-${id}">
                <div class="gallery-callout-wrap">
                  <div class="gallery-callout-layer" aria-hidden="true"></div>
${indented}
                </div>
              </div>`;
}

function deriveGuestDashboard(inner) {
  return inner
    .replace(
      '<div class="app-body">',
      '<div class="app-body"><div class="guest-banner" style="display:flex;padding:0.5rem 1rem;background:rgba(224,159,62,0.15);margin-bottom:0.75rem;border-radius:8px;font-size:0.85rem">👀 Guest preview — sign in for full access</div>',
    )
    .replace(
      /\bdata-guest-login\b(?![^>]*\bdata-login\b)/g,
      'data-guest-login data-login data-login-goto="1"',
    )
    .replace(/\bdata-auth-only\b(?! hidden)/g, "data-auth-only hidden")
    .replace(/\bdata-guest-only hidden\b/g, "data-guest-only")
    .replace(/\bdata-show-if-no-club data-auth-only\b/g, "data-show-if-no-club data-auth-only hidden")
    .replace(/\bhidden hidden\b/g, "hidden");
}

function deriveGuestSocial(inner) {
  return inner
    .replace(
      '<div class="app-body">',
      '<div class="app-body"><div class="guest-banner" style="display:flex;padding:0.5rem 1rem;background:rgba(224,159,62,0.15);margin-bottom:0.75rem;border-radius:8px;font-size:0.85rem">👀 Guest preview — sign in to like &amp; comment</div>',
    )
    .replace(/\bdata-feed-mode="auto"/g, 'data-feed-mode="guest"')
    .replace(/\bdata-stories-mode="auto"/g, 'data-stories-mode="guest"')
    .replace(/\s*data-feed-composer\b/g, "")
    .replace(/\bdata-auth-only\b(?! hidden)/g, "data-auth-only hidden")
    .replace(/\bhidden hidden\b/g, "hidden");
}

function addMappedScreens(lines, steps, config) {
  const byId = mapStepsById(steps);
  config.forEach(({ screenId, stepId, fallbackIndex }) => {
    const step =
      (stepId && byId[stepId]) ||
      (fallbackIndex != null ? steps[fallbackIndex] : null);
    if (step?.inner) lines.push(wrapScreen(screenId, step.inner));
  });
}

const playerHtml = fs.readFileSync(path.join(MOCKUPS, "flow/user.html"), "utf8");
const playerSteps = extractAllFlowSteps(playerHtml);
const lines = [];

addMappedScreens(lines, playerSteps, [
  { screenId: "communities", stepId: "communities" },
  { screenId: "events-feed", stepId: "events" },
  { screenId: "event-americano", stepId: "americano" },
  { screenId: "event-mexicano", stepId: "mexicano" },
  { screenId: "find-community", stepId: "find-community" },
  { screenId: "community-detail", stepId: "community-page" },
  { screenId: "event-register", stepId: "event-register" },
  { screenId: "edit-profile", stepId: "settings" },
  { screenId: "leaderboard-snapshot", stepId: "rank-snapshot" },
  { screenId: "verify-otp", stepId: "verify-otp", fallbackIndex: 18 },
  { screenId: "format-round-robin", stepId: "round-robin" },
  { screenId: "format-league", stepId: "league" },
  { screenId: "global-tournament", stepId: "global-tournament" },
  { screenId: "player-other", stepId: "player-other" },
  { screenId: "boc-fixture-detail", stepId: "boc-detail" },
  { screenId: "sparring-detail", stepId: "sparring-detail" },
  { screenId: "social-feed", stepId: "social-feed" },
  { screenId: "messages-inbox", stepId: "messages-inbox" },
  { screenId: "player-passport", stepId: "player-passport" },
  { screenId: "court-booking", stepId: "court-booking" },
  { screenId: "booking-confirm", stepId: "booking-confirm" },
  { screenId: "friends-list", stepId: "friends-list" },
  { screenId: "open-mabar-board", stepId: "open-mabar-board" },
  { screenId: "open-mabar-detail", stepId: "open-mabar-detail" },
  { screenId: "open-mabar-create", stepId: "open-mabar-create" },
  { screenId: "player-challenge", stepId: "player-challenge" },
  { screenId: "challenge-inbox", stepId: "challenge-inbox" },
  { screenId: "player-availability", stepId: "player-availability" },
  { screenId: "booking-roadmap", stepId: "booking-roadmap" },
]);

const socialStep = mapStepsById(playerSteps)["social-feed"];
if (socialStep?.inner) {
  lines.push(wrapScreen("social-feed-guest", deriveGuestSocial(socialStep.inner)));
}

const dashboardStep = mapStepsById(playerSteps).dashboard || playerSteps[1];
if (dashboardStep?.inner) {
  lines.push(wrapScreen("home-dashboard-guest", deriveGuestDashboard(dashboardStep.inner)));
}

const clubHtml = fs.readFileSync(path.join(MOCKUPS, "flow/club.html"), "utf8");
addMappedScreens(lines, extractAllFlowSteps(clubHtml), [
  { screenId: "club-admin-dashboard", fallbackIndex: 0 },
  { screenId: "club-wizard-1", fallbackIndex: 1 },
  { screenId: "club-wizard-2", fallbackIndex: 2 },
  { screenId: "club-wizard-3", fallbackIndex: 3 },
  { screenId: "club-wizard-4", fallbackIndex: 4 },
  { screenId: "club-wizard-roster", fallbackIndex: 5 },
  { screenId: "club-wizard-publish", fallbackIndex: 6 },
  { screenId: "club-registrations", fallbackIndex: 7 },
  { screenId: "club-referee-setup", fallbackIndex: 8 },
  { screenId: "club-live-referee", fallbackIndex: 9 },
  { screenId: "club-sparring-create", fallbackIndex: 11 },
]);

const platformHtml = fs.readFileSync(path.join(MOCKUPS, "flow/platform.html"), "utf8");
addMappedScreens(lines, extractAllFlowSteps(platformHtml), [
  { screenId: "platform-login", fallbackIndex: 0 },
  { screenId: "platform-approval-inbox", fallbackIndex: 2 },
  { screenId: "platform-approval-detail", fallbackIndex: 3 },
  { screenId: "platform-approval-result", fallbackIndex: 4 },
  { screenId: "platform-analytics", fallbackIndex: 6 },
  { screenId: "platform-global-wizard-1", fallbackIndex: 7 },
  { screenId: "platform-global-wizard-2", fallbackIndex: 8 },
  { screenId: "platform-global-wizard-3", fallbackIndex: 9 },
  { screenId: "platform-global-wizard-4", fallbackIndex: 10 },
  { screenId: "platform-global-wizard-5", fallbackIndex: 11 },
  { screenId: "platform-global-wizard-6", fallbackIndex: 12 },
  { screenId: "platform-global-reg", fallbackIndex: 13 },
  { screenId: "platform-global-live", fallbackIndex: 14 },
  { screenId: "platform-profile", fallbackIndex: 15 },
  { screenId: "platform-settings", fallbackIndex: 16 },
  { screenId: "platform-boc-wizard", fallbackIndex: 17 },
  { screenId: "platform-boc-fixtures", fallbackIndex: 18 },
  { screenId: "platform-overview", fallbackIndex: 1 },
  { screenId: "platform-community-pipeline", stepId: "community-pipeline", fallbackIndex: 19 },
  { screenId: "platform-moderation-inbox", stepId: "moderation-inbox", fallbackIndex: 20 },
  { screenId: "platform-graph-health", stepId: "graph-health", fallbackIndex: 21 },
]);

const out = lines.join("\n\n") + "\n";
fs.writeFileSync(OUT, out);
console.log("screens:", (out.match(/id="screen-/g) || []).length, "bytes", out.length);
