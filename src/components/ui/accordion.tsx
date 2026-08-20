'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ id, title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-otaru-border/40 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-otaru-ink py-1"
        aria-expanded={isOpen}
      >
        <span className="text-body-md font-medium text-otaru-ink">{title}</span>
        <span className="text-otaru-ink-muted text-sm font-mono transition-transform duration-300">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-3 pb-1 text-body-sm text-otaru-ink-muted leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Accordion({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('w-full divide-y-0', className)}>{children}</div>;
}
