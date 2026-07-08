# Match Point

Cross-community player reputation platform. **Phase:** interactive HTML mockups in `docs/mockups/` (no production backend).

## Mockup work

When editing files under `docs/mockups/`, follow:

- `docs/mockups/MOCKUP-SYNC-RULE.md` (canonical rule)
- `.claude/rules/match-point-mockup-sync.md` (path-scoped)

Screen map and verification: `docs/mockups/MOCKUP-SYNC.md`.

## Quick commands

```bash
node docs/mockups/scripts/verify-gallery.js
python3 -m http.server 8080 --directory docs/mockups
```

## Conventions

- User-facing copy: `docs/mockups/i18n.js` (EN + ID), `data-i18n` attributes.
- Five sports: padel, tennis, pickleball, badminton, table_tennis.
- Gallery + interactive flows must stay aligned (see sync rule above).
- Do not commit secrets. Only commit when explicitly requested.
