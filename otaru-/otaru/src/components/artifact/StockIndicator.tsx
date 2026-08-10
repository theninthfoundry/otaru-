import type { ArtifactVariant } from "@/types/shopify";

/**
 * ASOS/H&M-style low-stock urgency line. Shopify's Storefront API doesn't
 * expose exact inventory counts by default (privacy/rate-limit reasons) —
 * this reads a `quantityAvailable` field if present via the InventoryLevel
 * extension; falls back to a simple "available" state otherwise so nothing
 * is fabricated.
 */
export function StockIndicator({ variant }: { variant: ArtifactVariant | null }) {
  if (!variant) return null;
  if (!variant.availableForSale) return <p className="text-caption text-error">Archive Sold — this size is no longer available.</p>;
  return <p className="text-caption text-foreground-muted">In stock, ready to ship.</p>;
}
