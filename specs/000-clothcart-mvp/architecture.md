# Technical Architecture Document
# ClothCart MVP

| Field | Value |
|-------|-------|
| Version | 1.0 |
| Status | Implementation-Ready |

---

## 1. Architecture Overview

ClothCart follows a **Jamstack + BaaS** architecture using Next.js App Router on Vercel with Supabase as the backend-as-a-service (PostgreSQL, Auth, Storage, Realtime).

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
│   Mobile Browser │ Tablet │ Desktop │ Admin Dashboard           │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼────────────────────────────────────┐
│                    VERCEL EDGE NETWORK (CDN)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│              NEXT.JS 15 APP (App Router)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Server       │  │ Client       │  │ API Routes           │  │
│  │ Components   │  │ Components   │  │ /api/v1/*            │  │
│  │ (RSC)        │  │ (Interactive)│  │ Server Actions       │  │
│  └──────────────┘  └──────────────┘  └──────────┬───────────┘  │
└──────────────────────────────────────────────────┼───────────────┘
                                                   │
        ┌──────────────────────────────────────────┼──────────────┐
        │                                          │              │
        ▼                                          ▼              ▼
┌───────────────┐  ┌─────────────────┐  ┌─────────────┐  ┌─────────────┐
│  SUPABASE     │  │  SUPABASE       │  │  RAZORPAY   │  │  RESEND /   │
│  PostgreSQL   │  │  Auth + Storage │  │  Payments   │  │  TWILIO     │
│  + RLS        │  │  + Realtime     │  │             │  │  Notify     │
└───────────────┘  └─────────────────┘  └─────────────┘  └─────────────┘
```

---

## 2. Layer Responsibilities

### 2.1 Presentation Layer (Next.js Frontend)

| Concern | Implementation |
|---------|----------------|
| Routing | App Router file-based routing |
| Rendering | RSC for catalog/product pages; client components for cart/checkout |
| State | React Context + Zustand for cart/wishlist; TanStack Query for server state |
| Styling | Tailwind CSS + shadcn/ui components |
| Forms | React Hook Form + Zod validation |
| Images | next/image with Supabase CDN URLs |

### 2.2 Application Layer (API Routes + Server Actions)

| Concern | Implementation |
|---------|----------------|
| REST API | `/app/api/v1/` route handlers |
| Auth middleware | Supabase SSR session validation |
| Business logic | `/lib/services/` service modules |
| Validation | Zod schemas in `/lib/validators/` |
| Error handling | Standardized `{ error: { code, message } }` responses |

### 2.3 Data Layer (Supabase PostgreSQL)

| Concern | Implementation |
|---------|----------------|
| ORM | Drizzle ORM or Supabase client with typed queries |
| Migrations | Supabase CLI migrations in `supabase/migrations/` |
| Security | Row Level Security on all tables |
| Caching | React Query staleTime + Vercel ISR for product pages |

### 2.4 Infrastructure Layer

| Service | Purpose |
|---------|---------|
| Vercel | Hosting, preview deploys, edge middleware |
| Supabase | Database, auth, storage, edge functions |
| CloudFront/Vercel CDN | Static assets, image delivery |
| Sentry | Error monitoring |
| Vercel Analytics | Web vitals |

---

## 3. Security Architecture

```
Request → Vercel Edge Middleware
            ├── Rate limiting (100 req/min per IP on auth)
            ├── CSRF token validation (mutations)
            └── Supabase session check
                    ├── Public routes: allow
                    ├── Customer routes: require auth
                    └── Admin routes: require role = admin
                            └── API Route Handler
                                    ├── Input validation (Zod)
                                    ├── RLS-enforced DB queries
                                    └── Audit log (admin actions)
```

| Control | Implementation |
|---------|----------------|
| Transport | TLS 1.3 (HTTPS mandatory) |
| Authentication | Supabase Auth JWT |
| Authorization | RLS policies + middleware role checks |
| Passwords | Supabase bcrypt hashing |
| Payments | Razorpay server-side verification; no card data stored |
| XSS | React auto-escape + CSP headers |
| SQL Injection | Parameterized queries via Supabase client |

---

## 4. Performance Strategy

| Technique | Target |
|-----------|--------|
| RSC + streaming | First contentful paint < 1.5s |
| Image optimization | WebP/AVIF via next/image |
| Code splitting | Dynamic imports for admin, checkout |
| Database indexes | On slug, category_id, user_id, order status |
| Connection pooling | Supabase Supavisor |
| Caching | ISR 60s for product listings; SWR for cart |

**Performance Budget**
- JS bundle (initial): < 150KB gzipped
- LCP: < 2.5s
- CLS: < 0.1
- API p95: < 500ms

---

## 5. Scalability Path

| Phase | Architecture |
|-------|--------------|
| MVP | Monolithic Next.js + Supabase |
| Growth | Read replicas, Redis cache (Upstash) |
| Scale | Extract payment webhooks to Edge Functions; CDN for API |
| Future | Microservices (orders, inventory, notifications) |

Target: 10,000 concurrent users via Vercel auto-scaling + Supabase connection pooling.

---

## 6. Deployment Architecture

```
GitHub (main) → Vercel Production
GitHub (develop) → Vercel Preview
Feature branches → Vercel Preview URLs

Supabase:
  Production project (prod DB)
  Staging project (preview DB)

CI/CD (GitHub Actions):
  lint → typecheck → unit tests → e2e (Playwright) → deploy
```

---

## 7. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Payments
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Notifications
RESEND_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=

# App
NEXT_PUBLIC_APP_URL=https://clothcart.com
TAX_RATE=0.18
FREE_SHIPPING_THRESHOLD=999
SHIPPING_FLAT_RATE=99
```

---

## 8. Monitoring & Observability

| Tool | Purpose |
|------|---------|
| Sentry | Error tracking, performance traces |
| Vercel Analytics | Core Web Vitals |
| Supabase Dashboard | DB metrics, auth logs |
| Structured logging | JSON logs in API routes |
| Health check | `GET /api/health` |

---

## 9. Disaster Recovery

- Supabase automated daily backups (7-day retention)
- Point-in-time recovery (Pro plan)
- RTO: 4 hours; RPO: 1 hour

---

## 10. Technology Decision Records

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 15 | RSC, App Router, Vercel integration |
| Database | Supabase PostgreSQL | RLS, auth, storage in one platform |
| Payments | Razorpay | India-first; UPI, COD support |
| UI | Tailwind + shadcn/ui | Rapid development, accessible components |
| State | Zustand + TanStack Query | Lightweight client + server cache |
