@echo off
setlocal enabledelayedexpansion
echo ==========================================================
echo  House of Otaru - 50-Commit Granular Push Pipeline
echo ==========================================================

:: 1. Architectural Manifesto & Configuration
git add AGENTS.md
git diff --cached --quiet || git commit -m "chore(manifesto): align AGENTS.md with house of otaru editorial standard"

git add sanity.config.ts
git diff --cached --quiet || git commit -m "fix(sanity): refine schema configuration and studio dataset bindings"

git add tsconfig.json
git diff --cached --quiet || git commit -m "chore(types): update tsconfig inclusions for app router and signature files"

git add next.config.mjs
git diff --cached --quiet || git commit -m "chore(next): configure root rewrite to preview.html and set X-Frame-Options to SAMEORIGIN"

:: 2. Brand & Legal Commitments Sanitization
git add src/app/shipping-exchanges/page.tsx
git diff --cached --quiet || git commit -m "feat(legal): sanitize dispatch timeline in shipping and exchanges documentation"

git add src/app/returns/page.tsx
git diff --cached --quiet || git commit -m "feat(legal): restructure return policy around fit assistance and atelier care"

git add src/app/terms/page.tsx
git diff --cached --quiet || git commit -m "feat(terms): remove unconfirmed corporate jurisdiction from terms of service"

git add src/app/privacy/page.tsx
git diff --cached --quiet || git commit -m "feat(privacy): sanitize DPO claims and clarify customer contact channels"

git add src/app/membership/page.tsx
git diff --cached --quiet || git commit -m "refactor(membership): align archival registration with verified atelier services"

git add src/app/checkout/success/page.tsx
git diff --cached --quiet || git commit -m "fix(checkout): sanitize success screen repair copy to care consultation"

git add content/drop01.ts
git diff --cached --quiet || git commit -m "feat(content): update drop 01 batch dispatch notes to atelier inspection SLA"

git add src/components/product/ProductDetailView.tsx
git diff --cached --quiet || git commit -m "refactor(product): synchronize PDP craftsmanship inspection with realistic SLA"

:: 3. Cart & Navigation Refinement
git add src/components/cart/CartCheckoutSection.tsx
git diff --cached --quiet || git commit -m "refactor(cart): remove unverified courier transit indicators from cart checkout"

git add src/components/cart/CartDrawer.tsx
git diff --cached --quiet || git commit -m "fix(cart): reconcile return window copy across drawer and cart ledger"

git add src/components/home/MembershipTeaser.tsx
git diff --cached --quiet || git commit -m "refactor(home): update membership teaser to archival consultation language"

git add src/components/layout/SiteFooter.tsx
git diff --cached --quiet || git commit -m "refactor(footer): rename lifetime repairs to care and repairs in site footer"

git add src/components/layout/SiteHeader.tsx
git diff --cached --quiet || git commit -m "fix(layout): resolve 768px-1024px tablet navigation collision in site header"

:: 4. Core Persistence & Schema Hardening
git add src/lib/db/prisma.ts
git diff --cached --quiet || git commit -m "feat(db): export isDatabaseConfigured helper in prisma client singleton"

git add src/lib/payments/schemas.ts
git diff --cached --quiet || git commit -m "feat(schemas): add internalOrderId to payment verify request validation schema"

git add src/lib/payments/ledger.ts
git diff --cached --quiet || git commit -m "fix(ledger): resolve order uuid before upserting payment in ledger dual-write"

git add src/lib/payments/reconciliation.ts
git diff --cached --quiet || git commit -m "feat(reconciliation): support both paid and confirmed order states in cross-audit"

git add src/lib/testing/env-matrix-checker.ts
git diff --cached --quiet || git commit -m "feat(env): expand production secret validation in environment matrix checker"

git add src/lib/payments/audit-trail.ts
git diff --cached --quiet || git commit -m "fix(audit): expand AuditEventType with reconciliation and mismatch event invariants"

git add src/app/admin/security/page.tsx
git diff --cached --quiet || git commit -m "feat(security): register audit badge variants for reconciliation and mismatch events"

git add src/lib/resilience/resilient-fallback-engine.ts
git diff --cached --quiet || git commit -m "refactor(resilience): prune unused circuit breaker import from fallback engine"

git add src/lib/domain/events/outbox-event-engine.ts
git diff --cached --quiet || git commit -m "refactor(outbox): prune unused domain event type import from outbox engine"

git add src/app/api/account/orders/route.ts
git diff --cached --quiet || git commit -m "fix(account): eliminate in-memory ledger fallback in production account orders"

:: 5. Order Creation & Authoritative Catalog Persistence
git add src/app/api/checkout/route.ts
git diff --cached --quiet || git commit -m "feat(checkout): enforce production database availability gate on order creation"

git add src/app/api/checkout/razorpay/order/route.ts
git diff --cached --quiet || git commit -m "feat(razorpay-order): add database readiness check to razorpay order route"

:: 6. Payment Verification & Orphan Payment Containment
git add src/app/api/checkout/razorpay/verify/route.ts
git diff --cached --quiet || git commit -m "feat(verify): enforce database configuration barrier in payment verify route"

git add src/app/api/webhooks/razorpay/route.ts
git diff --cached --quiet || git commit -m "feat(webhooks): enforce 503 retry status when database is unconfigured in prod"

:: 7. Verification Test Suites
git add src/__tests__/production-data-integrity.test.ts
git diff --cached --quiet || git commit -m "test(integrity): add regression suite for database gates and price authority"

git add src/__tests__/payment-recovery-adversarial.test.ts
git diff --cached --quiet || git commit -m "test(recovery): add adversarial tests for orphan payments and amount mismatches"

:: 8. Governance & Audit Reports
git add docs/OWNER_DECISIONS_REQUIRED.md
git diff --cached --quiet || git commit -m "docs(governance): record the 5 owner commercial policy decisions required"

git add docs/RELEASE_HARDENING_REPORT.md
git diff --cached --quiet || git commit -m "docs(audit): publish release hardening and business policy audit report"

git add docs/PRODUCTION_DATA_INTEGRITY_REPORT.md
git diff --cached --quiet || git commit -m "docs(audit): document production data integrity and payment lifecycle analysis"

git add docs/PAYMENT_RECOVERY_VERIFICATION.md
git diff --cached --quiet || git commit -m "docs(audit): publish payment recovery integrity and zero-fabrication verification report"

:: 9. Verbatim Living Image Archive UI Integration
copy /y preview.html public\preview.html >nul
copy /y preview.html public\index.html >nul

git add preview.html
git diff --cached --quiet || git commit -m "feat(preview): deploy verbatim house of otaru living image archive prototype"

git add public/preview.html
git diff --cached --quiet || git commit -m "feat(static): mirror standalone archive prototype to public preview asset"

git add public/index.html
git diff --cached --quiet || git commit -m "feat(static): install standalone archive prototype as public index"

git add signature.tsx
git diff --cached --quiet || git commit -m "feat(signature): declare verbatim html archive source constant and root component"

git add src/components/home/SignatureUI.tsx
git diff --cached --quiet || git commit -m "feat(components): implement isolated signature ui iframe wrapper for native script execution"

git add src/components/layout/SiteChrome.tsx
git diff --cached --quiet || git commit -m "feat(layout): introduce site chrome layout controller to avoid duplicate chrome"

git add src/app/layout.tsx
git diff --cached --quiet || git commit -m "refactor(layout): integrate site chrome controller into root layout"

git add src/app/page.tsx
git diff --cached --quiet || git commit -m "feat(home): mount signature living archive on next.js homepage entry point"

git add page.tsx
git diff --cached --quiet || git commit -m "refactor(root): align root page re-export with signature living archive"

git add sections.tsx
git diff --cached --quiet || git commit -m "refactor(root): align root sections re-export with signature living archive"

:: 10. Production Security Hardening & CI Release Gates (OT-001 through OT-016)
git add .env\ copy.example next.config\ copy.mjs vercel\ copy.json
git diff --cached --quiet || git commit -m "security(credentials): sanitize and neutralize duplicate copy configuration files"

git add next.config.mjs
git diff --cached --quiet || git commit -m "refactor(router): remove root preview rewrite and configure single canonical homepage"

git add src/lib/security/csrf.ts src/middleware.ts
git diff --cached --quiet || git commit -m "security(headers): enforce strict canonical origin CSRF and harmonize X-Frame-Options to SAMEORIGIN"

git add src/app/api/ready/route.ts
git diff --cached --quiet || git commit -m "security(readiness): sanitize public readiness probe to protect internal infrastructure details"

git add src/app/api/residents/route.ts src/lib/env.ts
git diff --cached --quiet || git commit -m "feat(reliability): enforce fail-closed invariants and eliminate fake sequences"

git add .github/workflows/ci.yml
git diff --cached --quiet || git commit -m "ci(github): add automated typecheck, lint, test and build gate workflow"

git add scripts/push-granular-commits.ps1 scripts/push-all-50-commits.ps1 scripts/push.bat
git diff --cached --quiet || git commit -m "chore(pipeline): update granular commit and push pipeline scripts"

git add -A
git diff --cached --quiet || git commit -m "chore(release): complete release hardening and tree synchronization"

echo ==========================================================
echo  Pushing all 50+ commits to origin/main...
echo ==========================================================
git push origin main

echo ==========================================================
echo  All commits successfully pushed to origin/main.
echo ==========================================================
pause
