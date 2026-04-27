---
canonicalRoute: "scoring-input/gphr/PHR"
locale: "ja"
docKind: "coding-entry"
canonicalTitle: "scoring-input/gphr/PHR"
displayTitle: "[採点/GHR-PHR] PHR"
aliases:
  - "PHR"
  - "不良な人間表象"
  - "不良な人間表象反応"
relatedRoutes:
  - "scoring-input/gphr"
  - "scoring-input/gphr/GHR"
  - "scoring-input/contents/Hd"
  - "scoring-input/contents/An"
  - "scoring-input/special-score/AG"
  - "scoring-input/special-score/MOR"
  - "result-interpretation/lower-section/interpersonal/HumanCont"
  - "result-interpretation/lower-section/selfPerception/H_ratio"
authorityPolicy: "exner-base"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance-ja-gphr-2026-03-10.md"
---

# Document Name: [採点/GHR-PHR] PHR

## Aliases / Search Terms

- PHR
- 不良な人間表象
- 不良な人間表象反応

## Core Definition

`PHR`は、決定手順の中で、より歪みや脆さが目立つ人間表象反応に付くコードです。  
`GHR`と同じく自由な印象ではなく、順番に条件を追っていった結果として決まります。

## Application Conditions

- まず反応が人間表象反応として成立している必要があります。
- `FQ-`、`FQ none`、`CONTAM`、レベル2の認知特殊スコアがあれば、早い段階で`PHR`になります。
- [`MOR`](ref://scoring-input/special-score/MOR)、[`An`](ref://scoring-input/contents/An)、[`AG`](ref://scoring-input/special-score/AG)、`INCOM`、`DR`、[`Hd`](ref://scoring-input/contents/Hd)なども、決定手順の該当箇所で`PHR`方向に働きます。
- `GHR`条件より先に`PHR`条件に当たれば、その反応は`PHR`で閉じます。

## Cautions / Distinctions

- `PHR`は単に「否定的内容」という意味ではなく、人間表象の質の分類です。
- `Hd`があるからといって即座に決まるわけではなく、全体の決定手順の中で判断します。
- `PHR`と`GHR`は同時に付けません。
- 後の解釈では、`PHR`単独ではなくプロトコル全体の中で見ます。

## Cross References

- [[採点/GHR-PHR] GHR/PHR](ref://scoring-input/gphr)
- [[採点/GHR-PHR] GHR](ref://scoring-input/gphr/GHR)
- [[採点/内容] Hd](ref://scoring-input/contents/Hd)
- [[採点/内容] An](ref://scoring-input/contents/An)
- [[採点/特殊スコア] AG](ref://scoring-input/special-score/AG)
- [[採点/特殊スコア] MOR](ref://scoring-input/special-score/MOR)
- [[解釈/対人関係] Human Content](ref://result-interpretation/lower-section/interpersonal/HumanCont)
- [[解釈/自己知覚] H ratio](ref://result-interpretation/lower-section/selfPerception/H_ratio)

## Evidence Note

- 詳細な出典比較は内部 provenance note に記録しています。
