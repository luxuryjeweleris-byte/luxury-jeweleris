'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Save, CheckCircle2, AlertCircle, RefreshCw, Globe, Megaphone, ShieldCheck } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import type { DbSiteSetting } from '../../../../lib/supabase';
import { useAdminContext } from '../admin-context';
import { DEFAULT_SITE_SETTINGS, useSiteSettings } from '../../../../context/SiteSettingsContext';
import '../../../admin/admin.css';

export default function SettingsAdmin() {
  const { adminEmail } = useAdminContext();
  const { refreshSettings, updateSettingsState } = useSiteSettings();
  const [loading, setLoading] = useState(true);
  const [settingsMap, setSettingsMap] = useState<Record<string, { value: string; description: string }>>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) {
        console.error('Error loading settings from Supabase:', error);
      }

      // Merge defaults with DB values
      const initialMap: Record<string, { value: string; description: string }> = {};

      // First populate defaults
      Object.keys(DEFAULT_SITE_SETTINGS).forEach(k => {
        initialMap[k] = {
          value: DEFAULT_SITE_SETTINGS[k].value,
          description: DEFAULT_SITE_SETTINGS[k].description
        };
      });

      // Override with DB values
      if (data && data.length > 0) {
        data.forEach((row: DbSiteSetting) => {
          if (row.key) {
            initialMap[row.key] = {
              value: row.value ?? '',
              description: row.description || (DEFAULT_SITE_SETTINGS[row.key]?.description ?? '')
            };
          }
        });
      }

      setSettingsMap(initialMap);
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleValueChange = (key: string, value: string) => {
    setSettingsMap(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const keys = Object.keys(settingsMap);
      const newValuesMap: Record<string, string> = {};
      keys.forEach(k => {
        newValuesMap[k] = settingsMap[k].value;
      });

      // 1. Instantly apply settings locally to current website session
      updateSettingsState(newValuesMap);

      // 2. Sync to Supabase Database table
      const upsertRows = keys.map(k => ({
        key: k,
        value: settingsMap[k].value,
        description: settingsMap[k].description,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('site_settings')
        .upsert(upsertRows, { onConflict: 'key' });

      if (error) {
        console.warn('Supabase DB error when saving site_settings:', error);
        setSaveSuccess(true);
        setSaveError(`Saved to website session! (Note: database persistence encountered error: ${error.message})`);
      } else {
        await refreshSettings();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err: any) {
      console.error('Error saving site settings:', err);
      setSaveError(err.message || 'Failed to save settings to database');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    {
      title: 'Header & Announcement Bar',
      icon: Megaphone,
      keys: ['top_announcement_bar', 'store_phone', 'contact_email']
    },
    {
      title: 'Homepage Hero Banner',
      icon: Globe,
      keys: ['hero_badge_text', 'hero_title', 'hero_subtitle']
    },
    {
      title: 'Store Guarantees & Social Links',
      icon: ShieldCheck,
      keys: ['facebook_url', 'free_shipping_text', 'return_policy_text']
    }
  ];

  return (
    <>
      {/* Topbar */}
      <div className="admin-topbar">
        <span className="admin-topbar-title">Site Configuration &amp; Settings</span>
        <div className="admin-topbar-right">
          <button
            className="admin-btn admin-btn-primary"
            onClick={handleSave}
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', fontWeight: 700 }}
          >
            {saving ? (
              <Loader2 size={16} className="admin-spin" />
            ) : (
              <>
                <Save size={16} /> Save All Changes
              </>
            )}
          </button>
          <div className="admin-avatar">{adminEmail[0]?.toUpperCase() || 'A'}</div>
        </div>
      </div>

      <div className="admin-content">
        {/* Success / Error Banners */}
        {saveSuccess && (
          <div style={{ padding: '12px 16px', background: '#052e16', border: '1px solid #166534', color: '#4ade80', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', fontWeight: 600 }}>
            <CheckCircle2 size={18} color="#4ade80" />
            <span>Site settings updated successfully! Changes are now active live across the website.</span>
          </div>
        )}

        {saveError && (
          <div style={{ padding: '12px 16px', background: '#450a0a', border: '1px solid #991b1b', color: '#fca5a5', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', fontWeight: 600 }}>
            <AlertCircle size={18} color="#fca5a5" />
            <span>Save note: {saveError}</span>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '12px' }}>
            <Loader2 size={32} className="admin-spin" color="#6366f1" />
            <span style={{ fontSize: '13px', color: '#8892a4' }}>Loading Store Settings from Database...</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {sections.map(section => {
              const SectionIcon = section.icon;
              return (
                <div key={section.title} className="admin-table-card">
                  <div className="admin-table-header" style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                        <SectionIcon size={18} />
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                        {section.title}
                      </h3>
                    </div>
                  </div>

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {section.keys.map(key => {
                      const item = settingsMap[key] || { value: '', description: '' };
                      const label = DEFAULT_SITE_SETTINGS[key]?.label || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                      const isMultiLine = key === 'hero_subtitle' || key === 'top_announcement_bar';

                      return (
                        <div key={key}>
                          <label className="admin-label" style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px', display: 'block' }}>
                            {label}
                          </label>

                          {item.description && (
                            <div style={{ fontSize: '11.5px', color: '#94a3b8', marginBottom: '8px' }}>
                              {item.description}
                            </div>
                          )}

                          {isMultiLine ? (
                            <textarea
                              className="admin-input"
                              rows={3}
                              value={item.value}
                              onChange={e => handleValueChange(key, e.target.value)}
                              style={{ width: '100%', resize: 'vertical', lineHeight: 1.5, fontFamily: 'inherit' }}
                            />
                          ) : (
                            <input
                              type="text"
                              className="admin-input"
                              value={item.value}
                              onChange={e => handleValueChange(key, e.target.value)}
                              style={{ width: '100%' }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Bottom Save Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px', marginBottom: '40px' }}>
              <button
                className="admin-btn admin-btn-ghost"
                onClick={fetchSettings}
                disabled={saving}
              >
                <RefreshCw size={15} /> Reset Changes
              </button>

              <button
                className="admin-btn admin-btn-primary"
                onClick={handleSave}
                disabled={saving}
                style={{ padding: '10px 28px', fontSize: '14px', fontWeight: 700 }}
              >
                {saving ? <Loader2 size={16} className="admin-spin" /> : <><Save size={16} /> Save All Changes</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
