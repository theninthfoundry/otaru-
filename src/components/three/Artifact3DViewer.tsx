"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const CanvasWrapper = dynamic(() => import("./CanvasWrapper").then((m) => m.CanvasWrapper), { ssr: false });
const FabricSphere = dynamic(() => import("./FabricSphere").then((m) => m.FabricSphere), { ssr: false });

/**
 * Desktop-only interactive 3D canvas for a hero Artifact. Currently renders
 * the shader-driven FabricSphere as an ambient placeholder — swap in a real
 * GLTF model per-Artifact (via useGLTF from @react-three/drei) once garment
 * scans exist.
 */
export function Artifact3DViewer({ className }: { className?: string }) {
  const [pointer, setPointer] = useState<[number, number]>([0.5, 0.5]);

  return (
    <div
      className={className}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPointer([(e.clientX - rect.left) / rect.width, 1 - (e.clientY - rect.top) / rect.height]);
      }}
    >
      <CanvasWrapper className="h-full w-full">
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} intensity={0.8} />
        <FabricSphere pointer={pointer} />
      </CanvasWrapper>
    </div>
  );
}
