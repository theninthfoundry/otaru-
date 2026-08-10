# Deployment & Operations Guide — Otaru Platform

This guide describes production deployment, hosting pipelines, and environmental requirements.

---

## 🚀 Target Deployment: Vercel Edge

The Otaru Next.js application is designed for optimized edge execution to achieve the lowest layout delivery speeds globally.

### Required Environment Settings

The following variables must be configured in your Vercel project settings:

```bash
# Core
NEXT_PUBLIC_SITE_URL=https://otaru.in
PAYMENT_CART_SECRET=                  # 64-char hex string

# Shopify
SHOPIFY_STORE_DOMAIN=otaru.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=      # Storefront API Token
SHOPIFY_ADMIN_ACCESS_TOKEN=           # Admin API Token (Order Creation)

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Logistics & CRM
SHIPROCKET_EMAIL=
SHIPROCKET_PASSWORD=
KLAVIYO_PRIVATE_KEY=
```

---

## ⚡ Multi-Tier Caching Setup

1. **Client Browser Cache**: CSS assets and static specimins assets (`/public/*`) cached with permanent headers.
2. **Next.js Edge Page Cache**:
   - `/archive` and `/journal` pages cached at the CDN level.
   - Dynamic page routes (e.g. `/artifact/*`) revalidated on-demand using Sanity webhook triggers.
3. **API Cache (Phase 1)**: Redis instance sits in front of Shopify and Sanity APIs, caching recurring queries to avoid costly external lookups.
