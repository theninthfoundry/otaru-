'use client';

import React from 'react';

interface GraphicProps {
  id?: string;
  label?: string;
  ratio?: string;
}

export function DesignedArtifactGraphic({ id, label = '' }: GraphicProps) {
  // Determine artifact theme/type
  const num = id || (label.match(/\b(0\d{2})\b/)?.[1] ?? '041');

  const DEFAULT_THEME = {
    title: 'YAMA FIELD JACKET',
    kanji: '山',
    sub: 'RAW INDIGO CANVAS · DOUBLE SEAM',
    color: '#1a334d',
    accent: '#d9bd83',
    path: 'M 30 70 L 50 40 L 70 70 L 65 140 L 35 140 Z',
  };

  const GRAPHIC_THEMES: Record<string, {
    title: string;
    kanji: string;
    sub: string;
    color: string;
    accent: string;
    path: string;
  }> = {
    '041': DEFAULT_THEME,
    '042': {
      title: 'KIRYŪ WRAP TROUSER',
      kanji: '桐',
      sub: 'WASHED SILK BLEND · ASYMMETRIC',
      color: '#182b3d',
      accent: '#cfc7b3',
      path: 'M 35 45 L 65 45 L 60 145 L 52 145 L 50 85 L 48 145 L 40 145 Z', // trouser silhouette
    },
    '043': {
      title: 'BIRATORI OVERSHIRT',
      kanji: '平',
      sub: 'BOILED WOOL · BOX CUT',
      color: '#22384a',
      accent: '#d9bd83',
      path: 'M 28 50 L 50 42 L 72 50 L 68 135 L 32 135 Z', // overshirt silhouette
    },
    '044': {
      title: 'ŌMI HEMP TOTE',
      kanji: '近',
      sub: 'RAW HEMP CANVAS · RIVETED',
      color: '#172738',
      accent: '#a8905f',
      path: 'M 32 60 L 68 60 L 65 135 L 35 135 Z', // tote silhouette
    },
    '038': {
      title: 'OTARU DECK COAT',
      kanji: '樽',
      sub: 'OILED MELTON WOOL · STORM HOOD',
      color: '#102233',
      accent: '#d9bd83',
      path: 'M 28 42 L 50 35 L 72 42 L 68 148 L 32 148 Z',
    },
    '037': {
      title: 'TSUKIJI APRON SHIRT',
      kanji: '築',
      sub: 'UNDYED LINEN · TIE CLOSURE',
      color: '#1a2e40',
      accent: '#cfc7b3',
      path: 'M 30 48 L 50 40 L 70 48 L 66 138 L 34 138 Z',
    },
    '036': {
      title: 'HAKODATE WATCH CAP',
      kanji: '函',
      sub: 'RIBBED WOOL · 4-DART CROWN',
      color: '#152535',
      accent: '#a8462f',
      path: 'M 35 110 C 35 60, 65 60, 65 110 Z',
    },
    '035': {
      title: 'NEMURO WIDE TROUSER',
      kanji: '根',
      sub: 'HEAVY TWILL · DEEP PLEAT',
      color: '#1b3044',
      accent: '#d9bd83',
      path: 'M 32 45 L 68 45 L 64 145 L 53 145 L 50 80 L 47 145 L 36 145 Z',
    },
    '034': {
      title: 'RISHIRI RAIN SHELL',
      kanji: '利',
      sub: '3-LAYER MEMBRANE · TAPED SEAM',
      color: '#0e1c2c',
      accent: '#5c7a94',
      path: 'M 26 48 L 50 38 L 74 48 L 68 142 L 32 142 Z',
    },
    '033': {
      title: 'WAKKANAI MUFFLER',
      kanji: '稚',
      sub: 'DOUBLE-FACED BRUSHED SILK',
      color: '#1c2f42',
      accent: '#d9bd83',
      path: 'M 38 40 L 62 40 L 62 145 L 38 145 Z',
    },
  };

  const theme = GRAPHIC_THEMES[num] ?? DEFAULT_THEME;

  return (
    <div
      className="designed-artifact-canvas"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '100%',
        backgroundColor: theme.color,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1rem',
      }}
    >
      {/* Background Architectural Grid & Sashiko Lines */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.28,
          pointerEvents: 'none',
        }}
        viewBox="0 0 100 125"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id={`grid-${num}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(244,239,226,0.3)" strokeWidth="0.5" />
            <circle cx="5" cy="5" r="0.4" fill="rgba(217,189,131,0.5)" />
          </pattern>
          <linearGradient id={`grad-${num}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(244,239,226,0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        <rect width="100" height="125" fill={`url(#grid-${num})`} />
        
        {/* Architectural Diagonal Axes */}
        <line x1="0" y1="0" x2="100" y2="125" stroke="rgba(244,239,226,0.12)" strokeWidth="0.5" strokeDasharray="2,2" />
        <line x1="100" y1="0" x2="0" y2="125" stroke="rgba(244,239,226,0.12)" strokeWidth="0.5" strokeDasharray="2,2" />
        <circle cx="50" cy="62.5" r="32" fill="none" stroke="rgba(217,189,131,0.22)" strokeWidth="0.75" />
        <circle cx="50" cy="62.5" r="44" fill="none" stroke="rgba(244,239,226,0.08)" strokeWidth="0.5" strokeDasharray="1,3" />

        {/* Minimal Silhouette Vector */}
        <path
          d={theme.path}
          fill="none"
          stroke={theme.accent}
          strokeWidth="0.85"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
          className="svg-vector-pulse"
        />
      </svg>

      {/* Top Metadata Header */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: theme.accent, textTransform: 'uppercase' }}>
          NO. {num}
        </span>
        <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'rgba(244,239,226,0.6)' }}>
          {theme.kanji}
        </span>
      </div>

      {/* Center Diamond Emblem */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 'auto 0',
        }}
      >
        <div
          className="emblem-diamond"
          style={{
            width: '42px',
            height: '42px',
            border: '1px solid rgba(217,189,131,0.4)',
            transform: 'rotate(45deg)',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: 'rgba(11,20,32,0.45)',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.5s ease',
          }}
        >
          <span
            style={{
              transform: 'rotate(-45deg)',
              color: 'var(--otaru-parchment)',
              fontSize: '0.95rem',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
            }}
          >
            ◇
          </span>
        </div>
        <span
          style={{
            marginTop: '1.2rem',
            fontSize: '0.58rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--otaru-parchment-dim)',
            textAlign: 'center',
          }}
        >
          ARCHIVE SPECIFICATION
        </span>
      </div>

      {/* Bottom Technical Spec Footer */}
      <div style={{ position: 'relative', zIndex: 2, borderTop: '1px dashed rgba(217,189,131,0.3)', paddingTop: '0.55rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--otaru-parchment)', fontWeight: 500 }}>
            {theme.title}
          </p>
          <p style={{ margin: '0.15rem 0 0', fontSize: '0.54rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--otaru-horizon)' }}>
            {theme.sub}
          </p>
        </div>

        {/* Vermilion Hankō Atelier Stamp */}
        <div
          title="Otaru Atelier Seal"
          style={{
            width: '22px',
            height: '22px',
            border: '1.2px solid #b54932',
            borderRadius: '2px',
            backgroundColor: 'rgba(181, 73, 50, 0.18)',
            color: '#b54932',
            fontFamily: 'var(--font-display)',
            fontSize: '0.54rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'rotate(-4deg)',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          印
        </div>
      </div>

      <style jsx>{`
        .designed-artifact-canvas {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease;
        }
        .designed-artifact-canvas:hover .emblem-diamond {
          border-color: var(--otaru-gold);
          transform: rotate(45deg) scale(1.1);
          box-shadow: 0 0 16px rgba(217, 189, 131, 0.3);
        }
        .svg-vector-pulse {
          animation: vectorPulse 6s ease-in-out infinite alternate;
        }
        @keyframes vectorPulse {
          0% { opacity: 0.65; }
          100% { opacity: 0.95; }
        }
      `}</style>
    </div>
  );
}
