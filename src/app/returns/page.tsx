import React from 'react';
import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <div className="wrap page-wrap" style={{ paddingTop: '9rem', paddingBottom: '6rem', maxWidth: '760px' }}>
      <span className="eyebrow">Support & Care</span>
      <h1 className="section-title">Lifetime repair & returns</h1>
      <p className="section-lede">
        We believe that when you buy an object from Otaru, our relationship is only beginning.
      </p>

      <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--otaru-parchment-dim)', fontSize: '1rem', lineHeight: 1.75 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--otaru-parchment)', marginBottom: '0.6rem' }}>
            Free Lifetime Repair
          </h2>
          <p>
            Any garment purchased from Otaru can be sent back to our Hokkaido warehouse for repair for as long as we are open.
            We mend seams, re-wax canvas, patch elbows, and repair boro cloth visibly using period-appropriate threads.
          </p>
        </div>

        <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--otaru-line)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--otaru-parchment)', marginBottom: '0.6rem' }}>
            30-Day Unworn Returns
          </h2>
          <p>
            If a garment does not fit as expected upon delivery, return it unworn in its original packaging within 30 days for a full refund or size exchange.
          </p>
        </div>

        <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--otaru-line)' }}>
          <a href="mailto:support@otaru.in" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '0.85rem 1.8rem', textDecoration: 'none' }}>
            Initiate a Repair or Return
          </a>
        </div>
      </div>
    </div>
  );
}
