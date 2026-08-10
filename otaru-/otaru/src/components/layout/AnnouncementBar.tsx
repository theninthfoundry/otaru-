"use client";

import { useState } from "react";
import { Marquee } from "@/components/animations/Marquee";

/** H&M/ASOS-style top strip — promo, shipping threshold, or drop countdown. Dismissible, session-only. */
export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="relative bg-otaru-ink text-otaru-chalk">
      <Marquee text="Free shipping over $300 · Chapter 03 drops September 15 · Garments worth keeping" speedSeconds={28} />
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-caption opacity-70 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
