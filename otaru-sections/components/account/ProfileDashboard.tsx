"use client";

/**
 * ProfileDashboard
 * -----------------------------------------------------------------
 * Client-side tab switching only — the data below is placeholder.
 * Fetch the real member record (name, memberSince, tier, orders,
 * wishlist, addresses) in the parent server component and pass it
 * down as props; never fetch another user's data by a client-
 * supplied id (see section 13, Authorization).
 */
import { useState } from "react";
import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

const TABS = ["Overview", "Acquired Artifacts", "Saved", "Addresses", "Membership"] as const;
type Tab = (typeof TABS)[number];

const ACTIVITY = [
  { name: "Yama Field Jacket", meta: "Acquired · No. 041 · 18 Aug MMXXVI" },
  { name: "Kiryū Wrap Trouser", meta: "Saved to wishlist · No. 042" },
  { name: "Biratori Overshirt", meta: "Acquired · No. 043 · 02 Jul MMXXVI" },
];

export function ProfileDashboard({
  memberSince = "MMXXV",
  tier = "Archival",
  acquiredCount = 7,
  savedCount = 3,
}: {
  memberSince?: string;
  tier?: string;
  acquiredCount?: number;
  savedCount?: number;
}) {
  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-36 lg:px-8">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[260px_1fr]">
        <aside className="border-b border-[var(--otaru-line)] pb-8 md:border-b-0 md:border-r md:pb-0 md:pr-8">
          <ImagePlaceholder ratio="square" className="h-16 w-16 rounded-full" />
          <p className="mt-4 font-display text-[1.3rem] text-[var(--otaru-parchment)]">Member since {memberSince}</p>
          <p className="mt-1 text-[0.74rem] text-[var(--otaru-parchment-dim)]">{acquiredCount} artifacts acquired</p>
          <span className="mt-3 inline-block rounded-full border border-[var(--otaru-gold-dim)] px-2.5 py-1 text-[0.64rem] uppercase tracking-[0.1em] text-[var(--otaru-gold)]">
            {tier} Tier
          </span>

          <nav aria-label="Profile sections" className="mt-8">
            <ul className="flex flex-col gap-1">
              {TABS.map((t) => (
                <li key={t}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => setTab(t)}
                    className={`w-full rounded-sm px-2.5 py-2.5 text-left text-[0.84rem] transition-colors ${
                      tab === t
                        ? "bg-[var(--otaru-dusk-2)] text-[var(--otaru-parchment)]"
                        : "text-[var(--otaru-parchment-dim)] hover:bg-white/5 hover:text-[var(--otaru-parchment)]"
                    }`}
                  >
                    {t}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href="/api/auth/sign-out"
            className="mt-8 inline-flex items-center gap-2 border-b border-[var(--otaru-gold-dim)] pb-1 text-[0.78rem] uppercase tracking-[0.1em] text-[var(--otaru-parchment)] hover:border-[var(--otaru-gold)]"
          >
            Sign out
          </Link>
        </aside>

        <div>
          {tab === "Overview" && (
            <>
              <h1 className="font-display text-[2rem] text-[var(--otaru-parchment)]">Overview</h1>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard num={acquiredCount} label="Artifacts acquired" />
                <StatCard num={savedCount} label="Saved to wishlist" />
                <StatCard num={tier} label="Membership tier" />
              </div>

              <h2 className="mt-12 text-[0.78rem] uppercase tracking-[0.06em] text-[var(--otaru-parchment-dim)]">
                Recent activity
              </h2>
              <ul className="mt-3">
                {ACTIVITY.map((item, i) => (
                  <li
                    key={item.name}
                    className={`flex items-center gap-4 py-4 ${i < ACTIVITY.length - 1 ? "border-b border-[var(--otaru-line)]" : ""}`}
                  >
                    <ImagePlaceholder ratio="portrait" className="w-14 flex-shrink-0" />
                    <div>
                      <p className="text-[0.92rem] text-[var(--otaru-parchment)]">{item.name}</p>
                      <p className="mt-0.5 text-[0.76rem] text-[var(--otaru-parchment-dim)]">{item.meta}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {tab !== "Overview" && (
            <>
              <h1 className="font-display text-[2rem] text-[var(--otaru-parchment)]">{tab}</h1>
              <p className="mt-4 text-[var(--otaru-parchment-dim)]">
                Wire this panel to your real {tab.toLowerCase()} query — layout and empty state ready, data pending.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ num, label }: { num: string | number; label: string }) {
  return (
    <div className="border border-[var(--otaru-line)] p-6">
      <p className="font-display text-3xl text-[var(--otaru-parchment)]">{num}</p>
      <p className="mt-1 text-[0.72rem] uppercase tracking-[0.08em] text-[var(--otaru-parchment-dim)]">{label}</p>
    </div>
  );
}
