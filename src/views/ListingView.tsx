'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ProductCard, { type Product } from '../components/ProductCard';
import Button from '../components/Button';
import { Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { supabase, dbProductToProduct } from '../lib/supabase';
import { isCategoryMatch, productMatchesSearchQuery } from '../lib/categoryUtils';
import './views.css';

// Mock inventory data removed - products fetch dynamically from database
export const INITIAL_PRODUCTS: Product[] = [];

interface ListingViewProps {
  initialFilters?: {
    shape?: string;
    style?: string;
    category?: string;
    search?: string;
  };
  onProductSelect: (product: Product) => void;
  pageTitle?: string;
  pageSubtitle?: string;
}

export const ListingView: React.FC<ListingViewProps> = ({ initialFilters, onProductSelect, pageTitle, pageSubtitle }) => {
  const [loading, setLoading] = useState(false);
  const [dbLoading, setDbLoading] = useState(true);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState('score-desc');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filter States
  const [selectedShape, setSelectedShape] = useState<string | null>(initialFilters?.shape || null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(initialFilters?.style || null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialFilters?.category || null);
  const [searchQuery, setSearchQuery] = useState<string | null>(initialFilters?.search || null);
  const [maxCarat, setMaxCarat] = useState<number>(5.0);
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [selectedCut, setSelectedCut] = useState<string[]>([]);
  const [isVerifiedOnly, setIsVerifiedOnly] = useState<boolean>(false);

  // Fetch products from database
  useEffect(() => {
    const fetchDbProducts = async () => {
      setDbLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          setProductsList(data.map(dbProductToProduct));
        } else {
          setProductsList([]);
        }
      } catch {
        setProductsList([]);
      }
      setDbLoading(false);
    };
    fetchDbProducts();
  }, []);

  // Sync initial filters when they change
  useEffect(() => {
    setSelectedShape(initialFilters?.shape || null);
    setSelectedStyle(initialFilters?.style || null);
    setSelectedCategory(initialFilters?.category || null);
    setSearchQuery(initialFilters?.search || null);
  }, [initialFilters]);

  // Simulate network loading state when filters change
  const triggerLoading = () => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  };

  // Trigger loading on filter changes
  useEffect(() => {
    triggerLoading();
  }, [selectedShape, selectedStyle, maxCarat, maxPrice, selectedCut, isVerifiedOnly, sortOption, searchQuery]);

  const toggleCut = (cut: string) => {
    setSelectedCut(prev => 
      prev.includes(cut) ? prev.filter(c => c !== cut) : [...prev, cut]
    );
  };

  const resetFilters = () => {
    setSelectedShape(null);
    setSelectedStyle(null);
    setSearchQuery(null);
    setMaxCarat(5.0);
    setMaxPrice(15000);
    setSelectedCut([]);
    setIsVerifiedOnly(false);
    setSortOption('score-desc');
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    if (searchQuery) {
      result = result.filter(p => productMatchesSearchQuery(p, searchQuery));
    }

    // Category-level filtering (for dedicated pages)
    if (selectedCategory) {
      const catLower = selectedCategory.toLowerCase();
      if (catLower === 'gifts') {
        // Show a curated mix: verified products across all categories
        result = result.filter(p => p.isVerified);
      } else {
        result = result.filter(p => isCategoryMatch(p.category, selectedCategory));
      }
    }

    if (selectedShape) {
      result = result.filter(p => p.shape.toLowerCase() === selectedShape.toLowerCase());
    }
    if (selectedStyle) {
      const styleLower = selectedStyle.toLowerCase();
      if (styleLower === 'earrings') {
        result = result.filter(p => p.category?.toLowerCase() === 'earrings');
      } else if (styleLower === 'necklace' || styleLower === 'necklaces') {
        result = result.filter(p => p.category?.toLowerCase() === 'necklace');
      } else if (styleLower === 'bracelet' || styleLower === 'bracelets') {
        result = result.filter(p => p.category?.toLowerCase() === 'bracelet');
      } else if (styleLower === 'wedding') {
        result = result.filter(p => p.category?.toLowerCase() === 'wedding band');
      } else if (styleLower === 'mens') {
        result = result.filter(p => p.style?.toLowerCase() === 'mens' || p.name.toLowerCase().includes('men') || p.category?.toLowerCase() === 'wedding band');
      } else if (styleLower === 'eternity') {
        result = result.filter(p => p.style?.toLowerCase() === 'eternity' || p.name.toLowerCase().includes('eternity'));
      } else if (styleLower === 'stackable') {
        result = result.filter(p => p.style?.toLowerCase() === 'stackable' || p.name.toLowerCase().includes('stackable'));
      } else if (styleLower === 'lab') {
        result = result.filter(p => p.style?.toLowerCase() === 'lab' || p.name.toLowerCase().includes('lab') || p.name.toLowerCase().includes('created'));
      } else if (styleLower === 'natural') {
        result = result.filter(p => !p.name.toLowerCase().includes('lab') && !p.name.toLowerCase().includes('created'));
      } else if (styleLower === 'solitaire') {
        result = result.filter(p => p.style?.toLowerCase() === 'solitaire' || p.name.toLowerCase().includes('solitaire'));
      } else if (styleLower === 'halo') {
        result = result.filter(p => p.style?.toLowerCase() === 'halo' || (p.name.toLowerCase().includes('halo') && !p.name.toLowerCase().includes('hidden')));
      } else if (styleLower === 'hidden halo' || styleLower === 'hidden-halo') {
        result = result.filter(p => p.style?.toLowerCase() === 'hidden halo' || p.name.toLowerCase().includes('hidden halo'));
      } else if (styleLower === 'three-stone' || styleLower === 'three stone') {
        result = result.filter(p => p.style?.toLowerCase() === 'three-stone' || p.name.toLowerCase().includes('three-stone') || p.name.toLowerCase().includes('three stone'));
      } else if (styleLower === 'hoop' || styleLower === 'hoops') {
        result = result.filter(p => p.style?.toLowerCase() === 'hoop' || p.name.toLowerCase().includes('hoop'));
      } else if (styleLower === 'stud' || styleLower === 'studs') {
        result = result.filter(p => p.style?.toLowerCase() === 'stud' || p.name.toLowerCase().includes('stud'));
      } else if (styleLower === 'pave') {
        result = result.filter(p => p.style?.toLowerCase() === 'pave' || p.name.toLowerCase().includes('pav\u00e9') || p.name.toLowerCase().includes('pave'));
      } else if (styleLower === 'christian' || styleLower === 'vintage') {
        result = result.filter(p => p.style?.toLowerCase() === 'christian' || p.name.toLowerCase().includes('christian') || p.name.toLowerCase().includes('vintage'));
      } else if (styleLower === '1carat') {
        result = result.filter(p => p.carat >= 0.90 && p.carat <= 1.15);
      } else if (styleLower === 'oval') {
        result = result.filter(p => p.shape.toLowerCase() === 'oval');
      } else if (styleLower === 'engagement') {
        result = result.filter(p => p.category?.toLowerCase() === 'ring' || p.name.toLowerCase().includes('ring'));
      } else if (styleLower === 'yellow-gold' || styleLower === 'yellow gold') {
        result = result.filter(p => p.name.toLowerCase().includes('yellow') || (p.name.toLowerCase().includes('gold') && !p.name.toLowerCase().includes('white') && !p.name.toLowerCase().includes('rose')));
      } else if (styleLower === 'white-gold' || styleLower === 'white gold') {
        result = result.filter(p => p.name.toLowerCase().includes('white') || p.name.toLowerCase().includes('platinum'));
      } else if (styleLower === 'rose-gold' || styleLower === 'rose gold') {
        result = result.filter(p => p.name.toLowerCase().includes('rose'));
      } else if (styleLower === 'platinum') {
        result = result.filter(p => p.name.toLowerCase().includes('platinum'));
      } else if (styleLower === 'silver') {
        result = result.filter(p => p.name.toLowerCase().includes('silver') || p.name.toLowerCase().includes('platinum') || p.name.toLowerCase().includes('white'));
      } else if (styleLower === 'vermeil') {
        result = result.filter(p => p.name.toLowerCase().includes('vermeil') || p.name.toLowerCase().includes('gold'));
      } else if (styleLower === 'tantalum') {
        result = result.filter(p => p.name.toLowerCase().includes('tantalum') || p.name.toLowerCase().includes('platinum'));
      } else if (styleLower === 'classic' || styleLower === 'classic bands') {
        result = result.filter(p => p.name.toLowerCase().includes('classic') || p.style?.toLowerCase() === 'solitaire');
      } else if (styleLower === 'curved' || styleLower === 'curved rings') {
        result = result.filter(p => p.name.toLowerCase().includes('curved') || p.name.toLowerCase().includes('eternity'));
      } else if (styleLower === 'anniversary' || styleLower === 'anniversary rings') {
        result = result.filter(p => p.name.toLowerCase().includes('anniversary') || p.name.toLowerCase().includes('eternity'));
      } else if (styleLower === 'mens-classic') {
        result = result.filter(p => p.name.toLowerCase().includes('men') && (p.name.toLowerCase().includes('classic') || p.style?.toLowerCase() === 'solitaire'));
      } else if (styleLower === 'mens-matte') {
        result = result.filter(p => p.name.toLowerCase().includes('men') && p.name.toLowerCase().includes('matte') || p.name.toLowerCase().includes('classic'));
      } else if (styleLower === 'mens-hammered') {
        result = result.filter(p => p.name.toLowerCase().includes('men') && p.name.toLowerCase().includes('hammered') || p.name.toLowerCase().includes('gold'));
      } else if (styleLower === 'mens-engraved') {
        result = result.filter(p => p.name.toLowerCase().includes('men') && p.name.toLowerCase().includes('engraved') || p.name.toLowerCase().includes('wedding'));
      } else if (styleLower === 'mens-platinum') {
        result = result.filter(p => p.name.toLowerCase().includes('men') && (p.name.toLowerCase().includes('platinum') || p.name.toLowerCase().includes('white')));
      } else if (styleLower === 'mens-yellow-gold') {
        result = result.filter(p => p.name.toLowerCase().includes('men') && p.name.toLowerCase().includes('gold'));
      } else if (styleLower === 'setting') {
        result = result.filter(p => p.category?.toLowerCase() === 'ring');
      } else if (styleLower === 'ready' || styleLower === 'ready-to-ship') {
        result = result.filter(p => p.isVerified);
      } else if (styleLower === 'gemstone') {
        result = result.filter(p => p.style?.toLowerCase() === 'moissanite' || p.name.toLowerCase().includes('moissanite') || p.name.toLowerCase().includes('gemstone'));
      } else if (styleLower === 'custom') {
        result = result.filter(p => p.name.toLowerCase().includes('custom') || p.category?.toLowerCase() === 'ring');
      } else if (styleLower === 'signature') {
        result = result.filter(p => p.isVerified);
      } else if (styleLower === 'best-sellers' || styleLower === 'best sellers' || styleLower === 'trending') {
        result = result.filter(p => p.isVerified || p.isNew);
      } else if (styleLower === 'luxe') {
        result = result.filter(p => p.price >= 5000);
      } else if (styleLower === 'under-250' || styleLower === 'under-500' || styleLower === 'under-1000') {
        const maxPriceCap = styleLower === 'under-250' ? 2000 : styleLower === 'under-500' ? 4000 : 6000;
        result = result.filter(p => p.price <= maxPriceCap);
      } else if (styleLower === 'graduation' || styleLower === 'birthday' || styleLower === 'anniversary-gifts') {
        result = result.filter(p => p.isVerified || p.isNew);
      } else if (styleLower === 'him') {
        result = result.filter(p => p.name.toLowerCase().includes('men') || p.style?.toLowerCase() === 'mens');
      } else if (styleLower === 'her') {
        result = result.filter(p => !p.name.toLowerCase().includes('men') && p.style?.toLowerCase() !== 'mens');
      } else if (styleLower === 'personalized') {
        result = result.filter(p => p.name.toLowerCase().includes('personalized') || p.name.toLowerCase().includes('initial') || p.category?.toLowerCase() === 'necklace');
      } else if (styleLower === 'quick-ship') {
        result = result.filter(p => p.isVerified);
      } else if (styleLower === 'promise') {
        result = result.filter(p => p.price < 3000 && p.category?.toLowerCase() === 'ring');
      } else if (styleLower === 'plain' || styleLower === 'plain metal') {
        result = result.filter(p => !p.name.toLowerCase().includes('diamond') && !p.name.toLowerCase().includes('brilliant'));
      } else if (styleLower === 'pendant' || styleLower === 'pendants') {
        result = result.filter(p => p.name.toLowerCase().includes('pendant') || p.category?.toLowerCase() === 'necklace');
      } else if (styleLower === 'pearl' || styleLower === 'pearls') {
        result = result.filter(p => p.name.toLowerCase().includes('pearl'));
      } else if (styleLower === 'chain' || styleLower === 'chains') {
        result = result.filter(p => p.name.toLowerCase().includes('chain') || p.name.toLowerCase().includes('choker'));
      } else if (styleLower === 'bangles' || styleLower === 'bangle') {
        result = result.filter(p => p.name.toLowerCase().includes('bangle') || p.category?.toLowerCase() === 'bracelet');
      }
    }

    result = result.filter(p => p.carat <= maxCarat);
    result = result.filter(p => p.price <= maxPrice);

    if (selectedCut.length > 0) {
      result = result.filter(p => selectedCut.includes(p.cut));
    }

    if (isVerifiedOnly) {
      result = result.filter(p => p.isVerified);
    }

    // Apply Sorting
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      result.sort((a, b) => (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0));
    }

    return result;
  }, [selectedShape, selectedStyle, selectedCategory, maxCarat, maxPrice, selectedCut, isVerifiedOnly, sortOption, searchQuery, productsList]);

  const shapes = ['Round', 'Oval', 'Cushion', 'Emerald', 'Princess', 'Radiant', 'Pear', 'Marquise', 'Asscher', 'Heart'];
  const cuts = ['Ideal', 'Excellent', 'Very Good'];

  return (
    <div className="listing-view">
      {/* Category Page Banner */}
      {pageTitle && (
        <div className="category-page-banner">
          <div className="container">
            <h1 className="category-page-title">{pageTitle}</h1>
            {pageSubtitle && <p className="category-page-subtitle">{pageSubtitle}</p>}
          </div>
        </div>
      )}
      {/* Sticky Filter Bar */}
      <div className="sticky-filter-bar">
        <div className="container filter-chips-row">
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-ink)', marginRight: '8px' }}>
            Shapes:
          </span>
          {shapes.map((shape) => (
            <button
              key={shape}
              className={`filter-chip ${selectedShape === shape ? 'active' : ''}`}
              onClick={() => setSelectedShape(selectedShape === shape ? null : shape)}
            >
              {shape}
            </button>
          ))}
          
          {selectedStyle && (
            <span className="active-filter-indicator">
              Category: {selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1)}
              <button 
                className="active-filter-remove" 
                onClick={() => setSelectedStyle(null)}
                style={{ marginLeft: '6px', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit', fontWeight: 'bold' }}
              >
                ×
              </button>
            </span>
          )}
          
          {(selectedShape || selectedStyle || maxCarat < 5.0 || maxPrice < 15000 || selectedCut.length > 0 || isVerifiedOnly) && (
            <button className="filter-chip" onClick={resetFilters} style={{ borderStyle: 'dashed', color: 'var(--color-teal)' }}>
              <RotateCcw size={12} /> Clear all
            </button>
          )}
        </div>
      </div>

      <div className="container">
        <div className="listing-layout">
          {/* Desktop Filter Sidebar / Mobile Collapsible Sidebar */}
          <aside className={`filter-sidebar ${showMobileFilters ? 'mobile-visible' : ''}`}>
            <h3 className="sidebar-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <SlidersHorizontal size={16} /> Filters
              </span>
            </h3>

            {/* Carat Filter */}
            <div className="sidebar-section">
              <div className="sidebar-section-title">
                <span>Max Carat Weight</span>
                <span className="sidebar-section-value">{maxCarat.toFixed(2)} ct</span>
              </div>
              <div className="range-container">
                <input 
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={maxCarat}
                  onChange={(e) => setMaxCarat(parseFloat(e.target.value))}
                  className="range-slider"
                />
                <div className="range-labels">
                  <span>0.5 ct</span>
                  <span>2.5 ct</span>
                </div>
              </div>
            </div>

            {/* Price Filter */}
            <div className="sidebar-section">
              <div className="sidebar-section-title">
                <span>Max Budget</span>
                <span className="sidebar-section-value">${maxPrice.toLocaleString()}</span>
              </div>
              <div className="range-container">
                <input 
                  type="range"
                  min="1000"
                  max="15000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="range-slider"
                />
                <div className="range-labels">
                  <span>$1,000</span>
                  <span>$15,000</span>
                </div>
              </div>
            </div>

            {/* Cut Quality Checkbox List */}
            <div className="sidebar-section">
              <div className="sidebar-section-title">Cut Quality</div>
              <div className="checkbox-list">
                {cuts.map((cut) => (
                  <label key={cut} className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={selectedCut.includes(cut)}
                      onChange={() => toggleCut(cut)}
                      className="checkbox-input"
                    />
                    {cut}
                  </label>
                ))}
              </div>
            </div>

            {/* Verified Cert Only Toggle */}
            <div className="sidebar-section" style={{ borderTop: '1px solid var(--color-border-soft)', paddingTop: '16px' }}>
              <label className="checkbox-label" style={{ fontWeight: '600' }}>
                <input 
                  type="checkbox"
                  checked={isVerifiedOnly}
                  onChange={() => setIsVerifiedOnly(!isVerifiedOnly)}
                  className="checkbox-input"
                />
                Premium Quality Only
              </label>
            </div>
          </aside>

          {/* Results Area */}
          <main className="results-content">
            <div className="results-header">
              <div className="results-count">
                {loading ? 'Searching...' : `${filteredProducts.length} items found`}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button 
                  className="mobile-filter-toggle-btn"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                  <SlidersHorizontal size={14} />
                  {showMobileFilters ? 'Hide Filters' : 'Filters'}
                </button>
                <span className="caption-text font-medium-mobile" style={{ fontWeight: '500' }}>Sort by:</span>
                <select 
                  className="sort-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="score-desc">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Main Listing View Grid */}
            {loading ? (
              <div className="results-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="skeleton-card">
                    <div className="skeleton-image skeleton-pulse" />
                    <div className="skeleton-body">
                      <div className="skeleton-line skeleton-line-title skeleton-pulse" />
                      <div className="skeleton-line skeleton-line-price skeleton-pulse" style={{ marginTop: 'auto' }} />
                      <div className="skeleton-line skeleton-line-meta skeleton-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="results-grid">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onSelect={onProductSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-cart-state" style={{ backgroundColor: 'var(--color-card)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <Filter size={40} style={{ color: 'var(--color-slate-muted)' }} />
                <h3 className="h3-text">No matches found</h3>
                <p className="body-text" style={{ maxWidth: '320px' }}>
                  Try loosening your filter metrics (e.g. higher price, wider carat weights).
                </p>
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Reset All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
export default ListingView;
