# HOUSE OF OTARU — PRINCIPAL ARCHITECTURAL & TECHNICAL AUDIT
**Document ID:** OTARU-AUDIT-001  
**Author:** Principal Software Engineer & Senior E-Commerce Architect  
**Scope:** Full Repository (`theninthfoundry/otaru-`) vs. Live Production Deployment (`otaru-three.vercel.app`)  
**Evaluation Standard:** Institutional Luxury Maison & Production-Ready Commerce  
**Audit Date:** October 2026  

---

## 1. Executive Summary

A comprehensive, evidence-based audit was conducted on the House of Otaru codebase and its deployed Vercel instance. House of Otaru possesses a compelling core narrative: merging Japanese material discipline with Indian textile heritage. Underneath the interface lies sophisticated backend plumbing—including zero-trust price recalculation, tamper-evident cryptographic ledger blocks, Razorpay HMAC verification, and atomic transactional outbox engines.

However, the application suffers from severe **architectural fragmentation, visual noise, disconnected user journeys, and unverified narrative claims**.

### Primary System Diagnosis:
1. **Garment Merchandising Disconnected from Media**: Active product cards and PDPs rely on programmatic SVG vector line drawings (`DesignedArtifactGraphic.tsx`), while hero image endpoints hardcode absolute local developer filepaths (`C:/Users/namir/.gemini/antigravity-ide/brain/...`). In production, this causes 404 image errors and forces the UI into fallback wireframes.
2. **Three Competing Data Models**: Products are defined across three incompatible schemas:
   - `src/lib/catalog.ts` (`PRODUCT_CATALOG` with numeric IDs: `'041'`, `'042'`, price in USD: `$480`).
   - `content/drop01.ts` (`drop01` with hyphenated slugs: `'atelier-jacket-01'`, price in INR: `₹28,500`).
   - `src/lib/integrations/shopify/mocks.ts` (Shopify handles: `'artifact-001-denim-jacket'`).
3. **Broken Navigation & Cross-Route Dead Ends**: Clicking a product in `/drop-01` links to `/product/atelier-jacket-01`, which returns a 404 "Object Not Found" because `/product/[id]` only indexes numeric IDs. The newsletter form in `CircleEmailSection.tsx` calls non-existent `/api/residents`, throwing unhandled network errors.
4. **Middlewarer/Route Shadowing & Duplication**: `src/middleware.ts` 301-redirects `/studio` to `/story`, making the 226-line `src/app/studio/page.tsx` unreachable. Duplicate route pairs exist across the app: `/account` vs `/profile`, `/sign-in` vs `/account/login`, `/cart` vs `/bag`, and `/chapter` vs `/chapters`.
5. **Dead Code & Foreign Repositories in Working Tree**: 40.6KB of authentication code (`CollectorPassportSection.tsx`) sits completely unreferenced. Unrelated agency code for "Latent Studio" (`signature.tsx`, `sections.tsx`) and git-stuffing scripts (`make-30-commits.ps1`, `make-40-commits.ps1`) pollute the root directory.

---

## 2. Source of Truth & Architecture Audit

### 2.1 Framework & Runtime
- **Framework**: Next.js 15.1.0 (App Router), React 19.0.0, Node.js runtime.
- **TypeScript**: Strict mode enabled (`strict: true`, `noImplicitAny: true`, `noUncheckedIndexedAccess: true`).
- **Build Guard**: `package.json` specifies `"build": "node scripts/check-claims.mjs && next build"`. While `check-claims.mjs` checks `content/*.ts` for `[CONFIRM]`, multiple customer-facing routes (`/shipping-exchanges`, `/privacy`, `/terms`) contain hardcoded `[CONFIRM: ...]` strings directly in JSX.

### 2.2 Styling System Inconsistencies
- The project declares **three competing styling methodologies**:
  1. **Tailwind CSS 3.4.0** with custom configuration (`tailwind.config.ts`).
  2. **Vanilla CSS Design Tokens** (`src/styles/tokens.css` and `src/styles/globals.css`).
  3. **Styled-Components 6.5.3** in `package.json` dependencies (unused, generating unnecessary bundle weight and potential React 19 SSR hydration conflicts).
- **Token Drift**: `tokens.css` defines `--paper: #EFEBE3`, `--ink: #161616`, `--indigo: #1F2A44`. Simultaneously, components across `src/components/home/` use arbitrary hardcoded Tailwind colors (`bg-[#070D14]`, `text-[#F4F0E8]`, `bg-[#11161B]`, `bg-[#0B1420]/90`).

### 2.3 Asset Delivery & Production Failure
- `src/app/api/hero-image/route.ts` (lines 11–14) and `src/app/api/images/[id]/route.ts` (lines 6–7) hardcode absolute Windows local paths:
  ```ts
  const ARTIFACT_DIRS = [
    'C:/Users/namir/.gemini/antigravity-ide/brain/4bc2bd3d-ccb4-4fd5-a1fa-496dd5ca5dd9',
    'C:/Users/namir/.gemini/antigravity-ide/brain/162753e9-e443-47b9-9c9b-5a5b41ace49d',
    path.join(process.cwd(), 'public', 'images', 'products'),
    path.join(process.cwd(), 'public', 'images', 'hero'),
  ];
  ```
- **Consequence**: When deployed to serverless environments (Vercel, AWS, Cloudflare), these local paths do not exist. `public/images/products` does not exist in git. All dynamic image routes fail or fall back to empty strings, forcing `ImagePlaceholder.tsx` into `DesignedArtifactGraphic.tsx` wireframe SVGs.

---

## 3. Visual & Creative Direction Audit

### 3.1 Visual Noise vs. Luxury Restraint
The deployed page at `otaru-three.vercel.app` suffers from decorative overload:
- **Kanji & Seal Stamp Proliferation**: Hanko stamps ("小樽", "印", "四時四章", "永久記録") are scattered across headers, footers, image placeholders, cards, and modals as decorative filler.
- **Vector Drawing Overload**: The footer (`SiteFooter.tsx`, 616 lines) renders massive inline SVG illustrations of rock crags, botanical stems, and celestial coordinate spheres, competing with brand clarity.
- **Art Historical Disconnect**: The site repeatedly uses Hokusai’s *The Great Wave off Kanagawa* and cherry blossom motifs (`ArtBackgroundPlate.tsx`), contradicting the specific Hokkaido canal warehouse and Indian handloom narrative.

### 3.2 Typography & Pacing
- The site loads four separate font families via `next/font/google`:
  - `Fraunces` (Display Serif)
  - `Hanken Grotesk` (Body Sans)
  - `DM Mono` (Technical / Numerals)
  - `Tiro Devanagari Hindi` (Devanagari / Hindi)
- Headlines often feature split spans (`ScrollTextReveal`, `use-split-text`) that create layout shifts on initial paint and read as concatenated single words on screen readers unless explicitly patched with `role="text"`.
- Pacing is burdened by 12 consecutive homepage movements (`HeldHero`, `ObjectReveal`, `BatchSection`, `MaterialMacroSection`, `WhyThisObject`, `ChaptersScrollSnap`, `StudioStorySection`, `ObjectLifeTimeline`, `PermanentArchiveCta`, `JournalThreeCards`, `MadeToRemain`, `CircleEmailSection`). Visitors must scroll through extensive pseudo-archival commentary before reaching clear shopping interactions.

---

## 4. Functional Journey Audit

| Journey | Entry Point | Expected Flow | Observed Flow | Status |
|---|---|---|---|:---:|
| **01. Homepage Hero Discovery** | `/` | Campaign image leads to primary action | Hero renders backlit jacket; CTA smooth-scrolls to `#batch` | **PASS** (Needs Art Direction) |
| **02. Drop 01 Merchandising** | `/drop-01` | Browse Drop 01, click piece, view details | Clicks `/product/atelier-jacket-01` → 404 "Object Not Found" | **FAIL (P0)** |
| **03. Archive Grid Filtering** | `/archive` | Filter by category, sort by price | Filters and quick-view modal work on `PRODUCT_CATALOG` items | **PASS** |
| **04. Product Detail View** | `/product/041` | Select size, view availability, Add to Bag | Size selection works; updates `useCart` state in `localStorage` | **PASS** |
| **05. Bag Drawer & Counter** | Header icon | Drawer opens, lists lines, calculates subtotal | Drawer animates smoothly, subtotal calculated accurately | **PASS** |
| **06. Checkout (Live Mode)** | `/checkout` | 3-step accordion, Razorpay modal opens | Fails closed with 503 if Razorpay live keys are unconfigured | **PASS** (Zero-Trust) |
| **07. Checkout (Sandbox Mode)**| `/checkout` | Simulated payment flow for testing | Simulates order creation via `/api/checkout/verify` with `mock: true` | **FAIL (P1)** (Misleading in Prod) |
| **08. Order Confirmation** | `/checkout/success` | Provenance certificate & dispatch details | Renders receipt and dispatch timeline from URL query parameters | **PASS** |
| **09. Archival Circle Signup** | `/#circle` | Email input reserves waitlist spot | POSTs to `/api/residents` → 404 Not Found error alert | **FAIL (P0)** |
| **10. Studio Navigation** | Footer link `/studio` | View atelier history, timeline, canal studio | 301 Redirects to `/story` (renders basic `StorySection`) | **FAIL (P1)** |
| **11. RMA / Repairs** | `/returns` | Submit garment number for repair | Interactive RMA form functions against `/api/shipping/returns` | **PASS** |
| **12. Policy & Terms** | `/terms`, `/privacy` | Review legally binding policies | Displays visible `[CONFIRM: ...]` placeholder copy | **FAIL (P1)** |

---

## 5. Security & Risk Audit

### 5.1 Zero-Trust Price Boundary (COMMENDED)
- `src/app/api/checkout/route.ts` recalculates line item prices server-side using `PRODUCT_CATALOG`. Client-supplied amounts are ignored.
- Taxes (12% GST) and shipping are computed authoritatively on the server.

### 5.2 Payment Verification & Replay Protection
- `src/app/api/checkout/verify/route.ts` validates Razorpay HMAC-SHA256 signatures using `crypto.timingSafeEqual`.
- **Payment Nonce**: Single-use nonces are issued and consumed atomically via Redis/Lua script (`claimNonce`), preventing replay attacks.
- **Risk**: In non-production environments, the mock sandbox allows bypassing payment verification by passing `{ mock: true }`. Ensure `STRICT_PAYMENT_MODE=true` is strictly enforced in production deployment gates.

### 5.3 Distributed Rate Limiting & Fail-Closed Guard
- `src/middleware.ts` applies Upstash Redis rate limiting (60 requests/minute per IP).
- Critical security paths (`/api/checkout`, `/admin`) fail closed (HTTP 503) if Redis becomes unreachable in production.

### 5.4 Filesystem Write Hazards in Serverless
- `src/lib/payments/ledger.ts` writes fallback transactions to `src/data/payment-ledger.json`.
- In AWS Lambda / Vercel serverless functions, the root directory is read-only. Unhandled file writes fail silently or throw runtime exceptions. All persistence must target PostgreSQL via Prisma or distributed Redis.

---

## 6. Comprehensive Findings Matrix (Ranked by Severity)

| ID | Sev | Category | Affected File(s) | Description & User Impact | Recommended Remediation |
|---|:---:|---|---|---|---|
| **F-01** | **P0** | Data Integrity / Routing | `src/components/ui/ProductPlate.tsx`, `content/drop01.ts` | `/drop-01` products link to `/product/${product.slug}` (`atelier-jacket-01`), which fails with a 404 on `/product/[id]` because `PRODUCT_CATALOG` uses numeric keys. Users cannot purchase Drop 01 garments. | Unify product data layer. Store slug and ID mappings in a single authoritative catalog; resolve routes by both slug and ID. |
| **F-02** | **P0** | Merchandising / Media | `src/app/api/images/[id]/route.ts`, `src/app/api/hero-image/route.ts` | Dynamic image endpoints query hardcoded Windows user paths (`C:/Users/namir/...`). In production, all images fail to load and fall back to SVG wireframes. | Store optimized images in `public/images/products/` or configure Cloudinary / Sanity CDN remote storage. Remove local drive paths. |
| **F-03** | **P0** | Functional / API | `src/components/home/CircleEmailSection.tsx` | Waitlist form submits to `/api/residents`, which does not exist in `src/app/api`. Form throws network error alert to customers. | Create `/api/residents/route.ts` or route submissions to `/api/newsletter/route.ts`. |
| **F-04** | **P1** | Content Credibility | `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/app/shipping-exchanges/page.tsx` | Active legal and shipping routes display visible `[CONFIRM: ...]` placeholder copy to end users. | Replace placeholders with plain-language, legally accurate DPDP Act 2023 privacy policy and standard luxury maison terms. |
| **F-05** | **P1** | Routing / Architecture | `src/middleware.ts`, `src/app/studio/page.tsx` | Middleware 301-redirects `/studio` to `/story`. The 226-line `StudioPage` (with timeline, values, team) is shadowed and inaccessible. | Remove redirect or consolidate `/studio` and `/story` into a unified editorial brand route. |
| **F-06** | **P1** | Code Quality / Dead Code | `src/components/home/CollectorPassportSection.tsx` | 40.6KB complex authentication component is completely unimported and unused across the entire codebase. | Remove `CollectorPassportSection.tsx` from the codebase to reduce maintenance surface. |
| **F-07** | **P1** | Testing / Integrity | `tests/e2e/purchase-flow.spec.ts` | Playwright test expects "Raw Denim Chore Coat" at `/artifact/artifact-001-denim-jacket`. Real catalog contains "Yama Field Jacket" at `/product/041`. E2E tests fail. | Update test assertions to match the true unified catalog routes and names. |
| **F-08** | **P2** | Architecture / Redundancy | `src/app/account` & `src/app/profile`, `src/app/sign-in` & `src/app/account/login`, `src/app/chapter` & `src/app/chapters` | Redundant route pairs duplicate page components byte-for-byte or re-export identical views. | Normalize routes: canonicalize to `/account`, `/sign-in`, `/chapters`, and `/cart`; 301-redirect aliases. |
| **F-09** | **P2** | Repository Hygiene | Root directory (`signature.tsx`, `sections.tsx`, `make-30-commits.ps1`, `src copy/`, `prisma copy/`) | Unrelated agency code ("Latent Studio") and backup folders clutter root working tree and confuse tooling. | Delete foreign root files and backup folders. Clean `.gitignore`. |
| **F-10** | **P2** | Performance / Dependencies | `package.json` (`styled-components`) | `styled-components` is installed alongside Tailwind and CSS variables, with no active usage in `src/components`. | Remove `styled-components` to streamline client bundle size and avoid React 19 SSR hydration mismatches. |
| **F-11** | **P2** | Brand / Credibility | `src/components/home/StudioStorySection.tsx` | Claims "Since 1907 · Otaru Canal" while brand manifesto and `content/claims.ts` specify House of Otaru is an independent 2026 label. | Align historical copy to authentic brand positioning: 2026 label operating out of historical architectural spaces. |
| **F-12** | **P3** | Visual Design / Footer | `src/components/layout/SiteFooter.tsx` | Footer contains 616 lines of code with massive SVG drawings, but lacks basic links to Privacy Policy and Terms of Service. | Refactor footer: add Privacy and Terms links; streamline SVG illustrations. |

---

## 7. Preservation, Deprecation & Implementation Strategy

### 7.1 What to Preserve
- **Core Zero-Trust Pricing Engine**: `src/app/api/checkout/route.ts` authoritative server-side calculation.
- **Cryptographic Payment Flow**: Razorpay HMAC verification, single-use nonce consumption, and transaction outbox engine.
- **Prisma Schema Foundations**: Institutional data models in `prisma/schema.prisma` for Orders, Payments, Inventory, and Ledger.
- **Design Token Structure**: CSS variables in `src/styles/tokens.css` for palette, fluid typography, and spacing scale.
- **Product Metadata**: Rich material, care rituals, and weave specifications in `src/lib/catalog.ts` for objects 041–044 and archive holdings 033–038.

### 7.2 What to Remove or Replace
- **Remove**: Foreign root files (`signature.tsx`, `sections.tsx`, `page.tsx`, `src copy`, `prisma copy`, commit scripts).
- **Remove**: Dead 40.6KB component (`CollectorPassportSection.tsx`), duplicate `HeroToriiArt.tsx`, and unused `HeroSection.tsx`.
- **Remove**: Procedural Japanese art endpoints (`/api/art/[name]`) and Hokusai wave plates that contradict the brand identity.
- **Remove**: Simulated "Registry Escrow Sandbox" payment tab in `/checkout`.
- **Replace**: Absolute local filepaths in `/api/hero-image` and `/api/images/[id]` with real static assets in `public/images/`.
- **Replace**: `[CONFIRM]` placeholder copy in legal and policy pages with authentic, production-grade text.

### 7.3 Recommended Implementation Order
1. **Phase 1: Repository Hygiene & Data Unification** (Remove dead code, unify product catalog into single source of truth, fix broken links).
2. **Phase 2: Master Prompt 02 — Design System & Visual Direction** (Palette tokens, typography scale, photographic art direction).
3. **Phase 3: Master Prompt 03 — Signature Campaign Hero** (Single focal-point photography, deliberate typography, mobile-first composition).
4. **Phase 4: Master Prompt 04–06 — Homepage, Navigation & Motion** (Pacing, product discovery, restrained motion).
5. **Phase 5: Master Prompt 07–08 — Production Commerce & Forms** (Cart persistence, unified PDP, newsletter API, legal routes).
6. **Phase 6: Master Prompt 09–14 — Security, Performance, QA & Release** (End-to-end verification, Lighthouse optimization, zero-defect release).
