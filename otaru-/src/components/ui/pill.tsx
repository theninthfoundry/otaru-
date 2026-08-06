import { cn } from '@/lib/utils';

interface PillProps {
  children: React.ReactNode;
  /** Visual variant. Default: 'default' */
  variant?: 'default' | 'accent' | 'muted' | 'outline';
  className?: string;
}

const pillVariants = {
  default: 'bg-otaru-cream text-otaru-ink',
  accent: 'bg-otaru-ink text-otaru-chalk',
  muted: 'bg-otaru-cream-deep/50 text-otaru-ink-muted',
  outline: 'bg-transparent border border-otaru-border text-otaru-ink-muted',
};

/**
 * Small tag/label component for categories, filters, statuses.
 */
export function Pill({ children, variant = 'default', className }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1',
        'text-[11px] font-medium tracking-wide uppercase',
        'rounded-[2px] select-none',
        pillVariants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
