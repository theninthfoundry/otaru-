"use client";

import { useWishlist } from "./WishlistContext";
import { cn } from "@/lib/utils";

export function WishlistButton({ handle, className }: { handle: string; className?: string }) {
  const { has, toggle } = useWishlist();
  const active = has(handle);

  return (
    <button
      onClick={() => toggle(handle)}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={cn("text-body-sm transition-colors duration-1", active ? "text-otaru-ink" : "text-foreground-muted", className)}
    >
      {active ? "♥ Saved" : "♡ Save"}
    </button>
  );
}
