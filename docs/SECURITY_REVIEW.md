# HOUSE OF OTARU — APPLICATION SECURITY & PRODUCTION RISK REVIEW
**Document ID:** OTARU-SEC-001  
**Author:** Application Security Engineer & Systems Architect  
**Methodology:** OWASP Web Security Testing Guide (WSTG) & Next.js Production Security Hardening  
**Scope:** Full Application Surface, APIs, Edge Middleware, Secrets, and Payment Boundaries  

---

## 1. Secrets & Credential Exposure Review

### 1.1 Source Code & Repository Audit
- **Public Bundle Leaks**: Inspected `src/lib/env.ts` and Next.js configuration. No private API keys or database connection strings are exposed with the `NEXT_PUBLIC_` prefix.
- **Git Commit History**: No raw production credentials or API tokens were found hardcoded in active source files. Sample values in `.env.example` use non-functional placeholders (`rzp_live_yourKeyId`, `your_32_byte_hex_admin_secret`).
- **Development Key Defaults**: `src/lib/env.ts` assigns safe public fallbacks for `NEXT_PUBLIC_SITE_URL` and `SHOPIFY_STORE_DOMAIN`.

### 1.2 Environment Variable Separation
| Variable Name | Exposure Scope | Sensitivity Level | Validation Guard | Risk Assessment |
|---|---|---|---|---|
| `DATABASE_URL` | Server Only | High (DB Access) | Checked in `src/lib/db/prisma.ts` | **Protected**: Safe mock Proxy used if absent. |
| `UPSTASH_REDIS_REST_URL` | Server Only | High (Rate Limit / Nonce) | Checked in `StrictProductionRedisClient` | **Protected**: Fails closed in production. |
| `RAZORPAY_KEY_SECRET` | Server Only | Critical (Payment Signature)| Evaluated in `/api/checkout/verify` | **Protected**: Never bundled to client. |
| `RAZORPAY_WEBHOOK_SECRET` | Server Only | Critical (Webhook HMAC) | Validated in `/api/webhooks/razorpay` | **Protected**: HMAC-SHA256 verified. |
| `ADMIN_API_SECRET` | Server Only | Critical (Admin Guard) | Enforced in `src/middleware.ts` | **Protected**: Bearer / Cookie required. |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID`| Client Public | Low (Public Key ID) | Read by client Razorpay SDK | **Standard**: Expected public identifier. |

---

## 2. Input Validation, Encoding & Injection Hazards

### 2.1 Cross-Site Scripting (XSS) & Unsafe HTML
- **React JSX Default Escaping**: Dynamic text across components (product names, stories, materials) uses standard JSX data binding, automatically escaping HTML entities.
- **`dangerouslySetInnerHTML` Audit**: No instances of unescaped user input passed to `dangerouslySetInnerHTML` were found in active customer-facing components.
- **Search Query Sanitization**: `src/lib/search.ts` escapes special regular expression characters (`replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`) before performing title/material matching.

### 2.2 Cross-Site Request Forgery (CSRF)
- `src/lib/security/csrf.ts` enforces origin and referer header validation on all state-mutating requests (`POST`, `PUT`, `DELETE`, `PATCH`).
- **Origin Header Verification**:
  ```ts
  return sourceHost === host || sourceHost.endsWith(`.${host}`);
  ```
- **Finding (P2)**: While functional, `sourceHost.endsWith('.${host}')` could theoretically match untrusted subdomains if wildcard DNS is misconfigured.
- **Remediation**: Use an explicit origin whitelist matching `process.env.NEXT_PUBLIC_SITE_URL` and trusted domains.

---

## 3. Server-Side Authorization & Administrative Gate

### 3.1 Edge Middleware Gate
`src/middleware.ts` enforces edge-level access control on all administrative surfaces:
- Routes matching `/admin/*` and `/api/admin/*` require either:
  1. An `Authorization: Bearer <ADMIN_API_SECRET>` request header.
  2. A secure `otaru_admin_token` cookie matching `ADMIN_API_SECRET`.
- In production (`NODE_ENV === 'production'`), requests without valid credentials receive HTTP 401 Unauthorized with `{ error: 'Unauthorized administrative access rejected.' }`.

---

## 4. Commerce Trust Boundaries & Payment Gateway Integrity

### 4.1 Authoritative Server-Side Pricing (Zero-Trust)
- In `src/app/api/checkout/route.ts`, line items supplied by the client are strictly treated as selection identifiers (`id`, `qty`).
- Unit prices are authoritatively read from `PRODUCT_CATALOG` on the server.
- Line totals, shipping rules (free over $250), gift packaging fees, and 12% GST are calculated authoritatively.
- A signed, tamper-evident cart token (`issueCartToken`) binds the line items and computed amount to an internal order ID.

### 4.2 Nonce Replay Protection
- An atomic payment nonce (`issueNonce`) is generated and stored in Redis.
- During settlement verification (`/api/checkout/verify`), the nonce is consumed atomically via a Lua script (`claimNonce`). If an attacker attempts to replay a verification payload with a consumed nonce, the server rejects the request with HTTP 409 Conflict (`NONCE_INVALID`).

### 4.3 Webhook Idempotency & Signature Verification
- In `src/app/api/webhooks/razorpay/route.ts`, the incoming request body is buffered as raw text and verified against `x-razorpay-signature` using `crypto.timingSafeEqual`.
- Webhook events are deduplicated via PostgreSQL unique key constraints on `eventId` inside a transactional boundary (`tx.webhookEvent.findUnique`).

---

## 5. Browser Security & Content Security Policy (CSP)

### 5.1 Security Headers Configured in Middleware & `next.config.mjs`
- `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload` (HSTS enabled).
- `X-Frame-Options`: `DENY` (clickjacking protection).
- `X-Content-Type-Options`: `nosniff` (MIME-sniffing protection).
- `Referrer-Policy`: `strict-origin-when-cross-origin`.
- `Permissions-Policy`: Restricts camera, microphone, geolocation, and browsing-topics; allows payment only from `self`, `api.razorpay.com`, and `checkout.razorpay.com`.

### 5.2 Content Security Policy (CSP)
- CSP header generated dynamically in `src/middleware.ts`:
  - `default-src 'self'`
  - `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com ...`
  - `frame-src 'self' https://checkout.shopify.com https://api.razorpay.com`
  - `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`
- **Improvement Needed (P2)**: Replace `'unsafe-inline'` and `'unsafe-eval'` with cryptographic per-request nonces (`x-nonce`) across Next.js script tags.

---

## 6. Abuse Protection & Rate Limiting

- **Distributed Rate Limiting**: Implemented via Upstash Redis sliding counter in `src/middleware.ts`.
- **Threshold**: 60 requests/minute per client IP (extracted via `x-forwarded-for` and `x-real-ip`).
- **Fail-Closed Policy**: Critical routes (`/api/checkout`, `/admin`) fail closed (HTTP 503) if Redis is down in production.
- **In-Memory Fallback**: For development and automated testing, `InMemoryRedisAdapter` maintains per-process sliding expiration maps.

---

## 7. Dependency Vulnerability Review

- Scanned `package.json` direct dependencies.
- **High-Risk Observation**: React 19 is installed (`"react": "^19.0.0"`, `"react-dom": "^19.0.0"`), requiring dependency overrides for `@react-three/fiber`, `@react-three/drei`, and `@react-spring/*`.
- **Redundant Dependency**: `styled-components: ^6.5.3` is installed but unneeded alongside Tailwind and CSS custom properties.
- **Sanity & Shopify SDKs**: Present in dependencies but largely unutilized in production bundles.

---

## 8. Prioritized Security Remediation Log

| Finding ID | Severity | Description | Fix Requirement | Verification Status |
|---|:---:|---|---|:---:|
| **SEC-01** | **P0** | Hardcoded Windows developer paths in `/api/hero-image` and `/api/images/[id]`. | Replace with repository static assets in `public/images/`. | **PENDING (Prompt 02)** |
| **SEC-02** | **P1** | Sandbox mock checkout bypass `{ mock: true }` allowed if `STRICT_PAYMENT_MODE` is unset. | Ensure mock payments are unconditionally blocked in production builds. | **VERIFIED (Code Guarded)** |
| **SEC-03** | **P1** | Ephemeral filesystem writes in `ledger.ts` to `payment-ledger.json`. | Route all production ledger writes to PostgreSQL via Prisma. | **SCHEDULED (Prompt 07)** |
| **SEC-04** | **P2** | CSP contains `'unsafe-inline'` and `'unsafe-eval'`. | Enforce strict nonce-based CSP headers on script tags. | **SCHEDULED (Prompt 09)** |
| **SEC-05** | **P2** | Subdomain CSRF check in `csrf.ts` uses `.endsWith()`. | Restrict to strict origin whitelist. | **SCHEDULED (Prompt 09)** |
