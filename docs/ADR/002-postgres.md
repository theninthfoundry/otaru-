# ADR 002: PostgreSQL for Application Data

## Status
Approved

## Context
Otaru requires highly reliable, relational data modeling for user accounts, membership levels, order statuses, and immutable transaction audit logs. 

## Decision
We select **PostgreSQL** as the primary relational application database, paired with **Prisma ORM** for type-safe query compilation.
- Transactions log history and status transitions must remain highly consistent (ACID compliant).
- Customer data, membership status, and physical serial authenticity maps must utilize foreign key constraints and indexes.

## Consequences
- **Pros**: Strong data consistency, foreign keys validation, native support for JSON columns, mature ecosystem.
- **Cons**: Requires database migration steps during updates.
