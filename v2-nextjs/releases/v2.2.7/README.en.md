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

- The five-language reference documents for location `S`, movement determinants, and Form Quality explain the input rules above.
- The Coding Assistant does not present a standalone `S`, duplicates within a movement family, or blank Form Quality as complete codes.

## Clinical basis

- Official RIAP v5 sample reports show white space combined with a basic location, as in `WS` and `DdS`.
- The same samples tally `none` as a formal Form Quality category and state that S-CON applies to subjects over 14.
- The active-passive rules for movement determinants and the conditions for applying `a-p` follow public clinical literature covering the Exner source material.
- Reporting Lambda as the pure F count is a software reporting convention used in multiple public sources.

These materials explain the input rules. Clinicians remain responsible for coding individual responses and deciding whether an index applies in practice.

## Interface, privacy, and calculation scope

- No new screen or input field was added.
- The standalone `S` was removed from the [Location] options, and duplicate selection within a movement family is indicated with disabled options.
- Calculation results for existing protocols entered by the rules are unchanged.
- No new personal information is collected.
- Autosaved scoring data remains on the user's device. An API key is used in encrypted form for an AI connection for up to 24 hours and is deleted when the connection ends.
