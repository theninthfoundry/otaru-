import type { Artifact } from '@/lib/shopify/types';

/**
 * Material/construction spec display — §2.7 format.
 */
interface ArtifactSpecsProps {
  artifact: Artifact;
}

export function ArtifactSpecs({ artifact }: ArtifactSpecsProps) {
  const specs = [
    artifact.gsm,
    artifact.construction,
    artifact.wash,
    artifact.printTechnique,
  ].filter(Boolean);

  if (specs.length === 0) return null;

  return (
    <div id="artifact-material-specs" className="text-body-sm text-otaru-ink-muted">
      <p>{specs.join(' · ')}</p>
    </div>
  );
}
