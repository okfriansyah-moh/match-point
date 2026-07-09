# Page override — social-feed (member + guest preview)

> Overrides MASTER for `social-feed`, `social-feed-guest`, `social-stories`, `social-post-detail`,
> `social-compose`, and community-detail feed blocks. Rendered by `docs/mockups/social-feed.js`.

- **Dials:** density **7**, motion **5**.
- **Layout:** stories rail on top (`.mp-story-ring`, 64px rings, horizontal scroll) → composer
  (member only) → post cards `.mp-feed-post` in a single column (max-width 640px on web), separated
  by clear card boundaries on `--surface` background — the Facebook clarity pattern.
- **Post card anatomy:** avatar + name + community/sport chip + relative time · body · optional media
  slot (aspect-ratio reserved, no CLS) · action bar (Like · Comment · Share) with 44px hit areas and
  a top `1px solid var(--surface-2)` divider inside the card.
- **Guest mode (`--guest`):** only `visibility:"public"` posts full; members-only posts render as
  `.mp-guest-teaser` stubs; action bar dimmed, taps soft-gate to login (`data-guest-login`); no composer;
  end-of-feed card "Join to see more".
- Sport chips use `--sport-*`; like state uses `--accent`, never red hearts (brand).
- Story rings: unseen = conic `--accent-bright` ring; seen = `--surface-2` ring; guest sees public
  stories only + one locked ring stub.
