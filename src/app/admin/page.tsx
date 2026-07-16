'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import '../admin/admin.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in as admin, redirect to dashboard
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .single();

      if (data) router.push('/admin/dashboard');
    };
    checkAdmin();
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
        .single();

      setLoading(false);

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        setError('Access denied. This account does not have admin privileges.');
        return;
      }

      // Success — go to dashboard
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Connection error. Please check your internet.');
    }
  };

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

        <div style={{ marginTop: '24px', padding: '14px', background: 'rgba(99,102,241,0.08)', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.15)' }}>
          <p style={{ fontSize: '11px', color: '#8892a4', lineHeight: 1.6 }}>
            <strong style={{ color: '#a5b4fc' }}>First time setup?</strong><br />
            Sign up at <a href="/login" style={{ color: '#a5b4fc' }}>/login</a>, then run this SQL in Supabase to grant admin access:
          </p>
          <pre style={{ fontSize: '10px', color: '#6ee7b7', marginTop: '8px', lineHeight: 1.5, wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
{`INSERT INTO admin_users (user_id, email, role)
SELECT id, email, 'super_admin'
FROM auth.users
WHERE email = 'YOUR_EMAIL';`}
          </pre>
        </div>
      </div>
    </div>
  );
}
