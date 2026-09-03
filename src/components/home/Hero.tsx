'use client';

import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

interface HeroSlide {
  campaign: string;
  eyebrow: string;
  title: string;
  sub: string;
  link: string;
  linkText: string;
  origin: string;
  stats: string;
  kanji: string;
  imageBg: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    campaign: 'Campaign 01 / 03',
    eyebrow: 'Otaru / Living Image Archive',
    title: 'The mountain\nremembers.',
    sub: 'A world of water, timber, cloth, and the objects that pass through it.',
    link: '#new-drops',
    linkText: 'Enter the Archive',
    origin: 'Origin',
    stats: '3 Live Objects in the Archive',
    kanji: '山海',
    imageBg: '/api/hero-image',
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
    kanji: '運河',
    imageBg: '/api/art/great-wave',
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
    kanji: '悠久',
    imageBg: '/api/art/lanterns',
  },
];

const SLIDE_DURATION = 8500;

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isTextTransitioning, setIsTextTransitioning] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(900);
  const heroRef = useRef<HTMLDivElement>(null);

  // 1. Initial Entrance & Auto Cycling
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 80);

    const interval = setInterval(() => {
      handleSlideChange((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // 2. High-Performance 60fps Scroll-Responsive Tracking
  useEffect(() => {
    setWindowHeight(window.innerHeight || 900);

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY || window.pageYOffset || 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    const onResize = () => {
      setWindowHeight(window.innerHeight || 900);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const handleSlideChange = (newIndexOrFn: number | ((prev: number) => number)) => {
    setIsTextTransitioning(true);
    setTimeout(() => {
      setActiveSlide(newIndexOrFn);
      setIsTextTransitioning(false);
    }, 320);
  };

  // Subtle Mouse Parallax & Perspective Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const normalizedX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const normalizedY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    setMouseOffset({
      x: Math.max(-1, Math.min(1, normalizedX)) * 12,
      y: Math.max(-1, Math.min(1, normalizedY)) * 12,
    });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const currentSlide = HERO_SLIDES[activeSlide] ?? HERO_SLIDES[0]!;

  // Scroll Progress (0 at top, 1 when hero scrolled out)
  const scrollFraction = Math.min(1, Math.max(0, scrollY / (windowHeight || 900)));

  // Dynamic Scroll-Responsive Transformations:
  // - Background Zoom: zooms from 1.0 up to 1.32x as collector scrolls
  const backgroundZoomScale = 1.0 + scrollFraction * 0.32;
  const backgroundParallaxY = scrollY * 0.32; // Gentle downward counter-drift
  const backgroundOpacity = Math.max(0.2, 0.82 - scrollFraction * 0.55);

  // - Text Transition: moves upward faster, scales down, blurs, and fades
  const textTranslateY = -scrollY * 0.52;
  const textScale = Math.max(0.82, 1 - scrollFraction * 0.22);
  const textOpacity = Math.max(0, 1 - scrollFraction * 1.6);
  const textBlur = scrollFraction * 8;

  // - Floating Calligraphy Parallax
  const kanjiParallaxY = -scrollY * 0.75;
  const kanjiScale = 1 + scrollFraction * 0.25;

  return (
    <div
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={clsx('hero-stub', isReady && 'is-loaded')}
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        backgroundColor: '#070d14',
      }}
    >
      {/* Scroll-Responsive Background Visual Layer with Zoom In */}
      {HERO_SLIDES.map((slide, idx) => {
        const isActive = idx === activeSlide;
        return (
          <div
            key={slide.campaign}
            aria-hidden={!isActive}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${slide.imageBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%',
              backgroundRepeat: 'no-repeat',
              opacity: isActive ? backgroundOpacity : 0,
              pointerEvents: 'none',
              transform: isActive
                ? `translate3d(${mouseOffset.x * -0.4}px, ${backgroundParallaxY + mouseOffset.y * -0.4}px, 0) scale(${backgroundZoomScale})`
                : 'none',
              transition: isActive
                ? 'opacity 1.2s ease, transform 0.08s linear'
                : 'opacity 0.8s ease',
              willChange: 'transform, opacity',
            }}
          />
        );
      })}

      {/* Atmospheric Gradients */}
      <div
        className="hero-vignette-overlay"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          background:
            'linear-gradient(90deg, rgba(7,13,20,0.74) 0%, rgba(7,13,20,0.35) 48%, rgba(7,13,20,0.12) 75%), linear-gradient(0deg, rgba(7,13,20,0.9) 0%, transparent 35%), linear-gradient(180deg, rgba(7,13,20,0.55) 0%, transparent 22%)',
        }}
      />

      {/* Floating Calligraphy Watermark with Scroll Parallax Drift */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '16%',
          right: '8%',
          pointerEvents: 'none',
          zIndex: 1,
          writingMode: 'vertical-rl',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(5rem, 14vw, 13rem)',
          letterSpacing: '0.25em',
          color: 'rgba(244, 240, 235, 0.038)',
          userSelect: 'none',
          transform: `translate3d(${mouseOffset.x * 0.8}px, ${kanjiParallaxY + mouseOffset.y * 0.8}px, 0) scale(${kanjiScale})`,
          transition: 'transform 0.1s linear',
          willChange: 'transform',
        }}
      >
        {currentSlide.kanji}
      </div>

      {/* Hero Content with Direct Scroll-Responsive Zoom/Fade Transition */}
      <div
        id="heroContent"
        className={clsx('hero-content', isReady && 'is-ready')}
        style={{
          opacity: textOpacity,
          transform: `translate3d(0, ${textTranslateY}px, 0) scale(${textScale})`,
          filter: textBlur > 0.1 ? `blur(${textBlur}px)` : 'none',
          willChange: 'transform, opacity, filter',
          transition: 'transform 0.08s linear, opacity 0.08s linear',
        }}
      >
        {/* Topbar */}
        <div className="hero-topbar">
          <span className="tracking-widest">Otaru / Design House</span>
          <span className="text-[var(--otaru-gold)] opacity-90">{currentSlide.campaign}</span>
          <span className="right font-mono">MMXXVI</span>
        </div>

        {/* Center Main Headline with Smooth Text Transition */}
        <div
          className="hero-main"
          style={{
            transform: isTextTransitioning ? 'scale(0.96) translateY(10px)' : 'scale(1) translateY(0)',
            opacity: isTextTransitioning ? 0.2 : 1,
            filter: isTextTransitioning ? 'blur(3px)' : 'none',
            transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease, filter 0.35s ease',
            willChange: 'transform, opacity, filter',
          }}
        >
          <span className="hero-eyebrow2 text-[var(--otaru-gold)]">{currentSlide.eyebrow}</span>
          <h1
            className="hero-title"
            style={{
              whiteSpace: 'pre-line',
              textShadow: '0 4px 24px rgba(0,0,0,0.6)',
            }}
          >
            {currentSlide.title}
          </h1>
          <p className="hero-sub2">{currentSlide.sub}</p>
          <a
            href={currentSlide.link}
            className="hero-cta2 group"
            data-cursor="EXPLORE"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span>{currentSlide.linkText}</span>
            <span
              className="transform group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            >
              ↗
            </span>
          </a>
        </div>

        {/* Footer Navigation & Progress Indicators */}
        <div className="hero-footer">
          {/* Animated Slide Progress Bars */}
          <div className="hero-dots" role="tablist" aria-label="Hero slides">
            {HERO_SLIDES.map((_, idx) => {
              const isSelected = idx === activeSlide;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSlideChange(idx)}
                  className={clsx('hero-progress-pill', isSelected && 'active')}
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`Slide ${idx + 1}`}
                  style={{
                    position: 'relative',
                    height: 3,
                    width: isSelected ? 42 : 16,
                    borderRadius: 2,
                    backgroundColor: 'rgba(244, 240, 235, 0.2)',
                    overflow: 'hidden',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'width 0.45s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease',
                  }}
                >
                  {isSelected && (
                    <span
                      className="hero-pill-fill"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        backgroundColor: '#D9BD83',
                        animation: `heroProgressFill ${SLIDE_DURATION}ms linear infinite`,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Bar */}
          <div className="hero-bottom">
            <span>Kyoto · Tokyo · Otaru</span>
            <span>{currentSlide.stats}</span>
            <span className="right">Scroll to travel ↓</span>
          </div>
        </div>
      </div>

      {/* Vertical Origin Stamp */}
      <span className="hero-origin" aria-hidden="true">
        {currentSlide.origin}
      </span>
    </div>
  );
}
