# House of Otaru — 65-Commit Granular Staging & Push Script (PowerShell)
# Run in D:\otaru: .\scripts\push-granular-commits.ps1

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " House of Otaru — Granular 65-Commit Automated Pipeline" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

function Commit-Step($files, $msg) {
    Write-Host "Committing: $msg" -ForegroundColor Yellow
    git add $files
    git commit -m "$msg"
}

# 1. Architectural Manifesto & Preview Foundations
Commit-Step "AGENTS.md" "chore(manifesto): align AGENTS.md with house of otaru editorial standard"
Commit-Step "preview.html" "fix(preview): optimize tablet responsive header breakpoints in standalone preview"
Commit-Step "sanity.config.ts" "fix(sanity): refine schema configuration and studio dataset bindings"

# 2. Brand & Legal Commitments Sanitization
Commit-Step "src/app/shipping-exchanges/page.tsx" "feat(legal): sanitize dispatch timeline in shipping and exchanges documentation"
Commit-Step "src/app/returns/page.tsx" "feat(legal): restructure return policy around fit assistance and atelier care"
Commit-Step "src/app/terms/page.tsx" "feat(terms): remove unconfirmed corporate jurisdiction from terms of service"
Commit-Step "src/app/privacy/page.tsx" "feat(privacy): sanitize DPO claims and clarify customer contact channels"
Commit-Step "src/app/membership/page.tsx" "refactor(membership): align archival registration with verified atelier services"
Commit-Step "src/app/checkout/success/page.tsx" "fix(checkout): sanitize success screen repair copy to care consultation"
Commit-Step "content/drop01.ts" "feat(content): update drop 01 batch dispatch notes to atelier inspection SLA"
Commit-Step "src/components/product/ProductDetailView.tsx" "refactor(product): synchronize PDP craftsmanship inspection with realistic SLA"

# 3. Cart & Layout Refinement
Commit-Step "src/components/cart/CartCheckoutSection.tsx" "refactor(cart): remove unverified courier transit indicators from cart checkout"
Commit-Step "src/components/cart/CartDrawer.tsx" "fix(cart): reconcile return window copy across drawer and cart ledger"
Commit-Step "src/components/home/MembershipTeaser.tsx" "refactor(home): update membership teaser to archival consultation language"
Commit-Step "src/components/layout/SiteFooter.tsx" "refactor(footer): rename lifetime repairs to care and repairs in site footer"
Commit-Step "src/components/layout/SiteHeader.tsx" "fix(layout): resolve 768px-1024px tablet navigation collision in site header"

# 4. Core Persistence & Schema Hardening
Commit-Step "src/lib/db/prisma.ts" "feat(db): export isDatabaseConfigured helper in prisma client singleton"
Commit-Step "src/lib/payments/schemas.ts" "feat(schemas): add internalOrderId to payment verify request validation schema"
Commit-Step "src/lib/payments/ledger.ts" "fix(ledger): resolve order uuid before upserting payment in ledger dual-write"
Commit-Step "src/lib/payments/reconciliation.ts" "feat(reconciliation): support both paid and confirmed order states in cross-audit"
Commit-Step "src/lib/testing/env-matrix-checker.ts" "feat(env): expand production secret validation in environment matrix checker"
Commit-Step "src/app/api/account/orders/route.ts" "fix(account): eliminate in-memory ledger fallback in production account orders"

# 5. Order Creation & Authoritative Catalog Persistence
Commit-Step "src/app/api/checkout/route.ts" "feat(checkout): enforce production database availability gate on order creation"
Commit-Step "src/app/api/checkout/razorpay/order/route.ts" "feat(razorpay-order): add database readiness check to razorpay order route"

# 6. Payment Verification & Orphan Payment Containment
Commit-Step "src/app/api/checkout/razorpay/verify/route.ts" "feat(verify): enforce database configuration barrier in payment verify route"
Commit-Step "src/app/api/webhooks/razorpay/route.ts" "feat(webhooks): enforce 503 retry status when database is unconfigured in prod"

# 7. Verification Test Suites
Commit-Step "src/__tests__/production-data-integrity.test.ts" "test(integrity): add regression suite for database gates and price authority"
Commit-Step "src/__tests__/payment-recovery-adversarial.test.ts" "test(recovery): add adversarial tests for orphan payments and amount mismatches"

# 8. Governance & Audit Reports
Commit-Step "docs/OWNER_DECISIONS_REQUIRED.md" "docs(governance): record the 5 owner commercial policy decisions required"
Commit-Step "docs/RELEASE_HARDENING_REPORT.md" "docs(audit): publish release hardening and business policy audit report"
Commit-Step "docs/PRODUCTION_DATA_INTEGRITY_REPORT.md" "docs(audit): document production data integrity and payment lifecycle analysis"
Commit-Step "docs/PAYMENT_RECOVERY_VERIFICATION.md" "docs(audit): publish payment recovery integrity and zero-fabrication verification report"

# 9. Clean up any remaining files and push
git status --short
Write-Host "==========================================================" -ForegroundColor Green
Write-Host " Staged and committed successfully. To push to GitHub:" -ForegroundColor Green
Write-Host "   git push origin main" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
