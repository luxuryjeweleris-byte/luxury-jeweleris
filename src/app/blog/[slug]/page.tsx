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
  if (!body) return '6 min read';
  const words = body.trim().split(/\s+/).length;
  // A realistic, educational reading pace: 130 words per minute
  const mins = Math.max(5, Math.round(words / 130));
  return `${mins} min read`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

/**
 * Markdown renderer — supports #/##/###/#### headings, **bold**, *italic*, `inline code`,
 * fenced code blocks, > blockquotes, --- dividers, links, images, bullet & numbered lists.
 */
function renderBody(body: string): React.ReactNode[] {
  // Extract fenced code blocks to avoid splitting inside them
  const codeBlocks: string[] = [];
  const placeholder = '§CODEBLOCK§';
  const withoutCodes = body.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(code);
    return `${placeholder}${idx}§`;
  });

  const paragraphs = withoutCodes.split(/\n\n+/);
  return paragraphs.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Restore code block
    const codeMatch = trimmed.match(new RegExp(`^${placeholder}(\\d+)§$`));
    if (codeMatch) {
      const code = codeBlocks[parseInt(codeMatch[1], 10)];
      return (
        <pre key={i} className="md-pre"><code>{code.trim()}</code></pre>
      );
    }

    // Horizontal rule
    if (/^---+$/.test(trimmed)) {
      return <hr key={i} className="md-hr" />;
    }

    // Blockquote
    if (trimmed.split('\n').every(l => l.trim().startsWith('>'))) {
      const content = trimmed.split('\n').map(l => l.replace(/^\s*>\s?/, '')).join('\n');
      return <blockquote key={i} className="md-blockquote">{inlineFormat(content)}</blockquote>;
    }

    // Headings
    if (/^####\s+/.test(trimmed)) {
      return <h4 key={i} className="md-h4">{inlineFormat(trimmed.replace(/^####\s+/, ''))}</h4>;
    }
    if (/^###\s+/.test(trimmed)) {
      return <h3 key={i} className="md-h3">{inlineFormat(trimmed.replace(/^###\s+/, ''))}</h3>;
    }
    if (/^##\s+/.test(trimmed)) {
      return <h2 key={i} className="md-h2">{inlineFormat(trimmed.replace(/^##\s+/, ''))}</h2>;
    }
    if (/^#\s+/.test(trimmed)) {
      return <h1 key={i} className="md-h1">{inlineFormat(trimmed.replace(/^#\s+/, ''))}</h1>;
    }

    // Full-block image: ![alt](url)
    if (/^!\[[^\]]*\]\([^)]+\)$/.test(trimmed)) {
      const m = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (m) {
        return <img key={i} src={m[2]} alt={m[1]} className="md-img" loading="lazy" />;
      }
    }

    // Mixed block: image line + HR without blank line (e.g. "![alt](url)\n---")
    if (trimmed.includes('\n')) {
      const lines = trimmed.split('\n');
      const hasImageHr = lines.some(l => /^!\[[^\]]*\]\([^)]+\)$/.test(l.trim()) || /^---+$/.test(l.trim()));
      const isList = lines.every(l => /^[-*•]\s/.test(l.trim()) || /^\d+\.\s/.test(l.trim()));
      if (hasImageHr && !isList) {
        return (
          <React.Fragment key={i}>
            {lines.map((line, j) => {
              const t = line.trim();
              if (!t) return null;
              if (/^!\[[^\]]*\]\([^)]+\)$/.test(t)) {
                const mm = t.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
                return mm ? <img key={j} src={mm[2]} alt={mm[1]} className="md-img" loading="lazy" /> : null;
              }
              if (/^---+$/.test(t)) return <hr key={j} className="md-hr" />;
              if (!t) return null;
              return <p key={j} className="md-p">{inlineFormat(t)}</p>;
            })}
          </React.Fragment>
        );
      }
    }

    // Bullet list
    if (trimmed.split('\n').every(line => /^[-*•]\s/.test(line.trim()))) {
      return (
        <ul key={i} className="md-ul">
          {trimmed.split('\n').map((line, j) => (
            <li key={j} className="md-li">{inlineFormat(line.replace(/^[-*•]\s/, ''))}</li>
          ))}
        </ul>
      );
    }

    // Numbered list
    if (trimmed.split('\n').every(line => /^\d+\.\s/.test(line.trim()))) {
      return (
        <ol key={i} className="md-ol">
          {trimmed.split('\n').map((line, j) => (
            <li key={j} className="md-li">{inlineFormat(line.replace(/^\d+\.\s/, ''))}</li>
          ))}
        </ol>
      );
    }

    // Markdown Table: lines starting and ending with |
    if (trimmed.split('\n').every(line => line.trim().startsWith('|') && line.trim().endsWith('|'))) {
      const lines = trimmed.split('\n').map(l => l.trim());
      if (lines.length >= 2) {
        const headerLine = lines[0];
        const headers = headerLine.split('|').slice(1, -1).map(h => h.trim());
        const dataLines = lines.slice(1).filter(l => !/^[|\s\-:]+$/.test(l));
        const rows = dataLines.map(l => l.split('|').slice(1, -1).map(c => c.trim()));

        return (
          <div key={i} className="md-table-wrapper" style={{ overflowX: 'auto', margin: '28px 0', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <table className="md-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', background: '#ffffff' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  {headers.map((h, hi) => (
                    <th key={hi} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#1e293b' }}>
                      {inlineFormat(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: '1px solid #e2e8f0', background: ri % 2 === 0 ? '#ffffff' : '#fafbfc' }}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ padding: '12px 16px', color: '#334155' }}>
                        {inlineFormat(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }

    // Default paragraph (inline images/links handled by inlineFormat)
    const nodes = inlineFormat(trimmed);
    // If paragraph is only an image node, render without <p> wrapper for better spacing
    return <p key={i} className="md-p">{nodes}</p>;
  }).filter(Boolean) as React.ReactNode[];
}

function inlineFormat(text: string): React.ReactNode {
  // Strip any accidental residual HTML tags
  const clean = text.replace(/<[^>]+>/g, '');
  const tokenRe = /(!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = clean.split(tokenRe);
  return parts.map((part, i) => {
    if (!part) return null;
    // Inline code
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
      return <code key={i} className="md-inline-code">{part.slice(1, -1)}</code>;
    }
    // Image inline
    if (part.startsWith('![')) {
      const m = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (m) return <img key={i} src={m[2]} alt={m[1]} className="md-img-inline" loading="lazy" />;
    }
    // Link
    if (part.startsWith('[')) {
      const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (m) {
        const isInternal = m[2].startsWith('/');
        if (isInternal) {
          return (
            <Link key={i} href={m[2]} className="md-a">
              {m[1]}
            </Link>
          );
        }
        return (
          <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer" className="md-a">
            {m[1]}
          </a>
        );
      }
    }
    // Bold
    if (part.startsWith('**') && part.endsWith('**') && part.length > 3) {
      return <strong key={i} className="md-strong">{part.slice(2, -2)}</strong>;
    }
    // Italic
    if (part.startsWith('*') && part.endsWith('*') && part.length > 1) {
      return <em key={i} className="md-em">{part.slice(1, -1)}</em>;
    }
    // Handle single line breaks inside a paragraph
    if (part.includes('\n')) {
      return part.split('\n').map((seg, j, arr) => (
        <span key={`${i}-${j}`}>{seg}{j < arr.length - 1 ? <br /> : null}</span>
      ));
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
                {Array.from(new Set(post.tags ?? [])).map((tag, idx) => (
                  <Link key={`tag-${idx}-${tag}`} href={`/blog?tag=${encodeURIComponent(tag)}`} className="blog-detail-tag">
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
