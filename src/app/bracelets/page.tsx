'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ListingView from '../../views/ListingView';

function BraceletsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const shape = searchParams.get('shape') || undefined;
  const style = searchParams.get('style') || undefined;
  const search = searchParams.get('search') || undefined;

  const initialFilters = React.useMemo(() => {
    return { category: 'bracelets', shape, style, search };
  }, [shape, style, search]);

  const handleProductSelect = (product: any) => {
    router.push(`/diamonds/${product.id}`);
  };

  return (
    <ListingView
      initialFilters={initialFilters}
      onProductSelect={handleProductSelect}
      pageTitle="Bracelets"
      pageSubtitle="Luxurious diamond bracelets — from classic tennis bracelets to bold modern bangles."
    />
  );
}

export default function BraceletsPage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <div className="caption-text">Loading bracelets...</div>
      </div>
    }>
      <BraceletsContent />
    </Suspense>
  );
}
