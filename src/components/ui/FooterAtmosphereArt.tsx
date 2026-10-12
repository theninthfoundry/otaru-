'use client';

import React from 'react';

/**
 * FooterAtmosphereArt
 * 
 * Recreates the subtle Japanese material textures and organic perimeter artwork
 * from the House of Otaru editorial reference image:
 * - Left edge: Monochromatic botanical specimen & vertical '小樽' kanji hallmark (desktop only to prevent mobile overlap).
 * - Right edge: Rugged dark natural mineral rock formation.
 * - Top right: Delicate circular geometric line motif arching behind the rock.
 * - Bottom left: Grounded dark natural stone texture.
 * - Surface: Subtle fine washi grain texture.
 * 
 * Zero external photo dependencies, pure responsive vector/svg craft.
 * Strictly positioned at perimeter with pointer-events-none to ensure
 * zero obstruction of text or interactive links.
 */
export function FooterAtmosphereArt() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      {/* 1. Fine Washi Paper Grain Texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.032] mix-blend-screen pointer-events-none">
        <filter id="footerTextureGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#footerTextureGrain)" fill="#F2E8D6" />
      </svg>

      {/* 2. Top-Right Delicate Circular Geometric Motif */}
      <div className="absolute right-0 top-0 w-[360px] sm:w-[480px] lg:w-[620px] h-[360px] sm:h-[480px] lg:h-[620px] -translate-y-1/3 translate-x-1/4 pointer-events-none opacity-45">
        <svg viewBox="0 0 500 500" className="w-full h-full" fill="none">
          {/* Outer primary circle */}
          <circle
            cx="250"
            cy="250"
            r="230"
            stroke="rgba(222, 210, 188, 0.28)"
            strokeWidth="0.85"
          />
          {/* Secondary concentric arc */}
          <circle
            cx="250"
            cy="250"
            r="215"
            stroke="rgba(222, 210, 188, 0.12)"
            strokeWidth="0.6"
            strokeDasharray="4 8"
          />
          {/* Subtle intersecting axis */}
          <line
            x1="20"
            y1="250"
            x2="480"
            y2="250"
            stroke="rgba(222, 210, 188, 0.08)"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* 3. Left Edge: Delicate Botanical Leaf Specimen */}
      <div className="absolute -left-6 sm:left-0 top-[28%] sm:top-[32%] w-28 sm:w-36 lg:w-44 h-72 sm:h-88 lg:h-96 pointer-events-none opacity-40 sm:opacity-60 mix-blend-screen">
        <svg viewBox="0 0 160 360" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A4E4E" />
              <stop offset="60%" stopColor="#303535" />
              <stop offset="100%" stopColor="#181B1B" />
            </linearGradient>
            <linearGradient id="leafGrad1" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#6C7270" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#3C4140" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#1E2222" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="leafGrad2" x1="0%" y1="20%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#787F7D" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#323737" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#121515" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Main Stem */}
          <path
            d="M 12 340 C 24 280 38 210 52 140 C 62 90 74 40 86 10"
            stroke="url(#stemGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Leaf 1 (Top Tip) */}
          <path
            d="M 86 10 C 94 2 108 8 114 20 C 118 28 112 38 100 38 C 88 38 82 24 86 10 Z"
            fill="url(#leafGrad1)"
          />
          <path d="M 86 10 Q 102 24 114 20" stroke="#7A8280" strokeWidth="0.5" opacity="0.6" />

          {/* Leaf 2 (Upper Right) */}
          <path
            d="M 76 56 C 96 46 116 52 126 68 C 132 78 124 92 106 94 C 90 94 76 80 76 56 Z"
            fill="url(#leafGrad2)"
          />
          <path d="M 76 56 Q 104 74 126 68" stroke="#8A9290" strokeWidth="0.5" opacity="0.6" />

          {/* Leaf 3 (Upper Left) */}
          <path
            d="M 64 88 C 42 74 24 82 18 100 C 14 112 26 122 44 120 C 60 118 68 104 64 88 Z"
            fill="url(#leafGrad1)"
          />
          <path d="M 64 88 Q 38 104 18 100" stroke="#7A8280" strokeWidth="0.5" opacity="0.6" />

          {/* Leaf 4 (Mid Right) */}
          <path
            d="M 54 135 C 78 125 102 135 110 154 C 114 166 104 180 84 180 C 66 180 52 162 54 135 Z"
            fill="url(#leafGrad2)"
          />
          <path d="M 54 135 Q 86 156 110 154" stroke="#8A9290" strokeWidth="0.5" opacity="0.6" />

          {/* Leaf 5 (Mid Left) */}
          <path
            d="M 46 182 C 20 172 6 186 2 206 C 0 220 16 230 34 226 C 50 222 56 202 46 182 Z"
            fill="url(#leafGrad1)"
          />
          <path d="M 46 182 Q 18 206 2 206" stroke="#7A8280" strokeWidth="0.5" opacity="0.6" />

          {/* Leaf 6 (Lower Right) */}
          <path
            d="M 38 230 C 62 222 84 236 90 256 C 94 270 82 284 62 282 C 44 280 34 258 38 230 Z"
            fill="url(#leafGrad2)"
          />
          <path d="M 38 230 Q 68 256 90 256" stroke="#8A9290" strokeWidth="0.5" opacity="0.6" />

          {/* Leaf 7 (Lower Left) */}
          <path
            d="M 28 280 C 8 274 -2 290 -4 308 C -6 322 8 332 24 326 C 38 320 40 300 28 280 Z"
            fill="url(#leafGrad1)"
          />
        </svg>
      </div>

      {/* 4. Left Edge: Vertical Kanji Stamp (小樽) Matching Reference Image (Desktop Only to prevent mobile overlap) */}
      <div className="hidden lg:flex absolute left-6 xl:left-10 top-[47%] -translate-y-1/2 flex-col items-center gap-3 pointer-events-none z-0 opacity-75">
        <div className="w-[1px] h-10 bg-[rgba(222,210,188,0.25)]" />
        <div
          className="flex flex-col items-center text-[#C7B9A0] select-none font-serif text-[11px] sm:text-xs tracking-[0.25em] leading-[1.6]"
          style={{ fontFamily: "'Fraunces', 'Shippori Mincho', serif" }}
        >
          <span>小</span>
          <span>樽</span>
        </div>
        <div className="w-[1px] h-10 bg-[rgba(222,210,188,0.25)]" />
      </div>

      {/* 5. Right Edge: Dark Craggy Volcanic/Mineral Rock Texture */}
      <div className="absolute right-0 top-0 bottom-0 w-36 sm:w-56 lg:w-80 pointer-events-none opacity-80 lg:opacity-95 overflow-hidden">
        <svg
          viewBox="0 0 320 720"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMaxYMid slice"
          fill="none"
        >
          <defs>
            <linearGradient id="rockBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B0F0F" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#151A1A" stopOpacity="0.9" />
              <stop offset="80%" stopColor="#0D1111" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#060808" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="rockHighlight" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#3E4442" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#252A2A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#101414" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="rockCragShadow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#040606" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#080B0B" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Master Rock Silhouette Flank */}
          <path
            d="M 160 0 
               L 135 60 
               L 185 110 
               L 120 180 
               L 155 240 
               L 100 320 
               L 145 390 
               L 85 470 
               L 130 550 
               L 70 630 
               L 110 720 
               L 320 720 
               L 320 0 Z"
            fill="url(#rockBaseGrad)"
          />

          {/* Facet 1 (Upper Angular Crag) */}
          <polygon
            points="160,0 135,60 185,110 240,40"
            fill="url(#rockHighlight)"
          />
          <polygon
            points="135,60 185,110 160,150 120,180"
            fill="url(#rockCragShadow)"
          />

          {/* Facet 2 (Mid-Upper Sharp Shelf) */}
          <polygon
            points="120,180 155,240 220,210 185,110"
            fill="url(#rockHighlight)"
          />
          <polygon
            points="155,240 100,320 180,300 220,210"
            fill="url(#rockCragShadow)"
          />

          {/* Facet 3 (Center Jutting Ridge) */}
          <polygon
            points="100,320 145,390 230,360 180,300"
            fill="url(#rockHighlight)"
          />
          <polygon
            points="145,390 85,470 170,460 230,360"
            fill="url(#rockCragShadow)"
          />

          {/* Facet 4 (Mid-Lower Escarpment) */}
          <polygon
            points="85,470 130,550 210,520 170,460"
            fill="url(#rockHighlight)"
          />
          <polygon
            points="130,550 70,630 160,610 210,520"
            fill="url(#rockCragShadow)"
          />

          {/* Facet 5 (Base Shelf) */}
          <polygon
            points="70,630 110,720 220,720 160,610"
            fill="url(#rockHighlight)"
          />

          {/* Fine Mineral Fracture Lines */}
          <path
            d="M 135 60 L 210 90 M 185 110 L 260 160 M 155 240 L 240 270 M 100 320 L 190 350 M 145 390 L 220 420 M 85 470 L 180 500 M 130 550 L 230 580"
            stroke="rgba(242, 232, 214, 0.12)"
            strokeWidth="0.75"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 6. Bottom-Left Corner: Grounded Natural Stone Crag */}
      <div className="absolute left-0 bottom-0 w-32 sm:w-48 lg:w-64 h-24 sm:h-36 lg:h-48 pointer-events-none opacity-70 lg:opacity-85">
        <svg viewBox="0 0 240 160" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="bottomRockGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#080B0B" />
              <stop offset="50%" stopColor="#141818" />
              <stop offset="100%" stopColor="#222828" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path
            d="M 0 160 L 0 70 L 45 45 L 90 85 L 145 40 L 195 100 L 240 160 Z"
            fill="url(#bottomRockGrad)"
          />
          <polygon points="0,70 45,45 90,85 40,110" fill="rgba(60,68,66,0.35)" />
          <polygon points="45,45 145,40 195,100 90,85" fill="rgba(30,36,36,0.6)" />
          <path
            d="M 45 45 L 90 85 M 90 85 L 145 40 M 145 40 L 195 100"
            stroke="rgba(242, 232, 214, 0.14)"
            strokeWidth="0.8"
          />
        </svg>
      </div>
    </div>
  );
}
