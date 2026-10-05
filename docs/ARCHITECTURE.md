# Architectural Manifesto — Otaru Platform

Otaru operates as a luxury design house. The application structure is designed to reflect this premium positioning by adopting a **Modular Monolith** architecture that separates distinct business capabilities while enforcing strict API boundaries.

---

## 🏛️ System Core Layout

To maintain strict organization, the codebase uses a modular domain layout:

```
otaru/
├── src/
│   ├── app/                      # Next.js App Router (Routes & Views)
│   ├── components/               # UI components (Atomic, Layout, 3D Canvas)
│   ├── lib/                      # Core business logic (Strict modular domains)
│   │   ├── commerce/             # Commerce Domain (Wrapper for Catalog/Checkout)
│   │   ├── payments/             # Payments Domain (Ledger registry and verification)
│   │   ├── cms/                  # CMS Domain (Sanity wrapper)
│   │   ├── provenance/           # Provenance Domain (NFC authenticity registry)
│   │   ├── membership/           # Membership Domain (Patron benefits check)
│   │   ├── integrations/         # Low-level external API wrappers
│   │   └── ...
│   ├── hooks/                    # Reusable React hooks
│   ├── styles/                   # Design token CSS styles
│   ├── stores/                   # Global state stores
│   ├── types/                    # Shared TypeScript definitions
│   └── actions/                  # Next.js Server Actions
├── public/                       # Static images, specimen assets
├── docs/                         # System architecture & ADRs
└── sanity/                       # Sanity Studio schemas & content definitions
```

---

## ⚡ Core Design Principles

### 1. Data Ingress & Egress Boundaries
We forbid components from directly making third-party API calls (e.g. directly invoking raw Shopify queries or sanity fetch client). 
Components must consume data via **Domain Services** or **Server Actions**:

```
Component
   ↓
Server Action / Route
   ↓
Domain Service (lib/commerce/*)
   ↓
Integration Module (lib/integrations/shopify/*)
   ↓
Shopify Storefront API
```

### 2. Loose Coupling of Domains
While entities are related, their models must remain isolated.
- **Product** ≠ **Artifact**. A Shopify product is a raw commerce entity; an Otaru *Artifact* contains editorial, material composition, and provenance metadata.
- **Order** ≠ **Transaction**. An order tracks commerce fulfillment; a transaction is an immutable ledger entry.

### 3. Edge-Level Defensive Layer
Global middleware coordinates security verification before any request is processed:
- **IP-Based Token Bucket Rate Limiting**: Guarding APIs from denial of service.
- **CSRF Token Validation**: Authenticating request origin headers on mutations.
- **Nonce Injection**: Securing style and script elements against scripting attacks.

---

## 🛍️ 4. Commerce Authority: Lean Shopify V1

### Single Source of Truth
- **Catalog, Stock & Cart**: Shopify Storefront API acts as the single source of truth for all live inventory, variants, prices, and cart operations.
- **Single Checkout Authority**: All checkout flows resolve directly to native Shopify Checkout via cart checkout URLs (`cart.checkoutUrl`).
- **Zero Simulator Drift**: Any custom escrow simulator, synthetic payment mock, or non-production test payment gate is strictly barred from production execution paths. There is only ONE checkout path.

### India-Specific Localization & Fulfillment
- **Payments**: Indian transactions process via Razorpay activated as an approved payment gateway on Shopify Checkout.
- **Fulfillment & Logistics**: Domestic dispatch and tracking are managed through Shiprocket's courier aggregation API. (Note: Shiprocket operates as shipping & courier aggregator; statutory GST invoicing is handled via Shopify India GST tax invoices / accounting ERP integration, not Shiprocket).
- **Return & Refund Compliance**: Governed by India Consumer Protection (E-Commerce) Rules 2020, with clear replacement/exchange policies defined before purchase.

---

## 🎨 5. Experiential Architecture: The 12 Movements

The digital platform is structured around a psychological arc of contemplative ownership:
**ATMOSPHERE → DISCOVERY → DESIRE → PROOF → PURCHASE → LONG-TERM ATTACHMENT**

### The 12 Homepage Movements
1. **Movement 01 (Hero)**: `HeldHero` — 100svh backlit living cloth surface with clip-path entrance reveal.
2. **Movement 02 (Signature Reveal)**: `ObjectReveal` — Quiet emergence of Object 041 Yama Field Jacket with kanji (山), Tokushima origin, and live edition allocation.
3. **Movement 03 (Current Batch)**: `BatchSection` & `ObjectCard` — Asymmetric 12-column rhythm with dual-image on-body hover studies.
4. **Movement 04 (Material Study)**: `MaterialMacroSection` — Interactive 1:1 scale macro textile photography with 4 clickable hotspot pins (Fiber, Weave, Dye, Wear).
5. **Movement 05 (Why This Object Exists)**: `WhyThisObject` — Editorial justification: Material Sovereignty, Permanent Architecture, and Closed Run Intention.
6. **Movement 06 (Chapter Worlds)**: `ChaptersScrollSnap` — Horizontal scroll-snap seasonal archives preserving continuity.
7. **Movement 07 (Studio & Hands)**: `StudioStorySection` — 1907 Otaru stone canal warehouse history and artisan atelier photography.
8. **Movement 08 (Object Life Timeline)**: `ObjectLifeTimeline` — 5-year evolution from crisp raw twill to personal patina and boro mending.
9. **Movement 09 (Permanent Archive)**: `PermanentArchiveCta` — Portal to complete 10-piece historical collection.
10. **Movement 10 (Studio Journal)**: `JournalThreeCards` — Field notes directly bridging philosophy to physical archive garments.
11. **Movement 11 (Made to Remain)**: `MadeToRemain` — Wear-repair-return-wear lifecycle backed by lifetime atelier repair ledger.
12. **Movement 12 (The Circle)**: `CircleEmailSection` — Priority cutting reservation without commercial promotion.

### Atelier PDP Enhancements
- **Inspect Mode**: Full-screen macro inspection modal with annotated hotspots for hardware and seams.
- **Archival Object Passport**: Verified provenance certificate displaying Registry ID, Loom specification, and repair warranty.
- **ObjectFit Sizing Advisor**: Interactive silhouette recommendation tool calculating individual sizing based on height and posture.
- **Craft Provenance Map**: 5-stage production journey from botanical harvest to numbered vault storage.


