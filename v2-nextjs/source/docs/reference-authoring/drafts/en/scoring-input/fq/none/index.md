---
canonicalRoute: "scoring-input/fq/none"
locale: "en"
docKind: "coding-entry"
canonicalTitle: "scoring-input/fq/none"
displayTitle: "[Coding/Form Quality] none"
aliases:
  - "FQnone"
  - "no form quality code"
  - "no FQ"
relatedRoutes:
  - "scoring-input/fq"
  - "scoring-input/determinants/M"
  - "scoring-input/special-score/AB"
authorityPolicy: "curated-internal-reference"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/corpus-review-ledger.md"
---

# Document Name: [Coding/Form Quality] none

## Aliases / Search Terms

- FQnone
- no form quality code
- no FQ

## Core Definition

`none` is used when the response does not receive a form quality code.
This means form is not available as a codable basis for judging form fit.

## Application Conditions

- The response does not provide usable form basis for assigning `+`, `o`, `u`, or `-`.
- The code is used to separate these responses from those that do receive a specific FQ.
- Apply it cautiously and only when form quality truly should not be coded.

## Cautions / Distinctions

- `none` is not the same as [`FQ-`](ref://scoring-input/fq/-). `-` means poor fit; `none` means no FQ code applies.
- Do not change a poor-fit response into `none` just because it is difficult.
- Check the involved determinants before deciding that no codable FQ is present.

## Cross References

- [[Coding/Form Quality] FQ](ref://scoring-input/fq)
- [[Coding/Determinants] M](ref://scoring-input/determinants/M)
- [[Coding/Special Scores] AB](ref://scoring-input/special-score/AB)

## Evidence Note

- Detailed source comparisons remain in the internal provenance note.
