'use client';

import { motion } from 'framer-motion';
import { useReveal } from '@/hooks/use-reveal';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  /** Small overline text above heading */
  overline?: string;
  /** Main heading text */
  heading: string;
  /** Optional subtext below heading */
  subtext?: string;
  /** Text alignment. Default: 'left' */
  align?: 'left' | 'center';
  /** Use display/serif font for heading. Default: false */
  serif?: boolean;
  className?: string;
}

/**
 * Reusable editorial section header with overline + heading + subtext.
 * Animates on scroll with staggered reveal.
 */
export function SectionHeading({
  overline,
  heading,
  subtext,
  align = 'left',
  serif = false,
  className,
}: SectionHeadingProps) {
  const { ref, isRevealed } = useReveal<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      className={cn(
        'space-y-3',
        align === 'center' && 'text-center',
        className,
      )}
      initial="hidden"
      animate={isRevealed ? 'visible' : 'hidden'}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {overline && (
        <motion.p
          className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {overline}
        </motion.p>
      )}

      <motion.h2
        className={cn(
          'text-display-sm font-semibold tracking-tight text-otaru-ink',
          serif && 'font-display italic',
        )}
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {heading}
      </motion.h2>

      {subtext && (
        <motion.p
          className={cn(
            'text-body-md text-otaru-ink-muted font-light leading-relaxed',
            align === 'center' ? 'max-w-xl mx-auto' : 'max-w-xl',
          )}
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {subtext}
        </motion.p>
      )}
    </motion.div>
  );
}
