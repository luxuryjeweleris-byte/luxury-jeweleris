'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  LogOut, Loader2, Search, Plus, Pencil, Trash2, X, Download,
  Crown, DollarSign, ShoppingBag, MapPin, Phone, Mail, Calendar,
  Sparkles, Eye, RefreshCw, SlidersHorizontal, UserCheck, ShieldCheck,
  CheckCircle2, ArrowUpDown
} from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import type { DbProfile, DbOrder } from '../../../../lib/supabase';
import '../../../admin/admin.css';

import { useAdminContext } from '../admin-context';

// Avatar Gradient generator based on string
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #6366f1, #a78bfa)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #ec4899, #8b5cf6)',
  'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  'linear-gradient(135deg, #14b8a6, #0f766e)'
];

function getAvatarBg(seedStr: string) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

function getInitials(name?: string | null, email?: string | null) {
  if (name && name.trim()) {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  }
  if (email && email.trim()) {
    return email.substring(0, 2).toUpperCase();
  }
  return 'CU';
}

interface ExtendedCustomer extends DbProfile {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  tier: 'VIP' | 'Preferred' | 'Regular';
}

export default function CustomersAdmin() {
  const { adminEmail } = useAdminContext();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [customers, setCustomers] = useState<ExtendedCustomer[]>([]);
  const [ordersMap, setOrdersMap] = useState<Record<string, DbOrder[]>>({});
  
  // UI states
  const [search, setSearch] = useState('');
  const [tabFilter, setTabFilter] = useState<'all' | 'vip' | 'high_value' | 'recent'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest_spend' | 'most_orders' | 'name_asc'>('newest');
  
  // Modals / Drawer
  const [viewCustomer, setViewCustomer] = useState<ExtendedCustomer | null>(null);
  const [editing, setEditing] = useState<DbProfile | null>(null);
  const [form, setForm] = useState<Partial<DbProfile>>({});
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCustomers = useCallback(async () => {
    try {
      // 1. Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // 2. Fetch orders to aggregate customer metrics
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*');

      const allOrders = (ordersData as DbOrder[]) || [];

      // Group orders by email or user_id
      const mapByCustomer: Record<string, DbOrder[]> = {};
      allOrders.forEach(ord => {
        const key = (ord.user_id || ord.customer_email || '').toLowerCase();
        if (!key) return;
        if (!mapByCustomer[key]) mapByCustomer[key] = [];
        mapByCustomer[key].push(ord);
      });
      setOrdersMap(mapByCustomer);

      // Process profiles with order statistics
      const rawProfiles = (profilesData as DbProfile[]) || [];
      const extended: ExtendedCustomer[] = rawProfiles.map(p => {
        const pEmail = (p.email || '').toLowerCase();
        const pId = p.id.toLowerCase();

        const custOrders = [
          ...(mapByCustomer[pEmail] || []),
          ...(mapByCustomer[pId] || [])
        ];

        // Deduplicate orders if matched by both email and id
        const uniqueOrders = Array.from(new Map(custOrders.map(o => [o.id, o])).values());

        const totalOrders = uniqueOrders.length;
        const totalSpent = uniqueOrders.reduce((sum, o) => sum + (o.payment_status === 'paid' ? Number(o.total || 0) : Number(o.total || 0)), 0);

        let lastOrderDate: string | null = null;
        if (uniqueOrders.length > 0) {
          const sorted = [...uniqueOrders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          lastOrderDate = sorted[0].created_at;
        }

        // Determine VIP Tier
        let tier: 'VIP' | 'Preferred' | 'Regular' = 'Regular';
        if (totalSpent >= 5000 || totalOrders >= 3) {
          tier = 'VIP';
        } else if (totalSpent >= 1000 || totalOrders >= 1) {
          tier = 'Preferred';
        }

        return {
          ...p,
          totalOrders,
          totalSpent,
          lastOrderDate,
          tier,
        };
      });

      setCustomers(extended);
    } catch (err) {
      console.error('Error fetching customers data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCustomers();
    setRefreshing(false);
  };

  // Executive KPI summary calculations
  const kpis = useMemo(() => {
    const total = customers.length;
    const vips = customers.filter(c => c.tier === 'VIP').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgLtv = total > 0 ? Math.round(totalRevenue / total) : 0;
    return { total, vips, totalRevenue, avgLtv };
  }, [customers]);

  // Filtering & Sorting
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      // Tab filter
      if (tabFilter === 'vip' && c.tier !== 'VIP') return false;
      if (tabFilter === 'high_value' && c.totalSpent < 1000) return false;
      if (tabFilter === 'recent') {
        const daysOld = (new Date().getTime() - new Date(c.created_at).getTime()) / (1000 * 3600 * 24);
        if (daysOld > 30) return false;
      }

      // Search term
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        (c.email || '').toLowerCase().includes(q) ||
        (c.full_name || '').toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q) ||
        (c.city || '').toLowerCase().includes(q) ||
        (c.country || '').toLowerCase().includes(q) ||
        (c.ring_size || '').toLowerCase().includes(q)
      );
    }).sort((a, b) => {
      if (sortBy === 'highest_spend') return b.totalSpent - a.totalSpent;
      if (sortBy === 'most_orders') return b.totalOrders - a.totalOrders;
      if (sortBy === 'name_asc') return (a.full_name || a.email || '').localeCompare(b.full_name || b.email || '');
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // newest
    });
  }, [customers, tabFilter, search, sortBy]);

  // Export CSV
  const handleExportCSV = () => {
    if (filteredCustomers.length === 0) return;
    const headers = ['ID', 'Email', 'Full Name', 'Phone', 'City', 'State', 'Country', 'Ring Size', 'Total Orders', 'Total Spent ($)', 'Tier', 'Joined Date'];
    const rows = filteredCustomers.map(c => [
      c.id,
      `"${c.email || ''}"`,
      `"${c.full_name || ''}"`,
      `"${c.phone || ''}"`,
      `"${c.city || ''}"`,
      `"${c.state || ''}"`,
      `"${c.country || ''}"`,
      `"${c.ring_size || ''}"`,
      c.totalOrders,
      c.totalSpent.toFixed(2),
      c.tier,
      new Date(c.created_at).toLocaleDateString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Luxury_Jeweleris_Customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ country: 'US' });
    setShowModal(true);
  };

  const openEdit = (c: DbProfile) => {
    setEditing(c);
    setForm({ ...c });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.email?.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await supabase
          .from('profiles')
          .update({ ...form, updated_at: new Date().toISOString() })
          .eq('id', editing.id);
      } else {
        await supabase.from('profiles').insert({ ...form });
      }
      setShowModal(false);
      await fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await supabase.from('profiles').delete().eq('id', id);
      if (viewCustomer?.id === id) setViewCustomer(null);
      setDeleteConfirmId(null);
      await fetchCustomers();
    } catch (err) {
      console.error('Error deleting customer:', err);
    } finally {
      setDeleting(false);
    }
  };

  const setField = (key: keyof DbProfile, value: unknown) => setForm(f => ({ ...f, [key]: value }));

  return (
    <>
      {/* Top Header Bar */}
      <div className="admin-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="admin-topbar-title">Customer CRM & Clients</span>
          <span className="badge badge-confirmed" style={{ fontSize: '11px' }}>
            {customers.length} Profiles
          </span>
        </div>
        <div className="admin-topbar-right">
          <button className="admin-btn admin-btn-ghost" onClick={handleRefresh} disabled={refreshing} title="Refresh data">
            <RefreshCw size={14} className={refreshing ? 'admin-spin' : ''} /> Refresh
          </button>
          <button className="admin-btn admin-btn-ghost" onClick={handleExportCSV} title="Export CSV file">
            <Download size={14} /> Export CSV
          </button>
          <button className="admin-btn admin-btn-primary" onClick={openAdd}>
            <Plus size={15} /> Add Customer
          </button>
          <div className="admin-avatar">{adminEmail[0]?.toUpperCase() || 'A'}</div>
        </div>
      </div>

      <div className="admin-content">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '12px' }}>
            <Loader2 size={32} className="admin-spin" color="#6366f1" />
            <span style={{ fontSize: '13px', color: '#8892a4' }}>Loading Customer Records...</span>
          </div>
        ) : (
          <>
          {/* Executive Stat Cards */}
          <div className="admin-stat-grid" style={{ marginBottom: '24px' }}>
            <div className="admin-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="admin-stat-label">Total Registered Clients</span>
                <div style={{ background: 'rgba(99,102,241,0.15)', padding: '8px', borderRadius: '8px', color: '#818cf8' }}>
                  <Users size={18} />
                </div>
              </div>
              <div className="admin-stat-value">{kpis.total}</div>
              <div style={{ fontSize: '12px', color: '#8892a4', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <UserCheck size={13} color="#10b981" /> Verified Profiles
              </div>
            </div>

            <div className="admin-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="admin-stat-label">VIP & Premier Clients</span>
                <div style={{ background: 'rgba(245,158,11,0.15)', padding: '8px', borderRadius: '8px', color: '#fbbf24' }}>
                  <Crown size={18} />
                </div>
              </div>
              <div className="admin-stat-value" style={{ color: '#fbbf24' }}>{kpis.vips}</div>
              <div style={{ fontSize: '12px', color: '#8892a4' }}>High Lifetime Value</div>
            </div>

            <div className="admin-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="admin-stat-label">Customer Revenue</span>
                <div style={{ background: 'rgba(16,185,129,0.15)', padding: '8px', borderRadius: '8px', color: '#34d399' }}>
                  <DollarSign size={18} />
                </div>
              </div>
              <div className="admin-stat-value">${kpis.totalRevenue.toLocaleString()}</div>
              <div style={{ fontSize: '12px', color: '#8892a4' }}>Total Order Value</div>
            </div>

            <div className="admin-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="admin-stat-label">Avg. Customer Spend</span>
                <div style={{ background: 'rgba(168,85,247,0.15)', padding: '8px', borderRadius: '8px', color: '#c084fc' }}>
                  <ShoppingBag size={18} />
                </div>
              </div>
              <div className="admin-stat-value">${kpis.avgLtv.toLocaleString()}</div>
              <div style={{ fontSize: '12px', color: '#8892a4' }}>Per Registered Client</div>
            </div>
          </div>

          {/* Main Card with Controls & Table */}
          <div className="admin-table-card">
            {/* Header & Controls Toolbar */}
            <div
              className="admin-table-header"
              style={{
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: '16px',
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Client Directory</h3>
                  <div style={{ fontSize: '12px', color: 'var(--admin-muted)', marginTop: '2px' }}>
                    Showing {filteredCustomers.length} of {customers.length} customer records
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {/* Search Input */}
                  <div style={{ position: 'relative', width: '100%', maxWidth: '260px', flex: '1 1 200px' }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8892a4' }} />
                    <input
                      type="text"
                      className="admin-table-search"
                      placeholder="Search name, email, city..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      style={{ paddingLeft: '34px', width: '100%' }}
                    />
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#8892a4', cursor: 'pointer' }}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {/* Sort Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ArrowUpDown size={14} color="#8892a4" />
                    <select
                      className="admin-select"
                      style={{ padding: '7px 12px', width: 'auto', fontSize: '12.5px' }}
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value as any)}
                    >
                      <option value="newest">Sort: Newest</option>
                      <option value="highest_spend">Sort: Highest Spend</option>
                      <option value="most_orders">Sort: Most Orders</option>
                      <option value="name_asc">Sort: Name (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="admin-filter-tabs">
                <button
                  className={`admin-filter-tab ${tabFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setTabFilter('all')}
                >
                  All Clients ({customers.length})
                </button>
                <button
                  className={`admin-filter-tab ${tabFilter === 'vip' ? 'active' : ''}`}
                  onClick={() => setTabFilter('vip')}
                >
                  👑 VIP Members ({customers.filter(c => c.tier === 'VIP').length})
                </button>
                <button
                  className={`admin-filter-tab ${tabFilter === 'high_value' ? 'active' : ''}`}
                  onClick={() => setTabFilter('high_value')}
                >
                  💎 High Value ($1k+) ({customers.filter(c => c.totalSpent >= 1000).length})
                </button>
                <button
                  className={`admin-filter-tab ${tabFilter === 'recent' ? 'active' : ''}`}
                  onClick={() => setTabFilter('recent')}
                >
                  ✨ New Clients (30d)
                </button>
              </div>
            </div>

            {/* Customers Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table admin-table-responsive">
                <thead>
                  <tr>
                    <th>Customer Client</th>
                    <th>Tier Status</th>
                    <th>Contact Info</th>
                    <th>Location & Ring</th>
                    <th>Orders & LTV</th>
                    <th>Joined Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: 'var(--admin-muted)', padding: '48px 20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <Users size={32} color="#475569" />
                          <div style={{ fontWeight: 600, fontSize: '15px', color: '#cbd5e1' }}>No customers found</div>
                          <div style={{ fontSize: '13px', color: '#64748b' }}>Try broadening your search or filter parameters.</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map(c => {
                      const avatarBg = getAvatarBg(c.email || c.full_name || c.id);
                      const initials = getInitials(c.full_name, c.email);

                      return (
                        <tr key={c.id}>
                          {/* Name & Avatar */}
                          <td data-label="Customer">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div className="customer-avatar-badge" style={{ background: avatarBg }}>
                                {initials}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#f8fafc' }}>
                                  {c.full_name || 'Unnamed Client'}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>
                                  {c.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Tier Badge */}
                          <td data-label="Tier">
                            {c.tier === 'VIP' && (
                              <span className="badge badge-vip">
                                👑 VIP Client
                              </span>
                            )}
                            {c.tier === 'Preferred' && (
                              <span className="badge badge-preferred">
                                💎 Preferred
                              </span>
                            )}
                            {c.tier === 'Regular' && (
                              <span className="badge badge-regular">
                                Client
                              </span>
                            )}
                          </td>

                          {/* Contact Info */}
                          <td data-label="Contact">
                            <div style={{ fontSize: '13px', color: 'var(--admin-text)' }}>
                              {c.phone ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <Phone size={12} color="#8892a4" /> {c.phone}
                                </span>
                              ) : (
                                <span style={{ color: '#64748b', fontSize: '12px' }}>No phone</span>
                              )}
                            </div>
                          </td>

                          {/* Location & Ring */}
                          <td data-label="Location">
                            <div style={{ fontSize: '12.5px', color: 'var(--admin-text)' }}>
                              {(c.city || c.country) ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <MapPin size={12} color="#8892a4" />
                                  {[c.city, c.country].filter(Boolean).join(', ')}
                                </div>
                              ) : (
                                <span style={{ color: '#64748b', fontSize: '12px' }}>Location unspecified</span>
                              )}
                              {c.ring_size && (
                                <div style={{ fontSize: '11px', color: '#a5b4fc', marginTop: '2px' }}>
                                  Ring Size: {c.ring_size}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Orders & Total Spent */}
                          <td data-label="Orders & LTV">
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '13.5px', color: c.totalSpent > 0 ? '#10b981' : '#e2e8f0' }}>
                                ${c.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                              <div style={{ fontSize: '11.5px', color: 'var(--admin-muted)' }}>
                                {c.totalOrders} {c.totalOrders === 1 ? 'order' : 'orders'}
                              </div>
                            </div>
                          </td>

                          {/* Joined Date */}
                          <td data-label="Joined">
                            <div style={{ fontSize: '12.5px', color: 'var(--admin-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={12} color="#64748b" />
                              {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </td>

                          {/* Actions */}
                          <td data-label="Actions" style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button
                                className="admin-btn admin-btn-ghost"
                                style={{ padding: '6px 10px', fontSize: '12px' }}
                                title="View Customer Details"
                                onClick={() => setViewCustomer(c)}
                              >
                                <Eye size={13} /> View
                              </button>
                              <button
                                className="admin-btn admin-btn-ghost"
                                style={{ padding: '6px 10px', fontSize: '12px' }}
                                title="Edit Customer"
                                onClick={() => openEdit(c)}
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                className="admin-btn admin-btn-danger"
                                style={{ padding: '6px 10px', fontSize: '12px' }}
                                title="Delete Customer Profile"
                                onClick={() => setDeleteConfirmId(c.id)}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>

      {/* Customer Detailed Side Drawer */}
      {viewCustomer && (
        <div className="admin-drawer-overlay" onClick={() => setViewCustomer(null)}>
          <div className="admin-drawer" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="customer-avatar-badge" style={{ width: '48px', height: '48px', fontSize: '16px', background: getAvatarBg(viewCustomer.email || viewCustomer.id) }}>
                  {getInitials(viewCustomer.full_name, viewCustomer.email)}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>
                    {viewCustomer.full_name || 'Unnamed Client'}
                  </h3>
                  <div style={{ fontSize: '13px', color: 'var(--admin-muted)', marginTop: '2px' }}>
                    {viewCustomer.email}
                  </div>
                </div>
              </div>
              <button
                style={{ background: 'none', border: 'none', color: '#8892a4', cursor: 'pointer', padding: '6px' }}
                onClick={() => setViewCustomer(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
              {/* Financial Metrics Summary */}
              <div style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--admin-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Lifetime Value</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                    ${viewCustomer.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--admin-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Orders</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--admin-text)', marginTop: '2px' }}>
                    {viewCustomer.totalOrders}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--admin-muted)', marginBottom: '12px' }}>
                  Contact & Preferences
                </h4>
                <div style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                    <Mail size={15} color="#8892a4" />
                    <span style={{ color: 'var(--admin-text)' }}>{viewCustomer.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                    <Phone size={15} color="#8892a4" />
                    <span style={{ color: 'var(--admin-text)' }}>{viewCustomer.phone || 'Not provided'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                    <Sparkles size={15} color="#8892a4" />
                    <span style={{ color: 'var(--admin-text)' }}>Ring Size: <strong>{viewCustomer.ring_size || 'Not specified'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                    <Calendar size={15} color="#8892a4" />
                    <span style={{ color: 'var(--admin-text)' }}>Joined: {new Date(viewCustomer.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--admin-muted)', marginBottom: '12px' }}>
                  Shipping Address
                </h4>
                <div style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '16px', fontSize: '13.5px', lineHeight: '1.6', color: 'var(--admin-text)' }}>
                  {viewCustomer.address_line1 ? (
                    <>
                      <div>{viewCustomer.address_line1}</div>
                      {viewCustomer.address_line2 && <div>{viewCustomer.address_line2}</div>}
                      <div>{[viewCustomer.city, viewCustomer.state, viewCustomer.zip].filter(Boolean).join(', ')}</div>
                      <div style={{ fontWeight: 600, color: '#a5b4fc', marginTop: '4px' }}>{viewCustomer.country}</div>
                    </>
                  ) : (
                    <span style={{ color: '#64748b' }}>No shipping address recorded.</span>
                  )}
                </div>
              </div>

              {/* Order History */}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--admin-muted)', marginBottom: '12px' }}>
                  Order History ({viewCustomer.totalOrders})
                </h4>
                {(() => {
                  const emailKey = (viewCustomer.email || '').toLowerCase();
                  const idKey = viewCustomer.id.toLowerCase();
                  const orders = [
                    ...(ordersMap[emailKey] || []),
                    ...(ordersMap[idKey] || [])
                  ];
                  const unique = Array.from(new Map(orders.map(o => [o.id, o])).values());

                  if (unique.length === 0) {
                    return (
                      <div style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                        No orders recorded for this client.
                      </div>
                    );
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {unique.map(ord => (
                        <div key={ord.id} style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13px', color: '#f8fafc' }}>
                              #{ord.order_number}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--admin-muted)', marginTop: '2px' }}>
                              {new Date(ord.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, fontSize: '13px', color: '#10b981' }}>
                              ${Number(ord.total).toFixed(2)}
                            </div>
                            <span className={`badge badge-${ord.status === 'delivered' ? 'delivered' : ord.status === 'shipped' ? 'shipped' : 'pending'}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                              {ord.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--admin-border)', display: 'flex', gap: '10px', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.2)' }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => { openEdit(viewCustomer); setViewCustomer(null); }}>
                <Pencil size={14} /> Edit Customer
              </button>
              {viewCustomer.email && (
                <a className="admin-btn admin-btn-primary" href={`mailto:${viewCustomer.email}`} style={{ textDecoration: 'none' }}>
                  <Mail size={14} /> Send Email
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Customer Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700 }}>
                {editing ? 'Edit Customer Profile' : 'Add New Customer'}
              </h3>
              <button style={{ background: 'none', border: 'none', color: '#8892a4', cursor: 'pointer' }} onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="admin-form-grid">
              <div className="full-span">
                <label className="admin-label">Email Address *</label>
                <input
                  className="admin-input"
                  style={{ marginBottom: 0 }}
                  placeholder="client@example.com"
                  value={form.email ?? ''}
                  onChange={e => setField('email', e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Full Name</label>
                <input
                  className="admin-input"
                  style={{ marginBottom: 0 }}
                  placeholder="e.g. Jane Doe"
                  value={form.full_name ?? ''}
                  onChange={e => setField('full_name', e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Phone Number</label>
                <input
                  className="admin-input"
                  style={{ marginBottom: 0 }}
                  placeholder="+1 (555) 000-0000"
                  value={form.phone ?? ''}
                  onChange={e => setField('phone', e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Ring Size</label>
                <input
                  className="admin-input"
                  style={{ marginBottom: 0 }}
                  placeholder="e.g. 6.5"
                  value={form.ring_size ?? ''}
                  onChange={e => setField('ring_size', e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Country</label>
                <select
                  className="admin-select"
                  value={form.country ?? 'US'}
                  onChange={e => setField('country', e.target.value)}
                >
                  {['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP', 'IT', 'CH', 'AE'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="full-span">
                <label className="admin-label">Address Line 1</label>
                <input
                  className="admin-input"
                  style={{ marginBottom: 0 }}
                  placeholder="123 Luxury Lane"
                  value={form.address_line1 ?? ''}
                  onChange={e => setField('address_line1', e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">City</label>
                <input
                  className="admin-input"
                  style={{ marginBottom: 0 }}
                  placeholder="New York"
                  value={form.city ?? ''}
                  onChange={e => setField('city', e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">State / Region</label>
                <input
                  className="admin-input"
                  style={{ marginBottom: 0 }}
                  placeholder="NY"
                  value={form.state ?? ''}
                  onChange={e => setField('state', e.target.value)}
                />
              </div>
            </div>

            <div className="admin-modal-actions" style={{ marginTop: '24px' }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 size={15} className="admin-spin" /> : (editing ? 'Save Changes' : 'Create Profile')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239,68,68,0.15)', color: '#ef4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Trash2 size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Delete Customer Profile</h3>
              <p style={{ fontSize: '13px', color: 'var(--admin-muted)', lineHeight: '1.5', marginBottom: '20px' }}>
                Are you sure you want to remove this client profile? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteConfirmId(null)} disabled={deleting}>
                  Cancel
                </button>
                <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(deleteConfirmId)} disabled={deleting}>
                  {deleting ? <Loader2 size={15} className="admin-spin" /> : 'Confirm Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
