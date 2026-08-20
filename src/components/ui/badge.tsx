import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'sold';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-otaru-ink text-otaru-chalk',
    secondary: 'bg-otaru-chalk-warm text-otaru-ink',
    outline: 'border border-otaru-border text-otaru-ink-muted',
    sold: 'bg-otaru-ink-subtle text-otaru-chalk',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-widest font-semibold',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
