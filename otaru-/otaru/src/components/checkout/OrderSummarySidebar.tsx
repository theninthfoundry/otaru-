"use client";

import Image from "next/image";
import { useState } from "react";
import { formatMoney } from "@/lib/utils";
import type { Cart } from "@/types/shopify";

/**
 * Sticky order summary (visible throughout checkout — ASOS keeps cart
 * contents in sight the whole time, per Baymard's "no new costs at review"
 * guidance: shipping/taxes should already be reflected here, not sprung
 * on the review step).
 */
export function OrderSummarySidebar({ cart, shippingCost = 0 }: { cart: Cart; shippingCost?: number }) {
  const [expanded, setExpanded] = useState(false);
  const subtotal = parseFloat(cart.cost.subtotalAmount.amount);
  const total = subtotal + shippingCost;
  const currency = cart.cost.subtotalAmount.currencyCode;

  return (
    <div className="rounded-sm border border-border bg-surface-alt p-6 md:sticky md:top-32">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between text-body-sm md:hidden mb-4"
      >
        <span>{expanded ? "Hide" : "Show"} order summary · {cart.totalQuantity} items</span>
        <span>{formatMoney(total, currency)}</span>
      </button>

      <div className={`${expanded ? "block" : "hidden"} md:block`}>
        <div className="space-y-4 mb-6">
          {cart.lines.map((line) => {
            const image = line.merchandise.product.images[0];
            return (
              <div key={line.id} className="flex gap-3">
                {image && (
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-sm bg-surface">
                    <Image src={image.url} alt={image.altText ?? line.merchandise.product.title} fill sizes="56px" className="object-cover" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-otaru-ink text-caption text-otaru-chalk">
                      {line.quantity}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-body-sm">{line.merchandise.product.title}</p>
                  <p className="text-caption text-foreground-muted">{line.merchandise.title}</p>
                </div>
                <p className="text-body-sm">{formatMoney(line.merchandise.price.amount, line.merchandise.price.currencyCode)}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-2 border-t border-border pt-4 text-body-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shippingCost > 0 ? formatMoney(shippingCost, currency) : "Free"}</span>
          </div>
          <div className="flex justify-between text-body-md font-medium pt-2 border-t border-border">
            <span>Total</span>
            <span>{formatMoney(total, currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
