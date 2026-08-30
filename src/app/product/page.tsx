'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductDetailView } from '@/components/product/ProductDetailView';

function ProductPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '041';

  return <ProductDetailView productId={id} />;
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ padding: '12rem 0', textAlign: 'center' }}>Loading artifact…</div>}>
      <ProductPageContent />
    </Suspense>
  );
}
