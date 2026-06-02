# Implementation Plan
# ClothCart MVP — Feature 000

| Field | Value |
|-------|-------|
| Feature | 000-clothcart-mvp |
| Stack | Next.js 15, Supabase, Tailwind, Razorpay |
| Duration | 12 weeks |

---

## Phase 0: Foundation (Weeks 1–2)

### Goals
- Project scaffolding, CI/CD, database, auth

### Deliverables
- Next.js app with Tailwind + shadcn/ui
- Supabase project with migrations applied
- Auth flows (email + OTP)
- Middleware route protection
- Design system tokens

### Technical Decisions
- Use `@supabase/ssr` for cookie-based sessions
- Drizzle ORM for type-safe queries (optional: Supabase client only for MVP speed)
- Zustand for cart state with localStorage persistence for guests

---

## Phase 1: Product Catalog (Weeks 3–4)

### F-002 Product Catalog
- Category tree API + seed data
- Product listing with ISR
- Product card component
- Pagination

### F-003 Search & Filters
- Full-text search endpoint
- Filter sidebar (desktop) / drawer (mobile)
- URL-synced query params
- Sort dropdown

### F-004 Product Detail
- Image gallery with zoom
- Variant selector (size/color)
- Related products
- Reviews display (read-only initially)

---

## Phase 2: Commerce Core (Weeks 5–7)

### F-005 Shopping Cart
- Cart API (add/update/remove)
- Cart page + drawer
- Price calculations (tax, shipping)
- Guest cart merge on login

### F-006 Wishlist
- Wishlist API
- Heart toggle on product cards
- Wishlist page with move-to-cart

### F-007 Checkout & Payments
- Multi-step checkout wizard
- Address management
- Razorpay integration (create order, verify signature)
- COD flow (skip gateway)
- Order confirmation page + email

---

## Phase 3: Orders & Engagement (Weeks 8–9)

### F-008 Order Management
- Order history + detail pages
- Status timeline component
- Cancel order (pre-shipment)
- Admin order list + status updates

### F-009 Reviews & Ratings
- Verified purchase check
- Review submission form
- Admin moderation queue
- Rating aggregation on products

### F-010 Returns & Refunds
- Return request form
- 7-day window validation
- Admin approve/reject workflow
- Refund status tracking

---

## Phase 4: Admin Panel (Weeks 10–11)

### F-011 Admin CRUD
- Dashboard with metrics queries
- Product CRUD with image upload
- Category management
- Inventory bulk update
- User list (read-only + disable)
- Review moderation UI
- Returns management UI

### F-012 Analytics
- Revenue aggregation views
- Top products query
- Export CSV (optional)

---

## Phase 5: QA & Launch (Week 12)

- E2E tests (Playwright): checkout, auth, admin
- Performance audit (Lighthouse)
- Accessibility audit (axe)
- Security review (OWASP checklist)
- Production deployment
- Monitoring setup (Sentry)

---

## Feature-by-Feature Implementation Plan

### F-001: Authentication

| Step | Task | Files |
|------|------|-------|
| 1 | Supabase Auth config | `supabase/config.toml` |
| 2 | Auth API routes | `app/api/v1/auth/*` |
| 3 | Login/Register pages | `app/(auth)/*` |
| 4 | Session middleware | `middleware.ts`, `lib/supabase/middleware.ts` |
| 5 | OTP via Twilio Edge Function | `supabase/functions/send-otp/` |
| 6 | Profile auto-create trigger | Migration (done) |

**Dependencies:** None  
**Blocks:** Checkout, Wishlist, Orders

---

### F-002: Product Catalog

| Step | Task | Files |
|------|------|-------|
| 1 | Seed categories + products | `supabase/seed.sql` |
| 2 | Products list API | `app/api/v1/products/route.ts` |
| 3 | Categories API | `app/api/v1/categories/route.ts` |
| 4 | Product listing page | `app/(shop)/products/page.tsx` |
| 5 | Category page | `app/(shop)/categories/[slug]/page.tsx` |
| 6 | ProductCard component | `components/product/product-card.tsx` |

**Dependencies:** Database migration  
**Blocks:** Search, Product Detail, Cart

---

### F-003: Search & Filters

| Step | Task | Files |
|------|------|-------|
| 1 | Search API with tsvector | `app/api/v1/products/search/route.ts` |
| 2 | Filter query builder | `lib/services/product.service.ts` |
| 3 | Filter UI component | `components/product/product-filters.tsx` |
| 4 | Search page | `app/(shop)/search/page.tsx` |
| 5 | URL param sync hook | `hooks/use-product-filters.ts` |

---

### F-004: Product Detail

| Step | Task | Files |
|------|------|-------|
| 1 | Product by slug API | `app/api/v1/products/[slug]/route.ts` |
| 2 | Related products API | `.../related/route.ts` |
| 3 | Gallery component | `components/product/product-gallery.tsx` |
| 4 | Variant selector | `components/product/size-selector.tsx` |
| 5 | Detail page | `app/(shop)/products/[slug]/page.tsx` |

---

### F-005: Shopping Cart

| Step | Task | Files |
|------|------|-------|
| 1 | Cart service + calculations | `lib/services/cart.service.ts` |
| 2 | Cart API routes | `app/api/v1/cart/*` |
| 3 | Zustand cart store | `stores/cart-store.ts` |
| 4 | Cart page | `app/(shop)/cart/page.tsx` |
| 5 | Cart drawer | `components/cart/cart-drawer.tsx` |
| 6 | Guest cart merge logic | `lib/services/cart.service.ts` |

---

### F-006: Wishlist

| Step | Task | Files |
|------|------|-------|
| 1 | Wishlist API | `app/api/v1/wishlist/*` |
| 2 | Wishlist hook | `hooks/use-wishlist.ts` |
| 3 | Heart toggle on ProductCard | `components/product/product-card.tsx` |
| 4 | Wishlist page | `app/(shop)/wishlist/page.tsx` |

---

### F-007: Checkout & Payments

| Step | Task | Files |
|------|------|-------|
| 1 | Address CRUD API | `app/api/v1/addresses/*` |
| 2 | Checkout create-order API | `app/api/v1/checkout/create-order/route.ts` |
| 3 | Razorpay service | `lib/services/payment.service.ts` |
| 4 | Payment verify + webhook | `checkout/verify-payment`, `webhooks/razorpay` |
| 5 | Checkout wizard UI | `app/(shop)/checkout/page.tsx` |
| 6 | Confirmation page | `checkout/confirmation/[orderId]/page.tsx` |
| 7 | Order confirmation email | Resend integration |

---

### F-008: Order Management

| Step | Task | Files |
|------|------|-------|
| 1 | Orders API | `app/api/v1/orders/*` |
| 2 | Order service (status transitions) | `lib/services/order.service.ts` |
| 3 | Order history page | `app/(account)/orders/page.tsx` |
| 4 | Order detail + timeline | `orders/[orderId]/page.tsx` |
| 5 | Cancel order API | `orders/[orderId]/cancel/route.ts` |
| 6 | Stock decrement on confirm | DB function + service |

---

### F-009: Reviews

| Step | Task | Files |
|------|------|-------|
| 1 | Reviews API | `app/api/v1/reviews/[productId]/route.ts` |
| 2 | Verified purchase check | `lib/services/review.service.ts` |
| 3 | Review form component | `components/product/review-form.tsx` |
| 4 | Reviews list on product page | `components/product/reviews-list.tsx` |
| 5 | Admin moderation | `app/admin/reviews/page.tsx` |

---

### F-010: Returns

| Step | Task | Files |
|------|------|-------|
| 1 | Returns API | `app/api/v1/returns/*` |
| 2 | Return window validation | `lib/services/return.service.ts` |
| 3 | Returns page (customer) | `app/(account)/returns/page.tsx` |
| 4 | Admin returns management | `app/admin/returns/page.tsx` |

---

### F-011/F-012: Admin Panel

| Step | Task | Files |
|------|------|-------|
| 1 | Admin layout + sidebar | `app/admin/layout.tsx` |
| 2 | Dashboard API + page | `admin/dashboard`, `admin/page.tsx` |
| 3 | Product CRUD | `admin/products/*` |
| 4 | Order management | `admin/orders/*` |
| 5 | Inventory management | `admin/inventory/page.tsx` |
| 6 | Image upload to Supabase Storage | `lib/services/storage.service.ts` |

---

## Risk Mitigation During Implementation

| Risk | Mitigation in Plan |
|------|-------------------|
| Razorpay sandbox delays | Mock payment service for dev; integrate early in Week 5 |
| RLS complexity | Test policies with Supabase local dev from Week 1 |
| Image performance | next/image + WebP conversion at upload |
| Cart race conditions | Optimistic locking on stock_quantity |

---

## Definition of Ready (Per Feature)

- [ ] Spec acceptance criteria written
- [ ] API contract defined in OpenAPI
- [ ] Database tables migrated
- [ ] UI mockup/prototype screen exists
- [ ] Dependencies completed

## Definition of Done (Per Feature)

- [ ] All acceptance criteria pass
- [ ] Unit tests for service layer
- [ ] API integration tests
- [ ] Responsive UI verified
- [ ] RLS policies tested
- [ ] Documented in CHANGELOG
