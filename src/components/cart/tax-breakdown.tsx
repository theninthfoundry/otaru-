"use client";

import { useMemo } from "react";
import { calculateTaxAndDuties } from "@/lib/commerce/tax";
import { formatPrice, type SupportedCurrency } from "@/lib/commerce/currency";

interface TaxBreakdownProps {
  subtotalMinor: number;
  countryCode?: string;
  currency?: SupportedCurrency;
}

export function TaxBreakdown({
  subtotalMinor,
  countryCode = "US",
  currency = "USD",
}: TaxBreakdownProps) {
  const taxInfo = useMemo(
    () => calculateTaxAndDuties(subtotalMinor, countryCode, currency),
    [subtotalMinor, countryCode, currency]
  );

  return (
    <div className="space-y-1.5 border-t border-border/50 pt-2 font-mono text-[11px] text-muted-foreground">
      <div className="flex justify-between items-center">
        <span>Estimated Duties & VAT ({taxInfo.countryCode}):</span>
        <span className="text-foreground font-semibold">
          {taxInfo.totalTaxAndDutiesMinor === 0
            ? "Included (De Minimis)"
            : formatPrice(taxInfo.totalTaxAndDutiesMinor, currency)}
        </span>
      </div>

      <div className="flex justify-between items-center text-[10px] text-muted-foreground/70">
        <span>Customs Classification:</span>
        <span className="uppercase tracking-widest text-emerald-400">
          {taxInfo.isDDP ? "DDP Pre-Cleared" : "DDU"}
        </span>
      </div>
    </div>
  );
}
