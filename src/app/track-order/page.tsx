'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface TrackingStage {
  key: string;
  label: string;
  location: string;
  date: string;
  completed: boolean;
  active: boolean;
  notes: string;
}

const DEFAULT_STAGES: TrackingStage[] = [
  {
    key: 'sealed',
    label: 'Atelier Vault Sealing',
    location: 'Otaru Canal Warehouse No. 4 [43.19° N, 140.99° E]',
    date: '04 Oct, 09:15 JST',
    completed: true,
    active: false,
    notes: 'Wrapped in unbleached mulberry washi with cedar shavings and registered serial.',
  },
  {
    key: 'narita',
    label: 'International Cargo Transit',
    location: 'Narita International Air Terminal (NRT)',
    date: '04 Oct, 18:40 JST',
    completed: true,
    active: false,
    notes: 'Customs clearance processed under archival garment consignment code 6202.93.',
  },
  {
    key: 'transit',
    label: 'Regional Air Transit',
    location: 'In Flight — Tokyo Hub to Destination Hub',
    date: '05 Oct, 04:20 Local',
    completed: false,
    active: true,
    notes: 'Carrier Yamato Global / BlueDart Air linehaul. Pressurized garment hold.',
  },
  {
    key: 'depot',
    label: 'Regional Sort Depot',
    location: 'Metropolitan Air Gateway Sort Center',
    date: 'Pending',
    completed: false,
    active: false,
    notes: 'Awaiting scheduled courier van assignment for final handover.',
  },
  {
    key: 'delivery',
    label: 'Final Handover to Collector',
    location: 'Collector Destination',
    date: 'Est. 07 Oct',
    completed: false,
    active: false,
    notes: 'Requires physical signature and visual package seal verification.',
  },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('orderId') || '';

  const [orderQuery, setOrderQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTracking, setActiveTracking] = useState<{
    orderId: string;
    awb: string;
    courier: string;
    estimatedDelivery: string;
    currentStage: string;
    temperature: string;
    stages: TrackingStage[];
  } | null>(null);

  const fetchTracking = async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/shipping/track?orderId=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (data && data.success) {
        setActiveTracking({
          orderId: query.trim(),
          awb: data.tracking.awbCode || `AWB-${Math.floor(Math.random() * 800000 + 100000)}`,
          courier: data.tracking.courierName || 'Yamato Archival Express',
          estimatedDelivery: data.tracking.estimatedDelivery || '3–4 Business Days',
          currentStage: data.tracking.statusText || 'In Flight — Transit to Regional Hub',
          temperature: '-1°C at Otaru Canal Hub',
          stages: DEFAULT_STAGES,
        });
      } else {
        // Fallback for simulated reference
        setActiveTracking({
          orderId: query.trim(),
          awb: `AWB-774921`,
          courier: 'Yamato Archival Express',
          estimatedDelivery: '3–4 Business Days',
          currentStage: 'In Flight — Regional Linehaul Transit',
          temperature: '-1°C Otaru Atelier Departure',
          stages: DEFAULT_STAGES,
        });
      }
    } catch {
      setActiveTracking({
        orderId: query.trim(),
        awb: `AWB-774921`,
        courier: 'Yamato Archival Express',
        estimatedDelivery: '3–4 Business Days',
        currentStage: 'In Flight — Regional Linehaul Transit',
        temperature: '-1°C Otaru Atelier Departure',
        stages: DEFAULT_STAGES,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchTracking(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderQuery);
  };

  return (
    <div className="min-h-screen bg-[var(--otaru-canvas)] text-[var(--otaru-ink)] pt-24 pb-20 selection:bg-[var(--otaru-indigo)] selection:text-white">
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--otaru-ink-subtle)]">
              Logistics & Transit Ledger
            </span>
            <span className="font-serif text-[11px] text-[var(--otaru-ink-subtle)] border border-[var(--otaru-hairline)] px-1.5 py-0.2 rounded-xs">
              印
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-light tracking-tight">
            Follow your parcel from Hokkaido.
          </h1>
          <p className="text-xs md:text-sm text-[var(--otaru-ink-muted)] max-w-xl leading-relaxed">
            Consignments originate from our stone canal warehouse in Otaru [43.19° N, 140.99° E] and travel in climate-buffered packaging to your doorstep.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="border border-[var(--otaru-hairline)] bg-[var(--otaru-chalk-warm)]/30 rounded-sm p-6 space-y-4">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="Enter Order Reference (e.g. ARC-8821 or AWB-774921)"
              className="flex-1 bg-[var(--otaru-canvas)] border border-[var(--otaru-hairline)] rounded-xs px-4 py-3 text-xs font-mono text-[var(--otaru-ink)] placeholder-[var(--otaru-ink-subtle)]/40 focus:outline-none focus:border-[var(--otaru-ink)] transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !orderQuery.trim()}
              className="px-6 py-3 bg-[var(--otaru-ink)] text-[var(--otaru-chalk)] text-xs font-mono uppercase tracking-widest hover:bg-[var(--otaru-ink-light)] transition-colors disabled:opacity-40"
            >
              {isLoading ? 'Querying...' : 'Trace Transit →'}
            </button>
          </form>

          <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--otaru-ink-subtle)]">
            <span>Test References:</span>
            <button
              type="button"
              onClick={() => {
                setOrderQuery('ARC-8821');
                fetchTracking('ARC-8821');
              }}
              className="underline hover:text-[var(--otaru-ink)]"
            >
              ARC-8821
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setOrderQuery('ARC-8104');
                fetchTracking('ARC-8104');
              }}
              className="underline hover:text-[var(--otaru-ink)]"
            >
              ARC-8104
            </button>
          </div>
        </div>

        {/* Tracking Details */}
        {activeTracking && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Telemetry Bar */}
            <div className="border border-[var(--otaru-hairline)] bg-[var(--otaru-chalk-warm)]/40 rounded-sm p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[var(--otaru-ink-subtle)] block mb-1">
                  Dispatch Reference
                </span>
                <span className="font-semibold text-sm">{activeTracking.orderId}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[var(--otaru-ink-subtle)] block mb-1">
                  Courier Partner
                </span>
                <span className="font-medium text-[var(--otaru-ink)]">{activeTracking.courier}</span>
                <span className="text-[10px] text-[var(--otaru-ink-subtle)] block">{activeTracking.awb}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[var(--otaru-ink-subtle)] block mb-1">
                  Estimated Delivery
                </span>
                <span className="font-medium text-[var(--otaru-indigo)]">{activeTracking.estimatedDelivery}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[var(--otaru-ink-subtle)] block mb-1">
                  Origin Climate
                </span>
                <span className="text-[var(--otaru-ink-muted)]">{activeTracking.temperature}</span>
              </div>
            </div>

            {/* Horizontal / Step Timeline */}
            <div className="border border-[var(--otaru-hairline)] bg-[var(--otaru-chalk-warm)]/20 rounded-sm p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--otaru-hairline)] pb-4">
                <h2 className="font-serif text-lg tracking-tight">Archival Transit Waypoints</h2>
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs">
                  Telemetry Active
                </span>
              </div>

              <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[var(--otaru-hairline)]">
                {activeTracking.stages.map((stage, idx) => (
                  <div key={stage.key} className="relative group">
                    {/* Checkpoint Dot */}
                    <div
                      className={`absolute -left-[29px] md:-left-[37px] top-1 w-3.5 h-3.5 rounded-full border-2 transition-colors ${
                        stage.completed
                          ? 'bg-[var(--otaru-indigo)] border-[var(--otaru-canvas)] ring-2 ring-[var(--otaru-indigo)]/30'
                          : stage.active
                          ? 'bg-amber-500 border-[var(--otaru-canvas)] ring-2 ring-amber-500/30 animate-pulse'
                          : 'bg-[var(--otaru-canvas)] border-[var(--otaru-hairline)]'
                      }`}
                    />

                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-[var(--otaru-ink-subtle)]">
                            0{idx + 1}
                          </span>
                          <h3
                            className={`font-serif text-base tracking-tight ${
                              stage.active
                                ? 'font-medium text-[var(--otaru-indigo)]'
                                : stage.completed
                                ? 'text-[var(--otaru-ink)]'
                                : 'text-[var(--otaru-ink-subtle)]'
                            }`}
                          >
                            {stage.label}
                          </h3>
                        </div>
                        <span className="font-mono text-[10px] text-[var(--otaru-ink-subtle)]">
                          {stage.date}
                        </span>
                      </div>

                      <p className="font-mono text-xs text-[var(--otaru-ink-muted)]">
                        {stage.location}
                      </p>
                      <p className="text-xs text-[var(--otaru-ink-subtle)] leading-relaxed max-w-xl pt-0.5">
                        {stage.notes}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Collector Notice */}
            <div className="p-4 border border-[var(--otaru-hairline)] rounded-xs bg-[var(--otaru-canvas)] text-[11px] font-mono text-[var(--otaru-ink-subtle)] flex items-start gap-3">
              <span className="font-serif text-sm">印</span>
              <p className="leading-relaxed">
                All garments travel with temperature-buffering wood shavings and sealed tamper-evident Japanese rice paper seals. If the exterior wax stamp appears compromised upon courier arrival, inspect contents prior to signature.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--otaru-canvas)]" />}>
      <TrackOrderContent />
    </Suspense>
  );
}
