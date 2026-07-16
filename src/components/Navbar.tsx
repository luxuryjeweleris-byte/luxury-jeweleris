'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Logo from './Logo';
import './components.css';

// Custom Ring SVG Icon for Menu Items
const RingIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="menu-icon" style={{ marginRight: '6px' }}>
    <circle cx="12" cy="14" r="6" />
    <path d="M12 2 L9 5 L12 8 L15 5 Z" />
  </svg>
);

// Custom Bracelet SVG Icon
const BraceletIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="menu-icon" style={{ marginRight: '6px' }}>
    <circle cx="12" cy="12" r="8" strokeDasharray="2,2" />
    <circle cx="12" cy="4" r="1" fill="currentColor" />
    <circle cx="20" cy="12" r="1" fill="currentColor" />
    <circle cx="12" cy="20" r="1" fill="currentColor" />
    <circle cx="4" cy="12" r="1" fill="currentColor" />
  </svg>
);

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const pathname = usePathname();
  const { cart } = useCart();
  const cartCount = cart.length;
  const contactDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(event.target as Node)) {
        setContactOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      {/* Top Announcement Bar */}
      <div className="navbar-top-bar">
        <div className="container navbar-top-bar-container">
          <span className="navbar-top-phone">+1 213-642-7217</span>
          <span className="navbar-top-promo">4th of July Sale - Save up to 40%* - Ends Soon</span>
          <div className="navbar-top-links">
            <div className="navbar-top-link-wrapper" style={{ position: 'relative' }} ref={contactDropdownRef}>
              <button 
                className="navbar-top-btn" 
                onClick={() => setContactOpen(!contactOpen)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'inherit', 
                  font: 'inherit', 
                  cursor: 'pointer', 
                  padding: 0,
                  fontWeight: '600'
                }}
              >
                Contact us
              </button>
              
              {contactOpen && (
                <div className="contact-top-dropdown animate-fade-in">
                  <h4 className="contact-dropdown-title">Customer Support</h4>
                  <p className="contact-dropdown-subtitle">Connect with a jewelry consultant.</p>
                  
                  <button 
                    className="contact-dropdown-chat-btn" 
                    onClick={() => { 
                      alert('Starting support chat...'); 
                      setContactOpen(false); 
                    }}
                  >
                    Chat Now
                  </button>
                  
                  <div className="contact-dropdown-sep">or</div>
                  
                  <div className="contact-dropdown-info">
                    <div className="contact-info-item">
                      <span className="contact-info-label">Call Us</span>
                      <a href="tel:+12136427217" className="contact-info-value">+1 213-642-7217</a>
                    </div>
                    <div className="contact-info-item">
                      <span className="contact-info-label">Email Us</span>
                      <a href="mailto:luxuryjeweleris@gmail.com" className="contact-info-value">luxuryjeweleris@gmail.com</a>
                    </div>
                  </div>
                  
                  <div className="contact-dropdown-footer">
                    <span>Looking for order info?</span>
                    <Link href="/login" className="contact-track-link" onClick={() => setContactOpen(false)}>Track your order</Link>
                  </div>
                </div>
              )}
            </div>
            <span className="navbar-top-sep">|</span>
            <Link href="/login">Sign in</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container navbar-container">
        {/* Left: Brand Logo */}
        <Link href="/" className="navbar-logo-container" style={{ display: 'flex', alignItems: 'center' }}>
          <Logo theme="light" height={44} />
        </Link>

        {/* Center: Desktop Navigation Links (with custom rich mega menus) */}
        <div className="desktop-only-links" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          
          {/* Shop tab */}
          <div className="navbar-link-item-wrapper" style={{ height: '100%' }}>
            <Link href="/shop" className={`navbar-link-item ${pathname === '/shop' ? 'active' : ''}`}>
              Shop
            </Link>
          </div>

          {/* Engagement Rings tab */}
          <div className="navbar-link-item-wrapper" style={{ height: '100%' }}>
            <Link href="/engagement-rings" className={`navbar-link-item ${pathname === '/engagement-rings' ? 'active' : ''}`}>
              Engagement rings
            </Link>
            
            {/* Mega Menu: Engagement Rings */}
            <div className="mega-menu slide-down-enter">
              <div className="mega-menu-content-grid mega-menu-content-grid-5">
                <div>
                  <h4 className="menu-column-title">Design your engagement ring</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/engagement-rings" className="menu-item-link"><RingIcon /> Start with a setting</Link></li>
                    <li><Link href="/engagement-rings" className="menu-item-link"><RingIcon /> Shop ready-to-ship rings</Link></li>
                  </ul>
                  <Link href="/engagement-rings" className="menu-action-link">Shop all engagement rings &gt;</Link>
                </div>
                
                <div>
                  <h4 className="menu-column-title">Shop by style</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/engagement-rings" className="menu-item-link"><RingIcon /> Solitaire</Link></li>
                    <li><Link href="/engagement-rings" className="menu-item-link"><RingIcon /> Halo</Link></li>
                    <li><Link href="/engagement-rings" className="menu-item-link"><RingIcon /> Pavé and Side-Stone</Link></li>
                    <li><Link href="/engagement-rings" className="menu-item-link"><RingIcon /> Three Stone</Link></li>
                    <li><Link href="/engagement-rings" className="menu-item-link"><RingIcon /> Hidden Halo</Link></li>
                  </ul>
                  <Link href="/engagement-rings" className="menu-action-link">Shop all styles &gt;</Link>
                  
                  <div className="menu-sub-section">
                    <h4 className="menu-column-title">New Arrivals</h4>
                    <ul className="menu-column-list">
                      <li><Link href="/engagement-rings" className="menu-item-link"><RingIcon /> Shop all new arrivals</Link></li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="menu-column-title">Shop by metal</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/engagement-rings" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E9B646' }} /> Yellow Gold</Link></li>
                    <li><Link href="/engagement-rings" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E5E9EC' }} /> White Gold</Link></li>
                    <li><Link href="/engagement-rings" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E0A391' }} /> Rose Gold</Link></li>
                    <li><Link href="/engagement-rings" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#C0C0C0' }} /> Platinum</Link></li>
                  </ul>
                  
                  <div className="menu-sub-section">
                    <h4 className="menu-column-title">Gemstone Rings</h4>
                    <ul className="menu-column-list">
                      <li><Link href="/engagement-rings" className="menu-item-link"><RingIcon /> Moissanite rings</Link></li>
                    </ul>
                  </div>
                  
                  <div className="menu-sub-section">
                    <h4 className="menu-column-title">Custom Ring Design</h4>
                    <ul className="menu-column-list">
                      <li><Link href="/engagement-rings" className="menu-item-link"><RingIcon /> Custom engagement rings</Link></li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="menu-column-title">Featured</h4>
                  <ul className="menu-column-list" style={{ gap: '12px' }}>
                    <li><Link href="/engagement-rings" className="menu-item-link" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>Ready to ship engagement rings</Link></li>
                    <li><Link href="/engagement-rings" className="menu-item-link" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>Engagement rings</Link></li>
                    <li><Link href="/engagement-rings" className="menu-item-link" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>Signature collection</Link></li>
                    <li><Link href="/wedding-bands" className="menu-item-link" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>Wedding rings</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="menu-column-title">Education</h4>
                  <ul className="menu-column-list" style={{ gap: '12px', marginBottom: '16px' }}>
                    <li><Link href="/engagement-rings" className="menu-item-link" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>Most popular engagement rings</Link></li>
                  </ul>
                  
                  {/* Banner */}
                  <Link href="/engagement-rings" className="menu-promo-card-vertical" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=300&auto=format&fit=crop)' }}>
                    <div className="menu-promo-card-overlay"></div>
                    <div className="menu-promo-content">
                      <div className="menu-promo-title">Signature Collection</div>
                      <span className="menu-promo-action">Shop now</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Wedding Bands tab */}
          <div className="navbar-link-item-wrapper" style={{ height: '100%' }}>
            <Link href="/wedding-bands" className={`navbar-link-item ${pathname === '/wedding-bands' ? 'active' : ''}`}>
              Wedding bands
            </Link>

            {/* Mega Menu: Wedding Bands */}
            <div className="mega-menu slide-down-enter">
              <div className="mega-menu-content-grid mega-menu-content-grid-5">
                <div>
                  <h4 className="menu-column-title">Women</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/wedding-bands" className="menu-item-link">Classic bands</Link></li>
                    <li><Link href="/wedding-bands" className="menu-item-link">Eternity rings</Link></li>
                    <li><Link href="/wedding-bands" className="menu-item-link">Curved rings</Link></li>
                    <li><Link href="/wedding-bands" className="menu-item-link">Anniversary rings</Link></li>
                    <li><Link href="/wedding-bands" className="menu-item-link">Stackable rings</Link></li>
                  </ul>
                  <Link href="/wedding-bands" className="menu-action-link">All women's wedding bands &gt;</Link>
                </div>

                <div>
                  <h4 className="menu-column-title">Men</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/wedding-bands" className="menu-item-link">Classic bands</Link></li>
                    <li><Link href="/wedding-bands" className="menu-item-link">Matte bands</Link></li>
                    <li><Link href="/wedding-bands" className="menu-item-link">Hammered bands</Link></li>
                    <li><Link href="/wedding-bands" className="menu-item-link">Engraved Bands</Link></li>
                  </ul>
                  <Link href="/wedding-bands" className="menu-action-link">All men's wedding bands &gt;</Link>
                </div>

                <div>
                  <h4 className="menu-column-title">Women's by metal</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/wedding-bands" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#D99F8D' }} /> Rose Gold</Link></li>
                    <li><Link href="/wedding-bands" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E2C379' }} /> Yellow Gold</Link></li>
                    <li><Link href="/wedding-bands" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E2E7EB' }} /> White Gold</Link></li>
                    <li><Link href="/wedding-bands" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#C8CDD0' }} /> Platinum</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="menu-column-title">Men's by metal</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/wedding-bands" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#C8CDD0' }} /> Platinum</Link></li>
                    <li><Link href="/wedding-bands" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E2C379' }} /> Yellow Gold</Link></li>
                    <li><Link href="/wedding-bands" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#8792A0' }} /> Tantalum</Link></li>
                  </ul>
                  <Link href="/wedding-bands" className="menu-action-link">Shop all metals &gt;</Link>
                </div>

                <div>
                  <h4 className="menu-column-title">Education</h4>
                  <ul className="menu-column-list" style={{ gap: '12px' }}>
                    <li><Link href="/wedding-bands" className="menu-item-link" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>Wedding band guide</Link></li>
                    <li><Link href="/wedding-bands" className="menu-item-link" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>Most popular wedding bands</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Earrings tab */}
          <div className="navbar-link-item-wrapper" style={{ height: '100%' }}>
            <Link href="/earrings" className={`navbar-link-item ${pathname === '/earrings' ? 'active' : ''}`}>
              Earrings
            </Link>

            {/* Mega Menu: Earrings */}
            <div className="mega-menu slide-down-enter">
              <div className="mega-menu-content-grid mega-menu-content-grid-necklace">
                <div>
                  <h4 className="menu-column-title">Shop by style</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/earrings" className="menu-item-link">Studs</Link></li>
                    <li><Link href="/earrings" className="menu-item-link">Hoops</Link></li>
                    <li><Link href="/earrings" className="menu-item-link">Drop earrings</Link></li>
                    <li><Link href="/earrings" className="menu-item-link">Plain metal</Link></li>
                  </ul>
                  <Link href="/earrings" className="menu-action-link">Shop all earrings &gt;</Link>
                </div>

                <div>
                  <h4 className="menu-column-title">Shop by metal</h4>
                  <ul className="menu-column-list" style={{ marginBottom: '16px' }}>
                    <li><Link href="/earrings" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E5E9EC' }} /> White Gold</Link></li>
                    <li><Link href="/earrings" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E2C379' }} /> Yellow Gold</Link></li>
                    <li><Link href="/earrings" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#D2D7DF' }} /> Silver</Link></li>
                    <li><Link href="/earrings" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E3C572' }} /> Vermeil</Link></li>
                  </ul>

                  <div className="menu-sub-section">
                    <h4 className="menu-column-title">Featured</h4>
                    <ul className="menu-column-list">
                      <li><Link href="/earrings" className="menu-item-link">Best Sellers</Link></li>
                      <li><Link href="/earrings" className="menu-item-link">Luxe collection</Link></li>
                      <li><Link href="/earrings" className="menu-item-link">Create your own earrings</Link></li>
                    </ul>
                  </div>
                </div>

                {/* Triple Promo Area */}
                <div className="necklace-promo-area">
                  {/* Left portrait card */}
                  <Link href="/earrings" className="menu-promo-card-vertical" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=400&auto=format&fit=crop)', height: '220px' }}>
                    <div className="menu-promo-card-overlay"></div>
                    <div className="menu-promo-content">
                      <div className="menu-promo-title">Classic Studs</div>
                      <div className="menu-promo-subtitle">(Starting at $199)</div>
                      <span className="menu-promo-action">Shop now</span>
                    </div>
                  </Link>

                  {/* Right landscape cards */}
                  <div className="necklace-promo-right-stack">
                    <Link href="/earrings" className="menu-promo-card-horizontal" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=300&auto=format&fit=crop)' }}>
                      <div className="menu-promo-card-overlay"></div>
                      <div className="menu-promo-content">
                        <div className="menu-promo-title" style={{ fontSize: '14px' }}>Signature Collection</div>
                        <span className="menu-promo-action" style={{ fontSize: '11px' }}>Shop now</span>
                      </div>
                    </Link>

                    <Link href="/earrings" className="menu-promo-card-horizontal" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=300&auto=format&fit=crop)' }}>
                      <div className="menu-promo-card-overlay"></div>
                      <div className="menu-promo-content">
                        <div className="menu-promo-title" style={{ fontSize: '14px' }}>Pearl Collection</div>
                        <span className="menu-promo-action" style={{ fontSize: '11px' }}>Shop Now</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Necklaces tab */}
          <div className="navbar-link-item-wrapper" style={{ height: '100%' }}>
            <Link href="/necklaces" className={`navbar-link-item ${pathname === '/necklaces' ? 'active' : ''}`}>
              Necklaces
            </Link>

            {/* Mega Menu: Necklaces */}
            <div className="mega-menu slide-down-enter">
              <div className="mega-menu-content-grid mega-menu-content-grid-necklace">
                <div>
                  <h4 className="menu-column-title">Shop by style</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/necklaces" className="menu-item-link">Pendants</Link></li>
                    <li><Link href="/necklaces" className="menu-item-link">Tennis</Link></li>
                    <li><Link href="/necklaces" className="menu-item-link">Pearls</Link></li>
                    <li><Link href="/necklaces" className="menu-item-link">Chains</Link></li>
                  </ul>
                  <Link href="/necklaces" className="menu-action-link">Shop all necklace styles &gt;</Link>
                </div>

                <div>
                  <h4 className="menu-column-title">Shop by metal color</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/necklaces" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E5E9EC' }} /> White Gold</Link></li>
                    <li><Link href="/necklaces" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E9B646' }} /> Yellow Gold</Link></li>
                    <li><Link href="/necklaces" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#D2D7DF' }} /> Silver</Link></li>
                    <li><Link href="/necklaces" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E3C572' }} /> Vermeil</Link></li>
                  </ul>

                  <div className="menu-sub-section">
                    <h4 className="menu-column-title">Featured</h4>
                    <ul className="menu-column-list">
                      <li><Link href="/necklaces" className="menu-item-link">Best selling collection</Link></li>
                      <li><Link href="/necklaces" className="menu-item-link">Create your own pendant</Link></li>
                    </ul>
                  </div>
                </div>

                {/* Triple Promo Area */}
                <div className="necklace-promo-area">
                  {/* Left portrait card */}
                  <Link href="/necklaces" className="menu-promo-card-vertical" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300&auto=format&fit=crop)', minHeight: '100%' }}>
                    <div className="menu-promo-card-overlay"></div>
                    <div className="menu-promo-content">
                      <div className="menu-promo-title">Split Bail Necklace</div>
                      <div className="menu-promo-subtitle">(Starting at $499)</div>
                      <span className="menu-promo-action">Shop now</span>
                    </div>
                  </Link>

                  {/* Right landscape cards */}
                  <div className="necklace-promo-right-stack">
                    <Link href="/necklaces" className="menu-promo-card-horizontal" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=300&auto=format&fit=crop)' }}>
                      <div className="menu-promo-card-overlay"></div>
                      <div className="menu-promo-content">
                        <div className="menu-promo-title" style={{ fontSize: '15px' }}>Pearl Collection</div>
                        <span className="menu-promo-action" style={{ fontSize: '11px' }}>Shop Now</span>
                      </div>
                    </Link>

                    <Link href="/necklaces" className="menu-promo-card-horizontal" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=300&auto=format&fit=crop)' }}>
                      <div className="menu-promo-card-overlay"></div>
                      <div className="menu-promo-content">
                        <div className="menu-promo-title" style={{ fontSize: '15px' }}>Personalized Collection</div>
                        <span className="menu-promo-action" style={{ fontSize: '11px' }}>Shop now</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bracelets tab */}
          <div className="navbar-link-item-wrapper" style={{ height: '100%' }}>
            <Link href="/bracelets" className={`navbar-link-item ${pathname === '/bracelets' ? 'active' : ''}`}>
              Bracelets
            </Link>

            {/* Mega Menu: Bracelets */}
            <div className="mega-menu slide-down-enter">
              <div className="mega-menu-content-grid mega-menu-content-grid-4">
                <div>
                  <h4 className="menu-column-title">Shop by style</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/bracelets" className="menu-item-link">Tennis</Link></li>
                    <li><Link href="/bracelets" className="menu-item-link">Chains</Link></li>
                    <li><Link href="/bracelets" className="menu-item-link">Pearls</Link></li>
                    <li><Link href="/bracelets" className="menu-item-link">Bangles</Link></li>
                  </ul>
                  <Link href="/bracelets" className="menu-action-link">Shop all bracelet styles &gt;</Link>
                </div>

                <div>
                  <h4 className="menu-column-title">Shop by metal color</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/bracelets" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E5E9EC' }} /> White Gold</Link></li>
                    <li><Link href="/bracelets" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E9B646' }} /> Yellow Gold</Link></li>
                    <li><Link href="/bracelets" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#D2D7DF' }} /> Silver</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="menu-column-title">Essentials</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/bracelets" className="menu-item-link"><BraceletIcon /> Tennis bracelets</Link></li>
                    <li><Link href="/bracelets" className="menu-item-link"><BraceletIcon /> Gemstone bracelets</Link></li>
                  </ul>
                </div>

                <div>
                  <Link href="/bracelets" className="menu-promo-card-vertical" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=300&auto=format&fit=crop)' }}>
                    <div className="menu-promo-card-overlay"></div>
                    <div className="menu-promo-content">
                      <div className="menu-promo-title">Tennis bracelet</div>
                      <div className="menu-promo-subtitle">Starting at $1,290</div>
                      <span className="menu-promo-action">Shop now</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Gifts tab */}
          <div className="navbar-link-item-wrapper" style={{ height: '100%' }}>
            <Link href="/gifts" className={`navbar-link-item ${pathname === '/gifts' ? 'active' : ''}`}>
              Gifts
            </Link>

            {/* Mega Menu: Gifts */}
            <div className="mega-menu slide-down-enter">
              <div className="mega-menu-content-grid mega-menu-content-grid-4">
                <div>
                  <h4 className="menu-column-title">Top Gifts</h4>
                  <ul className="menu-column-list" style={{ marginBottom: '16px' }}>
                    <li><Link href="/earrings" className="menu-item-link">Stud earrings</Link></li>
                    <li><Link href="/necklaces" className="menu-item-link">Solitaire necklaces</Link></li>
                    <li><Link href="/bracelets" className="menu-item-link">Tennis bracelets</Link></li>
                    <li><Link href="/gifts" className="menu-item-link">Most loved gifts</Link></li>
                  </ul>
                  <Link href="/gifts" className="menu-action-link">Shop all gifts &gt;</Link>

                  <div className="menu-sub-section">
                    <h4 className="menu-column-title">Gifts by budget</h4>
                    <ul className="menu-column-list">
                      <li><Link href="/gifts" className="menu-item-link">Under $250</Link></li>
                      <li><Link href="/gifts" className="menu-item-link">Under $500</Link></li>
                      <li><Link href="/gifts" className="menu-item-link">Under $1,000</Link></li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="menu-column-title">Gifts by occasion</h4>
                  <ul className="menu-column-list" style={{ marginBottom: '16px' }}>
                    <li><Link href="/gifts" className="menu-item-link">Graduation gifts</Link></li>
                    <li><Link href="/gifts" className="menu-item-link">Anniversary gifts</Link></li>
                    <li><Link href="/gifts" className="menu-item-link">Birthday gifts</Link></li>
                    <li><Link href="/gifts" className="menu-item-link">Push presents</Link></li>
                  </ul>

                  <div className="menu-sub-section">
                    <h4 className="menu-column-title">Gifts by recipient</h4>
                    <ul className="menu-column-list">
                      <li><Link href="/gifts" className="menu-item-link">Gifts for him</Link></li>
                      <li><Link href="/gifts" className="menu-item-link">Gifts for her</Link></li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="menu-column-title">Gifts by collection</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/gifts" className="menu-item-link">Personalized jewelry</Link></li>
                    <li><Link href="/gifts" className="menu-item-link">Pearl jewelry</Link></li>
                    <li><Link href="/gifts" className="menu-item-link">Quick ship gifts</Link></li>
                    <li><Link href="/gifts" className="menu-item-link">Trending gifts</Link></li>
                    <li><Link href="/gifts" className="menu-item-link">Promise rings</Link></li>
                  </ul>
                  <Link href="/gifts" className="menu-action-link" style={{ marginTop: '12px' }}>Shop all collections &gt;</Link>
                </div>

                <div>
                  <Link href="/gifts" className="menu-promo-card-vertical" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=300&auto=format&fit=crop)' }}>
                    <div className="menu-promo-card-overlay"></div>
                    <div className="menu-promo-content">
                      <div className="menu-promo-title">Shop best sellers</div>
                      <span className="menu-promo-action">Shop now</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* About tab */}
          <div className="navbar-link-item-wrapper" style={{ height: '100%' }}>
            <Link href="/about" className={`navbar-link-item ${pathname === '/about' ? 'active' : ''}`}>
              About
            </Link>
          </div>

          {/* Contact tab */}
          <div className="navbar-link-item-wrapper" style={{ height: '100%' }}>
            <Link href="/contact" className={`navbar-link-item ${pathname === '/contact' ? 'active' : ''}`}>
              Contact
            </Link>
          </div>
        </div>

        {/* Right: Cart & Actions */}
        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button className="navbar-action-btn desktop-only" title="Search" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <Search size={21} />
          </button>
          <button className="navbar-action-btn desktop-only" title="Favorites" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <Heart size={21} />
          </button>
          <Link 
            href="/cart" 
            className="navbar-action-btn" 
            title="Shopping Cart"
            style={{ color: pathname === '/cart' ? 'var(--color-teal)' : '', position: 'relative', display: 'flex', alignItems: 'center', padding: '4px' }}
          >
            <ShoppingBag size={21} />
            {cartCount > 0 && <span className="navbar-cart-count">{cartCount}</span>}
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="navbar-action-btn mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="mobile-menu-panel slide-down-enter">
          <div className="mobile-menu-content">
            <Link href="/" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/shop" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              Shop
            </Link>
            <Link href="/engagement-rings" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              Engagement Rings
            </Link>
            <Link href="/wedding-bands" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              Wedding Bands
            </Link>
            <Link href="/earrings" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              Earrings
            </Link>
            <Link href="/necklaces" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              Necklaces
            </Link>
            <Link href="/bracelets" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              Bracelets
            </Link>
            <Link href="/gifts" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              Gifts
            </Link>
            <Link href="/about" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
            <Link 
              href="/cart" 
              className={`mobile-menu-item ${pathname === '/cart' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Shopping Cart ({cartCount})
            </Link>
          </div>
        </div>
      )}

      {/* Styles for elements */}
      <style>{`
        .desktop-only-links {
          display: flex;
          align-items: center;
          height: 100%;
        }
        .desktop-only {
          display: inline-flex;
        }
        .mobile-menu-toggle {
          display: none;
        }
        .mobile-menu-panel {
          position: absolute;
          top: 70px;
          left: 0;
          right: 0;
          background-color: var(--color-card);
          border-bottom: 1px solid var(--color-border);
          box-shadow: var(--shadow-e2);
          z-index: 98;
          padding: var(--space-4) 0;
        }
        .mobile-menu-content {
          display: flex;
          flex-direction: column;
          padding: 0 var(--space-4);
        }
        .mobile-menu-item {
          padding: var(--space-3) 0;
          font-size: 16px;
          font-weight: 600;
          border-bottom: 1px solid var(--color-border-soft);
          color: var(--color-ink);
        }
        .mobile-menu-item:last-child {
          border-bottom: none;
        }
        .mobile-menu-item.active {
          color: var(--color-teal);
        }

        @media (max-width: 1024px) {
          .desktop-only-links, .desktop-only {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: inline-flex !important;
          }
        }
      `}</style>
    </nav>
  );
};
export default Navbar;
