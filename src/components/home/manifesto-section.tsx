import { ManifestoSection as EditorialManifesto } from '../editorial/manifesto-section';

interface LegacyManifestoProps {
  headline?: string;
  quote?: string;
  author?: string;
  subtext?: string;
}

export function ManifestoSection(props: LegacyManifestoProps) {
  const quote =
    props.quote ??
    'We do not chase seasons. Every Artifact is designed with architectural precision, premium textiles, and permanent intention — built to be worn for a decade, not a quarter.';

  return <EditorialManifesto {...props} quote={quote} />;
}
