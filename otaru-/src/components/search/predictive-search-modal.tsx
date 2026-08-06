'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon } from '@/components/ui/icons';

interface PredictiveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PredictiveSearchModal({
  isOpen,
  onClose,
}: PredictiveSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [, startTransition] = useTransition();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('otaru-recent-searches');
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Keyboard shortcut listener (Cmd/Ctrl + K)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearchSubmit = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    try {
      const updated = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(0, 5);
      localStorage.setItem('otaru-recent-searches', JSON.stringify(updated));
      setRecentSearches(updated);
    } catch {
      // Ignore localStorage errors
    }

    onClose();
    startTransition(() => {
      router.push(`/archive?q=${encodeURIComponent(trimmed)}`);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-otaru-ink/60 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-otaru-chalk border border-otaru-border rounded-xl shadow-2xl overflow-hidden space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-otaru-border/60 pb-4">
          <SearchIcon size={20} className="text-otaru-ink-muted shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit(query);
              }
            }}
            placeholder="Search artifacts, chapters, or stories... (Press Enter)"
            className="w-full bg-transparent text-body-md font-medium text-otaru-ink outline-none placeholder:text-otaru-ink-subtle"
            autoFocus
          />
          <button
            onClick={onClose}
            className="text-caption text-xs text-otaru-ink-subtle hover:text-otaru-ink p-1"
          >
            ESC
          </button>
        </div>

        {/* Quick Links / Recent Searches */}
        {!query && (
          <div className="space-y-4 pt-2">
            {recentSearches.length > 0 && (
              <div className="space-y-2">
                <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[10px] block">
                  Recent Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearchSubmit(s)}
                      className="px-3 py-1 bg-otaru-cream/80 hover:bg-otaru-cream text-caption text-xs text-otaru-ink rounded-full transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[10px] block">
                Popular Collections
              </span>
              <div className="grid grid-cols-2 gap-2 text-body-sm font-medium">
                <button
                  onClick={() => handleSearchSubmit('Heavyweight Tee')}
                  className="text-left p-3 bg-otaru-cream/30 hover:bg-otaru-cream/70 rounded-md transition-colors text-otaru-ink"
                >
                  Heavyweight Tees
                </button>
                <button
                  onClick={() => handleSearchSubmit('French Terry')}
                  className="text-left p-3 bg-otaru-cream/30 hover:bg-otaru-cream/70 rounded-md transition-colors text-otaru-ink"
                >
                  French Terry Hoodies
                </button>
                <button
                  onClick={() => handleSearchSubmit('Origins')}
                  className="text-left p-3 bg-otaru-cream/30 hover:bg-otaru-cream/70 rounded-md transition-colors text-otaru-ink"
                >
                  Chapter 01 — Origins
                </button>
                <button
                  onClick={() => handleSearchSubmit('Silence')}
                  className="text-left p-3 bg-otaru-cream/30 hover:bg-otaru-cream/70 rounded-md transition-colors text-otaru-ink"
                >
                  Chapter 02 — Silence
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Query Direct Trigger */}
        {query && (
          <div className="pt-2">
            <button
              onClick={() => handleSearchSubmit(query)}
              className="w-full p-4 bg-otaru-cream/50 hover:bg-otaru-cream text-left rounded-md text-body-md font-medium text-otaru-ink flex items-center justify-between transition-colors"
            >
              <span>Search Archive for &ldquo;{query}&rdquo;</span>
              <span className="text-caption text-xs text-otaru-ink-muted">Press Enter ↵</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
