'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import { useConcierge } from '@/lib/concierge';
import { CartItemsList } from '@/components/cart/CartItemsList';
import { CartWishlistSection } from '@/components/cart/CartWishlistSection';
import { CartSummaryLedger } from '@/components/cart/CartSummaryLedger';
import { CartCheckoutSection } from '@/components/cart/CartCheckoutSection';
import { CouponData } from '@/components/cart/CartCouponTab';
import { GiftWrappingData } from '@/components/cart/CartGiftWrappingOption';
import { B2BGstData } from '@/components/cart/CartB2BGstModal';
import { CartBackgroundAtmosphere } from '@/components/cart/CartBackgroundAtmosphere';
import { CartMobileStickyBar } from '@/components/cart/CartMobileStickyBar';

export default function CartPage() {
  const { items, subtotal } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { openConcierge } = useConcierge();
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);
  const [serverCartToken, setServerCartToken] = useState<string>('');

  const [giftData, setGiftData] = useState<GiftWrappingData>({
    enabled: false,
    recipientName: '',
    senderName: '',
    message: '',
    woodenBoxIncluded: false,
  });

  const [b2bData, setB2BData] = useState<B2BGstData>({
    enabled: false,
    gstin: '',
    companyName: '',
    registeredAddress: '',
  });

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  // Financial Calculations for Ledger & Mobile Sticky Dock synchronization
  let discountAmount = 0;
  let isFreeShippingByCoupon = false;

  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round(subtotal * (appliedCoupon.value / 100));
    } else if (appliedCoupon.type === 'flat') {
      discountAmount = Math.min(appliedCoupon.value, subtotal);
    } else if (appliedCoupon.type === 'shipping') {
      isFreeShippingByCoupon = true;
    }
  }

  const giftFee = giftData.enabled ? (subtotal >= 500 ? 0 : 25) : 0;
  const taxableBase = Math.max(0, subtotal - discountAmount);
  const gstAmount = Math.round(taxableBase * 0.12);
  const isFreeShipping = isFreeShippingByCoupon || subtotal >= 250;
  const shippingFee = subtotal === 0 ? 0 : isFreeShipping ? 0 : 15;
  const grandTotal = subtotal === 0 ? 0 : taxableBase + gstAmount + shippingFee + giftFee;

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] pt-24 sm:pt-28 pb-32 lg:pb-20 relative selection:bg-[var(--ink)] selection:text-[var(--paper)] overflow-hidden">
      {/* Bespoke Atmospheric Washi & Coordinate Background */}
      <CartBackgroundAtmosphere />

      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
          <ol className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)]">
            <li>
              <Link href="/" className="hover:text-[var(--ink)] transition-colors">
                Maison
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/archive" className="hover:text-[var(--ink)] transition-colors">
                Archive
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--ink)] font-semibold" aria-current="page">
              Acquisition Tray
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="pb-6 sm:pb-8 mb-6 sm:mb-8 border-b border-hairline flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-[var(--gold)]">
                MOVEMENT XII · ALLOCATION DOSSIER
              </span>
              <span className="text-[var(--hairline-strong)]">·</span>
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
                1907 OTARU CANAL ATELIER
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl text-[var(--ink)] tracking-tight font-normal">
              Your Acquisition Bag
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[var(--ink-muted)] mt-2 max-w-2xl leading-relaxed">
              Review hand-loomed garment allocations, calculate transparent GST tax schedules, apply atelier privilege credentials, and initiate secure dispatch.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => openConcierge('General Inquiry')}
              className="px-3.5 sm:px-4 py-2 border border-hairline bg-[var(--paper-2)]/60 font-mono text-[10px] uppercase tracking-wider text-[var(--ink)] hover:border-[var(--ink)] transition-colors flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
              Consult Concierge
            </button>
            <div className="px-3 py-2 border border-hairline bg-[var(--paper)] font-mono text-[10px] text-[var(--ink-muted)]">
              HOLDINGS: <strong className="text-[var(--ink)]">{totalItems}</strong> | SAVED: <strong className="text-[var(--ink)]">{wishlistCount}</strong>
            </div>
          </div>
        </div>

        {/* Master 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (Items List & Wishlist Section) */}
          <section className="lg:col-span-7 xl:col-span-8 space-y-6" aria-label="Garments in Tray and Wishlist">
            {/* Active Items List with Dynamic Sizes and Care Dossiers */}
            <CartItemsList />

            {/* Integrated Wishlist Section with Shareable URL and Loom Alerts */}
            <CartWishlistSection />

            {/* Atelier Studio Stewardship Notes */}
            <div className="p-5 sm:p-6 border border-hairline bg-[var(--paper-2)]/40 mt-6 sm:mt-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs text-[var(--gold)]">⟡</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink)] font-semibold">
                  Atelier Dispatch Invariant
                </span>
              </div>
              <p className="text-xs text-[var(--ink-muted)] font-sans leading-relaxed">
                Garments are dispatched in custom washi paper folders packed into solid paulownia wood boxes. Each acquisition includes a numbered physical provenance passport registered permanently in our canal studio ledger.
              </p>
              <div className="mt-4 pt-3 border-t border-hairline/60 flex flex-wrap gap-3 sm:gap-4 text-[10px] font-mono text-[var(--ink-muted)]">
                <span>Direct Studio Support: atelier@otaru.jp</span>
                <span>·</span>
                <Link href="/shipping-exchanges" className="underline hover:text-[var(--ink)]">
                  Dispatch &amp; Freight Standards
                </Link>
                <span>·</span>
                <Link href="/returns" className="underline hover:text-[var(--ink)]">
                  Archival Exchange Policy
                </Link>
              </div>
            </div>
          </section>

          {/* Right Column (Ledger, Coupon Tab, GST, Gift Box, B2B and Checkout Section) */}
          <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32 space-y-2" aria-label="Order Financial Ledger and Checkout">
            {/* Order Ledger with GST Breakdown, Paulownia Box, B2B ITC & Voucher Tab */}
            <CartSummaryLedger
              appliedCoupon={appliedCoupon}
              onApplyCoupon={setAppliedCoupon}
              giftData={giftData}
              onGiftDataChange={setGiftData}
              b2bData={b2bData}
              onB2BDataChange={setB2BData}
              onServerValidated={({ cartToken }) => setServerCartToken(cartToken)}
            />

            {/* Checkout Section & Express Rails */}
            <CartCheckoutSection
              appliedCoupon={appliedCoupon}
              giftData={giftData}
              b2bData={b2bData}
              cartToken={serverCartToken}
            />
          </aside>
        </div>
      </main>

      {/* Luxury Mobile Sticky Checkout Dock (SSENSE / Lemaire editorial style) */}
      <CartMobileStickyBar
        grandTotal={grandTotal}
        subtotal={subtotal}
        discountAmount={discountAmount}
        gstAmount={gstAmount}
        shippingFee={shippingFee}
        giftFee={giftFee}
        appliedCoupon={appliedCoupon}
        cartToken={serverCartToken}
      />
    </div>
  );
}
