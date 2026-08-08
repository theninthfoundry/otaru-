import Link from 'next/link';
import { NAV_ITEMS, SITE_NAME } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="site-footer" role="contentinfo" className="border-t border-otaru-border">
      <div className="grid-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <p className="text-heading-sm font-semibold tracking-tight">
              {SITE_NAME}
            </p>
            <p className="mt-2 text-body-sm text-otaru-ink-muted">
              Garments worth keeping.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="space-y-2" role="list">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-otaru-ink-muted hover:text-otaru-ink transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/track-order"
                  className="text-body-sm text-otaru-ink-muted hover:text-otaru-ink transition-colors duration-200"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-body-sm text-otaru-ink-muted hover:text-otaru-ink transition-colors duration-200"
                >
                  Returns
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-body-sm font-medium">Stay informed</p>
            <p className="mt-1 text-caption text-otaru-ink-muted">
              Chapters, craft notes, no noise.
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-otaru-border-subtle">
          <p className="text-caption text-otaru-ink-subtle">
            &copy; {currentYear} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
