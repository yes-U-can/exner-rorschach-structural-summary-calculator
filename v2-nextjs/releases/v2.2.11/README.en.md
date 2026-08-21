# [2026-08-21] v2.2.11 Bug-fix Release

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## This release

v2.2.11 adjusts the calculation start rule so that a brief response record can be calculated when cards I–X have all been entered. The Spanish and Portuguese names for the Structural Summary are also standardized to their official forms. The service name Yes, U Can! remains unchanged, while the search description states the free-use information more clearly.

Existing formulas and calculated values have not changed. Existing protocols do not need to be recalculated.

## Calculation start rule

### When cards I–X have all been entered

- With R of 14 or more, calculation proceeds as before.
- With R of 10–13, calculation proceeds after displaying the existing warning below.

> **Validity Warning**\
> If the number of responses is less than 14, the profile validity may be low, reducing the reliability of interpretation.

### When a card has not been entered

If any card from I through X has no response, calculation does not proceed and the missing cards are identified. The other rules that block invalid input remain unchanged.

## Who is affected?

This affects people who want to calculate a record with all cards I–X entered but only R 10–13 for study or review. These records were previously stopped; they can now be calculated while retaining the validity warning.

A record with no response on any card from I through X cannot be calculated, regardless of the response count. Previously, a record with 14 or more responses was calculated even when a card was missing, so these records now need the missing cards entered before calculation.

## Do existing results need to be recalculated?

No. Because the formulas and calculated values have not changed, protocols that were already calculated do not need to be recalculated. A record that had all cards I–X but was previously stopped because R was 10–13 can now be calculated.

## Language and search information

The Spanish name is standardized as Sumario Estructural and the Portuguese name as Sumário Estrutural. This affects terminology shown in service information and AI guidance only; it does not affect calculations.

The service name Yes, U Can! has not changed. The Korean search description now states more clearly that the service is free and requires no registration, installation, or payment, and it includes related search terms. When and how this appears in search results depends on each search service's recrawling schedule.

## Privacy and clinical limitations

Privacy handling has not changed. Allowing numerical calculation for a record with fewer than 14 responses does not mean that the record has sufficient validity for ordinary clinical interpretation. Use it for study and review, and consider the possible reduction in interpretive reliability described by the warning. This service does not replace professional clinical judgment.
