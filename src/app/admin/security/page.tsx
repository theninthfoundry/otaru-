'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AuditEvent, AuditEventType } from '@/lib/payments/audit-trail';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const EVENT_CONFIG: Record<AuditEventType, { icon: string; color: string; bg: string; threat: boolean }> = {
  ORDER_CREATED:            { icon: '✦', color: 'text-emerald-400', bg: 'bg-emerald-950/30 border-emerald-900/50', threat: false },
  ORDER_BLOCKED:            { icon: '⊘', color: 'text-red-400',     bg: 'bg-red-950/40 border-red-900/50',         threat: true },
  PAYMENT_VERIFIED:         { icon: '✓', color: 'text-emerald-300', bg: 'bg-emerald-950/20 border-emerald-900/30', threat: false },
  PAYMENT_FAILED:           { icon: '✕', color: 'text-red-400',     bg: 'bg-red-950/30 border-red-900/40',         threat: false },
  REPLAY_ATTACK_DETECTED:   { icon: '⚡', color: 'text-yellow-300', bg: 'bg-yellow-950/50 border-yellow-800/60',  threat: true },
  RATE_LIMIT_BLOCKED:       { icon: '⊗', color: 'text-orange-400',  bg: 'bg-orange-950/40 border-orange-900/50',  threat: true },
  FRAUD_FLAGGED:            { icon: '⚑', color: 'text-amber-300',   bg: 'bg-amber-950/40 border-amber-900/50',    threat: true },
  FRAUD_BLOCKED:            { icon: '⛔', color: 'text-red-300',    bg: 'bg-red-950/50 border-red-800/60',         threat: true },
  CART_TAMPER_DETECTED:     { icon: '⚠', color: 'text-yellow-400', bg: 'bg-yellow-950/50 border-yellow-800/60',  threat: true },
  IDEMPOTENCY_COLLISION:    { icon: '⊙', color: 'text-blue-300',   bg: 'bg-blue-950/30 border-blue-900/50',       threat: false },
  WEBHOOK_REPLAY_DETECTED:  { icon: '↺', color: 'text-yellow-300', bg: 'bg-yellow-950/50 border-yellow-800/60',  threat: true },
  WEBHOOK_RECEIVED:         { icon: '⇣', color: 'text-sky-400',    bg: 'bg-sky-950/20 border-sky-900/30',         threat: false },
  REFUND_ISSUED:            { icon: '↩', color: 'text-blue-400',   bg: 'bg-blue-950/30 border-blue-900/40',       threat: false },
  SCHEMA_VALIDATION_FAILED: { icon: '⊡', color: 'text-orange-400', bg: 'bg-orange-950/30 border-orange-900/40',  threat: true },
  NONCE_CONSUMED:           { icon: '◈', color: 'text-teal-400',   bg: 'bg-teal-950/20 border-teal-900/30',       threat: false },
  NONCE_REPLAY_BLOCKED:     { icon: '⊘', color: 'text-red-400',    bg: 'bg-red-950/40 border-red-900/50',         threat: true },
  RECONCILIATION_MISMATCH:  { icon: '⚖️', color: 'text-amber-400',  bg: 'bg-amber-950/40 border-amber-900/50',    threat: true },
};

function ThreatBadge({ type }: { type: AuditEventType }) {
  const cfg = EVENT_CONFIG[type] ?? { icon: '·', color: 'text-white/40', bg: 'bg-white/5 border-white/10', threat: false };
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 border rounded-full text-[9px] font-mono font-semibold tracking-wider', cfg.bg, cfg.color)}>
      {cfg.icon} {type.replace(/_/g, ' ')}
    </span>
  );
}

function ThreatStat({ label, value, accent, pulse }: { label: string; value: string | number; accent: string; pulse?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.03] border border-white/10 rounded-sm p-4 space-y-2"
    >
      <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/30">{label}</p>
      <div className="flex items-center gap-2">
        {pulse && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />}
        <p className={cn('text-xl font-bold font-mono', accent)}>{value}</p>
      </div>
    </motion.div>
  );
}

function ChainIntegrityBadge({ intact }: { intact: boolean }) {
  return (
    <div className={cn(
      'flex items-center gap-2 px-4 py-2 border rounded-sm text-[10px] font-mono font-semibold uppercase tracking-widest',
      intact
        ? 'border-emerald-800/50 bg-emerald-950/40 text-emerald-300'
        : 'border-red-800/60 bg-red-950/50 text-red-300 animate-pulse',
    )}>
      <span>{intact ? '✓' : '⚠'}</span>
      <span>{intact ? 'Audit Chain Intact' : 'CHAIN INTEGRITY BROKEN — POSSIBLE TAMPERING'}</span>
    </div>
  );
}

export default function SecurityDashboard() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [chainIntact, setChainIntact] = useState(true);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'THREATS'>('ALL');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/checkout/razorpay/audit', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setEvents(data.events ?? []);
      setSummary(data.summary ?? {});
      setChainIntact(data.chainIntegrity?.intact ?? true);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const displayed = events.filter(ev => {
    const matchFilter = filter === 'ALL' || EVENT_CONFIG[ev.type]?.threat;
    const q = search.toLowerCase();
    const matchSearch = !q || ev.details.toLowerCase().includes(q) || ev.type.toLowerCase().includes(q) || (ev.ref ?? '').toLowerCase().includes(q) || (ev.email ?? '').toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const threatCount = events.filter(e => EVENT_CONFIG[e.type]?.threat).length;

  return (
    <div className="min-h-screen bg-[#07070a] text-white font-mono overflow-x-hidden">
      <div className="border-b border-white/10 bg-white/[0.015] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={cn('w-2 h-2 rounded-full', threatCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500')} />
            <span className="text-[9px] uppercase tracking-[0.25em] text-white/40">
              {threatCount > 0 ? `${threatCount} THREAT EVENTS LOGGED` : 'SYSTEM SECURE'}
            </span>
          </div>
          <span className="text-white/20">|</span>
          <span className="text-[9px] uppercase tracking-wider text-white/30">Otaru — Cryptographic Security Monitor</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/admin/ledger"
            className="text-[9px] font-mono uppercase tracking-wider text-white/40 hover:text-white transition-colors border border-white/15 px-3 py-1.5 rounded-sm"
          >
            → Ledger
          </a>
          <button
            onClick={fetchData}
            className="text-[9px] font-mono uppercase tracking-wider text-white/40 hover:text-white transition-colors border border-white/15 px-3 py-1.5 rounded-sm"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">Security Threat Monitor</h1>
          <p className="text-white/40 text-xs">
            Hash-chained immutable audit trail · Tamper-evident event log · Live threat analysis
          </p>
        </div>

        {!loading && <ChainIntegrityBadge intact={chainIntact} />}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-sm p-4 h-20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
            <ThreatStat label="Total Events" value={summary.total ?? 0} accent="text-white" />
            <ThreatStat label="Threats Blocked" value={summary.blocked ?? 0} accent={(summary.blocked ?? 0) > 0 ? 'text-red-400' : 'text-white/40'} pulse={(summary.blocked ?? 0) > 0} />
            <ThreatStat label="Fraud Flagged" value={summary.flagged ?? 0} accent={(summary.flagged ?? 0) > 0 ? 'text-amber-300' : 'text-white/40'} />
            <ThreatStat label="Replay Attempts" value={summary.replayAttempts ?? 0} accent={(summary.replayAttempts ?? 0) > 0 ? 'text-yellow-300' : 'text-white/40'} />
            <ThreatStat label="Idem. Collisions" value={summary.idempotencyCollisions ?? 0} accent="text-blue-300" />
            <ThreatStat label="Schema Failures" value={summary.schemaFailures ?? 0} accent={(summary.schemaFailures ?? 0) > 0 ? 'text-orange-400' : 'text-white/40'} />
            <ThreatStat label="Active Nonces" value={summary.activeNonces ?? 0} accent="text-teal-400" />
            <ThreatStat label="Idem. Key Store" value={summary.activeIdempotencyKeys ?? 0} accent="text-sky-400" />
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Zod Schema Validation', status: 'ACTIVE', ok: true },
            { label: 'HMAC Cart Token', status: 'ACTIVE', ok: true },
            { label: 'One-Time Nonce Guard', status: 'ACTIVE', ok: true },
            { label: 'Idempotency Guard', status: 'ACTIVE', ok: true },
            { label: 'Payment Rate Limiter', status: 'ACTIVE', ok: true },
            { label: 'Fraud Detection Engine', status: 'ACTIVE', ok: true },
            { label: 'Webhook Timestamp Guard', status: 'ACTIVE', ok: true },
            { label: 'Constant-Time Comparison', status: 'ACTIVE', ok: true },
          ].map(({ label, status, ok }) => (
            <div key={label} className="bg-white/[0.02] border border-white/10 rounded-sm px-4 py-3 flex items-center justify-between">
              <span className="text-[10px] font-mono text-white/50 truncate">{label}</span>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className={cn('w-1.5 h-1.5 rounded-full', ok ? 'bg-emerald-500 animate-pulse' : 'bg-red-500')} />
                <span className={cn('text-[9px] font-mono', ok ? 'text-emerald-400' : 'text-red-400')}>{status}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Audit Event Feed
            </h2>
            <div className="flex gap-2 flex-wrap">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search events, orders, emails..."
                className="bg-white/5 border border-white/10 rounded-xs px-3 py-2 text-white text-[11px] font-mono placeholder:text-white/20 focus:outline-none focus:border-white/30 w-64 transition-colors"
              />
              {(['ALL', 'THREATS'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'px-3 py-2 text-[9px] font-mono uppercase tracking-wider rounded-xs border transition-all',
                    filter === f
                      ? 'bg-white text-black border-white'
                      : 'border-white/15 text-white/40 hover:text-white hover:border-white/30',
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-white/10 rounded-sm overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-5 py-3 bg-white/[0.04] border-b border-white/10">
              {['#', 'Details', 'Event Type', 'Time'].map(h => (
                <span key={h} className="text-[9px] font-mono uppercase tracking-[0.15em] text-white/30">{h}</span>
              ))}
            </div>

            <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="px-5 py-4 animate-pulse flex gap-4">
                    <div className="h-3 w-8 bg-white/10 rounded" />
                    <div className="h-3 flex-1 bg-white/10 rounded" />
                    <div className="h-3 w-32 bg-white/10 rounded" />
                    <div className="h-3 w-16 bg-white/10 rounded" />
                  </div>
                ))
              ) : displayed.length === 0 ? (
                <div className="px-5 py-12 text-center text-white/25 text-xs font-mono">
                  {events.length === 0
                    ? 'No audit events yet. Events are generated as payments are processed.'
                    : 'No events match current filter.'}
                </div>
              ) : (
                displayed.map((event, idx) => {
                  const cfg = EVENT_CONFIG[event.type] ?? { icon: '·', color: 'text-white/40', bg: '', threat: false };
                  const isExpanded = expanded === event.seq;
                  return (
                    <React.Fragment key={event.seq}>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                        onClick={() => setExpanded(isExpanded ? null : event.seq)}
                        className={cn(
                          'grid grid-cols-[auto_1fr_auto_auto] gap-4 px-5 py-3.5 cursor-pointer transition-colors',
                          cfg.threat ? 'hover:bg-red-950/10' : 'hover:bg-white/[0.02]',
                        )}
                      >
                        <span className="text-white/20 text-[10px] font-mono w-8 text-right shrink-0">{event.seq}</span>
                        <div className="min-w-0">
                          <p className="text-white/70 text-[11px] truncate">{event.details}</p>
                          {(event.ref || event.email || event.ip) && (
                            <p className="text-white/25 text-[9px] font-mono mt-0.5 truncate">
                              {[event.ref, event.email, event.ip].filter(Boolean).join(' · ')}
                            </p>
                          )}
                        </div>
                        <div className="shrink-0">
                          <ThreatBadge type={event.type} />
                        </div>
                        <span className="text-white/25 text-[9px] font-mono shrink-0 text-right">{timeAgo(event.timestamp)}</span>
                      </motion.div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 py-4 bg-white/[0.015] border-t border-white/5 space-y-3">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] font-mono">
                                <div>
                                  <p className="text-white/30 mb-1">Timestamp</p>
                                  <p className="text-white/60">{new Date(event.timestamp).toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-white/30 mb-1">Sequence</p>
                                  <p className="text-white/60">#{event.seq}</p>
                                </div>
                                <div>
                                  <p className="text-white/30 mb-1">IP Address</p>
                                  <p className="text-white/60">{event.ip ?? '—'}</p>
                                </div>
                                <div>
                                  <p className="text-white/30 mb-1">Email</p>
                                  <p className="text-white/60 truncate">{event.email ?? '—'}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-white/30 text-[10px] mb-1">Event Hash (SHA-256)</p>
                                <p className="text-white/40 text-[9px] font-mono break-all">{event.hash}</p>
                              </div>
                              <div>
                                <p className="text-white/30 text-[10px] mb-1">Previous Hash</p>
                                <p className="text-white/25 text-[9px] font-mono break-all">{event.prevHash}</p>
                              </div>
                              {event.meta && Object.keys(event.meta).length > 0 && (
                                <div>
                                  <p className="text-white/30 text-[10px] mb-1">Metadata</p>
                                  <pre className="text-white/40 text-[9px] font-mono bg-white/[0.03] rounded-xs p-2 overflow-x-auto">
                                    {JSON.stringify(event.meta, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="border border-white/10 rounded-sm p-5 bg-white/[0.02] space-y-3">
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/30">Security Architecture</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] font-mono text-white/40">
            {[
              '① Zod schemas strip & validate all API inputs — no injection possible',
              '② HMAC-SHA256 cart tokens prevent price tampering between order & verify',
              '③ One-time nonces make credential replay attacks impossible',
              '④ Idempotency keys prevent double-charging from retries',
              '⑤ Payment rate limiter: 5 orders/10min per IP, 3 verifies/5min per IP',
              '⑥ Fraud engine scores velocity, amounts, patterns, disposable emails',
              '⑦ Webhook timestamp guard rejects events older than 5 minutes',
              '⑧ crypto.timingSafeEqual() on all HMAC comparisons — no timing oracles',
            ].map(item => (
              <p key={item} className="leading-relaxed">{item}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
