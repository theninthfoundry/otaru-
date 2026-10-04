'use client';

import React, { useState } from 'react';

export function CircleEmailSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/residents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
      } else {
        alert(data.error || 'Failed to join waitlist.');
      }
    } catch {
      alert('Network issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-pad bg-[var(--paper-2)] text-[var(--ink)] border-t border-hairline" id="circle">
      <div className="wrap max-w-2xl text-center">
        <span className="font-mono text-xs tracking-widest uppercase text-[var(--ink-muted)] block mb-3">
          Archival Circle
        </span>
        <h2 className="display-l text-[var(--ink)] mb-4">
          Receive notification of the next cutting.
        </h2>
        <p className="text-sm text-[var(--ink)]/70 max-w-[42ch] mx-auto leading-relaxed mb-8">
          We send precisely one telegram per batch. No seasonal sales, no marketing drips. Subscribers receive private access 24 hours prior to public archive release.
        </p>

        {isSuccess ? (
          <div className="p-6 bg-[var(--paper)] border border-hairline font-mono text-xs text-[var(--ink)]">
            <span className="text-[var(--indigo)] font-bold">✓ RESERVED IN ATELIER LEDGER</span>
            <p className="mt-2 text-[var(--ink-muted)]">
              Your email has been assigned priority dispatch notification for Batch 02.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter collector email"
              required
              className="flex-1 bg-[var(--paper)] border border-hairline px-4 py-3 text-sm focus:outline-none focus:border-[var(--indigo)] text-[var(--ink)] placeholder:text-[var(--ink-muted)]/60 font-body"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[var(--indigo)] text-white text-xs font-mono uppercase tracking-wider hover:bg-[var(--indigo-hover)] transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {isSubmitting ? 'Registering...' : 'Join Circle →'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
