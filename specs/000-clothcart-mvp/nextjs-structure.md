# Next.js App Router Structure
# ClothCart MVP

```
clothcart/
├── app/
│   ├── layout.tsx                    # Root layout (fonts, providers, header/footer)
│   ├── page.tsx                      # Home page
│   ├── loading.tsx                   # Global loading UI
│   ├── error.tsx                     # Global error boundary
│   ├── not-found.tsx                 # 404 page
│   │
│   ├── (shop)/                       # Customer-facing route group
│   │   ├── layout.tsx                # Shop layout with nav
│   │   ├── products/
│   │   │   ├── page.tsx              # Product listing + filters
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Product detail
│   │   ├── search/
│   │   │   └── page.tsx              # Search results
│   │   ├── cart/
│   │   │   └── page.tsx              # Shopping cart
│   │   ├── wishlist/
│   │   │   └── page.tsx              # Wishlist
│   │   ├── checkout/
│   │   │   ├── page.tsx              # Checkout wizard
│   │   │   └── confirmation/
│   │   │       └── [orderId]/
│   │   │           └── page.tsx      # Order confirmation
│   │   └── categories/
│   │       └── [slug]/
│   │           └── page.tsx          # Category page
│   │
│   ├── (auth)/                       # Auth route group (minimal layout)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── reset-password/
│   │       └── page.tsx
│   │
│   ├── (account)/                    # Protected customer routes
│   │   ├── layout.tsx                # Account sidebar layout
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx              # Order history
│   │   │   └── [orderId]/
│   │   │       └── page.tsx          # Order detail + tracking
│   │   ├── addresses/
│   │   │   └── page.tsx
│   │   └── returns/
│   │       └── page.tsx
│   │
│   ├── admin/                        # Admin panel (role-protected)
│   │   ├── layout.tsx                # Admin sidebar layout
│   │   ├── page.tsx                    # Dashboard
│   │   ├── products/
│   │   │   ├── page.tsx              # Product list
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [orderId]/
│   │   │       └── page.tsx
│   │   ├── inventory/
│   │   │   └── page.tsx
│   │   ├── users/
│   │   │   └── page.tsx
│   │   ├── reviews/
│   │   │   └── page.tsx
│   │   └── returns/
│   │       └── page.tsx
│   │
│   └── api/
│       └── v1/
│           ├── auth/
│           │   ├── register/route.ts
│           │   ├── login/route.ts
│           │   ├── logout/route.ts
│           │   ├── me/route.ts
│           │   └── otp/
│           │       ├── send/route.ts
│           │       └── verify/route.ts
│           ├── products/
│           │   ├── route.ts
│           │   ├── search/route.ts
│           │   └── [slug]/
│           │       ├── route.ts
│           │       └── related/route.ts
│           ├── categories/route.ts
│           ├── cart/
│           │   ├── route.ts
│           │   └── items/
│           │       ├── route.ts
│           │       └── [itemId]/route.ts
│           ├── wishlist/
│           │   ├── route.ts
│           │   ├── [productId]/route.ts
│           │   └── move-to-cart/route.ts
│           ├── checkout/
│           │   ├── validate-address/route.ts
│           │   ├── create-order/route.ts
│           │   └── verify-payment/route.ts
│           ├── orders/
│           │   ├── route.ts
│           │   └── [orderId]/
│           │       ├── route.ts
│           │       └── cancel/route.ts
│           ├── returns/
│           │   ├── route.ts
│           │   └── [returnId]/route.ts
│           ├── reviews/
│           │   └── [productId]/route.ts
│           ├── admin/
│           │   ├── dashboard/route.ts
│           │   ├── products/
│           │   │   ├── route.ts
│           │   │   └── [id]/route.ts
│           │   ├── orders/
│           │   │   ├── route.ts
│           │   │   └── [orderId]/status/route.ts
│           │   ├── inventory/[variantId]/route.ts
│           │   ├── reviews/[reviewId]/moderate/route.ts
│           │   └── returns/[returnId]/route.ts
│           ├── webhooks/
│           │   └── razorpay/route.ts
│           └── health/route.ts
│
├── components/
│   ├── ui/                           # shadcn/ui primitives
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── mobile-nav.tsx
│   │   └── admin-sidebar.tsx
│   ├── product/
│   │   ├── product-card.tsx
│   │   ├── product-grid.tsx
│   │   ├── product-filters.tsx
│   │   ├── product-gallery.tsx
│   │   ├── size-selector.tsx
│   │   └── related-products.tsx
│   ├── cart/
│   │   ├── cart-drawer.tsx
│   │   ├── cart-item.tsx
│   │   └── cart-summary.tsx
│   ├── checkout/
│   │   ├── address-form.tsx
│   │   ├── payment-selector.tsx
│   │   └── order-summary.tsx
│   ├── order/
│   │   ├── order-card.tsx
│   │   └── order-timeline.tsx
│   └── admin/
│       ├── stats-card.tsx
│       ├── data-table.tsx
│       └── product-form.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser client
│   │   ├── server.ts                 # Server client
│   │   └── middleware.ts             # Session refresh
│   ├── services/
│   │   ├── product.service.ts
│   │   ├── cart.service.ts
│   │   ├── order.service.ts
│   │   ├── payment.service.ts
│   │   └── admin.service.ts
│   ├── validators/
│   │   ├── auth.schema.ts
│   │   ├── product.schema.ts
│   │   ├── cart.schema.ts
│   │   └── checkout.schema.ts
│   ├── utils/
│   │   ├── currency.ts
│   │   ├── cn.ts
│   │   └── api-response.ts
│   └── constants/
│       ├── order-status.ts
│       └── payment-methods.ts
│
├── hooks/
│   ├── use-cart.ts
│   ├── use-wishlist.ts
│   └── use-auth.ts
│
├── stores/
│   ├── cart-store.ts                 # Zustand
│   └── ui-store.ts
│
├── types/
│   ├── database.types.ts             # Supabase generated
│   ├── product.ts
│   ├── order.ts
│   └── api.ts
│
├── middleware.ts                       # Auth + admin route protection
│
├── public/
│   ├── images/
│   └── icons/
│
├── supabase/
│   ├── migrations/
│   └── seed.sql
│
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Route Protection (middleware.ts)

| Route Pattern | Access |
|---------------|--------|
| `/`, `/products/*`, `/search`, `/categories/*` | Public |
| `/cart`, `/wishlist` | Public (guest cart) / Auth (persist) |
| `/checkout/*` | Auth required |
| `/profile`, `/orders/*`, `/returns` | Auth required |
| `/admin/*` | Admin/Support role |
| `/api/v1/admin/*` | Admin role (API middleware) |

## Rendering Strategy

| Page | Strategy | Revalidate |
|------|----------|------------|
| Home | ISR | 60s |
| Product listing | ISR | 60s |
| Product detail | ISR | 30s |
| Cart | Client | — |
| Checkout | Client | — |
| Admin dashboard | SSR | — |
| Order history | SSR | — |

## Key Dependencies

```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "@supabase/ssr": "^0.5.0",
  "@tanstack/react-query": "^5.0.0",
  "zustand": "^5.0.0",
  "react-hook-form": "^7.0.0",
  "zod": "^3.0.0",
  "tailwindcss": "^4.0.0",
  "razorpay": "^2.0.0"
}
```
