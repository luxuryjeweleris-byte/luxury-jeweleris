'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ProductCard, { type Product } from '../components/ProductCard';
import Button from '../components/Button';
import { Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import './views.css';

// Mock inventory data
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'd1',
    name: '1.20 ct Oval Brilliant Cut Platinum Ring',
    price: 4200,
    compPrice: 5800,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
    shape: 'Oval',
    carat: 1.20,
    color: 'E',
    clarity: 'VVS2',
    cut: 'Excellent',
    aiScore: 9.4,
    isVerified: true,
    isNew: true,
    category: 'Ring',
    style: 'Pave'
  },
  {
    id: 'd2',
    name: '0.90 ct Round Classic Solitaire Ring',
    price: 2800,
    compPrice: 3900,
    image: 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?q=80&w=600&auto=format&fit=crop',
    shape: 'Round',
    carat: 0.90,
    color: 'F',
    clarity: 'VS1',
    cut: 'Ideal',
    aiScore: 9.1,
    isVerified: true,
    isNew: false,
    category: 'Ring',
    style: 'Solitaire'
  },
  {
    id: 'd3',
    name: '1.50 ct Cushion Cut Hidden Halo Ring',
    price: 6400,
    compPrice: 8900,
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop',
    shape: 'Cushion',
    carat: 1.50,
    color: 'D',
    clarity: 'VVS1',
    cut: 'Ideal',
    aiScore: 9.7,
    isVerified: true,
    isNew: true,
    category: 'Ring',
    style: 'Hidden Halo'
  },
  {
    id: 'd4',
    name: '2.10 ct Princess Cut Engagement Ring',
    price: 11200,
    compPrice: 15800,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop',
    shape: 'Princess',
    carat: 2.10,
    color: 'G',
    clarity: 'VS2',
    cut: 'Excellent',
    aiScore: 8.9,
    isVerified: false,
    isNew: false,
    category: 'Ring',
    style: 'Engagement'
  },
  {
    id: 'd5',
    name: '1.70 ct Emerald Cut Solitaire Platinum Ring',
    price: 8200,
    compPrice: 11500,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
    shape: 'Emerald',
    carat: 1.70,
    color: 'E',
    clarity: 'VS1',
    cut: 'Very Good',
    aiScore: 9.2,
    isVerified: false,
    isNew: false,
    category: 'Ring',
    style: 'Solitaire'
  },
  {
    id: 'd6',
    name: '1.05 ct Pear Shaped Pavé Moissanite Ring',
    price: 3950,
    compPrice: 5600,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
    shape: 'Pear',
    carat: 1.05,
    color: 'H',
    clarity: 'VVS2',
    cut: 'Excellent',
    aiScore: 9.5,
    isVerified: true,
    isNew: false,
    category: 'Ring',
    style: 'Pave'
  },
  {
    id: 'd7',
    name: '0.75 ct Cushion Cut Six-Prong Ring',
    price: 1900,
    compPrice: 2700,
    image: 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?q=80&w=600&auto=format&fit=crop',
    shape: 'Cushion',
    carat: 0.75,
    color: 'F',
    clarity: 'VS2',
    cut: 'Excellent',
    aiScore: 8.8,
    isVerified: false,
    isNew: false,
    category: 'Ring',
    style: 'Solitaire'
  },
  {
    id: 'd8',
    name: '1.80 ct Round Brilliant Cut Halo Ring',
    price: 9800,
    compPrice: 13900,
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop',
    shape: 'Round',
    carat: 1.80,
    color: 'D',
    clarity: 'VVS1',
    cut: 'Ideal',
    aiScore: 9.8,
    isVerified: true,
    isNew: true,
    category: 'Ring',
    style: 'Halo'
  },
  {
    id: 'd9',
    name: '2.30 ct Oval Cut Vintage Accent Ring',
    price: 14500,
    compPrice: 20200,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop',
    shape: 'Oval',
    carat: 2.30,
    color: 'E',
    clarity: 'VVS2',
    cut: 'Ideal',
    aiScore: 9.6,
    isVerified: true,
    isNew: false,
    category: 'Ring',
    style: 'Christian'
  },
  {
    id: 'd10',
    name: '1.10 ct Emerald Cut Hidden Halo Gold Ring',
    price: 4800,
    compPrice: 6700,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
    shape: 'Emerald',
    carat: 1.10,
    color: 'F',
    clarity: 'VS1',
    cut: 'Excellent',
    aiScore: 9.0,
    isVerified: true,
    isNew: false,
    category: 'Ring',
    style: 'Hidden Halo'
  },
  {
    id: 'd11',
    name: '0.60 ct Round Cut Pavé Accent Ring',
    price: 1650,
    compPrice: 2300,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
    shape: 'Round',
    carat: 0.60,
    color: 'G',
    clarity: 'VS2',
    cut: 'Very Good',
    aiScore: 8.6,
    isVerified: false,
    isNew: false,
    category: 'Ring',
    style: 'Pave'
  },
  {
    id: 'd12',
    name: '1.30 ct Princess Cut Halo Gold Ring',
    price: 5300,
    compPrice: 7400,
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop',
    shape: 'Princess',
    carat: 1.30,
    color: 'E',
    clarity: 'VVS1',
    cut: 'Excellent',
    aiScore: 9.3,
    isVerified: true,
    isNew: false,
    category: 'Ring',
    style: 'Halo'
  },
  {
    id: 'e1',
    name: '1.50 ct Round Brilliant Stud Earrings',
    price: 3200,
    compPrice: 4500,
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop',
    shape: 'Round',
    carat: 1.50,
    color: 'E',
    clarity: 'VVS2',
    cut: 'Ideal',
    aiScore: 9.5,
    isVerified: true,
    isNew: true,
    category: 'Earrings',
    style: 'Stud'
  },
  {
    id: 'e2',
    name: 'Huggie Hoop Earrings 14K Gold',
    price: 1250,
    compPrice: 1800,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop',
    shape: 'Round',
    carat: 0.80,
    color: 'F',
    clarity: 'VS1',
    cut: 'Excellent',
    aiScore: 9.0,
    isVerified: true,
    isNew: false,
    category: 'Earrings',
    style: 'Hoop'
  },
  {
    id: 'n1',
    name: '1.00 ct Solitaire Pendant Necklace',
    price: 2900,
    compPrice: 4100,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
    shape: 'Round',
    carat: 1.00,
    color: 'E',
    clarity: 'VVS1',
    cut: 'Ideal',
    aiScore: 9.6,
    isVerified: true,
    isNew: true,
    category: 'Necklace',
    style: 'Solitaire'
  },
  {
    id: 'n2',
    name: '18K Yellow Gold Multi-Stone Choker',
    price: 5400,
    compPrice: 7600,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop',
    shape: 'Round',
    carat: 2.20,
    color: 'F',
    clarity: 'VS2',
    cut: 'Excellent',
    aiScore: 9.1,
    isVerified: false,
    isNew: false,
    category: 'Necklace',
    style: 'Pave'
  },
  {
    id: 'b1',
    name: '4.50 ct Classic Tennis Bracelet',
    price: 7800,
    compPrice: 11000,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop',
    shape: 'Round',
    carat: 4.50,
    color: 'G',
    clarity: 'VS1',
    cut: 'Excellent',
    aiScore: 9.2,
    isVerified: true,
    isNew: false,
    category: 'Bracelet',
    style: 'Pave'
  },
  {
    id: 'w1',
    name: 'Classic Gold Men\'s Wedding Band',
    price: 950,
    compPrice: 1400,
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop',
    shape: 'Round',
    carat: 0.40,
    color: 'H',
    clarity: 'VS2',
    cut: 'Excellent',
    aiScore: 8.7,
    isVerified: false,
    isNew: false,
    category: 'Wedding Band',
    style: 'Mens'
  },
  {
    id: 'w2',
    name: 'Platinum Eternity Wedding Band',
    price: 4600,
    compPrice: 6500,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
    shape: 'Round',
    carat: 1.80,
    color: 'E',
    clarity: 'VVS2',
    cut: 'Ideal',
    aiScore: 9.4,
    isVerified: true,
    isNew: true,
    category: 'Wedding Band',
    style: 'Eternity'
  },
  {
    id: 'w3',
    name: 'Gold Stackable Eternity Band',
    price: 1100,
    compPrice: 1600,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
    shape: 'Round',
    carat: 0.50,
    color: 'F',
    clarity: 'VS1',
    cut: 'Excellent',
    aiScore: 8.9,
    isVerified: false,
    isNew: false,
    category: 'Wedding Band',
    style: 'Stackable'
  },
  {
    id: 'l1',
    name: '1.01 ct Oval Lab Created Loose Gemstone',
    price: 1800,
    compPrice: 2600,
    image: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=600&auto=format&fit=crop',
    shape: 'Oval',
    carat: 1.01,
    color: 'D',
    clarity: 'VVS1',
    cut: 'Ideal',
    aiScore: 9.8,
    isVerified: true,
    isNew: true,
    category: 'Loose Gemstone',
    style: 'Lab'
  },
  {
    id: 'l2',
    name: '1.50 ct Round Ideal Cut Lab Gemstone',
    price: 3100,
    compPrice: 4400,
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600&auto=format&fit=crop',
    shape: 'Round',
    carat: 1.50,
    color: 'E',
    clarity: 'VVS2',
    cut: 'Ideal',
    aiScore: 9.7,
    isVerified: true,
    isNew: false,
    category: 'Loose Gemstone',
    style: 'Lab'
  }
];

interface ListingViewProps {
  initialFilters?: {
    shape?: string;
    style?: string;
    category?: string;
  };
  onProductSelect: (product: Product) => void;
  pageTitle?: string;
  pageSubtitle?: string;
}

export const ListingView: React.FC<ListingViewProps> = ({ initialFilters, onProductSelect, pageTitle, pageSubtitle }) => {
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('score-desc');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filter States
  const [selectedShape, setSelectedShape] = useState<string | null>(initialFilters?.shape || null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(initialFilters?.style || null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialFilters?.category || null);
  const [maxCarat, setMaxCarat] = useState<number>(5.0);
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [selectedClarity, setSelectedClarity] = useState<string[]>([]);
  const [selectedCut, setSelectedCut] = useState<string[]>([]);
  const [isVerifiedOnly, setIsVerifiedOnly] = useState<boolean>(false);

  // Sync initial filters when they change
  useEffect(() => {
    setSelectedShape(initialFilters?.shape || null);
    setSelectedStyle(initialFilters?.style || null);
    setSelectedCategory(initialFilters?.category || null);
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
  }, [selectedShape, selectedStyle, maxCarat, maxPrice, selectedClarity, selectedCut, isVerifiedOnly, sortOption]);

  const toggleClarity = (clarity: string) => {
    setSelectedClarity(prev => 
      prev.includes(clarity) ? prev.filter(c => c !== clarity) : [...prev, clarity]
    );
  };

  const toggleCut = (cut: string) => {
    setSelectedCut(prev => 
      prev.includes(cut) ? prev.filter(c => c !== cut) : [...prev, cut]
    );
  };

  const resetFilters = () => {
    setSelectedShape(null);
    setSelectedStyle(null);
    setMaxCarat(5.0);
    setMaxPrice(15000);
    setSelectedClarity([]);
    setSelectedCut([]);
    setIsVerifiedOnly(false);
    setSortOption('score-desc');
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...INITIAL_PRODUCTS];

    // Category-level filtering (for dedicated pages)
    if (selectedCategory) {
      const catLower = selectedCategory.toLowerCase();
      if (catLower === 'engagement') {
        result = result.filter(p => p.category?.toLowerCase() === 'ring');
      } else if (catLower === 'wedding') {
        result = result.filter(p => p.category?.toLowerCase() === 'wedding band');
      } else if (catLower === 'loose gemstone') {
        result = result.filter(p => p.category?.toLowerCase() === 'loose gemstone');
      } else if (catLower === 'earrings') {
        result = result.filter(p => p.category?.toLowerCase() === 'earrings');
      } else if (catLower === 'necklaces') {
        result = result.filter(p => p.category?.toLowerCase() === 'necklace');
      } else if (catLower === 'bracelets') {
        result = result.filter(p => p.category?.toLowerCase() === 'bracelet');
      } else if (catLower === 'gifts') {
        // Show a curated mix: verified products across all categories
        result = result.filter(p => p.isVerified);
      }
    }

    if (selectedShape) {
      result = result.filter(p => p.shape.toLowerCase() === selectedShape.toLowerCase());
    }

    if (selectedStyle) {
      const styleLower = selectedStyle.toLowerCase();
      
      if (styleLower === 'earrings') {
        result = result.filter(p => p.category?.toLowerCase() === 'earrings');
      } else if (styleLower === 'necklace') {
        result = result.filter(p => p.category?.toLowerCase() === 'necklace');
      } else if (styleLower === 'bracelet') {
        result = result.filter(p => p.category?.toLowerCase() === 'bracelet');
      } else if (styleLower === 'wedding') {
        result = result.filter(p => p.category?.toLowerCase() === 'wedding band');
      } else if (styleLower === 'mens') {
        result = result.filter(p => p.style?.toLowerCase() === 'mens' || (p.category?.toLowerCase() === 'wedding band' && p.name.toLowerCase().includes('men')));
      } else if (styleLower === 'eternity') {
        result = result.filter(p => p.style?.toLowerCase() === 'eternity' || p.name.toLowerCase().includes('eternity'));
      } else if (styleLower === 'stackable') {
        result = result.filter(p => p.style?.toLowerCase() === 'stackable' || p.name.toLowerCase().includes('stackable'));
      } else if (styleLower === 'lab') {
        result = result.filter(p => p.style?.toLowerCase() === 'lab' || p.name.toLowerCase().includes('lab'));
      } else if (styleLower === 'solitaire') {
        result = result.filter(p => p.style?.toLowerCase() === 'solitaire' || p.name.toLowerCase().includes('solitaire'));
      } else if (styleLower === 'halo') {
        result = result.filter(p => p.style?.toLowerCase() === 'halo' || (p.name.toLowerCase().includes('halo') && !p.name.toLowerCase().includes('hidden')));
      } else if (styleLower === 'hidden halo') {
        result = result.filter(p => p.style?.toLowerCase() === 'hidden halo' || p.name.toLowerCase().includes('hidden halo'));
      } else if (styleLower === 'three-stone') {
        result = result.filter(p => p.style?.toLowerCase() === 'three-stone' || p.name.toLowerCase().includes('three-stone'));
      } else if (styleLower === 'hoop') {
        result = result.filter(p => p.style?.toLowerCase() === 'hoop' || p.name.toLowerCase().includes('hoop'));
      } else if (styleLower === 'pave') {
        result = result.filter(p => p.style?.toLowerCase() === 'pave' || p.name.toLowerCase().includes('pavé') || p.name.toLowerCase().includes('pave'));
      } else if (styleLower === 'christian') {
        result = result.filter(p => p.style?.toLowerCase() === 'christian' || p.name.toLowerCase().includes('christian') || p.name.toLowerCase().includes('vintage'));
      } else if (styleLower === '1carat') {
        result = result.filter(p => p.carat >= 0.90 && p.carat <= 1.15);
      } else if (styleLower === 'oval') {
        result = result.filter(p => p.shape.toLowerCase() === 'oval');
      } else if (styleLower === 'engagement') {
        result = result.filter(p => p.category?.toLowerCase() === 'ring' || p.name.toLowerCase().includes('ring'));
      }
    }

    result = result.filter(p => p.carat <= maxCarat);
    result = result.filter(p => p.price <= maxPrice);

    if (selectedClarity.length > 0) {
      result = result.filter(p => selectedClarity.includes(p.clarity));
    }

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
      result.sort((a, b) => b.aiScore - a.aiScore);
    }

    return result;
  }, [selectedShape, selectedStyle, selectedCategory, maxCarat, maxPrice, selectedClarity, selectedCut, isVerifiedOnly, sortOption]);

  const shapes = ['Round', 'Oval', 'Cushion', 'Emerald', 'Princess', 'Radiant', 'Pear', 'Marquise', 'Asscher', 'Heart'];
  const clarities = ['VVS1', 'VVS2', 'VS1', 'VS2'];
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
          
          {(selectedShape || selectedStyle || maxCarat < 5.0 || maxPrice < 15000 || selectedClarity.length > 0 || selectedCut.length > 0 || isVerifiedOnly) && (
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

            {/* Clarity Checkbox List */}
            <div className="sidebar-section">
              <div className="sidebar-section-title">Clarity</div>
              <div className="checkbox-list">
                {clarities.map((clarity) => (
                  <label key={clarity} className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={selectedClarity.includes(clarity)}
                      onChange={() => toggleClarity(clarity)}
                      className="checkbox-input"
                    />
                    {clarity}
                  </label>
                ))}
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
                  <option value="score-desc">AI Score: High to Low</option>
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
