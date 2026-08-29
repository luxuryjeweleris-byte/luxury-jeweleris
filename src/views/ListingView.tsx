'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ProductCard, { type Product } from '../components/ProductCard';
import Button from '../components/Button';
import { Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { supabase, dbProductToProduct } from '../lib/supabase';
import { isCategoryMatch, productMatchesSearchQuery } from '../lib/categoryUtils';
import './views.css';

export const INITIAL_PRODUCTS: Product[] = [];

interface ListingViewProps {
  initialFilters?: {
    shape?: string;
    style?: string;
    category?: string;
    recipient?: string;
    search?: string;
  };
  onProductSelect: (product: Product, metal?: string) => void;
  pageTitle?: string;
  pageSubtitle?: string;
}

export const ListingView: React.FC<ListingViewProps> = ({ initialFilters, onProductSelect, pageTitle, pageSubtitle }) => {
  const [loading, setLoading] = useState(false);
  const [, setDbLoading] = useState(true);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState('score-desc');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filter States
  const [selectedShape, setSelectedShape] = useState<string | null>(initialFilters?.shape || null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(initialFilters?.style || null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialFilters?.category || null);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(initialFilters?.recipient || null);
  const [selectedMetal, setSelectedMetal] = useState<string | null>(null);
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
    setSelectedRecipient(initialFilters?.recipient || null);
    setSearchQuery(initialFilters?.search || null);
  }, [initialFilters]);

  // Simulate network loading state when filters change
  const triggerLoading = () => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  };

  // Trigger loading on filter changes
  useEffect(() => {
    triggerLoading();
  }, [selectedShape, selectedStyle, selectedCategory, selectedRecipient, selectedMetal, maxCarat, maxPrice, selectedCut, isVerifiedOnly, sortOption, searchQuery]);

  const toggleCut = (cut: string) => {
    setSelectedCut(prev => 
      prev.includes(cut) ? prev.filter(c => c !== cut) : [...prev, cut]
    );
  };

  const resetFilters = () => {
    setSelectedShape(null);
    setSelectedStyle(null);
    setSelectedCategory(null);
    setSelectedRecipient(null);
    setSelectedMetal(null);
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
      result = result.filter(p => isCategoryMatch(p.category, selectedCategory));
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
        result = result.filter(p => {
          const metal = (p.metal || '').toLowerCase();
          const name = p.name.toLowerCase();
          const hasYellowImg = Boolean(p.imageYellowGold || (p.imagesYellowGold && p.imagesYellowGold.length > 0));
          return metal.includes('yellow') || hasYellowImg || name.includes('yellow') || (name.includes('gold') && !name.includes('white') && !name.includes('rose'));
        });
      } else if (styleLower === 'white-gold' || styleLower === 'white gold') {
        result = result.filter(p => {
          const metal = (p.metal || '').toLowerCase();
          const name = p.name.toLowerCase();
          const hasWhiteImg = Boolean(p.imagesWhiteGold && p.imagesWhiteGold.length > 0);
          return metal.includes('white') || hasWhiteImg || name.includes('white') || name.includes('platinum');
        });
      } else if (styleLower === 'rose-gold' || styleLower === 'rose gold') {
        result = result.filter(p => {
          const metal = (p.metal || '').toLowerCase();
          const name = p.name.toLowerCase();
          const hasRoseImg = Boolean(p.imageRoseGold || (p.imagesRoseGold && p.imagesRoseGold.length > 0));
          return metal.includes('rose') || hasRoseImg || name.includes('rose');
        });
      } else if (styleLower === 'platinum') {
        result = result.filter(p => {
          const metal = (p.metal || '').toLowerCase();
          const name = p.name.toLowerCase();
          const hasPlatImg = Boolean(p.imagePlatinum || (p.imagesPlatinum && p.imagesPlatinum.length > 0));
          return metal.includes('platinum') || hasPlatImg || name.includes('platinum');
        });
      } else if (styleLower === 'silver') {
        result = result.filter(p => {
          const metal = (p.metal || '').toLowerCase();
          const name = p.name.toLowerCase();
          const hasSilverImg = Boolean(p.imageSilver || (p.imagesSilver && p.imagesSilver.length > 0));
          return metal.includes('silver') || hasSilverImg || name.includes('silver') || name.includes('white') || name.includes('platinum');
        });
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
        result = result.filter(p => (p.name.toLowerCase().includes('men') && p.name.toLowerCase().includes('matte')) || p.name.toLowerCase().includes('classic'));
      } else if (styleLower === 'mens-hammered') {
        result = result.filter(p => (p.name.toLowerCase().includes('men') && p.name.toLowerCase().includes('hammered')) || p.name.toLowerCase().includes('gold'));
      } else if (styleLower === 'mens-engraved') {
        result = result.filter(p => (p.name.toLowerCase().includes('men') && p.name.toLowerCase().includes('engraved')) || p.name.toLowerCase().includes('wedding'));
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

    // Recipient Filtering (Level 2 - Gender)
    if (selectedRecipient) {
      const recLower = selectedRecipient.toLowerCase();
      if (recLower === 'men') {
        result = result.filter(p => p.recipient?.toLowerCase() === 'men' || p.recipient?.toLowerCase() === 'him' || p.name.toLowerCase().includes('men') || p.style?.toLowerCase() === 'mens' || p.category?.toLowerCase() === 'wedding band');
      } else if (recLower === 'women') {
        result = result.filter(p => p.recipient?.toLowerCase() === 'women' || p.recipient?.toLowerCase() === 'her' || !p.name.toLowerCase().includes('men'));
      }
    }

    // Metal / Color Filtering (Level 4 - Metal Swatch)
    if (selectedMetal) {
      const metalLower = selectedMetal.toLowerCase();
      if (metalLower === 'yellow-gold' || metalLower === 'yellow gold') {
        result = result.filter(p => {
          const metal = (p.metal || '').toLowerCase();
          const name = p.name.toLowerCase();
          const hasYellowImg = Boolean(p.imageYellowGold || (p.imagesYellowGold && p.imagesYellowGold.length > 0));
          return metal.includes('yellow') || hasYellowImg || name.includes('yellow') || (name.includes('gold') && !name.includes('white') && !name.includes('rose'));
        });
      } else if (metalLower === 'white-gold' || metalLower === 'white gold') {
        result = result.filter(p => {
          const metal = (p.metal || '').toLowerCase();
          const name = p.name.toLowerCase();
          const hasWhiteImg = Boolean(p.imagesWhiteGold && p.imagesWhiteGold.length > 0);
          return metal.includes('white') || hasWhiteImg || name.includes('white') || name.includes('platinum');
        });
      } else if (metalLower === 'rose-gold' || metalLower === 'rose gold') {
        result = result.filter(p => {
          const metal = (p.metal || '').toLowerCase();
          const name = p.name.toLowerCase();
          const hasRoseImg = Boolean(p.imageRoseGold || (p.imagesRoseGold && p.imagesRoseGold.length > 0));
          return metal.includes('rose') || hasRoseImg || name.includes('rose');
        });
      } else if (metalLower === 'platinum') {
        result = result.filter(p => {
          const metal = (p.metal || '').toLowerCase();
          const name = p.name.toLowerCase();
          const hasPlatImg = Boolean(p.imagePlatinum || (p.imagesPlatinum && p.imagesPlatinum.length > 0));
          return metal.includes('platinum') || hasPlatImg || name.includes('platinum');
        });
      } else if (metalLower === 'silver') {
        result = result.filter(p => {
          const metal = (p.metal || '').toLowerCase();
          const name = p.name.toLowerCase();
          const hasSilverImg = Boolean(p.imageSilver || (p.imagesSilver && p.imagesSilver.length > 0));
          return metal.includes('silver') || hasSilverImg || name.includes('silver') || name.includes('white') || name.includes('platinum');
        });
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
  }, [selectedShape, selectedStyle, selectedCategory, selectedRecipient, selectedMetal, maxCarat, maxPrice, selectedCut, isVerifiedOnly, sortOption, searchQuery, productsList]);

  // Helper to dynamically calculate product counts for taxonomy chips
  const getTaxonomyCounts = React.useMemo(() => {
    const counts: {
      category: Record<string, number>;
      recipient: Record<string, number>;
      style: Record<string, number>;
      metal: Record<string, number>;
    } = {
      category: {},
      recipient: {},
      style: {},
      metal: {},
    };

    const baseList = productsList;
    counts.category['All'] = baseList.length;
    ['Earring', 'Rings', 'Necklace', 'Bracelet', 'Pendant'].forEach(cat => {
      counts.category[cat] = baseList.filter(p => isCategoryMatch(p.category, cat)).length;
    });

    let categoryFiltered = baseList;
    if (selectedCategory) {
      categoryFiltered = baseList.filter(p => isCategoryMatch(p.category, selectedCategory));
    }
    counts.recipient['All'] = categoryFiltered.length;
    counts.recipient['Women'] = categoryFiltered.filter(p => p.recipient?.toLowerCase() === 'women' || p.recipient?.toLowerCase() === 'her' || !p.name.toLowerCase().includes('men')).length;
    counts.recipient['Men'] = categoryFiltered.filter(p => p.recipient?.toLowerCase() === 'men' || p.recipient?.toLowerCase() === 'him' || p.name.toLowerCase().includes('men') || p.style?.toLowerCase() === 'mens' || p.category?.toLowerCase() === 'wedding band').length;

    let contextFiltered = categoryFiltered;
    if (selectedRecipient) {
      const recLower = selectedRecipient.toLowerCase();
      if (recLower === 'men') {
        contextFiltered = categoryFiltered.filter(p => p.recipient?.toLowerCase() === 'men' || p.recipient?.toLowerCase() === 'him' || p.name.toLowerCase().includes('men') || p.style?.toLowerCase() === 'mens' || p.category?.toLowerCase() === 'wedding band');
      } else if (recLower === 'women') {
        contextFiltered = categoryFiltered.filter(p => p.recipient?.toLowerCase() === 'women' || p.recipient?.toLowerCase() === 'her' || !p.name.toLowerCase().includes('men'));
      }
    }
    counts.style['All'] = contextFiltered.length;

    const stylesToCount = ['Pearl', 'Solitaire', 'Pavé', 'Halo', 'Three-Stone', 'Eternity', 'Studs', 'Hoops'];
    stylesToCount.forEach(sty => {
      const styLower = sty.toLowerCase();
      counts.style[sty] = contextFiltered.filter(p => {
        const pStyle = (p.style || '').toLowerCase();
        const pName = p.name.toLowerCase();
        if (styLower === 'solitaire') return pStyle === 'solitaire' || pName.includes('solitaire');
        if (styLower === 'halo') return pStyle === 'halo' || (pName.includes('halo') && !pName.includes('hidden'));
        if (styLower === 'pavé' || styLower === 'pave') return pStyle === 'pave' || pName.includes('pavé') || pName.includes('pave');
        if (styLower === 'three-stone') return pStyle === 'three-stone' || pName.includes('three-stone') || pName.includes('three stone');
        if (styLower === 'pearl') return pName.includes('pearl');
        if (styLower === 'eternity') return pStyle === 'eternity' || pName.includes('eternity') || pName.includes('anniversary');
        if (styLower === 'studs') return pStyle === 'stud' || pName.includes('stud');
        if (styLower === 'hoops') return pStyle === 'hoop' || pName.includes('hoop');
        return false;
      }).length;
    });

    counts.metal['yellow-gold'] = contextFiltered.filter(p => (p.metal || '').toLowerCase().includes('yellow') || Boolean(p.imageYellowGold || (p.imagesYellowGold && p.imagesYellowGold.length > 0))).length;
    counts.metal['white-gold'] = contextFiltered.filter(p => (p.metal || '').toLowerCase().includes('white') || Boolean(p.imagesWhiteGold && p.imagesWhiteGold.length > 0)).length;
    counts.metal['rose-gold'] = contextFiltered.filter(p => (p.metal || '').toLowerCase().includes('rose') || Boolean(p.imageRoseGold || (p.imagesRoseGold && p.imagesRoseGold.length > 0))).length;
    counts.metal['platinum'] = contextFiltered.filter(p => (p.metal || '').toLowerCase().includes('platinum') || Boolean(p.imagePlatinum || (p.imagesPlatinum && p.imagesPlatinum.length > 0))).length;
    counts.metal['silver'] = contextFiltered.filter(p => (p.metal || '').toLowerCase().includes('silver') || Boolean(p.imageSilver || (p.imagesSilver && p.imagesSilver.length > 0))).length;

    return counts;
  }, [productsList, selectedCategory, selectedRecipient]);

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
              Style: {selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1)}
              <button 
                className="active-filter-remove" 
                onClick={() => setSelectedStyle(null)}
                style={{ marginLeft: '6px', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit', fontWeight: 'bold' }}
              >
                ×
              </button>
            </span>
          )}
          
          {(selectedShape || selectedStyle || selectedCategory || selectedRecipient || selectedMetal || maxCarat < 5.0 || maxPrice < 15000 || selectedCut.length > 0 || isVerifiedOnly) && (
            <button className="filter-chip" onClick={resetFilters} style={{ borderStyle: 'dashed', color: 'var(--color-teal)' }}>
              <RotateCcw size={12} /> Clear all
            </button>
          )}
        </div>
      </div>

      <div className="container" style={{ paddingTop: '24px' }}>
        {/* Smart Taxonomy Stepper Bar matching User Flow Diagram */}
        <div className="smart-taxonomy-bar">
          <div className="taxonomy-flow-header">
            <span className="taxonomy-flow-badge">✦ TAXONOMY SEARCH FLOW</span>
            <span className="taxonomy-flow-desc">Jewelrys Category ➔ Recipient ➔ Style ➔ Metal Color</span>
          </div>

          <div className="taxonomy-grid">
            {/* Level 1: Category */}
            <div className="taxonomy-tier">
              <span className="taxonomy-label">1. Category</span>
              <div className="taxonomy-chips">
                {[
                  { key: 'All', label: 'All Jewelry' },
                  { key: 'Earring', label: '👂 Earring' },
                  { key: 'Rings', label: '💍 Rings' },
                  { key: 'Necklace', label: '📿 Necklace' },
                  { key: 'Bracelet', label: '💎 Bracelet' },
                  { key: 'Pendant', label: '🔮 Pendant' },
                ].map(cat => {
                  const count = getTaxonomyCounts.category[cat.key] ?? 0;
                  const isActive = (cat.key === 'All' && !selectedCategory) || (selectedCategory && isCategoryMatch(selectedCategory, cat.key));
                  const isZero = cat.key !== 'All' && count === 0;

                  return (
                    <button
                      key={cat.key}
                      className={`taxonomy-chip ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat.key === 'All' ? null : cat.key)}
                      style={isZero ? { opacity: 0.55 } : undefined}
                    >
                      {cat.label} {cat.key !== 'All' && <span className="chip-count-badge">({count})</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Level 2: Recipient / Gender */}
            <div className="taxonomy-tier">
              <span className="taxonomy-label">2. Recipient</span>
              <div className="taxonomy-chips">
                {[
                  { key: 'All', label: 'All' },
                  { key: 'Women', label: '👩 Women' },
                  { key: 'Men', label: '👨 Men' },
                ].map(rec => {
                  const count = getTaxonomyCounts.recipient[rec.key] ?? 0;
                  const isActive = (rec.key === 'All' && !selectedRecipient) || selectedRecipient === rec.key;
                  const isZero = rec.key !== 'All' && count === 0;

                  return (
                    <button
                      key={rec.key}
                      className={`taxonomy-chip ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedRecipient(rec.key === 'All' ? null : rec.key)}
                      style={isZero ? { opacity: 0.55 } : undefined}
                    >
                      {rec.label} {rec.key !== 'All' && <span className="chip-count-badge">({count})</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Level 3: Style / Setting */}
            <div className="taxonomy-tier">
              <span className="taxonomy-label">3. Style / Setting</span>
              <div className="taxonomy-chips">
                {[
                  { key: 'All', label: 'All Styles' },
                  { key: 'Pearl', label: 'Pearl' },
                  { key: 'Solitaire', label: 'Solitaire' },
                  { key: 'Pavé', label: 'Pavé' },
                  { key: 'Halo', label: 'Halo' },
                  { key: 'Three-Stone', label: 'Three Stone' },
                  { key: 'Eternity', label: 'Eternity' },
                  { key: 'Studs', label: 'Studs' },
                  { key: 'Hoops', label: 'Hoops' },
                ].map(sty => {
                  const count = getTaxonomyCounts.style[sty.key] ?? (sty.key === 'All' ? getTaxonomyCounts.style['All'] : 0);
                  const isActive = (sty.key === 'All' && !selectedStyle) || (selectedStyle && selectedStyle.toLowerCase() === sty.key.toLowerCase());
                  const isZero = sty.key !== 'All' && count === 0;

                  return (
                    <button
                      key={sty.key}
                      className={`taxonomy-chip ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedStyle(sty.key === 'All' ? null : sty.key)}
                      style={isZero ? { opacity: 0.5 } : undefined}
                      title={isZero ? `0 items currently in ${sty.label}` : undefined}
                    >
                      {sty.label} {sty.key !== 'All' && <span className="chip-count-badge">({count})</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Level 4: Color / Metal */}
            <div className="taxonomy-tier">
              <span className="taxonomy-label">4. Metal Color</span>
              <div className="taxonomy-swatches">
                {[
                  { key: 'yellow-gold', label: 'Yellow Gold', color: '#E9B646' },
                  { key: 'white-gold', label: 'White Gold', color: '#E2E8F0' },
                  { key: 'rose-gold', label: 'Rose Gold', color: '#E0A391' },
                  { key: 'platinum', label: 'Platinum', color: '#CBD5E1' },
                  { key: 'silver', label: 'Silver', color: '#94A3B8' },
                ].map(m => {
                  const count = getTaxonomyCounts.metal[m.key] ?? 0;
                  const isZero = count === 0;

                  return (
                    <button
                      key={m.key}
                      className={`taxonomy-swatch ${selectedMetal === m.key ? 'active' : ''}`}
                      onClick={() => setSelectedMetal(selectedMetal === m.key ? null : m.key)}
                      style={isZero ? { opacity: 0.5 } : undefined}
                    >
                      <span className="swatch-color-dot" style={{ backgroundColor: m.color }} />
                      <span className="swatch-label">{m.label} ({count})</span>
                    </button>
                  );
                })}
                {selectedMetal && (
                  <button
                    className="taxonomy-chip"
                    onClick={() => setSelectedMetal(null)}
                    style={{ fontSize: '11px', padding: '4px 10px', marginLeft: '4px' }}
                  >
                    Clear Color ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

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
                  max="5.0"
                  step="0.1"
                  value={maxCarat}
                  onChange={(e) => setMaxCarat(parseFloat(e.target.value))}
                  className="range-input"
                />
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
                  className="range-input"
                />
              </div>
            </div>

            {/* Cut Filter */}
            <div className="sidebar-section">
              <div className="sidebar-section-title">
                <span>Cut Quality</span>
              </div>
              <div className="checkbox-group">
                {cuts.map((cut) => (
                  <label key={cut} className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={selectedCut.includes(cut)}
                      onChange={() => toggleCut(cut)}
                      className="checkbox-input"
                    />
                    <span>{cut}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Verified Only Filter */}
            <div className="sidebar-section">
              <label className="checkbox-label" style={{ fontWeight: '600', color: 'var(--color-ink)' }}>
                <input 
                  type="checkbox"
                  checked={isVerifiedOnly}
                  onChange={(e) => setIsVerifiedOnly(e.target.checked)}
                  className="checkbox-input"
                />
                <span>Premium Quality Only</span>
              </label>
            </div>

            {(selectedShape || selectedStyle || selectedCategory || selectedRecipient || selectedMetal || maxCarat < 5.0 || maxPrice < 15000 || selectedCut.length > 0 || isVerifiedOnly) && (
              <Button variant="outline" size="sm" onClick={resetFilters} style={{ width: '100%', marginTop: '12px' }}>
                Reset All Filters
              </Button>
            )}
          </aside>

          {/* Main Content Area */}
          <main className="listing-main">
            {/* Control Bar: Result Count & Sort */}
            <div className="control-bar">
              <div className="results-count">
                <span>{filteredProducts.length} items found</span>
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
                    activeMetalFilter={selectedMetal || selectedStyle || undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-cart-state" style={{ backgroundColor: 'var(--color-card)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '48px 24px', textAlign: 'center' }}>
                <Filter size={40} style={{ color: 'var(--color-slate-muted)', marginBottom: '12px' }} />
                <h3 className="h3-text" style={{ fontSize: '18px', fontWeight: '600' }}>No items match your selected filter</h3>
                <p className="body-text" style={{ maxWidth: '380px', margin: '8px auto 16px', color: 'var(--color-slate-muted)' }}>
                  {selectedStyle ? `There are currently 0 items matching "${selectedStyle}". Try choosing another style or clear your filter.` : 'Try loosening your filter metrics.'}
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  {selectedStyle && (
                    <Button variant="outline" size="sm" onClick={() => setSelectedStyle(null)}>
                      Clear &quot;{selectedStyle}&quot; Filter
                    </Button>
                  )}
                  <Button variant="primary" size="sm" onClick={resetFilters}>
                    Reset All Filters
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ListingView;
