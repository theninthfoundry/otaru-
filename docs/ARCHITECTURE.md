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

## 🛰️ Extended Subsystems & Capabilities

### 1. Multi-Currency FX Engine (`src/lib/commerce/currency.ts`)
Deterministic minor-unit integer currency conversions across `USD`, `EUR`, `GBP`, `JPY`, `CAD`, and `INR` with localized formatting and country-specific ISO routing.

### 2. Transactional Outbox Background Worker (`src/lib/queue/worker.ts` & `/api/cron/outbox`)
Asynchronous background drain process with atomic status transitions, exponential backoff, and dead-letter queue routing.

### 3. Cryptographic Provenance Transfer Protocol (`src/lib/provenance/transfer.ts` & `/api/verify/transfer`)
SHA-256 state seal and transfer token verification allowing patrons to securely reassign NFC physical artifact certificates.

### 4. Real-Time Telemetry SSE Stream (`src/app/api/telemetry/stream` & `useDropTelemetry`)
Server-Sent Events connection streaming live concurrent viewers, cart reservation velocity, and drop contention indicators.

### 5. Automated Safety-Net Reconciliation Cron (`src/app/api/cron/reconcile`)
Periodic reconciliation engine comparing gateway states with PostgreSQL ledger records and sealing results into the cryptographic audit chain.

