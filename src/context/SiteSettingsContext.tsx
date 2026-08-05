'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface SettingItemDef {
  value: string;
  label: string;
  description: string;
}

export const DEFAULT_SITE_SETTINGS: Record<string, SettingItemDef> = {
  store_phone: {
    value: '+1 213-642-7217',
    label: 'Store Phone Number',
    description: 'Header announcement bar & customer support phone number'
  },
  contact_email: {
    value: 'luxuryjeweleris@gmail.com',
    label: 'Contact Support Email',
    description: 'Customer support contact email address'
  },
  top_announcement_bar: {
    value: '',
    label: 'Top Announcement Bar Text',
    description: 'Promo banner headline shown at top of all pages'
  },
  hero_badge_text: {
    value: '✦ Trusted by Thousands Worldwide',
    label: 'Hero Section Badge Text',
    description: 'Badge text above the main homepage title'
  },
  hero_title: {
    value: 'Timeless jewelry, crafted for you.',
    label: 'Homepage Hero Title',
    description: 'Main display title on the homepage hero banner'
  },
  hero_subtitle: {
    value: 'Discover our curated collection of fine jewelry — from engagement rings to everyday elegance. Handcrafted with precision and passion.',
    label: 'Homepage Hero Subtitle',
    description: 'Subtitle description paragraph on homepage hero banner'
  },
  facebook_url: {
    value: 'https://www.facebook.com/profile.php?id=61588328596938&mibextid=wwXIfr',
    label: 'Facebook Page Link',
    description: 'Link to official Facebook page shown in footer'
  },
  free_shipping_text: {
    value: '100% Free Insured Shipping',
    label: 'Shipping Guarantee Text',
    description: 'Free shipping message in trust strips and footer'
  },
  return_policy_text: {
    value: '30-Day Money-Back Returns',
    label: 'Return Policy Text',
    description: 'Money-back guarantee text in footer'
  }
};

export type SiteSettingsMap = Record<string, string>;

interface SiteSettingsContextType {
  settings: SiteSettingsMap;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettingsState: (newMap: SiteSettingsMap) => void;
  getSetting: (key: string, fallback?: string) => string;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const buildDefaultMap = (): SiteSettingsMap => {
  const map: SiteSettingsMap = {};
  Object.keys(DEFAULT_SITE_SETTINGS).forEach(k => {
    map[k] = DEFAULT_SITE_SETTINGS[k].value;
  });
  return map;
};

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettingsMap>(buildDefaultMap());
  const [loading, setLoading] = useState(true);

  // Load from localStorage immediately on mount for fast instant render
  useEffect(() => {
    try {
      const cached = localStorage.getItem('luxury_site_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (!error && data && data.length > 0) {
        const dbMap: SiteSettingsMap = buildDefaultMap();
        data.forEach((row: { key: string; value: string }) => {
          if (row.key && row.value !== undefined && row.value !== null) {
            dbMap[row.key] = row.value;
          }
        });
        setSettings(dbMap);
        try {
          localStorage.setItem('luxury_site_settings', JSON.stringify(dbMap));
        } catch {
          // Ignore
        }
      }
    } catch (err) {
      console.error('Error fetching site settings from Supabase:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    // Listen for custom settings update event
    const handleCustomEvent = (e: any) => {
      if (e.detail) {
        setSettings(prev => ({ ...prev, ...e.detail }));
      } else {
        fetchSettings();
      }
    };

    window.addEventListener('site_settings_updated', handleCustomEvent);
    return () => {
      window.removeEventListener('site_settings_updated', handleCustomEvent);
    };
  }, [fetchSettings]);

  const updateSettingsState = (newMap: SiteSettingsMap) => {
    setSettings(prev => {
      const merged = { ...prev, ...newMap };
      try {
        localStorage.setItem('luxury_site_settings', JSON.stringify(merged));
      } catch {
        // Ignore
      }
      return merged;
    });
    window.dispatchEvent(new CustomEvent('site_settings_updated', { detail: newMap }));
  };

  const getSetting = (key: string, fallback?: string): string => {
    if (settings[key] !== undefined && settings[key] !== null) {
      return settings[key];
    }
    if (DEFAULT_SITE_SETTINGS[key]) {
      return DEFAULT_SITE_SETTINGS[key].value;
    }
    return fallback || '';
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings, updateSettingsState, getSetting }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

export default SiteSettingsContext;
