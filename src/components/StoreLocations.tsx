'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Clock, Navigation, ChevronLeft, ChevronRight, Maximize2, X, Sparkles, ShieldCheck } from 'lucide-react';

interface StoreInfo {
  id: string;
  name: string;
  locationTag: string;
  address: string;
  cityStateZip: string;
  country: string;
  phone: string;
  hours: string;
  mapUrl: string;
  images: string[];
}

const stores: StoreInfo[] = [
  {
    id: 'arcadia',
    name: 'Luxury Jewelers Santa Anita Mall',
    locationTag: 'Santa Anita Mall · Arcadia, CA',
    address: '400 S Baldwin Ave, Suite 231',
    cityStateZip: 'Arcadia, CA 91007',
    country: 'United States',
    phone: '+1 (213) 642-7217',
    hours: 'Mon - Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 7:00 PM',
    mapUrl: 'https://www.google.com/maps/search/400+S+Baldwin+Ave+Ste+231,+Arcadia,+CA+91007',
    images: [
      '/stores/arcadia_1.jpg',
      '/stores/arcadia_2.jpg',
      '/stores/arcadia_3.jpg',
    ],
  },
  {
    id: 'canoga-park',
    name: 'Luxury Jewelers Topanga Mall',
    locationTag: 'Topanga Mall · Canoga Park, CA',
    address: '6600 Topanga Canyon Blvd',
    cityStateZip: 'Canoga Park, CA 91303',
    country: 'United States',
    phone: '+1 (213) 642-7217',
    hours: 'Mon - Sat: 10:00 AM - 8:00 PM | Sun: 11:00 AM - 6:00 PM',
    mapUrl: 'https://www.google.com/maps/search/6600+Topanga+Canyon+Blvd,+Canoga+Park,+CA+91303',
    images: [
      '/stores/topanga_1.jpg',
      '/stores/topanga_3.jpg',
    ],
  },
];

export const StoreLocations: React.FC = () => {
  const pathname = usePathname();
  const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({
    arcadia: 0,
    'canoga-park': 0,
  });
  const [lightboxState, setLightboxState] = useState<{ isOpen: boolean; images: string[]; activeIdx: number; title: string }>({
    isOpen: false,
    images: [],
    activeIdx: 0,
    title: '',
  });

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handlePrevImage = (storeId: string, totalImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndices(prev => ({
      ...prev,
      [storeId]: (prev[storeId] - 1 + totalImages) % totalImages,
    }));
  };

  const handleNextImage = (storeId: string, totalImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndices(prev => ({
      ...prev,
      [storeId]: (prev[storeId] + 1) % totalImages,
    }));
  };

  const openLightbox = (images: string[], activeIdx: number, title: string) => {
    setLightboxState({
      isOpen: true,
      images,
      activeIdx,
      title,
    });
  };

  return (
    <section 
      id="our-stores"
      style={{
        backgroundColor: '#FAF8F5',
        borderTop: '1px solid #EAE3D9',
        borderBottom: '1px solid #EAE3D9',
        padding: '72px 0',
        position: 'relative',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 52px auto' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: '#C9A227',
              backgroundColor: '#FFF8E7',
              border: '1px solid #F3E5C8',
              padding: '6px 14px',
              borderRadius: '20px',
              marginBottom: '14px',
            }}
          >
            <Sparkles size={13} />
            OUR PHYSICAL STORES & BOUTIQUES
          </div>

          <h2 
            style={{
              fontFamily: "var(--font-display-outfit, 'Outfit', sans-serif)",
              fontSize: 'clamp(26px, 4.5vw, 36px)',
              fontWeight: 700,
              color: '#10151A',
              letterSpacing: '-0.4px',
              lineHeight: 1.2,
              marginBottom: '12px',
            }}
          >
            Experience Our Fine Collections In Person
          </h2>

          <p 
            style={{
              fontSize: '14.5px',
              color: '#4B5561',
              lineHeight: 1.6,
            }}
          >
            Step into our boutiques to explore our extensive selection of 14k/18k gold jewelry, certified diamonds, and professional in-store services.
          </p>
        </div>

        {/* Store Location Cards Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '32px',
          }}
        >
          {stores.map((store) => {
            const currentImgIdx = activeImageIndices[store.id] || 0;
            const currentImage = store.images[currentImgIdx];

            return (
              <div
                key={store.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1px solid #E8E2D8',
                  boxShadow: '0 6px 24px rgba(16, 21, 26, 0.06)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease',
                }}
                className="store-card-hover"
              >
                {/* Luxury Image Banner & Collage Grid */}
                <div 
                  style={{ 
                    height: '340px', 
                    position: 'relative', 
                    overflow: 'hidden', 
                    backgroundColor: '#10151A',
                  }}
                >
                  {store.images.length >= 3 ? (
                    /* 3-Image Luxury Grid Collage */
                    <div style={{ display: 'flex', width: '100%', height: '100%', gap: '2px' }}>
                      {/* Main Featured Photo (62% width) */}
                      <div 
                        style={{ width: '62%', height: '100%', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                        onClick={() => openLightbox(store.images, 0, store.name)}
                      >
                        <img
                          src={store.images[0]}
                          alt={`${store.name} photo 1`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 400ms ease',
                          }}
                        />
                      </div>

                      {/* Right Column Stack (38% width, 2 stacked photos) */}
                      <div style={{ width: '38%', height: '100%', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div 
                          style={{ height: '50%', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                          onClick={() => openLightbox(store.images, 1, store.name)}
                        >
                          <img
                            src={store.images[1]}
                            alt={`${store.name} photo 2`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 400ms ease',
                            }}
                          />
                        </div>
                        <div 
                          style={{ height: '50%', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                          onClick={() => openLightbox(store.images, 2, store.name)}
                        >
                          <img
                            src={store.images[2]}
                            alt={`${store.name} photo 3`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 400ms ease',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : store.images.length === 2 ? (
                    /* 2-Image Split Collage Grid */
                    <div style={{ display: 'flex', width: '100%', height: '100%', gap: '2px' }}>
                      <div 
                        style={{ width: '50%', height: '100%', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                        onClick={() => openLightbox(store.images, 0, store.name)}
                      >
                        <img
                          src={store.images[0]}
                          alt={`${store.name} photo 1`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 400ms ease',
                          }}
                        />
                      </div>
                      <div 
                        style={{ width: '50%', height: '100%', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                        onClick={() => openLightbox(store.images, 1, store.name)}
                      >
                        <img
                          src={store.images[1]}
                          alt={`${store.name} photo 2`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 400ms ease',
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    /* Single Spacious Hero Image */
                    <div 
                      style={{ width: '100%', height: '100%', cursor: 'pointer' }}
                      onClick={() => openLightbox(store.images, 0, store.name)}
                    >
                      <img
                        src={store.images[0]}
                        alt={store.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 400ms ease',
                        }}
                      />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(16,21,26,0.35) 0%, rgba(16,21,26,0) 40%, rgba(16,21,26,0.5) 100%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Location Tag Badge */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      backgroundColor: 'rgba(16, 21, 26, 0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#F0D9B5',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      letterSpacing: '0.4px',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: '1px solid rgba(201, 162, 39, 0.4)',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <MapPin size={13} style={{ color: '#C9A227' }} />
                    {store.locationTag}
                  </div>

                  {/* Gallery Zoom Badge */}
                  <button
                    onClick={() => openLightbox(store.images, 0, store.name)}
                    style={{
                      position: 'absolute',
                      bottom: '14px',
                      right: '14px',
                      backgroundColor: 'rgba(16, 21, 26, 0.85)',
                      backdropFilter: 'blur(6px)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '20px',
                      padding: '6px 14px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      zIndex: 2,
                      transition: 'all 150ms ease',
                    }}
                  >
                    <Maximize2 size={13} style={{ color: '#C9A227' }} />
                    {store.images.length > 1 ? `${store.images.length} Photos · View Gallery` : 'View Image'}
                  </button>
                </div>

                {/* Card Body */}
                <div style={{ padding: '26px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '22px' }}>
                  <div>
                    {/* Store Title */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <h3 
                        style={{
                          fontFamily: "var(--font-display-outfit, 'Outfit', sans-serif)",
                          fontSize: '21px',
                          fontWeight: 700,
                          color: '#10151A',
                          lineHeight: 1.25,
                        }}
                      >
                        {store.name}
                      </h3>
                    </div>

                    {/* Details List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* Full Address */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <MapPin size={17} style={{ color: '#C9A227', flexShrink: 0, marginTop: '2px' }} />
                        <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5 }}>
                          <strong>{store.address}</strong><br />
                          {store.cityStateZip}, {store.country}
                        </div>
                      </div>

                      {/* Phone */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Phone size={17} style={{ color: '#C9A227', flexShrink: 0 }} />
                        <a 
                          href={`tel:${store.phone}`} 
                          style={{ fontSize: '13.5px', fontWeight: 700, color: '#0E8C8A', textDecoration: 'none' }}
                        >
                          {store.phone}
                        </a>
                      </div>

                      {/* Opening Hours */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <Clock size={17} style={{ color: '#C9A227', flexShrink: 0, marginTop: '2px' }} />
                        <div style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.4 }}>
                          {store.hours}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                    <a
                      href={store.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px 18px',
                        borderRadius: '12px',
                        backgroundColor: '#10151A',
                        color: '#FFFFFF',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'all 180ms ease',
                        boxShadow: '0 3px 10px rgba(16,21,26,0.15)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0E8C8A')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10151A')}
                    >
                      <Navigation size={16} />
                      Get Directions
                    </a>

                    <a
                      href={`tel:${store.phone}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '12px 18px',
                        borderRadius: '12px',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #CBD5E1',
                        color: '#1E293B',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'all 180ms ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#EEF2F6';
                        e.currentTarget.style.color = '#0F172A';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#F8FAFC';
                        e.currentTarget.style.color = '#1E293B';
                      }}
                    >
                      <Phone size={16} />
                      Call Store
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Full-screen Image Viewer Modal */}
      {lightboxState.isOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(10, 14, 18, 0.94)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setLightboxState(prev => ({ ...prev, isOpen: false }))}
        >
          {/* Header */}
          <div 
            style={{
              position: 'absolute',
              top: '20px',
              left: '24px',
              right: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFFFFF',
              zIndex: 10000,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div>
              <h4 style={{ fontFamily: "var(--font-display-outfit, 'Outfit', sans-serif)", fontSize: '18px', fontWeight: 700, color: '#F0D9B5' }}>
                {lightboxState.title}
              </h4>
              <p style={{ fontSize: '12px', opacity: 0.7 }}>
                Photo {lightboxState.activeIdx + 1} of {lightboxState.images.length}
              </p>
            </div>
            <button
              onClick={() => setLightboxState(prev => ({ ...prev, isOpen: false }))}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Image */}
          <div 
            style={{ 
              maxWidth: '90vw', 
              maxHeight: '75vh', 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={lightboxState.images[lightboxState.activeIdx]}
              alt="Store full size"
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              }}
            />
          </div>

          {/* Lightbox Navigation Controls */}
          {lightboxState.images.length > 1 && (
            <div 
              style={{ 
                display: 'flex', 
                gap: '16px', 
                marginTop: '20px', 
                zIndex: 10000 
              }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxState(prev => ({
                  ...prev,
                  activeIdx: (prev.activeIdx - 1 + prev.images.length) % prev.images.length,
                }))}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                onClick={() => setLightboxState(prev => ({
                  ...prev,
                  activeIdx: (prev.activeIdx + 1) % prev.images.length,
                }))}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default StoreLocations;
