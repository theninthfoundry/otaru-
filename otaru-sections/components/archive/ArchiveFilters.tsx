"use client";

/**
 * ArchiveFilters
 * -----------------------------------------------------------------
 * Writes to the URL (?category=outerwear&sort=newest) rather than
 * local state, so filtered views are shareable/bookmarkable and
 * survive a refresh — directive section 6 ("URL state where useful").
 * The actual filtering/sorting happens server-side in app/archive/page.tsx
 * reading these same searchParams; this component only edits the URL.
 */
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const CATEGORIES = ["All", "Outerwear", "Tops", "Trousers", "Accessories"];
const SORTS: { value: string; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function ArchiveFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "All";
  const activeSort = searchParams.get("sort") ?? "newest";

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "All" || value === "newest") params.delete(key);
    else params.set(key, value);
    params.delete("page"); // any filter change resets pagination
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            aria-pressed={activeCategory === cat}
            onClick={() => setParam("category", cat)}
            className={`rounded-full border px-3.5 py-1.5 text-[0.72rem] uppercase tracking-[0.08em] transition-colors ${
              activeCategory === cat
                ? "border-[var(--otaru-parchment)] bg-[var(--otaru-parchment)] text-[var(--otaru-ink)]"
                : "border-[var(--otaru-line-strong)] text-[var(--otaru-parchment-dim)] hover:bg-[var(--otaru-parchment)] hover:text-[var(--otaru-ink)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.08em] text-[var(--otaru-parchment-dim)]">
        Sort
        <select
          value={activeSort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="border border-[var(--otaru-line-strong)] bg-transparent px-2 py-1.5 text-[var(--otaru-parchment)]"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value} className="bg-[var(--otaru-dusk)]">
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
