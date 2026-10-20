# HOUSE OF OTARU — ROUTE & COMPONENT ARCHITECTURAL MAP
**Document ID:** OTARU-MAP-001  
**Author:** Senior Frontend Architect & Systems Engineer  
**Scope:** Complete App Router Inventory, API Surfaces, Component Hierarchy & Dependencies  

---

## 1. Application Routes Map (`src/app/`)

| Route Path | File Location | Rendering Mode | Purpose & Data Source | Architectural Status | Disposition |
|---|---|---|---|---|---|
| `/` | `src/app/page.tsx` | Server (RSC) | 12-movement homepage experience | **Active** | Refactor in Prompts 03–06 |
| `/account` | `src/app/account/page.tsx` | Client (`'use client'`) | Collector profile dashboard | **Duplicate** of `/profile` | Keep as canonical `/account`; 301-redirect `/profile` |
| `/account/addresses` | `src/app/account/addresses/page.tsx` | Client | Shipping address book | **Active** | Retain |
| `/account/login` | `src/app/account/login/page.tsx` | Client | Member login form | **Duplicate** of `/sign-in` | Keep as canonical `/sign-in`; redirect `/account/login` |
| `/account/orders` | `src/app/account/orders/page.tsx` | Client | Order history list | **Active** | Retain |
| `/admin/*` | `src/app/admin/*/page.tsx` | Hybrid | Security telemetry, drop control, ledger | **Active** (Internal) | Retain behind `ADMIN_API_SECRET` |
| `/archive` | `src/app/archive/page.tsx` | Client | All 10 archival holdings index & filter | **Active** | Retain; unify with core product data |
| `/artifact/[handle]` | `src/app/artifact/[handle]/page.tsx` | Server / Async | Legacy handle-based PDP | **Duplicate** of `/product/[id]` | 301-redirect `/artifact/*` to `/product/*` |
| `/bag` | `src/app/bag/page.tsx` | Client | Re-exports `/cart/page.tsx` | **Duplicate** of `/cart` | 301-redirect `/bag` to `/cart` |
| `/cart` | `src/app/cart/page.tsx` | Client | Dedicated cart overview page | **Active** | Retain |
| `/chapter` | `src/app/chapter/page.tsx` | Server | Chapter index view | **Duplicate** of `/chapters` | 301-redirect `/chapter` to `/chapters` |
| `/chapter/[slug]` | `src/app/chapter/[slug]/page.tsx` | Server | Chapter detail editorial view | **Active** | Retain |
| `/chapters` | `src/app/chapters/page.tsx` | Server | Seasonal volumes index grid | **Active** | Retain as canonical chapter index |
| `/checkout` | `src/app/checkout/page.tsx` | Client (54KB) | 3-step checkout & payment terminal | **Active** | Refactor; remove mock sandbox tab |
| `/checkout/success` | `src/app/checkout/success/page.tsx`| Client | Order confirmation & provenance receipt| **Active** | Retain |
| `/drop-01` | `src/app/drop-01/page.tsx` | Server | Drop 01 showcase (`drop01.ts`) | **Broken Link** | Fix PDP links to match catalog |
| `/drops` | `src/app/drops/page.tsx` | Server | Live drops listing (`NewDrops.tsx`) | **Redundant** | Consolidate with `/drop-01` or `/archive` |
| `/journal` | `src/app/journal/page.tsx` | Server | Field Notes editorial journal index | **Active** | Retain |
| `/journal/[slug]` | `src/app/journal/[slug]/page.tsx` | Server | Journal article detail (`JOURNAL_POSTS`)| **Active** | Retain |
| `/membership` | `src/app/membership/page.tsx` | Client | 3-tier membership claims | **Unverified Copy** | Remove tiers until operations are real |
| `/privacy` | `src/app/privacy/page.tsx` | Server | Privacy policy | **Placeholder Copy** | Replace `[CONFIRM]` with real legal copy |
| `/product` | `src/app/product/page.tsx` | Client | Search param PDP (`?id=041`) | **Legacy** | Redirect to `/product/041` |
| `/product/[id]` | `src/app/product/[id]/page.tsx` | Server / Async | Master product detail view | **Active** | Master PDP canonical route |
| `/profile` | `src/app/profile/page.tsx` | Client | Re-exports `ProfileDashboard` | **Duplicate** of `/account` | Redirect to `/account` |
| `/returns` | `src/app/returns/page.tsx` | Client | RMA & lifetime repair dispatch form | **Active** | Retain |
| `/shipping-exchanges` | `src/app/shipping-exchanges/page.tsx` | Server | Shipping & exchange policy | **Placeholder Copy** | Replace `[CONFIRM]` with real policy |
| `/sign-in` | `src/app/sign-in/page.tsx` | Client | Authentication form | **Active** | Canonical authentication entry |
| `/size-guide` | `src/app/size-guide/page.tsx` | Server | Indian body measurement table | **Active** | Retain |
| `/story` | `src/app/story/page.tsx` | Server | Story & craft pair essays | **Active** | Unify with studio content |
| `/studio` | `src/app/studio/page.tsx` | Server (226 lines)| Atelier history, values, team | **Shadowed** by redirect | Remove redirect or merge with `/story` |
| `/terms` | `src/app/terms/page.tsx` | Server | Terms of service | **Placeholder Copy** | Replace `[CONFIRM]` with real legal copy |
| `/track-order` | `src/app/track-order/page.tsx` | Client | Shipment dispatch tracking | **Active** | Retain |
| `/verify` | `src/app/verify/page.tsx` | Client | Garment provenance serial verification | **Active** | Retain |
| `/wishlist` | `src/app/wishlist/page.tsx` | Client | Saved objects drawer/page | **Active** | Retain |

---

## 2. API Routes Map (`src/app/api/`)

| Route Path | Method | Purpose | Authentication / Security | Status |
|---|:---:|---|---|---|
| `/api/checkout` | `POST` | Authoritative pricing & order token issuance | IP rate limiter + Idempotency engine | **Active & Secure** |
| `/api/checkout/verify` | `POST` | Razorpay HMAC payment verification | HMAC timing-safe equal + Nonce check | **Active** (Disable mock in prod) |
| `/api/cart` | `POST` | Server-side cart validation | Zod schema validation | **Active** |
| `/api/webhooks/razorpay` | `POST` | Razorpay payment capture webhook | HMAC `x-razorpay-signature` | **Active & Secure** |
| `/api/webhooks/order` | `POST` | Shopify/external order sync | HMAC `x-shopify-hmac-sha256` | **Active** |
| `/api/webhooks/revalidate` | `POST` | On-demand ISR revalidation | Secret token check | **Active** |
| `/api/newsletter` | `POST` | Klaviyo/local email subscription | Email format validation | **Active** |
| `/api/waitlist` | `POST` | Waitlist reservation | Email format validation | **Active** |
| `/api/residents` | `POST` | **Missing route** called by `CircleEmailSection` | None (returns 404) | **BROKEN (P0)** — Implement |
| `/api/hero-image` | `GET` | Dynamic hero background image | Path check (Hardcoded Windows paths) | **FRAGILE (P0)** — Refactor |
| `/api/images/[id]` | `GET` | Dynamic product image server | Path check (Hardcoded Windows paths) | **FRAGILE (P0)** — Refactor |
| `/api/art/[name]` | `GET` | Procedural SVG art generation | None | **Deprecated** — Remove |
| `/api/card/[number]` | `GET` | Dynamic social share OG image | SVG/Canvas generator | **Active** |
| `/api/provenance/[serial]`| `GET` | Provenance serial record lookup | Public lookup | **Active** |
| `/api/shipping/returns` | `POST` | RMA request dispatch | Basic validation | **Active** |
| `/api/health` | `GET` | Service liveness probe | Public | **Active** |
| `/api/ready` | `GET` | Service readiness probe (DB/Redis) | Public | **Active** |

---

## 3. Home Components Inventory (`src/components/home/`)

There are currently **33 components** in `src/components/home/`. Many compete with or duplicate one another.

| Component Name | File Size | Role in System | Current Status | Disposition |
|---|:---:|---|---|---|
| `HeldHero.tsx` | 6.6 KB | Movement 01: Backlit atelier cloth hero | **Active** in `page.tsx` | Overhaul in Prompt 03 |
| `Hero.tsx` | 13.3 KB | Slide-cycling carousel with mouse offset | **Unused** on homepage | **Remove** |
| `HeroSection.tsx` | 3.1 KB | Legacy "Two Harbours" hero with inline form | **Unused** | **Remove** |
| `HeroToriiArt.tsx` | 9.0 KB | Torii gate procedural vector art | **Unused** | **Remove** |
| `HeldClothCanvas.tsx` | 8.6 KB | Three.js WebGL normal map cloth shader | **Optional** WebGL layer | Lazy-load or archive |
| `ObjectReveal.tsx` | 9.1 KB | Movement 02: Yama Field Jacket reveal | **Active** in `page.tsx` | Refactor for clean typography |
| `BatchSection.tsx` | 3.1 KB | Movement 03: Current 4-piece batch grid | **Active** in `page.tsx` | Preserve & polish |
| `DropSection.tsx` | 1.0 KB | Used in `/drop-01` (`content/drop01.ts`) | **Active** in `/drop-01` | Fix link destinations |
| `NewDrops.tsx` | 8.2 KB | Used in `/drops` | **Redundant** | Consolidate |
| `ObjectCard.tsx` | 4.3 KB | Archival product card with hover swap | **Active** in `BatchSection` | Retain & refine |
| `MaterialMacroSection.tsx`| 11.9 KB | Movement 04: Interactive fabric hotspots | **Active** in `page.tsx` | Retain (ensure valid image) |
| `WhyThisObject.tsx` | 4.2 KB | Movement 05: 3 design convictions | **Active** in `page.tsx` | Retain & refine |
| `ChaptersScrollSnap.tsx` | 4.1 KB | Movement 06: Horizontal chapter slider | **Active** in `page.tsx` | Retain (refine mobile UX) |
| `ChapterShowcase.tsx` | 9.0 KB | Alternative chapter showcase | **Unused** on homepage | **Remove** |
| `StudioStorySection.tsx` | 5.0 KB | Movement 07: Canal warehouse story | **Active** in `page.tsx` | Fix "Since 1907" claim |
| `StorySection.tsx` | 2.2 KB | Used in `/story` | **Active** in `/story` | Merge with studio story |
| `StoryJourney.tsx` | 4.4 KB | Alternative story timeline | **Unused** | **Remove** |
| `ObjectLifeTimeline.tsx` | 6.9 KB | Movement 08: Day 1 to Year 5 patina | **Active** in `page.tsx` | Retain |
| `PermanentArchiveCta.tsx`| 2.2 KB | Movement 09: 10-piece archive invitation | **Active** in `page.tsx` | Retain |
| `ArchiveTeaser.tsx` | 5.8 KB | Alternative archive teaser card | **Unused** | **Remove** |
| `JournalThreeCards.tsx` | 4.7 KB | Movement 10: 3 field notes cards | **Active** in `page.tsx` | Retain |
| `JournalTeaser.tsx` | 4.0 KB | Alternative journal teaser | **Unused** | **Remove** |
| `FieldNotesSection.tsx` | 1.8 KB | Used in `/journal` | **Active** in `/journal` | Retain |
| `MadeToRemain.tsx` | 5.0 KB | Movement 11: Lifetime repair commitment | **Active** in `page.tsx` | Retain |
| `Craftsmanship.tsx` | 8.4 KB | Alternative craftsmanship layout | **Unused** | **Remove** |
| `CraftPairsSection.tsx` | 1.0 KB | Used in `/story` | **Active** in `/story` | Retain |
| `CircleEmailSection.tsx` | 3.1 KB | Movement 12: Waitlist signup | **Active** in `page.tsx` | Fix broken API endpoint |
| `NewsletterSignup.tsx` | 2.9 KB | Alternative newsletter block | **Unused** (fake submit) | **Remove** |
| `CollectorPassportSection.tsx`| 40.6 KB| 937-line complex phone/SMS auth passport | **DEAD CODE** (0 imports) | **Remove** |
| `MembershipTeaser.tsx` | 7.0 KB | 3-tier membership teaser | **Unused** | **Remove** |
| `ResidentsSection.tsx` | 5.4 KB | Waitlist resident count display | **Unused** on homepage | Retain for `/residents` |
| `Philosophy.tsx` | 4.1 KB | Alternative philosophy section | **Unused** | **Remove** |
| `ClosingSection.tsx` | 0.8 KB | Bottom colophon | **Unused** | **Remove** |

---

## 4. Root Working Tree Foreign & Clutter Files

The following files exist in the project root and must be cleaned up to ensure clean builds and repository hygiene:
- `signature.tsx` (7.9 KB) — Foreign portfolio template for "Latent Studio".
- `sections.tsx` (7.2 KB) — Foreign portfolio sections for "Latent Studio".
- `page.tsx` (100 B) — Dummy export file (active router is in `src/app/page.tsx`).
- `src copy/` — Abandoned backup directory.
- `prisma copy/` — Abandoned backup directory.
- `next.config copy.mjs` & `vercel copy.json` — Redundant backup configuration files.
- `make-30-commits.ps1` & `make-40-commits.ps1` — Unrelated git-commit automation scripts.
- `otaru-preview (1).html` & `preview.html` — Stale static HTML exports.
