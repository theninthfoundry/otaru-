import React from 'react';
import { ProductDetailView } from '@/components/product/ProductDetailView';

interface ArtifactPageProps {
  params: Promise<{ handle: string }>;
}

const HANDLE_TO_ID: Record<string, string> = {
  'yama-field-jacket': '041',
  'kiryu-wrap-trouser': '042',
  'biratori-overshirt': '043',
  'omi-hemp-tote': '044',
  'otaru-deck-coat': '038',
  'tsukiji-apron-shirt': '037',
  'hakodate-watch-cap': '036',
  'nemuro-wide-trouser': '035',
  'rishiri-rain-shell': '034',
  'wakkanai-muffler': '033',
};

export default async function ArtifactHandlePage({ params }: ArtifactPageProps) {
  const { handle } = await params;
  const id = HANDLE_TO_ID[handle] || handle || '041';

  return <ProductDetailView productId={id} />;
}
