#!/usr/bin/env bash
# House of Otaru — Complete 60-Commit Granular Pipeline (Bash)
# Run in D:\otaru: bash scripts/push-all-50-commits.sh

set -e

echo "=========================================================="
echo " House of Otaru — Complete Granular Commit Pipeline (60 Commits)"
echo "=========================================================="

commit_chunk() {
    local files="$1"
    local msg="$2"
    git add $files 2>/dev/null || true
    if ! git diff --cached --quiet; then
        echo "Committing: $msg"
        git commit -m "$msg"
    else
        echo "Skipping (no changes staged): $msg"
    fi
}

# --- GROUP A: TOOLING, CONFIGS & BUILD MANIFESTS ---
commit_chunk ".gitignore" "chore(git): configure repository ignore rules for build caches and copy artifacts"
commit_chunk "package.json package-lock.json" "chore(deps): configure root dependencies, package scripts and engine declarations"
commit_chunk "tsconfig.json next-env.d.ts" "chore(typescript): configure strict compiler flags, path aliases and module resolutions"
commit_chunk "next.config.mjs" "chore(next): configure next.js compiler optimizations and image remote patterns"
commit_chunk "tailwind.config.ts postcss.config.mjs" "chore(tailwind): establish luxury brand design tokens and typography extensions"
commit_chunk ".eslintrc.json .prettierrc .npmrc" "chore(lint): configure strict eslint and prettier code formatting invariants"
commit_chunk "vitest.config.ts playwright.config.ts" "chore(test): configure vitest runner and playwright end-to-end test framework"
commit_chunk "vercel.json .env.example" "chore(deployment): configure vercel production routing headers and security policies"

# --- GROUP B: ARCHITECTURAL DOCUMENTATION ---
commit_chunk "OTARU_MASTER_OPERATING_ARCHITECTURE.md" "docs(architecture): establish master luxury operating architecture manifesto"
commit_chunk "OTARU_PRODUCTION_CERTIFICATION.md" "docs(certification): publish production readiness certification and security audit"
commit_chunk "README.md APPLY.md" "docs(overview): document maison digital archive mission and technical stack"
commit_chunk "docs/INDEPENDENT_VERIFICATION_REPORT.md" "docs(archive): catalog remaining independent verification and validation notes"

# --- GROUP C: PRISMA SCHEMA & SEEDS ---
commit_chunk "prisma/schema.prisma" "feat(prisma): define comprehensive relational domain models for luxury commerce"
commit_chunk "prisma/seed.ts prisma/seed.js prisma/migrations" "feat(prisma): create database migrations and archival collection seed data"

# --- GROUP D: CMS, PUBLIC ASSETS & ROOT HELPERS ---
commit_chunk "sanity/" "feat(sanity): implement studio desk structures and archival garment schemas"
commit_chunk "public/images/ public/media/" "feat(assets): integrate high-resolution archival garment imagery and photography"
commit_chunk "public/fonts/" "feat(assets): integrate bespoke luxury typography and web font binaries"
commit_chunk "public/" "feat(assets): configure web app manifests, icons, favicons and robots assets"
commit_chunk "page.tsx sections.tsx signature.tsx" "refactor(root): declare root layout stubs and signature component helpers"

# --- GROUP E: DOMAIN CATALOG & CLIENT CONTEXTS ---
commit_chunk "src/lib/catalog.ts" "feat(catalog): build authoritative product catalog with material specifications"
commit_chunk "src/lib/cart.tsx" "feat(cart): implement reactive archival shopping cart context and storage"
commit_chunk "src/lib/currency.tsx" "feat(currency): implement dual inr and usd luxury currency conversion provider"
commit_chunk "src/lib/wishlist.tsx" "feat(wishlist): implement persistent patron archival curation and wishlist state"
commit_chunk "src/lib/concierge.tsx" "feat(concierge): create atelier live concierge drawer and client assistance service"
commit_chunk "src/lib/size-guide.tsx" "feat(sizing): create bespoke garment tailoring and Japanese silhouette size guide"
commit_chunk "src/lib/tokens.ts src/lib/constants.ts src/lib/vocabulary.ts src/lib/utils.ts src/lib/env.ts src/lib/images.ts src/lib/mock-data.ts" "feat(tokens): define editorial design tokens, craft vocabulary and brand constants"

# --- GROUP F: SECURITY, DOMAIN ENGINES & RESILIENCE ---
commit_chunk "src/lib/security/" "feat(security): implement tamper-evident sha256 cryptographic audit ledger and rate limiters"
commit_chunk "src/lib/domain/events/ src/lib/application/" "feat(domain): build transactional outbox pattern event dispatcher engine"
commit_chunk "src/lib/domain/inventory/ src/lib/testing/inventory-lock.ts" "feat(domain): implement inventory lease reservation and soft-locking engine"
commit_chunk "src/lib/domain/checkout/" "feat(domain): establish checkout idempotency and session lifecycle engine"
commit_chunk "src/lib/redis/" "feat(redis): create connection-pooled redis client with fallback memory cache"
commit_chunk "src/lib/observability/ src/lib/analytics/" "feat(observability): integrate structured performance tracing and health probes"
commit_chunk "src/lib/commerce/" "feat(commerce): establish finite state machine transitions for orders and payments"

# --- GROUP G: EXTERNAL PLATFORM INTEGRATIONS ---
commit_chunk "src/lib/shopify/ src/lib/shopify*.ts" "feat(integrations): build headless shopify storefront api graphql client"
commit_chunk "src/lib/sanity/ src/lib/sanity*.ts" "feat(integrations): build headless sanity groq query pipelines and image builders"
commit_chunk "src/lib/integrations/shiprocket* src/lib/shiprocket*" "feat(integrations): build shiprocket domestic fulfillment and tracking adapter"
commit_chunk "src/lib/integrations/interakt* src/lib/integrations/klaviyo* src/lib/interakt* src/lib/klaviyo*" "feat(integrations): implement interakt whatsapp and klaviyo editorial event relays"
commit_chunk "src/lib/provenance/ src/lib/membership/ src/lib/auth/ src/lib/cms/ src/lib/infrastructure/ src/lib/resilience/ src/lib/queue/" "feat(lib): implement domain enclave services for membership, provenance and queues"

# --- GROUP H: APP ROUTER CORE & CHECKOUT FLOW ---
commit_chunk "src/app/layout.tsx" "feat(app): construct root layout with lenis smooth scrolling and font providers"
commit_chunk "src/app/page.tsx" "feat(app): build editorial maison landing page with cinematic hero transitions"
commit_chunk "src/app/not-found.tsx src/app/error.tsx src/app/global-error.tsx src/app/loading.tsx" "feat(app): create branded 404 not found and 500 server error boundary templates"
commit_chunk "src/app/sitemap.ts src/app/robots.ts" "feat(seo): generate dynamic xml sitemaps and search engine robots directives"
commit_chunk "src/app/checkout/page.tsx src/app/checkout/" "feat(checkout): build multi-step guest checkout flow with live order summary"

# --- GROUP I: EDITORIAL & DISCOVERY PAGES ---
commit_chunk "src/app/drop-01/ src/app/drops/" "feat(drops): build drop 01 numbered batch exhibition and release interface"
commit_chunk "src/app/archive/ src/app/artifact/" "feat(archive): build digital archive exhibition grid and garment taxonomy filter"
commit_chunk "src/app/chapter/ src/app/chapters/ src/app/story/" "feat(chapters): build narrative editorial chapters showcasing textile craft origin"
commit_chunk "src/app/product/" "feat(product): build product detail page with 3d canvas and craft ritual tabs"
commit_chunk "src/app/verify/" "feat(provenance): build nfc serial verification and authenticity scanner portal"
commit_chunk "src/app/account/ src/app/sign-in/ src/app/profile/ src/app/track-order/ src/app/bag/ src/app/cart/ src/app/wishlist/ src/app/size-guide/ src/app/studio/ src/app/journal/ src/app/admin/" "feat(account): build patron account portal, otp auth and order history screens"

# --- GROUP J: API ROUTE SUBSYSTEMS ---
commit_chunk "src/app/api/auth/" "feat(api): implement passwordless sms and email otp authentication routes"
commit_chunk "src/app/api/provenance/" "feat(api): implement nfc physical garment provenance registration and scan routes"
commit_chunk "src/app/api/cart/ src/app/api/shipping/ src/app/api/residents/ src/app/api/ready/" "feat(api): implement cart validation, shipping returns, leads and ready probe"

# --- GROUP K: COMPONENT DESIGN SYSTEM & 3D EXPERIENCES ---
commit_chunk "src/components/ui/" "feat(ui): build atomic design system tokens, typography and magnetic buttons"
commit_chunk "src/components/home/ src/components/chapters/ src/components/archive/" "feat(components): build interactive craft hero, drop showcase and chapter reels"
commit_chunk "src/components/product/" "feat(components): implement interactive product image zoom and accordion specs"
commit_chunk "src/components/provenance/ src/components/orders/" "feat(components): build nfc scanner simulation and garment passport components"
commit_chunk "src/components/studio/ src/components/search/ src/components/journal/" "feat(components): build patron studio ateliers and live search dialog overlays"
commit_chunk "src/components/auth/ src/components/account/ src/components/concierge/ src/components/providers/" "feat(components): build account authentication modals and client providers"

# --- GROUP L: TEST HARNESS & BUILD SCRIPTS ---
commit_chunk "src/__tests__/phase* src/__tests__/concurrency* src/__tests__/domain* src/__tests__/forensic* src/__tests__/identity* src/__tests__/deployment* src/__tests__/production-rehearsal* tests/ __tests__/" "test(certification): complete all phase a through h domain certification test suites"
commit_chunk "scripts/" "chore(scripts): provide release verification, claims checker and attack simulation scripts"

# Commit any remaining files
git add . 2>/dev/null || true
if ! git diff --cached --quiet; then
    echo "Committing remaining uncommitted files..."
    git commit -m "chore(release): complete release hardening and tree synchronization"
fi

echo "=========================================================="
echo " All granular commits staged. To push to GitHub:"
echo "   git push origin main"
echo "=========================================================="
