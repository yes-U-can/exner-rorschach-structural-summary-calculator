# Version 2.1.6

Released: 2026-07-04

Type: Bugfix

## Summary

v2.1.6 closes the v2.1.x AI quality line before the project moves to v2.2.0 mobile UX work.

This release keeps the app UI/UX unchanged and focuses on backend AI quality, retrieval evaluation, release gating, and dependency audit hygiene.

## Highlights

- Added `docs:evaluate-rag:all` to run curated reference retrieval evals for every runtime locale in one command.
- Fixed the PT retrieval eval path so `docs:evaluate-rag:pt` now evaluates the PT query set instead of falling back to KO.
- Improved multilingual retrieval intent handling for Portuguese coding, interpretation, graph-navigation, and code-like symbol questions.
- Expanded `ai:release-gate` to include full runtime reference retrieval evals and dependency audit.
- Tightened dependency audit from high severity to moderate severity.
- Updated locked `js-yaml` versions so `npm audit` reports zero vulnerabilities.
- Added v2.1.6 AI quality closure evidence under `source/docs/ai-evals/`.

## Verification

Local verification passed:

```bash
npm run ai:release-gate -- --markdown docs/ai-evals/2026-07-03-v2.1.6-ai-quality-closure-gate.md
npm run lint
npm test
npm run build
git diff --check
```

The AI release gate passed all 6 required steps:

1. `npm run docs:evaluate-rag:all`
2. `npm run ai:evaluate-contracts`
3. `npm run ai:evaluate-artifacts`
4. `npm run ai:evaluate-human-records -- --require-pass`
5. `npm run security:secrets`
6. `npm run security:audit`

## Privacy Boundary

This public archive does not include deployment secrets, local environment files, API keys, runtime logs, private databases, or Vercel project settings.

Saved AI eval artifacts record privacy-safe metadata such as fixture IDs, status, issue types, token usage, output length, and estimated cost. They do not store raw prompts, raw model answers, private assessment payloads, or API keys.
