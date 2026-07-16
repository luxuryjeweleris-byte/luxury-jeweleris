'use client';

import React, { useState } from 'react';
import Ring360Viewer from '../components/Ring360Viewer';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { ArrowLeft, Sparkles, ShieldCheck, Download } from 'lucide-react';
import type { Product } from '../components/ProductCard';
import './views.css';

interface DetailViewProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, config: { metal: string; size: string }) => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ product, onBack, onAddToCart }) => {
  const [metal, setMetal] = useState<'gold' | 'platinum' | 'rose'>('gold');
  const [selectedSize, setSelectedSize] = useState('6');
  const [activeTab, setActiveTab] = useState<'image' | '360' | 'cert'>('image');

  const sizes = ['5', '6', '7', '8', '9'];

  const handleAddToCart = () => {
    onAddToCart(product, { metal, size: selectedSize });
  };

  return (
    <div className="detail-view">
      <div className="container">
        {/* Back Button */}
        <div className="back-btn-container">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={16} /> Back to listing
          </button>
        </div>

        <div className="detail-grid">
          {/* Left Column: Interactive Product Visuals */}
          <div className="detail-gallery">
            <div className="detail-viewer-wrapper">
              {activeTab === 'image' ? (
                <div style={{ width: '100%', height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>
              ) : activeTab === '360' ? (
                <Ring360Viewer 
                  autoplay={false} 
                  interactive={true} 
                  metalColor={metal} 
                  caratSize={product.carat}
                  width={420} 
                  height={420} 
                />
              ) : (
                <div className="cert-panel-view" style={{ width: '100%', height: '420px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--color-border)', paddingBottom: '16px', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 'bold', color: 'var(--color-ink)' }}>Stone Quality Report</h4>
                        <span className="caption-text">Report Number: RC-2394012034</span>
                      </div>
                      <ShieldCheck size={36} style={{ color: 'var(--color-verified)' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <span className="label-text">Shape and Cutting Style</span>
                        <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--color-ink)', marginBottom: '8px' }}>{product.shape} Brilliant</div>

                        <span className="label-text">Carat Weight</span>
                        <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--color-ink)', marginBottom: '8px' }}>{product.carat} Carat</div>
                      </div>

                      <div>
                        <span className="label-text">Clarity Grade</span>
                        <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--color-ink)', marginBottom: '8px' }}>{product.clarity}</div>

                        <span className="label-text">Cut Grade</span>
                        <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--color-ink)', marginBottom: '8px' }}>{product.cut}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                    <Button variant="outline" size="sm" onClick={() => alert('Grading report downloaded successfully!')} style={{ flexGrow: 1 }}>
                      <Download size={14} /> Download PDF Report
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Selectors */}
            <div className="detail-thumbs">
              <button 
                className={`detail-thumb ${activeTab === 'image' ? 'active' : ''}`}
                onClick={() => setActiveTab('image')}
              >
                Product Image
              </button>
              <button 
                className={`detail-thumb ${activeTab === '360' ? 'active' : ''}`}
                onClick={() => setActiveTab('360')}
              >
                360° Ring
              </button>
              <button 
                className={`detail-thumb ${activeTab === 'cert' ? 'active' : ''}`}
                onClick={() => setActiveTab('cert')}
                style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
              >
                Quality Report
              </button>
            </div>
          </div>

          {/* Right Column: Buying Config and Details */}
          <div className="detail-info">
            <div className="detail-header">
              <div className="detail-badges">
                {product.isVerified && <Badge type="verified">✓ Premium Quality</Badge>}
                {product.isNew && <Badge type="featured">New Arrival</Badge>}
                <Badge type="ai">AI Quality Score {product.aiScore}</Badge>
              </div>
              <h1 className="h1-text detail-title">{product.name}</h1>
              <p className="body-sm-text" style={{ color: 'var(--color-slate-muted)' }}>
                Item Ref: RC-#{product.id.toUpperCase()}-2026 · Vetted Seller Partner
              </p>

              <div className="detail-price-box">
                <span className="detail-price">${product.price.toLocaleString()}</span>
                <span className="detail-comp">${product.compPrice.toLocaleString()}</span>
                <span className="badge badge-alert" style={{ fontSize: '11px' }}>
                  Save ${ (product.compPrice - product.price).toLocaleString() }
                </span>
              </div>
            </div>

            {/* AI Advisor Callout Box */}
            <div className="ai-insight-box">
              <Sparkles className="ai-icon" size={18} />
              <div>
                <h4 className="ai-insight-title">AI Stone Pricing Advisor</h4>
                <p className="ai-insight-text">
                  This listing is rated a <strong>"Great Deal"</strong>. It is priced 14% below standard retailer values for a {product.carat} ct {product.shape} shape, {product.clarity} clarity, and {product.cut} cut grade. Excellent light performance.
                </p>
              </div>
            </div>

            {/* Config: Metal Color */}
            <div className="config-group">
              <div className="config-label">
                Select Metal: <span style={{ color: 'var(--color-ink)', fontWeight: 'bold', textTransform: 'capitalize' }}>{metal === 'gold' ? '18K Yellow Gold' : metal === 'rose' ? '14K Rose Gold' : 'Platinum'}</span>
              </div>
              <div className="config-options" style={{ gap: '12px' }}>
                <button 
                  className={`metal-circle ${metal === 'gold' ? 'active' : ''}`}
                  style={{ backgroundColor: '#E9B646' }}
                  onClick={() => setMetal('gold')}
                  title="18K Yellow Gold"
                />
                <button 
                  className={`metal-circle ${metal === 'platinum' ? 'active' : ''}`}
                  style={{ backgroundColor: '#E5E9EC' }}
                  onClick={() => setMetal('platinum')}
                  title="Platinum"
                />
                <button 
                  className={`metal-circle ${metal === 'rose' ? 'active' : ''}`}
                  style={{ backgroundColor: '#E0A391' }}
                  onClick={() => setMetal('rose')}
                  title="14K Rose Gold"
                />
              </div>
            </div>

            {/* Config: Size */}
            <div className="config-group">
              <div className="config-label">Select Ring Size (US):</div>
              <div className="config-options">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`config-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    Size {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Specs Table */}
            <div className="config-group" style={{ marginTop: '16px' }}>
              <div className="config-label">Diamond Details & Certifications</div>
              <table className="specs-table">
                <tbody>
                  <tr>
                    <td>Carat Weight</td>
                    <td>{product.carat} ct</td>
                  </tr>
                  <tr>
                    <td>Shape</td>
                    <td>{product.shape}</td>
                  </tr>
                  <tr>
                    <td>Color Grade</td>
                    <td>{product.color} (Rare White)</td>
                  </tr>
                  <tr>
                    <td>Clarity</td>
                    <td>{product.clarity} (Very Slightly Included)</td>
                  </tr>
                  <tr>
                    <td>Cut Quality</td>
                    <td>{product.cut}</td>
                  </tr>
                  <tr>
                    <td>Fluorescence</td>
                    <td>None (Best)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* CTA Button */}
            <Button variant="dark" onClick={handleAddToCart} style={{ width: '100%', height: '50px', fontSize: '15px' }}>
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailView;
