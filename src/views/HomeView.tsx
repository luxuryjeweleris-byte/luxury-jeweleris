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

  const shapes = [
    { name: 'Round', img: 'https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/round.webp' },
    { name: 'Oval', img: 'https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/oval.webp' },
    { name: 'Cushion', img: 'https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/cushion.webp' },
    { name: 'Emerald', img: 'https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/emerald.webp' },
    { name: 'Princess', img: 'https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/princess.webp' },
    { name: 'Radiant', img: 'https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/radiant.webp' },
    { name: 'Pear', img: 'https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/pear.webp' },
    { name: 'Marquise', img: 'https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/marquise.webp' },
    { name: 'Asscher', img: 'https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/asscher.webp' },
    { name: 'Heart', img: 'https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/heart.webp' }
  ];

  const popularStyles = [
    { name: 'Solitaire Settings', count: '14,230 styles', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=300&auto=format&fit=crop' },
    { name: 'Halo Settings', count: '8,450 styles', img: 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?q=80&w=300&auto=format&fit=crop' },
    { name: 'Hidden Halo', count: '4,120 styles', img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=300&auto=format&fit=crop' },
    { name: 'Three-Stone Rings', count: '3,890 styles', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=300&auto=format&fit=crop' },
  ];

  const handleShapeSelect = (shapeName: string) => {
    router.push(`/diamonds?shape=${shapeName}`);
  };

  const handleStyleSelect = (styleName: string) => {
    const term = styleName.replace(' Settings', '');
    router.push(`/diamonds?style=${term}`);
  };

  return (
    <div className="home-view">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="badge badge-ai" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              ✦ Trustpilot Rating #1 in Diamonds
            </div>
            <h1 className="display-text hero-title">
              The smarter way to buy diamonds.
            </h1>
            <p className="hero-subtitle">
              We search over 1 million diamonds from leading certified online dealers and apply our proprietary AI algorithms to find you the best cut, value, and price.
            </p>
            <div className="hero-ctas">
              <Button variant="primary" onClick={() => router.push('/diamonds')}>
                Start with a diamond
              </Button>
              <Button variant="ghost" onClick={() => router.push('/diamonds')}>
                Explore settings
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

      {/* Shop by Shape Grid */}
      <section className="shapes-section container">
        <div className="section-header">
          <span className="label-text">CHOOSE YOUR CUT</span>
          <h2 className="h1-text">Shop diamonds by shape</h2>
          <p className="body-text">Select a shape to view certified, live inventory from vetted dealers.</p>
        </div>

        <div className="shapes-grid">
          {shapes.map((shape) => (
            <div 
              key={shape.name} 
              className="shape-card"
              onClick={() => handleShapeSelect(shape.name)}
            >
              <div className="shape-icon-container">
                <img src={shape.img} alt={shape.name} className="shape-img" />
              </div>
              <span className="shape-name">{shape.name}</span>
            </div>
          ))}
        </div>
      </section>

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
              Join our newsletter for diamond value reports, inventory alerts, and get a $100 coupon valid for any gold or platinum ring setting.
            </p>
            <Button variant="gold" onClick={() => alert('Coupon code: SMARTCARAT100 applied at checkout!')}>
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
