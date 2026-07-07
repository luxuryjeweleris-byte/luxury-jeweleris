'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '../../components/Button';
import './blog.css';

// Mock Blog Posts
const BLOG_POSTS = [
  {
    id: 1,
    category: 'Diamond Guide',
    title: 'Lab-Grown vs. Natural Diamonds: The Ultimate Comparison',
    excerpt: 'Thinking about purchasing a simulated or copy stone, or debating between lab-grown and natural diamonds? Here is a breakdown of costs, values, and features.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
    date: 'July 5, 2026',
    readTime: '6 min read',
    featured: true
  },
  {
    id: 2,
    category: 'Trends',
    title: 'Top 5 Engagement Ring Styles Dominating This Year',
    excerpt: 'From classic solitaires with hidden details to pave bands that catch the light from every angle, these are the hottest settings of the season.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
    date: 'June 28, 2026',
    readTime: '4 min read',
    featured: false
  },
  {
    id: 3,
    category: 'Education',
    title: 'How to Correctly Measure Ring Size at Home',
    excerpt: 'Avoid the hassle of resizing. Follow our accurate, step-by-step sizing guide to find the perfect fit using simple household tools.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
    date: 'June 21, 2026',
    readTime: '5 min read',
    featured: false
  },
  {
    id: 4,
    category: 'Metal Guide',
    title: 'Platinum vs. 14K White Gold: Which is Right for You?',
    excerpt: 'Both metals look identical at first glance, but they behave very differently over time. Learn about durability, weight, maintenance, and costs.',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop',
    date: 'June 15, 2026',
    readTime: '8 min read',
    featured: false
  },
  {
    id: 5,
    category: 'Trends',
    title: 'Why Cushion Cuts are Rising in Popularity Again',
    excerpt: 'Combining the brilliance of a round cut with the structural look of an emerald cut, cushion shapes are taking over jewelry design.',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop',
    date: 'June 09, 2026',
    readTime: '5 min read',
    featured: false
  },
  {
    id: 6,
    category: 'Buying Guide',
    title: 'Understanding the Hidden Halo Design: Subtle Sparkle',
    excerpt: 'A hidden halo adds secret brilliance below the main center stone. Here is why modern buyers are choosing this design over standard halos.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop',
    date: 'June 02, 2026',
    readTime: '3 min read',
    featured: false
  }
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const categories = ['All', 'Diamond Guide', 'Trends', 'Education', 'Metal Guide', 'Buying Guide'];

  const filteredPosts = activeCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(post => post.category === activeCategory);

  const featuredPost = BLOG_POSTS.find(post => post.featured);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailSubscribed(true);
      setEmailInput('');
    }
  };

  return (
    <div className="blog-page">
      {/* Blog Hero Header */}
      <section className="blog-hero">
        <div className="container text-center">
          <span className="blog-hero-tag">Rare Carat Journal</span>
          <h1 className="blog-hero-title">Diamonds, Rings & Buying Advice</h1>
          <p className="blog-hero-subtitle">
            Get expert insights, styling ideas, and unbiased guides to selecting fine jewelry.
          </p>
        </div>
      </section>

      {/* Category Nav Filters */}
      <section className="blog-nav-section">
        <div className="container">
          <div className="blog-category-nav">
            {categories.map((category) => (
              <button
                key={category}
                className={`blog-nav-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container blog-content-container">
        {/* Large Featured Post (Only show when activeCategory is "All") */}
        {activeCategory === 'All' && featuredPost && (
          <section className="featured-post-section">
            <div className="featured-post-card">
              <div className="featured-post-img-container">
                <img src={featuredPost.image} alt={featuredPost.title} className="featured-post-img" />
              </div>
              <div className="featured-post-info">
                <span className="blog-card-cat">{featuredPost.category}</span>
                <h2 className="featured-post-title">
                  <Link href={`/blog/${featuredPost.id}`}>{featuredPost.title}</Link>
                </h2>
                <p className="featured-post-excerpt">{featuredPost.excerpt}</p>
                <div className="blog-card-meta">
                  <span>{featuredPost.date}</span>
                  <span className="meta-dot-divider"></span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <Link href="#" className="read-more-btn" onClick={(e) => e.preventDefault()}>
                  Read Article →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Regular Articles Grid */}
        <section className="recent-posts-section">
          <h3 className="section-title-label">
            {activeCategory === 'All' ? 'Recent Articles' : `${activeCategory} Articles`}
          </h3>
          <div className="blog-grid">
            {filteredPosts
              .filter(post => activeCategory !== 'All' || !post.featured)
              .map((post) => (
                <article key={post.id} className="blog-card">
                  <div className="blog-card-img-container">
                    <img src={post.image} alt={post.title} className="blog-card-img" />
                  </div>
                  <div className="blog-card-info">
                    <span className="blog-card-cat">{post.category}</span>
                    <h4 className="blog-card-title">
                      <Link href="#" onClick={(e) => e.preventDefault()}>{post.title}</Link>
                    </h4>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <div className="blog-card-meta">
                      <span>{post.date}</span>
                      <span className="meta-dot-divider"></span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </div>

      {/* Newsletter signup section */}
      <section className="blog-newsletter">
        <div className="container newsletter-box">
          <h3 className="newsletter-title">Subscribe to the Jewelers Journal</h3>
          <p className="newsletter-subtitle">
            Get the latest jewelry trends, diamond education guides, and exclusive offers straight to your inbox.
          </p>

          {emailSubscribed ? (
            <div className="newsletter-success">
              ✓ Thank you for subscribing! Check your email for our welcome guide.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" style={{ padding: '0 24px', height: '46px', fontSize: '13.5px' }}>
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
