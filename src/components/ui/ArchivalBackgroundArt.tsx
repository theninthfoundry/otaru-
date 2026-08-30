'use client';

import React from 'react';

/**
 * ArchivalBackgroundArt
 * Minimalist Japanese craft elements, sashiko stitch patterns, ASCII art diagrams,
 * and vertical kanji calligraphy watermarks to enrich empty UI spaces.
 */

export function SashikoGrid({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      className={`sashiko-bg ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        opacity: 0.04,
        ...style,
      }}
    >
      <svg width="100%" height="100%">
        <defs>
          <pattern id="sashikoPattern" width="48" height="48" patternUnits="userSpaceOnUse">
            {/* Running Sashiko Dashes */}
            <path
              d="M 6 24 L 18 24 M 30 24 L 42 24 M 24 6 L 24 18 M 24 30 L 24 42"
              stroke="#f4efe2"
              strokeWidth="1.2"
              strokeDasharray="4, 3"
              strokeLinecap="round"
            />
            {/* Diamond Intersection Point */}
            <circle cx="24" cy="24" r="1.5" fill="#d9bd83" />
            <circle cx="0" cy="0" r="1.5" fill="#d9bd83" />
            <circle cx="48" cy="0" r="1.5" fill="#d9bd83" />
            <circle cx="0" cy="48" r="1.5" fill="#d9bd83" />
            <circle cx="48" cy="48" r="1.5" fill="#d9bd83" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sashikoPattern)" />
      </svg>
    </div>
  );
}

export function VerticalKanjiStamp({
  text,
  subtext,
  top = '10%',
  right,
  left,
  opacity = 0.06,
}: {
  text: string;
  subtext?: string;
  top?: string;
  right?: string;
  left?: string;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top,
        right,
        left,
        pointerEvents: 'none',
        zIndex: 0,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.6rem',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          letterSpacing: '0.35em',
          color: 'var(--otaru-parchment)',
          lineHeight: 1,
        }}
      >
        {text}
      </div>
      {subtext && (
        <span
          style={{
            writingMode: 'vertical-rl',
            fontSize: '0.6rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'var(--otaru-gold)',
            fontFamily: 'monospace',
          }}
        >
          {subtext}
        </span>
      )}
    </div>
  );
}

export function AsciiWaveArt({
  style,
  opacity = 0.07,
}: {
  style?: React.CSSProperties;
  opacity?: number;
}) {
  const asciiWave = `
     .  _   _   _  .       _   _   _
    / \\/ \\_/ \\_/ \\  .     / \\_/ \\_/ \\
   /    .  _   _  \\/ \\   /   _   _   \\
  /    / \\/ \\_/ \\     \\_/ \\ / \\ / \\   \\
 /    /   \\      \\         V   V   \\   \\
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  `;

  return (
    <pre
      aria-hidden="true"
      style={{
        fontFamily: 'monospace',
        fontSize: '0.65rem',
        lineHeight: 1.15,
        color: 'var(--otaru-gold)',
        opacity,
        pointerEvents: 'none',
        userSelect: 'none',
        margin: 0,
        ...style,
      }}
    >
      {asciiWave}
    </pre>
  );
}

export function AsciiLoomBlueprint({
  style,
  opacity = 0.08,
}: {
  style?: React.CSSProperties;
  opacity?: number;
}) {
  const asciiLoom = `
  +-----------------[ TOYODA G3 SHUTTLE LOOM · 1968 ]-----------------+
  |  WARP TENSION : [============||===========] 480 GSM               |
  |  SHUTTLE SPEED: 140 PICKS/MIN   ·   BOTANICAL SUKUMO DIP: 14x     |
  |  +-------------------------------------------------------------+  |
  |  | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | |  |
  |  |===+===+===+===+===+===+===+===+===+===+===+===+===+===+===+=|  |
  |  | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | |  |
  |  +-------------------------------------------------------------+  |
  |  HEMP / INDIGO / WOOL / SILK · OTARU HARBOR CANAL DYEHOUSE MMXXVI  |
  +-------------------------------------------------------------------+
  `;

  return (
    <pre
      aria-hidden="true"
      style={{
        fontFamily: 'monospace',
        fontSize: '0.62rem',
        lineHeight: 1.25,
        color: 'var(--otaru-parchment)',
        opacity,
        pointerEvents: 'none',
        userSelect: 'none',
        margin: 0,
        ...style,
      }}
    >
      {asciiLoom}
    </pre>
  );
}

export function JapaneseCornerBorder({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative' }}>
      {/* Corner Sashiko Stitch Marks */}
      <span
        style={{
          position: 'absolute',
          top: '-8px',
          left: '-8px',
          fontSize: '0.75rem',
          color: 'var(--otaru-gold-dim)',
          lineHeight: 1,
          pointerEvents: 'none',
          opacity: 0.5,
        }}
      >
        ┌─
      </span>
      <span
        style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          fontSize: '0.75rem',
          color: 'var(--otaru-gold-dim)',
          lineHeight: 1,
          pointerEvents: 'none',
          opacity: 0.5,
        }}
      >
        ─┐
      </span>
      <span
        style={{
          position: 'absolute',
          bottom: '-8px',
          left: '-8px',
          fontSize: '0.75rem',
          color: 'var(--otaru-gold-dim)',
          lineHeight: 1,
          pointerEvents: 'none',
          opacity: 0.5,
        }}
      >
        └─
      </span>
      <span
        style={{
          position: 'absolute',
          bottom: '-8px',
          right: '-8px',
          fontSize: '0.75rem',
          color: 'var(--otaru-gold-dim)',
          lineHeight: 1,
          pointerEvents: 'none',
          opacity: 0.5,
        }}
      >
        ─┘
      </span>
      {children}
    </div>
  );
}
