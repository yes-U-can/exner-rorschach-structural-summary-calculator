---
canonicalRoute: "scoring-input/location"
locale: "en"
docKind: "coding-overview"
canonicalTitle: "scoring-input/location"
displayTitle: "[Coding/Location] Location"
aliases:
  - "Location"
  - "location coding"
  - "W, WS, D, DS, Dd, DdS, S"
relatedRoutes:
  - "scoring-input/location/W"
  - "scoring-input/location/WS"
  - "scoring-input/location/D"
  - "scoring-input/location/DS"
  - "scoring-input/location/Dd"
  - "scoring-input/location/DdS"
  - "scoring-input/location/S"
  - "result-interpretation/upper-section/W"
  - "result-interpretation/upper-section/D"
  - "result-interpretation/upper-section/Dd"
  - "result-interpretation/upper-section/S"
authorityPolicy: "exner-base"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance/en/scoring-input/location/index.md"
---

# Document Name: [Coding/Location] Location

## Aliases / Search Terms

- Location
- location coding
- `W`, `WS`, `D`, `DS`, `Dd`, `DdS`, `S`

## Core Definition

Location codes which part of the blot the person uses to build the response.
The main question is whether the person uses the whole blot, a common detail, an uncommon detail, and whether white space is integrated.

## Application Conditions

- Fix the location precisely on the location sheet or in inquiry.
- If the whole blot is used, code [`W`](ref://scoring-input/location/W).
- If a commonly used detail is used, code [`D`](ref://scoring-input/location/D).
- If an infrequently used detail is used, code [`Dd`](ref://scoring-input/location/Dd).
- If white space is integrated, add `S` to the basic code: [`WS`](ref://scoring-input/location/WS), [`DS`](ref://scoring-input/location/DS), [`DdS`](ref://scoring-input/location/DdS).
- `S` does not stand alone as a basic location code; it modifies another location decision.

## Cautions / Distinctions

- Location does not describe organization or form fit. Those are coded separately in [`DQ`](ref://scoring-input/dq) and [`FQ`](ref://scoring-input/fq).
- `D` and `Dd` are not separated by size alone; the distinction is based on common versus uncommon use of the area.
- White space should not be assumed. It must play a real role in the response.
- In interpretation, frequencies of `W`, `D`, `Dd`, and `S` reappear in the upper section of the Structural Summary.

## Cross References

- [[Coding/Location] W](ref://scoring-input/location/W)
- [[Coding/Location] WS](ref://scoring-input/location/WS)
- [[Coding/Location] D](ref://scoring-input/location/D)
- [[Coding/Location] DS](ref://scoring-input/location/DS)
- [[Coding/Location] Dd](ref://scoring-input/location/Dd)
- [[Coding/Location] DdS](ref://scoring-input/location/DdS)
- [[Coding/Location] S](ref://scoring-input/location/S)
- [[Interpretation/Upper Section] W](ref://result-interpretation/upper-section/W)
- [[Interpretation/Upper Section] D](ref://result-interpretation/upper-section/D)
- [[Interpretation/Upper Section] Dd](ref://result-interpretation/upper-section/Dd)
- [[Interpretation/Upper Section] S](ref://result-interpretation/upper-section/S)

## Evidence Note

- Detailed source comparisons remain in the internal provenance note.
