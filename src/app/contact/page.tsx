'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import './contact.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In production, this would send to your backend
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="container contact-hero-inner">
          <span className="label-text" style={{ color: 'var(--color-teal)' }}>GET IN TOUCH</span>
          <h1 className="h1-text" style={{ marginTop: '8px', marginBottom: '16px' }}>
            We&apos;d love to hear from you
          </h1>
          <p className="body-text" style={{ maxWidth: '560px', margin: '0 auto', color: 'var(--color-slate-muted)' }}>
            Whether you have a question about our collections, need help choosing the perfect piece, 
            or want to discuss a custom design — our team is here to help.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="container contact-cards-section">
        <div className="contact-cards-grid">
          <div className="contact-info-card">
            <div className="contact-card-icon">
              <Phone size={22} />
            </div>
            <h3 className="h3-text">Call Us</h3>
            <a href="tel:+12136427217" className="contact-card-value">+1 213-642-7217</a>
            <p className="body-sm-text" style={{ color: 'var(--color-slate-muted)', marginTop: '8px' }}>
              Mon – Sat, 9am – 7pm EST
            </p>
          </div>
          <div className="contact-info-card">
            <div className="contact-card-icon">
              <Mail size={22} />
            </div>
            <h3 className="h3-text">Email Us</h3>
            <a href="mailto:luxuryjeweleris@gmail.com" className="contact-card-value">luxuryjeweleris@gmail.com</a>
            <p className="body-sm-text" style={{ color: 'var(--color-slate-muted)', marginTop: '8px' }}>
              We respond within 24 hours
            </p>
          </div>
          <div className="contact-info-card">
            <div className="contact-card-icon">
              <MessageCircle size={22} />
            </div>
            <h3 className="h3-text">Live Chat</h3>
            <button 
              className="contact-card-btn"
              onClick={() => alert('Starting live chat...')}
            >
              Start a conversation
            </button>
            <p className="body-sm-text" style={{ color: 'var(--color-slate-muted)', marginTop: '8px' }}>
              Available during business hours
            </p>
          </div>
          <div className="contact-info-card">
            <div className="contact-card-icon">
              <MapPin size={22} />
            </div>
            <h3 className="h3-text">Visit Us</h3>
            <p className="contact-card-value" style={{ fontSize: '14px' }}>
              Los Angeles, CA
            </p>
            <p className="body-sm-text" style={{ color: 'var(--color-slate-muted)', marginTop: '8px' }}>
              By appointment only
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="container contact-form-section">
        <div className="contact-form-grid">
          {/* Form */}
          <div className="contact-form-card">
            {submitted ? (
              <div className="contact-success">
                <div className="contact-success-icon">✓</div>
                <h3 className="h2-text" style={{ marginBottom: '12px' }}>Message Sent!</h3>
                <p className="body-text" style={{ color: 'var(--color-slate-muted)', marginBottom: '24px' }}>
                  Thank you for reaching out. One of our jewelry consultants will get back to you within 24 hours.
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="h2-text" style={{ marginBottom: '8px' }}>Send us a message</h2>
                <p className="body-sm-text" style={{ color: 'var(--color-slate-muted)', marginBottom: '32px' }}>
                  Fill out the form and we&apos;ll get back to you as soon as possible.
                </p>
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="contact-form-row">
                    <div className="contact-form-group">
                      <label htmlFor="contact-name">Full Name *</label>
                      <input 
                        type="text" 
                        id="contact-name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required 
                      />
                    </div>
                    <div className="contact-form-group">
                      <label htmlFor="contact-email">Email *</label>
                      <input 
                        type="email" 
                        id="contact-email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required 
                      />
                    </div>
                  </div>
                  <div className="contact-form-row">
                    <div className="contact-form-group">
                      <label htmlFor="contact-phone">Phone</label>
                      <input 
                        type="tel" 
                        id="contact-phone" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000" 
                      />
                    </div>
                    <div className="contact-form-group">
                      <label htmlFor="contact-subject">Subject *</label>
                      <select 
                        id="contact-subject" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Question</option>
                        <option value="custom">Custom Design</option>
                        <option value="returns">Returns & Exchanges</option>
                        <option value="repair">Repair & Maintenance</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="contact-message">Message *</label>
                    <textarea 
                      id="contact-message" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      required 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary contact-submit-btn">
                    <Send size={16} />
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Side Info */}
          <div className="contact-side-info">
            <div className="contact-hours-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Clock size={20} style={{ color: 'var(--color-teal)' }} />
                <h3 className="h3-text">Business Hours</h3>
              </div>
              <div className="contact-hours-list">
                <div className="contact-hours-row">
                  <span>Monday – Friday</span>
                  <span className="contact-hours-time">9:00 AM – 7:00 PM</span>
                </div>
                <div className="contact-hours-row">
                  <span>Saturday</span>
                  <span className="contact-hours-time">10:00 AM – 5:00 PM</span>
                </div>
                <div className="contact-hours-row">
                  <span>Sunday</span>
                  <span className="contact-hours-time">Closed</span>
                </div>
              </div>
            </div>

            <div className="contact-faq-card">
              <h3 className="h3-text" style={{ marginBottom: '16px' }}>Quick Links</h3>
              <div className="contact-faq-links">
                <Link href="/shop" className="contact-faq-link">Shop All Jewelry</Link>
                <Link href="/engagement-rings" className="contact-faq-link">Engagement Rings</Link>
                <Link href="/wedding-bands" className="contact-faq-link">Wedding Bands</Link>
                <Link href="/about" className="contact-faq-link">About Us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
