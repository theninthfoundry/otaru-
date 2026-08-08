import { cn } from '@/lib/utils';

interface BadgeProps {
  count: number;
  max?: number;
  className?: string;
}

export function Badge({ count, max = 9, className }: BadgeProps) {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        'min-w-[18px] h-[18px] px-1',
        'bg-otaru-ink text-otaru-chalk',
        'text-[10px] font-bold leading-none',
        'rounded-full',
        className,
      )}
      aria-label={`${count} items`}
    >
      {displayCount}
    </span>
  );
}
