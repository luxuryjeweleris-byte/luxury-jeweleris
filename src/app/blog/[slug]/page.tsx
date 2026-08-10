'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Clock, Calendar, User, Tag, BookOpen,
  Share2, Heart, ChevronRight, Loader2,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import Button from '../../../components/Button';
import '../blog.css';

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

/**
 * Very simple markdown-like renderer for body text.
 * Supports: **bold**, *italic*, headings (## ###), line breaks, --- divider
 */
function renderBody(body: string): React.ReactNode[] {
  const paragraphs = body.split(/\n\n+/);
  return paragraphs.map((block, i) => {
    const trimmed = block.trim();

    if (!trimmed) return null;

    // Horizontal rule
    if (/^---+$/.test(trimmed)) {
      return <hr key={i} style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '32px 0' }} />;
    }

    // Heading 2
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={i} style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '36px 0 12px', lineHeight: 1.3 }}>
          {inlineFormat(trimmed.slice(3))}
        </h2>
      );
    }

    // Heading 3
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={i} style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: '28px 0 10px', lineHeight: 1.4 }}>
          {inlineFormat(trimmed.slice(4))}
        </h3>
      );
    }

    // Bullet list
    if (trimmed.split('\n').every(line => /^[-*•]\s/.test(line.trim()))) {
      return (
        <ul key={i} style={{ paddingLeft: '22px', margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {trimmed.split('\n').map((line, j) => (
            <li key={j} style={{ fontSize: '16px', lineHeight: 1.7, color: '#334155' }}>
              {inlineFormat(line.replace(/^[-*•]\s/, ''))}
            </li>
          ))}
        </ul>
      );
    }

    // Numbered list
    if (trimmed.split('\n').every(line => /^\d+\.\s/.test(line.trim()))) {
      return (
        <ol key={i} style={{ paddingLeft: '22px', margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {trimmed.split('\n').map((line, j) => (
            <li key={j} style={{ fontSize: '16px', lineHeight: 1.7, color: '#334155' }}>
              {inlineFormat(line.replace(/^\d+\.\s/, ''))}
            </li>
          ))}
        </ol>
      );
    }

    // Default paragraph
    return (
      <p key={i} style={{ fontSize: '16px', lineHeight: 1.8, color: '#334155', margin: '0 0 20px' }}>
        {inlineFormat(trimmed)}
      </p>
    );
  }).filter(Boolean) as React.ReactNode[];
}

function inlineFormat(text: string): React.ReactNode {
  // Handle **bold** and *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: '#0f172a', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [liked, setLiked] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .maybeSingle();

        if (error || !data) {
          setNotFound(true);
          return;
        }

        setPost(data as BlogPost);

        // Fetch related posts (same tag, excluding current)
        const tags = (data as BlogPost).tags ?? [];
        if (tags.length > 0) {
          const { data: relData } = await supabase
            .from('blog_posts')
            .select('id, title, slug, excerpt, cover_image, tags, published_at, body')
            .eq('is_published', true)
            .neq('id', data.id)
            .contains('tags', [tags[0]])
            .limit(3);
          setRelated((relData as BlogPost[]) ?? []);
        } else {
          // Fall back to any recent posts
          const { data: recData } = await supabase
            .from('blog_posts')
            .select('id, title, slug, excerpt, cover_image, tags, published_at, body')
            .eq('is_published', true)
            .neq('id', data.id)
            .order('published_at', { ascending: false })
            .limit(3);
          setRelated((recData as BlogPost[]) ?? []);
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  if (loading) {
    return (
      <div className="blog-detail-loading">
        <Loader2 size={36} style={{ animation: 'spin 0.8s linear infinite', color: '#0E8C8A' }} />
        <p>Loading article…</p>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="blog-detail-notfound">
        <BookOpen size={52} style={{ color: '#CBD5E1', marginBottom: '20px' }} />
        <h1>Article not found</h1>
        <p>This article may have been removed or is not yet published.</p>
        <Link href="/blog">
          <Button variant="primary">← Back to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-page">
      {/* Cover Hero */}
      <div className="blog-detail-cover">
        {post.cover_image ? (
          <>
            <img src={post.cover_image} alt={post.title} className="blog-detail-cover-img" />
            <div className="blog-detail-cover-overlay" />
          </>
        ) : (
          <div className="blog-detail-cover-placeholder" />
        )}
        <div className="blog-detail-cover-content">
          <div className="container">
            {/* Breadcrumb */}
            <nav className="blog-detail-breadcrumb">
              <Link href="/">Home</Link>
              <ChevronRight size={13} />
              <Link href="/blog">Blog</Link>
              <ChevronRight size={13} />
              <span>{post.title.length > 40 ? post.title.slice(0, 40) + '…' : post.title}</span>
            </nav>

            {/* Tags */}
            {(post.tags ?? []).length > 0 && (
              <div className="blog-detail-tags-row">
                {(post.tags ?? []).map(tag => (
                  <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} className="blog-detail-tag">
                    <Tag size={10} /> {tag}
                  </Link>
                ))}
              </div>
            )}

            <h1 className="blog-detail-title">{post.title}</h1>
            {post.excerpt && (
              <p className="blog-detail-excerpt">{post.excerpt}</p>
            )}

            {/* Meta Row */}
            <div className="blog-detail-meta">
              <div className="blog-detail-meta-item">
                <User size={14} />
                <span>{post.author_name || 'Luxury Jeweleris'}</span>
              </div>
              <span className="meta-dot-divider" style={{ background: 'rgba(255,255,255,0.4)' }} />
              <div className="blog-detail-meta-item">
                <Calendar size={14} />
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>
              <span className="meta-dot-divider" style={{ background: 'rgba(255,255,255,0.4)' }} />
              <div className="blog-detail-meta-item">
                <Clock size={14} />
                <span>{estimateReadTime(post.body)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="blog-detail-body-wrapper">
        <div className="blog-detail-body-inner">

          {/* Floating Action Bar */}
          <div className="blog-detail-action-bar">
            <Link href="/blog" className="blog-detail-back-btn">
              <ArrowLeft size={15} /> All Articles
            </Link>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`blog-detail-action-btn ${liked ? 'liked' : ''}`}
                onClick={() => setLiked(l => !l)}
                title="Like this article"
              >
                <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
              </button>
              <button
                className="blog-detail-action-btn"
                onClick={handleShare}
                title="Copy link"
              >
                <Share2 size={15} />
                {copied && <span className="copy-tooltip">Copied!</span>}
              </button>
            </div>
          </div>

          {/* Body Content */}
          <article className="blog-detail-article">
            {post.body ? (
              <div className="blog-detail-prose">
                {renderBody(post.body)}
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '15px' }}>
                Content coming soon.
              </p>
            )}
          </article>

          {/* Tags Footer */}
          {(post.tags ?? []).length > 0 && (
            <div className="blog-detail-tags-footer">
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tagged in:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(post.tags ?? []).map(tag => (
                  <Link key={tag} href="/blog" className="blog-detail-tag-footer-pill">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="blog-related-section">
          <div className="container">
            <h3 className="section-title-label">You May Also Like</h3>
            <div className="blog-grid" style={{ marginTop: '28px' }}>
              {related.map(rp => (
                <article key={rp.id} className="blog-card">
                  <Link href={`/blog/${rp.slug}`} className="blog-card-img-link">
                    <div className="blog-card-img-container">
                      {rp.cover_image ? (
                        <img src={rp.cover_image} alt={rp.title} className="blog-card-img" />
                      ) : (
                        <div className="blog-card-img-placeholder-sm">
                          <BookOpen size={28} />
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="blog-card-info">
                    {(rp.tags ?? []).length > 0 && (
                      <div className="blog-card-tags">
                        {(rp.tags ?? []).slice(0, 2).map(t => (
                          <span key={t} className="blog-card-tag-pill">{t}</span>
                        ))}
                      </div>
                    )}
                    <h4 className="blog-card-title">
                      <Link href={`/blog/${rp.slug}`}>{rp.title}</Link>
                    </h4>
                    {rp.excerpt && (
                      <p className="blog-card-excerpt">{rp.excerpt}</p>
                    )}
                    <div className="blog-card-meta" style={{ marginTop: 'auto' }}>
                      <Clock size={11} />
                      <span style={{ marginLeft: '4px' }}>{estimateReadTime(rp.body)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="blog-newsletter">
        <div className="newsletter-box">
          <h3 className="newsletter-title">Subscribe to the Jewelers Journal</h3>
          <p className="newsletter-subtitle">
            Get the latest jewelry trends, gemstone guides, and exclusive offers.
          </p>
          {subscribed ? (
            <div className="newsletter-success">✓ Thank you! Check your email for our welcome guide.</div>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); if (emailInput.trim()) { setSubscribed(true); setEmailInput(''); } }}
              className="newsletter-form"
            >
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
