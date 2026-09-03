'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface WorkItem {
  id: string;
  orderNumber: string;
  garmentSerial: string;
  garmentName: string;
  size: string;
  stage: 'INSPECTION' | 'PACKAGING' | 'DISPATCH_READY';
  assignedTo: string;
}

const INITIAL_WORK_QUEUE: WorkItem[] = [
  {
    id: '1',
    orderNumber: 'OTR-2026-000184',
    garmentSerial: 'OTR-2026-000184',
    garmentName: 'Chapter VII — Rain Study',
    size: 'IV',
    stage: 'INSPECTION',
    assignedTo: 'K. Sato (Cutter)',
  },
  {
    id: '2',
    orderNumber: 'OTR-2026-000185',
    garmentSerial: 'OTR-2026-000185',
    garmentName: 'Chapter VII — Rain Study',
    size: 'V',
    stage: 'PACKAGING',
    assignedTo: 'T. Murata (Dyer)',
  },
  {
    id: '3',
    orderNumber: 'OTR-2026-000186',
    garmentSerial: 'OTR-2026-000186',
    garmentName: 'Chapter I — Yama Field Jacket',
    size: 'III',
    stage: 'DISPATCH_READY',
    assignedTo: 'M. Otaru (Fulfillment)',
  },
];

export default function AtelierOsPage() {
  const [workQueue, setWorkQueue] = useState<WorkItem[]>(INITIAL_WORK_QUEUE);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const handleAdvance = (id: string) => {
    setActiveActionId(id);
    setTimeout(() => {
      setWorkQueue((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          if (item.stage === 'INSPECTION') return { ...item, stage: 'PACKAGING' };
          if (item.stage === 'PACKAGING') return { ...item, stage: 'DISPATCH_READY' };
          return item;
        })
      );
      setActiveActionId(null);
    }, 400);
  };

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
      {/* Top Identity Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--otaru-line)', paddingBottom: '1.2rem', marginBottom: '2.5rem' }}>
        <div>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--otaru-gold)' }}>
            OTARU ATELIER OS / 工房統括
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', margin: '0.3rem 0 0', fontWeight: 400 }}>
            Hokkaido Atelier Working Surface
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--otaru-parchment-dim)', fontFamily: 'monospace' }}>
            03 SEPTEMBER 2026 · JST 18:42
          </span>
          <div style={{ marginTop: '0.3rem', display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
            <Link href="/admin/reconciliation" style={{ fontSize: '0.72rem', letterSpacing: '0.1em', color: 'var(--otaru-gold-dim)', textDecoration: 'underline' }}>
              RECONCILIATION CENTER →
            </Link>
          </div>
        </div>
      </div>

      {/* TODAY's Operational Overview & Current Drop */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {/* Today's Queue Card */}
        <div style={{ border: '1px solid var(--otaru-line)', padding: '1.5rem', backgroundColor: 'rgba(23,41,62,0.2)' }}>
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--otaru-gold-dim)' }}>
            TODAY'S WORKLOAD
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '2rem' }}>08</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--otaru-parchment-dim)', letterSpacing: '0.1em' }}>PREPARING</p>
            </div>
            <div>
              <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '2rem' }}>04</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--otaru-parchment-dim)', letterSpacing: '0.1em' }}>INSPECTION</p>
            </div>
            <div>
              <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '2rem' }}>06</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--otaru-parchment-dim)', letterSpacing: '0.1em' }}>PACKAGING</p>
            </div>
            <div>
              <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '2rem' }}>03</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--otaru-parchment-dim)', letterSpacing: '0.1em' }}>READY TO SHIP</p>
            </div>
          </div>
        </div>

        {/* Current Drop Allocation Card */}
        <div style={{ border: '1px solid var(--otaru-line)', padding: '1.5rem', backgroundColor: 'rgba(23,41,62,0.2)' }}>
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--otaru-gold-dim)' }}>
            ACTIVE DROP ALLOCATION
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: '0.6rem 0 0.2rem', fontWeight: 400 }}>
            CHAPTER VII — RAIN STUDY
          </h2>
          <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: 'var(--otaru-parchment-dim)' }}>
            127 Acquired · 16 Remaining in Loom Run
          </p>

          {/* Allocation Progress Bar */}
          <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '88%', height: '100%', backgroundColor: 'var(--otaru-gold)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--otaru-parchment-dim)', marginTop: '0.5rem' }}>
            <span>Allocated: 88%</span>
            <span>Policy: Double-Entry Ledger</span>
          </div>
        </div>
      </div>

      {/* Atelier Work Queue */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: 0, fontWeight: 400 }}>
            Active Physical Garment Queue
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--otaru-parchment-dim)' }}>
            {workQueue.length} Pieces in Progress
          </span>
        </div>

        <div style={{ border: '1px solid var(--otaru-line)', backgroundColor: 'rgba(12,20,30,0.5)' }}>
          {workQueue.map((item) => {
            const isActing = activeActionId === item.id;
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.2rem 1.5rem',
                  borderBottom: '1px solid var(--otaru-line)',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--otaru-gold)' }}>
                    {item.garmentSerial}
                  </span>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', fontWeight: 500 }}>
                    {item.garmentName} ({item.size})
                  </p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: 'var(--otaru-parchment-dim)' }}>
                    Order: {item.orderNumber} · Inspector: {item.assignedTo}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                  <div
                    style={{
                      padding: '0.25rem 0.6rem',
                      border: '1px solid var(--otaru-line-strong)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: item.stage === 'DISPATCH_READY' ? '#52b788' : 'var(--otaru-gold-dim)',
                    }}
                  >
                    → {item.stage.replace('_', ' ')}
                  </div>

                  <button
                    type="button"
                    disabled={isActing}
                    onClick={() => handleAdvance(item.id)}
                    style={{
                      background: 'none',
                      border: '1px solid var(--otaru-gold)',
                      color: 'var(--otaru-gold)',
                      padding: '0.45rem 0.9rem',
                      fontSize: '0.72rem',
                      letterSpacing: '0.12em',
                      cursor: 'pointer',
                      opacity: isActing ? 0.5 : 1,
                    }}
                  >
                    {isActing
                      ? 'RECORDING...'
                      : item.stage === 'INSPECTION'
                      ? 'COMPLETE INSPECTION'
                      : item.stage === 'PACKAGING'
                      ? 'SEAL IN CEDAR BOX'
                      : 'GENERATE CARRIER AWB'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
