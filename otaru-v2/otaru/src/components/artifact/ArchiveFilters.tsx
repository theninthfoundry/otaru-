"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface ArchiveFilterState {
  category: string | null;
  size: string | null;
  sort: "featured" | "price-asc" | "price-desc";
}

const CATEGORIES = ["Outerwear", "Bottoms", "Knitwear", "Accessories"];
const SIZES = ["XS", "S", "M", "L", "XL"];

export function ArchiveFilters({ onChange }: { onChange: (state: ArchiveFilterState) => void }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<ArchiveFilterState>({ category: null, size: null, sort: "featured" });

  function update(next: Partial<ArchiveFilterState>) {
    const merged = { ...state, ...next };
    setState(merged);
    onChange(merged);
  }

  return (
    <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
      <button onClick={() => setOpen(!open)} className="text-body-sm tracking-tight">
        Filter {open ? "−" : "+"}
      </button>

      <select
        value={state.sort}
        onChange={(e) => update({ sort: e.target.value as ArchiveFilterState["sort"] })}
        className="border-none bg-transparent text-body-sm focus:outline-none"
      >
        <option value="featured">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>

      {open && (
        <div className="absolute left-0 right-0 top-full z-10 mt-2 grid grid-cols-2 gap-8 border-t border-border bg-surface p-6 md:grid-cols-4">
          <div>
            <p className="otaru-eyebrow mb-3">Category</p>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => update({ category: state.category === c ? null : c })}
                className={cn("block py-1 text-body-sm", state.category === c && "font-medium underline")}
              >
                {c}
              </button>
            ))}
          </div>
          <div>
            <p className="otaru-eyebrow mb-3">Size</p>
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => update({ size: state.size === s ? null : s })}
                className={cn("block py-1 text-body-sm", state.size === s && "font-medium underline")}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
