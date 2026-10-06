# RECON — House of Otaru Redesign

**Date:** 2026-10-07  
**Phase:** 0 — Reconnaissance & Technical Audit  
**Branch:** `redesign/two-harbours`

---

## 1. Stack Confirmed

| Layer | What | Version | Notes |
|---|---|---|---|
| **Framework** | Next.js (App Router) | 15.1.0 | React 19.0.0. Default to React Server Components (RSC). |
| **Language** | TypeScript (Strict) | 5.7.0 | `tsconfig.json` has `strict: true`. Zero explicit/implicit `any`. |
| **Styling** | Vanilla CSS Tokens + Tailwind CSS | 3.4.0 | Design tokens defined in CSS variables (`--paper`, `--ink`, `--indigo`, `--madder`, `--turmeric`, `--hairline`). |
| **Fonts** | Google Fonts via `next/font/google` | — | Shippori Mincho / Fraunces (Display), Tiro Devanagari Hindi (Hindi), Hanken Grotesk (Body/UI), DM Mono (Numerals/Labels). |
| **Animation** | GSAP 3.12 + ScrollTrigger, Framer Motion 11.15 | — | Strict role separation: GSAP for The Thread continuous SVG scroll drawing; Framer Motion for local state / Stamp / Door transitions. |
| **3D / Spatial** | Three.js + @react-three/fiber + drei | 0.170 / 8.17 | Flagged for v1 landing page. No 3D on the critical mobile path to guarantee LCP < 2.5s and zero battery drain. |
| **CMS** | Sanity v3 (`next-sanity`) | 3.67.0 | Present in dependencies, not configured. Content lives in typed config files for v1 (`content/*.ts`). |
| **Commerce** | Numbered Drop & Reservation Seam | — | Drop 01 state machine (waitlist → early-access → live → sold-out). Formatted with Indian digit grouping (₹). |
| **DB & ORM** | Prisma + PostgreSQL | 6.3.0 | 760-line schema. Adding atomic `Resident` model with unique sequence numbering and referral mechanics. |
| **Cache & Security** | Upstash Redis + Edge Middleware | — | CSRF verification, distributed rate limiting, and canonical redirects in `src/middleware.ts`. |
| **Testing** | Vitest + Playwright + MSW | 2.1 / 1.49 | Unit, component, and end-to-end rehearsal tests. |

---

## 2. Routes Found

### App Routes
| Route | Legacy Purpose | Disposition for Two Harbours Launch |
|---|---|---|
| `/` | 12-movement fictional Hokkaido archive | **Rebuild**: Two Harbours narrative, The Thread, The Stamp, The Door |
| `/drop-01` | Drop listing | **Active**: Launch route for Drop 01 showcase |
| `/product/[slug]` | Product details | **Active**: Plate gallery, spec, Indian-tailored sizing, piece numbering |
| `/story` | Fictional Hokkaido story | **Active**: Honest Two Harbours essay, craft pairs, founder truth |
| `/journal` | Journal / blog | **Active**: Field Notes, honest building-in-public notes |
| `/residents/[number]` | — | **New Launch Route**: Shareable Resident card page with OG story generation |
| `/size-guide` | Modal size guide | **Active**: Dedicated page with Indian body measurements |
| `/shipping-exchanges` | Care ledger | **Active**: Policy page (exchange over refund; limit/avoid COD) |
| `/privacy` | Generic privacy | **Active**: Plain-language DPDP Act 2023 compliant consent |
| `/terms` | Generic terms | **Active**: Clean, minimal terms of service |
| `/archive` | 412-object index | **Redirect to `/`** (behind `FEATURE_FULL_ARCHIVE=false`) |
| `/chapters` | Seasonal chapters | **Redirect to `/`** |
| `/studio` | Fictional canal warehouse | **Redirect to `/story`** |
| `/membership` | Fictional 3-tier membership | **Redirect to `/`** |
| `/profile` | Collector profile | **Redirect to `/`** |
| `/track-order` | Order tracker | **Redirect to `/`** |
| `/checkout` | Legacy cart checkout | **Redirect to `/`** (Waitlist reservation phase) |
| `/bag` | Shopping bag | **Redirect to `/`** |
| `/sign-in` | OTP authentication | **Redirect to `/`** |
| `/verify` | OTP verification | **Redirect to `/`** |
| `/account` | Account management | **Redirect to `/`** |
| `/wishlist` | Wishlist | **Redirect to `/`** |

### API Routes
| Route | Current Implementation | Disposition |
|---|---|---|
| `/api/residents` | Missing (called in partial Hero) | **Implement**: Atomic sequence assignment, validation, honeypot, rate limit |
| `/api/card/[number]` | Basic 1200x630 OG image | **Refine**: Support 1200x630 (OG) & 1080x1920 (Instagram Stories), paper background, thread, stamp |
| `/api/art/[name]` | Procedural SVG art (cherry-blossom, etc.) | **Remove from UI**: Fabricated Japanese motif art endpoints deprecated |
| `/api/hero-image` | Synthetic hero art | **Deprecate from UI** |
| `/api/waitlist` | Legacy chapter waitlist | **Consolidate into `/api/residents`** |
| `/api/health` & `/api/ready` | Health checks | **Keep** |

---

## 3. Components Inventory & Codebase Dissection

### Legacy Home Components (To be superseded on `/`)
1. `HeldHero.tsx` — 100svh backlit cloth surface with clip-path and kanji watermarks.
2. `ObjectReveal.tsx` — Object 041 Yama Field Jacket reveal with Tokushima claims.
3. `BatchSection.tsx` — Asymmetric 4-object grid pulling from legacy `PRODUCT_CATALOG`.
4. `MaterialMacroSection.tsx` — Interactive macro study with hotspot pins.
5. `WhyThisObject.tsx` — Editorial manifesto with unverified claims.
6. `ChaptersScrollSnap.tsx` — Horizontal scroll of fictional chapters (Kyoto Nights, Otaru Harbor).
7. `StudioStorySection.tsx` — 1907 Otaru canal warehouse artisan claims.
8. `ObjectLifeTimeline.tsx` — 5-year aging lifecycle and boro mending narrative.
9. `PermanentArchiveCta.tsx` — 10-piece historical ledger invitation.
10. `JournalThreeCards.tsx` — Studio field notes linked to fictional garments.
11. `MadeToRemain.tsx` — Lifetime canal studio repair ledger claim.
12. `CircleEmailSection.tsx` — Archival Circle reservation form.

### Two Harbours Components (Active & In Development)
1. `src/components/home/HeroSection.tsx` — H1: "A house between two harbours", Door inline form, two threads meeting.
2. `src/components/home/StorySection.tsx` — Why Otaru, Two Harbours, The Maker.
3. `src/components/home/CraftPairsSection.tsx` — 5 interactive craft diptychs.
4. `src/components/home/DropSection.tsx` — Drop 01 four numbered plates.
5. `src/components/home/ResidentsSection.tsx` — Residency benefits and waitlist form.
6. `src/components/home/FieldNotesSection.tsx` — 3 dated building-in-public notes.
7. `src/components/home/ClosingSection.tsx` — "Leave the door open. We'll leave the light on." with Tadaima button.
8. `src/components/ui/Plate.tsx` — Honest photographic mount with registration marks and caption.
9. `src/components/ui/Stamp.tsx` — Madder-red square seal (scale 1.06 to 1, rotation ~1°, 260ms, multiply blend).
10. `src/components/ui/Thread.tsx` — Continuous SVG running-stitch line (dashed indigo) connecting Two Harbours.
11. `src/components/ui/DoorButton.tsx` — "Tadaima" (idle) → "Okaeri. You're Resident No. XXXX." (success).
12. `src/components/ui/DropChip.tsx` — Status badge (countdown or "Waitlist open").
13. `src/components/ui/CraftPair.tsx` — Diptych card revealing the shared craft truth.
14. `src/components/ui/ProductPlate.tsx` — Plate + Stamp + Indian rupee pricing + fit note.
15. `src/components/ui/ResidentCard.tsx` — Numbered certificate card with share trigger.
16. `src/components/layout/SiteHeader.tsx` — Minimal: "House of Otaru" + 小樽, DropChip, Tadaima button.
17. `src/components/layout/SiteFooter.tsx` — Minimal: Policy links, 家 · घर lockup, contact.

---

## 4. Fabricated Heritage Claims Found & Audit Status

All 24 fabricated heritage claims identified in the legacy codebase must be stripped from the public UI:

| # | Claim | Original Location | Verdict |
|---|---|---|---|
| 1 | "ESTABLISHED IN HOKKAIDO" | SiteFooter.tsx:186 | **FALSE — Remove** |
| 2 | "43.1907 N, 140.9947 E" as origin | SiteFooter.tsx:186, Craftsmanship.tsx:177 | **FALSE — Remove** |
| 3 | "ZERO MASS-PRODUCTION" | SiteFooter.tsx:189 | **UNVERIFIED — Remove unless confirmed** |
| 4 | "412 Objects Recorded in Archive" | Philosophy.tsx:59 | **FALSE — Remove** |
| 5 | "Zero Reprints" | Philosophy.tsx:70 | **UNVERIFIED — Remove unless confirmed** |
| 6 | "1907 stone harbor" story | StoryJourney.tsx:64 | **FALSE — Remove** |
| 7 | "four craftspeople who have worked together for eleven years" | StoryJourney.tsx:67 | **FALSE — Remove** |
| 8 | "dyed in water drawn from the same canal" | StoryJourney.tsx:67 | **FALSE — Remove** |
| 9 | "EST. 1907 RECLAIMED 2026" | StoryJourney.tsx:53 | **FALSE — Remove** |
| 10 | "HOKKAIDO STONE WAREHOUSE 1907" | StoryJourney.tsx:22 | **FALSE — Remove** |
| 11 | Materials from Tokushima, Omi, Biratori, Kiryu | Craftsmanship.tsx:16-19 | **FALSE — Remove** |
| 12 | "Toyoda G3 Vintage Shuttle Loom" | catalog.ts:77 | **FALSE — Remove** |
| 13 | "14.5oz raw indigo cotton canvas, woven on 1968 Toyoda G3" | catalog.ts:68 | **FALSE — Remove** |
| 14 | "Otaru Warehouse" as origin | catalog.ts:67 | **FALSE — Remove** |
| 15 | "lifetime canal studio repair ledger" | catalog.ts:73 | **FALSE — Remove** |
| 16 | Chapters: "Kyoto Nights", "Otaru Harbor", "Quiet Interior" | ChapterShowcase.tsx | **FICTIONAL — Remove** |
| 17 | "Archival Circle" paid membership tiers | MembershipTeaser.tsx | **FICTIONAL — Remove** |
| 18 | "Private warehouse fittings in Otaru" | MembershipTeaser.tsx:46 | **FALSE — Remove** |
| 19 | "Annual canal re-waxing & boro repair" | MembershipTeaser.tsx:37 | **FALSE — Remove** |
| 20 | "Permanent Weaves / Hokkaido" campaign | Hero.tsx:35 | **FALSE — Remove** |
| 21 | "Kyoto Tokyo Otaru" city list | Hero.tsx:385 | **FALSE — Remove** |
| 22 | "Hokkaido 43.19 N" | SiteHeader.tsx:348 | **FALSE — Remove** |
| 23 | "Otaru Night Lanterns" kanji | SiteHeader.tsx:345 | **MISLEADING — Remove** |
| 24 | "ALL OBJECTS PROTECTED" | SiteFooter.tsx:188 | **MEANINGLESS — Remove** |

---

## 5. Data Flow Architecture

### 1. Waitlist & Residency Flow
```
Visitor on / (Hero or Closing or Residents Section)
    │
    ▼
Inputs: email (req), igHandle (opt), city (opt), piece (opt), DPDP consent
    │
    ▼
Client-side Validation & Honeypot Check
    │
    ▼
POST /api/residents
    │
    ├─► Server-side Zod validation & Honeypot guard
    ├─► IP Rate Limiting (Redis / In-memory fallback)
    ├─► Check duplicate email:
    │      ├─ If exists: Return existing Resident number (Idempotent)
    │      └─ If new: Atomically increment sequence (e.g. 143 -> No. 0143)
    ├─► Generate personal referral code
    ├─► Persist to DB (Prisma `Resident` table)
    ├─► Async dispatch confirmation email (Resend) if configured
    │
    ▼
HTTP 200 Response: { resident: { number, referralCode, isFounding } }
    │
    ▼
Client State Transition:
    ├─ Button switches to "Okaeri. You're Resident No. 0143."
    ├─ Stamp fires (scale 1.06 -> 1, rotation 1°, multiply blend)
    └─ Redirect or reveal Resident Card with Web Share trigger & /api/card/[number] OG image
```

### 2. Claims Registry & Build Guard Flow
```
Developer / CI: `npm run build`
    │
    ▼
prebuild hook: `tsx scripts/check-claims.ts`
    │
    ├─► Scans all files in `content/*.ts`
    │      └─ Check for [CONFIRM] or TODO_CONFIRM
    ├─► Reads `content/claims.ts`
    │      └─ Check for any claim where status === 'todo'
    │
    ▼
Evaluation:
    ├─ If VERCEL_ENV === 'production' and errors exist:
    │      🚨 EXIT 1 (Hard Build Failure)
    └─ If development / preview:
           ⚠️ WARN and allow build for design inspection
```

### 3. Drop State Machine Flow
```
Configuration in `content/drop01.ts`:
  - waitlistOpen: timestamp
  - earlyAccessStart: timestamp
  - liveStart: timestamp
  - liveEnd: timestamp
    │
    ▼
`getDropState(currentTimestamp)`:
  - BEFORE waitlistOpen ──► 'PREVIEW'
  - waitlistOpen .. earlyAccessStart ──► 'WAITLIST' (Doors open for Residents)
  - earlyAccessStart .. liveStart ──► 'EARLY_ACCESS' (Residents unlock via referral code)
  - liveStart .. liveEnd ──► 'LIVE' (Public Drop 01 open)
  - AFTER liveEnd ──► 'SOLD_OUT' ("Nos. 1 to 40 are homed. Join Drop 02 list")
```

---

## 6. Disposition Table (Section 4 Reconciliation)

| Category | Components & Features | Action |
|---|---|---|
| **Keep and Evolve** | Numbered object system (No. 01 of 40), Drop structure, quiet journal voice, skip link, cart reservation mechanics, product page skeleton, metadata structure, Zod validation | Retain & align with Two Harbours design tokens |
| **Put Behind Flag (`FEATURE_FULL_ARCHIVE=false`) & Redirect** | Membership tiers (`/membership`), Collector profile (`/profile`), Track order (`/track-order`), Ledger badge, Moon phase, JST clock, Sound toggle, Currency switcher, Search overlay, 412-object index (`/archive`) | Keep code in repo, redirect routes via middleware |
| **Rebuild** | Hero section, Story section, Craft Pairs diptychs, Product plates, Residents waitlist, Site Header, Site Footer, OG/Share image generation, Copy deck, Design tokens | Complete rebuild for Two Harbours truth |
| **Delete from UI** | All 24 fabricated heritage claims, generated art endpoints (/api/art/*), decorative kanji watermarks, fictional chapter names, multi-currency USD dropdown | Completely remove from rendered DOM |

---

## 7. Disagreements with Brief & Engineering Proposals

1. **Prisma vs Lightweight Store**: The brief mentions Supabase or Vercel Postgres. Since Prisma is already configured with a schema and client in the repository, we propose defining a clean `Resident` model directly in `prisma/schema.prisma` with an in-memory development fallback if `DATABASE_URL` is not set locally.
2. **Tailwind CSS vs Vanilla CSS Tokens**: The brief mentions vanilla CSS, but Tailwind is deeply installed. We propose a hybrid: all design tokens, font scales, colors, and motion easing curves are written strictly as CSS custom properties in `tokens.css`. Utility classes are used for grid and layout primitives.
3. **Edge Rate Limiting**: The current middleware relies on Upstash Redis which fails if credentials are absent. We propose a graceful dev fallback: fail open with a console warning in local dev, and use in-memory rate limiting for the waitlist route handler.
4. **Three.js Dependencies**: Three.js and `@react-three/fiber` are present in `package.json` (~200KB bundle weight). For Drop 01, we ensure no WebGL bundle is loaded on `/` to guarantee LCP < 2.5s on mobile.

---

## 8. Performance & Mobile In-App Browser Invariants

- **Instagram In-App Browser**: Viewport height varies dynamically (`100dvh` vs `100vh`). All critical elements must fit within visible bounds without relying on unsupported CSS APIs.
- **LCP Target**: Under 2.5s on mobile slow 4G. All plates above the fold must be optimized or rendered as lightweight styled SVGs/placeholders with zero external blocking requests.
- **Zero Scroll-Jacking**: Smooth scrolling with Lenis must be synchronized cleanly or omitted if prefers-reduced-motion is active. The Thread uses stroke-dashoffset driven by ScrollTrigger / requestAnimationFrame.

---

*Recon complete. Phase 1 Implementation Plan follows.*
