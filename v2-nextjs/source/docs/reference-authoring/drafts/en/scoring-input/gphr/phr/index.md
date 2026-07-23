---
canonicalRoute: "scoring-input/gphr/PHR"
locale: "en"
docKind: "coding-entry"
canonicalTitle: "scoring-input/gphr/PHR"
displayTitle: "[Coding/GHR-PHR] PHR"
aliases:
  - "PHR"
  - "poor human representation"
  - "poor human representational response"
relatedRoutes:
  - "scoring-input/gphr"
  - "scoring-input/gphr/GHR"
  - "scoring-input/contents/Hd"
  - "scoring-input/contents/An"
  - "scoring-input/special-score/AG"
  - "scoring-input/special-score/MOR"
  - "result-interpretation/lower-section/interpersonal/HumanCont"
  - "result-interpretation/lower-section/selfPerception/H_ratio"
authorityPolicy: "curated-internal-reference"
status: "draft"
provenanceNote: "docs/reference-authoring/notes/corpus-review-ledger.md"
---

# Document Name: [Coding/GHR-PHR] PHR

## Aliases / Search Terms

- PHR
- poor human representation
- poor human representational response

## Core Definition

`PHR` marks a human representational response that is relatively poorer, more distorted, or more fragile within the system's decision sequence.  
Like `GHR`, it is not chosen from free impression, but by moving through successive criteria.

## Application Conditions

- The response first has to qualify as a human representational response.
- `PHR` is assigned early if there is `FQ-`, `FQ none`, `ALOG`, `CONTAM`, or any level-2 cognitive special score.
- Codes such as `FABCOM`, [`MOR`](ref://scoring-input/special-score/MOR), content [`An`](ref://scoring-input/contents/An), [`AG`](ref://scoring-input/special-score/AG), `INCOM`, `DR`, or content [`Hd`](ref://scoring-input/contents/Hd) can also push toward `PHR` at the relevant point in the sequence.
- If a `PHR` criterion appears before a `GHR` criterion, the decision closes at `PHR`.

## Cautions / Distinctions

- `PHR` does not simply mean "negative content"; it is a classification of human representational quality.
- Not every response with `Hd` is automatically decided at once; the full sequence still matters, even though `Hd` is an important signal.
- `PHR` and `GHR` are not doubled; the response ends in one or the other.
- Later interpretation should rely on the whole protocol, not on `PHR` in isolation.

## Cross References

- [[Coding/GHR-PHR] GHR/PHR](ref://scoring-input/gphr)
- [[Coding/GHR-PHR] GHR](ref://scoring-input/gphr/GHR)
- [[Coding/Content] Hd](ref://scoring-input/contents/Hd)
- [[Coding/Content] An](ref://scoring-input/contents/An)
- [[Coding/Special Score] AG](ref://scoring-input/special-score/AG)
- [[Coding/Special Score] MOR](ref://scoring-input/special-score/MOR)
- [[Interpretation/Interpersonal] Human Content](ref://result-interpretation/lower-section/interpersonal/HumanCont)
- [[Interpretation/Self Perception] H ratio](ref://result-interpretation/lower-section/selfPerception/H_ratio)

## Evidence Note

- Detailed source comparisons remain in the internal provenance note.
