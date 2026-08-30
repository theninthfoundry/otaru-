import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Drop Control Plane — Otaru Admin',
  description: 'Real-time drop operations dashboard, stock gauges, and production launch gate controls.',
};

export default function DropControlPage() {
  return (
    <div className="wrap page-wrap" style={{ paddingTop: '9rem', paddingBottom: '6rem' }}>
      <span className="eyebrow">Administrative</span>
      <h1 className="section-title">Drop Control Plane</h1>
      <p className="section-lede">
        Real-time inventory locks, batch release scheduling, and allocation telemetry.
      </p>

      <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={{ border: '1px solid var(--otaru-line)', padding: '2rem', backgroundColor: 'var(--otaru-dusk)' }}>
          <span style={{ fontSize: '0.66rem', color: 'var(--otaru-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--otaru-parchment)', marginTop: '0.4rem' }}>
            Active Allocation Gate
          </h2>
          <p style={{ marginTop: '0.6rem', color: 'var(--otaru-parchment-dim)', fontSize: '0.88rem' }}>
            All systems nominal. Cryptographic ledger verified.
          </p>
        </div>
      </div>
    </div>
  );
}
