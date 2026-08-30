'use client';

import React from 'react';

/**
 * ArchiveTextureOverlay
 * Adds an ultra-subtle archival paper grain and perimeter vignette layer (opacity 0.022).
 * Tangible, tactile, expensive feel without distraction or performance overhead.
 */
export function ArchiveTextureOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 999,
        overflow: 'hidden',
      }}
    >
      {/* Micro-texture SVG Film/Paper Grain */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.024,
        }}
      >
        <filter id="archiveGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#archiveGrain)" />
      </svg>

      {/* Subtle Archival Perimeter Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 65%, rgba(4, 8, 14, 0.38) 100%)',
        }}
      />
    </div>
  );
}
