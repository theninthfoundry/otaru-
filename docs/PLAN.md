# IMPLEMENTATION PLAN — HOUSE OF OTARU REDESIGN (PHASE 1)

**Branch:** `redesign/two-harbours`  
**Architecture:** Next.js 15 App Router (TypeScript Strict)  
**Theme:** Light Theme Only (Two Harbours: Japanese Craft x Indian Heritage)  

---

## 1. Executive Summary & Page Architecture

The landing page (`/`) will be rebuilt as an editorial, tactile experience adhering to the "Two Harbours" truth. It strips away all 24 fictional Hokkaido archive claims and establishes an India-first, craft-literate, community-led maison ready to launch Drop 01.

### Master Section Rhythm (Strict Order)
1. **Header (Minimal)**: Left: Wordmark `House of Otaru` with tiny `小樽` mark. Right: Drop-state chip (`Waitlist Open`) + `Tadaima` action button.
2. **01. Hero**: H1: *"A house between two harbours."* Supporting line: *"Japanese craft sensibility, Indian cloth and hands [CONFIRM], cut for Indian bodies [CONFIRM]. Drop 01 opens [DATE]."* Inline Door waitlist form. Two Threads entering from left and right meeting at center. Single photographic Plate mount.
3. **02. The Story**: Three short paragraphs: *Why Otaru*, *Two Harbours*, *The Maker* (truthful founder attribution). One pull-quote. Direct link to `/story`.
4. **03. Craft Pairs**: Five interactive diptychs revealing parallel histories: Sashiko & Kantha, Shibori & Bandhani, Aizome & Indigo/Ajrakh, Boro & Godhadi, Katazome & Dabu. Tap/hover reveals shared idea.
5. **04. Drop 01**: Four numbered product plates with madder-red Stamp ("No. 01 of 40"), prices in ₹ with Indian grouping (e.g. ₹15,000), fit note, pre-order close date, clear *Atelier* vs *Everyday* badges.
6. **05. Residents**: Resident privileges (early drop access, numbered card, colourway voting), live count (rendered only above threshold, default 100), full residency application form.
7. **06. Field Notes**: Three dated building-in-public notes on craft decisions, sourcing, and material challenges.
8. **07. Closing Door**: *"Leave the door open. We'll leave the light on."* with repeat Tadaima Door action.
9. **08. Footer**: Minimal: Instagram, email, shipping & exchanges, size guide, privacy, terms, `家 · घर` lockup, and trademark line if confirmed.

---

## 2. Component Hierarchy (Server vs. Client)

```
src/app/layout.tsx (RSC)
├── AppProviders (Client - lightweight contexts only)
├── SiteHeader ('use client' - dynamic DropChip & Tadaima trigger)
├── main#main (RSC)
│   └── src/app/page.tsx (RSC)
│       ├── Thread ('use client' - SVG running-stitch scroll choreography)
│       ├── HeroSection ('use client' - inline form & thread anchors)
│       │   ├── Plate (RSC/Client - designed paper mount)
│       │   └── DoorButton ('use client' - Tadaima/Okaeri transition)
│       ├── StorySection (RSC - editorial typography & pull quote)
│       ├── CraftPairsSection ('use client' - interactive diptychs)
│       │   └── CraftPair (x5 diptych items)
│       ├── DropSection (RSC - Drop 01 showcase)
│       │   └── ProductPlate (x4 - Plate + Stamp + INR price)
│       │       ├── Plate
│       │       └── Stamp ('use client' - viewport hanko seal press)
│       ├── ResidentsSection ('use client' - waitlist form with DPDP consent)
│       │   └── DoorButton
│       ├── FieldNotesSection (RSC - 3 editorial notes)
│       └── ClosingSection ('use client' - closing lockup + DoorButton)
└── SiteFooter (RSC - minimal legal & craft mark lockup)
```

---

## 3. Design Tokens (`src/styles/tokens.css`)

```css
:root {
  /* ===== PALETTE (Light Theme Only) ===== */
  --paper:            #F4F0E8; /* washi-warm off-white, base */
  --paper-2:          #EBE5D8; /* secondary tactile surfaces */
  --ink:              #151515; /* primary text */
  --ink-muted:        rgba(21, 21, 21, 0.65);
  --ink-subtle:       rgba(21, 21, 21, 0.40);
  
  --indigo:           #1F2A44; /* the thread, headings, primary buttons */
  --indigo-hover:     #2B3A5E;
  
  --madder:           #A8372C; /* the stamp, one accent per screen max */
  --turmeric:         #D9A21B; /* rare highlight */
  
  --hairline:         rgba(21, 21, 21, 0.14); /* 1px hairlines */
  --hairline-strong:  rgba(21, 21, 21, 0.28);

  /* ===== TYPOGRAPHY ===== */
  --font-display:     'Shippori Mincho', 'Fraunces', serif;
  --font-devanagari:  'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif;
  --font-body:        'Hanken Grotesk', system-ui, -apple-system, sans-serif;
  --font-mono:        'DM Mono', monospace;

  /* Fluid Type Scale */
  --display-xl:       clamp(3.5rem, 9vw, 9rem);
  --display-l:        clamp(2.5rem, 6vw, 5.5rem);
  --h2:               clamp(1.75rem, 3vw, 2.75rem);
  --body:             1.0625rem;
  --caption:          0.75rem;

  --lh-display:       0.95;
  --lh-body:          1.65;
  --measure:          62ch;

  /* ===== SPACING & GRID ===== */
  --grid-columns:     12;
  --grid-gutter:      24px;
  --grid-margin:      clamp(20px, 4vw, 64px);
  --grid-max:         1360px;
  --section-pad:      clamp(96px, 14vw, 200px);

  /* ===== SHAPE & DEPTH ===== */
  --radius:           0px;
  --radius-input:     2px;
  /* Zero shadows across entire system — depth via tone & overlap */
}

@media (max-width: 767px) {
  :root {
    --grid-columns:   4;
    --grid-gutter:    16px;
    --grid-margin:    16px;
  }
}
```

---

## 4. Motion System & Rationale ("The Why")

Every animation has an explicit architectural justification:

| Interaction | Spec & Duration | Architectural "Why" |
|---|---|---|
| **1. The Thread Hero Meeting** | 600–900ms cinematic ease | Symbolizes the Two Harbours convergence: one thread from Otaru (left) and one from India (right) meet under the headline, visually establishing the founding thesis. |
| **2. The Thread Scroll Stitch** | Continuous scrub via SVG stroke-dashoffset | Serves as the visual spine of the entire page, guiding the eye down the left margin and connecting every section with a quiet sashiko/kantha running stitch. |
| **3. The Stamp Seal Press** | 260ms, scale 1.06 → 1, rotation ~1°, multiply blend | Replicates the real physical mass of pressing a red mineral hanko seal onto handmade washi paper when an object or resident card enters the viewport. Zero cartoon bounce. |
| **4. The Door Transition** | 300ms ease-out | Transforms a standard transactional email form into a warm cultural ritual (`Tadaima` → `Okaeri. You're Resident No. 0143.`). |
| **5. Craft Pair Reveal** | 200ms ease | Rewards visitor curiosity by revealing the shared craft technique upon tap/hover without cluttering the initial editorial layout. |
| **6. Micro UI Hover/Focus** | 100–150ms fast | Gives crisp, instantaneous tactile feedback for interactive affordances. |

*Reduced Motion*: When `prefers-reduced-motion: reduce` is active, all transitions are instant (0ms) and The Thread is rendered statically drawn.

---

## 5. Data Model & Database Schema

### Prisma `Resident` Model
```prisma
model Resident {
  id           String   @id @default(uuid())
  number       Int      @unique // Atomic sequence: 101, 102, ... (formatted as No. 0101)
  email        String   @unique
  igHandle     String?
  city         String?
  piece        String?  // Interested piece slug
  referralCode String   @unique // e.g. "OTARU-7K8M"
  referredBy   String?
  createdAt    DateTime @default(now())

  @@index([email])
  @@index([referralCode])
}
```

### Route Handlers
- `POST /api/residents`: Server-side Zod validation, honeypot field, in-memory/Redis rate limiting, idempotent check on duplicate email, atomic number assignment, async Resend welcome email trigger.
- `GET /api/card/[number]`: Dynamic Next.js `@vercel/og` generation producing:
  - 1200x630 (OpenGraph preview)
  - 1080x1920 (Instagram Stories format via `?format=story`)

---

## 6. Implementation Task List by Phase

- [ ] **Phase 2: Foundation**
  - Update `src/styles/tokens.css` with exact palette, light-theme discipline, and fluid scales.
  - Configure Google Fonts in `src/app/layout.tsx` (Shippori Mincho, Tiro Devanagari Hindi, Hanken Grotesk, DM Mono).
  - Update `content/claims.ts`, `content/site.ts`, `content/drop01.ts`, `content/craft-pairs.ts`.
  - Validate `scripts/check-claims.ts` build guard.
  - Configure legacy route redirects in `src/middleware.ts` behind `FEATURE_FULL_ARCHIVE=false`.
- [ ] **Phase 3: Core Primitives & Components**
  - Build `Plate.tsx` (honest designed placeholder with registration marks).
  - Refactor `Stamp.tsx` (strict 260ms, scale 1.06 → 1, rotation ~1°, multiply blend, no bounce).
  - Refactor `Thread.tsx` (two threads meeting in hero + left margin running stitch with knots).
  - Refactor `DoorButton.tsx` (Tadaima / Okaeri states).
  - Build `DropChip.tsx`, `CraftPair.tsx`, `ProductPlate.tsx`, `ResidentCard.tsx`.
  - Build minimalist `SiteHeader.tsx` and `SiteFooter.tsx`.
- [ ] **Phase 4: Hero & Thread Assembly**
  - Integrate `HeroSection.tsx` and `Thread.tsx` on `src/app/page.tsx`.
  - Validate visual rhythm at 390px (mobile) and 1440px (desktop).
  - Pause for visual review checkpoint.
- [ ] **Phase 5: Homepage Completion**
  - Wire up `StorySection`, `CraftPairsSection`, `DropSection`, `ResidentsSection`, `FieldNotesSection`, `ClosingSection`.
  - Unmount legacy 12 movements from `src/app/page.tsx`.
  - Verify layout rhythm and typography contrast across all viewports.
- [ ] **Phase 6: Waitlist & Share Card**
  - Implement `/api/residents` route handler with validation and atomic numbering.
  - Implement `/residents/[number]` share page.
  - Refine `/api/card/[number]` for OG and Instagram Stories.
- [ ] **Phase 7: Secondary Launch Pages**
  - Wire `/drop-01`, `/product/[slug]`, `/story`, `/journal`, `/size-guide`, `/shipping-exchanges`, `/privacy`, `/terms`.
- [ ] **Phase 8: QA & Diagnostics**
  - Test at 360px, 390px, 768px, 1024px, 1440px.
  - Run typecheck (`npm run typecheck`), build guard check, and reduced-motion test.
- [ ] **Phase 9: Creative Director Critique & Founder Handoff**
  - Conduct ruthless critique.
  - Finalize `docs/CLAIMS.md`, `docs/REVIEW_STRINGS.md`, `docs/QA_REPORT.md`, `docs/FOUNDER_HANDOFF.md`.

---

## 7. Risks & Mitigations

1. **Instagram In-App Browser Glitches**: Instagram's browser toolbar frequently clips fixed headers and full-height sections.  
   *Mitigation*: Use dynamic viewport units (`100dvh` with `100vh` fallback), minimum 44px tap targets, avoid fixed overlays blocking the lower 80px.
2. **Build Guard Breakage**: Build guard might block preview builds if placeholders exist.  
   *Mitigation*: `check-claims.ts` warns during development/preview and strictly halts only when `VERCEL_ENV === 'production'`.
3. **Database Availability**: If PostgreSQL is not connected during local inspection, waitlist might error.  
   *Mitigation*: Implement an in-memory/file-based fallback in `/api/residents` when `DATABASE_URL` is unset, logging a clear advisory in console.
4. **Bundle Weight (LCP)**:  
   *Mitigation*: Keep Three.js off `/`. Ensure zero heavy unoptimized raster assets above the fold. Use pure typography and SVG Plate placeholders.

---

*Phase 1 Plan complete. Awaiting user approval to proceed to Phase 2.*
