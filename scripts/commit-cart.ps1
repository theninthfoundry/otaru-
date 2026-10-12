# House of Otaru — Archival Cart & Secure Ledger Release
# Shell: PowerShell
# Command to run: powershell -ExecutionPolicy Bypass -File scripts\commit-cart.ps1

$ErrorActionPreference = "Stop"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Staging and Committing Unified Archival Cart Core...   " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Universal Wishlist Context & Provider
git add src/lib/wishlist.tsx src/components/providers/AppProviders.tsx
git commit -m "feat(wishlist): add universal WishlistProvider with local storage persistence and cart interoperability"

# 2. Archival Cart UI Components (Items List, Saved Archive, Coupons, Ledger, Checkout, Atmosphere, Care, Gift Box, B2B)
git add src/components/cart/CartBackgroundAtmosphere.tsx src/components/cart/CartGarmentCareModal.tsx src/components/cart/CartGiftWrappingOption.tsx src/components/cart/CartB2BGstModal.tsx src/components/cart/CartItemsList.tsx src/components/cart/CartWishlistSection.tsx src/components/cart/CartCouponTab.tsx src/components/cart/CartSummaryLedger.tsx src/components/cart/CartCheckoutSection.tsx src/components/cart/CartLineItem.tsx src/components/cart/CartDrawer.tsx
git commit -m "feat(cart): craft high-editorial cart components with washi atmosphere, care dossiers, Paulownia packaging, B2B GST, and courier lookups"

# 3. Cart & Wishlist Page Routes & Navigation Links
git add src/app/cart/page.tsx src/app/bag/page.tsx src/app/wishlist/page.tsx src/components/layout/SiteHeader.tsx src/components/layout/SiteFooter.tsx
git commit -m "feat(routes): unify /cart, /bag, and /wishlist editorial routes with responsive 2-column layout and header navigation"

# 4. Bank-Level Backend Security, Price Authority & Cryptographic Cart Tokens
git add src/app/api/cart/validate/route.ts src/app/api/checkout/route.ts scripts/commit-cart.ps1
git commit -m "security(cart): implement server pricing authority, cryptographic HMAC cart tokens, fraud scoring, and audit logging"

Write-Host "========================================================" -ForegroundColor Green
Write-Host "  Cart section committed cleanly! Ready to push.         " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green

git push origin main
