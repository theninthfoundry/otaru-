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
  const [textAnimState, setTextAnimState] = useState<'idle' | 'exit' | 'enter'>('idle');
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const bgContainerRef = useRef<HTMLDivElement>(null);
  const kanjiRef = useRef<HTMLDivElement>(null);

  // 1. Initial Pop-Up Entrance & Auto Slide Cycling
  useEffect(() => {
    // Staggered pop-up triggers on mount
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 70);

    const interval = setInterval(() => {
      handleSlideChange((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // 2. Buttery-Smooth Direct RAF Lerp Scroll Parallax (Zero Jitter, Zero React Re-renders)
  useEffect(() => {
    let targetY = window.scrollY || 0;
    let currentY = targetY;
    let rafId: number;
    let isRunning = true;

    const onScroll = () => {
      targetY = window.scrollY || window.pageYOffset || 0;
    };

    const tick = () => {
      if (!isRunning) return;

      const diff = targetY - currentY;
      if (Math.abs(diff) < 0.08) {
        currentY = targetY;
      } else {
        // Silky smooth, responsive damping factor for fluid glide
        currentY += diff * 0.16;
      }

      const h = window.innerHeight || 900;
      // Only compute and apply transforms while hero is visible in viewport
      if (currentY <= h * 1.3) {
        const fraction = Math.min(1, Math.max(0, currentY / h));

        // 1. Text Container: stays crisp in upper fold, then floats gracefully upward and fades
        if (heroContentRef.current) {
          const textY = -currentY * 0.30;
          const textOpacity =
            fraction < 0.20
              ? 1
              : Math.max(0, 1 - Math.pow((fraction - 0.20) / 0.80, 1.35));
          heroContentRef.current.style.transform = `translate3d(0, ${textY.toFixed(2)}px, 0)`;
          heroContentRef.current.style.opacity = textOpacity.toFixed(3);
        }

        // 2. Background: subtle depth parallax & cinematic scale expansion
        if (bgContainerRef.current) {
          const bgY = currentY * 0.22;
          const bgScale = 1.0 + fraction * 0.12;
          bgContainerRef.current.style.transform = `translate3d(0, ${bgY.toFixed(2)}px, 0) scale(${bgScale.toFixed(4)})`;
        }

        // 3. Kanji Calligraphy: gentle atmospheric upward float
        if (kanjiRef.current) {
          const kanjiY = -currentY * 0.42;
          const kanjiOpacity = Math.max(0.012, 0.045 - fraction * 0.035);
          kanjiRef.current.style.transform = `translate3d(0, ${kanjiY.toFixed(2)}px, 0)`;
          kanjiRef.current.style.opacity = kanjiOpacity.toFixed(3);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleSlideChange = (newIndexOrFn: number | ((prev: number) => number)) => {
    setTextAnimState('exit');
    setTimeout(() => {
      setActiveSlide(newIndexOrFn);
      setTextAnimState('enter');
      setTimeout(() => {
        setTextAnimState('idle');
      }, 500);
    }, 220);
  };

  // Subtle Mouse Parallax on Desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const normalizedX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const normalizedY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    setMouseOffset({
      x: Math.max(-1, Math.min(1, normalizedX)) * 8,
      y: Math.max(-1, Math.min(1, normalizedY)) * 8,
    });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const currentSlide = HERO_SLIDES[activeSlide] ?? HERO_SLIDES[0]!;

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
      {/* Scroll-Responsive Background Visual Layer with Independent Parallax Container */}
      <div
        ref={bgContainerRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      >
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
                opacity: isActive ? 0.85 : 0,
                pointerEvents: 'none',
                transform: `translate3d(${mouseOffset.x * -0.25}px, ${mouseOffset.y * -0.25}px, 0)`,
                transition: isActive
                  ? 'opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s ease-out'
                  : 'opacity 0.8s ease, transform 0.4s ease-out',
                willChange: 'opacity, transform',
              }}
            />
          );
        })}
      </div>

      {/* Vignette Atmosphere Gradients */}
      <div
        className="hero-vignette-overlay"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          background:
            'linear-gradient(90deg, rgba(7,13,20,0.78) 0%, rgba(7,13,20,0.38) 48%, rgba(7,13,20,0.14) 75%), linear-gradient(0deg, rgba(7,13,20,0.92) 0%, transparent 35%), linear-gradient(180deg, rgba(7,13,20,0.55) 0%, transparent 22%)',
        }}
      />

      {/* Floating Calligraphy Watermark with Parallax Drift */}
      <div
        ref={kanjiRef}
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
          color: 'var(--otaru-parchment)',
          opacity: 0.045,
          userSelect: 'none',
          willChange: 'transform, opacity',
        }}
      >
        {currentSlide.kanji}
      </div>

      {/* Kinetic Hero Content Container */}
      <div
        id="heroContent"
        ref={heroContentRef}
        className={clsx('hero-content', isReady && 'is-ready')}
      >
        {/* Topbar Metadata: Fades down into place */}
        <div className="hero-topbar hero-popup-topbar">
          <span className="tracking-widest">Otaru / Design House</span>
          <span className="text-[var(--otaru-gold)] opacity-90">{currentSlide.campaign}</span>
          <span className="right font-mono">MMXXVI</span>
        </div>

        {/* Center Main Headline with Staggered Pop-Up Entrance & Smooth Slide Transitions */}
        <div
          className="hero-main"
          style={{
            transform:
              textAnimState === 'exit'
                ? 'translate3d(0, -16px, 0)'
                : textAnimState === 'enter'
                ? 'translate3d(0, 24px, 0) scale(0.97)'
                : 'translate3d(0, 0, 0) scale(1)',
            opacity: textAnimState === 'exit' ? 0 : 1,
            transition:
              textAnimState === 'exit'
                ? 'transform 0.22s cubic-bezier(0.4, 0, 1, 1), opacity 0.22s ease'
                : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
            willChange: 'transform, opacity',
          }}
        >
          <span className="hero-eyebrow2 hero-popup-eyebrow text-[var(--otaru-gold)]">
            {currentSlide.eyebrow}
          </span>
          <h1
            className="hero-title hero-popup-title"
            style={{
              whiteSpace: 'pre-line',
              textShadow: '0 4px 28px rgba(0,0,0,0.65), 0 0 50px rgba(217,189,131,0.06)',
            }}
          >
            {currentSlide.title}
          </h1>
          <p className="hero-sub2 hero-popup-sub">{currentSlide.sub}</p>
          <a
            href={currentSlide.link}
            className="hero-cta2 hero-popup-cta group"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              cursor: 'pointer',
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
        <div className="hero-footer hero-popup-footer">
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
                    transition:
                      'width 0.45s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease',
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

          <div className="hero-bottom">
            <span>Kyoto · Tokyo · Otaru</span>
            <span>{currentSlide.stats}</span>
            <span className="right">Scroll to travel ↓</span>
          </div>
        </div>
      </div>

      <span className="hero-origin" aria-hidden="true">
        {currentSlide.origin}
      </span>
    </div>
  );
}
