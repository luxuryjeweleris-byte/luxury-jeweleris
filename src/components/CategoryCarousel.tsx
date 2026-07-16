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
      link: '/engagement-rings',
    },
    {
      name: 'Earrings',
      img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200&auto=format&fit=crop',
      link: '/earrings',
    },
    {
      name: 'Wedding bands',
      img: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=200&auto=format&fit=crop',
      link: '/wedding-bands',
    },
    {
      name: 'Necklaces',
      img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200&auto=format&fit=crop',
      link: '/necklaces',
    },
    {
      name: 'Bracelets',
      img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200&auto=format&fit=crop',
      link: '/bracelets',
    },
    {
      name: 'Three stone',
      img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=200&auto=format&fit=crop',
      link: '/engagement-rings',
    },
    {
      name: 'Solitaire',
      img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop',
      link: '/engagement-rings',
    },
    {
      name: 'Hoops',
      img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=200&auto=format&fit=crop',
      link: '/earrings',
    },
    {
      name: 'Gifts',
      img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200&auto=format&fit=crop',
      link: '/gifts',
    },
    {
      name: 'Tennis bracelets',
      img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200&auto=format&fit=crop',
      link: '/bracelets',
    },
    {
      name: 'Eternity bands',
      img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop',
      link: '/wedding-bands',
    },
    {
      name: 'Pearls',
      img: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=200&auto=format&fit=crop',
      link: '/necklaces',
    },
    {
      name: 'Men\'s bands',
      img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=200&auto=format&fit=crop',
      link: '/wedding-bands',
    },
    {
      name: 'Pendants',
      img: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=200&auto=format&fit=crop',
      link: '/necklaces',
    },
    {
      name: 'Pavé',
      img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop',
      link: '/engagement-rings',
    },
    {
      name: 'Hidden Halo',
      img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=200&auto=format&fit=crop',
      link: '/engagement-rings',
    },
    {
      name: 'Stackable rings',
      img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200&auto=format&fit=crop',
      link: '/wedding-bands',
    },
    {
      name: 'Halo rings',
      img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=200&auto=format&fit=crop',
      link: '/engagement-rings',
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
