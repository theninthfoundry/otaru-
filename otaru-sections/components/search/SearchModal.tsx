"use client";

/**
 * SearchModal
 * -----------------------------------------------------------------
 * Opens on Cmd+K / Ctrl+K from anywhere, or by dispatching a
 * "otaru:open-search" window event (see SiteHeader's search button)
 * — that keeps this component self-contained with no prop drilling
 * for "open" state through the header. Mount it once, near the root
 * layout, alongside <MoonProgress />.
 */
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/hooks/useSearch";
import type { SearchKind, SearchResult } from "@/lib/search/types";

const GROUP_LABELS: Record<SearchKind, string> = {
  artifact: "Artifacts",
  chapter: "Chapters",
  journal: "Journal",
};
const GROUP_ORDER: SearchKind[] = ["artifact", "chapter", "journal"];

export function SearchModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { grouped, isSearching } = useSearch(query);

  const orderedResults = useMemo<SearchResult[]>(
    () => GROUP_ORDER.flatMap((kind) => grouped[kind] ?? []),
    [grouped]
  );

  useEffect(() => {
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    function onOpenEvent() {
      setOpen(true);
    }
    window.addEventListener("otaru:open-search", onOpenEvent);
    return () => window.removeEventListener("otaru:open-search", onOpenEvent);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [orderedResults.length]);

  function go(result: SearchResult) {
    setOpen(false);
    router.push(result.record.url);
  }

  function onInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, orderedResults.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const r = orderedResults[activeIndex];
      if (r) go(r);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-[12vh]">
      <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the archive"
        className="relative z-10 mx-4 w-full max-w-[560px] border border-[var(--otaru-line-strong)] bg-[var(--otaru-dusk)] shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-[var(--otaru-line)] px-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="text-[var(--otaru-parchment-dim)]">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            role="combobox"
            aria-expanded={orderedResults.length > 0}
            aria-controls="search-results"
            aria-autocomplete="list"
            placeholder="Search artifacts, chapters, journal…"
            className="flex-1 bg-transparent py-3.5 text-[0.95rem] text-[var(--otaru-parchment)] placeholder:text-[var(--otaru-horizon)] focus:outline-none"
          />
          <kbd className="hidden rounded border border-[var(--otaru-line-strong)] px-1.5 py-0.5 text-[0.68rem] text-[var(--otaru-parchment-dim)] sm:block">
            Esc
          </kbd>
        </div>

        <div id="search-results" role="listbox" aria-label="Search results" className="max-h-[60vh] overflow-y-auto py-2">
          {query.trim() === "" && (
            <p className="px-4 py-6 text-center text-sm text-[var(--otaru-parchment-dim)]">
              Search across the archive, chapters, and journal.
            </p>
          )}

          {query.trim() !== "" && !isSearching && orderedResults.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-[var(--otaru-parchment-dim)]">
              Nothing matches &ldquo;{query}&rdquo;.
            </p>
          )}

          {GROUP_ORDER.map((kind) => {
            const items = grouped[kind];
            if (!items || items.length === 0) return null;
            return (
              <div key={kind} className="px-2 py-1">
                <p className="px-2 py-1.5 text-[0.66rem] uppercase tracking-[0.1em] text-[var(--otaru-gold-dim)]">
                  {GROUP_LABELS[kind]}
                </p>
                {items.map((result) => {
                  const flatIndex = orderedResults.indexOf(result);
                  const isActive = flatIndex === activeIndex;
                  return (
                    <button
                      key={result.record.id}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setActiveIndex(flatIndex)}
                      onClick={() => go(result)}
                      className={`flex w-full flex-col items-start px-3 py-2.5 text-left transition-colors ${
                        isActive ? "bg-[var(--otaru-dusk-2)]" : ""
                      }`}
                    >
                      <span className="text-sm text-[var(--otaru-parchment)]">{result.record.title}</span>
                      {result.record.subtitle && (
                        <span className="mt-0.5 text-[0.76rem] text-[var(--otaru-parchment-dim)]">{result.record.subtitle}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
