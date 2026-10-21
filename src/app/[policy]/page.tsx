import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalDocument } from '@/components/legal/LegalDocument';
import { policies, policySlugs, type LegalSlug } from '../../../content/legal';

export const dynamicParams = false;

type Props = { params: Promise<{ policy: string }> };

function find(slug: string) {
  return (policySlugs as readonly string[]).includes(slug) ? policies[slug as LegalSlug] : undefined;
}

export function generateStaticParams() {
  return policySlugs.map((policy) => ({ policy }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { policy } = await params;
  const doc = find(policy);
  return doc ? { title: doc.title, description: doc.description, alternates: { canonical: `/${doc.slug}` } } : {};
}

export default async function PolicyPage({ params }: Props) {
  const { policy } = await params;
  const doc = find(policy);
  if (!doc) notFound();
  return <LegalDocument policy={doc} />;
}
