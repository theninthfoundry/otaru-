'use client';

import { motion } from 'framer-motion';
import { useReveal } from '@/hooks/use-reveal';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface RevealTextProps {
  children: ReactNode;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div';
  direction?: 'up' | 'down' | 'left' | 'right';
  stagger?: number;
  delay?: number;
  className?: string;
}

const directionVariants = {
  up: { hidden: { y: '100%', opacity: 0 }, visible: { y: 0, opacity: 1 } },
  down: { hidden: { y: '-100%', opacity: 0 }, visible: { y: 0, opacity: 1 } },
  left: { hidden: { x: '100%', opacity: 0 }, visible: { x: 0, opacity: 1 } },
  right: { hidden: { x: '-100%', opacity: 0 }, visible: { x: 0, opacity: 1 } },
};

export function RevealText({
  children,
  as: Tag = 'div',
  direction = 'up',
  stagger = 0.04,
  delay = 0,
  className,
}: RevealTextProps) {
  const { ref, isRevealed } = useReveal<HTMLDivElement>();
  const MotionTag = motion.create(Tag);

  if (typeof children === 'string') {
    const words = children.split(/\s+/);
    return (
      <MotionTag
        ref={ref}
        className={cn('flex flex-wrap', className)}
        initial="hidden"
        animate={isRevealed ? 'visible' : 'hidden'}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
      >
        {words.map((word, i) => (
          <span key={i} className="overflow-hidden inline-block mr-[0.3em]">
            <motion.span
              className="inline-block"
              variants={directionVariants[direction]}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </MotionTag>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
