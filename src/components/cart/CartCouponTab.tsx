'use client';

import React, { useState } from 'react';
import { useCurrency } from '@/lib/currency';

export interface CouponData {
  code: string;
  type: 'percent' | 'flat' | 'shipping';
  value: number;
  description: string;
  name: string;
}

export const VALID_COUPONS: Record<string, CouponData> = {
  ARCHIVE10: {
    code: 'ARCHIVE10',
    type: 'percent',
    value: 10,
    name: 'Archival Member Privilege',
    description: '10% deduction across all hand-loomed batch garments',
  },
  ATELIER15: {
    code: 'ATELIER15',
    type: 'percent',
    value: 15,
    name: 'Private Collector Concession',
    description: '15% allocation grant for registered atelier patrons',
  },
  HOKKAIDO20: {
    code: 'HOKKAIDO20',
    type: 'percent',
    value: 20,
    name: 'Hokkaido Warehouse Opening Token',
    description: '20% deduction celebrating the 1907 Otaru canal ledger',
  },
  FIRSTPATRON: {
    code: 'FIRSTPATRON',
    type: 'flat',
    value: 50,
    name: 'First Patron Archival Credit',
    description: '$50 (₹4,200) studio accession stipend applied at checkout',
  },
  FREESHIP: {
    code: 'FREESHIP',
    type: 'shipping',
    value: 100,
    name: 'Complimentary Global Freight Voucher',
    description: 'Zero-cost insured courier dispatch with wooden crate boxing',
  },
};

interface CartCouponTabProps {
  appliedCoupon: CouponData | null;
  onApplyCoupon: (coupon: CouponData | null) => void;
  subtotal: number;
  serverCouponError?: string | null;
}

export function CartCouponTab({
  appliedCoupon,
  onApplyCoupon,
  subtotal,
  serverCouponError,
}: CartCouponTabProps) {
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { formatPrice } = useCurrency();

  const handleApply = (codeToUse?: string) => {
    const raw = (codeToUse || inputCode).trim().toUpperCase();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!raw) {
      setErrorMsg('Please enter an archival privilege code.');
      return;
    }

    const matched = VALID_COUPONS[raw];
    if (matched) {
      onApplyCoupon(matched);
      setSuccessMsg(`Archival token "${matched.code}" verified by canal ledger.`);
      setInputCode('');
    } else {
      setErrorMsg(`Archival credential "${raw}" not recognized in active registry.`);
    }
  };

  const handleRemove = () => {
    onApplyCoupon(null);
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  return (
    <div className="border border-hairline bg-[var(--paper-2)]/50 p-4 sm:p-5 mt-4">
      {/* Header / Accordion Trigger */}
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-sm text-[var(--gold)]">◈</span>
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink)] font-semibold">
            Archival Privilege Voucher
          </span>
          {appliedCoupon && (
            <span className="ml-1.5 font-mono text-[9px] uppercase tracking-wider bg-emerald-900/10 text-emerald-800 border border-emerald-800/20 px-2 py-0.5">
              Verified: {appliedCoupon.code}
            </span>
          )}
        </div>
        <button
          type="button"
          className="font-mono text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors p-1"
          aria-label={isOpen ? 'Collapse voucher section' : 'Expand voucher section'}
        >
          {isOpen ? '▲' : '▼'}
        </button>
      </div>

      {/* Accordion Body */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-hairline space-y-3">
          {appliedCoupon ? (
            <div className="border border-emerald-900/20 bg-emerald-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative">
              <div className="flex items-start gap-3">
                {/* Vermilion Stamp Motif */}
                <span className="font-serif text-sm bg-[var(--otaru-torii)] text-[var(--paper)] w-6 h-6 flex items-center justify-center select-none shadow-sm flex-shrink-0">
                  特
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-950">
                      {appliedCoupon.code}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-800/80">
                      — {appliedCoupon.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-900/85 font-sans mt-0.5 leading-relaxed">
                    {appliedCoupon.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemove}
                className="font-mono text-[10px] uppercase tracking-wider text-red-700 hover:underline self-end sm:self-center"
              >
                Relinquish Voucher
              </button>
            </div>
          ) : (
            <>
              {/* Code Input Form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value.toUpperCase());
                    setErrorMsg(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApply();
                    }
                  }}
                  placeholder="e.g. ARCHIVE10"
                  aria-label="Enter archival privilege code"
                  className="flex-1 px-3.5 py-2.5 border border-hairline bg-[var(--paper)] font-mono text-xs text-[var(--ink)] uppercase tracking-[0.16em] placeholder:text-[var(--ink-muted)]/50 focus:outline-none focus:border-[var(--ink)]"
                />
                <button
                  type="button"
                  onClick={() => handleApply()}
                  disabled={!inputCode.trim()}
                  className="px-5 py-2.5 bg-[var(--ink)] text-[var(--paper)] font-mono text-xs uppercase tracking-[0.16em] hover:bg-[var(--indigo)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Verify
                </button>
              </div>

              {/* Error / Success Feedback */}
              {(errorMsg || serverCouponError) && (
                <p className="font-mono text-[11px] text-red-700 mt-1">
                  ✕ {errorMsg || serverCouponError}
                </p>
              )}
              {successMsg && !serverCouponError && (
                <p className="font-mono text-[11px] text-emerald-800 mt-1">
                  ✓ {successMsg}
                </p>
              )}

              {/* Quick-Apply Suggestion Chips */}
              <div className="pt-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-muted)] block mb-2">
                  Active Atelier Privilege Tokens (Click to Verify)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.values(VALID_COUPONS).map((coupon) => (
                    <button
                      key={coupon.code}
                      type="button"
                      onClick={() => handleApply(coupon.code)}
                      className="px-2.5 py-1 border border-hairline bg-[var(--paper)] font-mono text-[10px] text-[var(--ink)] hover:border-[var(--ink)] hover:bg-[var(--paper-2)] transition-colors flex items-center gap-1.5"
                    >
                      <span className="font-medium">{coupon.code}</span>
                      <span className="text-[var(--gold)] text-[9px]">
                        {coupon.type === 'percent'
                          ? `(-${coupon.value}%)`
                          : coupon.type === 'flat'
                          ? `(-${formatPrice(coupon.value)})`
                          : '(Free Freight)'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
