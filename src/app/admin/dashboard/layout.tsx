'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  LogOut, Loader2, Grid, ShieldCheck
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import '../../admin/admin.css';

const navItems = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/dashboard/products', label: 'Products', icon: Package },
  { href: '/admin/dashboard/categories', label: 'Category Circles', icon: Grid },
  { href: '/admin/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/admin/dashboard/settings', label: 'Settings', icon: Settings },
];

interface AdminContextType {
  adminEmail: string;
}

const AdminContext = createContext<AdminContextType>({ adminEmail: '' });

export function useAdminContext() {
  return useContext(AdminContext);
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminEmail, setAdminEmail] = useState('');
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    const verifyAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          if (mounted) router.replace('/admin');
          return;
        }

        const { data: adminData } = await supabase
          .from('admin_users')
          .select('email')
          .eq('user_id', session.user.id)
          .eq('is_active', true)
          .maybeSingle();

        if (!adminData) {
          if (mounted) {
            await supabase.auth.signOut();
            router.replace('/admin');
          }
          return;
        }

        if (mounted) {
          setAdminEmail(adminData.email || session.user.email || 'Admin');
          setAuthChecking(false);
        }
      } catch (err) {
        console.error('Admin layout auth verification error:', err);
        if (mounted) router.replace('/admin');
      }
    };

    verifyAdmin();

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  // Initial auth verification loader (ONLY runs once when entering /admin/dashboard)
  if (authChecking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#090d16', gap: '16px' }}>
        <div style={{ padding: '16px', borderRadius: '50%', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <Loader2 size={36} className="admin-spin" color="#6366f1" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '15px', color: '#f8fafc', fontWeight: 700, letterSpacing: '0.3px' }}>Verifying Admin Access</span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Luxury Jeweleris Management Portal</span>
        </div>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ adminEmail }}>
      <div className="admin-shell">
        {/* Persistent Admin Sidebar - Never unmounts on navigation! */}
        <aside className="admin-sidebar">
          <div className="admin-logo">
            <h2>Luxury Jeweleris</h2>
            <span>Admin Panel</span>
          </div>

          <nav className="admin-nav">
            <div className="admin-nav-section">Menu</div>
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`admin-nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="admin-sidebar-footer">
            <div style={{ fontSize: '11.5px', color: '#818cf8', fontWeight: 600, marginBottom: '10px', padding: '0 4px', wordBreak: 'break-all', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={13} color="#10b981" /> {adminEmail}
            </div>
            <button className="admin-nav-link" onClick={handleSignOut}>
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Dynamic Admin Page Container */}
        <div className="admin-main">
          {children}
        </div>
      </div>
    </AdminContext.Provider>
  );
}
