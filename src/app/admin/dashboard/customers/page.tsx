'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  LogOut, Loader2, Search, ChevronDown,
} from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import type { DbProfile } from '../../../../lib/supabase';
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

export default function CustomersAdmin() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<DbProfile[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<DbProfile | null>(null);
  const [form, setForm] = useState<Partial<DbProfile>>({});
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchCustomers = useCallback(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setCustomers((data as DbProfile[]) ?? []);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/admin'); return; }
      const { data: adminData } = await supabase.from('admin_users').select('email').eq('user_id', session.user.id).eq('is_active', true).maybeSingle();
      if (!adminData) { router.push('/admin'); return; }
      setAdminEmail(adminData.email);
      await fetchCustomers();
      setLoading(false);
    };
    init();
  }, [router, fetchCustomers]);

  const openAdd = () => { setEditing(null); setForm({}); setShowModal(true); };
  const openEdit = (c: DbProfile) => { setEditing(c); setForm({ ...c }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.email) return;
    setSaving(true);
    try {
      if (editing) {
        await supabase.from('profiles').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id);
      } else {
        await supabase.from('profiles').insert({ ...form });
      }
      setSaving(false);
      setShowModal(false);
      await fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('profiles').delete().eq('id', id);
    await fetchCustomers();
  };

  const filtered = customers.filter(c =>
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const setField = (key: keyof DbProfile, value: unknown) => setForm(f => ({ ...f, [key]: value }));

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
          <span className="admin-topbar-title">Customers Management</span>
          <div className="admin-topbar-right">
            <div className="admin-avatar">{adminEmail[0]?.toUpperCase()}</div>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-table-card">
            <div className="admin-table-header">
              <h3>All Customers ({filtered.length})</h3>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8892a4' }} />
                <input
                  type="text"
                  className="admin-table-search"
                  placeholder="Search customers..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: '32px' }}
                />
              </div>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Full Name</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Country</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#8892a4', padding: '40px' }}>No customers found</td></tr>
                ) : filtered.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontSize: '13px' }}>{c.email}</td>
                    <td style={{ fontSize: '13px', fontWeight: 600 }}>{c.full_name}</td>
                    <td style={{ fontSize: '13px' }}>{c.phone}</td>
                    <td style={{ fontSize: '13px' }}>{c.city}</td>
                    <td style={{ fontSize: '13px' }}>{c.country}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="admin-btn admin-btn-ghost" style={{ padding: '6px 10px' }} onClick={() => openEdit(c)}>
                          Edit
                        </button>
                        <button
                          className="admin-btn admin-btn-danger"
                          style={{ padding: '6px 10px' }}
                          onClick={() => handleDelete(c.id)}
                        >
                          Delete
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

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>{editing ? 'Edit Customer' : 'Add New Customer'}</h3>
              <button style={{ background: 'none', border: 'none', color: '#8892a4', cursor: 'pointer' }} onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="admin-form-grid">
              <div className="full-span">
                <label className="admin-label">Email *</label>
                <input className="admin-input" value={form.email ?? ''} onChange={e => setField('email', e.target.value)} />
              </div>
              <div className="full-span">
                <label className="admin-label">Full Name</label>
                <input className="admin-input" value={form.full_name ?? ''} onChange={e => setField('full_name', e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Phone</label>
                <input className="admin-input" value={form.phone ?? ''} onChange={e => setField('phone', e.target.value)} />
              </div>
              <div>
                <label className="admin-label">City</label>
                <input className="admin-input" value={form.city ?? ''} onChange={e => setField('city', e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Country</label>
                <select className="admin-select" value={form.country ?? 'US'} onChange={e => setField('country', e.target.value)}>
                  {['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : (editing ? 'Save Changes' : 'Add Customer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
