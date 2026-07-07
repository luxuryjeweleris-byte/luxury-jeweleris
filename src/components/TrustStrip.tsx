import React from 'react';
import './components.css';

export const TrustStrip: React.FC = () => {
  return (
    <div className="trust-strip">
      <div className="container">
        <div className="trust-strip-container">
          <div className="trust-item">
            <span className="trust-stars">★★★★★</span>
            <span>#1 on Trustpilot</span>
          </div>
          <span className="trust-separator">·</span>
          <div className="trust-item">
            <span>100K+ happy couples</span>
          </div>
          <span className="trust-separator">·</span>
          <div className="trust-item">
            <span style={{ color: 'var(--color-teal)', fontWeight: 'bold' }}>AI</span>
            <span>price & quality scores</span>
          </div>
          <span className="trust-separator">·</span>
          <div className="trust-item">
            <span>Free insured shipping & 30-day returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TrustStrip;
