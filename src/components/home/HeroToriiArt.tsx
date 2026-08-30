'use client';

import React from 'react';

export function HeroToriiArt() {
  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Sky Gradient */}
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#14283b" />
          <stop offset="45%" stopColor="#1e3a54" />
          <stop offset="70%" stopColor="#435552" />
          <stop offset="100%" stopColor="#253538" />
        </linearGradient>

        {/* Golden Moon Glow */}
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fae7b9" stopOpacity="1" />
          <stop offset="60%" stopColor="#e5be79" stopOpacity="0.9" />
          <stop offset="85%" stopColor="#caa460" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#caa460" stopOpacity="0" />
        </radialGradient>

        {/* Torii Wood Gradient */}
        <linearGradient id="toriiRed" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6e2518" />
          <stop offset="35%" stopColor="#aa3b26" />
          <stop offset="70%" stopColor="#bd4830" />
          <stop offset="100%" stopColor="#541b12" />
        </linearGradient>

        {/* Mountain Gradients */}
        <linearGradient id="mountSnow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f4efe2" />
          <stop offset="60%" stopColor="#c5d3df" />
          <stop offset="100%" stopColor="#637c8e" />
        </linearGradient>

        <linearGradient id="mountBase" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2e4757" />
          <stop offset="50%" stopColor="#1c303f" />
          <stop offset="100%" stopColor="#0e1b24" />
        </linearGradient>

        {/* Water Surface Gradient */}
        <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#182730" />
          <stop offset="35%" stopColor="#0f1a22" />
          <stop offset="100%" stopColor="#080e14" />
        </linearGradient>
      </defs>

      {/* Sky Base */}
      <rect width="1600" height="900" fill="url(#skyGrad)" />

      {/* Textured Woodblock Sky Bands */}
      <path d="M 0,120 Q 400,100 800,140 T 1600,110 L 1600,0 L 0,0 Z" fill="rgba(10, 20, 32, 0.45)" />
      <path d="M 0,220 Q 500,180 1100,240 T 1600,200 L 1600,0 L 0,0 Z" fill="rgba(10, 20, 32, 0.25)" />

      {/* Giant Luminous Golden Full Moon */}
      <circle cx="1200" cy="200" r="160" fill="url(#moonGlow)" />
      <circle cx="1200" cy="200" r="148" fill="#ecd499" opacity="0.9" />

      {/* Wispy Cloud Bands Passing Across Moon */}
      <path
        d="M 980,180 C 1040,165 1180,160 1260,180 C 1320,195 1400,175 1440,180 C 1410,195 1330,205 1250,195 C 1170,185 1060,200 980,180 Z"
        fill="rgba(244, 239, 226, 0.55)"
      />
      <path
        d="M 1060,240 C 1120,230 1220,225 1320,245 C 1370,255 1460,240 1490,245 C 1450,260 1360,265 1280,255 C 1200,245 1110,260 1060,240 Z"
        fill="rgba(244, 239, 226, 0.45)"
      />

      {/* Mount Fuji Silhouette & Snow Cap */}
      {/* Mountain Base */}
      <path
        d="M 620,680 L 1050,390 C 1080,370 1110,370 1140,390 L 1580,680 L 1600,740 L 580,740 Z"
        fill="url(#mountBase)"
      />
      {/* Mountain Ridge Shading */}
      <path
        d="M 1095,372 L 1080,480 L 1150,560 L 1120,680 L 1580,680 L 1140,390 Z"
        fill="rgba(10, 20, 32, 0.4)"
      />
      {/* Snow Peaks */}
      <path
        d="M 1050,390 C 1080,370 1110,370 1140,390 L 1220,470 L 1180,480 L 1200,530 L 1150,520 L 1130,560 L 1080,480 L 1050,530 L 1020,470 L 980,500 Z"
        fill="url(#mountSnow)"
      />

      {/* Distant Pine Forests & Hills */}
      <path
        d="M 500,700 Q 800,650 1200,690 T 1600,670 L 1600,740 L 500,740 Z"
        fill="#0b1720"
      />
      <path
        d="M 800,710 Q 1100,680 1450,710 T 1600,700 L 1600,740 L 800,740 Z"
        fill="#071017"
      />

      {/* Flocks of Flying Red-Crowned Cranes */}
      <g fill="#f4efe2" stroke="#0b1420" strokeWidth="0.5">
        {/* Crane 1 */}
        <path d="M 760,250 Q 775,230 795,245 Q 810,225 830,248 Q 800,255 760,250 Z" />
        <circle cx="832" cy="247" r="1.5" fill="#a8462f" />
        {/* Crane 2 */}
        <path d="M 850,290 Q 865,270 885,285 Q 900,265 920,288 Q 890,295 850,290 Z" />
        <circle cx="922" cy="287" r="1.5" fill="#a8462f" />
        {/* Crane 3 */}
        <path d="M 940,340 Q 955,320 975,335 Q 990,315 1010,338 Q 980,345 940,340 Z" />
        {/* Crane 4 */}
        <path d="M 1030,370 Q 1045,350 1065,365 Q 1080,345 1100,368 Q 1070,375 1030,370 Z" />
        {/* Crane 5 */}
        <path d="M 1120,400 Q 1135,380 1155,395 Q 1170,375 1190,398 Q 1160,405 1120,400 Z" />
        {/* Crane 6 */}
        <path d="M 1210,425 Q 1225,405 1245,420 Q 1260,400 1280,423 Q 1250,430 1210,425 Z" />
        {/* Crane 7 */}
        <path d="M 1300,445 Q 1315,425 1335,440 Q 1350,420 1370,443 Q 1340,450 1300,445 Z" />
      </g>

      {/* Water Surface at Bottom */}
      <rect x="0" y="710" width="1600" height="190" fill="url(#waterGrad)" />
      {/* Water Reflection Ripples */}
      <line x1="1100" y1="730" x2="1300" y2="730" stroke="rgba(217,189,131,0.25)" strokeWidth="2" strokeDasharray="30,15,50,20" />
      <line x1="1050" y1="755" x2="1350" y2="755" stroke="rgba(217,189,131,0.2)" strokeWidth="1.5" strokeDasharray="40,25,60,15" />
      <line x1="980" y1="785" x2="1400" y2="785" stroke="rgba(217,189,131,0.15)" strokeWidth="1.5" strokeDasharray="20,20,80,25" />
      <line x1="900" y1="820" x2="1480" y2="820" stroke="rgba(217,189,131,0.1)" strokeWidth="2" strokeDasharray="50,40,90,30" />

      {/* Iconic Floating Vermilion Torii Gate */}
      <g id="toriiGate">
        {/* Main Curved Top Beam (Kasagi) */}
        <path
          d="M 60,240 C 220,215 480,215 640,240 L 635,280 C 480,260 220,260 65,280 Z"
          fill="url(#toriiRed)"
        />
        {/* Kasagi Black Top Trim */}
        <path
          d="M 50,230 C 220,205 480,205 650,230 L 640,248 C 480,222 220,222 60,248 Z"
          fill="#111820"
        />

        {/* Second Horizontal Tie Beam (Nuki) */}
        <rect x="110" y="320" width="480" height="34" rx="2" fill="url(#toriiRed)" />
        <rect x="90" y="320" width="20" height="34" fill="#111820" />
        <rect x="590" y="320" width="20" height="34" fill="#111820" />

        {/* Vertical Center Tablet (Gakuzuka) */}
        <rect x="335" y="260" width="30" height="60" fill="#111820" />

        {/* Left Pillar (Hashira) */}
        <polygon points="180,270 230,270 245,860 165,860" fill="url(#toriiRed)" />
        {/* Right Pillar (Hashira) */}
        <polygon points="470,270 520,270 535,860 455,860" fill="url(#toriiRed)" />

        {/* Support Wedges and Sub-Pillars (Ryobu Torii Style) */}
        {/* Left Front Sub-pillar */}
        <polygon points="135,580 165,580 175,860 125,860" fill="url(#toriiRed)" />
        <rect x="120" y="560" width="55" height="20" fill="#111820" />
        <rect x="125" y="650" width="85" height="18" fill="url(#toriiRed)" />

        {/* Left Back Sub-pillar */}
        <polygon points="235,580 265,580 275,860 225,860" fill="url(#toriiRed)" />
        <rect x="220" y="560" width="55" height="20" fill="#111820" />
        <rect x="195" y="650" width="85" height="18" fill="url(#toriiRed)" />

        {/* Right Front Sub-pillar */}
        <polygon points="425,580 455,580 465,860 415,860" fill="url(#toriiRed)" />
        <rect x="410" y="560" width="55" height="20" fill="#111820" />
        <rect x="415" y="650" width="85" height="18" fill="url(#toriiRed)" />

        {/* Right Back Sub-pillar */}
        <polygon points="525,580 555,580 565,860 515,860" fill="url(#toriiRed)" />
        <rect x="510" y="560" width="55" height="20" fill="#111820" />
        <rect x="485" y="650" width="85" height="18" fill="url(#toriiRed)" />

        {/* Sub-Pillar Rooflets (Black Caps) */}
        <polygon points="110,560 180,560 170,545 120,545" fill="#111820" />
        <polygon points="210,560 280,560 270,545 220,545" fill="#111820" />
        <polygon points="400,560 470,560 460,545 410,545" fill="#111820" />
        <polygon points="500,560 570,560 560,545 510,545" fill="#111820" />

        {/* Torii Pillar Water Reflections */}
        <rect x="170" y="860" width="70" height="40" fill="#3b110b" opacity="0.6" />
        <rect x="460" y="860" width="70" height="40" fill="#3b110b" opacity="0.6" />
      </g>
    </svg>
  );
}
