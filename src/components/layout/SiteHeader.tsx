'use client';

import React from 'react';
import Link from 'next/link';
import { DropChip } from '../ui/DropChip';
import { strings } from '../../../content/strings';

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-paper/90 backdrop-blur-sm border-b border-hairline transition-all duration-300">
      <div className="wrap h-20 flex items-center justify-between">
        
        {/* Left: Drop Status */}
        <div className="hidden md:flex flex-1">
          <DropChip state="waitlist" />
        </div>

        {/* Center: Wordmark */}
        <div className="flex-1 flex justify-start md:justify-center">
          <Link href="/" className="group flex items-baseline gap-3">
            <span className="font-display text-xl tracking-wide group-hover:opacity-70 transition-opacity">
              House of Otaru
            </span>
            <span className="font-display text-sm text-ink/40 group-hover:text-ink/70 transition-colors">
              {strings.ja.otaru}
            </span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex justify-end items-center gap-6">
          <Link href="#residents" className="caption hover:text-madder transition-colors hidden sm:block">
            Waitlist
          </Link>
          <a href="#residents" className="btn-primary text-sm px-5 py-2">
            Enter
          </a>
        </div>

      </div>
    </header>
  );
}
