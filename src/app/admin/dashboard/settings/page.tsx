'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Save } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import type { DbSiteSetting } from '../../../../lib/supabase';
import { useAdminContext } from '../layout';
import '../../../admin/admin.css';

export default function SettingsAdmin() {
  const { adminEmail } = useAdminContext();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<DbSiteSetting[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .order('key');
      setSettings((data as DbSiteSetting[]) ?? []);
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const setting of settings) {
        await supabase.from('site_settings').upsert({
          key: setting.key,
          value: setting.value,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Site Settings</span>
        <div className="admin-topbar-right">
          <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={15} className="admin-spin" /> : <><Save size={15} /> Save All</>}
          </button>
          <div className="admin-avatar">{adminEmail[0]?.toUpperCase() || 'A'}</div>
        </div>
      </div>

      <div className="admin-content">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '12px' }}>
            <Loader2 size={32} className="admin-spin" color="#6366f1" />
            <span style={{ fontSize: '13px', color: '#8892a4' }}>Loading Site Configuration...</span>
          </div>
        ) : (
          <div className="admin-table-card">
            <div className="admin-table-header">
              <h3>Settings ({settings.length})</h3>
            </div>
            <div style={{ padding: '20px' }}>
              {settings.map(setting => (
                <div key={setting.key} style={{ marginBottom: '16px' }}>
                  <label className="admin-label">
                    {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                  {setting.description && (
                    <div style={{ fontSize: '11px', color: '#8892a4', marginBottom: '6px' }}>{setting.description}</div>
                  )}
                  <input
                    className="admin-input"
                    value={setting.value ?? ''}
                    onChange={e => updateSetting(setting.key, e.target.value)}
                    style={{ marginBottom: 0 }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
