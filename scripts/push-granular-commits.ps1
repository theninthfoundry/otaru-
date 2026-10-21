# House of Otaru — 50-Commit Granular Staging & Push Pipeline (PowerShell)
# Run in D:\otaru: .\scripts\push-granular-commits.ps1

Write-Host '==========================================================' -ForegroundColor Cyan
Write-Host ' House of Otaru — 50-Commit Granular Push Pipeline' -ForegroundColor Cyan
Write-Host '==========================================================' -ForegroundColor Cyan

function CommitStep([string]$files, [string]$msg) {
    git add $files
    $staged = git diff --cached --name-only
    if ($staged) {
        Write-Host "Committing: $msg" -ForegroundColor Yellow
        git commit -m $msg
    } else {
        Write-Host "Already committed: $files" -ForegroundColor DarkGray
    }
}

# 1. Architectural Manifesto & Configuration
CommitStep 'AGENTS.md' 'chore(manifesto): align AGENTS.md with house of otaru editorial standard'
CommitStep 'sanity.config.ts' 'fix(sanity): refine schema configuration and studio dataset bindings'
CommitStep 'tsconfig.json' 'chore(types): update tsconfig inclusions for app router and signature files'
CommitStep 'next.config.mjs' 'chore(next): configure root rewrite to preview.html and set X-Frame-Options to SAMEORIGIN'

# 2. Brand & Legal Commitments Sanitization
CommitStep 'src/app/shipping-exchanges/page.tsx' 'feat(legal): sanitize dispatch timeline in shipping and exchanges documentation'
CommitStep 'src/app/returns/page.tsx' 'feat(legal): restructure return policy around fit assistance and atelier care'
CommitStep 'src/app/terms/page.tsx' 'feat(terms): remove unconfirmed corporate jurisdiction from terms of service'
CommitStep 'src/app/privacy/page.tsx' 'feat(privacy): sanitize DPO claims and clarify customer contact channels'
CommitStep 'src/app/membership/page.tsx' 'refactor(membership): align archival registration with verified atelier services'
CommitStep 'src/app/checkout/success/page.tsx' 'fix(checkout): sanitize success screen repair copy to care consultation'
CommitStep 'content/drop01.ts' 'feat(content): update drop 01 batch dispatch notes to atelier inspection SLA'
CommitStep 'src/components/product/ProductDetailView.tsx' 'refactor(product): synchronize PDP craftsmanship inspection with realistic SLA'

# 3. Cart & Navigation Refinement
CommitStep 'src/components/cart/CartCheckoutSection.tsx' 'refactor(cart): remove unverified courier transit indicators from cart checkout'
CommitStep 'src/components/cart/CartDrawer.tsx' 'fix(cart): reconcile return window copy across drawer and cart ledger'
CommitStep 'src/components/home/MembershipTeaser.tsx' 'refactor(home): update membership teaser to archival consultation language'
CommitStep 'src/components/layout/SiteFooter.tsx' 'refactor(footer): rename lifetime repairs to care and repairs in site footer'
CommitStep 'src/components/layout/SiteHeader.tsx' 'fix(layout): resolve 768px-1024px tablet navigation collision in site header'

# 4. Core Persistence & Schema Hardening
CommitStep 'src/lib/db/prisma.ts' 'feat(db): export isDatabaseConfigured helper in prisma client singleton'
CommitStep 'src/lib/payments/schemas.ts' 'feat(schemas): add internalOrderId to payment verify request validation schema'
CommitStep 'src/lib/payments/ledger.ts' 'fix(ledger): resolve order uuid before upserting payment in ledger dual-write'
CommitStep 'src/lib/payments/reconciliation.ts' 'feat(reconciliation): support both paid and confirmed order states in cross-audit'
CommitStep 'src/lib/testing/env-matrix-checker.ts' 'feat(env): expand production secret validation in environment matrix checker'
CommitStep 'src/lib/payments/audit-trail.ts' 'fix(audit): expand AuditEventType with reconciliation and mismatch event invariants'
CommitStep 'src/app/admin/security/page.tsx' 'feat(security): register audit badge variants for reconciliation and mismatch events'
CommitStep 'src/lib/resilience/resilient-fallback-engine.ts' 'refactor(resilience): prune unused circuit breaker import from fallback engine'
CommitStep 'src/lib/domain/events/outbox-event-engine.ts' 'refactor(outbox): prune unused domain event type import from outbox engine'
CommitStep 'src/app/api/account/orders/route.ts' 'fix(account): eliminate in-memory ledger fallback in production account orders'

# 5. Order Creation & Authoritative Catalog Persistence
CommitStep 'src/app/api/checkout/route.ts' 'feat(checkout): enforce production database availability gate on order creation'
CommitStep 'src/app/api/checkout/razorpay/order/route.ts' 'feat(razorpay-order): add database readiness check to razorpay order route'

# 6. Payment Verification & Orphan Payment Containment
CommitStep 'src/app/api/checkout/razorpay/verify/route.ts' 'feat(verify): enforce database configuration barrier in payment verify route'
CommitStep 'src/app/api/webhooks/razorpay/route.ts' 'feat(webhooks): enforce 503 retry status when database is unconfigured in prod'

# 7. Verification Test Suites
CommitStep 'src/__tests__/production-data-integrity.test.ts' 'test(integrity): add regression suite for database gates and price authority'
CommitStep 'src/__tests__/payment-recovery-adversarial.test.ts' 'test(recovery): add adversarial tests for orphan payments and amount mismatches'

# 8. Governance & Audit Reports
CommitStep 'docs/OWNER_DECISIONS_REQUIRED.md' 'docs(governance): record the 5 owner commercial policy decisions required'
CommitStep 'docs/RELEASE_HARDENING_REPORT.md' 'docs(audit): publish release hardening and business policy audit report'
CommitStep 'docs/PRODUCTION_DATA_INTEGRITY_REPORT.md' 'docs(audit): document production data integrity and payment lifecycle analysis'
CommitStep 'docs/PAYMENT_RECOVERY_VERIFICATION.md' 'docs(audit): publish payment recovery integrity and zero-fabrication verification report'

# 9. Verbatim Living Image Archive UI Integration
Copy-Item -Path 'preview.html' -Destination 'public/preview.html' -Force
Copy-Item -Path 'preview.html' -Destination 'public/index.html' -Force
CommitStep 'preview.html' 'feat(preview): deploy verbatim house of otaru living image archive prototype'
CommitStep 'public/preview.html' 'feat(static): mirror standalone archive prototype to public preview asset'
CommitStep 'public/index.html' 'feat(static): install standalone archive prototype as public index'
CommitStep 'signature.tsx' 'feat(signature): declare verbatim html archive source constant and root component'
CommitStep 'src/components/home/SignatureUI.tsx' 'feat(components): implement isolated signature ui iframe wrapper for native script execution'
CommitStep 'src/components/layout/SiteChrome.tsx' 'feat(layout): introduce site chrome layout controller to avoid duplicate chrome'
CommitStep 'src/app/layout.tsx' 'refactor(layout): integrate site chrome controller into root layout'
CommitStep 'src/app/page.tsx' 'feat(home): mount signature living archive on next.js homepage entry point'
CommitStep 'page.tsx' 'refactor(root): align root page re-export with signature living archive'
CommitStep 'sections.tsx' 'refactor(root): align root sections re-export with signature living archive'

# 10. Production Security Hardening & CI Release Gates (OT-001 through OT-016)
CommitStep '.env copy.example next.config copy.mjs vercel copy.json' 'security(credentials): sanitize and neutralize duplicate copy configuration files'
CommitStep 'next.config.mjs' 'refactor(router): remove root preview rewrite and configure single canonical homepage'
CommitStep 'src/lib/security/csrf.ts src/middleware.ts' 'security(headers): enforce strict canonical origin CSRF and harmonize X-Frame-Options to SAMEORIGIN'
CommitStep 'src/app/api/ready/route.ts' 'security(readiness): sanitize public readiness probe to protect internal infrastructure details'
CommitStep 'src/app/api/residents/route.ts src/lib/env.ts' 'feat(reliability): enforce fail-closed invariants and eliminate fake sequences'
CommitStep '.github/workflows/ci.yml' 'ci(github): add automated typecheck, lint, test and build gate workflow'

# 11. Resilience, Async Ledger, Outbox Processing & Studio Hardening
CommitStep 'src/app/admin/studio/[[...tool]]/page.tsx' 'fix(studio): provide graceful configuration fallback when sanity project id is unset'
CommitStep 'src/lib/payments/ledger.ts' 'feat(ledger): introduce updateTransactionStatusAsync for resilient serverless settlement'
CommitStep 'src/app/api/admin/reconcile/route.ts' 'fix(reconcile): record authentic reconciliation audit events without placeholder creation'
CommitStep 'src/app/api/admin/outbox/process/route.ts vercel.json' 'feat(outbox): add authenticated outbox processing worker route and cron job'
CommitStep 'src/components/product/ProductDetailView.tsx' 'fix(pdp): wire delivery estimator to serviceability api with 6-digit pin validation'
CommitStep 'content/drop01.ts' 'feat(content): synchronize drop 01 live availability to autumn 2026'

# 12. Final Working Tree Consolidation
CommitStep 'scripts/push-granular-commits.ps1' 'chore(pipeline): update granular commit and push pipeline scripts'
CommitStep 'scripts/push-all-50-commits.ps1' 'chore(pipeline): update complete granular commit scripts'
CommitStep 'scripts/push.bat' 'chore(pipeline): provide one-click runner for commit pipeline'

git add -A
$remaining = git diff --cached --name-only
if ($remaining) {
    Write-Host 'Committing remaining working tree files...' -ForegroundColor Yellow
    git commit -m 'chore(release): complete release hardening and tree synchronization'
}

# 11. Push to GitHub
Write-Host '==========================================================' -ForegroundColor Cyan
Write-Host ' Pushing all commits to origin/main...' -ForegroundColor Cyan
Write-Host '==========================================================' -ForegroundColor Cyan

git push origin main

Write-Host '==========================================================' -ForegroundColor Green
Write-Host ' All commits successfully pushed to origin/main.' -ForegroundColor Green
Write-Host '==========================================================' -ForegroundColor Green
