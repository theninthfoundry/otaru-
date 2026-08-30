'use client';

import React from 'react';

interface ArtBackgroundPlateProps {
  artName: 'great-wave' | 'cherry-blossom' | 'poppies';
  opacity?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center' | 'center-right' | 'center-left' | 'full';
  maxWidth?: string;
  maxHeight?: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * ArtBackgroundPlate
 * Renders authentic Japanese woodblock artwork as a large, minimal, atmospheric background plate
 * with soft radial mask feathering so the foreground UI stays prominent and readable.
 */
export function ArtBackgroundPlate({
  artName,
  opacity = 0.18,
  position = 'top-right',
  maxWidth = '780px',
  maxHeight = '580px',
  style: customStyle,
  className = '',
}: ArtBackgroundPlateProps) {
  let positionStyles: React.CSSProperties = {};

  switch (position) {
    case 'top-right':
      positionStyles = { top: '-8%', right: '-4%' };
      break;
    case 'top-left':
      positionStyles = { top: '-8%', left: '-4%' };
      break;
    case 'bottom-right':
      positionStyles = { bottom: '-8%', right: '-4%' };
      break;
    case 'bottom-left':
      positionStyles = { bottom: '-8%', left: '-4%' };
      break;
    case 'center':
      positionStyles = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      break;
    case 'center-right':
      positionStyles = { top: '50%', right: '-5%', transform: 'translateY(-50%)' };
      break;
    case 'center-left':
      positionStyles = { top: '50%', left: '-5%', transform: 'translateY(-50%)' };
      break;
    case 'full':
      positionStyles = { inset: 0, width: '100%', height: '100%' };
      break;
  }

  return (
    <div
      aria-hidden="true"
      className={`art-bg-plate ${className}`}
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: 0,
        opacity,
        overflow: 'hidden',
        userSelect: 'none',
        ...positionStyles,
        ...customStyle,
      }}
    >
      <div
        style={{
          width: maxWidth,
          height: maxHeight,
          maxWidth: '95vw',
          maxHeight: '90vh',
          position: 'relative',
          borderRadius: '4px',
          overflow: 'hidden',
          // Feathered radial mask allowing large, gorgeous artwork visibility with soft background fading
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0.65) 70%, transparent 92%)',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0.65) 70%, transparent 92%)',
        }}
      >
        <img
          src={`/api/art/${artName}`}
          alt=""
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'contrast(1.12) saturate(0.95) brightness(0.9)',
          }}
        />
      </div>
    </div>
  );
}
