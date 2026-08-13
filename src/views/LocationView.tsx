'use client';

import React, { useState } from 'react';
import { 
  MapPin, Phone, Clock, Navigation, Sparkles, ShieldCheck, 
  Calendar, ChevronDown, ChevronUp, Star, X, CheckCircle2,
  Wrench, Gem, Heart, FileText, Maximize2, Mail, ExternalLink
} from 'lucide-react';
import type { StoreLocationData } from '../lib/locationsData';

interface LocationViewProps {
  location: StoreLocationData;
}

const serviceIcons: Record<string, React.FC<{ size?: number; style?: React.CSSProperties }>> = {
  Sparkles: (props) => <Sparkles {...props} />,
  Gem: (props) => <Gem {...props} />,
  Wrench: (props) => <Wrench {...props} />,
  ShieldCheck: (props) => <ShieldCheck {...props} />,
  Heart: (props) => <Heart {...props} />,
  FileText: (props) => <FileText {...props} />,
};

export const LocationView: React.FC<LocationViewProps> = ({ location }) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Appointment Modal State
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [appointmentSubmitted, setAppointmentSubmitted] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Custom Ring Consultation',
    date: '',
    time: '11:00 AM',
    notes: '',
  });

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentSubmitted(true);
    setTimeout(() => {
      setAppointmentSubmitted(false);
      setAppointmentModalOpen(false);
      setAppointmentForm({
        name: '',
        phone: '',
        email: '',
        service: 'Custom Ring Consultation',
        date: '',
        time: '11:00 AM',
        notes: '',
      });
    }, 2800);
  };

  return (
    <div style={{ backgroundColor: '#FAF8F5', color: '#10151A', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* 1. Hero Header */}
      <section
        className="loc-hero"
        style={{
          background: 'linear-gradient(135deg, #10151A 0%, #1A232C 100%)',
          color: '#FFFFFF',
          padding: '64px 24px 72px 24px',
          position: 'relative',
          borderBottom: '1px solid rgba(201, 162, 39, 0.3)',
          overflow: 'hidden',
        }}
      >
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(14, 140, 138, 0.15) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ maxWidth: '1140px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '820px' }}>
            
            {/* Location Badge & Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#F0D9B5',
                  backgroundColor: 'rgba(201, 162, 39, 0.15)',
                  border: '1px solid rgba(201, 162, 39, 0.35)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                }}
              >
                <MapPin size={13} style={{ color: '#C9A227' }} />
                {location.locationTag}
              </div>

              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#FFD700',
                }}
              >
                <Star size={14} fill="#FFD700" stroke="#FFD700" />
                <span>4.9 / 5.0 (Google & Yelp Verified)</span>
              </div>
            </div>

            {/* H1 Title */}
            <h1 
              style={{
                fontFamily: "var(--font-display-outfit, 'Outfit', sans-serif)",
                fontSize: 'clamp(30px, 4.5vw, 44px)',
                fontWeight: 700,
                lineHeight: 1.18,
                letterSpacing: '-0.4px',
                color: '#FFFFFF',
                margin: '4px 0',
              }}
            >
              {location.name}
            </h1>

            <p style={{ fontSize: '15.5px', color: '#CBD5E1', lineHeight: 1.6, maxWidth: '720px' }}>
              {location.metaDescription}
            </p>

            {/* Quick Contact & Action Bar */}
            <div 
              className="loc-hero-actions"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                marginTop: '16px',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() => setAppointmentModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0E8C8A 0%, #065F5E 100%)',
                  color: '#FFFFFF',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(14, 140, 138, 0.35)',
                  transition: 'transform 180ms ease, boxShadow 180ms ease',
                }}
              >
                <Calendar size={17} />
                Book In-Store VIP Appointment
              </button>

              <a
                href={location.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <Navigation size={16} style={{ color: '#C9A227' }} />
                Get Directions
              </a>

              <a
                href={`tel:${location.phone}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#F0D9B5',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <Phone size={16} />
                Call {location.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Store Content Grid (Gallery + Details + Map) */}
      <section className="container loc-content" style={{ maxWidth: '1140px', margin: '48px auto 0 auto', padding: '0 24px' }}>
        <div className="loc-main-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '40px' }}>
          
          {/* Left Column: Gallery & In-Store Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Gallery Viewer */}
            <div 
              className="loc-gallery-card"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid #E8E2D8',
                padding: '16px',
                boxShadow: '0 6px 20px rgba(16, 21, 26, 0.05)',
              }}
            >
              <div 
                className="loc-gallery-main"
                style={{
                  height: '380px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#10151A',
                  cursor: 'pointer',
                }}
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src={location.images[activeImageIdx]}
                  alt={`${location.name} interior photo ${activeImageIdx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 300ms ease',
                  }}
                />

                <div 
                  style={{
                    position: 'absolute',
                    bottom: '14px',
                    right: '14px',
                    backgroundColor: 'rgba(16, 21, 26, 0.85)',
                    backdropFilter: 'blur(6px)',
                    color: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Maximize2 size={13} style={{ color: '#C9A227' }} />
                  View Fullscreen Gallery ({location.images.length} Photos)
                </div>
              </div>

              {/* Thumbnail Strip */}
              {location.images.length > 1 && (
                <div className="loc-thumbs" style={{ display: 'flex', gap: '12px', marginTop: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {location.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      style={{
                        width: '80px',
                        height: '60px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: activeImageIdx === idx ? '2px solid #0E8C8A' : '1px solid #E2E8F0',
                        opacity: activeImageIdx === idx ? 1 : 0.65,
                        cursor: 'pointer',
                        padding: 0,
                        background: 'none',
                        transition: 'all 150ms ease',
                      }}
                    >
                      <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* In-Store Services Grid */}
            <div>
              <h2 
                style={{
                  fontFamily: "var(--font-display-outfit, 'Outfit', sans-serif)",
                  fontSize: '24px',
                  fontWeight: 700,
                  marginBottom: '20px',
                  color: '#10151A',
                }}
              >
                Services Offered at {location.shortName}
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {location.services.map((service, idx) => {
                  const IconComp = serviceIcons[service.iconName] || Sparkles;
                  return (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '14px',
                        border: '1px solid #E8E2D8',
                        padding: '22px',
                        boxShadow: '0 4px 14px rgba(16, 21, 26, 0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      <div 
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          backgroundColor: '#FFF8E7',
                          border: '1px solid #F3E5C8',
                          color: '#C9A227',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconComp size={20} />
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#10151A' }}>{service.title}</h3>
                      <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.5 }}>{service.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div>
              <h2 
                style={{
                  fontFamily: "var(--font-display-outfit, 'Outfit', sans-serif)",
                  fontSize: '24px',
                  fontWeight: 700,
                  marginBottom: '20px',
                  color: '#10151A',
                }}
              >
                Local Client Reviews ({location.shortName})
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {location.reviews.map((rev, idx) => (
                  <div 
                    key={idx}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      border: '1px solid #E8E2D8',
                      padding: '20px',
                      boxShadow: '0 3px 12px rgba(16, 21, 26, 0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={15} fill="#FFD700" stroke="#FFD700" />
                        ))}
                      </div>
                      <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>{rev.source} · {rev.date}</span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#334155', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '10px' }}>
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#10151A' }}>
                      — {rev.author}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Store Details & Google Map Embed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Store Hours & Information Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid #E8E2D8',
                padding: '28px',
                boxShadow: '0 6px 20px rgba(16, 21, 26, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <h2 
                style={{
                  fontFamily: "var(--font-display-outfit, 'Outfit', sans-serif)",
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#10151A',
                  borderBottom: '1px solid #F1F5F9',
                  paddingBottom: '12px',
                }}
              >
                Boutique Information
              </h2>

              {/* Address */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={20} style={{ color: '#C9A227', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Address</div>
                  <div style={{ fontSize: '14.5px', color: '#1E293B', fontWeight: 600, lineHeight: 1.4, marginTop: '2px' }}>
                    {location.address.street}<br />
                    {location.address.city}, {location.address.state} {location.address.zip}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Phone size={20} style={{ color: '#C9A227', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</div>
                  <a href={`tel:${location.phone}`} style={{ fontSize: '14.5px', fontWeight: 700, color: '#0E8C8A', textDecoration: 'none', marginTop: '2px', display: 'block' }}>
                    {location.phone}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Clock size={20} style={{ color: '#C9A227', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ width: '100%' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Hours of Operation</div>
                  <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5 }}>
                    {location.openingHours.map((oh, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                        <span style={{ fontWeight: 600 }}>{oh.dayOfWeek.join(', ')}:</span>
                        <span>{oh.opens} - {oh.closes}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Key Amenities */}
              <div style={{ paddingTop: '16px', borderTop: '1px dashed #E2E8F0' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Amenities & Features</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {location.features.map((feat, idx) => (
                    <div key={idx} style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={15} style={{ color: '#0E8C8A', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Interactive Google Map Embed */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid #E8E2D8',
                overflow: 'hidden',
                boxShadow: '0 6px 20px rgba(16, 21, 26, 0.05)',
              }}
            >
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#10151A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} style={{ color: '#C9A227' }} />
                  Map & Location Directions
                </div>
                <a 
                  href={location.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ fontSize: '12px', color: '#0E8C8A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}
                >
                  Open Maps <ExternalLink size={12} />
                </a>
              </div>

              <div style={{ height: '320px', width: '100%', backgroundColor: '#E2E8F0' }}>
                <iframe
                  title={`${location.name} Map`}
                  src={location.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

          </div>
        </div>

        {/* 3. Local FAQ Section (Accordion with Schema Support) */}
        <div className="loc-faq-section" style={{ marginTop: '64px', backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid #E8E2D8', padding: '36px', boxShadow: '0 6px 24px rgba(16, 21, 26, 0.04)' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 32px auto' }}>
            <h2 
              style={{
                fontFamily: "var(--font-display-outfit, 'Outfit', sans-serif)",
                fontSize: '26px',
                fontWeight: 700,
                color: '#10151A',
                marginBottom: '8px',
              }}
            >
              Frequently Asked Questions ({location.shortName})
            </h2>
            <p style={{ fontSize: '14.5px', color: '#64748B' }}>
              Common questions about visiting our store, diamond consultations, and local services.
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {location.faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: isOpen ? '#F8FAFC' : '#FFFFFF',
                    transition: 'background-color 150ms ease',
                  }}
                >
                  <button
                    className="loc-faq-btn"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '18px 22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#10151A',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp size={18} style={{ color: '#0E8C8A' }} /> : <ChevronDown size={18} style={{ color: '#94A3B8' }} />}
                  </button>

                  {isOpen && (
                    <div className="loc-faq-answer" style={{ padding: '0 22px 18px 22px', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(10, 14, 18, 0.94)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
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

          <img
            src={location.images[activeImageIdx]}
            alt="Store fullscreen view"
            style={{
              maxWidth: '90vw',
              maxHeight: '80vh',
              objectFit: 'contain',
              borderRadius: '12px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      )}

      {/* Appointment Modal */}
      {appointmentModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(16, 21, 26, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setAppointmentModalOpen(false)}
        >
          <div
            className="loc-appointment-modal"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              padding: '32px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAppointmentModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            {appointmentSubmitted ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div 
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#10151A', marginBottom: '8px' }}>
                  Appointment Requested!
                </h3>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
                  Thank you! Our concierge at <strong>{location.shortName}</strong> will call or email you shortly to confirm your VIP time slot.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <h3 
                    style={{
                      fontFamily: "var(--font-display-outfit, 'Outfit', sans-serif)",
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#10151A',
                    }}
                  >
                    Schedule In-Store VIP Visit
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#64748B', marginTop: '4px' }}>
                    Reserving an appointment at <strong>{location.shortName}</strong> ensures a certified diamond specialist is dedicated to you.
                  </p>
                </div>

                <form onSubmit={handleAppointmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={appointmentForm.name}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, name: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                    />
                  </div>

                  <div className="loc-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="(213) 000-0000"
                        value={appointmentForm.phone}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, phone: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="sarah@example.com"
                        value={appointmentForm.email}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, email: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Service Interested In
                    </label>
                    <select
                      value={appointmentForm.service}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, service: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="Custom Ring Consultation">Custom Engagement Ring Consultation</option>
                      <option value="Diamond Viewing">Lab & Natural Diamond Viewing</option>
                      <option value="Wedding Band Styling">Wedding Band Styling Session</option>
                      <option value="Jewelry Repair / Resizing">Jewelry Repair & Ring Resizing</option>
                      <option value="Appraisal">Formal Jewelry Appraisal</option>
                    </select>
                  </div>

                  <div className="loc-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={appointmentForm.date}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Preferred Time Slot
                      </label>
                      <select
                        value={appointmentForm.time}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', backgroundColor: '#FFFFFF' }}
                      >
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="01:00 PM">01:00 PM</option>
                        <option value="03:00 PM">03:00 PM</option>
                        <option value="05:00 PM">05:00 PM</option>
                        <option value="07:00 PM">07:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      marginTop: '8px',
                      padding: '13px',
                      borderRadius: '10px',
                      backgroundColor: '#10151A',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(16, 21, 26, 0.15)',
                    }}
                  >
                    Confirm Appointment Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Responsive styles for mobile */}
      <style>{`
        @media (max-width: 900px) {
          .loc-main-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .loc-content {
            margin-top: 32px !important;
          }
        }
        @media (max-width: 640px) {
          .loc-hero {
            padding: 40px 20px 48px 20px !important;
          }
          .loc-gallery-main {
            height: 260px !important;
          }
          .loc-gallery-card {
            padding: 10px !important;
            border-radius: 14px !important;
          }
          .loc-thumbs button {
            width: 68px !important;
            height: 52px !important;
            flex-shrink: 0;
          }
          .loc-content {
            padding: 0 16px !important;
          }
          .loc-form-row {
            grid-template-columns: 1fr !important;
          }
          /* Hero action buttons go full-width on phones */
          .loc-hero-actions button,
          .loc-hero-actions a {
            width: 100% !important;
            justify-content: center !important;
            padding: 13px 20px !important;
            font-size: 13.5px !important;
          }
          /* Appointment modal fits the phone screen */
          .loc-appointment-modal {
            padding: 24px !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
          }
          /* FAQ accordion padding tightens */
          .loc-faq-section {
            padding: 24px 16px !important;
            border-radius: 14px !important;
          }
          .loc-faq-btn {
            padding: 14px 16px !important;
            font-size: 14px !important;
          }
          .loc-faq-answer {
            padding: 0 16px 14px 16px !important;
          }
        }
      `}</style>

    </div>
  );
};

export default LocationView;
