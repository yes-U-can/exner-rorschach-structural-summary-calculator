---
canonicalRoute: "scoring-input/fq"
locale: "ja"
docKind: "coding-overview"
canonicalTitle: "scoring-input/fq"
displayTitle: "[コーディング/形態水準] FQ"
aliases:
  - "FQ"
  - "形態水準"
  - "形態適合の符号化"
relatedRoutes:
  - "scoring-input/fq/+"
  - "scoring-input/fq/o"
  - "scoring-input/fq/u"
  - "scoring-input/fq/-"
  - "scoring-input/fq/none"
  - "scoring-input/dq"
authorityPolicy: "curated-internal-reference"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/corpus-review-ledger.md"
---

# [コーディング/形態水準] FQ

## 別名・検索語

- FQ
- 形態水準
- 形態適合の符号化

## 中核的定義

`FQ` は、反応で述べられた対象がインクの輪郭にどの程度うまく合っているかを符号化する指標です。
反応の組織化水準ではなく、形態の適合度を扱います。

## 採点・適用条件

- `FQ` 記号は決定因欄の末尾に置きます。
- 基本の 5 区分 `+`, `o`, `u`, `-`, `none` を使います。
- まず形態水準表を基準にし、必要なら外挿と適合判断を補助として使います。
- 対象が無理なく、もっともらしく見えるかを確認します。
- 形態水準を与えるべきでない場合にだけ [`none`](ref://scoring-input/fq/none) を使います。

## 注意点・鑑別

- `FQ` は [`DQ`](ref://scoring-input/dq) と同じではありません。`DQ` は組織化、`FQ` は形態適合です。
- `FQ+` は珍しい区分です。豊かに聞こえる反応だからといって自動的に `+` にはしません。
- 表にない反応では、[`u`](ref://scoring-input/fq/u) と [`-`](ref://scoring-input/fq/-) の区別が特に重要です。
- `none` は「形態が悪い」という意味ではなく、「FQ を付けない」という意味です。

## 相互参照

- [[コーディング/形態水準] +](ref://scoring-input/fq/%2B)
- [[コーディング/形態水準] o](ref://scoring-input/fq/o)
- [[コーディング/形態水準] u](ref://scoring-input/fq/u)
- [[コーディング/形態水準] -](ref://scoring-input/fq/-)
- [[コーディング/形態水準] none](ref://scoring-input/fq/none)
- [[コーディング/発達水準] DQ](ref://scoring-input/dq)

## 根拠メモ

- 詳細な出典比較は内部 provenance note に記録します。
