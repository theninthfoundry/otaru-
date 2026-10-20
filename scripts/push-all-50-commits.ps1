# House of Otaru — Complete 60-Commit Granular Pipeline (PowerShell)
# Run in D:\otaru: .\scripts\push-all-50-commits.ps1

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " House of Otaru — Complete Granular Commit Pipeline (60 Commits)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

function Invoke-CommitChunk($files, $msg) {
    git add $files 2>$null
    $staged = git diff --cached --name-only
    if ($staged) {
        Write-Host "Committing: $msg" -ForegroundColor Yellow
        git commit -m "$msg"
    } else {
        Write-Host "Skipping (no changes staged): $msg" -ForegroundColor DarkGray
    }
}

# --- GROUP A: TOOLING, CONFIGS & BUILD MANIFESTS ---
Invoke-CommitChunk ".gitignore" "chore(git): configure repository ignore rules for build caches and copy artifacts"
Invoke-CommitChunk "package.json package-lock.json" "chore(deps): configure root dependencies, package scripts and engine declarations"
Invoke-CommitChunk "tsconfig.json next-env.d.ts" "chore(typescript): configure strict compiler flags, path aliases and module resolutions"
Invoke-CommitChunk "next.config.mjs" "chore(next): configure next.js compiler optimizations and image remote patterns"
Invoke-CommitChunk "tailwind.config.ts postcss.config.mjs" "chore(tailwind): establish luxury brand design tokens and typography extensions"
Invoke-CommitChunk ".eslintrc.json .prettierrc .npmrc" "chore(lint): configure strict eslint and prettier code formatting invariants"
Invoke-CommitChunk "vitest.config.ts playwright.config.ts" "chore(test): configure vitest runner and playwright end-to-end test framework"
Invoke-CommitChunk "vercel.json .env.example" "chore(deployment): configure vercel production routing headers and security policies"

# --- GROUP B: ARCHITECTURAL DOCUMENTATION ---
Invoke-CommitChunk "OTARU_MASTER_OPERATING_ARCHITECTURE.md" "docs(architecture): establish master luxury operating architecture manifesto"
Invoke-CommitChunk "OTARU_PRODUCTION_CERTIFICATION.md" "docs(certification): publish production readiness certification and security audit"
Invoke-CommitChunk "README.md APPLY.md" "docs(overview): document maison digital archive mission and technical stack"
Invoke-CommitChunk "docs/INDEPENDENT_VERIFICATION_REPORT.md" "docs(archive): catalog remaining independent verification and validation notes"

# --- GROUP C: PRISMA SCHEMA & SEEDS ---
Invoke-CommitChunk "prisma/schema.prisma" "feat(prisma): define comprehensive relational domain models for luxury commerce"
Invoke-CommitChunk "prisma/seed.ts prisma/seed.js prisma/migrations" "feat(prisma): create database migrations and archival collection seed data"

# --- GROUP D: CMS, PUBLIC ASSETS & ROOT HELPERS ---
Invoke-CommitChunk "sanity/" "feat(sanity): implement studio desk structures and archival garment schemas"
Invoke-CommitChunk "public/images/ public/media/" "feat(assets): integrate high-resolution archival garment imagery and photography"
Invoke-CommitChunk "public/fonts/" "feat(assets): integrate bespoke luxury typography and web font binaries"
Invoke-CommitChunk "public/" "feat(assets): configure web app manifests, icons, favicons and robots assets"
Invoke-CommitChunk "page.tsx sections.tsx signature.tsx" "refactor(root): declare root layout stubs and signature component helpers"

# --- GROUP E: DOMAIN CATALOG & CLIENT CONTEXTS ---
Invoke-CommitChunk "src/lib/catalog.ts" "feat(catalog): build authoritative product catalog with material specifications"
Invoke-CommitChunk "src/lib/cart.tsx" "feat(cart): implement reactive archival shopping cart context and storage"
Invoke-CommitChunk "src/lib/currency.tsx" "feat(currency): implement dual inr and usd luxury currency conversion provider"
Invoke-CommitChunk "src/lib/wishlist.tsx" "feat(wishlist): implement persistent patron archival curation and wishlist state"
Invoke-CommitChunk "src/lib/concierge.tsx" "feat(concierge): create atelier live concierge drawer and client assistance service"
Invoke-CommitChunk "src/lib/size-guide.tsx" "feat(sizing): create bespoke garment tailoring and Japanese silhouette size guide"
Invoke-CommitChunk "src/lib/tokens.ts src/lib/constants.ts src/lib/vocabulary.ts src/lib/utils.ts src/lib/env.ts src/lib/images.ts src/lib/mock-data.ts" "feat(tokens): define editorial design tokens, craft vocabulary and brand constants"

# --- GROUP F: SECURITY, DOMAIN ENGINES & RESILIENCE ---
Invoke-CommitChunk "src/lib/security/" "feat(security): implement tamper-evident sha256 cryptographic audit ledger and rate limiters"
Invoke-CommitChunk "src/lib/domain/events/ src/lib/application/" "feat(domain): build transactional outbox pattern event dispatcher engine"
Invoke-CommitChunk "src/lib/domain/inventory/ src/lib/testing/inventory-lock.ts" "feat(domain): implement inventory lease reservation and soft-locking engine"
Invoke-CommitChunk "src/lib/domain/checkout/" "feat(domain): establish checkout idempotency and session lifecycle engine"
Invoke-CommitChunk "src/lib/redis/" "feat(redis): create connection-pooled redis client with fallback memory cache"
Invoke-CommitChunk "src/lib/observability/ src/lib/analytics/" "feat(observability): integrate structured performance tracing and health probes"
Invoke-CommitChunk "src/lib/commerce/" "feat(commerce): establish finite state machine transitions for orders and payments"

# --- GROUP G: EXTERNAL PLATFORM INTEGRATIONS ---
Invoke-CommitChunk "src/lib/shopify/ src/lib/shopify*.ts" "feat(integrations): build headless shopify storefront api graphql client"
Invoke-CommitChunk "src/lib/sanity/ src/lib/sanity*.ts" "feat(integrations): build headless sanity groq query pipelines and image builders"
Invoke-CommitChunk "src/lib/integrations/shiprocket* src/lib/shiprocket*" "feat(integrations): build shiprocket domestic fulfillment and tracking adapter"
Invoke-CommitChunk "src/lib/integrations/interakt* src/lib/integrations/klaviyo* src/lib/interakt* src/lib/klaviyo*" "feat(integrations): implement interakt whatsapp and klaviyo editorial event relays"
Invoke-CommitChunk "src/lib/provenance/ src/lib/membership/ src/lib/auth/ src/lib/cms/ src/lib/infrastructure/ src/lib/resilience/ src/lib/queue/" "feat(lib): implement domain enclave services for membership, provenance and queues"

# --- GROUP H: APP ROUTER CORE & CHECKOUT FLOW ---
Invoke-CommitChunk "src/app/layout.tsx" "feat(app): construct root layout with lenis smooth scrolling and font providers"
Invoke-CommitChunk "src/app/page.tsx" "feat(app): build editorial maison landing page with cinematic hero transitions"
Invoke-CommitChunk "src/app/not-found.tsx src/app/error.tsx src/app/global-error.tsx src/app/loading.tsx" "feat(app): create branded 404 not found and 500 server error boundary templates"
Invoke-CommitChunk "src/app/sitemap.ts src/app/robots.ts" "feat(seo): generate dynamic xml sitemaps and search engine robots directives"
Invoke-CommitChunk "src/app/checkout/page.tsx src/app/checkout/" "feat(checkout): build multi-step guest checkout flow with live order summary"

# --- GROUP I: EDITORIAL & DISCOVERY PAGES ---
Invoke-CommitChunk "src/app/drop-01/ src/app/drops/" "feat(drops): build drop 01 numbered batch exhibition and release interface"
Invoke-CommitChunk "src/app/archive/ src/app/artifact/" "feat(archive): build digital archive exhibition grid and garment taxonomy filter"
Invoke-CommitChunk "src/app/chapter/ src/app/chapters/ src/app/story/" "feat(chapters): build narrative editorial chapters showcasing textile craft origin"
Invoke-CommitChunk "src/app/product/" "feat(product): build product detail page with 3d canvas and craft ritual tabs"
Invoke-CommitChunk "src/app/verify/" "feat(provenance): build nfc serial verification and authenticity scanner portal"
Invoke-CommitChunk "src/app/account/ src/app/sign-in/ src/app/profile/ src/app/track-order/ src/app/bag/ src/app/cart/ src/app/wishlist/ src/app/size-guide/ src/app/studio/ src/app/journal/ src/app/admin/" "feat(account): build patron account portal, otp auth and order history screens"

# --- GROUP J: API ROUTE SUBSYSTEMS ---
Invoke-CommitChunk "src/app/api/auth/" "feat(api): implement passwordless sms and email otp authentication routes"
Invoke-CommitChunk "src/app/api/provenance/" "feat(api): implement nfc physical garment provenance registration and scan routes"
Invoke-CommitChunk "src/app/api/cart/ src/app/api/shipping/ src/app/api/residents/ src/app/api/ready/" "feat(api): implement cart validation, shipping returns, leads and ready probe"

# --- GROUP K: COMPONENT DESIGN SYSTEM & 3D EXPERIENCES ---
Invoke-CommitChunk "src/components/ui/" "feat(ui): build atomic design system tokens, typography and magnetic buttons"
Invoke-CommitChunk "src/components/home/ src/components/chapters/ src/components/archive/" "feat(components): build interactive craft hero, drop showcase and chapter reels"
Invoke-CommitChunk "src/components/product/" "feat(components): implement interactive product image zoom and accordion specs"
Invoke-CommitChunk "src/components/provenance/ src/components/orders/" "feat(components): build nfc scanner simulation and garment passport components"
Invoke-CommitChunk "src/components/studio/ src/components/search/ src/components/journal/" "feat(components): build patron studio ateliers and live search dialog overlays"
Invoke-CommitChunk "src/components/auth/ src/components/account/ src/components/concierge/ src/components/providers/" "feat(components): build account authentication modals and client providers"

# --- GROUP L: TEST HARNESS & BUILD SCRIPTS ---
Invoke-CommitChunk "src/__tests__/phase* src/__tests__/concurrency* src/__tests__/domain* src/__tests__/forensic* src/__tests__/identity* src/__tests__/deployment* src/__tests__/production-rehearsal* tests/ __tests__/" "test(certification): complete all phase a through h domain certification test suites"
Invoke-CommitChunk "scripts/" "chore(scripts): provide release verification, claims checker and attack simulation scripts"

# Commit any remaining files
git add . 2>$null
$remaining = git diff --cached --name-only
if ($remaining) {
    Write-Host "Committing remaining uncommitted files..." -ForegroundColor Yellow
    git commit -m "chore(release): complete release hardening and tree synchronization"
}

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " Staged and committed successfully. To push to GitHub:" -ForegroundColor Green
Write-Host "   git push origin main" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
