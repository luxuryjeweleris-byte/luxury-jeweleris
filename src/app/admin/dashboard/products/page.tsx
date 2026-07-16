'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  LogOut, Plus, Pencil, Trash2, Loader2, Search, X, Star,
} from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import type { DbProduct } from '../../../../lib/supabase';
import '../../../admin/admin.css';

const navItems = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/dashboard/products', label: 'Products', icon: Package },
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

const EMPTY_PRODUCT: Partial<DbProduct> = {
  name: '', price: 0, comp_price: 0, category: 'Ring', style: '', shape: 'Round',
  carat: 1.0, color: 'F', clarity: 'VS1', cut: 'Excellent', metal: 'White Gold',
  image: '', description: '', ai_score: 9.0, is_verified: false, is_new: false,
  is_featured: false, is_active: true, stock_qty: 10, tags: [],
};

export default function ProductsAdmin() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<DbProduct | null>(null);
  const [form, setForm] = useState<Partial<DbProduct>>(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    setProducts((data as DbProduct[]) ?? []);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/admin'); return; }
      const { data: adminData } = await supabase.from('admin_users').select('email').eq('user_id', session.user.id).eq('is_active', true).single();
      if (!adminData) { router.push('/admin'); return; }
      setAdminEmail(adminData.email);
      await fetchProducts();
      setLoading(false);
    };
    init();
  }, [router, fetchProducts]);

  const openAdd = () => { setEditing(null); setForm(EMPTY_PRODUCT); setShowModal(true); };
  const openEdit = (p: DbProduct) => { setEditing(p); setForm({ ...p }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name?.trim() || !form.price) return;
    setSaving(true);
    if (editing) {
      await supabase.from('products').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id);
    } else {
      await supabase.from('products').insert({ ...form });
    }
    setSaving(false);
    setShowModal(false);
    await fetchProducts();
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    await supabase.from('products').update({ is_active: false }).eq('id', id);
    setDeleteId(null);
    await fetchProducts();
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const setField = (key: keyof DbProduct, value: unknown) => setForm(f => ({ ...f, [key]: value }));

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
          <span className="admin-topbar-title">Products Management</span>
          <div className="admin-topbar-right">
            <button className="admin-btn admin-btn-primary" onClick={openAdd}>
              <Plus size={15} /> Add Product
            </button>
            <div className="admin-avatar">{adminEmail[0]?.toUpperCase()}</div>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-table-card">
            <div className="admin-table-header">
              <h3>All Products ({filtered.length})</h3>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8892a4' }} />
                <input
                  type="text"
                  className="admin-table-search"
                  placeholder="Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: '32px' }}
                />
              </div>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Score</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: '#8892a4', padding: '40px' }}>No products found</td></tr>
                ) : filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {p.image && <img src={p.image} alt={p.name} className="admin-product-thumb" />}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                          <div style={{ fontSize: '11px', color: '#8892a4' }}>{p.style} · {p.shape}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-confirmed">{p.category}</span></td>
                    <td style={{ fontWeight: 700 }}>${p.price.toLocaleString()}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '12px' }}>
                        <Star size={11} fill="#fbbf24" /> {p.ai_score}
                      </span>
                    </td>
                    <td>{p.stock_qty}</td>
                    <td><span className={`badge ${p.is_active ? 'badge-active' : 'badge-inactive'}`}>{p.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="admin-btn admin-btn-ghost" style={{ padding: '6px 10px' }} onClick={() => openEdit(p)}>
                          <Pencil size={13} />
                        </button>
                        <button
                          className="admin-btn admin-btn-danger"
                          style={{ padding: '6px 10px' }}
                          onClick={() => handleDelete(p.id)}
                          disabled={deleteId === p.id}
                        >
                          {deleteId === p.id ? <Loader2 size={13} className="admin-spin" /> : <Trash2 size={13} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <button style={{ background: 'none', border: 'none', color: '#8892a4', cursor: 'pointer' }} onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="admin-form-grid">
              <div className="full-span">
                <label className="admin-label">Product Name *</label>
                <input className="admin-input" style={{ marginBottom: 0 }} placeholder="e.g. 1.50 ct Round Brilliant Halo Ring" value={form.name ?? ''} onChange={e => setField('name', e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Price ($) *</label>
                <input className="admin-input" style={{ marginBottom: 0 }} type="number" placeholder="0" value={form.price ?? ''} onChange={e => setField('price', parseFloat(e.target.value))} />
              </div>
              <div>
                <label className="admin-label">Comp. Price ($)</label>
                <input className="admin-input" style={{ marginBottom: 0 }} type="number" placeholder="0" value={form.comp_price ?? ''} onChange={e => setField('comp_price', parseFloat(e.target.value))} />
              </div>
              <div>
                <label className="admin-label">Category *</label>
                <select className="admin-select" value={form.category ?? 'Ring'} onChange={e => setField('category', e.target.value)}>
                  {['Ring', 'Earrings', 'Necklace', 'Bracelet', 'Wedding Band', 'Loose Diamond'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Style</label>
                <input className="admin-input" style={{ marginBottom: 0 }} placeholder="e.g. Solitaire, Halo, Pave..." value={form.style ?? ''} onChange={e => setField('style', e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Shape</label>
                <select className="admin-select" value={form.shape ?? 'Round'} onChange={e => setField('shape', e.target.value)}>
                  {['Round', 'Oval', 'Cushion', 'Emerald', 'Princess', 'Radiant', 'Pear', 'Marquise', 'Asscher', 'Heart'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Carat</label>
                <input className="admin-input" style={{ marginBottom: 0 }} type="number" step="0.01" value={form.carat ?? ''} onChange={e => setField('carat', parseFloat(e.target.value))} />
              </div>
              <div>
                <label className="admin-label">Color</label>
                <select className="admin-select" value={form.color ?? 'F'} onChange={e => setField('color', e.target.value)}>
                  {['D', 'E', 'F', 'G', 'H', 'I', 'J'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Clarity</label>
                <select className="admin-select" value={form.clarity ?? 'VS1'} onChange={e => setField('clarity', e.target.value)}>
                  {['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Cut</label>
                <select className="admin-select" value={form.cut ?? 'Excellent'} onChange={e => setField('cut', e.target.value)}>
                  {['Ideal', 'Excellent', 'Very Good', 'Good'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Metal</label>
                <select className="admin-select" value={form.metal ?? 'White Gold'} onChange={e => setField('metal', e.target.value)}>
                  {['White Gold', 'Yellow Gold', 'Rose Gold', 'Platinum', 'Silver'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">AI Score (1-10)</label>
                <input className="admin-input" style={{ marginBottom: 0 }} type="number" step="0.1" min="1" max="10" value={form.ai_score ?? ''} onChange={e => setField('ai_score', parseFloat(e.target.value))} />
              </div>
              <div>
                <label className="admin-label">Stock Qty</label>
                <input className="admin-input" style={{ marginBottom: 0 }} type="number" value={form.stock_qty ?? ''} onChange={e => setField('stock_qty', parseInt(e.target.value))} />
              </div>
              <div className="full-span">
                <label className="admin-label">Image URL</label>
                <input className="admin-input" style={{ marginBottom: 0 }} placeholder="https://..." value={form.image ?? ''} onChange={e => setField('image', e.target.value)} />
              </div>
              <div className="full-span">
                <label className="admin-label">Description</label>
                <textarea className="admin-input" style={{ marginBottom: 0, height: '80px', resize: 'vertical' }} placeholder="Product description..." value={form.description ?? ''} onChange={e => setField('description', e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#e2e8f0' }}>
                  <input type="checkbox" checked={form.is_verified ?? false} onChange={e => setField('is_verified', e.target.checked)} />
                  Verified
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#e2e8f0' }}>
                  <input type="checkbox" checked={form.is_new ?? false} onChange={e => setField('is_new', e.target.checked)} />
                  New
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#e2e8f0' }}>
                  <input type="checkbox" checked={form.is_featured ?? false} onChange={e => setField('is_featured', e.target.checked)} />
                  Featured
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#e2e8f0' }}>
                  <input type="checkbox" checked={form.is_active ?? true} onChange={e => setField('is_active', e.target.checked)} />
                  Active
                </label>
              </div>
            </div>

            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 size={15} className="admin-spin" /> : (editing ? 'Save Changes' : 'Add Product')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
