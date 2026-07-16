'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ListingView from '../../views/ListingView';

function GiftsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const shape = searchParams.get('shape') || undefined;
  const style = searchParams.get('style') || undefined;
  const search = searchParams.get('search') || undefined;

  const initialFilters = React.useMemo(() => {
    return { category: 'gifts', shape, style, search };
  }, [shape, style, search]);

  const handleProductSelect = (product: any) => {
    router.push(`/diamonds/${product.id}`);
  };

  return (
    <ListingView
      initialFilters={initialFilters}
      onProductSelect={handleProductSelect}
      pageTitle="Gifts"
      pageSubtitle="Premium curated jewellery gifts for every milestone — beautifully presented and certified."
    />
  );
}

export default function GiftsPage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <div className="caption-text">Loading gifts...</div>
      </div>
    }>
      <GiftsContent />
    </Suspense>
  );
}
