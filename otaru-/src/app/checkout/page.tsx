'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, setCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState(0);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const subtotal = cart?.lines.reduce((sum, line) => {
    return sum + (parseFloat(line.cost.totalAmount.amount) * line.quantity);
  }, 0) || 0;

  const currency = cart?.cost.subtotalAmount.currencyCode || 'USD';
  const shipping = subtotal > 300 ? 0 : 15;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const steps = [
      'Establishing cryptographic ledger tunnel...',
      'Verifying inventory allocation at Kuroki & Biella studios...',
      'Authorizing transaction block...',
      'Finalizing archival packaging sequence...',
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setSubmissionStep(currentStep);
      } else {
        clearInterval(interval);
        
        // Generate random order number & matching serial
        const orderNum = Math.floor(Math.random() * 900) + 1000;
        
        // Find first item's artifact number to feed into success serial link
        const firstLine = cart?.lines[0];
        const artIdPart = firstLine?.merchandise.product.id.split('/').pop() || '001';
        const artNumStr = artIdPart.replace(/\D/g, '').padStart(3, '0');
        
        // Clear cart
        setCart(null);
        document.cookie = 'otaru-cart-id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        // Redirect
        router.push(
          `/checkout/success?orderId=${orderNum}&amount=${total}&artNum=${artNumStr}`
        );
      }
    }, 900);
  };

  const submissionSteps = [
    'Establishing cryptographic ledger tunnel...',
    'Verifying inventory allocation at Kuroki & Biella studios...',
    'Authorizing transaction block...',
    'Finalizing archival packaging sequence...',
  ];

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="grid-container py-20 text-center space-y-4">
        <h1 className="text-display-sm font-semibold text-otaru-ink">Checkout</h1>
        <p className="text-body-md text-otaru-ink-muted">No items in your bag to checkout.</p>
        <a href="/archive" className="inline-block px-6 py-2.5 bg-otaru-ink text-otaru-chalk text-xs font-semibold rounded-full hover:bg-otaru-ink-muted">
          Return to Archive
        </a>
      </div>
    );
  }

  return (
    <section id="checkout" aria-label="Checkout" className="py-12 md:py-20">
      <div className="grid-container max-w-6xl">
        <h1 className="text-display-md font-bold tracking-tight text-otaru-ink mb-10 border-b border-otaru-border/20 pb-4">
          Registry Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-7 space-y-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-heading-sm font-semibold text-otaru-ink border-b border-otaru-border/30 pb-2">
                  01 &bull; Contact Info
                </h3>
                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="text-[10px] uppercase font-mono tracking-widest text-otaru-ink-subtle">
                    Email Registry Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    className="bg-otaru-cream/30 border border-otaru-border rounded-xs px-4 py-3 text-body-sm focus:outline-none focus:border-otaru-ink"
                  />
                </div>
              </div>

              {/* Delivery Information */}
              <div className="space-y-4">
                <h3 className="text-heading-sm font-semibold text-otaru-ink border-b border-otaru-border/30 pb-2">
                  02 &bull; Shipping Destination
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="firstName" className="text-[10px] uppercase font-mono tracking-widest text-otaru-ink-subtle">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Jane"
                      className="bg-otaru-cream/30 border border-otaru-border rounded-xs px-4 py-3 text-body-sm focus:outline-none focus:border-otaru-ink"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="lastName" className="text-[10px] uppercase font-mono tracking-widest text-otaru-ink-subtle">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="bg-otaru-cream/30 border border-otaru-border rounded-xs px-4 py-3 text-body-sm focus:outline-none focus:border-otaru-ink"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="address" className="text-[10px] uppercase font-mono tracking-widest text-otaru-ink-subtle">
                    Street Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Garment Ave, Apt 4"
                    className="bg-otaru-cream/30 border border-otaru-border rounded-xs px-4 py-3 text-body-sm focus:outline-none focus:border-otaru-ink"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="city" className="text-[10px] uppercase font-mono tracking-widest text-otaru-ink-subtle">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Tokyo"
                      className="bg-otaru-cream/30 border border-otaru-border rounded-xs px-4 py-3 text-body-sm focus:outline-none focus:border-otaru-ink"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="zip" className="text-[10px] uppercase font-mono tracking-widest text-otaru-ink-subtle">
                      Postal Code / ZIP
                    </label>
                    <input
                      id="zip"
                      name="zip"
                      type="text"
                      required
                      value={formData.zip}
                      onChange={handleInputChange}
                      placeholder="100-0001"
                      className="bg-otaru-cream/30 border border-otaru-border rounded-xs px-4 py-3 text-body-sm focus:outline-none focus:border-otaru-ink"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-4">
                <h3 className="text-heading-sm font-semibold text-otaru-ink border-b border-otaru-border/30 pb-2">
                  03 &bull; Payment (Registry Authorization)
                </h3>
                <div className="flex flex-col gap-1">
                  <label htmlFor="cardNumber" className="text-[10px] uppercase font-mono tracking-widest text-otaru-ink-subtle">
                    Credit Card Number
                  </label>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    required
                    maxLength={19}
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="•••• •••• •••• ••••"
                    className="bg-otaru-cream/30 border border-otaru-border rounded-xs px-4 py-3 text-body-sm font-mono focus:outline-none focus:border-otaru-ink"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="cardExpiry" className="text-[10px] uppercase font-mono tracking-widest text-otaru-ink-subtle">
                      Expiration Date
                    </label>
                    <input
                      id="cardExpiry"
                      name="cardExpiry"
                      type="text"
                      required
                      maxLength={5}
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="bg-otaru-cream/30 border border-otaru-border rounded-xs px-4 py-3 text-body-sm font-mono focus:outline-none focus:border-otaru-ink"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="cardCvv" className="text-[10px] uppercase font-mono tracking-widest text-otaru-ink-subtle">
                      Security Code (CVV)
                    </label>
                    <input
                      id="cardCvv"
                      name="cardCvv"
                      type="password"
                      required
                      maxLength={4}
                      value={formData.cardCvv}
                      onChange={handleInputChange}
                      placeholder="•••"
                      className="bg-otaru-cream/30 border border-otaru-border rounded-xs px-4 py-3 text-body-sm font-mono focus:outline-none focus:border-otaru-ink"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-otaru-ink text-otaru-chalk text-body-md font-medium hover:bg-otaru-ink-muted transition-colors rounded-xs shadow-lg mt-6"
              >
                {isSubmitting ? 'Verifying Registry...' : `Place Order — ${formatPrice(total.toString(), currency)}`}
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary Panel */}
          <div className="lg:col-span-5 bg-otaru-chalk-warm/40 border border-otaru-border/60 p-6 md:p-8 rounded-sm self-start space-y-6">
            <h3 className="text-overline uppercase tracking-widest text-otaru-ink font-semibold text-xs border-b border-otaru-border/30 pb-3">
              Order Details
            </h3>

            {/* Line Items */}
            <div className="divide-y divide-otaru-border/20 max-h-[300px] overflow-y-auto pr-2 space-y-3">
              {cart.lines.map((line) => (
                <div key={line.id} className="flex gap-4 pt-3 first:pt-0">
                  <div className="w-14 h-18 bg-otaru-cream rounded-xs overflow-hidden shrink-0">
                    {line.merchandise.product.featuredImage?.url && (
                      <img
                        src={line.merchandise.product.featuredImage.url}
                        alt={line.merchandise.product.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <span className="font-medium text-otaru-ink block line-clamp-1">
                        {line.merchandise.product.title.replace(/^Artifact\s+#\d+\s+—\s+/i, '')}
                      </span>
                      <span className="text-otaru-ink-subtle block font-mono text-[10px] mt-0.5">
                        {line.merchandise.title}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-caption mt-1">
                      <span className="text-otaru-ink-muted font-mono">Qty {line.quantity}</span>
                      <span className="font-semibold text-otaru-ink">
                        {formatPrice(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
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
          </div>
        </div>
      </div>

      {/* Luxury Loading Modal Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-otaru-ink/95 backdrop-blur-lg z-50 flex flex-col items-center justify-center text-otaru-chalk p-6 animate-fadeIn">
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
              {submissionSteps.map((step, idx) => {
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
                    <span className={isActive ? 'animate-pulse font-medium text-otaru-chalk' : ''}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div className="w-full bg-otaru-chalk/10 h-0.5 rounded-full overflow-hidden">
              <div 
                className="bg-otaru-chalk h-full transition-all duration-700 ease-out" 
                style={{ width: `${((submissionStep + 1) / submissionSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
