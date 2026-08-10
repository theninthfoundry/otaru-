"use client";

import Image from "next/image";
import { MOCK_ARTIFACTS } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

/** ASOS/H&M "you might also like" strip inside the bag drawer — small, low-friction add. */
export function CartCrossSell() {
  const addItem = useCartStore((s) => s.addItem);
  const suggestions = MOCK_ARTIFACTS.slice(0, 3);

  return (
    <div className="border-t border-border pt-4">
      <p className="otaru-eyebrow mb-3">You might also like</p>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {suggestions.map((artifact) => {
          const image = artifact.images[0];
          const variant = artifact.variants.find((v) => v.availableForSale);
          return (
            <button
              key={artifact.id}
              onClick={() => variant && addItem(variant.id)}
              disabled={!variant}
              className="w-24 shrink-0 text-left disabled:opacity-40"
            >
              {image && (
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-surface-alt mb-1">
                  <Image src={image.url} alt={image.altText ?? artifact.title} fill sizes="96px" className="object-cover" />
                </div>
              )}
              <p className="truncate text-caption">{artifact.title}</p>
              <p className="text-caption text-foreground-muted">{formatMoney(artifact.priceRange.minVariantPrice.amount)}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
