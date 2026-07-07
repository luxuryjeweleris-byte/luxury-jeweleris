'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MessageSquare, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Button from '../../components/Button';
import './login.css';

// Custom Google SVG Icon
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: '10px' }}>
    <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.89 3.02C6.21 7.62 8.87 5.04 12 5.04z" />
    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.99 3.7-8.62z" />
    <path fill="#FBBC05" d="M5.28 10.58c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.39 3.02C.5 4.8.01 6.8.01 8.9c0 2.1.49 4.1 1.38 5.88l3.89-3.2z" />
    <path fill="#34A853" d="M12 22.99c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.03.69-2.35 1.1-4.23 1.1-3.13 0-5.79-2.58-6.72-5.54l-3.89 3.02c1.98 3.89 5.96 6.56 10.61 6.56z" />
  </svg>
);

// Custom Facebook SVG Icon
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginRight: '10px' }}>
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }
    setError('');
    setIsSuccess(true);
  };

  return (
    <div className="login-page">
      <div className="container login-container-grid">
        {/* Left/Center Column: Sign In Form */}
        <div className="login-form-card">
          <div className="login-form-header">
            <h1 className="login-title">Sign in</h1>
            <span className="create-account-text">
              or <Link href="#" className="login-blue-link">create an account</Link>
            </span>
          </div>

          {isSuccess ? (
            <div className="login-success-state">
              <CheckCircle size={48} className="success-icon" />
              <h3>Sign In Successful!</h3>
              <p>Welcome back to RareCarat. Redirecting to your dashboard...</p>
              <Button variant="primary" onClick={() => setIsSuccess(false)} style={{ marginTop: '16px' }}>
                Reset Demo Form
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="login-form">
              {error && <div className="login-error-box">{error}</div>}

              {/* Email Field */}
              <div className="login-form-group">
                <input
                  type="email"
                  className="login-input-field"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="login-form-group password-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input-field"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

              {/* Forgot Password Link */}
              <div className="forgot-password-container">
                <Link href="#" className="login-blue-link forgot-password-link">
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button type="submit" variant="primary" style={{ width: '100%', height: '48px', fontSize: '14px', fontWeight: 'bold' }}>
                Sign In
              </Button>

              {/* OR Separator */}
              <div className="login-separator">
                <span>or</span>
              </div>

              {/* Google OAuth */}
              <button type="button" className="oauth-btn google-btn">
                <GoogleIcon />
                Continue with Google
              </button>

              {/* Facebook OAuth */}
              <button type="button" className="oauth-btn facebook-btn">
                <FacebookIcon />
                Continue with Facebook
              </button>

              {/* Terms Footer */}
              <p className="login-terms-text">
                By signing up on Luxury Jewelers you agree to our <Link href="#" className="underline-link">Terms</Link>.
              </p>
            </form>
          )}
        </div>

        {/* Right Column: Customer Support Box (Contact Us) */}
        <div className="support-card">
          <h2 className="support-title">Luxury Jewelers Customer Support</h2>
          
          <p className="support-subtitle">
            Connect with a certified gemologist.
          </p>
          <p className="support-description">
            Get unbiased advice wherever you buy.
          </p>

          {/* Chat Button */}
          <Button variant="primary" className="support-chat-btn" onClick={() => alert('Starting customer chat support...')}>
            <MessageSquare size={16} style={{ marginRight: '8px' }} />
            Chat Now
          </Button>

          {/* OR Separator */}
          <div className="support-separator">
            <span>or</span>
          </div>

          {/* Contact Details Grid */}
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

          {/* Order Info */}
          <div className="support-order-info">
            <span>Looking for info about your order?</span>
            <Link href="#" className="login-blue-link" onClick={(e) => { e.preventDefault(); alert('Redirecting to order tracking...'); }}>
              Track your order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
