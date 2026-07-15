# Computing Program for Rorschach Structural Summary (v2-nextjs)

Next.js-based web application for Exner structural summary scoring, documentation browsing, and AI-assisted interpretation.

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- BYOK AI session cookie (no Google login or server-side account DB)
- Prisma + Neon PostgreSQL for read-only RAG reference retrieval
- Optional, separately configured PostgreSQL store for content-free AI response ratings

## Main Features

- Scoring input UI (desktop table + mobile card flow)
- Structural summary calculation and result views
- AI chat support using a user-provided OpenAI API key
- Reference-document search backed by public RAG corpus embeddings
- Manifest-only PWA install support without service worker or offline caching
- Privacy policy index and subpages (`/privacy/...`)
- CSV export, print-friendly result output

## Local Development

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm run lint
npm test
npm run build
npm run security:check
```

## Deployment

- Source branch: `main`
- Deploy target: Vercel Production
- If Vercel shows an old commit, trigger a new production deployment from the latest `main` commit.

## Repository Layout

```text
app/            Next.js routes and API handlers
components/     UI and feature components
hooks/          Client hooks
i18n/           Translation config and locale JSON
lib/            Core logic and utilities
prisma/         RAG schema plus isolated feedback schema and migrations
types/          Shared TypeScript types
```

## Security Notes

- Do not commit secrets (`.env`, API keys, private notes).
- Keep private operational notes outside tracked files.
- Do not reintroduce Google OAuth, NextAuth, account pages, server-stored API keys, or chat-history persistence unless the product model intentionally changes.
- RAG runtime credentials should be read-only and scoped to the public corpus tables. Optional feedback writes must use a separate database and credential.
- Keep PWA support manifest-only unless service worker caching gets a separate privacy and security review.
