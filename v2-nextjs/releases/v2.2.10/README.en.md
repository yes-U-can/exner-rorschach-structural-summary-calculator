# [2026-08-08] v2.2.10 bug-fix release

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Main changes

### Overview

This bug-fix release preserves all Structural Summary results while restoring the missing `GHR:PHR` display in the Lower Section and improving the PDF layout. We also organized all available material into 53 source families, reviewed their contents and relevant chapters, and separated direct Exner CS evidence, interpretation support, other Rorschach systems, historical material, and out-of-scope sources.

The full source audit found no new error that requires a change to the current Structural Summary results. Existing protocols entered according to the coding rules do not need to be recalculated.

Raw text from other systems was not mixed into the production RAG corpus. The assistants now distinguish Exner CS questions from R-PAS, Basic Rorschach, the French projective school, local systems, MMPI integration, diagnosis, treatment, legal judgment, and prompt-extraction attempts. No new screen, age field, or personal-data item was added.

### Details

#### GHR:PHR in the Lower Section

The app already classified each response as GHR or PHR and displayed both totals in the Upper Section. The `GHR:PHR` ratio found in the original Structural Summary form was nevertheless missing from the Interpersonal area on screen and in the PDF.

The `GHR:PHR` ratio now appears after `COP` and `AG`, and before `a:p`. The GHR/PHR decision sequence and totals have not changed, so existing calculation results remain the same.

#### PDF output

Ordinary Lower Section cards in the PDF contained a third empty column that did not hold a value. Cards that require a distinct structure, such as Core and Ideation, remain unchanged. Affect, Interpersonal, Self-Perception, Mediation, and Processing now use a two-column table for the label and value.

The S-CON, DEPI, CDI, HVI, and OBS cards now print the overall decision checkbox. Dividers separate the overall decision from its detailed criteria and the first three OBS combinations from the separate combined rule. The long HVI decision sentence uses a slightly smaller print size so that a single character is not pushed onto a new line.

These changes improve PDF readability and the completeness of the displayed Structural Summary. They do not change any formula or decision value.

## Which primary sources were checked?

The documents and printed pages used to verify the calculation rules are now part of the public record.

1. Exner, J. E., Jr. (2003). *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations and Principles of Interpretation* (4th ed.). John Wiley & Sons.
2. Exner, J. E., Jr. (2001). *A Rorschach Workbook for the Comprehensive System* (5th ed.). Rorschach Workshops.

The page numbers below are the pages printed in the books, not local PDF viewer numbers.

| Scope checked | Volume 1, 4th ed. | Workbook, 5th ed. | Result |
| --- | --- | --- | --- |
| Movement determinants and the M, FM, m families | pp. 91-95 | pp. 35-37 | Response input uses active/passive notation, while the Structural Summary reports family totals. |
| Multiple contents and the An/Xy boundary | pp. 126, 128 | pp. 55-56 | Duplicate content and the Na/Bt/Ls and An/Xy input rules were rechecked. |
| Level 1 and Level 2, CONTAM, and multiple Special Scores | pp. 135, 138-139, 145 | pp. 62-63, 69-70, 79-80 | Level-pair, CONTAM-exclusivity, and WSum6 boundaries were rechecked. |
| GHR/PHR assignment | pp. 143-144 | p. 77 | The seven-step decision sequence matches the current calculation. |
| Upper Section | pp. 148-150 | pp. 91-92 | Location, DQ, FQ, determinant, content, and Special Score totals were rechecked. |
| Lower Section | pp. 151-155 | pp. 93-99 | Current display and calculations from Core through Self-Perception were compared. |
| Six Special Indices | p. 156 | pp. 100-101 | PTI, DEPI, CDI, S-CON, HVI, and OBS criteria and boundaries were rechecked. |
| Age applicability and adjustments | p. 157 | pp. 100-101 | The existing boundary between automated calculation and clinician judgment remains in place. |

Volume 1, 4th edition, served as the primary source for the current Structural Summary format. The worksheets and examples in the 5th-edition Workbook were checked alongside it. Public RIAP 5 Structural Summary output and completed examples were used as operational corroboration. Rules from R-PAS or other Rorschach systems were not mixed into this calculation standard.

The detailed mapping is available in the [Structural Summary primary-source cross-check](../../source/docs/ops/2026-08-04-v2.2.10-calculation-source-crosscheck.md).

### PTI edition difference

Volume 1, fourth edition, p. 156 prints the high-R branch of PTI criterion 4 as `R > 16` and `WSum6 > 16`. The 5th-edition Workbook, p. 101, and operational RIAP 5 output use `R > 16` and `WSum6 > 17`.

The app retains `> 17`, following the later Workbook and operational output. Automated boundary cases fix the result as false at `R=17, WSum6=17` and true at `R=17, WSum6=18`. The difference between the editions is preserved in the verification record.

### S-CON and age

S-CON applies from age 15. The app does not collect examinee age and no age field was added. It displays whether the entered Structural Summary values meet the conditions; the clinician who knows the examinee's age and full clinical record decides whether the index is applicable.

## How were the 53 source families reviewed?

The 51 source PDFs and project-internal derivative material were grouped into 53 source families by title, edition, and content. The count refers to bibliographic families, not simply to physical files, and separates duplicate copies, translations, and derivatives.

| Class | Families | Product role |
| --- | --- | --- |
| Direct Exner CS sources | 7 | Direct calculation/coding evidence or edition comparison |
| Core interpretation sources | 2 | Cross-check of verified Exner interpretation principles |
| Specialist supplements | 8 | Context and limits for specialized topics |
| R-PAS and other-system boundaries | 10 | Difference checks that prevent system mixing |
| Historical and research context | 16 | Context that does not serve as calculation evidence |
| Project-internal derivatives | 3 | Error and implementation lineage, excluded as an oracle |
| Nonprofessional or out-of-scope material | 7 | Excluded after content review |

For every family, publication information was checked. Sources with a formal table of contents received a full contents review; sources without one received a complete heading-sequence review before the relevant chapters and pages were read. OCR supported search and navigation. Formulas, tables, checkboxes, superscripts, apostrophes, and ratios were checked again on the source page. 3 Chinese-language sources received additional targeted page review.

Excluded material was not dismissed by title alone. Its contents were reviewed before recording why it cannot support Exner CS calculation or interpretation. Excel, Perl, v1 GAS, and project-internal notes were used only to trace implementation lineage and were excluded as calculation authorities.

The public [full source audit and system-boundary record](../../methodology/reference-audit-v2.2.10/README.en.md) lists the 53 families, their roles, the Exner calculation evidence, and boundaries from other systems.

## Reference documents and AI assistants

The five-language Interpersonal references now include `GHR:PHR`. They explain that a predominance can describe one aspect of human representations, but that this ratio alone cannot establish overall interpersonal functioning.

The production RAG corpus retains only page-level verified Exner CS content. Raw R-PAS, Basic Rorschach, French kan/kob/clob, local Chinese, and historical-system text was not added to the vector space. Differences from those systems contribute only short boundary rules and evaluation questions.

The assistants decline R-PAS conversion or interpretation, mixed-system requests, MMPI integration, diagnosis, treatment, legal judgment, unrelated questions, attempts to obtain the system prompt, API key, or source text, and prompt injection disguised as examinee information. They then return the discussion to an Exner CS question. Separate cases check that ordinary Exner questions are not overblocked.

All 203 reference routes in each of five languages were rebuilt and 5604 OpenAI `text-embedding-3-large` vectors were checked. The stale-vector and text-hash-mismatch counts were both 0.

GPT-5.5 received the same GHR:PHR boundary question once in each supported language. All 5 checks completed, and every question used the Lower Section Interpersonal document as its first retrieved source. The measured API cost was USD 0.154025. API keys and raw answers were not stored in the public record.

## Are existing calculation results affected?

No. Existing protocols do not need to be recalculated.

- GHR and PHR assignment and totals were already calculated in earlier versions.
- This patch restores the missing Lower Section ratio and improves PDF presentation.
- The formulas, including PTI, remain unchanged after the primary-source cross-check.

To keep an older PDF in the new format, reopen the same protocol and generate the PDF again.

## Testing and verification

- All 53 source families received a final body-audit decision; the unaudited-family and unassigned-file counts were both 0.
- Automated search results were not treated as final evidence; 162 body sections and 386 distinct source pages were reassigned explicitly by source family.
- Upper Section, Lower Section, Special Indices, and input rules were divided into 31 evidence items that link printed pages to calculation functions, screen output, PDF output, and repeatable cases.
- A reverse check now requires every primary-source page named by those items to appear in the review ledger: 53 PDF pages from Workbook, 5th edition, and 62 PDF pages from Volume 1, 4th edition. This check corrected inaccurate printed-page citations for movement superscripts, duplicate determinants, and duplicate contents without changing any formula or result.
- Of the 31 items, 28 were directly verified, 1 records the PTI edition difference, 1 records unresolved evidence for repeating the same non-level Special Score, and 1 is explicitly out of scope. Uncertain items were not changed by inference.
- 3 public RIAP Structural Summary examples and a 5th-edition Workbook example were recalculated.
- 2000 fixed synthetic protocols were compared with a separately written calculation.
- Both sides of every criterion boundary in the six Special Indices were checked.
- The same input produced the same result in all five languages.
- System boundaries were recorded across 15 dimensions, with 110 single-turn and 10 multi-turn five-language assistant cases.
- 626 checks in 102 test files passed; 7 checks without the required execution conditions were skipped.
- Transitive dependencies were pinned to fixed `fast-uri`, `js-yaml`, and `nanoid` releases, and production, development, and secret scans all passed.
- `GHR:PHR` appears above `a:p` on screen and in the PDF.
- Overall Special Indices checkboxes, dividers, and HVI wrapping were checked in the PDF.
- TypeScript, five-language copy checks, static analysis, and generation of 222 deployment pages passed.
- All 203 reference routes in each language and 5604 vectors were checked; missing, stale, and text-hash mismatch counts were all 0.
- All 5 GPT-5.5 GHR:PHR boundary calls completed.

## Public scope and copyright boundary

The release note and public methodology identify all 53 source families by publication, edition, role, printed pages used as calculation evidence, summarized rules, and repeatable checks.

Individual source files, OCR text, local filenames, private working identifiers, and private titles of project-internal derivative material are not published. Source rules are summarized without reproducing extended passages. API keys, raw GPT-5.5 answers, and actual assessment material are also excluded from the public repository.

## Technical appendix

<details>
<summary><strong>Commands used to repeat the checks</strong></summary>

```bash
npm test
npm run lint
npx tsc --noEmit
npm run docs:assert-vector-runtime-ready
npm run build
```

</details>
