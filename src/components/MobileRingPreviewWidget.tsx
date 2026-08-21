'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import './components.css';

export const MobileRingPreviewWidget: React.FC = () => {
  const router = useRouter();
  const [selectedDiamond] = useState({
    carat: '1.52 Carat',
    shape: 'Heart',
    img: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=200&auto=format&fit=crop',
  });

  const [selectedSetting] = useState({
    name: 'Hayden Curved Vine',
    img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop',
  });

  return (
    <section className="rc-ring-preview-section">
      <div className="container">
        {/* Title */}
        <div className="rc-ring-preview-header">
          <h2 className="rc-ring-preview-title">
            Rock on: Preview your ring
          </h2>
        </div>

        {/* 3 Step Cards Bar */}
        <div className="rc-ring-steps-grid">
          {/* Step 1: Diamond */}
          <div className="rc-ring-step-card">
            <div className="rc-step-badge">
              <CheckCircle2 size={18} color="#16a34a" fill="#22c55e" stroke="#ffffff" />
            </div>
            <div className="rc-step-img-wrap">
              <img src={selectedDiamond.img} alt="Diamond" className="rc-step-img" />
            </div>
            <div className="rc-step-label-main">Diamond</div>
            <div className="rc-step-subtitle">{selectedDiamond.carat} {selectedDiamond.shape}</div>
            <div className="rc-step-actions">
              <button onClick={() => router.push('/diamonds')} className="rc-step-link">View</button>
              <span className="rc-step-sep">|</span>
              <button onClick={() => router.push('/diamonds')} className="rc-step-link">Change</button>
            </div>
          </div>

          {/* Step 2: Setting */}
          <div className="rc-ring-step-card">
            <div className="rc-step-badge">
              <CheckCircle2 size={18} color="#16a34a" fill="#22c55e" stroke="#ffffff" />
            </div>
            <div className="rc-step-img-wrap">
              <img src={selectedSetting.img} alt="Setting" className="rc-step-img" />
            </div>
            <div className="rc-step-label-main">Setting</div>
            <div className="rc-step-subtitle">{selectedSetting.name}</div>
            <div className="rc-step-actions">
              <button onClick={() => router.push('/engagement-rings')} className="rc-step-link">View</button>
              <span className="rc-step-sep">|</span>
              <button onClick={() => router.push('/engagement-rings')} className="rc-step-link">Change</button>
            </div>
          </div>

          {/* Step 3: Complete Ring */}
          <div className="rc-ring-step-card">
            <div className="rc-step-badge">
              <CheckCircle2 size={18} color="#16a34a" fill="#22c55e" stroke="#ffffff" />
            </div>
            <div className="rc-step-img-wrap">
              <img src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=200&auto=format&fit=crop" alt="Complete Ring" className="rc-step-img" />
            </div>
            <div className="rc-step-label-main">Complete Ring</div>
            <div className="rc-step-subtitle">Your unique ring</div>
            <div className="rc-step-actions">
              <button onClick={() => router.push('/engagement-rings')} className="rc-step-link">Review</button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="rc-ring-preview-ctas">
          <button 
            className="rc-preview-primary-btn"
            onClick={() => router.push('/engagement-rings')}
          >
            Preview your ring
          </button>

          <button 
            className="rc-preview-secondary-btn"
            onClick={() => {
              const el = document.getElementById('rc-floating-chat-btn');
              if (el) el.click();
              else alert('Connecting with a certified Diamond Expert...');
            }}
          >
            Shop with a real expert
          </button>
        </div>

        {/* Guarantees */}
        <div className="rc-ring-preview-guarantee">
          <span>Free shipping. Free returns.</span>
          <button onClick={() => router.push('/engagement-rings')} className="rc-guarantee-link">
            Learn about our peace of mind guarantee
          </button>
        </div>
      </div>
    </section>
  );
};

export default MobileRingPreviewWidget;
