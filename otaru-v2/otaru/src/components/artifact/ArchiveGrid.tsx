"use client";

import { useMemo, useState } from "react";
import type { Artifact } from "@/types/shopify";
import { ArtifactCard } from "./ArtifactCard";
import { ArchiveFilters, type ArchiveFilterState } from "./ArchiveFilters";
import { cn } from "@/lib/utils";

export function ArchiveGrid({ artifacts }: { artifacts: Artifact[] }) {
  const [filters, setFilters] = useState<ArchiveFilterState>({ category: null, size: null, sort: "featured" });
  const [columns, setColumns] = useState<2 | 4>(4);

  const filtered = useMemo(() => {
    let result = [...artifacts];
    if (filters.size) {
      result = result.filter((a) => a.options.some((o) => o.name === "Size" && o.values.includes(filters.size as string)));
    }
    if (filters.sort === "price-asc") {
      result.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
    } else if (filters.sort === "price-desc") {
      result.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
    }
    return result;
  }, [artifacts, filters]);

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <ArchiveFilters onChange={setFilters} />
        <div className="mb-8 hidden gap-2 pb-4 md:flex">
          <button onClick={() => setColumns(2)} className={cn("text-body-sm", columns === 2 && "underline")}>2-col</button>
          <button onClick={() => setColumns(4)} className={cn("text-body-sm", columns === 4 && "underline")}>4-col</button>
        </div>
      </div>

      <div className={cn("grid grid-cols-2 gap-x-6 gap-y-12", columns === 4 ? "md:grid-cols-4" : "md:grid-cols-2")}>
        {filtered.map((artifact) => (
          <ArtifactCard key={artifact.id} artifact={artifact} />
        ))}
      </div>

      {filtered.length === 0 && <p className="py-24 text-center text-body-sm text-foreground-muted">No Artifacts match these filters.</p>}
    </div>
  );
}
