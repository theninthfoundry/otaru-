# ADR 003: Redis for Ephemeral State & Rate Limiting

## Status
Approved

## Context
Executing high-volume edge requests (analytics collections, IP rate-limiting, and cart checks) against a primary PostgreSQL database would lead to high connection pools, database locks, and performance bottlenecks.

## Decision
We introduce **Redis** as our high-performance ephemeral memory tier.
- **Token Bucket Rate Limiter**: Client IP request limits are written to Redis keys with expiration windows.
- **Idempotency Locks**: Razorpay webhook IDs are verified against Redis keys prior to ledger updates.
- **Catalog Caching**: Compiled shopify/sanity catalog queries cache inside Redis to minimize external query latency and API costs.

## Consequences
- **Pros**: Sub-millisecond response latency, sliding window structures, automatic key TTL expirations.
- **Cons**: Adds a cache-invalidation layer and an additional hosting dependency.
