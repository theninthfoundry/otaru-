'use client';

import { useWishlist } from './wishlist-context';
import type { Artifact } from '@/lib/shopify/types';
import { HeartIcon } from '@/components/ui/icons';

interface WishlistButtonProps {
  artifact: Artifact;
  className?: string;
  showText?: boolean;
}

export function WishlistButton({
  artifact,
  className = '',
  showText = false,
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(artifact.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(artifact);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`group/wishlist flex items-center gap-2 transition-all p-2 rounded-full hover:bg-otaru-cream/80 ${className}`}
    >
      <HeartIcon
        size={18}
        className={`transition-colors ${
          active
            ? 'fill-otaru-ink text-otaru-ink'
            : 'fill-none text-otaru-ink-muted group-hover/wishlist:text-otaru-ink'
        }`}
      />
      {showText && (
        <span className="text-caption text-xs font-medium text-otaru-ink">
          {active ? 'Saved to Registry' : 'Save to Registry'}
        </span>
      )}
    </button>
  );
}
