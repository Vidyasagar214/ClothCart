# Tasks & Milestones
# ClothCart MVP — Feature 000

---

## Milestone Overview

| Milestone | Week | Exit Criteria |
|-----------|------|---------------|
| M1: Foundation | 2 | Auth works, DB migrated, CI green |
| M2: Catalog Live | 4 | Browse, search, filter, product detail |
| M3: Commerce Live | 7 | Cart, wishlist, checkout, payments |
| M4: Orders Complete | 9 | Tracking, reviews, returns |
| M5: Admin Complete | 11 | Full admin panel operational |
| M6: MVP Launch | 12 | All acceptance criteria met, deployed |

---

## M1: Foundation (Weeks 1–2)

### Week 1

- [ ] **T-001** Initialize Next.js 15 project with TypeScript, Tailwind, ESLint
- [ ] **T-002** Configure shadcn/ui component library
- [ ] **T-003** Set up Supabase project (staging + production)
- [ ] **T-004** Apply initial database migration (`001_initial_schema.sql`)
- [ ] **T-005** Generate Supabase TypeScript types
- [ ] **T-006** Configure environment variables (.env.local template)
- [ ] **T-007** Set up GitHub repo + branch protection
- [ ] **T-008** Configure GitHub Actions CI (lint, typecheck, test)

### Week 2

- [ ] **T-009** Implement Supabase SSR auth (client + server + middleware)
- [ ] **T-010** Build login page (email/password)
- [ ] **T-011** Build register page
- [ ] **T-012** Build forgot/reset password pages
- [ ] **T-013** Implement OTP send/verify (Twilio Edge Function)
- [ ] **T-014** Create root layout with Header/Footer components
- [ ] **T-015** Implement route protection middleware (customer + admin)
- [ ] **T-016** Design system: Tailwind config with brand tokens
- [ ] **T-017** Seed script: categories, brands, sample products

**M1 Checkpoint:** User can register, login, logout. Admin role assigned in DB.

---

## M2: Catalog Live (Weeks 3–4)

### Week 3

- [ ] **T-018** Products list API with pagination
- [ ] **T-019** Categories API (tree structure)
- [ ] **T-020** ProductCard component with lazy images
- [ ] **T-021** Product listing page with grid layout
- [ ] **T-022** Category page (`/categories/[slug]`)
- [ ] **T-023** Home page: hero, category tiles, featured products
- [ ] **T-024** Mobile sticky header + hamburger nav

### Week 4

- [ ] **T-025** Search API (full-text + keyword)
- [ ] **T-026** Filter query builder (all filter types)
- [ ] **T-027** ProductFilters sidebar/drawer component
- [ ] **T-028** Search results page
- [ ] **T-029** Product detail API (slug, variants, images)
- [ ] **T-030** Product gallery with zoom
- [ ] **T-031** Size/color variant selector
- [ ] **T-032** Related products section
- [ ] **T-033** URL-synced filter state

**M2 Checkpoint:** Guest can browse, search, filter, view product details.

---

## M3: Commerce Live (Weeks 5–7)

### Week 5

- [ ] **T-034** Cart service with price calculations
- [ ] **T-035** Cart API (GET, POST items, PATCH, DELETE)
- [ ] **T-036** Zustand cart store + localStorage (guest)
- [ ] **T-037** Cart page with item list + summary
- [ ] **T-038** Cart drawer (slide-over from header)
- [ ] **T-039** Add to Cart from product detail (with validation)

### Week 6

- [ ] **T-040** Wishlist API (CRUD + move-to-cart)
- [ ] **T-041** Wishlist page
- [ ] **T-042** Heart toggle on product cards
- [ ] **T-043** Guest cart merge on login
- [ ] **T-044** Address CRUD API + UI
- [ ] **T-045** Checkout step 1: shipping address

### Week 7

- [ ] **T-046** Razorpay integration (create order)
- [ ] **T-047** Payment verification + webhook handler
- [ ] **T-048** Checkout steps 2–3: payment + review
- [ ] **T-049** COD order flow
- [ ] **T-050** Order creation + stock decrement
- [ ] **T-051** Order confirmation page
- [ ] **T-052** Transactional email (order confirmation)

**M3 Checkpoint:** End-to-end purchase flow works with Razorpay test mode.

---

## M4: Orders Complete (Weeks 8–9)

### Week 8

- [ ] **T-053** Orders list API (customer)
- [ ] **T-054** Order detail API with items
- [ ] **T-055** Order history page
- [ ] **T-056** Order detail page with status timeline
- [ ] **T-057** Cancel order API + UI (pre-shipment)
- [ ] **T-058** Order status email notifications

### Week 9

- [ ] **T-059** Reviews API (create, list approved)
- [ ] **T-060** Verified purchase validation
- [ ] **T-061** Review form on order detail / product page
- [ ] **T-062** Reviews list on product detail
- [ ] **T-063** Returns API (create, list, status)
- [ ] **T-064** Return window validation (7 days)
- [ ] **T-065** Returns page (customer)

**M4 Checkpoint:** Customer can track orders, review products, request returns.

---

## M5: Admin Complete (Weeks 10–11)

### Week 10

- [ ] **T-066** Admin layout with sidebar navigation
- [ ] **T-067** Dashboard metrics API
- [ ] **T-068** Admin dashboard page (charts, stats)
- [ ] **T-069** Admin products list + search
- [ ] **T-070** Product create/edit form with variants
- [ ] **T-071** Image upload to Supabase Storage
- [ ] **T-072** Category management CRUD

### Week 11

- [ ] **T-073** Admin orders list with filters
- [ ] **T-074** Admin order detail + status update
- [ ] **T-075** Inventory management page (bulk update)
- [ ] **T-076** Inventory log on stock changes
- [ ] **T-077** User management (list, disable)
- [ ] **T-078** Review moderation queue
- [ ] **T-079** Returns management (approve/reject/refund)

**M5 Checkpoint:** Admin can manage full catalog, orders, inventory, reviews, returns.

---

## M6: MVP Launch (Week 12)

- [ ] **T-080** Playwright E2E: auth flow
- [ ] **T-081** Playwright E2E: browse → checkout → confirm
- [ ] **T-082** Playwright E2E: admin product CRUD
- [ ] **T-083** Unit tests: cart calculations, order status transitions
- [ ] **T-084** Lighthouse audit (target ≥ 90 performance)
- [ ] **T-085** Accessibility audit with axe (WCAG 2.1 AA)
- [ ] **T-086** Security review checklist
- [ ] **T-087** Production deployment (Vercel + Supabase prod)
- [ ] **T-088** Sentry error monitoring setup
- [ ] **T-089** DNS + SSL configuration
- [ ] **T-090** Smoke test on production
- [ ] **T-091** MVP sign-off against acceptance criteria

**M6 Checkpoint:** ClothCart MVP live in production.

---

## Task Dependencies Graph (Critical Path)

```
T-001 → T-004 → T-009 → T-018 → T-034 → T-046 → T-053 → T-066 → T-080 → T-087
                ↓
              T-017 (seed) → T-029 → T-039 → T-050
```

---

## Effort Estimates

| Phase | Tasks | Est. Dev Days |
|-------|-------|---------------|
| M1 Foundation | T-001–T-017 | 10 |
| M2 Catalog | T-018–T-033 | 10 |
| M3 Commerce | T-034–T-052 | 15 |
| M4 Orders | T-053–T-065 | 10 |
| M5 Admin | T-066–T-079 | 10 |
| M6 Launch | T-080–T-091 | 5 |
| **Total** | **91 tasks** | **~60 dev days** |

*Assumes 1 full-stack developer. Parallelize frontend/backend with 2 devs → ~8 weeks.*

---

## Post-MVP Backlog

| ID | Feature | Priority |
|----|---------|----------|
| P-001 | Social login (Google, Apple) | P2 |
| P-002 | Coupon/promo codes | P2 |
| P-003 | Email cart abandonment | P2 |
| P-004 | AI product recommendations | P3 |
| P-005 | PWA + offline support | P3 |
| P-006 | Multi-language (i18n) | P3 |
| P-007 | Loyalty points program | P3 |
| P-008 | Live chat support | P3 |
