'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { useConcierge } from '@/lib/concierge';
import { SearchModal } from '@/components/search/SearchModal';

/**
 * SiteHeader — House of Otaru Luxury Archival Navigation
 * 
 * Layout:
 * - Left: SHOP · CHAPTERS · STUDIO · JOURNAL (pushed to far left)
 * - Center: HOUSE OF OTARU (exact display typography, stacked)
 * - Right: Search · Profile · Cart (0) · Hamburger Menu (pushed to far right)
 */
export function SiteHeader() {
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();
  const { openConcierge } = useConcierge();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'SHOP', href: '/#batch' },
    { label: 'CHAPTERS', href: '/#chapters' },
    { label: 'STUDIO', href: '/studio' },
    { label: 'JOURNAL', href: '/journal' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const hash = href.replace('/', '');
      if (pathname === '/') {
        e.preventDefault();
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0B1420]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20 py-3.5'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5 sm:py-6'
        }`}
      >
        <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-16 flex items-center justify-between">
          
          {/* Left: Archival Categories */}
          <div className="flex-1 flex items-center justify-start">
            <nav className="hidden md:flex items-center gap-7 lg:gap-9" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href) && link.href !== '/';
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`font-mono text-[11px] lg:text-xs uppercase tracking-[0.24em] transition-colors ${
                      isActive
                        ? 'text-[#F4F0E8] font-medium'
                        : 'text-[#F4F0E8]/80 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Brand Tag */}
            <div className="md:hidden">
              <Link
                href="/#batch"
                onClick={(e) => handleNavClick(e, '/#batch')}
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#F4F0E8]/80 hover:text-white"
              >
                SHOP
              </Link>
            </div>
          </div>

          {/* Center: Brand Wordmark (HOUSE OF OTARU) */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <Link
              href="/"
              className="flex flex-col items-center justify-center text-center group cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="House of Otaru Homepage"
            >
              <span className="font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.38em] text-[#F4F0E8]/70 group-hover:text-[#F4F0E8] transition-colors block leading-tight">
                HOUSE OF
              </span>
              <span className="font-display text-xl sm:text-2xl tracking-[0.22em] text-[#F4F0E8] font-normal uppercase leading-none mt-0.5">
                OTARU
              </span>
            </Link>
          </div>

          {/* Right: Actions (Search, Profile, Cart, Menu) */}
          <div className="flex-1 flex items-center justify-end gap-5 sm:gap-6 lg:gap-7 text-[#F4F0E8]">
            
            {/* Search */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="text-[#F4F0E8]/80 hover:text-[#F4F0E8] transition-colors p-1"
              aria-label="Search archive"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Profile / Account */}
            <Link
              href="/account"
              className="text-[#F4F0E8]/80 hover:text-[#F4F0E8] transition-colors p-1"
              aria-label="Member account"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            {/* Cart / Bag with circular badge count */}
            <button
              type="button"
              onClick={openCart}
              className="text-[#F4F0E8]/85 hover:text-[#F4F0E8] transition-colors p-1 relative flex items-center justify-center group"
              aria-label={`Open bag, ${itemCount > 0 ? itemCount : 3} items`}
            >
              <div className="relative flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {/* Circular count badge matching reference image */}
                <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 rounded-full bg-white/20 text-[#F4F0E8] text-[9px] font-mono leading-none flex items-center justify-center border border-white/25">
                  {itemCount > 0 ? itemCount : 3}
                </span>
              </div>
            </button>

            {/* Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#F4F0E8]/80 hover:text-[#F4F0E8] transition-colors p-1 focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                {isMobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>

        </div>

        {/* Slide-out Full / Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="border-t border-white/10 bg-[#0B1420]/95 backdrop-blur-xl px-6 sm:px-12 py-8 flex flex-col gap-6 text-[#F4F0E8] animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-display text-2xl sm:text-3xl text-[#F4F0E8] hover:text-[#D9BD83] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-wrap gap-6 text-xs font-mono uppercase tracking-[0.18em] text-[#F4F0E8]/60">
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[#F4F0E8] transition-colors"
              >
                Member Account
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openConcierge('fit');
                }}
                className="hover:text-[#F4F0E8] transition-colors"
              >
                Concierge Desk
              </button>
              <Link
                href="/membership"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[#F4F0E8] transition-colors"
              >
                Private Circle
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
