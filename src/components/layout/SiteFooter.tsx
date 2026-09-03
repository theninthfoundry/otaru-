'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function SiteFooter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--otaru-ink)',
        borderTop: '1px solid var(--otaru-line)',
        padding: '5.5rem 0 3rem',
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
      <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
        {/* Top Ledger Headline */}
        <div style={{ maxWidth: '460px', marginBottom: '3.5rem' }}>
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '2.2rem',
              color: 'var(--otaru-parchment)',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Otaru
          </Link>
          <p
            style={{
              marginTop: '0.8rem',
              fontSize: '1.05rem',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              color: 'var(--otaru-parchment)',
              lineHeight: 1.5,
            }}
          >
            Garments worth keeping.
          </p>
          <p
            style={{
              marginTop: '0.3rem',
              fontSize: '0.86rem',
              color: 'var(--otaru-parchment-dim)',
              lineHeight: 1.7,
            }}
          >
            A small archive of limited-run objects made with intention, botanical dyes, and permanent craftsmanship in Hokkaido.
          </p>

          <div style={{ marginTop: '1.8rem' }}>
            {isSubscribed ? (
              <p style={{ fontSize: '0.78rem', letterSpacing: '0.08em', color: 'var(--otaru-gold)', textTransform: 'uppercase' }}>
                Recorded in our dispatch list.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', maxWidth: '340px' }}>
                <input
                  type="email"
                  required
                  placeholder="Dispatch ledger email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(23, 41, 62, 0.4)',
                    border: '1px solid var(--otaru-line-strong)',
                    borderRight: 'none',
                    padding: '0.65rem 0.9rem',
                    fontSize: '0.78rem',
                    color: 'var(--otaru-parchment)',
                    outline: 'none',
                    borderRadius: '2px 0 0 2px',
                  }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    padding: '0 1.2rem',
                    fontSize: '0.7rem',
                    borderRadius: '0 2px 2px 0',
                  }}
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <hr className="hairline" style={{ marginBottom: '3rem' }} />

        {/* 4 Clean Columns */}
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2.5rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--otaru-gold-dim)', marginBottom: '1.1rem' }}>
              The Archive
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li><Link href="/archive" className="nav-link" style={{ fontSize: '0.82rem' }}>All Objects</Link></li>
              <li><Link href="/#new-drops" className="nav-link" style={{ fontSize: '0.82rem' }}>Live Batch Run</Link></li>
              <li><Link href="/#craft" className="nav-link" style={{ fontSize: '0.82rem' }}>Material Ledger</Link></li>
              <li><Link href="/archive" className="nav-link" style={{ fontSize: '0.82rem' }}>Outerwear Pieces</Link></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--otaru-gold-dim)', marginBottom: '1.1rem' }}>
              Chapters
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li><Link href="/chapters" className="nav-link" style={{ fontSize: '0.82rem' }}>Chapter I · Kyoto Nights</Link></li>
              <li><Link href="/chapters" className="nav-link" style={{ fontSize: '0.82rem' }}>Chapter II · Otaru Harbor</Link></li>
              <li><Link href="/chapters" className="nav-link" style={{ fontSize: '0.82rem' }}>Chapter III · Quiet Interior</Link></li>
              <li><Link href="/chapters" className="nav-link" style={{ fontSize: '0.82rem' }}>Chapter 0 · Prototypes</Link></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--otaru-gold-dim)', marginBottom: '1.1rem' }}>
              Studio & Craft
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li><Link href="/studio" className="nav-link" style={{ fontSize: '0.82rem' }}>Warehouse History</Link></li>
              <li><Link href="/journal" className="nav-link" style={{ fontSize: '0.82rem' }}>Field Notes Journal</Link></li>
              <li><Link href="/studio" className="nav-link" style={{ fontSize: '0.82rem' }}>Canal Dyehouse</Link></li>
              <li><Link href="/studio" className="nav-link" style={{ fontSize: '0.82rem' }}>Lifetime Repairs</Link></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--otaru-gold-dim)', marginBottom: '1.1rem' }}>
              Concierge
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li><Link href="/profile" className="nav-link" style={{ fontSize: '0.82rem' }}>Collector Profile</Link></li>
              <li><Link href="/track-order" className="nav-link" style={{ fontSize: '0.82rem' }}>Track Dispatch</Link></li>
              <li><Link href="/membership" className="nav-link" style={{ fontSize: '0.82rem' }}>Archival Circle</Link></li>
              <li><Link href="/studio" className="nav-link" style={{ fontSize: '0.82rem' }}>Contact Atelier</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Coordinates & Legal */}
        <div
          style={{
            marginTop: '3.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--otaru-line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.66rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--otaru-horizon)',
          }}
        >
          <span>© MMXXVI OTARU · ESTABLISHED IN HOKKAIDO · 43.1907° N, 140.9947° E</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>ALL OBJECTS PROTECTED</span>
            <span>ZERO MASS-PRODUCTION</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
