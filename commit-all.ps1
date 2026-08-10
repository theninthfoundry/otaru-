# Otaru Granular Git Commit Automation (25 Atomic Commits)

Write-Host "=== Starting Granular Git Commits ===" -ForegroundColor Green

# 1. Architecture Docs
git add docs/ARCHITECTURE.md
git commit -m "docs: add architectural manifesto and modular monolith layout"

# 2. Data Models
git add docs/DATA_MODEL.md
git commit -m "docs: define order state machine and prisma schema draft"

# 3. Deployment
git add docs/DEPLOYMENT.md
git commit -m "docs: add deployment guide and environment variable specifications"

# 4. Integrations Spec
git add docs/INTEGRATIONS.md
git commit -m "docs: catalog third-party API integration boundaries"

# 5. Security Spec
git add docs/SECURITY.md
git commit -m "docs: document edge-level CSP, CSRF, and rate limiting specifications"

# 6. Webhooks Spec
git add docs/WEBHOOKS.md
git commit -m "docs: define webhook routing and ISR revalidation strategy"

# 7. ADRs
git add docs/ADR/
git commit -m "docs(adr): add architectural decision records 001 through 004"

# 8. Root Configs
git add next.config.ts postcss.config.mjs next.config.mjs postcss.config.js
git commit -m "chore: standardize next.config.ts and postcss.config.mjs"

# 9. Shiprocket
git add src/lib/integrations/shiprocket.ts
git commit -m "feat(integrations): move shiprocket logistics API client"

# 10. Klaviyo
git add src/lib/integrations/klaviyo.ts
git commit -m "feat(integrations): move klaviyo crm newsletter API client"

# 11. Interakt
git add src/lib/integrations/interakt.ts
git commit -m "feat(integrations): move interakt whatsapp notification client"

# 12. Shopify Integration
git add src/lib/integrations/shopify/
git commit -m "feat(integrations): consolidate shopify storefront graphql queries and mappers"

# 13. Sanity Integration
git add src/lib/integrations/sanity/
git commit -m "feat(integrations): consolidate sanity studio cms groq queries and client"

# 14. Commerce Domain
git add src/lib/commerce/
git commit -m "feat(domain): implement commerce domain products, checkout, and orders services"

# 15. CMS Domain
git add src/lib/cms/
git commit -m "feat(domain): implement sanity cms domain wrapper service"

# 16. Provenance Domain
git add src/lib/provenance/
git commit -m "feat(domain): implement provenance authenticity certificate & nfc verification"

# 17. Membership Domain
git add src/lib/membership/
git commit -m "feat(domain): implement patron and collector membership tier entitlements"

# 18. Lib Wrappers
git add src/lib/shopify.ts src/lib/sanity.ts src/lib/shopify/ src/lib/sanity/
git commit -m "refactor(lib): update domain re-exports for shopify and sanity"

# 19. UI Components
git add src/components/ui/
git commit -m "refactor(ui): standardize primitives to kebab-case file naming"

# 20. Layout Components
git add src/components/layout/
git commit -m "refactor(layout): organize header, footer, and navigation components"

# 21. Orders & Verify Components
git add src/components/orders/ src/components/verify/
git commit -m "refactor(components): standardize return forms, tracking, and verification cards"

# 22. Home & Editorial Components
git add src/components/home/ src/components/editorial/ src/components/journal/
git commit -m "refactor(editorial): organize chapter spotlight and journal components"

# 23. Animations & Drops Components
git add src/components/animations/ src/components/drops/
git commit -m "refactor(animations): enhance reveal-text and drop countdown components"

# 24. Artifact, Cart & 3D Components
git add src/components/artifact/ src/components/cart/ src/components/wishlist/ src/components/search/ src/components/three/
git commit -m "refactor(components): organize artifact details, cart drawer, and 3d material viewer"

# 25. Unit Tests & Types
git add src/__tests__/domain-services.test.ts src/types/
git commit -m "test: add domain service unit tests and update typescript definitions"

# 26. Remaining files & Push
git add .
git commit -m "chore: final repository consolidation and cleanup"
git push

Write-Host "=== All 26 Commits Pushed Successfully ===" -ForegroundColor Green
