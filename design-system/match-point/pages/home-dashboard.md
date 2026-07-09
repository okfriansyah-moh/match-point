# Page override — home-dashboard (Player Daily Hook)

> Overrides MASTER for the authenticated home (`home-dashboard`, `flow/user.html` member state).

- **Dials:** density **7**, motion **5** (staggered pulse-card entrance, 30–50ms per card, ≤200ms each).
- **Core question:** "Why would I open this every day?" — content must be *today-specific*.
- **Pulse stack order:** urgent card first (`.mp-pulse-card--urgent`: next event countdown in `--mono`
  tabular) → rating delta since last visit (sport accent color, ▲/▼ + text, never color-only) →
  streak/activity nudge → friend activity (from social graph) → community update → social highlights
  strip (2 posts, `data-feed-limit="2"`) → booking entry CTA.
- Rank story card lives on the Rank tab, not home (spec C1).
- Skeleton shimmer placeholders for pulse cards on first paint; disabled under reduced-motion.
- FAB (+): Log match · Create event · Book court. FAB is the only floating element; keep clear of bottom nav.
- Each pulse card = one action max; card body is the touch target (≥44px rows).
