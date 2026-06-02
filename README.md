# ClothCart

Premium online clothing shopping application for Men, Women, and Children — built with **Next.js 15**, **React 19**, and **Tailwind CSS**.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS |
| State | Zustand (cart, auth, wishlist, orders) |
| Fonts | Syne (display), Outfit (body) |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home
│   ├── products/           # Listing + detail
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout wizard
│   ├── login/              # Auth
│   ├── orders/             # Order history
│   ├── profile/            # User profile
│   ├── wishlist/
│   ├── returns/
│   └── admin/              # Admin dashboard
├── components/
│   ├── layout/             # Header, footer, nav
│   ├── product/            # Cards, grid, filters
│   ├── cart/               # Drawer, summary
│   ├── home/               # Hero, categories
│   ├── admin/
│   └── ui/                 # Button, stars, toast
├── lib/                    # Data, utils, constants
├── stores/                 # Zustand stores
└── types/                  # TypeScript types
```

## Features

- Premium dark UI with glassmorphism and cinematic visuals
- Responsive design (mobile bottom nav, sticky header)
- Product browse, filter, sort, search
- Cart drawer with tax/shipping calculations
- Multi-step checkout (address → payment → review)
- Auth (email + OTP simulation), wishlist, order tracking
- Admin dashboard preview

## Specifications

Full Spec-Kit documentation lives in:

- `PRD.md` — Product Requirements
- `specs/000-clothcart-mvp/` — Functional spec, architecture, API contracts, test cases
- `supabase/migrations/` — Database schema & RLS policies

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
