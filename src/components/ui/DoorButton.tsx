'use client';

import React, { useState } from 'react';
import { strings } from '../../../content/strings';

interface DoorButtonProps {
  onEnter?: () => void;
  className?: string;
  isSubmitting?: boolean;
}

export function DoorButton({ onEnter, className = '', isSubmitting = false }: DoorButtonProps) {
  const [state, setState] = useState<'idle' | 'entered'>('idle');

  const handleClick = () => {
    if (state === 'idle' && !isSubmitting) {
      setState('entered');
      if (onEnter) onEnter();
      
      // Reset after a delay if not controlled externally
      setTimeout(() => setState('idle'), 3000);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isSubmitting || state === 'entered'}
      className={`group relative inline-flex items-center justify-center px-8 py-4 border border-indigo/20 bg-transparent hover:bg-indigo hover:text-paper transition-all duration-300 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-indigo transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out z-0" />
      
      <span className="relative z-10 font-mono tracking-widest text-sm flex items-center gap-3">
        {isSubmitting ? (
          <span className="animate-pulse">ENTERING...</span>
        ) : state === 'entered' ? (
          <>
            <span>{strings.ja.okaeri}</span>
            <span className="opacity-50">/</span>
            <span>WELCOME BACK</span>
          </>
        ) : (
          <>
            <span>{strings.ja.tadaima}</span>
            <span className="opacity-50">/</span>
            <span>I'M HOME</span>
          </>
        )}
      </span>
    </button>
  );
}
