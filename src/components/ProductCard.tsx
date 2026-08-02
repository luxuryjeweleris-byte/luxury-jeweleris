'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './components.css';

export interface Product {
  id: string;
  name: string;
  price: number;
  compPrice: number;
  image: string;
  imageYellowGold?: string;
  imageRoseGold?: string;
  imagePlatinum?: string;
  imageSilver?: string;
  imagesWhiteGold?: string[];
  imagesYellowGold?: string[];
  imagesRoseGold?: string[];
  imagesPlatinum?: string[];
  imagesSilver?: string[];
  shape: string;
  carat: number;
  color: string;
  cut: string;
  isVerified: boolean;
  isNew: boolean;
  savePct?: number;
  category?: string;
  style?: string;
  images360?: string[];
  url360?: string;
  config360?: any;
  videoUrl?: string;
}

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

// Info Icon SVG
const InfoIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="card-info-icon">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

// Delivery Truck SVG
const TruckIcon = () => (
  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '2px' }}>
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

export interface MetalOption {
  key: 'gold' | 'platinum' | 'rose' | 'silver' | 'white';
  label: string;
  color: string;
}

export function getAvailableMetals(product: Product): MetalOption[] {
  const options: MetalOption[] = [];

  const hasGold = Boolean(
    product.imageYellowGold || 
    (product.imagesYellowGold && product.imagesYellowGold.length > 0)
  );
  const hasRose = Boolean(
    product.imageRoseGold || 
    (product.imagesRoseGold && product.imagesRoseGold.length > 0)
  );
  const hasPlatinum = Boolean(
    product.imagePlatinum || 
    (product.imagesPlatinum && product.imagesPlatinum.length > 0)
  );
  const hasSilver = Boolean(
    product.imageSilver || 
    (product.imagesSilver && product.imagesSilver.length > 0)
  );
  const hasWhiteGold = Boolean(
    product.imagesWhiteGold && product.imagesWhiteGold.length > 0
  );

  // Add metals that have specific images uploaded by Admin
  if (hasGold) {
    options.push({ key: 'gold', label: 'Yellow Gold', color: '#E2C379' });
  }
  if (hasPlatinum) {
    options.push({ key: 'platinum', label: 'Platinum', color: '#C8CDD0' });
  }
  if (hasRose) {
    options.push({ key: 'rose', label: 'Rose Gold', color: '#D99F8D' });
  }
  if (hasSilver) {
    options.push({ key: 'silver', label: 'Silver', color: '#D2D7DF' });
  }
  if (hasWhiteGold) {
    options.push({ key: 'white', label: 'White Gold', color: '#E2E7EB' });
  }

  // Fallback: If no specific metal variant images were uploaded by admin (only main product.image exists)
  if (options.length === 0 && product.image) {
    const titleLower = product.name.toLowerCase();
    if (titleLower.includes('rose')) {
      options.push({ key: 'rose', label: 'Rose Gold', color: '#D99F8D' });
    } else if (titleLower.includes('platinum')) {
      options.push({ key: 'platinum', label: 'Platinum', color: '#C8CDD0' });
    } else if (titleLower.includes('silver')) {
      options.push({ key: 'silver', label: 'Silver', color: '#D2D7DF' });
    } else if (titleLower.includes('gold')) {
      options.push({ key: 'gold', label: 'Yellow Gold', color: '#E2C379' });
    } else {
      options.push({ key: 'gold', label: 'Yellow Gold', color: '#E2C379' });
    }
  }

  return options;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  // Favorite state
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Calculate available metals with uploaded images
  const availableMetals = React.useMemo(() => getAvailableMetals(product), [product]);

  // Metal selection state: default to first available metal
  const [selectedMetal, setSelectedMetal] = useState<string>(() => {
    return availableMetals[0]?.key || 'gold';
  });

  useEffect(() => {
    if (availableMetals.length > 0 && !availableMetals.some(m => m.key === selectedMetal)) {
      setSelectedMetal(availableMetals[0].key);
    }
  }, [availableMetals, selectedMetal]);

  // Check if product is favorited on load
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const { data } = await supabase
          .from('wishlist')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('product_id', product.id)
          .maybeSingle();
        
        if (data) {
          setIsFav(true);
        }
      } catch (err) {
        console.error('Failed to check favorite status:', err);
      }
    };
    checkFavorite();
  }, [product.id]);

  const handleFavClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favLoading) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/login';
        return;
      }

      setFavLoading(true);
      if (isFav) {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', session.user.id)
          .eq('product_id', product.id);
        
        if (!error) {
          setIsFav(false);
        }
      } else {
        const { error } = await supabase
          .from('wishlist')
          .insert({
            user_id: session.user.id,
            product_id: product.id
          });
        
        if (!error) {
          setIsFav(true);
        }
      }
    } catch (err) {
      console.error('Failed to update favorite status:', err);
    } finally {
      setFavLoading(false);
    }
  };

  const selectMetal = (metalKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMetal(metalKey);
  };

  // Metal label mapping
  const getMetalLabel = () => {
    const match = availableMetals.find(m => m.key === selectedMetal);
    return match ? match.label : 'Yellow Gold';
  };

  // Feature badge text helper
  const getFeatureBadge = () => {
    if (product.name.toLowerCase().includes('halo')) {
      return (
        <span className="card-feature-badge">
          Hidden Halo <TruckIcon />
        </span>
      );
    }
    if (product.isVerified) {
      return <span className="card-feature-badge">Color+</span>;
    }
    return null;
  };

  return (
    <div className="prod-card" onClick={() => onSelect(product)} style={{ cursor: 'pointer' }}>
      {/* Top Image Container */}
      <div className="prod-card-img-container">
        {/* Red Sale Tag */}
        {product.compPrice > product.price && (
          <span className="card-sale-tag">
            {product.savePct ? `${product.savePct}% OFF` : `SAVE $${(product.compPrice - product.price).toLocaleString()}`}
          </span>
        )}
        
        {/* Favorite hollow/filled heart */}
        <button 
          className={`card-fav-btn ${isFav ? 'active' : ''}`}
          onClick={handleFavClick}
          disabled={favLoading}
          aria-label="Add to favorites"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill={isFav ? '#C23636' : 'none'} stroke={isFav ? '#C23636' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Product Image */}
        <img
          src={
            selectedMetal === 'gold' && product.imageYellowGold ? product.imageYellowGold :
            selectedMetal === 'rose' && product.imageRoseGold ? product.imageRoseGold :
            selectedMetal === 'platinum' && product.imagePlatinum ? product.imagePlatinum :
            selectedMetal === 'silver' && product.imageSilver ? product.imageSilver :
            product.image
          }
          alt={product.name}
          className="prod-card-img"
          loading="lazy"
        />

        {/* Feature badge bottom-left */}
        {getFeatureBadge()}
      </div>

      {/* Info Details below image */}
      <div className="prod-card-info">
        {/* Metal Selector Dots (Only render if admin has added photos for multiple metals) */}
        {availableMetals.length > 1 && (
          <div className="card-metal-selector-row">
            {availableMetals.map((m) => (
              <span 
                key={m.key}
                className={`card-metal-dot ${selectedMetal === m.key ? 'active' : ''}`}
                style={{ backgroundColor: m.color }}
                onClick={(e) => selectMetal(m.key, e)}
                title={m.label}
              />
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="prod-card-title">{product.name}</h3>

        {/* Selected Metal label description */}
        <span className="card-metal-desc">{getMetalLabel()}</span>

        {/* Price Row */}
        <div className="prod-card-price-row">
          <span className="prod-card-price">${product.price.toLocaleString()}</span>
          <span className="card-comp-row">
            Comp. value: ${product.compPrice.toLocaleString()} <InfoIcon />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
