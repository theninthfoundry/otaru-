'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Artifact } from '@/lib/shopify/types';
import { ArtifactCard } from '@/components/artifact/artifact-card';
import { SkeletonCard } from '@/components/common/loading';

interface ArchiveGridProps {
  initialArtifacts: Artifact[];
  hasNextPage: boolean;
  endCursor: string | null;
}

export function ArchiveGrid({
  initialArtifacts,
  hasNextPage,
  endCursor,
}: ArchiveGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = () => {
    if (!endCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set('after', endCursor);

    router.push(`/archive?${params.toString()}`, { scroll: false });
    setIsLoadingMore(false);
  };

  if (initialArtifacts.length === 0) {
    return (
      <div className="py-24 text-center space-y-4">
        <p className="text-heading-md font-medium text-otaru-ink">
          No Artifacts found
        </p>
        <p className="text-body-md text-otaru-ink-muted max-w-md mx-auto">
          We couldn&apos;t find any items matching your selected criteria. Try adjusting your search or clearing filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div
        id="artifact-grid"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
      >
        {initialArtifacts.map((artifact, index) => (
          <ArtifactCard
            key={artifact.id}
            artifact={artifact}
            priority={index < 4}
          />
        ))}
      </div>

      {hasNextPage && endCursor && (
        <div className="flex flex-col items-center justify-center pt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-8 py-3 bg-otaru-ink text-otaru-chalk text-body-sm font-medium rounded-full hover:bg-otaru-ink-muted transition-colors disabled:opacity-50"
          >
            {isLoadingMore ? 'Loading More...' : 'Load More Artifacts'}
          </button>
        </div>
      )}
    </div>
  );
}

export function ArchiveGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
