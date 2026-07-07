'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Link href="/" style={{ display: 'inline-block', marginBottom: '12px' }}>
              <Logo theme="dark" height={44} />
            </Link>
            <p className="body-sm-text" style={{ color: 'var(--color-slate-muted)', marginTop: '4px', lineHeight: '1.6' }}>
              Trust-first, AI-driven diamond search. We aggregate millions of certified diamonds from vetted sellers to bring you the best value.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px', alignItems: 'center' }}>
              <a 
                href="https://www.facebook.com/profile.php?id=61588328596938&mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-link"
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none'
                }}
              >
                <FacebookIcon />
                <span>Follow us on Facebook</span>
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Shop Diamonds</h4>
            <ul>
              <li><Link href="/diamonds">Loose Diamonds</Link></li>
              <li><Link href="/diamonds?shape=Round">Round Diamonds</Link></li>
              <li><Link href="/diamonds?shape=Oval">Oval Diamonds</Link></li>
              <li><Link href="/diamonds">Engagement Ring Settings</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Education & Tools</h4>
            <ul>
              <li><a href="#" onClick={(e) => e.preventDefault()}>The Diamond 4Cs Guide</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>AI Value Estimator</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Interactive Carat weight visualizer</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Vetted Trust Policies</h4>
            <ul>
              <li><a href="#" onClick={(e) => e.preventDefault()}>100% Free Insured Shipping</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>30-Day Money-Back Returns</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Price Match Guarantee</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Conflict-Free Diamond Sourcing</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} Luxury Jeweleris Inc. All rights reserved. Vetted partners, certified quality stones.
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
