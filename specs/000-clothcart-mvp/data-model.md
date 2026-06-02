# Database Schema
# ClothCart MVP

| Field | Value |
|-------|-------|
| Database | PostgreSQL 15+ |
| ORM | Drizzle ORM (recommended) |
| Version | 1.0 |

---

## 1. Entity Relationship Diagram

```
users ────────────── profiles
  │                      │
  │                      ├── addresses
  │                      │
  ├── carts ─── cart_items ─── product_variants ─── products
  │                                                    │
  ├── wishlists ───────────────────────────────────────┤
  │                                                    │
  ├── orders ─── order_items ──────────────────────────┤
  │       │                                            │
  │       └── payments                                 │
  │                                                    │
  ├── reviews ─────────────────────────────────────────┤
  │                                                    │
  └── returns ─── order_items                          │
                                                       │
categories ◄───────────────────────────────────────────┘
  │
  └── (self-ref parent_id for subcategories)

product_variants ─── inventory_logs
products ─── product_images
brands (lookup)
```

---

## 2. Table Definitions

### 2.1 users (Supabase Auth managed)

Supabase `auth.users` is the source of truth. Extended via `profiles`.

### 2.2 profiles

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, FK → auth.users | User ID |
| full_name | VARCHAR(100) | NOT NULL | Display name |
| phone | VARCHAR(15) | UNIQUE, NULL | Mobile number |
| avatar_url | TEXT | NULL | Profile photo |
| role | user_role | NOT NULL DEFAULT 'customer' | customer, admin, support |
| is_active | BOOLEAN | DEFAULT true | Account status |
| created_at | TIMESTAMPTZ | DEFAULT now() | |
| updated_at | TIMESTAMPTZ | DEFAULT now() | |

```sql
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'support');
```

### 2.3 addresses

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → profiles, NOT NULL |
| label | VARCHAR(50) | home, work, other |
| full_name | VARCHAR(100) | NOT NULL |
| phone | VARCHAR(15) | NOT NULL |
| address_line1 | VARCHAR(255) | NOT NULL |
| address_line2 | VARCHAR(255) | NULL |
| city | VARCHAR(100) | NOT NULL |
| state | VARCHAR(100) | NOT NULL |
| pincode | VARCHAR(6) | NOT NULL |
| is_default | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMPTZ | DEFAULT now() |

### 2.4 categories

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| name | VARCHAR(100) | NOT NULL |
| slug | VARCHAR(100) | UNIQUE, NOT NULL |
| parent_id | UUID | FK → categories, NULL |
| gender | gender_type | men, women, children, unisex |
| image_url | TEXT | NULL |
| sort_order | INT | DEFAULT 0 |
| is_active | BOOLEAN | DEFAULT true |

```sql
CREATE TYPE gender_type AS ENUM ('men', 'women', 'children', 'unisex');
```

### 2.5 brands

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| name | VARCHAR(100) | UNIQUE, NOT NULL |
| slug | VARCHAR(100) | UNIQUE, NOT NULL |
| logo_url | TEXT | NULL |
| is_active | BOOLEAN | DEFAULT true |

### 2.6 products

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| name | VARCHAR(255) | NOT NULL |
| slug | VARCHAR(255) | UNIQUE, NOT NULL |
| description | TEXT | NOT NULL |
| brand_id | UUID | FK → brands |
| category_id | UUID | FK → categories, NOT NULL |
| base_price | DECIMAL(10,2) | NOT NULL |
| compare_at_price | DECIMAL(10,2) | NULL |
| sku_prefix | VARCHAR(20) | NOT NULL |
| tags | TEXT[] | DEFAULT '{}' |
| is_active | BOOLEAN | DEFAULT true |
| is_featured | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| updated_at | TIMESTAMPTZ | DEFAULT now() |

**Indexes:** `idx_products_category`, `idx_products_brand`, `idx_products_slug`, GIN on `tags`

### 2.7 product_variants

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| product_id | UUID | FK → products, NOT NULL |
| sku | VARCHAR(50) | UNIQUE, NOT NULL |
| size | VARCHAR(10) | NOT NULL |
| color | VARCHAR(50) | NOT NULL |
| color_hex | VARCHAR(7) | NULL |
| price | DECIMAL(10,2) | NOT NULL |
| stock_quantity | INT | NOT NULL DEFAULT 0 |
| low_stock_threshold | INT | DEFAULT 5 |
| is_active | BOOLEAN | DEFAULT true |

**Indexes:** `idx_variants_product`, `idx_variants_sku`

### 2.8 product_images

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| product_id | UUID | FK → products |
| variant_id | UUID | FK → product_variants, NULL |
| url | TEXT | NOT NULL |
| alt_text | VARCHAR(255) | NULL |
| sort_order | INT | DEFAULT 0 |
| is_primary | BOOLEAN | DEFAULT false |

### 2.9 carts

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → profiles, NULL (guest) |
| session_id | VARCHAR(100) | NULL (guest) |
| expires_at | TIMESTAMPTZ | NOT NULL |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| updated_at | TIMESTAMPTZ | DEFAULT now() |

### 2.10 cart_items

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| cart_id | UUID | FK → carts, NOT NULL |
| variant_id | UUID | FK → product_variants, NOT NULL |
| quantity | INT | NOT NULL CHECK (quantity > 0) |
| price_at_add | DECIMAL(10,2) | NOT NULL |
| UNIQUE(cart_id, variant_id) | | |

### 2.11 wishlists

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → profiles, NOT NULL |
| product_id | UUID | FK → products, NOT NULL |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| UNIQUE(user_id, product_id) | | |

### 2.12 orders

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| order_number | VARCHAR(20) | UNIQUE, NOT NULL |
| user_id | UUID | FK → profiles, NOT NULL |
| status | order_status | NOT NULL DEFAULT 'pending' |
| subtotal | DECIMAL(10,2) | NOT NULL |
| discount | DECIMAL(10,2) | DEFAULT 0 |
| tax | DECIMAL(10,2) | NOT NULL |
| shipping | DECIMAL(10,2) | NOT NULL |
| total | DECIMAL(10,2) | NOT NULL |
| shipping_address | JSONB | NOT NULL |
| payment_method | payment_method | NOT NULL |
| tracking_number | VARCHAR(100) | NULL |
| notes | TEXT | NULL |
| cancelled_at | TIMESTAMPTZ | NULL |
| shipped_at | TIMESTAMPTZ | NULL |
| delivered_at | TIMESTAMPTZ | NULL |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| updated_at | TIMESTAMPTZ | DEFAULT now() |

```sql
CREATE TYPE order_status AS ENUM (
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'
);
CREATE TYPE payment_method AS ENUM ('card', 'upi', 'netbanking', 'wallet', 'cod');
```

### 2.13 order_items

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| order_id | UUID | FK → orders, NOT NULL |
| variant_id | UUID | FK → product_variants, NOT NULL |
| product_name | VARCHAR(255) | NOT NULL |
| variant_size | VARCHAR(10) | NOT NULL |
| variant_color | VARCHAR(50) | NOT NULL |
| quantity | INT | NOT NULL |
| unit_price | DECIMAL(10,2) | NOT NULL |
| total_price | DECIMAL(10,2) | NOT NULL |

### 2.14 payments

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| order_id | UUID | FK → orders, UNIQUE |
| provider | VARCHAR(20) | razorpay |
| provider_payment_id | VARCHAR(100) | NULL |
| amount | DECIMAL(10,2) | NOT NULL |
| currency | VARCHAR(3) | DEFAULT 'INR' |
| status | payment_status | NOT NULL |
| metadata | JSONB | DEFAULT '{}' |
| created_at | TIMESTAMPTZ | DEFAULT now() |

```sql
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
```

### 2.15 reviews

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| product_id | UUID | FK → products, NOT NULL |
| user_id | UUID | FK → profiles, NOT NULL |
| order_id | UUID | FK → orders, NOT NULL |
| rating | INT | CHECK (rating BETWEEN 1 AND 5) |
| title | VARCHAR(200) | NULL |
| body | TEXT | NOT NULL |
| status | review_status | DEFAULT 'pending' |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| UNIQUE(user_id, product_id) | | |

```sql
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected', 'hidden');
```

### 2.16 returns

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| order_id | UUID | FK → orders, NOT NULL |
| order_item_id | UUID | FK → order_items, NOT NULL |
| user_id | UUID | FK → profiles, NOT NULL |
| reason | return_reason | NOT NULL |
| description | TEXT | NULL |
| status | return_status | DEFAULT 'requested' |
| refund_amount | DECIMAL(10,2) | NULL |
| admin_notes | TEXT | NULL |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| resolved_at | TIMESTAMPTZ | NULL |

```sql
CREATE TYPE return_reason AS ENUM ('defective', 'wrong_item', 'size_issue', 'changed_mind', 'other');
CREATE TYPE return_status AS ENUM ('requested', 'approved', 'rejected', 'picked_up', 'refunded');
```

### 2.17 inventory_logs

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| variant_id | UUID | FK → product_variants |
| change_quantity | INT | NOT NULL |
| reason | VARCHAR(50) | sale, restock, return, adjustment |
| reference_id | UUID | NULL |
| created_by | UUID | FK → profiles |
| created_at | TIMESTAMPTZ | DEFAULT now() |

---

## 3. Computed Views

### product_ratings_view
```sql
CREATE VIEW product_ratings_view AS
SELECT
  product_id,
  ROUND(AVG(rating)::numeric, 1) AS avg_rating,
  COUNT(*) AS review_count
FROM reviews
WHERE status = 'approved'
GROUP BY product_id;
```

### admin_dashboard_metrics_view
Aggregates daily revenue, order counts, top products for dashboard queries.

---

## 4. Index Strategy

| Table | Index | Purpose |
|-------|-------|---------|
| products | (category_id, is_active) | Category browsing |
| products | GIN(tags) | Tag search |
| product_variants | (product_id, is_active) | Variant lookup |
| orders | (user_id, created_at DESC) | Order history |
| orders | (status) | Admin filtering |
| reviews | (product_id, status) | Product reviews |

---

## 5. Migration Order

1. Enums and extensions
2. profiles, addresses
3. categories, brands
4. products, product_variants, product_images
5. carts, cart_items, wishlists
6. orders, order_items, payments
7. reviews, returns, inventory_logs
8. Views and functions
9. RLS policies
10. Seed data
