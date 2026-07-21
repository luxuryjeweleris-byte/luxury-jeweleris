'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle, User, MapPin, Ruler, Save, X, Sparkles } from 'lucide-react';
import Button from '../../components/Button';
import { supabase } from '../../lib/supabase';
import type { DbProfile } from '../../lib/supabase';
import './account.css';

const RING_SIZES = [
  '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5',
  '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13', '13.5'
];

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Partial<DbProfile>>({});
  const [showWelcome, setShowWelcome] = useState(false);

  const isProfileEmpty = !profile.full_name;

  useEffect(() => {
    const isWelcome = window.location.search.includes('welcome=1');
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (fetchError && fetchError.code !== 'PGRST116') {
        setError('Failed to load profile.');
      } else if (data) {
        setProfile(data);
      }
      setLoading(false);
      if (isWelcome && !data?.full_name) {
        setShowWelcome(true);
      }
    });
  }, [router]);

  const setField = (key: keyof DbProfile, value: string) => {
    setProfile(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    setError('');
    setSaved(false);

    const { error: saveError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name: profile.full_name || null,
        phone: profile.phone || null,
        address_line1: profile.address_line1 || null,
        address_line2: profile.address_line2 || null,
        city: profile.city || null,
        state: profile.state || null,
        zip: profile.zip || null,
        country: profile.country || 'US',
        ring_size: profile.ring_size || null,
        updated_at: new Date().toISOString(),
      });

    if (saveError) {
      setError(saveError.message);
    } else {
      setSaved(true);
      setShowWelcome(false);
      router.replace('/account');
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }, [user, profile, router]);

  const dismissWelcome = () => {
    setShowWelcome(false);
    router.replace('/account');
  };

  if (loading) {
    return (
      <div className="account-page">
        <div className="container account-container">
          <div className="account-loading">
            <Loader2 size={32} className="spin-icon" />
            <span>Loading your profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="container account-container">
        <div className="account-header">
          <h1 className="account-title">My Account</h1>
          {saved && (
            <span className="account-saved">
              <CheckCircle size={16} />
              Profile saved
            </span>
          )}
        </div>

        <div className="account-card">
          <div className="account-card-title">
            <User size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
            Personal Information
          </div>

          <form className="account-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            {error && <div className="account-error-box">{error}</div>}

            <div className="account-form-group">
              <label className="account-label" htmlFor="full_name">Full Name</label>
              <input
                id="full_name"
                type="text"
                className="account-input-field"
                placeholder="Your full name"
                value={profile.full_name || ''}
                onChange={(e) => setField('full_name', e.target.value)}
              />
            </div>

            <div className="account-form-group">
              <label className="account-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="account-input-field"
                value={user?.email || ''}
                disabled
              />
            </div>

            <div className="account-form-row">
              <div className="account-form-group">
                <label className="account-label" htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  className="account-input-field"
                  placeholder="(555) 123-4567"
                  value={profile.phone || ''}
                  onChange={(e) => setField('phone', e.target.value)}
                />
              </div>

              <div className="account-form-group">
                <label className="account-label" htmlFor="ring_size">
                  <Ruler size={12} style={{ marginRight: 4, verticalAlign: -1 }} />
                  Ring Size (US)
                </label>
                <select
                  id="ring_size"
                  className="account-select-field"
                  value={profile.ring_size || ''}
                  onChange={(e) => setField('ring_size', e.target.value)}
                >
                  <option value="">Select size</option>
                  {RING_SIZES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="account-section">
              <div className="account-section-title">
                <MapPin size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                Shipping Address
              </div>

              <div className="account-form-group">
                <label className="account-label" htmlFor="address_line1">Address Line 1</label>
                <input
                  id="address_line1"
                  type="text"
                  className="account-input-field"
                  placeholder="123 Main Street"
                  value={profile.address_line1 || ''}
                  onChange={(e) => setField('address_line1', e.target.value)}
                />
              </div>

              <div className="account-form-group">
                <label className="account-label" htmlFor="address_line2">Address Line 2 (optional)</label>
                <input
                  id="address_line2"
                  type="text"
                  className="account-input-field"
                  placeholder="Apt, Suite, Unit"
                  value={profile.address_line2 || ''}
                  onChange={(e) => setField('address_line2', e.target.value)}
                />
              </div>

              <div className="account-form-row">
                <div className="account-form-group">
                  <label className="account-label" htmlFor="city">City</label>
                  <input
                    id="city"
                    type="text"
                    className="account-input-field"
                    placeholder="City"
                    value={profile.city || ''}
                    onChange={(e) => setField('city', e.target.value)}
                  />
                </div>

                <div className="account-form-group">
                  <label className="account-label" htmlFor="state">State</label>
                  <select
                    id="state"
                    className="account-select-field"
                    value={profile.state || ''}
                    onChange={(e) => setField('state', e.target.value)}
                  >
                    <option value="">Select state</option>
                    {US_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="account-form-row">
                <div className="account-form-group">
                  <label className="account-label" htmlFor="zip">ZIP Code</label>
                  <input
                    id="zip"
                    type="text"
                    className="account-input-field"
                    placeholder="90210"
                    value={profile.zip || ''}
                    onChange={(e) => setField('zip', e.target.value.replace(/\D/g, '').slice(0, 5))}
                  />
                </div>

                <div className="account-form-group">
                  <label className="account-label" htmlFor="country">Country</label>
                  <select
                    id="country"
                    className="account-select-field"
                    value={profile.country || 'US'}
                    onChange={(e) => setField('country', e.target.value)}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="IT">Italy</option>
                    <option value="JP">Japan</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="account-btn-row">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? <Loader2 size={16} className="spin-icon" /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>

        <div style={{ marginTop: 24, display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link href="/wishlist" style={{ fontSize: 13, color: '#2563EB', fontWeight: 600 }}>
            View Wishlist
          </Link>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <Link href="/cart" style={{ fontSize: 13, color: '#2563EB', fontWeight: 600 }}>
            View Cart
          </Link>
        </div>
      </div>

      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-modal animate-fade-in">
            <button className="welcome-close" onClick={dismissWelcome}>
              <X size={18} />
            </button>
            <div className="welcome-icon">
              <Sparkles size={32} />
            </div>
            <h2 className="welcome-title">Welcome to Luxury Jeweleris!</h2>
            <p className="welcome-subtitle">
              You&apos;re all set. Take a moment to fill in your profile so we can serve you better.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ width: '100%' }}>
              <div className="welcome-field">
                <input
                  type="text"
                  className="account-input-field"
                  placeholder="Your full name"
                  value={profile.full_name || ''}
                  onChange={(e) => setField('full_name', e.target.value)}
                  autoFocus
                />
              </div>
              <div className="welcome-field">
                <input
                  type="tel"
                  className="account-input-field"
                  placeholder="Phone number"
                  value={profile.phone || ''}
                  onChange={(e) => setField('phone', e.target.value)}
                />
              </div>
              <div className="welcome-actions">
                <Button type="submit" variant="primary" disabled={saving} style={{ flex: 1 }}>
                  {saving ? <Loader2 size={16} className="spin-icon" /> : null}
                  {saving ? 'Saving...' : 'Save & Start Shopping'}
                </Button>
                <button type="button" className="welcome-skip" onClick={dismissWelcome}>
                  Skip for now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
