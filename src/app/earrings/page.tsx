'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ListingView from '../../views/ListingView';

function EarringsContent() {
  const router = useRouter();

  const handleProductSelect = (product: any) => {
    router.push(`/diamonds/${product.id}`);
  };

  return (
    <ListingView
      initialFilters={{ category: 'earrings' }}
      onProductSelect={handleProductSelect}
      pageTitle="Earrings"
      pageSubtitle="Stunning diamond earrings — from understated studs to glamorous hoops and drops."
    />
  );
}

export default function EarringsPage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <div className="caption-text">Loading earrings...</div>
      </div>
    }>
      <EarringsContent />
    </Suspense>
  );
}
