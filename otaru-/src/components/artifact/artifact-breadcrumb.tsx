import Link from 'next/link';

/**
 * Breadcrumb navigation for Artifact pages.
 */
interface ArtifactBreadcrumbProps {
  artifactName: string;
  chapterSlug?: string;
  chapterTitle?: string;
}

export function ArtifactBreadcrumb({
  artifactName,
  chapterSlug,
  chapterTitle,
}: ArtifactBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" id="artifact-breadcrumb-nav">
      <ol className="flex items-center gap-2 text-body-sm text-otaru-ink-muted">
        <li>
          <Link href="/archive" className="hover:text-otaru-ink transition-colors duration-200">
            Archive
          </Link>
        </li>
        <li aria-hidden="true" className="text-otaru-stone">
          /
        </li>
        {chapterSlug && chapterTitle && (
          <>
            <li>
              <Link
                href={`/chapter/${chapterSlug}`}
                className="hover:text-otaru-ink transition-colors duration-200"
              >
                {chapterTitle}
              </Link>
            </li>
            <li aria-hidden="true" className="text-otaru-stone">
              /
            </li>
          </>
        )}
        <li aria-current="page" className="text-otaru-ink">
          {artifactName}
        </li>
      </ol>
    </nav>
  );
}
