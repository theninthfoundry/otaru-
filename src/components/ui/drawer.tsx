'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: 'right' | 'left';
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  className = '',
}: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const slideVariants = {
    closed: { x: side === 'right' ? '100%' : '-100%' },
    open: { x: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-otaru-ink/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            variants={slideVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative z-10 w-full max-w-md bg-otaru-chalk h-full shadow-2xl flex flex-col',
              side === 'right' ? 'ml-auto' : 'mr-auto',
              className,
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-otaru-border/40">
              {title && (
                <h2 className="text-display-sm font-semibold tracking-tight text-otaru-ink">
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                className="ml-auto text-otaru-ink-muted hover:text-otaru-ink text-body-lg font-mono p-1"
                aria-label="Close drawer"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
