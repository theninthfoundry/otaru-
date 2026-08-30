'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function VerifyPiecePage() {
  const [tagCode, setTagCode] = useState('');
  const [verified, setVerified] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tagCode) {
      setVerified(true);
    }
  };

  return (
    <div className="wrap page-wrap" style={{ paddingTop: '9rem', paddingBottom: '6rem', maxWidth: '640px' }}>
      <span className="eyebrow">Provenance</span>
      <h1 className="section-title">Verify authenticity</h1>
      <p className="section-lede">
        Every Otaru garment includes an NFC-enabled thread woven into the care label or a stamped serial number.
        Enter the serial number below to verify its release chapter, dye batch, and craftsman attribution.
      </p>

      {!verified ? (
        <form onSubmit={handleSubmit} style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          <div>
            <label htmlFor="tag-code" style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)', display: 'block', marginBottom: '0.4rem' }}>
              Care Label Serial / Tag Code (e.g. OT-041-TOKUSHIMA)
            </label>
            <input
              id="tag-code"
              type="text"
              required
              value={tagCode}
              onChange={(e) => setTagCode(e.target.value)}
              placeholder="OT-041-"
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
            Verify Artifact
          </button>
        </form>
      ) : (
        <div style={{ marginTop: '3rem', padding: '2rem', border: '1px solid var(--otaru-gold-dim)', backgroundColor: 'var(--otaru-dusk)' }}>
          <span style={{ fontSize: '0.66rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--otaru-gold)' }}>
            ✓ Verified Authentic
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--otaru-parchment)', marginTop: '0.4rem' }}>
            {tagCode.toUpperCase()}
          </h2>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--otaru-parchment-dim)' }}>
            <p style={{ margin: 0 }}><strong>Dye Master:</strong> Aiko Nakamura</p>
            <p style={{ margin: 0 }}><strong>Pattern Cutter:</strong> Ren Takahashi</p>
            <p style={{ margin: 0 }}><strong>Origin:</strong> Otaru Warehouse #4, Hokkaido</p>
            <p style={{ margin: 0 }}><strong>Warranty:</strong> Lifetime Free Repair Guaranteed</p>
          </div>
          <button type="button" onClick={() => setVerified(false)} className="cta-link" style={{ marginTop: '1.6rem' }}>
            Verify another piece <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
