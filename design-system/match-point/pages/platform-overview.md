# Page override — platform-overview (Ecosystem Operator Console)

> Overrides MASTER for `platform-overview`, `platform-community-pipeline`, `platform-moderation-inbox`,
> `platform-graph-health` (`flow/platform.html`). Rendered by `platform-ecosystem.js`.

- **Dials:** density **8** (data-dense ops dashboard), motion **3** (no decorative animation).
- **Chrome:** `.admin-theme` + `--official` purple accents; KPI values in `--mono` tabular-nums.
- **Core question:** "Is the ecosystem healthy, fair, and growing?"
- **Overview layout:** graph KPI row `.mp-platform-kpi` (Players · Communities · Matches · Posts ·
  DAU · Dispute rate, each with 24h delta) → network-loop mini sparklines → triage top-3 (SLA-sorted,
  existing triage-card elevated) → community pipeline counters (Pending/Approved/Rejected → pipeline
  screen) → social moderation counter (flagged posts → moderation inbox) → sport activity mix →
  quick actions row.
- Pipeline: stage-filtered list with stage chips; moderation inbox: report rows seeded from
  `MP_SocialFeed.flaggedPosts()` with post preview + Approve/Remove actions.
- Tables/lists: row dividers `1px solid` theme border token; sortable indicators where implied.
- Numbers never color-only: pair delta color with ▲/▼ glyph + text.
