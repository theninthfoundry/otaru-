"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { PredictiveSearchModal } from "@/components/search/PredictiveSearchModal";
import { CurrencySelector } from "@/components/layout/CurrencySelector";
import { MegaNav } from "@/components/nav/MegaNav";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalQuantity, openDrawer } = useCartStore((s) => ({
    totalQuantity: s.cart.totalQuantity,
    openDrawer: s.openDrawer,
  }));

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <div className="fixed top-0 z-30 w-full">
        <AnnouncementBar />
        <header
          className={cn(
            "relative w-full transition-all duration-1 ease-standard",
            scrolled ? "bg-surface/90 backdrop-blur-md shadow-sm py-3" : "bg-surface py-6"
          )}
        >
          <div className="otaru-container flex items-center justify-between">
            <Link href="/" className="font-display text-display-sm tracking-tighter">
              Otaru
            </Link>

            <MegaNav />

            <div className="flex items-center gap-5">
              <CurrencySelector />
              <button onClick={() => setSearchOpen(true)} aria-label="Search (⌘K)" className="text-body-sm">
                Search
              </button>
              <Link href="/account" aria-label="Account" className="text-body-sm hidden md:inline">
                Account
              </Link>
              <button onClick={openDrawer} aria-label="Open bag" className="text-body-sm">
                Bag {totalQuantity > 0 && `(${totalQuantity})`}
              </button>
            </div>
          </div>
        </header>
      </div>

      <PredictiveSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
