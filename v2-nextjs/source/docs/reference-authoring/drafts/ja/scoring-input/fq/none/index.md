---
canonicalRoute: "scoring-input/fq/none"
locale: "ja"
docKind: "coding-entry"
canonicalTitle: "scoring-input/fq/none"
displayTitle: "[採点/形態水準] none"
aliases:
  - "FQnone"
  - "FQなし"
  - "形態水準を付けない"
relatedRoutes:
  - "scoring-input/fq"
  - "scoring-input/determinants/M"
  - "scoring-input/special-score/AB"
authorityPolicy: "exner-base"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance/ja/scoring-input/fq/none/index.md"
---

# Document Name: [採点/形態水準] none

## Aliases / Search Terms

- FQnone
- FQなし
- 形態水準を付けない

## Core Definition

`none` は、その反応に形態水準コードを与えないときに使います。  
これは「形態適合が悪い」という意味ではなく、FQ を付与する前提が成り立たないことを示します。

## Application Conditions

- `+`, `o`, `u`, `-` のいずれも与えるだけの形態的基盤がありません。
- FQ を与える反応と、与えない反応を区別するために使います。
- 形態水準を本当に付けるべきでない場合にだけ慎重に使います。

## Cautions / Distinctions

- `none` は [`FQ-`](ref://scoring-input/fq/-) と同じではありません。`-` は不良適合、`none` は FQ を付けないという意味です。
- 判断が難しいからという理由だけで、低適合反応を `none` に変えてはいけません。
- どの determinant が関わっているかを確認してから、FQ を付けない判断をします。

## Cross References

- [[採点/形態水準] FQ](ref://scoring-input/fq)
- [[採点/決定因] M](ref://scoring-input/determinants/M)
- [[採点/特殊得点] AB](ref://scoring-input/special-score/AB)

## Evidence Note

- 詳細な出典比較は内部 provenance note に記録します。
