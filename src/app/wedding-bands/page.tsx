'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ListingView from '../../views/ListingView';

function WeddingBandsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const shape = searchParams.get('shape') || undefined;
  const style = searchParams.get('style') || undefined;
  const search = searchParams.get('search') || undefined;

  const initialFilters = React.useMemo(() => {
    return { category: 'wedding', shape, style, search };
  }, [shape, style, search]);

  const handleProductSelect = (product: any) => {
    router.push(`/shop/${product.id}`);
  };

  return (
    <ListingView
      initialFilters={initialFilters}
      onProductSelect={handleProductSelect}
      pageTitle="Wedding Bands"
      pageSubtitle="Elegant wedding bands for every style — from classic gold to gemstone-studded eternity bands."
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
