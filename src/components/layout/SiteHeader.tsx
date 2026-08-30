'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CartButton } from '@/components/cart/CartButton';
import clsx from 'clsx';

interface SiteHeaderProps {
  onSearchOpen?: () => void;
}

export function SiteHeader({ onSearchOpen }: SiteHeaderProps) {
  const [isSolid, setIsSolid] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setIsSolid(y > 40 || !isHome);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const handleOpenSearch = () => {
    if (onSearchOpen) {
      onSearchOpen();
    } else {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
      );
    }
  };

  return (
    <>
      <header
        className={clsx('site-header', isSolid && 'is-solid')}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: isSolid ? '0.85rem 0' : '1.25rem 0',
          backgroundColor: isSolid ? 'rgba(11, 20, 32, 0.94)' : 'transparent',
          backdropFilter: isSolid ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: isSolid ? 'blur(12px)' : 'none',
          borderBottom: isSolid ? '1px solid var(--otaru-line)' : '1px solid transparent',
          transition: 'all var(--duration-base) var(--ease-otaru)',
        }}
      >
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <nav aria-label="Primary" className="hidden md:block">
            <ul style={{ display: 'flex', gap: '1.9rem', listStyle: 'none', margin: 0, padding: 0 }}>
              <li>
                <Link
                  href="/archive"
                  className={clsx('nav-link', pathname === '/archive' && 'is-active')}
                >
                  Archive
                </Link>
              </li>
              <li>
                <Link
                  href="/journal"
                  className={clsx('nav-link', pathname === '/journal' && 'is-active')}
                >
                  Journal
                </Link>
              </li>
              <li>
                <Link
                  href="/studio"
                  className={clsx('nav-link', pathname === '/studio' && 'is-active')}
                >
                  Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/chapters"
                  className={clsx('nav-link', (pathname === '/chapters' || pathname === '/chapter') && 'is-active')}
                >
                  Chapters
                </Link>
              </li>
            </ul>
          </nav>

          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '1.55rem',
              letterSpacing: '0.02em',
              color: 'var(--otaru-parchment)',
              textDecoration: 'none',
              transform: 'translateX(-1.5rem)',
            }}
          >
            Otaru
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
            {/* Search Trigger */}
            <button
              type="button"
              className="icon-btn"
              onClick={handleOpenSearch}
              aria-label="Search the archive, command K"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Account Link */}
            <Link
              href="/profile"
              className="icon-btn"
              aria-label="Sign in or view profile"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </Link>

            {/* Cart Button */}
            <CartButton />

            {/* Mobile Hamburger */}
            <button
              type="button"
              className="icon-btn md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <div
        className={clsx('mobile-nav', isMobileMenuOpen && 'is-open')}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--otaru-ink)',
          zIndex: 150,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '1.6rem',
          padding: '2rem',
          transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform var(--duration-base) var(--ease-otaru)',
        }}
      >
        <button
          type="button"
          className="icon-btn"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu"
          style={{ position: 'absolute', top: '1.4rem', right: '1.4rem' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <line x1="4" y1="4" x2="20" y2="20" />
            <line x1="20" y1="4" x2="4" y2="20" />
          </svg>
        </button>

        <Link
          href="/archive"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--otaru-parchment)' }}
        >
          Archive
        </Link>
        <Link
          href="/journal"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--otaru-parchment)' }}
        >
          Journal
        </Link>
        <Link
          href="/studio"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--otaru-parchment)' }}
        >
          Studio
        </Link>
        <Link
          href="/chapters"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--otaru-parchment)' }}
        >
          Chapters
        </Link>
        <Link
          href="/sign-in"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ marginTop: '1.6rem', fontSize: '1.1rem', color: 'var(--otaru-parchment-dim)' }}
        >
          Sign In
        </Link>
      </div>

      <style jsx>{`
        .nav-link {
          font-size: 0.74rem;
          letter-spacing: var(--tracking-label);
          text-transform: uppercase;
          color: var(--otaru-parchment-dim);
          padding: 0.3rem 0;
          position: relative;
          text-decoration: none;
        }
        .nav-link:hover, .nav-link.is-active {
          color: var(--otaru-parchment);
        }
        .nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 100%;
          bottom: -2px;
          height: 1px;
          background-color: var(--otaru-gold);
          transition: right var(--duration-fast) var(--ease-otaru);
        }
        .nav-link:hover::after, .nav-link.is-active::after {
          right: 0;
        }
      `}</style>
    </>
  );
}
