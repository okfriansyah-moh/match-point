# Match Point — Design System MASTER

> Global Source of Truth for all Match Point mockup UI. Page-specific overrides live in
> `design-system/match-point/pages/*.md` — when a page file exists, its rules win for that page.
> Generated with ui-ux-pro-max guidance, **hand-mapped to the existing Match Point tokens** in
> `docs/mockups/styles.css`. Never adopt external palette suggestions wholesale.

## Product frame

- **Pattern:** Community/Forum platform + SaaS mobile app (four-journey OS: Guest · Player · Community Admin · Platform Admin).
- **Design dials:** density **7** (compact-but-breathing), motion **5** (standard micro-interactions, 150–300ms), variance **5** (balanced/modern).
- **Positioning voice:** "The operating system for racket sports communities."

## Token map (ui-ux-pro-max role → Match Point token)

| Role | Token | Value / notes |
| --- | --- | --- |
| Primary CTA | `--accent` / `--accent-bright` | `#2d6a4f` / `#40916c` court green — brand, never replace |
| Background | `--surface` / `--surface-2` | `#f4f7f2` warm off-white / `#e8efe9` |
| Card surface | `--card` | `#ffffff` |
| Foreground | `--ink` / `--ink-muted` / `--ink-faint` | `#0f1a12` / `#4a5c50` / `#6b7d71` |
| Immersive / hero | `--court-deep` / `--court-mid` / `--court-light` | dark court green family |
| Highlight / brand pop | `--ball` / `--ball-glow` | `#d4e157` tennis-ball yellow (gallery nav active, hero accents) |
| Sport accents | `--sport-tennis` `--sport-padel` `--sport-pickleball` `--sport-badminton` `--sport-table-tennis` | per-sport identity; tennis=green, padel=blue, pickleball=red (locked) |
| Status | `--danger` `--warning` `--info` `--success` | semantic only, never decorative |
| Admin chrome | `.admin-theme` + `--official` (`#5c4d7d`) | platform console surfaces |
| Data / rank numbers | `--mono` (JetBrains Mono) + `font-variant-numeric: tabular-nums` | KPIs, countdowns, ratings |
| Typography | `--font` (Outfit) | all UI text; sizes set per component (base 16px, body ≥0.85rem) |
| Radius | `--radius` 14px / `--radius-sm` 8px | cards / chips |
| Shadow | `--shadow` / `--shadow-lg` | soft green-tinted; no ad-hoc shadow values |

## Navigation system (locked — user decision 2026-07-09)

- **Tablet/desktop:** Facebook-style top tab bar `.mp-topnav` — SVG icon (20px) + label per tab,
  active = 2px `--accent` underline + `--accent` icon/text, bar has clear
  `border-bottom: 1px solid var(--surface-2)`. Centered, max 5 tabs.
- **Mobile:** frozen `.bottom-nav`, ≤5 items, SVG icon (22px) over label, min-height 48px,
  active = `--accent` color. Mobile never shows top tabs; tablet/web never show bottom nav.
- **Member nav:** Home · Play · Social · Rank · Communities. **Guest nav:** Explore · Play ·
  Social preview · Rank preview (+ persistent guest banner with Sign up / Log in).
- Profile only via avatar dropdown. No hamburger (removed by user feedback — do not reintroduce).
- Section pages: title-only headers. Sub-pages: icon-only `←` back + separate title.

## Dividers & section structure (Facebook-clarity rule)

- Sections separated by explicit rules: `.mp-section-hr` (1px `var(--surface-2)`) or card boundaries —
  never rely on whitespace alone at density 7.
- Card/list borders: `1px solid var(--surface-2)`. Labeled separators: `.divider`.
- One primary CTA per viewport section; secondary actions visually subordinate.

## Sport-identity canvas (user decision 2026-07-09)

- **Full surface tint:** When the user switches sport, the entire `.app` canvas (`--surface`, `--surface-2`)
  tints from that sport's identity color — not just accent lines or chips. White `--card` posts/cards
  pop against the tinted background so dividers read clearly.
- **Per-sport tokens:** padel=blue tint, tennis=green, pickleball=red, badminton=amber, table_tennis=orange.
  `--accent` / `--accent-bright` follow the same sport (existing rules in `styles.css`).
- **Dark mode:** Desaturated dark tonal variants per sport; never invert light-mode hex wholesale.
- **Admin:** `.admin-theme` keeps neutral chrome — sport tint does not apply.
- **Home highlights:** `.mp-home-highlights` uses a 2-up grid on wide screens (not a narrow centered column).
- **Social feed:** `.mp-feed-col` aligns stories + composer + posts; `.mp-feed-post-meta` row above actions
  (like/comment counts) for Facebook-style clarity.

## Component vocabulary (defined in styles.css)

| Class | Use |
| --- | --- |
| `.mp-pulse-card` (+`--urgent`) | daily-hook / discovery card; staggered fade-in ≤200ms; urgent = countdown accent border + mono tabular timer |
| `.mp-passport-hero` | identity rollup hero on `--court-deep` gradient with `--sport-*` chips |
| `.mp-story-ring` | social story rail ring, conic `--accent-bright`; static under reduced-motion |
| `.mp-hq-module` | Community HQ bento tile: icon, KPI (mono), delta pill |
| `.mp-platform-kpi` | dense ecosystem KPI, admin-theme aware, tabular-nums |
| `.mp-guest-teaser` | blurred/locked preview with a single conversion CTA |
| `.mp-feed-post` (+`--guest`) | shared social post renderer; guest mode = read-only, actions soft-gate to login |

## Anti-patterns (binding)

- No emoji as structural/nav icons — inline Lucide-style SVG (`stroke="currentColor"`, `stroke-width="2"`, `aria-hidden="true"`). Mascots OK as brand illustration.
- Touch targets ≥44×44px; ≥8px gaps between targets.
- Bottom nav ≤5 items, always icon + label.
- `prefers-reduced-motion: reduce` disables pulse stagger, story-ring animation, skeleton shimmer.
- Skeleton placeholders (not spinners) for async-feeling sections.
- Guest can skip any onboarding — soft gates inline, never a forced tour or modal wall.
- No competitor names in user-visible copy.
- No raw hex in components — tokens only. No gray-on-gray below 4.5:1.
- Every visible string via `data-i18n` with EN + ID keys.

## Pre-delivery checklist (per screen batch)

- [ ] 375px + landscape: no horizontal scroll; bottom nav doesn't clip content
- [ ] Contrast ≥4.5:1 body text (light mode; `.admin-theme` and `body.mp-dark` checked separately)
- [ ] Focus rings visible; `aria-label` on icon-only controls
- [ ] Fixed bars reserve content padding (`--header-h` pattern)
- [ ] Reduced motion verified
- [ ] `tabular-nums` on countdowns, ratings, KPIs
- [ ] One primary CTA per section; active nav state visible
- [ ] `node docs/mockups/scripts/verify-gallery.js` passes
