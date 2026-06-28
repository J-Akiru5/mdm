# MDM Events Management Platform

> A full-stack, production-ready event management platform for **MDM Events Management** — featuring a public-facing marketing site, a dynamic portfolio, and a full-featured admin CMS.

**Built with:** Next.js 15 · TypeScript · Prisma · Supabase · PostgreSQL · Resend

[![CI](https://github.com/J-Akiru5/mdm/actions/workflows/ci.yml/badge.svg)](https://github.com/J-Akiru5/mdm/actions/workflows/ci.yml)

---

## ✨ Features

### Public Site

- **Home** — Hero, services overview, portfolio highlights, client marquee, affiliations, workflow, CTA
- **About** — Company story, leadership, core values
- **Services** — Interactive catalog with collapsible sub-pages for each service vertical
- **Portfolio** — Dynamic gallery pulled from the database; event detail pages with full image galleries and client logos
- **Contact** — Inquiry form that submits to the database and triggers email notifications
- **Legal** — Privacy Policy and Terms of Service pages
- **SEO** — `sitemap.ts`, `robots.ts`, per-page metadata, Open Graph images

### Admin CMS (`/admin`)

| Feature           | Description                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| **Dashboard**     | Analytics overview — inquiry trends, feedback ratings, portfolio stats, recent audit activity    |
| **Portfolio**     | Full CRUD with image gallery upload, drag-and-drop reorder, category tagging, highlight toggle   |
| **Categories**    | Create, rename, delete portfolio categories                                                      |
| **Inquiries**     | Paginated list with search and event-type filter; click-through detail modal                     |
| **Feedback**      | Paginated list with search and star-rating filter                                                |
| **Audit Log**     | Immutable trail of all admin actions — create/update/delete/login/logout with before/after diffs |
| **Profile**       | Avatar upload, display name, password change                                                     |
| **Settings**      | Notification recipient management (who gets email alerts)                                        |
| **Notifications** | In-app bell with unread badge; real-time-style refresh                                           |

---

## 🛠️ Tech Stack

| Layer      | Technology                                   |
| ---------- | -------------------------------------------- |
| Framework  | Next.js 15 (App Router, Turbopack)           |
| Language   | TypeScript 5                                 |
| Styling    | CSS Modules + Vanilla CSS                    |
| Database   | PostgreSQL (Supabase)                        |
| ORM        | Prisma 7                                     |
| Auth       | Supabase Auth (email/password)               |
| Storage    | Supabase Storage (portfolio images, avatars) |
| Email      | Resend                                       |
| Deployment | Vercel                                       |
| CI/CD      | GitHub Actions                               |

---

## 📂 Project Structure

```
mdm/
├── prisma/
│   ├── schema.prisma          # Database models
│   └── seed.ts                # Seed data
├── src/
│   ├── app/
│   │   ├── (site)/            # Public marketing site
│   │   │   ├── page.tsx       # Home
│   │   │   ├── about/
│   │   │   ├── services/
│   │   │   ├── portfolio/
│   │   │   ├── contact/
│   │   │   ├── privacy/
│   │   │   └── terms/
│   │   ├── admin/             # Admin CMS (auth-gated)
│   │   │   ├── (auth)/        # Login page
│   │   │   └── (dashboard)/   # Dashboard, portfolio, inquiries, feedback, audit-log, profile, settings
│   │   ├── api/               # REST API routes
│   │   │   ├── contact/       # Inquiry submissions
│   │   │   ├── feedback/      # Feedback submissions
│   │   │   ├── portfolio/     # Portfolio CRUD + categories
│   │   │   └── admin/         # Stats, audit log, profile, notifications
│   │   └── actions/           # Server actions (auth login/logout)
│   ├── components/
│   │   ├── layout/            # Header, Footer
│   │   ├── ui/                # Button, Card, Toast, Pagination, Skeleton, …
│   │   ├── home/              # Page-specific sections
│   │   ├── about/
│   │   ├── services/
│   │   ├── portfolio/
│   │   └── contact/
│   └── lib/
│       ├── prisma.ts          # Prisma client singleton
│       ├── audit.ts           # Fire-and-forget audit logger
│       ├── api-auth.ts        # requireAuth() middleware
│       ├── email.ts           # Resend email helpers
│       └── supabase/          # Supabase server/client helpers
├── supabase/
│   └── migrations/            # SQL migrations (storage policies, buckets)
├── .github/
│   └── workflows/
│       └── ci.yml             # CI: lint, type-check, build; CD: GitHub Release on tag
├── .env.example               # Environment variable reference
└── vercel.json                # Vercel deployment config
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- A [Resend](https://resend.com) account (for email notifications)

### 1. Clone & Install

```bash
git clone https://github.com/J-Akiru5/mdm.git
cd mdm
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable                        | Description                                          |
| ------------------------------- | ---------------------------------------------------- |
| `DATABASE_URL`                  | Supabase pooled connection string (Transaction mode) |
| `DIRECT_URL`                    | Supabase direct connection string (for migrations)   |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL                            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key                             |
| `RESEND_API_KEY`                | Resend API key for outbound email                    |
| `RESEND_FROM_EMAIL`             | Verified sender address in Resend                    |
| `NEXT_PUBLIC_SITE_URL`          | Production URL (e.g. `https://mdm.events`)           |

### 3. Database Setup

Push the Prisma schema to your Supabase database:

```bash
npx prisma db push
npx prisma generate
```

Optionally seed the portfolio categories:

```bash
npx tsx prisma/seed-categories.ts
```

Apply Supabase storage policies:

```bash
# Run the contents of prisma/storage-policies.sql in the Supabase SQL editor
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The admin panel is at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 🧪 Development Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix lint errors
npm run format       # Prettier format
npm run format:check # Prettier check (used in CI)
npx tsc --noEmit     # TypeScript type check
```

---

## 🚢 Deployment

The project is deployed on **Vercel**. Push to `main` — Vercel deploys automatically.

For a new release, create an annotated tag:

```bash
git tag -a v1.x.x -m "Release v1.x.x"
git push origin v1.x.x
```

This triggers the GitHub Actions release workflow which auto-creates a GitHub Release with notes extracted from `CHANGELOG.md`.

---

## 🎨 Design System

### Brand Colors

| Token       | Value     | Usage                           |
| ----------- | --------- | ------------------------------- |
| Primary Red | `#9B1B30` | CTAs, headings, active states   |
| Red Dark    | `#7A1526` | Hover states                    |
| Red Light   | `#C42B42` | Gradients, highlights           |
| Dark Navy   | `#1A1A2E` | Hero overlays, dark sections    |
| Near Black  | `#0D0D1A` | Header, Footer                  |
| Off-White   | `#F7F7F8` | Alternating section backgrounds |
| Gold Accent | `#D4A853` | Premium highlights              |

### Typography

- **Headings / Hero** — _Playfair Display_ (Serif)
- **Body / UI** — _Inter_ (Sans-serif)

---

## 📋 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for the full version history.

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for branch conventions, commit style, and PR process.

---

## 📄 License

Proprietary — © 2026 MDM Events Management. All rights reserved.
