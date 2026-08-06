'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '1000';
  const amount = searchParams.get('amount') || '0';
  const artNum = searchParams.get('artNum') || '001';

  // Construct dynamic serial number corresponding to this purchase order
  const serialNumber = `OTARU-${artNum}-${orderId}`;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="relative bg-otaru-chalk border-4 border-double border-otaru-ink p-8 md:p-12 rounded-sm space-y-8 max-w-xl mx-auto shadow-2xl font-sans animate-fadeIn print:border-none print:shadow-none">
      
      {/* Editorial Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] overflow-hidden select-none" aria-hidden="true">
        <span className="text-[12rem] font-bold tracking-tighter uppercase font-mono">OTARU</span>
      </div>

      {/* Header */}
      <div className="text-center space-y-3 border-b border-otaru-border/40 pb-6 relative z-10">
        <div className="w-10 h-10 rounded-full border border-otaru-ink text-otaru-ink flex items-center justify-center font-light text-sm mx-auto mb-2 select-none">
          ✓
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-otaru-ink font-semibold font-mono block">
          Archival Vault Record Sealed
        </span>
        <h1 className="text-display-sm font-bold tracking-tight text-otaru-ink">
          Order Registered
        </h1>
        <p className="text-caption text-xs text-otaru-ink-muted leading-relaxed max-w-sm mx-auto">
          Your piece is officially registered inside the Otaru permanent ledger catalog.
        </p>
      </div>

      {/* Details Box */}
      <div className="bg-otaru-cream/40 border border-otaru-border/70 p-5 rounded-xs space-y-3.5 text-caption text-xs relative z-10">
        <div className="flex justify-between items-baseline border-b border-otaru-border/20 pb-2">
          <span className="text-otaru-ink-muted">Registry Code</span>
          <span className="font-mono font-semibold text-otaru-ink">#OTARU-{orderId}</span>
        </div>
        <div className="flex justify-between items-baseline border-b border-otaru-border/20 pb-2">
          <span className="text-otaru-ink-muted">Authorized Value</span>
          <span className="font-semibold text-otaru-ink">${amount} USD</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-otaru-ink-muted">Assigned Serial</span>
          <span className="font-mono font-bold text-otaru-ink tracking-wider">{serialNumber}</span>
        </div>
      </div>

      {/* Archival Actions */}
      <div className="space-y-3 pt-2 relative z-10 print:hidden">
        <Link
          href={`/track-order?order=${orderId}`}
          className="block w-full text-center py-3.5 bg-otaru-ink text-otaru-chalk text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-otaru-ink-muted transition-colors"
        >
          Track Shipment
        </Link>
        <Link
          href={`/verify?serial=${serialNumber}`}
          className="block w-full text-center py-3.5 border border-otaru-border text-otaru-ink text-xs font-semibold uppercase tracking-wider rounded-full hover:border-otaru-ink transition-colors"
        >
          Verify NFC Provenance
        </Link>
        
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="py-2.5 border border-otaru-border/60 text-otaru-ink-muted text-[10px] font-semibold uppercase tracking-wider rounded-full hover:text-otaru-ink hover:border-otaru-ink transition-colors font-mono"
          >
            Print Record
          </button>
          <Link
            href="/archive"
            className="py-2.5 border border-otaru-border/60 text-otaru-ink-muted text-center text-[10px] font-semibold uppercase tracking-wider rounded-full hover:text-otaru-ink hover:border-otaru-ink transition-colors font-mono"
          >
            Archive Index
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <section id="checkout-success" aria-label="Order Success" className="py-16 md:py-24">
      <div className="grid-container">
        <Suspense fallback={
          <div className="text-center py-10 text-otaru-ink-subtle text-caption">
            Loading success details...
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
    </section>
  );
}
