# Webhooks Routing Architecture — Otaru Platform

Otaru utilizes webhooks to keep stock levels synchronized, revalidate editorial page cache layouts, and process payment transitions asynchronously.

---

## ⚡ Webhook Endpoints Index

### 1. `/api/checkout/razorpay/webhook`
- **Source**: Razorpay payment gateway
- **Actions**: Handles `payment.captured`, `payment.failed`, and `refund.processed` hooks.
- **Verification**: Signature header check using standard Razorpay webhook secrets (`razorpay_signature`).
- **Domain Service Flow**:
  ```
  Webhook Payload ──> Verification ──> Update Ledger ──> Trigger Shopify Order Creation
  ```

### 2. `/api/webhooks/order`
- **Source**: Shopify Admin Webhooks
- **Actions**: Triggers shipment assignment logic and Shiprocket courier matching on order placement.
- **Verification**: Validates Shopify HMAC header signatures.

### 3. `/api/webhooks/revalidate`
- **Source**: Sanity CMS mutations
- **Actions**: Purges Next.js page routes cache (`/`, `/archive`, `/chapter/*`, `/journal/*`) dynamically on document publication.
- **Verification**: Secret token validation comparison.
