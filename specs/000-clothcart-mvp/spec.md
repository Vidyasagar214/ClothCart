# Functional Specification
# ClothCart MVP — Feature 000

| Field | Value |
|-------|-------|
| Feature ID | 000-clothcart-mvp |
| Version | 1.0 |
| Status | Draft → Ready for Implementation |

---

## 1. Overview

This document defines the complete functional behavior of ClothCart MVP, derived from SRS-ClothCart v1.0. Each requirement maps to user stories, API endpoints, UI screens, and acceptance criteria.

---

## 2. User Roles & Permissions

| Role | Permissions |
|------|-------------|
| `guest` | Browse, search, view products; cart stored in session/localStorage |
| `customer` | All guest + checkout, orders, reviews, returns, wishlist (persisted) |
| `admin` | Full CRUD on products, categories, inventory, orders, users, reviews |
| `support` | View orders/users; approve/reject returns; moderate reviews |

---

## 3. Feature Specifications

### 3.1 Authentication (F-001)

#### FR-AUTH-001: Registration
- **Email flow:** email, password (min 8 chars, 1 upper, 1 number), confirm password, full name
- **Mobile flow:** phone number (+91), OTP (6 digits, 5 min expiry), full name
- **Output:** User account created, welcome email/SMS, redirect to home

#### FR-AUTH-002: Login
- Email+password OR mobile+OTP
- Failed attempts: lock after 5 tries for 15 minutes
- Session: JWT access token (15 min) + refresh token (7 days)

#### FR-AUTH-003: Password Reset
- Email: send reset link (1 hour expiry)
- Mobile: send OTP, verify, set new password

#### FR-AUTH-004: Session Management
- Logout invalidates refresh token
- Auto-refresh on 401 with valid refresh token
- "Remember me" extends refresh to 30 days

#### User Stories
| ID | Story | Acceptance |
|----|-------|------------|
| US-AUTH-01 | Create account to place orders | Registration succeeds; user logged in |
| US-AUTH-02 | Log in securely | Valid credentials → dashboard/home |
| US-AUTH-03 | Reset forgotten password | Reset link/OTP works; new password set |

---

### 3.2 Product Catalog (F-002)

#### FR-CAT-001: Categories
- Top-level: Men, Women, Children
- Subcategories: e.g., Men → Shirts, Pants, Jackets

#### FR-CAT-002: Product Listing Card
Display per product:
- Primary image (lazy-loaded WebP)
- Name, brand
- Price, compare-at price, discount badge
- Available sizes (max 5 shown + "+N")
- Color swatches (max 4)
- Average rating (stars + count)
- Stock badge: In Stock / Low Stock / Out of Stock

#### FR-CAT-003: Pagination
- Default: 24 products per page
- Alternative: infinite scroll (config flag)
- URL reflects page: `/products?page=2&category=men`

#### FR-CAT-004: Stock Availability
- Real-time from `product_variants.stock_quantity`
- Out-of-stock: disable Add to Cart, show "Notify Me" (post-MVP)

#### User Stories
| ID | Story | Acceptance |
|----|-------|------------|
| US-CAT-01 | Browse by category | Category filter shows correct products |
| US-CAT-02 | See details before purchase | All FR-CAT-002 fields visible |

---

### 3.3 Search & Filters (F-003)

#### FR-SRCH-001: Keyword Search
- Search across: name, description, brand, tags
- Debounce 300ms; min 2 characters
- Results page with result count

#### FR-SRCH-002: Filters
| Filter | Type | Values |
|--------|------|--------|
| Category | multi-select | Men, Women, Children + subcategories |
| Brand | multi-select | Dynamic from DB |
| Price | range slider | ₹0 – ₹50,000 |
| Size | multi-select | XS–XXL |
| Color | multi-select | Dynamic |
| Gender | single-select | Men, Women, Unisex, Kids |
| Ratings | single-select | 4+, 3+, 2+, 1+ stars |
| Discount | toggle | On Sale only |

#### FR-SRCH-003: Sort
- Price: Low to High / High to Low
- Popularity (order count desc)
- New Arrivals (created_at desc)
- Default: Relevance (search) or New Arrivals (browse)

#### User Stories
| ID | Story | Acceptance |
|----|-------|------------|
| US-SRCH-01 | Filter products | Combined filters narrow results correctly |
| US-SRCH-02 | Sort by price/popularity | Sort order matches selection |

---

### 3.4 Product Details (F-004)

#### FR-PROD-001: Detail View
- Image gallery (4–8 images), name, brand, SKU
- Price, discount, description (rich text)
- Size selector (disabled if OOS for variant)
- Color selector (updates images)
- Quantity stepper (1–max stock)
- Add to Cart, Add to Wishlist buttons
- Average rating breakdown (5-star histogram)
- Reviews list (paginated)

#### FR-PROD-002: Image Zoom
- Hover zoom on desktop; pinch-zoom on mobile
- Lightbox on click

#### FR-PROD-003: Related Products
- Same category, exclude current; max 8 items

---

### 3.5 Shopping Cart (F-005)

#### FR-CART-001–003: Cart Operations
- Add item (product_variant_id, quantity)
- Update quantity (min 1, max stock)
- Remove item
- Merge guest cart on login

#### FR-CART-004: Calculations
```
subtotal = Σ(line_price × quantity)
discount = coupon_discount + line_discounts
tax = (subtotal - discount) × tax_rate (default 18% GST)
shipping = free if subtotal ≥ ₹999 else ₹99
total = subtotal - discount + tax + shipping
```

#### Business Rules
- Cart expires after 30 days (logged-in) or session end (guest)
- Stock validated on add and at checkout

---

### 3.6 Wishlist (F-006)

- Add/remove products (heart icon toggle)
- Move single or all items to cart
- Persist for logged-in users; prompt login for guests

---

### 3.7 Checkout & Payments (F-007)

#### Checkout Steps
1. **Shipping Address** — select saved or add new; validate pincode
2. **Payment Method** — Card, UPI, Net Banking, Wallets, COD
3. **Review Order** — summary with edit links
4. **Confirmation** — order ID, estimated delivery

#### FR-CHK-002: Payment Methods
| Method | Provider | MVP |
|--------|----------|-----|
| Card | Razorpay | ✓ |
| UPI | Razorpay | ✓ |
| Net Banking | Razorpay | ✓ |
| Wallets | Razorpay | ✓ |
| COD | Internal | ✓ (max ₹5,000) |

#### FR-CHK-003: Address Validation
- Required: name, phone, address line 1, city, state, pincode (6 digits)
- Pincode serviceability check (MVP: static list)

---

### 3.8 Order Management (F-008)

#### Order Status Flow
```
pending → confirmed → processing → shipped → delivered
                  ↘ cancelled (before shipped)
                  ↘ returned → refunded
```

#### FR-ORD-002: Customer Actions
- View order history (paginated, newest first)
- Track status with timeline UI
- Cancel if status = pending or confirmed

#### FR-ORD-003: Admin Actions
- Update status, add tracking number, print invoice

---

### 3.9 Reviews & Ratings (F-009)

- Only verified purchasers (delivered order containing product)
- Rating: 1–5 stars; review text: 10–2000 chars
- One review per product per user
- Admin: approve, reject, hide reviews

---

### 3.10 Returns & Refunds (F-010)

- Return window: 7 days from delivery
- Reasons: defective, wrong item, size issue, changed mind
- Status: requested → approved → picked_up → refunded / rejected
- Refund to original payment method (5–7 business days)

---

### 3.11 Admin Panel (F-011, F-012)

#### Dashboard Metrics
- Total revenue (today, week, month)
- Order count by status
- Top 10 products by revenue
- New users count
- Return rate %

#### CRUD Modules
- Products (with variants, images)
- Categories
- Inventory (bulk update)
- Orders (status, tracking)
- Users (view, disable)
- Reviews (moderate)
- Returns (approve/reject)

---

## 4. UI/UX Requirements

- Mobile-first responsive (320px+)
- Sticky header on mobile
- Touch targets ≥ 44×44px
- Loading skeletons for async content
- Toast notifications for actions
- Empty states with CTAs
- Error boundaries with retry

---

## 5. External Integrations

| Service | Purpose |
|---------|---------|
| Razorpay | Payments |
| Resend / SendGrid | Transactional email |
| Twilio | OTP SMS |
| Supabase Storage | Product images |

---

## 6. Data Entities (Summary)

See `data-model.md` for full schema.

Core entities: `users`, `profiles`, `categories`, `products`, `product_variants`, `product_images`, `carts`, `cart_items`, `wishlists`, `orders`, `order_items`, `reviews`, `returns`, `addresses`, `payments`

---

## 7. Traceability Matrix

| SRS FR | Feature | API Prefix | UI Screens |
|--------|---------|------------|------------|
| FR-AUTH-* | F-001 | /api/v1/auth | AUTH-01–04 |
| FR-CAT-* | F-002 | /api/v1/products | CAT-01–02 |
| FR-SRCH-* | F-003 | /api/v1/products/search | SRCH-01 |
| FR-PROD-* | F-004 | /api/v1/products/:id | PROD-01 |
| FR-CART-* | F-005 | /api/v1/cart | CART-01 |
| FR-WISH-* | F-006 | /api/v1/wishlist | WISH-01 |
| FR-CHK-* | F-007 | /api/v1/checkout | CHK-01–04 |
| FR-ORD-* | F-008 | /api/v1/orders | ORD-01–02 |
| FR-REV-* | F-009 | /api/v1/reviews | REV-01 |
| FR-RET-* | F-010 | /api/v1/returns | RET-01 |
| FR-ADM-* | F-011–012 | /api/v1/admin/* | ADM-01–08 |
