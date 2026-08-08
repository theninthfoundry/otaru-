'use client';

import { motion } from 'framer-motion';
import { useReveal } from '@/hooks/use-reveal';
import { cn } from '@/lib/utils';

interface RevealTextProps {
  children: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'span';
  direction?: 'up' | 'down' | 'left' | 'right';
  stagger?: number;
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
  as: Tag = 'p',
  direction = 'up',
  stagger = 0.04,
  className,
}: RevealTextProps) {
  const { ref, isRevealed } = useReveal<HTMLDivElement>();
  const words = children.split(/\s+/);
  const MotionTag = motion.create(Tag);

  return (
    <MotionTag
      ref={ref}
      className={cn('flex flex-wrap', className)}
      initial="hidden"
      animate={isRevealed ? 'visible' : 'hidden'}
      transition={{ staggerChildren: stagger }}
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
