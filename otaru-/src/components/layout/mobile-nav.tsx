'use client';

import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/constants';

/**
 * Mobile navigation drawer.
 */

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-otaru-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav
        id="mobile-nav"
        className="fixed inset-y-0 left-0 z-50 w-80 bg-otaru-chalk p-8"
        aria-label="Mobile navigation"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-center mb-12">
          <Link
            href="/"
            className="text-heading-sm font-semibold tracking-tight"
            onClick={onClose}
          >
            Otaru
          </Link>
          <button
            onClick={onClose}
            className="text-body-sm text-otaru-ink-muted"
            aria-label="Close menu"
          >
            Close
          </button>
        </div>

        <ul className="space-y-6" role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-heading-md text-otaru-ink"
                onClick={onClose}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/account"
              className="text-heading-md text-otaru-ink"
              onClick={onClose}
            >
              Account
            </Link>
          </li>
          <li>
            <Link
              href="/bag"
              className="text-heading-md text-otaru-ink"
              onClick={onClose}
            >
              Bag
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
