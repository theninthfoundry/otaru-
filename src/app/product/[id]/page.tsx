import React from 'react';
import { ProductDetailView } from '@/components/product/ProductDetailView';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  return <ProductDetailView productId={id} />;
}
