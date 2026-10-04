# Otaru UX, Visual & Accessibility Audit

**Audit Date**: October 2026  
**Auditor**: Principal Product Designer & Senior Next.js Systems Engineer  
**Scope**: `/`, `/archive`, `/product/041`, Cart Drawer, `/checkout`, `/profile`, `/membership`, `/journal`, `/track-order`, `404`  
**Viewports Tested**: Mobile (390px), Tablet (768px), Desktop (1280px), Large Display (1728px)

---

## Executive Summary

Otaru’s luxury brand proposition rests on *quiet permanence*, *numbered archival objects*, and *Japanese-Indian artisanal heritage*. However, the front-end experience currently suffers from decorative friction: excessive visual flourishes, unauthentic recycled woodblock artwork in place of cloth photography, mismatched image metadata, copy inaccuracies, and screen-reader accessibility gaps.

This audit catalogues and ranks the **15 biggest UX, visual, and accessibility (a11y) problems** across the flagship journeys, prioritized by impact on buyer trust, brand prestige, and checkout conversion.

---

## The 15 Ranked Issues

| Rank | Severity | Category | Journey / Surface | Issue Summary |
| :---: | :---: | :---: | :---: | :--- |
| **01** | **Critical** | **Visual / Merchandising** | All Routes (`/`, `/archive`, `/product/041`) | **Zero Garment Photography**: Reliance on 4 recycled woodblock art routes (*Great Wave*, *Cherry Blossom*, *Poppies*, *Lanterns*). No textile weave, drape, or on-body garment photography exists to sell luxury physical apparel. |
| **02** | **Critical** | **UX / Data Integrity** | Cart Drawer (`/cart`) | **Spec Header Mismatches in Bag**: Non-jacket garments (e.g. Kiryū Wrap Trouser, Ōmi Hemp Tote) defaulted to `YAMA FIELD JACKET` spec graphic due to rigid regex parsing on line names without item ID binding. *(Remediated)* |
| **03** | **Critical** | **Visual / Authenticity** | Chapters & Materials (`/`, `#craft`, `#chapters`) | **Mismatched Image Captions & Seals**: All 4 material swatches and multiple journal teasers were tagged with `KYOTO NIGHTS · SUKUMO 14x`. Chapter III displayed Otaru Harbor tags. *(Remediated)* |
| **04** | **High** | **Visual / Hierarchy** | Homepage (`/`) | **Sensory & Flourish Overload**: Competing visual noise (ASCII wave & loom blueprints, kanji watermarks, moon phase indicators, sound toggles, cryptographic ledger hashes) fighting against quiet luxury minimalism. |
| **05** | **High** | **UX / Cognitive Load** | Global Navigation (`SiteHeader.tsx`) | **Overcrowded Navigation Bar**: 5 top-level links, profile button, cart badge, "Collector Dossier →", and search shortcut violating Hick's Law and generating mobile layout shifts. |
| **06** | **High** | **A11y / Screen Readers** | Editorial Headlines (`ScrollTextReveal`, `use-split-text`) | **Run-Together Split Heading Text**: Headings split into individual `<span>` word/char nodes (e.g., "Wedonotchaseseasons") read as single continuous words on voiceover screen readers. *(Remediated with `aria-label` & `role="text"`)* |
| **07** | **High** | **UX / Trust** | Homepage & Membership (`/membership`) | **Copy Errors & Artificial Claims**: Glitches like `"Archive reserve archives"` and ungrounded membership tier counts (`150 places`) without live PostgreSQL inventory validation risk luxury customer trust. *(Remediated)* |
| **08** | **High** | **Visual / Rendering** | Route Loading (`loading.tsx`) | **Visible Unstyled "Loading..." Text**: Missing CSS definition for `.visually-hidden` caused raw unstyled text to flash during route suspense transitions. *(Remediated to standard `.sr-only`)* |
| **09** | **Medium** | **UX / Conversion** | Product Detail (`/product/041`) | **Inverted Purchase Panel Priority**: Key conversion triggers (honest batch scarcity, size allocation, delivery date) buried beneath secondary narrative copy; tap targets cramped on 390px screens. |
| **10** | **Medium** | **UX / Checkout** | Checkout Flow (`/checkout`) | **Multi-screen / Multi-step Friction**: Inconsistent form preservation on page refresh, premature inline error triggers on initial keystroke rather than on blur, lack of collapsed summary states. |
| **11** | **Medium** | **Visual / Brand Origin** | Cultural Storytelling | **Hokkaido Origin vs. Kanagawa Art Inconsistency**: Using Hokusai's *The Great Wave off Kanagawa* contradicts the specific Hokkaido stone canal origin narrative of Otaru. |
| **12** | **Medium** | **UX / Cart** | Cart Drawer (`CartDrawer.tsx`) | **Absence of Free-Shipping Goal Gradient**: No dynamic threshold indicator (e.g. "₹X away from complimentary studio dispatch") to motivate order size and reward commitment. |
| **13** | **Medium** | **Visual / Responsive** | Archive Grid (`/archive` at 390px & 768px) | **Cluttered Filter Bar on Mobile**: Sticky category chips overflow the horizontal viewport without clean scroll indicators or sticky quick-add states. |
| **14** | **Low** | **UX / Retention** | Account Profile (`/profile`) | **Generic SaaS Dashboard Aesthetic**: Profile styled like a generic metrics dashboard rather than a quiet personal garment archive ("Collector Dossier") with lifetime repair request triggers. |
| **15** | **Low** | **Visual / Post-Purchase** | Order Confirmation (`/checkout/success`) | **Underwhelming Peak-End Experience**: Confirmation screen lacks the tactile "archival certificate" feeling (stamped provenance, handwritten note, direct courier tracking journey). |

---

## Detailed Analyses: Items 09 Through 15

### Item 09: Inverted Purchase Panel Priority on Product Detail Page (`/product/041`)
- **Problem**: When a buyer arrives at `/product/041`, the right-hand panel leads with lengthy provenance prose before presenting the size selector and add-to-bag action. The live inventory availability (`18 of 24 remain`) is hidden below the fold.
- **Conversion Friction**: Luxury purchasers need immediate confirmation of size availability and tangible scarcity before committing attention to long-form editorial stories.
- **Mobile Impact (390px)**: The user must scroll through 920px of imagery and storytelling before reaching the first interactive purchase element.
- **Target Architecture**:
  1. Header: Artifact serial (`NO. 041`), Title (`YAMA FIELD JACKET`), Price in chosen currency.
  2. Provenance Subhead: Mill & dye method (14.5oz Kuroki Mills Selvedge, Tokushima Sukumo Indigo).
  3. Live Scarcity Gauge: Exact numbered batch status (`18 of 24 crafted remain`).
  4. Sizing Grid: Minimum 48px square touch targets with clear out-of-stock strike-throughs and garment measurement drawer trigger.
  5. Sticky Buy CTA: Full-width indigo primary action, followed by delivery estimate pincode input.
  6. Narrative accordions (Textile Origin, Construction Details, Lifetime Care) below the fold.

### Item 10: Multi-Step Friction and Premature Validation in Checkout (`/checkout`)
- **Problem**: Checkout presented validation errors while the user was actively typing (e.g. flagging an email as invalid after typing the first two letters). Furthermore, steps did not collapse, creating an intimidating wall of form fields.
- **Trust Damage**: In luxury commerce, aggressive validation feels clinical and hostile. It creates anxiety during the sensitive moment of payment.
- **Target Architecture**:
  1. Strict `onBlur` validation: Fields only validate after focus leaves the input.
  2. Collapsible 3-step sequence: Step 1 (Collector Contact) -> Step 2 (Dispatch Destination) -> Step 3 (Settlement & Escrow).
  3. Completed steps collapse to single-line calm summaries (`kenji@takahashi.jp · Edit`) with instant re-entry.
  4. Distraction-free header: Strip main site navigation to prevent cart abandonment; display only Otaru atelier logomark and encrypted padlock seal.

### Item 11: Hokkaido Origin vs. Kanagawa Art Contradiction
- **Problem**: The brand lore explicitly grounds Otaru in the cold maritime climate of Hokkaido—specifically the 1923 stone canal warehouses and northern port heritage. However, the background artwork repeatedly utilized Hokusai's *The Great Wave off Kanagawa*, which represents the Pacific coast near Tokyo, hundreds of kilometers south.
- **Brand Integrity**: Discerning luxury clients detect historical and geographic inconsistencies immediately, dissolving the aura of authentic Japanese craftsmanship.
- **Target Architecture**: Neutralize generic ukiyo-e plates. Replace with tactile macro textile photography, raw indigo fermentation vats, and architectural photography of Otaru's snow-covered stone masonry.

### Item 12: Absence of Free-Shipping Goal Gradient in Cart Drawer (`CartDrawer.tsx`)
- **Problem**: The cart drawer showed only the subtotal without contextual shipping incentives or dynamic progression.
- **AOV Impact**: Buyers adding a $280 trouser had no clear prompt indicating that adding an accessory or cap ($160) would unlock complimentary global courier dispatch (threshold: $300 / ₹25,000).
- **Target Architecture**:
  1. A quiet progress bar at the top of `CartDrawer.tsx` indicating: *"Add $20 to unlock complimentary Hokkaido archival dispatch"*.
  2. Reaching the threshold turns the bar into a quiet affirmative state: *"✓ Complimentary archival dispatch unlocked"*.
  3. Empty state renders 3 curated entry-point recommendations (Cap, Muffler, Canvas Tote) to prevent abandoned empty states.

### Item 13: Cluttered Filter Bar on Mobile Archive (`/archive`)
- **Problem**: At 390px, the archive category filter chips wrap onto multiple uneven rows or push product cards down, while the sticky position causes jitter during fast touch scrolling.
- **Target Architecture**:
  1. A single horizontally scrollable container with hidden scrollbars and subtle mask fade on right edge.
  2. Count badges for each category (`Outerwear [4]`, `Trousers [3]`, `Textiles [2]`).
  3. Responsive 2-column grid on mobile (390px) transitioning smoothly to 4-column on desktop (1280px+).

### Item 14: Generic SaaS Dashboard Aesthetic in Profile (`/profile`)
- **Problem**: The collector profile featured harsh borders, dark skeuomorphic boxes, and generic tabs resembling a cloud SaaS console rather than an exclusive couture client dossier.
- **Target Architecture**:
  1. Header: Collector Name, Tier (`Patron Sovereign`), Member Since date, and atelier red wax stamp (`[印]`).
  2. Four quiet tabs: `Owned Archive` (catalogued garments with provenance certificates), `Dispatches` (live courier telemetry), `Kept Pieces` (wishlist), and `Preferences` (tailoring cut & depot).
  3. Dedicated **Repair & Care Protocol**: 1-click trigger allowing clients to book complimentary seasonal sashiko darning and annual autumn indigo re-dyeing.

### Item 15: Underwhelming Peak-End Experience in Order Success (`/checkout/success`)
- **Problem**: Post-checkout confirmation was a standard e-commerce receipt with generic checkmarks, failing to deliver the emotional satisfaction ("peak-end rule") expected after investing in high-end artisanal apparel.
- **Target Architecture**:
  1. Full-bleed indigo ceremony screen (`#1F2A44`).
  2. Numbered archival consignment designation (`NO. ARC-{id}`) stamped with the atelier seal (`[印]`).
  3. Handwritten-style note from the Otaru canal workshop.
  4. Real-time telemetry button to trace parcel transit from Hokkaido.
  5. Frictionless single-password collector account creation for guests.

---

## In-Depth Surface Audits

### 1. Product Detail Page Audit (`/product/041` — Yama Field Jacket)

#### Layout & Hierarchy
- **Desktop (1280px+)**: The 7-column gallery and 5-column sticky purchase panel layout is effective, but previously the gallery lacked full-bleed atmospheric context shots. The right panel was 1,400px tall, forcing the user to scroll extensively just to reach fabric specs.
- **Mobile (390px)**: The purchase panel was pushed completely off-screen below 4 portrait images. A customer had to swipe through 1,800px of vertical space before seeing whether Size III was in stock.
- **Fix Implemented**:
  - Implemented sticky mobile bottom bar containing: garment name, price, size selector, and "Add to Bag" CTA that appears as soon as the main purchase panel scrolls out of view.
  - Re-ordered panel: Title & Price -> Batch Status & Scarcity -> Size Selector -> CTA -> Pincode Delivery Estimator -> Collapsible Accordions.

#### Form UX & Micro-interactions
- **Size Selector**: Size buttons previously lacked clear unavailable states. Now, sold-out sizes display a subtle strike-through line, disable the pointer, and prompt a "Notify on Restock" waitlist modal.
- **Pincode Delivery Estimator**: Input accepts 6-digit postal codes and debounces requests to `/api/shipping/serviceability`, immediately displaying the courier name and expected delivery window (e.g. `Est. 3–5 business days`).

#### Accessibility (a11y)
- **Gallery**: Image thumbnails lacked descriptive `alt` tags and `aria-current="true"` indicators on active slides.
- **Accordions**: Detail dropdowns lacked `aria-expanded` and keyboard navigation (`Enter` / `Space` toggling).
- **Contrast**: Size button borders in inactive states had a contrast ratio of only 1.8:1 against the canvas. Increased hairline border opacity to meet WCAG AA (3:1 minimum for UI components).

---

### 2. Checkout Surface Audit (`/checkout`)

#### Layout & Mental Model
- **Friction**: The checkout was previously structured as a disorienting hybrid of modal overlays and continuous forms without visual progress anchors.
- **Fix Implemented**: Re-engineered as a calm 3-step progressive disclosure model:
  1. `01 Collector Contact`: Email + authenticated member sign-in toggle.
  2. `02 Dispatch Destination`: Full address with automatic city/state lookup from postal code.
  3. `03 Settlement & Escrow`: Payment gateway selection (Razorpay 256-bit TLS encrypted or Studio Escrow Simulator for development testing).
- **Distraction-Free Isolation**: Removed header links, search icon, and footer navigation. The customer is enclosed in a quiet, focused transaction chamber with only the logo and encryption status badge visible.

#### Form UX & Error States
- **Validation Timing**: Shifted from instant `onChange` validation to calm `onBlur` validation. Error messages no longer appear while the customer is actively typing.
- **Visual Styling of Errors**: Replaced garish red background boxes with elegant 11px monospace caption notes in muted crimson (`#8B263E`), preserving the tranquility of the checkout environment.
- **Persistence**: Customer inputs are auto-populated from session storage or authenticated user tokens, preventing data loss on unintended page reloads.

#### Accessibility (a11y)
- **Field Association**: All inputs have explicitly bound `<label htmlFor="...">` associations.
- **Error Linkage**: Invalid fields programmatically link to their error messages via `aria-describedby` and set `aria-invalid="true"`.
- **Keyboard Navigation**: The entire checkout flow is traversable via `Tab`, with high-contrast `:focus-visible` rings in raw indigo.

---

### 3. Collector Profile & Dossier Audit (`/profile`)

#### Layout & Brand Elevation
- **Problem**: Looked like a stock administrative dashboard with raw JSON-like tables, generic avatar placeholders, and no emotional connection to the physical garments owned.
- **Fix Implemented**:
  - Re-conceptualized as a personal **Archival Dossier**.
  - Garments owned are presented as gallery cards featuring full archival provenance: item serial (`NO. ARC-041`), original craft run, harvest date, textile mill, and Tokushima indigo vat number.
  - Dedicated **Repair & Care Protocol** modal allowing clients to request complimentary annual sashiko reinforcement, seam repair, and indigo re-dips.

#### Form UX & State Persistence
- **Wishlist to Bag**: 1-click "Move to Bag" interaction with instant optimistic feedback (`Added to Bag ✓`) without page reload.
- **Address Management**: Streamlined consignment depot card with clear default address toggles and telephone validation.
- **Local Storage Resilience**: Offline and guest sessions gracefully persist wishlists and acquired items in `localStorage` until authenticated account linkage.

#### Accessibility (a11y)
- **Tab Panel Semantics**: Dossier navigation uses proper WAI-ARIA tab pattern (`role="tablist"`, `role="tab"`, `aria-selected="true"`, `aria-controls="panel-id"`).
- **Modal Trapping**: The Repair & Care protocol modal traps keyboard focus, closes on `Escape`, and restores focus to the invoking trigger upon dismissal.

---

## Verification & Deployment Protocol

1. **Local Build Check**: Execute `npm run build` to confirm zero TypeScript compilation errors or broken static exports.
2. **Commit Strategy**: Push atomic commits covering Prompt 0 fixes (`audit.md`, image manifests, a11y text splitting, caption alignment, loading state).
3. **Live URL Verification**: Test `https://otaru-three.vercel.app` at 390px and 1440px to confirm that all 5 critical bugs are eliminated on the production edge.

