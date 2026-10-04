'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Thread() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !pathRef.current) {
      if (pathRef.current) {
        pathRef.current.style.strokeDasharray = '8, 8';
        pathRef.current.style.strokeDashoffset = '0';
      }
      return;
    }

    const pathLength = pathRef.current.getTotalLength();
    
    // Set up initial dash array and offset for a dashed line (sashiko/kantha stitch)
    pathRef.current.style.strokeDasharray = `8, 8, ${pathLength}`;
    pathRef.current.style.strokeDashoffset = `${pathLength}`;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });

    tl.to(pathRef.current, {
      strokeDashoffset: 0,
      ease: 'none'
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden mix-blend-multiply">
      <svg 
        ref={svgRef}
        className="w-full h-[300vh] absolute top-0 left-1/2 -translate-x-1/2" 
        viewBox="0 0 100 3000" 
        preserveAspectRatio="xMidYMin slice"
      >
        <path
          ref={pathRef}
          d="M 50,0 Q 40,500 50,1000 T 50,2000 T 50,3000"
          fill="none"
          stroke="var(--madder)"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}
