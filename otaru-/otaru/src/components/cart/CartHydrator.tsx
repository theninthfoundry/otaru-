"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";

/** Rehydrates the cart from localStorage + Shopify on first client mount. */
export function CartHydrator() {
  const hydrate = useCartStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
