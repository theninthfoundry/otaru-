'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SashikoGrid, VerticalKanjiStamp } from '@/components/ui/ArchivalBackgroundArt';
import { ArtBackgroundPlate } from '@/components/ui/ArtBackgroundPlate';

type FlowType = 'REPAIR' | 'RETURN';

const REPAIR_SERVICES = [
  { id: 'boro', label: 'Boro Visible Mending', desc: 'Hand-sewn antique indigo patch application with Japanese sashiko thread.' },
  { id: 'wax', label: 'Waxed Canvas Re-Proofing', desc: 'Complete hot beeswax infusion and water-repellency re-treatment.' },
  { id: 'seam', label: 'Double-Needle Seam Reinforcement', desc: 'Structural chainstitch repair at high-stress tension points.' },
  { id: 'button', label: 'Oxidized Horn Button Replacement', desc: 'Replacements secured with heavy-duty flax linen thread.' },
];

const RETURN_REASONS = [
  { id: 'size_exchange', label: 'Size Exchange', desc: 'Exchange for an alternate size with priority reservation.' },
  { id: 'fit_preference', label: 'Silhouette / Fit Adjustment', desc: 'The architectural drape differs from your preference.' },
  { id: 'fabric_feel', label: 'Fabric / Texture Expectation', desc: 'Bast hemp or raw indigo stiffness differs from anticipated wear.' },
  { id: 'other', label: 'Other Archival Inquiry', desc: 'Return for full refund to original payment source.' },
];

export default function ReturnsPage() {
  const [activeTab, setActiveTab] = useState<FlowType>('REPAIR');
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [garmentNumber, setGarmentNumber] = useState('041');
  const [reason, setReason] = useState(activeTab === 'REPAIR' ? 'Boro Visible Mending' : 'Size Exchange');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    rmaNumber: string;
    type: FlowType;
    status: string;
    pickupTimeline: string;
    instructions: string[];
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !email.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/shipping/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderId.trim(),
          email: email.trim(),
          type: activeTab,
          reason,
          garmentNumber,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to authorize request. Please verify order details.');
      } else {
        setResult(data);
      }
    } catch {
      setError('Network communication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      <ArtBackgroundPlate artName="pine-tree" position="top-right" opacity={0.16} maxWidth="760px" maxHeight="560px" />
      <SashikoGrid opacity={0.035} />
      <VerticalKanjiStamp text="修復保証" subtext="LIFETIME RESTORATION" top="15%" right="2.5%" opacity={0.05} />

      <div className="wrap page-wrap" style={{ paddingTop: '9rem', paddingBottom: '6rem', maxWidth: '780px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
          <span className="eyebrow" style={{ margin: 0 }}>Support & Care</span>
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'var(--otaru-gold-dim)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            [ LIFETIME GUARANTEE ]
          </span>
        </div>

        <h1 className="section-title">Lifetime repair & returns</h1>
        <p className="section-lede">
          We believe an acquisition from Otaru marks the beginning of a lifelong stewardship. Every garment is eligible for lifetime repair.
        </p>

        {/* Mode Selector Tabs */}
        <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', borderBottom: '1px solid var(--otaru-line)', paddingBottom: '1rem' }}>
          <button
            type="button"
            onClick={() => {
              setActiveTab('REPAIR');
              setReason('Boro Visible Mending');
              setResult(null);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'REPAIR' ? '2px solid var(--otaru-gold)' : '2px solid transparent',
              padding: '0.6rem 1rem',
              color: activeTab === 'REPAIR' ? 'var(--otaru-parchment)' : 'var(--otaru-parchment-dim)',
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontWeight: activeTab === 'REPAIR' ? 600 : 400,
              fontFamily: 'monospace',
            }}
          >
            ✦ Free Lifetime Repair
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('RETURN');
              setReason('Size Exchange');
              setResult(null);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'RETURN' ? '2px solid var(--otaru-gold)' : '2px solid transparent',
              padding: '0.6rem 1rem',
              color: activeTab === 'RETURN' ? 'var(--otaru-parchment)' : 'var(--otaru-parchment-dim)',
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontWeight: activeTab === 'RETURN' ? 600 : 400,
              fontFamily: 'monospace',
            }}
          >
            30-Day Unworn Returns
          </button>
        </div>

        {/* Portal Form / Authorization Receipt */}
        {!result ? (
          <form
            onSubmit={handleSubmit}
            style={{
              marginTop: '2rem',
              padding: '2rem',
              border: '1px solid var(--otaru-line)',
              backgroundColor: 'var(--otaru-dusk)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.4rem',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
              <div>
                <label
                  htmlFor="rma-order-id"
                  style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--otaru-gold)',
                    display: 'block',
                    marginBottom: '0.4rem',
                    fontFamily: 'monospace',
                  }}
                >
                  Order Reference *
                </label>
                <input
                  id="rma-order-id"
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. OTARU-REG-104921"
                  style={{
                    width: '100%',
                    background: 'var(--otaru-black)',
                    border: '1px solid var(--otaru-line-strong)',
                    padding: '0.75rem 0.9rem',
                    color: 'var(--otaru-parchment)',
                    fontFamily: 'monospace',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="rma-garment"
                  style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--otaru-gold)',
                    display: 'block',
                    marginBottom: '0.4rem',
                    fontFamily: 'monospace',
                  }}
                >
                  Object Number
                </label>
                <select
                  id="rma-garment"
                  value={garmentNumber}
                  onChange={(e) => setGarmentNumber(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--otaru-black)',
                    border: '1px solid var(--otaru-line-strong)',
                    padding: '0.75rem 0.9rem',
                    color: 'var(--otaru-parchment)',
                    fontFamily: 'monospace',
                    outline: 'none',
                  }}
                >
                  <option value="041">NO. 041 · Yama Field Jacket</option>
                  <option value="042">NO. 042 · Kiryū Wrap Trouser</option>
                  <option value="043">NO. 043 · Biratori Overshirt</option>
                  <option value="044">NO. 044 · Ōmi Hemp Tote</option>
                  <option value="038">NO. 038 · Otaru Deck Coat</option>
                  <option value="037">NO. 037 · Tsukiji Apron Shirt</option>
                  <option value="036">NO. 036 · Hakodate Watch Cap</option>
                  <option value="035">NO. 035 · Nemuro Wide Trouser</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="rma-email"
                  style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--otaru-gold)',
                    display: 'block',
                    marginBottom: '0.4rem',
                    fontFamily: 'monospace',
                  }}
                >
                  Billing Email *
                </label>
                <input
                  id="rma-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  style={{
                    width: '100%',
                    background: 'var(--otaru-black)',
                    border: '1px solid var(--otaru-line-strong)',
                    padding: '0.75rem 0.9rem',
                    color: 'var(--otaru-parchment)',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--otaru-gold)',
                  display: 'block',
                  marginBottom: '0.6rem',
                  fontFamily: 'monospace',
                }}
              >
                {activeTab === 'REPAIR' ? 'Select Repair Service Required' : 'Select Return / Exchange Reason'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
                {(activeTab === 'REPAIR' ? REPAIR_SERVICES : RETURN_REASONS).map((opt) => (
                  <label
                    key={opt.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.8rem',
                      padding: '0.85rem',
                      border: reason === opt.label ? '1px solid var(--otaru-gold)' : '1px solid var(--otaru-line)',
                      backgroundColor: reason === opt.label ? 'rgba(217, 189, 131, 0.06)' : 'var(--otaru-black)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="service_reason"
                      checked={reason === opt.label}
                      onChange={() => setReason(opt.label)}
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--otaru-parchment)', fontWeight: 500, display: 'block' }}>
                        {opt.label}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--otaru-parchment-dim)' }}>
                        {opt.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="rma-notes"
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--otaru-gold)',
                  display: 'block',
                  marginBottom: '0.4rem',
                  fontFamily: 'monospace',
                }}
              >
                Craftsman Notes & Wear Details (Optional)
              </label>
              <textarea
                id="rma-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe area needing mending or size exchange preference..."
                style={{
                  width: '100%',
                  background: 'var(--otaru-black)',
                  border: '1px solid var(--otaru-line-strong)',
                  padding: '0.75rem 0.9rem',
                  color: 'var(--otaru-parchment)',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            {error && (
              <div style={{ padding: '0.8rem', backgroundColor: 'rgba(181, 73, 50, 0.12)', border: '1px solid #b54932', color: '#f4efe2', fontSize: '0.82rem' }}>
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                padding: '0.95rem',
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting
                ? 'Authorizing with Logistics...'
                : activeTab === 'REPAIR'
                ? 'Generate Lifetime Repair Authorization →'
                : 'Initiate Return Authorization →'}
            </button>
          </form>
        ) : (
          /* Authorization Receipt Card */
          <div style={{ marginTop: '2rem', padding: '2rem', border: '1px solid var(--otaru-gold)', backgroundColor: 'var(--otaru-dusk)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--otaru-gold)', fontFamily: 'monospace' }}>
                  ✓ {result.type === 'REPAIR' ? 'Lifetime Repair Authorized' : 'Return Authorized'}
                </span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--otaru-parchment)', margin: '0.3rem 0' }}>
                  {result.rmaNumber}
                </h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--otaru-parchment-dim)' }}>
                  Order: {orderId} · Status: <span style={{ color: 'var(--otaru-gold)' }}>{result.status}</span>
                </p>
              </div>

              <div style={{ padding: '0.6rem 1rem', border: '1px dashed var(--otaru-gold-dim)', borderRadius: '2px', backgroundColor: 'rgba(217, 189, 131, 0.08)' }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--otaru-gold)', display: 'block', fontFamily: 'monospace' }}>
                  Doorstep Pickup
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--otaru-parchment)' }}>
                  {result.pickupTimeline}
                </span>
              </div>
            </div>

            {/* Step-by-Step Packing Guide */}
            <div style={{ marginTop: '1.8rem', paddingTop: '1.4rem', borderTop: '1px solid var(--otaru-line)' }}>
              <h3 style={{ fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--otaru-gold)', marginBottom: '0.8rem', fontFamily: 'monospace' }}>
                Packing & Dispatch Instructions
              </h3>
              <ol style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--otaru-parchment-dim)', fontSize: '0.86rem', lineHeight: 1.6 }}>
                {result.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ol>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setResult(null)}
                className="cta-link"
                style={{ fontSize: '0.82rem' }}
              >
                ← Submit another request
              </button>
              <Link href="/track-order" className="cta-link" style={{ fontSize: '0.82rem', color: 'var(--otaru-gold)' }}>
                Track existing shipments →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
