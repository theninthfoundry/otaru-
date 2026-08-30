'use client';

import React from 'react';
import Link from 'next/link';
import { useCurrency } from '@/lib/currency';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

export default function MembershipPage() {
  const { formatPrice } = useCurrency();

  return (
    <div className="wrap page-wrap" style={{ paddingTop: '9rem', paddingBottom: '6rem' }}>
      <RevealOnScroll>
        <span className="eyebrow">Archive access</span>
        <h1 className="section-title">Three tiers. One standard of care.</h1>
        <p className="section-lede">
          Membership gives you standing access to new chapters before public release, custom commissions, and a lifetime repair guarantee on every artifact.
        </p>
      </RevealOnScroll>

      <div
        className="tier-grid reveal-stagger"
        style={{
          marginTop: '4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.6rem',
        }}
      >
        <RevealOnScroll staggerIndex={0}>
          <div className="tier-card" style={{ border: '1px solid var(--otaru-line)', padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--otaru-parchment)', margin: 0 }}>Vanguard</h2>
              <p style={{ marginTop: '0.8rem', color: 'var(--otaru-parchment-dim)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Early access to new chapters, 48 hours before public release. First notification when archival runs release.
              </p>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--otaru-gold-dim)', letterSpacing: '0.06em', marginBottom: '1rem' }}>
                Free with an account
              </p>
              <Link href="/sign-in" className="btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center', textDecoration: 'none' }}>
                Join Vanguard
              </Link>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll staggerIndex={1}>
          <div className="tier-card" style={{ border: '1px solid var(--otaru-gold-dim)', padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'var(--otaru-dusk)' }}>
            <div>
              <span style={{ fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--otaru-gold)' }}>Recommended</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--otaru-parchment)', marginTop: '0.3rem' }}>Archival</h2>
              <p style={{ marginTop: '0.8rem', color: 'var(--otaru-parchment-dim)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Everything in Vanguard, plus guaranteed allocation on restocks, priority concierge, and archival milestone reservations.
              </p>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--otaru-gold)', letterSpacing: '0.06em', marginBottom: '1rem' }}>
                {formatPrice(120)} / year
              </p>
              <Link href="/sign-in" className="btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center', textDecoration: 'none' }}>
                Subscribe to Archival
              </Link>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll staggerIndex={2}>
          <div className="tier-card" style={{ border: '1px solid var(--otaru-line)', padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--otaru-parchment)', margin: 0 }}>Atelier</h2>
              <p style={{ marginTop: '0.8rem', color: 'var(--otaru-parchment-dim)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                By application. Custom commissions, bespoke fittings in our Otaru warehouse, and direct line with our master cutters.
              </p>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--otaru-gold-dim)', letterSpacing: '0.06em', marginBottom: '1rem' }}>
                By invitation
              </p>
              <a href="mailto:studio@otaru.in" className="btn-secondary" style={{ display: 'block', width: '100%', textAlign: 'center', textDecoration: 'none' }}>
                Inquire for Atelier
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}
