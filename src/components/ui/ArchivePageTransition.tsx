'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ArchivePageTransition
 * Smooth, calm dark veil transition between archival routes.
 * 400ms duration, zero jarring flashes.
 */
export function ArchivePageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 420);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      style={{
        opacity: isTransitioning ? 0.94 : 1,
        transform: isTransitioning ? 'translateY(4px)' : 'none',
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  );
}
