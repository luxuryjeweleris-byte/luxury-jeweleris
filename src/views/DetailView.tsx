import React, { useState, useEffect, useMemo } from 'react';
import Ring360Viewer from '../components/Ring360Viewer';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { ArrowLeft, Sparkles, RotateCcw, ChevronLeft, ChevronRight, Video } from 'lucide-react';
import ProductCard, { type Product, getAvailableMetals } from '../components/ProductCard';
import { supabase, dbProductToProduct } from '../lib/supabase';
import { INITIAL_PRODUCTS } from './ListingView';
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

  const [selectedSize, setSelectedSize] = useState('');
  const [sizeError, setSizeError] = useState(false);
  const [activeTab, setActiveTab] = useState<'image' | '360' | 'video'>('image');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        let query = supabase.from('products').select('*').eq('is_active', true);
        if (product.category) {
          query = query.eq('category', product.category);
        }
        const { data, error } = await query.neq('id', product.id).limit(3);

        if (!error && data) {
          setRelatedProducts(data.map(dbProductToProduct));
        } else {
          setRelatedProducts([]);
        }
      } catch {
        setRelatedProducts([]);
      }
    };
    fetchRelated();
  }, [product.id, product.category, product.shape]);

  const [viewerSize, setViewerSize] = useState<'sm' | 'md' | 'lg' | 'xl'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('luxury_viewer_card_size');
      if (saved && ['sm', 'md', 'lg', 'xl'].includes(saved)) {
        return saved as any;
      }
    }
    return 'md';
  });

  const cardHeightMap = {
    sm: 360,
    md: 460,
    lg: 550,
    xl: 650,
  };

  const currentCardHeight = cardHeightMap[viewerSize] || 460;

  const handleViewerSizeChange = (size: 'sm' | 'md' | 'lg' | 'xl') => {
    setViewerSize(size);
    if (typeof window !== 'undefined') {
      localStorage.setItem('luxury_viewer_card_size', size);
    }
  };

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
  const containerRectRef = React.useRef<DOMRect | null>(null);
  const rafIdRef = React.useRef<number | null>(null);

  const LENS_SIZE = 140; // width & height of translucent lens box in px

  const handleMouseEnterImage = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHoveringImage(true);
    containerRectRef.current = e.currentTarget.getBoundingClientRect();
  };

  const handleMouseLeaveImage = () => {
    setIsHoveringImage(false);
    containerRectRef.current = null;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  const handleMouseMoveImage = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRectRef.current) {
      containerRectRef.current = e.currentTarget.getBoundingClientRect();
    }
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafIdRef.current) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const rect = containerRectRef.current;
      if (!rect) return;

      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;

      const lensX = Math.max(0, Math.min(rect.width - LENS_SIZE, mouseX - LENS_SIZE / 2));
      const lensY = Math.max(0, Math.min(rect.height - LENS_SIZE, mouseY - LENS_SIZE / 2));

      const xPercent = Math.max(0, Math.min(100, (mouseX / rect.width) * 100));
      const yPercent = Math.max(0, Math.min(100, (mouseY / rect.height) * 100));

      setLensPos({ x: lensX, y: lensY, xPercent, yPercent });
    });
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
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
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
                  onMouseEnter={handleMouseEnterImage}
                  onMouseLeave={handleMouseLeaveImage}
                  onMouseMove={handleMouseMoveImage}
                  style={{ 
                    width: '100%', 
                    height: `${currentCardHeight}px`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'crosshair',
                    position: 'relative',
                    transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {currentDisplayedImage ? (
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
                  ) : null}

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
              ) : activeTab === 'video' ? (
                <div 
                  style={{ 
                    width: '100%', 
                    height: `${currentCardHeight}px`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: 'transparent', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    position: 'relative',
                    transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
                  }}
                >
                  <video
                    src={product.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      background: 'transparent',
                      display: 'block',
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              ) : (
                <Ring360Viewer 
                  config360={product.config360}
                  images360={product.images360}
                  url360={product.url360}
                  autoplay={true} 
                  interactive={true} 
                  metalColor={metal === 'white' ? 'platinum' : metal} 
                  caratSize={product.carat}
                  width={currentCardHeight} 
                  height={currentCardHeight} 
                  showControls={true}
                  showJsonTester={false}
                  cardSizePreset={viewerSize}
                  onCardSizeChange={handleViewerSizeChange}
                />
              )}
            </div>

            {/* Side Magnifier Popout Panel (Placed in detail-gallery so it isn't clipped) */}
            {isHoveringImage && activeTab === 'image' && (
              <div className="detail-zoom-popout" style={{ height: `${Math.min(currentCardHeight, 520)}px` }}>
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
                <div className="viewer-size-toolbar">
                  <span className="size-label-text">Card Size:</span>
                  {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                    <button
                      key={sz}
                      className={`viewer-size-pill ${viewerSize === sz ? 'active' : ''}`}
                      onClick={() => handleViewerSizeChange(sz)}
                      title={`Card size ${sz.toUpperCase()}: ${cardHeightMap[sz]}px`}
                    >
                      {sz.toUpperCase()}
                    </button>
                  ))}
                </div>
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
                      {imgSrc ? (
                        <img 
                          src={imgSrc} 
                          alt={`Angle ${idx + 1}`} 
                          className="detail-thumb-img" 
                        />
                      ) : null}
                      {isActive && <div className="thumb-active-indicator" />}
                    </button>
                  );
                })}

                {/* Cloudinary Product Video Tab Button */}
                {product.videoUrl && (
                  <button 
                    className={`detail-thumb-360 ${activeTab === 'video' ? 'active' : ''}`}
                    onClick={() => setActiveTab('video')}
                    title="Watch HD Product Video"
                    style={{ borderColor: activeTab === 'video' ? '#6366f1' : undefined }}
                  >
                    <Video size={18} className="detail-thumb-360-icon" style={{ color: '#6366f1' }} />
                    <span className="detail-thumb-360-text">
                      HD Video
                    </span>
                  </button>
                )}

                {/* 360° View Thumbnail Button (Only rendered if product has 360 media) */}
                {(product.config360 || (product.images360 && product.images360.length > 0) || product.url360) && (
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
                )}
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
            <div className={`config-group ${sizeError ? 'size-error-group' : ''}`}>
              <div className="config-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  Select Ring Size (US): {selectedSize ? (
                    <span style={{ color: 'var(--color-teal)', fontWeight: 'bold', marginLeft: '4px' }}>
                      Size {selectedSize}
                    </span>
                  ) : (
                    <span style={{ color: sizeError ? '#ef4444' : 'var(--color-slate-muted)', fontWeight: 'bold', marginLeft: '4px' }}>
                      *Required
                    </span>
                  )}
                </span>
                {sizeError && (
                  <span className="size-error-badge">
                    ⚠️ Please select a size
                  </span>
                )}
              </div>
              <div className="config-options">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`config-btn ${selectedSize === size ? 'active' : ''} ${sizeError ? 'pulse-border' : ''}`}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sizeError && (
                <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 600, textAlign: 'center', background: '#fef2f2', padding: '6px 12px', borderRadius: '8px', border: '1px solid #fca5a5' }}>
                  ⚠️ Please select a ring size above before adding to cart
                </div>
              )}
              <Button 
                variant="dark" 
                onClick={handleAddToCart} 
                style={{ 
                  width: '100%', 
                  height: '50px', 
                  fontSize: '15px',
                  border: sizeError ? '2px solid #ef4444' : undefined
                }}
              >
                {selectedSize ? `Add Size ${selectedSize} to cart` : 'Select Size & Add to Cart'}
              </Button>
            </div>
          </div>
        </div>

        {/* Category Matching Suggestions Section */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '56px', paddingTop: '36px', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--color-teal)', fontWeight: 700 }}>
                  Curated Suggestions
                </span>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '4px 0 0 0' }}>
                  Matching {product.category ? `${product.category}s` : 'Jewelry'} You May Like
                </h2>
              </div>
              {onBack && (
                <button
                  className="btn btn-ghost"
                  onClick={onBack}
                  style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}
                >
                  Explore All {product.category || 'Jewelry'} &rarr;
                </button>
              )}
            </div>

            <div className="featured-products-grid">
              {relatedProducts.map((relProd) => (
                <ProductCard
                  key={relProd.id}
                  product={relProd}
                  onSelect={(p) => {
                    if (typeof window !== 'undefined') {
                      window.location.href = `/shop/${p.id}`;
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default DetailView;
