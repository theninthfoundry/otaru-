# External API Integrations — Otaru Platform

This document catalogs the integrations architecture, protocols, and mock layers interfacing the Otaru digital fashion archive with third-party service nodes.

---

## 🛍️ 1. Shopify Storefront API
- **Domain Directory**: `lib/integrations/shopify/`
- **Purpose**: Authoritative host for product definitions, collection data, and shopping cart logic.
- **Protocols**: GraphQL queries and mutations executed over HTTPS.
- **Cache Strategy**: Dynamic requests routed through Vercel edge caching layers; catalog queries cached with standard 5-minute CDN TTLs.
- **Mock Layer**: Active when variables are missing, utilizing client-side mock assets in `lib/integrations/shopify/mocks.ts`.

---

## 🎨 2. Sanity CMS (Studio v3)
- **Domain Directory**: `lib/cms/` (schemas in root `sanity/`)
- **Purpose**: Houses editorial articles, chapter manifestos, lookbooks, site-wide configurations, and physical specimins descriptions.
- **Protocols**: GROQ (Graph-Relational Object Queries) executed via the `next-sanity` client.
- **Revalidation**: On-demand Incremental Static Regeneration (ISR) triggered by Webhook triggers on the `/api/webhooks/revalidate` route.

---

## 💳 3. Razorpay Payments
- **Domain Directory**: `lib/payments/`
- **Purpose**: Secure client payment processing and signature verification.
- **Gateway Checkout**: Custom implementation bypassing standard storefront carts. Custom UI triggers a signature payload request.
- **Validation**: Strict server-side HMAC signature verification checks prior to dispatching order confirmation signals.

---

## 🚚 4. Shiprocket Logistics
- **Domain Directory**: `lib/integrations/shiprocket/`
- **Purpose**: Logistics carrier tracking, AWB generation, and return order booking.
- **Protocols**: JSON REST API endpoints. Shiprocket credentials generate temporary tokens cached inside Node memory for 9-day spans.

---

## 📧 5. Klaviyo CRM
- **Domain Directory**: `lib/integrations/klaviyo/`
- **Purpose**: Newsletter registry, priority waitlist drops notifications, and customer lifecycle emails.
- **Protocols**: REST API list-subscription endpoints using private keys.
