'use client';

import React from 'react';
import Link from 'next/link';

export default function WishlistPage() {
  return (
    <div className="wrap page-wrap" style={{ paddingTop: '9rem', paddingBottom: '6rem', maxWidth: '700px' }}>
      <span className="eyebrow">Saved Artifacts</span>
      <h1 className="section-title">Your saved artifacts</h1>
      <div style={{ marginTop: '3rem', padding: '3rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--otaru-parchment-dim)' }}>You can save artifacts to your wishlist from any product page.</p>
        <Link href="/archive" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '0.85rem 1.8rem', marginTop: '1.5rem', textDecoration: 'none' }}>
          Explore the Archive
        </Link>
      </div>
    </div>
  );
}
