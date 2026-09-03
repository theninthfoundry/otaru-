'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
  JPY: { code: 'JPY', symbol: '¥', rate: 149 },
  INR: { code: 'INR', symbol: '₹', rate: 84 },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (usdAmount: number) => string;
  config: CurrencyConfig;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
  formatPrice: (usd) => `$${usd}`,
  config: CURRENCIES.USD,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('otaru_currency') as CurrencyCode;
      if (saved && CURRENCIES[saved]) {
        setCurrencyState(saved);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCIES[code]) {
      setCurrencyState(code);
      try {
        localStorage.setItem('otaru_currency', code);
      } catch {
        // Ignore localStorage errors
      }
    }
  };

  const config = CURRENCIES[currency];

  const formatPrice = useMemo(() => {
    return (usdAmount: number) => {
      const converted = Math.round(usdAmount * config.rate);
      return `${config.symbol}${converted.toLocaleString('en-US')}`;
    };
  }, [config]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, config }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
