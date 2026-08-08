'use client';

import React, { useState, useEffect } from 'react';
import { CanvasWrapper } from './canvas-wrapper';
import { FabricSphere } from './fabric-sphere';
import { Particles } from './particles';

interface Artifact3DViewerProps {
  title?: string;
  className?: string;
  tags?: string[];
}

type FabricType = 'denim' | 'wool' | 'cotton';

const FABRIC_PRESETS: Record<FabricType, { color: string; label: string }> = {
  denim: { color: '#1f2e4d', label: '14.5oz Denim Twill' },
  wool: { color: '#555450', label: 'Melton Virgin Wool' },
  cotton: { color: '#1c1b18', label: 'French Terry Cotton' },
};

export function Artifact3DViewer({
  title = 'Artifact Material Specimen',
  className = 'h-[420px]',
  tags = [],
}: Artifact3DViewerProps) {
  const [isWireframe, setIsWireframe] = useState(false);
  const [fabricType, setFabricType] = useState<FabricType>('denim');

  useEffect(() => {
    const tagList = tags.map((t) => t.toLowerCase());
    if (tagList.includes('wool')) {
      setFabricType('wool');
    } else if (tagList.includes('denim')) {
      setFabricType('denim');
    } else if (
      tagList.includes('cotton') ||
      tagList.includes('french terry') ||
      tagList.includes('hoodie')
    ) {
      setFabricType('cotton');
    }
  }, [tags]);

  const activePreset = FABRIC_PRESETS[fabricType];

  return (
    <div
      className={`relative rounded-sm border border-otaru-border/50 bg-otaru-chalk-warm/40 overflow-hidden ${className}`}
      data-cursor="view"
      data-cursor-label="Tactile"
    >
      <CanvasWrapper
        className="w-full h-full"
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-otaru-ink-subtle">
            <span className="text-overline uppercase text-[10px] tracking-widest font-semibold mb-2">
              Tactile Material Preview
            </span>
            <p className="text-body-sm font-light">
              High-density fabric specimen &mdash; custom weaves built with permanent intention.
            </p>
          </div>
        }
      >
        <FabricSphere
          wireframe={isWireframe}
          color={activePreset.color}
          fabricType={fabricType}
        />
        <Particles count={120} />
      </CanvasWrapper>

      <div className="absolute bottom-4 left-4 z-10 flex flex-wrap items-center gap-1.5">
        {(Object.keys(FABRIC_PRESETS) as FabricType[]).map((type) => (
          <button
            key={type}
            onClick={() => setFabricType(type)}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-mono rounded-full border transition-all ${
              fabricType === type
                ? 'bg-otaru-ink border-otaru-ink text-otaru-chalk font-semibold'
                : 'bg-otaru-chalk-warm/60 border-otaru-border/50 text-otaru-ink-muted hover:border-otaru-ink'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsWireframe(!isWireframe)}
          className="px-3 py-1.5 bg-otaru-ink/80 backdrop-blur-md text-otaru-chalk text-[10px] uppercase tracking-wider font-mono rounded-full hover:bg-otaru-ink transition-colors"
          aria-label="Toggle Wireframe Shading"
        >
          {isWireframe ? 'Shaded View' : 'Weave Structure'}
        </button>
      </div>

      <div className="absolute top-4 left-4 z-10 text-caption text-otaru-ink-subtle text-[11px] font-mono tracking-widest uppercase">
        {title} &bull; {activePreset.label}
      </div>
    </div>
  );
}
