'use client';

import React from 'react';
import Link from 'next/link';
import './about.css';

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="container about-hero-content">
          <span className="about-badge">EST. 2024</span>
          <h1 className="about-hero-title">Our Story</h1>
          <p className="about-hero-subtitle">
            Luxury Jeweleris was born from a passion for exceptional craftsmanship 
            and a belief that every piece of jewelry should tell a story.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section container">
        <div className="about-grid">
          <div className="about-text-block">
            <span className="label-text">OUR MISSION</span>
            <h2 className="h1-text" style={{ marginTop: '8px', marginBottom: '16px' }}>
              Redefining luxury jewelry
            </h2>
            <p className="body-text" style={{ lineHeight: '1.8', marginBottom: '16px' }}>
              At Luxury Jeweleris, we believe that exceptional jewelry shouldn&apos;t come with 
              an exceptional markup. We partner directly with master artisans and source 
              ethically to bring you pieces of uncompromising quality at fair prices.
            </p>
            <p className="body-text" style={{ lineHeight: '1.8' }}>
              Every piece in our collection is designed with intention — from engagement rings 
              that capture the essence of your love story, to everyday pieces that add a touch 
              of elegance to your daily life.
            </p>
          </div>
          <div className="about-image-block">
            <img 
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop" 
              alt="Luxury jewelry craftsmanship" 
              className="about-feature-img"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values-section">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '48px' }}>
            <span className="label-text">WHAT WE STAND FOR</span>
            <h2 className="h1-text" style={{ marginTop: '8px' }}>Our values</h2>
          </div>
          <div className="about-values-grid">
            <div className="about-value-card">
              <div className="about-value-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="h3-text">Ethical Sourcing</h3>
              <p className="body-sm-text" style={{ color: 'var(--color-slate-muted)', lineHeight: '1.7' }}>
                We are committed to responsible sourcing. Every gemstone is conflict-free and 
                every metal is responsibly mined.
              </p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="h3-text">Master Craftsmanship</h3>
              <p className="body-sm-text" style={{ color: 'var(--color-slate-muted)', lineHeight: '1.7' }}>
                Each piece is handcrafted by skilled artisans with decades of experience, 
                ensuring unparalleled quality and beauty.
              </p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h3 className="h3-text">Customer First</h3>
              <p className="body-sm-text" style={{ color: 'var(--color-slate-muted)', lineHeight: '1.7' }}>
                From personalized consultations to lifetime warranties, your satisfaction 
                is at the heart of everything we do.
              </p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h3 className="h3-text">Global Reach</h3>
              <p className="body-sm-text" style={{ color: 'var(--color-slate-muted)', lineHeight: '1.7' }}>
                We ship worldwide with free insured delivery, bringing luxury jewelry 
                to doorsteps across the globe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section container">
        <div className="about-cta-inner">
          <h2 className="h1-text" style={{ color: 'white', marginBottom: '16px' }}>
            Begin your jewelry journey
          </h2>
          <p className="body-text" style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '500px', margin: '0 auto 28px' }}>
            Explore our curated collections and find the piece that speaks to you.
          </p>
          <Link href="/shop" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Shop the Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
