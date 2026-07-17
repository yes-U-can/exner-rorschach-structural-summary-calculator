---
canonicalRoute: "scoring-input/determinants/Cn"
locale: "ja"
docKind: "coding-entry"
canonicalTitle: "scoring-input/determinants/Cn"
displayTitle: "[コーディング/決定因] Cn"
aliases:
  - "Cn"
  - "色名反応"
  - "色の命名"
relatedRoutes:
  - "scoring-input/determinants"
  - "scoring-input/determinants/FC"
  - "scoring-input/determinants/CF"
  - "scoring-input/determinants/C"
  - "result-interpretation/lower-section/affect/FC_CF_C"
authorityPolicy: "curated-internal-reference"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/corpus-review-ledger.md"
---

# [コーディング/決定因] Cn

## 別名・検索語

- Cn
- 色名反応
- 色の命名

## 中核的定義

`Cn` は、受検者が色の名前を言っているが、その色が反応の真の決定因にはなっていないときにつけるコードです。
そのため `Cn` は、完全な色彩決定因である `FC / CF / C` とは分けて扱います。

## 採点・適用条件

- 受検者が色を明示的に言及しています。
- その色への言及が、反応の主要な知覚構成を支えていません。
- 色の表現を外しても、見えている対象自体はほぼ変わりません。
- 色が本当に反応形成に参加しているなら [`FC`](ref://scoring-input/determinants/FC), [`CF`](ref://scoring-input/determinants/CF), [`C`](ref://scoring-input/determinants/C) を再検討します。

## 注意点・鑑別

- `Cn` は [`C`](ref://scoring-input/determinants/C) と同じではありません。`C` は色が真の決定因ですが、`Cn` は色を名前で述べただけです。
- 軽い色の言及を、むやみに `FC` や `CF` に膨らませてはいけません。
- `Cn` は解釈で完全な色彩決定因と同じようには数えません。
- 迷うときは、「色がそう見えさせているのか」、それとも「付随的説明として色を言っているだけか」を確認します。

**後続計算の境界:** 下段の慣例的ラベルは `FC:CF+C` のままですが、画面に表示する比率は `FC:(CF+C+Cn)` です。したがって、`Cn` が1つあれば表示上の右辺は1増えます。この表示上の慣例を一般的な色彩合計として再利用してはいけません。`WSumC`、`S-CON` の `CF+C > FC`、色彩・陰影ブレンドはそれぞれ別の式を使い、`Cn` を含めません。

## 相互参照

- [[コーディング/決定因] 決定因](ref://scoring-input/determinants)
- [[コーディング/決定因] FC](ref://scoring-input/determinants/FC)
- [[コーディング/決定因] CF](ref://scoring-input/determinants/CF)
- [[コーディング/決定因] C](ref://scoring-input/determinants/C)
- [[解釈/感情] FC:CF+C](ref://result-interpretation/lower-section/affect/FC_CF_C)

## 根拠メモ

- 詳細な出典比較と判断根拠は、内部の検討メモで管理しています。
