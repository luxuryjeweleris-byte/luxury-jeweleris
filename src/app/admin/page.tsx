'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import '../admin/admin.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect to dashboard instantly without ever showing login form
  useEffect(() => {
    let mounted = true;
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.replace('/admin/dashboard');
          // Return without setting checkingAuth to false, keeping dark loader during redirect
          return;
        }
      } catch (err) {
        console.error('Admin session check error:', err);
      }
      if (mounted) {
        setCheckingAuth(false);
      }
    };
    checkAdmin();
    return () => {
      mounted = false;
    };
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError || !authData.user) {
        setLoading(false);
        setError(authError?.message || 'Invalid email or password.');
        return;
      }

      // Check if this user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('user_id', authData.user.id)
        .eq('is_active', true)
        .maybeSingle();

      setLoading(false);

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        setError('Access denied. This account does not have admin privileges.');
        return;
      }

      // Success — go to dashboard
      router.replace('/admin/dashboard');
    } catch (err: unknown) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Connection error. Please check your internet.');
    }
  };

  if (checkingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#090d16', gap: '16px' }}>
        <div style={{ padding: '16px', borderRadius: '50%', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <Loader2 size={36} className="admin-spin" color="#6366f1" />
        </div>
        <span style={{ fontSize: '13px', color: '#8892a4' }}>Verifying Admin Session...</span>
      </div>
    );
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <ShieldCheck size={40} style={{ color: '#6366f1', marginBottom: '12px' }} />
          <h1>Admin Panel</h1>
          <p>Luxury Jeweleris — Secure Access</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && <div className="admin-login-error">{error}</div>}

          <label className="admin-label" htmlFor="admin-email">Email Address</label>
          <input
            id="admin-email"
            type="email"
            className="admin-input"
            placeholder="admin@luxuryjeweleris.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <label className="admin-label" htmlFor="admin-password">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              className="admin-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-60%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#8892a4',
              }}
              aria-label="Toggle password"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', height: '46px', justifyContent: 'center', marginTop: '8px', fontSize: '14px' }}
            disabled={loading}
          >
            {loading ? <Loader2 size={18} className="admin-spin" /> : 'Sign In to Admin'}
          </button>
        </form>

        <a href="/" className="admin-login-back">← Back to main site</a>
      </div>
    </div>
  );
}
