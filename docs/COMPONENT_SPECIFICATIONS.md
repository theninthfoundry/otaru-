# HOUSE OF OTARU — COMPONENT SPECIFICATIONS (COMPONENT_SPECIFICATIONS.MD)
**Document ID:** OTARU-CMP-002  
**Implementation Standard:** Modular React Server/Client Components + TypeScript Strict  
**Engineering Invariant:** Keep components small, composable, accessible, and free of unnecessary abstractions.  

---

## 1. Global Navigation & Header (`SiteHeader.tsx`)

### Architecture & Placement
- **Positioning**: Fixed sticky header (`top: 0, left: 0, right: 0, z-index: 50`).
- **Default State**: Transparent gradient backdrop (`from-black/80 via-black/30 to-transparent`) over campaign hero; text color `#F5F2EC`.
- **Scrolled State** (triggered when `scrollY > 40px`): Solid warm dark indigo background (`#0B1420/95`) with subtle backdrop-blur (`12px`) and bottom hairline (`border-white/10`). Height shrinks from `80px` to `64px`.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   DESKTOP HEADER ANATOMY (1440PX)                               │
├──────────────────────────┬─────────────────────────────┬────────────────────────────────────────┤
│ LEFT: Archival Index     │ CENTER: Wordmark            │ RIGHT: Actions & Bag                   │
│ SHOP  COLLECTIONS  JOURNAL│       HOUSE OF OTARU        │ Search [Icon]  Account [Icon]  Bag (0) │
│ (11px Mono, 0.24em track)│ (Display Serif 22px / Sans) │ (17px Icons, Circular count badge)     │
└──────────────────────────┴─────────────────────────────┴────────────────────────────────────────┘
```

### Mobile Behavior (390px Viewport):
- Left: Compact "SHOP" link (`10px Mono`).
- Center: Centered "HOUSE OF OTARU" stacked mark (`18px Display`).
- Right: Search icon, Bag trigger with badge, and 2-bar menu icon (`18px`).
- Tap targets: Minimum `48 × 48px` invisible hit area around all icons.

---

## 2. Signature Campaign Hero (`HeldHero.tsx`)

### Viewport & Proportions
- **Dimensions**: Desktop `100svh` (`min-height: 720px`); Mobile `100svh` (`min-height: 600px`).
- **Background**: Full-bleed Next.js `<Image priority fill quality={95} sizes="100vw" />` with subtle radial vignette.
- **Content Positioning**: Left-aligned editorial stage (`max-width: 760px`), vertically centered within viewport height.

### Typographic Lockup:
1. **Region & Era Kicker**: `11px Mono`, uppercase, tracking `0.26em`, color `#F5F2EC/70`:
   ```
   JAPAN / INDIA · MMXXVI
   ```
2. **Collection Volume**: `11px Mono`, tracking `0.24em`, color `#F5F2EC/85`:
   ```
   CHAPTER I / KYOTO NIGHTS
   ```
3. **Master Display Headline**: `clamp(2.75rem, 6.0vw, 5.5rem)`, line-height `1.06`, letter-spacing `-0.02em`:
   ```
   Inspired by the fear
   of being average,
   and the perfect.
   ```
4. **Editorial Lead**: `15px Sans`, color `#F5F2EC/80`, max-width `36ch`, line-height `1.6`:
   ```
   Japanese craft sensibility, Indian cloth and hands.
   ```
5. **Primary Action**: Underlined link with animated arrow:
   ```
   DISCOVER THE CURRENT BATCH →
   ```

---

## 3. Current Batch Collection Grid (`BatchSection.tsx` & `ObjectCard.tsx`)

### Layout Architecture: Asymmetric 12-Column Grid
To avoid the monotony of identical e-commerce cards, the active 4-piece batch uses an editorial rhythm:
- **Piece 01 (Object 041 Yama Field Jacket)**: `col-span-12 lg:col-span-7` — Large hero feature card. Ratio 4:5.
- **Piece 02 (Object 042 Kiryū Wrap Trouser)**: `col-span-12 lg:col-span-5` — Tall architectural silhouette. Ratio 3:4.
- **Piece 03 (Object 043 Biratori Overshirt)**: `col-span-12 sm:col-span-6 lg:col-span-6` — Balanced mid-study. Ratio 4:5.
- **Piece 04 (Object 044 Ōmi Hemp Tote)**: `col-span-12 sm:col-span-6 lg:col-span-6` — Balanced accessory study. Ratio 1:1.

### Object Card Anatomical Specification:
1. **Frame**: Hairline border (`1px solid var(--color-hairline)`), background `var(--color-paper-2)`.
2. **Image Container**: Ratio-locked overflow-hidden container. On desktop hover, smooth 700ms crossfade reveals secondary on-body study.
3. **Top Tag Bar**:
   - Left: `OBJECT 041` (`10px Mono`, tracking `0.20em`).
   - Right: Numbered batch badge: `18 OF 44 REMAIN` (quiet, no pulsing animations).
4. **Card Information Footer**:
   - Title: `Yama Field Jacket` (`18px Display Serif`, color `var(--color-ink)`).
   - Price: `$480` or `₹28,500` (`13px Mono`, tracking `0.05em`).
   - Material line: `14.5oz Raw Indigo Canvas · Tokushima` (`11px Mono`, color `var(--color-graphite)`).

---

## 4. Product Detail View (`ProductDetailView.tsx` — Master PDP)

### Two-Column Split Architecture (12-Column Grid):
- **Left Stage (`col-span-12 lg:col-span-7`)**: Vertical scrolling photographic gallery. Three 4:5 vertical images followed by one 1:1 extreme macro weave scan. Zero slider arrows; natural vertical scroll.
- **Right Stage (`col-span-12 lg:col-span-5`)**: Sticky purchase panel (`sticky top-28`).

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              PDP PURCHASE PANEL HIERARCHY                              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Header: Object Number (`NO. 041`) · Title (`YAMA FIELD JACKET`) · Price ($480)      │
│ 2. Provenance Summary: 14.5oz Botanical Indigo Selvedge Canvas · Kuroki Mills          │
│ 3. Batch Inventory Ledger: Hand-numbered edition: 18 of 44 remain                     │
│ 4. Sizing Matrix: 50 × 50px touch targets (`XS`, `S`, `M`, `L`, `XL`)                  │
│    - Strikethrough on sold-out sizes.                                                 │
│    - Measurement drawer trigger: `View Garment Dimensions & Sizing Guide →`           │
│ 5. Primary Buy Action: Full-width button (`bg-[#1F2A44]`, text White, height `54px`)   │
│ 6. Estimated Delivery Pincode Input: Quick estimate (e.g. `Dispatches in 3–5 days`)   │
│ 7. Architectural Narrative Accordions:                                                 │
│    - Textile Origin & Loom History                                                    │
│    - Construction & Seam Architecture                                                 │
│    - Lifetime Care & Repair Ledger                                                    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Allocation Tray / Cart Drawer (`CartDrawer.tsx`)

### Dimensions & Interaction:
- **Width**: Mobile `100vw`; Desktop `440px`.
- **Slide Direction**: Right-to-left transition (`400ms cubic-bezier(0.16, 1, 0.3, 1)`).
- **Backdrop**: Matte ink scrim (`rgba(17,17,16,0.60)`) with `backdrop-blur: 4px`.
- **Header**: `Your Allocation Tray` (`10px Mono`) + `Close (Esc)` action.

### Dynamic Threshold Indicator:
- Real-time calculation: `"$250 away from complimentary courier dispatch"`.
- Progress bar: 2px hairline fill in `#1F2A44`.

### Line Item Row:
- Thumbnail: 60 × 75px 4:5 aspect ratio image.
- Details: Title, selected size, material snippet, unit price.
- Quantity Stepper: Minimalist `[-] 1 [+]` with 32px hit targets.
- Subtotal: Integer-based currency formatting.
- Primary CTA: `PROCEED TO CHECKOUT →` leading directly to `/checkout`.

---

## 6. Newsletter & Waitlist Form (`CircleEmailSection.tsx`)

### Layout & States:
- **Design**: Clean single-line pill-shaped container or minimal underline input.
- **Dimensions**: Height `48px`, max-width `420px`.
- **Input**: `type="email"`, placeholder `"Enter collector email"`, font `13px Sans`.
- **Submit Trigger**: Circular button with right-arrow icon (`hover:bg-[#1F2A44] hover:text-white`).
- **Validation**:
  - Empty or invalid email: Inline red caption below input (`Please enter a valid email address.`).
  - Loading: Button displays subtle spinner; input is disabled.
  - Success: Replaces form with confirmed archival reservation message:
    ```
    ✓ RESERVED IN ATELIER LEDGER
    Priority dispatch notification assigned.
    ```

---

## 7. Site Footer (`SiteFooter.tsx`)

### Refactored Structure:
1. **Top Row**: Master typographic wordmark `HOUSE OF OTARU™` (clean SVG, no muddy drop shadows) paired with editorial mission statement: *"Garments worth keeping. Built between worlds."*
2. **Four Clean Navigation Columns**:
   - **01 / ARCHIVE**: Current Batch, Outerwear, Trousers, Tops, All Holdings.
   - **02 / CHAPTERS**: Chapter I (Kyoto Nights), Chapter II (Otaru Harbor), Chapter III (Quiet Interior).
   - **03 / ATELIER**: Warehouse Story, Field Notes Journal, Craft Provenance, Lifetime Repairs.
   - **04 / LEGAL & CONCIERGE**: Shipping & Exchanges, Privacy Policy, Terms of Service, Concierge Desk.
3. **Lower Colophon Row**:
   - Left: `© MMXXVI HOUSE OF OTARU · ESTABLISHED IN HOKKAIDO & NEW DELHI · ALL RIGHTS RESERVED`.
   - Right: Clean plain-text legal statement: `ZERO MASS PRODUCTION · HAND-NUMBERED RUNS`.
   - All external social links include `rel="noopener noreferrer"` and accessible labels.
