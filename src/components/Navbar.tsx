'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Logo from './Logo';
import { supabase } from '../lib/supabase';
import './components.css';

// Faceted Diamond Heart SVG Icon for Logo
const LogoIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-teal)', margin: '0 2px' }}>
    <path d="M12 5 C10 1 2 1 2 9 C2 16 12 22 12 22 C12 22 22 16 22 9 C22 1 14 1 12 5 Z" fill="none" stroke="currentColor" />
    <path d="M12 5 L12 22" strokeWidth="0.8" opacity="0.5" />
    <path d="M2 9 L22 9" strokeWidth="0.8" opacity="0.5" />
    <path d="M12 5 L5 12 L12 22" strokeWidth="0.8" opacity="0.5" />
    <path d="M12 5 L19 12 L12 22" strokeWidth="0.8" opacity="0.5" />
  </svg>
);

// Custom Ring SVG Icon for Menu Items
const RingIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="menu-icon" style={{ marginRight: '6px' }}>
    <circle cx="12" cy="14" r="6" />
    <path d="M12 2 L9 5 L12 8 L15 5 Z" />
  </svg>
);

// Custom Diamond SVG Icon for Menu Items
const DiamondIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="menu-icon" style={{ marginRight: '6px' }}>
    <path d="M6 3h12l4 6-10 12L2 9z" />
    <path d="M2 9h20" />
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

// Custom Earrings SVG Icon
const EarringsIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" className="menu-icon" style={{ marginRight: '6px' }}>
    <circle cx="8" cy="12" r="2.5" />
    <circle cx="16" cy="12" r="2.5" />
    <path d="M8 9.5V6M16 9.5V6" />
  </svg>
);

// Custom Pendant SVG Icon
const PendantIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" className="menu-icon" style={{ marginRight: '6px' }}>
    <path d="M12 2v7" />
    <circle cx="12" cy="14" r="3.5" />
    <circle cx="12" cy="14" r="1" fill="currentColor" />
  </svg>
);

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();
  const cartCount = cart.length;
  const contactDropdownRef = useRef<HTMLDivElement>(null);
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();
      setIsAdmin(!!data);
    } catch {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        checkAdminStatus(currentUser.id);
      } else {
        setIsAdmin(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        checkAdminStatus(currentUser.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(event.target as Node)) {
        setContactOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

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
                  <p className="contact-dropdown-subtitle">Connect with a certified gemologist.</p>
                  
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
            {user ? (
              <div className="navbar-top-link-wrapper" style={{ position: 'relative' }} ref={userDropdownRef}>
                <button 
                  className="navbar-top-btn" 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
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
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </button>
                
                {userMenuOpen && (
                  <div className="contact-top-dropdown animate-fade-in" style={{ right: 0, left: 'auto', minWidth: '180px' }}>
                    <h4 className="contact-dropdown-title">My Account</h4>
                    <p className="contact-dropdown-subtitle" style={{ fontSize: '11px', wordBreak: 'break-all' }}>{user.email}</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '12px' }}>
                      {isAdmin && (
                        <Link 
                          href="/admin/dashboard" 
                          className="contact-dropdown-chat-btn" 
                          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#6366f1' }}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      
                      <button 
                        className="contact-dropdown-chat-btn" 
                        style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #e2e8f0' }}
                        onClick={async () => {
                          await supabase.auth.signOut();
                          setUserMenuOpen(false);
                          router.refresh();
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">Sign in</Link>
            )}
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
                    <li><Link href="/engagement-rings?style=setting" className="menu-item-link"><RingIcon /> Start with a setting</Link></li>
                    <li><Link href="/engagement-rings?style=lab" className="menu-item-link"><DiamondIcon /> Start with a lab diamond</Link></li>
                    <li><Link href="/engagement-rings?style=natural" className="menu-item-link"><DiamondIcon /> Start with a natural diamond</Link></li>
                    <li><Link href="/engagement-rings?style=ready" className="menu-item-link"><RingIcon /> Shop ready-to-ship rings</Link></li>
                  </ul>
                  <Link href="/engagement-rings" className="menu-action-link">Shop all engagement rings &gt;</Link>
                </div>
                
                <div>
                  <h4 className="menu-column-title">Shop by style</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/engagement-rings?style=Solitaire" className="menu-item-link"><RingIcon /> Solitaire</Link></li>
                    <li><Link href="/engagement-rings?style=Halo" className="menu-item-link"><RingIcon /> Halo</Link></li>
                    <li><Link href="/engagement-rings?style=Pavé" className="menu-item-link"><RingIcon /> Pavé and Side-Stone</Link></li>
                    <li><Link href="/engagement-rings?style=Three-Stone" className="menu-item-link"><RingIcon /> Three Stone</Link></li>
                    <li><Link href="/engagement-rings?style=Hidden-Halo" className="menu-item-link"><RingIcon /> Hidden Halo</Link></li>
                  </ul>
                  <Link href="/engagement-rings" className="menu-action-link">Shop all styles &gt;</Link>
                  
                  <div className="menu-sub-section">
                    <h4 className="menu-column-title">New Arrivals</h4>
                    <ul className="menu-column-list">
                      <li><Link href="/engagement-rings?style=new" className="menu-item-link"><RingIcon /> Shop all new arrivals</Link></li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="menu-column-title">Shop by metal</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/engagement-rings?style=yellow-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E9B646' }} /> Yellow Gold</Link></li>
                    <li><Link href="/engagement-rings?style=white-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E5E9EC' }} /> White Gold</Link></li>
                    <li><Link href="/engagement-rings?style=rose-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E0A391' }} /> Rose Gold</Link></li>
                    <li><Link href="/engagement-rings?style=platinum" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#C0C0C0' }} /> Platinum</Link></li>
                  </ul>
                  
                  <div className="menu-sub-section">
                    <h4 className="menu-column-title">Gemstone Rings</h4>
                    <ul className="menu-column-list">
                      <li><Link href="/engagement-rings?style=gemstone" className="menu-item-link"><RingIcon /> Moissanite rings</Link></li>
                    </ul>
                  </div>
                  
                  <div className="menu-sub-section">
                    <h4 className="menu-column-title">Custom Ring Design</h4>
                    <ul className="menu-column-list">
                      <li><Link href="/engagement-rings?style=custom" className="menu-item-link"><RingIcon /> Custom engagement rings</Link></li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="menu-column-title">Featured</h4>
                  <ul className="menu-column-list" style={{ gap: '12px' }}>
                    <li><Link href="/engagement-rings?style=ready" className="menu-item-link" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>Ready to ship engagement rings</Link></li>
                    <li><Link href="/engagement-rings" className="menu-item-link" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>Engagement rings</Link></li>
                    <li><Link href="/engagement-rings?style=signature" className="menu-item-link" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>Signature collection</Link></li>
                    <li><Link href="/wedding-bands" className="menu-item-link" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>Wedding rings</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="menu-column-title">Education</h4>
                  <ul className="menu-column-list" style={{ gap: '12px', marginBottom: '16px' }}>
                    <li><Link href="/diamonds?style=lab" className="menu-item-link" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>Lab grown vs Natural diamonds</Link></li>
                    <li><Link href="/engagement-rings" className="menu-item-link" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>Most popular engagement rings</Link></li>
                  </ul>
                  
                  {/* Banner */}
                  <Link href="/engagement-rings?style=christian" className="menu-promo-card-vertical" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=300&auto=format&fit=crop)' }}>
                    <div className="menu-promo-card-overlay"></div>
                    <div className="menu-promo-content">
                      <div className="menu-promo-title">The Christian Siriano Collection</div>
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
                    <li><Link href="/wedding-bands?style=classic" className="menu-item-link">Classic bands</Link></li>
                    <li><Link href="/wedding-bands?style=eternity" className="menu-item-link">Eternity rings</Link></li>
                    <li><Link href="/wedding-bands?style=curved" className="menu-item-link">Curved rings</Link></li>
                    <li><Link href="/wedding-bands?style=anniversary" className="menu-item-link">Anniversary rings</Link></li>
                    <li><Link href="/wedding-bands?style=stackable" className="menu-item-link">Stackable rings</Link></li>
                  </ul>
                  <Link href="/wedding-bands" className="menu-action-link">All women's wedding bands &gt;</Link>
                </div>
 
                <div>
                  <h4 className="menu-column-title">Men</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/wedding-bands?style=mens-classic" className="menu-item-link">Classic bands</Link></li>
                    <li><Link href="/wedding-bands?style=mens-matte" className="menu-item-link">Matte bands</Link></li>
                    <li><Link href="/wedding-bands?style=mens-hammered" className="menu-item-link">Hammered bands</Link></li>
                    <li><Link href="/wedding-bands?style=mens-engraved" className="menu-item-link">Engraved Bands</Link></li>
                  </ul>
                  <Link href="/wedding-bands?style=mens" className="menu-action-link">All men's wedding bands &gt;</Link>
                </div>
 
                <div>
                  <h4 className="menu-column-title">Women's by metal</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/wedding-bands?style=rose-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#D99F8D' }} /> Rose Gold</Link></li>
                    <li><Link href="/wedding-bands?style=yellow-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E2C379' }} /> Yellow Gold</Link></li>
                    <li><Link href="/wedding-bands?style=white-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E2E7EB' }} /> White Gold</Link></li>
                    <li><Link href="/wedding-bands?style=platinum" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#C8CDD0' }} /> Platinum</Link></li>
                  </ul>
                </div>
 
                <div>
                  <h4 className="menu-column-title">Men's by metal</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/wedding-bands?style=mens-platinum" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#C8CDD0' }} /> Platinum</Link></li>
                    <li><Link href="/wedding-bands?style=mens-yellow-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E2C379' }} /> Yellow Gold</Link></li>
                    <li><Link href="/wedding-bands?style=tantalum" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#8792A0' }} /> Tantalum</Link></li>
                  </ul>
                  <Link href="/wedding-bands" className="menu-action-link">Shop all metals &gt;</Link>
                </div>
 
                <div>
                  <h4 className="menu-column-title">Education</h4>
                  <ul className="menu-column-list" style={{ gap: '12px' }}>
                    <li><Link href="/diamonds?style=lab" className="menu-item-link" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>Lab grown vs Natural diamonds</Link></li>
                    <li><Link href="/diamonds" className="menu-item-link" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>Most popular engagement rings</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Diamonds tab */}
          <div className="navbar-link-item-wrapper" style={{ height: '100%' }}>
            <Link href="/diamonds" className={`navbar-link-item ${pathname === '/diamonds' ? 'active' : ''}`}>
              Diamonds
            </Link>

            {/* Mega Menu: Diamonds */}
            <div className="mega-menu slide-down-enter">
              <div className="mega-menu-content-grid mega-menu-content-grid-4">
                <div>
                  <h4 className="menu-column-title">Shop by shape</h4>
                  <ul className="menu-column-list" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                    <li>
                      <Link href="/diamonds?shape=Round" className="menu-item-link">
                        <img src="https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/round.webp" alt="Round" width="14" height="14" style={{ marginRight: '6px', objectFit: 'contain' }} />
                        Round
                      </Link>
                    </li>
                    <li>
                      <Link href="/diamonds?shape=Oval" className="menu-item-link">
                        <img src="https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/oval.webp" alt="Oval" width="14" height="14" style={{ marginRight: '6px', objectFit: 'contain' }} />
                        Oval
                      </Link>
                    </li>
                    <li>
                      <Link href="/diamonds?shape=Marquise" className="menu-item-link">
                        <img src="https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/marquise.webp" alt="Marquise" width="14" height="14" style={{ marginRight: '6px', objectFit: 'contain' }} />
                        Marquise
                      </Link>
                    </li>
                    <li>
                      <Link href="/diamonds?shape=Emerald" className="menu-item-link">
                        <img src="https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/emerald.webp" alt="Emerald" width="14" height="14" style={{ marginRight: '6px', objectFit: 'contain' }} />
                        Emerald
                      </Link>
                    </li>
                    <li>
                      <Link href="/diamonds?shape=Princess" className="menu-item-link">
                        <img src="https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/princess.webp" alt="Princess" width="14" height="14" style={{ marginRight: '6px', objectFit: 'contain' }} />
                        Princess
                      </Link>
                    </li>
                    <li>
                      <Link href="/diamonds?shape=Cushion" className="menu-item-link">
                        <img src="https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/cushion.webp" alt="Cushion" width="14" height="14" style={{ marginRight: '6px', objectFit: 'contain' }} />
                        Cushion
                      </Link>
                    </li>
                    <li>
                      <Link href="/diamonds?shape=Radiant" className="menu-item-link">
                        <img src="https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/radiant.webp" alt="Radiant" width="14" height="14" style={{ marginRight: '6px', objectFit: 'contain' }} />
                        Radiant
                      </Link>
                    </li>
                    <li>
                      <Link href="/diamonds?shape=Pear" className="menu-item-link">
                        <img src="https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/pear.webp" alt="Pear" width="14" height="14" style={{ marginRight: '6px', objectFit: 'contain' }} />
                        Pear
                      </Link>
                    </li>
                    <li>
                      <Link href="/diamonds?shape=Heart" className="menu-item-link">
                        <img src="https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/heart.webp" alt="Heart" width="14" height="14" style={{ marginRight: '6px', objectFit: 'contain' }} />
                        Heart
                      </Link>
                    </li>
                    <li>
                      <Link href="/diamonds?shape=Asscher" className="menu-item-link">
                        <img src="https://cldnr.rarecarat.com/rarecarat/image/upload/v1686552091/shapes/asscher.webp" alt="Asscher" width="14" height="14" style={{ marginRight: '6px', objectFit: 'contain' }} />
                        Asscher
                      </Link>
                    </li>
                  </ul>
                  <Link href="/diamonds" className="menu-action-link" style={{ marginTop: '16px' }}>Shop all diamonds &gt;</Link>
                </div>
 
                <div>
                  <h4 className="menu-column-title">Create your own</h4>
                  <ul className="menu-column-list" style={{ marginBottom: '16px' }}>
                    <li><Link href="/engagement-rings" className="menu-item-link"><RingIcon /> Diamond engagement ring</Link></li>
                    <li><Link href="/earrings" className="menu-item-link"><EarringsIcon /> Diamond earrings</Link></li>
                    <li><Link href="/necklaces?style=pendant" className="menu-item-link"><PendantIcon /> Diamond pendant</Link></li>
                  </ul>
 
                  <div className="menu-sub-section">
                    <h4 className="menu-column-title">Loose Diamonds</h4>
                    <ul className="menu-column-list">
                      <li><Link href="/diamonds?style=natural" className="menu-item-link"><DiamondIcon /> Shop natural diamonds</Link></li>
                      <li><Link href="/diamonds?style=lab" className="menu-item-link"><DiamondIcon /> Shop lab diamonds</Link></li>
                    </ul>
                  </div>
                </div>
 
                <div>
                  <h4 className="menu-column-title">Diamond Jewelry</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/earrings" className="menu-item-link">Diamond earrings</Link></li>
                    <li><Link href="/necklaces" className="menu-item-link">Diamond necklaces</Link></li>
                    <li><Link href="/bracelets?style=tennis" className="menu-item-link">Tennis bracelets</Link></li>
                    <li><Link href="/wedding-bands?style=eternity" className="menu-item-link">Eternity rings</Link></li>
                    <li><Link href="/wedding-bands?style=anniversary" className="menu-item-link">Anniversary rings</Link></li>
                  </ul>
                  <Link href="/diamonds" className="menu-action-link" style={{ marginTop: '12px' }}>All diamond jewelry &gt;</Link>
                </div>
 
                <div>
                  <h4 className="menu-column-title">Education</h4>
                  <ul className="menu-column-list" style={{ gap: '10px' }}>
                    <li><Link href="/diamonds?style=lab" className="menu-item-link" style={{ fontSize: '13px' }}>Diamond cut guide</Link></li>
                    <li><Link href="/diamonds" className="menu-item-link" style={{ fontSize: '13px' }}>Diamond color guide</Link></li>
                    <li><Link href="/diamonds" className="menu-item-link" style={{ fontSize: '13px' }}>Diamond clarity guide</Link></li>
                    <li><Link href="/diamonds" className="menu-item-link" style={{ fontSize: '13px' }}>Diamond carat guide</Link></li>
                    <li><Link href="/diamonds" className="menu-item-link" style={{ fontSize: '13px' }}>Diamond 101 guide</Link></li>
                    <li><Link href="/diamonds" className="menu-item-link" style={{ fontSize: '13px' }}>Diamond trends</Link></li>
                    <li><Link href="/diamonds" className="menu-item-link" style={{ fontSize: '13px' }}>Use our 8-step guide</Link></li>
                    <li><Link href="/diamonds?style=lab" className="menu-item-link" style={{ fontSize: '13px' }}>Lab diamonds</Link></li>
                    <li><Link href="/diamonds" className="menu-item-link" style={{ fontSize: '13px' }}>Diamonds</Link></li>
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
                    <li><Link href="/earrings?style=studs" className="menu-item-link">Studs</Link></li>
                    <li><Link href="/earrings?style=lab" className="menu-item-link">Lab diamonds</Link></li>
                    <li><Link href="/earrings?style=hoops" className="menu-item-link">Hoops</Link></li>
                    <li><Link href="/earrings?style=plain" className="menu-item-link">Plain metal</Link></li>
                  </ul>
                  <Link href="/earrings" className="menu-action-link">Shop all earrings &gt;</Link>
                </div>
 
                <div>
                  <h4 className="menu-column-title">Shop by metal</h4>
                  <ul className="menu-column-list" style={{ marginBottom: '16px' }}>
                    <li><Link href="/earrings?style=white-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E5E9EC' }} /> White Gold</Link></li>
                    <li><Link href="/earrings?style=yellow-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E2C379' }} /> Yellow Gold</Link></li>
                    <li><Link href="/earrings?style=silver" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#D2D7DF' }} /> Silver</Link></li>
                    <li><Link href="/earrings?style=vermeil" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E3C572' }} /> Vermeil</Link></li>
                  </ul>
 
                  <div className="menu-sub-section">
                    <h4 className="menu-column-title">Featured</h4>
                    <ul className="menu-column-list">
                      <li><Link href="/earrings?style=best-sellers" className="menu-item-link">Best Sellers</Link></li>
                      <li><Link href="/earrings?style=luxe" className="menu-item-link">Luxe collection</Link></li>
                      <li><Link href="/earrings" className="menu-item-link">Create your own earrings</Link></li>
                    </ul>
                  </div>
                </div>
 
                {/* Triple Promo Area */}
                <div className="necklace-promo-area">
                  {/* Left portrait card */}
                  <Link href="/earrings?style=studs" className="menu-promo-card-vertical" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=400&auto=format&fit=crop)', height: '220px' }}>
                    <div className="menu-promo-card-overlay"></div>
                    <div className="menu-promo-content">
                      <div className="menu-promo-title">Classic Diamond Studs</div>
                      <div className="menu-promo-subtitle">(Starting at $199)</div>
                      <span className="menu-promo-action">Shop now</span>
                    </div>
                  </Link>
 
                  {/* Right landscape cards */}
                  <div className="necklace-promo-right-stack">
                    <Link href="/earrings?style=christian" className="menu-promo-card-horizontal" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=300&auto=format&fit=crop)' }}>
                      <div className="menu-promo-card-overlay"></div>
                      <div className="menu-promo-content">
                        <div className="menu-promo-title" style={{ fontSize: '14px' }}>The Christiano Siriano Collection</div>
                        <span className="menu-promo-action" style={{ fontSize: '11px' }}>Shop now</span>
                      </div>
                    </Link>
 
                    <Link href="/earrings?style=pearl" className="menu-promo-card-horizontal" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=300&auto=format&fit=crop)' }}>
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
                    <li><Link href="/necklaces?style=pendant" className="menu-item-link">Pendants</Link></li>
                    <li><Link href="/necklaces?style=lab" className="menu-item-link">Lab diamonds</Link></li>
                    <li><Link href="/necklaces?style=tennis" className="menu-item-link">Tennis</Link></li>
                    <li><Link href="/necklaces?style=pearl" className="menu-item-link">Pearls</Link></li>
                    <li><Link href="/necklaces?style=chain" className="menu-item-link">Chains</Link></li>
                  </ul>
                  <Link href="/necklaces" className="menu-action-link">Shop all necklace styles &gt;</Link>
                </div>
 
                <div>
                  <h4 className="menu-column-title">Shop by metal color</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/necklaces?style=white-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E5E9EC' }} /> White Gold</Link></li>
                    <li><Link href="/necklaces?style=yellow-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E9B646' }} /> Yellow Gold</Link></li>
                    <li><Link href="/necklaces?style=silver" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#D2D7DF' }} /> Silver</Link></li>
                    <li><Link href="/necklaces?style=vermeil" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E3C572' }} /> Vermeil</Link></li>
                  </ul>
 
                  <div className="menu-sub-section">
                    <h4 className="menu-column-title">Featured</h4>
                    <ul className="menu-column-list">
                      <li><Link href="/necklaces?style=best-sellers" className="menu-item-link">Best selling collection</Link></li>
                      <li><Link href="/necklaces" className="menu-item-link">Create your own pendant</Link></li>
                    </ul>
                  </div>
                </div>
 
                {/* Triple Promo Area */}
                <div className="necklace-promo-area">
                  {/* Left portrait card */}
                  <Link href="/necklaces?style=pendant" className="menu-promo-card-vertical" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300&auto=format&fit=crop)', minHeight: '100%' }}>
                    <div className="menu-promo-card-overlay"></div>
                    <div className="menu-promo-content">
                      <div className="menu-promo-title">Split Bail Necklace</div>
                      <div className="menu-promo-subtitle">(Starting at $499)</div>
                      <span className="menu-promo-action">Shop now</span>
                    </div>
                  </Link>
 
                  {/* Right landscape cards */}
                  <div className="necklace-promo-right-stack">
                    <Link href="/necklaces?style=pearl" className="menu-promo-card-horizontal" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=300&auto=format&fit=crop)' }}>
                      <div className="menu-promo-card-overlay"></div>
                      <div className="menu-promo-content">
                        <div className="menu-promo-title" style={{ fontSize: '15px' }}>Pearl Collection</div>
                        <span className="menu-promo-action" style={{ fontSize: '11px' }}>Shop Now</span>
                      </div>
                    </Link>
 
                    <Link href="/necklaces?style=personalized" className="menu-promo-card-horizontal" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=300&auto=format&fit=crop)' }}>
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
                    <li><Link href="/bracelets?style=tennis" className="menu-item-link">Tennis</Link></li>
                    <li><Link href="/bracelets?style=lab" className="menu-item-link">Lab diamonds</Link></li>
                    <li><Link href="/bracelets?style=chain" className="menu-item-link">Chains</Link></li>
                    <li><Link href="/bracelets?style=pearl" className="menu-item-link">Pearls</Link></li>
                    <li><Link href="/bracelets?style=bangles" className="menu-item-link">Bangles</Link></li>
                  </ul>
                  <Link href="/bracelets" className="menu-action-link">Shop all bracelet styles &gt;</Link>
                </div>
 
                <div>
                  <h4 className="menu-column-title">Shop by metal color</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/bracelets?style=white-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E5E9EC' }} /> White Gold</Link></li>
                    <li><Link href="/bracelets?style=yellow-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E9B646' }} /> Yellow Gold</Link></li>
                    <li><Link href="/bracelets?style=silver" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#D2D7DF' }} /> Silver</Link></li>
                  </ul>
                </div>
 
                <div>
                  <h4 className="menu-column-title">Diamond Essentials</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/bracelets?style=tennis" className="menu-item-link"><BraceletIcon /> Tennis bracelets</Link></li>
                    <li><Link href="/bracelets?style=gemstone" className="menu-item-link"><BraceletIcon /> Gemstone bracelets</Link></li>
                  </ul>
                </div>
 
                <div>
                  <Link href="/bracelets?style=tennis" className="menu-promo-card-vertical" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=300&auto=format&fit=crop)' }}>
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
                    <li><Link href="/gifts?style=studs" className="menu-item-link">Diamond studs</Link></li>
                    <li><Link href="/gifts?style=pendant" className="menu-item-link">Solitaire necklaces</Link></li>
                    <li><Link href="/gifts?style=tennis" className="menu-item-link">Tennis bracelets</Link></li>
                    <li><Link href="/gifts?style=best-sellers" className="menu-item-link">Most loved gifts</Link></li>
                  </ul>
                  <Link href="/gifts" className="menu-action-link">Shop all gifts &gt;</Link>
 
                  <div className="menu-sub-section">
                    <h4 className="menu-column-title">Gifts by budget</h4>
                    <ul className="menu-column-list">
                      <li><Link href="/gifts?style=under-250" className="menu-item-link">Under $250</Link></li>
                      <li><Link href="/gifts?style=under-500" className="menu-item-link">Under $500</Link></li>
                      <li><Link href="/gifts?style=under-1000" className="menu-item-link">Under $1,000</Link></li>
                    </ul>
                  </div>
                </div>
 
                <div>
                  <h4 className="menu-column-title">Gifts by occasion</h4>
                  <ul className="menu-column-list" style={{ marginBottom: '16px' }}>
                    <li><Link href="/gifts?style=graduation" className="menu-item-link">Graduation gifts</Link></li>
                    <li><Link href="/gifts?style=anniversary-gifts" className="menu-item-link">Anniversary gifts</Link></li>
                    <li><Link href="/gifts?style=birthday" className="menu-item-link">Birthday gifts</Link></li>
                    <li><Link href="/gifts?style=graduation" className="menu-item-link">Push presents</Link></li>
                  </ul>
 
                  <div className="menu-sub-section">
                    <h4 className="menu-column-title">Gifts by recipient</h4>
                    <ul className="menu-column-list">
                      <li><Link href="/gifts?style=him" className="menu-item-link">Gifts for him</Link></li>
                      <li><Link href="/gifts?style=her" className="menu-item-link">Gifts for her</Link></li>
                    </ul>
                  </div>
                </div>
 
                <div>
                  <h4 className="menu-column-title">Gifts by collection</h4>
                  <ul className="menu-column-list">
                    <li><Link href="/gifts?style=personalized" className="menu-item-link">Personalized jewelry</Link></li>
                    <li><Link href="/gifts?style=pearl" className="menu-item-link">Pearl jewelry</Link></li>
                    <li><Link href="/gifts?style=quick-ship" className="menu-item-link">Quick ship gifts</Link></li>
                    <li><Link href="/gifts?style=trending" className="menu-item-link">Trending gifts</Link></li>
                    <li><Link href="/gifts?style=promise" className="menu-item-link">Promise rings</Link></li>
                    <li><Link href="/gifts?style=christian" className="menu-item-link">Christian Siriano collection</Link></li>
                  </ul>
                  <Link href="/gifts" className="menu-action-link" style={{ marginTop: '12px' }}>Shop all collections &gt;</Link>
                </div>
 
                <div>
                  <Link href="/gifts?style=best-sellers" className="menu-promo-card-vertical" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=300&auto=format&fit=crop)' }}>
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
        </div>

        {/* Right: Cart & Actions */}
        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {searchOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '4px 12px', borderRadius: '20px', border: '1.5px solid var(--color-teal)' }}>
              <Search size={15} style={{ color: 'var(--color-teal)' }} />
              <input
                type="text"
                placeholder="Search jewelry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    router.push(`/diamonds?search=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchOpen(false);
                    setSearchQuery('');
                  }
                }}
                style={{ background: 'none', border: 'none', outline: 'none', fontSize: '12.5px', color: '#1e293b', width: '130px', fontWeight: '500' }}
                autoFocus
              />
              <button 
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }} 
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button 
              className="navbar-action-btn desktop-only" 
              title="Search" 
              onClick={() => setSearchOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <Search size={21} />
            </button>
          )}

          <Link 
            href="/wishlist" 
            className="navbar-action-btn desktop-only" 
            title="Favorites" 
            style={{ color: pathname === '/wishlist' ? 'var(--color-teal)' : '', padding: '4px', display: 'flex', alignItems: 'center' }}
          >
            <Heart size={21} />
          </Link>
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
            <Link href="/engagement-rings" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              Engagement Rings
            </Link>
            <Link href="/wedding-bands" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              Wedding Bands
            </Link>
            <Link href="/diamonds" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              Diamonds
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
