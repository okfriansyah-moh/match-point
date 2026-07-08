---
applyTo: "docs/mockups/**"
---

# Match Point — Gallery ↔ Interactive sync

Follow **`docs/mockups/MOCKUP-SYNC-RULE.md`** (canonical). Screen map: **`docs/mockups/MOCKUP-SYNC.md`**.

## Surfaces

| Surface         | Entry                                                       | Navigation                                |
| --------------- | ----------------------------------------------------------- | ----------------------------------------- |
| **Gallery**     | `docs/mockups/prototype.html`                               | `#screen-id` hash via `app.js`            |
| **Interactive** | `docs/mockups/flow/user.html`, `club.html`, `platform.html` | `data-flow-goto` steps via `flow/flow.js` |

## Mandatory before finishing any mockup UI change

1. **Identify twins** — Update gallery **and** interactive counterparts unless gallery-only or flow-only.
2. **Prefer shared logic** — `rank.js`, `event-wizard.js`, `tournament.js`, `i18n.js`, `styles.css`. Wire gallery in `app.js` / `event-wizard.js`; wire flow in `flow/flow.js`.
3. **Keep markup identical** — Same `data-*` hooks, demo values, `data-i18n` keys on both surfaces.
4. **Navigation** — Gallery: `data-goto`. Flow: `data-flow-goto`. Auth: `data-login` + `data-login-goto="1"` for home.
5. **i18n** — New strings in `i18n.js` (EN + ID).
6. **Design notes** — Gallery changes → `gallery-design-notes-data.js`.
7. **Verify** — `node docs/mockups/scripts/verify-gallery.js`
8. **Regenerate** — After `flow/*.html` changes: `node docs/mockups/scripts/build-gallery-screens.js`

## High-risk twins (always check both)

- `home-dashboard` ↔ `flow/user.html` step 1
- `leaderboard` ↔ `flow/user.html` `leaderboard` step
- Club / platform wizards ↔ `flow/club.html` / `flow/platform.html`
- Events, register, format screens ↔ matching `flow/user.html` steps

`prototype.html` and `flow/*.html` are **manually synced** — the build script does not update the full gallery.
