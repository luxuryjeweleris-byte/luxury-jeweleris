'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Phone, MessageSquare, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import Button from '../../components/Button';
import { supabase } from '../../lib/supabase';
import '../login/login.css';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: '10px' }}>
    <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.89 3.02C6.21 7.62 8.87 5.04 12 5.04z" />
    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.99 3.7-8.62z" />
    <path fill="#FBBC05" d="M5.28 10.58c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.39 3.02C.5 4.8.01 6.8.01 8.9c0 2.1.49 4.1 1.38 5.88l3.89-3.2z" />
    <path fill="#34A853" d="M12 22.99c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.03.69-2.35 1.1-4.23 1.1-3.13 0-5.79-2.58-6.72-5.54l-3.89 3.02c1.98 3.89 5.96 6.56 10.61 6.56z" />
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
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push('/');
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
        setSuccessMsg('Account created successfully! You are now signed in.');
        setTimeout(() => router.push('/'), 1500);
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
