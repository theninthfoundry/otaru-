# Webhooks Routing Architecture — Otaru Platform

Otaru utilizes webhooks to keep stock levels synchronized, revalidate editorial page cache layouts, and process payment transitions asynchronously.

---

## ⚡ Canonical Production Webhook Index

### 1. `/api/webhooks/razorpay` (Canonical Production Ingestion)
- **Source**: Razorpay payment gateway
- **Actions**: Handles `payment.captured`, `payment.failed`, and `refund.processed` hooks into the idempotent transactional outbox.
- **Verification**: Timing-safe HMAC-SHA256 signature verification over raw request body via `x-razorpay-signature`.
- **Domain Service Flow**:
  ```
  Webhook Payload ──> Timing-Safe HMAC ──> Deduplication (WebhookEvent) ──> PostgreSQL Ledger & Order Transition
  ```
- **Note**: The legacy prototype path `/api/checkout/razorpay/webhook` has been permanently consolidated into this single canonical endpoint to prevent split-brain state machines.

### 2. `/api/webhooks/order`
- **Source**: Shopify Admin Webhooks
- **Actions**: Triggers shipment assignment logic and Shiprocket courier matching on order placement.
- **Verification**: Validates Shopify HMAC header signatures.

### 3. `/api/webhooks/revalidate`
- **Source**: Sanity CMS mutations
- **Actions**: Purges Next.js page routes cache (`/`, `/archive`, `/chapter/*`, `/journal/*`) dynamically on document publication.
- **Verification**: Secret token validation comparison.
