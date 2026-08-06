'use client';

import { motion } from 'framer-motion';
import { useReveal } from '@/hooks/use-reveal';
import { cn } from '@/lib/utils';

interface AnimatedParagraphProps {
  children: React.ReactNode;
  className?: string;
  /** Delay before animation starts, in seconds. Default: 0 */
  delay?: number;
}

/**
 * Paragraph that fades in and translates upward on scroll entry.
 * Simple, elegant reveal for body text.
 */
export function AnimatedParagraph({
  children,
  className,
  delay = 0,
}: AnimatedParagraphProps) {
  const { ref, isRevealed } = useReveal<HTMLParagraphElement>();

  return (
    <motion.p
      ref={ref}
      className={cn('text-body-md text-otaru-ink-muted font-light leading-relaxed', className)}
      initial={{ opacity: 0, y: 24 }}
      animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.p>
  );
}
