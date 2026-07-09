# Page override — guest-home (Discovery Pulse)

> Overrides MASTER for the unauthenticated home (`home-dashboard-guest`, `flow/user.html` guest state).

- **Dials:** density **6** (roomier than member home — first impression), motion **4**.
- **Core question:** "Why should I join Match Point?" — every block must show a live, breathing platform.
- **Structure (top → bottom):** live platform strip (counts, `--mono` tabular) → trending communities
  (horizontal scroll rail, snap, card width ~72vw mobile) → open events this weekend → public Top-5
  leaderboard snapshot → social highlights rail (3 read-only `.mp-feed-post--guest`) → passport teaser
  (`.mp-guest-teaser` over blurred `.mp-passport-hero`) → how-it-works 3 steps → final CTA pair.
- **Conversion ladder:** see value → browse → hit soft gate → register. Soft gates are inline prompts on
  the interactive element (`data-requires-auth` / `data-guest-login`), never modal walls.
- **One primary CTA per section**; the page-level primary is "Sign up free" (accent), secondary "Find community" (outline).
- Persistent `.guest-banner` on all guest screens: "Browsing as guest" + Sign up / Log in.
- Horizontal rails must not cause page-level horizontal scroll (rail owns `overflow-x`).
