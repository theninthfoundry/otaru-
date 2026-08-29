"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { search } from "@/lib/search/fuzzy-search";
import { DEMO_INDEX } from "@/lib/search/search-index";
import type { SearchResult } from "@/lib/search/types";

const DEBOUNCE_MS = 120;

export function useSearch(query: string, limit = 8) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const requestId = useRef(0);

  // Debounce inline (rather than importing debounce()) so each call
  // can carry a request id and ignore stale results — plain debounce
  // alone doesn't protect against an in-flight async search resolving
  // out of order once you swap DEMO_INDEX for a real network fetch.
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const thisRequest = ++requestId.current;
    const timer = setTimeout(() => {
      const next = search(DEMO_INDEX, query, { limit });
      if (requestId.current === thisRequest) {
        setResults(next);
        setIsSearching(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query, limit]);

  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    for (const r of results) {
      groups[r.record.kind] ??= [];
      groups[r.record.kind].push(r);
    }
    return groups;
  }, [results]);

  return { results, grouped, isSearching };
}
