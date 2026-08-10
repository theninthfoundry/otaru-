import { test, expect } from "@playwright/test";

/**
 * Critical purchase flow: Archive → Artifact detail → Add to Bag → Bag drawer.
 * Runs against the mock data layer by default (no Shopify credentials
 * required in CI) — see src/lib/mock-data.ts.
 */
test("can browse the Archive and add an Artifact to the bag", async ({ page }) => {
  await page.goto("/archive");
  await expect(page.getByRole("heading", { name: "Archive" })).toBeVisible();

  await page.getByRole("link", { name: /Raw Denim Chore Coat/i }).click();
  await expect(page).toHaveURL(/\/artifact\/raw-denim-chore-coat/);

  await page.getByRole("button", { name: "S" }).click();
  await page.getByRole("button", { name: "Add to Bag" }).click();

  await expect(page.getByRole("heading", { name: "Bag" })).toBeVisible();
  await expect(page.getByText("Raw Denim Chore Coat")).toBeVisible();
});

test("Drop waitlist form accepts a valid email", async ({ page }) => {
  await page.goto("/drops");
  await page.getByPlaceholder("Email for priority access").fill("collector@example.com");
  await page.getByRole("button", { name: "Notify Me" }).click();
  await expect(page.getByText(/priority waitlist/i)).toBeVisible();
});

test("Verify page looks up a serial number", async ({ page }) => {
  await page.goto("/verify");
  await page.getByPlaceholder("Enter garment serial number").fill("OT-2026-0001");
  await page.getByRole("button", { name: "Verify" }).click();
  await expect(page.getByText("Certificate of Authenticity")).toBeVisible();
});
