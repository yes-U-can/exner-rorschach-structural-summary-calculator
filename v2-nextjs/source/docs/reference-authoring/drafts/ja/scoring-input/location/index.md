---
canonicalRoute: "scoring-input/location"
locale: "ja"
docKind: "coding-overview"
canonicalTitle: "scoring-input/location"
displayTitle: "[コーディング/場所] Location"
aliases:
  - "Location"
  - "場所コード"
  - "位置コード"
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
authorityPolicy: "curated-internal-reference"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/corpus-review-ledger.md"
---

# Document Name: [コーディング/場所] Location

## Aliases / Search Terms

- Location
- 場所コード
- 位置コード

## Core Definition

Location は、受検者がどの領域を使って反応したかを記録するコード群です。
形が何に見えたかではなく、インクブロットのどの範囲を使ったかを整理する段階です。

## Application Conditions

- 反応で使われた領域を location sheet と inquiry で確認する。
- 全体を使ったのか、よく使われる部分だけか、珍しい小部分かを区別する。
- 白地を図として取り入れた場合は `WS`, `DS`, `DdS`, `S` のどれに当たるかを判断する。
- Location は他のコードより先に固定し、その後に `DQ` や determinant をつける。

## Cautions / Distinctions

- Location は「どこを使ったか」のコードであり、「どれだけまとまっているか」や「形が合っているか」の評価ではありません。
- `D` と `Dd` の境界は、単に小さいかどうかではなく、慣習的によく使われる部分かどうかで決めます。
- 白地が含まれていても、白地そのものが図として使われていなければ `S` 系列にはしません。
- `W` は全体を見ていることを示しますが、それだけで組織化が高いとは言えません。

## Cross References

- [[コーディング/場所] W](ref://scoring-input/location/W)
- [[コーディング/場所] WS](ref://scoring-input/location/WS)
- [[コーディング/場所] D](ref://scoring-input/location/D)
- [[コーディング/場所] DS](ref://scoring-input/location/DS)
- [[コーディング/場所] Dd](ref://scoring-input/location/Dd)
- [[コーディング/場所] DdS](ref://scoring-input/location/DdS)
- [[コーディング/場所] S](ref://scoring-input/location/S)
- [[解釈/Upper Section] W](ref://result-interpretation/upper-section/W)
- [[解釈/Upper Section] D](ref://result-interpretation/upper-section/D)
- [[解釈/Upper Section] Dd](ref://result-interpretation/upper-section/Dd)
- [[解釈/Upper Section] S](ref://result-interpretation/upper-section/S)

## Evidence Note

- 詳細な出典比較と判断根拠は内部 provenance note に分離してあります。
