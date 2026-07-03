# [2026-07-03] v2.1.4 Bugfix

v2.1.4 is an AI quality hardening release for the v2 Next.js app.

This release does not change the completed UI/UX surface. It strengthens the backend evaluation harness so the OpenAI assistant can be tested more like a production AI wrapper: multi-turn behavior, human-in-the-loop boundaries, review scoring, and publishable eval evidence.

## Summary

- Added multi-turn eval fixtures for coding-assist follow-up behavior and interpretation follow-up safety.
- Added a multi-turn transcript contract evaluator that checks every assistant turn and catches turn-count mismatches.
- Added a human review record scorer for rubric math, blocking failures, decision consistency, and privacy-safe JSONL shape.
- Added `ai:evaluate-human-records`.
- Added a live OpenAI multi-turn eval suite.
- Extended the live eval batch runner with `--suite single` and `--suite multiturn`.
- Documented the v2.1.4 eval hardening process in `docs/ai-evals/2026-07-03-v2.1.4-ai-eval-hardening-report.md`.
- Updated footer/package/version archive metadata to v2.1.4.

## Verification

The private deployment repo passed:

- `npm run ai:evaluate-contracts`
- `npm run ai:evaluate-human-records`
- `node scripts/score-ai-human-review-records.mjs --input docs/ai-evals/human-review-records --require-pass`
- `npm run ai:evaluate-artifacts`
- `npm run security:secrets`
- `npm run lint`
- `npm test`
- `npm run build`
- `git diff --check`

The direct multi-turn live Vitest suite was also invoked, but skipped because `OPENAI_API_KEY` was not present in the current process environment. No live API cost was incurred in that local batch.

## Public Scope

The public source mirror includes the eval harness code, tests, scripts, docs, and release metadata needed to understand the quality work.

The public archive does not include API keys, `.env*` files, Vercel local state, raw model outputs, raw prompts, raw chat messages, or private operational notes.
