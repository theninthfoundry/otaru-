'use client';

import React from 'react';

export type NarrativeStage =
  | 'ORDER_ACCEPTED'
  | 'PAYMENT_CONFIRMED'
  | 'ATELIER_PREPARING'
  | 'QUALITY_INSPECTION'
  | 'PACKAGED'
  | 'IN_TRANSIT'
  | 'DELIVERED';

interface Milestone {
  key: NarrativeStage;
  label: string;
  kanji: string;
  context: string;
}

const MILESTONES: Milestone[] = [
  {
    key: 'ORDER_ACCEPTED',
    label: 'Order Accepted',
    kanji: '受納',
    context: 'The archive registry has recorded your acquisition.',
  },
  {
    key: 'PAYMENT_CONFIRMED',
    label: 'Payment Confirmed',
    kanji: '決済',
    context: 'Cryptographic ledger transaction settled and verified.',
  },
  {
    key: 'ATELIER_PREPARING',
    label: 'Atelier Preparing',
    kanji: '製織',
    context: 'Craftspeople at our Hokkaido stone warehouse have pulled your piece.',
  },
  {
    key: 'QUALITY_INSPECTION',
    label: 'Quality Inspection',
    kanji: '精査',
    context: 'Every garment undergoes tactile seam, dye, and measurement inspection.',
  },
  {
    key: 'PACKAGED',
    label: 'Packaged',
    kanji: '木香',
    context: 'Folded in cedar-infused tissue paper with hand-stamped archival deed.',
  },
  {
    key: 'IN_TRANSIT',
    label: 'In Transit',
    kanji: '輸送',
    context: 'Departed Hokkaido harbor wing with expedited tracking partner.',
  },
  {
    key: 'DELIVERED',
    label: 'Garment Archived',
    kanji: '収蔵',
    context: 'Object received and entered into your permanent private archive.',
  },
];

export interface OrderNarrativeJourneyProps {
  currentStage: NarrativeStage;
  orderNumber: string;
  garmentTitle: string;
  serialNumber?: string;
}

export function OrderNarrativeJourney({
  currentStage,
  orderNumber,
  garmentTitle,
  serialNumber,
}: OrderNarrativeJourneyProps) {
  const currentIndex = MILESTONES.findIndex((m) => m.key === currentStage);

  return (
    <div
      className="order-narrative-journey"
      style={{
        backgroundColor: 'var(--otaru-ink)',
        border: '1px solid var(--otaru-line)',
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        maxWidth: '680px',
        margin: '0 auto',
        color: 'var(--otaru-parchment)',
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--otaru-line)', paddingBottom: '1.2rem', marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--otaru-gold)' }}>
          ACQUISITION JOURNEY / 収蔵の道程
        </span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', margin: '0.3rem 0 0', fontWeight: 400 }}>
          {garmentTitle}
        </h2>
        <div style={{ marginTop: '0.4rem', display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--otaru-parchment-dim)', fontFamily: 'monospace' }}>
          <span>ORDER: {orderNumber}</span>
          {serialNumber && <span>SERIAL: {serialNumber}</span>}
        </div>
      </div>

      {/* 7 Calm Milestones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem', position: 'relative' }}>
        {MILESTONES.map((milestone, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isFuture = idx > currentIndex;

          return (
            <div
              key={milestone.key}
              style={{
                display: 'flex',
                gap: '1.2rem',
                alignItems: 'flex-start',
                opacity: isFuture ? 0.35 : 1,
              }}
            >
              {/* Dot & Kanji Indicator */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '24px' }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: isCurrent ? 'var(--otaru-gold)' : isPassed ? '#52b788' : 'var(--otaru-line-strong)',
                    border: isCurrent ? '3px solid rgba(217,189,131,0.25)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                />
              </div>

              {/* Text content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.96rem', color: isCurrent ? 'var(--otaru-gold)' : 'inherit' }}>
                    {milestone.label}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--otaru-parchment-dim)' }}>
                    {milestone.kanji}
                  </span>
                  {isCurrent && (
                    <span style={{ fontSize: '0.6rem', letterSpacing: '0.12em', padding: '0.1rem 0.4rem', backgroundColor: 'rgba(217,189,131,0.15)', color: 'var(--otaru-gold)' }}>
                      CURRENT
                    </span>
                  )}
                </div>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', lineHeight: 1.5, color: 'var(--otaru-parchment-dim)' }}>
                  {milestone.context}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
