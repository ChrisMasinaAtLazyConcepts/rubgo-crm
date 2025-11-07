import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  category: string;
  image_url: string;
  rating: number; 
  slug: string;
  description: string;
  category_id: string;
  base_price: number;
  sale_price: number | 0;
  sku: string;
  brand: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_primary: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  sku: string;
  name: string;
  size: string;
  color: string;
  stock_quantity: number;
  is_active: boolean;
};

export type CartItem = {
  id: string;
  customer_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  created_at: string;
};

export type Order = {
  id: string;
  order_number: string;
  customer_id: string;
  status: string;
  subtotal: number;
  discount_amount: number;
  shipping_cost: number;
  tax_amount: number;
  total_amount: number;
  created_at: string;
};

export type ProductReview = {
  id: string;
  product_id: string;
  rating: number;
  title: string;
  comment: string;
  is_verified: boolean;
  created_at: string;
};
