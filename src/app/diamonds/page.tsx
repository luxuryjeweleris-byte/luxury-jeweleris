'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ListingView from '../../views/ListingView';

function ListingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const shape = searchParams.get('shape') || undefined;
  const style = searchParams.get('style') || undefined;

  const initialFilters = React.useMemo(() => {
    return { shape, style };
  }, [shape, style]);

  const handleProductSelect = (product: any) => {
    router.push(`/diamonds/${product.id}`);
  };

  return (
    <ListingView 
      initialFilters={initialFilters} 
      onProductSelect={handleProductSelect} 
    />
  );
}

export default function DiamondsPage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <div className="caption-text">Loading diamonds search...</div>
      </div>
    }>
      <ListingPageContent />
    </Suspense>
  );
}
