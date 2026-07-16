-- ============================================================
-- LUXURY JEWELERIS - COMPLETE SUPABASE SQL SCHEMA
-- Paste this entire file into Supabase SQL Editor and Run
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. CATEGORIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT UNIQUE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  comp_price NUMERIC(10, 2),
  save_pct NUMERIC(5, 2),
  shape TEXT,
  carat NUMERIC(6, 3),
  color TEXT,
  clarity TEXT,
  cut TEXT,
  metal TEXT,
  style TEXT,
  category TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image TEXT,
  ai_score NUMERIC(4, 2) DEFAULT 8.5,
  is_verified BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  stock_qty INT DEFAULT 10,
  tags TEXT[],
  recipient TEXT,
  occasion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. PRODUCT IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'US',
  ring_size TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. ADMIN USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE DEFAULT ('ORD-' || upper(substr(md5(random()::text), 1, 8))),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  discount NUMERIC(10, 2) DEFAULT 0,
  shipping_cost NUMERIC(10, 2) DEFAULT 0,
  tax NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  shipping_address JSONB,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  payment_method TEXT,
  payment_intent_id TEXT,
  tracking_number TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  product_sku TEXT,
  metal TEXT,
  size TEXT,
  unit_price NUMERIC(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  subtotal NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. WISHLIST
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================================
-- 10. BLOG POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  body TEXT,
  cover_image TEXT,
  author_name TEXT DEFAULT 'Luxury Jeweleris',
  tags TEXT[],
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11. HERO BANNERS
-- ============================================================
CREATE TABLE IF NOT EXISTS hero_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_text TEXT,
  cta_link TEXT,
  image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. SITE SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Products are publicly readable" ON products;
DROP POLICY IF EXISTS "Admin can manage products" ON products;
CREATE POLICY "Products are publicly readable" ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admin can manage products" ON products FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = TRUE));

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Categories are publicly readable" ON categories;
DROP POLICY IF EXISTS "Admin can manage categories" ON categories;
CREATE POLICY "Categories are publicly readable" ON categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admin can manage categories" ON categories FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = TRUE));

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Product images are publicly readable" ON product_images;
DROP POLICY IF EXISTS "Admin can manage product images" ON product_images;
CREATE POLICY "Product images are publicly readable" ON product_images FOR SELECT USING (TRUE);
CREATE POLICY "Admin can manage product images" ON product_images FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = TRUE));

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin can view all profiles" ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = TRUE));

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Admin can manage all orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin can manage all orders" ON orders FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = TRUE));

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert order items" ON order_items;
DROP POLICY IF EXISTS "Admin can manage all order items" ON order_items;
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()));
CREATE POLICY "Users can insert order items" ON order_items FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin can manage all order items" ON order_items FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = TRUE));

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Approved reviews are public" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Admin can manage reviews" ON reviews;
CREATE POLICY "Approved reviews are public" ON reviews FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin can manage reviews" ON reviews FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = TRUE));

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own wishlist" ON wishlist;
CREATE POLICY "Users manage own wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published blogs are public" ON blog_posts;
DROP POLICY IF EXISTS "Admin can manage blogs" ON blog_posts;
CREATE POLICY "Published blogs are public" ON blog_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admin can manage blogs" ON blog_posts FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = TRUE));

ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Active banners are public" ON hero_banners;
DROP POLICY IF EXISTS "Admin can manage banners" ON hero_banners;
CREATE POLICY "Active banners are public" ON hero_banners FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admin can manage banners" ON hero_banners FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = TRUE));

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Site settings are public" ON site_settings;
DROP POLICY IF EXISTS "Admin can manage settings" ON site_settings;
CREATE POLICY "Site settings are public" ON site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admin can manage settings" ON site_settings FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = TRUE));

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin users can see admin table" ON admin_users;
CREATE POLICY "Admin users can see admin table" ON admin_users FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_style ON products(style);
CREATE INDEX IF NOT EXISTS idx_products_shape ON products(shape);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);

-- ============================================================
-- SEED: CATEGORIES
-- ============================================================
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Engagement Rings', 'engagement-rings', 'Stunning engagement rings for your proposal', 1),
  ('Wedding Bands', 'wedding-bands', 'Beautiful bands to celebrate your union', 2),
  ('Earrings', 'earrings', 'Diamond studs, hoops and more', 3),
  ('Necklaces', 'necklaces', 'Pendants, chains and tennis necklaces', 4),
  ('Bracelets', 'bracelets', 'Tennis bracelets, bangles and more', 5),
  ('Loose Diamonds', 'diamonds', 'Certified loose diamonds', 6),
  ('Gifts', 'gifts', 'Perfect gifts for every occasion', 7)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED: SITE SETTINGS
-- ============================================================
INSERT INTO site_settings (key, value, description) VALUES
  ('sale_banner_text', '4th of July Sale — Up to 40% Off', 'Top banner sale text'),
  ('site_name', 'Luxury Jeweleris', 'Site name'),
  ('support_email', 'support@luxuryjeweleris.com', 'Customer support email'),
  ('free_shipping_threshold', '500', 'Free shipping over this amount ($)'),
  ('tax_rate', '0.08', 'Tax rate (8%)'),
  ('currency', 'USD', 'Default currency')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- SEED: PRODUCTS
-- ============================================================
INSERT INTO products (name, price, comp_price, image, shape, carat, color, clarity, cut, ai_score, is_verified, is_new, category, style, metal, is_featured, tags) VALUES
  ('1.20 ct Oval Brilliant Cut Platinum Ring', 4200, 5800, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop', 'Oval', 1.20, 'E', 'VVS2', 'Excellent', 9.4, TRUE, TRUE, 'Ring', 'Pave', 'Platinum', TRUE, ARRAY['trending']),
  ('0.90 ct Round Classic Solitaire Ring', 2800, 3900, 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?q=80&w=600&auto=format&fit=crop', 'Round', 0.90, 'F', 'VS1', 'Ideal', 9.1, TRUE, FALSE, 'Ring', 'Solitaire', 'White Gold', FALSE, ARRAY['bestseller']),
  ('1.50 ct Cushion Cut Hidden Halo Ring', 6400, 8900, 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop', 'Cushion', 1.50, 'D', 'VVS1', 'Ideal', 9.7, TRUE, TRUE, 'Ring', 'Hidden Halo', 'White Gold', TRUE, ARRAY['trending','bestseller']),
  ('2.10 ct Princess Cut Engagement Ring', 11200, 15800, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop', 'Princess', 2.10, 'G', 'VS2', 'Excellent', 8.9, FALSE, FALSE, 'Ring', 'Engagement', 'Yellow Gold', FALSE, ARRAY[]::TEXT[]),
  ('1.70 ct Emerald Cut Solitaire Platinum Ring', 8200, 11500, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop', 'Emerald', 1.70, 'E', 'VS1', 'Very Good', 9.2, FALSE, FALSE, 'Ring', 'Solitaire', 'Platinum', FALSE, ARRAY[]::TEXT[]),
  ('1.05 ct Pear Shaped Pave Diamond Ring', 3950, 5600, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop', 'Pear', 1.05, 'H', 'VVS2', 'Excellent', 9.5, TRUE, FALSE, 'Ring', 'Pave', 'Rose Gold', FALSE, ARRAY['trending']),
  ('0.75 ct Cushion Cut Six-Prong Ring', 1900, 2700, 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?q=80&w=600&auto=format&fit=crop', 'Cushion', 0.75, 'F', 'VS2', 'Excellent', 8.8, FALSE, FALSE, 'Ring', 'Solitaire', 'White Gold', FALSE, ARRAY[]::TEXT[]),
  ('1.80 ct Round Brilliant Cut Halo Ring', 9800, 13900, 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop', 'Round', 1.80, 'D', 'VVS1', 'Ideal', 9.8, TRUE, TRUE, 'Ring', 'Halo', 'White Gold', TRUE, ARRAY['trending','bestseller']),
  ('2.30 ct Oval Cut Vintage Accent Ring', 14500, 20200, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop', 'Oval', 2.30, 'E', 'VVS2', 'Ideal', 9.6, TRUE, FALSE, 'Ring', 'Christian', 'White Gold', FALSE, ARRAY['christian-siriano']),
  ('1.10 ct Emerald Cut Hidden Halo Gold Ring', 4800, 6700, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop', 'Emerald', 1.10, 'F', 'VS1', 'Excellent', 9.0, TRUE, FALSE, 'Ring', 'Hidden Halo', 'Yellow Gold', FALSE, ARRAY[]::TEXT[]),
  ('0.60 ct Round Cut Pave Accent Ring', 1650, 2300, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop', 'Round', 0.60, 'G', 'VS2', 'Very Good', 8.6, FALSE, FALSE, 'Ring', 'Pave', 'Rose Gold', FALSE, ARRAY[]::TEXT[]),
  ('1.30 ct Princess Cut Halo Gold Ring', 5300, 7400, 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop', 'Princess', 1.30, 'E', 'VVS1', 'Excellent', 9.3, TRUE, FALSE, 'Ring', 'Halo', 'Yellow Gold', FALSE, ARRAY[]::TEXT[]),
  ('1.50 ct Round Brilliant Diamond Stud Earrings', 3200, 4500, 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop', 'Round', 1.50, 'E', 'VVS2', 'Ideal', 9.5, TRUE, TRUE, 'Earrings', 'Stud', 'White Gold', TRUE, ARRAY['trending']),
  ('Diamond Huggie Hoop Earrings 14K Gold', 1250, 1800, 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop', 'Round', 0.80, 'F', 'VS1', 'Excellent', 9.0, TRUE, FALSE, 'Earrings', 'Hoop', 'Yellow Gold', FALSE, ARRAY[]::TEXT[]),
  ('1.00 ct Diamond Solitaire Pendant Necklace', 2900, 4100, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop', 'Round', 1.00, 'E', 'VVS1', 'Ideal', 9.6, TRUE, TRUE, 'Necklace', 'Solitaire', 'White Gold', TRUE, ARRAY['trending']),
  ('18K Yellow Gold Multi-Diamond Choker', 5400, 7600, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop', 'Round', 2.20, 'F', 'VS2', 'Excellent', 9.1, FALSE, FALSE, 'Necklace', 'Pave', 'Yellow Gold', FALSE, ARRAY[]::TEXT[]),
  ('4.50 ct Classic Diamond Tennis Bracelet', 7800, 11000, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop', 'Round', 4.50, 'G', 'VS1', 'Excellent', 9.2, TRUE, FALSE, 'Bracelet', 'Pave', 'White Gold', TRUE, ARRAY['bestseller']),
  ('Classic Gold Mens Wedding Band', 950, 1400, 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop', 'Round', 0.40, 'H', 'VS2', 'Excellent', 8.7, FALSE, FALSE, 'Wedding Band', 'Mens', 'Yellow Gold', FALSE, ARRAY['him']),
  ('Platinum Diamond Eternity Wedding Band', 4600, 6500, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop', 'Round', 1.80, 'E', 'VVS2', 'Ideal', 9.4, TRUE, TRUE, 'Wedding Band', 'Eternity', 'Platinum', FALSE, ARRAY['her']),
  ('Gold Stackable Diamond Eternity Band', 1100, 1600, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop', 'Round', 0.50, 'F', 'VS1', 'Excellent', 8.9, FALSE, FALSE, 'Wedding Band', 'Stackable', 'Yellow Gold', FALSE, ARRAY['her']),
  ('1.01 ct Oval Lab Created Loose Diamond', 1800, 2600, 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=600&auto=format&fit=crop', 'Oval', 1.01, 'D', 'VVS1', 'Ideal', 9.8, TRUE, TRUE, 'Loose Diamond', 'Lab', NULL, FALSE, ARRAY['lab']),
  ('1.50 ct Round Ideal Cut Lab Diamond', 3100, 4400, 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600&auto=format&fit=crop', 'Round', 1.50, 'E', 'VVS2', 'Ideal', 9.7, TRUE, FALSE, 'Loose Diamond', 'Lab', NULL, FALSE, ARRAY['lab'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: HERO BANNERS
-- ============================================================
INSERT INTO hero_banners (title, subtitle, cta_text, cta_link, image_url, sort_order) VALUES
  ('Find Your Perfect Diamond', 'AI-curated lab diamonds at up to 40% below retail. Every stone verified.', 'Shop Now', '/engagement-rings', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop', 1),
  ('4th of July Sale', 'Save up to 40% on engagement rings and wedding bands this season.', 'View Sale', '/engagement-rings', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop', 2),
  ('Diamond Earrings & Necklaces', 'Complete your look with our stunning collection of fine jewelry.', 'Shop Jewelry', '/earrings', 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=1200&auto=format&fit=crop', 3)
ON CONFLICT DO NOTHING;

-- ============================================================
-- HOW TO ADD YOURSELF AS ADMIN:
-- After signing up at /login, run this SQL in Supabase:
--
--   INSERT INTO admin_users (user_id, email, role)
--   SELECT id, email, 'super_admin'
--   FROM auth.users
--   WHERE email = 'YOUR_EMAIL_HERE';
--
-- ============================================================
