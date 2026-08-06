import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  /** Intensity of blur. Default: 'md' */
  blur?: 'sm' | 'md' | 'lg';
}

const blurLevels = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-xl',
};

/**
 * Glassmorphism card with frosted backdrop, subtle border, and transparency.
 * Luxury aesthetic — use for overlays, featured content, floating panels.
 */
export function GlassCard({
  children,
  className,
  blur = 'md',
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative',
        'bg-otaru-chalk/60',
        blurLevels[blur],
        'border border-otaru-border/30',
        'rounded-[3px]',
        'shadow-otaru-sm',
        className,
      )}
    >
      {children}
    </div>
  );
}
