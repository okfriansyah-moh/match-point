# Page override — community-hq (Community Admin home)

> Overrides MASTER for `club-admin-dashboard` / `flow/club.html` step 0. Rendered by `community-hq.js`.

- **Dials:** density **7**, motion **3** (ops surface — minimal motion, no entrance stagger).
- **Core question:** "How do I run and grow my community?"
- **Layout:** KPI strip (members · active this week · next event · pending requests, `--mono` values)
  → bento module grid `.mp-hq-module`: Events (wizard entry — keep existing `data-flow-goto` targets),
  Members, Feed (shared social-feed.js, community-scoped), Sparring, Booking (teaser), Finance/
  Marketplace (placeholder tiles, `--ink-faint`, "Coming soon" chip).
- Grid: 2 cols mobile, 3 cols ≥ tablet; tiles are whole-tile touch targets with icon (SVG), label,
  KPI, delta pill.
- **Same-world rule (locked):** admin view keeps the community-page look (cp-cover etc. where shown);
  HQ is a module grid *inside* the same visual world, not a detached admin skin.
- Placeholder tiles must be visibly non-interactive (reduced opacity, no hover lift).
