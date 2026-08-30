'use client';

import React from 'react';
import clsx from 'clsx';
import { DesignedArtifactGraphic } from './DesignedArtifactGraphic';

export type AspectRatio = 'portrait' | 'square' | 'wide' | 'tall' | 'swatch';

interface ImagePlaceholderProps {
  label?: string;
  ratio?: AspectRatio;
  src?: string;
  secondarySrc?: string;
  alt?: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  enableHoverSwap?: boolean;
}

const RATIO_CLASSES: Record<AspectRatio, string> = {
  portrait: 'r-portrait', // 4/5
  square: 'r-square',     // 1/1
  wide: 'r-wide',         // 16/9
  tall: 'r-tall',         // 3/4
  swatch: 'r-swatch',     // 1/1 with 2px radius
};

export function ImagePlaceholder({
  label = '',
  ratio = 'portrait',
  src,
  alt = '',
  className = '',
  children,
  style,
}: ImagePlaceholderProps) {
  // 1. If explicit real image provided
  if (src) {
    return (
      <div
        className={clsx('otaru-img-container watoji-frame group', RATIO_CLASSES[ratio], className)}
        style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'var(--otaru-dusk)',
          ...style,
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', border: '1px dashed rgba(217,189,131,0.35)', borderRadius: '2px' }}>
          <img
            src={src}
            alt={alt || label || 'Otaru Artifact'}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          {/* Vermilion Atelier Seal */}
          <div className="hanko-stamp">小樽</div>
        </div>
        {children}
      </div>
    );
  }

  // 2. If it's a product or designed artifact slot
  const isProduct = Boolean(label.match(/\b(0\d{2})\b/)) || ratio === 'portrait';

  if (isProduct) {
    return (
      <div
        className={clsx('ph designed-ph watoji-frame', RATIO_CLASSES[ratio], className)}
        style={{
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%', border: '1px dashed rgba(217,189,131,0.3)', borderRadius: '2px', overflow: 'hidden' }}>
          <DesignedArtifactGraphic label={label} ratio={ratio} />
          {children}
        </div>
      </div>
    );
  }

  // 3. Editorial & Chapter Woodblock Artwork Mounts
  let artSrc = '/api/art/cherry-blossom';
  let tagText = 'KYOTO NIGHTS · SUKUMO 14x';
  let sealText = '京';

  if (label.includes('Chapter II') || label.includes('Otaru Harbor') || label.includes('Harbor')) {
    artSrc = '/api/art/great-wave';
    tagText = 'OTARU HARBOR · CANVAS 18oz';
    sealText = '樽';
  } else if (label.includes('Chapter III') || label.includes('Quiet') || label.includes('Journal') || label.includes('Studio')) {
    artSrc = '/api/art/poppies';
    tagText = 'QUIET INTERIOR · WASHED SILK';
    sealText = '室';
  }

  return (
    <div
      className={clsx('watoji-frame group', RATIO_CLASSES[ratio], className)}
      data-label={label}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Inner Sashiko Dashed Mat Mount */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          border: '1px dashed rgba(217, 189, 131, 0.45)',
          borderRadius: '2px',
          backgroundColor: 'var(--otaru-ink)',
        }}
      >
        <img
          src={artSrc}
          alt={label || 'Otaru Archival Artwork'}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'contrast(1.08) saturate(0.95)',
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="group-hover:scale-105"
        />

        {/* Floating Textile Thread Tag */}
        <div className="thread-tag">
          {tagText}
        </div>

        {/* Vermilion Hankō Atelier Seal */}
        <div className="hanko-stamp" title="Otaru Woodblock Seal">
          {sealText}
        </div>

        {children}
      </div>
    </div>
  );
}
