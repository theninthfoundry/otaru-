import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/constants';
import { HeaderActions } from './header-actions';

export function Header() {
  return (
    <header
      id="site-header"
      role="banner"
      className="sticky top-0 z-30 bg-otaru-chalk/95 backdrop-blur-sm"
    >
      <nav
        className="grid-container flex items-center justify-between py-4"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="text-heading-sm font-semibold tracking-tight"
          aria-label="Otaru — Home"
        >
          Otaru
        </Link>

        <ul className="hidden md:flex items-center gap-8" role="list">
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
        </ul>

        <HeaderActions />
      </nav>
    </header>
  );
}
