'use client';

import { useCallback, useRef, useState } from 'react';

/* Headless checkout controller. UI-agnostic on purpose: wire it into the checkout page
   with the project's own tokens/components. Contract = POST /api/checkout + /api/checkout/verify. */

export interface CheckoutInput {
  items: { variantId: string; qty: number }[];
  customer: { name: string; email: string; phone: string };
  shipping: { line1: string; line2?: string; city: string; state: string; pincode: string };
}

export type CheckoutPhase = 'idle' | 'creating' | 'awaiting_payment' | 'verifying' | 'paid' | 'processing' | 'failed' | 'dismissed';

export interface CheckoutResult {
  orderNumber: string;
  trackingToken: string;
}

interface Session {
  orderNumber: string;
  trackingToken: string;
  razorpayOrderId: string;
  amountPaise: number;
  currency: string;
  keyId: string;
}

interface RazorpaySuccess {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open(): void;
  on(event: 'payment.failed', cb: (r: { error?: { description?: string } }) => void): void;
}
declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => RazorpayInstance;
  }
}

function loadRazorpay(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no_window'));
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const done = () => (window.Razorpay ? resolve() : reject(new Error('razorpay_unavailable')));
    const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay]');
    const s = existing ?? document.createElement('script');
    s.addEventListener('load', done, { once: true });
    s.addEventListener('error', () => reject(new Error('razorpay_script_failed')), { once: true });
    if (!existing) {
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.async = true;
      s.dataset.razorpay = '1';
      document.head.appendChild(s);
    }
  });
}

class ApiError extends Error {
  constructor(public code: string, message: string, public fields?: Record<string, string>) {
    super(message);
  }
}

async function post<T>(url: string, body: unknown, headers: Record<string, string> = {}): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = (data as { error?: { code?: string; message?: string; fields?: Record<string, string> } }).error;
    throw new ApiError(e?.code ?? 'request_failed', e?.message ?? 'Request failed', e?.fields);
  }
  return data as T;
}

export function useRazorpayCheckout(opts: { brandName?: string; themeColor?: string } = {}) {
  const [phase, setPhase] = useState<CheckoutPhase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CheckoutResult | null>(null);

  const busy = useRef(false);
  const lastSig = useRef('');
  const idemKey = useRef('');

  const reset = useCallback(() => {
    setPhase('idle');
    setError(null);
    setFieldErrors({});
  }, []);

  const start = useCallback(
    async (input: CheckoutInput) => {
      if (busy.current) return; // double-click guard
      busy.current = true;
      setError(null);
      setFieldErrors({});
      setPhase('creating');

      try {
        // Same cart+details => same key => server replays the same order (safe retry).
        const sig = JSON.stringify(input);
        if (sig !== lastSig.current || !idemKey.current) {
          lastSig.current = sig;
          idemKey.current = crypto.randomUUID().replace(/-/g, '');
        }

        let session: Session;
        try {
          session = await post<Session>('/api/checkout', input, { 'Idempotency-Key': idemKey.current });
        } catch (e) {
          if (e instanceof ApiError && e.code === 'order_closed') {
            idemKey.current = crypto.randomUUID().replace(/-/g, ''); // hold expired: start a fresh order once
            session = await post<Session>('/api/checkout', input, { 'Idempotency-Key': idemKey.current });
          } else throw e;
        }

        await loadRazorpay();
        setPhase('awaiting_payment');

        const outcome = await new Promise<'paid' | 'processing' | 'dismissed' | 'failed'>((resolve) => {
          const rzp = new window.Razorpay!({
            key: session.keyId,
            order_id: session.razorpayOrderId,
            amount: session.amountPaise,
            currency: session.currency,
            name: opts.brandName ?? 'Otaru',
            description: `Order ${session.orderNumber}`,
            prefill: { name: input.customer.name, email: input.customer.email, contact: input.customer.phone },
            ...(opts.themeColor ? { theme: { color: opts.themeColor } } : {}),
            modal: { confirm_close: true, ondismiss: () => resolve('dismissed') },
            handler: async (r: RazorpaySuccess) => {
              setPhase('verifying');
              try {
                const v = await post<{ status: 'paid' | 'processing' }>('/api/checkout/verify', r);
                resolve(v.status);
              } catch {
                resolve('processing'); // signature/network hiccup: the webhook is authoritative
              }
            },
          });
          rzp.on('payment.failed', (r) => {
            setError(r.error?.description ?? 'Payment failed. You can try again.');
            // don't resolve: Razorpay keeps the modal open for another attempt
          });
          rzp.open();
        });

        if (outcome === 'paid' || outcome === 'processing') {
          setResult({ orderNumber: session.orderNumber, trackingToken: session.trackingToken });
        }
        setPhase(outcome);
      } catch (e) {
        if (e instanceof ApiError) {
          setError(e.message);
          setFieldErrors(e.fields ?? {});
        } else {
          setError('Could not start payment. Please check your connection and try again.');
        }
        setPhase('failed');
      } finally {
        busy.current = false;
      }
    },
    [opts.brandName, opts.themeColor],
  );

  return { phase, error, fieldErrors, result, start, reset, isBusy: phase === 'creating' || phase === 'verifying' };
}
