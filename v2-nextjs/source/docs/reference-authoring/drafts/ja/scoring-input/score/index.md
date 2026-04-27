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
authorityPolicy: "exner-base"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance/ja/scoring-input/score/index.md"
---

# Document Name: [コーディング] score

## Aliases / Search Terms

- score
- コーディング
- 反応の採点
- 反応コード化

## Core Definition

`score` は、すぐに数字を与えることではありません。
Comprehensive System では、各反応を正確なコードの組み合わせに変換する作業全体を指します。

## Application Conditions

- 反応はプロトコルに出てきた順にコード化する。
- Location, DQ, determinants, FQ, contents, 追加コードを順に確定する。
- inquiry によって、実際に何を見たかがコードに反映されるようにする。
- Structural Summary の正確さは、各反応のコーディング精度に依存する。

## Cautions / Distinctions

- `score` は独立した点数表ではなく、反応全体のコード化手続きです。
- ありそうだからという理由でコードを推測してはいけません。inquiry で支えられないなら付けません。
- コーディングと解釈は別段階です。まず反応をコード化し、そのあとでプロトコル全体を解釈します。
- 各要素は [`Location`](ref://scoring-input/location), [`DQ`](ref://scoring-input/dq), [`Determinants`](ref://scoring-input/determinants), [`FQ`](ref://scoring-input/fq), [`Contents`](ref://scoring-input/contents) など別々の規則で決まります。

## Cross References

- [[コーディング] scoring-input](ref://scoring-input)
- [[コーディング/場所] Location](ref://scoring-input/location)
- [[コーディング/発達水準] DQ](ref://scoring-input/dq)
- [[コーディング/決定因] Determinants](ref://scoring-input/determinants)
- [[コーディング/形態水準] FQ](ref://scoring-input/fq)
- [[コーディング/内容] Contents](ref://scoring-input/contents)
- [[コーディング/Pair] Pair](ref://scoring-input/pair)
- [[コーディング/Popular] Popular](ref://scoring-input/popular)
- [[コーディング/Z] Z](ref://scoring-input/z)
- [[コーディング/GHR-PHR] GHR/PHR](ref://scoring-input/gphr)
- [[コーディング/Special Scores] Special Scores](ref://scoring-input/special-score)

## Evidence Note

- 詳細な出典比較と判断根拠は内部 provenance note に分離してあります。
