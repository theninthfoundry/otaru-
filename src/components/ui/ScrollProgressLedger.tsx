'use client';

import React, { useEffect, useState } from 'react';

/**
 * ScrollProgressLedger
 * Discreet vertical ledger indicator tracking current position through the archive.
 * Subtle, calm, zero distraction.
 */
export function ScrollProgressLedger() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('01');
  const [isScrollingFast, setIsScrollingFast] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = Date.now();
    let timeout: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight > 0) {
        const pct = Math.min(Math.max(currentScrollY / docHeight, 0), 1);
        setScrollProgress(pct);

        // Section indexing (01: Hero/Drops, 02: Chapters, 03: Archive, 04: Story/Craft, 05: Journal)
        if (pct < 0.2) setActiveSection('01');
        else if (pct < 0.4) setActiveSection('02');
        else if (pct < 0.6) setActiveSection('03');
        else if (pct < 0.8) setActiveSection('04');
        else setActiveSection('05');
      }

      // Velocity detection
      const deltaY = Math.abs(currentScrollY - lastScrollY);
      const deltaTime = currentTime - lastTime || 1;
      const speed = deltaY / deltaTime; // px per ms

      if (speed > 1.8) {
        setIsScrollingFast(true);
      }

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsScrollingFast(false);
      }, 150);

      lastScrollY = currentScrollY;
      lastTime = currentTime;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="hidden md:flex"
      style={{
        position: 'fixed',
        left: '1.4rem',
        bottom: '2.5rem',
        zIndex: 85,
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.6rem',
        opacity: isScrollingFast ? 0.35 : 0.85,
        transition: 'opacity 0.3s ease',
        fontSize: '0.6rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--otaru-parchment-dim)',
      }}
    >
      <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: 'var(--otaru-gold-dim)' }}>
        ARCHIVE
      </span>
      <div
        style={{
          width: '1px',
          height: '42px',
          backgroundColor: 'var(--otaru-line)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${scrollProgress * 100}%`,
            backgroundColor: 'var(--otaru-gold)',
            transition: 'height 0.1s linear',
          }}
        />
      </div>
      <span style={{ color: 'var(--otaru-parchment)', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '0.74rem' }}>
        {activeSection} / 05
      </span>
    </div>
  );
}
