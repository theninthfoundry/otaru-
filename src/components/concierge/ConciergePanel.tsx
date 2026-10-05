'use client';

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

interface ConciergeCategory {
  id: string;
  label: string;
  lead: string;
  description: string;
}

const CATEGORIES: ConciergeCategory[] = [
  {
    id: 'fit',
    label: 'FIT & SILHOUETTE',
    lead: 'Individual measurements & drape advice',
    description: 'Provide your height, chest circumference, and preferred drape. A tailor from our Otaru canal studio will advise on size allocation within 24 hours.',
  },
  {
    id: 'material',
    label: 'TEXTILE & WEAVE',
    lead: 'Yarn specifications, shrinkage & loom origin',
    description: 'Inquire about yarn weight, fiber harvest origins, botanical sukumo vats, or seasonal weather tolerance before selecting.',
  },
  {
    id: 'care',
    label: 'CARE & REPAIR LEDGER',
    lead: 'Washing rituals & lifetime boro mending',
    description: 'Questions regarding cold-water washing, natural shrinkage, or submitting a worn piece for lifetime visible boro stitching in our studio.',
  },
  {
    id: 'dispatch',
    label: 'GLOBAL DISPATCH',
    lead: 'Tracked courier direct from Hokkaido',
    description: 'We dispatch worldwide via tracked express air courier. Inquire for specific customs clearance and delivery timelines.',
  },
  {
    id: 'history',
    label: 'ARCHIVAL PROVENANCE',
    lead: 'Batch records & past chapter pieces',
    description: 'Verify the provenance record of an earlier batch piece or check future cutting schedule.',
  },
];

interface ConciergePanelProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
  objectContext?: string;
}

/**
 * ConciergePanel — Quiet Archival Atelier Desk
 * 
 * Replaces commercial chatbot popups with a respectful, tranquil consultation desk.
 */
export function ConciergePanel({
  isOpen,
  onClose,
  defaultCategory = 'fit',
  objectContext,
}: ConciergePanelProps) {
  const [selectedCat, setSelectedCat] = useState<string>(defaultCategory);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (defaultCategory) setSelectedCat(defaultCategory);
  }, [defaultCategory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCat) || CATEGORIES[0]!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setMessage('');
      onClose();
    }, 2400);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 z-[130] bg-[var(--ink)]/65 backdrop-blur-xs transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Atelier Concierge Desk"
        className={clsx(
          'fixed top-0 right-0 bottom-0 z-[140] w-full max-w-[480px] bg-[var(--paper)] text-[var(--ink)] border-l border-hairline flex flex-col shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-hairline flex items-center justify-between bg-[var(--paper)]">
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--indigo)] font-semibold block">
              Atelier Desk · Otaru Canal
            </span>
            <h2 className="font-display text-2xl text-[var(--ink)]">Concierge.</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 font-mono text-sm hover:opacity-60 transition-opacity"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {objectContext && (
            <div className="p-3 bg-[var(--paper-2)] border border-hairline text-xs font-mono">
              <span className="text-[var(--ink-muted)] block uppercase text-[10px]">Context:</span>
              <span className="font-semibold text-[var(--ink)]">{objectContext}</span>
            </div>
          )}

          {/* Inquiry Categories */}
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--ink-muted)] block mb-3">
              Consultation Topic
            </span>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCat(cat.id)}
                  className={clsx(
                    'py-2 px-3 text-left border font-mono text-[11px] transition-colors',
                    selectedCat === cat.id
                      ? 'bg-[var(--indigo)] text-white border-[var(--indigo)]'
                      : 'bg-[var(--paper-2)] text-[var(--ink)] border-hairline hover:border-[var(--ink)]'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Topic Explanation */}
          <div className="p-4 bg-[var(--paper-2)] border border-hairline">
            <h4 className="font-display text-sm text-[var(--ink)] mb-1">
              {activeCategory.lead}
            </h4>
            <p className="text-xs text-[var(--ink)]/75 leading-relaxed font-sans">
              {activeCategory.description}
            </p>
          </div>

          {/* Form */}
          {isSent ? (
            <div className="p-6 bg-[var(--paper-2)] border border-hairline text-center font-mono text-xs text-[var(--ink)]">
              <span className="text-[var(--indigo)] font-bold text-base block mb-2">✓ Inquiry Dispatched</span>
              <p className="text-[var(--ink-muted)]">
                Our atelier team will review your query and reply directly to your email within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)] mb-1.5">
                  Your Collector Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="w-full bg-[var(--paper)] border border-hairline px-3.5 py-2.5 text-xs font-mono text-[var(--ink)] focus:outline-none focus:border-[var(--indigo)]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)] mb-1.5">
                  Inquiry Details
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Inquire about measurements, sleeve length, or care rituals..."
                  required
                  className="w-full bg-[var(--paper)] border border-hairline p-3 text-xs font-sans text-[var(--ink)] focus:outline-none focus:border-[var(--indigo)] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[var(--indigo)] text-white text-xs font-mono uppercase tracking-widest hover:bg-[var(--indigo-hover)] transition-colors shadow-sm"
              >
                Send to Atelier Desk →
              </button>

              <div className="text-center pt-2">
                <span className="font-mono text-[10px] text-[var(--ink-muted)]">
                  Direct email: concierge@otaru.in
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
