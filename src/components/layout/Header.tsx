"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/cart/CartContext";
import { PredictiveSearchModal } from "@/components/search/PredictiveSearchModal";

const NAV_LINKS = [
  { href: "/archive", label: "Archive" },
  { href: "/chapter", label: "Chapters" },
  { href: "/journal", label: "Journal" },
  { href: "/drops", label: "Drops" },
  { href: "/membership", label: "Membership" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cart, openDrawer } = useCart();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-30 w-full transition-all duration-1 ease-standard",
          scrolled ? "bg-surface/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-6"
        )}
      >
        <div className="otaru-container flex items-center justify-between">
          <Link href="/" className="font-display text-display-sm tracking-tighter">
            Otaru
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-body-sm tracking-tight hover:text-foreground-muted transition-colors duration-1">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="text-body-sm">
              Search
            </button>
            <button onClick={openDrawer} aria-label="Open bag" className="text-body-sm">
              Bag {cart.totalQuantity > 0 && `(${cart.totalQuantity})`}
            </button>
          </div>
        </div>
      </header>

      <PredictiveSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
