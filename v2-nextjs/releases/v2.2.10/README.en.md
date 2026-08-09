# [2026-08-08] v2.2.10 bug-fix release

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## This release

v2.2.10 keeps the Structural Summary calculations unchanged, restores the missing `GHR:PHR` display on the result screen and in the PDF, and improves PDF readability.

Existing protocols entered according to the coding rules do not need to be recalculated.

## Changes

### GHR:PHR in the Lower Section

The app already classified GHR and PHR for each response and displayed their totals in the Upper Section. The `GHR:PHR` ratio from the Structural Summary form was missing from the Lower Section Interpersonal area.

The screen and PDF now show `GHR:PHR` after `COP` and `AG`, and before `a:p`. The GHR/PHR decision sequence and totals are unchanged.

### PDF output

- Standard Lower Section cards now use a simpler two-column label-and-value table.
- S-CON, DEPI, CDI, HVI, and OBS now print an overall-result checkbox and clearer criterion dividers.
- The print size of the HVI result text was adjusted to avoid an awkward one-character line wrap.

These changes improve presentation and printing only. They do not change formulas or decisions.

## Calculation sources

The two primary calculation sources are:

1. Exner, J. E., Jr. (2003). *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations and Principles of Interpretation* (4th ed.). John Wiley & Sons.
2. Exner, J. E., Jr. (2001). *A Rorschach Workbook for the Comprehensive System* (5th ed.). Rorschach Workshops.

Page numbers in the table refer to the pages printed in each publication.

| Area | Volume 1, 4th ed. | Workbook, 5th ed. | Scope in the app |
| --- | --- | --- | --- |
| Movement determinants and M, FM, m families | pp. 91-95 | pp. 35-37 | Active/passive qualifiers are entered while family totals appear in the Structural Summary. |
| Multiple content codes and the An/Xy boundary | pp. 126, 128 | pp. 55-56 | Duplicate-content rules and the Na/Bt/Ls and An/Xy entry boundaries are in scope. |
| Level 1 and 2, CONTAM, and multiple Special Scores | pp. 135, 138-139, 145 | pp. 62-63, 69-70, 79-80 | Level pairs, CONTAM exclusivity, and WSum6 boundaries are in scope. |
| GHR/PHR decisions | pp. 143-144 | p. 77 | The current calculation follows the seven-step decision sequence. |
| Upper Section | pp. 148-150 | pp. 91-92 | The Structural Summary includes Location, DQ, FQ, determinant, content, and Special Score totals. |
| Lower Section | pp. 151-155 | pp. 93-99 | Calculations and displays cover Core through Self-Perception. |
| Six Special Indices | p. 156 | pp. 100-101 | The scope includes PTI, DEPI, CDI, S-CON, HVI, and OBS criteria and boundaries. |
| Age applicability and adjustments | p. 157 | pp. 100-101 | The clinician continues to decide age-related applicability. |

### PTI edition difference

Volume 1, 4th edition, p. 156 prints the high-R branch of PTI's fourth criterion as `R > 16` with `WSum6 > 16`. Workbook, 5th edition, p. 101 and RIAP 5 output use `R > 16` with `WSum6 > 17`.

The app retains `> 17`, following the later Workbook and that output.

### S-CON and age

S-CON applies from age 15. The app does not collect the examinee's age. It displays whether the entered Structural Summary values meet the criteria; the clinician, with the examinee's age and full clinical information, decides whether S-CON applies.

## References and AI assistant

The five-language Interpersonal references now explain `GHR:PHR`. They also state that a predominance may describe one aspect of human representations, but the ratio alone cannot establish overall interpersonal functioning.

The AI assistant is limited to the Exner Comprehensive System. It does not mix rules from R-PAS or other Rorschach systems into Exner calculations, and it explains the boundary when asked for diagnosis, treatment, legal judgment, or another task outside the calculator's scope.

## Effect on existing results

Existing protocols do not need to be recalculated. To keep an older protocol in the new PDF format, reopen it and generate the PDF again.

## Sources and copyright

The public documents provide publication details and the printed pages used for calculation. They do not reproduce extended copyrighted passages or actual assessment material.
