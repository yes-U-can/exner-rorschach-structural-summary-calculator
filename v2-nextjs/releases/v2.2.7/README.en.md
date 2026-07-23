# [2026-07-23] v2.2.7 Bug-Fix Release

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Main changes

### Overview

This patch fixes a problem in which three kinds of incomplete scoring-table input could pass directly into calculation.

- In **[Location]**, a white-space response could be selected as a standalone `S`. The location options now offer only `W`, `WS`, `D`, `DS`, `Dd`, and `DdS`.
- In **[Determinants]**, more than one code from the same movement family could be entered for a single response (for example, `Ma` and `Mp`). Once a code from a family is selected, the other codes in the same family can no longer be chosen. Entering the identical determinant itself twice in two slots is also blocked (for example, `FC` twice).
- **[FQ]** could be left blank at calculation time. One of `+`, `o`, `u`, `-`, or `none` must now be selected before calculation can run.

In records where every response is pure form (`F`), Lambda is now reported as the number of pure F responses instead of the infinity symbol (`∞`).

Existing protocols in which location, movement determinants, and Form Quality were entered by the rules are not affected by this problem and do not need to be recalculated. If an older autosave still contains a standalone `S`, duplicate codes from the same movement family, or blank Form Quality, the app preserves the original entry, stops the calculation, and identifies the rows that need review with guidance in all five languages.

### Why did this matter?

**Standalone `S`.** In the Exner Comprehensive System, white-space use is a notation attached to a basic location, not an independent location, and responses are always recorded as `WS`, `DS`, or `DdS`. In earlier versions, entering the location as `S` alone counted toward the white-space frequency but toward none of the basic locations `W`, `D`, or `Dd`, so values that use the basic locations, such as `W:D:Dd` and `WDA%`, could be calculated lower than they actually are.

**Duplicates within a movement family.** The movement determinant of an individual response is coded in each family with one of active `a`, passive `p`, or active-passive `a-p`. When two different objects each show active and passive movement, instead of entering `Ma` and `Mp` separately, a single `Ma-p` is recorded. In earlier versions, entering `Ma` and `Mp` in separate slots counted the human movement frequency twice, so the left side of EB, EA, `a:p`, `Ma:Mp`, and related values could be calculated higher than they actually are. A code does not automatically become `a-p` merely because one object showed both qualities of movement; which movement determines the coding is confirmed from the response record and the Inquiry. When the identical determinant itself was entered twice in two slots, the value could likewise be counted twice, so recording the same determinant only once per response is now enforced as well.

**Blank Form Quality.** `none` is a formal Form Quality category for responses that are not scored on the basis of form, while a blank field is an entry whose scoring is not yet finished. In earlier versions, a response with blank Form Quality was counted in the total number of responses but in none of the Form Quality totals, so values such as `XA%`, `X+%`, and `WDA%` could be calculated lower than they actually are. When form is not the basis for scoring a response, `none` is now selected explicitly.

**Lambda when every response is pure F.** Lambda is `pure F ÷ (total responses − pure F)`, so when every response is pure F the denominator becomes 0. The screen reports the number of pure F responses instead of the infinity symbol. For example, if all 17 responses are pure F, the display shows `17.00`. This boundary case is practically absent in standard administration; the notation is a software reporting convention adopted so that the infinity symbol is never used as a clinically reported value.

### Related corrections

- The five-language reference documents for location `S`, movement determinants, and Form Quality now state the input rules above in identical terms.
- A rule list was introduced that automatically checks whether the five language versions state the same clinical rules. If a document is corrected in one language and missed in another, the check now fails at the document-generation step.
- The Coding Assistant's response rules were strengthened so that it does not present a standalone `S`, duplicates within a movement family, or blank Form Quality as complete codes.
- After the reference documents were changed, the search data and OpenAI embeddings for all five languages were rebuilt.
- Typos and terminology in the Spanish and Portuguese documents were cleaned up, along with English headings that remained in four places in the Japanese documents.
- A status marker that was never actually used was removed from the reference-document drafts, and a validity check was added for the allowed document-status values.

## Testing and verification

The calculation rules were verified against public materials.

- In the scoring sequences of the official RIAP v5 sample reports, white space was confirmed to always appear combined with a basic location, as in `WS` and `DdS`.
- The same samples confirmed that `none` is tallied as a formal category in the Form Quality table, and that S-CON is explicitly stated to apply to subjects over 14.
- The active-passive rules for movement determinants and the conditions for applying `a-p` were confirmed with public clinical literature that reproduces the Exner source material.
- The Structural Summary values of a published 20-response case were confirmed to be identical before and after this patch.

Input blocking and the five-language guidance were also checked on the actual screens.

- A standalone `S` does not appear among the location options.
- Once a code from a movement family is selected, the other codes in the same family are shown as unavailable.
- For every determinant, a code that is already selected is shown as unavailable in the other slots.
- When Form Quality is blank, calculation stops and the rows that need review are identified. The guidance text was checked on screen in each of the five languages.
- A standalone `S`, duplicate movement codes, or blank Form Quality remaining in older autosaves is announced the same way without changing the original data.

The five-language search data and AI assistants were also checked.

- All 380 reference-search questions retrieved the relevant document.
- All 5,604 OpenAI embeddings were rebuilt from the revised text, with 0 body-hash mismatches or stale embeddings.
- In hybrid retrieval using real embeddings, top-document hit rates were 100% for both broad and explicitly named questions.
- Representative questions about a standalone `S`, duplicate movement codes, and blank Form Quality were called live in all five languages; none of the 15 calls produced an answer that violated the rules.
- In the full automated suite, 83 test files passed all 476 checks; 7 checks were skipped because their run conditions were unavailable. The production build, static code checks, five-language copy audit, and secret scanning also passed.

Reporting Lambda as the pure F count is a software reporting convention on which several public sources agree, but a source-text page that states it explicitly has not yet been obtained. What was verified and what remains open are recorded as-is in the verification documents.

OpenAI Codex was used for implementation and repeated testing, and Claude Fable 5 was used to review the documentation and calculation evidence before publication. Agreement between tools was not treated as proof; public professional references and reproducible calculation results were the standard.

## UI/UX, privacy, and calculation scope

- No new screen or input field was added.
- The standalone `S` was removed from the [Location] options, and duplicate selection within a movement family is indicated with disabled options.
- Calculation results for existing protocols entered by the rules are unchanged.
- No new personal information is collected.
- The existing rule that scoring data and API keys are not stored in the server database remains unchanged.

## Public scope and security boundary

The public source includes the input-boundary checks, calculation regression tests, the five-language reference documents with the rule-equivalence check list, and search-data snapshots.

Environment variables, API keys, original AI question and answer text, private review records, and local paths are not published.

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
