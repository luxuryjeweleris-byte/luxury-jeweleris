'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import './components.css';

interface CategoryItem {
  name: string;
  img: string;
  link: string;
}

export const CategoryCarousel: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('category_circles')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          setCategories(data.map((item: any) => ({
            name: item.name,
            img: item.img,
            link: item.link || '/'
          })));
        }
      } catch (err) {
        console.error('Error fetching category circles:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleCardClick = (link: string) => {
    router.push(link);
  };

  return (
    <section className="categories-carousel-section">
      <div className="categories-container">
        <div className="categories-grid">
          {loading ? (
            Array.from({ length: 18 }).map((_, idx) => (
              <div key={idx} className="category-card" style={{ cursor: 'default' }}>
                <div className="category-circle-wrapper">
                  <div className="category-circle-skeleton" />
                </div>
                <div className="category-label-skeleton" />
              </div>
            ))
          ) : (
            categories.map((cat, idx) => (
              <div 
                key={idx} 
                className="category-card"
                onClick={() => handleCardClick(cat.link)}
              >
                <div className="category-circle-wrapper">
                  <img 
                    src={cat.img} 
                    alt={cat.name} 
                    className="category-circle-img" 
                    loading="lazy"
                  />
                </div>
                <span className="category-label">{cat.name}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
