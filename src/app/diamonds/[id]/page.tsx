'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import DetailView from '../../../views/DetailView';
import { INITIAL_PRODUCTS } from '../../../views/ListingView';
import { useCart } from '../../../context/CartContext';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DiamondDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart } = useCart();

  const product = INITIAL_PRODUCTS.find((p) => p.id === resolvedParams.id);

  if (!product) {
    return (
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <h2 className="h2-text">Listing Not Found</h2>
        <p className="body-text" style={{ margin: '16px 0' }}>The requested stone listing could not be found or has been sold.</p>
        <button className="btn btn-primary" onClick={() => router.push('/diamonds')}>
          Back to Diamonds Listing
        </button>
      </div>
    );
  }

  const handleAddToCart = (prod: any, config: any) => {
    addToCart(prod, config);
  };

  return (
    <DetailView 
      product={product} 
      onBack={() => router.push('/diamonds')} 
      onAddToCart={handleAddToCart} 
    />
  );
}
