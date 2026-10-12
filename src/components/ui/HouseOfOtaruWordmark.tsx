'use client';

import React from 'react';

interface WordmarkProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
  inlineColor?: string;
}

/**
 * HouseOfOtaruWordmark
 * 
 * Master Art-Directed Calligraphic Wordmark: "House of Otaru™"
 * Meticulously crafted to match the reference image's luxury editorial signature:
 * - Wide, flowing Italian / French roundhand copperplate script.
 * - Grand Master Capital 'H' with sweeping entry loop and engraved inline double strokes.
 * - Connected cursive 'ouse' with generous, open counters and rhythmic calligraphic weight.
 * - Distinct, elegant 'of' with long descending loop.
 * - Grand Master Capital 'O' with inline engraved channel and classic inward flourish swirl.
 * - Cursive 'taru' with horizontal crossbar and sweeping rightward exit flourish.
 * - Archival serif trademark superscript '™'.
 */
export function HouseOfOtaruWordmark({
  className = '',
  width = '100%',
  height = 'auto',
  color = '#F2E8D6',
  inlineColor = 'rgba(242, 232, 214, 0.6)',
}: WordmarkProps) {
  return (
    <svg
      viewBox="0 0 910 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width, height, display: 'block', maxWidth: '100%' }}
      role="img"
      aria-label="House of Otaru"
    >
      <title>House of Otaru</title>
      <defs>
        <filter id="wordmarkShadow" x="-5%" y="-10%" width="110%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.8" floodColor="#000000" floodOpacity="0.55" />
        </filter>
        <linearGradient id="ivoryShading" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FAF6EE" />
          <stop offset="60%" stopColor="#F2E8D6" />
          <stop offset="100%" stopColor="#DFD0B8" />
        </linearGradient>
      </defs>

      <g filter="url(#wordmarkShadow)">
        {/* ========================================================
            01. CAPITAL 'H' (House)
            ======================================================== */}
        {/* Entrance Flourish Swirl (Top-Left) */}
        <path
          d="M 32 82 C 18 80 12 68 18 52 C 24 34 44 20 68 17 C 82 15 94 21 96 32 C 97 42 88 50 77 51 C 65 52 57 44 58 36 C 59 29 65 26 71 27 C 76 28 77 32 75 35"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* H - Left Main Column (Solid Calligraphic Shaded Swell) */}
        <path
          d="M 82 20 C 79 36 69 68 59 96 C 54 107 48 114 40 114 C 32 114 28 106 32 96 C 37 84 48 77 59 72 L 62 75 C 51 81 41 89 38 98 C 35 104 38 109 43 109 C 49 109 56 102 61 92 C 71 67 81 37 85 20 Z"
          fill="url(#ivoryShading)"
        />
        {/* H - Left Column Outer Hairline */}
        <path
          d="M 84 19 C 81 36 71 69 61 97 C 56 108 50 115 41 115 C 33 115 29 106 33 96 C 38 84 49 77 60 72"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* H - Left Column Engraved Inline Highlight Channel */}
        <path
          d="M 78 28 C 73 48 64 76 56 97"
          stroke={inlineColor}
          strokeWidth="1.1"
          strokeLinecap="round"
        />

        {/* H - Central Crossbar Flowing Inward and Across */}
        <path
          d="M 52 74 C 64 70 78 66 95 60 C 110 54 122 47 119 36 C 116 26 102 28 94 38 C 85 49 88 67 101 73 C 113 77 126 69 134 59"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* H - Right Main Column (Solid Calligraphic Shaded Swell) */}
        <path
          d="M 128 24 C 123 44 116 76 110 98 C 106 112 110 117 118 116 C 126 114 134 105 142 93 L 145 96 C 136 110 126 120 116 121 C 105 122 101 113 105 97 C 111 75 119 43 124 23 Z"
          fill="url(#ivoryShading)"
        />
        {/* H - Right Column Outer Hairline */}
        <path
          d="M 128 24 C 123 44 116 76 110 98 C 106 112 110 117 118 116 C 127 114 135 104 143 92"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* H - Right Column Engraved Inline Highlight Channel */}
        <path
          d="M 124 32 C 119 52 113 81 109 98"
          stroke={inlineColor}
          strokeWidth="1.1"
          strokeLinecap="round"
        />

        {/* ========================================================
            02. LOWERCASE 'ouse'
            ======================================================== */}
        {/* Connective Lead-in from H to 'o' */}
        <path
          d="M 142 93 C 151 81 160 69 171 67"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* 'o' - Full Elegant Bowl with Left Shading */}
        <path
          d="M 184 68 C 171 68 162 80 162 93 C 162 106 172 115 184 115 C 196 115 205 104 205 91 C 205 77 196 68 184 68 Z"
          stroke={color}
          strokeWidth="1.6"
        />
        <path
          d="M 178 70 C 169 79 166 90 167 100 C 170 106 174 111 180 112 C 174 110 170 103 170 93 C 170 83 175 75 178 70 Z"
          fill="url(#ivoryShading)"
        />
        {/* 'o' to 'u' connective tie */}
        <path
          d="M 186 70 C 198 69 203 75 207 79 C 211 83 216 77 221 70"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* 'u' - Downstroke 1, Rounded Base, Downstroke 2 */}
        <path
          d="M 221 70 L 214 97 C 212 107 218 114 227 114 C 237 114 246 105 251 92 L 256 73 L 250 99 C 248 108 253 114 262 114 C 269 114 276 107 282 97"
          stroke={color}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 222 72 C 220 83 216 95 216 103 C 218 103 221 95 224 84 Z"
          fill="url(#ivoryShading)"
        />
        <path
          d="M 256 75 C 255 86 251 98 251 105 C 253 105 256 97 258 87 Z"
          fill="url(#ivoryShading)"
        />

        {/* 's' - Calligraphic S with Head Swell and Belly */}
        <path
          d="M 282 97 C 289 86 298 74 306 68 C 311 64 315 67 314 72 C 310 80 301 91 300 100 C 298 108 304 114 313 114 C 322 114 329 105 333 97"
          stroke={color}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 310 79 C 304 88 300 98 301 106 C 305 108 308 107 312 101 C 307 101 304 96 305 90 C 306 85 310 81 310 79 Z"
          fill="url(#ivoryShading)"
        />

        {/* 'e' - Looped Copperplate Exit */}
        <path
          d="M 333 97 C 338 88 344 79 352 72 C 358 66 363 68 361 74 C 360 83 347 96 341 104 C 338 108 341 114 348 114 C 358 114 367 105 373 95"
          stroke={color}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ========================================================
            03. WORD 'of'
            ======================================================== */}
        {/* 'o' in 'of' */}
        <path
          d="M 402 78 C 392 78 384 88 384 99 C 384 109 393 116 404 116 C 415 116 423 107 423 96 C 423 85 415 78 402 78 Z"
          stroke={color}
          strokeWidth="1.6"
        />
        <path
          d="M 397 80 C 389 88 387 96 388 105 C 392 109 396 111 400 111 C 395 108 392 102 393 96 C 394 89 397 83 397 80 Z"
          fill="url(#ivoryShading)"
        />
        {/* Connective Tie to 'f' */}
        <path
          d="M 406 80 C 415 79 421 84 426 84 C 431 84 437 76 442 63"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* 'f' - Tall Flourished Ascender Loop and Long Deep Descender */}
        <path
          d="M 442 63 C 448 45 456 26 467 23 C 474 21 478 27 474 37 C 469 52 459 74 450 98 C 440 126 430 148 423 149 C 418 149 415 143 418 133 C 423 118 435 95 450 81"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 'f' Shaded Stem Body */}
        <path
          d="M 471 36 C 466 50 458 73 450 97 C 442 121 434 139 427 144 C 431 138 437 120 443 98 C 450 76 459 54 466 39 Z"
          fill="url(#ivoryShading)"
        />
        {/* 'f' Waist Cross Knot and Graceful Reach to 'O' */}
        <path
          d="M 443 86 C 453 84 463 83 473 88 C 479 90 486 85 495 75"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* ========================================================
            04. CAPITAL 'O' (Otaru)
            Grand Stately Copperplate Oval with Inline Channel
            and Inner Looping Flourish
            ======================================================== */}
        {/* O - Main Outer Contour */}
        <path
          d="M 560 16 C 524 16 500 44 500 78 C 500 110 524 126 558 126 C 594 126 618 97 618 64 C 618 30 594 16 560 16 Z"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* O - Left Shaded Swell Body */}
        <path
          d="M 552 18 C 521 26 507 52 507 80 C 507 105 522 120 547 124 C 530 120 516 106 516 80 C 516 55 530 30 552 18 Z"
          fill="url(#ivoryShading)"
        />

        {/* O - Engraved Inline Highlight Channel */}
        <path
          d="M 541 28 C 522 42 512 62 512 81 C 512 100 523 114 539 119"
          stroke={inlineColor}
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* O - Master Inner Flourish Loop Swirling Downward */}
        <path
          d="M 560 18 C 585 18 602 31 602 52 C 602 71 588 83 574 84 C 559 85 550 76 551 65 C 552 54 564 47 575 50 C 582 52 585 58 584 65 C 581 72 573 78 565 78"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* O - Exit Swirl Reaching toward 't' */}
        <path
          d="M 608 83 C 619 80 627 85 635 85 C 641 85 647 77 652 64"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* ========================================================
            05. LOWERCASE 'taru'
            ======================================================== */}
        {/* 't' - Ascender, Foot, and Horizontal Crossbar */}
        <path
          d="M 660 42 L 652 98 C 651 108 657 114 666 114 C 674 114 682 106 689 95"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 660 49 C 657 66 653 83 653 95 C 656 95 659 87 662 71 Z"
          fill="url(#ivoryShading)"
        />
        {/* 't' Horizontal Crossbar */}
        <path
          d="M 642 66 L 678 61"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* 'a' - Round Bowl and Downstroke */}
        <path
          d="M 704 80 C 693 80 686 89 686 98 C 686 108 693 114 703 114 C 711 114 718 107 722 97 L 718 111 C 718 114 722 115 727 113 C 733 108 740 100 745 90"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 698 82 C 690 90 689 97 691 103 C 695 107 697 107 701 107 C 696 104 693 99 695 93 C 696 87 698 83 698 82 Z"
          fill="url(#ivoryShading)"
        />

        {/* 'r' - High Shoulder, Dip, and Foot */}
        <path
          d="M 745 90 C 750 80 755 71 761 69 C 766 68 768 70 768 75 C 768 81 761 88 761 98 C 760 106 765 113 772 113 C 778 113 784 106 789 97"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 'u' - Downstroke 1, Bowl, Downstroke 2, and Sweeping Exit Flourish */}
        <path
          d="M 789 97 C 794 87 799 78 803 72 L 796 98 C 795 108 801 114 810 114 C 818 114 827 106 832 94 L 834 77 L 830 100 C 829 110 835 116 844 114 C 854 113 864 105 874 94 C 880 88 887 86 892 88"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ========================================================
            06. TRADEMARK '™' (Superscript)
            ======================================================== */}
        <g transform="translate(840, 42)">
          <text
            x="0"
            y="0"
            fill={color}
            fontFamily="'Fraunces', Georgia, serif"
            fontSize="13"
            fontWeight="400"
            letterSpacing="0.8"
            opacity="0.88"
          >
            ™
          </text>
        </g>
      </g>
    </svg>
  );
}
