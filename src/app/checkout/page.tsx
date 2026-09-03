'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

const SANDBOX_METHODS = [
  { id: 'upi', label: 'UPI', icon: '⟡', desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', label: 'Card', icon: '▭', desc: 'Visa, Mastercard, Amex' },
  { id: 'netbanking', label: 'Netbanking', icon: '⌘', desc: 'SBI, HDFC, ICICI, Axis' },
  { id: 'wallet', label: 'Wallet', icon: '◈', desc: 'Paytm, Amazon Pay' },
];

const SUBMISSION_STEPS = [
  'Establishing cryptographic ledger tunnel...',
  'Verifying inventory allocation at Kuroki & Biella studios...',
  'Authorizing payment block on Razorpay network...',
  'Sealing archival packaging & generating provenance serial...',
];

type PaymentTab = 'razorpay' | 'sandbox';
type SandboxStep = 'method' | 'details' | 'processing' | 'done' | 'failed';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const razorpayScriptRef = useRef(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
  });

  const [activeTab, setActiveTab] = useState<PaymentTab>('razorpay');

  const [sandboxOpen, setSandboxOpen] = useState(false);
  const [sandboxStep, setSandboxStep] = useState<SandboxStep>('method');
  const [selectedMethod, setSelectedMethod] = useState<string>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [sandboxOutcome, setSandboxOutcome] = useState<'success' | 'failure'>('success');
  const [sandboxProcessingStep, setSandboxProcessingStep] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState(0);

  const [orderId, setOrderId] = useState<string | null>(null);
  const [internalOrderId, setInternalOrderId] = useState<string | null>(null);
  const [, setCartToken] = useState<string | null>(null);
  const [nonce, setNonce] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shippingEstimate, setShippingEstimate] = useState<{
    city?: string;
    state?: string;
    courierName?: string;
    estimatedDays?: string;
    estimatedDeliveryDate?: string;
  } | null>(null);

  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);

  const currency = 'USD';
  const shipping = subtotal > 300 ? 0 : 15;
  const total = subtotal + shipping;

  useEffect(() => {
    const cleanZip = formData.zip.trim();
    if (/^\d{6}$/.test(cleanZip)) {
      fetch(`/api/shipping/serviceability?pincode=${cleanZip}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.serviceable) {
            setShippingEstimate(data);
            if (!formData.city) {
              setFormData((prev) => ({ ...prev, city: data.city }));
            }
          }
        })
        .catch(() => {});
    } else {
      setShippingEstimate(null);
    }
  }, [formData.zip, formData.city]);

  useEffect(() => {
    if (razorpayScriptRef.current) return;
    razorpayScriptRef.current = true;
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createOrder = useCallback(async () => {
    const payload = {
      cart: {
        lines: items.map((line) => ({
          id: line.id,
          quantity: line.qty,
          cost: {
            totalAmount: {
              amount: String(line.price * line.qty),
              currencyCode: 'USD',
            },
          },
          merchandise: {
            id: line.id,
            title: line.name,
            price: {
              amount: String(line.price),
            },
            product: {
              id: line.id,
              title: line.name,
            },
          },
        })),
      },
      customer: formData,
    };
    const res = await fetch('/api/checkout/razorpay/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Order creation failed.');
    const data = await res.json();
    if (data.cartToken) setCartToken(data.cartToken);
    if (data.nonce) setNonce(data.nonce);
    return data;
  }, [items, formData, idempotencyKey]);

  const runSubmissionOverlay = useCallback((onComplete: () => void) => {
    setIsSubmitting(true);
    setSubmissionStep(0);
    let step = 0;
    const interval = setInterval(() => {
      if (step < SUBMISSION_STEPS.length - 1) {
        step++;
        setSubmissionStep(step);
      } else {
        clearInterval(interval);
        onComplete();
      }
    }, 900);
  }, []);

  const redirectToSuccess = useCallback((orderNum: string, amount: number) => {
    clearCart();
    router.push(`/checkout/success?orderId=${orderNum}&amount=${amount}&artNum=041`);
  }, [clearCart, router]);

  const handleRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const orderData = await createOrder();
      const { orderId: rzpOrderId, internalOrderId: intId, amount, mock } = orderData;
      setOrderId(rzpOrderId);
      setInternalOrderId(intId);

      if (mock || !window.Razorpay) {
        setActiveTab('sandbox');
        setSandboxOpen(true);
        setSandboxStep('method');
        return;
      }

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency: orderData.currency,
        order_id: rzpOrderId,
        name: 'Otaru — Garments Worth Keeping',
        description: 'Registry Checkout — Archival Acquisition',
        image: '/logo.svg',
        theme: { color: '#1a1a18' },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: '',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/checkout/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              mock: false,
              nonce: nonce ?? undefined,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.verified) {
            runSubmissionOverlay(() => {
              const orderNum = intId.split('-').pop() || '1001';
              redirectToSuccess(orderNum, total);
            });
          } else {
            setError('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setError('Payment was cancelled. Your cart is safe.');
          },
        },
      });
      rzp.open();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  const handleSandboxFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSandboxStep('processing');
    setSandboxProcessingStep(0);

    let step = 0;
    const interval = setInterval(() => {
      if (step < 3) {
        step++;
        setSandboxProcessingStep(step);
      } else {
        clearInterval(interval);
        setTimeout(async () => {
          if (sandboxOutcome === 'success') {
            let useOrderId = orderId;
            let useInternalOrderId = internalOrderId;
            if (!useOrderId) {
              try {
                const orderData = await createOrder();
                useOrderId = orderData.orderId;
                useInternalOrderId = orderData.internalOrderId;
                setOrderId(useOrderId);
                setInternalOrderId(useInternalOrderId);
              } catch {
                setSandboxStep('failed');
                return;
              }
            }

            try {
              await fetch('/api/checkout/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: useOrderId,
                  razorpay_payment_id: `pay_MOCK_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
                  razorpay_signature: 'mock_signature_approved',
                  mock: true,
                }),
              });
            } catch {
              // Sandbox fallback
            }

            setSandboxStep('done');
            setTimeout(() => {
              setSandboxOpen(false);
              runSubmissionOverlay(() => {
                const orderNum = useInternalOrderId?.split('-').pop() || `${Math.floor(Math.random() * 900) + 1000}`;
                redirectToSuccess(orderNum, total);
              });
            }, 1800);
          } else {
            setSandboxStep('failed');
          }
        }, 600);
      }
    }, 750);
  };

  const resetSandbox = () => {
    setSandboxStep('method');
    setSandboxProcessingStep(0);
    setUpiId('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
  };

  if (items.length === 0) {
    return (
      <div className="grid-container py-20 text-center space-y-4">
        <h1 className="text-display-sm font-semibold text-otaru-ink">Registry Checkout</h1>
        <p className="text-body-md text-otaru-ink-muted">No artifacts in your bag to acquire.</p>
        <a
          href="/archive"
          className="inline-block px-6 py-2.5 bg-otaru-ink text-otaru-chalk text-xs font-semibold rounded-full hover:bg-otaru-ink-muted transition-colors"
        >
          Return to Archive
        </a>
      </div>
    );
  }

  return (
    <>
      <section id="checkout" aria-label="Checkout" className="py-12 md:py-20">
        <div className="grid-container max-w-6xl">
          <h1 className="text-display-md font-bold tracking-tight text-otaru-ink mb-10 border-b border-otaru-border/20 pb-4">
            Registry Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-heading-sm font-semibold text-otaru-ink border-b border-otaru-border/30 pb-2">
                    01 &bull; Contact Info
                  </h3>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-[10px] uppercase font-mono tracking-widest text-otaru-ink-subtle">
                      Email Registry Address
                    </label>
                    <input
                      id="email" name="email" type="email" required
                      value={formData.email} onChange={handleInputChange}
                      placeholder="email@example.com"
                      className="bg-otaru-cream/30 border border-otaru-border rounded-xs px-4 py-3 text-body-sm focus:outline-none focus:border-otaru-ink transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-heading-sm font-semibold text-otaru-ink border-b border-otaru-border/30 pb-2">
                    02 &bull; Shipping Destination
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {(['firstName', 'lastName'] as const).map((field) => (
                      <div key={field} className="flex flex-col gap-1">
                        <label htmlFor={field} className="text-[10px] uppercase font-mono tracking-widest text-otaru-ink-subtle">
                          {field === 'firstName' ? 'First Name' : 'Last Name'}
                        </label>
                        <input
                          id={field} name={field} type="text" required
                          value={formData[field]} onChange={handleInputChange}
                          placeholder={field === 'firstName' ? 'Jane' : 'Doe'}
                          className="bg-otaru-cream/30 border border-otaru-border rounded-xs px-4 py-3 text-body-sm focus:outline-none focus:border-otaru-ink transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="address" className="text-[10px] uppercase font-mono tracking-widest text-otaru-ink-subtle">
                      Street Address
                    </label>
                    <input
                      id="address" name="address" type="text" required
                      value={formData.address} onChange={handleInputChange}
                      placeholder="123 Garment Ave, Apt 4"
                      className="bg-otaru-cream/30 border border-otaru-border rounded-xs px-4 py-3 text-body-sm focus:outline-none focus:border-otaru-ink transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {(['city', 'zip'] as const).map((field) => (
                      <div key={field} className="flex flex-col gap-1">
                        <label htmlFor={field} className="text-[10px] uppercase font-mono tracking-widest text-otaru-ink-subtle">
                          {field === 'city' ? 'City' : 'Postal Code / ZIP'}
                        </label>
                        <input
                          id={field} name={field} type="text" required
                          value={formData[field]} onChange={handleInputChange}
                          placeholder={field === 'city' ? 'New Delhi' : '110001'}
                          className="bg-otaru-cream/30 border border-otaru-border rounded-xs px-4 py-3 text-body-sm focus:outline-none focus:border-otaru-ink transition-colors"
                        />
                      </div>
                    ))}
                  </div>

                  {shippingEstimate && (
                    <div className="p-3 bg-otaru-gold/10 border border-otaru-gold/30 rounded-xs flex items-center justify-between text-xs">
                      <span className="text-otaru-ink font-medium">
                        ✓ {shippingEstimate.courierName || 'Express Courier'} · {shippingEstimate.city}, {shippingEstimate.state}
                      </span>
                      <span className="font-mono text-otaru-gold uppercase tracking-wider text-[11px]">
                        Est. {shippingEstimate.estimatedDays || '2-3 Days'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-heading-sm font-semibold text-otaru-ink border-b border-otaru-border/30 pb-2">
                  03 &bull; Payment Authorization
                </h3>

                <div className="flex gap-2 p-1 bg-otaru-cream/50 border border-otaru-border/40 rounded-sm">
                  <button
                    type="button"
                    onClick={() => setActiveTab('razorpay')}
                    className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-xs transition-all duration-200 ${
                      activeTab === 'razorpay'
                        ? 'bg-otaru-ink text-otaru-chalk shadow-otaru-sm'
                        : 'text-otaru-ink-muted hover:text-otaru-ink'
                    }`}
                  >
                    Razorpay Secure
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('sandbox')}
                    className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-xs transition-all duration-200 ${
                      activeTab === 'sandbox'
                        ? 'bg-otaru-ink text-otaru-chalk shadow-otaru-sm'
                        : 'text-otaru-ink-muted hover:text-otaru-ink'
                    }`}
                  >
                    Registry Escrow
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'razorpay' && (
                    <motion.div
                      key="razorpay-tab"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="border border-otaru-border/40 rounded-sm p-5 bg-otaru-cream/20 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#072654] rounded-sm flex items-center justify-center">
                            <span className="text-white font-bold text-xs">R</span>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-otaru-ink">Razorpay Secure Checkout</p>
                            <p className="text-[10px] text-otaru-ink-subtle font-mono">
                              UPI · Cards · Netbanking · Wallets — 256-bit TLS encrypted
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {['UPI', 'Visa', 'Mastercard', 'Netbanking', 'Wallets'].map((m) => (
                            <span key={m} className="px-2 py-1 text-[9px] font-mono uppercase tracking-wider border border-otaru-border/50 rounded-xs text-otaru-ink-muted">
                              {m}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-otaru-ink-subtle leading-relaxed">
                          You will be redirected to a secure Razorpay modal. Your payment credentials are never stored on Otaru servers.
                        </p>
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-3 bg-red-50 border border-red-200 rounded-xs"
                        >
                          <p className="text-xs text-red-700 font-mono">{error}</p>
                        </motion.div>
                      )}

                      <form onSubmit={handleRazorpayPayment}>
                        <button
                          type="submit"
                          className="w-full mt-4 py-4 bg-otaru-ink text-otaru-chalk text-body-sm font-semibold hover:bg-otaru-ink-muted transition-colors rounded-xs shadow-otaru-md"
                        >
                          {`Pay ${formatPrice(total.toString(), currency)} via Razorpay →`}
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {activeTab === 'sandbox' && (
                    <motion.div
                      key="sandbox-tab"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="border border-otaru-border/40 rounded-sm p-5 bg-otaru-cream/20 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-otaru-stone rounded-sm flex items-center justify-center">
                            <span className="text-otaru-chalk font-bold text-xs font-mono">⌖</span>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-otaru-ink">Registry Escrow Simulator</p>
                            <p className="text-[10px] text-otaru-ink-subtle font-mono">
                              Interactive sandbox — No real payment is processed.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSandboxOutcome('success')}
                            className={`flex-1 py-2 text-[10px] font-mono uppercase tracking-wider rounded-xs border transition-colors ${
                              sandboxOutcome === 'success'
                                ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
                                : 'border-otaru-border/40 text-otaru-ink-muted hover:border-otaru-ink'
                            }`}
                          >
                            ✓ Simulate Success
                          </button>
                          <button
                            type="button"
                            onClick={() => setSandboxOutcome('failure')}
                            className={`flex-1 py-2 text-[10px] font-mono uppercase tracking-wider rounded-xs border transition-colors ${
                              sandboxOutcome === 'failure'
                                ? 'bg-red-950 text-red-200 border-red-800'
                                : 'border-otaru-border/40 text-otaru-ink-muted hover:border-otaru-ink'
                            }`}
                          >
                            ✗ Simulate Failure
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSandboxOpen(true)}
                        className="w-full mt-4 py-4 border-2 border-otaru-ink text-otaru-ink text-body-sm font-semibold hover:bg-otaru-ink hover:text-otaru-chalk transition-all rounded-xs"
                      >
                        Launch Escrow Simulator →
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="lg:col-span-5 bg-otaru-chalk-warm/40 border border-otaru-border/60 p-6 md:p-8 rounded-sm self-start space-y-6 sticky top-8">
              <h3 className="text-overline uppercase tracking-widest text-otaru-ink font-semibold text-xs border-b border-otaru-border/30 pb-3">
                Order Details
              </h3>

              <div className="divide-y divide-otaru-border/20 max-h-[300px] overflow-y-auto pr-2 space-y-3">
                {items.map((line) => (
                  <div key={line.id} className="flex gap-4 pt-3 first:pt-0">
                    <div className="w-14 h-18 bg-otaru-cream rounded-xs overflow-hidden shrink-0">
                      <ImagePlaceholder ratio="portrait" label="" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <span className="font-medium text-otaru-ink block line-clamp-1">
                          {line.name}
                        </span>
                        <span className="text-otaru-ink-subtle block font-mono text-[10px] mt-0.5">
                          {line.meta} {line.size ? `· Size ${line.size}` : ''}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline text-caption mt-1">
                        <span className="text-otaru-ink-muted font-mono">Qty {line.qty}</span>
                        <span className="font-semibold text-otaru-ink">
                          {formatPrice(line.price * line.qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-otaru-border/40 pt-4 space-y-2 text-caption text-xs">
                <div className="flex justify-between">
                  <span className="text-otaru-ink-muted">Subtotal</span>
                  <span className="font-medium text-otaru-ink">{formatPrice(subtotal.toString(), currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-otaru-ink-muted">Archival Courier</span>
                  <span className="font-medium text-otaru-ink">
                    {shipping === 0 ? 'Complementary' : formatPrice(shipping.toString(), currency)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-otaru-border/20 pt-3 text-body-sm font-semibold">
                  <span className="text-otaru-ink">Total</span>
                  <span className="text-otaru-ink">{formatPrice(total.toString(), currency)}</span>
                </div>
              </div>

              <div className="border border-otaru-border/30 rounded-xs p-3 space-y-1 bg-otaru-cream/30">
                <p className="text-[9px] font-mono uppercase tracking-widest text-otaru-ink-subtle">Otaru Security Core</p>
                <div className="flex flex-col gap-1">
                  {['CSRF Guard Active', 'Rate Limiter Active', 'TLS 256-bit Encrypted', 'Ledger Registry Sealed'].map((s) => (
                    <span key={s} className="text-[10px] font-mono text-otaru-ink-muted flex items-center gap-1.5">
                      <span className="text-emerald-600">✓</span> {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {sandboxOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-otaru-ink/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (sandboxStep !== 'processing') setSandboxOpen(false); }}
            />

            <motion.div
              className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="pointer-events-auto w-full max-w-md bg-[#0f0f0e] border border-white/10 rounded-sm shadow-2xl overflow-hidden"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 block">
                      Otaru Escrow Simulator
                    </span>
                    <span className="text-white font-semibold text-sm tracking-tight">
                      Registry Sandbox — {formatPrice(total.toString(), currency)}
                    </span>
                  </div>
                  {sandboxStep !== 'processing' && (
                    <button
                      onClick={() => setSandboxOpen(false)}
                      className="text-white/40 hover:text-white transition-colors text-lg leading-none"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="p-6">
                  {sandboxStep === 'method' && (
                    <motion.div
                      key="method"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-3"
                    >
                      <p className="text-white/50 text-xs font-mono mb-4">Select payment method</p>
                      {SANDBOX_METHODS.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSelectedMethod(m.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xs border transition-all duration-200 text-left ${
                            selectedMethod === m.id
                              ? 'border-white/40 bg-white/10'
                              : 'border-white/10 hover:border-white/20 bg-transparent'
                          }`}
                        >
                          <span className="text-white/60 text-lg font-mono w-6 text-center">{m.icon}</span>
                          <div>
                            <p className="text-white text-xs font-semibold">{m.label}</p>
                            <p className="text-white/40 text-[10px] font-mono">{m.desc}</p>
                          </div>
                          {selectedMethod === m.id && (
                            <span className="ml-auto text-emerald-400 text-xs">●</span>
                          )}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setSandboxStep('details')}
                        className="w-full mt-4 py-3 bg-white text-black text-xs font-semibold uppercase tracking-widest rounded-xs hover:bg-white/90 transition-colors"
                      >
                        Continue →
                      </button>
                    </motion.div>
                  )}

                  {sandboxStep === 'details' && (
                    <motion.form
                      key="details"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onSubmit={handleSandboxFormSubmit}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => setSandboxStep('method')}
                          className="text-white/40 hover:text-white text-xs font-mono transition-colors"
                        >
                          ← Back
                        </button>
                        <span className="text-white/20 text-xs">|</span>
                        <span className="text-white/50 text-xs font-mono">
                          {SANDBOX_METHODS.find(m => m.id === selectedMethod)?.label} Details
                        </span>
                      </div>

                      {selectedMethod === 'upi' && (
                        <div className="space-y-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-mono uppercase tracking-widest text-white/40">UPI ID</label>
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="yourname@upi"
                              className="bg-white/5 border border-white/15 rounded-xs px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-white/40 placeholder:text-white/20 transition-colors"
                            />
                          </div>
                          <div className="flex items-center gap-3 p-3 border border-white/10 rounded-xs bg-white/5">
                            <div className="w-16 h-16 bg-white rounded-xs flex items-center justify-center shrink-0">
                              <div className="grid grid-cols-5 gap-px p-1.5">
                                {Array.from({ length: 25 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-1.5 h-1.5 ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-white text-[10px] font-semibold">Scan with any UPI app</p>
                              <p className="text-white/40 text-[9px] font-mono mt-0.5">QR valid for 10 minutes</p>
                              <p className="text-white/30 text-[9px] font-mono">Sandbox — Not a real QR</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedMethod === 'card' && (
                        <div className="space-y-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-mono uppercase tracking-widest text-white/40">Card Number</label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="•••• •••• •••• ••••"
                              maxLength={19}
                              className="bg-white/5 border border-white/15 rounded-xs px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-white/40 placeholder:text-white/20 tracking-widest transition-colors"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-mono uppercase tracking-widest text-white/40">Expiry</label>
                              <input
                                type="text"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                placeholder="MM/YY"
                                maxLength={5}
                                className="bg-white/5 border border-white/15 rounded-xs px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-white/40 placeholder:text-white/20 transition-colors"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-mono uppercase tracking-widest text-white/40">CVV</label>
                              <input
                                type="password"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                                placeholder="•••"
                                maxLength={4}
                                className="bg-white/5 border border-white/15 rounded-xs px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-white/40 placeholder:text-white/20 transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {(selectedMethod === 'netbanking' || selectedMethod === 'wallet') && (
                        <div className="grid grid-cols-2 gap-2">
                          {(selectedMethod === 'netbanking'
                            ? ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB']
                            : ['Paytm', 'Amazon Pay', 'PhonePe', 'Mobikwik']
                          ).map((bank) => (
                            <button
                              key={bank}
                              type="button"
                              className="p-3 border border-white/10 rounded-xs text-white/60 text-xs font-mono hover:border-white/30 hover:text-white hover:bg-white/5 transition-all text-center"
                            >
                              {bank}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className={`px-3 py-2 rounded-xs text-[10px] font-mono ${
                        sandboxOutcome === 'success'
                          ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800/50'
                          : 'bg-red-900/40 text-red-300 border border-red-800/50'
                      }`}>
                        {sandboxOutcome === 'success' ? '✓ Configured for success simulation' : '✗ Configured for failure simulation'}
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-white text-black text-xs font-semibold uppercase tracking-widest rounded-xs hover:bg-white/90 transition-colors mt-2"
                      >
                        Authorize Payment — {formatPrice(total.toString(), currency)}
                      </button>
                    </motion.form>
                  )}

                  {sandboxStep === 'processing' && (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6 py-2"
                    >
                      <div className="text-center space-y-1">
                        <div className="w-10 h-10 border border-white/20 rounded-full mx-auto flex items-center justify-center">
                          <motion.div
                            className="w-5 h-5 border-2 border-white/60 border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                          />
                        </div>
                        <p className="text-white font-semibold text-sm mt-3">Processing Authorization</p>
                        <p className="text-white/40 text-[10px] font-mono">Do not close this window</p>
                      </div>

                      <div className="space-y-3 font-mono text-[11px]">
                        {[
                          'Establishing encrypted channel...',
                          'Validating payment credentials...',
                          'Communicating with gateway...',
                          'Sealing authorization token...',
                        ].map((step, idx) => {
                          const isCompleted = sandboxProcessingStep > idx;
                          const isActive = sandboxProcessingStep === idx;
                          return (
                            <div
                              key={idx}
                              className={`flex items-center gap-3 transition-opacity duration-300 ${
                                isCompleted ? 'text-white/80' : isActive ? 'text-white' : 'text-white/20'
                              }`}
                            >
                              <span className="w-4 shrink-0">
                                {isCompleted ? '✓' : isActive ? (
                                  <motion.span
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                  >→</motion.span>
                                ) : '·'}
                              </span>
                              <span className={isActive ? 'animate-pulse' : ''}>{step}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="w-full bg-white/10 h-px rounded-full overflow-hidden">
                        <motion.div
                          className="bg-white h-full"
                          initial={{ width: '0%' }}
                          animate={{ width: `${((sandboxProcessingStep + 1) / 4) * 100}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {sandboxStep === 'done' && (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-4 py-4"
                    >
                      <motion.div
                        className="w-14 h-14 rounded-full border border-emerald-500/50 bg-emerald-900/30 flex items-center justify-center mx-auto"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <span className="text-emerald-400 text-xl">✓</span>
                      </motion.div>
                      <div>
                        <p className="text-white font-semibold text-sm">Authorization Sealed</p>
                        <p className="text-white/40 text-[10px] font-mono mt-1">Redirecting to registry confirmation...</p>
                      </div>
                    </motion.div>
                  )}

                  {sandboxStep === 'failed' && (
                    <motion.div
                      key="failed"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-4 py-4"
                    >
                      <motion.div
                        className="w-14 h-14 rounded-full border border-red-500/50 bg-red-900/30 flex items-center justify-center mx-auto"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <span className="text-red-400 text-xl">✕</span>
                      </motion.div>
                      <div>
                        <p className="text-white font-semibold text-sm">Authorization Failed</p>
                        <p className="text-white/40 text-[10px] font-mono mt-1">
                          Payment rejected — INSUFFICIENT_FUNDS or bank declined.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={resetSandbox}
                        className="px-6 py-2.5 border border-white/20 text-white/70 text-xs font-mono rounded-xs hover:border-white/40 hover:text-white transition-colors"
                      >
                        Try Again
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            className="fixed inset-0 bg-otaru-ink/95 backdrop-blur-lg z-50 flex flex-col items-center justify-center text-otaru-chalk p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="space-y-8 max-w-md w-full border border-otaru-chalk/10 p-8 rounded-sm bg-otaru-ink/40">
              <div className="space-y-2 text-center">
                <span className="text-overline uppercase tracking-widest text-otaru-chalk/40 text-[9px] font-mono block">
                  Otaru Security Core
                </span>
                <h2 className="text-heading-md font-bold tracking-wider text-otaru-chalk uppercase font-mono">
                  Sealing Order Registry
                </h2>
              </div>

              <div className="space-y-4 font-mono text-[11px] text-left max-w-xs mx-auto">
                {SUBMISSION_STEPS.map((step, idx) => {
                  const isCompleted = submissionStep > idx;
                  const isActive = submissionStep === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 transition-opacity duration-300 ${
                        isCompleted ? 'text-otaru-chalk/90' : isActive ? 'text-otaru-chalk' : 'text-otaru-chalk/20'
                      }`}
                    >
                      <span className="w-4 shrink-0 font-bold">
                        {isCompleted ? '✓' : isActive ? '→' : '•'}
                      </span>
                      <span className={isActive ? 'animate-pulse font-medium text-otaru-chalk' : ''}>{step}</span>
                    </div>
                  );
                })}
              </div>

              <div className="w-full bg-otaru-chalk/10 h-0.5 rounded-full overflow-hidden">
                <motion.div
                  className="bg-otaru-chalk h-full"
                  animate={{ width: `${((submissionStep + 1) / SUBMISSION_STEPS.length) * 100}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
