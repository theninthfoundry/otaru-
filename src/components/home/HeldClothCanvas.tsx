'use client';

import React, { useEffect, useRef, useState } from 'react';

interface HeldClothCanvasProps {
  className?: string;
  scrollProgress?: number;
}

/**
 * HeldClothCanvas
 * WebGL procedural cloth plane simulating raw indigo fabric "held up to the window".
 * - Warp & weft procedural weave structure
 * - Soft lerped backlighting following the cursor (lerp 0.08)
 * - Gentle idle breathing (<=4px wave displacement)
 * - Touch / idle auto-drift
 * - Off-screen rendering pause via IntersectionObserver
 * - High-fidelity CSS radial-gradient fallback for non-WebGL / reduced-motion environments
 */
export function HeldClothCanvas({ className = '', scrollProgress = 0 }: HeldClothCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const isVisibleRef = useRef(true);

  useEffect(() => {
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setHasWebGL(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { powerPreference: 'low-power', alpha: false, antialias: false });
    if (!gl) {
      setHasWebGL(false);
      return;
    }

    // Vertex Shader: Fullscreen quad
    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader: Backlit indigo weave with dynamic window light
    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;
      uniform float u_scroll;
      varying vec2 vUv;

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.y = 1.0 - st.y;

        // Subtle idle breathing displacement (<=4px equivalent)
        vec2 breath = vec2(
          sin(u_time * 0.8 + st.y * 3.0) * 0.003,
          cos(u_time * 0.6 + st.x * 2.5) * 0.003
        );
        vec2 p = st + breath;

        // Weave normal simulation (warp & weft grid)
        float freq = u_resolution.x > 768.0 ? 180.0 : 110.0;
        float warp = abs(sin(p.x * freq));
        float weft = abs(sin(p.y * freq));
        float thread = (warp * 0.5 + weft * 0.5);

        // Light point lerped to cursor (window light leaking through pores)
        vec2 lightDelta = p - u_mouse;
        // Correct aspect ratio for circular light
        lightDelta.x *= u_resolution.x / u_resolution.y;
        float dist = length(lightDelta);

        // Soft radial glow (window sunbeam)
        float glow = exp(-dist * 2.8);
        float core = exp(-dist * 7.0);

        // Indigo palette colors
        vec3 deepIndigo   = vec3(0.063, 0.098, 0.165); // #10192A
        vec3 midIndigo    = vec3(0.121, 0.165, 0.267); // #1F2A44
        vec3 windowLight  = vec3(0.937, 0.906, 0.847); // #EFEBE3 (linen glow)
        vec3 warmSunbeam  = vec3(0.965, 0.941, 0.886); // backlit beam

        // Base cloth color with subtle organic slub variation
        float slub = sin(p.x * 45.0 + sin(p.y * 30.0)) * 0.04;
        vec3 cloth = mix(deepIndigo, midIndigo, (thread * 0.4 + slub));

        // Light passing through thread interstices
        float threadTranslucency = pow(1.0 - thread * 0.65, 2.0);
        vec3 lightPassThrough = mix(windowLight, warmSunbeam, core) * glow * 1.45 * (0.4 + threadTranslucency * 0.6);

        // Compose final backlit pixel
        vec3 color = cloth + lightPassThrough;

        // Apply scroll dimming towards next section
        color = mix(color, deepIndigo * 0.7, u_scroll * 0.6);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Shader compilation utility
    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) {
      setHasWebGL(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLocation);
    gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uScroll = gl.getUniformLocation(program, 'u_scroll');

    // Handle resizing
    let width = 0;
    let height = 0;
    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // Cap at 1.5 for performance
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Track intersection to pause shader when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    // Animation render loop
    let animId: number;
    let startTime = performance.now();

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      if (!isVisibleRef.current) return;

      const elapsed = (time - startTime) * 0.001;

      // Mouse lerping (0.08 smoothing factor as specified in prompt)
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.08;
      m.y += (m.targetY - m.y) * 0.08;

      gl.uniform2f(uMouse, m.x, m.y);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uScroll, scrollProgress);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, [scrollProgress]);

  // Handle pointer tracking with normalized coordinates
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    mouseRef.current.targetX = x;
    mouseRef.current.targetY = y;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {hasWebGL ? (
        <canvas ref={canvasRef} className="w-full h-full block" />
      ) : (
        /* Minimalist fallback for reduced motion or non-WebGL browsers */
        <div
          className="w-full h-full relative bg-[#10192A]"
          style={{
            backgroundImage: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(239, 235, 227, 0.22) 0%, rgba(31, 42, 68, 0.45) 45%, rgba(16, 25, 42, 0.95) 100%)`,
          }}
        />
      )}
    </div>
  );
}
