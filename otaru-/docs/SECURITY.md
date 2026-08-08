# Edge-Level Security Specifications — Otaru Platform

Otaru enforces edge-level guards inside `middleware.ts` to defend transaction checkpoints, payments, and client sessions from script injections and scraping vectors.

---

## 🔒 1. Content Security Policy (CSP)

Otaru generates a unique cryptographically random **nonce** per client request. The middleware maps this nonce to the response headers to allow scripts loaded by approved analytics and CRM vendors while blocking all other execution vectors.

### Active Directives

```typescript
const csp = [
  "default-src 'self'",
  "script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://connect.facebook.net https://app.posthog.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://cdn.shopify.com https://cdn.sanity.io",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://*.shopify.com https://*.sanity.io https://apiv2.shiprocket.in",
  "frame-src 'self' https://checkout.shopify.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join('; ');
```

---

## 🛡️ 2. CSRF Origin Guards

To secure state mutations (Razorpay webhook triggers, order submissions, newsletter signups), mutating actions (`POST`, `PUT`, `DELETE`) are run through a CSRF validation filter:
- Origin header validation checks verify requesting client identity against verified host values.
- Mismatched origins immediately reject with `403 Forbidden` statuses.

---

## 📈 3. Edge-Level Sliding Token Bucket Rate Limiting

To prevent API abuse, all requests are rate-limited per client IP:
- **Default Limit**: 60 requests per minute.
- **Limiter Core**: Redis tokens bucket (Phase 1) or fast edge-memory limiter (Phase 0).
- **Headers Set**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` metadata headers are sent on all responses.

---

## 🏛️ 4. Cryptographic Ledger & Audit Logs
- All captured Razorpay payments write cryptographically formatted entries to the Otaru Ledger.
- Sensitive payment endpoints execute in isolated server blocks, utilizing HMAC-signed token validations to verify cart states haven't been tampered with.
