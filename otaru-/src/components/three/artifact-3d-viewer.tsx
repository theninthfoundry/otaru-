'use client';

import React, { useState } from 'react';
import { CanvasWrapper } from './canvas-wrapper';
import { FabricSphere } from './fabric-sphere';
import { Particles } from './particles';

interface Artifact3DViewerProps {
  title?: string;
  className?: string;
}

/**
 * Artifact3DViewer — Interactive 3D garment inspection viewer component for Artifact pages.
 * Desktop WebGL canvas with dynamic mode toggles and graceful mobile fallback.
 */
export function Artifact3DViewer({ title = 'Artifact Material Specimen', className = 'h-[420px]' }: Artifact3DViewerProps) {
  const [isWireframe, setIsWireframe] = useState(false);

  return (
    <div className={`relative rounded-sm border border-otaru-border/50 bg-otaru-chalk-warm/40 overflow-hidden ${className}`}>
      {/* 3D WebGL Scene */}
      <CanvasWrapper
        className="w-full h-full"
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-otaru-ink-subtle">
            <span className="text-overline uppercase text-[10px] tracking-widest font-semibold mb-2">
              Tactile Material Preview
            </span>
            <p className="text-body-sm font-light">
              High-density Japanese raw selvage denim spec &mdash; 14.5oz architectural weave.
            </p>
          </div>
        }
      >
        <FabricSphere wireframe={isWireframe} color="#1c1b18" />
        <Particles count={150} />
      </CanvasWrapper>

      {/* Floating Control Overlay */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsWireframe(!isWireframe)}
          className="px-3 py-1.5 bg-otaru-ink/80 backdrop-blur-md text-otaru-chalk text-[11px] uppercase tracking-wider font-mono rounded-full hover:bg-otaru-ink transition-colors"
          aria-label="Toggle Wireframe Shading"
        >
          {isWireframe ? 'Shaded View' : 'Weave Structure'}
        </button>
      </div>

      <div className="absolute top-4 left-4 z-10 text-caption text-otaru-ink-subtle text-[11px] font-mono tracking-widest uppercase">
        {title} &bull; 3D Material Matrix
      </div>
    </div>
  );
}
