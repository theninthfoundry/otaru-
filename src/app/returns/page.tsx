'use client';

import { useState } from 'react';
import { submitReturnRequest } from '@/actions/returns';

export default function ReturnsPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const res = await submitReturnRequest({
      orderNumber,
      email,
      reason,
      notes,
    });

    if (res.success) {
      setStatus('success');
      setMessage(res.message ?? 'Return request submitted successfully.');
    } else {
      setStatus('error');
      setMessage(res.error ?? 'Return request failed. Please check order details.');
    }
  }

  return (
    <section id="returns" aria-label="Returns" className="py-12 md:py-20">
      <div className="grid-container max-w-3xl space-y-12">
        <header className="space-y-3">
          <p className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold">
            Client Services
          </p>
          <h1 className="text-display-lg font-bold tracking-tight text-otaru-ink">
            Returns & Exchanges
          </h1>
          <p className="text-body-lg text-otaru-ink-muted font-light leading-relaxed">
            We accept returns within 7 days of delivery for unworn garments in original archival packaging.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-caption text-xs border-y border-otaru-border/40 py-6">
          <div>
            <span className="font-semibold text-otaru-ink block">7-Day Window</span>
            <span className="text-otaru-ink-muted">Initiate within 7 days of delivery</span>
          </div>
          <div>
            <span className="font-semibold text-otaru-ink block">Original Tags</span>
            <span className="text-otaru-ink-muted">Unworn with tags & box intact</span>
          </div>
          <div>
            <span className="font-semibold text-otaru-ink block">Complimentary Pickup</span>
            <span className="text-otaru-ink-muted">Courier scheduled to your address</span>
          </div>
        </div>

        <div className="bg-otaru-chalk border border-otaru-border/60 p-6 md:p-8 rounded-sm space-y-6">
          <h2 className="text-heading-sm font-semibold text-otaru-ink">
            Initiate a Return
          </h2>

          {status === 'success' ? (
            <div className="p-6 bg-otaru-cream/60 border border-otaru-border text-otaru-ink rounded-sm space-y-2">
              <h3 className="text-body-md font-semibold">Request Received</h3>
              <p className="text-body-sm text-otaru-ink-muted">{message}</p>
              <p className="text-caption text-xs text-otaru-ink-subtle pt-2">
                Our logistics partner will contact you shortly regarding doorstep pickup.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="return-order" className="text-caption text-xs font-medium text-otaru-ink block mb-1">
                  Order Number *
                </label>
                <input
                  id="return-order"
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. 1001"
                  className="w-full bg-otaru-cream/50 border border-otaru-border rounded-md px-4 py-2 text-body-sm focus:outline-none focus:border-otaru-ink"
                  required
                />
              </div>

              <div>
                <label htmlFor="return-email" className="text-caption text-xs font-medium text-otaru-ink block mb-1">
                  Email Address *
                </label>
                <input
                  id="return-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-otaru-cream/50 border border-otaru-border rounded-md px-4 py-2 text-body-sm focus:outline-none focus:border-otaru-ink"
                  required
                />
              </div>

              <div>
                <label htmlFor="return-reason" className="text-caption text-xs font-medium text-otaru-ink block mb-1">
                  Reason for Return *
                </label>
                <select
                  id="return-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-otaru-cream/50 border border-otaru-border rounded-md px-4 py-2 text-body-sm focus:outline-none focus:border-otaru-ink outline-none cursor-pointer"
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="size">Size does not fit as expected</option>
                  <option value="quality">Fabric or construction concern</option>
                  <option value="wrong-item">Incorrect item received</option>
                  <option value="other">Changed mind / Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="return-notes" className="text-caption text-xs font-medium text-otaru-ink block mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="return-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Provide additional details regarding fit or condition..."
                  className="w-full bg-otaru-cream/50 border border-otaru-border rounded-md px-4 py-2 text-body-sm focus:outline-none focus:border-otaru-ink"
                />
              </div>

              {status === 'error' && (
                <p className="text-caption text-red-600 text-xs">{message}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 bg-otaru-ink text-otaru-chalk text-body-sm font-medium rounded-full hover:bg-otaru-ink-muted transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Submitting Request...' : 'Submit Return Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
