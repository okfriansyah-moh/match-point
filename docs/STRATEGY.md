# Match Point — Strategy (Four-Journey Operating System)

> Executive digest of the strategic review (2026-07) and the four-journey OS model.
> Supersedes the feature-oriented positioning in earlier plan documents.
> Mockup implementation: `docs/mockups/` · design system: `design-system/match-point/MASTER.md`.

## Positioning

| Layer | Copy |
| --- | --- |
| **Primary** | *The operating system for racket sports communities* |
| **Secondary** | *Where players and communities build their entire sporting life* |
| **Technical wedge** | Portable MP Rating + Mabar/Global rank across 5 sports (complements UTR/DUPR/WPR, never claims to replace them) |

**Brand boundary:** racket sports only under the Match Point brand (padel, tennis, pickleball, badminton, table tennis). Broader "all community sports" expansion is deferred to Phase 7+ of the roadmap.

## The four-journey model

Every actor gets a purpose-built home that reinforces the network graph:

| Journey | Actor | Core question | Primary home |
| --- | --- | --- | --- |
| **Guest** | Unauthenticated browser | "Why should I join Match Point?" | Discovery Pulse (public) |
| **Player** | Authenticated member | "Why would I open this every day?" | Daily Hook Home |
| **Community** | Club / organizer admin | "How do I run and grow my community?" | Community HQ |
| **Platform** | Match Point superadmin | "Is the ecosystem healthy and trustworthy?" | Ecosystem Operator Console |

**Product philosophy — every feature must answer its journey's question:**

- Guest: *"Does this show enough value that I want an identity here?"*
- Player: *"How does this help me play, improve, and connect?"*
- Community: *"How does this help us organize, grow, and manage?"*
- Platform: *"Does this keep the graph healthy, fair, and growing?"*

## Competitive framing

Competitors are **modules**, not peers. The competition-app category maps to our Competition module; the discovery/booking-app category maps to our Discovery + Booking module. Match Point's moat is the **connected graph** — communities → players → matches → content → ratings — not any single module. (Competitor names never appear in user-visible copy.)

## Network-loop acceptance matrix

Score every proposed feature against the loops **and** journey fit; a feature scoring zero across all columns is deferred.

| Loop | Guest | Player | Community | Platform |
| --- | --- | --- | --- | --- |
| community → players | ✓ discovery | ✓ join | ✓ grow members | ✓ pipeline |
| players → content | preview only | ✓ create | ✓ broadcast | moderate |
| content → discovery | ✓ preview | ✓ | ✓ | monitor |
| matches → ratings | — | ✓ | ✓ host | ✓ audit |
| conversion → identity | ✓ primary | ✓ | import members | — |

## Guest conversion ladder

1. **See an alive platform** — public discovery pulse (live stats, trending communities, open events).
2. **Browse** — community pages, events, read-only social feed, public leaderboards.
3. **Hit a soft gate** — like/comment/RSVP/personal rank prompt inline sign-in (never a modal wall, never a forced tour).
4. **Claim identity** — register → claim Player Passport → join a community → member daily hook unlocks.

## Roadmap (reconciled)

| Phase | Focus | Deliverables |
| --- | --- | --- |
| **0** (now) | Vision-aligned prototype | Four journeys mocked: guest discovery, player daily hook, Community HQ, platform console + full social layer |
| **1** MVP | Core loop ships | Auth, communities, match submit, rank, events |
| **2** Monetize | Community Pro + payments | Wallet, membership billing |
| **3** Competition | Global rank, BoC, Sparring | Productionize existing mocks |
| **4** Booking | Court inventory module | Booking + venue inventory |
| **5** Social | Feed, follows, push backend | Mockups already done in Phase 0 |
| **6** Marketplaces | Coach, court, equipment | HQ placeholder tiles → screens |
| **7** AI / expansion | Smart matchmaking, wearables, broader sports | Concept screens |

**Monetization mix:** community SaaS (HQ Pro), player premium (passport insights), platform ops (featured events, booking take-rate from Phase 4).

## Personas (9)

Guest (browser) · Player · Community Member · Community Admin · Coach · Court Owner · Tournament Organizer · Sponsor · Platform Admin — primary dashboards per journey in `docs/architecture.md` §3.5.
