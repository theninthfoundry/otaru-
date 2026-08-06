import { cn } from '@/lib/utils';

/**
 * Skeleton loading components matching real component shapes.
 */

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="aspect-[3/4] bg-otaru-cream rounded" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-16 bg-otaru-cream rounded" />
        <div className="h-4 w-32 bg-otaru-cream rounded" />
        <div className="h-3 w-20 bg-otaru-cream rounded" />
      </div>
    </div>
  );
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('animate-pulse space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-otaru-cream rounded"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
}

export function SkeletonImage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse aspect-[3/4] bg-otaru-cream rounded',
        className,
      )}
    />
  );
}
