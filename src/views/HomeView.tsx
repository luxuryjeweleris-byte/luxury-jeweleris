'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TrustStrip from '../components/TrustStrip';
import CategoryCarousel from '../components/CategoryCarousel';
import Button from '../components/Button';
import './views.css';

export const HomeView: React.FC = () => {
  const router = useRouter();

  const heroVideos = [
    'https://res.cloudinary.com/gelkrliw/video/upload/v1785440765/products/v0coba9zahrupfdek7h8.mp4',
    'https://cldnr.rarecarat.com/video/upload/v1722272873/home-next-gen/360-ring-desktop.mp4',
  ];

  const [activeVideoIndex, setActiveVideoIndex] = React.useState<number>(0);
  const video1Ref = React.useRef<HTMLVideoElement | null>(null);
  const video2Ref = React.useRef<HTMLVideoElement | null>(null);

  const handleVideo1Ended = () => {
    setActiveVideoIndex(1);
    if (video2Ref.current) {
      video2Ref.current.currentTime = 0;
      video2Ref.current.play().catch(() => {});
    }
  };

  const handleVideo2Ended = () => {
    setActiveVideoIndex(0);
    if (video1Ref.current) {
      video1Ref.current.currentTime = 0;
      video1Ref.current.play().catch(() => {});
    }
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
                  objectFit: 'contain',
                  opacity: activeVideoIndex === 0 ? 1 : 0,
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
                  objectFit: 'contain',
                  opacity: activeVideoIndex === 1 ? 1 : 0,
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
