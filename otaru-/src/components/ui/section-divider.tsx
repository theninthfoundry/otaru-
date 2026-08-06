import { cn } from '@/lib/utils';

interface SectionDividerProps {
  /** Optional label centered in the divider */
  label?: string;
  className?: string;
}

/**
 * Elegant horizontal divider with optional centered label.
 * Uses the brand border color for subtlety.
 */
export function SectionDivider({ label, className }: SectionDividerProps) {
  if (label) {
    return (
      <div
        className={cn(
          'flex items-center gap-6',
          'text-overline tracking-widest uppercase text-otaru-ink-subtle text-[10px] font-semibold',
          className,
        )}
        role="separator"
      >
        <div className="flex-1 h-px bg-otaru-border/40" />
        <span className="shrink-0 select-none">{label}</span>
        <div className="flex-1 h-px bg-otaru-border/40" />
      </div>
    );
  }

  return (
    <hr
      className={cn('border-none h-px bg-otaru-border/40', className)}
      role="separator"
    />
  );
}
