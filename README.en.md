# Exner Rorschach Structural Summary Calculator

Public source and release archive for a Structural Summary calculator for the Exner Comprehensive System, with an optional reference-grounded AI assistant.

This repository publishes curated release notes and source snapshots for the project. Version 1 was built with Google Apps Script, and version 2 is a Next.js web app.

MOW plans, builds, deploys, operates, and maintains the web app. The Seoul Institute of Clinical Psychology (SICP) reviews the initial transfer of calculation logic, compares calculated results, and provides clinical review from real-use experience.

## Who These Documents Are For

The human-readable documents in this archive are written first for clinical psychologists, including readers who do not write software. A calculation change should explain the affected condition, whether an existing result needs to be recalculated, and the evidence used to verify the correction before presenting engineering details.

- Korean is the official language for release notes and CHANGELOG entries.
- This English overview exists so global GitHub visitors can quickly understand the repository.
- The deployed web app supports five user-facing languages: Korean, English, Japanese, Spanish, and Portuguese.
- Release notes are not duplicated into all five languages by default, because separately maintained translations can diverge over time.
- Command names, file paths, API names, and model IDs retain their exact identifiers, with a plain-language explanation when first introduced.
- Developer evidence under `v2-nextjs/source/` may retain exact commands and identifiers, but its human-readable introduction should still explain the purpose in ordinary language.

The detailed public release documentation standard is kept at [`v2-nextjs/source/docs/ops/PUBLIC_RELEASE_DOCUMENTATION.md`](./v2-nextjs/source/docs/ops/PUBLIC_RELEASE_DOCUMENTATION.md).

## Current Archive

- Latest v2 release note: [`v2-nextjs/releases/v2.2.5`](./v2-nextjs/releases/v2.2.5/)
- v2 public source snapshot: [`v2-nextjs/source`](./v2-nextjs/source/)
- AI answer-quality checks: [`v2-nextjs/source/docs/ai-evals/README.md`](./v2-nextjs/source/docs/ai-evals/README.md)
- Human review criteria for AI answers: [`v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md`](./v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md)
- v2.2.2 calculation verification: [`v2-nextjs/source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md`](./v2-nextjs/source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md)
- v2.2.2 Cn explanations and real GPT-5.5 checks in five languages: [`v2-nextjs/source/docs/ai-evals/2026-07-17-v2.2.2-live-eval-report.md`](./v2-nextjs/source/docs/ai-evals/2026-07-17-v2.2.2-live-eval-report.md)
- v2.2.0 workspace validation: [`v2-nextjs/source/docs/ops/2026-07-14-v2.2.0-workspace-shell-validation.md`](./v2-nextjs/source/docs/ops/2026-07-14-v2.2.0-workspace-shell-validation.md)
- v2.2.0 Exner domain-boundary report: [`v2-nextjs/source/docs/ai-evals/2026-07-15-v2.2.0-exner-domain-boundary-report.md`](./v2-nextjs/source/docs/ai-evals/2026-07-15-v2.2.0-exner-domain-boundary-report.md)
- v1 GAS archive: [`v1-gas/releases`](./v1-gas/releases/)

## v2.1.x AI Quality Sequence

The v2.1.x patches improved the optional AI assistants in stages: completing answers, retaining conversation context, finding the correct reference material, respecting clinical limits, and avoiding storage of private conversation content.

- **v2.1.2-v2.1.6:** organized answer length, interruption detection, conversation context, clinical limits, and repeatable quality checks.
- **v2.1.7:** established consistent rules for public README files, change records, and release notes.
- **v2.1.8:** reviewed the five-language reference library and refreshed the search index used by the AI assistants.
- **v2.1.9:** improved retrieval for short Rorschach codes and multilingual questions.
- **v2.1.10:** corrected remaining Japanese-code recognition, broad-interpretation routing, and clean-database setup problems.

Each release note states what that version completed and points to the later release that addressed any remaining issue.

## v2.2.5

v2.2.5 separates response-level movement input codes from the `M`, `FM`, and `m` family totals shown in the Structural Summary. The scoring table now accepts only complete movement codes such as `Ma`, `Mp`, and `Ma-p`; the family totals and calculations that depend on them remain unchanged.

Existing protocols that already use complete movement codes do not need to be recalculated. If an older browser autosave contains a bare family label, the app preserves the original record, blocks calculation, and identifies the row and code that need clinical review. The release rebuilds all 5,604 OpenAI embeddings and rechecks 365 retrieval queries plus representative GPT-5.5 boundary questions in all five supported languages. The [Korean canonical release note](./v2-nextjs/releases/v2.2.5/) explains the affected conditions and the minimal CDI boundary example.

## v2.2.4

v2.2.4 does not change Structural Summary formulas or scoring-table input behavior, so existing results do not need to be recalculated. It aligns the human-readable reference library and the optional AI assistants' retrieval corpus across Korean, English, Japanese, Spanish, and Brazilian Portuguese using target-language professional and scholarly sources rather than literal translation.

The release rebuilds 1,015 reference documents and 5,589 current vector-search chunks, with zero missing, stale, or content-hash-mismatched vectors. It also strengthens the assistants' exact Exner CS scope, prompt-injection refusal, and per-session request limits. The final GPT-5.5 checks passed 66 of 66 single-turn and multi-turn coding and interpretation scenarios across all five languages. The [Korean canonical release note](./v2-nextjs/releases/v2.2.4/) contains the detailed evidence and limitations.

A follow-up restores the start-choice dialog whenever the scoring workspace is entered, gives code-styled key phrases a higher-contrast red treatment in both light and dark themes, and keeps the coding assistant's jump-to-latest button immediately above its composer instead of in the middle of a long response.

## v2.2.3

v2.2.3 does not change Structural Summary formulas or the visible interface layout, so existing results do not need to be recalculated. It rewrites the public documentation with clinical psychologists as the primary readers, adds consistent five-language search and link-preview metadata, and limits excessive writes to the optional AI response-feedback database.

The home-page search and sharing title is `Yes, U Can!` in every supported language. Each localized description explains that the open-source Exner Rorschach Comprehensive System Structural Summary calculator requires no registration, installation, or payment and does not replace professional clinical judgment. Feedback still stores no question text, answer text, API key, assessment payload, IP address, or user-agent string. The application now limits body size and per-session write frequency; an outer Vercel Firewall rule remains a deployment requirement for stronger protection against repeated session creation.

## v2.2.0

v2.2.0 is the first desktop-focused v2.2.x release. It gathers the main navigation in a sidebar, gives long interpretation conversations their own scrollable reading area, lets users stop an answer in progress, and adds response feedback that does not store the question or answer text. It also improves the scoring table, reference reader, legal pages, version archive, five-language interface, and dark theme.

The release also compared the calculator with a publicly distributed 2019 Excel workbook, the v1 GAS implementation, the current v2 code, and published examples. Use the v2.2.0 note for its UI/UX record and the v2.2.2 verification report for the current calculation findings. GPT-5.5 remains fixed under the bring-your-own-key (BYOK) and human-review policy, and its Exner(CS) topic boundary was checked with real Korean, Japanese, and English API calls. Dedicated mobile refinement continues in later v2.2.x releases.

## v2.2.1

v2.2.1 is a calculation-accuracy hotfix that does not add an age field or change the interface. Its scope is limited to the **Upper Section, Lower Section, and Special Indices** displayed by the app. It corrects extreme D/AdjD values, the EBPer display conditions, the ordered GHR/PHR rules, undefined WDA%/Afr denominators, and the Cn-inclusive `FC:CF+C` display value.

The release documents how the 2019 Excel workbook informed the early v1 implementation without redistributing the workbook or guessing the author's identity. Verification included 25 calculations with the same codes and different-language notes, 2,000 repeatable synthetic protocols, and real GPT-5.5 coding and interpretation calls.

## v2.2.2

v2.2.2 checks where Cn is included and excluded within the exact **Upper Section, Lower Section, and Special Indices** rendered by this application. The conventional display label `FC:CF+C` uses `FC:(CF+C+Cn)`, while this application's WSumC, S-CON criterion 7, and Color-Shading calculations exclude Cn. **Completed v2.2.1 protocols do not need to be recalculated for this reason because their displayed Cn value was already correct.** The update also prevents an unfinished row with blank Form Quality (FQ) from receiving a temporary GHR or PHR classification.

The 2019 Excel workbook, RorScore, v1 GAS, the current v2 code, CHESSSS, RAP3, and RIAP5 each reveal different parts of the calculation history, so no single program was treated as the sole authority. The release passed 376 calculation and feature checks, 101 AI-answer checks, and 222 deployment-page checks. It also passed 10 direct Cn questions and 5 representative questions using real GPT-5.5 calls across the five supported languages. The only interface change is a fully opaque sidebar; dedicated mobile refinement remains later v2.2.x work.

## v2.1.10

v2.1.10 corrects four problems that remained after v2.1.9, without changing the app UI/UX. It keeps fallback search results consistent with the displayed evidence, preserves Rorschach codes attached to Japanese text, sends broad interpretation questions to the proper reference material, and restores every setup step needed to create a fresh database.

The four reported problems were reproduced in the application before they were corrected. Public evidence contains only summary information about search and request handling; it contains no API key, full prompt, full model answer, private assessment material, or database credential.

## v2.1.9

v2.1.9 improves how the AI assistants search the five-language reference library, without changing the app UI/UX. It combines exact-word and meaning-based search results more reliably, handles short Rorschach codes and multilingual questions more carefully, and reduces unnecessary search queries. Release validation now fails if data from a discontinued AI provider remains. The cleanup removed 6,597 old Google-generated search records while preserving all 6,632 current OpenAI-generated records.

Validation used recorded search results and aggregate metadata. It does not represent clinical validation or vendor certification.

## Privacy Boundary

This public archive does not include production environment variables, API keys, Vercel local state, runtime logs, local caches, private work notes, raw AI prompts, raw model answers, or private assessment payloads.
