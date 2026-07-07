'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ListingView from '../../views/ListingView';

function EngagementRingsContent() {
  const router = useRouter();

  const handleProductSelect = (product: any) => {
    router.push(`/diamonds/${product.id}`);
  };

  return (
    <ListingView
      initialFilters={{ category: 'engagement' }}
      onProductSelect={handleProductSelect}
      pageTitle="Engagement Rings"
      pageSubtitle="Find the perfect ring to celebrate your love — crafted with certified diamonds and timeless designs."
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
