"use client";

import Link from "next/link";
import { Drawer } from "@/components/ui/Drawer";

const LINKS = [
  { href: "/archive", label: "Archive" },
  { href: "/chapter", label: "Chapters" },
  { href: "/journal", label: "Journal" },
  { href: "/drops", label: "Drops" },
  { href: "/membership", label: "Membership" },
];

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Drawer open={open} onClose={onClose} side="left">
      <nav className="flex flex-col gap-6 p-8 pt-24">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} onClick={onClose} className="font-display text-display-sm">
            {link.label}
          </Link>
        ))}
      </nav>
    </Drawer>
  );
}
