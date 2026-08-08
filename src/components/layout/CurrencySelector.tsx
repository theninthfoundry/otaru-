"use client";

import { useCurrencyStore, type CurrencyCode } from "@/stores/currency-store";

const CURRENCIES: CurrencyCode[] = ["USD", "EUR", "GBP", "INR"];

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrencyStore();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
      aria-label="Currency"
      className="border-none bg-transparent text-body-sm focus:outline-none"
    >
      {CURRENCIES.map((c) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  );
}
