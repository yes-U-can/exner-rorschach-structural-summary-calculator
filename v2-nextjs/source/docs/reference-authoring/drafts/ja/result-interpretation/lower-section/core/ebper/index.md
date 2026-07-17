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

# [Interpretation/Core] EBPer

## 別名・検索語

- EBPer
- EB Pervasive
- EB pervasiveness
- EBの硬さ

## 中核的定義

`EBPer` は、`EB` の大きい側と小さい側の比率です。
`EB` に明確な方向がある場合にだけ解釈し、その好みの対処方向がどれほど固定的かを見積もる助けになります。

計算するのは、`EA >= 4.0`、`Lambda < 1.0`、かつ `EB` 両側の絶対差が、`EA` が `4.0` 以上 `10.0` 以下なら `2.0` 以上、`EA > 10.0` なら `2.5` 以上という全条件を満たす場合だけです。大きい側を小さい側で割るため、両側ともゼロより大きい必要があります。条件を満たさない場合、`EBPer` は報告しません。

## 解釈の要点

- `EBPer` が低めなら、好みのスタイルはあっても一定の柔軟さが残っています。
- `EBPer` が高いほど、`introversive` あるいは `extratensive` の方向がより硬く優勢になります。
- その場合、好みの経路に頼りすぎて柔軟性を失う可能性があります。

## 注意点・鑑別

- `EB` に明確な方向がない場合、`EBPer` は解釈しません。
- カットオフを超えたこと自体が病理を意味するのではなく、柔軟性の低下を表すと考えます。
- `EA` が非常に低い場合やプロトコルが短い場合、比率が実際より極端に見えることがあります。

## 相互参照

- [[解釈/下段/Core] Core](ref://result-interpretation/lower-section/core)
- [[解釈/Core] EB](ref://result-interpretation/lower-section/core/EB)
- [[解釈/Core] EA](ref://result-interpretation/lower-section/core/EA)
- [[解釈/Core] eb](ref://result-interpretation/lower-section/core/eb)
- [[解釈/Core] es](ref://result-interpretation/lower-section/core/es)
- [[解釈/Core] D](ref://result-interpretation/lower-section/core/D)
- [[Coding/決定因] M](ref://scoring-input/determinants/M)
- [[Coding/決定因] FC](ref://scoring-input/determinants/FC)
- [[Coding/決定因] CF](ref://scoring-input/determinants/CF)
- [[Coding/決定因] C](ref://scoring-input/determinants/C)

## 根拠メモ

- 詳細な出典比較と判断根拠は、内部の検討メモで管理しています。
