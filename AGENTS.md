# Match Point — agent instructions

Cross-community player reputation platform. **Phase:** mockup-complete (`docs/mockups/`); production backend not started.

## Mockup changes (`docs/mockups/**`)

**Read and follow `docs/mockups/MOCKUP-SYNC-RULE.md` before editing mockup UI.**

Gallery (`prototype.html`) and interactive flows (`flow/user.html`, `flow/club.html`, `flow/platform.html`) must stay aligned. Full screen map: `docs/mockups/MOCKUP-SYNC.md`.

### Checklist

1. Update twin screens on both gallery and interactive surfaces.
2. Put logic in shared JS (`rank.js`, `event-wizard.js`, `tournament.js`, `i18n.js`, `styles.css`).
3. Match `data-*` hooks, demo data, and `data-i18n` keys on both surfaces.
4. Gallery nav: `data-goto`. Flow nav: `data-flow-goto`. Auth: `data-login` + `data-login-goto="1"`.
5. New copy → `i18n.js` (EN + ID).
6. Gallery screen changes → `gallery-design-notes-data.js`.
7. Run `node docs/mockups/scripts/verify-gallery.js`
8. After `flow/*.html` markup changes → `node docs/mockups/scripts/build-gallery-screens.js`

Nested detail for mockup-only work: `docs/mockups/AGENTS.md`.

## Verify & deploy

```bash
node docs/mockups/scripts/verify-gallery.js
python3 -m http.server 8080 --directory docs/mockups
```

Push to `main` deploys `docs/mockups/` to GitHub Pages (`.github/workflows/pages.yml`).

## Do not

- Commit `.env`, keys, or credentials.
- Assume `build-gallery-screens.js` updates `prototype.html` (manual sync only).
- Create git commits unless the user explicitly asks.
