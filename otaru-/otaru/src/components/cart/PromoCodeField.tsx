"use client";

import { useState } from "react";

/**
 * Discount code entry. Shopify's cartDiscountCodesUpdate mutation is the
 * real integration point — this UI is wired to call it once the mutation
 * document is added to shopify-queries.ts; currently validates format only
 * and shows the applied state optimistically.
 */
export function PromoCodeField() {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  if (applied) {
    return (
      <div className="flex items-center justify-between text-body-sm">
        <span>Promo code <span className="font-medium">{applied}</span> applied</span>
        <button onClick={() => setApplied(null)} className="text-caption underline underline-offset-2 text-foreground-muted">
          Remove
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-body-sm underline underline-offset-2 text-foreground-muted">
        Add promo code
      </button>
    );
  }

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (code.trim()) setApplied(code.trim().toUpperCase());
      }}
    >
      <input
        autoFocus
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter code"
        className="h-10 flex-1 rounded-sm border border-border-strong bg-surface px-3 text-body-sm focus:outline-none focus:border-otaru-ink"
      />
      <button type="submit" className="h-10 rounded-sm border border-otaru-ink px-4 text-body-sm">
        Apply
      </button>
    </form>
  );
}
