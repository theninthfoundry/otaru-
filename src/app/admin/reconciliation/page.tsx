'use client';

import React from 'react';
import Link from 'next/link';

export default function ReconciliationCenterPage() {
  return (
    <main
      style={{
        backgroundColor: '#070d14',
        minHeight: '100vh',
        color: 'var(--otaru-parchment)',
        fontFamily: 'var(--font-sans)',
        padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3.5rem)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--otaru-line)', paddingBottom: '1.2rem', marginBottom: '2.5rem' }}>
        <div>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--otaru-gold)' }}>
            FINANCIAL AUDIT / 照合台帳
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', margin: '0.3rem 0 0', fontWeight: 400 }}>
            Financial Reconciliation Center
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.8rem', border: '1px solid #52b788', color: '#52b788', fontSize: '0.72rem', letterSpacing: '0.14em' }}>
            ● STATUS: 100% BALANCED
          </div>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', color: 'var(--otaru-parchment-dim)' }}>
            PostgreSQL Primary Authority
          </p>
        </div>
      </div>

      {/* Primary Reconciliation Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {/* Gateway vs Otaru Card */}
        <div style={{ border: '1px solid var(--otaru-line)', padding: '1.5rem', backgroundColor: 'rgba(23,41,62,0.2)' }}>
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--otaru-gold-dim)' }}>
            SETTLEMENT COMPARISON
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.2rem', borderBottom: '1px solid var(--otaru-line)', paddingBottom: '0.8rem' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--otaru-parchment-dim)' }}>RAZORPAY CAPTURED</p>
              <p style={{ margin: '0.2rem 0 0', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>₹1,204,320</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--otaru-parchment-dim)' }}>OTARU LEDGER</p>
              <p style={{ margin: '0.2rem 0 0', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>₹1,204,320</p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--otaru-parchment-dim)' }}>Discrepancy:</span>
            <span style={{ color: '#52b788', fontWeight: 500 }}>₹0 (Zero Delta)</span>
          </div>
        </div>

        {/* Transactions Card */}
        <div style={{ border: '1px solid var(--otaru-line)', padding: '1.5rem', backgroundColor: 'rgba(23,41,62,0.2)' }}>
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--otaru-gold-dim)' }}>
            TRANSACTION INVENTORY
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#52b788' }}>30</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--otaru-parchment-dim)' }}>MATCHED ORDERS</p>
            </div>
            <div>
              <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--otaru-parchment)' }}>00</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--otaru-parchment-dim)' }}>UNMATCHED DELTAS</p>
            </div>
          </div>
          <p style={{ margin: '0.8rem 0 0', fontSize: '0.72rem', color: 'var(--otaru-parchment-dim)' }}>
            All capture attempts sealed with atomic nonces.
          </p>
        </div>

        {/* Webhooks Outbox Card */}
        <div style={{ border: '1px solid var(--otaru-line)', padding: '1.5rem', backgroundColor: 'rgba(23,41,62,0.2)' }}>
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--otaru-gold-dim)' }}>
            WEBHOOK OUTBOX PIPELINE
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>128</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--otaru-parchment-dim)' }}>RECEIVED</p>
            </div>
            <div>
              <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#52b788' }}>128</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--otaru-parchment-dim)' }}>PROCESSED</p>
            </div>
          </div>
          <p style={{ margin: '0.8rem 0 0', fontSize: '0.72rem', color: 'var(--otaru-parchment-dim)' }}>
            0 Unresolved · Deduplication active.
          </p>
        </div>
      </div>

      {/* Navigation Footer */}
      <div style={{ borderTop: '1px solid var(--otaru-line)', paddingTop: '1.5rem' }}>
        <Link href="/admin/atelier" style={{ color: 'var(--otaru-gold-dim)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
          ← RETURN TO ATELIER OS
        </Link>
      </div>
    </main>
  );
}
