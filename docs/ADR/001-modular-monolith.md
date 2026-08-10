# ADR 001: Modular Monolith Architecture

## Status
Approved

## Context
Otaru is a startup storefront that requires high speed of development, loose coupling between logical domains, and zero infrastructure overhead at inception. Transitioning early to microservices would introduce distributed tracing complexity, complex transaction loops, and high infrastructure bills.

## Decision
We adopt a **Modular Monolith** architecture.
- Core business capabilities are isolated inside the `src/lib/` directory using strict directory folders (e.g. `src/lib/commerce/`, `src/lib/payments/`, `src/lib/provenance/`).
- Higher-level route layers and components cannot directly access internal integration details (e.g. raw GraphQL query files). They must import high-level domain functions.
- Domain modules cannot import internal functions from other modules directly; they communicate via high-level public exports.

## Consequences
- **Pros**: Zero networking latency between services, easy code navigation, quick builds, unified deployment.
- **Cons**: Requires developer discipline to maintain folder boundaries (no circular dependencies or shortcuts across folders).
