"use client";

/**
 * SiteHeader
 * -----------------------------------------------------------------
 * Replaces/extends your current nav. Starts transparent over the
 * hero, goes solid + blurred past a 40px scroll threshold. Mobile
 * menu is a full-screen overlay with focus trap left as a TODO —
 * wire your existing focus-trap util (or `focus-trap-react`) into
 * the `mobileOpen` effect below before shipping.
 *
 * Nav items use your repo's own vocabulary (Archive / Journal /
 * Studio / Chapters) from src/lib/vocabulary.ts — update the hrefs
 * to your real routes.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CartButton } from "@/components/cart/CartButton";

const NAV_ITEMS = [
  { label: "Archive", href: "/archive" },
  { label: "Journal", href: "/journal" },
  { label: "Studio", href: "/studio" },
  { label: "Chapters", href: "/chapters" },
];

export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,padding,border-color] duration-500 ${
          solid
            ? "border-b border-[var(--otaru-line)] bg-[rgba(11,20,32,0.92)] py-3 backdrop-blur-md"
            : "border-b border-transparent bg-transparent py-4"
        }`}
      >
        <div className="mx-auto flex max-w-[1360px] items-center justify-between px-5 lg:px-8">
          <nav aria-label="Primary">
            <ul className="hidden gap-8 md:flex">
              {NAV_ITEMS.map((item) => {
                const active = pathname?.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative pb-1 text-[0.74rem] uppercase tracking-[0.18em] transition-colors ${
                        active ? "text-[var(--otaru-parchment)]" : "text-[var(--otaru-parchment-dim)] hover:text-[var(--otaru-parchment)]"
                      } after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-[var(--otaru-gold)] after:transition-transform hover:after:scale-x-100 ${
                        active ? "after:scale-x-100" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link href="/" className="font-display text-2xl italic tracking-wide text-[var(--otaru-parchment)]">
            Otaru
          </Link>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Search the archive (Cmd+K)"
              onClick={() => window.dispatchEvent(new Event("otaru:open-search"))}
              className="grid h-9 w-9 place-items-center rounded-full text-[var(--otaru-parchment-dim)] transition-colors hover:bg-white/5 hover:text-[var(--otaru-parchment)]"
            >
              <SearchIcon />
            </button>
            <Link
              href="/sign-in"
              aria-label="Sign in or view your profile"
              className="hidden h-9 w-9 place-items-center rounded-full text-[var(--otaru-parchment-dim)] transition-colors hover:bg-white/5 hover:text-[var(--otaru-parchment)] md:grid"
            >
              <AccountIcon />
            </Link>
            <CartButton />
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="grid h-9 w-9 place-items-center text-[var(--otaru-parchment-dim)] md:hidden"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] flex flex-col justify-center gap-8 bg-[var(--otaru-ink)] px-8"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="absolute right-6 top-6 grid h-9 w-9 place-items-center text-[var(--otaru-parchment)]"
            >
              <CloseIcon />
            </button>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-4xl text-[var(--otaru-parchment)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="mt-4 text-lg text-[var(--otaru-parchment-dim)]"
            >
              Sign In
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function AccountIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="17" x2="21" y2="17" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <line x1="4" y1="4" x2="20" y2="20" /><line x1="20" y1="4" x2="4" y2="20" />
    </svg>
  );
}
