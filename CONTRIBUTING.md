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

This project follows [Semantic Versioning](https://semver.org/):

| Change                                  | Version bump    |
| --------------------------------------- | --------------- |
| Breaking change or major new capability | `MAJOR` (2.0.0) |
| New feature, backward-compatible        | `MINOR` (1.1.0) |
| Bug fix, backward-compatible            | `PATCH` (1.0.1) |

### Release Checklist

1. Update `CHANGELOG.md` — move items from `[Unreleased]` to a new `[X.Y.Z] — YYYY-MM-DD` section
2. Bump `version` in `package.json`
3. Commit: `chore: bump version to X.Y.Z`
4. Tag:
   ```bash
   git tag -a vX.Y.Z -m "Release vX.Y.Z"
   git push origin vX.Y.Z
   ```
5. GitHub Actions will automatically create a GitHub Release with the CHANGELOG notes

---

_For questions, open a GitHub Discussion or contact the core team._
