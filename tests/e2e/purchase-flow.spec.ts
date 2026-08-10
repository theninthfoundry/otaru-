import { test, expect } from "@playwright/test";

/**
 * Critical purchase flow: Archive → Artifact detail → Add to Bag → Bag page.
 * Runs against mock data layer by default (no external credentials required).
 */
test("can browse the Archive and add an Artifact to the bag", async ({ page }) => {
  await page.goto("/archive");
  await expect(page.getByRole("heading", { name: "Archive" })).toBeVisible();

  await page.getByRole("link", { name: /Raw Denim Chore Coat/i }).first().click();
  await expect(page).toHaveURL(/\/artifact\/artifact-001-denim-jacket/);

  await page.getByRole("button", { name: "S", exact: true }).click();
  await page.getByRole("button", { name: /Add to Bag/i }).click();

  await expect(page.getByRole("heading", { name: "Bag" })).toBeVisible();
  await expect(page.getByText("Raw Denim Chore Coat")).toBeVisible();
});

test("Drop waitlist form accepts a valid email", async ({ page }) => {
  await page.goto("/drops");
  await page.getByPlaceholder(/email/i).first().fill("collector@example.com");
  await page.getByRole("button", { name: /Subscribe|Notify/i }).first().click();
  await expect(page.getByText(/Subscribed|success|priority/i)).toBeVisible();
});

test("Verify page looks up a serial number", async ({ page }) => {
  await page.goto("/verify");
  await page.getByPlaceholder(/Enter Serial Number/i).fill("OTARU-007-104");
  await page.getByRole("button", { name: "Verify Serial" }).click();
  await expect(page.getByText(/Authenticity|Certificate|Provenance/i)).toBeVisible();
});
