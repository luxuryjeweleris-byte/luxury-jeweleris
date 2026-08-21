'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Phone, MessageSquare, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import Button from '../../components/Button';
import { supabase } from '../../lib/supabase';
import './login.css';

// Custom Google SVG Icon
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: '10px', flexShrink: 0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

type AuthMode = 'signin' | 'forgot';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'newpass'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }: any) => {
      if (data.session) router.push('/');
    });
  }, [router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message || 'Sign in failed. Please try again.');
      } else {
        setSuccessMsg('Signed in successfully! Redirecting...');
        setTimeout(() => router.push('/'), 1200);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Connection error. Check your internet.');
    }
    setLoading(false);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send code.');
      } else {
        setForgotStep('otp');
      }
    } catch {
      setError('Connection error.');
    }
    setLoading(false);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the code sent to your email.');
      return;
    }
    setForgotStep('newpass');
    setError('');
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to reset password.');
      } else {
        setSuccessMsg('Password reset successfully! You can now sign in.');
      }
    } catch {
      setError('Connection error.');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
  };

  const resetState = () => {
    setError('');
    setSuccessMsg('');
    setEmail('');
    setPassword('');
    setOtp('');
  };

  const switchMode = (newMode: AuthMode) => {
    resetState();
    setMode(newMode);
    setForgotStep('email');
  };

  return (
    <div className="login-page">
      <div className="container login-container-grid">
        {/* Left/Center Column: Auth Form */}
        <div className="login-form-card">
          <div className="login-form-header">
            <h1 className="login-title">
              {mode === 'signin' && 'Sign in'}
              {mode === 'forgot' && 'Reset password'}
            </h1>
            {mode === 'signin' && (
              <span className="create-account-text">
                or{' '}
                <Link href="/signup" className="login-blue-link">
                  create an account
                </Link>
              </span>
            )}
          </div>

          {/* Success State */}
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
            <>
              {/* Sign In Form */}
              {mode === 'signin' && (
                <form onSubmit={handleSignIn} className="login-form">
                  {error && <div className="login-error-box">{error}</div>}

                  <div className="login-form-group">
                    <input
                      id="login-email"
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
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      className="login-input-field"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
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

                  <div className="forgot-password-container">
                    <button type="button" className="login-blue-link forgot-password-link" onClick={() => switchMode('forgot')}>
                      Forgot your password?
                    </button>
                  </div>

                  <Button type="submit" variant="primary" style={{ width: '100%', height: '48px', fontSize: '14px', fontWeight: 'bold' }} disabled={loading}>
                    {loading ? <Loader2 size={18} className="spin-icon" /> : 'Sign In'}
                  </Button>

                  <div className="login-separator"><span>or</span></div>

                  <button type="button" className="oauth-btn google-btn" onClick={handleGoogleLogin}>
                    <GoogleIcon />
                    Continue with Google
                  </button>

                  <p className="login-terms-text">
                    By signing in you agree to our <Link href="#" className="underline-link">Terms</Link>.
                  </p>
                </form>
              )}

              {/* Forgot Password Flow (OTP-based, bypasses broken recover endpoint) */}
              {mode === 'forgot' && forgotStep === 'email' && (
                <form onSubmit={handleSendOtp} className="login-form">
                  {error && <div className="login-error-box">{error}</div>}
                  <p style={{ fontSize: '14px', color: '#555', marginBottom: '16px' }}>
                    Enter your email and we'll send you a code to reset your password.
                  </p>

                  <div className="login-form-group">
                    <input
                      id="forgot-email"
                      type="email"
                      className="login-input-field"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>

                  <Button type="submit" variant="primary" style={{ width: '100%', height: '48px', fontSize: '14px', fontWeight: 'bold' }} disabled={loading}>
                    {loading ? <Loader2 size={18} className="spin-icon" /> : 'Send Code'}
                  </Button>

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <button type="button" className="login-blue-link" onClick={() => switchMode('signin')}>
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              )}

              {mode === 'forgot' && forgotStep === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="login-form">
                  {error && <div className="login-error-box">{error}</div>}
                  <p style={{ fontSize: '14px', color: '#555', marginBottom: '16px' }}>
                    Enter the code sent to <strong>{email}</strong>
                  </p>

                  <div className="login-form-group">
                    <input
                      id="otp-code"
                      type="text"
                      className="login-input-field"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      autoComplete="one-time-code"
                      inputMode="numeric"
                      maxLength={6}
                    />
                  </div>

                  <Button type="submit" variant="primary" style={{ width: '100%', height: '48px', fontSize: '14px', fontWeight: 'bold' }} disabled={loading}>
                    {loading ? <Loader2 size={18} className="spin-icon" /> : 'Verify Code'}
                  </Button>

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <button type="button" className="login-blue-link" onClick={() => { setForgotStep('email'); setOtp(''); setError(''); }}>
                      ← Use a different email
                    </button>
                  </div>
                </form>
              )}

              {mode === 'forgot' && forgotStep === 'newpass' && (
                <form onSubmit={handleSetNewPassword} className="login-form">
                  {error && <div className="login-error-box">{error}</div>}
                  <p style={{ fontSize: '14px', color: '#555', marginBottom: '16px' }}>
                    Enter your new password.
                  </p>

                  <div className="login-form-group password-group">
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      className="login-input-field"
                      placeholder="New password (min 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      minLength={6}
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
                    {loading ? <Loader2 size={18} className="spin-icon" /> : 'Reset Password'}
                  </Button>

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <button type="button" className="login-blue-link" onClick={() => switchMode('signin')}>
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>

        {/* Right Column: Customer Support */}
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
            <Link href="#" className="login-blue-link">Track your order</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
