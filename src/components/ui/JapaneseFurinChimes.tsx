'use client';

import React from 'react';

interface JapaneseFurinChimesProps {
  opacity?: number;
  maxWidth?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * JapaneseFurinChimes (風鈴)
 * Beautifully matches the hand-painted Edo glass wind chimes to the dark ink UI
 * with gentle wind-sway physics and feathered edges.
 */
export function JapaneseFurinChimes({
  opacity = 0.85,
  maxWidth = '360px',
  className = '',
  style,
}: JapaneseFurinChimesProps) {
  return (
    <div
      className={`furin-container ${className}`}
      aria-hidden="true"
      style={{
        position: 'relative',
        display: 'inline-block',
        maxWidth,
        width: '100%',
        pointerEvents: 'none',
        userSelect: 'none',
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0.8) 75%, transparent 95%)',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0.8) 75%, transparent 95%)',
        }}
      >
        <img
          src="/api/art/furin"
          alt=""
          className="furin-img"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            mixBlendMode: 'screen',
            filter: 'contrast(1.2) brightness(0.95) drop-shadow(0 4px 12px rgba(217, 189, 131, 0.15))',
            opacity,
          }}
        />
      </div>

      <style jsx>{`
        .furin-container {
          animation: furinFloat 7s ease-in-out infinite alternate;
        }
        @keyframes furinFloat {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-3px) rotate(0.8deg);
          }
          100% {
            transform: translateY(1px) rotate(-0.6deg);
          }
        }
      `}</style>
    </div>
  );
}
