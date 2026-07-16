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

- Latest v2 release note: [`v2-nextjs/releases/v2.2.2`](./v2-nextjs/releases/v2.2.2/)
- v2 public source snapshot: [`v2-nextjs/source`](./v2-nextjs/source/)
- AI quality gate docs: [`v2-nextjs/source/docs/ai-evals/README.md`](./v2-nextjs/source/docs/ai-evals/README.md)
- AI human rubric: [`v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md`](./v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md)
- v2.2.2 calculation re-audit: [`v2-nextjs/source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md`](./v2-nextjs/source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md)
- v2.2.2 Cn and five-locale live eval: [`v2-nextjs/source/docs/ai-evals/2026-07-17-v2.2.2-live-eval-report.md`](./v2-nextjs/source/docs/ai-evals/2026-07-17-v2.2.2-live-eval-report.md)
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

The release also audits the calculator against a publicly distributed 2019 Excel workbook, the v1 GAS lineage, the current TypeScript implementation, and published response-sequence cases. Seven boundary defects were corrected and locked with regression tests. GPT-5.5 remains fixed under the BYOK and HITL policy, with new Exner(CS) domain boundaries and Korean, Japanese, and English production-parity evaluations. Dedicated mobile refinement continues in later v2.2.x releases.

The calculation audit was corrected in stages by v2.2.1 and v2.2.2. The v2.2.0 note remains the historical UI/UX record, while the v2.2.2 re-audit is the current source for calculation findings.

## v2.2.1

v2.2.1 is a calculation-accuracy hotfix with no age field. Its audit scope is limited to the **Upper Section, Lower Section, and Special Indices** displayed by the app. It fixes the D/AdjD cap, EBPer gates, ordered GHR/PHR classification, undefined WDA%/Afr denominators, and the Cn-inclusive `FC:CF+C` display value. The deployed runtime and the public v2.2.1 release note consistently recorded that Cn-inclusive calculation from the start.

The release openly documents the Excel lineage and acquisition path without redistributing the workbook or guessing the author's identity. Verification includes 25 five-locale calculation-invariance runs, 2,000 deterministic synthetic protocols, real GPT-5.5 coding and interpretation calls, and a refreshed 6,632-chunk OpenAI vector runtime.

## v2.2.2

v2.2.2 independently re-audits the exact **Upper Section, Lower Section, and Special Indices** rendered by this application. It confirms that the conventional display label `FC:CF+C` uses `FC:(CF+C+Cn)`, while this application's adopted WSumC, S-CON criterion 7, and Color-Shading calculations exclude Cn. The deployed v2.2.1 runtime and public release note were already correct, so this release preserves that output and strengthens the variable boundaries, regression tests, five-locale corpus, vector snapshot, retrieval evidence, and GPT-5.5 eval contracts.

The release separates the roles of the publicly distributed 2019 Excel workbook, RorScore's canonical Perl source, v1 GAS, v2 TypeScript, CHESSSS, RAP3, and RIAP5 instead of treating any one implementation as the sole authority. Validation records 376 passing unit/integration tests, 101 AI contract tests, a 222/222 production build, 6,629/6,629 ready OpenAI vectors, a 10/10 post-audit direct five-locale Cn-boundary eval, a 3/3 interpretation guardrail v7 smoke eval, and a 5/5 representative five-locale live eval. The only approved UI change is making the sidebar fully opaque; dedicated mobile refinement remains follow-up v2.2.x work.

## v2.1.10

v2.1.10 closes four follow-up defects confirmed after the v2.1.9 independent audit, without changing the app UI/UX. It aligns lexical fallback items with their trace, preserves Rorschach codes attached to Japanese text, constrains broad interpretation queries to interpretation routes, and makes the full Prisma migration history replayable on a fresh pgvector/PostgreSQL database.

The review workflow records **Claude Fable 5** as the independent read-only auditor and **GPT-5.6 Sol / Codex** as the local reproduction, implementation, and measurement agent. All four candidates were independently reproduced before they were fixed. The saved public evidence contains aggregate retrieval and route metadata, but no API key, raw prompt, raw model answer, private assessment payload, or database credential.

## v2.1.9

v2.1.9 hardens the five-locale RAG retrieval path without changing the app UI/UX. It replaces direct lexical/vector score addition with weighted Reciprocal Rank Fusion, improves low-signal and multilingual token handling, minimizes coding-assistant embedding queries, adds a production-like `/api/chat` live eval, and makes legacy provider residue release-blocking. The production cleanup removed 6,597 legacy Google embedding rows while preserving all 6,632 current OpenAI rows.

The review workflow records **Claude Fable 5** as the independent audit and correction reviewer, and **GPT-5.6 Sol / Codex** as the local reproduction, implementation, and measurement agent. The report includes both accepted findings and corrected audit mistakes. These roles are engineering-process attribution, not clinical validation or vendor certification.

## Privacy Boundary

This public archive does not include production environment variables, API keys, Vercel local state, runtime logs, local caches, private work notes, raw AI prompts, raw model answers, or private assessment payloads.
