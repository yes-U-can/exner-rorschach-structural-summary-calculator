---
canonicalRoute: "result-interpretation/lower-section/core/EBPer"
locale: "ja"
docKind: "interpretation-entry"
canonicalTitle: "result-interpretation/lower-section/core/EBPer"
displayTitle: "[Interpretation/Core] EBPer"
aliases:
  - "EBPer"
  - "EB Pervasive"
  - "EB pervasiveness"
  - "EBの硬さ"
relatedRoutes:
  - "result-interpretation/lower-section/core"
  - "result-interpretation/lower-section/core/EB"
  - "result-interpretation/lower-section/core/EA"
  - "result-interpretation/lower-section/core/eb"
  - "result-interpretation/lower-section/core/es"
  - "result-interpretation/lower-section/core/D"
  - "scoring-input/determinants/M"
  - "scoring-input/determinants/FC"
  - "scoring-input/determinants/CF"
  - "scoring-input/determinants/C"
authorityPolicy: "curated-internal-reference"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance-ja-core-eb-family-2026-03-10.md"
---

# Document Name: [Interpretation/Core] EBPer

## Aliases / Search Terms

- EBPer
- EB Pervasive
- EB pervasiveness
- EBの硬さ

## Core Definition

`EBPer` は、`EB` の大きい側と小さい側の比率です。
`EB` に明確な方向がある場合にだけ解釈し、その好みの対処方向がどれほど固定的かを見積もる助けになります。

計算するのは、`EA >= 4.0`、`Lambda < 1.0`、かつ `EB` 両側の絶対差が、`EA` が `4.0` 以上 `10.0` 以下なら `2.0` 以上、`EA > 10.0` なら `2.5` 以上という全条件を満たす場合だけです。大きい側を小さい側で割るため、両側ともゼロより大きい必要があります。条件を満たさない場合、`EBPer` は報告しません。

## Interpretation Points

- `EBPer` が低めなら、好みのスタイルはあっても一定の柔軟さが残っています。
- `EBPer` が高いほど、`introversive` あるいは `extratensive` の方向がより硬く優勢になります。
- その場合、好みの経路に頼りすぎて柔軟性を失う可能性があります。

## Cautions / Distinctions

- `EB` に明確な方向がない場合、`EBPer` は解釈しません。
- カットオフを超えたこと自体が病理を意味するのではなく、柔軟性の低下を表すと考えます。
- `EA` が非常に低い場合やプロトコルが短い場合、比率が実際より極端に見えることがあります。

## Cross References

- [[Interpretation/Lower Section/Core] Core](ref://result-interpretation/lower-section/core)
- [[Interpretation/Core] EB](ref://result-interpretation/lower-section/core/EB)
- [[Interpretation/Core] EA](ref://result-interpretation/lower-section/core/EA)
- [[Interpretation/Core] eb](ref://result-interpretation/lower-section/core/eb)
- [[Interpretation/Core] es](ref://result-interpretation/lower-section/core/es)
- [[Interpretation/Core] D](ref://result-interpretation/lower-section/core/D)
- [[Coding/Determinants] M](ref://scoring-input/determinants/M)
- [[Coding/Determinants] FC](ref://scoring-input/determinants/FC)
- [[Coding/Determinants] CF](ref://scoring-input/determinants/CF)
- [[Coding/Determinants] C](ref://scoring-input/determinants/C)

## Evidence Note

- Detailed source comparison is stored in internal provenance notes.
