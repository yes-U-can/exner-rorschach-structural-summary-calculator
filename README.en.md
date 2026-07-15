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

- Latest v2 release note: [`v2-nextjs/releases/v2.2.0`](./v2-nextjs/releases/v2.2.0/)
- v2 public source snapshot: [`v2-nextjs/source`](./v2-nextjs/source/)
- AI quality gate docs: [`v2-nextjs/source/docs/ai-evals/README.md`](./v2-nextjs/source/docs/ai-evals/README.md)
- AI human rubric: [`v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md`](./v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md)
- v2.2.0 calculation audit: [`v2-nextjs/source/docs/ops/2026-07-15-v2.2.0-calculation-audit.md`](./v2-nextjs/source/docs/ops/2026-07-15-v2.2.0-calculation-audit.md)
- v2.2.0 workspace validation: [`v2-nextjs/source/docs/ops/2026-07-14-v2.2.0-workspace-shell-validation.md`](./v2-nextjs/source/docs/ops/2026-07-14-v2.2.0-workspace-shell-validation.md)
- v2.2.0 Exner domain-boundary report: [`v2-nextjs/source/docs/ai-evals/2026-07-15-v2.2.0-exner-domain-boundary-report.md`](./v2-nextjs/source/docs/ai-evals/2026-07-15-v2.2.0-exner-domain-boundary-report.md)
- v1 GAS archive: [`v1-gas/releases`](./v1-gas/releases/)

## v2.1.x AI Quality Sequence

The AI-related v2.1.x patches were not repeated claims that the same work was finished. User testing and independent audits exposed new, bounded scopes in sequence:

- **v2.1.2-v2.1.6:** OpenAI-only harness, prompts, streaming contracts, evals, and release-gate foundation
- **v2.1.7:** public README, CHANGELOG, release-evidence, and language-policy governance
- **v2.1.8:** five-locale corpus and OpenAI vector evidence calibration
- **v2.1.9:** independently audited hybrid retrieval, multilingual search, and OpenAI-only data boundaries
- **v2.1.10:** confirmed follow-up retrieval and migration-replay defect fixes

Earlier release notes that described the whole version line as closed now include dated retrospective scope notes. Their historical implementation and verification results remain unchanged.

## v2.2.0

v2.2.0 is the first desktop-focused v2.2.x release. It replaces the old header/footer layout with an overlay application sidebar, turns the interpretation assistant into a cardless AI workspace with an internal scroller and cancellable streaming, adds privacy-minimized structured feedback, and refines the scoring table, reference reader, legal pages, version archive, localization, and dark theme.

The release also audits the calculator against the author's 2019 Excel formulas, the v1 GAS lineage, the current TypeScript implementation, and published response-sequence cases. Seven boundary defects were corrected and locked with regression tests. GPT-5.5 remains fixed under the BYOK and HITL policy, with new Exner(CS) domain boundaries and Korean, Japanese, and English production-parity evaluations. Dedicated mobile refinement continues in later v2.2.x releases.

## v2.1.10

v2.1.10 closes four follow-up defects confirmed after the v2.1.9 independent audit, without changing the app UI/UX. It aligns lexical fallback items with their trace, preserves Rorschach codes attached to Japanese text, constrains broad interpretation queries to interpretation routes, and makes the full Prisma migration history replayable on a fresh pgvector/PostgreSQL database.

The review workflow records **Claude Fable 5** as the independent read-only auditor and **GPT-5.6 Sol / Codex** as the local reproduction, implementation, and measurement agent. All four candidates were independently reproduced before they were fixed. The saved public evidence contains aggregate retrieval and route metadata, but no API key, raw prompt, raw model answer, private assessment payload, or database credential.

## v2.1.9

v2.1.9 hardens the five-locale RAG retrieval path without changing the app UI/UX. It replaces direct lexical/vector score addition with weighted Reciprocal Rank Fusion, improves low-signal and multilingual token handling, minimizes coding-assistant embedding queries, adds a production-like `/api/chat` live eval, and makes legacy provider residue release-blocking. The production cleanup removed 6,597 legacy Google embedding rows while preserving all 6,632 current OpenAI rows.

The review workflow records **Claude Fable 5** as the independent audit and correction reviewer, and **GPT-5.6 Sol / Codex** as the local reproduction, implementation, and measurement agent. The report includes both accepted findings and corrected audit mistakes. These roles are engineering-process attribution, not clinical validation or vendor certification.

## Privacy Boundary

This public archive does not include production environment variables, API keys, Vercel local state, runtime logs, local caches, private work notes, raw AI prompts, raw model answers, or private assessment payloads.
