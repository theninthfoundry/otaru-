# ADR 004: Shopify as Core Commerce Source of Truth

## Status
Approved

## Context
When synchronizing e-commerce states (stock quantities, pricing variants, checkout records), having multiple databases claiming authority leads to data conflicts.

## Decision
We enforce **Shopify** as the primary authoritative source of truth for:
- Product catalogs (titles, variants, pricing, sizes).
- Stock inventory counts.
- Initial order creation records.

The Otaru local database synchronizes and caches this data but does NOT override Shopify's values. When an order is completed locally via Razorpay signature verification, Otaru updates its local ledger and immediately calls Shopify Admin API to register/capture the order.

## Consequences
- **Pros**: Relies on Shopify's battle-tested checkout and inventory booking scaling structures.
- **Cons**: Requires reliable webhook sync loops to keep Otaru local DB updated.
