# Match Point — Gallery ↔ Interactive sync

**Canonical agent rule** for mockup work. Keep in sync across:

- Cursor: `.cursor/rules/match-point-mockup-sync.mdc`
- GitHub Copilot: `.github/instructions/match-point-mockup-sync.instructions.md`
- Codex: `AGENTS.md`, `docs/mockups/AGENTS.md`, `.codex/skills/match-point-mockup-sync/SKILL.md`
- Claude Code: `CLAUDE.md`, `.claude/rules/match-point-mockup-sync.md`

Full screen map and checklists: **`MOCKUP-SYNC.md`**.

## Surfaces

| Surface         | Entry                                                       | Navigation                                | Behavior                                        |
| --------------- | ----------------------------------------------------------- | ----------------------------------------- | ----------------------------------------------- |
| **Gallery**     | `docs/mockups/prototype.html`                               | `#screen-id` hash via `app.js`            | `data-goto`, design notes, `gallery-hydrate.js` |
| **Interactive** | `docs/mockups/flow/user.html`, `club.html`, `platform.html` | `data-flow-goto` steps via `flow/flow.js` | Immersive journey, role state                   |

## Mandatory before finishing any mockup UI change

1. **Identify twins** — If you edit a screen in one surface, find its counterpart in the other (see `MOCKUP-SYNC.md` § Screen map). Update **both** unless the screen is gallery-only or flow-only.
2. **Prefer shared logic** — Put behavior in shared JS (`rank.js`, `event-wizard.js`, `tournament.js`, `i18n.js`, `styles.css`). Wire gallery in `event-wizard.js` / `app.js`; wire flow in `flow/flow.js`. Do not duplicate business logic in HTML.
3. **Keep markup patterns identical** — Same `data-*` hooks (`data-sport-pts`, `data-mp-rating`, `data-wizard-pick-bracket`, etc.), demo numbers, and `data-i18n` keys on both surfaces.
4. **Navigation attrs** — Gallery: `data-goto="screen-id"`. Flow: `data-flow-goto="step"`. Login/auth: `data-login` with `data-login-goto="1"` for home after sign-in. When adding CTAs, add the equivalent on the twin screen.
5. **i18n** — New copy → `docs/mockups/i18n.js` (EN + ID). Never hard-code user-facing strings on one surface only.
6. **Design notes** — Gallery screen changes → update `gallery-design-notes-data.js` (and run notes generator if anchors change).
7. **Verify** — Run `node docs/mockups/scripts/verify-gallery.js`.
8. **Regenerate extract** — After `flow/*.html` markup changes, run `node docs/mockups/scripts/build-gallery-screens.js` (feeds `gallery-screens-extracted.html`).

## High-risk dual-maintained screens

These are commonly edited in one place only — always check both:

- `home-dashboard` ↔ `flow/user.html` step 1 (dashboard)
- `leaderboard` / Rank tab ↔ `flow/user.html` step `leaderboard`
- Club wizards ↔ `flow/club.html` steps 1–publish
- Platform wizards ↔ `flow/platform.html` steps 1–6
- `event-register`, `events-feed`, format/event screens ↔ matching `flow/user.html` steps

## What counts as a design change (must sync)

- Layout, components, badges, copy, demo data values
- New/removed form fields, wizard steps, eligibility panels
- Ranking display (MP Rating, Mabar/Global pts, bracket classes)

## What does not need HTML duplication

- Pure JS engine changes in `rank.js` / `tournament.js` if both surfaces load the same script and use the same `data-*` selectors.
