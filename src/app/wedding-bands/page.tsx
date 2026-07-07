'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ListingView from '../../views/ListingView';

function WeddingBandsContent() {
  const router = useRouter();

  const handleProductSelect = (product: any) => {
    router.push(`/diamonds/${product.id}`);
  };

  return (
    <ListingView
      initialFilters={{ category: 'wedding' }}
      onProductSelect={handleProductSelect}
      pageTitle="Wedding Bands"
      pageSubtitle="Elegant wedding bands for every style — from classic gold to diamond-studded eternity bands."
    />
  );
}

export default function WeddingBandsPage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <div className="caption-text">Loading wedding bands...</div>
      </div>
    }>
      <WeddingBandsContent />
    </Suspense>
  );
}
