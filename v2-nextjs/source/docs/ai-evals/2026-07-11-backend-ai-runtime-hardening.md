# Backend AI Runtime Hardening - 2026-07-11

## Scope

- Baseline: `main` at `0687771` (`v2.1.7`)
- Backend and test changes only
- No layout, visual design, or interaction redesign
- Production model family remains fixed to `gpt-5.5`

Completion update: vector recovery and GPT-5.5 hybrid live verification were completed on 2026-07-12. See [`2026-07-12-v2.1.7-hybrid-live-eval-closure.md`](./2026-07-12-v2.1.7-hybrid-live-eval-closure.md).

## Audit Finding

The generated reference corpus was newer than the stored vector embeddings:

- Current corpus chunks: 6,597 across 5 locales
- Current corpus revision: 2026-04-27
- Stored vector refresh: 2026-03-14
- Stale vector rows: 6,597

The previous vector status command trusted a committed snapshot that still reported all locales as ready. This created a false-green release signal even though the live database vectors no longer represented the current corpus text.

## Changes

1. Added a SHA-256 fingerprint derived from locale and chunk content.
2. Bound vector release snapshots to the exact corpus fingerprint and generation revision.
3. Made runtime retrieval fall back to lexical search whenever the vector snapshot is not current.
4. Added vector readiness as a required AI release-gate step.
5. Added stale counts to the vector status report.
6. Declared `gpt-5.5` as the single fixed production model family in code and tests.
7. Isolated response memos and scoring-sheet rows as untrusted prompt data.
8. Replaced context-size rejection with shared newest-first context compaction on client and server.
9. Replaced ambiguous plain-text streaming with an opt-in NDJSON protocol that emits explicit `delta`, `complete`, `incomplete`, and `error` events.
10. Added backward-compatible protocol negotiation so browser tabs from the previous deployment continue to receive plain text during rollout.
11. Applied one shared stream parser to both the interpretation assistant and coding assistant.
12. Replaced the English-only Korean crisis response with locale-aware responses and the current Korean `109` suicide-prevention route.
13. Narrowed crisis matching so educational S-CON questions do not trigger a personal-crisis block.
14. Moved safety intervention ahead of structural-summary and coding-context validation.
15. Added route-level tests for structured and legacy safety responses without contacting OpenAI.
16. Added a three-minute generation deadline, one retry, and request-abort propagation.
17. Added a 30-second query-embedding timeout and one retry.
18. Separated invalid key, quota/billing, rate limit, timeout, abort, and unavailable-model failures into privacy-safe public error codes.
19. Added API-free `/api/chat` orchestration tests for completed, max-output incomplete, and mid-stream quota responses.
20. The route tests exercise encrypted BYOK cookie parsing, request validation, fixed GPT-5.5 selection, prompt construction, stream wrapping, and browser-side terminal parsing.

## Verification

- Targeted regression tests: 20 passed
- Full test suite: 150 passed, 5 skipped
- Lint and i18n audit: passed
- Next.js production build: passed, 221 pages generated
- Curated retrieval suites: 365 cases passed across `ko`, `en`, `ja`, `es`, and `pt`
- Vector status: current snapshot detected, 0/5 locales ready, 6,597 stale rows reported
- AI release gate: correctly blocked at `vector_runtime`

The failed vector gate is the expected safe state. It prevents release until embeddings are regenerated from the current corpus.

## Completion After Billing Recovery

Run these commands only after a working OpenAI project key is available:

```powershell
npm run docs:generate-embeddings:openai
npm run docs:generate-vector-release-snapshot
npm run ops:vector-status
npm run docs:assert-vector-runtime-ready
npm run ai:release-gate
```

Then run the saved live GPT-5.5 scenarios before release. No corpus rewriting is required.

## Privacy Boundary

This record contains no API keys, raw source materials, user prompts, model responses, or chat transcripts.
