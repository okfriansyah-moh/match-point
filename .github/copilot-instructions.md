# Match Point

Cross-community player reputation platform. **Current phase:** interactive HTML/CSS/JS mockups in `docs/mockups/` (no production backend yet).

## Hierarchy of truth

1. Implemented behavior — `docs/mockups/`
2. Public product rules — `docs/mockups/about.html`
3. Architecture — `docs/architecture.md`
4. Strategy — `docs/mockups/global-readiness.html`

## Mockup work (`docs/mockups/**`)

**Always follow** `.github/instructions/match-point-mockup-sync.instructions.md` and `docs/mockups/MOCKUP-SYNC-RULE.md`.

- Keep **gallery** (`prototype.html`) and **interactive flows** (`flow/*.html`) visually and semantically aligned.
- Shared JS: `rank.js`, `event-wizard.js`, `tournament.js`, `i18n.js`, `styles.css`.
- After mockup changes: `node docs/mockups/scripts/verify-gallery.js`
- Deploy: push to `main` publishes `docs/mockups/` via GitHub Pages (see `docs/mockups/DEPLOY.md`).

## Conventions

- User-facing strings: `i18n.js` (Indonesian + English), use `data-i18n`.
- Five sports: padel, tennis, pickleball, badminton, table_tennis.
- Do not commit secrets (`.env`, keys, credentials).
- Only create git commits when explicitly requested.
