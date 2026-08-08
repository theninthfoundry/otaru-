'use client';

import React from 'react';

interface MembershipBadgeProps {
  tier?: 'Vanguard' | 'Archival' | 'Atelier';
  memberId?: string;
}

export function MembershipBadge({
  tier = 'Archival',
  memberId = 'OTR-MEM-00492',
}: MembershipBadgeProps) {
  return (
    <div className="p-6 bg-otaru-ink text-otaru-chalk rounded-sm space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-otaru-stone/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between">
        <div>
          <span className="text-overline uppercase tracking-widest text-otaru-chalk/60 text-[10px] font-mono">
            Otaru Registry Status
          </span>
          <h3 className="text-display-xs font-serif italic text-otaru-chalk mt-0.5">
            {tier} Patron Tier
          </h3>
        </div>
        <span className="px-3 py-1 bg-otaru-chalk/10 border border-otaru-chalk/20 text-otaru-chalk text-[11px] font-mono tracking-widest uppercase rounded-full">
          {memberId}
        </span>
      </div>

      <p className="text-body-sm text-otaru-chalk/80 font-light leading-relaxed max-w-md">
        As an Archival Patron, you receive 24-hour private window access prior to all Chapter publications, custom sizing alterations at our atelier, and guaranteed drop waitlist priority.
      </p>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-otaru-chalk/15 text-caption text-xs">
        <div>
          <span className="block text-otaru-chalk/50 text-[10px] uppercase font-mono">Early Window</span>
          <span className="font-medium text-otaru-chalk">24 Hours Ahead</span>
        </div>
        <div>
          <span className="block text-otaru-chalk/50 text-[10px] uppercase font-mono">Atelier Service</span>
          <span className="font-medium text-otaru-chalk">Complimentary</span>
        </div>
        <div>
          <span className="block text-otaru-chalk/50 text-[10px] uppercase font-mono">Private Code</span>
          <span className="font-mono text-otaru-chalk">ARCHIVAL-2026</span>
        </div>
      </div>
    </div>
  );
}
