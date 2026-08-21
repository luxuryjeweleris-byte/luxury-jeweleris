'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import TrustStrip from '../components/TrustStrip';
import CategoryCarousel from '../components/CategoryCarousel';
import ProductCard, { Product } from '../components/ProductCard';
import Button from '../components/Button';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { supabase, dbProductToProduct } from '../lib/supabase';
import { isCategoryMatch } from '../lib/categoryUtils';
import './views.css';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  tags: string[] | null;
  body: string | null;
  published_at: string | null;
  author_name: string | null;
}

function estimateReadTime(body: string | null): string {
  if (!body) return '1 min read';
  const words = body.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

export const HomeView: React.FC = () => {
  const router = useRouter();
  const { getSetting } = useSiteSettings();

  const heroBadge = getSetting('hero_badge_text', '✦ Trusted by Thousands Worldwide');
  const heroTitle = getSetting('hero_title', 'Timeless jewelry, crafted for you.');
  const heroSubtitle = getSetting('hero_subtitle', 'Discover our curated collection of fine jewelry — from engagement rings to everyday elegance. Handcrafted with precision and passion.');

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
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

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

  // Fetch latest 3 blog posts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const { data } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, cover_image, tags, body, published_at, author_name')
          .eq('is_published', true)
          .order('published_at', { ascending: false })
          .limit(3);
        if (data) setBlogPosts(data as BlogPost[]);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      }
    };
    fetchBlogPosts();
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

  const handleProductSelect = (product: Product) => {
    router.push(`/shop/${product.id}`);
  };

  const matchesCategory = (product: Product, categoryTab: string): boolean => {
    if (categoryTab === 'All Featured') return true;
    return isCategoryMatch(product.category, categoryTab);
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
              {heroBadge}
            </div>
            <h1 className="display-text hero-title">
              {heroTitle}
            </h1>
            <p className="hero-subtitle">
              {heroSubtitle}
            </p>
            <div className="hero-ctas">
              <Button variant="primary" onClick={() => router.push('/shop')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                🛍️ Shop the Collection
              </Button>
              <Button variant="ghost" onClick={() => router.push('/engagement-rings')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                💍 View Engagement Rings
              </Button>
            </div>
          </div>
          <div className="hero-viewer">
            <div
              className="hero-video-stack"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '320px',
                aspectRatio: '1 / 1',
                margin: '0 auto',
                overflow: 'hidden',
                borderRadius: '16px',
                background: 'transparent',
              }}
            >
              {/* Video 1 */}
              <video
                ref={video1Ref}
                src={heroVideos[0]}
                playsInline
                autoPlay
                muted
                crossOrigin="anonymous"
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
                  mixBlendMode: 'multiply',
                  filter: 'contrast(1.04) brightness(1.02)'
                }}
              />

              {/* Video 2 */}
              <video
                ref={video2Ref}
                src={heroVideos[1]}
                playsInline
                muted
                crossOrigin="anonymous"
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
                  mixBlendMode: 'multiply',
                  filter: 'contrast(1.08) brightness(1.04)'
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

      {/* ── JOURNAL SECTION ──────────────────────── */}
      <section className="home-blog-section">
        <div className="container-wide">
          <div className="home-blog-header">
            <div>
              <span className="label-text" style={{ color: 'var(--color-teal)', letterSpacing: '1.2px', fontSize: '11px' }}>
                JEWELRY JOURNAL
              </span>
              <h2 className="h2-text" style={{ fontSize: 'clamp(20px, 3.5vw, 28px)', fontWeight: 800, color: 'var(--color-ink)', marginTop: '4px' }}>
                Latest from Our Blog
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-slate)', marginTop: '4px' }}>
                Expert guides, jewelry trends &amp; gemstone education.
              </p>
            </div>
            <Link href="/blog" className="home-blog-view-all">
              All Articles <ArrowRight size={14} />
            </Link>
          </div>

          {blogPosts.length > 0 ? (
            <div className="home-blog-grid">
              {blogPosts.map((post, idx) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className={`home-blog-card ${idx === 0 ? 'home-blog-card-featured' : ''}`}>
                  <div className="home-blog-card-img-wrap">
                    {post.cover_image ? (
                      <img src={post.cover_image} alt={post.title} className="home-blog-card-img" />
                    ) : (
                      <div className="home-blog-card-img-placeholder">
                        <BookOpen size={32} />
                      </div>
                    )}
                    {(post.tags ?? []).length > 0 && (
                      <span className="home-blog-card-tag">{post.tags![0]}</span>
                    )}
                  </div>
                  <div className="home-blog-card-body">
                    <h3 className="home-blog-card-title">{post.title}</h3>
                    {post.excerpt && (
                      <p className="home-blog-card-excerpt">{post.excerpt}</p>
                    )}
                    <div className="home-blog-card-meta">
                      <Clock size={12} />
                      <span>{estimateReadTime(post.body)}</span>
                      <span style={{ color: '#CBD5E1' }}>·</span>
                      <span>{post.author_name || 'Luxury Jeweleris'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* CTA Banner when no posts yet */
            <div className="home-blog-cta-banner">
              <div className="home-blog-cta-icon">
                <BookOpen size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '4px' }}>
                  Discover Our Jewelry Journal
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-slate)', marginBottom: '16px' }}>
                  Gemstone guides, ring buying tips, metal comparisons &amp; more — written by certified gemologists.
                </p>
                <Button variant="primary" onClick={() => router.push('/blog')}>
                  Visit the Journal
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
