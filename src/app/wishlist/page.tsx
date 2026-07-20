'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Loader2, ArrowLeft } from 'lucide-react';
import { supabase, dbProductToProduct } from '../../lib/supabase';
import ProductCard, { type Product } from '../../components/ProductCard';

export default function WishlistPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // Redirect to login if not authenticated
        router.push('/login');
        return;
      }

      setUser(session.user);

      // Fetch wishlist items
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', session.user.id);

      if (wishlistError || !wishlistData || wishlistData.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }

      const productIds = wishlistData.map(item => item.product_id);

      // Fetch products matching the IDs
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      if (!productsError && productsData) {
        setWishlistProducts(productsData.map(dbProductToProduct));
      }
      setLoading(false);
    };

    loadWishlist();
  }, [router]);

  const handleProductSelect = (product: Product) => {
    router.push(`/diamonds/${product.id}`);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--color-teal)' }} />
        <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Loading your favorites...</span>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '48px var(--space-4)', minHeight: '70vh' }}>
      {/* Breadcrumb / Back Link */}
      <div style={{ marginBottom: '24px' }}>
        <Link href="/diamonds" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-teal)', textDecoration: 'none', fontWeight: '600' }}>
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
        <Heart size={28} fill="var(--color-teal)" style={{ color: 'var(--color-teal)' }} />
        <div>
          <h1 className="h1-text" style={{ fontSize: '28px', marginBottom: '4px' }}>My Favorites</h1>
          <p className="body-text" style={{ fontSize: '14px', color: '#64748b' }}>
            Products you have saved to your wishlist.
          </p>
        </div>
      </div>

      {wishlistProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <Heart size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Your Wishlist is Empty</h2>
          <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '360px', margin: '0 auto 24px' }}>
            Explore our collection of fine jewelry and tap the heart icon to save products here.
          </p>
          <Link href="/diamonds" style={{ textDecoration: 'none', display: 'inline-flex', padding: '10px 24px', background: 'var(--color-teal)', color: 'white', borderRadius: '6px', fontWeight: '600' }}>
            Explore Diamonds
          </Link>
        </div>
      ) : (
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {wishlistProducts.map(product => (
            <ProductCard key={product.id} product={product} onSelect={handleProductSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

