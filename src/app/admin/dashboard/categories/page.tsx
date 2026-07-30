'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  LogOut, Plus, Pencil, Trash2, Loader2, Search, X, Image, Upload, Grid
} from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import '../../../admin/admin.css';

const navItems = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/dashboard/products', label: 'Products', icon: Package },
  { href: '/admin/dashboard/categories', label: 'Category Circles', icon: Grid },
  { href: '/admin/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/admin/dashboard/settings', label: 'Settings', icon: Settings },
];

function AdminSidebar({ adminEmail }: { adminEmail: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const handleSignOut = async () => { await supabase.auth.signOut(); router.push('/admin'); };
  return (
    <aside className="admin-sidebar">
      <div className="admin-logo"><h2>Luxury Jeweleris</h2><span>Admin Panel</span></div>
      <nav className="admin-nav">
        <div className="admin-nav-section">Menu</div>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`admin-nav-link ${pathname === href ? 'active' : ''}`}>
            <Icon size={16} />{label}
          </Link>
        ))}
      </nav>
      <div className="admin-sidebar-footer">
        <div style={{ fontSize: '12px', color: '#6366f1', marginBottom: '10px', padding: '0 4px', wordBreak: 'break-all' }}>{adminEmail}</div>
        <button className="admin-nav-link" onClick={handleSignOut}><LogOut size={16} />Sign Out</button>
      </div>
    </aside>
  );
}

export interface DbCategoryCircle {
  id: string;
  name: string;
  img: string;
  link: string;
  sort_order: number;
  is_active: boolean;
}

const DEFAULT_CIRCLES: Omit<DbCategoryCircle, 'id'>[] = [
  { name: 'Engagement rings', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop', link: '/engagement-rings', sort_order: 1, is_active: true },
  { name: 'Earrings', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200&auto=format&fit=crop', link: '/earrings', sort_order: 2, is_active: true },
  { name: 'Wedding bands', img: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=200&auto=format&fit=crop', link: '/wedding-bands', sort_order: 3, is_active: true },
  { name: 'Necklaces', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200&auto=format&fit=crop', link: '/necklaces', sort_order: 4, is_active: true },
  { name: 'Bracelets', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200&auto=format&fit=crop', link: '/bracelets', sort_order: 5, is_active: true },
  { name: 'Three stone', img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=200&auto=format&fit=crop', link: '/engagement-rings', sort_order: 6, is_active: true },
  { name: 'Solitaire', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop', link: '/engagement-rings', sort_order: 7, is_active: true },
  { name: 'Hoops', img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=200&auto=format&fit=crop', link: '/earrings', sort_order: 8, is_active: true },
  { name: 'Gifts', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200&auto=format&fit=crop', link: '/gifts', sort_order: 9, is_active: true },
  { name: 'Tennis bracelets', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200&auto=format&fit=crop', link: '/bracelets', sort_order: 10, is_active: true },
  { name: 'Eternity bands', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop', link: '/wedding-bands', sort_order: 11, is_active: true },
  { name: 'Pearls', img: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=200&auto=format&fit=crop', link: '/necklaces', sort_order: 12, is_active: true },
  { name: 'Men\'s bands', img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=200&auto=format&fit=crop', link: '/wedding-bands', sort_order: 13, is_active: true },
  { name: 'Pendants', img: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=200&auto=format&fit=crop', link: '/necklaces', sort_order: 14, is_active: true },
  { name: 'Pavé', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop', link: '/engagement-rings', sort_order: 15, is_active: true },
  { name: 'Hidden Halo', img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=200&auto=format&fit=crop', link: '/engagement-rings', sort_order: 16, is_active: true },
  { name: 'Stackable rings', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200&auto=format&fit=crop', link: '/wedding-bands', sort_order: 17, is_active: true },
  { name: 'Halo rings', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=200&auto=format&fit=crop', link: '/engagement-rings', sort_order: 18, is_active: true },
];

export default function CategoryCirclesAdmin() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [circles, setCircles] = useState<DbCategoryCircle[]>([]);
  const [editingItem, setEditingItem] = useState<DbCategoryCircle | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<DbCategoryCircle>>({ name: '', img: '', link: '/engagement-rings', sort_order: 1, is_active: true });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchCircles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('category_circles')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (!error && data && data.length > 0) {
        setCircles(data as DbCategoryCircle[]);
      } else {
        // Fallback to default 18 items so cards are immediately visible!
        setCircles(DEFAULT_CIRCLES.map((c, idx) => ({ ...c, id: `default-${idx + 1}` })));
      }
    } catch {
      setCircles(DEFAULT_CIRCLES.map((c, idx) => ({ ...c, id: `default-${idx + 1}` })));
    }
  }, []);

  const seedDefaultCircles = async () => {
    setSeeding(true);
    try {
      const { error } = await supabase.from('category_circles').insert(DEFAULT_CIRCLES);
      if (error) {
        console.error('Seeding error:', error);
        alert('Please run the SQL script in your Supabase SQL Editor first!');
      } else {
        await fetchCircles();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/admin'); return; }
      const { data: adminData } = await supabase.from('admin_users').select('email').eq('user_id', session.user.id).eq('is_active', true).maybeSingle();
      if (!adminData) { router.push('/admin'); return; }
      setAdminEmail(adminData.email);
      await fetchCircles();
      setLoading(false);
    };
    init();
  }, [router, fetchCircles]);

  const openAdd = () => {
    setEditingItem(null);
    setForm({ name: '', img: '', link: '/engagement-rings', sort_order: circles.length + 1, is_active: true });
    setShowModal(true);
  };

  const openEdit = (c: DbCategoryCircle) => {
    setEditingItem(c);
    setForm({ ...c });
    setShowModal(true);
  };

  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) { alert('Failed to upload image.'); return; }
      const data = await res.json();
      if (data.url) {
        setForm(prev => ({ ...prev, img: data.url }));
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image.');
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSave = async () => {
    if (!form.name || !form.img) {
      alert('Please provide category title and image.');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await supabase.from('category_circles').update(form).eq('id', editingItem.id);
      } else {
        await supabase.from('category_circles').insert([form]);
      }
      setShowModal(false);
      await fetchCircles();
    } catch (err) {
      console.error(err);
      alert('Error saving item.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category circle?')) return;
    await supabase.from('category_circles').delete().eq('id', id);
    await fetchCircles();
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1117' }}>
      <Loader2 size={32} className="admin-spin" color="#6366f1" />
    </div>
  );

  return (
    <div className="admin-shell">
      <AdminSidebar adminEmail={adminEmail} />
      <div className="admin-main">
        <div className="admin-topbar">
          <span className="admin-topbar-title">Homepage Category Circles</span>
          <div className="admin-topbar-right">
            {circles.length === 0 && (
              <button className="admin-btn admin-btn-ghost" onClick={seedDefaultCircles} disabled={seeding}>
                {seeding ? <Loader2 size={14} className="admin-spin" /> : '⚡ Load Default 18 Circles'}
              </button>
            )}
            <button className="admin-btn admin-btn-primary" onClick={openAdd}>
              <Plus size={15} /> Add Category Circle
            </button>
            <div className="admin-avatar">{adminEmail[0]?.toUpperCase()}</div>
          </div>
        </div>

        <div className="admin-content">
          <div style={{ marginBottom: '16px', color: '#94a3b8', fontSize: '13px' }}>
            Manage the circular category & style shortcut images displayed on your website homepage. You can upload custom images for each category or style.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {circles.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', background: '#131828', padding: '40px', borderRadius: '12px', textAlign: 'center', color: '#94a3b8', border: '1px dashed #334155' }}>
                <Grid size={36} color="#6366f1" style={{ marginBottom: '12px' }} />
                <h4 style={{ color: '#f8fafc', fontSize: '16px' }}>No Category Circles in Database Yet</h4>
                <p style={{ fontSize: '13px', marginTop: '4px', marginBottom: '16px' }}>Click below to populate the database with default 18 category circles or add a custom one.</p>
                <button className="admin-btn admin-btn-primary" onClick={seedDefaultCircles} disabled={seeding}>
                  {seeding ? <Loader2 size={14} className="admin-spin" /> : 'Populate Default 18 Circles'}
                </button>
              </div>
            ) : (
              circles.map((c) => (
                <div key={c.id} style={{ background: '#131828', borderRadius: '12px', border: '1px solid var(--admin-border)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                  
                  {/* Circle Image Preview */}
                  <div style={{ width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #6366f1', marginBottom: '12px', position: 'relative', background: '#000' }}>
                    <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#f8fafc', marginBottom: '4px' }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: '#6366f1', wordBreak: 'break-all', marginBottom: '12px' }}>{c.link}</div>

                  <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: 'auto' }}>
                    <button className="admin-btn admin-btn-ghost" style={{ flex: 1, justifyContent: 'center', padding: '6px' }} onClick={() => openEdit(c)}>
                      <Pencil size={13} /> Edit
                    </button>
                    <button className="admin-btn admin-btn-danger" style={{ padding: '6px 10px' }} onClick={() => handleDelete(c.id)}>
                      <Trash2 size={13} />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>
                {editingItem ? 'Edit Category Circle' : 'Add Category Circle'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="admin-label">Category Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.name || ''}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Engagement rings, Earrings"
                />
              </div>

              <div>
                <label className="admin-label">Link URL</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.link || ''}
                  onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                  placeholder="e.g. /engagement-rings or /earrings"
                />
              </div>

                {/* Drag & Drop Upload Zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  style={{
                    border: isDragging ? '2px dashed #6366f1' : '2px dashed #334155',
                    background: isDragging ? 'rgba(99, 102, 241, 0.1)' : '#131828',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    position: 'relative'
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                  />
                  
                  {form.img ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <img src={form.img} alt="preview" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6366f1' }} />
                      <span style={{ fontSize: '12px', color: '#a5b4fc' }}>Drag & drop or click to replace image</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      {uploading ? <Loader2 size={24} className="admin-spin" color="#6366f1" /> : <Upload size={24} color="#6366f1" />}
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                        Drag & Drop image here
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        or click to browse from computer
                      </span>
                    </div>
                  )}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 size={14} className="admin-spin" /> : 'Save Circle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
