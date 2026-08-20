'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeaderActions } from './header-actions';
import { NAV_ITEMS, SITE_NAME } from '@/lib/constants';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-otaru-chalk/80 backdrop-blur-md border-b border-otaru-border/40 transition-colors">
      <div className="otaru-container flex h-16 items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-heading-md font-bold tracking-tight text-otaru-ink hover:opacity-80 transition-opacity"
        >
          <span className="font-display italic text-xl">Otaru</span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-otaru-ink-subtle hidden sm:inline-block">
            Design Studio
          </span>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-body-sm font-medium transition-colors ${
                  isActive
                    ? 'text-otaru-ink border-b border-otaru-ink py-1'
                    : 'text-otaru-ink-muted hover:text-otaru-ink'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/chapter"
            className={`text-body-sm font-medium transition-colors ${
              pathname.startsWith('/chapter')
                ? 'text-otaru-ink border-b border-otaru-ink py-1'
                : 'text-otaru-ink-muted hover:text-otaru-ink'
            }`}
          >
            Chapters
          </Link>
        </nav>

        {/* Actions (Dock, Currency, Search, Wishlist, Bag) */}
        <HeaderActions />
      </div>
    </header>
  );
}
