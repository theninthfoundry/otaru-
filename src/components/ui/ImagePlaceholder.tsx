'use client';

import React from 'react';
import Image from 'next/image';
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
          <Image
            src={src}
            alt={alt || label || 'Otaru Artifact'}
            fill
            unoptimized
            style={{
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

  const l = label.toLowerCase();

  // Swatch-specific handling
  if (ratio === 'swatch' || l.includes('swatch')) {
    if (l.includes('indigo') || l.includes('twill') || l.includes('tokushima')) {
      artSrc = '/api/art/cherry-blossom';
      tagText = 'TOKUSHIMA · INDIGO SUKUMO';
      sealText = '藍';
    } else if (l.includes('hemp') || l.includes('canvas') || l.includes('ōmi') || l.includes('omi')) {
      artSrc = '/api/art/poppies';
      tagText = 'ŌMI · RAW HEMP CANVAS';
      sealText = '麻';
    } else if (l.includes('wool') || l.includes('biratori')) {
      artSrc = '/api/art/great-wave';
      tagText = 'BIRATORI · BOILED WOOL';
      sealText = '羊';
    } else if (l.includes('silk') || l.includes('kiryū') || l.includes('kiryu')) {
      artSrc = '/api/art/cherry-blossom';
      tagText = 'KIRYŪ · WASHED SILK';
      sealText = '絹';
    } else {
      tagText = label.toUpperCase();
      sealText = '布';
    }
  }
  // Journal & Field Notes handling
  else if (l.includes('field notes') || l.includes('journal') || l.includes('notes')) {
    if (label.includes('/ 01') || l.includes('indigo')) {
      artSrc = '/api/art/cherry-blossom';
      tagText = 'FIELD NOTES 01 · INDIGO VAT CYCLE';
      sealText = '誌';
    } else if (label.includes('/ 02') || l.includes('loom') || l.includes('weaving')) {
      artSrc = '/api/art/great-wave';
      tagText = 'FIELD NOTES 02 · 1968 SHUTTLE LOOM';
      sealText = '織';
    } else if (label.includes('/ 03') || l.includes('repair') || l.includes('boro')) {
      artSrc = '/api/art/poppies';
      tagText = 'FIELD NOTES 03 · KANTHA & BORO REPAIR';
      sealText = '補';
    } else {
      artSrc = '/api/art/cherry-blossom';
      tagText = 'STUDIO FIELD NOTE · ATELIER STUDY';
      sealText = '誌';
    }
  }
  // Chapter-specific handling
  else if (label.includes('Chapter II') || l.includes('otaru harbor') || l.includes('harbor')) {
    artSrc = '/api/art/great-wave';
    tagText = 'CHAPTER II · OTARU HARBOR';
    sealText = '樽';
  } else if (label.includes('Chapter III') || l.includes('quiet interior') || l.includes('quiet')) {
    artSrc = '/api/art/poppies';
    tagText = 'CHAPTER III · QUIET INTERIOR';
    sealText = '室';
  } else if (label.includes('Chapter I') || l.includes('kyoto nights')) {
    artSrc = '/api/art/cherry-blossom';
    tagText = 'CHAPTER I · KYOTO NIGHTS';
    sealText = '京';
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
        <Image
          src={artSrc}
          alt={label || 'Otaru Archival Artwork'}
          fill
          unoptimized
          style={{
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
