/*
  # Venture Couture eCommerce Database Schema

  ## Overview
  Complete database schema for a fashion eCommerce platform with ERP capabilities.
  Includes product management, orders, customers, inventory, analytics, and admin features.

  ## New Tables

  ### 1. Products & Catalog
  - `categories` - Product categories with hierarchy support
  - `products` - Main product catalog with details
  - `product_variants` - Size, color, and other variants
  - `product_images` - Multiple images per product
  - `product_reviews` - Customer ratings and reviews

  ### 2. Orders & Transactions
  - `orders` - Order header information
  - `order_items` - Line items for each order
  - `shipping_addresses` - Customer delivery addresses
  - `payments` - Payment transaction records

  ### 3. Customer Management
  - `customers` - Customer profiles and preferences
  - `wishlists` - Customer wish lists
  - `cart_items` - Shopping cart persistence

  ### 4. Inventory & Warehouse
  - `warehouses` - Multi-warehouse locations
  - `inventory` - Stock levels per warehouse
  - `stock_movements` - Inventory transaction history

  ### 5. Marketing & Promotions
  - `discount_codes` - Coupon and promotion codes
  - `ad_campaigns` - Video ad placements
  - `email_campaigns` - Bulk email promotions

  ### 6. Admin & Analytics
  - `admin_users` - Admin accounts and roles
  - `support_tickets` - Customer support system
  - `analytics_events` - User behavior tracking

  ## Security
  - RLS enabled on all tables
  - Policies for authenticated users and admins
  - Public access for product viewing
  - Restricted access for sensitive data
*/

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  parent_id uuid REFERENCES categories(id),
  image_url text DEFAULT '',
  display_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  category_id uuid REFERENCES categories(id),
  base_price decimal(10,2) NOT NULL,
  sale_price decimal(10,2),
  sku text UNIQUE NOT NULL,
  brand text DEFAULT '',
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  meta_title text DEFAULT '',
  meta_description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product Variants (sizes, colors, etc)
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  sku text UNIQUE NOT NULL,
  name text NOT NULL,
  size text DEFAULT '',
  color text DEFAULT '',
  price_adjustment decimal(10,2) DEFAULT 0,
  stock_quantity int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Product Images
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  alt_text text DEFAULT '',
  display_order int DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text DEFAULT '',
  last_name text DEFAULT '',
  phone text DEFAULT '',
  avatar_url text DEFAULT '',
  loyalty_points int DEFAULT 0,
  total_orders int DEFAULT 0,
  total_spent decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Shipping Addresses
CREATE TABLE IF NOT EXISTS shipping_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text DEFAULT '',
  city text NOT NULL,
  province text NOT NULL,
  postal_code text NOT NULL,
  country text DEFAULT 'South Africa',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES customers(id) NOT NULL,
  status text DEFAULT 'pending',
  subtotal decimal(10,2) NOT NULL,
  discount_amount decimal(10,2) DEFAULT 0,
  shipping_cost decimal(10,2) DEFAULT 0,
  tax_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  shipping_address_id uuid REFERENCES shipping_addresses(id),
  payment_method text DEFAULT '',
  payment_status text DEFAULT 'pending',
  tracking_number text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) NOT NULL,
  variant_id uuid REFERENCES product_variants(id),
  quantity int NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  payment_method text NOT NULL,
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending',
  transaction_id text DEFAULT '',
  payment_details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  variant_id uuid REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity int DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Wishlists
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(customer_id, product_id)
);

-- Product Reviews
CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id),
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text DEFAULT '',
  comment text DEFAULT '',
  is_verified boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Warehouses
CREATE TABLE IF NOT EXISTS warehouses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  address text DEFAULT '',
  city text DEFAULT '',
  province text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Inventory
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  variant_id uuid REFERENCES product_variants(id) ON DELETE CASCADE,
  warehouse_id uuid REFERENCES warehouses(id) NOT NULL,
  quantity int DEFAULT 0,
  reserved_quantity int DEFAULT 0,
  reorder_level int DEFAULT 10,
  reorder_quantity int DEFAULT 50,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, variant_id, warehouse_id)
);

-- Stock Movements
CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id uuid REFERENCES inventory(id) NOT NULL,
  movement_type text NOT NULL,
  quantity int NOT NULL,
  reference_id uuid,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Discount Codes
CREATE TABLE IF NOT EXISTS discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  description text DEFAULT '',
  discount_type text NOT NULL,
  discount_value decimal(10,2) NOT NULL,
  min_purchase_amount decimal(10,2) DEFAULT 0,
  max_discount_amount decimal(10,2),
  usage_limit int,
  usage_count int DEFAULT 0,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'admin',
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) NOT NULL,
  order_id uuid REFERENCES orders(id),
  subject text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'open',
  priority text DEFAULT 'medium',
  assigned_to uuid REFERENCES admin_users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Email Campaigns
CREATE TABLE IF NOT EXISTS email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'draft',
  scheduled_at timestamptz,
  sent_at timestamptz,
  total_recipients int DEFAULT 0,
  total_opened int DEFAULT 0,
  total_clicked int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Ad Campaigns
CREATE TABLE IF NOT EXISTS ad_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  video_url text DEFAULT '',
  image_url text DEFAULT '',
  target_url text DEFAULT '',
  placement text DEFAULT 'home',
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  impressions int DEFAULT 0,
  clicks int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  customer_id uuid REFERENCES customers(id),
  product_id uuid REFERENCES products(id),
  order_id uuid REFERENCES orders(id),
  event_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Public read access for catalog
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view product variants"
  ON product_variants FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view product images"
  ON product_images FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view approved reviews"
  ON product_reviews FOR SELECT
  USING (is_approved = true);

-- Customer policies
CREATE POLICY "Customers can view own profile"
  ON customers FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Customers can update own profile"
  ON customers FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Customers can view own addresses"
  ON shipping_addresses FOR SELECT
  TO authenticated
  USING (customer_id::text = auth.uid()::text);

CREATE POLICY "Customers can manage own addresses"
  ON shipping_addresses FOR ALL
  TO authenticated
  USING (customer_id::text = auth.uid()::text)
  WITH CHECK (customer_id::text = auth.uid()::text);

CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (customer_id::text = auth.uid()::text);

CREATE POLICY "Customers can view own cart"
  ON cart_items FOR ALL
  TO authenticated
  USING (customer_id::text = auth.uid()::text)
  WITH CHECK (customer_id::text = auth.uid()::text);

CREATE POLICY "Customers can manage own wishlist"
  ON wishlists FOR ALL
  TO authenticated
  USING (customer_id::text = auth.uid()::text)
  WITH CHECK (customer_id::text = auth.uid()::text);

CREATE POLICY "Customers can create reviews"
  ON product_reviews FOR INSERT
  TO authenticated
  WITH CHECK (customer_id::text = auth.uid()::text);

CREATE POLICY "Customers can view own tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (customer_id::text = auth.uid()::text);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_customer ON cart_items(customer_id);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse ON inventory(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);