'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Ring360Viewer from '../components/Ring360Viewer';
import TrustStrip from '../components/TrustStrip';
import CategoryCarousel from '../components/CategoryCarousel';
import Button from '../components/Button';
import './views.css';

export const HomeView: React.FC = () => {
  const router = useRouter();

  const popularStyles = [
    { name: 'Solitaire Settings', count: '14,230 styles', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=300&auto=format&fit=crop' },
    { name: 'Halo Settings', count: '8,450 styles', img: 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?q=80&w=300&auto=format&fit=crop' },
    { name: 'Hidden Halo', count: '4,120 styles', img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=300&auto=format&fit=crop' },
    { name: 'Three-Stone Rings', count: '3,890 styles', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=300&auto=format&fit=crop' },
  ];

  const handleStyleSelect = (styleName: string) => {
    router.push(`/engagement-rings`);
  };

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
            <video 
              playsInline 
              autoPlay 
              loop 
              muted 
              poster="https://cldnr.rarecarat.com/image/upload/v1722270634/home-next-gen/animated-ring-image-desktop-compressed.webp" 
              className="animated-ring-360"
              style={{
                width: '100%',
                maxWidth: '460px',
                height: 'auto',
                objectFit: 'contain',
                margin: '0 auto',
                display: 'block'
              }}
            >
              <source 
                src="https://cldnr.rarecarat.com/video/upload/v1722272873/home-next-gen/360-ring-desktop.mp4" 
                type="video/mp4" 
              />
            </video>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <TrustStrip />

      {/* Categories Carousel */}
      <CategoryCarousel />

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

      {/* Promo Band */}
      <section className="promo-band container">
        <div className="promo-card-inner">
          <div className="promo-info">
            <div className="badge badge-featured" style={{ marginBottom: '12px', display: 'inline-flex' }}>
              LIMITED TIME OFFER
            </div>
            <h3 className="h1-text" style={{ color: 'var(--color-ink)', marginBottom: '8px' }}>
              Claim $100 off your ring setting
            </h3>
            <p className="body-text" style={{ maxWidth: '480px', marginBottom: '24px' }}>
              Join our newsletter for exclusive offers, new arrival alerts, and get a $100 coupon valid for any gold or platinum ring setting.
            </p>
            <Button variant="gold" onClick={() => alert('Coupon code: LUXURYJEWEL100 applied at checkout!')}>
              Claim $100 off
            </Button>
          </div>
          <div className="promo-visual">
            <Ring360Viewer autoplay={true} metalColor="platinum" caratSize={1.1} width={280} height={280} />
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomeView;
