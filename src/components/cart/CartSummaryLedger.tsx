'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/lib/cart';
import { useCurrency, CURRENCIES, CurrencyCode } from '@/lib/currency';
import { CouponData, CartCouponTab } from './CartCouponTab';
import { GiftWrappingData, CartGiftWrappingOption } from './CartGiftWrappingOption';
import { B2BGstData, CartB2BGstModal } from './CartB2BGstModal';

const FREE_SHIPPING_THRESHOLD_USD = 250;
const STANDARD_SHIPPING_USD = 15;
const APPAREL_GST_RATE = 0.12; // 12% Luxury Apparel GST (HSN 6201)

interface CartSummaryLedgerProps {
  appliedCoupon: CouponData | null;
  onApplyCoupon: (coupon: CouponData | null) => void;
  giftData: GiftWrappingData;
  onGiftDataChange: (data: GiftWrappingData) => void;
  b2bData: B2BGstData;
  onB2BDataChange: (data: B2BGstData) => void;
  onServerValidated?: (data: { cartToken: string; grandTotal: number }) => void;
}

export function CartSummaryLedger({
  appliedCoupon,
  onApplyCoupon,
  giftData,
  onGiftDataChange,
  b2bData,
  onB2BDataChange,
  onServerValidated,
}: CartSummaryLedgerProps) {
  const { subtotal, items } = useCart();
  const { formatPrice, currency, setCurrency } = useCurrency();
  const [gstMode, setGstMode] = useState<'inter' | 'intra'>('inter');
  const [customsMode, setCustomsMode] = useState<'ddp' | 'ddu'>('ddp'); // Delivered Duty Paid vs Unpaid for global
  const [serverCartToken, setServerCartToken] = useState<string>('');
  const [serverCouponError, setServerCouponError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const totalGarments = items.reduce((sum, item) => sum + item.qty, 0);

  // 1. Calculate Discount
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

  // 2. Gift Packaging Fee (Complimentary if subtotal >= 500)
  const giftFee = giftData.enabled ? (subtotal >= 500 ? 0 : 25) : 0;

  // 3. Taxable Base
  const taxableBase = Math.max(0, subtotal - discountAmount);

  // 4. GST Calculation (12% Apparel Schedule)
  const gstAmount = Math.round(taxableBase * APPAREL_GST_RATE);
  const cgstAmount = Math.round(gstAmount / 2);
  const sgstAmount = gstAmount - cgstAmount;
  const igstAmount = gstAmount;

  // 5. Shipping
  const isFreeShipping = isFreeShippingByCoupon || subtotal >= FREE_SHIPPING_THRESHOLD_USD;
  const shippingFee = subtotal === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_USD;

  // 6. Grand Total
  const grandTotal = subtotal === 0 ? 0 : taxableBase + gstAmount + shippingFee + giftFee;

  // Free shipping progress milestone
  const progressPct = Math.min(100, Math.floor((subtotal / FREE_SHIPPING_THRESHOLD_USD) * 100));
  const diffToFree = Math.max(0, FREE_SHIPPING_THRESHOLD_USD - subtotal);

  // Synchronize with server-side security endpoint
  const validateWithServer = useCallback(async () => {
    if (items.length === 0) {
      setServerCartToken('');
      setServerCouponError(null);
      return;
    }

    setIsValidating(true);
    try {
      const res = await fetch('/api/cart/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, qty: i.qty, size: i.size, price: i.price })),
          couponCode: appliedCoupon?.code || null,
          stateMode: gstMode,
          giftWrapping: giftData.enabled,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setServerCartToken(json.data.cartToken);
          setServerCouponError(json.data.couponError || null);
          if (onServerValidated) {
            onServerValidated({
              cartToken: json.data.cartToken,
              grandTotal: json.data.grandTotal,
            });
          }
        }
      }
    } catch {
      // Gracefully fall back to client computation if offline
    } finally {
      setIsValidating(false);
    }
  }, [items, appliedCoupon, gstMode, giftData.enabled, onServerValidated]);

  useEffect(() => {
    const timer = setTimeout(() => {
      validateWithServer();
    }, 300);
    return () => clearTimeout(timer);
  }, [validateWithServer]);

  return (
    <div className="border border-hairline bg-[var(--paper)] p-6 sm:p-7 relative shadow-sm">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-hairline mb-5">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--gold)] block">
            ACQUISITION DOSSIER
          </span>
          <h2 className="font-display text-xl text-[var(--ink)] font-normal">
            Financial Ledger
          </h2>
        </div>
        <div className="text-right">
          <span className="font-mono text-[9px] text-[var(--ink-muted)] block uppercase tracking-wider">
            SECURITY HASH
          </span>
          <span className="font-mono text-[10px] text-[var(--ink)] font-medium">
            {serverCartToken ? `${serverCartToken.slice(0, 10)}…` : 'HMAC-SHA256'}
          </span>
        </div>
      </div>

      {/* Currency Switcher Widget */}
      <div className="mb-5 pb-4 border-b border-hairline">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
            Valuation Currency:
          </span>
          <span className="font-mono text-[10px] text-[var(--gold)] font-medium">
            {currency} (RATE {CURRENCIES[currency].rate})
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCurrency(c)}
              className={`py-1 text-center font-mono text-[10px] uppercase border transition-colors ${
                currency === c
                  ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)] font-semibold'
                  : 'bg-[var(--paper-2)]/50 text-[var(--ink-muted)] border-hairline hover:border-[var(--ink)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Free Shipping Progress Milestone */}
      {subtotal > 0 && (
        <div className="mb-5 p-3.5 bg-[var(--paper-2)] border border-hairline text-xs">
          <div className="flex justify-between items-center mb-1.5 font-mono text-[10px]">
            <span className="text-[var(--ink)]">
              {isFreeShipping
                ? '✓ Complimentary Global Archival Courier Unlocked'
                : `${formatPrice(diffToFree)} away from complimentary courier`}
            </span>
            <span className="text-[var(--gold)] font-medium">{progressPct}%</span>
          </div>
          <div className="w-full h-1 bg-[var(--hairline)] overflow-hidden">
            <div
              className="h-full bg-[var(--indigo)] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Itemized Financial Breakdown */}
      <div className="space-y-3 font-mono text-xs text-[var(--ink-muted)]">
        {/* Sum of all in carts */}
        <div className="flex justify-between items-center text-sm text-[var(--ink)]">
          <span className="flex items-center gap-1.5">
            <span>Garment Subtotal</span>
            <span className="text-[10px] text-[var(--ink-muted)] font-normal">
              ({totalGarments} {totalGarments === 1 ? 'holding' : 'holdings'})
            </span>
          </span>
          <span className="font-display text-base font-normal">
            {formatPrice(subtotal)}
          </span>
        </div>

        {/* Coupon Discount Line */}
        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-emerald-900 bg-emerald-500/5 p-2.5 border border-emerald-900/10">
            <span className="flex items-center gap-1 text-[11px]">
              <span>◈ {appliedCoupon?.name || 'Archival Privilege'}</span>
            </span>
            <span className="font-semibold text-emerald-900">
              −{formatPrice(discountAmount)}
            </span>
          </div>
        )}

        {/* Gift Wrapping Line (if active) */}
        {giftData.enabled && (
          <div className="flex justify-between items-center text-[var(--ink)]">
            <span className="flex items-center gap-1">
              <span>桐箱 Paulownia Wood Box</span>
              <span className="text-[9px] text-[var(--gold)]">
                {giftFee === 0 ? '(Tier Waiver)' : ''}
              </span>
            </span>
            <span>{giftFee === 0 ? 'COMPLIMENTARY' : formatPrice(giftFee)}</span>
          </div>
        )}

        {/* Taxable Base */}
        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-[11px] text-[var(--ink-muted)]">
            <span>Taxable Assessment Base</span>
            <span>{formatPrice(taxableBase)}</span>
          </div>
        )}

        {/* Detailed GST Section */}
        <div className="pt-2.5 border-t border-hairline">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-[var(--ink)] font-medium">
              <span>Goods &amp; Services Tax (GST 12%)</span>
              <span className="text-[9px] text-[var(--gold)]">HSN: 6201</span>
            </span>
            <span className="text-[var(--ink)] font-medium">
              {formatPrice(gstAmount)}
            </span>
          </div>

          {/* Interactive Jurisprudence Switcher */}
          <div className="bg-[var(--paper-2)]/60 p-3 border border-hairline text-[10px] space-y-1.5 mb-2">
            <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-[var(--ink-muted)] mb-1">
              <span>Tax Schedule:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setGstMode('inter')}
                  className={`underline ${gstMode === 'inter' ? 'text-[var(--ink)] font-bold' : 'text-[var(--ink-muted)]'}`}
                >
                  Inter-State (IGST)
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setGstMode('intra')}
                  className={`underline ${gstMode === 'intra' ? 'text-[var(--ink)] font-bold' : 'text-[var(--ink-muted)]'}`}
                >
                  Intra-State (CGST+SGST)
                </button>
              </div>
            </div>

            {gstMode === 'intra' ? (
              <>
                <div className="flex justify-between text-[var(--ink-muted)]">
                  <span>CGST (Central GST @ 6.0%)</span>
                  <span>{formatPrice(cgstAmount)}</span>
                </div>
                <div className="flex justify-between text-[var(--ink-muted)]">
                  <span>SGST (State GST @ 6.0%)</span>
                  <span>{formatPrice(sgstAmount)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-[var(--ink-muted)]">
                <span>IGST (Integrated GST @ 12.0%)</span>
                <span>{formatPrice(igstAmount)}</span>
              </div>
            )}
            <div className="pt-1.5 text-[9px] text-[var(--ink-muted)] border-t border-hairline/60">
              GSTIN: 27AABCO8472M1Z0 · Standard Luxury Apparel Schedule
            </div>
          </div>
        </div>

        {/* International Customs Directives (For Global Valuations) */}
        {currency !== 'INR' && (
          <div className="pt-1 text-[10px] text-[var(--ink-muted)] flex items-center justify-between">
            <span>Global Clearance:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCustomsMode('ddp')}
                className={`underline ${customsMode === 'ddp' ? 'text-[var(--ink)] font-bold' : ''}`}
              >
                DDP (All Duties Prepaid)
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setCustomsMode('ddu')}
                className={`underline ${customsMode === 'ddu' ? 'text-[var(--ink)] font-bold' : ''}`}
              >
                DDU (At Destination)
              </button>
            </div>
          </div>
        )}

        {/* Insured Archival Courier */}
        <div className="flex justify-between items-center text-sm pt-2.5 border-t border-hairline">
          <span className="flex items-center gap-1.5 text-[var(--ink)]">
            <span>Insured Archival Freight</span>
            <span className="text-[9px] text-[var(--ink-muted)]">
              {isFreeShipping ? '(Tier Waiver)' : '(Tracked Courier)'}
            </span>
          </span>
          <span className={isFreeShipping ? 'text-emerald-800 font-medium' : 'text-[var(--ink)]'}>
            {subtotal === 0 ? formatPrice(0) : isFreeShipping ? 'COMPLIMENTARY' : formatPrice(shippingFee)}
          </span>
        </div>
      </div>

      {/* Paulownia Gift Box Wrapping Option */}
      <CartGiftWrappingOption
        giftData={giftData}
        onChange={onGiftDataChange}
        subtotal={subtotal}
      />

      {/* B2B GST Corporate Invoice Modal & Input */}
      <CartB2BGstModal
        b2bData={b2bData}
        onChange={onB2BDataChange}
      />

      {/* Coupon Tab */}
      <CartCouponTab
        appliedCoupon={appliedCoupon}
        onApplyCoupon={onApplyCoupon}
        subtotal={subtotal}
        serverCouponError={serverCouponError}
      />

      {/* Grand Total */}
      <div className="mt-6 pt-5 border-t border-[var(--ink)]">
        <div className="flex justify-between items-baseline mb-1">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)] block">
              Grand Total (All Inclusive)
            </span>
            <span className="font-mono text-[9px] text-[var(--gold)]">
              Inclusive of 12% GST &amp; Insured Dispatch
            </span>
          </div>
          <div className="text-right">
            <span className="font-display text-2xl sm:text-3xl font-normal text-[var(--ink)]">
              {formatPrice(grandTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
