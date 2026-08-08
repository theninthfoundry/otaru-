'use client';

import { motion } from 'framer-motion';
import { useReveal } from '@/hooks/use-reveal';
import { cn } from '@/lib/utils';

interface ImageRevealProps {
  src: string;
  alt: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  aspectRatio?: string;
  className?: string;
}

const clipPaths = {
  up: {
    hidden: 'inset(100% 0 0 0)',
    visible: 'inset(0 0 0 0)',
  },
  down: {
    hidden: 'inset(0 0 100% 0)',
    visible: 'inset(0 0 0 0)',
  },
  left: {
    hidden: 'inset(0 100% 0 0)',
    visible: 'inset(0 0 0 0)',
  },
  right: {
    hidden: 'inset(0 0 0 100%)',
    visible: 'inset(0 0 0 0)',
  },
};

export function ImageReveal({
  src,
  alt,
  direction = 'up',
  aspectRatio = 'aspect-[4/5]',
  className,
}: ImageRevealProps) {
  const { ref, isRevealed } = useReveal<HTMLDivElement>();
  const paths = clipPaths[direction];

  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden bg-otaru-cream',
        aspectRatio,
        className,
      )}
    >
      <motion.img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
        initial={{
          clipPath: paths.hidden,
          scale: 1.15,
        }}
        animate={
          isRevealed
            ? { clipPath: paths.visible, scale: 1 }
            : { clipPath: paths.hidden, scale: 1.15 }
        }
        transition={{
          clipPath: { duration: 1, ease: [0.22, 1, 0.36, 1] },
          scale: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
        }}
      />
    </div>
  );
}
