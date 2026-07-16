---
canonicalRoute: "result-interpretation/lower-section/core/AdjD"
locale: "ja"
docKind: "interpretation-entry"
canonicalTitle: "result-interpretation/lower-section/core/AdjD"
displayTitle: "[Interpretation/Core] AdjD"
aliases:
  - "AdjD"
  - "Adjusted D"
  - "adjusted D score"
  - "補正D"
relatedRoutes:
  - "result-interpretation/lower-section/core"
  - "result-interpretation/lower-section/core/D"
  - "result-interpretation/lower-section/core/AdjEs"
  - "result-interpretation/lower-section/core/EA"
  - "result-interpretation/lower-section/core/es"
  - "result-interpretation/lower-section/core/m"
  - "result-interpretation/lower-section/core/SumY"
  - "result-interpretation/lower-section/core/Lambda"
  - "result-interpretation/special-indices/CDI"
authorityPolicy: "curated-internal-reference"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance-ja-core-d-family-2026-03-10.md"
---

# Document Name: [Interpretation/Core] AdjD

## Aliases / Search Terms

- AdjD
- Adjusted D
- adjusted D score
- 補正D

## Core Definition

`AdjD` は生の差そのものではない。まず `EA - AdjEs` を求め、D と同じ尺度変換を適用する。生の差が `-2.5` 以上 `+2.5` 以下なら `0` で、その範囲を超えると追加の `2.5` 点ごとに同じ符号で AdjD が1段階変化する。必要な場合は、通常印刷される `-5` から `+5` の表を超えても同じ系列を続ける。

`AdjEs` は `es` から1個を超える `m` と1個を超える `Y` を差し引くため、それらが表す状況的負荷の一部を補正した統制余力を見積もる指標である。

## Interpretation Points

- `AdjD = 0` は、補正後には要求と資源がほぼつり合っていることを示しやすい。
- `AdjD < 0` は、単なる一時的負荷だけでは説明しにくい、より持続的な過負荷や脆弱さを示しやすい。
- [`D`](ref://result-interpretation/lower-section/core/D) より `AdjD` が明らかに高い場合、現在の苦しさの一部は状況的ストレスによって増幅されている可能性がある。
- `AdjD` は、ストレスへの基礎的な余力や脆弱性をみるときに、`D` より参考になりやすい。

## Cautions / Distinctions

- `AdjD` も固定的な性格特性そのものではない。
- `AdjD` が 0 以上でも、強い外的圧力のもとで破綻しないと断定してはいけない。
- 臨床的には、[`D`](ref://result-interpretation/lower-section/core/D) と `AdjD` の差そのものが重要であり、現在の負荷とより持続的な負荷を分けて考える手がかりになる。

## Cross References

- [[Interpretation/Lower Section/Core] Core](ref://result-interpretation/lower-section/core)
- [[Interpretation/Core] D](ref://result-interpretation/lower-section/core/D)
- [[Interpretation/Core] AdjEs](ref://result-interpretation/lower-section/core/AdjEs)
- [[Interpretation/Core] EA](ref://result-interpretation/lower-section/core/EA)
- [[Interpretation/Core] es](ref://result-interpretation/lower-section/core/es)
- [[Interpretation/Core] m](ref://result-interpretation/lower-section/core/m)
- [[Interpretation/Core] SumY](ref://result-interpretation/lower-section/core/SumY)
- [[Interpretation/Core] Lambda](ref://result-interpretation/lower-section/core/Lambda)
- [[Interpretation/Special Indices] CDI](ref://result-interpretation/special-indices/CDI)

## Evidence Note
- Detailed source comparison is stored in internal provenance notes.
