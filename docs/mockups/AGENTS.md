# Match Point mockups — Codex / agent scope

This directory is the **implemented product surface** for Match Point (gallery + interactive flows).

Follow **`MOCKUP-SYNC-RULE.md`** in this folder. Screen map and checklists: **`MOCKUP-SYNC.md`**.

## Surfaces

| Surface         | Entry                         | Navigation              |
| --------------- | ----------------------------- | ----------------------- |
| Gallery         | `prototype.html`              | `app.js` + `#screen-id` |
| Interactive     | `flow/user.html`, `club.html`, `platform.html` | `flow/flow.js` steps |

## Before finishing any UI change

1. Update **twin screens** on gallery and interactive (unless gallery-only / flow-only).
2. Shared logic in `rank.js`, `event-wizard.js`, `tournament.js`, `i18n.js`, `styles.css`.
3. Identical `data-*` hooks and `data-i18n` on both surfaces.
4. Run `node scripts/verify-gallery.js` from this directory (or `docs/mockups/scripts/verify-gallery.js` from repo root).
5. After `flow/*.html` changes: `node scripts/build-gallery-screens.js`.

## Local preview

```bash
python3 -m http.server 8080 --directory docs/mockups
```
