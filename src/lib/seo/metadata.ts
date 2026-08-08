import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/utils';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';

export function artifactMetadata(artifact: {
  title: string;
  artifactNumber: string;
  artifactName: string;
  description: string;
  handle: string;
  imageUrl?: string;
}): Metadata {
  const displayName = artifact.artifactName
    ? `Artifact ${artifact.artifactNumber} — "${artifact.artifactName}"`
    : artifact.title;

  return {
    title: displayName,
    description: artifact.description,
    alternates: {
      canonical: absoluteUrl(`/artifact/${artifact.handle}`),
    },
    openGraph: {
      title: displayName,
      description: artifact.description,
      url: absoluteUrl(`/artifact/${artifact.handle}`),
      siteName: SITE_NAME,
      type: 'website',
      ...(artifact.imageUrl
        ? { images: [{ url: artifact.imageUrl }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: displayName,
      description: artifact.description,
    },
  };
}

export function chapterMetadata(chapter: {
  title: string;
  chapterNumber: number;
  description?: string;
  slug: string;
}): Metadata {
  const title = `Chapter ${chapter.chapterNumber.toString().padStart(2, '0')} — "${chapter.title}"`;

  return {
    title,
    description: chapter.description ?? `Explore ${title} from ${SITE_NAME}.`,
    alternates: {
      canonical: absoluteUrl(`/chapter/${chapter.slug}`),
    },
    openGraph: {
      title,
      description: chapter.description ?? `Explore ${title} from ${SITE_NAME}.`,
      url: absoluteUrl(`/chapter/${chapter.slug}`),
      siteName: SITE_NAME,
      type: 'website',
    },
  };
}

export function defaultMetadata(): Metadata {
  return {
    title: {
      default: `${SITE_NAME} — Garments Worth Keeping`,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    ),
  };
}
