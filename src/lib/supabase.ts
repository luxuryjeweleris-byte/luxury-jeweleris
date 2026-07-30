// @ts-ignore
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client (for use in client components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================
// TypeScript types matching the database schema
// ============================================================

export interface DbProduct {
  id: string;
  sku: string | null;
  name: string;
  slug: string | null;
  description: string | null;
  price: number;
  comp_price: number | null;
  save_pct: number | null;
  shape: string | null;
  carat: number | null;
  color: string | null;
  cut: string | null;
  metal: string | null;
  style: string | null;
  category: string;
  image: string | null;
  image_yellow_gold?: string | null;
  image_rose_gold?: string | null;
  image_platinum?: string | null;
  image_silver?: string | null;
  images_white_gold?: string[] | null;
  images_yellow_gold?: string[] | null;
  images_rose_gold?: string[] | null;
  images_platinum?: string[] | null;
  images_silver?: string[] | null;
  is_verified: boolean;
  is_new: boolean;
  is_featured: boolean;
  is_active: boolean;
  stock_qty: number;
  tags: string[] | null;
  images_360?: string[] | null;
  url_360?: string | null;
  config_360?: any;
  video_url?: string | null;
  recipient: string | null;
  occasion: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbOrder {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_email: string;
  customer_name: string | null;
  customer_phone: string | null;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  tax: number;
  total: number;
  shipping_address: Record<string, string> | null;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_method: string | null;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  metal: string | null;
  size: string | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
}

export interface DbProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string;
  ring_size: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbAdminUser {
  id: string;
  user_id: string;
  email: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
}

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface DbHeroBanner {
  id: string;
  title: string;
  subtitle: string | null;
  cta_text: string | null;
  cta_link: string | null;
  image_url: string;
  mobile_image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface DbSiteSetting {
  key: string;
  value: string | null;
  description: string | null;
  updated_at: string;
}

// ============================================================
// Helper: Map DbProduct → Product (used in components)
// ============================================================
import type { Product } from '../components/ProductCard';

export function dbProductToProduct(p: DbProduct): Product {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    compPrice: p.comp_price ?? p.price,
    image: p.image ?? 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
    imageYellowGold: p.image_yellow_gold ?? undefined,
    imageRoseGold: p.image_rose_gold ?? undefined,
    imagePlatinum: p.image_platinum ?? undefined,
    imageSilver: p.image_silver ?? undefined,
    imagesWhiteGold: (p.images_white_gold && p.images_white_gold.length > 0) ? p.images_white_gold : (p.image ? [p.image] : []),
    imagesYellowGold: (p.images_yellow_gold && p.images_yellow_gold.length > 0) ? p.images_yellow_gold : (p.image_yellow_gold ? [p.image_yellow_gold] : []),
    imagesRoseGold: (p.images_rose_gold && p.images_rose_gold.length > 0) ? p.images_rose_gold : (p.image_rose_gold ? [p.image_rose_gold] : []),
    imagesPlatinum: (p.images_platinum && p.images_platinum.length > 0) ? p.images_platinum : (p.image_platinum ? [p.image_platinum] : []),
    imagesSilver: (p.images_silver && p.images_silver.length > 0) ? p.images_silver : (p.image_silver ? [p.image_silver] : []),
    shape: p.shape ?? 'Round',
    carat: p.carat ?? 1.0,
    color: p.color ?? 'F',
    cut: p.cut ?? 'Excellent',
    isVerified: p.is_verified,
    isNew: p.is_new,
    savePct: p.save_pct ?? undefined,
    category: p.category,
    style: p.style ?? undefined,
    images360: (p.images_360 && p.images_360.length > 0) ? p.images_360 : undefined,
    url360: p.url_360 ?? undefined,
    config360: p.config_360 ?? undefined,
    videoUrl: p.video_url ?? undefined,
  };
}
