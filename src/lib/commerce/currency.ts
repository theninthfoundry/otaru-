/**
 * OTARU — Multi-Currency FX Engine & Minor Unit Formatter
 * Provides deterministic currency conversion, symbol resolution, and integer-safe formatting.
 */

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'INR';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  locale: string;
  minorUnitFactor: number; // e.g. 100 for USD/EUR/INR/CAD/GBP, 1 for JPY
  countryCode: string;
}

export const CURRENCY_CONFIGS: Record<SupportedCurrency, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    minorUnitFactor: 100,
    countryCode: 'US',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'de-DE',
    minorUnitFactor: 100,
    countryCode: 'FR',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
    minorUnitFactor: 100,
    countryCode: 'GB',
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    locale: 'ja-JP',
    minorUnitFactor: 1, // JPY has no minor unit subdivision
    countryCode: 'JP',
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    locale: 'en-CA',
    minorUnitFactor: 100,
    countryCode: 'CA',
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    locale: 'en-IN',
    minorUnitFactor: 100,
    countryCode: 'IN',
  },
};

/**
 * Baseline Base USD Exchange Rates (Updated daily via FX feed / cache fallback)
 */
export const BASELINE_USD_RATES: Record<SupportedCurrency, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 154.5,
  CAD: 1.36,
  INR: 86.5,
};

/**
 * Converts an amount in minor units from one currency to another using integer precision.
 */
export function convertMinorAmount(
  amountMinor: number,
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency,
  customRates?: Partial<Record<SupportedCurrency, number>>
): number {
  if (fromCurrency === toCurrency) return amountMinor;

  const rates = { ...BASELINE_USD_RATES, ...customRates };
  const fromConfig = CURRENCY_CONFIGS[fromCurrency];
  const toConfig = CURRENCY_CONFIGS[toCurrency];

  // Convert minor units to major units in source currency
  const fromMajor = amountMinor / fromConfig.minorUnitFactor;

  // Convert to USD base major
  const usdMajor = fromCurrency === 'USD' ? fromMajor : fromMajor / rates[fromCurrency];

  // Convert from USD to target currency major
  const toMajor = toCurrency === 'USD' ? usdMajor : usdMajor * rates[toCurrency];

  // Convert back to target minor units and round deterministically
  return Math.round(toMajor * toConfig.minorUnitFactor);
}

/**
 * Formats a minor unit amount into a localized luxury price string.
 * e.g., formatPrice(28000, 'USD') -> "$280.00"
 * e.g., formatPrice(42000, 'JPY') -> "¥42,000"
 */
export function formatPrice(
  amountMinor: number,
  currency: SupportedCurrency = 'USD'
): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
  const majorAmount = amountMinor / config.minorUnitFactor;

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: config.minorUnitFactor === 1 ? 0 : 2,
    maximumFractionDigits: config.minorUnitFactor === 1 ? 0 : 2,
  }).format(majorAmount).replace(/\uFFE5/g, '¥');
}

/**
 * Returns currency symbol for quick HUD/badge renderings.
 */
export function getCurrencySymbol(currency: SupportedCurrency): string {
  return CURRENCY_CONFIGS[currency]?.symbol || '$';
}
