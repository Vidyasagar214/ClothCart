# ClothCart Project Constitution

## Vision

ClothCart is a world-class, conversion-focused e-commerce platform for Men, Women, and Children clothing. Every decision prioritizes premium UX, accessibility, performance, and scalable architecture.

## Core Principles

1. **Mobile-First** — Design and implement for 320px+ screens first; enhance for tablet and desktop.
2. **Performance Budget** — Page load ≤ 3s; API response ≤ 500ms; Lighthouse Performance ≥ 90.
3. **Security by Default** — HTTPS, bcrypt/argon2 passwords, JWT sessions, input validation, PCI-compliant payments.
4. **Accessibility** — WCAG 2.1 AA: semantic HTML, keyboard navigation, ARIA labels, color contrast ≥ 4.5:1.
5. **Spec-Driven Development** — No feature ships without spec, plan, tasks, and acceptance criteria.
6. **Test Before Merge** — Critical paths require automated tests; manual QA against acceptance criteria.
7. **Incremental MVP** — Ship core e-commerce flows first; defer social login, AI recommendations, PWA to post-MVP.

## Technology Stack (MVP)

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router), React 19, Tailwind CSS |
| Backend | Next.js API Routes + Supabase Edge Functions |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth (email, OTP) |
| Storage | Supabase Storage (product images) |
| Payments | Razorpay (primary), Stripe (international) |
| Hosting | Vercel (frontend) + Supabase (backend/DB) |
| CDN | Vercel Edge Network + Supabase CDN |

## Code Standards

- TypeScript strict mode enabled
- ESLint + Prettier enforced in CI
- Component naming: PascalCase; files: kebab-case
- API routes follow REST conventions under `/api/v1/`
- Database migrations versioned in `supabase/migrations/`
- RLS enabled on all public tables

## Git Workflow

- `main` — production-ready
- `develop` — integration branch
- Feature branches: `feature/001-auth`, `feature/002-catalog`
- Conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`

## Definition of Done

- [ ] Spec and acceptance criteria met
- [ ] Unit/integration tests passing
- [ ] Responsive on mobile, tablet, desktop
- [ ] Accessibility checklist passed
- [ ] No critical/high security vulnerabilities
- [ ] Documentation updated
