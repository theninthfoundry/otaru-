"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface CardData {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
  billingSameAsShipping: boolean;
}

function detectCardBrand(number: string): "visa" | "mastercard" | "amex" | "unknown" {
  const digits = number.replace(/\s/g, "");
  if (/^4/.test(digits)) return "visa";
  if (/^5[1-5]/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  return "unknown";
}

function formatCardNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
}

/**
 * Raw card form UI. Real card capture must never touch your own server —
 * this should mount inside a PCI-compliant iframe (Stripe Elements,
 * Braintree Hosted Fields, Shopify's own card fields) in production. The
 * fields here are for layout/UX only.
 */
export function CardForm({ data, onChange }: { data: CardData; onChange: (data: CardData) => void }) {
  const [brand, setBrand] = useState<ReturnType<typeof detectCardBrand>>("unknown");

  function update<K extends keyof CardData>(key: K, value: CardData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          placeholder="Card number"
          value={data.number}
          onChange={(e) => {
            const formatted = formatCardNumber(e.target.value);
            update("number", formatted);
            setBrand(detectCardBrand(formatted));
          }}
          inputMode="numeric"
          className="h-12 w-full rounded-sm border border-border-strong bg-surface px-3 pr-16 text-body-md focus:outline-none focus:border-otaru-ink"
        />
        {brand !== "unknown" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-caption uppercase tracking-wide text-foreground-muted">
            {brand}
          </span>
        )}
      </div>

      <input
        placeholder="Name on card"
        value={data.name}
        onChange={(e) => update("name", e.target.value)}
        className="h-12 w-full rounded-sm border border-border-strong bg-surface px-3 text-body-md focus:outline-none focus:border-otaru-ink"
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="MM / YY"
          value={data.expiry}
          onChange={(e) => update("expiry", e.target.value)}
          className="h-12 rounded-sm border border-border-strong bg-surface px-3 text-body-md focus:outline-none focus:border-otaru-ink"
        />
        <input
          placeholder="CVC"
          value={data.cvc}
          onChange={(e) => update("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
          inputMode="numeric"
          className="h-12 rounded-sm border border-border-strong bg-surface px-3 text-body-md focus:outline-none focus:border-otaru-ink"
        />
      </div>

      <label className={cn("flex items-center gap-2 text-body-sm")}>
        <input
          type="checkbox"
          checked={data.billingSameAsShipping}
          onChange={(e) => update("billingSameAsShipping", e.target.checked)}
          className="h-4 w-4"
        />
        Billing address same as shipping
      </label>
    </div>
  );
}
