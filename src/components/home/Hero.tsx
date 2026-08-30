'use client';

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

const HERO_SLIDES = [
  {
    campaign: 'Campaign 01 / 03',
    eyebrow: 'Otaru / Living Image Archive',
    title: 'The mountain\nremembers.',
    sub: 'A world of water, timber, cloth, and the objects that pass through it.',
    link: '#new-drops',
    linkText: 'Enter the Archive',
    origin: 'Origin',
    stats: '3 Live Objects in the Archive',
  },
  {
    campaign: 'Campaign 02 / 03',
    eyebrow: 'Permanent Weaves / Hokkaido',
    title: 'Water drawn from\nthe canal.',
    sub: 'Indigo cotton twill, raw hemp canvas, and boiled wool finished by four craftsmen.',
    link: '#craft',
    linkText: 'Discover Materials',
    origin: 'Studio',
    stats: 'Four Materials On Hand',
  },
  {
    campaign: 'Campaign 03 / 03',
    eyebrow: 'Chapter I / Kyoto Nights',
    title: 'Objects built for\nlifetime wear.',
    sub: 'We do not chase seasons. We chase the right amount of time.',
    link: '#chapters',
    linkText: 'View Chapters',
    origin: 'Archive',
    stats: 'Permanent Archival Series',
  },
];

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Subtle, deliberate entrance rhythm
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 60);

    // Auto rotate slides smoothly every 7.5s
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const slide = HERO_SLIDES[activeSlide];

  return (
    <div className={clsx('hero-stub', isReady && 'is-loaded')}>
      {/* Background Image Container with scale settle (1.045 -> 1.0) */}
      <div
        className="hero-bg-layer"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/api/hero-image)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundRepeat: 'no-repeat',
          transform: isReady ? 'scale(1)' : 'scale(1.045)',
          opacity: isReady ? 1 : 0.85,
          transition: 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s ease',
        }}
      />

      {/* Hero Content Overlay */}
      <div id="heroContent" className={clsx('hero-content', isReady && 'is-ready')}>
        {/* Topbar */}
        <div className="hero-topbar">
          <span>Otaru / Design House</span>
          <span>{slide.campaign}</span>
          <span className="right">MMXXVI</span>
        </div>

        {/* Center Main Headline */}
        <div className="hero-main">
          <span className="hero-eyebrow2">{slide.eyebrow}</span>
          <h1 className="hero-title" style={{ whiteSpace: 'pre-line' }}>
            {slide.title}
          </h1>
          <p className="hero-sub2">{slide.sub}</p>
          <a href={slide.link} className="hero-cta2">
            {slide.linkText} <span aria-hidden="true">↗</span>
          </a>
        </div>

        {/* Footer Navigation & Indicators */}
        <div className="hero-footer">
          {/* Dots Indicator */}
          <div className="hero-dots" role="tablist" aria-label="Hero slides">
            {HERO_SLIDES.map((_, idx) => (
              <span
                key={idx}
                className={clsx(idx === activeSlide && 'active')}
                onClick={() => setActiveSlide(idx)}
                style={{ cursor: 'pointer' }}
                role="tab"
                aria-selected={idx === activeSlide}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="hero-bottom">
            <span>Kyoto · Tokyo · Otaru</span>
            <span>{slide.stats}</span>
            <span className="right">Scroll to travel ↓</span>
          </div>
        </div>
      </div>

      {/* Vertical Origin Badge */}
      <span className="hero-origin" aria-hidden="true">
        {slide.origin}
      </span>
    </div>
  );
}
