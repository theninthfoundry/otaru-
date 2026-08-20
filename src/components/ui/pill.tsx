import React from 'react';
import { cn } from '@/lib/utils';

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
}

export function Pill({ className, active = false, children, ...props }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-4 py-1.5 rounded-full text-caption text-xs font-medium cursor-pointer transition-colors border',
        active
          ? 'bg-otaru-ink text-otaru-chalk border-otaru-ink'
          : 'bg-transparent text-otaru-ink-muted border-otaru-border hover:border-otaru-ink hover:text-otaru-ink',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
