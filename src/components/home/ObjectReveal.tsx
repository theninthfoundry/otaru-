'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrency } from '@/lib/currency';
import { PRODUCT_CATALOG } from '@/lib/catalog';

/**
 * ObjectReveal — Signature Movement 02 (DESIRE STAGE)
 *
 * A deliberate pause between the abstract atmosphere of the hero
 * and the batch grid. The visitor encounters the first physical piece:
 * Object 041 (Yama Field Jacket) in stillness and tactile scale.
 */
export function ObjectReveal() {
  const { formatPrice } = useCurrency();
  const product = PRODUCT_CATALOG['041'];
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!product) return null;

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[90vh] lg:min-h-screen bg-[#11161B] text-[#F3EFE6] flex items-center justify-center overflow-hidden py-24 sm:py-32"
      aria-label="Signature Object Reveal — Object 041 Yama Field Jacket"
    >
      {/* Background Architectural Grid Lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(239, 235, 227, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(239, 235, 227, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Atmospheric Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(20, 28, 38, 0.4) 0%, #0D1217 85%)',
        }}
      />

      <div className="wrap relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Tangible Desire & Editorial Specification */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center">
            
            {/* Archival Ledger Stamp */}
            <div 
              className="flex items-center gap-3 mb-6 transition-all duration-700 ease-out"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#D4AF37]/90">
                {product.objectNumber}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60" />
              <span className="font-mono text-[11px] tracking-widest text-[#F3EFE6]/60 uppercase">
                {product.origin.split('·')[0].trim()}
              </span>
              <span className="ml-auto inline-flex items-center justify-center w-7 h-7 border border-[#D4AF37]/30 text-[#D4AF37] font-serif text-sm">
                山
              </span>
            </div>

            {/* Title & Statement */}
            <div
              className="transition-all duration-700 delay-100 ease-out"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#FAF8F5] tracking-tight leading-[1.05] mb-6">
                {product.name}
              </h2>

              <p className="text-base sm:text-lg text-[#F3EFE6]/80 leading-relaxed font-light mb-8 max-w-[42ch]">
                Cut from 14.5oz botanical indigo canvas woven on vintage 1968 Toyoda shuttle looms. Designed to soften, break, and record ten winters of personal posture.
              </p>
            </div>

            {/* Tactile Object Specifications */}
            <div
              className="border-t border-b border-[#F3EFE6]/15 py-6 my-2 space-y-3 font-mono text-xs text-[#F3EFE6]/75 transition-all duration-700 delay-200 ease-out"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              <div className="flex justify-between items-baseline">
                <span className="text-[#F3EFE6]/45 uppercase tracking-wider">Allocation</span>
                <span>{product.runQuantity}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[#F3EFE6]/45 uppercase tracking-wider">Hardware</span>
                <span>Solid Raw Brass / Matte Blackened</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[#F3EFE6]/45 uppercase tracking-wider">Service</span>
                <span>Lifetime Canal Atelier Repair</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#F3EFE6]/10 text-sm font-sans">
                <span className="font-mono text-xs text-[#F3EFE6]/45 uppercase tracking-wider">Edition Price</span>
                <span className="font-mono text-[#FAF8F5] text-base font-medium">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 transition-all duration-700 delay-300 ease-out"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              <Link
                href="/product/041"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1E2B3E] hover:bg-[#283852] text-[#FAF8F5] text-xs font-mono tracking-[0.2em] uppercase border border-[#3E5274]/50 transition-all duration-300 group"
              >
                <span>View Object</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>

              <Link
                href="/archive"
                className="inline-flex items-center justify-center px-6 py-4 text-xs font-mono tracking-[0.15em] uppercase text-[#F3EFE6]/60 hover:text-[#F3EFE6] transition-colors"
              >
                Inspect All 10 Holdings
              </Link>
            </div>

          </div>

          {/* Right Column: Hero Cloth Garment Portrait */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center">
            <Link
              href="/product/041"
              className="block relative w-full max-w-[540px] aspect-[3/4] border border-[#F3EFE6]/15 group overflow-hidden bg-[#161D24] shadow-2xl"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'scale(1)' : 'scale(0.96)',
                transition: 'opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1), transform 1000ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Primary Flat Garment Portrait */}
              <Image
                src="/api/images/041"
                alt="Yama Field Jacket — Object 041"
                fill
                unoptimized
                className="object-cover object-center transition-all duration-700 ease-out group-hover:opacity-0 group-hover:scale-105"
              />

              {/* On-Body Campaign Shot on Hover */}
              <Image
                src="/api/images/041-secondary"
                alt="Yama Field Jacket worn along Otaru canal"
                fill
                unoptimized
                className="object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-105"
              />

              {/* Overlay Tag Indicator */}
              <div className="absolute top-4 left-4 z-10 font-mono text-[10px] tracking-widest uppercase bg-[#0D1217]/80 backdrop-blur-sm px-3 py-1.5 text-[#F3EFE6]/90 border border-white/10">
                Chapter I · No. 041
              </div>

              {/* Subtle hover indicator in bottom right */}
              <div className="absolute bottom-4 right-4 z-10 font-mono text-[10px] tracking-widest uppercase bg-[#0D1217]/80 backdrop-blur-sm px-3 py-1.5 text-[#F3EFE6]/90 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                Study Silhouette ↗
              </div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
