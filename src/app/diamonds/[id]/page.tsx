'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import DetailView from '../../../views/DetailView';
import { INITIAL_PRODUCTS } from '../../../views/ListingView';
import { useCart } from '../../../context/CartContext';
import { supabase, dbProductToProduct } from '../../../lib/supabase';
import type { Product } from '../../../components/ProductCard';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DiamondDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', resolvedParams.id)
          .single();

        if (!error && data) {
          setProduct(dbProductToProduct(data));
        } else {
          // Fallback to static mock if not found in db
          const mock = INITIAL_PRODUCTS.find((p) => p.id === resolvedParams.id);
          setProduct(mock ?? null);
        }
      } catch {
        const mock = INITIAL_PRODUCTS.find((p) => p.id === resolvedParams.id);
        setProduct(mock ?? null);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [resolvedParams.id]);

  const handleAddToCart = (prod: any, config: any) => {
    addToCart(prod, config);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--color-teal)' }} />
        <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Loading details...</span>
      </div>
    );
  }

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

  return (
    <DetailView 
      product={product} 
      onBack={() => router.push('/diamonds')} 
      onAddToCart={handleAddToCart} 
    />
  );
}
