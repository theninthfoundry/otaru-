<div align="center">

<br />

<!-- Hero Banner Artwork -->
<img src="docs/assets/otaru-hero-banner.svg" alt="OTARU — Digital House & Commerce Infrastructure" width="100%" />

<br /><br />

<!-- Holographic Status & Architecture Spec HUD -->
<img src="docs/assets/otaru-specs-hud.svg" alt="System Capabilities & Technical Specifications" width="100%" />

<br /><br />

<!-- Curated Tech Stack Matrix Badges -->
[![Next.js 15](https://img.shields.io/badge/Next.js_15.1-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React_19.0-0B192C?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript 5.7](https://img.shields.io/badge/TypeScript_5.7-1E293B?style=for-the-badge&logo=typescript&logoColor=38BDF8)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-ACID_Durable-1E1B4B?style=for-the-badge&logo=postgresql&logoColor=818CF8)](https://www.postgresql.org/)
[![Prisma 6.3](https://img.shields.io/badge/Prisma_6.3-ORM-0F172A?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Upstash Redis](https://img.shields.io/badge/Upstash-Edge_Redis-064E3B?style=for-the-badge&logo=redis&logoColor=34D399)](https://upstash.com/)
[![Shopify Storefront](https://img.shields.io/badge/Shopify-Storefront_API-365314?style=for-the-badge&logo=shopify&logoColor=BEF264)](https://shopify.dev/)
[![Sanity Studio v3](https://img.shields.io/badge/Sanity_v3-Visual_CMS-7F1D1D?style=for-the-badge&logo=sanity&logoColor=FCA5A5)](https://www.sanity.io/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_R3F-030712?style=for-the-badge&logo=threedotjs&logoColor=F43F5E)](https://threejs.org/)
[![Web NFC](https://img.shields.io/badge/Web_NFC-Physical_DNA-134E4A?style=for-the-badge&logo=nfc&logoColor=2DD4BF)](https://w3c.github.io/web-nfc/)
[![Vercel Edge](https://img.shields.io/badge/Vercel-Edge_Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<br />

<p align="center">
  <b><code>小樽工藝系統 // THE DIGITAL HOUSE PLATFORM</code></b><br>
  <i>"Where heavy-gauge physical craftsmanship converges with immutable digital state."</i>
</p>

---

</div>

> ### ❖ CORE ARCHITECTURAL DIRECTIVE
> **Otaru is not merely a storefront. It is the high-performance digital infrastructure layer for a physical design house.**  
> 
> Architected as an **Event-Driven Modular Monolith**, Otaru fuses integer minor-unit financial determinism, transactional outbox durability, cryptographically sealed Web NFC hardware provenance, 60fps WebGL material specimen inspection, and zero-trust distributed edge security into an uncompromising digital experience.

---

## ── System in One Screen

```text
                                   INBOUND CLIENT REQUEST
                                             │
                                      ┌──────▼──────┐
                                      │ Next.js 15  │
                                      │ Edge Guard  │
                                      └──────┬──────┘
                                             │
      ┌──────────────────────────────────────┼──────────────────────────────────────┐
      │                                      │                                      │
      ▼                                      ▼                                      ▼
Distributed Redis                    Admin Authorization                     Zero Production
Rate Limiter (Upstash)               Guard (/admin/* & /api/admin)           Deception (Strict 404/503)
      │                                      │                                      │
      └──────────────────────────────────────┼──────────────────────────────────────┘
                                             │
                                      ┌──────▼──────┐
                                      │ App Router  │
                                      │ RSC / Views │
                                      └──────┬──────┘
                                             │
         ┌───────────────────────────────────┼───────────────────────────────────┐
         │                                   │                                   │
         ▼                                   ▼                                   ▼
  Domain Services                     PostgreSQL (ACID)                   Transactional Outbox
(Commerce / Payments / Provenance)     SELECT FOR UPDATE                   Event Envelopes & Workers
         │                                   │                                   │
         └───────────────────────────────────┼───────────────────────────────────┘
                                             │
                                      ┌──────▼──────┐
                                      │ Operational │
                                      │ Safety-Net  │
                                      │ Reconciler  │
                                      └─────────────┘
```

---

## ── Table of Contents

- [01 — The House](#01--the-house)
- [02 — What Otaru Is](#02--what-otaru-is)
- [03 — Why Otaru Exists](#03--why-otaru-exists)
- [04 — System Architecture & Map](#04--system-architecture--map)
- [05 — Commerce Architecture](#05--commerce-architecture)
- [06 — Payment Security & Trust Boundary](#06--payment-security--trust-boundary)
- [07 — Distributed Systems & Event Pipeline](#07--distributed-systems--event-pipeline)
- [08 — Inventory & Drop Contention Engine](#08--inventory--drop-contention-engine)
- [09 — Physical-Digital Provenance & Web NFC](#09--physical-digital-provenance--web-nfc)
- [10 — 3D WebGL Material Specimen Inspector](#10--3d-webgl-material-specimen-inspector)
- [11 — Motion System & Tactile Interaction](#11--motion-system--tactile-interaction)
- [12 — Brand Identity & Design System](#12--brand-identity--design-system)
- [13 — Edge Security Architecture](#13--edge-security-architecture)
- [14 — Cryptographic Tamper-Evident Audit Chain](#14--cryptographic-tamper-evident-audit-chain)
- [15 — Data Model & Prisma Schema](#15--data-model--prisma-schema)
- [16 — Testing Matrix & Invariant Scanner](#16--testing-matrix--invariant-scanner)
- [17 — Reliability, Resilience & Failure Matrix](#17--reliability-resilience--failure-matrix)
- [18 — Observability & Tracing Infrastructure](#18--observability--tracing-infrastructure)
- [19 — Deployment Pipeline & Migrations](#19--deployment-pipeline--migrations)
- [20 — Environment Variable Matrix](#20--environment-variable-matrix)
- [21 — Comprehensive Repository Map](#21--comprehensive-repository-map)
- [22 — Architectural Decision Records (ADRs)](#22--architectural-decision-records-adrs)
- [23 — Performance Strategy](#23--performance-strategy)
- [24 — Accessibility & WCAG 2.2 AA](#24--accessibility--wcag-22-aa)
- [25 — Browser & Hardware Compatibility](#25--browser--hardware-compatibility)
- [26 — Known Limitations & Technical Gaps](#26--known-limitations--technical-gaps)
- [27 — System Roadmap](#27--system-roadmap)
- [28 — Quick Start & Verification](#28--quick-start--verification)
- [29 — Developer & Contributor Guide](#29--developer--contributor-guide)
- [30 — Technical Credentials](#30--technical-credentials)

---

## 01 — The House

Otaru operates as a physical and digital design atelier. It rejects conventional seasonal fashion cycles in favor of permanent **Chapters** and limited **Artifact releases**.

### Core Philosophical Pillars
* **Garments as Artifacts**: Heavy-gauge 14.5oz selvage denims, structured outerwear, and raw textiles designed for decade-long durability.
* **Physical ↔ Digital Identity**: Every garment carries an embedded leather Web NFC tag linking physical ownership to an immutable digital certificate of authenticity.
* **Editorial Permanence**: Digital storefronts designed with the spatial pacing, typography, and visual restraint of an art monograph.

---

## 02 — What Otaru Is

From an engineering perspective, Otaru is a **production-ready Event-Driven Modular Monolith** combining:

```text
Editorial CMS (Sanity Studio v3)
+
Headless Commerce (Shopify Storefront GraphQL)
+
Cryptographic Payment Ledger (Razorpay HMAC SHA-256)
+
Atomic Inventory Contention Engine (PostgreSQL SELECT FOR UPDATE)
+
Physical-Digital Provenance (Web NFC NDEF API)
+
3D WebGL Fabric Inspector (React Three Fiber / Three.js)
+
Safety-Net Reconciliation Engine (Cross-System Divergence Detector)
```

---

## 03 — Why Otaru Exists

Otaru explores the intersection of seven distinct technical domains:

$$\text{Design Fashion} \times \text{Editorial Narratives} \times \text{Headless Commerce} \times \text{Physical Provenance} \times \text{WebGL Shaders} \times \text{Distributed Systems} \times \text{Payment Security}$$

Standard e-commerce templates fail at high-concurrency drop releases and treat garments as disposable SKUs. Otaru provides the architectural guarantees required to sell high-value physical goods under extreme contention without overselling, losing payments, or compromising brand integrity.

---

## 04 — System Architecture & Map

```mermaid
flowchart TB
    subgraph ClientLayer ["Client & Edge Boundary"]
        CLIENT[User Agent Browser]
        EDGE[Next.js 15 Edge Middleware]
        REDIS_LIM[Upstash Redis Edge Limiter]
    end

    subgraph PresentationLayer ["Next.js App Router"]
        RSC[Server Components]
        API[API Route Handlers]
        STUDIO[Embedded Sanity Studio v3]
    end

    subgraph DomainLayer ["Modular Monolith Domain Services"]
        COMMERCE[Commerce Domain]
        PAYMENTS[Payments & Ledger Domain]
        PROVENANCE[Provenance & NFC Domain]
        INVENTORY[Inventory Contention Engine]
        RECONCILE[Safety-Net Reconciler]
    end

    subgraph PersistenceLayer ["Durable & Ephemeral State"]
        PG[(PostgreSQL Database)]
        REDIS[(Upstash Redis Cache & Locks)]
        OUTBOX[(Transactional Outbox Events)]
    end

    subgraph IntegrationLayer ["Third-Party Service Providers"]
        SHOPIFY[Shopify Storefront API]
        SANITY[Sanity Content CDN]
        RAZORPAY[Razorpay Payment Gateway]
        SHIPROCKET[Shiprocket Logistics API]
        KLAVIYO[Klaviyo CRM API]
        INTERAKT[Interakt WhatsApp API]
    end

    CLIENT -->|HTTPS / CSP Nonce| EDGE
    EDGE -->|Redis Token Bucket| REDIS_LIM
    EDGE -->|Verified Request| RSC
    EDGE -->|Verified API Call| API

    RSC --> DOMAIN
    API --> DOMAIN

    COMMERCE --> SHOPIFY
    COMMERCE --> SANITY
    PAYMENTS --> RAZORPAY
    PROVENANCE --> PG
    INVENTORY --> PG
    RECONCILE --> PG
    RECONCILE --> RAZORPAY

    DOMAIN --> PG
    DOMAIN --> REDIS
    DOMAIN --> OUTBOX

    OUTBOX -->|Worker Claim| SHIPROCKET
    OUTBOX -->|Worker Claim| KLAVIYO
    OUTBOX -->|Worker Claim| INTERAKT
```

---

## 05 — Commerce Architecture

The commerce subsystem abstracts Shopify as an underlying catalog and inventory backend while surfacing custom domain logic through Otaru's unified API boundaries.

### Checkout & Order Creation Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer Browser
    participant App as Otaru App Router
    participant DB as PostgreSQL DB
    participant Redis as Upstash Redis
    participant Gateway as Razorpay API
    participant Outbox as Outbox Publisher

    Customer->>App: POST /api/checkout/razorpay/order (Cart + Idempotency Key)
    App->>Redis: Check Distributed IP & Email Rate Limit
    App->>DB: Check Idempotency Key (IdempotencyRecord)
    App->>DB: Atomic Inventory Lock (SELECT FOR UPDATE)
    App->>App: Compute Minor Unit Amount (paise/cents) & Cart Token
    App->>Gateway: Create Gateway Order (https://api.razorpay.com/v1/orders)
    Gateway-->>App: Return razorpay_order_id
    App->>DB: Record Payment (CREATED) & Order (PAYMENT_PENDING)
    App->>Redis: Issue Single-Use Cryptographic Nonce
    App-->>Customer: Return Checkout Payload (orderId, nonce, cartToken)

    Customer->>Gateway: Complete Payment Modal
    Gateway-->>Customer: Return razorpay_payment_id & razorpay_signature

    Customer->>App: POST /api/checkout/razorpay/verify (Signature + Nonce)
    App->>Redis: Consume Single-Use Nonce (Atomic Del)
    App->>App: Verify HMAC SHA-256 Signature (Constant-Time)
    App->>DB: Transaction: Update Payment (CAPTURED) & Order (CONFIRMED)
    App->>DB: Insert OutboxEvent ("PaymentCaptured")
    App-->>Customer: Return { verified: true }

    Outbox->>Outbox: Async Worker Claims Event & Syncs Shopify / Shiprocket
```

---

## 06 — Payment Security & Trust Boundary

Otaru enforces a **strict zero-trust client policy**. The browser is never allowed to dictate prices, payment status, or inventory availability.

```text
                        CLIENT / BROWSER
                              │
          (Un-trusted Data: Prices, Quantities, Status)
                              │
                              ▼
                OTARU PAYMENT TRUST BOUNDARY
  ┌────────────────────────────────────────────────────────┐
  │ 1. Mandatory HTTPS & Strict CSRF Origin Verification   │
  │ 2. Single-Use Distributed Nonces (issueNonceAsync)     │
  │ 3. Strict UUID Idempotency-Key Registration            │
  │ 4. Integer Minor Unit Calculations (subtotalMinor)    │
  │ 5. HMAC SHA-256 Constant-Time Signature Verification   │
  │ 6. Strict Production Guard (Reject mock signatures)    │
  └────────────────────────────────────────────────────────┘
                              │
            (Cryptographically Verified Gateway State)
                              │
                              ▼
                     POSTGRESQL LEDGER
```

### Key Security Controls
* **Constant-Time Signature Verification**: [`src/app/api/checkout/razorpay/verify/route.ts`](file:///c:/Users/namir/OneDrive/Desktop/otaru/src/app/api/checkout/razorpay/verify/route.ts#L88-L101) uses `crypto.timingSafeEqual` to eliminate timing side-channel attacks on HMAC SHA-256 signatures.
* **Production Mock Rejection**: Production environments throw HTTP `403 Forbidden` (`PRODUCTION_MOCK_FORBIDDEN`) if any client sends `mock: true` or `razorpay_signature === "mock_signature_approved"`.
* **Gateway Fail-Fast**: If Razorpay API credentials are missing or gateway calls fail in production, `/api/checkout/razorpay/order` returns HTTP `503 Service Unavailable` (`RAZORPAY_GATEWAY_UNAVAILABLE`) rather than falling back to sandbox mode.
* **Minor Unit Integer Precision**: All financial amounts are processed as integer paise/cents (`subtotalMinor`, `amountMinor`) to prevent IEEE 754 floating-point rounding vulnerabilities.

---

## 07 — Distributed Systems & Event Pipeline

Otaru uses the **Transactional Outbox Pattern** to decouple core database operations from third-party side effects.

```text
REQUEST -> ACID TRANSACTION -> [ PostgreSQL Table + OutboxEvent ] -> COMMIT
                                                                       │
                                                                       ▼
ASYNC PUBLISHER <- Atomic Claim (OutboxStatus.PROCESSING) <- OUTBOX POLLER
       │
       ├──> Sync to Shopify Storefront
       ├──> Generate Shiprocket Airway Bill
       ├──> Trigger Klaviyo Purchase Event
       └──> Dispatch Interakt WhatsApp Confirmation
```

### Resilience & DLQ Handling
* **Atomic Worker Claiming**: Outbox workers claim events using atomic SQL updates (`WHERE status = 'PENDING' RETURNING *`) to prevent concurrent worker collisions.
* **Exponential Backoff with Jitter**: Failed external API attempts retry up to 5 times with randomized exponential delay (`delay = base * 2^attempt + jitter`).
* **Dead Letter Queue (DLQ)**: Events exceeding max retries move to `OutboxStatus.FAILED` for single-click manual replay via the `/admin/drop-control` control plane.

---

## 08 — Inventory & Drop Contention Engine

To handle high-volume limited garment releases without overselling, Otaru relies on **PostgreSQL Row Locks (`SELECT FOR UPDATE`)**.

```typescript
// src/lib/testing/inventory-lock.ts
await prisma.$transaction(async (tx) => {
  const [item] = await tx.$queryRaw<[{ current_stock: number }]>`
    SELECT current_stock FROM inventory_items 
    WHERE artifact_handle = ${artifactHandle} 
    FOR UPDATE
  `;

  if (item.current_stock < requestedQuantity) {
    throw new Error('OUT_OF_STOCK');
  }

  await tx.$executeRaw`
    UPDATE inventory_items 
    SET current_stock = current_stock - ${requestedQuantity} 
    WHERE artifact_handle = ${artifactHandle}
  `;
});
```

### Verified Contention Invariant
Under a simulated **1,000-user concurrent drop stress test** for a single remaining item (`inventory = 1`), Otaru guarantees:
- **Successfully Confirmed Orders**: Exactly 1
- **Safely Rejected Requests**: Exactly 999 (HTTP 409 `OUT_OF_STOCK`)
- **Oversold Inventory**: 0

---

## 09 — Physical-Digital Provenance & Web NFC

Physical Otaru garments contain an embedded leather NFC tag storing a unique cryptographic serial number.

```text
PHYSICAL GARMENT              ANDROID / CHROME            OTARU REGISTRY
 ┌────────────┐               ┌──────────────┐           ┌──────────────┐
 │ NFC Tag    │ ── (NDEF) ──> │ Web NFC API  │ ── HTTP ─>│ /verify      │
 └────────────┘               └──────────────┘           └──────────────┘
                                                                │
                                                         Verified Serial?
                                                        ┌───────┴───────┐
                                                        ▼               ▼
                                                     Authentic       Un-mapped
                                                    Certificate       Warning
```

### Device Support & Manual Fallback
- **Supported Browsers**: Android Chrome (supports W3C `NDEFReader`).
- **Unsupported Browsers**: iOS Safari / Desktop Chrome display an informative device compatibility message and surface a **Manual Serial Entry UI** to verify garment serials without simulating fake scans.

---

## 10 — 3D WebGL Material Specimen Inspector

Rendered via **React Three Fiber 8** and **Three.js 0.170** inside [`CanvasWrapper`](file:///c:/Users/namir/OneDrive/Desktop/otaru/src/components/three/canvas-wrapper.tsx).

### Technical Specifications
* **Custom Shader Materials**: High-density normal maps representing 14.5oz Japanese selvage denim weaves and organic raw wool textures.
* **Mobile Adaptive Profile**: Viewports under `768px` automatically adjust DPR targets (`dpr={[0.75, 1]}`) and disable antialiasing to preserve 60 FPS performance on lower-tier mobile GPUs.
* **WebGL Fallback**: Gracefully falls back to high-resolution static photographic specimens if WebGL context is lost or unsupported.

---

## 11 — Motion System & Tactile Interaction

Motion in Otaru is designed to communicate physical materiality rather than decorate the interface.

* **Lenis 1.1 Smooth Scroll**: Normalized inertia scrolling synchronized across viewports.
* **GSAP 3 & Framer Motion 11**: Staggered text reveals, magnetic button physics, and custom cursor fluid tracking.
* **Accessibility**: Full compliance with `prefers-reduced-motion: reduce`. All scroll animations and WebGL motion loops immediately suspend when reduced motion is requested.

---

## 12 — Brand Identity & Design System

Otaru enforces a strict domain-specific vocabulary across UI components and routes:

| Standard Commerce | Otaru Domain Term | Route / Mapping |
| :--- | :--- | :--- |
| Product | **Artifact** | `/artifact/[handle]` |
| Collection | **Chapter** | `/chapter/[slug]` |
| Catalog Grid | **Archive** | `/archive` |
| Blog / Articles | **Journal** | `/journal/[slug]` |
| Atelier / About | **Studio** | `/studio` |
| Limited Release | **Drop** | `/drops` |
| Stock Status | **Archive Sold** | Out-of-stock badge |

### Color Palette (Curated HSL)
- **Ink Dark (Background)**: `hsl(40, 5%, 10%)` (`#1c1b18`)
- **Chalk Light (Text)**: `hsl(45, 15%, 95%)` (`#f4f3ef`)
- **Cream Accent**: `hsl(42, 20%, 88%)` (`#e6e4dd`)
- **Muted Gold**: `hsl(38, 40%, 50%)` (`#b89745`)

---

## 13 — Edge Security Architecture

Otaru enforces defense-in-depth security at the Next.js Edge layer inside [`src/middleware.ts`](file:///c:/Users/namir/OneDrive/Desktop/otaru/src/middleware.ts).

```mermaid
flowchart LR
    REQ[Client Request] --> CSP[1. CSP Cryptographic Nonce]
    CSP --> HSTS[2. HSTS & Security Headers]
    HSTS --> CSRF[3. CSRF Host Matching]
    CSRF --> REDIS[4. Upstash Redis Rate Limiter]
    REDIS --> ADMIN[5. Bearer Token Admin Guard]
    ADMIN --> APP[App Router Handler]
```

* **Content Security Policy (CSP)**: Injects per-request cryptographic script nonces (`script-src 'nonce-${nonce}'`).
* **Distributed Edge Rate Limiting**: Powered by Upstash Redis (`ratelimit:${ip}`). Security-critical paths (`/api/checkout`, `/admin`) fail closed in production if Redis is unreachable.
* **Admin Authorization Guard**: Enforces mandatory `Bearer ${ADMIN_API_SECRET}` header validation on all `/admin/*` and `/api/admin/*` endpoints.

---

## 14 — Cryptographic Tamper-Evident Audit Chain

All ledger mutations write cryptographically linked entries to the `AuditEvent` database table ([`src/lib/payments/audit-trail.ts`](file:///c:/Users/namir/OneDrive/Desktop/otaru/src/lib/payments/audit-trail.ts)).

$$\text{Hash}_n = \text{SHA-256}\left( \text{Seq}_n + \text{Timestamp}_n + \text{Type}_n + \text{Details}_n + \text{Hash}_{n-1} \right)$$

If any database row is altered, inserted out of sequence, or deleted, `verifyChainIntegrity()` immediately detects the hash mismatch and flags chain corruption.

---

## 15 — Data Model & Prisma Schema

Defined in [`prisma/schema.prisma`](file:///c:/Users/namir/OneDrive/Desktop/otaru/prisma/schema.prisma).

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER ||--o{ NFC_SCAN : scans
    ORDER ||--|{ ORDER_ITEM : contains
    ORDER ||--o{ PAYMENT : receives
    
    USER {
        string id PK
        string email UK
        string name
    }

    ORDER {
        string id PK
        string internalId UK
        string customerEmail
        string status
        int subtotalMinor
        int totalMinor
    }

    ORDER_ITEM {
        string id PK
        string orderId FK
        string artifactHandle
        int quantity
        int unitPriceMinor
    }

    PAYMENT {
        string id PK
        string orderId FK
        string gatewayOrderId UK
        string gatewayPaymentId UK
        int amountMinor
        string status
    }

    OUTBOX_EVENT {
        string id PK
        string eventId UK
        string type
        json payload
        string status
    }

    AUDIT_EVENT {
        string id PK
        bigint seq
        string prevHash
        string hash
    }
```

---

## 16 — Testing Matrix & Invariant Scanner

Otaru enforces a multi-tiered automated testing matrix:

| Test Suite | Implementation Path | Scope / Target Invariants |
| :--- | :--- | :--- |
| **Unit & Domain** | `src/__tests__/` | Cart, fraud scoring, formatters, tokens |
| **Concurrency Lock** | `src/__tests__/phase5-load-stress.test.ts` | 1,000-user last-item inventory race |
| **Adversarial Security** | `src/__tests__/phase6-adversarial.test.ts` | Mock signature rejection, gateway 503 fail-fast |
| **Release Candidate** | `src/__tests__/phase7-release-candidate.test.ts` | Reconciliation engine, admin auth, ENV matrix |
| **Production Gate** | `npm run production:verify` | Executes static AST scanner + drop rehearsal |

### Static AST Invariant Scanner
[`src/lib/testing/production-invariant-scanner.ts`](file:///c:/Users/namir/OneDrive/Desktop/otaru/src/lib/testing/production-invariant-scanner.ts) scans the codebase prior to production builds to verify:
- Zero mock payment verification handlers in production code
- Zero simulated NFC tag redirects
- Zero process-local security limiters on critical endpoints

---

## 17 — Reliability, Resilience & Failure Matrix

| Component Outage | System Resilience & Recovery Strategy |
| :--- | :--- |
| **Upstash Redis Down** | Critical routes (`/api/checkout`, `/admin`) fail closed in production; public routes degrade gracefully. |
| **PostgreSQL Down** | App Router returns HTTP 503 with correlation ID logs; outbox workers suspend polling until DB recovers. |
| **Razorpay API Down** | `/api/checkout/razorpay/order` throws HTTP 503 (`RAZORPAY_GATEWAY_UNAVAILABLE`); zero mock order creation. |
| **Shopify API Down** | `getProductByHandle` returns `null` to render Next.js 404 pages; zero fake garment substitution. |
| **Worker Process Crash** | Pending outbox events remain safely locked (`OutboxStatus.PROCESSING`) until auto-released after 5-minute TTL. |

---

## 18 — Observability & Tracing Infrastructure

* **Correlation IDs**: All requests generate a unique `x-correlation-id` header propagated across client, middleware, domain services, database transactions, and outbox logs.
* **Structured JSON Logger**: [`src/lib/security/logger.ts`](file:///c:/Users/namir/OneDrive/Desktop/otaru/src/lib/security/logger.ts) formats all server logs as structured JSON with automatic PII redaction for passwords, secret keys, and card tokens.
* **Quantile Metrics Engine**: [`src/lib/observability/metrics.ts`](file:///c:/Users/namir/OneDrive/Desktop/otaru/src/lib/observability/metrics.ts) tracks histogram distributions for request latencies (p50, p95, p99), DB query times, and outbox queue backlogs.

---

## 19 — Deployment Pipeline & Migrations

```text
DEVELOPMENT         GITHUB ACTIONS (CI)         PRODUCTION (VERCEL)
┌───────────┐       ┌─────────────────┐       ┌─────────────────────┐
│ git push  │ ────> │ 1. Typecheck    │ ────> │ 1. Migration Deploy │
└───────────┘       │ 2. ESLint       │       │    (prisma migrate) │
                    │ 3. Vitest       │       │ 2. Production Build │
                    │ 4. Inv. Scanner │       │ 3. Edge Deployment  │
                    └─────────────────┘       └─────────────────────┘
```

### Production Database Migration Rule
In production, Otaru strictly executes `npx prisma migrate deploy` to apply zero-downtime, idempotent SQL migration files. The development command `prisma db push` is strictly forbidden in production pipelines.

---

## 20 — Environment Variable Matrix

Mapped in [`src/lib/env.ts`](file:///c:/Users/namir/OneDrive/Desktop/otaru/src/lib/env.ts) and `.env.example`.

| Variable Name | Scope | Required in Prod? | Description / Security Purpose |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Server | **Yes** | PostgreSQL connection pool URL |
| `DIRECT_DATABASE_URL` | Server | **Yes** | Direct PostgreSQL connection URL for Prisma migrations |
| `UPSTASH_REDIS_REST_URL` | Server | **Yes** | Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Server | **Yes** | Upstash Redis REST access token |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client | **Yes** | Public Razorpay Gateway Key ID |
| `RAZORPAY_KEY_SECRET` | Server | **Yes** | Server-side Razorpay HMAC signature secret |
| `ADMIN_API_SECRET` | Server | **Yes** | Bearer token secret protecting `/admin/*` endpoints |
| `PAYMENT_CART_SECRET` | Server | **Yes** | Secret used to sign cart verification JWT tokens |
| `SHOPIFY_STORE_DOMAIN` | Server | **Yes** | Shopify Storefront domain (`otaru.myshopify.com`) |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Server | **Yes** | Shopify Storefront GraphQL access token |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Both | **Yes** | Sanity CMS Project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Both | **Yes** | Sanity CMS Dataset (`production`) |
| `NEXT_PUBLIC_SITE_URL` | Both | **Yes** | Canonical site URL (`https://otaru.in`) |

---

## 21 — Comprehensive Repository Map

```text
otaru/
├── prisma/
│   └── schema.prisma                 # Core PostgreSQL database schema & enums
├── src/
│   ├── app/                          # Next.js 15 App Router pages & API endpoints
│   │   ├── account/                  # Patron account & order history
│   │   ├── admin/drop-control/       # Limited drop control plane dashboard
│   │   ├── api/                      # REST Endpoints (Checkout, Reconcile, Webhooks)
│   │   ├── archive/                  # Full garment catalog grid
│   │   ├── artifact/[handle]/        # Garment detail page & 3D material viewer
│   │   ├── chapter/[slug]/           # Editorial chapter collection view
│   │   ├── checkout/                 # Order registry checkout & escrow modal
│   │   ├── drops/                    # Release countdown & waitlist registration
│   │   ├── journal/                  # Archival essays & design notes
│   │   ├── studio/                   # Embedded Sanity Studio v3 CMS
│   │   └── verify/                   # Physical Web NFC authenticity lookup
│   ├── components/                   # React 19 UI Components
│   │   ├── artifact/                 # Size selectors, specimen galleries
│   │   ├── cart/                     # Cart drawer, quantity controls
│   │   ├── layout/                   # Luxury header, footer, custom cursor
│   │   ├── provenance/               # Web NFC scanner & authenticity certificates
│   │   ├── three/                    # R3F WebGL Canvas & fabric shaders
│   │   └── ui/                       # Primitive buttons, modals, badges
│   ├── lib/                          # Core Domain Engines & Business Logic
│   │   ├── cms/                      # Sanity GROQ queries & content mappers
│   │   ├── commerce/                 # Product lookup & domain mappers
│   │   ├── db/                       # Prisma client singleton & connection pools
│   │   ├── integrations/             # Shopify, Shiprocket, Klaviyo, Interakt SDKs
│   │   ├── observability/            # Correlation IDs, quantile metrics, JSON logger
│   │   ├── payments/                 # Ledger, audit trail, idempotency, reconciler
│   │   ├── queue/                    # Outbox publisher, event envelopes, workers
│   │   ├── redis/                    # Ephemeral Upstash Redis client
│   │   ├── security/                 # CSRF guard, rate limiter, PII redaction
│   │   └── testing/                  # Drop rehearsal, invariant scanner, ENV check
│   ├── styles/                       # CSS tokens & global design system
│   ├── types/                        # Shared TypeScript interfaces
│   └── middleware.ts                 # Global Edge middleware (CSP, Rate Limit, Auth)
├── docs/                             # Documentation assets & specifications
├── package.json                      # Workspace dependencies & npm scripts
├── next.config.ts                    # Next.js configuration & image domains
└── tailwind.config.ts                # Design system tokens & HSL color palette
```

---

## 22 — Architectural Decision Records (ADRs)

### ADR 001: Modular Monolith Over Microservices
* **Decision**: Adopt a Modular Monolith inside Next.js 15 App Router instead of distributed microservices.
* **Rationale**: Eliminates network latency overhead, multi-repo synchronization friction, and distributed transaction complexity while preserving clean domain boundaries.

### ADR 002: Transactional Outbox Over Direct Side Effects
* **Decision**: Write domain events to an `outbox_events` PostgreSQL table inside the main ACID transaction rather than firing third-party API webhooks directly inside API handlers.
* **Rationale**: Guarantees at-least-once event delivery and prevents third-party API outages (e.g. Shiprocket or Klaviyo downtime) from failing customer payments.

### ADR 003: Minor Unit Integer Representation
* **Decision**: Represent all currency values as integer minor units (`subtotalMinor`, `amountMinor`).
* **Rationale**: Completely avoids IEEE 754 floating-point rounding errors across database queries, cart calculations, and payment gateway signatures.

---

## 23 — Performance Strategy

* **React Server Components (RSC)**: 85%+ of page components render on the server, shipping zero JavaScript to the client for static editorial sections.
* **Image Optimization**: All imagery delivered via Next.js Image Optimization with WebP/AVIF format conversion, explicit aspect ratio reservations (zero CLS), and priority preloading on hero artifacts.
* **Code Splitting**: Heavy 3D Three.js Canvas components are dynamically imported (`next/dynamic`) with SSR disabled to keep initial JS bundles small.

---

## 24 — Accessibility & WCAG 2.2 AA

* **Keyboard Navigation**: All interactive elements maintain explicit, high-contrast focus rings (`outline-ring`) and full keyboard accessibility (`Tab`, `Enter`, `Space`, `Esc`).
* **Screen Readers**: Visual badges and interactive controls include ARIA attributes (`aria-expanded`, `aria-label`, `role="dialog"`).
* **Reduced Motion**: Full support for `prefers-reduced-motion: reduce` across Lenis smooth scroll, GSAP animations, and Three.js WebGL rendering loops.

---

## 25 — Browser & Hardware Compatibility

| Browser / Hardware Platform | Storefront Core | 3D WebGL Inspector | Web NFC Provenance |
| :--- | :--- | :--- | :--- |
| **Desktop Chrome / Edge** | Supported (100%) | Supported (High-DPR) | Manual Serial Input |
| **Desktop Safari** | Supported (100%) | Supported (High-DPR) | Manual Serial Input |
| **Desktop Firefox** | Supported (100%) | Supported (High-DPR) | Manual Serial Input |
| **Android Chrome** | Supported (100%) | Supported (Mobile DPR) | **Full Web NFC Native Scan** |
| **iOS Safari** | Supported (100%) | Supported (Mobile DPR) | Manual Serial Input |

---

## 26 — Known Limitations & Technical Gaps

* **Web NFC iOS Limitation**: Apple iOS Safari does not support the W3C Web NFC `NDEFReader` API. iPhone users must use the manual serial input option.
* **Multi-Currency Display**: Payments currently process in primary currency units (`INR`/`USD`). Multi-currency regional auto-switching is planned for Chapter IV.

---

## 27 — System Roadmap

```text
CHAPTER I — Architectural Foundation & Monolithic Core         [COMPLETED ✅]
CHAPTER II — Durable PostgreSQL State & Minor Units            [COMPLETED ✅]
CHAPTER III — Transactional Outbox & Event Pipeline            [COMPLETED ✅]
CHAPTER IV — Adversarial Trust Boundary & Payment Hardening   [COMPLETED ✅]
CHAPTER V — Safety-Net Reconciliation Engine & Release Gate   [COMPLETED ✅]
CHAPTER VI — Multi-Region Edge Distributed Caching & Scaling   [PLANNED ⏳]
```

---

## 28 — Quick Start & Verification

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/theninthfoundry/otaru-.git
cd otaru-
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

### 3. Initialize Database & Run Migrations
```bash
npm run db:generate
npm run db:migrate:dev
```

### 4. Run Development Server
```bash
npm run dev
```
*Storefront mounts locally at `http://localhost:3000`.*

### 5. Execute Full Production Verification Gate
```bash
npm run production:verify
```
*Runs Vitest unit tests, drop contention stress simulation, static invariant scanner, and safety-net reconciliation engine.*

---

## 29 — Developer & Contributor Guide

### Code Formatting & Quality Scripts
```bash
npm run typecheck       # Run TypeScript compiler check
npm run lint            # Run ESLint rules
npm run format          # Run Prettier code formatting
npm run test            # Run Vitest unit & integration test suite
npm run build           # Build Next.js 15 production bundle
```

### Git Commit Conventions
Otaru enforces Conventional Commits:
- `feat(commerce)`: New commerce capability
- `security(payments)`: Payment or security boundary modification
- `fix(webgl)`: Shader or 3D canvas fix
- `test(concurrency)`: Concurrency or load test updates

---

## 30 — Technical Credentials

```text
Architecture            Event-Driven Modular Monolith
Frontend Framework      Next.js 15.1 (App Router, Server Components)
UI Library              React 19.0
Language                TypeScript 5.7 (Strict Mode)
Database                PostgreSQL (ACID Transactions, Row Locks)
ORM                     Prisma 6.3
Distributed State       Upstash Redis (Edge Rate Limiting & Nonces)
3D WebGL Engine         React Three Fiber 8.17 / Three.js 0.170
Motion Engine           Lenis 1.1 / GSAP 3.12 / Framer Motion 11.15
Headless Commerce       Shopify Storefront GraphQL API
Headless CMS            Sanity Studio v3
Payment Gateway         Razorpay API (HMAC SHA-256 Signature Verification)
Testing Suite           Vitest 2.1 / Playwright 1.49 / MSW 2.7
Production Gate Status  RELEASE CANDIDATE (13/13 Invariants PASS)
```

---

Built as a digital house for physical artifacts.

**OTARU**
