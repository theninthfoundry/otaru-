"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { MOCK_ARTIFACTS } from "@/lib/mock-data";

/** Cmd+K command palette with instant client-side search over Artifacts. */
export function PredictiveSearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose(); // parent toggles; simplest is to let Header own the open state
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const results = query
    ? MOCK_ARTIFACTS.filter((a) => a.title.toLowerCase().includes(query.toLowerCase()))
    : MOCK_ARTIFACTS.slice(0, 4);

  return (
    <Modal open={open} onClose={onClose} className="max-w-xl">
      <div className="p-4">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the Archive…"
          className="w-full border-b border-border py-3 text-body-lg focus:outline-none"
        />
        <div className="mt-4 max-h-80 overflow-y-auto">
          {results.length === 0 && <p className="py-6 text-center text-body-sm text-foreground-muted">No Artifacts found.</p>}
          {results.map((artifact) => (
            <Link
              key={artifact.id}
              href={`/artifact/${artifact.handle}`}
              onClick={onClose}
              className="flex items-center justify-between border-b border-border py-3 text-body-sm hover:text-foreground-muted"
            >
              <span>{artifact.title}</span>
              <span className="text-foreground-muted">View →</span>
            </Link>
          ))}
        </div>
      </div>
    </Modal>
  );
}
