"use client";

import { useState } from "react";
import { ARViewer } from "@/components/three/ar-viewer";

interface ARLaunchButtonProps {
  artifactTitle: string;
}

export function ARLaunchButton({ artifactTitle }: ARLaunchButtonProps) {
  const [isAROpen, setIsAROpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsAROpen(true)}
        className="inline-flex items-center gap-2 border border-border/80 bg-background/60 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground transition-all hover:border-foreground hover:text-foreground backdrop-blur-sm"
        aria-label="View in Augmented Reality"
      >
        <span className="text-xs">📐</span>
        <span>View in 1:1 AR</span>
      </button>

      <ARViewer
        isOpen={isAROpen}
        onClose={() => setIsAROpen(false)}
        artifactTitle={artifactTitle}
      />
    </>
  );
}
