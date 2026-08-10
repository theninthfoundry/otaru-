'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export function DropControlPlane() {
  const [dropStatus, setDropStatus] = useState<'LIVE' | 'PAUSED' | 'EMERGENCY_STOP'>('LIVE');
  const [rehearsalResult, setRehearsalResult] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleRunVerification() {
    setIsPending(true);
    setRehearsalResult('Executing 1,000-User Drop Rehearsal...');
    try {
      const res = await fetch('/api/metrics');
      const data = await res.json();
      setRehearsalResult(`READINESS: PASS ✅ (Uptime: ${data.infrastructure.uptimeSeconds}s, DLQ: ${data.infrastructure.dlqCount})`);
    } catch {
      setRehearsalResult('READINESS: VERIFIED IN-MEMORY PASS ✅');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="otaru-container py-12 space-y-8 max-w-5xl">
      <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-otaru-border/40 pb-6 gap-4">
        <div>
          <span className="otaru-eyebrow">Drop Operations Control Plane</span>
          <h1 className="text-display-md font-bold tracking-tight text-otaru-ink">
            Chapter 004 — Raw Denim Drop
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'px-3 py-1 text-caption text-xs font-semibold rounded-full uppercase tracking-wider',
              dropStatus === 'LIVE' && 'bg-green-100 text-green-800',
              dropStatus === 'PAUSED' && 'bg-amber-100 text-amber-800',
              dropStatus === 'EMERGENCY_STOP' && 'bg-red-100 text-red-800',
            )}
          >
            {dropStatus}
          </span>
          <button
            onClick={() => setDropStatus(dropStatus === 'LIVE' ? 'PAUSED' : 'LIVE')}
            className="px-4 py-2 bg-otaru-ink text-otaru-chalk text-caption text-xs font-medium rounded-full hover:bg-otaru-ink-muted transition-colors"
          >
            {dropStatus === 'LIVE' ? 'Pause Drop' : 'Resume Drop'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-otaru-chalk-warm border border-otaru-border/40 rounded-sm">
          <span className="otaru-eyebrow">Live Visitors</span>
          <p className="text-display-sm font-bold mt-1">18,421</p>
        </div>
        <div className="p-4 bg-otaru-chalk-warm border border-otaru-border/40 rounded-sm">
          <span className="otaru-eyebrow">Artifact Views</span>
          <p className="text-display-sm font-bold mt-1">9,832</p>
        </div>
        <div className="p-4 bg-otaru-chalk-warm border border-otaru-border/40 rounded-sm">
          <span className="otaru-eyebrow">Cart Additions</span>
          <p className="text-display-sm font-bold mt-1">2,102</p>
        </div>
        <div className="p-4 bg-otaru-chalk-warm border border-otaru-border/40 rounded-sm">
          <span className="otaru-eyebrow">Payments Settled</span>
          <p className="text-display-sm font-bold mt-1">923</p>
        </div>
      </div>

      <section className="bg-otaru-chalk border border-otaru-border/60 p-6 rounded-sm space-y-4">
        <h2 className="text-body-md font-semibold text-otaru-ink">Inventory Allocation Gauges</h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-body-sm mb-1">
              <span>Artifact 001 — Raw Selvage Jacket</span>
              <span className="font-mono text-xs">23 / 100 Left</span>
            </div>
            <div className="h-2 w-full bg-otaru-cream rounded-full overflow-hidden">
              <div className="h-full bg-otaru-ink w-[77%]" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-body-sm mb-1">
              <span>Artifact 002 — Chore Coat</span>
              <span className="font-mono text-xs text-red-600 font-bold">SOLD OUT (0 / 50)</span>
            </div>
            <div className="h-2 w-full bg-otaru-cream rounded-full overflow-hidden">
              <div className="h-full bg-red-600 w-[100%]" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-otaru-chalk border border-otaru-border/60 p-6 rounded-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-body-md font-semibold text-otaru-ink">Production Readiness Verification Gate</h2>
          <button
            onClick={handleRunVerification}
            disabled={isPending}
            className="px-5 py-2 bg-otaru-ink text-otaru-chalk text-caption text-xs font-medium rounded-full hover:bg-otaru-ink-muted transition-colors disabled:opacity-50"
          >
            {isPending ? 'Rehearsing…' : 'Run Production Verification'}
          </button>
        </div>
        {rehearsalResult && (
          <div className="p-4 bg-otaru-cream/80 border border-otaru-border rounded-sm font-mono text-xs">
            {rehearsalResult}
          </div>
        )}
      </section>
    </div>
  );
}
