---
name: match-point-mockup-sync
description: >-
  Keep Match Point gallery (prototype.html) and interactive flows (flow/*.html)
  design-aligned. Use when editing anything under docs/mockups/.
---

# Match Point — Gallery ↔ Interactive sync

Read and follow **`docs/mockups/MOCKUP-SYNC-RULE.md`**. Screen map: **`docs/mockups/MOCKUP-SYNC.md`**.

## When to use

- Editing `docs/mockups/prototype.html` or `docs/mockups/flow/*.html`
- Changing mockup JS (`rank.js`, `flow/flow.js`, `i18n.js`, etc.)
- Adding screens, copy, ranking UI, or navigation in mockups

## Surfaces

| Surface         | Entry                                                       | Navigation                                |
| --------------- | ----------------------------------------------------------- | ----------------------------------------- |
| **Gallery**     | `docs/mockups/prototype.html`                               | `#screen-id` hash via `app.js`            |
| **Interactive** | `docs/mockups/flow/user.html`, `club.html`, `platform.html` | `data-flow-goto` steps via `flow/flow.js` |

## Mandatory checklist

1. Update twin screens on gallery **and** interactive (unless gallery-only / flow-only).
2. Shared logic in `rank.js`, `event-wizard.js`, `tournament.js`, `i18n.js`, `styles.css`.
3. Identical `data-*` hooks, demo values, `data-i18n` on both surfaces.
4. Gallery: `data-goto`. Flow: `data-flow-goto`. Auth: `data-login` + `data-login-goto="1"`.
5. New strings → `i18n.js` (EN + ID).
6. Gallery changes → `gallery-design-notes-data.js`.
7. `node docs/mockups/scripts/verify-gallery.js`
8. After `flow/*.html` changes → `node docs/mockups/scripts/build-gallery-screens.js`

## High-risk twins

- `home-dashboard` ↔ `flow/user.html` step 1
- `leaderboard` ↔ flow `leaderboard` step
- Club / platform wizards ↔ `flow/club.html` / `flow/platform.html`
- Events, register, format screens ↔ matching `flow/user.html` steps

`prototype.html` and `flow/*.html` are **manually synced** — build script does not update the full gallery.
