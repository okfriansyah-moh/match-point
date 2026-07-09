# Match Point mockup sync — Gallery ↔ Interactive

This doc is the source of truth for keeping **gallery** and **interactive flow** mockups aligned.

### Agent rules (keep in sync)

| Tool | Location |
| ---- | -------- |
| **Canonical** | `docs/mockups/MOCKUP-SYNC-RULE.md` |
| Cursor | `.cursor/rules/match-point-mockup-sync.mdc` |
| GitHub Copilot | `.github/copilot-instructions.md` + `.github/instructions/match-point-mockup-sync.instructions.md` |
| Codex | `AGENTS.md`, `docs/mockups/AGENTS.md`, `.codex/skills/match-point-mockup-sync/SKILL.md` |
| Claude Code | `CLAUDE.md`, `.claude/rules/match-point-mockup-sync.md` |

## Surfaces

| Mode        | Open                                                     | Nav                                | Chrome                                  |
| ----------- | -------------------------------------------------------- | ---------------------------------- | --------------------------------------- |
| Gallery     | `prototype.html`                                         | Left nav + `#screen-id` (`app.js`) | `gallery-chrome.js`, design notes panel |
| Interactive | `flow/user.html`, `flow/club.html`, `flow/platform.html` | Step index (`flow/flow.js`)        | Injected top/bottom nav in `flow.js`    |

Hub links both modes: `index.html`.

## Shared assets (change once)

| File                             | Role                                                                          |
| -------------------------------- | ----------------------------------------------------------------------------- |
| `rank.js`                        | MP Rating, Mabar/Global pts, eligibility, `data-sport-pts` / `data-mp-rating` |
| `event-wizard.js`                | Tournament creation state + gallery wizard clicks                             |
| `flow/flow.js`                   | Interactive clicks, step nav, `MP_Rank.applyDOM()`                            |
| `tournament.js`                  | Event/bracket engine                                                          |
| `i18n.js`                        | All user-facing strings (EN + ID)                                             |
| `styles.css`                     | Shared visual system                                                          |
| `sport.js`, `gallery-hydrate.js` | Sport switch, screen hydration                                                |

## Screen map

Gallery screens use `id="screen-{name}"` in `prototype.html`. Interactive uses `.flow-step` index in each flow HTML file.

### Player (`flow/user.html`)

| Gallery `screen-*`     | Flow step (0-based)       | Notes                                               |
| ---------------------- | ------------------------- | --------------------------------------------------- |
| `home-dashboard`       | 1                         | **Dual-maintained** — same hero, sport cards, Top 5 |
| `home-dashboard-guest` | 1 + guest banner          | Derived by `build-gallery-screens.js`               |
| `leaderboard`          | `data-step="leaderboard"` | **Dual-maintained** — Mabar/Global tabs             |
| `communities`          | 9                         | Community directory / membership state              |
| `events-feed`          | 10                        |                                                     |
| `event-americano`      | 11                        |                                                     |
| `event-mexicano`       | 12                        |                                                     |
| `find-community`       | 14                        |                                                     |
| `community-detail`     | 15 (`data-step="community-page"`) | Public spotlight + join state                |
| `event-register`       | 16                        | Eligibility + bracket display                       |
| `auth-register`        | 17 (`data-step="register"`) | Sign-up twin in interactive journey               |
| `verify-otp`           | 18                        | DOM order realigned with steps config (2026-07-09)  |
| `format-round-robin`   | 19                        |                                                     |
| `format-league`        | 20                        |                                                     |
| `global-tournament`    | 21                        |                                                     |
| `player-other`         | 22                        |                                                     |
| `edit-profile`         | 23 (`data-step="settings"`) | Account/settings twin                            |
| `leaderboard-snapshot` | 24 (`data-step="rank-snapshot"`) | Snapshot drill-down                           |
| `boc-fixture-detail`   | 25                        |                                                     |
| `sparring-detail`      | 26                        |                                                     |
| `social-feed`          | 27                        | **Derived** — shared renderer `social-feed.js`      |
| `social-feed-guest`    | 27 + guest transform      | Derived by `build-gallery-screens.js` (`deriveGuestSocial`) |
| `messages-inbox`       | 28                        | Derived                                             |
| `player-passport`      | 29                        | Derived — `passport.js` + `achievements.js`         |
| `court-booking`        | 30                        | Derived — `booking-mock.js`                         |
| `booking-confirm`      | 31                        | Derived                                             |

### Club admin (`flow/club.html`)

| Gallery `screen-*`                      | Flow step |
| --------------------------------------- | --------- |
| `club-admin-dashboard`                  | 0         |
| `club-wizard-1` … `club-wizard-publish` | 1–6       |
| `club-registrations`                    | 7         |
| `club-referee-setup`                    | 8         |
| `club-live-referee`                     | 9         |
| `club-sparring-create`                  | 11        |

### Platform admin (`flow/platform.html`)

| Gallery `screen-*`               | Flow step |
| -------------------------------- | --------- |
| `platform-login`                 | 0         |
| `platform-approval-inbox`        | 2         |
| `platform-approval-detail`       | 3         |
| `platform-approval-result`       | 4         |
| `platform-analytics`             | 6         |
| `platform-global-wizard-1` … `6` | 7–12      |
| `platform-global-reg`            | 13        |
| `platform-global-live`           | 14        |
| `platform-profile`               | 15        |
| `platform-settings`              | 16        |
| `platform-boc-wizard`            | 17        |
| `platform-boc-fixtures`          | 18        |
| `platform-overview`              | 1         |
| `platform-community-pipeline`    | 19 (`data-step="community-pipeline"`) |
| `platform-moderation-inbox`      | 20 (`data-step="moderation-inbox"`)   |
| `platform-graph-health`          | 21 (`data-step="graph-health"`)       |

### Gallery-only (no flow twin)

`auth-login`, `auth-register`, `profile`, `profile-provisional`, `profile-endorse-empty`, `edit-profile`, `communities`, `community-create`, `community-detail`, `community-members`, `admin-transfer`, `leaderboard-official`, `leaderboard-snapshot`, `submit-match`, `match-*`, `my-matches`, `player-performance`, `tournament`, `tournament-create`, `tournament-bracket`, `endorsement`, `share-card`, `admin`, `admin-*`, `errors`, `social-stories`, `social-post-detail`, `social-compose`, `messages-thread`, `friends-list`, `player-highlights`, `passport-teaser-guest`

### Four-journey OS modules (shared renderers — change once)

| File | Consumers |
| --- | --- |
| `social-feed.js` | social-feed (member/guest), dashboard highlight strips, community-detail feed, platform moderation queue seed |
| `social-graph.js` | friends-list, passport, messages |
| `home-pulse.js` / `guest-pulse.js` | member/guest dashboard halves |
| `passport.js` + `achievements.js` | player-passport, passport-teaser-guest, guest home teaser |
| `community-hq.js` | club.html step 0 + derived `club-admin-dashboard` |
| `booking-mock.js` | court-booking, booking-confirm |
| `platform-ecosystem.js` | platform overview + pipeline/moderation/graph-health |

Gallery hydration for all of these goes through `hydrateOSModules(guest)` in `gallery-hydrate.js`.

When these change, check whether interactive flows should link to them or mirror copy — but no automatic HTML twin exists.

## Change checklist

When editing **any** file under `docs/mockups/`:

- [ ] Listed twin screen(s) in table above — updated all copies?
- [ ] New strings added to `i18n.js` (EN + ID)?
- [ ] New interactions wired in **both** `event-wizard.js`/`app.js` (gallery) and `flow/flow.js` (interactive) if needed?
- [ ] Same `data-*` attributes and demo values on both surfaces?
- [ ] `gallery-design-notes-data.js` updated for gallery screens?
- [ ] `node docs/mockups/scripts/verify-gallery.js` passes?
- [ ] If `flow/*.html` changed: `node docs/mockups/scripts/build-gallery-screens.js`

## Navigation cheat sheet

| Gallery                      | Interactive                             |
| ---------------------------- | --------------------------------------- |
| `data-goto="home-dashboard"` | `data-flow-goto="1"` (player dashboard) |
| `data-goto="leaderboard"`    | flow step `leaderboard`                 |
| `data-screen` nav links      | N/A (step-based)                        |

## Regeneration

```bash
node docs/mockups/scripts/build-gallery-screens.js   # flow HTML → gallery-screens-extracted.html
node docs/mockups/scripts/verify-gallery.js          # 91 screens + design notes + sync checks
```

`gallery-screens-extracted.html` is a build artifact from flow steps. Primary gallery content lives inline in `prototype.html` — **do not assume** running the build updates `prototype.html`; sync twins manually.
