'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  LogOut, TrendingUp, DollarSign, Star, Activity, Loader2,
  ChevronRight,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { DbOrder, DbProduct } from '../../../lib/supabase';
import '../../admin/admin.css';

// ── Sidebar nav items
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <h2>Luxury Jeweleris</h2>
        <span>Admin Panel</span>
      </div>

      <nav className="admin-nav">
        <div className="admin-nav-section">Menu</div>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`admin-nav-link ${pathname === href ? 'active' : ''}`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <div style={{ fontSize: '12px', color: '#6366f1', marginBottom: '10px', padding: '0 4px', wordBreak: 'break-all' }}>
          {adminEmail}
        </div>
        <button className="admin-nav-link" onClick={handleSignOut}>
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

// ── Stat Card Component
function StatCard({ label, value, change, icon: Icon, up }: {
  label: string; value: string; change: string; icon: React.ElementType; up: boolean;
}) {
  return (
    <div className="admin-stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="admin-stat-label">{label}</span>
        <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(99,102,241,0.12)' }}>
          <Icon size={16} color="#a5b4fc" />
        </div>
      </div>
      <span className="admin-stat-value">{value}</span>
      <span className={`admin-stat-change ${up ? 'up' : 'down'}`}>{change}</span>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState<DbOrder[]>([]);
  const [topProducts, setTopProducts] = useState<DbProduct[]>([]);

  const loadDashboard = useCallback(async (userId: string) => {
    const [
      { count: productCount },
      { count: orderCount },
      { data: orders },
      { data: products },
      { count: customerCount },
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(6),
      supabase.from('products').select('*').eq('is_featured', true).limit(5),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
    ]);

    const revenue = (orders ?? []).reduce((sum, o) => sum + (o.total ?? 0), 0);

    setStats({
      products: productCount ?? 0,
      orders: orderCount ?? 0,
      revenue,
      customers: customerCount ?? 0,
    });
    setRecentOrders((orders as DbOrder[]) ?? []);
    setTopProducts((products as DbProduct[]) ?? []);
    void userId;
  }, []);

  useEffect(() => {
    const checkAndLoad = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/admin'); return; }

      const { data: adminData } = await supabase
        .from('admin_users')
        .select('email')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (!adminData) { router.push('/admin'); return; }
      setAdminEmail(adminData.email);
      await loadDashboard(session.user.id);
      setLoading(false);
    };
    checkAndLoad();
  }, [router, loadDashboard]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1117' }}>
        <Loader2 size={32} className="admin-spin" color="#6366f1" />
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    pending: 'badge-pending', confirmed: 'badge-confirmed',
    shipped: 'badge-shipped', delivered: 'badge-delivered', cancelled: 'badge-cancelled',
  };

  return (
    <div className="admin-shell">
      <AdminSidebar adminEmail={adminEmail} />

      <div className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          <span className="admin-topbar-title">Dashboard Overview</span>
          <div className="admin-topbar-right">
            <span style={{ fontSize: '12px', color: '#8892a4' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            <div className="admin-avatar">{adminEmail[0]?.toUpperCase()}</div>
          </div>
        </div>

        <div className="admin-content">
          {/* Stats */}
          <div className="admin-stat-grid">
            <StatCard label="Total Products" value={stats.products.toString()} change="Active in store" icon={Package} up={true} />
            <StatCard label="Total Orders" value={stats.orders.toString()} change="All time" icon={ShoppingCart} up={true} />
            <StatCard label="Revenue" value={`$${stats.revenue.toLocaleString()}`} change="From all orders" icon={DollarSign} up={true} />
            <StatCard label="Customers" value={stats.customers.toString()} change="Registered users" icon={Users} up={true} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
            {/* Recent Orders */}
            <div className="admin-table-card">
              <div className="admin-table-header">
                <h3>Recent Orders</h3>
                <Link href="/admin/dashboard/orders" style={{ fontSize: '12px', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                  View all <ChevronRight size={14} />
                </Link>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', color: '#8892a4', padding: '32px' }}>No orders yet</td></tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td><span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#a5b4fc' }}>{order.order_number}</span></td>
                        <td style={{ fontSize: '12px' }}>{order.customer_name || order.customer_email}</td>
                        <td style={{ fontWeight: 700 }}>${order.total.toLocaleString()}</td>
                        <td><span className={`badge ${statusColor[order.status] ?? 'badge-pending'}`}>{order.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Featured Products */}
            <div className="admin-table-card">
              <div className="admin-table-header">
                <h3>Featured Products</h3>
                <Link href="/admin/dashboard/products" style={{ fontSize: '12px', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                  Manage <ChevronRight size={14} />
                </Link>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.length === 0 ? (
                    <tr><td colSpan={3} style={{ textAlign: 'center', color: '#8892a4', padding: '32px' }}>No featured products</td></tr>
                  ) : (
                    topProducts.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={p.image ?? ''} alt={p.name} className="admin-product-thumb" />
                            <span style={{ fontSize: '12px', fontWeight: 600 }}>{p.name.slice(0, 30)}{p.name.length > 30 ? '…' : ''}</span>
                          </div>
                        </td>
                        <td style={{ fontWeight: 700 }}>${p.price.toLocaleString()}</td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                            <Star size={12} fill="#fbbf24" /> {p.ai_score}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/admin/dashboard/products" className="admin-btn admin-btn-primary" style={{ textDecoration: 'none' }}>
              <Package size={14} /> Add Product
            </Link>
            <Link href="/admin/dashboard/orders" className="admin-btn admin-btn-ghost" style={{ textDecoration: 'none' }}>
              <Activity size={14} /> View Orders
            </Link>
            <a href="/" target="_blank" className="admin-btn admin-btn-ghost" style={{ textDecoration: 'none' }}>
              <TrendingUp size={14} /> View Store
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
