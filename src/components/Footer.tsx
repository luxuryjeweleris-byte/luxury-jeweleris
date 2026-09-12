'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSiteSettings } from '../context/SiteSettingsContext';

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
  </svg>
);

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TwitterIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const PinterestIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
  </svg>
);

const YouTubeIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const { getSetting } = useSiteSettings();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const facebookUrl = getSetting('facebook_url', 'https://www.facebook.com/profile.php?id=61588328596938&mibextid=wwXIfr');
  const instagramUrl = getSetting('instagram_url', 'https://www.instagram.com/i_luxuryjewelers/');
  const twitterUrl = getSetting('twitter_url', 'https://x.com/LuxuryJeweleris');
  const pinterestUrl = getSetting('pinterest_url', 'https://www.pinterest.com/luxuryjeweleris/');
  const youtubeUrl = getSetting('youtube_url', 'https://www.youtube.com/@luxuryjeweleris');

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Link href="/" style={{ display: 'inline-block', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', height: '44px', gap: '10px' }}>
                <img src="/logo.png" alt="Luxury Jeweleris" style={{ height: '100%', width: 'auto', objectFit: 'contain' }} />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ 
                    fontFamily: "var(--font-display-outfit, 'Outfit', sans-serif)", 
                    fontSize: '18px', 
                    fontWeight: 700, 
                    letterSpacing: '0.5px',
                    lineHeight: 1.1
                  }}>
                    <span style={{ color: '#ffffff' }}>LUXURY </span>
                    <span style={{ 
                      background: 'linear-gradient(135deg, #FCE0AD 0%, #DFAC6C 35%, #C68B45 70%, #8E5E24 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block'
                    }}>
                      JEWELERIS
                    </span>
                  </div>
                  <div style={{ 
                    fontFamily: "var(--font-sans, 'Inter', sans-serif)", 
                    fontSize: '8px', 
                    fontWeight: 600, 
                    letterSpacing: '1.6px', 
                    color: '#8792A0',
                    opacity: 0.95,
                    marginTop: '1px',
                    textTransform: 'uppercase'
                  }}>
                    ENHANCE YOUR BEAUTY
                  </div>
                </div>
              </div>
            </Link>
            <p className="body-sm-text" style={{ color: 'var(--color-slate-muted)', marginTop: '4px', lineHeight: '1.6' }}>
              Luxury Jeweleris crafts timeless jewelry with exceptional artistry. From engagement rings to everyday elegance, each piece is designed to celebrate life&apos;s most precious moments.
            </p>
            
            {/* Clean Social Icon Buttons (Facebook, Instagram, X, Pinterest, YouTube) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="footer-social-icon-btn"
              >
                <FacebookIcon size={15} />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="footer-social-icon-btn"
              >
                <InstagramIcon size={15} />
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="X (Twitter)"
                className="footer-social-icon-btn"
              >
                <TwitterIcon size={14} />
              </a>
              <a
                href={pinterestUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Pinterest"
                className="footer-social-icon-btn"
              >
                <PinterestIcon size={15} />
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                className="footer-social-icon-btn"
              >
                <YouTubeIcon size={16} />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h3 className="footer-col-title">Shop</h3>
            <ul>
              <li><Link href="/engagement-rings">Engagement Rings</Link></li>
              <li><Link href="/wedding-bands">Wedding Bands</Link></li>
              <li><Link href="/earrings">Earrings</Link></li>
              <li><Link href="/necklaces">Necklaces</Link></li>
              <li><Link href="/bracelets">Bracelets</Link></li>
              <li><Link href="/gifts">Gifts</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-col-title">Company & Stores</h3>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/blog">Jewelry Journal</Link></li>
              <li><Link href="/locations">Our Boutiques</Link></li>
              <li><Link href="/arcadia-ca" style={{ fontSize: '12px', color: '#94A3B8' }}>• Arcadia, CA</Link></li>
              <li><Link href="/canoga-park-ca" style={{ fontSize: '12px', color: '#94A3B8' }}>• Canoga Park, CA</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-col-title">Customer Care</h3>
            <ul>
              <li><a href="#" onClick={(e) => e.preventDefault()}>100% Free Insured Shipping</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>30-Day Money-Back Returns</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Price Match Guarantee</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Lifetime Warranty</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} Luxury Jeweleris Inc. All rights reserved.
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Terms of Use</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
