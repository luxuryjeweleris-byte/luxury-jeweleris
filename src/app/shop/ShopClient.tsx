'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ListingView from '../../views/ListingView';

function ShopContent() {
  const router = useRouter();

  const handleProductSelect = (product: any, metal?: string) => {
    router.push(`/shop/${product.id}${metal ? `?metal=${metal}` : ''}`);
  };

  return (
    <ListingView
      initialFilters={{}}
      onProductSelect={handleProductSelect}
      pageTitle="Shop All Jewelry"
      pageSubtitle="Explore our complete collection of exquisite jewelry — handcrafted with passion and precision."
    />
  );
}

export default function ShopClient() {
  return (
    <Suspense fallback={
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <div className="caption-text">Loading shop...</div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
