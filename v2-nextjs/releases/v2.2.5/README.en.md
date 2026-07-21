# [2026-07-19] v2.2.5 Bug-Fix Release

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Main changes

### Overview

This patch fixes a problem in the scoring table's **[Determinants]** dropdown, which allowed `M`, `FM`, and `m` to be selected without an active or passive quality.

These three symbols are needed in the Structural Summary as **total fields** for human, animal, and inanimate movement. An individual movement determinant, however, must be coded with one of three qualities: active `a`, passive `p`, or active-passive `a-p`.

For that reason, v2.2.5 removes `M`, `FM`, and `m` **only from the input options**. The `M`, `FM`, and `m` totals in the Structural Summary and calculations such as EB, MQual, and W:M remain unchanged.

Existing protocols that correctly use `Ma`, `Mp`, `Ma-p`, `FMa`, `FMp`, `FMa-p`, `ma`, `mp`, and `ma-p` are not affected and do not need to be recalculated.

If an earlier version was used to select `M`, `FM`, or `m` directly for an individual response, that response should be reviewed. When the application finds one of these values in older autosaved data, it preserves the original entry, stops the calculation, and identifies the row and code that require review. Active or passive quality cannot be assigned automatically because it must be determined from the response record and Inquiry.

### Why did this matter?

When a movement value without active or passive quality was entered, the total movement frequency, EB, MQual, and related fields could still appear to increase normally. The active-passive information was missing, however, so `a:p`, `Ma:Mp`, and the active-passive movement frequencies in the Interpersonal cluster could be lower than they should be.

The fourth CDI condition, in particular, checks whether `passive movement > active movement + 1`. Near the cutoff, omitting the active or passive quality from even one movement could change whether CDI was positive.

As a concrete illustration, a hypothetical record coded the responses "A person is resting" and "Another person is lying down asleep" as `Mp H`. With both movements coded `Mp`, passive movement is 2 and active movement is 0, so the fourth condition is met and the screen displays CDI as `4, Positive`.

If the second `Mp` had been entered in an earlier version as `M` without active or passive quality, the human-movement total would still appear as 2, but the passive count would be only 1. In the same boundary record, the fourth condition would no longer be met and CDI could instead appear as `3, NO`.

This illustration is a hypothetical record containing only two responses to demonstrate the calculation boundary; it is not a complete protocol suitable for clinical interpretation. A clinician determines the active or passive quality of movement after reviewing the response record and Inquiry.

### Where did the problem begin?

The early development materials were compared again.

- The input list in the 2019 Excel calculation file used during v1 development contained only movement codes with active or passive quality, while `M`, `FM`, and `m` were used as totals derived from those codes.
- The Perl implementation in RorScore likewise read movement codes with active or passive quality and then calculated the `M`, `FM`, and `m` totals separately from the active-passive frequencies.
- The v1.0.0 scoring dropdown combined codes entered for individual responses with total fields shown in the Structural Summary, and that state continued into v2.
- The MQual correction history in v1.0.2 shows that `M` without active or passive quality was treated like an individual response code alongside `Ma`, `Mp`, and `Ma-p`.

The surviving records do not establish the exact manual sequence by which the Excel input list and the Perl total fields were combined. Within what can be verified, the most accurate explanation is that **the distinction between codes entered for individual responses and totals displayed in the Structural Summary became blurred in the v1 implementation**.

Excel and Perl each distinguished individual movement codes from totals by movement type in their own context. The confirmed problem was not the calculation rule in either reference, but the application implementation that placed items with different roles in one input list. The development history and limits of the available evidence are documented in detail in the [movement-determinant input-boundary review](../../source/docs/ops/2026-07-18-v2.2.5-movement-input-boundary.md).

## Related corrections

- The five-language reference pages for `M`, `FM`, and `m` now state the difference between Structural Summary totals and codes entered for individual responses.
- Supporting explanations in the interface and the reference pages now follow the same rule.
- The Coding Assistant no longer presents `M`, `FM`, or `m` as complete codes for individual responses and instead asks for the `a`, `p`, or `a-p` information needed to complete the code.
- Corrupted characters were restored in 4 Japanese search questions and in a Korean document-maintenance record.
- After the reference pages were changed, the search data and OpenAI embeddings for all five languages were rebuilt.
- Document-generation rules and regression tests were strengthened so that `Input-code rule` and `Scoring/application condition` remain separate sections.
- The Interpretation Assistant now explains response count and data limitations before broader Structural Summary interpretations.

## Testing and verification

The first checks confirmed that input codes and result fields retained their different roles.

- The scoring dropdown now contains only the 29 complete determinant codes.
- `M`, `FM`, and `m` remain in Structural Summary results as totals by movement type.
- An older autosaved value without active or passive quality, the historical Excel-style `m'a`, or an unregistered custom code blocks calculation without changing the original value.
- Total movement frequency, Single determinants, and Blends continue to be counted as separate concepts in the Structural Summary.
- Regression tests lock in the CDI boundary behavior: two valid `Mp` entries meet the fourth condition, while only one does not.

The five-language reference pages and optional AI assistants were checked as well.

- All 365 reference-search questions retrieved the relevant document.
- All 5,604 OpenAI embeddings were rebuilt from the revised text, with 0 stale embeddings or body-hash mismatches.
- In hybrid retrieval using real OpenAI embeddings, top-document hit rate and relevant-set coverage were both 100% for broad and explicitly named questions. No broad question returned a document from another work area as its first result.
- In 62 live single-turn GPT-5.5 calls, every question about active-passive movement coding respected the intended boundary. In 1 unrelated long interpretation, the response count and data limitations were not explained first; the response order was corrected and the same condition then passed 3 consecutive checks.
- Movement-coding conversations passed in 9 multi-turn calls. A separate English check failed 1 time because the evaluator did not recognize an equivalent expression; after the accepted expression was corrected, the related question passed 2 consecutive checks.
- After the final five-language text and embeddings were aligned, one representative movement-boundary question was called in each language. All 5 calls in Korean, English, Japanese, Spanish, and Portuguese passed.
- After the section-heading generation rule was corrected, the same five-language questions were called again. All 5 passed without interruption or boundary violations.
- All 4 checks through the same API route used by the web application passed.
- Across the full automated suite, 447 checks in 81 test files passed and 7 were skipped because their execution conditions were unavailable. All 222 deployment pages were generated, and static analysis, the five-language copy audit, secret scanning, and production and development dependency audits also passed.

The live GPT-5.5 calls checked whether the Coding and Interpretation Assistants maintained the intended response boundaries for prepared questions. They do not guarantee the clinical accuracy of every possible question, and AI responses were not used as the answer key for Structural Summary calculations.

OpenAI Codex was used for implementation and repeated testing. Claude Opus 4.8 was used to review the documentation and calculation evidence before publication. Agreement between tools was not treated as proof; public professional references, the CS scope adopted by this application, reproducible calculation results, and human review were considered together.

## UI/UX, privacy, and database

- No new screen or input field was added.
- The three invalid options were removed from the [Determinants] dropdown.
- If an older autosave contains an invalid determinant, the existing alert identifies the row and code and calculation stops.
- No new personal information is collected.
- The existing rule that scoring data is not stored in the server database remains unchanged.
- The feedback database structure and request limits were not changed.

## Public scope and security boundary

The public source includes input-boundary checks, calculation regression tests, five-language reference pages, search-data snapshots, and GPT-5.5 test summaries without the original prompt or response text.

Original early-development files, paid or private literature, local paths, API keys, environment variables, full response text, and private review records are not published. Public documents link only to reproducible public distribution pages and official public repositories.

## Technical appendix

<details>
<summary><strong>Commands for developers to repeat the checks</strong></summary>

```bash
npm test
npm run lint
npm run build
npm run security:check
npm run docs:evaluate-rag:all
npm run docs:evaluate-hybrid:openai -- --enforce
npm run ai:evaluate-contracts
```

</details>
