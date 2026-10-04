import React from 'react';
import Image from 'next/image';

interface PlateProps {
  src?: string;
  alt?: string;
  label?: string;
  ratio?: 'square' | 'portrait' | 'landscape';
}

export function Plate({ src, alt = '', label = 'ARCHIVAL PLATE', ratio = 'portrait' }: PlateProps) {
  const aspectRatios = {
    square: 'aspect-square',
    portrait: 'aspect-[4/5]',
    landscape: 'aspect-[16/9]'
  };

  return (
    <div className="relative group overflow-hidden bg-paper-2 border border-hairline p-2 sm:p-4">
      {/* Registration Marks */}
      <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-ink/30" />
      <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-ink/30" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-ink/30" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-ink/30" />
      
      <div className={`relative w-full ${aspectRatios[ratio]} overflow-hidden bg-ink/5`}>
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-ink/40 font-mono text-xs tracking-widest">
            <span className="mb-2">◇</span>
            <span>{label}</span>
          </div>
        )}
      </div>
      
      {label && src && (
        <div className="mt-3 text-center">
          <span className="caption text-ink/60">{label}</span>
        </div>
      )}
    </div>
  );
}
