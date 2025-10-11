# mini-blog

A small Next.js blog with GitHub OAuth via Auth.js — users can sign in, create/edit/delete plain-text posts, toggle a post's published visibility, and browse with infinite scroll plus filtering and sorting.

## Features
- Auth: GitHub sign-in using Auth.js
- Posts: Create, edit, delete plain-text posts; authors can toggle published (visible to everyone)
- Feed: Infinite scroll with cursor-based pagination
- Controls: Filters (search, author) and sorting (newest, oldest)
- Database: PostgreSQL via Prisma
- Data fetching: Plain fetch API calls
- API & routing: Next.js App Router plus API routes for infinite-scroll endpoints

## Getting started

Prerequisites
- Node.js
- pnpm or npm
- PostgreSQL (local or cloud)
- GitHub OAuth App (Client ID & Secret)

1. Clone
```bash
git clone https://github.com/bosnier/mini-blog.git
cd mini-blog
```

2. Install
```bash
pnpm i
```

3. Environment
Use the existing .env.example to create your .env

4. Prisma
```bash
pnpm dlx prisma migrate dev
pnpm dlx prisma generate
```

5. Run
```bash
pnpm dev
# open http://localhost:3000
```

## API routes
- GET `/api/posts/get?from=<id>&limit=20&sort=<key>&author=<id>&q=<search>&truncateContent=true&includeUnpublished=true`
- GET `/api/users/get?id=<id>`
- GET `/api/users/search?q`

Enforce ownership checks server-side.

## Client
- Infinite scroll: Fetch /api/posts with cursor; append results.
- Filters & sorting: Encode as query params; refetch on change; reset cursor for new queries.
- Post editor: Plain-text textarea, title, and a **published** checkbox to toggle visibility for others.

## Auth
- Use Auth.js GitHub provider.
- Map Auth.js user to Prisma User on sign-in.
- Protect API routes by validating session; allow authors to see their unpublished posts.

## Pagination & performance
- Use cursor-based pagination (post ids).
- Default page size: 5.

## Folder structure
- `app/ `— Next.js App Router pages
- `app/api/` — API route handlers used for infinite scroll endpoints and user search
- `prisma/` — schema.prisma, migrations
- `lib/` — form validation schemas, types, server actions, hooks and some utility functions
- `components/` — shadcn components and complex components

## Tests & CI
No tests or CI configured
