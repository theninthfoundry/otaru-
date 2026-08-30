'use client';

import React from 'react';
import { useCart } from '@/lib/cart';

export function CartButton() {
  const { openCart, itemCount } = useCart();

  return (
    <button
      type="button"
      className="icon-btn cart-trigger"
      onClick={openCart}
      aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
      style={{ position: 'relative' }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M6 7h15l-1.5 9h-13z" />
        <path d="M6 7 5 3H2" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
      {itemCount > 0 && (
        <span
          className="cart-badge"
          style={{
            position: 'absolute',
            top: '-0.25rem',
            right: '-0.25rem',
            minWidth: '1.05rem',
            height: '1.05rem',
            padding: '0 0.25rem',
            borderRadius: '50%',
            backgroundColor: 'var(--otaru-gold)',
            color: 'var(--otaru-ink)',
            fontSize: '0.62rem',
            fontWeight: 600,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {itemCount}
        </span>
      )}
    </button>
  );
}
