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
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  aiScore: number;
  isVerified: boolean;
  isNew: boolean;
  savePct?: number;
  category?: string;
  style?: string;
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

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  // Favorite state
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

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
        // Redirect to login if not authenticated
        window.location.href = '/login';
        return;
      }

      setFavLoading(true);
      if (isFav) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', session.user.id)
          .eq('product_id', product.id);
        
        if (!error) {
          setIsFav(false);
        }
      } else {
        // Add to wishlist
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

  // Metal selection state: default based on name, otherwise default to white gold
  const initialMetal = product.name.toLowerCase().includes('platinum') ? 'platinum' :
                       product.name.toLowerCase().includes('gold') ? 'gold' : 'white';
  const [selectedMetal, setSelectedMetal] = useState<'white' | 'gold' | 'rose' | 'platinum'>(initialMetal);

  const selectMetal = (metal: 'white' | 'gold' | 'rose' | 'platinum', e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMetal(metal);
  };

  // Metal label mapping
  const getMetalLabel = () => {
    switch (selectedMetal) {
      case 'white': return '14K White Gold';
      case 'gold': return '14K Yellow Gold';
      case 'rose': return '14K Rose Gold';
      case 'platinum': return 'Platinum';
    }
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
        <span className="card-sale-tag">4th of July Sale</span>
        
        {/* Favorite hollow/filled heart */}
        <button 
          className={`card-fav-btn ${isFav ? 'active' : ''}`}
          onClick={handleFavClick}
          aria-label="Add to favorites"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill={isFav ? '#C23636' : 'none'} stroke={isFav ? '#C23636' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="prod-card-img"
          loading="lazy"
        />

        {/* Feature badge bottom-left */}
        {getFeatureBadge()}
      </div>

      {/* Info Details below image */}
      <div className="prod-card-info">
        {/* Metal Selector Dots */}
        <div className="card-metal-selector-row">
          <span 
            className={`card-metal-dot ${selectedMetal === 'white' ? 'active' : ''}`}
            style={{ backgroundColor: '#E2E7EB' }}
            onClick={(e) => selectMetal('white', e)}
            title="White Gold"
          />
          <span 
            className={`card-metal-dot ${selectedMetal === 'gold' ? 'active' : ''}`}
            style={{ backgroundColor: '#E2C379' }}
            onClick={(e) => selectMetal('gold', e)}
            title="Yellow Gold"
          />
          <span 
            className={`card-metal-dot ${selectedMetal === 'rose' ? 'active' : ''}`}
            style={{ backgroundColor: '#D99F8D' }}
            onClick={(e) => selectMetal('rose', e)}
            title="Rose Gold"
          />
          <span 
            className={`card-metal-dot ${selectedMetal === 'platinum' ? 'active' : ''}`}
            style={{ backgroundColor: '#C8CDD0' }}
            onClick={(e) => selectMetal('platinum', e)}
            title="Platinum"
          />
        </div>

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
