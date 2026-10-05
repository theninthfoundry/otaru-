'use client';

import React, { useEffect, useRef, useState } from 'react';

interface StampProps {
  number?: string | number;
  total?: string | number;
  className?: string;
}

export function Stamp({ number = '01', total = '40', className = '' }: StampProps) {
  const [isVisible, setIsVisible] = useState(false);
  const stampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (stampRef.current) {
      observer.observe(stampRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={stampRef}
      className={`relative inline-flex items-center justify-center w-16 h-16 ${className}`}
    >
      <div 
        className={`absolute inset-0 border-2 border-madder text-madder flex flex-col items-center justify-center rounded-sm transform transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
          isVisible ? 'scale-100 rotate-[-4deg] opacity-90' : 'scale-150 rotate-0 opacity-0'
        }`}
        style={{
          boxShadow: isVisible ? 'inset 0 0 2px rgba(168, 55, 44, 0.2), 0 0 4px rgba(168, 55, 44, 0.1)' : 'none'
        }}
      >
        <span className="font-mono text-[10px] leading-none tracking-widest uppercase mb-1">No.</span>
        <span className="font-display text-lg leading-none">{number}</span>
        <div className="w-8 h-[1px] bg-madder/40 my-1" />
        <span className="font-mono text-[9px] leading-none text-madder/80">{total}</span>
      </div>
    </div>
  );
}
