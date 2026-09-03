'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SashikoGrid, VerticalKanjiStamp } from '@/components/ui/ArchivalBackgroundArt';
import { ArtBackgroundPlate } from '@/components/ui/ArtBackgroundPlate';

interface TrackingStage {
  key: string;
  label: string;
  subtext: string;
  completed: boolean;
  active: boolean;
}

interface TrackingData {
  orderId: string;
  channelOrderId: string;
  status: string;
  statusText: string;
  courierName?: string;
  awbCode?: string;
  estimatedDelivery?: string;
  trackingUrl?: string;
  location?: string;
  updatedAt?: string;
}

export default function TrackOrderPage() {
  const [orderQuery, setOrderQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingResult, setTrackingResult] = useState<{
    tracking: TrackingData;
    stages: TrackingStage[];
    order?: {
      internalId: string;
      customerName: string;
      status: string;
      totalFormatted: string;
      itemsCount: number;
    } | null;
  } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/shipping/track?orderId=${encodeURIComponent(orderQuery.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'No shipment records found for this reference.');
        setTrackingResult(null);
      } else {
        setTrackingResult(data);
      }
    } catch {
      setError('Unable to reach the tracking service. Please try again.');
      setTrackingResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      <ArtBackgroundPlate artName="mount-fuji" position="top-right" opacity={0.15} maxWidth="720px" maxHeight="540px" />
      <SashikoGrid opacity={0.03} />
      <VerticalKanjiStamp text="輸送軌跡" subtext="TRANSIT LEDGER" top="15%" right="3%" opacity={0.05} />

      <div className="wrap page-wrap" style={{ paddingTop: '9rem', paddingBottom: '6rem', maxWidth: '720px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
          <span className="eyebrow" style={{ margin: 0 }}>Logistics & Dispatch</span>
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'var(--otaru-gold-dim)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            [ LIVE TELEMETRY ]
          </span>
        </div>

        <h1 className="section-title">Track your acquisition</h1>
        <p className="section-lede">
          Follow your parcel from our Hokkaido warehouse to your doorstep in real-time across all transit checkpoints.
        </p>

        {/* Search Input Card */}
        <div style={{ marginTop: '2.5rem', padding: '1.8rem', border: '1px solid var(--otaru-line)', backgroundColor: 'var(--otaru-dusk)' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label
                htmlFor="tracking-input"
                style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--otaru-gold)',
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontFamily: 'monospace',
                }}
              >
                Order Reference or AWB Number
              </label>
              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                <input
                  id="tracking-input"
                  type="text"
                  required
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="e.g. OTARU-REG-104921 or AWB84920"
                  style={{
                    flex: '1 1 240px',
                    background: 'var(--otaru-black)',
                    border: '1px solid var(--otaru-line-strong)',
                    padding: '0.85rem 1rem',
                    color: 'var(--otaru-parchment)',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                  style={{
                    padding: '0.85rem 1.6rem',
                    whiteSpace: 'nowrap',
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isLoading ? 'Querying Courier...' : 'Track Parcel →'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--otaru-parchment-dim)' }}>Sample test references:</span>
              <button
                type="button"
                onClick={() => setOrderQuery('OTARU-REG-104921')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--otaru-gold)',
                  fontSize: '0.68rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontFamily: 'monospace',
                }}
              >
                OTARU-REG-104921
              </button>
              <span style={{ color: 'var(--otaru-line-strong)' }}>·</span>
              <button
                type="button"
                onClick={() => setOrderQuery('AWB9201948')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--otaru-gold)',
                  fontSize: '0.68rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontFamily: 'monospace',
                }}
              >
                AWB9201948
              </button>
            </div>
          </form>

          {error && (
            <div
              style={{
                marginTop: '1.2rem',
                padding: '0.8rem 1rem',
                backgroundColor: 'rgba(181, 73, 50, 0.12)',
                border: '1px solid #b54932',
                color: '#f4efe2',
                fontSize: '0.82rem',
              }}
            >
              ⚠ {error}
            </div>
          )}
        </div>

        {/* Live Tracking Result Details */}
        {trackingResult && (
          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Summary Header */}
            <div
              style={{
                padding: '1.8rem',
                border: '1px solid var(--otaru-gold-dim)',
                backgroundColor: 'var(--otaru-dusk)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1.4rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--otaru-gold)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                  Current Status
                </span>
                <p style={{ margin: '0.3rem 0 0', fontSize: '1.15rem', fontFamily: 'var(--font-display)', color: 'var(--otaru-parchment)' }}>
                  {trackingResult.tracking.statusText}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--otaru-gold)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                  Courier Partner
                </span>
                <p style={{ margin: '0.3rem 0 0', fontSize: '1rem', color: 'var(--otaru-parchment)' }}>
                  {trackingResult.tracking.courierName || 'Bluedart Express'}
                </p>
                {trackingResult.tracking.awbCode && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--otaru-parchment-dim)', fontFamily: 'monospace' }}>
                    AWB: {trackingResult.tracking.awbCode}
                  </span>
                )}
              </div>

              <div>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--otaru-gold)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                  Estimated Arrival
                </span>
                <p style={{ margin: '0.3rem 0 0', fontSize: '1.05rem', color: 'var(--otaru-gold)' }}>
                  {trackingResult.tracking.estimatedDelivery || '2-3 Business Days'}
                </p>
              </div>
            </div>

            {/* Visual Milestones Timeline */}
            <div style={{ padding: '2rem', border: '1px solid var(--otaru-line)', backgroundColor: 'var(--otaru-dusk)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--otaru-parchment)', marginBottom: '1.6rem' }}>
                Archival Delivery Milestones
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', position: 'relative' }}>
                {trackingResult.stages.map((stage, idx) => {
                  const isDone = stage.completed;
                  const isCurrent = stage.active;

                  return (
                    <div
                      key={stage.key}
                      style={{
                        display: 'flex',
                        gap: '1.2rem',
                        alignItems: 'flex-start',
                        position: 'relative',
                      }}
                    >
                      {/* Status Icon */}
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: isDone ? 'var(--otaru-gold)' : isCurrent ? 'var(--otaru-indigo)' : 'var(--otaru-black)',
                          border: isCurrent ? '2px solid var(--otaru-gold)' : isDone ? '1px solid var(--otaru-gold)' : '1px solid var(--otaru-line-strong)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isDone ? 'var(--otaru-black)' : 'var(--otaru-parchment)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          flexShrink: 0,
                          zIndex: 2,
                        }}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, paddingBottom: idx === trackingResult.stages.length - 1 ? 0 : '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span
                            style={{
                              fontSize: '0.92rem',
                              fontWeight: isCurrent ? 600 : 400,
                              color: isDone || isCurrent ? 'var(--otaru-parchment)' : 'var(--otaru-parchment-dim)',
                            }}
                          >
                            {stage.label}
                          </span>
                          {isCurrent && (
                            <span
                              style={{
                                fontSize: '0.62rem',
                                letterSpacing: '0.14em',
                                color: 'var(--otaru-gold)',
                                textTransform: 'uppercase',
                                border: '1px solid var(--otaru-gold-dim)',
                                padding: '0.15rem 0.4rem',
                                borderRadius: '2px',
                                fontFamily: 'monospace',
                              }}
                            >
                              Current Node
                            </span>
                          )}
                        </div>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'var(--otaru-parchment-dim)' }}>
                          {stage.subtext}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {trackingResult.tracking.trackingUrl && (
                <div style={{ marginTop: '2rem', paddingTop: '1.4rem', borderTop: '1px solid var(--otaru-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--otaru-parchment-dim)' }}>
                    Need external carrier documentation?
                  </span>
                  <a
                    href={trackingResult.tracking.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-link"
                    style={{ fontSize: '0.8rem' }}
                  >
                    Open Courier Portal ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Support Link */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--otaru-parchment-dim)' }}>
            Questions regarding customs clearance or size fitting?{' '}
            <Link href="/returns" className="cta-link" style={{ color: 'var(--otaru-gold)' }}>
              Initiate a Repair or Return →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
