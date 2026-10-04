'use client';

import React, { useState } from 'react';

interface CraftPairProps {
  japanName: string;
  japanDesc: string;
  indiaName: string;
  indiaDesc: string;
  sharedIdea: string;
}

export function CraftPair({ japanName, japanDesc, indiaName, indiaDesc, sharedIdea }: CraftPairProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div 
      className="group relative border-b border-hairline py-8 cursor-pointer"
      onMouseEnter={() => setIsRevealed(true)}
      onMouseLeave={() => setIsRevealed(false)}
      onClick={() => setIsRevealed(!isRevealed)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 transition-opacity duration-300">
        
        {/* Japan Side */}
        <div className={`transition-opacity duration-500 ${isRevealed ? 'opacity-30' : 'opacity-100'}`}>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="caption text-ink/40">JP</span>
            <h3 className="font-display text-xl">{japanName}</h3>
          </div>
          <p className="text-sm text-ink/70">{japanDesc}</p>
        </div>

        {/* India Side */}
        <div className={`transition-opacity duration-500 ${isRevealed ? 'opacity-30' : 'opacity-100'}`}>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="caption text-ink/40">IN</span>
            <h3 className="font-display text-xl">{indiaName}</h3>
          </div>
          <p className="text-sm text-ink/70">{indiaDesc}</p>
        </div>

      </div>

      {/* The Shared Idea (Revealed on hover/click) */}
      <div 
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500 ${
          isRevealed ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="bg-paper border border-hairline px-6 py-4 shadow-sm text-center max-w-md">
          <p className="font-display text-lg text-indigo">{sharedIdea}</p>
        </div>
      </div>
    </div>
  );
}
