"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState, type ReactNode } from "react";

interface CanvasWrapperProps {
  children: ReactNode;
  className?: string;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.matchMedia("(min-width: 1024px)").matches && !("ontouchstart" in window));
  }, []);
  return isDesktop;
}

/**
 * Desktop-only WebGL canvas host. Bypassed entirely on mobile/touch devices
 * and when prefers-reduced-motion is set, per the architecture report's
 * performance & accessibility rules — falls back to `null` (caller should
 * render a static hero image behind this component as a fallback).
 */
export function CanvasWrapper({ children, className }: CanvasWrapperProps) {
  const isDesktop = useIsDesktop();
  const reducedMotion = usePrefersReducedMotion();

  if (!isDesktop || reducedMotion) return null;

  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        {children}
      </Canvas>
    </div>
  );
}
