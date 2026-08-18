"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type SupportedCurrency, CURRENCY_CONFIGS } from "@/lib/commerce/currency";

export type CurrencyCode = SupportedCurrency;

interface CurrencyStore {
  currency: CurrencyCode;
  countryCode: string;
  setCurrency: (currency: CurrencyCode) => void;
}

/**
 * Global Currency Store
 * Persisted so a returning visitor retains their currency preference.
 * Coordinates with @inContext(country:) on Storefront queries and drives real-time FX formatting.
 */
export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currency: "USD",
      countryCode: "US",
      setCurrency: (currency) =>
        set({
          currency,
          countryCode: CURRENCY_CONFIGS[currency]?.countryCode || "US",
        }),
    }),
    { name: "otaru:currency" }
  )
);
