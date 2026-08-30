'use client';

import React from 'react';
import { useCart, CartLineItem as LineItemType } from '@/lib/cart';
import { useCurrency } from '@/lib/currency';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

interface CartLineItemProps {
  line: LineItemType;
}

export function CartLineItem({ line }: CartLineItemProps) {
  const { updateQty, removeFromCart } = useCart();
  const { formatPrice } = useCurrency();

  return (
    <div
      className="cart-line"
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1.3rem 0',
        borderBottom: '1px solid var(--otaru-line)',
      }}
    >
      <div style={{ width: '72px', flexShrink: 0 }}>
        <ImagePlaceholder label={line.name} ratio="portrait" />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--otaru-parchment)' }}>
              {line.name}
            </p>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.76rem', color: 'var(--otaru-parchment-dim)' }}>
              {line.meta}
            </p>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', whiteSpace: 'nowrap', color: 'var(--otaru-parchment)' }}>
            {formatPrice(line.price * line.qty)}
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
          <div
            className="qty-group"
            role="group"
            aria-label={`Quantity for ${line.name}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--otaru-line-strong)',
            }}
          >
            <button
              type="button"
              onClick={() => updateQty(line.id, -1)}
              aria-label="Decrease quantity"
              style={{ width: '1.9rem', height: '1.9rem', color: 'var(--otaru-parchment-dim)' }}
            >
              −
            </button>
            <span aria-live="polite" style={{ width: '1.8rem', textAlign: 'center', fontSize: '0.86rem' }}>
              {line.qty}
            </span>
            <button
              type="button"
              onClick={() => updateQty(line.id, 1)}
              aria-label="Increase quantity"
              style={{ width: '1.9rem', height: '1.9rem', color: 'var(--otaru-parchment-dim)' }}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="cart-remove"
            onClick={() => removeFromCart(line.id)}
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--otaru-parchment-dim)',
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
