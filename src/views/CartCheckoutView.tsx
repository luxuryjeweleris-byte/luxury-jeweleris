'use client';

import React, { useState } from 'react';
import { Shield, Trash2, CreditCard, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import Button from '../components/Button';
import type { Product } from '../components/ProductCard';
import './views.css';

export interface CartItem {
  id: string; // unique item id (includes timestamp or config)
  product: Product;
  metal: string;
  size: string;
}

interface CartCheckoutViewProps {
  cart: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onNavigate: (view: string) => void;
}

export const CartCheckoutView: React.FC<CartCheckoutViewProps> = ({
  cart,
  onRemoveItem,
  onClearCart,
  onNavigate,
}) => {
  const [includeInsurance, setIncludeInsurance] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [card, setCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Form Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const insuranceCost = 149;
  const shippingCost = 0; // Free Insured Shipping

  const itemsSubtotal = cart.reduce((acc, item) => acc + item.product.price, 0);
  const totalCost = itemsSubtotal + (includeInsurance ? insuranceCost : 0) + shippingCost;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email is required';
    if (!card.trim() || card.replace(/\s/g, '').length !== 16) {
      newErrors.card = 'Valid 16-digit credit card is required';
    }
    if (!expiry.trim() || !/^\d{2}\/\d{2}$/.test(expiry)) {
      newErrors.expiry = 'MM/YY format required';
    }
    if (!cvv.trim() || cvv.length !== 3) {
      newErrors.cvv = '3-digit CVV required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < value.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += value[i];
    }
    setCard(formatted);
  };

  const handleExpiryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = '';
    if (value.length > 0) {
      formatted = value.substring(0, 2);
      if (value.length > 2) {
        formatted += '/' + value.substring(2, 4);
      }
    }
    setExpiry(formatted);
  };

  const handleCvvInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCvv(value);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate premium validation & bank gateway transaction loading (1.8 seconds)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1800);
  };

  const handleSuccessReset = () => {
    onClearCart();
    onNavigate('home');
  };

  if (isSuccess) {
    return (
      <div className="container" style={{ padding: '64px 0', maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ backgroundColor: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '48px var(--space-6)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-e1)' }}>
          <CheckCircle2 size={64} style={{ color: 'var(--color-verified)', marginBottom: '24px' }} />
          <span className="label-text" style={{ color: 'var(--color-verified)', marginBottom: '8px' }}>TRANSACTION SECURED</span>
          <h1 className="h1-text" style={{ marginBottom: '16px' }}>Order Vetted!</h1>
          <p className="body-text" style={{ marginBottom: '24px', lineHeight: '1.6' }}>
            Thank you, <strong>{name}</strong>! Your custom setting and stone are now locked in. 
            An insured courier shipping tracking number, invoice detail, and purchase receipt digital copy has been sent to <strong>{email}</strong>.
          </p>
          <div style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', marginBottom: '32px', textAlign: 'left' }}>
            <div className="caption-text" style={{ fontWeight: 'bold', marginBottom: '8px' }}>ORDER DETAILS:</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '500', color: 'var(--color-ink)', marginBottom: '4px' }}>
              <span>Transaction Reference:</span>
              <span>#RC-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '500', color: 'var(--color-ink)', marginBottom: '4px' }}>
              <span>Shipping Speed:</span>
              <span>Insured Overnight Express</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', color: 'var(--color-teal)', borderTop: '1px solid var(--color-border-soft)', paddingTop: '8px', marginTop: '8px' }}>
              <span>Total Debited:</span>
              <span>${totalCost.toLocaleString()}</span>
            </div>
          </div>
          <Button variant="primary" style={{ width: '100%' }} onClick={handleSuccessReset}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="listing-view" style={{ padding: '24px 0' }}>
      <div className="container">
        {cart.length === 0 ? (
          <div className="empty-cart-state" style={{ backgroundColor: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '64px var(--space-6)' }}>
            <Shield size={48} style={{ color: 'var(--color-slate-muted)' }} />
            <h2 className="h2-text">Your cart is empty</h2>
            <p className="body-text" style={{ maxWidth: '340px' }}>
              Browse our collections and click "Add to Cart" to find your perfect piece.
            </p>
            <Button variant="primary" onClick={() => onNavigate('listing')}>
              Shop Jewelry
            </Button>
          </div>
        ) : (
          <div className="checkout-layout">
            {/* Left side: Cart Items summary */}
            <div className="cart-items-panel">
              <h2 className="h2-text cart-title">Order Summary ({cart.length})</h2>
              
              <div className="cart-items-list">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.product.image} alt={item.product.name} className="cart-item-img" />
                    <div className="cart-item-details">
                      <div>
                        <h3 className="cart-item-name">{item.product.name}</h3>
                        <span className="cart-item-meta" style={{ textTransform: 'capitalize' }}>
                          Metal: {item.metal} · Size: {item.size} · Premium Quality
                        </span>
                      </div>
                      <div className="cart-item-price-row">
                        <span style={{ fontWeight: '700', color: 'var(--color-teal)' }}>
                          ${item.product.price.toLocaleString()}
                        </span>
                        <button className="cart-item-remove" onClick={() => onRemoveItem(item.id)}>
                          <Trash2 size={15} style={{ marginRight: '4px' }} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Insurance Addon */}
              <div 
                className={`insurance-card ${includeInsurance ? 'active' : ''}`}
                onClick={() => setIncludeInsurance(!includeInsurance)}
              >
                <div style={{ display: 'flex', alignItems: 'center', height: '100%', marginTop: '2px' }}>
                  <input 
                    type="checkbox" 
                    checked={includeInsurance}
                    onChange={() => {}} // toggled by card click
                    style={{ accentColor: 'var(--color-teal)', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                </div>
                <div>
                  <div className="insurance-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Shield size={14} style={{ color: 'var(--color-teal)' }} /> Add Lifetime Loss & Damage Insurance
                  </div>
                  <p className="insurance-text">
                    Protect your investment. Covers full replacement cost for accidental damage, theft, or stone loss. Just $149 flat.
                  </p>
                </div>
              </div>

              {/* Financing Callout */}
              <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '10px' }}>
                <Sparkles size={16} style={{ color: 'var(--color-gold)', marginTop: '2px', flexShrink: 0 }} />
                <span className="body-sm-text">
                  Pay over time starting at <strong>${Math.round(totalCost / 48)}/mo</strong> with Affirm or Bread Pay. Select financing at payment checkout screen.
                </span>
              </div>
            </div>

            {/* Right side: Checkout credit card details form */}
            <div className="checkout-panel">
              <h2 className="h2-text checkout-section-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={16} style={{ color: 'var(--color-teal)' }} /> Secure Checkout
                </span>
              </h2>

              <form onSubmit={handleCheckoutSubmit}>
                {/* Name */}
                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input 
                    type="text" 
                    className={`input-field ${errors.name ? 'error' : ''}`}
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label">Email Address (for Order Confirmation)</label>
                  <input 
                    type="email" 
                    className={`input-field ${errors.email ? 'error' : ''}`}
                    placeholder="sarah@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>

                {/* Card Number */}
                <div className="form-group">
                  <label className="form-label">Credit Card Number</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      className={`input-field ${errors.card ? 'error' : ''}`}
                      placeholder="0000 0000 0000 0000"
                      value={card}
                      onChange={handleCardInput}
                    />
                    <CreditCard size={16} style={{ position: 'absolute', right: '12px', top: '14px', color: 'var(--color-slate-muted)' }} />
                  </div>
                  {errors.card && <span className="form-error">{errors.card}</span>}
                </div>

                {/* Expiry & CVV */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input 
                      type="text" 
                      className={`input-field ${errors.expiry ? 'error' : ''}`}
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={handleExpiryInput}
                    />
                    {errors.expiry && <span className="form-error">{errors.expiry}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV Code</label>
                    <input 
                      type="password" 
                      className={`input-field ${errors.cvv ? 'error' : ''}`}
                      placeholder="•••"
                      value={cvv}
                      onChange={handleCvvInput}
                    />
                    {errors.cvv && <span className="form-error">{errors.cvv}</span>}
                  </div>
                </div>

                {/* Cost totals */}
                <div style={{ margin: '24px 0', borderTop: '1px solid var(--color-border-soft)', paddingTop: '16px' }}>
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${itemsSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping (Insured overnight):</span>
                    <span style={{ color: 'var(--color-verified)', fontWeight: '600' }}>FREE</span>
                  </div>
                  {includeInsurance && (
                    <div className="summary-row">
                      <span>Lifetime Insurance:</span>
                      <span>${insuranceCost}</span>
                    </div>
                  )}
                  <div className="summary-row summary-total">
                    <span>Order Total:</span>
                    <span>${totalCost.toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="dark" 
                  disabled={isSubmitting} 
                  style={{ width: '100%', height: '50px', fontSize: '15px' }}
                >
                  {isSubmitting ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg className="spinner" viewBox="0 0 24 24" style={{ width: '16px', height: '16px', fill: 'none', stroke: 'currentColor', strokeWidth: '3' }}><circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10" /><style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .spinner { animation: spin 0.8s linear infinite; }`}</style></svg>
                      Validating Payment Gateway...
                    </span>
                  ) : (
                    <span>Complete Checkout</span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CartCheckoutView;
