'use client';

import React from 'react';

interface DropChipProps {
  state?: 'waitlist' | 'early-access' | 'live' | 'sold-out';
  label?: string;
  className?: string;
}

export function DropChip({ state = 'waitlist', label, className = '' }: DropChipProps) {
  const getStyling = () => {
    switch (state) {
      case 'waitlist':
        return 'border-indigo/20 text-indigo/70 bg-indigo/5';
      case 'early-access':
        return 'border-madder text-madder bg-madder/5 animate-pulse-slow';
      case 'live':
        return 'border-indigo text-paper bg-indigo';
      case 'sold-out':
        return 'border-ink/20 text-ink/40 line-through';
      default:
        return 'border-hairline text-ink';
    }
  };

  const defaultLabel = {
    'waitlist': 'WAITLIST OPEN',
    'early-access': 'RESIDENTS ONLY',
    'live': 'DROP 01 LIVE',
    'sold-out': 'ALL HOMED',
  }[state];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono tracking-widest uppercase border rounded-full ${getStyling()} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label || defaultLabel}
    </div>
  );
}
