'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ListingView from '../../views/ListingView';

function EngagementRingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const shape = searchParams.get('shape') || undefined;
  const style = searchParams.get('style') || undefined;
  const search = searchParams.get('search') || undefined;

  const initialFilters = React.useMemo(() => {
    return { category: 'engagement', shape, style, search };
  }, [shape, style, search]);

  const handleProductSelect = (product: any) => {
    router.push(`/shop/${product.id}`);
  };

  return (
    <ListingView
      initialFilters={initialFilters}
      onProductSelect={handleProductSelect}
      pageTitle="Engagement Rings"
      pageSubtitle="Find the perfect ring to celebrate your love — crafted with certified gemstones and timeless designs."
    />
  );
}

export default function EngagementRingsPage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <div className="caption-text">Loading engagement rings...</div>
      </div>
    }>
      <EngagementRingsContent />
    </Suspense>
  );
}
