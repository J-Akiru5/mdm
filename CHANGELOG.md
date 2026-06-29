# Changelog

All notable changes to **MDM Events Management** are documented here.

This project adheres to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- **Gemini chatbot widget** — Floating chat bubble (bottom-right) powered by Google Gemini 2.5 Flash with MDM context (services, portfolio, testimonials, stats); conversation persisted to localStorage
- **Feedback mode in chatbot** — Toggle between Chat and Feedback modes; submit name, email, company, star rating, and comment via `/api/feedback/public`
- **`/api/chat` endpoint** — Server-side Gemini integration with system prompt built from MDM data; history filtering for valid message ordering
- **Site-wide chat widget** — Integrated into the public site layout (`(site)/layout.tsx`); visible on all public pages
- **Admin notification feed** — Dedicated notifications page under Settings tabs with full list view
- **Settings route in BottomTabBar** — Mobile navigation entry for notification settings
- **Hero event photography** — New hero image with event photography
- **Portfolio case study narratives** — Challenge, solution, and result fields added to portfolio items
- **Admin form fields** — New fields for portfolio case study content
- **Dynamic testimonials with admin approval** — Public testimonials loaded from database with admin visibility toggle
- **Toast notifications for admin actions** — Success/error toasts on feedback and inquiry management
- **Audit logging for feedback/inquiry admin actions** — `UPDATE` and `DELETE` operations tracked
- **"Mark all as read" for notifications** — Bulk action in notification panel
- **Clickable notifications** — Navigate to relevant section on click

### Fixed

- **Bell badge count** — Now respects localStorage read state to show accurate unread count
- **Hero section** — Restored to original 1.0.0 release design

### Changed

- **About page** — Updated "Who We Are" text and replaced placeholder images with actual event photos from MDM portfolio
- **Home AboutPreview** — Reverted to original 3-photo grid layout
- **Public testimonials** — Limited to 3 most recent entries
- **Email header** — Now uses event banner image as template

---

## [1.0.0] — 2026-06-28

> **Initial production release.** Marks the graduation from a static prototype to a fully-featured, database-driven event management platform with a public marketing site and a complete admin CMS.

### Added — Public Site

- **Home page** — Hero section, animated service cards, portfolio highlights grid, scrolling client logo marquee, affiliations, animated workflow diagram, and a CTA section
- **About page** — Company story, leadership team, and core values section
- **Services page** — Collapsible full-width service catalog with a sticky sidebar and 4 detailed sub-pages (Corporate Events, Government Events, Launch Events, Technology & Digital Solutions)
- **Portfolio page** — Dynamic gallery fed from the database with category filtering, event-type badges, and client logo display
- **Event detail pages** — Full-screen gallery viewer for each portfolio item with client branding
- **Contact page** — Inquiry submission form that persists to PostgreSQL and fires email notifications
- **Privacy Policy and Terms of Service** — Legal pages
- **SEO infrastructure** — `sitemap.ts`, `robots.ts`, per-page `metadata` objects, Open Graph images, keyword strategy

### Added — Admin CMS (`/admin`)

- **Authentication** — Supabase email/password login; server-side session via `@supabase/ssr`; protected routes via `requireAuth()` middleware
- **Dashboard** — Analytics overview featuring: inquiry count with weekly trend, feedback count and average rating, portfolio item count, monthly inquiries bar chart, event-type donut chart, portfolio-by-category breakdown, and a live Recent Admin Activity feed
- **Portfolio management** — Full CRUD (create, edit, delete); multi-image gallery upload with drag-and-drop reorder; highlight toggle for homepage featuring; category tagging
- **Category management** — Create, rename, delete portfolio categories; sort order management
- **Inquiries** — Server-side paginated list (20/page) with debounced full-text search and event-type filter; click-through detail modal
- **Feedback** — Server-side paginated list (20/page) with debounced full-text search and star-rating filter; summary card with total count
- **Audit Log** — Immutable, append-only trail of all admin events: `LOGIN`, `LOGIN_FAILED`, `LOGOUT`, `CREATE`, `UPDATE`, `DELETE`; expandable before/after JSON diff; filter by action type, entity, date range, and actor email; 25/page pagination
- **Profile** — Avatar upload to Supabase Storage, display name editing, password change
- **Settings** — Notification recipient management: add, activate/deactivate, and remove email recipients for inquiry and feedback alerts
- **Notifications** — In-app notification bell with unread badge; real-time-style panel with mark-all-read
- **"Last edited by"** — Portfolio and category items display the editor's email and relative timestamp inline

### Added — API Layer

| Endpoint                             | Methods                     | Description                                 |
| ------------------------------------ | --------------------------- | ------------------------------------------- |
| `/api/portfolio`                     | `GET POST PUT PATCH DELETE` | Portfolio CRUD with audit trail             |
| `/api/portfolio/categories`          | `GET POST PUT DELETE`       | Category CRUD with audit trail              |
| `/api/contact`                       | `GET POST`                  | Inquiry submission + paginated admin fetch  |
| `/api/feedback`                      | `GET POST`                  | Feedback submission + paginated admin fetch |
| `/api/admin/stats`                   | `GET`                       | Aggregated dashboard analytics              |
| `/api/admin/audit-log`               | `GET`                       | Filtered, paginated audit log               |
| `/api/admin/profile`                 | `GET PATCH`                 | User profile read/update                    |
| `/api/admin/notifications`           | `GET PATCH`                 | Notification read/unread management         |
| `/api/admin/notification-recipients` | `GET POST PATCH DELETE`     | Recipient list management                   |

### Added — Infrastructure & Tooling

- **Database** — PostgreSQL via Supabase; Prisma ORM for type-safe queries; models: `Portfolio`, `PortfolioImage`, `Category`, `ContactSubmission`, `Feedback`, `AuditLog`, `NotificationRecipient`
- **Supabase Storage** — `portfolio` bucket for event images; `avatars` bucket with Row Level Security policies
- **Email** — Resend integration with branded HTML templates for inquiry and feedback notifications; configurable recipient list stored in the database
- **Audit system** — Fire-and-forget `logAudit()` utility; `AuditLog` table with indexes on `action`, `entity`, `actorEmail`, `createdAt`
- **Shared Pagination component** — `src/components/ui/Pagination.tsx`; used by Portfolio (client-side, 12/page), Inquiries (server-side, 20/page), Feedback (server-side, 20/page), Audit Log (server-side, 25/page)
- **CI/CD** — GitHub Actions pipeline: ESLint, Prettier format check, `tsc --noEmit`, `next build`; auto GitHub Release on `v*.*.*` tag push
- **Husky + lint-staged** — Pre-commit: ESLint fix + Prettier on staged `.ts`/`.tsx`/`.css`/`.json`/`.md` files
- **Vercel deployment** — Zero-config deployment on push to `main`

---

## [0.1.0] — 2026 (Pre-release / Prototype)

Initial static prototype — Next.js App Router with CSS Modules, no database, no CMS, no API layer. Internal development baseline only.

---

[Unreleased]: https://github.com/J-Akiru5/mdm/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/J-Akiru5/mdm/releases/tag/v1.0.0
