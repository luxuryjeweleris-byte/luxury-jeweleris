'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TrustStrip from '../components/TrustStrip';
import CategoryCarousel from '../components/CategoryCarousel';
import ProductCard, { Product } from '../components/ProductCard';
import Button from '../components/Button';
import { supabase, dbProductToProduct } from '../lib/supabase';
import './views.css';

export const HomeView: React.FC = () => {
  const router = useRouter();

  const heroVideos = [
    'https://res.cloudinary.com/gelkrliw/video/upload/v1785440765/products/v0coba9zahrupfdek7h8.mp4',
    'https://cldnr.rarecarat.com/video/upload/v1722272873/home-next-gen/360-ring-desktop.mp4',
  ];

  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const video1Ref = React.useRef<HTMLVideoElement | null>(null);
  const video2Ref = React.useRef<HTMLVideoElement | null>(null);

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('All Featured');

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        setLoadingProducts(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const mapped = data.map((dbProd: any) => dbProductToProduct(dbProd));
          setAllProducts(mapped);

          // Filter featured products
          const featured = mapped.filter((p: any) => p.isFeatured || data.find((d: any) => d.id === p.id && d.is_featured));
          setFeaturedProducts(featured.length > 0 ? featured : mapped.slice(0, 12));
        }
      } catch (err) {
        console.error('Error fetching home featured products:', err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchHomeProducts();
  }, []);

  const handleVideo1Ended = () => {
    if (video2Ref.current) {
      video2Ref.current.currentTime = 0;
      video2Ref.current.play().catch(() => {});
    }
    setActiveVideoIndex(1);
  };

  const handleVideo2Ended = () => {
    if (video1Ref.current) {
      video1Ref.current.currentTime = 0;
      video1Ref.current.play().catch(() => {});
    }
    setActiveVideoIndex(0);
  };

  const popularStyles = [
    { name: 'Solitaire Settings', count: '14,230 styles', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=300&auto=format&fit=crop' },
    { name: 'Halo Settings', count: '8,450 styles', img: 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?q=80&w=300&auto=format&fit=crop' },
    { name: 'Hidden Halo', count: '4,120 styles', img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=300&auto=format&fit=crop' },
    { name: 'Three-Stone Rings', count: '3,890 styles', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=300&auto=format&fit=crop' },
  ];

  const handleStyleSelect = (styleName: string) => {
    router.push(`/engagement-rings`);
  };

  const handleProductSelect = (product: Product) => {
    router.push(`/shop/${product.id}`);
  };

  const matchesCategory = (product: Product, categoryTab: string): boolean => {
    if (categoryTab === 'All Featured') return true;
    const cat = (product.category || '').toLowerCase();
    const name = (product.name || '').toLowerCase();
    const target = categoryTab.toLowerCase();

    if (target === 'rings') {
      return cat.includes('ring') || name.includes('ring') || cat.includes('engagement');
    }
    if (target === 'wedding bands') {
      return cat.includes('wedding') || cat.includes('band') || name.includes('band');
    }
    if (target === 'diamonds') {
      return cat.includes('diamond') || name.includes('diamond') || cat.includes('loose');
    }
    if (target === 'earrings') {
      return cat.includes('earring') || name.includes('earring') || cat.includes('stud') || cat.includes('hoop');
    }
    if (target === 'necklaces') {
      return cat.includes('necklace') || name.includes('necklace') || cat.includes('pendant') || name.includes('choker');
    }
    if (target === 'bracelets') {
      return cat.includes('bracelet') || name.includes('bracelet') || cat.includes('bangle');
    }
    if (target === 'gifts') {
      return cat.includes('gift') || name.includes('gift');
    }
    return cat.includes(target) || name.includes(target);
  };

  const filteredFeaturedProducts = React.useMemo(() => {
    return featuredProducts.filter(p => matchesCategory(p, activeCategoryTab));
  }, [featuredProducts, activeCategoryTab]);

  const CATEGORIES_LIST = [
    { key: 'Rings', title: 'Engagement & Fine Rings', path: '/engagement-rings', desc: 'Handcrafted solitaire, halo, and vintage ring designs.' },
    { key: 'Wedding Bands', title: 'Wedding & Eternity Bands', path: '/wedding-bands', desc: 'Timeless platinum, gold, and diamond anniversary bands.' },
    { key: 'Diamonds', title: 'Certified Loose Diamonds', path: '/diamonds', desc: 'Ethically sourced lab & natural certified diamonds.' },
    { key: 'Earrings', title: 'Diamond Earrings & Studs', path: '/earrings', desc: 'Sparkling diamond studs, huggies, and hoop earrings.' },
    { key: 'Necklaces', title: 'Necklaces & Pendants', path: '/necklaces', desc: 'Solitaire diamond pendants, chains, and chokers.' },
    { key: 'Bracelets', title: 'Tennis & Fine Bracelets', path: '/bracelets', desc: 'Elegant diamond tennis bracelets and gold bangles.' },
    { key: 'Gifts', title: 'Luxury Jewelry Gifts', path: '/gifts', desc: 'Curated gifts for anniversaries, birthdays & celebrations.' },
  ];

  return (
    <div className="home-view">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="badge badge-ai" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              ✦ Trusted by Thousands Worldwide
            </div>
            <h1 className="display-text hero-title">
              Timeless jewelry, crafted for you.
            </h1>
            <p className="hero-subtitle">
              Discover our curated collection of fine jewelry — from engagement rings to everyday elegance. Handcrafted with precision and passion.
            </p>
            <div className="hero-ctas">
              <Button variant="primary" onClick={() => router.push('/shop')}>
                Shop the Collection
              </Button>
              <Button variant="ghost" onClick={() => router.push('/engagement-rings')}>
                Engagement Rings
              </Button>
            </div>
          </div>
          <div className="hero-viewer">
            <div
              className="hero-video-stack"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '460px',
                aspectRatio: '1 / 1',
                margin: '0 auto',
                overflow: 'hidden',
                borderRadius: '16px',
                background: '#faf8f5',
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)'
              }}
            >
              {/* Video 1 */}
              <video
                ref={video1Ref}
                src={heroVideos[0]}
                playsInline
                autoPlay
                muted
                onEnded={handleVideo1Ended}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: activeVideoIndex === 0 ? 1 : 0,
                  zIndex: activeVideoIndex === 0 ? 2 : 1,
                  transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  pointerEvents: activeVideoIndex === 0 ? 'auto' : 'none',
                }}
              />

              {/* Video 2 */}
              <video
                ref={video2Ref}
                src={heroVideos[1]}
                playsInline
                muted
                onEnded={handleVideo2Ended}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: activeVideoIndex === 1 ? 1 : 0,
                  zIndex: activeVideoIndex === 1 ? 2 : 1,
                  transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  pointerEvents: activeVideoIndex === 1 ? 'auto' : 'none',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <TrustStrip />

      {/* Categories Carousel */}
      <CategoryCarousel />

      {/* FEATURED PRODUCTS SHOWCASE SECTION */}
      <section className="featured-section" style={{ padding: 'clamp(32px, 5vw, 64px) 0', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-soft)' }}>
        <div className="container-wide">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div className="badge badge-ai" style={{ marginBottom: '12px', display: 'inline-flex' }}>
              ✦ HANDPICKED CURATION
            </div>
            <h2 className="h2-text" style={{ fontSize: 'clamp(20px, 4vw, 32px)', fontWeight: 800, color: 'var(--color-ink)' }}>
              Featured Storefront Collection
            </h2>
            <p style={{ color: 'var(--color-slate)', fontSize: '15px', maxWidth: '680px', margin: '8px auto 0' }}>
              Handpicked luxury engagement rings, fine jewelry, certified diamonds &amp; exclusive gifts featured on our homepage.
            </p>
          </div>

          {/* Interactive Category Filter Tabs Bar */}
          <div className="category-filter-tabs-rail">
            {['All Featured', 'Rings', 'Wedding Bands', 'Diamonds', 'Earrings', 'Necklaces', 'Bracelets', 'Gifts'].map(cat => {
              const isActive = activeCategoryTab === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryTab(cat)}
                  className={`category-filter-tab${isActive ? ' active' : ''}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Product Grid - 5 Items Per Row on Desktop */}
          {loadingProducts ? (
            <div className="featured-products-grid">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="skeleton-card">
                  <div className="skeleton-image skeleton-pulse" />
                  <div className="skeleton-body">
                    <div className="skeleton-line skeleton-line-title skeleton-pulse" />
                    <div className="skeleton-line skeleton-line-price skeleton-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredFeaturedProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--color-card)', borderRadius: '16px', border: '1px dashed var(--color-border)', maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--color-ink)', fontWeight: 700 }}>No featured items in "{activeCategoryTab}" yet</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--color-slate)', marginTop: '6px', marginBottom: '20px' }}>
                Toggle "Featured: Show on homepage" in your admin product dashboard to feature products here.
              </p>
              <Button variant="primary" onClick={() => router.push('/shop')}>
                Explore Entire Catalog
              </Button>
            </div>
          ) : (
            <div className="featured-products-grid">
              {filteredFeaturedProducts.map(product => (
                <ProductCard key={product.id} product={product} onSelect={handleProductSelect} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* DEDICATED INDIVIDUAL CATEGORY SECTIONS */}
      {CATEGORIES_LIST.map((category) => {
        const catProducts = allProducts.filter(p => matchesCategory(p, category.key)).slice(0, 5);
        if (catProducts.length === 0) return null;

        return (
          <section key={category.key} style={{ padding: 'clamp(28px, 5vw, 56px) 0', borderBottom: '1px solid var(--color-border-soft)', background: 'var(--color-card)' }}>
            <div className="container-wide">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <span className="label-text" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '11px', color: 'var(--color-teal)' }}>
                    COLLECTION HIGHLIGHT
                  </span>
                  <h2 style={{ fontSize: 'clamp(18px, 3.5vw, 26px)', fontWeight: 800, color: 'var(--color-ink)', marginTop: '4px' }}>
                    {category.title}
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--color-slate)', marginTop: '2px' }}>
                    {category.desc}
                  </p>
                </div>
                <Button variant="outline" onClick={() => router.push(category.path)} style={{ fontSize: '13px', padding: '0 18px', height: '40px', flexShrink: 0, width: 'fit-content' }}>
                  View All {category.key} →
                </Button>
              </div>

              <div className="featured-products-grid">
                {catProducts.map(product => (
                  <ProductCard key={product.id} product={product} onSelect={handleProductSelect} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Horizontal style carousel */}
      <section className="styles-section">
        <div className="container">
          <div className="section-header">
            <span className="label-text">POPULAR STYLES</span>
            <h2 className="h2-text">Trending Engagement Rings</h2>
          </div>
        </div>
        
        <div className="styles-rail">
          {popularStyles.map((style) => (
            <div 
              key={style.name} 
              className="style-chip"
              onClick={() => handleStyleSelect(style.name)}
            >
              <img src={style.img} alt={style.name} className="style-chip-img" />
              <div className="style-chip-content">
                <span className="style-chip-title">{style.name}</span>
                <span className="style-chip-count">{style.count}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
export default HomeView;
