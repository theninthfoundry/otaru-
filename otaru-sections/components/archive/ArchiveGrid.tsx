import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export type ArchiveArtifact = {
  id: string;
  catalogNo: string;
  name: string;
  material: string;
  price: string;
  href: string;
  sold?: boolean;
};

export function ArchiveGrid({
  artifacts,
  page,
  totalPages,
  buildPageHref,
}: {
  artifacts: ArchiveArtifact[];
  page: number;
  totalPages: number;
  buildPageHref: (page: number) => string;
}) {
  if (artifacts.length === 0) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <p className="text-[var(--otaru-parchment)]">Nothing matches those filters.</p>
        <p className="mt-1 text-sm text-[var(--otaru-parchment-dim)]">
          The archive keeps sold-out listings as a record — try clearing a filter.
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {artifacts.map((item) => (
          <li key={item.id} className="list-none">
            <Link href={item.href} className="group block">
              <ImagePlaceholder ratio="portrait" label={`${item.catalogNo} — 1200×1500`} className="relative">
                {item.sold && (
                  <span className="absolute left-2 top-2 rounded-full bg-[var(--otaru-ink)]/80 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.08em] text-[var(--otaru-parchment-dim)]">
                    Sold out
                  </span>
                )}
              </ImagePlaceholder>
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[0.64rem] tracking-[0.08em] text-[var(--otaru-gold-dim)]">{item.catalogNo}</span>
              </div>
              <h3 className="mt-0.5 font-display text-[1.02rem] text-[var(--otaru-parchment)]">{item.name}</h3>
              <div className="mt-0.5 flex justify-between text-[0.82rem] text-[var(--otaru-parchment-dim)]">
                <span>{item.material}</span>
                <span>{item.price}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <nav aria-label="Archive pagination" className="mt-14 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildPageHref(p)}
              aria-current={p === page ? "page" : undefined}
              className={`grid h-9 w-9 place-items-center border text-sm transition-colors ${
                p === page
                  ? "border-[var(--otaru-parchment)] bg-[var(--otaru-parchment)] text-[var(--otaru-ink)]"
                  : "border-[var(--otaru-line-strong)] text-[var(--otaru-parchment-dim)] hover:border-[var(--otaru-gold-dim)]"
              }`}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
