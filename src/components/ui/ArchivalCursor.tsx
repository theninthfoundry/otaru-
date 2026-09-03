'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * ArchivalCursor
 * Ultra-refined bespoke editorial cursor designed for Otaru.
 * Features an outer liquid ink/gold ring and an inner precision dot,
 * expanding into an archival viewing loupe when hovering over interactive artifacts.
 * Automatically disabled on touch screens.
 */
export function ArchivalCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const [cursorText, setCursorText] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (window.matchMedia('(pointer: fine)').matches) {
      setIsSupported(true);
    } else {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check hover target
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('a, button, [role="button"], input, select, textarea, .group, [data-cursor]');
        if (interactive) {
          setIsHovered(true);
          const customText = interactive.getAttribute('data-cursor');
          if (customText) {
            setCursorText(customText);
          } else if (interactive.closest('.otaru-img-container') || interactive.closest('[data-label]')) {
            setCursorText('VIEW');
          } else {
            setCursorText('');
          }
        } else {
          setIsHovered(false);
          setCursorText('');
        }
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Smooth trailing physics for outer ring
    const render = () => {
      const ease = 0.18;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isSupported) return null;

  return (
    <div
      className="archival-cursor-wrapper"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 999999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.25s ease-out',
      }}
      aria-hidden="true"
    >
      {/* Precision Inner Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'absolute',
          top: -2.5,
          left: -2.5,
          width: 5,
          height: 5,
          borderRadius: '50%',
          backgroundColor: '#D9BD83',
          pointerEvents: 'none',
          opacity: isHovered && cursorText ? 0 : 1,
          transition: 'opacity 0.2s ease, transform 0.05s linear',
          willChange: 'transform',
        }}
      />

      {/* Outer Floating Lens Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'absolute',
          top: cursorText ? -34 : isHovered ? -22 : -15,
          left: cursorText ? -34 : isHovered ? -22 : -15,
          width: cursorText ? 68 : isHovered ? 44 : 30,
          height: cursorText ? 68 : isHovered ? 44 : 30,
          borderRadius: '50%',
          border: cursorText
            ? '1px solid rgba(217, 189, 131, 0.75)'
            : isHovered
            ? '1px solid rgba(217, 189, 131, 0.55)'
            : '1px solid rgba(244, 240, 235, 0.25)',
          backgroundColor: cursorText
            ? 'rgba(12, 12, 14, 0.82)'
            : isHovered
            ? 'rgba(217, 189, 131, 0.08)'
            : 'transparent',
          backdropFilter: cursorText ? 'blur(4px)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformOrigin: 'center center',
          scale: isClicking ? '0.85' : '1',
          transition: 'width 0.24s cubic-bezier(0.16, 1, 0.3, 1), height 0.24s cubic-bezier(0.16, 1, 0.3, 1), top 0.24s cubic-bezier(0.16, 1, 0.3, 1), left 0.24s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, border-color 0.2s ease, scale 0.15s ease',
          willChange: 'transform',
          boxShadow: isHovered ? '0 0 16px rgba(217, 189, 131, 0.15)' : 'none',
        }}
      >
        {cursorText && (
          <span
            ref={textRef}
            style={{
              fontFamily: 'var(--font-display, serif)',
              fontSize: '9px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#D9BD83',
              pointerEvents: 'none',
              userSelect: 'none',
              opacity: 0.95,
            }}
          >
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}
