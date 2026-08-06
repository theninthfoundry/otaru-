'use client';

import { motion } from 'framer-motion';
import { useReveal } from '@/hooks/use-reveal';
import { cn } from '@/lib/utils';

interface HeroTitleProps {
  children: string;
  /** Element type. Default: 'h1' */
  as?: 'h1' | 'h2';
  /** Use serif display font. Default: false */
  serif?: boolean;
  className?: string;
}

/**
 * Massive animated hero text with staggered word reveal.
 * Each word clips in from below with elastic easing.
 * Designed for homepage and chapter hero sections.
 */
export function HeroTitle({
  children,
  as: Tag = 'h1',
  serif = false,
  className,
}: HeroTitleProps) {
  const { ref, isRevealed } = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const words = children.split(/\s+/);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={cn(
        'text-display-xl md:text-[5.5rem] lg:text-[7rem]',
        'font-bold tracking-tight leading-[0.95] text-otaru-ink',
        'flex flex-wrap gap-x-[0.25em]',
        serif && 'font-display italic font-normal',
        className,
      )}
    >
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '110%', rotateX: -40 }}
            animate={
              isRevealed
                ? { y: 0, rotateX: 0 }
                : { y: '110%', rotateX: -40 }
            }
            transition={{
              duration: 0.9,
              delay: i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
