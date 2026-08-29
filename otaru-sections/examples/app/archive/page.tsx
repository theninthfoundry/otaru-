import type { Metadata } from "next";
import { Suspense } from "react";
import { ArchiveFilters } from "@/components/archive/ArchiveFilters";
import { ArchiveGrid, type ArchiveArtifact } from "@/components/archive/ArchiveGrid";

export const metadata: Metadata = {
  title: "Archive — Otaru",
  description: "412 objects. Nothing reprinted.",
};

const PAGE_SIZE = 12;

// Placeholder catalog — replace with your real Shopify/Sanity/Prisma
// query, filtered and sorted server-side using the same params read
// below. Keep the filtering/sorting on the server: it's the only way
// pagination numbers and "X results" stay honest.
const MOCK_CATALOG: (ArchiveArtifact & { category: string; priceCents: number; createdAt: string })[] = [
  { id: "041", catalogNo: "No. 041", name: "Yama Field Jacket", material: "Raw indigo canvas", price: "$480", href: "/archive/yama-field-jacket", category: "Outerwear", priceCents: 48000, createdAt: "2026-08-18" },
  { id: "042", catalogNo: "No. 042", name: "Kiryū Wrap Trouser", material: "Washed silk blend", price: "$310", href: "/archive/kiryu-wrap-trouser", category: "Trousers", priceCents: 31000, createdAt: "2026-08-15" },
  { id: "043", catalogNo: "No. 043", name: "Biratori Overshirt", material: "Boiled wool", price: "$395", href: "/archive/biratori-overshirt", category: "Tops", priceCents: 39500, createdAt: "2026-07-02", sold: true },
  { id: "044", catalogNo: "No. 044", name: "Ōmi Hemp Tote", material: "Raw hemp canvas", price: "$165", href: "/archive/omi-hemp-tote", category: "Accessories", priceCents: 16500, createdAt: "2026-06-28" },
  { id: "038", catalogNo: "No. 038", name: "Otaru Deck Coat", material: "Oiled canvas", price: "$540", href: "/archive/otaru-deck-coat", category: "Outerwear", priceCents: 54000, createdAt: "2026-05-20" },
  { id: "037", catalogNo: "No. 037", name: "Tsukiji Apron Shirt", material: "Undyed linen", price: "$260", href: "/archive/tsukiji-apron-shirt", category: "Tops", priceCents: 26000, createdAt: "2026-05-11" },
  { id: "036", catalogNo: "No. 036", name: "Hakodate Watch Cap", material: "Boiled wool", price: "$95", href: "/archive/hakodate-watch-cap", category: "Accessories", priceCents: 9500, createdAt: "2026-04-30" },
  { id: "035", catalogNo: "No. 035", name: "Nemuro Wide Trouser", material: "Raw hemp canvas", price: "$300", href: "/archive/nemuro-wide-trouser", category: "Trousers", priceCents: 30000, createdAt: "2026-04-12" },
];

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; page?: string }>;
}) {
  const params = await searchParams;
  const category = params.category ?? "All";
  const sort = params.sort ?? "newest";
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  let filtered = category === "All" ? MOCK_CATALOG : MOCK_CATALOG.filter((a) => a.category === category);

  filtered = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.priceCents - b.priceCents;
    if (sort === "price-desc") return b.priceCents - a.priceCents;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // newest
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function buildPageHref(p: number) {
    const sp = new URLSearchParams();
    if (category !== "All") sp.set("category", category);
    if (sort !== "newest") sp.set("sort", sort);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `/archive?${qs}` : "/archive";
  }

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-32 lg:px-8">
      <span className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--otaru-gold-dim)] before:h-px before:w-[1.1em] before:bg-[var(--otaru-gold-dim)] before:content-['']">
        The archive
      </span>
      <h1 className="mt-3 max-w-[18ch] font-display text-[clamp(2rem,4.2vw,3.4rem)] text-[var(--otaru-parchment)]">
        412 objects. Nothing reprinted.
      </h1>
      <p className="mt-4 max-w-[46ch] text-[1.02rem] leading-relaxed text-[var(--otaru-parchment-dim)]">
        Every artifact we&rsquo;ve ever released, cataloged and searchable. When a run sells out, the listing stays
        — as a record, not an invitation.
      </p>

      <div className="mt-10">
        {/* useSearchParams() inside ArchiveFilters needs a Suspense boundary
            or Next.js will deopt this whole route to client rendering. */}
        <Suspense fallback={null}>
          <ArchiveFilters />
        </Suspense>
      </div>

      <p className="mt-6 text-[0.8rem] text-[var(--otaru-parchment-dim)]">
        {filtered.length} result{filtered.length === 1 ? "" : "s"}
      </p>

      <ArchiveGrid artifacts={pageItems} page={page} totalPages={totalPages} buildPageHref={buildPageHref} />
    </div>
  );
}
