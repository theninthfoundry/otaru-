# ========================================================
#   House of Otaru — 40 Atomic Commits Execution Pipeline
# ========================================================

Write-Host "Executing 40 Atomic Commits for Otaru Atelier..." -ForegroundColor Cyan

# 1. Design System Tokens & Palette Expansion
git add src/styles/tokens.css
git commit -m "style(tokens): extend archival color palette, mineral neutrals, and editorial motion curves"

# 2. Global Styling & Hairline Discipline
git add src/styles/globals.css
git commit -m "style(globals): relax modal shadow rules and establish hairline boundary discipline"

# 3. Dynamic Image API Endpoint
git add src/app/api/images/ src/app/api/hero-image/ next.config.mjs
git commit -m "feat(api): implement dynamic high-resolution image serving and caching route"

# 4. Photography Asset Registry
git add src/lib/images.ts
git commit -m "feat(assets): register high-fidelity product photography, textile macro, and studio assets"

# 5. Archival Texture & Washi Overlays
git add src/components/ui/ArchiveTextureOverlay.tsx
git commit -m "feat(ui): add procedural washi paper grain and edge vignette overlay"

# 6. Sashiko Grid & Kanji Seals
git add src/components/ui/ArchivalBackgroundArt.tsx
git commit -m "feat(ui): add sashiko stitching grid, vertical kanji seals, and ASCII craft blueprints"

# 7. Watoji Bookbinding Image Mounts
git add src/components/ui/ImagePlaceholder.tsx
git commit -m "feat(ui): add watoji bookbinding frames and auto-resolving dual-image hover swap"

# 8. Scroll Physics & Smooth Zoom
git add src/components/ui/ScrollZoomImage.tsx
git commit -m "feat(ui): implement 60fps scroll zoom-in and zoom-out physics component"

# 9. Woodblock Art Plates
git add src/components/ui/ArtBackgroundPlate.tsx
git commit -m "feat(ui): add radial feathered woodblock art plate background mount component"

# 10. Designed Artifact Graphics & Stamps
git add src/components/ui/DesignedArtifactGraphic.tsx
git commit -m "feat(ui): add vermilion hanko seal and architectural blueprint schematics"

# 11. Living Cloth WebGL Surface
git add src/components/home/HeldClothCanvas.tsx
git commit -m "feat(hero): build interactive WebGL cloth surface with drape physics and window backlighting"

# 12. Cinematic Hero Section Redesign
git add src/components/home/HeldHero.tsx src/components/home/Hero.tsx
git commit -m "feat(hero): transform hero into cinematic desire-driven entrance with clip-path reveal"

# 13. Movement 02 Signature Object Reveal
git add src/components/home/ObjectReveal.tsx
git commit -m "feat(home): introduce Movement 02 scroll reveal showcasing Object 041 Yama Field Jacket"

# 14. Archival Object Card Component
git add src/components/home/ObjectCard.tsx
git commit -m "feat(home): create archival ObjectCard with kanji stamps, provenance metadata, and hover swap"

# 15. Current Batch Asymmetric Grid
git add src/components/home/BatchSection.tsx
git commit -m "feat(home): redesign BatchSection with asymmetric 12-column rhythm and calm allocation count"

# 16. Tactile 1:1 Material Macro Study
git add src/components/home/MaterialMacroSection.tsx
git commit -m "feat(home): build interactive Material Study with 4 tactile hotspot zones on macro twill"

# 17. Movement 05 Editorial Manifesto
git add src/components/home/WhyThisObject.tsx
git commit -m "feat(home): add WhyThisObject editorial justification covering material, construction, and intention"

# 18. Horizontal Scroll-Snap Chapter Worlds
git add src/components/home/ChaptersScrollSnap.tsx
git commit -m "feat(home): implement Chapter Worlds showcase with horizontal scroll-snap and seasonal archives"

# 19. Canal Warehouse Studio & Human Evidence
git add src/components/home/StudioStorySection.tsx
git commit -m "feat(home): elevate Studio & Hands with 1907 Otaru canal warehouse history and artisan photography"

# 20. 5-Year Garment Longevity Timeline
git add src/components/home/ObjectLifeTimeline.tsx
git commit -m "feat(home): add 4-stage ObjectLifeTimeline illustrating botanical indigo aging and patina"

# 21. Movement 09 Permanent Archive Portal
git add src/components/home/PermanentArchiveCta.tsx
git commit -m "feat(home): create PermanentArchiveCta bridge inviting exploration of all 10 historical holdings"

# 22. Journal-to-Commerce Integration
git add src/components/home/JournalThreeCards.tsx
git commit -m "feat(home): enrich studio field notes with direct links to corresponding archive garments"

# 23. Lifetime Repair Ledger
git add src/components/home/MadeToRemain.tsx
git commit -m "feat(home): introduce MadeToRemain section detailing the wear-repair-return-wear cycle"

# 24. Priority Cutting Archival Circle
git add src/components/home/CircleEmailSection.tsx
git commit -m "feat(home): refine Archival Circle reservation form for private pre-release cutting notices"

# 25. 12-Movement Homepage Sequenced Experience
git add src/app/page.tsx
git commit -m "feat(home): orchestrate complete 12-movement homepage narrative in app/page.tsx"

# 26. Full-Screen Hotspot Inspection Mode
git add src/components/product/InspectModal.tsx
git commit -m "feat(product): build full-screen InspectModal with macro annotations for hardware and seams"

# 27. Archival Provenance Object Passport
git add src/components/product/ObjectPassport.tsx
git commit -m "feat(product): create ObjectPassport certificate displaying registry ID, loom mill, and repair warranty"

# 28. Interactive ObjectFit Size Advisor
git add src/components/product/ObjectFitCalculator.tsx
git commit -m "feat(product): build ObjectFitCalculator computing individual silhouette recommendations"

# 29. 5-Stage Craft Provenance Flow
git add src/components/product/CraftProvenanceMap.tsx
git commit -m "feat(product): add CraftProvenanceMap tracing 5 production phases from botanical harvest to vault"

# 30. Definitive PDP Architecture
git add src/components/product/ProductDetailView.tsx
git commit -m "feat(product): transform ProductDetailView with steady inventory dot and complete object dossier"

# 31. Tranquil Archive Bag Tray
git add src/components/cart/CartDrawer.tsx
git commit -m "feat(cart): reframe cart drawer into YOUR ARCHIVE tray removing countdowns and urgency"

# 32. Archive Slide-in Quick View Drawer
git add src/components/archive/ArchiveQuickView.tsx
git commit -m "feat(archive): build slide-in ArchiveQuickView side panel for rapid garment inspection"

# 33. Archive Grid Quick Inspection Integration
git add src/components/archive/ArchiveGrid.tsx
git commit -m "feat(archive): integrate ArchiveQuickView drawer and refined card hover states into ArchiveGrid"

# 34. Permanent Archive Collection Page
git add src/app/archive/page.tsx
git commit -m "feat(archive): refine permanent archive page with category filtering and chronological sorting"

# 35. Quiet Atelier Concierge Panel
git add src/components/concierge/ConciergePanel.tsx
git commit -m "feat(concierge): create tranquil Atelier Concierge side panel with category consultations"

# 36. Concierge Context & State Management
git add src/lib/concierge.tsx
git commit -m "feat(concierge): introduce ConciergeProvider global state and useConcierge hook"

# 37. Site Header Refinements & Concierge Trigger
git add src/components/layout/SiteHeader.tsx
git commit -m "feat(layout): simplify SiteHeader navigation, add Concierge trigger, and clean bag indicator"

# 38. Site Footer Archival Alignment
git add src/components/layout/SiteFooter.tsx
git commit -m "feat(layout): align SiteFooter with Otaru brandmark, currency picker, and Concierge desk link"

# 39. Global Provider Registration
git add src/components/providers/AppProviders.tsx src/app/layout.tsx
git commit -m "feat(layout): mount ConciergeProvider in AppProviders and configure typography tokens in layout"

# 40. Architecture & Transformation Documentation
git add docs/ARCHITECTURE.md
git commit -m "docs: record 12-movement design system architecture and luxury commerce transformation"

Write-Host "========================================================" -ForegroundColor Green
Write-Host "  All 40 atomic commits created successfully!           " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
