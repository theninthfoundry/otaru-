"use client";

import Image from "next/image";
import { formatMoney } from "@/lib/utils";
import type { CartLine } from "@/types/shopify";
import { useCartStore } from "@/stores/cart-store";

export function CartItem({ line }: { line: CartLine }) {
  const image = line.merchandise.product.images[0];
  const { updateItem, removeItem, isPending } = useCartStore((s) => ({
    updateItem: s.updateItem,
    removeItem: s.removeItem,
    isPending: s.isPending,
  }));

  return (
    <div className="flex gap-4 py-4 border-b border-border">
      {image && (
        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-surface-alt">
          <Image src={image.url} alt={image.altText ?? line.merchandise.product.title} fill sizes="80px" className="object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-body-sm">{line.merchandise.product.title}</p>
            <p className="text-caption text-foreground-muted">{line.merchandise.title}</p>
          </div>
          <button
            onClick={() => removeItem(line.id)}
            disabled={isPending}
            aria-label="Remove item"
            className="text-caption text-foreground-muted underline underline-offset-2 disabled:opacity-40"
          >
            Remove
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateItem(line.id, Math.max(line.quantity - 1, 1))}
              disabled={isPending}
              className="h-7 w-7 rounded-sm border border-border-strong text-body-sm disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="text-body-sm tabular-nums w-4 text-center">{line.quantity}</span>
            <button
              onClick={() => updateItem(line.id, line.quantity + 1)}
              disabled={isPending}
              className="h-7 w-7 rounded-sm border border-border-strong text-body-sm disabled:opacity-40"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <p className="text-body-sm">{formatMoney(line.merchandise.price.amount, line.merchandise.price.currencyCode)}</p>
        </div>
      </div>
    </div>
  );
}
