# Contributing to MDM Events Management

Thank you for contributing! This document covers everything you need to work on this codebase effectively.

---

## Table of Contents

- [Development Setup](#development-setup)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Code Quality](#code-quality)
- [Versioning & Releases](#versioning--releases)

---

## Development Setup

### Prerequisites

- Node.js 20+
- A Supabase project
- A Resend account

### Quick Start

```bash
git clone https://github.com/J-Akiru5/mdm.git
cd mdm
npm install
cp .env.example .env.local   # Fill in your values
npx prisma db push
npx prisma generate
npm run dev
```

### Useful Commands

```bash
npm run dev           # Start dev server (Turbopack, http://localhost:3000)
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run format        # Prettier format all files
npm run format:check  # Prettier check (same as CI)
npx tsc --noEmit      # TypeScript type check (same as CI)
npm run build         # Production build (validates everything)
```

---

## Branch Naming

Use the following prefixes:

| Prefix      | When to use                                   |
| ----------- | --------------------------------------------- |
| `feat/`     | New feature or user-facing change             |
| `fix/`      | Bug fix                                       |
| `chore/`    | Tooling, dependencies, configs, documentation |
| `refactor/` | Code restructuring without behavior change    |
| `perf/`     | Performance improvements                      |

**Examples:**

```
feat/event-calendar-widget
fix/audit-log-json-diff
chore/update-prisma-to-v8
refactor/portfolio-api-extract-service
```

Branch off `main` and open a PR back to `main`.

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

**Types:** `feat` · `fix` · `chore` · `refactor` · `perf` · `docs` · `style` · `test`

**Examples:**

```
feat(portfolio): add bulk delete with confirmation dialog
fix(audit): resolve JSON diff not rendering for Category entity
chore(deps): upgrade Next.js to 15.4.0
docs: update README with new env variables
```

> Commits are linted by Husky pre-commit hooks (ESLint + Prettier on staged files).

---

## Pull Request Process

1. **Branch** off the latest `main`
2. **Write your changes** — keep PRs focused; one concern per PR
3. **Self-review** — run `npm run lint`, `npm run format:check`, `npx tsc --noEmit`, and `npm run build` locally before pushing
4. **Open a PR** — use a descriptive title following the commit convention
5. **CHANGELOG** — if your PR introduces a user-facing change, add an entry under `[Unreleased]` in `CHANGELOG.md`
6. **Merge** — squash merge into `main` with a clean commit message

### PR Title Format

Same as commit message format:

```
feat(admin): add bulk-export for inquiries as CSV
```

---

## Code Quality

### TypeScript

- All new code must be fully typed — no `any` unless absolutely unavoidable (and commented)
- Run `npx tsc --noEmit` before every PR

### Styling

- Use **CSS Modules** for component styles
- No inline styles except for truly dynamic values (e.g., calculated widths)
- No Tailwind — the project uses Vanilla CSS with custom properties

### API Routes

- All admin API routes must call `requireAuth(req)` as the first step
- All write operations must call `logAudit()` fire-and-forget after the Prisma op
- Return consistent shapes: `{ data, total, page, totalPages, pageSize }` for paginated endpoints

### Components

- Generic/reusable UI components go in `src/components/ui/`
- Page-specific components go in `src/components/<page>/`
- The `Pagination` component in `src/components/ui/Pagination.tsx` must be used for all paginated admin lists

---

## Versioning & Releases

This project uses **[Semantic Release](https://semantic-release.gitbook.io/)** — versioning and releases are **fully automated** based on your commit messages. You never need to manually edit `package.json`, `CHANGELOG.md`, or create a Git tag.

### How It Works

Every merge to `main` triggers the CI release job, which:

1. Analyzes all commits since the last release
2. Determines the correct next version based on [SemVer](https://semver.org/)
3. Updates `package.json` and `CHANGELOG.md` automatically
4. Commits those changes back to `main` with `[skip ci]` (prevents loops)
5. Creates a `vX.Y.Z` Git tag
6. Publishes a GitHub Release with auto-generated notes

### Commit → Version Mapping

| Commit prefix                        | Version bump              | Example                                           |
| ------------------------------------ | ------------------------- | ------------------------------------------------- |
| `feat:`                              | **MINOR** `1.0.0 → 1.1.0` | `feat(admin): add CSV export for inquiries`       |
| `fix:`                               | **PATCH** `1.0.0 → 1.0.1` | `fix(auth): resolve session expiry redirect loop` |
| `perf:`                              | **PATCH**                 | `perf(portfolio): lazy-load gallery images`       |
| `refactor:`                          | **PATCH**                 | `refactor(api): extract auth middleware`          |
| `BREAKING CHANGE:` in footer         | **MAJOR** `1.0.0 → 2.0.0` | Any commit with `BREAKING CHANGE:` in the body    |
| `docs:`, `chore:`, `style:`, `test:` | **No release**            | Ignored by the release bot                        |

> [!IMPORTANT]
> A release is **only triggered** if at least one commit since the last release uses `feat:`, `fix:`, `perf:`, or `refactor:`. Pure `chore:`/`docs:` pushes produce no new release.

### Adding to the Changelog

You **do not** need to edit `CHANGELOG.md` manually — Semantic Release writes it for you.

If you want a human-readable description beyond the commit subject, add it in the commit body:

```
feat(portfolio): add CSV export for inquiries

Admins can now download all inquiries as a CSV file directly from
the Inquiries page. Includes all fields: name, email, event type,
date, and message.
```

The body text will appear in the GitHub Release notes.

---

_For questions, open a GitHub Discussion or contact the core team._
