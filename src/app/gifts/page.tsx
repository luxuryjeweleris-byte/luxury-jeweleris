'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ListingView from '../../views/ListingView';

function GiftsContent() {
  const router = useRouter();

  const handleProductSelect = (product: any) => {
    router.push(`/shop/${product.id}`);
  };

  return (
    <ListingView
      initialFilters={{ category: 'gifts' }}
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
