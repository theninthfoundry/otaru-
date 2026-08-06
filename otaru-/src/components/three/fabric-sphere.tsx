'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FabricSphereProps {
  color?: string;
  wireframe?: boolean;
  roughness?: number;
  metalness?: number;
}

/**
 * FabricSphere — Organic 3D cloth/textile mesh representing raw garment material.
 * Gently deforms and rotates in 3D space.
 */
export function FabricSphere({
  color = '#1c1b18',
  wireframe = false,
  roughness = 0.8,
  metalness = 0.1,
}: FabricSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = time * 0.15;
    meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;

    // Subtle breathing displacement
    const scale = 1 + Math.sin(time * 0.8) * 0.03;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.6, 64, 64]} />
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        roughness={roughness}
        metalness={metalness}
        wireframe={wireframe}
        flatShading={false}
      />
    </mesh>
  );
}
