---
canonicalRoute: "scoring-input"
locale: "ja"
docKind: "coding-overview"
canonicalTitle: "scoring-input"
displayTitle: "[コーディング] scoring-input"
aliases:
  - "scoring-input"
  - "scoring input"
  - "coding input"
  - "コーディング"
  - "符号化入力"
relatedRoutes:
  - "scoring-input/score"
  - "scoring-input/card"
  - "scoring-input/location"
  - "scoring-input/dq"
  - "scoring-input/determinants"
  - "scoring-input/fq"
  - "scoring-input/pair"
  - "scoring-input/contents"
  - "scoring-input/popular"
  - "scoring-input/z"
  - "scoring-input/gphr"
  - "scoring-input/special-score"
authorityPolicy: "curated-internal-reference"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance-ja-scoring-input-overview-2026-03-10.md"
---

# [コーディング] scoring-input

## 別名・検索語

- scoring-input
- scoring input
- coding input
- コーディング
- 符号化入力

## 中核的定義

`scoring-input` は、各反応を包括システムのコードへ変換する全体段階を指します。
このページは構造一覧の解釈を行うページではなく、解釈前にそろえる `score` と下位コーディング群の入口です。

## 採点・適用条件

- 符号化は反応ごとに、実際の逐語順を保ったまま進めます。
- 各反応では、通常 [`Location`](ref://scoring-input/location)、[`DQ`](ref://scoring-input/dq)、[`Determinants`](ref://scoring-input/determinants)、[`FQ`](ref://scoring-input/fq)、[`Contents`](ref://scoring-input/contents) を一定の順序で確認すると取り違えが減ります。
- 必要に応じて [`Pair`](ref://scoring-input/pair)、[`Popular`](ref://scoring-input/popular)、[`Z`](ref://scoring-input/z)、[`GHR/PHR`](ref://scoring-input/gphr)、[`Special Scores`](ref://scoring-input/special-score) を追加します。
- 符号化判断は反応本文と質問段階に基づいて行い、後から得た全体印象で記号を先に決めません。
- この段階の目的は、後続の [`score`](ref://scoring-input/score) と構造一覧が安定するだけの精度で反応を記録することです。

## 注意点・鑑別

- 符号化は解釈と同じ作業ではありません。
- この段階では、臨床的意味を急いで読むよりも、反応に現れた特徴を正確に区分することが優先です。
- 同じ記号でも文脈が違えば意味も違います。
- たとえば [`Card V`](ref://scoring-input/card/V) は決定因の `V` と同じではありません。
- 同じように [`DQ +`](ref://scoring-input/dq/%2B) は [`FQ +`](ref://scoring-input/fq/%2B) と別概念です。

## 相互参照

- [[コーディング] score](ref://scoring-input/score)
- [[コーディング/カード] Card](ref://scoring-input/card)
- [[コーディング/位置] 領域](ref://scoring-input/location)
- [[コーディング/DQ] DQ](ref://scoring-input/dq)
- [[コーディング/決定因] 決定因](ref://scoring-input/determinants)
- [[コーディング/FQ] FQ](ref://scoring-input/fq)
- [[コーディング/Pair] Pair](ref://scoring-input/pair)
- [[コーディング/内容] Contents](ref://scoring-input/contents)
- [[コーディング/Popular] Popular](ref://scoring-input/popular)
- [[コーディング/Z] Z](ref://scoring-input/z)
- [[コーディング/GHR-PHR] GHR/PHR](ref://scoring-input/gphr)
- [[コーディング/特殊スコア] 特殊スコア](ref://scoring-input/special-score)

## 根拠メモ

- 詳細な出典比較と用語判断は内部 provenance note に分けて記録します。
- 公開本文では資料名を直接出さず、RAG が読みやすい説明構造を優先します。
