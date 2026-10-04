'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { useAuth } from '@/context/auth-context';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

const SANDBOX_METHODS = [
  { id: 'upi', label: 'UPI Instant', icon: '⟡', desc: 'Google Pay, PhonePe, Paytm, BHIM' },
  { id: 'card', label: 'Archival Card', icon: '▭', desc: 'Visa, Mastercard, Amex, JCB' },
  { id: 'netbanking', label: 'Netbanking', icon: '⌘', desc: 'HDFC, ICICI, SBI, Axis' },
  { id: 'wallet', label: 'Studio Wallet', icon: '◈', desc: 'Apple Pay, Vault Balance' },
];

const SUBMISSION_STEPS = [
  'Verifying garment reservation in Hokkaido ledger...',
  'Reserving allocation from numbered run...',
  'Authorizing 256-bit TLS encrypted transaction...',
  'Affixing atelier wax seal & generating provenance serial...',
];

type StepNumber = 1 | 2 | 3;
type PaymentTab = 'razorpay' | 'sandbox';
type SandboxStep = 'method' | 'details' | 'processing' | 'done' | 'failed';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const razorpayScriptRef = useRef(false);

  // Active Collapsible Step
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);

  // Form Fields
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });

  // Touched state for onBlur validation
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Auto-populate customer information if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const parts = user.name ? user.name.split(' ') : [];
      const first = parts[0] ?? '';
      const last = parts.length > 1 ? parts.slice(1).join(' ') : '';
      setFormData((prev) => ({
        ...prev,
        email: prev.email || user.email || (user.phone ? `${user.phone.replace(/\D/g, '')}@otaru.in` : ''),
        firstName: prev.firstName || first,
        lastName: prev.lastName || last,
      }));
    }
  }, [isAuthenticated, user]);

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
  const [nonce, setNonce] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shippingEstimate, setShippingEstimate] = useState<{
    city?: string;
    state?: string;
    courierName?: string;
    estimatedDays?: string;
    estimatedDeliveryDate?: string;
  } | null>(null);

  const idempotencyKey = useMemo(() => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'idemp-' + Math.random().toString(36).substring(2, 15);
  }, []);

  const currency = 'USD';
  const shipping = subtotal > 300 ? 0 : 15;
  const total = subtotal + shipping;

  // Pincode lookup on blur or 6-digit match
  useEffect(() => {
    const cleanZip = formData.zip.trim();
    if (/^\d{6}$/.test(cleanZip)) {
      fetch(`/api/shipping/serviceability?pincode=${cleanZip}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.serviceable) {
            setShippingEstimate(data);
            if (!formData.city && data.city) {
              setFormData((prev) => ({ ...prev, city: data.city, state: data.state || prev.state }));
            }
          }
        })
        .catch(() => {});
    } else {
      setShippingEstimate(null);
    }
  }, [formData.zip, formData.city]);

  // Load Razorpay checkout script
  useEffect(() => {
    if (razorpayScriptRef.current) return;
    razorpayScriptRef.current = true;
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validation checks
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isStep1Valid = isEmailValid;

  const isStep2Valid =
    formData.firstName.trim().length > 0 &&
    formData.lastName.trim().length > 0 &&
    formData.address.trim().length > 3 &&
    formData.city.trim().length > 1 &&
    formData.zip.trim().length >= 4;

  const handleCompleteStep1 = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTouched((prev) => ({ ...prev, email: true }));
    if (isStep1Valid) {
      setCurrentStep(2);
    }
  };

  const handleCompleteStep2 = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTouched((prev) => ({
      ...prev,
      firstName: true,
      lastName: true,
      address: true,
      city: true,
      zip: true,
    }));
    if (isStep2Valid) {
      setCurrentStep(3);
    }
  };

  const createOrder = useCallback(async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          items,
          customer: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            zip: formData.zip,
          },
          currency,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize registry ledger order');
      }

      setOrderId(data.orderId);
      setInternalOrderId(data.internalOrderId);
      setNonce(data.nonce);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ledger initiation failed';
      setError(message);
      return null;
    }
  }, [formData, items, currency, idempotencyKey]);

  const redirectToSuccess = useCallback((orderNum: string, finalTotal: number) => {
    clearCart();
    router.push(`/checkout/success?order=${orderNum}&total=${finalTotal}`);
  }, [clearCart, router]);

  const runSubmissionOverlay = (callback: () => void) => {
    setIsSubmitting(true);
    setSubmissionStep(0);
    const interval = setInterval(() => {
      setSubmissionStep((prev) => {
        if (prev < SUBMISSION_STEPS.length - 1) return prev + 1;
        clearInterval(interval);
        setTimeout(callback, 500);
        return prev;
      });
    }, 700);
  };

  const handleRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let currentOrderId = orderId;
    let currentNonce = nonce;
    let currentInternalId = internalOrderId;

    if (!currentOrderId || !currentNonce) {
      const order = await createOrder();
      if (!order) return;
      currentOrderId = order.orderId;
      currentNonce = order.nonce;
      currentInternalId = order.internalOrderId;
    }

    if (!window.Razorpay) {
      setError('Payment gateway initializing. Please retry in a moment.');
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      amount: Math.round(total * 100),
      currency: currency,
      name: 'Otaru Atelier',
      description: `Archival Acquisition ${currentInternalId || ''}`,
      order_id: currentOrderId,
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
      },
      theme: {
        color: '#161616',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: async function (response: any) {
        try {
          const verifyRes = await fetch('/api/checkout/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              internalOrderId: currentInternalId,
              nonce: currentNonce,
            }),
          });

          if (!verifyRes.ok) throw new Error('Payment verification signature check failed');

          runSubmissionOverlay(() => {
            const orderNum = currentInternalId?.split('-').pop() || `${Math.floor(Math.random() * 900) + 1000}`;
            redirectToSuccess(orderNum, total);
          });
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'Verification failed');
        }
      },
      modal: {
        ondismiss: function () {
          setError('Payment process was dismissed.');
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setError('Unable to load payment terminal. You may test via the Registry Escrow Sandbox.');
    }
  };

  const handleSandboxSimulate = async () => {
    setSandboxStep('processing');
    setSandboxProcessingStep(0);

    const interval = setInterval(() => {
      setSandboxProcessingStep((prev) => {
        if (prev < 2) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 700);

    setTimeout(async () => {
      clearInterval(interval);
      if (sandboxOutcome === 'success') {
        let useInternalOrderId = internalOrderId;
        if (!useInternalOrderId) {
          const order = await createOrder();
          useInternalOrderId = order?.internalOrderId;
        }

        try {
          await fetch('/api/checkout/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              internalOrderId: useInternalOrderId || `OT-ARC-001`,
              mock: true,
            }),
          });
        } catch {
          // Fallback simulation
        }

        setSandboxStep('done');
        setTimeout(() => {
          setSandboxOpen(false);
          runSubmissionOverlay(() => {
            const orderNum = useInternalOrderId?.split('-').pop() || `${Math.floor(Math.random() * 900) + 1000}`;
            redirectToSuccess(orderNum, total);
          });
        }, 1200);
      } else {
        setSandboxStep('failed');
      }
    }, 2400);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--otaru-canvas)] text-[var(--otaru-ink)] flex flex-col items-center justify-center p-6 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--otaru-ink-subtle)] mb-3">
          Atelier Archive
        </span>
        <h1 className="font-serif text-3xl font-light tracking-tight mb-3">Your acquisition bag is empty.</h1>
        <p className="text-[13px] text-[var(--otaru-ink-muted)] max-w-sm mb-8 leading-relaxed">
          Limited batch garments are catalogued in the permanent archive. Explore numbered runs from Kuroki and Biella.
        </p>
        <Link
          href="/archive"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--otaru-ink)] text-[var(--otaru-chalk)] text-xs tracking-wider uppercase font-mono hover:bg-[var(--otaru-ink-light)] transition-colors"
        >
          Return to Archive →
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--otaru-canvas)] text-[var(--otaru-ink)] selection:bg-[var(--otaru-indigo)] selection:text-white">
      {/* Quiet Distraction-free Header */}
      <header className="sticky top-0 z-40 bg-[var(--otaru-canvas)]/95 backdrop-blur-md border-b border-[var(--otaru-hairline)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-3 group">
            <span className="font-serif text-lg tracking-[0.2em] font-normal group-hover:text-[var(--otaru-indigo)] transition-colors">
              OTARU
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--otaru-ink-subtle)] hidden sm:inline">
              Hokkaido Atelier
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--otaru-ink-subtle)]">
              Secure Checkout
            </span>
            <span className="text-[10px] font-serif text-[var(--otaru-ink-subtle)] border border-[var(--otaru-hairline)] px-1.5 py-0.5 rounded-sm">
              印
            </span>
          </div>
        </div>
      </header>

      {/* Main Checkout Grid */}
      <main className="max-w-6xl mx-auto px-6 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: 3 Calm Collapsible Steps */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Collector Contact */}
            <div className="border border-[var(--otaru-hairline)] bg-[var(--otaru-chalk-warm)]/30 rounded-sm overflow-hidden transition-all duration-300">
              <div
                className={`p-5 flex items-center justify-between cursor-pointer select-none ${
                  currentStep === 1 ? 'border-b border-[var(--otaru-hairline)] bg-[var(--otaru-canvas)]' : ''
                }`}
                onClick={() => setCurrentStep(1)}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-[var(--otaru-ink-subtle)]">01</span>
                  <h2 className="text-sm font-medium tracking-tight">Collector Contact</h2>
                  {currentStep > 1 && isStep1Valid && (
                    <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs">
                      Confirmed
                    </span>
                  )}
                </div>
                {currentStep !== 1 && isStep1Valid && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentStep(1);
                    }}
                    className="font-mono text-[10px] uppercase tracking-wider text-[var(--otaru-ink-subtle)] hover:text-[var(--otaru-ink)] transition-colors underline underline-offset-4"
                  >
                    Edit
                  </button>
                )}
              </div>

              {currentStep === 1 ? (
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[var(--otaru-ink-muted)]">
                      Order dispatch confirmation and provenance certificate will be issued to this email.
                    </p>
                    {!isAuthenticated && (
                      <button
                        type="button"
                        onClick={() => openAuthModal()}
                        className="font-mono text-[10px] uppercase tracking-wider text-[var(--otaru-indigo)] hover:underline shrink-0 ml-4"
                      >
                        Sign In →
                      </button>
                    )}
                  </div>

                  {isAuthenticated && user && (
                    <div className="p-3 bg-[var(--otaru-canvas)] border border-[var(--otaru-hairline)] rounded-xs flex items-center justify-between text-xs">
                      <span className="font-medium">{user.name || user.email || 'Authenticated Collector'}</span>
                      <span className="font-mono text-[10px] text-[var(--otaru-ink-subtle)] uppercase tracking-wider">
                        Archive Member
                      </span>
                    </div>
                  )}

                  <form onSubmit={handleCompleteStep1} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block font-mono text-[10px] uppercase tracking-wider text-[var(--otaru-ink-subtle)] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('email')}
                        placeholder="collector@domain.com"
                        className={`w-full bg-[var(--otaru-canvas)] border rounded-xs px-3.5 py-2.5 text-xs text-[var(--otaru-ink)] placeholder-[var(--otaru-ink-subtle)]/40 focus:outline-none transition-colors ${
                          touched.email && !isEmailValid
                            ? 'border-[#8B263E]'
                            : 'border-[var(--otaru-hairline)] focus:border-[var(--otaru-ink)]'
                        }`}
                      />
                      {touched.email && !isEmailValid && (
                        <p className="mt-1 font-mono text-[10px] text-[#8B263E]">
                          Please enter a valid dispatch email.
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={!formData.email.trim()}
                      className="w-full py-3 bg-[var(--otaru-ink)] text-[var(--otaru-chalk)] text-xs font-mono uppercase tracking-widest hover:bg-[var(--otaru-ink-light)] transition-colors disabled:opacity-40"
                    >
                      Continue to Delivery →
                    </button>
                  </form>
                </div>
              ) : (
                <div className="px-5 py-3 text-xs text-[var(--otaru-ink-muted)] flex items-center justify-between bg-[var(--otaru-canvas)]/50">
                  <span className="font-mono text-[11px] text-[var(--otaru-ink)]">{formData.email}</span>
                </div>
              )}
            </div>

            {/* Step 2: Dispatch Address */}
            <div className="border border-[var(--otaru-hairline)] bg-[var(--otaru-chalk-warm)]/30 rounded-sm overflow-hidden transition-all duration-300">
              <div
                className={`p-5 flex items-center justify-between cursor-pointer select-none ${
                  currentStep === 2 ? 'border-b border-[var(--otaru-hairline)] bg-[var(--otaru-canvas)]' : ''
                }`}
                onClick={() => {
                  if (isStep1Valid) setCurrentStep(2);
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-[var(--otaru-ink-subtle)]">02</span>
                  <h2 className="text-sm font-medium tracking-tight">Dispatch Destination</h2>
                  {currentStep > 2 && isStep2Valid && (
                    <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs">
                      Confirmed
                    </span>
                  )}
                </div>
                {currentStep !== 2 && isStep2Valid && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentStep(2);
                    }}
                    className="font-mono text-[10px] uppercase tracking-wider text-[var(--otaru-ink-subtle)] hover:text-[var(--otaru-ink)] transition-colors underline underline-offset-4"
                  >
                    Edit
                  </button>
                )}
              </div>

              {currentStep === 2 ? (
                <form onSubmit={handleCompleteStep2} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block font-mono text-[10px] uppercase tracking-wider text-[var(--otaru-ink-subtle)] mb-1.5">
                        First Name *
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('firstName')}
                        placeholder="Kenji"
                        className={`w-full bg-[var(--otaru-canvas)] border rounded-xs px-3.5 py-2.5 text-xs text-[var(--otaru-ink)] focus:outline-none transition-colors ${
                          touched.firstName && !formData.firstName.trim()
                            ? 'border-[#8B263E]'
                            : 'border-[var(--otaru-hairline)] focus:border-[var(--otaru-ink)]'
                        }`}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block font-mono text-[10px] uppercase tracking-wider text-[var(--otaru-ink-subtle)] mb-1.5">
                        Last Name *
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('lastName')}
                        placeholder="Takahashi"
                        className={`w-full bg-[var(--otaru-canvas)] border rounded-xs px-3.5 py-2.5 text-xs text-[var(--otaru-ink)] focus:outline-none transition-colors ${
                          touched.lastName && !formData.lastName.trim()
                            ? 'border-[#8B263E]'
                            : 'border-[var(--otaru-hairline)] focus:border-[var(--otaru-ink)]'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block font-mono text-[10px] uppercase tracking-wider text-[var(--otaru-ink-subtle)] mb-1.5">
                      Delivery Address *
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('address')}
                      placeholder="Canal Warehouse No. 4, Ironai 1-chome"
                      className={`w-full bg-[var(--otaru-canvas)] border rounded-xs px-3.5 py-2.5 text-xs text-[var(--otaru-ink)] focus:outline-none transition-colors ${
                        touched.address && !formData.address.trim()
                          ? 'border-[#8B263E]'
                          : 'border-[var(--otaru-hairline)] focus:border-[var(--otaru-ink)]'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="zip" className="block font-mono text-[10px] uppercase tracking-wider text-[var(--otaru-ink-subtle)] mb-1.5">
                        Postal Code / Pincode *
                      </label>
                      <input
                        id="zip"
                        name="zip"
                        type="text"
                        required
                        value={formData.zip}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('zip')}
                        placeholder="110001 or 047-0031"
                        className={`w-full bg-[var(--otaru-canvas)] border rounded-xs px-3.5 py-2.5 text-xs text-[var(--otaru-ink)] focus:outline-none transition-colors ${
                          touched.zip && !formData.zip.trim()
                            ? 'border-[#8B263E]'
                            : 'border-[var(--otaru-hairline)] focus:border-[var(--otaru-ink)]'
                        }`}
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block font-mono text-[10px] uppercase tracking-wider text-[var(--otaru-ink-subtle)] mb-1.5">
                        City *
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('city')}
                        placeholder="Otaru / New Delhi"
                        className={`w-full bg-[var(--otaru-canvas)] border rounded-xs px-3.5 py-2.5 text-xs text-[var(--otaru-ink)] focus:outline-none transition-colors ${
                          touched.city && !formData.city.trim()
                            ? 'border-[#8B263E]'
                            : 'border-[var(--otaru-hairline)] focus:border-[var(--otaru-ink)]'
                        }`}
                      />
                    </div>
                  </div>

                  {shippingEstimate && (
                    <div className="p-3 bg-[var(--otaru-canvas)] border border-[var(--otaru-hairline)] rounded-xs flex items-center justify-between text-xs">
                      <span className="text-[var(--otaru-ink)] font-mono text-[11px]">
                        ✓ {shippingEstimate.courierName || 'Archival Express'} · {shippingEstimate.city}, {shippingEstimate.state}
                      </span>
                      <span className="font-mono text-[var(--otaru-indigo)] text-[10px] tracking-wider uppercase">
                        Est. {shippingEstimate.estimatedDays || '3–5 days'}
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 bg-[var(--otaru-ink)] text-[var(--otaru-chalk)] text-xs font-mono uppercase tracking-widest hover:bg-[var(--otaru-ink-light)] transition-colors"
                  >
                    Continue to Payment →
                  </button>
                </form>
              ) : currentStep > 2 ? (
                <div className="px-5 py-3 text-xs text-[var(--otaru-ink-muted)] flex items-center justify-between bg-[var(--otaru-canvas)]/50">
                  <span className="font-mono text-[11px] text-[var(--otaru-ink)] truncate max-w-sm">
                    {formData.firstName} {formData.lastName}, {formData.address}, {formData.city} {formData.zip}
                  </span>
                  {shippingEstimate && (
                    <span className="font-mono text-[10px] text-[var(--otaru-ink-subtle)] shrink-0 ml-2">
                      Est: {shippingEstimate.estimatedDays || '3–5 days'}
                    </span>
                  )}
                </div>
              ) : null}
            </div>

            {/* Step 3: Payment */}
            <div className="border border-[var(--otaru-hairline)] bg-[var(--otaru-chalk-warm)]/30 rounded-sm overflow-hidden transition-all duration-300">
              <div className={`p-5 flex items-center justify-between ${currentStep === 3 ? 'border-b border-[var(--otaru-hairline)] bg-[var(--otaru-canvas)]' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-[var(--otaru-ink-subtle)]">03</span>
                  <h2 className="text-sm font-medium tracking-tight">Payment</h2>
                </div>
              </div>

              {currentStep === 3 && (
                <div className="p-6 space-y-6">
                  {/* Gateway selector tabs (Strictly gated behind dev environment flag) */}
                  {process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ENABLE_ESCROW_SIMULATOR === 'true' && (
                    <div className="flex gap-2 p-1 bg-[var(--otaru-canvas)] border border-[var(--otaru-hairline)] rounded-xs">
                      <button
                        type="button"
                        onClick={() => setActiveTab('razorpay')}
                        className={`flex-1 py-2 text-[11px] font-mono uppercase tracking-wider rounded-xs transition-colors ${
                          activeTab === 'razorpay'
                            ? 'bg-[var(--otaru-ink)] text-[var(--otaru-chalk)]'
                            : 'text-[var(--otaru-ink-muted)] hover:text-[var(--otaru-ink)]'
                        }`}
                      >
                        Razorpay Gateway
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('sandbox')}
                        className={`flex-1 py-2 text-[11px] font-mono uppercase tracking-wider rounded-xs transition-colors ${
                          activeTab === 'sandbox'
                            ? 'bg-[var(--otaru-ink)] text-[var(--otaru-chalk)]'
                            : 'text-[var(--otaru-ink-muted)] hover:text-[var(--otaru-ink)]'
                        }`}
                      >
                        Studio Sandbox Simulator
                      </button>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {activeTab === 'razorpay' && (
                      <motion.div
                        key="razorpay-tab"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="space-y-4"
                      >
                        <div className="border border-[var(--otaru-hairline)] rounded-xs p-4 bg-[var(--otaru-canvas)] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">Razorpay 256-bit Encrypted Checkout</span>
                            <span className="font-mono text-[10px] text-[var(--otaru-ink-subtle)] uppercase">
                              UPI · Cards · Netbanking
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--otaru-ink-muted)] leading-relaxed">
                            You will complete your acquisition via the secure encrypted modal. Garment reservation is immediately recorded upon settlement.
                          </p>
                        </div>

                        {error && (
                          <div className="p-3 border border-[#8B263E]/30 bg-[#8B263E]/5 rounded-xs">
                            <p className="text-[11px] font-mono text-[#8B263E]">{error}</p>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={handleRazorpayPayment}
                          className="w-full py-4 bg-[var(--otaru-ink)] text-[var(--otaru-chalk)] text-xs font-mono uppercase tracking-widest hover:bg-[var(--otaru-ink-light)] transition-colors"
                        >
                          Complete Acquisition — {formatPrice(total.toString(), currency)} →
                        </button>
                      </motion.div>
                    )}

                    {activeTab === 'sandbox' && (
                      <motion.div
                        key="sandbox-tab"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="space-y-4"
                      >
                        <div className="border border-[var(--otaru-hairline)] rounded-xs p-4 bg-[var(--otaru-canvas)] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">Test Escrow Simulation Mode</span>
                            <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs">
                              Dev Ready
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--otaru-ink-muted)] leading-relaxed">
                            Simulate full dispatch telemetry and receipt creation without charging a live card.
                          </p>

                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setSandboxOutcome('success')}
                              className={`flex-1 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-xs border transition-colors ${
                                sandboxOutcome === 'success'
                                  ? 'bg-emerald-950 text-emerald-200 border-emerald-800'
                                  : 'border-[var(--otaru-hairline)] text-[var(--otaru-ink-muted)]'
                              }`}
                            >
                              ✓ Simulate Success
                            </button>
                            <button
                              type="button"
                              onClick={() => setSandboxOutcome('failure')}
                              className={`flex-1 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-xs border transition-colors ${
                                sandboxOutcome === 'failure'
                                  ? 'bg-[#8B263E] text-white border-[#8B263E]'
                                  : 'border-[var(--otaru-hairline)] text-[var(--otaru-ink-muted)]'
                              }`}
                            >
                              ✗ Simulate Failure
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSandboxOpen(true)}
                          className="w-full py-4 border border-[var(--otaru-ink)] text-[var(--otaru-ink)] hover:bg-[var(--otaru-ink)] hover:text-[var(--otaru-chalk)] text-xs font-mono uppercase tracking-widest transition-colors"
                        >
                          Launch Escrow Simulator →
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-2 border-t border-[var(--otaru-hairline)] flex items-center justify-between text-[10px] font-mono text-[var(--otaru-ink-subtle)]">
                    <span>TLS 256-BIT ENCRYPTION</span>
                    <span>ATELIER SEAL [印]</span>
                    <span>HOKKAIDO CANAL REGISTRY</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 bg-[var(--otaru-chalk-warm)]/40 border border-[var(--otaru-hairline)] p-6 md:p-8 rounded-sm sticky top-24 space-y-6">
            <div className="flex items-baseline justify-between border-b border-[var(--otaru-hairline)] pb-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--otaru-ink)]">
                Acquisition Summary
              </h3>
              <span className="font-mono text-[10px] text-[var(--otaru-ink-subtle)]">
                {items.length} {items.length === 1 ? 'Artifact' : 'Artifacts'}
              </span>
            </div>

            {/* Line items list */}
            <div className="divide-y divide-[var(--otaru-hairline)] max-h-72 overflow-y-auto pr-1 space-y-3">
              {items.map((line) => (
                <div key={line.id} className="flex gap-4 pt-3 first:pt-0">
                  <div className="w-14 h-18 bg-[var(--otaru-canvas)] border border-[var(--otaru-hairline)] rounded-xs overflow-hidden shrink-0">
                    <ImagePlaceholder ratio="portrait" label="" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between text-xs py-0.5">
                    <div>
                      <span className="font-medium text-[var(--otaru-ink)] block line-clamp-1">
                        {line.name}
                      </span>
                      <span className="text-[var(--otaru-ink-subtle)] font-mono text-[10px] block mt-0.5">
                        {line.meta} {line.size ? `· ${line.size}` : ''}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline font-mono text-[11px] mt-1">
                      <span className="text-[var(--otaru-ink-subtle)]">Qty {line.qty}</span>
                      <span className="text-[var(--otaru-ink)] font-medium">
                        {formatPrice((line.price * line.qty).toString(), currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="border-t border-[var(--otaru-hairline)] pt-4 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between text-[var(--otaru-ink-muted)]">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal.toString(), currency)}</span>
              </div>
              <div className="flex justify-between text-[var(--otaru-ink-muted)]">
                <span>Hokkaido Archival Dispatch</span>
                <span>{shipping === 0 ? 'Complimentary' : formatPrice(shipping.toString(), currency)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-[var(--otaru-ink-subtle)]">
                  Complimentary worldwide dispatch on orders over $300.
                </p>
              )}
              <div className="flex justify-between border-t border-[var(--otaru-hairline)] pt-3 text-sm font-semibold font-mono text-[var(--otaru-ink)]">
                <span>Total</span>
                <span>{formatPrice(total.toString(), currency)}</span>
              </div>
            </div>

            {/* Quiet Guarantee Notice */}
            <div className="p-3 border border-[var(--otaru-hairline)] rounded-xs bg-[var(--otaru-canvas)]/40 text-[10px] font-mono text-[var(--otaru-ink-subtle)] space-y-1">
              <div className="flex items-center gap-1.5 text-[var(--otaru-ink)]">
                <span>印</span>
                <span className="uppercase tracking-wider">Garment Provenance Guarantee</span>
              </div>
              <p className="leading-relaxed">
                Includes numbered certificate of origin, spare mother-of-pearl hardware, and lifetime atelier repair entitlement.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Submission Step Modal Overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            className="fixed inset-0 z-[100] bg-[var(--otaru-canvas)]/90 backdrop-blur-md flex items-center justify-center p-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-md space-y-6">
              <span className="w-10 h-10 border border-[var(--otaru-ink)] rounded-full flex items-center justify-center mx-auto text-sm font-serif">
                印
              </span>
              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--otaru-ink-subtle)]">
                  Atelier Dispatch Protocol
                </span>
                <p className="font-serif text-lg tracking-tight text-[var(--otaru-ink)]">
                  {SUBMISSION_STEPS[submissionStep]}
                </p>
              </div>
              <div className="w-48 h-0.5 bg-[var(--otaru-hairline)] mx-auto overflow-hidden">
                <motion.div
                  className="h-full bg-[var(--otaru-indigo)]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((submissionStep + 1) / SUBMISSION_STEPS.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sandbox Simulator Modal */}
      <AnimatePresence>
        {sandboxOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-[var(--otaru-ink)]/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (sandboxStep !== 'processing') setSandboxOpen(false);
              }}
            />

            <motion.div
              className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="pointer-events-auto w-full max-w-md bg-[var(--otaru-canvas)] border border-[var(--otaru-hairline)] rounded-sm shadow-2xl overflow-hidden text-[var(--otaru-ink)]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--otaru-hairline)]">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--otaru-ink-subtle)] block">
                      Otaru Escrow Simulator
                    </span>
                    <span className="font-serif text-sm">
                      Registry Sandbox — {formatPrice(total.toString(), currency)}
                    </span>
                  </div>
                  {sandboxStep !== 'processing' && (
                    <button
                      onClick={() => setSandboxOpen(false)}
                      className="text-[var(--otaru-ink-subtle)] hover:text-[var(--otaru-ink)] transition-colors font-mono text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="p-6">
                  {sandboxStep === 'method' && (
                    <div className="space-y-3">
                      <p className="text-xs font-mono text-[var(--otaru-ink-muted)] mb-3">
                        Choose test payment channel
                      </p>
                      {SANDBOX_METHODS.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSelectedMethod(m.id)}
                          className={`w-full flex items-center gap-4 p-3.5 rounded-xs border transition-all text-left ${
                            selectedMethod === m.id
                              ? 'border-[var(--otaru-ink)] bg-[var(--otaru-chalk-warm)]/60'
                              : 'border-[var(--otaru-hairline)] hover:border-[var(--otaru-ink-subtle)] bg-transparent'
                          }`}
                        >
                          <span className="text-base font-mono w-6 text-center">{m.icon}</span>
                          <div>
                            <p className="text-xs font-medium">{m.label}</p>
                            <p className="text-[10px] font-mono text-[var(--otaru-ink-subtle)]">{m.desc}</p>
                          </div>
                          {selectedMethod === m.id && (
                            <span className="ml-auto text-emerald-700 text-xs">●</span>
                          )}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => setSandboxStep('details')}
                        className="w-full mt-4 py-3 bg-[var(--otaru-ink)] text-[var(--otaru-chalk)] text-xs font-mono uppercase tracking-widest hover:bg-[var(--otaru-ink-light)] transition-colors"
                      >
                        Enter Test Credentials →
                      </button>
                    </div>
                  )}

                  {sandboxStep === 'details' && (
                    <div className="space-y-4">
                      {selectedMethod === 'upi' ? (
                        <div>
                          <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--otaru-ink-subtle)] mb-1">
                            Virtual Payment Address (VPA)
                          </label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="collector@okhdfcbank"
                            className="w-full bg-[var(--otaru-canvas)] border border-[var(--otaru-hairline)] rounded-xs px-3 py-2 text-xs font-mono"
                          />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--otaru-ink-subtle)] mb-1">
                              Card Number
                            </label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4111 2222 3333 4444"
                              className="w-full bg-[var(--otaru-canvas)] border border-[var(--otaru-hairline)] rounded-xs px-3 py-2 text-xs font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              className="w-full bg-[var(--otaru-canvas)] border border-[var(--otaru-hairline)] rounded-xs px-3 py-2 text-xs font-mono"
                            />
                            <input
                              type="text"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="CVV"
                              className="w-full bg-[var(--otaru-canvas)] border border-[var(--otaru-hairline)] rounded-xs px-3 py-2 text-xs font-mono"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setSandboxStep('method')}
                          className="px-4 py-2.5 border border-[var(--otaru-hairline)] text-xs font-mono"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleSandboxSimulate}
                          className="flex-1 py-2.5 bg-[var(--otaru-ink)] text-[var(--otaru-chalk)] text-xs font-mono uppercase tracking-widest hover:bg-[var(--otaru-ink-light)] transition-colors"
                        >
                          Authorize Payment →
                        </button>
                      </div>
                    </div>
                  )}

                  {sandboxStep === 'processing' && (
                    <div className="py-8 text-center space-y-4">
                      <div className="w-8 h-8 border-2 border-[var(--otaru-indigo)] border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="font-mono text-xs text-[var(--otaru-ink-muted)]">
                        {sandboxProcessingStep === 0
                          ? 'Contacting bank network...'
                          : sandboxProcessingStep === 1
                          ? 'Validating 3D Secure challenge...'
                          : 'Signing ledger transfer...'}
                      </p>
                    </div>
                  )}

                  {sandboxStep === 'done' && (
                    <div className="py-8 text-center space-y-3">
                      <span className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-lg">
                        ✓
                      </span>
                      <h4 className="font-serif text-base">Payment Authorized</h4>
                      <p className="text-xs text-[var(--otaru-ink-muted)]">
                        Preparing your official acquisition dispatch manifest...
                      </p>
                    </div>
                  )}

                  {sandboxStep === 'failed' && (
                    <div className="py-8 text-center space-y-4">
                      <span className="w-10 h-10 rounded-full bg-[#8B263E]/10 text-[#8B263E] flex items-center justify-center mx-auto text-lg">
                        ✕
                      </span>
                      <h4 className="font-serif text-base text-[#8B263E]">Payment Declined</h4>
                      <p className="text-xs text-[var(--otaru-ink-muted)]">
                        Simulated card decline. You can retry with successful outcome.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSandboxStep('method');
                          setSandboxOutcome('success');
                        }}
                        className="px-6 py-2 bg-[var(--otaru-ink)] text-[var(--otaru-chalk)] text-xs font-mono uppercase"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
