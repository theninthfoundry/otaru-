'use client';

import React from 'react';
import { CartProvider } from '@/lib/cart';
import { CurrencyProvider } from '@/lib/currency';
import { ConciergeProvider } from '@/lib/concierge';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ArchivePageTransition } from '@/components/ui/ArchivePageTransition';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <CartProvider>
        <ConciergeProvider>
          <ArchivePageTransition>
            {children}
          </ArchivePageTransition>
          <CartDrawer />
        </ConciergeProvider>
      </CartProvider>
    </CurrencyProvider>
  );
}
