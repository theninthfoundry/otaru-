"use client";

import { useCurrencyStore, type CurrencyCode } from "@/stores/currency-store";
import { CURRENCY_CONFIGS } from "@/lib/commerce/currency";

const CURRENCIES: CurrencyCode[] = ["USD", "EUR", "GBP", "JPY", "CAD", "INR"];

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrencyStore();

  return (
    <div className="relative inline-flex items-center">
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        aria-label="Select Currency"
        className="appearance-none cursor-pointer border-none bg-transparent pr-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
      >
        {CURRENCIES.map((c) => {
          const config = CURRENCY_CONFIGS[c];
          return (
            <option key={c} value={c} className="bg-background text-foreground py-1">
              {config.symbol} {c}
            </option>
          );
        })}
      </select>
      <span className="pointer-events-none absolute right-0 text-[9px] text-muted-foreground opacity-60">
        ▼
      </span>
    </div>
  );
}
