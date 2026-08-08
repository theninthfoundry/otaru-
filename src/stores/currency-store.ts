"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR";

const CURRENCY_TO_COUNTRY: Record<CurrencyCode, string> = {
  USD: "US",
  EUR: "DE",
  GBP: "GB",
  INR: "IN",
};

interface CurrencyStore {
  currency: CurrencyCode;
  countryCode: string;
  setCurrency: (currency: CurrencyCode) => void;
}

/**
 * Drives the @inContext(country:) directive on Storefront API queries.
 * Persisted so a returning visitor keeps their currency choice. Changing
 * currency should trigger a re-fetch of price-bearing data — call this from
 * a Server Component boundary (e.g. re-run getArtifacts with the new
 * country) once real multi-currency Shopify markets are configured.
 */
export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currency: "USD",
      countryCode: "US",
      setCurrency: (currency) => set({ currency, countryCode: CURRENCY_TO_COUNTRY[currency] }),
    }),
    { name: "otaru:currency" }
  )
);
