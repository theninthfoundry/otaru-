# OTARU — COMPLETE OPERATING ARCHITECTURE (50 SUBSYSTEMS & 12 GATES)

**A commerce system disguised as an archive. A complete digital maison operating system.**

---

## 1. THE 12-GATE MASTER IMPLEMENTATION PROGRAM

```
[GATE A] Foundation (Financial Kernel, Money, Inventory, Invariants)       ─── CERTIFIED ✅
   │
[GATE B] Commerce OS (Outbox, Shipping, Fulfillment, QC, Atelier)          ─── CERTIFIED ✅
   │
[GATE C] Identity + Customer OS (Private Archive, Calm Checkout, Journey)  ─── CERTIFIED ✅
   │
[GATE D] Editorial / CMS (Chapters, Essays, Makers, Publishing Console)    ─── CERTIFIED ✅
   │
[GATE E] Provenance OS (Ed25519 Deeds, Ownership Chain, Repair Registry)   ─── CERTIFIED ✅
   │
[GATE F] Drop OS (Capsule State Machine, Waiting Room, Bot Shield)         ─── IN PROGRESS ⏳
   │
[GATE G] Finance / Reconciliation / Support (Tri-party audit, Ledger)      ─── PENDING
   │
[GATE H] Security / Observability / Privacy / DR (Structured logs, RTO)    ─── PENDING
   │
[GATE I] Performance / Accessibility / SEO (Web vitals, WCAG AAA, JSON-LD) ─── PENDING
   │
[GATE J] Premium Experience / Motion / Design Tokens                       ─── PENDING
   │
[GATE K] Full Attack Matrix & Stress Invariants (42 Adversarial Attacks)   ─── PENDING
   │
[GATE L] Final Production Certification & Mainnet Merge                    ─── PENDING
```

---

## 2. THE THREE CORE PLANES & 50 OPERATING SUBSYSTEMS

```
                                      OTARU
                                        │
        ┌───────────────────────────────┼────────────────────────────────┐
        │                               │                                │
   EXPERIENCE                      OPERATIONS                         PLATFORM
        │                               │                                │
        ▼                               ▼                                ▼
   Customer OS                     Atelier OS                      Infrastructure
   Editorial OS                    Commerce OS                     Security
   Archive OS                      Fulfillment                     Reliability
   Provenance OS                   Finance                         Observability
   Drop OS                         Support                         Compliance
                                        │
                         ┌──────────────┴──────────────┐
                         ▼                             ▼
                 IDENTITY & TRUST             POSTGRESQL TRUTH
                 (Server Sessions,           (Financial Authority,
                  Fine-Grained RBAC,          Outbox Events,
                  Zero IDOR)                  Double-Entry Stock)
```

### The 50 Operating Subsystems Specification:

| # | Subsystem | Purpose & Boundaries |
| :-: | :--- | :--- |
| **01** | **Identity & Auth** | Server-controlled sessions, 5-attempt OTP brute-force lockout, anti-enumeration, zero IDOR. |
| **02** | **Customer OS** | Private Archive: Garments (03), Acquisitions (07), Provenance (03), Returns (01). |
| **03** | **Catalog System** | Strict separation: `Product` (Creative) $\neq$ `Variant` (SKU) $\neq$ `Garment` (Physical serial). |
| **04** | **Collections** | First-class object lifecycle: `DRAFT` $\rightarrow$ `PREVIEW` $\rightarrow$ `SCHEDULED` $\rightarrow$ `LIVE` $\rightarrow$ `CLOSED` $\rightarrow$ `ARCHIVED`. |
| **05** | **Content CMS** | Decoupled stories, chapters, essays, maker profiles, studio notes without TSX edits. |
| **06** | **Media System** | Cloudflare R2 / S3 derivative storage, WebP/AVIF generation, focal points, cache headers. |
| **07** | **Cart Engine** | Server-authoritative line items, snapshot pricing, reservation TTL, guest-to-auth merge. |
| **08** | **Calm Checkout** | Quiet 3-stage acquisition: `01 DETAILS` $\rightarrow$ `02 DELIVERY` $\rightarrow$ `03 PAYMENT`. |
| **09** | **Pricing Engine** | Integer paise only. Base price + GST + shipping - discounts. Zero floating point. |
| **10** | **Tax Engine** | Configurable India GST (CGST/SGST/IGST). Extensible to international duty engine. |
| **11** | **Inventory Ledger** | Double-entry movement accounting: $\text{Avail} = (\text{Rec} + \text{Ret}) - (\text{Sold} + \text{Res} + \text{Dam})$. |
| **12** | **Drop Engine** | Capsule releases with edge waiting room, token bucket admission, and anti-bot shielding. |
| **13** | **Payment Gateway** | Vendor-neutral adapter. Razorpay implementation. State machine: `CREATED` $\rightarrow$ `CAPTURED`. |
| **14** | **Refund Engine** | Restricted to `OWNER` role. Multi-step audit: Return $\rightarrow$ QC $\rightarrow$ Approval $\rightarrow$ Refund. |
| **15** | **Returns OS** | State machine: `REQUESTED` $\rightarrow$ `APPROVED` $\rightarrow$ `IN_TRANSIT` $\rightarrow$ `QC` $\rightarrow$ `REFUNDED`. |
| **16** | **Shipping Abstraction** | Vendor-neutral `ShippingProvider` interface with Shiprocket adapter. |
| **17** | **Fulfillment OS** | Atelier physical garment workflow: `READY` $\rightarrow$ `PICKING` $\rightarrow$ `QC` $\rightarrow$ `BOXING` $\rightarrow$ `SHIPPED`. |
| **18** | **Quality Control** | Persistent 6-point inspection records: stitching, fabric, measurements, finishing, label, packaging. |
| **19** | **Provenance Deeds** | Cryptographic digital passport bound to physical piece edition (`Piece 14 of 44`). |
| **20** | **QR / NFC Bridge** | Physical woven label scanned $\rightarrow$ `https://otaru.in/verify/OTR-2026-000184`. |
| **21** | **Ownership Transfer** | Multi-generational chained SHA-256 hash ledger linking subsequent collectors over decades. |
| **22** | **Notifications** | Decoupled domain events $\rightarrow$ Editorial templates $\rightarrow$ Email / SMS / WhatsApp channels. |
| **23** | **Transactional Outbox** | Two-phase atomic persistence with exponential backoff worker and Dead Letter Queue (DLQ). |
| **24** | **Atelier OS UI** | Working surface for Hokkaido craftspeople: daily queues, active drop progress, inspection stamps. |
| **25** | **Admin OS** | Separation of concerns: Security, Commerce, Inventory, Content, and Webhook monitoring. |
| **26** | **Audit Trail** | Append-only tamper-evident log: `WHO`, `WHAT`, `WHEN`, `TARGET`, `BEFORE`, `AFTER`, `REQUEST_ID`. |
| **27** | **Reconciliation** | Tri-party comparison: Otaru Ledger vs Razorpay Captured vs Bank Settlements in minor units. |
| **28** | **Observability** | Structured JSON logs, latency telemetry, error budget tracking, and distributed tracing. |
| **29** | **Error Shield** | User-facing calm error codes (`OTR-ERR-7F2A`) shielding raw database error traces. |
| **30** | **Feature Flags** | Controlled progressive rollout (`OFF` $\rightarrow$ `INTERNAL` $\rightarrow$ `10%` $\rightarrow$ `100%`). |
| **31** | **Privacy Analytics** | First-party telemetry without third-party tracker bloat or surveillance cookies. |
| **32** | **Privacy & Retention** | GDPR/DPDP data export, account deletion respecting legal accounting retention rules. |
| **33** | **Currency Engine** | Currency display abstraction with INR authority; multi-currency lock before checkout. |
| **34** | **Accessibility** | WCAG 2.1 AAA keyboard navigation, screen-reader landmarks, and contrast compliance. |
| **35** | **Performance** | Strict budgets: LCP < 2.5s, INP < 200ms, CLS < 0.1, isolated WebGL/GSAP render loops. |
| **36** | **Motion Tokens** | Centralized animation tokens with first-class `prefers-reduced-motion` compliance. |
| **37** | **Security Perimeter** | Cloudflare WAF, CSRF tokens, strict CSP, HSTS, secure cookies, and secret hygiene. |
| **38** | **PostgreSQL Authority** | Primary source of financial and inventory truth. Redis relegated strictly to caching/locks. |
| **39** | **Disaster Recovery** | RPO < 5 minutes, RTO < 1 hour. Rehearsed restore playbooks and point-in-time recovery. |
| **40** | **Deployment Pipeline** | Zero-downtime CI/CD: Lint $\rightarrow$ Unit $\rightarrow$ Security $\rightarrow$ Build $\rightarrow$ Preview $\rightarrow$ Prod. |
| **41** | **Multi-tier Testing** | Unit domain tests, integration tests, contract tests, and recovery failure injection. |
| **42** | **Adversarial Matrix** | Intentional attack harness: ₹1 tampering, negative qty, IDOR, OTP brute force, replay. |
| **43** | **Support Concierge** | Client relations portal with read-only financial data and structured ticket resolution. |
| **44** | **Search Engine** | Fast, zero-overhead PostgreSQL full-text search across archive, chapters, and journal. |
| **45** | **SEO & Structured Data** | JSON-LD schema for products, breadcrumbs, articles, OpenGraph, and dynamic sitemaps. |
| **46** | **Editorial Emails** | Quiet, literary notification copy reflecting Hokkaido stone warehouse aesthetics. |
| **47** | **Design System** | Curated token system: Parchment, Ink, Indigo, Gold, Watoji binding, Sashiko grids. |
| **48** | **Premium Layer** | Zero SaaS banners, zero countdown clocks; tactile museum aesthetics and calm pacing. |
| **49** | **Collector Journey** | Discovery $\rightarrow$ Chapter $\rightarrow$ Acquisition $\rightarrow$ Atelier $\rightarrow$ Provenance $\rightarrow$ Ownership. |
| **50** | **Clean Architecture** | UI $\rightarrow$ Application $\rightarrow$ Domain $\rightarrow$ Infrastructure. Zero upward dependency leakage. |

---

## 3. NEXT EXECUTION: GATE F — THE DROP ENGINE

We immediately proceed with implementing **Gate F: Drop Engine & Waiting Room Architecture**:
1. `src/lib/domain/drops/drop-state-machine.ts`: The 7-state capsule release lifecycle.
2. `src/lib/domain/drops/waiting-room.ts`: Token-bucket admission queue protecting database inventory locks.
3. `src/lib/domain/drops/anti-bot-guard.ts`: Progressive velocity shielding preventing automated checkout flooding.
4. `src/__tests__/phase-f-drop-engine.test.ts`: Complete test suite validating drop transitions, waiting room queueing, and bot throttling.
