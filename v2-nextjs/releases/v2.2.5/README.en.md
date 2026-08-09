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

As a concrete illustration, a hypothetical record coded the responses "A person is resting" and "Another person is lying down asleep" as `Mp H`. With both movements coded as passive, passive movement is 2 and active movement is 0, so the fourth condition is met and the screen displays CDI as `4, Positive`.

If the second `Mp` had been entered in an earlier version as `M` without active or passive quality, the human-movement total would still appear as 2, but the passive count would be only 1. In the same boundary record, the fourth condition would no longer be met and CDI could instead appear as `3, NO`.

This illustration is a hypothetical record containing only two responses to demonstrate the calculation boundary; it is not a complete protocol suitable for clinical interpretation. A clinician determines the active or passive quality of movement after reviewing the response record and Inquiry.

## Related corrections

- The five-language reference pages for `M`, `FM`, and `m` now state the difference between Structural Summary totals and codes entered for individual responses.
- Supporting explanations in the interface and the reference pages describe the same input rule.
- The Coding Assistant does not present `M`, `FM`, or `m` as complete codes for individual responses and instead asks for the `a`, `p`, or `a-p` information needed to complete the code.
- The Interpretation Assistant explains response count and data limitations before broader Structural Summary interpretations.

The AI assistants do not guarantee the accuracy of answers to every clinical question, and their answers are not an answer key for Structural Summary calculations.

## Interface and privacy

- No new screen or input field was added.
- The three invalid options were removed from the [Determinants] dropdown.
- If an older autosave contains an invalid determinant, the existing alert identifies the row and code and calculation stops.
- No new personal information is collected.
- Autosaved scoring data remains on the user's device.
