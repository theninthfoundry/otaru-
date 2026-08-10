"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * H&M/ASOS-style mega menu: hover/focus a top-level category, a full-width
 * panel drops with sub-categories + an editorial image column (LV/Palm
 * Angels pattern — every category flyout earns real estate for a hero
 * image, not just a link list).
 */
interface MegaNavSection {
  label: string;
  href: string;
  columns: { heading: string; links: { label: string; href: string }[] }[];
  featured?: { title: string; href: string; imageSeed: string };
}

const SECTIONS: MegaNavSection[] = [
  {
    label: "Archive",
    href: "/archive",
    columns: [
      { heading: "Category", links: [
        { label: "Outerwear", href: "/archive?category=outerwear" },
        { label: "Knitwear", href: "/archive?category=knitwear" },
        { label: "Bottoms", href: "/archive?category=bottoms" },
        { label: "Accessories", href: "/archive?category=accessories" },
      ]},
      { heading: "Shop by", links: [
        { label: "New This Week", href: "/archive?sort=newest" },
        { label: "Archive Sold", href: "/archive?availability=sold" },
        { label: "Under $500", href: "/archive?price=under-500" },
      ]},
    ],
    featured: { title: "Chapter 02 — Kinetic Architecture", href: "/chapter/kinetic-architecture", imageSeed: "chapter-02-nav" },
  },
  {
    label: "Chapters",
    href: "/chapter",
    columns: [
      { heading: "Releases", links: [
        { label: "Latest Chapter", href: "/chapter" },
        { label: "Full Index", href: "/chapter" },
      ]},
    ],
  },
  { label: "Journal", href: "/journal", columns: [] },
  { label: "Drops", href: "/drops", columns: [] },
  { label: "Membership", href: "/membership", columns: [] },
];

export function MegaNav() {
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const active = SECTIONS.find((s) => s.label === openLabel);

  return (
    <nav
      className="hidden md:block"
      onMouseLeave={() => setOpenLabel(null)}
    >
      <div className="flex items-center gap-8">
        {SECTIONS.map((section) => (
          <div key={section.label} onMouseEnter={() => setOpenLabel(section.label)}>
            <Link
              href={section.href}
              className={cn(
                "text-body-sm tracking-tight transition-colors duration-1",
                openLabel === section.label ? "text-foreground" : "text-foreground hover:text-foreground-muted"
              )}
            >
              {section.label}
            </Link>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {active && active.columns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full border-t border-border bg-surface shadow-lg"
          >
            <div className="otaru-container grid grid-cols-4 gap-8 py-10">
              {active.columns.map((col) => (
                <div key={col.heading}>
                  <p className="otaru-eyebrow mb-4">{col.heading}</p>
                  <ul className="space-y-2">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} onClick={() => setOpenLabel(null)} className="text-body-sm hover:text-foreground-muted">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {active.featured && (
                <Link href={active.featured.href} onClick={() => setOpenLabel(null)} className="col-span-2 group block">
                  <div
                    className="aspect-[16/9] rounded-sm bg-surface-alt bg-cover bg-center transition-transform duration-2 ease-out-expo group-hover:scale-[1.02]"
                    style={{ backgroundImage: `url(https://picsum.photos/seed/${active.featured.imageSeed}/800/450)` }}
                  />
                  <p className="mt-3 text-body-sm">{active.featured.title}</p>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
