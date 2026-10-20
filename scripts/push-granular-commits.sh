#!/usr/bin/env bash
# House of Otaru — Granular Staging & Push Script (Bash / Git Bash)
# Run in D:\otaru: bash scripts/push-granular-commits.sh

set -e

echo "=========================================================="
echo " House of Otaru — Granular Staging Pipeline"
echo "=========================================================="

commit_step() {
    local files="$1"
    local msg="$2"
    echo "Committing: $msg"
    git add $files
    git commit -m "$msg" || true
}

# 1. Architectural Manifesto & Preview Foundations
commit_step "AGENTS.md" "chore(manifesto): align AGENTS.md with house of otaru editorial standard"
commit_step "preview.html" "fix(preview): optimize tablet responsive header breakpoints in standalone preview"
commit_step "sanity.config.ts" "fix(sanity): refine schema configuration and studio dataset bindings"

# 2. Brand & Legal Commitments Sanitization
commit_step "src/app/shipping-exchanges/page.tsx" "feat(legal): sanitize dispatch timeline in shipping and exchanges documentation"
commit_step "src/app/returns/page.tsx" "feat(legal): restructure return policy around fit assistance and atelier care"
commit_step "src/app/terms/page.tsx" "feat(terms): remove unconfirmed corporate jurisdiction from terms of service"
commit_step "src/app/privacy/page.tsx" "feat(privacy): sanitize DPO claims and clarify customer contact channels"
commit_step "src/app/membership/page.tsx" "refactor(membership): align archival registration with verified atelier services"
commit_step "src/app/checkout/success/page.tsx" "fix(checkout): sanitize success screen repair copy to care consultation"
commit_step "content/drop01.ts" "feat(content): update drop 01 batch dispatch notes to atelier inspection SLA"
commit_step "src/components/product/ProductDetailView.tsx" "refactor(product): synchronize PDP craftsmanship inspection with realistic SLA"

# 3. Cart & Layout Refinement
commit_step "src/components/cart/CartCheckoutSection.tsx" "refactor(cart): remove unverified courier transit indicators from cart checkout"
commit_step "src/components/cart/CartDrawer.tsx" "fix(cart): reconcile return window copy across drawer and cart ledger"
commit_step "src/components/home/MembershipTeaser.tsx" "refactor(home): update membership teaser to archival consultation language"
commit_step "src/components/layout/SiteFooter.tsx" "refactor(footer): rename lifetime repairs to care and repairs in site footer"
commit_step "src/components/layout/SiteHeader.tsx" "fix(layout): resolve 768px-1024px tablet navigation collision in site header"

# 4. Core Persistence & Schema Hardening
commit_step "src/lib/db/prisma.ts" "feat(db): export isDatabaseConfigured helper in prisma client singleton"
commit_step "src/lib/payments/schemas.ts" "feat(schemas): add internalOrderId to payment verify request validation schema"
commit_step "src/lib/payments/ledger.ts" "fix(ledger): resolve order uuid before upserting payment in ledger dual-write"
commit_step "src/lib/payments/reconciliation.ts" "feat(reconciliation): support both paid and confirmed order states in cross-audit"
commit_step "src/lib/testing/env-matrix-checker.ts" "feat(env): expand production secret validation in environment matrix checker"
commit_step "src/app/api/account/orders/route.ts" "fix(account): eliminate in-memory ledger fallback in production account orders"

# 5. Order Creation & Authoritative Catalog Persistence
commit_step "src/app/api/checkout/route.ts" "feat(checkout): enforce production database availability gate on order creation"
commit_step "src/app/api/checkout/razorpay/order/route.ts" "feat(razorpay-order): add database readiness check to razorpay order route"

# 6. Payment Verification & Orphan Payment Containment
commit_step "src/app/api/checkout/razorpay/verify/route.ts" "feat(verify): enforce database configuration barrier in payment verify route"
commit_step "src/app/api/webhooks/razorpay/route.ts" "feat(webhooks): enforce 503 retry status when database is unconfigured in prod"

# 7. Verification Test Suites
commit_step "src/__tests__/production-data-integrity.test.ts" "test(integrity): add regression suite for database gates and price authority"
commit_step "src/__tests__/payment-recovery-adversarial.test.ts" "test(recovery): add adversarial tests for orphan payments and amount mismatches"

# 8. Governance & Audit Reports
commit_step "docs/OWNER_DECISIONS_REQUIRED.md" "docs(governance): record the 5 owner commercial policy decisions required"
commit_step "docs/RELEASE_HARDENING_REPORT.md" "docs(audit): publish release hardening and business policy audit report"
commit_step "docs/PRODUCTION_DATA_INTEGRITY_REPORT.md" "docs(audit): document production data integrity and payment lifecycle analysis"
commit_step "docs/PAYMENT_RECOVERY_VERIFICATION.md" "docs(audit): publish payment recovery integrity and zero-fabrication verification report"

git status --short
echo "=========================================================="
echo " All granular commits staged. To push to GitHub:"
echo "   git push origin main"
echo "=========================================================="
