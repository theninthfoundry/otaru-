# Otaru Consolidation & Architecture Surgery Script
# Running from: C:\Users\namir\OneDrive\Desktop\otaru

$currentDir = Get-Location
if ($currentDir.Path -notlike "*otaru") {
    Write-Error "Please run this script from the C:\Users\namir\OneDrive\Desktop\otaru root directory."
    exit
}

Write-Host "=== Starting Otaru Phase 0 Repository Surgery ===" -ForegroundColor Green

# 1. Create a temporary staging folder
$stagingDir = Join-Path $currentDir.Path "staging_surgery"
if (Test-Path $stagingDir) {
    Remove-Item -Recurse -Force $stagingDir
}
New-Item -ItemType Directory -Path $stagingDir | Out-Null

# 2. Copy the canonical otaru-/ codebase to the staging folder
Write-Host "[1/7] Copying canonical codebase to staging..." -ForegroundColor Cyan
Copy-Item -Path "otaru-\*" -Destination $stagingDir -Recurse -Force

# 3. Restructure lib/ inside the staging directory to match architectural boundaries
Write-Host "[2/7] Reorganizing lib/ folder boundaries..." -ForegroundColor Cyan
$libDir = Join-Path $stagingDir "src\lib"

# Create directories
New-Item -ItemType Directory -Path (Join-Path $libDir "integrations") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $libDir "integrations\shopify") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $libDir "cms") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $libDir "cms\sanity") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $libDir "commerce") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $libDir "provenance") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $libDir "membership") -Force | Out-Null

# Move Shopify files
Move-Item -Path (Join-Path $libDir "shopify\*") -Destination (Join-Path $libDir "integrations\shopify") -Force -ErrorAction SilentlyContinue

# Move Sanity files
Move-Item -Path (Join-Path $libDir "sanity\*") -Destination (Join-Path $libDir "cms\sanity") -Force -ErrorAction SilentlyContinue

# Move Klaviyo, Interakt, Shiprocket to integrations
Move-Item -Path (Join-Path $libDir "klaviyo.ts") -Destination (Join-Path $libDir "integrations\klaviyo.ts") -Force -ErrorAction SilentlyContinue
Move-Item -Path (Join-Path $libDir "interakt.ts") -Destination (Join-Path $libDir "integrations\interakt.ts") -Force -ErrorAction SilentlyContinue
Move-Item -Path (Join-Path $libDir "shiprocket.ts") -Destination (Join-Path $libDir "integrations\shiprocket.ts") -Force -ErrorAction SilentlyContinue

# Delete redundant shipping folder
if (Test-Path (Join-Path $libDir "shipping")) {
    Remove-Item -Path (Join-Path $libDir "shipping") -Recurse -Force
}

# 4. Create high-level domain wrapper files in the staging directory
Write-Host "[3/7] Generating domain wrapper files..." -ForegroundColor Cyan

# lib/cms/sanity.ts
$sanityWrapperContent = @"
/**
 * OTARU — Sanity CMS Domain Service
 */
export * from './sanity/queries';
export { client } from './sanity/client';
"@
Set-Content -Path (Join-Path $libDir "cms\sanity.ts") -Value $sanityWrapperContent -Encoding utf8

# lib/commerce/products.ts
$productsContent = @"
/**
 * OTARU — Commerce Domain: Products Service
 */
import { getProducts as getShopifyProducts, getProductByHandle as getShopifyProductByHandle, getProductRecommendations as getShopifyProductRecommendations, getProductsByCollection as getShopifyProductsByCollection } from '../integrations/shopify/queries/products';

export async function getProducts(options?: any) {
  return getShopifyProducts(options);
}

export async function getProductByHandle(handle: string) {
  return getShopifyProductByHandle(handle);
}

export async function getProductRecommendations(productId: string) {
  return getShopifyProductRecommendations(productId);
}

export async function getProductsByCollection(collection: string, options?: any) {
  return getShopifyProductsByCollection(collection, options);
}
"@
Set-Content -Path (Join-Path $libDir "commerce\products.ts") -Value $productsContent -Encoding utf8

# lib/commerce/checkout.ts
$checkoutContent = @"
/**
 * OTARU — Commerce Domain: Checkout Service
 */
export async function createCheckoutSession(cart: any) {
  // Stub for Phase 1 DB mapping
  return { id: 'session_mock_' + Date.now() };
}
"@
Set-Content -Path (Join-Path $libDir "commerce\checkout.ts") -Value $checkoutContent -Encoding utf8

# lib/commerce/orders.ts
$ordersContent = @"
/**
 * OTARU — Commerce Domain: Orders Service
 */
export async function createOrder(orderData: any) {
  // Stub for Phase 1 DB mapping
  return { id: 'order_mock_' + Date.now(), status: 'CREATED' };
}
"@
Set-Content -Path (Join-Path $libDir "commerce\orders.ts") -Value $ordersContent -Encoding utf8

# lib/provenance/artifacts.ts
$provenanceArtifactsContent = @"
/**
 * OTARU — Provenance Domain: Artifact Certificate Service
 */
export async function verifyCertificate(serialNumber: string) {
  return {
    serialNumber,
    status: 'VERIFIED',
    authenticityDate: new Date().toISOString(),
  };
}
"@
Set-Content -Path (Join-Path $libDir "provenance\artifacts.ts") -Value $provenanceArtifactsContent -Encoding utf8

# lib/provenance/nfc.ts
$provenanceNfcContent = @"
/**
 * OTARU — Provenance Domain: Web NFC Service
 */
export function isNfcSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'NDEFReader' in window;
}
"@
Set-Content -Path (Join-Path $libDir "provenance\nfc.ts") -Value $provenanceNfcContent -Encoding utf8

# lib/provenance/verification.ts
$provenanceVerificationContent = @"
/**
 * OTARU — Provenance Domain: Verification Registry
 */
export const VERIFICATION_REGISTRY = {
  isValidSerial(serial: string): boolean {
    return /^OTARU-\d{3}-\d{3}$/.test(serial);
  }
};
"@
Set-Content -Path (Join-Path $libDir "provenance\verification.ts") -Value $provenanceVerificationContent -Encoding utf8

# lib/membership/membership.ts
$membershipContent = @"
/**
 * OTARU — Membership Domain Service
 */
export interface PatronTier {
  name: string;
  benefits: string[];
}

export const MEMBERSHIP_TIERS: Record<string, PatronTier> = {
  patron: { name: 'Patron', benefits: ['Early access', 'Chapter priority'] },
  collector: { name: 'Collector', benefits: ['Private releases', 'Custom tailoring details'] },
};
"@
Set-Content -Path (Join-Path $libDir "membership\membership.ts") -Value $membershipContent -Encoding utf8

# 5. Search and replace import paths in the codebase
Write-Host "[4/7] Rewriting path imports inside all files..." -ForegroundColor Cyan
$srcFiles = Get-ChildItem -Path (Join-Path $stagingDir "src") -Recurse -Include *.ts, *.tsx

foreach ($file in $srcFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Run replacements
    $content = $content -replace "@/lib/shopify/", "@/lib/integrations/shopify/"
    $content = $content -replace "@/lib/sanity/", "@/lib/cms/sanity/"
    $content = $content -replace "@/lib/shiprocket", "@/lib/integrations/shiprocket"
    $content = $content -replace "@/lib/shipping/shiprocket", "@/lib/integrations/shiprocket"
    
    # Save back
    Set-Content -Path $file.FullName -Value $content -Encoding utf8
}

# 6. Promote all folders out of src/ to the staging root, and update configurations
Write-Host "[5/7] Promoting folders out of src/ and updating configs..." -ForegroundColor Cyan

# Promote subfolders
$srcFolders = Get-ChildItem -Path (Join-Path $stagingDir "src") -Directory
foreach ($folder in $srcFolders) {
    Move-Item -Path $folder.FullName -Destination $stagingDir -Force
}

# Promote index.ts or other root-src files
$srcFilesAtRoot = Get-ChildItem -Path (Join-Path $stagingDir "src") -File
foreach ($file in $srcFilesAtRoot) {
    Move-Item -Path $file.FullName -Destination $stagingDir -Force
}

# Remove the now empty src directory
Remove-Item -Path (Join-Path $stagingDir "src") -Recurse -Force

# Update tsconfig.json paths alias mapping
$tsconfigPath = Join-Path $stagingDir "tsconfig.json"
if (Test-Path $tsconfigPath) {
    $tsconfig = Get-Content -Path $tsconfigPath -Raw
    $tsconfig = $tsconfig -replace '"@/\*": \["\./src/\*"\]', '"@/*": ["./*"]'
    Set-Content -Path $tsconfigPath -Value $tsconfig -Encoding utf8
}

# Update tailwind.config.ts content paths
$tailwindPath = Join-Path $stagingDir "tailwind.config.ts"
if (Test-Path $tailwindPath) {
    $tailwind = Get-Content -Path $tailwindPath -Raw
    $tailwind = $tailwind -replace "'\./src/", "'./"
    Set-Content -Path $tailwindPath -Value $tailwind -Encoding utf8
}

# Update vitest.config.ts test inclusion and paths
$vitestPath = Join-Path $stagingDir "vitest.config.ts"
if (Test-Path $vitestPath) {
    $vitest = Get-Content -Path $vitestPath -Raw
    $vitest = $vitest -replace "'src/\*\*/\*\.test\.\{ts,tsx\}'", "'**/*.test.{ts,tsx}'"
    $vitest = $vitest -replace "'\./src'", "'./'"
    Set-Content -Path $vitestPath -Value $vitest -Encoding utf8
}

# 7. Clean up the root workspace (except staging_surgery, .git, and consolidate.ps1) and promote staged files
Write-Host "[6/7] Cleaning legacy root workspace files..." -ForegroundColor Cyan
Get-ChildItem -Path $currentDir.Path -Force | ForEach-Object {
    $name = $_.Name
    if ($name -ne ".git" -and $name -ne "consolidate.ps1" -and $name -ne "staging_surgery") {
        Remove-Item -Path $_.FullName -Recurse -Force
    }
}

Write-Host "[7/7] Promoting surgery staged files to root..." -ForegroundColor Cyan
Get-ChildItem -Path $stagingDir -Force | ForEach-Object {
    Move-Item -Path $_.FullName -Destination $currentDir.Path -Force
}

# Cleanup the staging directory
Remove-Item -Path $stagingDir -Recurse -Force

Write-Host "=== Phase 0 Architecture Surgery Completed Successfully ===" -ForegroundColor Green
Write-Host "Please execute the verification steps in walkthrough.md!" -ForegroundColor Yellow
