'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import './components.css';

interface CategoryItem {
  name: string;
  img: string;
  link: string;
}

export const CategoryCarousel: React.FC = () => {
  const router = useRouter();

  const categories: CategoryItem[] = [
    {
      name: 'Engagement rings',
      img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop',
      link: '/diamonds?style=Engagement',
    },
    {
      name: 'Earrings',
      img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200&auto=format&fit=crop',
      link: '/diamonds?style=Earrings',
    },
    {
      name: 'Wedding rings',
      img: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=200&auto=format&fit=crop',
      link: '/diamonds?style=Wedding',
    },
    {
      name: 'Necklaces',
      img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200&auto=format&fit=crop',
      link: '/diamonds?style=Necklace',
    },
    {
      name: '1 carat diamonds',
      img: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=200&auto=format&fit=crop',
      link: '/diamonds?style=1carat',
    },
    {
      name: 'Three stone',
      img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=200&auto=format&fit=crop',
      link: '/diamonds?style=Three-Stone',
    },
    {
      name: 'Solitaire',
      img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop',
      link: '/diamonds?style=Solitaire',
    },
    {
      name: 'Hoops',
      img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=200&auto=format&fit=crop',
      link: '/diamonds?style=Hoop',
    },
    {
      name: 'Christian rings',
      img: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=200&auto=format&fit=crop',
      link: '/diamonds?style=Christian',
    },
    {
      name: 'Tennis bracelets',
      img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200&auto=format&fit=crop',
      link: '/diamonds?style=Bracelet',
    },
    {
      name: 'Eternity bands',
      img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop',
      link: '/diamonds?style=Eternity',
    },
    {
      name: 'Lab diamonds',
      img: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=200&auto=format&fit=crop',
      link: '/diamonds?style=Lab',
    },
    {
      name: 'Men\'s bands',
      img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=200&auto=format&fit=crop',
      link: '/diamonds?style=Mens',
    },
    {
      name: 'Oval diamonds',
      img: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=200&auto=format&fit=crop',
      link: '/diamonds?style=Oval',
    },
    {
      name: 'Pavé',
      img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop',
      link: '/diamonds?style=Pave',
    },
    {
      name: 'Hidden Halo',
      img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=200&auto=format&fit=crop',
      link: '/diamonds?style=Hidden Halo',
    },
    {
      name: 'Stackable rings',
      img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200&auto=format&fit=crop',
      link: '/diamonds?style=Stackable',
    },
    {
      name: 'Halo rings',
      img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=200&auto=format&fit=crop',
      link: '/diamonds?style=Halo',
    },
  ];

  const handleCardClick = (link: string) => {
    router.push(link);
  };

  return (
    <section className="categories-carousel-section">
      <div className="categories-container">
        <div className="categories-grid">
          {categories.map((cat, idx) => (
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
