---
canonicalRoute: "scoring-input/gphr"
locale: "ja"
docKind: "coding-overview"
canonicalTitle: "scoring-input/gphr"
displayTitle: "[コーディング/GHR-PHR] GHR/PHR"
aliases:
  - "GHR/PHR"
  - "人間表象"
  - "良好な人間表象"
  - "不良な人間表象"
relatedRoutes:
  - "scoring-input/gphr/GHR"
  - "scoring-input/gphr/PHR"
  - "scoring-input/contents/H"
  - "scoring-input/contents/Hd"
  - "scoring-input/determinants/M"
  - "scoring-input/special-score/COP"
  - "scoring-input/special-score/AG"
  - "scoring-input/special-score/MOR"
  - "result-interpretation/lower-section/interpersonal/HumanCont"
  - "result-interpretation/lower-section/interpersonal/PureH"
  - "result-interpretation/lower-section/selfPerception/H_ratio"
authorityPolicy: "curated-internal-reference"
status: "draft"
provenanceNote: "docs/reference-authoring/notes/provenance-ja-gphr-2026-03-10.md"
---

# [コーディング/GHR-PHR] GHR/PHR

## 別名・検索語

- GHR/PHR
- 人間表象
- 良好な人間表象
- 不良な人間表象

## 中核的定義

`GHR`と`PHR`は、人間表象反応の質を区別するための特殊コードです。
全体的な印象で自由につけるのではなく、すでに採点した他のコードをたどる決定手順の結果として決まります。

## 採点・適用条件

- まず、その反応が人間表象領域に入るかを確認します。
- これは人間内容、決定因`M`、または[`COP`](ref://scoring-input/special-score/COP)や[`AG`](ref://scoring-input/special-score/AG)を伴う`FM`反応などで成立します。
- そのうえで、決定手順に沿って最終的に[`GHR`](ref://scoring-input/gphr/GHR)か[`PHR`](ref://scoring-input/gphr/PHR)のどちらになるかを判断します。
- 最終判断には、形態水準、認知特殊スコア、`AG`、`MOR`、`An`、`Hd`、平凡反応など、すでに付けた他のコードが関わります。

## 注意点・鑑別

- `GHR`と`PHR`は同時には付けません。最終的にはどちらか一方です。
- 人間内容があるだけで自動的に決まるわけではありません。
- `GHR`は「良い人」、`PHR`は「悪い人」という意味ではなく、あくまで体系内での人間表象の分類です。
- 後の解釈では[`Human Content`](ref://result-interpretation/lower-section/interpersonal/HumanCont)、[`Pure H`](ref://result-interpretation/lower-section/interpersonal/PureH)、[`H ratio`](ref://result-interpretation/lower-section/selfPerception/H_ratio)のような変数とつながります。

## 相互参照

- [[コーディング/GHR-PHR] GHR](ref://scoring-input/gphr/GHR)
- [[コーディング/GHR-PHR] PHR](ref://scoring-input/gphr/PHR)
- [[コーディング/内容] H](ref://scoring-input/contents/H)
- [[コーディング/内容] Hd](ref://scoring-input/contents/Hd)
- [[コーディング/決定因] M](ref://scoring-input/determinants/M)
- [[コーディング/特殊スコア] COP](ref://scoring-input/special-score/COP)
- [[コーディング/特殊スコア] AG](ref://scoring-input/special-score/AG)
- [[コーディング/特殊スコア] MOR](ref://scoring-input/special-score/MOR)
- [[解釈/対人関係] 人間内容](ref://result-interpretation/lower-section/interpersonal/HumanCont)
- [[解釈/対人関係] Pure H](ref://result-interpretation/lower-section/interpersonal/PureH)
- [[解釈/自己知覚] H比率](ref://result-interpretation/lower-section/selfPerception/H_ratio)

## 根拠メモ

- 詳細な出典比較は内部 provenance note に記録しています。
