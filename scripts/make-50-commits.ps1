# House of Otaru — 50 Atomic Commits Release Pipeline
# Shell: PowerShell (No .bat commands)
# Run in terminal: powershell -ExecutionPolicy Bypass -File scripts\make-50-commits.ps1

$ErrorActionPreference = "Stop"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting 50 Atomic Commits for House of Otaru...      " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# [1/50] Tokens & Color Palette
git add src/styles/tokens.css src/styles/tokens/
git commit -m "style(tokens): extend archival color palette, mineral neutrals, and typography scales"

# [2/50] Global Styling & Boundary Rules
git add src/styles/globals.css
git commit -m "style(globals): establish hairline boundary discipline and relax modal shadows"

# [3/50] Core TypeScript Interfaces & Data Models
git add src/types/
git commit -m "feat(types): define archival domain interfaces for products, cart, and CMS models"

# [4/50] Archival Photographic Registry
git add src/lib/images.ts src/lib/catalog.ts
git commit -m "feat(assets): register high-fidelity product photography, macro assets, and catalog registry"

# [5/50] Content Claims & Brand Copy
git add content/
git commit -m "feat(content): curate archival material claims, craft pairings, and editorial strings"

# [6/50] Archival Motion & Cursor Hooks
git add src/hooks/
git commit -m "feat(hooks): implement smooth scroll, magnetic physics, split-text, and cursor tracking"

# [7/50] Procedural Textures & Paper Grain
git add src/components/ui/ArchiveTextureOverlay.tsx src/components/ui/ArchivalCursor.tsx
git commit -m "feat(ui): add procedural washi paper grain overlay and bespoke archival cursor"

# [8/50] Sashiko Grid & Architectural Blueprints
git add src/components/ui/ArchivalBackgroundArt.tsx src/components/ui/DesignedArtifactGraphic.tsx
git commit -m "feat(ui): add sashiko stitching grid, vertical kanji seals, and ASCII blueprint graphics"

# [9/50] Watoji Bookbinding Mounts & Art Plates
git add src/components/ui/ImagePlaceholder.tsx src/components/ui/ArtBackgroundPlate.tsx
git commit -m "feat(ui): add watoji bookbinding image frames and radial woodblock art plates"

# [10/50] Scroll Physics & Text Reveal Components
git add src/components/ui/ScrollZoomImage.tsx src/components/ui/RevealOnScroll.tsx src/components/ui/ScrollTextReveal.tsx
git commit -m "feat(ui): implement 60fps scroll zoom-in physics, progress ledger, and text reveals"

# [11/50] Japanese Material UI Primitives
git add src/components/ui/DoorButton.tsx src/components/ui/JapaneseFurinChimes.tsx src/components/ui/DropChip.tsx
git commit -m "feat(ui): add furin chimes, sliding door button controls, and drop status chips"

# [12/50] Living Cloth WebGL Canvas
git add src/components/home/HeldClothCanvas.tsx
git commit -m "feat(hero): build interactive WebGL cloth surface with drape physics and window backlighting"

# [13/50] Movement 01 — Hero Entrance & Torii Art
git add src/components/home/HeldHero.tsx src/components/home/Hero.tsx src/components/home/HeroToriiArt.tsx
git commit -m "feat(hero): transform hero entrance with curtain clip-path reveal and Torii art mount"

# [14/50] Movement 02 — Object 041 Yama Reveal
git add src/components/home/ObjectReveal.tsx
git commit -m "feat(home): introduce Movement 02 scroll reveal showcasing Object 041 Yama Field Jacket"

# [15/50] Archival Object Garment Cards
git add src/components/home/ObjectCard.tsx
git commit -m "feat(home): create archival ObjectCard with kanji stamps, provenance metadata, and hover swap"

# [16/50] Movement 03 — Current Batch Asymmetric Grid
git add src/components/home/BatchSection.tsx
git commit -m "feat(home): redesign BatchSection with asymmetric 12-column rhythm and allocation counters"

# [17/50] Movement 04 — Tactile 1:1 Material Study
git add src/components/home/MaterialMacroSection.tsx src/components/ui/MaterialInspectorModal.tsx
git commit -m "feat(home): build interactive Material Study with tactile hotspot annotations on macro twill"

# [18/50] Movement 05 — Editorial Object Manifesto
git add src/components/home/WhyThisObject.tsx
git commit -m "feat(home): add WhyThisObject editorial justification covering material, construction, and intention"

# [19/50] Movement 06 — Chapter Worlds Showcase
git add src/components/home/ChaptersScrollSnap.tsx src/components/home/ChapterShowcase.tsx
git commit -m "feat(home): implement Chapter Worlds showcase with horizontal scroll-snap and seasonal archives"

# [20/50] Movement 07 — Otaru Canal Studio & Hands
git add src/components/home/StudioStorySection.tsx
git commit -m "feat(home): elevate Studio & Hands with 1907 Otaru canal warehouse history and artisan photography"

# [21/50] Movement 08 — 5-Year Garment Longevity Timeline
git add src/components/home/ObjectLifeTimeline.tsx
git commit -m "feat(home): add 4-stage ObjectLifeTimeline illustrating botanical indigo aging and patina"

# [22/50] Movement 09 — Permanent Archive Gateway
git add src/components/home/PermanentArchiveCta.tsx src/components/home/ArchiveTeaser.tsx
git commit -m "feat(home): create PermanentArchiveCta bridge inviting exploration of all historical holdings"

# [23/50] Movement 10 — Studio Field Notes & Journal
git add src/components/home/JournalThreeCards.tsx src/components/home/JournalTeaser.tsx
git commit -m "feat(home): enrich studio field notes with direct links to corresponding archive garments"

# [24/50] Movement 11 — Lifetime Repair Ledger
git add src/components/home/MadeToRemain.tsx
git commit -m "feat(home): introduce MadeToRemain section detailing the wear-repair-return-wear cycle"

# [25/50] Movement 12 — Archival Circle Reservations
git add src/components/home/CircleEmailSection.tsx src/components/home/NewsletterSignup.tsx
git commit -m "feat(home): refine Archival Circle reservation form for private pre-release cutting notices"

# [26/50] 12-Movement Homepage Experience
git add src/app/page.tsx
git commit -m "feat(home): orchestrate complete 12-movement homepage narrative in app/page.tsx"

# [27/50] Full-Screen Macro Inspection Modal
git add src/components/product/InspectModal.tsx
git commit -m "feat(product): build full-screen InspectModal with macro annotations for hardware and seams"

# [28/50] Garment Provenance Passport Certificate
git add src/components/product/ObjectPassport.tsx src/components/provenance/GarmentPassport.tsx
git commit -m "feat(product): create ObjectPassport certificate displaying registry ID, loom mill, and warranty"

# [29/50] Interactive ObjectFit Silhouette Advisor
git add src/components/product/ObjectFitCalculator.tsx src/components/ui/SizeGuideModal.tsx
git commit -m "feat(product): build ObjectFitCalculator computing individual silhouette drape recommendations"

# [30/50] 5-Stage Craft Provenance Map
git add src/components/product/CraftProvenanceMap.tsx
git commit -m "feat(product): add CraftProvenanceMap tracing 5 production phases from botanical harvest to vault"

# [31/50] Definitive Product Detail Page Architecture
git add src/components/product/ProductDetailView.tsx src/app/product/
git commit -m "feat(product): transform ProductDetailView with steady inventory dot and complete object dossier"

# [32/50] Tranquil Archive Bag Tray
git add src/components/cart/CartDrawer.tsx src/components/cart/CartButton.tsx src/components/cart/CartLineItem.tsx src/lib/cart.tsx
git commit -m "feat(cart): reframe cart drawer into tranquil Archive Tray removing artificial countdowns"

# [33/50] Archive Slide-in Quick View Panel
git add src/components/archive/ArchiveQuickView.tsx
git commit -m "feat(archive): build slide-in ArchiveQuickView side panel for rapid garment inspection"

# [34/50] Permanent Archive Grid & Categorization Engine
git add src/components/archive/ArchiveGrid.tsx src/components/archive/ArchiveFilters.tsx src/components/archive/MilestonesGrid.tsx
git commit -m "feat(archive): integrate ArchiveQuickView drawer and refined card hover states into ArchiveGrid"

# [35/50] Permanent Archive Collection Route
git add src/app/archive/page.tsx
git commit -m "feat(archive): refine permanent archive page with category filtering and chronological sorting"

# [36/50] Quiet Atelier Concierge Panel
git add src/components/concierge/ConciergePanel.tsx
git commit -m "feat(concierge): create tranquil Atelier Concierge side panel with category consultations"

# [37/50] Concierge State Machine & Context Provider
git add src/lib/concierge.tsx
git commit -m "feat(concierge): introduce ConciergeProvider global state and useConcierge hook"

# [38/50] Site Header & Navigation Architecture
git add src/components/layout/SiteHeader.tsx
git commit -m "feat(layout): simplify SiteHeader navigation, add Concierge trigger, and clean bag indicator"

# [39/50] Site Footer & Archival Brandmark
git add src/components/layout/SiteFooter.tsx
git commit -m "feat(layout): align SiteFooter with Otaru brandmark, currency picker, and Concierge desk link"

# [40/50] App Layout Shell & Global Context Providers
git add src/components/providers/AppProviders.tsx src/app/layout.tsx
git commit -m "feat(layout): mount ConciergeProvider in AppProviders and configure typography tokens in layout"

# [41/50] Dynamic Image API & Serverless Media
git add src/app/api/images/ src/app/api/hero-image/ src/app/api/art/
git commit -m "feat(api): implement dynamic high-resolution image serving and SVG archival fallbacks"

# [42/50] Checkout Server Authority & Price Protection
git add src/app/api/checkout/razorpay/order/route.ts
git commit -m "security(checkout): enforce server catalog pricing to defeat client price tampering"

# [43/50] Administrative Refund & Replay-Resistant Verification
git add src/app/api/checkout/razorpay/refund/route.ts src/app/api/checkout/razorpay/verify/route.ts
git commit -m "security(refund): lock refund endpoint behind timing-safe auth and verify payment receipts"

# [44/50] Distributed Single-Use Nonce Store & Fraud Guard
git add src/lib/payments/nonce-store.ts src/lib/payments/fraud.ts
git commit -m "security(payments): implement distributed single-use nonces and fraud heuristic engine"

# [45/50] Double-Entry Financial Ledger & Audit Trail
git add src/lib/payments/ledger.ts src/lib/payments/audit-trail.ts src/app/api/checkout/razorpay/ledger/route.ts src/app/api/checkout/razorpay/audit/route.ts
git commit -m "feat(database): establish PostgreSQL financial ledger with tamper-evident audit logging"

# [46/50] Edge CSRF Exemption & HMAC Webhook Engine
git add src/middleware.ts src/app/api/webhooks/order/route.ts src/app/api/webhooks/razorpay/route.ts src/app/api/checkout/razorpay/webhook/route.ts
git commit -m "security(webhooks): exempt webhook paths from edge CSRF and enforce timing-safe HMAC signatures"

# [47/50] OTP Authentication & Identity Security
git add src/app/api/auth/otp/send/route.ts src/app/api/auth/otp/verify/route.ts src/lib/auth/ src/context/auth-context.tsx
git commit -m "security(auth): add destination rate limiting and 5-attempt brute-force lockout on OTP"

# [48/50] Account IDOR Defense & Order Management
git add src/app/api/account/orders/route.ts src/components/account/ProfileDashboard.tsx
git commit -m "security(account): enforce session cookie auth to defeat IDOR order queries in profile view"

# [49/50] Provenance NFC Cryptographic Verification & Probes
git add src/app/api/provenance/ src/lib/provenance/ src/app/api/health/route.ts src/app/api/ready/route.ts src/app/api/metrics/route.ts
git commit -m "feat(provenance): add cryptographic garment verification, health probes, and Prometheus metrics"

# [50/50] Prisma Migrations, Build Pipeline & Test Certification
git add prisma/ next.config.mjs package.json .env.example scripts/ src/__tests__/ docs/ OTARU_PRODUCTION_CERTIFICATION.md
git commit -m "chore(release): include prisma migrations, security headers, forensic test suite, and certification docs"

Write-Host "========================================================" -ForegroundColor Green
Write-Host "  All 50 atomic commits completed successfully!         " -ForegroundColor Green
Write-Host "  You can now run 'git push' whenever you are ready.    " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Green
