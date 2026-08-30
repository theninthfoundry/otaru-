'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { useCurrency } from '@/lib/currency';
import { CartLineItem } from './CartLineItem';
import clsx from 'clsx';

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal } = useCart();
  const { formatPrice } = useCurrency();
  const drawerRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <div
        className={clsx('cart-overlay', isOpen && 'is-open')}
        onClick={closeCart}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 110,
          backgroundColor: 'rgba(7, 13, 20, 0.75)',
          backdropFilter: 'blur(4px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity var(--duration-base) var(--ease-otaru)',
        }}
      />
      <div
        ref={drawerRef}
        className={clsx('cart-drawer', isOpen && 'is-open')}
        role="dialog"
        aria-modal="true"
        aria-label="Your Archive"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 120,
          width: 'min(440px, 100vw)',
          backgroundColor: 'var(--otaru-ink)',
          borderLeft: '1px solid var(--otaru-line)',
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.4rem 1.8rem',
            borderBottom: '1px solid var(--otaru-line)',
          }}
        >
          <div>
            <span className="eyebrow" style={{ fontSize: '0.62rem' }}>Archival Tray</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: '0.2rem 0 0', color: 'var(--otaru-parchment)' }}>
              Your Archive
            </h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={closeCart}
            aria-label="Close archive tray"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <line x1="4" y1="4" x2="20" y2="20" />
              <line x1="20" y1="4" x2="4" y2="20" />
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.8rem' }}>
          {items.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                height: '100%',
                padding: '3rem 0',
              }}
            >
              <span style={{ fontSize: '1.8rem', color: 'var(--otaru-gold-dim)', marginBottom: '0.8rem' }}>◇</span>
              <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--otaru-parchment)' }}>Your archive is unoccupied.</p>
              <p style={{ marginTop: '0.6rem', maxWidth: '28ch', fontSize: '0.84rem', lineHeight: 1.6, color: 'var(--otaru-parchment-dim)' }}>
                Objects reserved here hold for 30 minutes before returning to the permanent catalog.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="cta-link"
                style={{ marginTop: '1.8rem' }}
              >
                Continue Exploring <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : (
            <div>
              {items.map((line) => (
                <CartLineItem key={line.id} line={line} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ borderTop: '1px solid var(--otaru-line)', padding: '1.4rem 1.8rem', backgroundColor: 'rgba(23, 41, 62, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: 'var(--otaru-parchment-dim)' }}>
              <span>Subtotal</span>
              <span style={{ color: 'var(--otaru-parchment)', fontWeight: 500 }}>{formatPrice(subtotal)}</span>
            </div>
            <p style={{ marginTop: '0.3rem', fontSize: '0.7rem', color: 'var(--otaru-horizon)', margin: 0 }}>
              Direct studio dispatch from Hokkaido · Lifetime repair guaranteed.
            </p>
            <Link
              href="/sign-in"
              onClick={closeCart}
              className="btn-primary"
              style={{
                display: 'block',
                marginTop: '1.1rem',
                width: '100%',
                padding: '0.95rem',
                textAlign: 'center',
                textDecoration: 'none',
                letterSpacing: '0.12em',
              }}
            >
              Proceed to Archival Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
