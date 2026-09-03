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
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(900);
  const heroRef = useRef<HTMLDivElement>(null);

  // 1. Initial Entrance & Auto Cycling
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 60);

    const interval = setInterval(() => {
      handleSlideChange((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // 2. High-Performance 60fps Scroll Tracking
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
    setTextAnimState('exit');
    setTimeout(() => {
      setActiveSlide(newIndexOrFn);
      setTextAnimState('enter');
      setTimeout(() => {
        setTextAnimState('idle');
      }, 480);
    }, 260);
  };

  // Subtle Mouse Parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const normalizedX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const normalizedY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    setMouseOffset({
      x: Math.max(-1, Math.min(1, normalizedX)) * 10,
      y: Math.max(-1, Math.min(1, normalizedY)) * 10,
    });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const currentSlide = HERO_SLIDES[activeSlide] ?? HERO_SLIDES[0]!;

  // Refined Scroll Kinematics:
  const scrollFraction = Math.min(1, Math.max(0, scrollY / (windowHeight || 900)));

  // Background: subtle zoom from 1.0 to 1.14x, slow atmospheric drift
  const backgroundZoomScale = 1.0 + scrollFraction * 0.14;
  const backgroundParallaxY = scrollY * 0.22;
  const backgroundOpacity = Math.max(0.32, 0.85 - scrollFraction * 0.45);

  // Text: stays razor crisp in top 25% of scroll, then lifts gently upward
  const textTranslateY = -scrollY * 0.32;
  const textOpacity =
    scrollFraction < 0.25
      ? 1
      : Math.max(0, 1 - Math.pow((scrollFraction - 0.25) / 0.75, 1.25));
  const textBlur = scrollFraction > 0.45 ? (scrollFraction - 0.45) * 5 : 0;

  // Floating Calligraphy Parallax Drift
  const kanjiParallaxY = -scrollY * 0.45;
  const kanjiOpacity = Math.max(0.015, 0.045 - scrollFraction * 0.035);

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
      {/* Scroll-Responsive Background Visual Layer */}
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
                ? `translate3d(${mouseOffset.x * -0.3}px, ${backgroundParallaxY + mouseOffset.y * -0.3}px, 0) scale(${backgroundZoomScale})`
                : 'scale(1.02)',
              transition: isActive
                ? 'opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 0.08s linear'
                : 'opacity 0.8s ease',
              willChange: 'transform, opacity',
            }}
          />
        );
      })}

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
          opacity: kanjiOpacity,
          userSelect: 'none',
          transform: `translate3d(0, ${kanjiParallaxY}px, 0)`,
          transition: 'transform 0.08s linear, opacity 0.3s ease',
          willChange: 'transform, opacity',
        }}
      >
        {currentSlide.kanji}
      </div>

      {/* Kinetic Hero Content Container */}
      <div
        id="heroContent"
        className={clsx('hero-content', isReady && 'is-ready')}
        style={{
          opacity: textOpacity,
          transform: `translate3d(0, ${textTranslateY}px, 0)`,
          filter: textBlur > 0.1 ? `blur(${textBlur}px)` : 'none',
          willChange: 'transform, opacity, filter',
          transition: 'transform 0.08s linear, opacity 0.1s linear',
        }}
      >
        {/* Topbar Metadata */}
        <div className="hero-topbar">
          <span className="tracking-widest">Otaru / Design House</span>
          <span className="text-[var(--otaru-gold)] opacity-90">{currentSlide.campaign}</span>
          <span className="right font-mono">MMXXVI</span>
        </div>

        {/* Center Main Headline with Smooth Text Transition */}
        <div
          className="hero-main"
          style={{
            transform:
              textAnimState === 'exit'
                ? 'translate3d(0, -12px, 0)'
                : textAnimState === 'enter'
                ? 'translate3d(0, 12px, 0)'
                : 'translate3d(0, 0, 0)',
            opacity: textAnimState === 'exit' ? 0.15 : 1,
            filter: textAnimState === 'exit' ? 'blur(3px)' : 'none',
            transition:
              textAnimState === 'exit'
                ? 'transform 0.26s cubic-bezier(0.4, 0, 1, 1), opacity 0.26s ease, filter 0.26s ease'
                : 'transform 0.48s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.48s ease, filter 0.48s ease',
            willChange: 'transform, opacity, filter',
          }}
        >
          <span className="hero-eyebrow2 text-[var(--otaru-gold)]">{currentSlide.eyebrow}</span>
          <h1
            className="hero-title"
            style={{
              whiteSpace: 'pre-line',
              textShadow: '0 4px 28px rgba(0,0,0,0.65), 0 0 50px rgba(217,189,131,0.06)',
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
