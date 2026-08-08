"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Reads a CSS custom property from :root at call time — keeps the shader in sync with src/styles/tokens/colors.css instead of hardcoding hex values. */
function readColorToken(varName: string, fallbackHex: string): THREE.Color {
  if (typeof window === "undefined") return new THREE.Color(fallbackHex);
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return new THREE.Color(raw || fallbackHex);
}

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float dist = distance(uv, uPointer);
    float ripple = sin(dist * 18.0 - uTime * 2.0) * 0.04 * smoothstep(0.5, 0.0, dist);
    pos += normal * ripple;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying vec2 vUv;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  void main() {
    vec3 color = mix(uColorA, uColorB, vUv.y);
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * Ambient shader-driven cloth material responding to cursor position.
 * Reads brand ink/stone tokens at mount time so the shader stays in sync
 * with the design system without hardcoding color values here.
 */
export function FabricSphere({ pointer }: { pointer: [number, number] }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uColorA: { value: readColorToken("--color-ink", "#0a0a0a") },
      uColorB: { value: readColorToken("--color-stone", "#e5e3dc") },
    }),
    []
  );

  // Re-read tokens if the theme (light/dark data-attr) changes at runtime.
  useEffect(() => {
    const observer = new MutationObserver(() => {
      uniforms.uColorA.value = readColorToken("--color-ink", "#0a0a0a");
      uniforms.uColorB.value = readColorToken("--color-stone", "#e5e3dc");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, [uniforms]);

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uPointer.value.set(pointer[0], pointer[1]);
  });

  return (
    <mesh rotation={[0, 0, 0]}>
      <sphereGeometry args={[1.4, 128, 128]} />
      <shaderMaterial ref={materialRef} vertexShader={VERTEX_SHADER} fragmentShader={FRAGMENT_SHADER} uniforms={uniforms} wireframe />
    </mesh>
  );
}
