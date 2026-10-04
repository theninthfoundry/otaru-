import React from 'react';

export default function ShippingPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen wrap max-w-3xl">
      <h1 className="font-display text-4xl mb-8">Shipping & Exchanges</h1>
      <div className="prose prose-stone">
        <h3 className="font-display text-2xl mb-4">Shipping</h3>
        <p className="mb-8">
          We ship across India. Because each piece is hand-finished and inspected, 
          please allow 3-5 business days for dispatch.
        </p>
        
        <h3 className="font-display text-2xl mb-4">Exchanges</h3>
        <p>
          We encourage exchanges for size over refunds, to ensure the garment finds its rightful home.
          If a piece truly does not work for you, we will accept a return within 7 days of delivery.
        </p>
        <p className="text-ink/50 italic mt-8">[CONFIRM: Detailed policy terms to be added here]</p>
      </div>
    </div>
  );
}
