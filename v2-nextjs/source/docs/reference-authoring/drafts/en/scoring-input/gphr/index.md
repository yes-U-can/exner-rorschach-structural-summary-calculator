---
canonicalRoute: "scoring-input/gphr"
locale: "en"
docKind: "coding-overview"
canonicalTitle: "scoring-input/gphr"
displayTitle: "[Coding/GHR-PHR] GHR/PHR"
aliases:
  - "GHR/PHR"
  - "human representation"
  - "good human representation"
  - "poor human representation"
relatedRoutes:
  - "scoring-input/gphr/GHR"
  - "scoring-input/gphr/PHR"
  - "scoring-input/contents/H"
  - "scoring-input/contents/Hd"
  - "scoring-input/determinants/M"
  - "scoring-input/special-score/COP"
  - "scoring-input/special-score/AG"
  - "scoring-input/special-score/MOR"
  - "result-interpretation/lower-section/interpersonal/HumanCont"
  - "result-interpretation/lower-section/interpersonal/PureH"
  - "result-interpretation/lower-section/selfPerception/H_ratio"
authorityPolicy: "curated-internal-reference"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/corpus-review-ledger.md"
---

# Document Name: [Coding/GHR-PHR] GHR/PHR

## Aliases / Search Terms

- GHR/PHR
- human representation
- good human representation
- poor human representation

## Core Definition

`GHR` and `PHR` are special codes used to qualify the quality of a human representational response.  
They are not assigned from general clinical impression, but through a decision sequence built from other codes already assigned.

## Application Conditions

- First confirm that the response falls in the human representational domain.
- That can happen through human content, determinant `M`, or an `FM` response carrying [`COP`](ref://scoring-input/special-score/COP) or [`AG`](ref://scoring-input/special-score/AG).
- Then follow the decision sequence to determine whether the response ends in [`GHR`](ref://scoring-input/gphr/GHR) or [`PHR`](ref://scoring-input/gphr/PHR).
- The final decision depends on form quality, cognitive special scores, `AG`, `MOR`, `An`, `Hd`, popularity, and other signals that were already coded.

## Cautions / Distinctions

- `GHR` and `PHR` are not assigned together; the response ends in one or the other.
- Human content alone is not enough to settle the code.
- `GHR` does not mean "good person" and `PHR` does not mean "bad person"; they are system-level classifications of human representation.
- These decisions later feed variables such as [`HumanCont`](ref://result-interpretation/lower-section/interpersonal/HumanCont), [`PureH`](ref://result-interpretation/lower-section/interpersonal/PureH), and [`H ratio`](ref://result-interpretation/lower-section/selfPerception/H_ratio).

## Cross References

- [[Coding/GHR-PHR] GHR](ref://scoring-input/gphr/GHR)
- [[Coding/GHR-PHR] PHR](ref://scoring-input/gphr/PHR)
- [[Coding/Content] H](ref://scoring-input/contents/H)
- [[Coding/Content] Hd](ref://scoring-input/contents/Hd)
- [[Coding/Determinants] M](ref://scoring-input/determinants/M)
- [[Coding/Special Score] COP](ref://scoring-input/special-score/COP)
- [[Coding/Special Score] AG](ref://scoring-input/special-score/AG)
- [[Coding/Special Score] MOR](ref://scoring-input/special-score/MOR)
- [[Interpretation/Interpersonal] Human Content](ref://result-interpretation/lower-section/interpersonal/HumanCont)
- [[Interpretation/Interpersonal] Pure H](ref://result-interpretation/lower-section/interpersonal/PureH)
- [[Interpretation/Self Perception] H ratio](ref://result-interpretation/lower-section/selfPerception/H_ratio)

## Evidence Note

- Detailed source comparisons remain in the internal provenance note.
