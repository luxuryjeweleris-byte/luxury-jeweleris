'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Calendar, User, Tag, Search, ArrowRight, BookOpen } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button';
import './blog.css';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  cover_image: string | null;
  author_name: string | null;
  tags: string[] | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string | null;
}

function estimateReadTime(body: string | null): string {
  if (!body) return '1 min read';
  const words = body.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emailSubscribed, setEmailSubscribed] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });
        if (!error && data) {
          setPosts(data as BlogPost[]);
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Collect all unique tags from all posts
  const allTags = Array.from(
    new Set(posts.flatMap(p => p.tags ?? []))
  ).sort();
  const categories = ['All', ...allTags];

  const filteredPosts = posts.filter(post => {
    const matchCat = activeCategory === 'All' || (post.tags ?? []).includes(activeCategory);
    const matchSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      (post.excerpt ?? '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredPost = filteredPosts[0] ?? null;
  const gridPosts = filteredPosts.slice(1);

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
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="blog-hero-tag">Luxury Journal</span>
          <h1 className="blog-hero-title">Gemstones, Rings &amp; Buying Advice</h1>
          <p className="blog-hero-subtitle">
            Get expert insights, styling ideas, and unbiased guides to selecting fine jewelry.
          </p>

          {/* Search Bar */}
          <div className="blog-search-bar">
            <Search size={16} className="blog-search-icon" />
            <input
              type="text"
              className="blog-search-input"
              placeholder="Search articles…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Category Nav Filters */}
      {!loading && categories.length > 1 && (
        <section className="blog-nav-section">
          <div className="container">
            <div className="blog-category-nav">
              {categories.map(category => (
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
      )}

      <div className="container blog-content-container">
        {loading ? (
          /* Skeleton Loading */
          <div>
            <div className="blog-skeleton-featured" />
            <div className="blog-grid" style={{ marginTop: '48px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="blog-skeleton-card" />
              ))}
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          /* Empty State */
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <BookOpen size={48} style={{ margin: '0 auto 16px', color: '#CBD5E1' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              {search || activeCategory !== 'All' ? 'No articles found' : 'No articles published yet'}
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              {search ? `Try a different search term.` : activeCategory !== 'All' ? `No posts tagged "${activeCategory}" yet.` : 'Check back soon for expert jewelry guides.'}
            </p>
            {(search || activeCategory !== 'All') && (
              <button
                onClick={() => { setSearch(''); setActiveCategory('All'); }}
                style={{ marginTop: '16px', background: 'none', border: '1px solid #CBD5E1', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', color: '#475569' }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section className="featured-post-section">
                <Link href={`/blog/${featuredPost.slug}`} className="featured-post-card featured-post-link">
                  <div className="featured-post-img-container">
                    {featuredPost.cover_image ? (
                      <img
                        src={featuredPost.cover_image}
                        alt={featuredPost.title}
                        className="featured-post-img"
                      />
                    ) : (
                      <div className="featured-post-img-placeholder">
                        <BookOpen size={48} />
                      </div>
                    )}
                    <div className="featured-post-img-overlay" />
                    {(featuredPost.tags ?? []).length > 0 && (
                      <span className="featured-post-tag-badge">
                        {featuredPost.tags![0]}
                      </span>
                    )}
                  </div>
                  <div className="featured-post-info">
                    <span className="blog-card-cat">
                      {(featuredPost.tags ?? []).join(' · ') || 'Article'}
                    </span>
                    <h2 className="featured-post-title">{featuredPost.title}</h2>
                    {featuredPost.excerpt && (
                      <p className="featured-post-excerpt">{featuredPost.excerpt}</p>
                    )}
                    <div className="blog-card-meta" style={{ marginBottom: '20px' }}>
                      <User size={12} />
                      <span style={{ marginLeft: '4px' }}>{featuredPost.author_name || 'Luxury Jeweleris'}</span>
                      <span className="meta-dot-divider" />
                      <Calendar size={12} />
                      <span style={{ marginLeft: '4px' }}>{formatDate(featuredPost.published_at || featuredPost.created_at)}</span>
                      <span className="meta-dot-divider" />
                      <Clock size={12} />
                      <span style={{ marginLeft: '4px' }}>{estimateReadTime(featuredPost.body)}</span>
                    </div>
                    <span className="read-more-btn">
                      Read Article <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
                    </span>
                  </div>
                </Link>
              </section>
            )}

            {/* Grid of Articles */}
            {gridPosts.length > 0 && (
              <section className="recent-posts-section">
                <h3 className="section-title-label">
                  {activeCategory === 'All' && !search ? 'More Articles' : `${activeCategory !== 'All' ? activeCategory : 'Search'} Results`}
                </h3>
                <div className="blog-grid">
                  {gridPosts.map(post => (
                    <article key={post.id} className="blog-card">
                      <Link href={`/blog/${post.slug}`} className="blog-card-img-link">
                        <div className="blog-card-img-container">
                          {post.cover_image ? (
                            <img src={post.cover_image} alt={post.title} className="blog-card-img" />
                          ) : (
                            <div className="blog-card-img-placeholder-sm">
                              <BookOpen size={32} />
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="blog-card-info">
                        {/* Tags */}
                        {(post.tags ?? []).length > 0 && (
                          <div className="blog-card-tags">
                            {(post.tags ?? []).slice(0, 2).map(tag => (
                              <span key={tag} className="blog-card-tag-pill" onClick={e => { e.preventDefault(); setActiveCategory(tag); }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <h4 className="blog-card-title">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h4>
                        {post.excerpt && (
                          <p className="blog-card-excerpt">{post.excerpt}</p>
                        )}
                        <div className="blog-card-meta" style={{ marginTop: 'auto' }}>
                          <span>{formatDate(post.published_at || post.created_at)}</span>
                          <span className="meta-dot-divider" />
                          <span>{estimateReadTime(post.body)}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Newsletter Signup */}
      <section className="blog-newsletter">
        <div className="newsletter-box">
          <h3 className="newsletter-title">Subscribe to the Jewelers Journal</h3>
          <p className="newsletter-subtitle">
            Get the latest jewelry trends, gemstone education guides, and exclusive offers straight to your inbox.
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
                onChange={e => setEmailInput(e.target.value)}
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
