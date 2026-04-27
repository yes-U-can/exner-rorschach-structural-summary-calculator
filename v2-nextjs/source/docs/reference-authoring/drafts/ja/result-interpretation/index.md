---
canonicalRoute: "result-interpretation"
locale: "ja"
docKind: "interpretation-overview"
canonicalTitle: "result-interpretation"
displayTitle: "[解釈] result-interpretation"
aliases:
  - "result-interpretation"
  - "interpretation"
  - "structural summary interpretation"
  - "結果解釈"
relatedRoutes:
  - "result-interpretation/upper-section"
  - "result-interpretation/lower-section"
  - "result-interpretation/special-indices"
  - "scoring-input"
authorityPolicy: "exner-base"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance-ja-result-interpretation-overview-2026-03-10.md"
---

# Document Name: [解釈] result-interpretation

## Aliases / Search Terms

- result-interpretation
- interpretation
- structural summary interpretation
- 結果解釈

## Core Definition

`result-interpretation` は、完成した structural summary を読み取り、臨床的意味を整理する領域です。
このページは単一反応の符号化方法を説明するページではなく、計算済みの変数をどう組み合わせて読むかの入口です。

## Interpretation Notes

- 解釈の前提は、安定した [`scoring-input`](ref://scoring-input) です。
- 通常の読み順は [`upper-section`](ref://result-interpretation/upper-section)、[`lower-section`](ref://result-interpretation/lower-section)、[`special-indices`](ref://result-interpretation/special-indices) に整理されます。
- 単独の変数だけで結論を急がず、分布、組み合わせ、全体パターンで読む方が安全です。
- 必要に応じて、構造的解釈は反応順序や内容領域にも戻って照合します。
- locale ごとに本文とリンク構造が分かれていても、骨格 route は共有されます。

## Cautions / Distinctions

- この領域は [`scoring-input`](ref://scoring-input) と分けて扱う必要があります。
- 高値や低値だけで診断名を直接決めてはいけません。
- 依頼目的、プロトコルの長さ、文化文脈も解釈の意味づけに影響します。

## Cross References

- [[解釈/Upper Section] Upper Section](ref://result-interpretation/upper-section)
- [[解釈/Lower Section] Lower Section](ref://result-interpretation/lower-section)
- [[解釈/Special Indices] Special Indices](ref://result-interpretation/special-indices)
- [[コーディング] scoring-input](ref://scoring-input)

## Evidence Note

- 詳細な出典比較は内部 provenance note に分けて保持します。
- 公開本文では資料名を直接出さず、RAG が扱いやすい構造を優先します。
