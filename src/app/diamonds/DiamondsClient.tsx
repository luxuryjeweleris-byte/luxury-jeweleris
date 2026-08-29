'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ListingView from '../../views/ListingView';

function DiamondsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const shape = searchParams.get('shape') || undefined;
  const style = searchParams.get('style') || undefined;
  const search = searchParams.get('search') || undefined;

  const initialFilters = React.useMemo(() => {
    return { category: 'diamond', shape, style, search };
  }, [shape, style, search]);

  const handleProductSelect = (product: any) => {
    router.push(`/shop/${product.id}`);
  };

  return (
    <ListingView 
      initialFilters={initialFilters} 
      onProductSelect={handleProductSelect} 
      pageTitle="Lab Diamonds"
      pageSubtitle="Browse certified lab grown diamonds — ethical, eco-friendly, and chemically identical with brilliant fire."
    />
  );
}

export default function DiamondsClient() {
  return (
    <Suspense fallback={
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <div className="caption-text">Loading diamonds search...</div>
      </div>
    }>
      <DiamondsContent />
    </Suspense>
  );
}
