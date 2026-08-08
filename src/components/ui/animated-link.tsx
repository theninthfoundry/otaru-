'use client';

import Link from 'next/link';
import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedLinkProps extends ComponentProps<typeof Link> {
  variant?: 'slide' | 'fade' | 'expand';
}

export function AnimatedLink({
  variant = 'slide',
  className,
  children,
  ...props
}: AnimatedLinkProps) {
  const underlineStyles = {
    slide:
      'after:origin-left after:scale-x-0 hover:after:scale-x-100',
    fade:
      'after:opacity-0 hover:after:opacity-100',
    expand:
      'after:origin-center after:scale-x-0 hover:after:scale-x-100',
  };

  return (
    <Link
      className={cn(
        'relative inline-block text-otaru-ink transition-colors duration-subtle',
        'after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full',
        'after:bg-otaru-ink after:transition-transform after:duration-editorial after:ease-editorial',
        underlineStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
