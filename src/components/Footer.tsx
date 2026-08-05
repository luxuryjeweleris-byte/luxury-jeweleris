'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
  </svg>
);

export const Footer: React.FC = () => {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

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
            <div style={{ marginTop: '20px' }}>
              {/* Premium Facebook Social Card */}
              <a
                href="https://www.facebook.com/profile.php?id=61588328596938&mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'linear-gradient(135deg, #1877F2 0%, #0a5abf 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '11px 18px',
                  borderRadius: '10px',
                  transition: 'transform 180ms ease, box-shadow 180ms ease',
                  boxShadow: '0 4px 14px rgba(24, 119, 242, 0.35)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 22px rgba(24, 119, 242, 0.45)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 14px rgba(24, 119, 242, 0.35)';
                }}
              >
                {/* Facebook Icon */}
                <div style={{
                  width: '34px',
                  height: '34px',
                  background: 'rgba(255,255,255,0.18)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
                  </svg>
                </div>
                {/* Text */}
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.1px' }}>
                    Follow Us on Facebook
                  </span>
                  <span style={{ fontSize: '11px', opacity: 0.85, marginTop: '2px', fontWeight: 400 }}>
                    @LuxuryJeweleris · Visit our page →
                  </span>
                </div>
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
            <h3 className="footer-col-title">Company</h3>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Careers</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Press</a></li>
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
