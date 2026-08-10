"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Artifact } from "@/types/shopify";
import { AddToCart } from "@/components/cart/AddToCart";
import { SizeGuideModal } from "./SizeGuideModal";
import { StockIndicator } from "./StockIndicator";
import { StickyAddToCartBar } from "./StickyAddToCartBar";
import { DeliveryReturnsInfo } from "./DeliveryReturnsInfo";

export function ArtifactVariants({ artifact }: { artifact: Artifact }) {
  const sizeOption = artifact.options.find((o) => o.name === "Size");
  const [selectedSize, setSelectedSize] = useState<string | null>(sizeOption?.values[0] ?? null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const selectedVariant = useMemo(
    () => artifact.variants.find((v) => v.selectedOptions.some((o) => o.name === "Size" && o.value === selectedSize)) ?? null,
    [artifact.variants, selectedSize]
  );

  return (
    <div className="space-y-6">
      {sizeOption && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-caption tracking-widest uppercase text-foreground-muted">Size</p>
            <button onClick={() => setSizeGuideOpen(true)} className="text-caption underline underline-offset-2">
              Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizeOption.values.map((size) => {
              const variant = artifact.variants.find((v) => v.selectedOptions.some((o) => o.value === size));
              const available = variant?.availableForSale ?? false;
              return (
                <button
                  key={size}
                  disabled={!available}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "h-11 min-w-11 rounded-sm border px-3 text-body-sm transition-colors duration-0",
                    selectedSize === size ? "border-otaru-ink bg-otaru-ink text-otaru-chalk" : "border-border-strong",
                    !available && "cursor-not-allowed opacity-30 line-through"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <StockIndicator variant={selectedVariant} />

      <div id="primary-add-to-bag">
        <AddToCart merchandiseId={selectedVariant?.id ?? null} disabled={!selectedVariant?.availableForSale} />
      </div>

      <DeliveryReturnsInfo />

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      <StickyAddToCartBar artifact={artifact} selectedVariant={selectedVariant} />
    </div>
  );
}
