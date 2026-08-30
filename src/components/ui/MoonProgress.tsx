'use client';

import React, { useEffect, useState } from 'react';

export function MoonProgress() {
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight || 1;
      const pct = Math.min(1, Math.max(0, y / total));
      setScrollPct(pct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="moon-progress"
      onClick={scrollToTop}
      role="button"
      tabIndex={0}
      aria-label="Scroll to top"
      title="Scroll progress (Click to return to top)"
    >
      <div
        className="mask"
        style={{
          transform: `translateX(${scrollPct * 100}%)`,
        }}
      />
    </div>
  );
}
