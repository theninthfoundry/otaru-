'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Transaction, LedgerStats } from '@/lib/payments/ledger';

// ── Utility Helpers ───────────────────────────────────────────────────────────

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Transaction['status'] }) {
  const configs = {
    CAPTURED: { label: 'CAPTURED', dot: 'bg-emerald-400', text: 'text-emerald-300', bg: 'bg-emerald-950/60 border-emerald-800/50' },
    CREATED:  { label: 'PENDING',  dot: 'bg-amber-400',   text: 'text-amber-300',   bg: 'bg-amber-950/60 border-amber-800/50' },
    FAILED:   { label: 'FAILED',   dot: 'bg-red-500',     text: 'text-red-300',     bg: 'bg-red-950/60 border-red-800/50' },
    REFUNDED: { label: 'REFUNDED', dot: 'bg-blue-400',    text: 'text-blue-300',    bg: 'bg-blue-950/60 border-blue-800/50' },
  };
  const c = configs[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-semibold tracking-widest', c.bg, c.text)}>
      <span className={cn('w-1.5 h-1.5 rounded-full inline-block', c.dot)} />
      {c.label}
    </span>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.03] border border-white/10 rounded-sm p-5 space-y-3 hover:bg-white/[0.05] transition-colors"
    >
      <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40">{label}</p>
      <p className={cn('text-2xl font-bold tracking-tight', accent || 'text-white')}>{value}</p>
      {sub && <p className="text-[10px] font-mono text-white/30">{sub}</p>}
    </motion.div>
  );
}

// ── Audit Log Entry ───────────────────────────────────────────────────────────

function AuditLine({ icon, color, label, time }: { icon: string; color: string; label: string; time: string }) {
  return (
    <div className="flex items-start gap-3 text-[11px] font-mono py-1.5 border-b border-white/5 last:border-0">
      <span className={cn('mt-0.5 shrink-0', color)}>{icon}</span>
      <span className="text-white/60 flex-1">{label}</span>
      <span className="text-white/25 shrink-0">{time}</span>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function LedgerAdminPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<LedgerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refundingId, setRefundingId] = useState<string | null>(null);
  const [refundSuccess, setRefundSuccess] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | Transaction['status']>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const tickerRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLedger = useCallback(async () => {
    try {
      const res = await fetch('/api/checkout/razorpay/ledger', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setTransactions(data.transactions || []);
      setStats(data.stats || null);
    } catch {
      // silent fail — dashboard is resilient
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLedger();
    // Poll every 15 seconds to auto-refresh ledger
    pollingRef.current = setInterval(fetchLedger, 15000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [fetchLedger]);

  const handleRefund = async (tx: Transaction) => {
    if (!confirm(`Issue refund of ${formatCurrency(tx.amount, tx.currency)} for order ${tx.orderId}?`)) return;
    setRefundingId(tx.id);
    try {
      const res = await fetch('/api/checkout/razorpay/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: tx.id }),
      });
      const data = await res.json();
      if (data.success) {
        setRefundSuccess(tx.id);
        setTimeout(() => setRefundSuccess(null), 3000);
        await fetchLedger();
      }
    } finally {
      setRefundingId(null);
    }
  };

  // Filtered + searched transactions
  const displayed = transactions.filter(tx => {
    const matchFilter = filter === 'ALL' || tx.status === filter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q
      || tx.orderId.toLowerCase().includes(q)
      || tx.customerId.toLowerCase().includes(q)
      || tx.customerName.toLowerCase().includes(q)
      || tx.id.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  // Build synthetic audit log from transaction history
  const auditLogs = transactions.flatMap(tx =>
    tx.history.map(h => ({
      icon: h.status === 'CAPTURED' ? '✓' : h.status === 'FAILED' ? '✕' : h.status === 'REFUNDED' ? '↩' : '→',
      color: h.status === 'CAPTURED' ? 'text-emerald-400' : h.status === 'FAILED' ? 'text-red-400' : h.status === 'REFUNDED' ? 'text-blue-400' : 'text-amber-400',
      label: `[${tx.orderId}] ${h.details}`,
      time: timeAgo(h.timestamp),
      ts: h.timestamp,
    }))
  ).sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime()).slice(0, 12);

  // Ticker items
  const tickerItems = [
    `RAZORPAY GATEWAY ${stats ? (stats.successRate >= 80 ? '● ONLINE' : '◎ DEGRADED') : '○ LOADING'}`,
    `TTV: ${stats ? formatCurrency(stats.ttv) : '—'}`,
    `SUCCESS RATE: ${stats ? `${stats.successRate}%` : '—'}`,
    `PENDING SESSIONS: ${stats?.activeSessions ?? '—'}`,
    `TOTAL ORDERS: ${stats?.totalOrders ?? '—'}`,
    `CSRF GUARD: ● ACTIVE`,
    `RATE LIMITER: ● ACTIVE`,
    `LEDGER: ● SEALED`,
  ];

  return (
    <div className="min-h-screen bg-[#080807] text-white font-mono overflow-x-hidden">

      {/* ── Ticker ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-white/10 bg-white/[0.02] py-2 overflow-hidden">
        <div className="flex gap-0 animate-[marquee_40s_linear_infinite] whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="text-[10px] uppercase tracking-[0.15em] text-white/40 px-8">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-10">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/30">Otaru — Secure Core</span>
              <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span className="text-[9px] font-mono text-emerald-400/60 uppercase tracking-wider">Ledger Active</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Cryptographic Ledger Control Room
            </h1>
            <p className="text-white/40 text-xs">
              Real-time payment registry, audit logs, and transaction management — Razorpay Integration
            </p>
          </div>
          <button
            onClick={fetchLedger}
            className="px-4 py-2 border border-white/15 text-white/50 text-[10px] font-mono uppercase tracking-widest rounded-sm hover:border-white/30 hover:text-white transition-colors"
          >
            ↻ Refresh
          </button>
        </div>

        {/* ── Stats Row ──────────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-sm p-5 h-24 animate-pulse" />
            ))}
          </div>
        ) : stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Transaction Volume"
              value={formatCurrency(stats.ttv)}
              sub={`${stats.totalOrders} total orders`}
              accent="text-emerald-300"
            />
            <StatCard
              label="Capture Success Rate"
              value={`${stats.successRate}%`}
              sub={`${stats.failureRate}% failure rate`}
              accent={stats.successRate >= 80 ? 'text-emerald-300' : 'text-amber-300'}
            />
            <StatCard
              label="Active Sessions"
              value={String(stats.activeSessions)}
              sub="Pending payment capture"
              accent="text-amber-300"
            />
            <StatCard
              label="Rate Limit Blocks"
              value={String(stats.rateLimitBlocks)}
              sub="Security events logged"
              accent={stats.rateLimitBlocks > 0 ? 'text-red-300' : 'text-white/50'}
            />
          </div>
        )}

        {/* ── Main Content Grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* ── Transaction Table (2/3 width) ──────────────────────────── */}
          <div className="xl:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                Ledger Entries
              </h2>
              <span className="text-[10px] font-mono text-white/30">
                {displayed.length} / {transactions.length} records
              </span>
            </div>

            {/* Controls */}
            <div className="flex gap-3 flex-wrap">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search order, email, ID..."
                className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-xs px-3 py-2 text-white text-[11px] font-mono placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
              />
              <div className="flex gap-1">
                {(['ALL', 'CAPTURED', 'CREATED', 'FAILED', 'REFUNDED'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      'px-3 py-2 text-[9px] font-mono uppercase tracking-wider rounded-xs border transition-all',
                      filter === f
                        ? 'bg-white text-black border-white'
                        : 'border-white/15 text-white/40 hover:border-white/30 hover:text-white/70'
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="border border-white/10 rounded-sm overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[2fr_1.5fr_1fr_1.2fr_auto] gap-4 px-5 py-3 bg-white/[0.04] border-b border-white/10">
                {['Registry Code', 'Patron', 'Value', 'Status', 'Actions'].map(h => (
                  <span key={h} className="text-[9px] font-mono uppercase tracking-[0.15em] text-white/30">{h}</span>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-[2fr_1.5fr_1fr_1.2fr_auto] gap-4 px-5 py-4 animate-pulse">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div key={j} className="h-3 bg-white/10 rounded" />
                      ))}
                    </div>
                  ))
                ) : displayed.length === 0 ? (
                  <div className="px-5 py-12 text-center text-white/30 text-xs font-mono">
                    No transactions match current filter.
                  </div>
                ) : (
                  displayed.map((tx, idx) => (
                    <React.Fragment key={tx.id}>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.04 }}
                        onClick={() => setExpandedRow(expandedRow === tx.id ? null : tx.id)}
                        className="grid grid-cols-[2fr_1.5fr_1fr_1.2fr_auto] gap-4 px-5 py-4 hover:bg-white/[0.03] cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-white text-[11px] font-semibold">{tx.orderId}</p>
                          <p className="text-white/30 text-[9px] mt-0.5 truncate max-w-[150px]">{tx.id}</p>
                        </div>
                        <div>
                          <p className="text-white/80 text-[11px] truncate">{tx.customerName}</p>
                          <p className="text-white/30 text-[9px] truncate">{tx.customerId}</p>
                        </div>
                        <div>
                          <p className="text-white text-[11px] font-semibold">
                            {formatCurrency(tx.amount, tx.currency)}
                          </p>
                          <p className="text-white/30 text-[9px]">{tx.method}</p>
                        </div>
                        <div>
                          <StatusBadge status={tx.status} />
                          <p className="text-white/25 text-[9px] mt-1">{timeAgo(tx.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          {tx.status === 'CAPTURED' && (
                            <button
                              onClick={() => handleRefund(tx)}
                              disabled={refundingId === tx.id}
                              className={cn(
                                'px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider rounded-xs border transition-all',
                                refundSuccess === tx.id
                                  ? 'border-emerald-700 text-emerald-400 bg-emerald-900/30'
                                  : 'border-red-900/50 text-red-400/60 hover:border-red-600 hover:text-red-300 hover:bg-red-950/30',
                                refundingId === tx.id && 'opacity-50 cursor-wait'
                              )}
                            >
                              {refundSuccess === tx.id ? '✓ Done' : refundingId === tx.id ? '...' : '↩ Refund'}
                            </button>
                          )}
                          <span className="text-white/20 text-xs">{expandedRow === tx.id ? '▲' : '▼'}</span>
                        </div>
                      </motion.div>

                      {/* Expanded Row: History Timeline */}
                      <AnimatePresence>
                        {expandedRow === tx.id && (
                          <motion.tr
                            key={`exp-${tx.id}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="block"
                          >
                            <td className="block p-0 border-0">
                              <div className="bg-white/[0.02] border-t border-white/5 px-6 py-5">
                                <div className="grid grid-cols-2 gap-8">
                                  <div>
                                    <p className="text-[9px] font-mono uppercase tracking-widest text-white/30 mb-3">Transaction History</p>
                                    <div className="space-y-2">
                                      {tx.history.map((h, i) => (
                                        <div key={i} className="flex items-start gap-3 text-[10px] font-mono">
                                          <span className={
                                            h.status === 'CAPTURED' ? 'text-emerald-400' :
                                            h.status === 'FAILED' ? 'text-red-400' :
                                            h.status === 'REFUNDED' ? 'text-blue-400' : 'text-amber-400'
                                          }>
                                            {h.status === 'CAPTURED' ? '✓' : h.status === 'FAILED' ? '✕' : h.status === 'REFUNDED' ? '↩' : '→'}
                                          </span>
                                          <div>
                                            <p className="text-white/60">{h.details}</p>
                                            <p className="text-white/25">{new Date(h.timestamp).toLocaleString()}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-mono uppercase tracking-widest text-white/30 mb-3">Security Verification</p>
                                    <div className="space-y-2">
                                      {[
                                        { label: 'CSRF Guard', passed: tx.security.csrfPass },
                                        { label: 'Rate Limiter', passed: tx.security.rateLimitPass },
                                        { label: 'Signature Verified', passed: tx.security.signatureVerified },
                                      ].map(({ label, passed }) => (
                                        <div key={label} className="flex items-center gap-2 text-[10px] font-mono">
                                          <span className={passed ? 'text-emerald-400' : 'text-red-400'}>{passed ? '✓' : '✕'}</span>
                                          <span className={passed ? 'text-white/50' : 'text-red-400/60'}>{label}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ── Right Panel: Security Audit Log ───────────────────────── */}
          <div className="xl:col-span-1 space-y-4">
            <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Security Audit Log
            </h2>

            {/* Gateway Status */}
            <div className="bg-white/[0.03] border border-white/10 rounded-sm p-4 space-y-3">
              <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/30">Gateway Status</p>
              <div className="space-y-2">
                {[
                  { label: 'Razorpay Gateway', status: 'ONLINE', color: 'text-emerald-400', dot: 'bg-emerald-400' },
                  { label: 'Webhook Endpoint', status: 'LISTENING', color: 'text-emerald-400', dot: 'bg-emerald-400' },
                  { label: 'CSRF Shield', status: 'ACTIVE', color: 'text-emerald-400', dot: 'bg-emerald-400' },
                  { label: 'Rate Limiter', status: 'ACTIVE', color: 'text-emerald-400', dot: 'bg-emerald-400' },
                  { label: 'Ledger Integrity', status: stats?.totalOrders ? 'SEALED' : 'EMPTY', color: stats?.totalOrders ? 'text-emerald-400' : 'text-amber-400', dot: stats?.totalOrders ? 'bg-emerald-400' : 'bg-amber-400' },
                ].map(({ label, status, color, dot }) => (
                  <div key={label} className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-white/50">{label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={cn('w-1.5 h-1.5 rounded-full', dot, 'animate-pulse')} />
                      <span className={color}>{status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Events */}
            <div className="bg-white/[0.03] border border-white/10 rounded-sm p-4 space-y-3">
              <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/30">Event Stream</p>
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-3 bg-white/10 rounded animate-pulse" />
                  ))}
                </div>
              ) : auditLogs.length === 0 ? (
                <p className="text-white/20 text-[10px] font-mono">No events recorded.</p>
              ) : (
                <div className="space-y-0 max-h-[400px] overflow-y-auto pr-1">
                  {auditLogs.map((log, i) => (
                    <AuditLine key={i} {...log} />
                  ))}
                </div>
              )}
            </div>

            {/* Key Config Status */}
            <div className="bg-white/[0.03] border border-white/10 rounded-sm p-4 space-y-3">
              <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/30">Environment Keys</p>
              <div className="space-y-2">
                {[
                  { label: 'NEXT_PUBLIC_RAZORPAY_KEY_ID', envKey: 'NEXT_PUBLIC_RAZORPAY_KEY_ID' },
                  { label: 'RAZORPAY_KEY_SECRET', envKey: 'secret' },
                  { label: 'RAZORPAY_WEBHOOK_SECRET', envKey: 'webhook' },
                ].map(({ label }) => (
                  <div key={label} className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-white/40 truncate text-[9px]">{label}</span>
                    <span className="text-amber-400/70 shrink-0 ml-2">⚠ Check .env</span>
                  </div>
                ))}
              </div>
              <p className="text-[9px] font-mono text-white/20 leading-relaxed">
                Add keys to .env.local to enable live Razorpay mode. Without keys, all payments run in Interactive Sandbox mode.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex gap-2 flex-wrap">
              <a
                href="/checkout"
                className="flex-1 text-center px-3 py-2.5 border border-white/15 text-white/50 text-[9px] font-mono uppercase tracking-wider rounded-xs hover:border-white/30 hover:text-white transition-colors"
              >
                → Checkout
              </a>
              <a
                href="/archive"
                className="flex-1 text-center px-3 py-2.5 border border-white/15 text-white/50 text-[9px] font-mono uppercase tracking-wider rounded-xs hover:border-white/30 hover:text-white transition-colors"
              >
                → Archive
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker animation keyframe */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
