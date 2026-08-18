# Otaru Artifact OS — Source of Truth Matrix

This matrix establishes the definitive authoritative systems of record across all data domains in Otaru, eliminating cross-system divergence and architectural ambiguity.

---

## 🏛️ Domain Authority Mapping

| Data Domain | Authoritative Source of Truth | Replicas & Secondary Caches | Reconciliation / Invariant Policy |
| :--- | :--- | :--- | :--- |
| **Physical Garment Identity** | **Otaru `ArtifactLedger` & Hardware NFC** | PostgreSQL `nfc_scans`, Sanity CMS | Immutable append-only SHA-256 hash chained ledger. |
| **Garment Serial & Edition** | **Otaru `PhysicalInventoryEngine`** | Shopify Product Metafields | Deterministic allocation of serialized units (`OTARU-ARC-xxx`). |
| **Editorial & Material Spec** | **Sanity Studio v3 (Content CDN)** | Next.js Edge Cache / Local Fallback | Revalidated on GROQ webhook mutation. |
| **Commercial Catalog & SKU** | **Shopify Storefront GraphQL** | In-Memory Catalog Cache | Read-only commercial ingestion; Otaru wraps with artifact metadata. |
| **Order Lifecycle State** | **Otaru `OrderStateMachine`** | PostgreSQL `orders` table | Strict monotonic state transitions with zero illegal jumps. |
| **Financial Ledger & Payments** | **Otaru `PaymentStateMachine` + Razorpay** | PostgreSQL `payments`, `audit_events` | Continuous cross-gateway reconciliation via `FinancialControlPlane`. |
| **Fulfillment & Tracking** | **Otaru Order Service + Shiprocket** | Customer Account Dashboard | Outbox event delivery with exponential backoff. |
| **Customer Marketing & CRM** | **Klaviyo CRM & Interakt WhatsApp** | Outbox Event Archive | Non-blocking Tier 3 async queue dispatch. |

---

## 🔒 Cross-System Boundaries
1. **Shopify owns**: Commercial variant IDs, base list pricing, and merchant catalog metadata.
2. **Otaru owns**: Physical garment provenance, NFC hardware keys, serialized physical allocation, financial ledger integrity, and drop admission gates.
