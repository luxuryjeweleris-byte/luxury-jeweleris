'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, Plus, Search, Edit2, Trash2, Eye, EyeOff,
  Loader2, X, Check, AlertCircle, ChevronRight, Tag, Calendar,
  User, Image as ImageIcon, FileText, Globe, Clock,
} from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { useAdminContext } from '../admin-context';
import '../../../admin/admin.css';

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
  updated_at: string | null;
}

const EMPTY_FORM: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  cover_image: '',
  author_name: 'Luxury Jeweleris',
  tags: [],
  is_published: false,
  published_at: null,
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function estimateReadTime(body: string | null): string {
  if (!body) return '1 min read';
  const words = body.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

export default function AdminBlogPage() {
  const { adminEmail } = useAdminContext();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'published' | 'draft'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [previewCover, setPreviewCover] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPosts((data as BlogPost[]) ?? []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load posts', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const openCreate = () => {
    setEditPost(null);
    setForm(EMPTY_FORM);
    setTagsInput('');
    setPreviewCover('');
    setSlugTouched(false);
    setModalOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? '',
      body: post.body ?? '',
      cover_image: post.cover_image ?? '',
      author_name: post.author_name ?? 'Luxury Jeweleris',
      tags: post.tags ?? [],
      is_published: post.is_published,
      published_at: post.published_at,
    });
    setTagsInput((post.tags ?? []).join(', '));
    setPreviewCover(post.cover_image ?? '');
    setSlugTouched(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditPost(null);
  };

  const handleTitleChange = (val: string) => {
    setForm(f => ({
      ...f,
      title: val,
      slug: slugTouched ? f.slug : slugify(val),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) {
      showToast('Title and Slug are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const parsedTags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const payload = {
        ...form,
        tags: parsedTags.length > 0 ? parsedTags : null,
        cover_image: form.cover_image?.trim() || null,
        excerpt: form.excerpt?.trim() || null,
        body: form.body?.trim() || null,
        published_at: form.is_published
          ? (form.published_at || new Date().toISOString())
          : null,
        updated_at: new Date().toISOString(),
      };

      if (editPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', editPost.id);
        if (error) throw error;
        showToast('Post updated successfully');
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([{ ...payload, created_at: new Date().toISOString() }]);
        if (error) throw error;
        showToast('Post created successfully');
      }

      closeModal();
      fetchPosts();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (post: BlogPost) => {
    const newStatus = !post.is_published;
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          is_published: newStatus,
          published_at: newStatus ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', post.id);
      if (error) throw error;
      showToast(newStatus ? 'Post published' : 'Post unpublished');
      fetchPosts();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', deleteId);
      if (error) throw error;
      showToast('Post deleted');
      setDeleteId(null);
      fetchPosts();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = posts.filter(p => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      filterTab === 'all' ||
      (filterTab === 'published' && p.is_published) ||
      (filterTab === 'draft' && !p.is_published);
    return matchSearch && matchTab;
  });

  return (
    <>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
          padding: '12px 18px', borderRadius: '10px', display: 'flex',
          alignItems: 'center', gap: '10px', fontSize: '13.5px', fontWeight: 600,
          background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'}`,
          color: toast.type === 'success' ? '#6ee7b7' : '#fca5a5',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          animation: 'slideInRight 0.25s ease',
        }}>
          {toast.type === 'success' ? <Check size={15} /> : <AlertCircle size={15} />}
          {toast.msg}
        </div>
      )}

      {/* Topbar */}
      <div className="admin-topbar">
        <span className="admin-topbar-title">Blog Management</span>
        <div className="admin-topbar-right">
          <span style={{ fontSize: '12px', color: '#8892a4' }}>
            {filtered.length} post{filtered.length !== 1 ? 's' : ''}
          </span>
          <div className="admin-avatar">{adminEmail[0]?.toUpperCase() || 'A'}</div>
        </div>
      </div>

      <div className="admin-content">
        {/* Header Row */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8892a4' }} />
            <input
              className="admin-table-search"
              style={{ width: '100%', paddingLeft: '36px', maxWidth: '100%' }}
              placeholder="Search posts by title or slug…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Tabs */}
          <div className="admin-filter-tabs">
            {(['all', 'published', 'draft'] as const).map(tab => (
              <button
                key={tab}
                className={`admin-filter-tab ${filterTab === tab ? 'active' : ''}`}
                onClick={() => setFilterTab(tab)}
              >
                {tab === 'all' ? `All (${posts.length})` :
                 tab === 'published' ? `Published (${posts.filter(p => p.is_published).length})` :
                 `Drafts (${posts.filter(p => !p.is_published).length})`}
              </button>
            ))}
          </div>

          {/* Create Button */}
          <button className="admin-btn admin-btn-primary" onClick={openCreate}>
            <Plus size={14} /> New Post
          </button>
        </div>

        {/* Table */}
        <div className="admin-table-card">
          <div className="admin-table-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} color="#6366f1" /> Blog Posts
            </h3>
            <a
              href="/blog"
              target="_blank"
              style={{ fontSize: '12px', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
            >
              View public blog <ChevronRight size={14} />
            </a>
          </div>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '60px', color: '#8892a4' }}>
              <Loader2 size={24} className="admin-spin" color="#6366f1" />
              <span style={{ fontSize: '13px' }}>Loading blog posts…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#8892a4' }}>
              <BookOpen size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p style={{ fontWeight: 700, fontSize: '14px', color: '#e2e8f0', marginBottom: '6px' }}>
                {search || filterTab !== 'all' ? 'No posts match your filter' : 'No blog posts yet'}
              </p>
              <p style={{ fontSize: '12px' }}>
                {!search && filterTab === 'all' && 'Click "New Post" to create your first article.'}
              </p>
            </div>
          ) : (
            <table className="admin-table admin-table-responsive">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Cover</th>
                  <th>Title & Slug</th>
                  <th>Tags</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(post => (
                  <tr key={post.id}>
                    {/* Cover */}
                    <td data-label="Cover">
                      <div style={{
                        width: '60px', height: '42px', borderRadius: '6px',
                        overflow: 'hidden', background: '#1a2035',
                        border: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {post.cover_image ? (
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <ImageIcon size={16} color="#334155" />
                        )}
                      </div>
                    </td>

                    {/* Title & Slug */}
                    <td data-label="Title" style={{ maxWidth: '280px' }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#e2e8f0', marginBottom: '3px', lineHeight: 1.3 }}>
                        {post.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6366f1', fontFamily: 'monospace' }}>
                        /blog/{post.slug}
                      </div>
                      {post.excerpt && (
                        <div style={{ fontSize: '11px', color: '#8892a4', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '260px' }}>
                          {post.excerpt}
                        </div>
                      )}
                    </td>

                    {/* Tags */}
                    <td data-label="Tags">
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '160px' }}>
                        {(post.tags ?? []).slice(0, 3).map(tag => (
                          <span key={tag} style={{
                            fontSize: '10px', fontWeight: 600, padding: '2px 7px',
                            borderRadius: '10px', background: 'rgba(99,102,241,0.12)',
                            color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)',
                          }}>
                            {tag}
                          </span>
                        ))}
                        {(post.tags ?? []).length > 3 && (
                          <span style={{ fontSize: '10px', color: '#8892a4' }}>
                            +{(post.tags ?? []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Author */}
                    <td data-label="Author" style={{ fontSize: '12px', color: '#8892a4' }}>
                      {post.author_name || 'Luxury Jeweleris'}
                    </td>

                    {/* Status */}
                    <td data-label="Status">
                      <span className={`badge ${post.is_published ? 'badge-delivered' : 'badge-inactive'}`}>
                        {post.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    {/* Date */}
                    <td data-label="Date" style={{ fontSize: '11px', color: '#8892a4', whiteSpace: 'nowrap' }}>
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : post.created_at
                          ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : '—'}
                    </td>

                    {/* Actions */}
                    <td data-label="Actions">
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        {/* Toggle Publish */}
                        <button
                          className={`admin-btn ${post.is_published ? 'admin-btn-ghost' : 'admin-btn-primary'}`}
                          style={{ padding: '6px 10px', fontSize: '11.5px', gap: '5px' }}
                          title={post.is_published ? 'Unpublish' : 'Publish'}
                          onClick={() => togglePublish(post)}
                        >
                          {post.is_published ? <EyeOff size={12} /> : <Eye size={12} />}
                          {post.is_published ? 'Unpublish' : 'Publish'}
                        </button>

                        {/* Edit */}
                        <button
                          className="admin-btn admin-btn-ghost"
                          style={{ padding: '6px 10px', fontSize: '11.5px' }}
                          onClick={() => openEdit(post)}
                          title="Edit post"
                        >
                          <Edit2 size={12} />
                        </button>

                        {/* Delete */}
                        <button
                          className="admin-btn admin-btn-danger"
                          style={{ padding: '6px 10px', fontSize: '11.5px' }}
                          onClick={() => setDeleteId(post.id)}
                          title="Delete post"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Create / Edit Modal ──────────────────────────────────── */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="admin-modal" style={{ maxWidth: '760px', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#e2e8f0' }}>
                  {editPost ? 'Edit Blog Post' : 'New Blog Post'}
                </h3>
                <p style={{ fontSize: '12px', color: '#8892a4', marginTop: '3px' }}>
                  {editPost ? `Editing: ${editPost.slug}` : 'Fill in the details below to create a new article.'}
                </p>
              </div>
              <button
                onClick={closeModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8892a4', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              {/* Basic Info */}
              <div className="admin-form-section">
                <div className="admin-form-section-title">
                  <FileText size={14} /> Post Details
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Title */}
                  <div>
                    <label className="admin-label">Title *</label>
                    <input
                      className="admin-input"
                      style={{ marginBottom: 0 }}
                      placeholder="e.g. How to Choose the Perfect Diamond"
                      value={form.title}
                      onChange={e => handleTitleChange(e.target.value)}
                      required
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="admin-label">Slug * (URL path)</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                        fontSize: '12px', color: '#6366f1', fontFamily: 'monospace',
                      }}>/blog/</span>
                      <input
                        className="admin-input"
                        style={{ marginBottom: 0, paddingLeft: '52px', fontFamily: 'monospace' }}
                        placeholder="your-post-slug"
                        value={form.slug}
                        onChange={e => { setForm(f => ({ ...f, slug: slugify(e.target.value) })); setSlugTouched(true); }}
                        required
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="admin-label">Excerpt (Short Preview)</label>
                    <textarea
                      className="admin-input"
                      style={{ marginBottom: 0, minHeight: '72px', resize: 'vertical', lineHeight: 1.5 }}
                      placeholder="A short 1–2 sentence summary shown in blog cards…"
                      value={form.excerpt ?? ''}
                      onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                    />
                  </div>

                  {/* Body */}
                  <div>
                    <label className="admin-label">
                      Body Content
                      {form.body && (
                        <span style={{ marginLeft: '8px', color: '#6366f1', textTransform: 'none', fontWeight: 500 }}>
                          — {estimateReadTime(form.body)}
                        </span>
                      )}
                    </label>
                    <textarea
                      className="admin-input"
                      style={{ marginBottom: 0, minHeight: '220px', resize: 'vertical', lineHeight: 1.7, fontFamily: 'monospace', fontSize: '13px' }}
                      placeholder="Write your full article here. Markdown-style formatting is supported on the public page.&#10;&#10;Use double newlines for paragraphs.&#10;Use **bold** and *italic* for emphasis."
                      value={form.body ?? ''}
                      onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div className="admin-form-section">
                <div className="admin-form-section-title">
                  <Tag size={14} /> Meta & Media
                </div>

                <div className="admin-form-grid">
                  {/* Author */}
                  <div>
                    <label className="admin-label"><User size={10} style={{ display: 'inline', marginRight: '4px' }} />Author Name</label>
                    <input
                      className="admin-input"
                      style={{ marginBottom: 0 }}
                      placeholder="Luxury Jeweleris"
                      value={form.author_name ?? ''}
                      onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="admin-label"><Tag size={10} style={{ display: 'inline', marginRight: '4px' }} />Tags (comma-separated)</label>
                    <input
                      className="admin-input"
                      style={{ marginBottom: 0 }}
                      placeholder="e.g. Diamonds, Trends, Education"
                      value={tagsInput}
                      onChange={e => setTagsInput(e.target.value)}
                    />
                  </div>

                  {/* Cover Image URL */}
                  <div className="full-span">
                    <label className="admin-label"><ImageIcon size={10} style={{ display: 'inline', marginRight: '4px' }} />Cover Image URL</label>
                    <input
                      className="admin-input"
                      style={{ marginBottom: 0 }}
                      placeholder="https://images.unsplash.com/…"
                      value={form.cover_image ?? ''}
                      onChange={e => { setForm(f => ({ ...f, cover_image: e.target.value })); setPreviewCover(e.target.value); }}
                    />
                    {previewCover && (
                      <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', height: '120px', background: '#1a2035', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <img
                          src={previewCover}
                          alt="Cover preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={() => setPreviewCover('')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Publishing */}
              <div className="admin-form-section">
                <div className="admin-form-section-title">
                  <Globe size={14} /> Publishing
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  {/* Publish Toggle */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                    <div
                      onClick={() => setForm(f => ({ ...f, is_published: !f.is_published }))}
                      style={{
                        width: '42px', height: '24px', borderRadius: '12px',
                        background: form.is_published ? '#6366f1' : 'rgba(255,255,255,0.1)',
                        border: `1px solid ${form.is_published ? '#6366f1' : 'rgba(255,255,255,0.12)'}`,
                        position: 'relative', cursor: 'pointer', transition: 'all 200ms ease',
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: '3px', left: form.is_published ? '20px' : '3px',
                        width: '16px', height: '16px', borderRadius: '50%', background: 'white',
                        transition: 'left 200ms ease', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                      }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: form.is_published ? '#a5b4fc' : '#8892a4' }}>
                      {form.is_published ? '✓ Published (visible on site)' : 'Draft (hidden from public)'}
                    </span>
                  </label>

                  {/* Published At */}
                  {form.is_published && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={13} color="#8892a4" />
                      <input
                        type="date"
                        className="admin-input"
                        style={{ marginBottom: 0, width: 'auto', padding: '7px 12px' }}
                        value={form.published_at ? form.published_at.substring(0, 10) : new Date().toISOString().substring(0, 10)}
                        onChange={e => setForm(f => ({ ...f, published_at: e.target.value ? new Date(e.target.value).toISOString() : null }))}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn admin-btn-ghost" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? <><Loader2 size={14} className="admin-spin" /> Saving…</> : <><Check size={14} /> {editPost ? 'Update Post' : 'Create Post'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ──────────────────────────────────── */}
      {deleteId && (
        <div className="admin-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setDeleteId(null); }}>
          <div className="admin-modal" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={22} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: '17px', color: '#e2e8f0', marginBottom: '8px' }}>Delete Blog Post?</h3>
            <p style={{ fontSize: '13px', color: '#8892a4', marginBottom: '24px', lineHeight: 1.5 }}>
              This action is permanent and cannot be undone. The post and all its content will be removed.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="admin-btn admin-btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? <Loader2 size={14} className="admin-spin" /> : <Trash2 size={14} />}
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
