import React from 'react';

interface ResidentCardProps {
  number: number;
  name?: string;
  city?: string;
}

export function ResidentCard({ number, name, city }: ResidentCardProps) {
  return (
    <div className="w-full max-w-md aspect-[3/2] bg-paper-2 border border-hairline relative overflow-hidden flex flex-col justify-between p-6 md:p-8 shadow-sm">
      {/* Background texture/lines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--ink) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <h4 className="font-mono text-xs tracking-[0.2em] text-ink/50 mb-1 uppercase">Resident</h4>
          <p className="font-display text-xl">{name || 'Anonymous'}</p>
          {city && <p className="text-sm text-ink/60 mt-1">{city}</p>}
        </div>
        
        <div className="text-right">
          <h4 className="font-mono text-xs tracking-[0.2em] text-ink/50 mb-1 uppercase">Entry</h4>
          <p className="font-mono text-lg text-madder">No. {number.toString().padStart(4, '0')}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-end relative z-10 border-t border-hairline pt-4 mt-8">
        <div>
          <p className="font-display text-lg">House of Otaru</p>
          <p className="font-mono text-[10px] tracking-widest text-ink/40 uppercase mt-1">Two Harbours</p>
        </div>
        
        <div className="text-right font-mono text-[10px] tracking-widest text-ink/40 uppercase">
          <p>MMXXVI</p>
        </div>
      </div>
    </div>
  );
}
