'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FabricSphereProps {
  color?: string;
  wireframe?: boolean;
  roughness?: number;
  metalness?: number;
  fabricType?: 'denim' | 'wool' | 'cotton';
}

/**
 * FabricSphere — Organic 3D cloth/textile mesh representing raw garment material.
 * Generates photorealistic procedural textile textures (indigo twill denim, felted melton wool, loop-knit cotton)
 * directly in client memory to capture raw thread tactile quality under dynamic light vectors.
 */
export function FabricSphere({
  color,
  wireframe = false,
  roughness = 0.88,
  metalness = 0.05,
  fabricType = 'denim',
}: FabricSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Generate procedural weave texture maps (color map + height bumpMap)
  const [colorMap, bumpMap] = useMemo(() => {
    if (typeof window === 'undefined') return [null, null];

    const size = 512;
    const canvasColor = document.createElement('canvas');
    const canvasBump = document.createElement('canvas');
    canvasColor.width = size;
    canvasColor.height = size;
    canvasBump.width = size;
    canvasBump.height = size;

    const ctxColor = canvasColor.getContext('2d');
    const ctxBump = canvasBump.getContext('2d');
    if (!ctxColor || !ctxBump) return [null, null];

    // Reset backgrounds
    ctxColor.fillStyle = '#ffffff';
    ctxColor.fillRect(0, 0, size, size);
    ctxBump.fillStyle = '#808080'; // Neutral height value for bump maps
    ctxBump.fillRect(0, 0, size, size);

    if (fabricType === 'denim') {
      // 1. RAW SELVAGE DENIM: Indigo Warp + Cream Weft Twill Weave
      // Base indigo color
      ctxColor.fillStyle = color || '#1b2845';
      ctxColor.fillRect(0, 0, size, size);

      const twillSpacing = 4;
      // Draw diagonal warp threads (dark indigo)
      for (let i = -size; i < size; i += twillSpacing) {
        ctxColor.strokeStyle = 'rgba(10, 15, 30, 0.4)';
        ctxColor.lineWidth = 2;
        ctxColor.beginPath();
        ctxColor.moveTo(i, 0);
        ctxColor.lineTo(i + size, size);
        ctxColor.stroke();

        // Bump map ridges
        ctxBump.strokeStyle = '#a0a0a0';
        ctxBump.lineWidth = 1.5;
        ctxBump.beginPath();
        ctxBump.moveTo(i, 0);
        ctxBump.lineTo(i + size, size);
        ctxBump.stroke();
      }

      // Draw cross-weft threads (cream/white fibers peaking through twill gaps)
      ctxColor.strokeStyle = '#fbf9f1'; // Slubby ecru weft
      for (let i = -size; i < size; i += twillSpacing) {
        ctxColor.lineWidth = 0.8;
        // Dash pattern creates the weft intersections peaking through the warp
        ctxColor.setLineDash([1, 3]);
        ctxColor.beginPath();
        ctxColor.moveTo(i + size, 0);
        ctxColor.lineTo(i, size);
        ctxColor.stroke();

        // Cross bump indentations
        ctxBump.strokeStyle = '#404040';
        ctxBump.lineWidth = 0.8;
        ctxBump.setLineDash([1, 3]);
        ctxBump.beginPath();
        ctxBump.moveTo(i + size, 0);
        ctxBump.lineTo(i, size);
        ctxBump.stroke();
      }
      ctxColor.setLineDash([]);
      ctxBump.setLineDash([]);

    } else if (fabricType === 'wool') {
      // 2. MELTON WOOL: Fuzzy, felted organic fiber cluster
      ctxColor.fillStyle = color || '#424240';
      ctxColor.fillRect(0, 0, size, size);

      // Layer 1: Fine fiber strands
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const len = Math.random() * 25 + 10;
        const angle = Math.random() * Math.PI * 2;
        const cx = x + Math.cos(angle) * len;
        const cy = y + Math.sin(angle) * len;

        // Color fiber
        ctxColor.strokeStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.15)';
        ctxColor.lineWidth = Math.random() * 1.5 + 0.5;
        ctxColor.beginPath();
        ctxColor.moveTo(x, y);
        ctxColor.quadraticCurveTo(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10, cx, cy);
        ctxColor.stroke();

        // Bump fiber
        ctxBump.strokeStyle = Math.random() > 0.5 ? '#b0b0b0' : '#505050';
        ctxBump.lineWidth = ctxColor.lineWidth;
        ctxBump.beginPath();
        ctxBump.moveTo(x, y);
        ctxBump.quadraticCurveTo(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10, cx, cy);
        ctxBump.stroke();
      }

      // Layer 2: Organic pore noise
      for (let i = 0; i < 30000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = Math.random() * 1.8 + 0.5;
        ctxColor.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.14})`;
        ctxColor.beginPath();
        ctxColor.arc(x, y, r, 0, Math.PI * 2);
        ctxColor.fill();

        ctxBump.fillStyle = Math.random() > 0.5 ? '#909090' : '#707070';
        ctxBump.beginPath();
        ctxBump.arc(x, y, r, 0, Math.PI * 2);
        ctxBump.fill();
      }

    } else {
      // 3. FRENCH TERRY COTTON: Loop-knit pattern structure
      ctxColor.fillStyle = color || '#1c1b18';
      ctxColor.fillRect(0, 0, size, size);

      const loopWidth = 6;
      const loopHeight = 8;

      ctxColor.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctxColor.lineWidth = 1.2;

      // Draw interlocking knit loops (V-stitches)
      for (let y = 0; y < size; y += loopHeight) {
        for (let x = 0; x < size; x += loopWidth) {
          // Draw V shape color
          ctxColor.beginPath();
          ctxColor.moveTo(x, y);
          ctxColor.lineTo(x + loopWidth / 2, y + loopHeight);
          ctxColor.lineTo(x + loopWidth, y);
          ctxColor.stroke();

          // Draw V shape bump
          ctxBump.strokeStyle = '#c0c0c0';
          ctxBump.lineWidth = 1.0;
          ctxBump.beginPath();
          ctxBump.moveTo(x, y);
          ctxBump.lineTo(x + loopWidth / 2, y + loopHeight);
          ctxBump.lineTo(x + loopWidth, y);
          ctxBump.stroke();

          // Inside loop shadows
          ctxColor.fillStyle = 'rgba(0, 0, 0, 0.12)';
          ctxColor.fillRect(x + 2, y + 1, 2, 2);

          ctxBump.fillStyle = '#505050';
          ctxBump.fillRect(x + 2, y + 1, 2, 2);
        }
      }
    }

    const tColor = new THREE.CanvasTexture(canvasColor);
    const tBump = new THREE.CanvasTexture(canvasBump);

    tColor.wrapS = THREE.RepeatWrapping;
    tColor.wrapT = THREE.RepeatWrapping;
    tBump.wrapS = THREE.RepeatWrapping;
    tBump.wrapT = THREE.RepeatWrapping;

    const repeatScale = fabricType === 'wool' ? 4 : fabricType === 'denim' ? 14 : 20;
    tColor.repeat.set(repeatScale, repeatScale);
    tBump.repeat.set(repeatScale, repeatScale);

    return [tColor, tBump];
  }, [fabricType, color]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = time * 0.1;
    meshRef.current.rotation.x = Math.sin(time * 0.06) * 0.06;

    // Organic micro-breathing scale warp
    const scale = 1 + Math.sin(time * 0.5) * 0.015;
    meshRef.current.scale.set(scale, scale, scale);
  });

  const bumpScale = fabricType === 'wool' ? 0.07 : fabricType === 'denim' ? 0.045 : 0.02;

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.65, 64, 64]} />
      <meshStandardMaterial
        ref={materialRef}
        map={colorMap || undefined}
        bumpMap={bumpMap || undefined}
        bumpScale={bumpScale}
        roughness={roughness}
        metalness={metalness}
        wireframe={wireframe}
        flatShading={false}
      />
    </mesh>
  );
}
