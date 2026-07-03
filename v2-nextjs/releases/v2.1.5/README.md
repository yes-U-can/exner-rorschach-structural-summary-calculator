# [2026-07-03] v2.1.5 Bugfix

v2.1.5 is an AI release-readiness hardening release for the v2 Next.js app.

This release does not change the completed UI/UX surface. It adds a repeatable AI release gate so future releases can verify the assistant harness with one command locally and in GitHub Actions.

## Summary

- Added `npm run ai:release-gate`.
- Added a privacy-safe AI release gate runner with dry-run, JSON, and markdown report support.
- Added tests for the AI release gate runner.
- Added the release gate to `npm run ai:evaluate-contracts`.
- Wired GitHub Actions `security-check` to run the AI release gate before dependency/security checks.
- Added `docs/ai-evals/2026-07-03-v2.1.5-ai-release-gate-report.md`.
- Updated footer/package/version archive metadata to v2.1.5.

## Release Gate

The new gate runs:

1. `npm run ai:evaluate-contracts`
2. `npm run ai:evaluate-artifacts`
3. `npm run ai:evaluate-human-records -- --require-pass`
4. `npm run security:secrets`

It stops on the first required failure and exits non-zero, which makes it usable both locally and in CI.

## Verification

The private deployment repo passed:

- `npm run ai:release-gate`
- `npm run lint`
- `npm run build`
- `npm run security:check`
- `git diff --check`

`npm run security:check` passed at the current high-severity gate. It reported one moderate transitive `js-yaml` advisory under `gray-matter`, recorded as a non-blocking follow-up.

## Public Scope

The public source mirror includes the gate runner, tests, docs, and release metadata needed to understand the quality work.

The public archive does not include API keys, `.env*` files, Vercel local state, raw model outputs, raw prompts, raw chat messages, or private operational notes.
