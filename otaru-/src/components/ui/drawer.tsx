'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Title for accessibility */
  title: string;
  /** Side to slide from. Default: 'right' */
  side?: 'left' | 'right';
  className?: string;
}

const slideVariants = {
  left: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  },
  right: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
  },
};

/**
 * Side-drawer with smooth slide animation + backdrop blur.
 * Premium upgrade from the basic cart-drawer pattern.
 */
export function Drawer({
  isOpen,
  onClose,
  children,
  title,
  side = 'right',
  className,
}: DrawerProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const variants = slideVariants[side];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[50] bg-otaru-overlay backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            className={cn(
              'fixed inset-y-0 z-[51] w-full max-w-md',
              'bg-otaru-chalk border-otaru-border/30',
              'shadow-otaru-lg',
              'flex flex-col',
              side === 'right'
                ? 'right-0 border-l'
                : 'left-0 border-r',
              className,
            )}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-otaru-border/40 px-6 py-5">
              <h2 className="text-heading-sm font-semibold tracking-tight">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-body-sm text-otaru-ink-muted hover:text-otaru-ink transition-colors"
                aria-label={`Close ${title}`}
              >
                Close
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
