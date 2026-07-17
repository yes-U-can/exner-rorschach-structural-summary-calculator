# Computing Program for Rorschach Structural Summary (v2-nextjs)

Exner 종합체계 구조요약 계산, 참조 문서 검색, 선택형 AI 도우미를 제공하는 웹앱의 공개 가능한 소스입니다.

## 비개발자 독자가 먼저 알아야 할 점

- 계산기는 OpenAI API 키가 없어도 사용할 수 있습니다.
- AI 도우미는 부호화와 해석을 보조하지만 임상가의 판단을 대신하지 않습니다.
- 사용자가 입력한 OpenAI API 키는 서버 데이터베이스에 저장하지 않습니다.
- 대화 원문은 서버 데이터베이스에 저장하지 않습니다.
- AI 답변 평가는 질문·답변 원문 없이 미리 정한 이유와 최소한의 요약 정보만 별도 데이터베이스에 보관할 수 있습니다. 과도한 반복 요청을 막기 위한 일방향 세션 식별값과 짧은 횟수 기록은 최대 24시간만 유지합니다.
- 아래 내용은 앱을 직접 실행하거나 코드를 검토하려는 개발자를 위한 기술 정보입니다.

<details>
<summary><strong>Developer setup and repository details</strong></summary>

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

</details>
