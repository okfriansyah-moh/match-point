# Page override — player-passport (unified 5-sport identity)

> Overrides MASTER for `player-passport` and `passport-teaser-guest`. Rendered by `passport.js`.

- **Dials:** density **6** (identity showcase breathes), motion **4**.
- **Hero:** `.mp-passport-hero` on `--court-deep` gradient — avatar, name, handle, headline MP Rating,
  trust/reliability chip; text on dark checked for ≥4.5:1.
- **5-sport rollup:** one row per sport (padel, tennis, pickleball, badminton, table_tennis), each with
  `--sport-*` accent bar, Mabar + Global rating (`--mono`), matches count, mini trend. Sports the player
  hasn't played render muted with "Start your {sport} record" nudge.
- Below: achievements strip (achievements.js, horizontal), friends row (social-graph.js), communities row.
- **Teaser variant (`{teaser:true}`):** same hero + rollup blurred under `.mp-guest-teaser`, single CTA
  "Claim your passport"; no real data implied (demo placeholders).
- Share entry reuses existing share-card pattern; passport is entered from Rank tab + profile.
