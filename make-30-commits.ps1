# ========================================================
#   House of Otaru — 30 Atomic Commits Execution Pipeline
# ========================================================

Write-Host "Executing 30 Atomic Commits for Otaru Atelier..." -ForegroundColor Cyan

# 1. Design System Tokens & Global Hairline Discipline
git add src/styles/tokens.css src/styles/globals.css
git commit -m "style(tokens): extend archival color palette, mineral neutrals, and hairline boundary discipline"

# 2. Dynamic High-Resolution Image Serving API
git add src/app/api/images/ src/app/api/hero-image/ next.config.mjs
git commit -m "feat(api): implement dynamic high-resolution image serving and caching routes"

# 3. Photography Asset Registry
git add src/lib/images.ts
git commit -m "feat(assets): register high-fidelity product photography, textile macro, and studio assets"

# 4. Washi Paper Grain & Sashiko Stitching Overlays
git add src/components/ui/ArchiveTextureOverlay.tsx src/components/ui/ArchivalBackgroundArt.tsx
git commit -m "feat(ui): add procedural washi paper grain, sashiko stitching grid, and kanji seals"

# 5. Watoji Bookbinding Image Mounts & Swaps
git add src/components/ui/ImagePlaceholder.tsx
git commit -m "feat(ui): add watoji bookbinding frames and auto-resolving dual-image hover swap"

# 6. Scroll Physics & Smooth Zoom Component
git add src/components/ui/ScrollZoomImage.tsx
git commit -m "feat(ui): implement 60fps scroll zoom-in and zoom-out physics component"

# 7. Woodblock Art Plates & Vermilion Hanko Seal
git add src/components/ui/ArtBackgroundPlate.tsx src/components/ui/DesignedArtifactGraphic.tsx
git commit -m "feat(ui): add radial woodblock art plate mounts and vermilion hanko seal graphics"

# 8. WebGL Living Cloth Physics Surface
git add src/components/home/HeldClothCanvas.tsx
git commit -m "feat(hero): build interactive WebGL cloth surface with drape physics and window backlighting"

# 9. Cinematic Entrance Hero Section
git add src/components/home/HeldHero.tsx src/components/home/Hero.tsx
git commit -m "feat(hero): transform hero into cinematic desire-driven entrance with clip-path reveal"

# 10. Movement 02 Signature Object Reveal
git add src/components/home/ObjectReveal.tsx
git commit -m "feat(home): introduce Movement 02 scroll reveal showcasing Object 041 Yama Field Jacket"

# 11. Archival Object Card Component
git add src/components/home/ObjectCard.tsx
git commit -m "feat(home): create archival ObjectCard with kanji stamps, provenance metadata, and hover swap"

# 12. Movement 03 Current Batch Asymmetric Grid
git add src/components/home/BatchSection.tsx
git commit -m "feat(home): redesign BatchSection with asymmetric 12-column rhythm and calm allocation count"

# 13. Movement 04 Tactile 1:1 Material Macro Twill Study
git add src/components/home/MaterialMacroSection.tsx
git commit -m "feat(home): build interactive Material Study with 4 tactile hotspot zones on macro twill"

# 14. Movement 05 Editorial Justification Manifesto
git add src/components/home/WhyThisObject.tsx
git commit -m "feat(home): add WhyThisObject editorial justification covering material, construction, and intention"

# 15. Movement 06 Horizontal Scroll-Snap Chapter Worlds
git add src/components/home/ChaptersScrollSnap.tsx
git commit -m "feat(home): implement Chapter Worlds showcase with horizontal scroll-snap and seasonal archives"

# 16. Movement 07 1907 Otaru Canal Warehouse & Artisan Evidence
git add src/components/home/StudioStorySection.tsx
git commit -m "feat(home): elevate Studio & Hands with 1907 Otaru canal warehouse history and artisan photography"

# 17. Movement 08 Indigo Aging & Patina Longevity Timeline
git add src/components/home/ObjectLifeTimeline.tsx
git commit -m "feat(home): add 4-stage ObjectLifeTimeline illustrating botanical indigo aging and patina"

# 18. Movement 09 Permanent Archive Portal Gateway
git add src/components/home/PermanentArchiveCta.tsx
git commit -m "feat(home): create PermanentArchiveCta bridge inviting exploration of all 10 historical holdings"

# 19. Movement 10 Archival Field Journal Notes
git add src/components/home/JournalThreeCards.tsx
git commit -m "feat(home): enrich studio field notes with direct links to corresponding archive garments"

# 20. Movements 11 & 12 Lifetime Repair Ledger & Circle Reservations
git add src/components/home/MadeToRemain.tsx src/components/home/CircleEmailSection.tsx
git commit -m "feat(home): add MadeToRemain lifetime repair ledger and Archival Circle reservation form"

# 21. Complete 12-Movement Homepage Sequenced Orchestration
git add src/app/page.tsx
git commit -m "feat(home): orchestrate complete 12-movement homepage narrative in app/page.tsx"

# 22. Tactile Hotspot Full-Screen Inspection Modal
git add src/components/product/InspectModal.tsx
git commit -m "feat(product): build full-screen InspectModal with macro annotations for hardware and seams"

# 23. Archival Provenance Object Passport Certificate
git add src/components/product/ObjectPassport.tsx
git commit -m "feat(product): create ObjectPassport certificate displaying registry ID, loom mill, and repair warranty"

# 24. Interactive ObjectFit Silhouette Engine
git add src/components/product/ObjectFitCalculator.tsx
git commit -m "feat(product): build ObjectFitCalculator computing individual silhouette recommendations"

# 25. 5-Stage Craft Provenance Map
git add src/components/product/CraftProvenanceMap.tsx
git commit -m "feat(product): add CraftProvenanceMap tracing 5 production phases from botanical harvest to vault"

# 26. Definitive PDP Architecture & Dossier
git add src/components/product/ProductDetailView.tsx
git commit -m "feat(product): transform ProductDetailView with steady inventory dot and complete object dossier"

# 27. Tranquil Archive Bag Tray Drawer
git add src/components/cart/CartDrawer.tsx
git commit -m "feat(cart): reframe cart drawer into YOUR ARCHIVE tray removing countdowns and urgency"

# 28. Permanent Archive Catalog & Quick Inspection Side Drawer
git add src/components/archive/ArchiveQuickView.tsx src/components/archive/ArchiveGrid.tsx src/app/archive/page.tsx
git commit -m "feat(archive): build ArchiveQuickView drawer and integrate permanent collection catalog"

# 29. Atelier Concierge Side Panel & State Provider
git add src/components/concierge/ConciergePanel.tsx src/lib/concierge.tsx
git commit -m "feat(concierge): introduce Atelier Concierge panel, state engine, and context provider"

# 30. Archival Navigation, Global Providers & Architecture Documentation
git add src/components/layout/SiteHeader.tsx src/components/layout/SiteFooter.tsx src/components/providers/AppProviders.tsx src/app/layout.tsx docs/ARCHITECTURE.md
git commit -m "feat(layout): unify archival header, footer, global providers, and system architecture docs"

Write-Host "========================================================" -ForegroundColor Green
Write-Host "  All 30 atomic commits executed successfully!          " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
