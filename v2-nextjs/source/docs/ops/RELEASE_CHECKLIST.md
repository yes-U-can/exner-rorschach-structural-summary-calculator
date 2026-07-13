# Release Checklist

Use this checklist before deploying the BYOK-only RAG build to production.

## 1) Access And Secrets

1. `BYOK_COOKIE_SECRET` exists in the target environment and is at least 32 random characters.
2. `RAG_DATABASE_URL` points to a read-only Neon/Postgres role and uses `sslmode=verify-full`.
3. `RAG_WRITE_DATABASE_URL` is absent from Vercel production runtime envs.
4. Google OAuth, NextAuth, server-stored API-key encryption, credits, and store envs are absent.
5. No secrets are committed in the diff (`npm run security:check` and `git diff --cached` sanity check).

## 2) Data And Migrations

1. Every pending Prisma migration is reviewed before it is applied, especially when it deletes rows or narrows an enum.
2. Destructive migrations are tested on an isolated staging/dev database with representative rows first.
3. The production migration preflight records provider and locale counts before changing data.
4. Neon keeps only OpenAI public reference-corpus embedding rows after the provider-cleanup migration.
5. The vector release snapshot is regenerated after migration and `providerAudit.clean` is `true` with unexpected embedding count `0`.
6. RAG write credentials are used only from local maintenance scripts and remain absent from Vercel runtime environments.

## 3) Security And Privacy

1. `/api/byok/session` sets API-key cookies as HttpOnly, Secure in production, SameSite=Lax, Max-Age=24h.
2. `/api/chat` rejects requests without a BYOK session before provider calls start.
3. API keys are not written to DB, localStorage, or sessionStorage.
4. Chat messages are not written to DB and are kept only in browser session storage.
5. Logs do not contain raw API keys, full chat bodies, or sensitive assessment payloads.

## 4) AI And RAG

1. Neon vector retrieval still works with the read-only runtime DB role.
2. RAG fallback to static lexical search works when Neon/vector retrieval fails.
3. Reference corpus and vector snapshots are regenerated after corpus updates.
4. RAG evaluation is run for affected locales when reference content changes.
5. AI harness contracts pass with `npm run ai:evaluate-contracts` when assistant behavior changes.
6. Saved live eval JSONL artifacts pass `npm run ai:evaluate-artifacts` before they are used in release notes or public showcase documentation.

## 5) Browser And Open Source

1. `npm run lint`, `npm test`, `npm run build`, and `npm run security:check` pass.
2. `.env*`, `.vercel/`, private keys, and production logs are not tracked.
3. Guest calculator autosave stays browser-only and clearable.
4. CSP works without Google login frames and still allows configured analytics/consent scripts.
5. PWA install support stays manifest-only unless a separate security review approves service worker/offline caching.

## 6) Public Archive And Documentation

1. `docs/ops/PUBLIC_RELEASE_DOCUMENTATION.md` is reviewed before writing public-facing release notes.
2. Public-facing README, CHANGELOG, release notes, and companion summaries follow the language coverage policy.
3. Korean canonical release notes keep technical identifiers in their original English form.
4. The English companion overview is updated when repository positioning, latest release, or key evidence links change.
5. The app version archive entry points to the public `exner-rorschach-structural-summary-calculator` release note and source mirror.
6. The public release note states whether the app UI/UX changed.
7. AI eval evidence used in public documentation contains metadata only, not raw prompts, raw model answers, API keys, or private assessment payloads.
8. Public source mirror excludes `.env*`, `.vercel/`, `node_modules/`, runtime logs, local caches, private work notes, API keys, and raw model output.

## 7) Final Smoke Test

1. Calculator works without an AI session.
2. Starting an AI session by entering an OpenAI API key works.
3. Ending the AI session clears the BYOK cookie and ephemeral chat state.
4. `/chat` and the coding helper use only the active BYOK session.
5. `/account`, `/api/auth/*`, `/api/user/*`, and internal account-deletion routes return 404.
