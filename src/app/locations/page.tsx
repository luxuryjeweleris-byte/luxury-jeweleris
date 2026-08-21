import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, Clock, Sparkles, Navigation, ArrowRight, ShieldCheck } from 'lucide-react';
import { STORE_LOCATIONS } from '../../lib/locationsData';

export const metadata: Metadata = {
  title: 'Our Jewelry Boutiques & Stores in California | Luxury Jeweleris',
  description: 'Visit Luxury Jeweleris physical boutiques in Arcadia, CA (The Shops at Santa Anita) and Canoga Park, CA (Westfield Topanga). Certified diamonds, engagement rings & bespoke jewelry.',
  alternates: {
    canonical: 'https://luxuryjeweleris.com/locations',
  },
};

export default function LocationsIndexPage() {
  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Hero Header */}
      <section 
        style={{
          background: 'linear-gradient(135deg, #10151A 0%, #1A232C 100%)',
          color: '#FFFFFF',
          padding: '72px 24px 64px 24px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(201, 162, 39, 0.3)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(201, 162, 39, 0.15) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: '#F0D9B5',
              backgroundColor: 'rgba(201, 162, 39, 0.15)',
              border: '1px solid rgba(201, 162, 39, 0.35)',
              padding: '6px 16px',
              borderRadius: '20px',
              marginBottom: '20px',
            }}
          >
            <Sparkles size={13} style={{ color: '#C9A227' }} />
            PHYSICAL BOUTIQUES & SHOWROOMS
          </div>

          <h1 
            style={{
              fontFamily: "var(--font-display-outfit, 'Outfit', sans-serif)",
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
              marginBottom: '16px',
              color: '#FFFFFF',
            }}
          >
            Visit Our Luxury Jewelry Stores
          </h1>

          <p 
            style={{
              fontSize: '16px',
              color: '#CBD5E1',
              lineHeight: 1.6,
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            Experience our hand-crafted engagement rings, certified diamonds, and bespoke jewelry design in person. Select a boutique location below to view local store hours, map directions, and book private consultations.
          </p>
        </div>
      </section>

      {/* Store Cards Grid */}
      <section className="container" style={{ marginTop: '56px' }}>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '36px',
          }}
        >
          {STORE_LOCATIONS.map((store) => (
            <div
              key={store.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E8E2D8',
                boxShadow: '0 8px 30px rgba(16, 21, 26, 0.07)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 260ms ease, box-shadow 260ms ease',
              }}
            >
              {/* Main Photo Banner */}
              <div 
                style={{
                  height: '280px',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#10151A',
                }}
              >
                <img
                  src={store.images[0]}
                  alt={store.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(16,21,26,0.3) 0%, rgba(16,21,26,0.65) 100%)',
                  }}
                />

                <div 
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: 'rgba(16, 21, 26, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#F0D9B5',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: '1px solid rgba(201, 162, 39, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <MapPin size={13} style={{ color: '#C9A227' }} />
                  {store.locationTag}
                </div>

                <div 
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    right: '20px',
                    color: '#FFFFFF',
                  }}
                >
                  <h2 
                    style={{
                      fontFamily: "var(--font-display-outfit, 'Outfit', sans-serif)",
                      fontSize: '22px',
                      fontWeight: 700,
                      lineHeight: 1.25,
                      textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                    }}
                  >
                    {store.name}
                  </h2>
                </div>
              </div>

              {/* Card Body */}
              <div 
                style={{
                  padding: '28px',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '24px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Address */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <MapPin size={18} style={{ color: '#C9A227', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.5 }}>
                      <strong>{store.address.street}</strong><br />
                      {store.address.city}, {store.address.state} {store.address.zip}
                    </div>
                  </div>

                  {/* Phone */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Phone size={18} style={{ color: '#C9A227', flexShrink: 0 }} />
                    <a 
                      href={`tel:${store.phone}`} 
                      style={{ fontSize: '14px', fontWeight: 700, color: '#0E8C8A', textDecoration: 'none' }}
                    >
                      {store.phone}
                    </a>
                  </div>

                  {/* Hours */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <Clock size={18} style={{ color: '#C9A227', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.4 }}>
                      {store.hoursString}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div style={{ marginTop: '6px', paddingTop: '16px', borderTop: '1px dashed #E2E8F0' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#94A3B8', marginBottom: '8px' }}>
                      Boutique Highlights
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {store.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ShieldCheck size={14} style={{ color: '#0E8C8A' }} />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link
                    href={`/locations/${store.slug}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '13px 20px',
                      borderRadius: '12px',
                      backgroundColor: '#10151A',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      boxShadow: '0 4px 14px rgba(16, 21, 26, 0.12)',
                      transition: 'all 180ms ease',
                    }}
                  >
                    View Boutique & Book Appointment
                    <ArrowRight size={16} />
                  </Link>

                  <a
                    href={store.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      color: '#475569',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    <Navigation size={14} />
                    Get Directions (Google Maps)
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
