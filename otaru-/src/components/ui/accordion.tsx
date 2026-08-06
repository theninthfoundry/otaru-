'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Allow multiple items open simultaneously. Default: false */
  multiple?: boolean;
  className?: string;
}

/**
 * Animated expand/collapse accordion.
 * Uses Framer Motion AnimatePresence for smooth height animation.
 */
export function Accordion({
  items,
  multiple = false,
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!multiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={cn('divide-y divide-otaru-border/40', className)}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);

        return (
          <div key={item.id}>
            <button
              className={cn(
                'flex w-full items-center justify-between py-5',
                'text-body-md font-medium text-otaru-ink text-left',
                'transition-colors duration-subtle hover:text-otaru-ink-muted',
              )}
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
            >
              <span>{item.title}</span>
              <motion.span
                className="text-otaru-ink-subtle text-body-sm ml-4 shrink-0"
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                +
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`accordion-content-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.25 },
                  }}
                  className="overflow-hidden"
                >
                  <div className="pb-5 text-body-sm text-otaru-ink-muted font-light leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
