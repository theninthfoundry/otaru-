"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Artifact, ArtifactVariant } from "@/types/shopify";
import { formatMoney } from "@/lib/utils";
import { AddToCart } from "@/components/cart/AddToCart";

/**
 * Mobile sticky bag bar (ASOS/H&M pattern) — appears once the main Add to
 * Bag control scrolls out of view so the primary action is always reachable
 * on small screens without hunting back up the page.
 */
export function StickyAddToCartBar({ artifact, selectedVariant }: { artifact: Artifact; selectedVariant: ArtifactVariant | null }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("primary-add-to-bag");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-30 flex items-center gap-4 border-t border-border bg-surface p-4 md:hidden"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-body-sm">{artifact.title}</p>
            <p className="text-caption text-foreground-muted">
              {formatMoney(artifact.priceRange.minVariantPrice.amount, artifact.priceRange.minVariantPrice.currencyCode)}
            </p>
          </div>
          <div className="w-40">
            <AddToCart merchandiseId={selectedVariant?.id ?? null} disabled={!selectedVariant?.availableForSale} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
