/**
 * OTARU — Cross-Border Tax, Customs & Duties Engine
 * Computes deterministic import duties, VAT, and sales taxes across global shipping destinations.
 */

export interface TaxCalculationResult {
  countryCode: string;
  subtotalMinor: number;
  taxRatePercent: number;
  taxAmountMinor: number;
  dutiesRatePercent: number;
  dutiesAmountMinor: number;
  totalTaxAndDutiesMinor: number;
  isDDP: boolean; // Delivered Duty Paid
  description: string;
}

export interface CountryTaxConfig {
  vatRate: number; // e.g. 0.20 for 20%
  dutyRate: number; // e.g. 0.12 for 12%
  deMinimisUsd: number; // Threshold below which no duties/tax apply
  description: string;
}

export const COUNTRY_TAX_CONFIGS: Record<string, CountryTaxConfig> = {
  US: { vatRate: 0.0, dutyRate: 0.0, deMinimisUsd: 800, description: 'US State Sales Tax (Exempt < $800)' },
  GB: { vatRate: 0.20, dutyRate: 0.12, deMinimisUsd: 175, description: 'UK 20% Standard VAT + 12% Apparel Duty' },
  FR: { vatRate: 0.20, dutyRate: 0.12, deMinimisUsd: 150, description: 'EU 20% VAT + 12% Common Customs Tariff' },
  DE: { vatRate: 0.19, dutyRate: 0.12, deMinimisUsd: 150, description: 'EU 19% MwSt + 12% Common Customs Tariff' },
  JP: { vatRate: 0.10, dutyRate: 0.08, deMinimisUsd: 100, description: 'Japan 10% JCT + 8% Textile Tariff' },
  CA: { vatRate: 0.13, dutyRate: 0.18, deMinimisUsd: 20, description: 'Canada 13% HST/GST + 18% Textile Duty' },
  IN: { vatRate: 0.12, dutyRate: 0.0, deMinimisUsd: 0, description: 'India 12% Luxury Apparel GST' },
};

/**
 * Calculates itemized taxes and customs duties for a given destination country and subtotal.
 */
export function calculateTaxAndDuties(
  subtotalMinor: number,
  countryCode = 'US',
  currency = 'USD'
): TaxCalculationResult {
  const code = countryCode.toUpperCase();
  const config = COUNTRY_TAX_CONFIGS[code] || {
    vatRate: 0.15,
    dutyRate: 0.10,
    deMinimisUsd: 100,
    description: 'International Standard Duty & Import Assessment',
  };

  // Check de minimis threshold in major units (assuming base comparison)
  const subtotalMajor = subtotalMinor / 100;
  let taxAmountMinor = 0;
  let dutiesAmountMinor = 0;

  if (subtotalMajor >= config.deMinimisUsd) {
    taxAmountMinor = Math.round(subtotalMinor * config.vatRate);
    dutiesAmountMinor = Math.round(subtotalMinor * config.dutyRate);
  }

  const totalTaxAndDutiesMinor = taxAmountMinor + dutiesAmountMinor;

  return {
    countryCode: code,
    subtotalMinor,
    taxRatePercent: config.vatRate * 100,
    taxAmountMinor,
    dutiesRatePercent: config.dutyRate * 100,
    dutiesAmountMinor,
    totalTaxAndDutiesMinor,
    isDDP: true, // All Otaru shipments include pre-cleared DDP customs
    description: config.description,
  };
}
