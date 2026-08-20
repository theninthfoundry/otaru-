import Link from 'next/link';
import { SITE_NAME, SOCIAL_LINKS } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-otaru-chalk border-t border-otaru-border/40 py-16 text-otaru-ink">
      <div className="otaru-container grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-4">
          <h2 className="text-display-sm font-bold tracking-tight font-display italic">
            {SITE_NAME}
          </h2>
          <p className="text-body-sm text-otaru-ink-muted font-light leading-relaxed max-w-sm">
            Garments worth keeping. Craftsmanship outlasts trends. Limited releases engineered with architectural precision and permanent intention.
          </p>
          <div className="text-caption text-xs text-otaru-ink-subtle">
            Tokyo · New Delhi · Global Shipping
          </div>
        </div>

        {/* Catalog / Navigation */}
        <div className="md:col-span-2 space-y-3">
          <p className="text-overline uppercase tracking-widest text-[11px] font-semibold text-otaru-ink-subtle">
            Archive
          </p>
          <ul className="space-y-2 text-body-sm text-otaru-ink-muted">
            <li>
              <Link href="/archive" className="hover:text-otaru-ink transition-colors">
                All Artifacts
              </Link>
            </li>
            <li>
              <Link href="/chapter" className="hover:text-otaru-ink transition-colors">
                Numbered Chapters
              </Link>
            </li>
            <li>
              <Link href="/drops" className="hover:text-otaru-ink transition-colors">
                Release Calendar
              </Link>
            </li>
          </ul>
        </div>

        {/* Philosophy & Editorial */}
        <div className="md:col-span-3 space-y-3">
          <p className="text-overline uppercase tracking-widest text-[11px] font-semibold text-otaru-ink-subtle">
            House
          </p>
          <ul className="space-y-2 text-body-sm text-otaru-ink-muted">
            <li>
              <Link href="/studio" className="hover:text-otaru-ink transition-colors">
                Studio Philosophy
              </Link>
            </li>
            <li>
              <Link href="/journal" className="hover:text-otaru-ink transition-colors">
                Publication Journal
              </Link>
            </li>
            <li>
              <Link href="/membership" className="hover:text-otaru-ink transition-colors">
                Private Registry
              </Link>
            </li>
            <li>
              <Link href="/verify" className="hover:text-otaru-ink transition-colors">
                NFC & Provenance Verification
              </Link>
            </li>
          </ul>
        </div>

        {/* Support & Account */}
        <div className="md:col-span-3 space-y-3">
          <p className="text-overline uppercase tracking-widest text-[11px] font-semibold text-otaru-ink-subtle">
            Client Services
          </p>
          <ul className="space-y-2 text-body-sm text-otaru-ink-muted">
            <li>
              <Link href="/track-order" className="hover:text-otaru-ink transition-colors">
                Track Shipment
              </Link>
            </li>
            <li>
              <Link href="/returns" className="hover:text-otaru-ink transition-colors">
                Returns & Exchange Policy
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-otaru-ink transition-colors">
                Account Portal
              </Link>
            </li>
            <li>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-otaru-ink transition-colors"
              >
                Instagram ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="otaru-container mt-16 pt-8 border-t border-otaru-border/20 flex flex-col md:flex-row items-center justify-between text-caption text-xs text-otaru-ink-subtle gap-4">
        <span>© {currentYear} OTARU DESIGN HOUSE. ALL RIGHTS RESERVED.</span>
        <div className="flex items-center gap-6">
          <span>Encrypted Ledger Verified</span>
          <span>Zero Trace Packaging</span>
        </div>
      </div>
    </footer>
  );
}
