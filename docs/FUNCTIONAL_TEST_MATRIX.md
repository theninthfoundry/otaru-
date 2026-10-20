# HOUSE OF OTARU — FUNCTIONAL TEST MATRIX & JOURNEY TRACE
**Document ID:** OTARU-TEST-001  
**Author:** Principal QA Architect & Systems Engineer  
**Scope:** Core Customer Journeys across Browsing, Bag, Checkout, Order Tracking, RMA, and Forms  

---

## 1. Customer Journey Test Matrix

| ID | User Journey | Preconditions | Input / Action | Expected Behavior | Observed Behavior | Test Evidence & Files | Status |
|---|---|---|---|---|---|---|:---:|
| **TJ-01** | **Homepage Landing & First Impression** | Clean browser session | Navigate to `https://otaru-three.vercel.app/` | Hero loads with high-resolution garment campaign photography; legible typography; clear action to enter collection. | Page loads with backlit cloth image and "Inspired by the fear of being average". SVG wordmark shadow and footer vectors render. | `src/app/page.tsx`, `src/components/home/HeldHero.tsx` | **PASS** (Needs Art Direction) |
| **TJ-02** | **Batch Navigation & Link Traversal** | On homepage | Click "DISCOVER THE CURRENT BATCH →" in hero | Page smoothly scrolls to `#batch`, presenting the current 4-garment allocation. | Window scrolls to `#batch`. Four cards render: 041 Yama Jacket, 042 Kiryū Trouser, 043 Biratori Overshirt, 044 Ōmi Tote. | `src/components/home/BatchSection.tsx` | **PASS** |
| **TJ-03** | **Drop 01 Garment Navigation** | On `/drop-01` | Click "Yama Field Jacket" (`ProductPlate`) | Navigates to `/product/041` with full garment details, sizes, and pricing. | Navigates to `/product/atelier-jacket-01`. Renders 404 "Object Not Found". `PRODUCT_CATALOG` does not contain slug keys. | `src/components/ui/ProductPlate.tsx:L23`, `src/app/product/[id]/page.tsx` | **FAIL (P0)** |
| **TJ-04** | **Archive Browsing & Category Filtering** | On `/archive` | Select "Outerwear" filter chip | Grid filters to show only Outerwear pieces (041, 038, 034). | Filter state updates; grid accurately displays 3 Outerwear objects with live inventory badges. | `src/app/archive/page.tsx`, `src/components/archive/ArchiveGrid.tsx` | **PASS** |
| **TJ-05** | **Size Selection & Validation** | On `/product/041` | Click "Add to Archive" without choosing size | Triggers inline visual error prompting size selection; does not add to cart. | Red highlight error triggers on size selector; user is blocked from adding until size is chosen. | `src/components/product/ProductDetailView.tsx:L79-84` | **PASS** |
| **TJ-06** | **Add to Bag & Drawer Interaction** | On `/product/041` | Select size "M" and click "Add to Archive" | Item added to bag; drawer slides open from right showing item name, size, price, and updated badge count. | Drawer opens smoothly; badge counter updates from 0 to 1; subtotal displays $480. | `src/components/cart/CartDrawer.tsx`, `src/lib/cart.tsx` | **PASS** |
| **TJ-07** | **Bag State Persistence on Refresh** | 1 item in bag | Refresh the browser window (`F5`) | Bag retains 1 item, price, and selected size. | `localStorage` retains `otaru_cart`; item persists across page reload. | `src/lib/cart.tsx` (`localStorage.getItem('otaru_cart')`) | **PASS** |
| **TJ-08** | **Quantity Mutation & Item Removal** | Drawer open | Click "+", "-", or "Remove" on line item | Line item quantity updates; subtotal recalculates; removing deletes line. | Subtotal recalculates instantly; empty state displays when all items removed. | `src/components/cart/CartDrawer.tsx` | **PASS** |
| **TJ-09** | **Checkout Page Initiation** | 1 item in cart | Click "Proceed to Atelier Checkout" | Navigates to `/checkout`; presents 3-step calm collapsible form. | Navigates to `/checkout`. Step 1 (Collector Contact) opens. Step 2 and 3 stay collapsed. | `src/app/checkout/page.tsx:L48` | **PASS** |
| **TJ-10** | **Server-Side Authoritative Pricing** | Tampered client price | POST to `/api/checkout` with modified `amount: 1` | Server recalculates authoritatively using `PRODUCT_CATALOG`; ignores client price. | Server overrides amount to $480 + 12% GST; signs verifiable cart token. | `src/app/api/checkout/route.ts:L65-90` | **PASS** |
| **TJ-11** | **Live Razorpay Payment Gate** | Step 3 on `/checkout` | Submit with Razorpay selected in production mode | Opens Razorpay checkout modal with order ID and merchant account. | Fails closed with HTTP 503 if live keys unconfigured in production. | `src/app/api/checkout/route.ts:L160` | **PASS** (Zero-Trust) |
| **TJ-12** | **Simulated Sandbox Payment** | Step 3 on `/checkout` | Select "Sandbox", choose "UPI", click "Simulate" | Simulates payment; calls `/api/checkout/verify` with `{ mock: true }`. | Bypasses gateway verification in dev mode; redirects to `/checkout/success`. | `src/app/checkout/page.tsx:L334`, `src/app/api/checkout/verify/route.ts` | **PASS (Dev) / RISK (Prod)** |
| **TJ-13** | **Order Confirmation Provenance View**| Order submitted | Lands on `/checkout/success?order=ARC-1042` | Displays order receipt, stamped seal, dispatch timeline, and registration link. | Certificate displays with Roman numeral order number and dispatch estimate (+2 days). | `src/app/checkout/success/page.tsx` | **PASS** |
| **TJ-14** | **Archival Circle Waitlist Submission**| On `/#circle` | Enter `collector@atelier.in` and submit | Email is assigned priority dispatch notification; success banner displayed. | Form calls `/api/residents`. Browser console logs 404 Not Found; user sees "Failed to join waitlist" alert. | `src/components/home/CircleEmailSection.tsx:L16-25` | **FAIL (P0)** |
| **TJ-15** | **Studio Navigation Link** | Footer | Click "Warehouse History" (`/studio`) | Renders studio timeline, warehouse values, and team artisans. | Middleware 301-redirects to `/story`. Shows basic story section; timeline never displays. | `src/middleware.ts:L50`, `src/app/studio/page.tsx` | **FAIL (P1)** |
| **TJ-16** | **Garment Return & Repair (RMA) Flow** | On `/returns` | Enter order number, select "Boro Mending", submit | RMA number generated; return instructions and pickup timeline displayed. | RMA number generated (e.g. `RMA-041-8921`); instructions render cleanly. | `src/app/returns/page.tsx`, `src/app/api/shipping/returns/route.ts` | **PASS** |
| **TJ-17** | **Legal Policies Review** | On `/privacy`, `/terms`| Read data protection terms and service agreements | Legally binding terms complying with DPDP Act 2023. | Displays unstyled placeholder: `[CONFIRM: Full privacy policy text to be added here]`. | `src/app/privacy/page.tsx:L11`, `src/app/terms/page.tsx:L11` | **FAIL (P1)** |
| **TJ-18** | **E2E Playwright Suite Execution** | Terminal | Run `npm run test:e2e` | Playwright verifies critical purchase journey and serial verification. | Suite fails on `purchase-flow.spec.ts`: expects "Raw Denim Chore Coat" at `/artifact/artifact-001-denim-jacket`. | `tests/e2e/purchase-flow.spec.ts:L11-12` | **FAIL (P1)** |

---

## 2. Root Cause Analysis for Critical Test Failures

### 2.1 Failure TJ-03: Broken Drop 01 Links
- **Root Cause**: Two different developers modeled products independently. One created `content/drop01.ts` using marketing slugs (`atelier-jacket-01`), while another built `src/lib/catalog.ts` using numeric inventory IDs (`041`). `ProductPlate.tsx` links to `/product/${product.slug}`, but `src/app/product/[id]/page.tsx` indexes `PRODUCT_CATALOG[id]`.
- **Remediation**: Create a bidirectional slug/ID lookup dictionary in `src/lib/catalog.ts` so that `/product/[id]` resolves both `'041'` and `'yama-field-jacket'`.

### 2.2 Failure TJ-14: Circle Waitlist 404
- **Root Cause**: `CircleEmailSection.tsx` was written targeting an anticipated `/api/residents` route from the abandoned `redesign/two-harbours` branch. The active newsletter backend route is `/api/newsletter`.
- **Remediation**: Create `/api/residents/route.ts` or update `CircleEmailSection.tsx` to invoke `/api/newsletter` with source tagging.

### 2.3 Failure TJ-18: Outdated E2E Test Suite
- **Root Cause**: `tests/e2e/purchase-flow.spec.ts` was written during an early Shopify mock integration test and was never updated when the bespoke archival catalog was introduced.
- **Remediation**: Update test selectors to target current catalog names ("Yama Field Jacket") and canonical paths (`/archive` → `/product/041` → `/cart`).
