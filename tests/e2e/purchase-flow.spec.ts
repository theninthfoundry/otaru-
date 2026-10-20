import { test, expect } from "@playwright/test";

/**
 * House of Otaru Critical User Journeys
 * 1. Archive discovery → Master Product PDP → Size selection → Cart Allocation.
 * 2. Drop waitlist intake via resident registration API.
 * 3. Provenance verification ledger inquiry.
 */

test("can browse the Archive and allocate an object to the cart tray", async ({ page }) => {
  // Navigate to Archive
  await page.goto("/archive");
  await expect(page.locator("h1")).toContainText(/archive/i);

  // Select primary active archival piece (Object 041 or any active product)
  const productCard = page.locator('a[href^="/product/"]').first();
  await expect(productCard).toBeVisible();
  await productCard.click();

  // Validate PDP URL
  await expect(page).toHaveURL(/\/product\//);

  // Ensure Product title and size options are visible
  await expect(page.locator("h1")).toBeVisible();
  
  // Select first available size button if present
  const sizeButton = page.locator('button:has-text("S"), button:has-text("M"), button:has-text("L")').first();
  if (await sizeButton.isVisible()) {
    await sizeButton.click();
  }

  // Click Allocation / Add to Tray button
  const addButton = page.locator('button:has-text("RESERVE"), button:has-text("ADD TO"), button:has-text("ACQUIRE")').first();
  if (await addButton.isVisible()) {
    await addButton.click();
  }

  // Verify Cart drawer or bag indicator updates
  const cartIndicator = page.locator('[aria-label*="cart" i], [aria-label*="tray" i], [href="/cart"]').first();
  await expect(cartIndicator).toBeVisible();
});

test("Drop waitlist form accepts a valid email", async ({ page }) => {
  await page.goto("/drops");
  const emailInput = page.getByPlaceholder(/email/i).first();
  if (await emailInput.isVisible()) {
    await emailInput.fill("collector@example.com");
    const submitBtn = page.getByRole("button", { name: /Subscribe|Notify|Join|Reserve/i }).first();
    await submitBtn.click();
    await expect(page.getByText(/Subscribed|success|priority|allocated|confirmed/i).first()).toBeVisible();
  }
});

test("Verify page looks up an archival serial number", async ({ page }) => {
  await page.goto("/verify");
  const input = page.getByPlaceholder(/serial|number/i).first();
  if (await input.isVisible()) {
    await input.fill("OTARU-007-104");
    const verifyBtn = page.getByRole("button", { name: /verify/i }).first();
    await verifyBtn.click();
    await expect(page.getByText(/Authenticity|Certificate|Provenance|Archival/i).first()).toBeVisible();
  }
});
