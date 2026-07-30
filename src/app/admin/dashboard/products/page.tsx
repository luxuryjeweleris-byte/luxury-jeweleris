'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  LogOut, Plus, Pencil, Trash2, Loader2, Search, X, Star, Image, Upload, Trash,
  Filter, Grid, List, CheckCircle2, AlertCircle, Eye, EyeOff, ChevronLeft, ChevronRight, SlidersHorizontal, Layers
} from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import type { DbProduct } from '../../../../lib/supabase';
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

const EMPTY_PRODUCT: Partial<DbProduct> = {
  name: '', price: 0, comp_price: 0, category: 'Ring', style: '', shape: 'Round',
  carat: 1.0, color: 'F', cut: 'Excellent', metal: 'White Gold',
  image: '', description: '', is_verified: false, is_new: false,
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
  const [activeMetalTab, setActiveMetalTab] = useState<'default' | 'yellow' | 'rose' | 'platinum' | 'silver'>('default');
  const [uploadingSlotIndex, setUploadingSlotIndex] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

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
      const { data: adminData } = await supabase.from('admin_users').select('email').eq('user_id', session.user.id).eq('is_active', true).maybeSingle();
      if (!adminData) { router.push('/admin'); return; }
      setAdminEmail(adminData.email);
      await fetchProducts();
      setLoading(false);
    };
    init();
  }, [router, fetchProducts]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_PRODUCT);
    setActiveMetalTab('default');
    setImagePreview('');
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (p: DbProduct) => {
    setEditing(p);
    setForm({ ...p });
    const initialTab = p.metal === 'Yellow Gold' ? 'yellow' : p.metal === 'Rose Gold' ? 'rose' : p.metal === 'Platinum' ? 'platinum' : 'default';
    setActiveMetalTab(initialTab);
    setImagePreview(p.image || '');
    setShowModal(true);
  };

  const extractPublicId = (url: string): string | null => {
    try {
      const parts = url.split('/');
      const uploadIndex = parts.indexOf('upload');
      if (uploadIndex === -1) return null;
      const versionAndPath = parts.slice(uploadIndex + 2).join('/');
      return versionAndPath.replace(/\.[^/.]+$/, '');
    } catch {
      return null;
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload error:', errorData);
        alert('Failed to upload image. Please try again.');
        return;
      }

      const data = await response.json();
      const imageUrl = data.url;

      if (!imageUrl) {
        throw new Error('No URL returned from upload');
      }

      if (activeMetalTab === 'yellow') {
        setForm(f => ({ ...f, image_yellow_gold: imageUrl }));
      } else if (activeMetalTab === 'rose') {
        setForm(f => ({ ...f, image_rose_gold: imageUrl }));
      } else if (activeMetalTab === 'platinum') {
        setForm(f => ({ ...f, image_platinum: imageUrl }));
      } else if (activeMetalTab === 'silver') {
        setForm(f => ({ ...f, image_silver: imageUrl }));
      } else {
        setForm(f => ({ ...f, image: imageUrl }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please check your connection and try again.');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleImageRemove = async () => {
    const currentImg = activeMetalTab === 'yellow' ? form.image_yellow_gold :
                      activeMetalTab === 'rose' ? form.image_rose_gold :
                      activeMetalTab === 'platinum' ? form.image_platinum :
                      activeMetalTab === 'silver' ? form.image_silver : form.image;

    if (currentImg && currentImg.includes('cloudinary.com')) {
      try {
        const publicId = extractPublicId(currentImg);
        if (publicId) {
          await fetch('/api/upload/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ public_id: publicId }),
          });
        }
      } catch (error) {
        console.error('Error removing image from Cloudinary:', error);
      }
    }

    if (activeMetalTab === 'yellow') setForm(f => ({ ...f, image_yellow_gold: '' }));
    else if (activeMetalTab === 'rose') setForm(f => ({ ...f, image_rose_gold: '' }));
    else if (activeMetalTab === 'platinum') setForm(f => ({ ...f, image_platinum: '' }));
    else if (activeMetalTab === 'silver') setForm(f => ({ ...f, image_silver: '' }));
    else setForm(f => ({ ...f, image: '' }));
  };

  const handleSave = async () => {
    if (!form.name?.trim() || !form.price) return;
    setSaving(true);
    try {
      if (editing) {
        await supabase.from('products').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id);
      } else {
        await supabase.from('products').insert({ ...form });
      }
      setSaving(false);
      setShowModal(false);
      await fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will hide it from the store.`)) return;
    setDeleteId(id);
    await supabase.from('products').update({ is_active: false }).eq('id', id);
    setDeleteId(null);
    await fetchProducts();
  };

  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'featured' | 'out_of_stock'>('all');
  const [metalFilter, setMetalFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_high' | 'price_low' | 'name' | 'stock'>('newest');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const CATEGORY_TABS = [
    'All',
    'Ring',
    'Wedding Band',
    'Diamond',
    'Earring',
    'Necklace',
    'Bracelet',
    'Gift'
  ];

  const stats = React.useMemo(() => {
    const total = products.length;
    const active = products.filter(p => p.is_active).length;
    const featured = products.filter(p => p.is_featured).length;
    const outOfStock = products.filter(p => (p.stock_qty ?? 0) <= 0).length;
    return { total, active, featured, outOfStock };
  }, [products]);

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    CATEGORY_TABS.forEach(tab => {
      if (tab !== 'All') {
        counts[tab] = products.filter(p => p.category?.toLowerCase().includes(tab.toLowerCase())).length;
      }
    });
    return counts;
  }, [products]);

  const filtered = React.useMemo(() => {
    return products.filter(p => {
      // Category Tab filter
      if (selectedCategoryTab !== 'All') {
        const cat = (p.category || '').toLowerCase();
        const target = selectedCategoryTab.toLowerCase();
        if (!cat.includes(target)) return false;
      }

      // Status filter
      if (statusFilter === 'active' && !p.is_active) return false;
      if (statusFilter === 'featured' && !p.is_featured) return false;
      if (statusFilter === 'out_of_stock' && (p.stock_qty ?? 0) > 0) return false;

      // Metal filter
      if (metalFilter !== 'all') {
        const metalStr = (p.metal || '').toLowerCase();
        if (!metalStr.includes(metalFilter.toLowerCase())) return false;
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const nameMatch = p.name.toLowerCase().includes(q);
        const catMatch = (p.category || '').toLowerCase().includes(q);
        const metalMatch = (p.metal || '').toLowerCase().includes(q);
        const styleMatch = (p.style || '').toLowerCase().includes(q);
        if (!nameMatch && !catMatch && !metalMatch && !styleMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'stock') return (a.stock_qty ?? 0) - (b.stock_qty ?? 0);
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });
  }, [products, selectedCategoryTab, statusFilter, metalFilter, search, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedProducts = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const toggleActiveStatus = async (p: DbProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextVal = !p.is_active;
    setProducts(prev => prev.map(item => item.id === p.id ? { ...item, is_active: nextVal } : item));
    await supabase.from('products').update({ is_active: nextVal }).eq('id', p.id);
  };

  const toggleFeaturedStatus = async (p: DbProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextVal = !p.is_featured;
    setProducts(prev => prev.map(item => item.id === p.id ? { ...item, is_featured: nextVal } : item));
    await supabase.from('products').update({ is_featured: nextVal }).eq('id', p.id);
  };

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
          <span className="admin-topbar-title">Catalog & Inventory Management</span>
          <div className="admin-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* View Mode Switcher (Table vs Grid) */}
            <div style={{ display: 'inline-flex', background: '#131828', border: '1px solid var(--admin-border)', padding: '3px', borderRadius: '8px', gap: '3px' }}>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                style={{
                  background: viewMode === 'table' ? '#6366f1' : 'transparent',
                  color: viewMode === 'table' ? '#ffffff' : '#94a3b8',
                  border: 'none', padding: '6px 12px', borderRadius: '6px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '12px', fontWeight: 600, transition: 'all 150ms ease'
                }}
                title="Switch to Table View"
              >
                <List size={14} />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  background: viewMode === 'grid' ? '#6366f1' : 'transparent',
                  color: viewMode === 'grid' ? '#ffffff' : '#94a3b8',
                  border: 'none', padding: '6px 12px', borderRadius: '6px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '12px', fontWeight: 600, transition: 'all 150ms ease'
                }}
                title="Switch to Grid View"
              >
                <Grid size={14} />
                <span>Grid View</span>
              </button>
            </div>

            <button className="admin-btn admin-btn-primary" onClick={openAdd}>
              <Plus size={15} /> Add New Product
            </button>
            <div className="admin-avatar">{adminEmail[0]?.toUpperCase()}</div>
          </div>
        </div>

        <div className="admin-content">

          {/* Sleek Minimal Metric Pills Row */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ background: '#131828', border: '1px solid var(--admin-border)', padding: '10px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Package size={16} color="#6366f1" />
              <span style={{ fontSize: '13px', color: 'var(--admin-muted)' }}>Total Catalog:</span>
              <strong style={{ fontSize: '15px', color: '#f8fafc' }}>{stats.total}</strong>
            </div>

            <div style={{ background: '#131828', border: '1px solid var(--admin-border)', padding: '10px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span style={{ fontSize: '13px', color: 'var(--admin-muted)' }}>Active Storefront:</span>
              <strong style={{ fontSize: '15px', color: '#10b981' }}>{stats.active}</strong>
            </div>

            <div style={{ background: '#131828', border: '1px solid var(--admin-border)', padding: '10px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Star size={16} color="#f59e0b" />
              <span style={{ fontSize: '13px', color: 'var(--admin-muted)' }}>Featured Items:</span>
              <strong style={{ fontSize: '15px', color: '#f59e0b' }}>{stats.featured}</strong>
            </div>

            <div style={{ background: '#131828', border: '1px solid var(--admin-border)', padding: '10px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={16} color={stats.outOfStock > 0 ? '#ef4444' : '#64748b'} />
              <span style={{ fontSize: '13px', color: 'var(--admin-muted)' }}>Out of Stock:</span>
              <strong style={{ fontSize: '15px', color: stats.outOfStock > 0 ? '#ef4444' : '#f8fafc' }}>{stats.outOfStock}</strong>
            </div>
          </div>

          {/* Category Navigation Tabs Bar */}
          <div className="admin-filter-tabs" style={{ marginBottom: '16px', background: 'transparent', padding: '0', display: 'flex', gap: '8px', flexWrap: 'wrap', overflow: 'visible' }}>
            {CATEGORY_TABS.map(tab => {
              const isActive = selectedCategoryTab === tab;
              const count = categoryCounts[tab] || 0;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setSelectedCategoryTab(tab);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: isActive ? 600 : 500,
                    background: isActive ? '#6366f1' : '#131828',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    border: '1px solid',
                    borderColor: isActive ? '#6366f1' : 'var(--admin-border)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    transition: 'all 150ms ease'
                  }}
                >
                  {tab === 'All' ? 'All Jewelry' : `${tab}s`}
                  <span style={{
                    fontSize: '10.5px',
                    background: isActive ? 'rgba(255,255,255,0.2)' : '#1e293b',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontWeight: 600
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Table Container Card */}
          <div className="admin-table-card">
            
            {/* Filter & Toolbar Row */}
            <div style={{
              padding: '12px 18px',
              borderBottom: '1px solid var(--admin-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              background: 'rgba(0,0,0,0.12)',
              flexWrap: 'wrap',
              overflow: 'visible'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
                {/* Search Bar */}
                <div style={{ position: 'relative', minWidth: '200px', flex: '1 1 240px', maxWidth: '360px' }}>
                  <Search size={13} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    className="admin-table-search"
                    placeholder="Search products..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                    style={{ paddingLeft: '32px', paddingRight: search ? '30px' : '12px', width: '100%', height: '36px', fontSize: '12.5px', borderRadius: '8px', boxSizing: 'border-box' }}
                  />
                  {search && (
                    <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Metal Filter */}
                <select
                  className="admin-select"
                  value={metalFilter}
                  onChange={e => { setMetalFilter(e.target.value); setCurrentPage(1); }}
                  style={{ height: '36px', padding: '0 28px 0 10px', fontSize: '12px', borderRadius: '8px' }}
                >
                  <option value="all">All Metals</option>
                  <option value="White Gold">White Gold</option>
                  <option value="Yellow Gold">Yellow Gold</option>
                  <option value="Rose Gold">Rose Gold</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Silver">Silver</option>
                </select>

                {/* Status Filter */}
                <select
                  className="admin-select"
                  value={statusFilter}
                  onChange={e => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
                  style={{ height: '36px', padding: '0 28px 0 10px', fontSize: '12px', borderRadius: '8px' }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="featured">Featured Only</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>

                {/* Sort */}
                <select
                  className="admin-select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  style={{ height: '36px', padding: '0 28px 0 10px', fontSize: '12px', borderRadius: '8px' }}
                >
                  <option value="newest">Newest First</option>
                  <option value="price_high">Price: High → Low</option>
                  <option value="price_low">Price: Low → High</option>
                  <option value="name">Name A–Z</option>
                  <option value="stock">Low Stock First</option>
                </select>
              </div>
            </div>

            {/* Results Count & Active Filter Indicator */}
            <div style={{ padding: '12px 20px', fontSize: '12.5px', color: '#94a3b8', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                Showing <strong>{filtered.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> - <strong>{Math.min(currentPage * itemsPerPage, filtered.length)}</strong> of <strong>{filtered.length}</strong> products
                {selectedCategoryTab !== 'All' && <span style={{ color: '#6366f1', marginLeft: '6px' }}>in {selectedCategoryTab}s</span>}
              </div>
              {filtered.length < products.length && (
                <button
                  onClick={() => {
                    setSelectedCategoryTab('All');
                    setStatusFilter('all');
                    setMetalFilter('all');
                    setSearch('');
                    setCurrentPage(1);
                  }}
                  style={{ background: 'none', border: 'none', color: '#a5b4fc', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* View Mode 1: Table View */}
            {viewMode === 'table' && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product & Metals</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Visibility</th>
                    <th>Featured</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: '#8892a4', padding: '60px 20px' }}>
                        <Package size={36} color="#334155" style={{ marginBottom: '10px' }} />
                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc' }}>No products found</div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Try adjusting your search filters or add a new product.</div>
                      </td>
                    </tr>
                  ) : paginatedProducts.map(p => {
                    const metalDots = [
                      { label: 'White Gold', color: '#E2E7EB', hasPhoto: Boolean(p.image || (p.images_white_gold && p.images_white_gold.length > 0)) },
                      { label: 'Yellow Gold', color: '#E2C379', hasPhoto: Boolean(p.image_yellow_gold || (p.images_yellow_gold && p.images_yellow_gold.length > 0)) },
                      { label: 'Rose Gold', color: '#D99F8D', hasPhoto: Boolean(p.image_rose_gold || (p.images_rose_gold && p.images_rose_gold.length > 0)) },
                      { label: 'Platinum', color: '#C8CDD0', hasPhoto: Boolean(p.image_platinum || (p.images_platinum && p.images_platinum.length > 0)) },
                      { label: 'Silver', color: '#D2D7DF', hasPhoto: Boolean(p.image_silver || (p.images_silver && p.images_silver.length > 0)) },
                    ];

                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            {p.image ? (
                              <img src={p.image} alt={p.name} className="admin-product-thumb" loading="lazy" />
                            ) : (
                              <div style={{ width: '44px', height: '44px', background: '#1a2035', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Image size={20} color="#64748b" />
                              </div>
                            )}
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '13.5px', color: '#f8fafc', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>{p.metal || 'White Gold'} · {p.shape || 'Round'}</span>
                                {/* Photo indicator dots */}
                                <div style={{ display: 'inline-flex', gap: '3px', marginLeft: '4px' }}>
                                  {metalDots.map(d => (
                                    <span key={d.label} style={{ width: '6px', height: '6px', borderRadius: '50%', background: d.hasPhoto ? d.color : '#334155', display: 'inline-block' }} title={`${d.label}: ${d.hasPhoto ? 'Photo Uploaded' : 'No Photo'}`} />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="badge badge-confirmed" style={{ fontSize: '11px' }}>
                            {p.category}
                          </span>
                        </td>

                        <td>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: '#f8fafc' }}>
                            ${p.price?.toLocaleString()}
                          </div>
                          {p.comp_price && p.comp_price > p.price && (
                            <div style={{ fontSize: '11px', color: '#64748b', textDecoration: 'line-through' }}>
                              ${p.comp_price.toLocaleString()}
                            </div>
                          )}
                        </td>

                        <td>
                          <span className={`badge ${p.stock_qty <= 0 ? 'badge-alert' : p.stock_qty <= 3 ? 'badge-pending' : 'badge-confirmed'}`} style={{ fontSize: '11px' }}>
                            {p.stock_qty <= 0 ? 'Out of Stock' : `${p.stock_qty} in stock`}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            onClick={(e) => toggleActiveStatus(p, e)}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '5px',
                              padding: '5px 10px', borderRadius: '6px', cursor: 'pointer',
                              fontSize: '12px', fontWeight: 600, border: 'none',
                              background: p.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)',
                              color: p.is_active ? '#6ee7b7' : '#94a3b8',
                              transition: 'all 150ms ease'
                            }}
                            title={p.is_active ? 'Click to hide from store' : 'Click to make visible on store'}
                          >
                            {p.is_active ? <Eye size={13} /> : <EyeOff size={13} />}
                            {p.is_active ? 'Live' : 'Hidden'}
                          </button>
                        </td>

                        <td>
                          <button
                            type="button"
                            onClick={(e) => toggleFeaturedStatus(p, e)}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '5px',
                              padding: '5px 10px', borderRadius: '6px', cursor: 'pointer',
                              fontSize: '12px', fontWeight: 600,
                              background: p.is_featured ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.04)',
                              color: p.is_featured ? '#f59e0b' : '#64748b',
                              border: p.is_featured ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(255,255,255,0.08)',
                              transition: 'all 150ms ease'
                            }}
                            title={p.is_featured ? 'Click to remove from homepage' : 'Click to feature on homepage'}
                          >
                            <Star size={13} fill={p.is_featured ? '#f59e0b' : 'none'} />
                            {p.is_featured ? 'Featured' : 'Not Featured'}
                          </button>
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              className="admin-btn admin-btn-ghost"
                              style={{ padding: '7px 14px', fontSize: '12.5px' }}
                              onClick={() => openEdit(p)}
                              title="Edit this product"
                            >
                              <Pencil size={13} /> Edit
                            </button>
                            <button
                              className="admin-btn admin-btn-danger"
                              style={{ padding: '7px 12px', fontSize: '12.5px' }}
                              onClick={() => handleDelete(p.id, p.name)}
                              disabled={deleteId === p.id}
                              title="Delete this product"
                            >
                              {deleteId === p.id ? <Loader2 size={13} className="admin-spin" /> : <><Trash2 size={13} /> Delete</>}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* View Mode 2: Grid Card View */}
            {viewMode === 'grid' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', padding: '20px' }}>
                {paginatedProducts.length === 0 ? (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                    <Package size={40} color="#334155" style={{ marginBottom: '12px' }} />
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc' }}>No products found</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Try adjusting your filters or add a new product.</div>
                  </div>
                ) : paginatedProducts.map(p => {
                  const metalDots = [
                    { label: 'White Gold', color: '#E2E7EB', has: Boolean(p.image) },
                    { label: 'Yellow Gold', color: '#E2C379', has: Boolean(p.image_yellow_gold) },
                    { label: 'Rose Gold', color: '#D99F8D', has: Boolean(p.image_rose_gold) },
                    { label: 'Platinum', color: '#C8CDD0', has: Boolean(p.image_platinum) },
                    { label: 'Silver', color: '#D2D7DF', has: Boolean(p.image_silver) },
                  ];
                  const hasPhoto = metalDots.some(d => d.has);

                  return (
                    <div key={p.id} style={{
                      background: 'linear-gradient(160deg, #141c2e 0%, #0f1624 100%)',
                      borderRadius: '14px',
                      border: '1px solid var(--admin-border)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'border-color 200ms, box-shadow 200ms',
                    }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = '#6366f1';
                        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 1px rgba(99,102,241,0.3), 0 8px 32px rgba(0,0,0,0.4)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--admin-border)';
                        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                      }}
                    >
                      {/* Image Area */}
                      <div style={{ position: 'relative', width: '100%', height: '180px', background: '#0b0f19', overflow: 'hidden', flexShrink: 0 }}>
                        {hasPhoto ? (
                          <img
                            src={p.image || p.image_yellow_gold || p.image_rose_gold || p.image_platinum || p.image_silver || ''}
                            alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#334155', gap: '8px' }}>
                            <Image size={36} />
                            <span style={{ fontSize: '11px', color: '#475569' }}>No image</span>
                          </div>
                        )}

                        {/* Status badge top-left */}
                        <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          <span style={{
                            background: p.is_active ? 'rgba(16,185,129,0.9)' : 'rgba(71,85,105,0.9)',
                            backdropFilter: 'blur(6px)',
                            color: '#fff', fontSize: '10px', fontWeight: 700,
                            padding: '2px 7px', borderRadius: '5px', letterSpacing: '0.3px'
                          }}>
                            {p.is_active ? '● Live' : '○ Hidden'}
                          </span>
                          {p.is_featured && (
                            <span style={{
                              background: 'rgba(245,158,11,0.9)', backdropFilter: 'blur(6px)',
                              color: '#000', fontSize: '10px', fontWeight: 700,
                              padding: '2px 7px', borderRadius: '5px'
                            }}>★ Featured</span>
                          )}
                          {p.is_new && (
                            <span style={{
                              background: 'rgba(99,102,241,0.9)', backdropFilter: 'blur(6px)',
                              color: '#fff', fontSize: '10px', fontWeight: 700,
                              padding: '2px 7px', borderRadius: '5px'
                            }}>New</span>
                          )}
                        </div>

                        {/* Stock badge top-right */}
                        <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                          <span style={{
                            background: p.stock_qty <= 0 ? 'rgba(239,68,68,0.9)' : p.stock_qty <= 3 ? 'rgba(245,158,11,0.9)' : 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(6px)',
                            color: '#fff', fontSize: '10px', fontWeight: 600,
                            padding: '2px 7px', borderRadius: '5px'
                          }}>
                            {p.stock_qty <= 0 ? 'Out of stock' : `${p.stock_qty} in stock`}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>

                        {/* Category + Metal dots */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '10.5px', color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{p.category}</span>
                          <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                            {metalDots.map(d => (
                              <span
                                key={d.label}
                                title={`${d.label}: ${d.has ? '✓ Photo' : 'No photo'}`}
                                style={{
                                  width: '7px', height: '7px', borderRadius: '50%',
                                  background: d.has ? d.color : '#1e293b',
                                  border: d.has ? `1px solid ${d.color}` : '1px solid #334155',
                                  display: 'inline-block', cursor: 'default'
                                }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Product Name */}
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#f1f5f9', lineHeight: '1.35', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {p.name}
                        </div>

                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <span style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>${p.price?.toLocaleString()}</span>
                          {p.comp_price && p.comp_price > p.price && (
                            <span style={{ fontSize: '11.5px', color: '#64748b', textDecoration: 'line-through' }}>${p.comp_price.toLocaleString()}</span>
                          )}
                        </div>

                        {/* Quick-toggle row */}
                        <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                          <button
                            type="button"
                            onClick={(e) => toggleActiveStatus(p, e)}
                            style={{
                              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                              padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                              background: p.is_active ? 'rgba(16,185,129,0.12)' : 'rgba(100,116,139,0.12)',
                              color: p.is_active ? '#6ee7b7' : '#94a3b8',
                              border: p.is_active ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(100,116,139,0.25)',
                              transition: 'all 150ms'
                            }}
                            title={p.is_active ? 'Click to hide from store' : 'Click to make visible'}
                          >
                            {p.is_active ? <Eye size={11} /> : <EyeOff size={11} />}
                            {p.is_active ? 'Live' : 'Hidden'}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => toggleFeaturedStatus(p, e)}
                            style={{
                              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                              padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                              background: p.is_featured ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.04)',
                              color: p.is_featured ? '#f59e0b' : '#64748b',
                              border: p.is_featured ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(255,255,255,0.08)',
                              transition: 'all 150ms'
                            }}
                            title={p.is_featured ? 'Remove from homepage' : 'Feature on homepage'}
                          >
                            <Star size={11} fill={p.is_featured ? '#f59e0b' : 'none'} />
                            {p.is_featured ? 'Featured' : 'Feature'}
                          </button>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div style={{ display: 'flex', gap: '0', borderTop: '1px solid var(--admin-border)' }}>
                        <button
                          className="admin-btn admin-btn-ghost"
                          style={{ flex: 1, justifyContent: 'center', borderRadius: '0 0 0 14px', border: 'none', padding: '10px 8px', fontSize: '12.5px', borderRight: '1px solid var(--admin-border)' }}
                          onClick={() => openEdit(p)}
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          className="admin-btn admin-btn-danger"
                          style={{ flex: 1, justifyContent: 'center', borderRadius: '0 0 14px 0', border: 'none', padding: '10px 8px', fontSize: '12.5px' }}
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deleteId === p.id}
                        >
                          {deleteId === p.id ? <Loader2 size={13} className="admin-spin" /> : <><Trash2 size={13} /> Delete</>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}


            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid var(--admin-border)', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className="admin-btn admin-btn-ghost"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
                  >
                    <ChevronLeft size={15} /> Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: currentPage === page ? '#6366f1' : '#1e293b',
                        color: currentPage === page ? '#ffffff' : '#94a3b8',
                        fontWeight: currentPage === page ? 700 : 500,
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className="admin-btn admin-btn-ghost"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{ opacity: currentPage === totalPages ? 0.4 : 1 }}
                  >
                    Next <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal admin-modal-lg" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--admin-border)' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Package size={22} color="#6366f1" />
                  {editing ? 'Edit Jewelry Item' : 'Add New Jewelry Product'}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--admin-muted)', marginTop: '4px' }}>
                  {editing ? `Updating product details for ${editing.name}` : 'Enter luxury product attributes, pricing, specifications, and media.'}
                </p>
              </div>
              <button
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border)', color: '#8892a4', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => setShowModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Section 1: General Product Information */}
            <div className="admin-form-section">
              <div className="admin-form-section-title">
                <Package size={16} /> Basic Product Details
              </div>
              <div className="admin-form-grid">
                <div className="full-span">
                  <label className="admin-label">Product Title / Name *</label>
                  <input
                    className="admin-input"
                    style={{ marginBottom: 0, fontSize: '14.5px', padding: '12px 16px' }}
                    placeholder="e.g. 2.00 Carat Cushion Cut Solitaire Diamond Ring"
                    value={form.name ?? ''}
                    onChange={e => setField('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="admin-label">Category *</label>
                  <select
                    className="admin-select"
                    value={form.category ?? 'Ring'}
                    onChange={e => setField('category', e.target.value)}
                  >
                    {['Ring', 'Earrings', 'Necklace', 'Bracelet', 'Wedding Band', 'Loose Diamond'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Setting Style</label>
                  <input
                    className="admin-input"
                    style={{ marginBottom: 0 }}
                    placeholder="e.g. Solitaire, Halo, Pave, Hidden Halo"
                    value={form.style ?? ''}
                    onChange={e => setField('style', e.target.value)}
                  />
                </div>
                <div className="full-span">
                  <label className="admin-label">Product Description</label>
                  <textarea
                    className="admin-input"
                    style={{ marginBottom: 0, height: '90px', resize: 'vertical', lineHeight: '1.5' }}
                    placeholder="Describe the craftsmanship, gemstone brilliance, certification, and details..."
                    value={form.description ?? ''}
                    onChange={e => setField('description', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & Inventory */}
            <div className="admin-form-section">
              <div className="admin-form-section-title">
                <Star size={16} color="#fbbf24" /> Pricing & Inventory
              </div>
              <div className="admin-form-grid-3">
                <div>
                  <label className="admin-label">Selling Price ($) *</label>
                  <input
                    className="admin-input"
                    style={{ marginBottom: 0, fontWeight: 700, color: '#10b981' }}
                    type="number"
                    placeholder="0.00"
                    value={form.price ?? ''}
                    onChange={e => setField('price', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="admin-label">Compare At Price ($)</label>
                  <input
                    className="admin-input"
                    style={{ marginBottom: 0 }}
                    type="number"
                    placeholder="0.00"
                    value={form.comp_price ?? ''}
                    onChange={e => setField('comp_price', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="admin-label">Stock Quantity *</label>
                  <input
                    className="admin-input"
                    style={{ marginBottom: 0 }}
                    type="number"
                    placeholder="10"
                    value={form.stock_qty ?? ''}
                    onChange={e => setField('stock_qty', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Diamond & Gemstone Specifications */}
            <div className="admin-form-section">
              <div className="admin-form-section-title">
                <Star size={16} color="#a5b4fc" /> Diamond & Gemstone Specifications
              </div>
              <div className="admin-form-grid-3">
                <div>
                  <label className="admin-label">Carat Weight (ct)</label>
                  <input
                    className="admin-input"
                    style={{ marginBottom: 0 }}
                    type="number"
                    step="0.01"
                    placeholder="1.00"
                    value={form.carat ?? ''}
                    onChange={e => setField('carat', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="admin-label">Gemstone Shape</label>
                  <select
                    className="admin-select"
                    value={form.shape ?? 'Round'}
                    onChange={e => setField('shape', e.target.value)}
                  >
                    {['Round', 'Oval', 'Cushion', 'Emerald', 'Princess', 'Radiant', 'Pear', 'Marquise', 'Asscher', 'Heart'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Color Grade</label>
                  <select
                    className="admin-select"
                    value={form.color ?? 'F'}
                    onChange={e => setField('color', e.target.value)}
                  >
                    {['D', 'E', 'F', 'G', 'H', 'I', 'J'].map(c => (
                      <option key={c} value={c}>Grade {c} {c === 'D' || c === 'E' || c === 'F' ? '(Colorless)' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Cut Grade</label>
                  <select
                    className="admin-select"
                    value={form.cut ?? 'Excellent'}
                    onChange={e => setField('cut', e.target.value)}
                  >
                    {['Ideal', 'Excellent', 'Very Good', 'Good'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Precious Metal</label>
                  <select
                    className="admin-select"
                    value={form.metal ?? 'White Gold'}
                    onChange={e => {
                      const val = e.target.value;
                      setField('metal', val);
                      if (val === 'Yellow Gold') setActiveMetalTab('yellow');
                      else if (val === 'Rose Gold') setActiveMetalTab('rose');
                      else if (val === 'Platinum') setActiveMetalTab('platinum');
                      else if (val === 'Silver') setActiveMetalTab('silver');
                      else setActiveMetalTab('default');
                    }}
                  >
                    {['White Gold', 'Yellow Gold', 'Rose Gold', 'Platinum', 'Silver'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Product Image & Media */}
            <div className="admin-form-section">
              {(() => {
                const getMetalImages = (tab: string): string[] => {
                  if (tab === 'yellow') {
                    if (form.images_yellow_gold && form.images_yellow_gold.length > 0) return form.images_yellow_gold;
                    return form.image_yellow_gold ? [form.image_yellow_gold] : [];
                  }
                  if (tab === 'rose') {
                    if (form.images_rose_gold && form.images_rose_gold.length > 0) return form.images_rose_gold;
                    return form.image_rose_gold ? [form.image_rose_gold] : [];
                  }
                  if (tab === 'platinum') {
                    if (form.images_platinum && form.images_platinum.length > 0) return form.images_platinum;
                    return form.image_platinum ? [form.image_platinum] : [];
                  }
                  if (tab === 'silver') {
                    if (form.images_silver && form.images_silver.length > 0) return form.images_silver;
                    return form.image_silver ? [form.image_silver] : [];
                  }
                  // White Gold / Default
                  if (form.images_white_gold && form.images_white_gold.length > 0) return form.images_white_gold;
                  return form.image ? [form.image] : [];
                };

                const currentMetalList = getMetalImages(activeMetalTab);
                const activeLabel = activeMetalTab === 'yellow' ? 'Yellow Gold' :
                                   activeMetalTab === 'rose' ? 'Rose Gold' :
                                   activeMetalTab === 'platinum' ? 'Platinum' :
                                   activeMetalTab === 'silver' ? 'Silver' : 'White Gold';

                const processSlotFile = async (file: File, slotIdx: number) => {
                  if (!file || !file.type.startsWith('image/')) {
                    alert('Please select an image file');
                    return;
                  }

                  setUploadingSlotIndex(slotIdx);
                  try {
                    const formData = new FormData();
                    formData.append('file', file);
                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                    if (!res.ok) { alert('Upload failed'); return; }
                    const data = await res.json();
                    if (!data.url) return;

                    const newList = [...currentMetalList];
                    newList[slotIdx] = data.url;
                    const cleaned = newList.filter(Boolean);

                    setForm(prev => {
                      if (activeMetalTab === 'yellow') {
                        return { ...prev, images_yellow_gold: cleaned, image_yellow_gold: cleaned[0] || '' };
                      } else if (activeMetalTab === 'rose') {
                        return { ...prev, images_rose_gold: cleaned, image_rose_gold: cleaned[0] || '' };
                      } else if (activeMetalTab === 'platinum') {
                        return { ...prev, images_platinum: cleaned, image_platinum: cleaned[0] || '' };
                      } else if (activeMetalTab === 'silver') {
                        return { ...prev, images_silver: cleaned, image_silver: cleaned[0] || '' };
                      } else {
                        return { ...prev, images_white_gold: cleaned, image: cleaned[0] || '' };
                      }
                    });
                  } catch (err) {
                    console.error(err);
                    alert('Upload error');
                  } finally {
                    setUploadingSlotIndex(null);
                  }
                };

                const handleSlotChange = async (e: React.ChangeEvent<HTMLInputElement>, slotIdx: number) => {
                  const file = e.target.files?.[0];
                  if (file) await processSlotFile(file, slotIdx);
                  e.target.value = '';
                };

                const handleSlotDrop = async (e: React.DragEvent, slotIdx: number) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) await processSlotFile(file, slotIdx);
                };

                const handleRemoveSlot = (slotIdx: number) => {
                  const newList = [...currentMetalList];
                  newList.splice(slotIdx, 1);
                  const cleaned = newList.filter(Boolean);

                  setForm(prev => {
                    if (activeMetalTab === 'yellow') {
                      return { ...prev, images_yellow_gold: cleaned, image_yellow_gold: cleaned[0] || '' };
                    } else if (activeMetalTab === 'rose') {
                      return { ...prev, images_rose_gold: cleaned, image_rose_gold: cleaned[0] || '' };
                    } else if (activeMetalTab === 'platinum') {
                      return { ...prev, images_platinum: cleaned, image_platinum: cleaned[0] || '' };
                    } else if (activeMetalTab === 'silver') {
                      return { ...prev, images_silver: cleaned, image_silver: cleaned[0] || '' };
                    } else {
                      return { ...prev, images_white_gold: cleaned, image: cleaned[0] || '' };
                    }
                  });
                };

                return (
                  <>
                    <div className="admin-form-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Image size={16} color="#6366f1" /> Metal Variant Product Photography (5 Photos Per Metal)
                      </div>
                      <span className="badge badge-confirmed" style={{ fontSize: '11px', textTransform: 'none', fontWeight: 600 }}>
                        {activeLabel}: {currentMetalList.length}/5 Photos Uploaded
                      </span>
                    </div>

                    {/* Metal Photo Tabs */}
                    <div className="admin-filter-tabs" style={{ marginBottom: '16px' }}>
                      <button
                        type="button"
                        className={`admin-filter-tab ${activeMetalTab === 'default' ? 'active' : ''}`}
                        onClick={() => setActiveMetalTab('default')}
                      >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E2E7EB', display: 'inline-block', marginRight: '6px' }} />
                        White Gold ({getMetalImages('default').length}/5)
                      </button>
                      <button
                        type="button"
                        className={`admin-filter-tab ${activeMetalTab === 'yellow' ? 'active' : ''}`}
                        onClick={() => setActiveMetalTab('yellow')}
                      >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E2C379', display: 'inline-block', marginRight: '6px' }} />
                        Yellow Gold ({getMetalImages('yellow').length}/5)
                      </button>
                      <button
                        type="button"
                        className={`admin-filter-tab ${activeMetalTab === 'rose' ? 'active' : ''}`}
                        onClick={() => setActiveMetalTab('rose')}
                      >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D99F8D', display: 'inline-block', marginRight: '6px' }} />
                        Rose Gold ({getMetalImages('rose').length}/5)
                      </button>
                      <button
                        type="button"
                        className={`admin-filter-tab ${activeMetalTab === 'platinum' ? 'active' : ''}`}
                        onClick={() => setActiveMetalTab('platinum')}
                      >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C8CDD0', display: 'inline-block', marginRight: '6px' }} />
                        Platinum ({getMetalImages('platinum').length}/5)
                      </button>
                      <button
                        type="button"
                        className={`admin-filter-tab ${activeMetalTab === 'silver' ? 'active' : ''}`}
                        onClick={() => setActiveMetalTab('silver')}
                      >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D2D7DF', display: 'inline-block', marginRight: '6px' }} />
                        Silver ({getMetalImages('silver').length}/5)
                      </button>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--admin-muted)', marginBottom: '14px' }}>
                      Upload up to 5 custom angles/photos specifically for <strong>{activeLabel}</strong>. Drag & drop image files onto any slot or click to browse.
                    </p>

                    {/* 5 Image Slots Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '14px' }}>
                      {[0, 1, 2, 3, 4].map((slotIdx) => {
                        const imgUrl = currentMetalList[slotIdx];
                        const isUploadingThis = uploadingSlotIndex === slotIdx;

                        return (
                          <div
                            key={slotIdx}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleSlotDrop(e, slotIdx)}
                            style={{
                              position: 'relative',
                              height: '140px',
                              borderRadius: '12px',
                              overflow: 'hidden',
                              border: imgUrl ? '1.5px solid #6366f1' : '1px dashed #334155',
                              background: '#131828',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'border-color 150ms ease'
                            }}
                          >
                            {imgUrl ? (
                              <>
                                <img src={imgUrl} alt={`Photo ${slotIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <span style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>
                                  #{slotIdx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSlot(slotIdx)}
                                  style={{ position: 'absolute', top: '6px', right: '6px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  title="Delete photo"
                                >
                                  <X size={14} />
                                </button>
                              </>
                            ) : (
                              <label style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '6px', padding: '8px' }}>
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  onChange={(e) => handleSlotChange(e, slotIdx)}
                                  disabled={uploadingSlotIndex !== null}
                                  style={{ display: 'none' }}
                                />
                                {isUploadingThis ? (
                                  <>
                                    <Loader2 size={18} className="admin-spin" color="#6366f1" />
                                    <span style={{ fontSize: '10.5px', color: '#a5b4fc' }}>Uploading...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload size={18} color="#6366f1" />
                                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, textAlign: 'center' }}>Drag/Drop Photo #{slotIdx + 1}</span>
                                  </>
                                )}
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Section 5: Badges & Display Status */}
            <div className="admin-form-section" style={{ marginBottom: 0 }}>
              <div className="admin-form-section-title">
                <Star size={16} color="#10b981" /> Visibility & Store Badges
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--admin-border)', cursor: 'pointer', fontSize: '13px', color: '#e2e8f0' }}>
                  <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: '#6366f1' }} checked={form.is_active ?? true} onChange={e => setField('is_active', e.target.checked)} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Active</div>
                    <div style={{ fontSize: '11px', color: '#8892a4' }}>Visible in catalog</div>
                  </div>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--admin-border)', cursor: 'pointer', fontSize: '13px', color: '#e2e8f0' }}>
                  <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: '#6366f1' }} checked={form.is_featured ?? false} onChange={e => setField('is_featured', e.target.checked)} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Featured</div>
                    <div style={{ fontSize: '11px', color: '#8892a4' }}>Show on homepage</div>
                  </div>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--admin-border)', cursor: 'pointer', fontSize: '13px', color: '#e2e8f0' }}>
                  <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: '#6366f1' }} checked={form.is_new ?? false} onChange={e => setField('is_new', e.target.checked)} />
                  <div>
                    <div style={{ fontWeight: 600 }}>New Arrival</div>
                    <div style={{ fontSize: '11px', color: '#8892a4' }}>Highlight as new</div>
                  </div>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--admin-border)', cursor: 'pointer', fontSize: '13px', color: '#e2e8f0' }}>
                  <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: '#6366f1' }} checked={form.is_verified ?? false} onChange={e => setField('is_verified', e.target.checked)} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Verified</div>
                    <div style={{ fontSize: '11px', color: '#8892a4' }}>Certified authentic</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Bar */}
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-ghost" style={{ padding: '11px 22px', fontSize: '14px' }} onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn-primary" style={{ padding: '11px 24px', fontSize: '14px', fontWeight: 700 }} onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 size={16} className="admin-spin" /> Saving Product...
                  </>
                ) : (
                  editing ? 'Save Changes' : 'Create Product'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
