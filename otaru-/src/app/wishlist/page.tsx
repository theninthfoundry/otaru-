'use client';

import Link from 'next/link';
import { useWishlist } from '@/components/wishlist/wishlist-context';
import { ArtifactCard } from '@/components/artifact/artifact-card';

export default function WishlistPage() {
  const { wishlist, clearWishlist, wishlistCount } = useWishlist();

  return (
    <section id="wishlist" aria-label="Private Registry Wishlist" className="py-12 md:py-20">
      <div className="grid-container space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-otaru-border/40 pb-6">
          <div>
            <span className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold">
              Private Registry
            </span>
            <h1 className="text-display-lg font-bold tracking-tight text-otaru-ink mt-1">
              Saved Artifacts ({wishlistCount})
            </h1>
          </div>

          {wishlistCount > 0 && (
            <button
              onClick={clearWishlist}
              className="text-caption text-xs text-otaru-ink-muted hover:text-otaru-ink underline self-start md:self-auto transition-colors"
            >
              Clear All Saved Pieces
            </button>
          )}
        </header>

        {/* Wishlist Grid */}
        {wishlistCount > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {wishlist.map((artifact) => (
              <ArtifactCard key={artifact.id} artifact={artifact} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-4 max-w-md mx-auto">
            <p className="text-heading-md font-semibold text-otaru-ink">
              Your registry is empty
            </p>
            <p className="text-body-md text-otaru-ink-muted font-light leading-relaxed">
              Bookmark pieces while exploring the archive to create your personal collection of garments.
            </p>
            <div className="pt-4">
              <Link
                href="/archive"
                className="px-8 py-3 bg-otaru-ink text-otaru-chalk text-body-sm font-medium rounded-full hover:bg-otaru-ink-muted transition-colors inline-block"
              >
                Explore Archive
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
