'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Phone, MessageSquare, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import Button from '../../components/Button';
import { supabase } from '../../lib/supabase';
import '../login/login.css';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: '10px', flexShrink: 0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then((res: any) => {
      if (res?.data?.session) router.push('/');
    });
  }, [router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !fullName.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (authError) {
        setError(authError.message || 'Sign up failed. Please try again.');
      } else if (data.user && !data.session) {
        setSuccessMsg('Account created! Please check your email to verify, then sign in.');
      } else {
        setSuccessMsg('Account created successfully! Welcome to Luxury Jeweleris.');
        setTimeout(() => router.push('/account?welcome=1'), 1500);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Connection error. Check your internet.');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/signup` },
    });
  };

  return (
    <div className="login-page">
      <div className="container login-container-grid">
        <div className="login-form-card">
          <div className="login-form-header">
            <h1 className="login-title">Create account</h1>
            <span className="create-account-text">
              Already have one?{' '}
              <Link href="/login" className="login-blue-link">Sign in</Link>
            </span>
          </div>

          {successMsg ? (
            <div className="login-success-state">
              <CheckCircle size={48} className="success-icon" />
              <h3>Success!</h3>
              <p>{successMsg}</p>
              <Button variant="primary" onClick={() => { setSuccessMsg(''); }} style={{ marginTop: '16px' }}>
                Continue
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSignUp} className="login-form">
              {error && <div className="login-error-box">{error}</div>}

              <div className="login-form-group">
                <input
                  id="signup-name"
                  type="text"
                  className="login-input-field"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="login-form-group">
                <input
                  id="signup-email"
                  type="email"
                  className="login-input-field"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="login-form-group password-group">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input-field"
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <Button type="submit" variant="primary" style={{ width: '100%', height: '48px', fontSize: '14px', fontWeight: 'bold' }} disabled={loading}>
                {loading ? <Loader2 size={18} className="spin-icon" /> : 'Create Account'}
              </Button>

              <div className="login-separator"><span>or</span></div>

              <button type="button" className="oauth-btn google-btn" onClick={handleGoogleLogin}>
                <GoogleIcon />
                Continue with Google
              </button>

              <p className="login-terms-text">
                By creating an account you agree to our <Link href="#" className="underline-link">Terms</Link>.
              </p>
            </form>
          )}
        </div>

        <div className="support-card">
          <h2 className="support-title">Luxury Jeweleris Customer Support</h2>
          <p className="support-subtitle">Connect with a certified gemologist.</p>
          <p className="support-description">Get unbiased advice wherever you buy.</p>

          <Button variant="primary" className="support-chat-btn" onClick={() => alert('Starting customer chat support...')}>
            <MessageSquare size={16} style={{ marginRight: '8px' }} />
            Chat Now
          </Button>

          <div className="support-separator"><span>or</span></div>

          <div className="support-details-grid">
            <div className="support-detail-item">
              <Phone size={18} className="support-detail-icon" />
              <span className="support-detail-label">+1 213-642-7217</span>
            </div>
            <div className="support-detail-item">
              <Mail size={18} className="support-detail-icon" />
              <span className="support-detail-label">luxuryjeweleris@gmail.com</span>
            </div>
          </div>

          <div className="support-order-info">
            <span>Looking for info about your order?</span>
            <Link href="/login" className="login-blue-link">Track your order</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
