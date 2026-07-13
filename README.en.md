# Exner Rorschach Structural Summary Calculator

Public source and release archive for a Structural Summary calculator for the Exner Comprehensive System, with an optional reference-grounded AI assistant.

This repository publishes curated release notes and source snapshots for the project. Version 1 was built with Google Apps Script, and version 2 is a Next.js web app.

## Documentation Language Policy

The archive uses a purpose-based language policy:

- Korean is the canonical language for release notes and CHANGELOG entries.
- This English overview exists so global GitHub visitors can quickly understand the repository.
- The deployed web app supports five user-facing languages: Korean, English, Japanese, Spanish, and Portuguese.
- Release notes are not duplicated into all five languages by default, because repeated manual translations can drift over time.
- Command names, file paths, API names, model IDs, and test names keep their original English identifiers.
- Technical evidence under `v2-nextjs/source/` may preserve its original artifact language.

The detailed public release documentation standard is kept at [`v2-nextjs/source/docs/ops/PUBLIC_RELEASE_DOCUMENTATION.md`](./v2-nextjs/source/docs/ops/PUBLIC_RELEASE_DOCUMENTATION.md).

## Current Archive

- Latest v2 release note: [`v2-nextjs/releases/v2.1.9`](./v2-nextjs/releases/v2.1.9/)
- v2 public source snapshot: [`v2-nextjs/source`](./v2-nextjs/source/)
- AI quality gate docs: [`v2-nextjs/source/docs/ai-evals/README.md`](./v2-nextjs/source/docs/ai-evals/README.md)
- AI human rubric: [`v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md`](./v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md)
- v2.1.9 RAG hardening report: [`v2-nextjs/source/docs/ai-evals/2026-07-13-v2.1.9-rag-retrieval-hardening-report.md`](./v2-nextjs/source/docs/ai-evals/2026-07-13-v2.1.9-rag-retrieval-hardening-report.md)
- v1 GAS archive: [`v1-gas/releases`](./v1-gas/releases/)

## v2.1.9

v2.1.9 hardens the five-locale RAG retrieval path without changing the app UI/UX. It replaces direct lexical/vector score addition with weighted Reciprocal Rank Fusion, improves low-signal and multilingual token handling, minimizes coding-assistant embedding queries, adds a production-like `/api/chat` live eval, and makes legacy provider residue release-blocking. The production cleanup removed 6,597 legacy Google embedding rows while preserving all 6,632 current OpenAI rows.

The review workflow records **Claude Fable 5** as the independent audit and correction reviewer, and **GPT-5.6 Sol / Codex** as the local reproduction, implementation, and measurement agent. The report includes both accepted findings and corrected audit mistakes. These roles are engineering-process attribution, not clinical validation or vendor certification.

## Privacy Boundary

This public archive does not include production environment variables, API keys, Vercel local state, runtime logs, local caches, private work notes, raw AI prompts, raw model answers, or private assessment payloads.
