"use client";

import { useState } from "react";
import type { CartLine } from "@/lib/types/cart";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

function formatCents(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export function CartLineItem({
  line,
  currency,
  onUpdateQuantity,
  onRemove,
}: {
  line: CartLine;
  currency: string;
  onUpdateQuantity: (lineId: string, quantity: number) => Promise<void>;
  onRemove: (lineId: string) => Promise<void>;
}) {
  const [pending, setPending] = useState(false);

  async function change(delta: number) {
    setPending(true);
    await onUpdateQuantity(line.lineId, line.quantity + delta);
    setPending(false);
  }

  async function remove() {
    setPending(true);
    await onRemove(line.lineId);
    // no need to setPending(false) — the line unmounts once removed
  }

  return (
    <li className={`flex gap-4 py-5 ${pending ? "opacity-60" : ""}`}>
      <ImagePlaceholder ratio="portrait" label={line.imageLabel} className="w-20 flex-shrink-0" />

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-[var(--otaru-parchment)]">{line.name}</p>
            {line.variantLabel && (
              <p className="mt-0.5 text-[0.76rem] text-[var(--otaru-parchment-dim)]">{line.variantLabel}</p>
            )}
          </div>
          <p className="text-sm text-[var(--otaru-parchment)]">
            {formatCents(line.unitPriceCents * line.quantity, currency)}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div
            className="flex items-center border border-[var(--otaru-line-strong)]"
            role="group"
            aria-label={`Quantity for ${line.name}`}
          >
            <button
              type="button"
              disabled={pending || line.quantity <= 1}
              onClick={() => change(-1)}
              aria-label="Decrease quantity"
              className="h-8 w-8 text-[var(--otaru-parchment-dim)] transition-colors hover:text-[var(--otaru-parchment)] disabled:opacity-30"
            >
              −
            </button>
            <span className="w-8 text-center text-sm text-[var(--otaru-parchment)]" aria-live="polite">
              {line.quantity}
            </span>
            <button
              type="button"
              disabled={pending || line.quantity >= line.maxQuantity}
              onClick={() => change(1)}
              aria-label="Increase quantity"
              className="h-8 w-8 text-[var(--otaru-parchment-dim)] transition-colors hover:text-[var(--otaru-parchment)] disabled:opacity-30"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className="text-[0.72rem] uppercase tracking-[0.08em] text-[var(--otaru-parchment-dim)] underline-offset-2 hover:text-[var(--otaru-torii)] hover:underline"
          >
            Remove
          </button>
        </div>

        {line.quantity >= line.maxQuantity && (
          <p className="mt-1.5 text-[0.72rem] text-[var(--otaru-gold-dim)]">Only {line.maxQuantity} left.</p>
        )}
      </div>
    </li>
  );
}
