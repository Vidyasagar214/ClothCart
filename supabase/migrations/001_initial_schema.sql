-- ClothCart Supabase Schema & RLS Policies
-- Version: 1.0
-- Run via: supabase db push

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'support');
CREATE TYPE gender_type AS ENUM ('men', 'women', 'children', 'unisex');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned');
CREATE TYPE payment_method AS ENUM ('card', 'upi', 'netbanking', 'wallet', 'cod');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected', 'hidden');
CREATE TYPE return_reason AS ENUM ('defective', 'wrong_item', 'size_issue', 'changed_mind', 'other');
CREATE TYPE return_status AS ENUM ('requested', 'approved', 'rejected', 'picked_up', 'refunded');

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) UNIQUE,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label VARCHAR(50) DEFAULT 'home',
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(6) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- CATALOG
-- ============================================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  parent_id UUID REFERENCES public.categories(id),
  gender gender_type,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  brand_id UUID REFERENCES public.brands(id),
  category_id UUID NOT NULL REFERENCES public.categories(id),
  base_price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  sku_prefix VARCHAR(20) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku VARCHAR(50) UNIQUE NOT NULL,
  size VARCHAR(10) NOT NULL,
  color VARCHAR(50) NOT NULL,
  color_hex VARCHAR(7),
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold INT DEFAULT 5,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT false
);

-- ============================================================
-- COMMERCE
-- ============================================================
CREATE TABLE public.carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id VARCHAR(100),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT cart_owner CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id),
  quantity INT NOT NULL CHECK (quantity > 0),
  price_at_add DECIMAL(10,2) NOT NULL,
  UNIQUE(cart_id, variant_id)
);

CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  status order_status NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method payment_method NOT NULL,
  tracking_number VARCHAR(100),
  notes TEXT,
  cancelled_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id),
  product_name VARCHAR(255) NOT NULL,
  variant_size VARCHAR(10) NOT NULL,
  variant_color VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID UNIQUE NOT NULL REFERENCES public.orders(id),
  provider VARCHAR(20) DEFAULT 'razorpay',
  provider_payment_id VARCHAR(100),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status payment_status NOT NULL DEFAULT 'pending',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- REVIEWS & RETURNS
-- ============================================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(200),
  body TEXT NOT NULL,
  status review_status DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE public.returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  order_item_id UUID NOT NULL REFERENCES public.order_items(id),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  reason return_reason NOT NULL,
  description TEXT,
  status return_status DEFAULT 'requested',
  refund_amount DECIMAL(10,2),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE public.inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES public.product_variants(id),
  change_quantity INT NOT NULL,
  reason VARCHAR(50) NOT NULL,
  reference_id UUID,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_products_category ON public.products(category_id) WHERE is_active = true;
CREATE INDEX idx_products_brand ON public.products(brand_id);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_tags ON public.products USING GIN(tags);
CREATE INDEX idx_variants_product ON public.product_variants(product_id);
CREATE INDEX idx_orders_user ON public.orders(user_id, created_at DESC);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_reviews_product ON public.reviews(product_id, status);
CREATE INDEX idx_addresses_user ON public.addresses(user_id);

-- Full-text search
CREATE INDEX idx_products_search ON public.products
  USING GIN(to_tsvector('english', name || ' ' || description));

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Helper: check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'support') AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: check if user is admin only (not support)
CREATE OR REPLACE FUNCTION public.is_admin_only()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Decrement stock on order (called from Edge Function)
CREATE OR REPLACE FUNCTION public.decrement_stock(p_variant_id UUID, p_qty INT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.product_variants
  SET stock_quantity = stock_quantity - p_qty
  WHERE id = p_variant_id AND stock_quantity >= p_qty;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for variant %', p_variant_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Admin manage profiles" ON public.profiles
  FOR ALL USING (public.is_admin_only());

-- ADDRESSES
CREATE POLICY "Users manage own addresses" ON public.addresses
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admin read addresses" ON public.addresses
  FOR SELECT USING (public.is_admin());

-- CATALOG (public read)
CREATE POLICY "Public read categories" ON public.categories
  FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin manage categories" ON public.categories
  FOR ALL USING (public.is_admin_only());

CREATE POLICY "Public read brands" ON public.brands
  FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin manage brands" ON public.brands
  FOR ALL USING (public.is_admin_only());

CREATE POLICY "Public read active products" ON public.products
  FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin manage products" ON public.products
  FOR ALL USING (public.is_admin_only());

CREATE POLICY "Public read active variants" ON public.product_variants
  FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin manage variants" ON public.product_variants
  FOR ALL USING (public.is_admin_only());

CREATE POLICY "Public read product images" ON public.product_images
  FOR SELECT USING (true);
CREATE POLICY "Admin manage product images" ON public.product_images
  FOR ALL USING (public.is_admin_only());

-- CARTS
CREATE POLICY "Users manage own cart" ON public.carts
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Guest cart via service role" ON public.carts
  FOR ALL USING (session_id IS NOT NULL AND auth.uid() IS NULL);

-- CART ITEMS
CREATE POLICY "Users manage own cart items" ON public.cart_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_id AND c.user_id = auth.uid())
    OR public.is_admin()
  );

-- WISHLISTS
CREATE POLICY "Users manage own wishlist" ON public.wishlists
  FOR ALL USING (auth.uid() = user_id);

-- ORDERS
CREATE POLICY "Users read own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users cancel own pending orders" ON public.orders
  FOR UPDATE USING (
    auth.uid() = user_id AND status IN ('pending', 'confirmed')
  ) WITH CHECK (status = 'cancelled');
CREATE POLICY "Admin manage orders" ON public.orders
  FOR ALL USING (public.is_admin());

-- ORDER ITEMS
CREATE POLICY "Users read own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.is_admin()))
  );
CREATE POLICY "System insert order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );
CREATE POLICY "Admin manage order items" ON public.order_items
  FOR ALL USING (public.is_admin());

-- PAYMENTS
CREATE POLICY "Users read own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
    OR public.is_admin()
  );
CREATE POLICY "Admin manage payments" ON public.payments
  FOR ALL USING (public.is_admin_only());

-- REVIEWS
CREATE POLICY "Public read approved reviews" ON public.reviews
  FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin moderate reviews" ON public.reviews
  FOR ALL USING (public.is_admin());

-- RETURNS
CREATE POLICY "Users manage own returns" ON public.returns
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users create returns" ON public.returns
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin manage returns" ON public.returns
  FOR ALL USING (public.is_admin());

-- INVENTORY LOGS
CREATE POLICY "Admin read inventory logs" ON public.inventory_logs
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin insert inventory logs" ON public.inventory_logs
  FOR INSERT WITH CHECK (public.is_admin_only());

-- ============================================================
-- STORAGE BUCKETS (run in Supabase dashboard or via API)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
-- CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
-- CREATE POLICY "Admin upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.is_admin_only());
