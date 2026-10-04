'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ArchivePageTransition — "Indigo Dip"
 * A full-screen indigo veil wipes up (400ms) concealing route swaps, then lifts (400ms)
 * unhurried like dyed cloth lifted from a fermentation vat.
 */
export function ArchivePageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [dipState, setDipState] = useState<'idle' | 'covering' | 'revealing'>('idle');
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Trigger Indigo Dip: Wipe up -> Lift
    setDipState('covering');
    const swapTimer = setTimeout(() => {
      setDipState('revealing');
    }, 400);

    const finishTimer = setTimeout(() => {
      setDipState('idle');
    }, 850);

    return () => {
      clearTimeout(swapTimer);
      clearTimeout(finishTimer);
    };
  }, [pathname]);

  return (
    <>
      {/* Indigo Dip Curtain */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[100] pointer-events-none bg-[var(--indigo)]"
        style={{
          transform:
            dipState === 'idle'
              ? 'translateY(100%)'
              : dipState === 'covering'
              ? 'translateY(0%)'
              : 'translateY(-100%)',
          transition:
            dipState === 'idle'
              ? 'none'
              : 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />

      {/* Main Page Content */}
      <div
        style={{
          minHeight: '100vh',
          opacity: dipState === 'covering' ? 0.8 : 1,
          transition: 'opacity 300ms ease',
        }}
      >
        {children}
      </div>
    </>
  );
}
