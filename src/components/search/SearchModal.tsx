'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/lib/currency';
import { searchIndex, SearchRecord } from '@/lib/search';
import clsx from 'clsx';

interface SearchModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function SearchModal({ isOpen: externalIsOpen, onClose: externalOnClose }: SearchModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const { formatPrice } = useCurrency();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const close = () => {
    if (externalOnClose) externalOnClose();
    else setInternalIsOpen(false);
    setQuery('');
    setActiveIndex(-1);
  };

  const open = () => setInternalIsOpen(true);

  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'k') {
        ev.preventDefault();
        if (isOpen) close();
        else open();
      } else if (ev.key === 'Escape' && isOpen) {
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const results = searchIndex(query, formatPrice);

  const handleSelect = (rec: SearchRecord) => {
    close();
    router.push(rec.url);
  };

  const handleInputKeyDown = (ev: React.KeyboardEvent) => {
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (ev.key === 'Enter') {
      ev.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        handleSelect(results[activeIndex]!);
      } else if (results[0]) {
        handleSelect(results[0]);
      }
    }
  };

  // Group results by category
  const groups: Record<string, SearchRecord[]> = {};
  results.forEach((rec) => {
    if (!groups[rec.kind]) groups[rec.kind] = [];
    groups[rec.kind]!.push(rec);
  });

  const order = ['Artifacts', 'Chapters', 'Journal'] as const;

  return (
    <>
      <div
        className={clsx('search-overlay', isOpen && 'is-open')}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 110,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingTop: '12vh',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity var(--duration-fast) var(--ease-otaru)',
        }}
      >
        <div
          className="search-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Search the archive"
          style={{
            width: '100%',
            maxWidth: '560px',
            margin: '0 1rem',
            backgroundColor: 'var(--otaru-dusk)',
            border: '1px solid var(--otaru-line-strong)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
            transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'transform var(--duration-fast) var(--ease-otaru)',
            maxHeight: '76vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0 1.1rem',
              borderBottom: '1px solid var(--otaru-line)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: 'var(--otaru-parchment-dim)', flexShrink: 0 }}>
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search artifacts, chapters, journal…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(-1);
              }}
              onKeyDown={handleInputKeyDown}
              role="combobox"
              aria-expanded={results.length > 0}
              aria-controls="search-results-list"
              aria-autocomplete="list"
              autoComplete="off"
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                padding: '0.95rem 0.1rem',
                color: 'var(--otaru-parchment)',
                outline: 'none',
              }}
            />
            <kbd
              style={{
                border: '1px solid var(--otaru-line-strong)',
                borderRadius: '4px',
                padding: '0.15rem 0.4rem',
                fontSize: '0.66rem',
                color: 'var(--otaru-parchment-dim)',
              }}
            >
              Esc
            </kbd>
          </div>

          <div id="search-results-list" style={{ overflowY: 'auto', padding: '0.4rem' }}>
            {!query.trim() ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', fontSize: '0.88rem', color: 'var(--otaru-parchment-dim)' }}>
                Search across the archive, chapters, and journal.
              </div>
            ) : results.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', fontSize: '0.88rem', color: 'var(--otaru-parchment-dim)' }}>
                Nothing matches &ldquo;{query}&rdquo;.
              </div>
            ) : (
              <div>
                {order.map((kind) => {
                  const list = groups[kind];
                  if (!list || list.length === 0) return null;

                  return (
                    <div key={kind}>
                      <div
                        style={{
                          padding: '0.6rem 0.7rem 0.3rem',
                          fontSize: '0.64rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--otaru-gold-dim)',
                        }}
                      >
                        {kind}
                      </div>
                      {list.map((rec) => {
                        const globalIndex = results.indexOf(rec);
                        const isActive = globalIndex === activeIndex;

                        return (
                          <button
                            key={rec.title + rec.url}
                            type="button"
                            onClick={() => handleSelect(rec)}
                            onMouseEnter={() => setActiveIndex(globalIndex)}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              width: '100%',
                              textAlign: 'left',
                              padding: '0.6rem 0.8rem',
                              borderRadius: '2px',
                              backgroundColor: isActive ? 'var(--otaru-dusk-2)' : 'transparent',
                              transition: 'background var(--duration-fast)',
                            }}
                          >
                            <span style={{ fontSize: '0.9rem', color: 'var(--otaru-parchment)' }}>
                              {rec.title}
                            </span>
                            <span style={{ fontSize: '0.76rem', color: 'var(--otaru-parchment-dim)', marginTop: '0.1rem' }}>
                              {rec.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
