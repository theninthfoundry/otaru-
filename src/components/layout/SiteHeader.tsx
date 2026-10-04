'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { SearchModal } from '@/components/search/SearchModal';

export function SiteHeader() {
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Archive', href: '/archive' },
    { label: 'Journal', href: '/journal' },
    { label: 'Studio', href: '/studio' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--paper)]/95 backdrop-blur-md border-b border-hairline transition-colors">
        <div className="wrap h-16 flex items-center justify-between">
          
          {/* Left: Brand Wordmark */}
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="font-display text-xl tracking-tight hover:opacity-70 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Otaru
            </Link>

            {/* Desktop Navigation Links (Archive, Journal, Studio) */}
            <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm tracking-wide transition-colors ${
                      isActive 
                        ? 'text-[var(--ink)] font-medium border-b border-[var(--ink)] pb-0.5' 
                        : 'text-[var(--ink)]/70 hover:text-[var(--ink)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions (Search, Account, Bag) */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="text-sm tracking-wide text-[var(--ink)]/70 hover:text-[var(--ink)] transition-colors flex items-center gap-1.5"
              aria-label="Search archive"
            >
              <span className="hidden sm:inline">Search</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <Link
              href="/profile"
              className="text-sm tracking-wide text-[var(--ink)]/70 hover:text-[var(--ink)] transition-colors hidden sm:block"
            >
              Account
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="text-sm tracking-wide text-[var(--ink)] hover:text-[var(--indigo)] transition-colors flex items-center gap-1 font-medium"
              aria-label={`Open bag, ${itemCount} items`}
            >
              <span>Bag</span>
              <span className="font-mono text-xs text-[var(--ink-muted)]">
                ({itemCount})
              </span>
            </button>

            {/* Mobile Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1 text-[var(--ink)] focus:outline-none"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {isMobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="8" x2="20" y2="8" />
                    <line x1="4" y1="16" x2="20" y2="16" />
                  </>
                )}
              </svg>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-hairline bg-[var(--paper)] px-6 py-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-display text-2xl text-[var(--ink)]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-hairline flex flex-col gap-4">
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm tracking-wide text-[var(--ink)]/80"
              >
                Account
              </Link>
              <Link
                href="/chapters"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm tracking-wide text-[var(--ink)]/60"
              >
                Chapters
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
