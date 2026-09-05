# [2026-09-05] v2.2.13 Bug-fix Release

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Main changes

### Overview

v2.2.13 fixes a problem that allowed rows with missing required codes or incompatible determinants and Form Quality (FQ) to be included in calculations. Calculation now stops when these inputs are present, and the rows requiring review are identified.

The Structural Summary formulas and Special Index thresholds have not changed. Existing records completed in accordance with the coding rules do not need to be recalculated. However, records containing the omissions or inconsistencies described below require review against the original material, correction, and recalculation.

### Details

#### Rows with missing required codes

Once coding has begun for a response, its row needs Location, Developmental Quality (DQ), Determinants, and Contents. Previously, calculation could proceed with some of these fields left blank. The app now identifies rows with missing entries and stops calculation until they are completed. Response notes have not become a required field.

If an incomplete row is counted as an actual response, the response count (R) and ratios that use it can change. Missing Location or Determinants can also affect values such as WDA% or Lambda that depend on those codes. Unused blank rows are not included in the response count.

**When no response was actually given to card VI**

If no response was actually given to card VI, the row must not be treated as a completed response by entering `none` or other codes without a basis in the response record. The FQ selection `none` represents an actual response in which form was not used; it is not a code for the absence of a response.

Deleting the row does not change the fact that no response was given to card VI. The existing requirement for at least one response to each of cards I–X before calculation remains in place. Review the original material to distinguish a response that was given but not entered from a card that received no response during administration.

#### Rows with incompatible determinants and FQ

When form is used in a response, the appropriate FQ must be recorded. For example, changing the pure color determinant `C` to the form-color determinant `FC` could leave the previously assigned FQ `none` in place.

Changing to a determinant that uses form now clears a remaining `none`, leaving FQ blank. Review the response record and Inquiry, then select the FQ appropriate to the original response before calculating. The app does not infer a value such as `o`, `u`, or `-` on the scorer's behalf.

If incompatible determinants and FQ remain in an existing saved record, the app also identifies the rows requiring review and stops calculation. Such inconsistencies can affect Form Quality counts, some PTI conditions, and the GHR/PHR classification of the affected response.

Valid formless responses can still be entered. FQ `none` remains available for responses consisting only of formless determinants and for formless human movement responses recognized by the manual. This change does not prohibit `none` across all responses.

## Do existing results need to be recalculated?

- Records with all required codes and compatible determinants and FQ do not need to be recalculated.
- Records with missing required codes or incompatible determinants and FQ should be checked against the response record and Inquiry, corrected, and recalculated.
- A card that received no actual response must not be resolved by inventing codes or deleting a row. Review the original material and apply the existing requirement for responses to cards I–X.

This problem does not establish that all previous calculation results were incorrect. First check whether the record contained any of the affected input conditions.

## Sources and clinical limitations

The relationship between form use and FQ follows Exner's Comprehensive System manuals. FQ is assigned when form is used, while actual formless responses and formless human movement are considered separately. The use of code frequencies in Structural Summary calculations and the GHR/PHR classification sequence were also checked.

- Exner, J. E., Jr. (2003). *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations and Principles of Interpretation* (4th ed.). Wiley. Printed page 120 covers form use and FQ; pages 143–144 cover GHR/PHR classification; page 151 covers R and Lambda; page 154 covers Form Quality ratios; and page 156 provides the PTI conditions.
- Exner, J. E., Jr. (2001). *A Rorschach Workbook for the Comprehensive System* (5th ed.). Rorschach Workshops. The Structural Summary procedures and worked examples on printed pages 91–101 were consulted.

Checks confirmed that missing or incompatible entries are blocked and valid formless responses remain allowed. The completed Structural Summary examples in the manuals continue to produce the same results. However, passing input checks does not establish the clinical accuracy of the coding for an individual response. Final coding and interpretation require professional judgment based on the original response, Inquiry, and the full clinical material.

Personal data handling, screen layout, and input fields have not changed. Security updates to the software components used by the app are also included. This service does not replace professional clinical judgment.

## AI used in development and review

OpenAI GPT-6 Astra was used for development and verification of this release, and Anthropic Fable 5.1 for independent review. The model and behavior of the AI assistant provided in the web app remain unchanged.
