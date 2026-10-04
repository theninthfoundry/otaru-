# RECON — House of Otaru Redesign

**Date:** 2026-10-04  
**Phase:** 0 — Reconnaissance  
**Branch:** `redesign/two-harbours`

---

## 1. Stack Confirmed

| Layer | What | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.1.x |
| Language | TypeScript (strict not enforced yet) | 5.7.x |
| Styling | Tailwind CSS 3.4 + global CSS + inline styles + `styled-jsx` | Mixed |
| Fonts | Inter (body) + Newsreader (display) via `next/font/google` | — |
| Animation | Framer Motion 11, GSAP 3.12 + ScrollTrigger, Lenis smooth scroll | — |
| 3D | Three.js + @react-three/fiber + drei | Present in deps, usage not found on home |
| CMS | Sanity v3 (next-sanity) | Optional, no project ID configured |
| Commerce | Shopify Hydrogen React + local `PRODUCT_CATALOG` in `catalog.ts` | Dual path |
| DB | Prisma + PostgreSQL (Neon/Supabase) | 745-line schema |
| Payments | Razorpay integration (env vars, webhook routes) | Configured |
| Auth | Custom OTP (SMS/WhatsApp/email) via auth-context | In-house |
| Shipping | Shiprocket integration (env vars, stub) | Stub only |
| CRM | Klaviyo (newsletter/waitlist), Interakt (WhatsApp) | Stub only |
| Cache/Rate | Upstash Redis (middleware) | Configured |
| Hosting | Vercel (vercel.json present) | — |
| Testing | Vitest + Playwright + MSW | Present |

## 2. Routes Found

### App Routes

| Route | Purpose | Status |
|---|---|---|
| `/` | Home page (Hero → NewDrops → Chapters → Archive → Story → Craft → Philosophy → Membership → Passport → Journal → Newsletter) | Active |
| `/archive` | Full archive index | Active |
| `/journal` | Journal/blog | Active |
| `/studio` | Studio page | Active |
| `/chapters` | Chapter listing | Active |
| `/chapter` | Single chapter (old path?) | Active |
| `/product/[id]` | Product detail (uses local catalog) | Active |
| `/profile` | Collector/member profile | Active |
| `/membership` | Membership tiers page | Active |
| `/checkout` | Checkout flow | Active |
| `/bag` | Shopping bag | Active |
| `/track-order` | Order tracking | Active |
| `/returns` | Returns flow | Active |
| `/sign-in` | Authentication | Active |
| `/verify` | OTP verification | Active |
| `/account` | Account management | Active |
| `/wishlist` | Wishlist | Active |
| `/drops` | Drops page | Active |
| `/artifact` | Single artifact | Active |
| `/admin` | Admin panel | Active |

### API Routes

| Route | Purpose |
|---|---|
| `/api/art/[name]` | Generated SVG art (cherry-blossom, poppies, great-wave, lanterns, furin, etc.) |
| `/api/hero-image` | Hero background image |
| `/api/waitlist` | Waitlist signup (Klaviyo-backed) |
| `/api/newsletter` | Newsletter signup |
| `/api/auth/*` | OTP auth flow |
| `/api/checkout/*` | Checkout/payment |
| `/api/shipping/*` | Shipping integration |
| `/api/provenance/*` | Provenance/ledger |
| `/api/health` | Health check |
| `/api/ready` | Readiness check |
| `/api/metrics` | Metrics |
| `/api/webhooks/*` | Payment/Shopify webhooks |
| `/api/admin/*` | Admin API |
| `/api/account/*` | Account management |

## 3. Components Inventory

### Home Sections (12 components)
- `Hero` — 3-slide carousel with parallax, kanji watermarks, generated art backgrounds
- `NewDrops` — 4 product cards from `PRODUCT_CATALOG` with quick-add
- `ChapterShowcase` — 3 fictional chapters (Kyoto Nights, Otaru Harbor, Quiet Interior)
- `ArchiveTeaser` — Links to /archive
- `StoryJourney` — Fictional Hokkaido studio story
- `Craftsmanship` — 4 materials (Tokushima, Omi, Biratori, Kiryu)
- `Philosophy` — "412 Objects" + "Zero Reprints" stats, quote
- `MembershipTeaser` — 3-tier membership (Vanguard, Archival Circle, Atelier Circle)
- `CollectorPassportSection` — Full OTP auth inline (937 lines)
- `JournalTeaser` — Journal entries preview
- `NewsletterSignup` — Email signup

### Layout
- `SiteHeader` — Fixed header, nav (Archive/Journal/Studio/Chapters), search, auth, cart, mobile drawer with lanterns background
- `SiteFooter` — 4-column footer, email signup, fictional claims

### UI Components (17)
- `ArchivalBackgroundArt` (SashikoGrid, VerticalKanjiStamp, AsciiLoomBlueprint, AsciiWaveArt, JapaneseCornerBorder)
- `ArchivalCursor` (disabled), `ArchivePageTransition`, `ArchiveTextureOverlay`
- `ArtBackgroundPlate`, `DesignedArtifactGraphic`, `ImagePlaceholder`
- `JapaneseFurinChimes`, `MaterialInspectorModal`, `MoonProgress`
- `RevealOnScroll`, `ScrollProgressLedger`, `ScrollTextReveal`, `ScrollZoomImage`
- `SectionHeading`, `SizeGuideModal`, `StudioStatusBar`

## 4. Fabricated Heritage Claims Found

| # | Claim | Location | Verdict |
|---|---|---|---|
| 1 | "ESTABLISHED IN HOKKAIDO" | SiteFooter.tsx:186 | **FALSE** |
| 2 | "43.1907 N, 140.9947 E" as origin | SiteFooter.tsx:186, Craftsmanship.tsx:177 | **FALSE** |
| 3 | "ZERO MASS-PRODUCTION" | SiteFooter.tsx:189 | **UNVERIFIED** |
| 4 | "412 Objects Recorded in Archive" | Philosophy.tsx:59 | **FALSE** |
| 5 | "Zero Reprints" | Philosophy.tsx:70 | **UNVERIFIED** |
| 6 | "1907 stone harbor" story | StoryJourney.tsx:64 | **FALSE** |
| 7 | "four craftspeople who have worked together for eleven years" | StoryJourney.tsx:67 | **FALSE** |
| 8 | "dyed in water drawn from the same canal" | StoryJourney.tsx:67 | **FALSE** |
| 9 | "EST. 1907 RECLAIMED 2026" | StoryJourney.tsx:53 | **FALSE** |
| 10 | "HOKKAIDO STONE WAREHOUSE 1907" | StoryJourney.tsx:22 | **FALSE** |
| 11 | Materials from Tokushima, Omi, Biratori, Kiryu | Craftsmanship.tsx:16-19 | **FALSE** |
| 12 | "Toyoda G3 Vintage Shuttle Loom" | catalog.ts:77 | **FALSE** |
| 13 | "14.5oz raw indigo cotton canvas, woven on 1968 Toyoda G3" | catalog.ts:68 | **FALSE** |
| 14 | "Otaru Warehouse" as origin | catalog.ts:67 | **FALSE** |
| 15 | "lifetime canal studio repair ledger" | catalog.ts:73 | **FALSE** |
| 16 | Chapters: "Kyoto Nights", "Otaru Harbor", "Quiet Interior" | ChapterShowcase.tsx | **FICTIONAL** |
| 17 | "Archival Circle" paid membership tiers | MembershipTeaser.tsx | **FICTIONAL** |
| 18 | "Private warehouse fittings in Otaru" | MembershipTeaser.tsx:46 | **FALSE** |
| 19 | "Annual canal re-waxing & boro repair" | MembershipTeaser.tsx:37 | **FALSE** |
| 20 | "Permanent Weaves / Hokkaido" campaign | Hero.tsx:35 | **FALSE** |
| 21 | "Kyoto Tokyo Otaru" city list | Hero.tsx:385 | **FALSE** |
| 22 | "Hokkaido 43.19 N" | SiteHeader.tsx:348 | **FALSE** |
| 23 | "Otaru Night Lanterns" kanji | SiteHeader.tsx:345 | **MISLEADING** |
| 24 | "ALL OBJECTS PROTECTED" | SiteFooter.tsx:188 | **MEANINGLESS** |

## 5. Bugs Found

| Bug | Location |
|---|---|
| Kanji "limited forty" next to "44 PIECES WORLDWIDE" — contradicts | NewDrops.tsx:49 |
| Currency defaults to USD, not INR — Indian brand showing dollar prices | currency.tsx:36 |
| Prices in catalog.ts are in USD (e.g. $480) not INR | catalog.ts:63 |
| `formatPrice` uses `en-US` locale, not Indian digit grouping | currency.tsx:65 |
| Product "run quantity" says "44 PIECES" but Hero says "3 Live Objects" | Hero.tsx:28 vs catalog.ts:66 |
| Footer claims "ALL OBJECTS PROTECTED" — meaning unclear | SiteFooter.tsx:188 |
| Multiple layers of custom cursor suppression suggest reactive fixes | layout.tsx:77-93 + globals.css:82-93 |

## 6. Disposition Table

### Keep and Evolve
- Next.js App Router structure
- Prisma + PostgreSQL (add Residents model)
- Numbered-object system (rebrand to No. X of Y)
- Product page skeleton
- Cart drawer mechanics (convert to reservation)
- Skip link, metadata structure
- Zod env validation
- Middleware (rate limiting, security headers)
- Framer Motion, GSAP (for Thread)
- clsx utility

### Flag (FEATURE_FULL_ARCHIVE=false), do not delete
- Membership tiers, Collector profile, Track order, Ledger/provenance
- MoonProgress, StudioStatusBar (JST clock)
- Currency switcher, Search overlay, Archive index
- CollectorPassportSection (replace with Residents)
- ArchiveTextureOverlay, ArchivePageTransition
- ArtBackgroundPlate, SashikoGrid, VerticalKanjiStamp backgrounds
- Three.js/react-three-fiber, Lenis, Shopify Hydrogen, Sanity CMS

### Rebuild
- Hero, Story, Product plates, Waitlist/Residents, Footer
- OG/share images, All copy, Global CSS (new tokens)
- Typography (Shippori Mincho + Hanken Grotesk + DM Mono)
- Color scheme: light theme (paper background)

### Delete from UI
- All 24 fabricated heritage claims
- Generated art (Great Wave, cherry blossom, lanterns, poppies)
- Decorative kanji watermarks
- Fictional chapter names and stories
- USD/multi-currency pricing

## 7. Disagreements with Brief

1. **Tailwind CSS**: Brief says "keep existing stack" but design system spec describes vanilla CSS. **Proposal**: Hybrid — keep Tailwind for utilities, write new design system as CSS custom properties. New components use CSS not Tailwind classes.

2. **styled-jsx**: Used in several components, not mentioned in brief. **Proposal**: New components use vanilla CSS. Keep styled-jsx in flagged legacy.

3. **Prisma vs Supabase/Vercel Postgres**: Brief suggests lightweight store. Prisma is already configured with a 745-line schema. **Proposal**: Add Residents model to existing Prisma schema. Strictly better.

4. **Redis middleware**: Required for rate limiting, will fail if not configured. **Proposal**: Graceful fallback — fail open in dev with warning. Simpler in-memory rate limiting for waitlist in v1.

5. **Three.js**: ~200KB+ in deps, not used on home. **Proposal**: Remove from dependencies in this branch.

## 8. Performance Concerns

- Three.js in bundle even if unused
- All home sections are `'use client'` — no Server Components
- Multiple wrapping context providers
- Generated art API could be static files
- GSAP + Framer Motion both loaded (choose one where possible)

---

*Recon complete. Phase 1: Plan follows.*
