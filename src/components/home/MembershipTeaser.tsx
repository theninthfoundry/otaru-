'use client';

import React from 'react';
import Link from 'next/link';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { SashikoGrid, VerticalKanjiStamp } from '@/components/ui/ArchivalBackgroundArt';
import { ArtBackgroundPlate } from '@/components/ui/ArtBackgroundPlate';
import { useCurrency } from '@/lib/currency';

interface Tier {
  name: string;
  kanji: string;
  badge?: string;
  desc: string;
  priceType: 'free' | 'paid' | 'custom';
  usdPrice?: number;
  priceLabel?: string;
  features: string[];
}

const TIERS: Tier[] = [
  {
    name: 'Vanguard',
    kanji: '先',
    desc: 'Priority entry to every live batch release, 48 hours before public archival indexing.',
    priceType: 'free',
    priceLabel: 'Complimentary with verified account',
    features: ['48-hour release priority', 'Digital provenance ledger', 'Private dispatch notice'],
  },
  {
    name: 'Archival Circle',
    kanji: '保',
    badge: 'Limited to 150 members',
    desc: 'Standing archive concierge, guaranteed piece allocation, and seasonal studio care.',
    priceType: 'paid',
    usdPrice: 120,
    features: ['All Vanguard access', 'Annual canal re-waxing & boro repair', 'Guaranteed size allocation', 'Studio anniversary linen monograph'],
  },
  {
    name: 'Atelier Circle',
    kanji: '造',
    badge: 'By Application',
    desc: 'Private commissions, bespoke fitting sessions, and direct access to our 4 craftsmen.',
    priceType: 'custom',
    priceLabel: 'By invitation or personal referral',
    features: ['Custom pattern cuts', 'Private warehouse fittings in Otaru', 'Archive reserve archives'],
  },
];

export function MembershipTeaser() {
  const { formatPrice } = useCurrency();

  return (
    <section className="block on-ink" id="membership" aria-labelledby="membership-heading" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Japanese Great Wave Art Plate */}
      <ArtBackgroundPlate artName="great-wave" position="bottom-right" opacity={0.17} maxWidth="820px" maxHeight="560px" />

      {/* Background Sashiko Grid */}
      <SashikoGrid opacity={0.035} />

      {/* Vertical Japanese Calligraphy Watermark */}
      <VerticalKanjiStamp text="会員台帳" subtext="ARCHIVAL CIRCLE ROSTER" top="10%" left="2%" opacity={0.045} />

      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <RevealOnScroll>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span className="eyebrow">Archival Circle</span>
              <h2 className="section-title" id="membership-heading">Three ways to keep the archive close.</h2>
            </div>
            <p className="section-lede" style={{ margin: 0 }}>
              Join the collector circle for private seasonal releases, atelier fittings, and complimentary lifetime repairs.
            </p>
          </div>
        </RevealOnScroll>

        <div
          className="tier-grid reveal-stagger"
          style={{
            marginTop: '3.2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.8rem',
          }}
        >
          {TIERS.map((tier, i) => (
            <RevealOnScroll key={tier.name} staggerIndex={i}>
              <div
                className="tier-card"
                style={{
                  padding: '2.5rem 2rem',
                  borderRadius: '2px',
                  border: '1px solid var(--otaru-line)',
                  backgroundColor: 'rgba(23, 41, 62, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  position: 'relative',
                  transition: 'border-color 0.3s ease',
                }}
              >
                {/* Background Kanji Watermark */}
                <span
                  style={{
                    position: 'absolute',
                    top: '1.2rem',
                    right: '1.5rem',
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.8rem',
                    color: 'rgba(217,189,131,0.12)',
                    lineHeight: 1,
                    pointerEvents: 'none',
                  }}
                >
                  {tier.kanji}
                </span>

                <div>
                  <span style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--otaru-gold-dim)', fontFamily: 'monospace' }}>
                    TIER 0{i + 1}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--otaru-parchment)', marginTop: '0.3rem' }}>
                    {tier.name}
                  </h3>
                  <p style={{ marginTop: '0.8rem', color: 'var(--otaru-parchment-dim)', fontSize: '0.88rem', lineHeight: 1.65 }}>
                    {tier.desc}
                  </p>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0 0 0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {tier.features.map((f) => (
                      <li key={f} style={{ fontSize: '0.82rem', color: 'var(--otaru-parchment-dim)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ color: 'var(--otaru-gold)' }}>◇</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: '2.2rem', paddingTop: '1.2rem', borderTop: '1px solid var(--otaru-line)' }}>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--otaru-parchment)', fontWeight: 500, letterSpacing: '0.04em' }}>
                    {tier.priceType === 'paid' && tier.usdPrice
                      ? `${formatPrice(tier.usdPrice)} / year`
                      : tier.priceLabel}
                  </p>
                  {tier.badge && (
                    <p style={{ margin: '0.3rem 0 0', fontSize: '0.66rem', color: 'var(--otaru-gold-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {tier.badge}
                    </p>
                  )}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll className="text-center" style={{ marginTop: '3.8rem', textAlign: 'center' }}>
          <Link
            href="/membership"
            className="cta-link"
          >
            Review the Full Membership Ledger <span aria-hidden="true">→</span>
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
