'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useCart, CartLineItem as LineItemType } from '@/lib/cart';
import { useCurrency } from '@/lib/currency';
import { CartLineItem } from './CartLineItem';
import { PRODUCT_CATALOG } from '@/lib/catalog';
import clsx from 'clsx';

const FREE_SHIPPING_THRESHOLD_USD = 250;

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [lastRemoved, setLastRemoved] = useState<LineItemType | null>(null);

  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape' && isOpen) {
        closeCart();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeCart]);

  const handleUndoRemove = () => {
    if (lastRemoved) {
      addToCart(lastRemoved);
      setLastRemoved(null);
    }
  };

  const progressPct = Math.min(100, Math.floor((subtotal / FREE_SHIPPING_THRESHOLD_USD) * 100));
  const diffToFree = Math.max(0, FREE_SHIPPING_THRESHOLD_USD - subtotal);

  // 3 Curated Suggestions for empty state
  const suggestions = ['041', '042', '043'];

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 z-[110] bg-[var(--ink)]/65 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
      />

      {/* 440px Drawer Panel (Right) */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Archive Bag"
        className={clsx(
          'fixed top-0 right-0 bottom-0 z-[120] w-full max-w-[440px] bg-[var(--paper)] text-[var(--ink)] border-l border-hairline flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{
          boxShadow: 'var(--shadow-drawer)',
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-hairline flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)] block">
              Allocation Tray
            </span>
            <h2 className="font-display text-2xl text-[var(--ink)]">
              Your archive.
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close archive bag"
            className="p-2 font-mono text-sm hover:opacity-60 transition-opacity"
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Goal Bar */}
        <div className="px-6 py-3 bg-[var(--paper-2)] border-b border-hairline text-xs font-mono">
          <div className="flex justify-between items-center mb-1.5 text-[var(--ink-muted)]">
            <span>
              {diffToFree === 0
                ? '✓ Complimentary Dispatch Unlocked'
                : `${formatPrice(diffToFree)} away from complimentary dispatch`}
            </span>
            <span>{progressPct}%</span>
          </div>
          <div className="w-full h-1 bg-[var(--hairline)] overflow-hidden">
            <div
              className="h-full bg-[var(--indigo)] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Line Items List / Empty State */}
        <div className="flex-1 overflow-y-auto px-6 divide-y divide-hairline">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <span className="font-mono text-2xl text-[var(--ink-muted)] block mb-3">◇</span>
              <p className="font-display text-xl text-[var(--ink)] mb-1">Your archive is empty.</p>
              <p className="text-xs text-[var(--ink-muted)] max-w-[32ch] mx-auto mb-8 leading-relaxed">
                Objects selected for allocation will appear here prior to checkout.
              </p>

              {/* 3 Empty State Suggestions */}
              <div className="text-left border-t border-hairline pt-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)] block mb-3">
                  Suggested for Batch 01
                </span>
                <div className="space-y-3">
                  {suggestions.map((id) => {
                    const prod = PRODUCT_CATALOG[id];
                    if (!prod) return null;
                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between p-2.5 border border-hairline bg-[var(--paper-2)] text-xs"
                      >
                        <div>
                          <p className="font-medium text-[var(--ink)]">{prod.name}</p>
                          <p className="font-mono text-[10px] text-[var(--ink-muted)]">{formatPrice(prod.price)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            addToCart({
                              id: `${id}-M`,
                              name: prod.name,
                              meta: prod.material.split(',')[0] || '',
                              price: prod.price,
                              size: 'M',
                            });
                          }}
                          className="px-3 py-1 bg-[var(--indigo)] text-white font-mono text-[10px] uppercase hover:bg-[var(--indigo-hover)]"
                        >
                          + Add
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {items.map((line) => (
                <CartLineItem key={line.id} line={line} />
              ))}
            </div>
          )}
        </div>

        {/* Undo Toast when an item is removed */}
        {lastRemoved && (
          <div className="m-4 p-3 bg-[var(--ink)] text-white text-xs font-mono flex items-center justify-between">
            <span>Removed {lastRemoved.name}</span>
            <button
              type="button"
              onClick={handleUndoRemove}
              className="text-[var(--paper)] underline uppercase tracking-wider"
            >
              Undo
            </button>
          </div>
        )}

        {/* Footer Subtotal & Checkout CTA */}
        {items.length > 0 && (
          <div className="p-6 border-t border-hairline bg-[var(--paper-2)]">
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--ink-muted)]">Subtotal</span>
              <span className="font-display text-2xl text-[var(--ink)] font-normal">{formatPrice(subtotal)}</span>
            </div>
            <p className="font-mono text-[10px] text-[var(--ink-muted)] mb-4">
              Taxes calculated at checkout · Free returns within 14 days
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-4 text-center bg-[var(--indigo)] text-white text-xs font-mono uppercase tracking-widest hover:bg-[var(--indigo-hover)] transition-colors mb-3"
            >
              Proceed to Secure Checkout →
            </Link>
            <p className="text-[10px] text-center text-[var(--ink-muted)] leading-tight">
              Direct studio dispatch from Hokkaido · Registered under lifetime repair ledger.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
