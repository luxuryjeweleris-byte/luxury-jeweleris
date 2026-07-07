'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ListingView from '../../views/ListingView';

function NecklacesContent() {
  const router = useRouter();

  const handleProductSelect = (product: any) => {
    router.push(`/diamonds/${product.id}`);
  };

  return (
    <ListingView
      initialFilters={{ category: 'necklaces' }}
      onProductSelect={handleProductSelect}
      pageTitle="Necklaces"
      pageSubtitle="Exquisite diamond necklaces and pendants — the perfect statement piece for any occasion."
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
