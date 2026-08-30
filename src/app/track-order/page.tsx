'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [tracked, setTracked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber && email) {
      setTracked(true);
    }
  };

  return (
    <div className="wrap page-wrap" style={{ paddingTop: '9rem', paddingBottom: '6rem', maxWidth: '580px' }}>
      <span className="eyebrow">Order Support</span>
      <h1 className="section-title">Track your acquisition</h1>
      <p className="section-lede">
        Enter your order reference and email address to follow your parcel from our Otaru warehouse to your door.
      </p>

      {!tracked ? (
        <form onSubmit={handleSubmit} style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          <div>
            <label htmlFor="order-no" style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)', display: 'block', marginBottom: '0.4rem' }}>
              Order Reference (e.g. OT-84920)
            </label>
            <input
              id="order-no"
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="OT-"
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid var(--otaru-line-strong)',
                padding: '0.75rem 0.85rem',
                color: 'var(--otaru-parchment)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label htmlFor="order-email" style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)', display: 'block', marginBottom: '0.4rem' }}>
              Billing Email
            </label>
            <input
              id="order-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid var(--otaru-line-strong)',
                padding: '0.75rem 0.85rem',
                color: 'var(--otaru-parchment)',
                outline: 'none',
              }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '0.9rem' }}>
            Track Package
          </button>
        </form>
      ) : (
        <div style={{ marginTop: '3rem', padding: '2rem', border: '1px solid var(--otaru-line)', backgroundColor: 'var(--otaru-dusk)' }}>
          <span style={{ fontSize: '0.66rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--otaru-gold)' }}>
            Status: In Transit
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--otaru-parchment)', marginTop: '0.4rem' }}>
            {orderNumber.toUpperCase()}
          </h2>
          <p style={{ marginTop: '0.6rem', color: 'var(--otaru-parchment-dim)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Dispatched via express courier from Otaru, Hokkaido. Customs clearance completed.
          </p>
          <button type="button" onClick={() => setTracked(false)} className="cta-link" style={{ marginTop: '1.4rem' }}>
            Check another order <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
