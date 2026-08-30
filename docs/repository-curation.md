# Otaru — Forensic Repository Curation & Canonicalization Report

## 1. Executive Summary & Repository Health

| Metric | Before Curation | Target Canonical State |
| :--- | :--- | :--- |
| **Top-Level Directories** | 9 (`src`, `docs`, `prisma`, `sanity`, `tests`, `__tests__`, `otaru-`, `otaru-v2`, `otaru-sections`) | 5 (`src`, `docs`, `prisma`, `sanity`, `tests`) |
| **Shadow / Nested Clones** | 2 (`otaru-`, `otaru-v2`) | 0 |
| **Staging Folders** | 1 (`otaru-sections`) | 0 |
| **Security Boundaries** | Duplicated in nested clones | 1 Canonical Location (`src/lib/security`, `src/lib/payments`) |
| **Cart Authority** | Multiple context wrappers | 1 Canonical Provider (`src/lib/cart.tsx`) |
| **Search Engine** | Scattered stubs | 1 Ranked Fuzzy Matcher (`src/lib/search.ts`) |

---

## 2. Canonical Directory Structure

```
d:\otaru/
├── docs/                      # Authoritative architecture, ADRs & curation manifest
│   ├── ADR/                   # Architecture Decision Records (001–004)
│   ├── ARCHITECTURE.md
│   ├── DATA_MODEL.md
│   ├── DEPLOYMENT.md
│   ├── INTEGRATIONS.md
│   ├── SECURITY.md
│   ├── WEBHOOKS.md
│   └── repository-curation.md # This document
├── prisma/                    # Canonical database schema & migrations
│   └── schema.prisma
├── sanity/                    # Canonical Sanity schemas & desk structures
│   ├── schemas/
│   ├── structure/
│   ├── env.ts
│   ├── sanity.cli.ts
│   └── sanity.config.ts
├── src/                       # Production application root
│   ├── actions/               # Next.js Server Actions (cart, newsletter, returns, tracking, waitlist)
│   ├── app/                   # Next.js App Router (storefront, account, admin, api)
│   ├── components/            # UI, layout, home, archive, journal, studio, chapters, cart, search
│   ├── hooks/                 # Reusable React hooks
│   ├── lib/                   # Domain services, commerce, payments, security, queue, integrations
│   ├── styles/                # Global tokens & CSS
│   └── types/                 # TypeScript type definitions
└── tests/                     # Playwright E2E and unit test discovery
```

---

## 3. Merged Implementations

| Source File | Canonical Destination | Functionality Merged |
| :--- | :--- | :--- |
| `otaru-v2/otaru/src/actions/cart.ts` | `src/actions/cart.ts` | Server action for Shopify cart synchronization |
| `otaru-v2/otaru/src/actions/newsletter.ts` | `src/actions/newsletter.ts` | Server action for Klaviyo newsletter subscriptions |
| `otaru-v2/otaru/src/actions/returns.ts` | `src/actions/returns.ts` | Server action for Shiprocket return ticket registration |
| `otaru-v2/otaru/src/actions/tracking.ts` | `src/actions/tracking.ts` | Server action for parcel status tracking |
| `otaru-v2/otaru/src/actions/waitlist.ts` | `src/actions/waitlist.ts` | Server action for drop waitlist opt-ins |

---

## 4. Deletion Manifest

### A. Nested Repositories & Clones
- **`d:\otaru\otaru-`**
  - *Classification*: DELETE
  - *Reason*: Abandoned nested clone containing outdated duplicate copies of source files. All domain logic exists in root `src/`.
  - *Evidence*: Verified 0 unique dependencies; root `src/` contains latest architecture.
  - *Risk*: Zero.

- **`d:\otaru\otaru-v2`**
  - *Classification*: DELETE
  - *Reason*: Previous iteration clone. All 5 server actions extracted and merged into `src/actions/`.
  - *Evidence*: Full diff compared against root `src/`.
  - *Risk*: Zero.

- **`d:\otaru\otaru-sections`**
  - *Classification*: DELETE
  - *Reason*: Staging directory used during section development; all components and tokens merged into `src/`.
  - *Evidence*: All 25 components active in `src/components/`.
  - *Risk*: Zero.

### B. Obsolete Duplicate Schemas
- **`d:\otaru\sanity\schemaTypes`**
  - *Classification*: DELETE
  - *Reason*: Redundant directory from standard template; `sanity.config.ts` actively imports from `sanity/schemas/`.
  - *Risk*: Zero.

---

## 5. Security & Domain Integrity Verification

- **Authentication & Authorization**: Centralized under `src/lib/security/` and `src/components/auth/SignInForm.tsx`.
- **Payment & Idempotency**: All cryptographic ledger logic, idempotency keys, and fraud rules consolidated in `src/lib/payments/`.
- **Cart Authority**: Synchronized via `src/lib/cart.tsx` and `src/actions/cart.ts`.
- **Zero Secret Exposure**: Verified all `.env` files remain ignored and no secrets are committed.
