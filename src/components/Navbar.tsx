'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, Heart, User, ShieldCheck, LogOut, Sparkles, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { supabase } from '../lib/supabase';
import type { DbProfile } from '../lib/supabase';
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

// Custom Shape SVG Icons for Diamond Menu
const ShapeIcons: Record<string, React.FC> = {
  Round: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}><circle cx="12" cy="12" r="8.5"/></svg>
  ),
  Oval: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}><ellipse cx="12" cy="12" rx="6" ry="9"/></svg>
  ),
  Marquise: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}><path d="M12 2C6.5 7.5 6.5 16.5 12 22C17.5 16.5 17.5 7.5 12 2Z"/></svg>
  ),
  Emerald: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}><rect x="5.5" y="3.5" width="13" height="17" rx="1.5"/></svg>
  ),
  Princess: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}><rect x="4.5" y="4.5" width="15" height="15" rx="1"/></svg>
  ),
  Cushion: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}><rect x="4.5" y="4.5" width="15" height="15" rx="5"/></svg>
  ),
  Radiant: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}><polygon points="7,3.5 17,3.5 20.5,7 20.5,17 17,20.5 7,20.5 3.5,17 3.5,7"/></svg>
  ),
  Pear: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}><path d="M12 2.5C12 2.5 5.5 10 5.5 15.5A6.5 6.5 0 0 0 18.5 15.5C18.5 10 12 2.5 12 2.5Z"/></svg>
  ),
  Heart: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}><path d="M12 20.5l-1.35-1.22C5.85 14.9 2.5 11.83 2.5 8.1 2.5 5.08 4.88 2.7 7.9 2.7c1.7 0 3.33.79 4.1 2.04C12.77 3.49 14.4 2.7 16.1 2.7 19.12 2.7 21.5 5.08 21.5 8.1c0 3.73-3.35 6.8-8.15 11.18L12 20.5z"/></svg>
  ),
  Asscher: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}><polygon points="7,3.5 17,3.5 20.5,7 20.5,17 17,20.5 7,20.5 3.5,17 3.5,7"/><rect x="7.5" y="7.5" width="9" height="9" strokeWidth="1"/></svg>
  )
};

export const Navbar: React.FC = () => {
  const { getSetting } = useSiteSettings();
  const topPromo = getSetting('top_announcement_bar', '');
  const storePhone = getSetting('store_phone', '+1 213-642-7217');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [expandedDrawerSection, setExpandedDrawerSection] = useState<string | null>(null);

  const toggleDrawerSection = (section: string) => {
    setExpandedDrawerSection(prev => (prev === section ? null : section));
  };
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
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  
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
        .maybeSingle();
      setIsAdmin(!!data);
    } catch {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        checkAdminStatus(currentUser.id);
      } else {
        setIsAdmin(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
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

  const [userProfile, setUserProfile] = useState<Partial<DbProfile> | null>(null);

  useEffect(() => {
    if (!user) {
      setProfileIncomplete(false);
      setUserProfile(null);
      return;
    }
    const checkProfile = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, phone, address_line1, ring_size')
          .eq('id', user.id)
          .maybeSingle();
        setUserProfile(data);
        const isIncomplete = !data?.phone || !data?.address_line1 || !data?.ring_size || !data?.full_name;
        setProfileIncomplete(isIncomplete);
      } catch {
        setProfileIncomplete(false);
      }
    };
    checkProfile();
  }, [user]);

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

  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Keep top bar visible if mobile drawer menu or search is open
        if (mobileMenuOpen || searchOpen) {
          setNavVisible(true);
          lastScrollY.current = currentScrollY;
          ticking.current = false;
          return;
        }

        // At the very top: always show
        if (currentScrollY <= 15) {
          setNavVisible(true);
        } 
        // Scrolling DOWN significantly
        else if (currentScrollY > lastScrollY.current + 10 && currentScrollY > 70) {
          setNavVisible(false);
        } 
        // Scrolling UP significantly
        else if (currentScrollY < lastScrollY.current - 10) {
          setNavVisible(true);
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen, searchOpen]);

  const hasPromo = Boolean(topPromo && topPromo.trim().length > 0);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className={`navbar ${navVisible ? 'navbar-top-open' : 'navbar-top-closed'}`}>
      {/* Top Announcement Bar */}
      <div className="navbar-top-bar">
        <div className="container navbar-top-bar-container">
          <span className="navbar-top-phone">{storePhone}</span>
          {hasPromo && <span className="navbar-top-promo">{topPromo}</span>}
          <div className="navbar-top-links">
            <Link 
              href="/locations" 
              className="navbar-top-btn navbar-top-btn-pill"
              style={{ color: 'inherit', textDecoration: 'none', fontWeight: '600' }}
            >
              <span className="top-btn-icon">🏪</span>
              <span className="top-btn-label">Our Boutiques</span>
            </Link>
            <span className="navbar-top-sep">|</span>
            <div className="navbar-top-link-wrapper" style={{ position: 'relative' }} ref={contactDropdownRef}>
              <button 
                className="navbar-top-btn navbar-top-btn-pill" 
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
                <span className="top-btn-icon">💬</span>
                <span className="top-btn-label">Contact us</span>
              </button>
              
              {contactOpen && (
                <>
                  <div className="contact-dropdown-backdrop" onClick={() => setContactOpen(false)} />
                  <div className="contact-top-dropdown animate-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <p className="contact-dropdown-title" style={{ margin: 0 }}>Customer Support</p>
                      <button 
                        onClick={() => setContactOpen(false)} 
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', display: 'flex' }}
                        aria-label="Close"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="contact-dropdown-subtitle">Connect with a certified gemologist.</p>
                    
                    <button 
                      className="contact-dropdown-chat-btn" 
                      onClick={() => { 
                        alert('Connecting with customer support...'); 
                        setContactOpen(false); 
                      }}
                    >
                      Chat Now
                    </button>
                    
                    <div className="contact-dropdown-sep">or</div>
                    
                    <div className="contact-dropdown-info">
                      <div className="contact-info-card">
                        <div className="contact-info-header">
                          <span className="contact-info-icon">📞</span>
                          <span className="contact-info-label">Call Us</span>
                        </div>
                        <a href="tel:+12136427217" className="contact-info-value">+1 213-642-7217</a>
                      </div>

                      <div className="contact-info-card">
                        <div className="contact-info-header">
                          <span className="contact-info-icon">✉️</span>
                          <span className="contact-info-label">Email Us</span>
                        </div>
                        <a href="mailto:luxuryjeweleris@gmail.com" className="contact-info-value">luxuryjeweleris@gmail.com</a>
                      </div>
                    </div>
                    
                    <div className="contact-dropdown-footer">
                      <span>Looking for order info?</span>
                      <Link href="/login" className="contact-track-link" onClick={() => setContactOpen(false)}>Track your order</Link>
                    </div>
                  </div>
                </>
              )}
            </div>
            <span className="navbar-top-sep">|</span>
            {user ? (
              <div className="navbar-top-link-wrapper" style={{ position: 'relative' }} ref={userDropdownRef}>
                <button 
                  className="navbar-top-btn account-avatar-pill" 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.3)', 
                    color: '#ffffff', 
                    font: 'inherit', 
                    cursor: 'pointer', 
                    padding: '3px 10px 3px 4px',
                    borderRadius: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    transition: 'all 150ms ease'
                  }}
                >
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0E8C8A, #065F5E)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {(userProfile?.full_name?.[0] || user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                    {profileIncomplete && (
                      <span style={{
                        position: 'absolute',
                        top: -1,
                        right: -1,
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: '#ef4444',
                        border: '1.5px solid #ffffff',
                        boxShadow: '0 0 6px rgba(239, 68, 68, 0.8)'
                      }} />
                    )}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '12px', letterSpacing: '0.2px' }}>
                    {userProfile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </button>
                
                {userMenuOpen && (
                  <div className="contact-top-dropdown animate-fade-in" style={{ right: 0, left: 'auto', width: '280px', padding: '16px' }}>
                    {/* Account Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0E8C8A, #054e4d)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(14, 140, 138, 0.3)',
                        flexShrink: 0
                      }}>
                        {(userProfile?.full_name?.[0] || user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                      </div>
                      <div style={{ overflow: 'hidden', flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {userProfile?.full_name || user.user_metadata?.full_name || 'Valued Client'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user.email}
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '3px', fontSize: '10px', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '1px 6px', borderRadius: '10px' }}>
                          <Sparkles size={10} /> Luxury Member
                        </div>
                      </div>
                    </div>

                    {/* Profile Completion Nudge Banner */}
                    {profileIncomplete ? (
                      <div style={{
                        marginTop: '12px',
                        padding: '12px',
                        background: 'linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%)',
                        borderRadius: '10px',
                        border: '1.5px solid #fca5a5'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 700, color: '#dc2626' }}>
                          <AlertCircle size={14} color="#dc2626" />
                          <span>Action Required: Incomplete Profile</span>
                        </div>
                        <p style={{ fontSize: '11.5px', color: '#475569', margin: '6px 0 10px 0', lineHeight: 1.4 }}>
                          Set your <strong>Ring Size</strong>, <strong>Phone</strong> &amp; <strong>Address</strong> for 1-click checkout and custom ring size suggestions.
                        </p>

                        {/* Progress Bar */}
                        <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
                          <div style={{ width: '35%', height: '100%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)', borderRadius: '3px' }} />
                        </div>

                        <Link 
                          href="/account" 
                          onClick={() => setUserMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            color: '#ffffff',
                            background: 'linear-gradient(135deg, #0E8C8A, #096866)',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            boxShadow: '0 2px 8px rgba(14, 140, 138, 0.3)'
                          }}
                        >
                          Complete Profile Info <ChevronRight size={13} />
                        </Link>
                      </div>
                    ) : (
                      <div style={{
                        marginTop: '10px',
                        padding: '8px 10px',
                        background: '#f0fdf4',
                        borderRadius: '8px',
                        border: '1px solid #bbf7d0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        color: '#15803d',
                        fontWeight: 600
                      }}>
                        <CheckCircle2 size={13} color="#16a34a" />
                        <span>Profile 100% Complete &amp; Verified</span>
                      </div>
                    )}

                    {/* Actions List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginTop: '12px' }}>
                      <Link 
                        href="/account" 
                        style={{
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '9px 12px',
                          borderRadius: '6px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          color: '#0f172a',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0'
                        }}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={15} color="#0E8C8A" />
                        <span>My Profile &amp; Preferences</span>
                      </Link>

                      {isAdmin && (
                        <Link 
                          href="/admin/dashboard" 
                          style={{
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '9px 12px',
                            borderRadius: '6px',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            color: '#ffffff',
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)'
                          }}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <ShieldCheck size={15} />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      
                      <button 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          color: '#64748b',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          cursor: 'pointer',
                          width: '100%',
                          marginTop: '2px'
                        }}
                        onClick={async () => {
                          await supabase.auth.signOut();
                          setUserMenuOpen(false);
                          router.refresh();
                        }}
                      >
                        <LogOut size={14} color="#94a3b8" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/signup" style={{ marginRight: '16px' }}>Sign up</Link>
                <Link href="/login">Sign in</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container navbar-container">
        {/* Mobile Left: Hamburger (only shown on mobile) */}
        <div className="mobile-left-area">
          <button
            className="navbar-action-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', borderRadius: '8px' }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Logo — centered on mobile, left on desktop */}
        <Link href="/" className="navbar-logo-container" style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '36px', gap: '9px' }}>
            <img src="/logo.png" alt="Luxury Jeweleris" style={{ height: '100%', width: 'auto', objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ 
                fontFamily: "var(--font-display-outfit, 'Outfit', sans-serif)", 
                fontSize: '16.5px', 
                fontWeight: 700, 
                letterSpacing: '0.5px',
                lineHeight: 1.1
              }}>
                <span style={{ color: '#10151a' }}>LUXURY </span>
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
                fontSize: '7.5px', 
                fontWeight: 600, 
                letterSpacing: '1.4px', 
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

        {/* Center: Desktop Navigation Links (with custom rich mega menus) */}
        <div className="desktop-only-links" style={{ alignItems: 'center', height: '100%' }}>
          
          {/* Engagement Rings tab */}
          <div className="navbar-link-item-wrapper" style={{ height: '100%' }}>
            <Link href="/engagement-rings" className={`navbar-link-item ${pathname === '/engagement-rings' ? 'active' : ''}`}>
              Engagement rings
            </Link>
            
            {/* Mega Menu: Engagement Rings */}
            <div className="mega-menu slide-down-enter">
              <div className="mega-menu-content-grid mega-menu-content-grid-5">
                <div>
                  <p className="menu-column-title">Design your engagement ring</p>
                  <ul className="menu-column-list">
                    <li><Link href="/engagement-rings?style=setting" className="menu-item-link"><RingIcon /> Start with a setting</Link></li>
                    <li><Link href="/engagement-rings?style=lab" className="menu-item-link"><DiamondIcon /> Start with a lab diamond</Link></li>
                    <li><Link href="/engagement-rings?style=natural" className="menu-item-link"><DiamondIcon /> Start with a natural diamond</Link></li>
                    <li><Link href="/engagement-rings?style=ready" className="menu-item-link"><RingIcon /> Shop ready-to-ship rings</Link></li>
                  </ul>
                  <Link href="/engagement-rings" className="menu-action-link">Shop all engagement rings &gt;</Link>
                </div>
                
                <div>
                  <p className="menu-column-title">Shop by style</p>
                  <ul className="menu-column-list">
                    <li><Link href="/engagement-rings?style=Solitaire" className="menu-item-link"><RingIcon /> Solitaire</Link></li>
                    <li><Link href="/engagement-rings?style=Halo" className="menu-item-link"><RingIcon /> Halo</Link></li>
                    <li><Link href="/engagement-rings?style=Pavé" className="menu-item-link"><RingIcon /> Pavé and Side-Stone</Link></li>
                    <li><Link href="/engagement-rings?style=Three-Stone" className="menu-item-link"><RingIcon /> Three Stone</Link></li>
                    <li><Link href="/engagement-rings?style=Hidden-Halo" className="menu-item-link"><RingIcon /> Hidden Halo</Link></li>
                  </ul>
                  <Link href="/engagement-rings" className="menu-action-link">Shop all styles &gt;</Link>
                  
                  <div className="menu-sub-section">
                    <p className="menu-column-title">New Arrivals</p>
                    <ul className="menu-column-list">
                      <li><Link href="/engagement-rings?style=new" className="menu-item-link"><RingIcon /> Shop all new arrivals</Link></li>
                    </ul>
                  </div>
                </div>

                <div>
                  <p className="menu-column-title">Shop by metal</p>
                  <ul className="menu-column-list">
                    <li><Link href="/engagement-rings?style=yellow-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E9B646' }} /> Yellow Gold</Link></li>
                    <li><Link href="/engagement-rings?style=white-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E5E9EC' }} /> White Gold</Link></li>
                    <li><Link href="/engagement-rings?style=rose-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E0A391' }} /> Rose Gold</Link></li>
                    <li><Link href="/engagement-rings?style=platinum" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#C0C0C0' }} /> Platinum</Link></li>
                  </ul>
                  
                  <div className="menu-sub-section">
                    <p className="menu-column-title">Gemstone Rings</p>
                    <ul className="menu-column-list">
                      <li><Link href="/engagement-rings?style=gemstone" className="menu-item-link"><RingIcon /> Moissanite rings</Link></li>
                    </ul>
                  </div>
                  
                  <div className="menu-sub-section">
                    <p className="menu-column-title">Custom Ring Design</p>
                    <ul className="menu-column-list">
                      <li><Link href="/engagement-rings?style=custom" className="menu-item-link"><RingIcon /> Custom engagement rings</Link></li>
                    </ul>
                  </div>
                </div>

                <div>
                  <p className="menu-column-title">Featured</p>
                  <ul className="menu-column-list" style={{ gap: '12px' }}>
                    <li><Link href="/engagement-rings?style=ready" className="menu-item-link" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>Ready to ship engagement rings</Link></li>
                    <li><Link href="/engagement-rings" className="menu-item-link" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>Engagement rings</Link></li>
                    <li><Link href="/engagement-rings?style=signature" className="menu-item-link" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>Signature collection</Link></li>
                    <li><Link href="/wedding-bands" className="menu-item-link" style={{ fontSize: '13px', color: 'var(--color-ink)' }}>Wedding rings</Link></li>
                  </ul>
                </div>

                <div>
                  <p className="menu-column-title">Education</p>
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
                  <p className="menu-column-title">Women</p>
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
                  <p className="menu-column-title">Men</p>
                  <ul className="menu-column-list">
                    <li><Link href="/wedding-bands?style=mens-classic" className="menu-item-link">Classic bands</Link></li>
                    <li><Link href="/wedding-bands?style=mens-matte" className="menu-item-link">Matte bands</Link></li>
                    <li><Link href="/wedding-bands?style=mens-hammered" className="menu-item-link">Hammered bands</Link></li>
                    <li><Link href="/wedding-bands?style=mens-engraved" className="menu-item-link">Engraved Bands</Link></li>
                  </ul>
                  <Link href="/wedding-bands?style=mens" className="menu-action-link">All men's wedding bands &gt;</Link>
                </div>
 
                <div>
                  <p className="menu-column-title">Women's by metal</p>
                  <ul className="menu-column-list">
                    <li><Link href="/wedding-bands?style=rose-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#D99F8D' }} /> Rose Gold</Link></li>
                    <li><Link href="/wedding-bands?style=yellow-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E2C379' }} /> Yellow Gold</Link></li>
                    <li><Link href="/wedding-bands?style=white-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E2E7EB' }} /> White Gold</Link></li>
                    <li><Link href="/wedding-bands?style=platinum" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#C8CDD0' }} /> Platinum</Link></li>
                  </ul>
                </div>
 
                <div>
                  <p className="menu-column-title">Men's by metal</p>
                  <ul className="menu-column-list">
                    <li><Link href="/wedding-bands?style=mens-platinum" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#C8CDD0' }} /> Platinum</Link></li>
                    <li><Link href="/wedding-bands?style=mens-yellow-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E2C379' }} /> Yellow Gold</Link></li>
                    <li><Link href="/wedding-bands?style=tantalum" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#8792A0' }} /> Tantalum</Link></li>
                  </ul>
                  <Link href="/wedding-bands" className="menu-action-link">Shop all metals &gt;</Link>
                </div>
 
                <div>
                  <p className="menu-column-title">Education</p>
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
                  <p className="menu-column-title">Shop by shape</p>
                  <ul className="menu-column-list" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                    <li>
                      <Link href="/diamonds?shape=Round" className="menu-item-link">
                        <ShapeIcons.Round />
                        Round
                      </Link>
                    </li>
                    <li>
                      <Link href="/diamonds?shape=Oval" className="menu-item-link">
                        <ShapeIcons.Oval />
                        Oval
                      </Link>
                    </li>
                    <li>
                      <Link href="/diamonds?shape=Marquise" className="menu-item-link">
                        <ShapeIcons.Marquise />
                        Marquise
                      </Link>
                    </li>
                    <li>
                      <Link href="/diamonds?shape=Emerald" className="menu-item-link">
                        <ShapeIcons.Emerald />
                        Emerald
                      </Link>
                    </li>
                    <li>
                      <Link href="/diamonds?shape=Princess" className="menu-item-link">
                        <ShapeIcons.Princess />
                        Princess
                      </Link>
                    </li>
                    <li>
                      <Link href="/diamonds?shape=Cushion" className="menu-item-link">
                        <ShapeIcons.Cushion />
                        Cushion
                      </Link>
                    </li>
                    <li>
                      <Link href="/diamonds?shape=Radiant" className="menu-item-link">
                        <ShapeIcons.Radiant />
                        Radiant
                      </Link>
                    </li>
                    <li>
                      <Link href="/diamonds?shape=Pear" className="menu-item-link">
                        <ShapeIcons.Pear />
                        Pear
                      </Link>
                    </li>
                    <li>
                      <Link href="/diamonds?shape=Heart" className="menu-item-link">
                        <ShapeIcons.Heart />
                        Heart
                      </Link>
                    </li>
                    <li>
                      <Link href="/diamonds?shape=Asscher" className="menu-item-link">
                        <ShapeIcons.Asscher />
                        Asscher
                      </Link>
                    </li>
                  </ul>
                  <Link href="/diamonds" className="menu-action-link" style={{ marginTop: '16px' }}>Shop all diamonds &gt;</Link>
                </div>

                <div>
                  <p className="menu-column-title">Create your own</p>
                  <ul className="menu-column-list" style={{ marginBottom: '16px' }}>
                    <li><Link href="/engagement-rings" className="menu-item-link"><RingIcon /> Diamond engagement ring</Link></li>
                    <li><Link href="/earrings" className="menu-item-link"><EarringsIcon /> Diamond earrings</Link></li>
                    <li><Link href="/necklaces?style=pendant" className="menu-item-link"><PendantIcon /> Diamond pendant</Link></li>
                  </ul>
 
                  <div className="menu-sub-section">
                    <p className="menu-column-title">Loose Diamonds</p>
                    <ul className="menu-column-list">
                      <li><Link href="/diamonds?style=natural" className="menu-item-link"><DiamondIcon /> Shop natural diamonds</Link></li>
                      <li><Link href="/diamonds?style=lab" className="menu-item-link"><DiamondIcon /> Shop lab diamonds</Link></li>
                    </ul>
                  </div>
                </div>
 
                <div>
                  <p className="menu-column-title">Diamond Jewelry</p>
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
                  <p className="menu-column-title">Education</p>
                  <ul className="menu-column-list" style={{ gap: '10px' }}>
                    <li><Link href="/diamonds?style=lab" className="menu-item-link" style={{ fontSize: '13px' }}>Diamond cut guide</Link></li>
                    <li><Link href="/diamonds" className="menu-item-link" style={{ fontSize: '13px' }}>Diamond color guide</Link></li>
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
                  <p className="menu-column-title">Shop by style</p>
                  <ul className="menu-column-list">
                    <li><Link href="/earrings?style=studs" className="menu-item-link">Studs</Link></li>
                    <li><Link href="/earrings?style=lab" className="menu-item-link">Lab diamonds</Link></li>
                    <li><Link href="/earrings?style=hoops" className="menu-item-link">Hoops</Link></li>
                    <li><Link href="/earrings?style=plain" className="menu-item-link">Plain metal</Link></li>
                  </ul>
                  <Link href="/earrings" className="menu-action-link">Shop all earrings &gt;</Link>
                </div>
 
                <div>
                  <p className="menu-column-title">Shop by metal</p>
                  <ul className="menu-column-list" style={{ marginBottom: '16px' }}>
                    <li><Link href="/earrings?style=white-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E5E9EC' }} /> White Gold</Link></li>
                    <li><Link href="/earrings?style=yellow-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E2C379' }} /> Yellow Gold</Link></li>
                    <li><Link href="/earrings?style=silver" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#D2D7DF' }} /> Silver</Link></li>
                    <li><Link href="/earrings?style=vermeil" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E3C572' }} /> Vermeil</Link></li>
                  </ul>
 
                  <div className="menu-sub-section">
                    <p className="menu-column-title">Featured</p>
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
                  <p className="menu-column-title">Shop by style</p>
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
                  <p className="menu-column-title">Shop by metal color</p>
                  <ul className="menu-column-list">
                    <li><Link href="/necklaces?style=white-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E5E9EC' }} /> White Gold</Link></li>
                    <li><Link href="/necklaces?style=yellow-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E9B646' }} /> Yellow Gold</Link></li>
                    <li><Link href="/necklaces?style=silver" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#D2D7DF' }} /> Silver</Link></li>
                    <li><Link href="/necklaces?style=vermeil" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E3C572' }} /> Vermeil</Link></li>
                  </ul>
 
                  <div className="menu-sub-section">
                    <p className="menu-column-title">Featured</p>
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
              <div className="mega-menu-content-grid mega-menu-content-grid-4">                <div>
                  <p className="menu-column-title">Shop by style</p>
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
                  <p className="menu-column-title">Shop by metal color</p>
                  <ul className="menu-column-list">
                    <li><Link href="/bracelets?style=white-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E5E9EC' }} /> White Gold</Link></li>
                    <li><Link href="/bracelets?style=yellow-gold" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#E9B646' }} /> Yellow Gold</Link></li>
                    <li><Link href="/bracelets?style=silver" className="menu-item-link"><span className="metal-dot" style={{ backgroundColor: '#D2D7DF' }} /> Silver</Link></li>
                  </ul>
                </div>
 
                <div>
                  <p className="menu-column-title">Diamond Essentials</p>
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
                  <p className="menu-column-title">Top Gifts</p>
                  <ul className="menu-column-list" style={{ marginBottom: '16px' }}>
                    <li><Link href="/gifts?style=studs" className="menu-item-link">Diamond studs</Link></li>
                    <li><Link href="/gifts?style=pendant" className="menu-item-link">Solitaire necklaces</Link></li>
                    <li><Link href="/gifts?style=tennis" className="menu-item-link">Tennis bracelets</Link></li>
                    <li><Link href="/gifts?style=best-sellers" className="menu-item-link">Most loved gifts</Link></li>
                  </ul>
                  <Link href="/gifts" className="menu-action-link">Shop all gifts &gt;</Link>
 
                  <div className="menu-sub-section">
                    <p className="menu-column-title">Gifts by budget</p>
                    <ul className="menu-column-list">
                      <li><Link href="/gifts?style=under-250" className="menu-item-link">Under $250</Link></li>
                      <li><Link href="/gifts?style=under-500" className="menu-item-link">Under $500</Link></li>
                      <li><Link href="/gifts?style=under-1000" className="menu-item-link">Under $1,000</Link></li>
                    </ul>
                  </div>
                </div>
 
                <div>
                  <p className="menu-column-title">Gifts by occasion</p>
                  <ul className="menu-column-list" style={{ marginBottom: '16px' }}>
                    <li><Link href="/gifts?style=graduation" className="menu-item-link">Graduation gifts</Link></li>
                    <li><Link href="/gifts?style=anniversary-gifts" className="menu-item-link">Anniversary gifts</Link></li>
                    <li><Link href="/gifts?style=birthday" className="menu-item-link">Birthday gifts</Link></li>
                    <li><Link href="/gifts?style=graduation" className="menu-item-link">Push presents</Link></li>
                  </ul>
 
                  <div className="menu-sub-section">
                    <p className="menu-column-title">Gifts by recipient</p>
                    <ul className="menu-column-list">
                      <li><Link href="/gifts?style=him" className="menu-item-link">Gifts for him</Link></li>
                      <li><Link href="/gifts?style=her" className="menu-item-link">Gifts for her</Link></li>
                    </ul>
                  </div>
                </div>
 
                <div>
                  <p className="menu-column-title">Gifts by collection</p>
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
              className="navbar-action-btn" 
              title="Search" 
              onClick={() => setSearchOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <Search size={21} />
            </button>
          )}

          <Link 
            href="/wishlist" 
            className="navbar-action-btn" 
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
          
          {/* Desktop-only Menu Toggle (hidden on mobile via CSS — mobile uses mobile-left-area) */}
          <button 
            className="navbar-action-btn mobile-menu-toggle-desktop-hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Rare Carat Mobile Full Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="rc-mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="rc-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Top Bar */}
            <div className="rc-drawer-header">
              <div className="rc-drawer-logo">
                <span className="rc-drawer-brand">LUXURY JEWELERIS</span>
                <span className="rc-drawer-tagline">America's #1 Rated Jeweler</span>
              </div>
              <button 
                className="rc-drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Drawer Search Input */}
            <div className="rc-drawer-search-container">
              <div className="rc-drawer-search-box">
                <Search size={18} className="rc-drawer-search-icon" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      router.push(`/diamonds?search=${encodeURIComponent(searchQuery.trim())}`);
                      setMobileMenuOpen(false);
                    }
                  }}
                  className="rc-drawer-search-input"
                />
                {searchQuery && (
                  <button className="rc-drawer-search-clear" onClick={() => setSearchQuery('')}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Accordion Categories List */}
            <div className="rc-drawer-accordion-list">
              {/* ACCORDION 1: RINGS */}
              <div className="rc-accordion-item">
                <button 
                  className={`rc-accordion-header ${expandedDrawerSection === 'rings' ? 'expanded' : ''}`}
                  onClick={() => toggleDrawerSection('rings')}
                >
                  <span className="rc-accordion-title">Rings</span>
                  <span className="rc-accordion-icon">
                    {expandedDrawerSection === 'rings' ? '▲' : '▼'}
                  </span>
                </button>

                {expandedDrawerSection === 'rings' && (
                  <div className="rc-accordion-body animate-fade-in">
                    <div className="rc-drawer-subgroup">
                      <div className="rc-drawer-subgroup-title">CREATE YOUR OWN DIAMOND RING</div>
                      <Link href="/engagement-rings?style=setting" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left"><RingIcon /> Start with a ring</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                      <Link href="/engagement-rings?style=lab" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left"><DiamondIcon /> Start with a lab diamond</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                      <Link href="/engagement-rings?style=natural" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left"><DiamondIcon /> Start with a natural diamond</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                      <Link href="/engagement-rings?style=ready" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left"><RingIcon /> Shop ready-to-ship rings</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                    </div>

                    <div className="rc-drawer-subgroup">
                      <div className="rc-drawer-subgroup-title">SHOP BY STYLE</div>
                      <Link href="/engagement-rings?style=Solitaire" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left"><RingIcon /> Solitaire</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                      <Link href="/engagement-rings?style=Halo" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left"><RingIcon /> Halo</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                      <Link href="/engagement-rings?style=Pavé" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left"><RingIcon /> Pavé and Side-Stone</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                      <Link href="/engagement-rings?style=Three-Stone" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left"><RingIcon /> Three Stone</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                      <Link href="/engagement-rings?style=Hidden-Halo" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left"><RingIcon /> Hidden Halo</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                    </div>

                    <div className="rc-drawer-subgroup">
                      <div className="rc-drawer-subgroup-title">WEDDING</div>
                      <Link href="/wedding-bands" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left"><RingIcon /> Women's wedding rings</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                      <Link href="/wedding-bands?style=mens" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left"><RingIcon /> Men's wedding bands</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                      <Link href="/wedding-bands?style=eternity" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left"><RingIcon /> Eternity rings</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                    </div>

                    <div className="rc-drawer-subgroup">
                      <div className="rc-drawer-subgroup-title">GEMSTONE RINGS</div>
                      <Link href="/engagement-rings?style=gemstone" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left"><RingIcon /> Moissanite rings</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                    </div>

                    <div className="rc-drawer-subgroup">
                      <div className="rc-drawer-subgroup-title">CUSTOM RING DESIGN</div>
                      <Link href="/engagement-rings?style=custom" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left"><RingIcon /> Custom engagement rings</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION 2: DIAMONDS */}
              <div className="rc-accordion-item">
                <button 
                  className={`rc-accordion-header ${expandedDrawerSection === 'diamonds' ? 'expanded' : ''}`}
                  onClick={() => toggleDrawerSection('diamonds')}
                >
                  <span className="rc-accordion-title">Diamonds</span>
                  <span className="rc-accordion-icon">
                    {expandedDrawerSection === 'diamonds' ? '▲' : '▼'}
                  </span>
                </button>

                {expandedDrawerSection === 'diamonds' && (
                  <div className="rc-accordion-body animate-fade-in">
                    <div className="rc-drawer-subgroup">
                      <div className="rc-drawer-subgroup-title">LOOSE DIAMONDS</div>
                      <Link href="/diamonds?style=natural" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left"><DiamondIcon /> Start with a natural diamond</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                      <Link href="/diamonds?style=lab" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left"><DiamondIcon /> Start with a lab diamond</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                    </div>

                    <div className="rc-drawer-subgroup">
                      <div className="rc-drawer-subgroup-title">SHOP BY SHAPE</div>
                      {Object.keys(ShapeIcons).map(shape => {
                        const Icon = ShapeIcons[shape];
                        return (
                          <Link key={shape} href={`/diamonds?shape=${shape}`} className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                            <div className="rc-drawer-link-left">
                              <Icon />
                              <span>{shape}</span>
                            </div>
                            <ChevronRight size={16} className="rc-drawer-arrow" />
                          </Link>
                        );
                      })}
                    </div>

                    <div className="rc-drawer-subgroup">
                      <div className="rc-drawer-subgroup-title">EDUCATION</div>
                      <Link href="/diamonds?style=lab" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left">Lab grown vs Natural diamonds</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                      <Link href="/diamonds" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left">Diamond 4Cs buying guide</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION 3: JEWELRY */}
              <div className="rc-accordion-item">
                <button 
                  className={`rc-accordion-header ${expandedDrawerSection === 'jewelry' ? 'expanded' : ''}`}
                  onClick={() => toggleDrawerSection('jewelry')}
                >
                  <span className="rc-accordion-title">Jewelry</span>
                  <span className="rc-accordion-icon">
                    {expandedDrawerSection === 'jewelry' ? '▲' : '▼'}
                  </span>
                </button>

                {expandedDrawerSection === 'jewelry' && (
                  <div className="rc-accordion-body animate-fade-in">
                    <Link href="/wedding-bands" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                      <div className="rc-drawer-link-left"><RingIcon /> Women's wedding rings</div>
                      <ChevronRight size={16} className="rc-drawer-arrow" />
                    </Link>
                    <Link href="/wedding-bands?style=eternity" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                      <div className="rc-drawer-link-left"><RingIcon /> Eternity rings</div>
                      <ChevronRight size={16} className="rc-drawer-arrow" />
                    </Link>
                    <Link href="/wedding-bands?style=mens" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                      <div className="rc-drawer-link-left"><RingIcon /> Men's wedding bands</div>
                      <ChevronRight size={16} className="rc-drawer-arrow" />
                    </Link>
                    <Link href="/earrings" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                      <div className="rc-drawer-link-left"><EarringsIcon /> Earrings</div>
                      <ChevronRight size={16} className="rc-drawer-arrow" />
                    </Link>
                    <Link href="/necklaces" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                      <div className="rc-drawer-link-left"><PendantIcon /> Necklaces</div>
                      <ChevronRight size={16} className="rc-drawer-arrow" />
                    </Link>
                    <Link href="/bracelets" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                      <div className="rc-drawer-link-left"><BraceletIcon /> Bracelets</div>
                      <ChevronRight size={16} className="rc-drawer-arrow" />
                    </Link>

                    <div style={{ margin: '14px 0 18px' }}>
                      <Link 
                        href="/shop" 
                        className="rc-drawer-all-btn"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Shop all jewelry <ChevronRight size={15} />
                      </Link>
                    </div>

                    <div className="rc-drawer-subgroup">
                      <div className="rc-drawer-subgroup-title">SHOP BY STYLE</div>
                      <Link href="/earrings?style=studs" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left">Diamond stud earrings</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                      <Link href="/earrings?style=hoops" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left">Hoop earrings</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                      <Link href="/bracelets?style=tennis" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left">Tennis bracelets</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                      <Link href="/necklaces" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left">Diamond necklaces</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                    </div>

                    <div className="rc-drawer-subgroup">
                      <div className="rc-drawer-subgroup-title">CREATE YOUR OWN</div>
                      <Link href="/earrings" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left"><EarringsIcon /> Diamond earrings</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                      <Link href="/necklaces?style=pendant" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left"><PendantIcon /> Diamond pendant</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION 4: GIFTS */}
              <div className="rc-accordion-item">
                <button 
                  className={`rc-accordion-header ${expandedDrawerSection === 'gifts' ? 'expanded' : ''}`}
                  onClick={() => toggleDrawerSection('gifts')}
                >
                  <span className="rc-accordion-title">Gifts</span>
                  <span className="rc-accordion-icon">
                    {expandedDrawerSection === 'gifts' ? '▲' : '▼'}
                  </span>
                </button>

                {expandedDrawerSection === 'gifts' && (
                  <div className="rc-accordion-body animate-fade-in">
                    <div className="rc-drawer-subgroup">
                      <div className="rc-drawer-subgroup-title">TOP GIFTS</div>
                      <Link href="/gifts?style=studs" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left">Diamond studs</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                      <Link href="/gifts?style=pendant" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left">Solitaire necklaces</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                      <Link href="/gifts?style=tennis" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left">Tennis bracelets</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                    </div>

                    <div className="rc-drawer-subgroup">
                      <div className="rc-drawer-subgroup-title">GIFTS BY BUDGET</div>
                      <Link href="/gifts?style=under-250" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left">Under $250</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                      <Link href="/gifts?style=under-500" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left">Under $500</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                      <Link href="/gifts?style=under-1000" className="rc-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                        <div className="rc-drawer-link-left">Under $1,000</div>
                        <ChevronRight size={16} className="rc-drawer-arrow" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* HORIZONTAL SIDE-SCROLLING VISUAL CATEGORY CIRCLES INSIDE DRAWER */}
            <div className="rc-drawer-circles-section">
              <div className="rc-drawer-circles-scroll">
                {[
                  { name: 'Engagement rings', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop', link: '/engagement-rings' },
                  { name: 'Earrings', img: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=200&auto=format&fit=crop', link: '/earrings' },
                  { name: 'Wedding rings', img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=200&auto=format&fit=crop', link: '/wedding-bands' },
                  { name: 'Necklaces', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200&auto=format&fit=crop', link: '/necklaces' },
                  { name: 'Tennis bracelets', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200&auto=format&fit=crop', link: '/bracelets?style=tennis' },
                  { name: 'Eternity bands', img: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=200&auto=format&fit=crop', link: '/wedding-bands?style=eternity' },
                  { name: 'Lab diamonds', img: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=200&auto=format&fit=crop', link: '/diamonds?style=lab' },
                  { name: 'Men\'s bands', img: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=200&auto=format&fit=crop', link: '/wedding-bands?style=mens' },
                ].map((item, idx) => (
                  <Link 
                    key={idx} 
                    href={item.link}
                    className="rc-drawer-circle-item"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="rc-drawer-circle-img-wrap">
                      <img src={item.img} alt={item.name} className="rc-drawer-circle-img" />
                    </div>
                    <span className="rc-drawer-circle-name">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* DRAWER FOOTER QUICK LINKS */}
            <div className="rc-drawer-footer-links">
              <div className="rc-drawer-footer-grid">
                <Link href="/diamonds" onClick={() => setMobileMenuOpen(false)}>Price Check</Link>
                <Link href="/gifts" onClick={() => setMobileMenuOpen(false)}>Promotions</Link>
                <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>Reviews</Link>
                <Link href={user ? "/account" : "/login"} onClick={() => setMobileMenuOpen(false)}>Order Status</Link>
                {user ? (
                  <Link href="/account" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
                )}
                <Link href="/diamonds?style=lab" onClick={() => setMobileMenuOpen(false)}>Education</Link>
                <Link href="/locations" onClick={() => setMobileMenuOpen(false)}>Our Boutiques</Link>
                <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>Trends</Link>
              </div>
            </div>
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
        @media (max-width: 1024px) {
          .desktop-only-links {
            display: none !important;
          }
          .desktop-only {
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
