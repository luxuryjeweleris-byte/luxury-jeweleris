'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ListingView from '../../views/ListingView';

function NecklacesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const shape = searchParams.get('shape') || undefined;
  const style = searchParams.get('style') || undefined;
  const search = searchParams.get('search') || undefined;

  const initialFilters = React.useMemo(() => {
    return { category: 'necklaces', shape, style, search };
  }, [shape, style, search]);

  const handleProductSelect = (product: any) => {
    router.push(`/shop/${product.id}`);
  };

  return (
    <ListingView
      initialFilters={initialFilters}
      onProductSelect={handleProductSelect}
      pageTitle="Necklaces"
      pageSubtitle="Exquisite fine necklaces and pendants — the perfect statement piece for any occasion."
    />
  );
}

export default function NecklacesPage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <div className="caption-text">Loading necklaces...</div>
      </div>
    }>
      <NecklacesContent />
    </Suspense>
  );
}
