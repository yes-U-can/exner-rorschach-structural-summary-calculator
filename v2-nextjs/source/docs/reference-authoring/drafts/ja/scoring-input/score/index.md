---
canonicalRoute: "scoring-input/score"
locale: "ja"
docKind: "coding-entry"
canonicalTitle: "scoring-input/score"
displayTitle: "[コーディング] score"
aliases:
  - "score"
  - "コーディング"
  - "反応の採点"
  - "反応コード化"
relatedRoutes:
  - "scoring-input"
  - "scoring-input/location"
  - "scoring-input/dq"
  - "scoring-input/determinants"
  - "scoring-input/fq"
  - "scoring-input/contents"
  - "scoring-input/pair"
  - "scoring-input/popular"
  - "scoring-input/z"
  - "scoring-input/gphr"
  - "scoring-input/special-score"
authorityPolicy: "curated-internal-reference"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/corpus-review-ledger.md"
---

# [コーディング] score

## 別名・検索語

- score
- コーディング
- 反応の採点
- 反応コード化

## 中核的定義

`score` は、すぐに数字を与えることではありません。
包括システムでは、各反応を正確なコードの組み合わせに変換する作業全体を指します。

## 採点・適用条件

- 反応はプロトコルに出てきた順にコード化します。
- 領域, DQ, 決定因, FQ, 内容, 追加コードを順に確定します。
- 質問段階によって、実際に何を見たかがコードに反映されるようにします。
- 構造一覧表の正確さは、各反応のコーディング精度に依存します。

## 注意点・鑑別

- `score` は独立した点数表ではなく、反応全体のコード化手続きです。
- ありそうだからという理由でコードを推測してはいけません。質問段階で支えられないなら付けません。
- コーディングと解釈は別段階です。まず反応をコード化し、そのあとでプロトコル全体を解釈します。
- 各要素は [`Location`](ref://scoring-input/location), [`DQ`](ref://scoring-input/dq), [`Determinants`](ref://scoring-input/determinants), [`FQ`](ref://scoring-input/fq), [`Contents`](ref://scoring-input/contents) など別々の規則で決まります。

## 相互参照

- [[コーディング] scoring-input](ref://scoring-input)
- [[コーディング/場所] 領域](ref://scoring-input/location)
- [[コーディング/発達水準] DQ](ref://scoring-input/dq)
- [[コーディング/決定因] 決定因](ref://scoring-input/determinants)
- [[コーディング/形態水準] FQ](ref://scoring-input/fq)
- [[コーディング/内容] Contents](ref://scoring-input/contents)
- [[コーディング/Pair] Pair](ref://scoring-input/pair)
- [[コーディング/Popular] Popular](ref://scoring-input/popular)
- [[コーディング/Z] Z](ref://scoring-input/z)
- [[コーディング/GHR-PHR] GHR/PHR](ref://scoring-input/gphr)
- [[コーディング/特殊スコア] 特殊スコア](ref://scoring-input/special-score)

## 根拠メモ

- 詳細な出典比較と判断根拠は、内部の検討メモで管理しています。
