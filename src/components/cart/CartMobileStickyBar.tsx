'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { useCurrency } from '@/lib/currency';
import { CouponData } from './CartCouponTab';

interface CartMobileStickyBarProps {
  grandTotal: number;
  subtotal: number;
  discountAmount: number;
  gstAmount: number;
  shippingFee: number;
  giftFee: number;
  appliedCoupon: CouponData | null;
  cartToken?: string;
}

/**
 * CartMobileStickyBar
 * 
 * Premier mobile e-commerce checkout dock (as featured in SSENSE, Lemaire, and Net-a-Porter):
 * - Fixed bottom position on mobile screens (<1024px)
 * - Real-time Grand Total with 1-tap expandable breakdown sheet
 * - Instant "Proceed to Checkout" thumb trigger
 * - Safe area inset support for modern mobile devices
 */
export function CartMobileStickyBar({
  grandTotal,
  subtotal,
  discountAmount,
  gstAmount,
  shippingFee,
  giftFee,
  appliedCoupon,
  cartToken,
}: CartMobileStickyBarProps) {
  const { items } = useCart();
  const { formatPrice } = useCurrency();
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);

  const totalGarments = items.reduce((sum, item) => sum + item.qty, 0);
  const hasItems = items.length > 0;

  if (!hasItems) return null;

  const checkoutHref = cartToken
    ? `/checkout?token=${encodeURIComponent(cartToken)}`
    : '/checkout';

  return (
    <>
      {/* Expandable Bottom Sheet Backdrop */}
      {isBreakdownOpen && (
        <div
          className="fixed inset-0 z-[120] bg-[var(--ink)]/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsBreakdownOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Expandable Breakdown Drawer (Mobile) */}
      {isBreakdownOpen && (
        <div
          className="fixed bottom-[calc(70px+env(safe-area-inset-bottom,0px))] left-0 right-0 z-[125] bg-[var(--paper)] text-[var(--ink)] border-t border-[var(--hairline-strong)] p-5 shadow-2xl lg:hidden animate-in slide-in-from-bottom duration-200"
          role="dialog"
          aria-label="Order breakdown sheet"
        >
          {/* Subtle Pull Indicator Pill */}
          <div className="w-10 h-1 bg-[var(--hairline-strong)] rounded-full mx-auto mb-4 opacity-60" />

          <div className="flex items-center justify-between pb-3 border-b border-hairline mb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--gold)] font-medium">
              Ledger Summary Breakdown
            </span>
            <button
              type="button"
              onClick={() => setIsBreakdownOpen(false)}
              className="font-mono text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] p-1.5 active:scale-95 transition-transform"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2.5 font-mono text-xs text-[var(--ink-muted)]">
            <div className="flex justify-between items-center text-[var(--ink)]">
              <span>Garment Subtotal ({totalGarments} {totalGarments === 1 ? 'pc' : 'pcs'})</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-emerald-800">
                <span>◈ {appliedCoupon?.name || 'Voucher Privilege'}</span>
                <span>−{formatPrice(discountAmount)}</span>
              </div>
            )}

            {giftFee > 0 && (
              <div className="flex justify-between items-center text-[var(--ink)]">
                <span>Paulownia Wood Crate Packaging</span>
                <span>{formatPrice(giftFee)}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span>GST 12% Schedule (Apparel HSN 6201)</span>
              <span>{formatPrice(gstAmount)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Insured Air Courier</span>
              <span className={shippingFee === 0 ? 'text-emerald-800 font-semibold' : ''}>
                {shippingFee === 0 ? 'COMPLIMENTARY' : formatPrice(shippingFee)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Bottom Dock (Mobile Only) */}
      <aside
        className="fixed bottom-0 left-0 right-0 z-[130] bg-[var(--paper)]/95 backdrop-blur-md border-t border-[var(--hairline-strong)] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))] lg:hidden shadow-[0_-8px_24px_rgba(0,0,0,0.08)]"
        aria-label="Mobile Checkout Dock"
      >
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          {/* Price & Breakdown Trigger */}
          <div
            className="cursor-pointer select-none active:opacity-75 transition-opacity"
            onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsBreakdownOpen(!isBreakdownOpen);
              }
            }}
          >
            <div className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[var(--ink-muted)]">
              <span>Total Payable</span>
              <span className="text-[10px] text-[var(--gold)]">
                {isBreakdownOpen ? '▼' : '▲'}
              </span>
            </div>
            <div className="font-display text-xl text-[var(--ink)] font-normal leading-tight">
              {formatPrice(grandTotal)}
            </div>
            <div className="font-mono text-[8px] text-[var(--ink-muted)] tracking-tight">
              12% GST &amp; Insured Dispatch Included
            </div>
          </div>

          {/* Checkout CTA Button */}
          <Link
            href={checkoutHref}
            className="flex-1 max-w-[210px] py-3 text-center bg-[var(--indigo)] text-white font-mono text-[11px] uppercase tracking-[0.18em] shadow-sm hover:bg-[var(--indigo-hover)] active:scale-[0.98] transition-all"
          >
            Proceed to Checkout →
          </Link>
        </div>
      </aside>
    </>
  );
}
