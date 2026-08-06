import type { Artifact } from '@/lib/shopify/types';
import { ArtifactCard } from '@/components/artifact/artifact-card';

/**
 * Grid of Artifacts within a Chapter.
 */
interface ChapterArtifactsProps {
  artifacts: Artifact[];
  chapterTitle: string;
}

export function ChapterArtifacts({ artifacts, chapterTitle }: ChapterArtifactsProps) {
  if (artifacts.length === 0) {
    return (
      <div className="text-body-sm text-otaru-ink-muted">
        No Artifacts in this Chapter yet.
      </div>
    );
  }

  return (
    <div
      id="chapter-artifact-grid"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      role="list"
      aria-label={`Artifacts in ${chapterTitle}`}
    >
      {artifacts.map((artifact) => (
        <div key={artifact.id} role="listitem">
          <ArtifactCard artifact={artifact} />
        </div>
      ))}
    </div>
  );
}
