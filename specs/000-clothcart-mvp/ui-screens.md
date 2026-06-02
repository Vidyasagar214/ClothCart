# UI Screen Inventory
# ClothCart MVP

| ID | Screen | Route | Priority | Auth |
|----|--------|-------|----------|------|
| HOME-01 | Home / Landing | `/` | P0 | Public |
| CAT-01 | Product Listing | `/products` | P0 | Public |
| CAT-02 | Category Page | `/categories/[slug]` | P0 | Public |
| SRCH-01 | Search Results | `/search?q=` | P0 | Public |
| PROD-01 | Product Detail | `/products/[slug]` | P0 | Public |
| CART-01 | Shopping Cart | `/cart` | P0 | Public |
| WISH-01 | Wishlist | `/wishlist` | P0 | Auth |
| CHK-01 | Checkout — Address | `/checkout` | P0 | Auth |
| CHK-02 | Checkout — Payment | `/checkout?step=payment` | P0 | Auth |
| CHK-03 | Checkout — Review | `/checkout?step=review` | P0 | Auth |
| CHK-04 | Order Confirmation | `/checkout/confirmation/[orderId]` | P0 | Auth |
| AUTH-01 | Login | `/login` | P0 | Public |
| AUTH-02 | Register | `/register` | P0 | Public |
| AUTH-03 | Forgot Password | `/forgot-password` | P0 | Public |
| AUTH-04 | Reset Password | `/reset-password` | P0 | Public |
| ACC-01 | Profile | `/profile` | P1 | Auth |
| ACC-02 | Addresses | `/addresses` | P1 | Auth |
| ORD-01 | Order History | `/orders` | P0 | Auth |
| ORD-02 | Order Detail & Tracking | `/orders/[orderId]` | P0 | Auth |
| RET-01 | Returns | `/returns` | P1 | Auth |
| ADM-01 | Admin Dashboard | `/admin` | P0 | Admin |
| ADM-02 | Product List | `/admin/products` | P0 | Admin |
| ADM-03 | Product Create/Edit | `/admin/products/new`, `/admin/products/[id]/edit` | P0 | Admin |
| ADM-04 | Category Management | `/admin/categories` | P1 | Admin |
| ADM-05 | Order Management | `/admin/orders` | P0 | Admin |
| ADM-06 | Inventory Management | `/admin/inventory` | P0 | Admin |
| ADM-07 | User Management | `/admin/users` | P1 | Admin |
| ADM-08 | Review Moderation | `/admin/reviews` | P1 | Admin |
| ADM-09 | Returns Management | `/admin/returns` | P1 | Admin |
| ERR-01 | 404 Not Found | `/not-found` | P0 | Public |
| ERR-02 | Error Page | `/error` | P0 | Public |

---

## Screen Specifications

### HOME-01: Home / Landing

**Purpose:** Brand showcase, category entry, featured products, conversion hooks.

**Sections:**
1. Hero — cinematic full-bleed video/image, headline, CTA "Shop Now"
2. Category tiles — Men, Women, Children (large imagery)
3. Featured products carousel
4. New Arrivals grid (8 products)
5. Social proof — ratings, customer count
6. Newsletter signup
7. Footer — links, social, payment badges

**Components:** `HeroBanner`, `CategoryGrid`, `ProductCarousel`, `NewsletterForm`

---

### PROD-01: Product Detail

**Layout:** 2-column desktop (gallery left, info right); stacked mobile.

**Elements:**
- Image gallery with zoom + thumbnails
- Product name, brand, price, discount badge
- Size selector (pill buttons)
- Color swatches
- Quantity stepper
- Add to Cart (primary CTA), Wishlist (secondary)
- Size guide link
- Tabbed content: Description | Reviews | Shipping
- Related products row

**States:** Loading skeleton, OOS disabled, size not selected warning

---

### CART-01: Shopping Cart

**Layout:** Item list (left) + order summary sticky (right).

**Elements per item:** Image, name, size/color, unit price, qty stepper, remove, line total
**Summary:** Subtotal, discount, tax, shipping, total, "Proceed to Checkout" CTA
**Empty state:** Illustration + "Continue Shopping" link

---

### CHK-01–04: Checkout Flow

**Step indicator:** Address → Payment → Review → Confirmation

| Step | Key Fields |
|------|------------|
| Address | Saved addresses radio + new address form |
| Payment | Card/UPI/NetBanking/Wallets/COD tiles |
| Review | Order summary, edit links, place order button |
| Confirmation | Order #, estimated delivery, track link |

---

### ADM-01: Admin Dashboard

**Widgets:**
- Revenue cards (today, week, month) with trend arrows
- Orders by status donut chart
- Recent orders table (last 10)
- Top products bar chart
- Low stock alerts list

**Navigation:** Collapsible sidebar with all admin modules

---

## Design System Tokens

```css
/* Colors */
--color-bg-primary: #0a0a0f;
--color-bg-secondary: #12121a;
--color-accent-violet: #8b5cf6;
--color-accent-cyan: #06b6d4;
--color-accent-gold: #fbbf24;
--color-text-primary: #f8fafc;
--color-text-muted: #94a3b8;
--color-success: #22c55e;
--color-error: #ef4444;

/* Typography */
--font-display: 'Syne', sans-serif;
--font-body: 'Outfit', sans-serif;

/* Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96 */
/* Border radius: sm 4px, md 8px, lg 16px, xl 24px, full */
/* Shadows: glass cards use backdrop-blur + border white/10 */
```

---

## Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| xs | 320–479px | Single column, bottom nav, hamburger menu |
| sm | 480–767px | 2-col product grid |
| md | 768–1023px | 3-col grid, sidebar filters collapse |
| lg | 1024–1279px | 4-col grid, full header |
| xl | 1280px+ | Max-width container 1440px |

---

## Accessibility Checklist (All Screens)

- [ ] Semantic HTML landmarks (`header`, `main`, `nav`, `footer`)
- [ ] Skip to main content link
- [ ] Focus visible on all interactive elements
- [ ] ARIA labels on icon-only buttons
- [ ] Form labels associated with inputs
- [ ] Color contrast ≥ 4.5:1
- [ ] Keyboard navigable modals/drawers
- [ ] Screen reader announcements for cart updates
