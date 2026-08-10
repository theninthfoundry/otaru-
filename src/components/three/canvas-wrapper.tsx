'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMediaQuery } from '@/hooks/use-media-query';

interface CanvasWrapperProps {
  children: React.ReactNode;
  className?: string;
  fallback?: React.ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
}

export function CanvasWrapper({
  children,
  className = 'w-full h-full min-h-[300px]',
  fallback = null,
  cameraPosition = [0, 0, 5],
  fov = 45,
}: CanvasWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || prefersReducedMotion) {
    return <div className={className}>{fallback}</div>;
  }

  // Mobile WebGL Profile: Lower DPR target (0.75 - 1.0) for performance
  const dprRange: [number, number] = isMobile ? [0.75, 1] : [1, 2];

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: cameraPosition, fov }}
        dpr={dprRange}
        gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          <OrbitControls
            enableZoom={!isMobile}
            minDistance={2.5}
            maxDistance={7}
            enablePan={false}
          />
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
