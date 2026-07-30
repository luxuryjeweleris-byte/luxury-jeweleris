import React, { useState, useEffect, useMemo } from 'react';
import Ring360Viewer from '../components/Ring360Viewer';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { ArrowLeft, Sparkles, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard, { type Product, getAvailableMetals } from '../components/ProductCard';
import './views.css';

interface DetailViewProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, config: { metal: string; size: string }) => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ product, onBack, onAddToCart }) => {
  const availableMetals = useMemo(() => getAvailableMetals(product), [product]);

  const [metal, setMetal] = useState<'gold' | 'platinum' | 'rose' | 'silver' | 'white'>(() => {
    return (availableMetals[0]?.key as any) || 'gold';
  });

  useEffect(() => {
    if (availableMetals.length > 0 && !availableMetals.some(m => m.key === metal)) {
      setMetal(availableMetals[0].key as any);
    }
  }, [availableMetals, metal]);

  const [selectedSize, setSelectedSize] = useState('6');
  const [activeTab, setActiveTab] = useState<'image' | '360'>('image');

  const sizes = ['5', '6', '7', '8', '9'];

  // Retrieve ONLY the images for the currently selected metal color (max 5 photos per metal)
  const activeMetalImages = useMemo(() => {
    let list: string[] = [];
    if (metal === 'gold') {
      list = (product.imagesYellowGold && product.imagesYellowGold.length > 0)
        ? product.imagesYellowGold
        : (product.imageYellowGold ? [product.imageYellowGold] : []);
    } else if (metal === 'rose') {
      list = (product.imagesRoseGold && product.imagesRoseGold.length > 0)
        ? product.imagesRoseGold
        : (product.imageRoseGold ? [product.imageRoseGold] : []);
    } else if (metal === 'platinum') {
      list = (product.imagesPlatinum && product.imagesPlatinum.length > 0)
        ? product.imagesPlatinum
        : (product.imagePlatinum ? [product.imagePlatinum] : []);
    } else if (metal === 'silver') {
      list = (product.imagesSilver && product.imagesSilver.length > 0)
        ? product.imagesSilver
        : (product.imageSilver ? [product.imageSilver] : []);
    } else {
      // White Gold / Default
      list = (product.imagesWhiteGold && product.imagesWhiteGold.length > 0)
        ? product.imagesWhiteGold
        : (product.image ? [product.image] : []);
    }
    // Fallback to default product image if list is empty
    if (list.length === 0 && product.image) {
      list = [product.image];
    }
    return list.slice(0, 5);
  }, [metal, product]);

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0, xPercent: 50, yPercent: 50 });

  const LENS_SIZE = 140; // width & height of translucent lens box in px

  const handleMouseMoveImage = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const lensX = Math.max(0, Math.min(rect.width - LENS_SIZE, mouseX - LENS_SIZE / 2));
    const lensY = Math.max(0, Math.min(rect.height - LENS_SIZE, mouseY - LENS_SIZE / 2));

    const xPercent = Math.max(0, Math.min(100, (mouseX / rect.width) * 100));
    const yPercent = Math.max(0, Math.min(100, (mouseY / rect.height) * 100));

    setLensPos({ x: lensX, y: lensY, xPercent, yPercent });
  };

  // Reset selected image index when metal changes
  useEffect(() => {
    setSelectedImgIndex(0);
  }, [metal]);

  const currentDisplayedImage = activeMetalImages[selectedImgIndex] || activeMetalImages[0] || (
    metal === 'gold' && product.imageYellowGold ? product.imageYellowGold :
    metal === 'rose' && product.imageRoseGold ? product.imageRoseGold :
    metal === 'platinum' && product.imagePlatinum ? product.imagePlatinum :
    metal === 'silver' && product.imageSilver ? product.imageSilver :
    product.image
  );

  const handleNextImg = () => {
    if (activeTab === '360') {
      setActiveTab('image');
      setSelectedImgIndex(0);
    } else {
      setSelectedImgIndex((prev) => (prev + 1) % activeMetalImages.length);
    }
  };

  const handlePrevImg = () => {
    if (activeTab === '360') {
      setActiveTab('image');
      setSelectedImgIndex(activeMetalImages.length - 1);
    } else {
      setSelectedImgIndex((prev) => (prev - 1 + activeMetalImages.length) % activeMetalImages.length);
    }
  };

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
              {/* Overlay Badge */}
              <div className="gallery-badge">
                <Sparkles size={13} style={{ color: 'var(--color-teal)' }} />
                <span>
                  {activeTab === 'image' 
                    ? `Studio Visualizer (${selectedImgIndex + 1}/${activeMetalImages.length})` 
                    : (product.url360 ? 'Interactive 3D WebGL Model' : product.images360 && product.images360.length > 0 ? `360° Photo Spin (${product.images360.length} Angles)` : '360° Interactive 3D')}
                </span>
              </div>

              {/* Navigation Arrows for 2D images */}
              {activeMetalImages.length > 1 && (
                <>
                  <button className="gallery-nav-btn prev" onClick={handlePrevImg} title="Previous View">
                    <ChevronLeft size={20} />
                  </button>
                  <button className="gallery-nav-btn next" onClick={handleNextImg} title="Next View">
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Main Image or 360 Viewer */}
              {activeTab === 'image' ? (
                <div 
                  onMouseEnter={() => setIsHoveringImage(true)}
                  onMouseLeave={() => setIsHoveringImage(false)}
                  onMouseMove={handleMouseMoveImage}
                  style={{ 
                    width: '100%', 
                    height: '420px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'crosshair',
                    position: 'relative'
                  }}
                >
                  <img 
                    src={currentDisplayedImage} 
                    alt={product.name} 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'contain',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} 
                  />

                  {/* Translucent Hover Magnifier Lens Overlay Box */}
                  {isHoveringImage && (
                    <div 
                      className="gallery-lens"
                      style={{
                        left: `${lensPos.x}px`,
                        top: `${lensPos.y}px`,
                        width: `${LENS_SIZE}px`,
                        height: `${LENS_SIZE}px`,
                      }}
                    />
                  )}
                </div>
              ) : (
                <Ring360Viewer 
                  images360={product.images360}
                  url360={product.url360}
                  autoplay={false} 
                  interactive={true} 
                  metalColor={metal === 'white' ? 'platinum' : metal} 
                  caratSize={product.carat}
                  width={420} 
                  height={420} 
                />
              )}
            </div>

            {/* Side Magnifier Popout Panel (Placed in detail-gallery so it isn't clipped) */}
            {isHoveringImage && activeTab === 'image' && (
              <div className="detail-zoom-popout">
                <div className="detail-zoom-badge">
                  <span>3.0X ULTRA-HD LOUPE ZOOM</span>
                </div>
                <div 
                  className="detail-zoom-canvas"
                  style={{
                    backgroundImage: `url(${currentDisplayedImage})`,
                    backgroundPosition: `${lensPos.xPercent}% ${lensPos.yPercent}%`,
                    backgroundSize: '280% 280%',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              </div>
            )}

            {/* Gallery Thumbnails */}
            <div className="detail-thumbs-container">
              <div className="detail-thumbs-label">
                <span>Select View Angle</span>
                <span style={{ fontSize: '10px', textTransform: 'none', color: '#94a3b8' }}>
                  {activeMetalImages.length} Photos + 3D Model
                </span>
              </div>

              <div className="detail-thumbs">
                {activeMetalImages.map((imgSrc, idx) => {
                  const isActive = activeTab === 'image' && selectedImgIndex === idx;
                  return (
                    <button 
                      key={idx}
                      className={`detail-thumb-card ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab('image');
                        setSelectedImgIndex(idx);
                      }}
                      title={`View Angle ${idx + 1}`}
                    >
                      <img 
                        src={imgSrc} 
                        alt={`Angle ${idx + 1}`} 
                        className="detail-thumb-img" 
                      />
                      {isActive && <div className="thumb-active-indicator" />}
                    </button>
                  );
                })}

                <button 
                  className={`detail-thumb-360 ${activeTab === '360' ? 'active' : ''}`}
                  onClick={() => setActiveTab('360')}
                  title="360° Interactive 3D Ring Viewer"
                >
                  <RotateCcw size={18} className="detail-thumb-360-icon" />
                  <span className="detail-thumb-360-text">
                    {product.url360 ? '3D WebGL' : product.images360 && product.images360.length > 0 ? '360° Photos' : '360° View'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Buying Config and Details */}
          <div className="detail-info">
            <div className="detail-header">
              <div className="detail-badges">
                {product.isVerified && <Badge type="verified">✓ Premium Quality</Badge>}
                {product.isNew && <Badge type="featured">New Arrival</Badge>}
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

            {/* Config: Metal Color (Render ONLY metals with uploaded photos in Admin) */}
            {availableMetals.length > 0 && (
              <div className="config-group">
                <div className="config-label">
                  Select Metal: <span style={{ color: 'var(--color-ink)', fontWeight: 'bold', textTransform: 'capitalize' }}>
                    {availableMetals.find(m => m.key === metal)?.label || 'Yellow Gold'}
                  </span>
                </div>
                <div className="config-options" style={{ gap: '12px' }}>
                  {availableMetals.map((m) => (
                    <button 
                      key={m.key}
                      className={`metal-circle ${metal === m.key ? 'active' : ''}`}
                      style={{ backgroundColor: m.color }}
                      onClick={() => setMetal(m.key as any)}
                      title={m.label}
                    />
                  ))}
                </div>
              </div>
            )}

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
              <div className="config-label">Gemstone Details & Certifications</div>
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
