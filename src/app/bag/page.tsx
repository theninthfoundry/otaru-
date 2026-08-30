'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { useCurrency } from '@/lib/currency';
import { CartLineItem } from '@/components/cart/CartLineItem';

export default function BagPage() {
  const { items, subtotal } = useCart();
  const { formatPrice } = useCurrency();

  return (
    <div className="wrap page-wrap" style={{ paddingTop: '9rem', paddingBottom: '6rem', maxWidth: '700px' }}>
      <span className="eyebrow">Shopping Bag</span>
      <h1 className="section-title">Your acquisition bag</h1>

      {items.length === 0 ? (
        <div style={{ marginTop: '3rem', padding: '3rem 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--otaru-parchment-dim)' }}>Your bag is currently empty.</p>
          <Link href="/archive" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '0.85rem 1.8rem', marginTop: '1.5rem', textDecoration: 'none' }}>
            Explore the Archive
          </Link>
        </div>
      ) : (
        <div style={{ marginTop: '3rem' }}>
          <div>
            {items.map((line) => (
              <CartLineItem key={line.id} line={line} />
            ))}
          </div>

          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--otaru-line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', color: 'var(--otaru-parchment)' }}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--otaru-horizon)' }}>
              Shipping and taxes calculated at checkout.
            </p>
            <Link
              href="/sign-in"
              className="btn-primary"
              style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: '1.5rem', padding: '1rem', textDecoration: 'none' }}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
