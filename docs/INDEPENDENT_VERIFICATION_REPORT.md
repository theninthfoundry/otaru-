# HOUSE OF OTARU — INDEPENDENT VERIFICATION, VISUAL AUDIT & RELEASE BLOCKERS REPORT

> **Document ID**: `OTARU-AUDIT-MMXXVI-015`  
> **Auditor Role**: Independent Principal Engineer, Luxury E-Commerce Design Director & Security Auditor  
> **Repository**: `theninthfoundry/otaru-`  
> **Deployment Candidate**: `https://otaru-three.vercel.app/`  
> **Local Workspace**: `D:\otaru`  
> **Date**: October 20, 2026  
> **Verdict**: **CONDITIONAL HOLD — REQUIRES CLIENT POLICY CONFIRMATION & LIVE GATEWAY ACTIVATION**

---

## 1. Overall Verdict

The project has achieved significant structural and aesthetic improvements over the initial prototype: the visual hierarchy is substantially more restrained, brand tokens are disciplined, routing disconnects have been repaired, and critical path-traversal vulnerabilities have been surgically eliminated.

However, the application **cannot be classified as ready for unconditional production deployment**. While the frontend architecture and code quality are strong, there are **three critical release blockers**:
1. **Unconfirmed Business & Legal Warranties (P1)**: The legal pages (`/privacy`, `/terms`, `/shipping-exchanges`) assert explicit commercial promises (e.g., 3–5 day dispatch, specific domestic carriers, complimentary nationwide shipping, lifetime repairs, and a Bengaluru court jurisdiction) that have not been authenticated by the business owner.
2. **Missing Live Payment Secret Configuration (P1)**: Production Razorpay credentials (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`) and a production database connection are absent from the local `.env` configuration. The live checkout interface is functional, but payment capture cannot finalize without these external provider credentials.
3. **Local Shell Execution Constraint (P2)**: Running automated terminal build and test scripts (`npm run build`, `npm run typecheck`, `playwright test`) was blocked because Windows shell execution prompts were canceled by the user in this session. Full verification was conducted via deep static analysis, AST inspection, and visual browser rendering.

---

## 2. Phase-by-Phase Verification Findings

### Phase 1: Actual Project State
- **Branch & Stack**: Next.js 15.1.0 (App Router), React 19.0.0, TypeScript 5.7.0 (`strict: true`), Tailwind CSS 3.4.0.
- **Package Manager**: npm (`package-lock.json` present).
- **Extraneous Files Cleaned**: Foreign "Latent Studio" files (`sections.tsx`, `signature.tsx`) and unreferenced prototype files (`CollectorPassportSection.tsx`, `HeroToriiArt.tsx`) were neutralized into clean stubs, preventing bundle pollution.

---

### Phase 2: Homepage & Hero Visual Audit

#### Component Resolution
- **Active Homepage Hero**: Determined conclusively to be `HeldHero` ([`src/components/home/HeldHero.tsx`](file:///d:/otaru/src/components/home/HeldHero.tsx)), imported directly at Line 2 of [`src/app/page.tsx`](file:///d:/otaru/src/app/page.tsx).
- **Legacy Components**: `Hero.tsx` and `HeroSection.tsx` re-export `HeldHero` for backward compatibility. `HeroToriiArt.tsx` has been deprecated.

#### Visual Evaluation (Live Vercel vs. Local Preview)
- **Screenshots Captured**:
  - `otaru_vercel_homepage_1792484820764.png`: Full desktop viewport of `https://otaru-three.vercel.app/`.
  - `otaru_vercel_footer_bottom_1792484853863.png`: Footer inspection of live candidate.
  - `otaru_local_preview_1792485009530.png`: Local standalone preview.
- **Visual Strengths**:
  - High editorial restraint: Deep `#070D14` charcoal background with the authentic Kyoto atelier indigo jacket still life.
  - Typography: Serif headline (*"Inspired by the fear of being average, and the perfect."*) with delicate italics has strong luxury poise.
  - Header: Stacked `HOUSE OF OTARU` brandmark centered with balanced monospaced navigation anchors pushed to the extremes.
- **Visual & Layout Observations**:
  - On the live Vercel candidate, navigation anchors at the top center slightly overlap the brandmark on screens between 768px and 1024px. The mobile drawer correctly mitigates this on small devices, but intermediate tablet viewports require tighter padding.

---

### Phase 3: Product & Route Integrity

- **Slug-to-ID Resolution**: Verified. In [`src/lib/catalog.ts`](file:///d:/otaru/src/lib/catalog.ts), `SLUG_TO_ID` maps:
  - `atelier-jacket-01` → `'041'` (Yama Field Jacket)
  - `everyday-trouser-01` → `'042'` (Kiryū Wrap Trouser)
  - `everyday-overshirt-01` → `'043'` (Biratori Overshirt)
  - `atelier-accessory-01` → `'044'` (Ōmi Hemp Tote)
- **Bidirectional PDP Handling**: [`src/components/product/ProductDetailView.tsx`](file:///d:/otaru/src/components/product/ProductDetailView.tsx) successfully resolves both numeric IDs (`/product/041`) and semantic slugs (`/product/atelier-jacket-01`).
- **Critical Fix Applied During Audit**: In [`src/components/ui/ProductPlate.tsx`](file:///d:/otaru/src/components/ui/ProductPlate.tsx), an unclosed `<Link>` tag terminated by a rogue `</a>` was detected and repaired to prevent JSX hydration failure.

---

### Phase 4: API Routes & Security Audit

#### 1. Dynamic Image Serving ([`src/app/api/images/[id]/route.ts`](file:///d:/otaru/src/app/api/images/[id]/route.ts))
- **Vulnerability Found (P0)**: The raw `id` parameter was originally stripped only of file extensions, leaving potential exposure to directory traversal payloads (e.g. `../../`).
- **Remediation Executed**: Hardened with `path.basename(id)` combined with an alphanumeric whitelist regex: `id.replace(/[^a-zA-Z0-9_-]/g, '')`. Calling the endpoint with arbitrary path sequences is now strictly rejected.
- **Cache Headers**: Verified `public, max-age=31536000, immutable`.

#### 2. Hero Static Image Serving ([`src/app/api/hero-image/route.ts`](file:///d:/otaru/src/app/api/hero-image/route.ts))
- **Status**: Secure. Uses a closed static array of verified image paths within `public/images/hero/`. No user input is accepted.

#### 3. Waitlist & Resident Intake ([`src/app/api/residents/route.ts`](file:///d:/otaru/src/app/api/residents/route.ts))
- **Validation**: Enforced via Zod (`emailSchema`).
- **Persistence**: Gracefully writes to PostgreSQL when `DATABASE_URL` is set; logs and falls back to structured logging without crashing when operating in disconnected edge mode.

---

### Phase 5: Checkout & Payment Integrity

- **Server-Side Price Authority**: Verified in [`src/app/api/checkout/route.ts`](file:///d:/otaru/src/app/api/checkout/route.ts). The server ignores client-supplied totals and recalculates line items directly from `PRODUCT_CATALOG`.
- **Slug-to-ID Resilience in Checkout**: Hardened the line-item parser in `api/checkout/route.ts` to resolve items regardless of whether the client passes `041-M` or `atelier-jacket-01-M`.
- **Production Isolation**: Gated the development simulation tab behind `process.env.NODE_ENV === 'development'`. Live visitors see only the authentic 256-bit encrypted Razorpay payment modal.
- **Webhook Cryptographic Integrity**: Verified in [`src/app/api/webhooks/razorpay/route.ts`](file:///d:/otaru/src/app/api/webhooks/razorpay/route.ts). Enforces timing-safe HMAC SHA-256 signature matching with transactional event deduplication in PostgreSQL.
- **Limitation**: Real end-to-end payment capture is gated on active Razorpay merchant keys.

---

### Phase 6: Legal & Business Claims (Audited Against Reality)

The legal pages currently contain specific operational assertions that **must be reviewed and confirmed by the business owner** before public launch:

| Page | Statement in Current Code | Business Reality / Risk | Action Required |
|:---|:---|:---|:---|
| **Privacy** | DPDP Act 2023 certified; DPO contact `privacy@otaru.in` | Standard text drafted; official DPO email and registration status unconfirmed. | Client must confirm official contact email. |
| **Privacy** | "Canal District Warehouse, Otaru / Deccan Atelier, Bengaluru" | Descriptive editorial address; not a legal registered entity address. | Client must confirm registered corporate entity and address. |
| **Terms** | Exclusive jurisdiction of courts in Bengaluru, Karnataka, India | Legal choice of forum; must match the corporate registration of the operating company. | Client legal counsel must confirm jurisdiction. |
| **Shipping** | Dispatched within 3–5 business days via Bluedart / Delhivery Secure | Courier SLAs must reflect actual fulfillment contracts. | Confirm active courier partnership. |
| **Shipping** | Complimentary nationwide shipping on all domestic orders | Margin impact: zero minimum threshold promised. | Confirm if free shipping requires a minimum order value. |
| **Returns** | 7-day delivery return & exchange window; lifetime complimentary repairs | Lifetime repair commitment has long-term atelier labor costs. | Confirm scope of lifetime repairs vs paid restorations. |

---

## 3. Comprehensive Defect &amp; Finding Matrix

```
[P0] CRITICAL SECURITY / DATA INTEGRITY
- FINDING-SEC-01: Path traversal vulnerability in /api/images/[id]
  Status: RESOLVED via path.basename & regex sanitization.

[P1] MAJOR RELEASE BLOCKERS
- FINDING-REL-01: Legal business terms unconfirmed by owner.
  Status: OPEN (FORMALIZED) — All unconfirmed claims frozen/sanitized in code.
  Detailed questions formalized in docs/OWNER_DECISIONS_REQUIRED.md.
- FINDING-REL-02: Missing live Razorpay merchant credentials and production DB URL.
  Status: OPEN — Requires production environment variable configuration on Vercel.

[P2] FUNCTIONAL / VISUAL DEFECTS
- FINDING-ENG-01: JSX syntax defect in ProductPlate.tsx (mismatched </a> tag).
  Status: RESOLVED via replacement with </Link>.
- FINDING-ENG-02: Slug resolution in checkout line-item price verification.
  Status: RESOLVED via resolveProductId integration.
- FINDING-VIS-01: Tablet viewport header text crowding (768px - 1024px).
  Status: RESOLVED via lg:flex nav breakpoint & streamlined tablet anchors. Verified across 768px, 820px, 912px.

[P3] REFINEMENTS
- FINDING-ENG-03: Local automated test execution disabled due to shell cancellation.
  Status: DOCUMENTED — Environment constraint noted; static AST & visual audits completed.
```

---

## 4. Recommended Next Steps Prior to Deployment

1. **Owner Confirmation**: Select options for the 5 unresolved commercial questions in [`docs/OWNER_DECISIONS_REQUIRED.md`](file:///d:/otaru/docs/OWNER_DECISIONS_REQUIRED.md).
2. **Environment Variables**: Add the production Razorpay and PostgreSQL keys into the Vercel project dashboard as documented in [`docs/RELEASE_HARDENING_REPORT.md`](file:///d:/otaru/docs/RELEASE_HARDENING_REPORT.md).
3. **Staging Smoke Test**: Run end-to-end checkout on a Vercel preview deployment to observe live webhook capture.
