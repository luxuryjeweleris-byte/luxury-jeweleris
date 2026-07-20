'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  LogOut, Loader2, Search, ChevronDown,
} from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import type { DbOrder } from '../../../../lib/supabase';
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

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
const STATUS_BADGE: Record<string, string> = {
  pending: 'badge-pending', confirmed: 'badge-confirmed', processing: 'badge-confirmed',
  shipped: 'badge-shipped', delivered: 'badge-delivered', cancelled: 'badge-cancelled', refunded: 'badge-cancelled',
};

interface OrderWithItems extends DbOrder {
  order_items?: { product_name: string; quantity: number; unit_price: number; metal?: string; size?: string }[];
}

export default function OrdersAdmin() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(product_name, quantity, unit_price, metal, size)')
      .order('created_at', { ascending: false });
    setOrders((data as OrderWithItems[]) ?? []);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/admin'); return; }
      const { data: adminData } = await supabase.from('admin_users').select('email').eq('user_id', session.user.id).eq('is_active', true).maybeSingle();
      if (!adminData) { router.push('/admin'); return; }
      setAdminEmail(adminData.email);
      await fetchOrders();
      setLoading(false);
    };
    init();
  }, [router, fetchOrders]);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId);
    await fetchOrders();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: status as DbOrder['status'] } : null);
    }
    setUpdatingId(null);
  };

  const filtered = orders.filter(o => {
    const matchSearch = o.order_number?.toLowerCase().includes(search.toLowerCase())
      || o.customer_email.toLowerCase().includes(search.toLowerCase())
      || (o.customer_name ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = filtered.reduce((sum, o) => sum + (o.total ?? 0), 0);

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
          <span className="admin-topbar-title">Orders Management</span>
          <div className="admin-topbar-right">
            <span style={{ fontSize: '13px', color: '#a5b4fc', fontWeight: 700 }}>
              Revenue: ${totalRevenue.toLocaleString()}
            </span>
            <div className="admin-avatar">{adminEmail[0]?.toUpperCase()}</div>
          </div>
        </div>

        <div className="admin-content">
          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8892a4' }} />
              <input
                type="text"
                className="admin-table-search"
                placeholder="Search by order #, name, or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '32px', width: '100%', maxWidth: '100%' }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <select
                className="admin-select"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{ paddingRight: '32px', appearance: 'none' }}
              >
                <option value="all">All Status</option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8892a4', pointerEvents: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1.5fr 1fr' : '1fr', gap: '16px' }}>
            {/* Orders Table */}
            <div className="admin-table-card">
              <div className="admin-table-header">
                <h3>Orders ({filtered.length})</h3>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: '#8892a4', padding: '40px' }}>No orders found</td></tr>
                  ) : filtered.map(order => (
                    <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>
                      <td><span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#a5b4fc' }}>{order.order_number}</span></td>
                      <td>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{order.customer_name || '—'}</div>
                        <div style={{ fontSize: '11px', color: '#8892a4' }}>{order.customer_email}</div>
                      </td>
                      <td style={{ fontWeight: 700 }}>${(order.total ?? 0).toLocaleString()}</td>
                      <td><span className={`badge ${STATUS_BADGE[order.status] ?? 'badge-pending'}`}>{order.status}</span></td>
                      <td style={{ fontSize: '12px', color: '#8892a4' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td>
                        <select
                          className="admin-select"
                          style={{ fontSize: '11px', padding: '5px 8px' }}
                          value={order.status}
                          onClick={e => e.stopPropagation()}
                          onChange={e => updateStatus(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Detail Panel */}
            {selectedOrder && (
              <div className="admin-table-card" style={{ height: 'fit-content' }}>
                <div className="admin-table-header">
                  <h3>Order Details</h3>
                  <button style={{ background: 'none', border: 'none', color: '#8892a4', cursor: 'pointer', fontSize: '20px' }} onClick={() => setSelectedOrder(null)}>×</button>
                </div>
                <div style={{ padding: '16px' }}>
                  {/* Order info */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#8892a4' }}>Order #</span>
                      <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#a5b4fc' }}>{selectedOrder.order_number}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#8892a4' }}>Customer</span>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>{selectedOrder.customer_name || selectedOrder.customer_email}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#8892a4' }}>Email</span>
                      <span style={{ fontSize: '11px' }}>{selectedOrder.customer_email}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#8892a4' }}>Status</span>
                      <span className={`badge ${STATUS_BADGE[selectedOrder.status] ?? 'badge-pending'}`}>{selectedOrder.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#8892a4' }}>Payment</span>
                      <span className={`badge ${selectedOrder.payment_status === 'paid' ? 'badge-delivered' : 'badge-pending'}`}>{selectedOrder.payment_status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#8892a4' }}>Date</span>
                      <span style={{ fontSize: '12px' }}>{new Date(selectedOrder.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Items */}
                  {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '12px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#8892a4', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items</div>
                      {selectedOrder.order_items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 600 }}>{item.product_name}</div>
                            <div style={{ fontSize: '11px', color: '#8892a4' }}>
                              {[item.metal, item.size && `Size ${item.size}`].filter(Boolean).join(' · ')} × {item.quantity}
                            </div>
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: 700 }}>${(item.unit_price * item.quantity).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Totals */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#8892a4' }}>Subtotal</span>
                      <span style={{ fontSize: '12px' }}>${selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#8892a4' }}>Shipping</span>
                      <span style={{ fontSize: '12px' }}>{selectedOrder.shipping_cost === 0 ? 'Free' : `$${selectedOrder.shipping_cost}`}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#8892a4' }}>Tax</span>
                      <span style={{ fontSize: '12px' }}>${selectedOrder.tax.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700 }}>Total</span>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#a5b4fc' }}>${selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Shipping address */}
                  {selectedOrder.shipping_address && (
                    <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#8892a4', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ship To</div>
                      <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
                        {selectedOrder.shipping_address.line1}<br />
                        {selectedOrder.shipping_address.line2 && <>{selectedOrder.shipping_address.line2}<br /></>}
                        {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zip}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
