# [2026-08-08] v2.2.10 バグ修正版

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## 今回のリリース

v2.2.10は構造一覧表の計算を変更せず、結果画面とPDFで欠けていた`GHR:PHR`表示を復元し、PDFの読みやすさを改善したバグ修正版です。

規則に沿って入力された既存プロトコルを再計算する必要はありません。

## 変更内容

### Lower SectionのGHR:PHR

アプリは各反応のGHRとPHRをすでに判定し、Upper Sectionに各合計を表示していました。しかし、構造一覧表にある`GHR:PHR`比がLower SectionのInterpersonal領域から欠けていました。

画面とPDFでは、`GHR:PHR`を`COP`、`AG`の後、`a:p`の前に表示します。GHR/PHRの判定順序と合計は変更していません。

### PDF出力

- 通常のLower Sectionカードを、項目名と値の二列構成に整理しました。
- S-CON、DEPI、CDI、HVI、OBSに総合判定チェックボックスと基準の区切り線を追加しました。
- HVIの判定文が不自然に一文字だけ改行されないよう印刷サイズを調整しました。

これらは表示と印刷形式の改善であり、計算式や判定値には影響しません。

## 計算根拠

現在の計算で最上位の根拠とする文献は次の二点です。

1. Exner, J. E., Jr. (2003). *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations and Principles of Interpretation* (4th ed.). John Wiley & Sons.
2. Exner, J. E., Jr. (2001). *A Rorschach Workbook for the Comprehensive System* (5th ed.). Rorschach Workshops.

表のページ番号は各文献に印刷されたページを示します。

| 対象 | Volume 1 第4版 | Workbook 第5版 | アプリでの範囲 |
| --- | --- | --- | --- |
| 運動決定因とM、FM、m系列 | 91-95頁 | 35-37頁 | 入力では能動・受動を記録し、構造一覧表には系列合計を表示します。 |
| 複数の内容符号とAn/Xy境界 | 126、128頁 | 55-56頁 | 内容重複とNa/Bt/Ls、An/Xyの入力規則が対象に含まれます。 |
| Level 1・2、CONTAM、複数のSpecial Score | 135、138-139、145頁 | 62-63、69-70、79-80頁 | レベル対、CONTAMの排他性、WSum6処理が対象に含まれます。 |
| GHR/PHR判定 | 143-144頁 | 77頁 | 現行計算は七段階の判定順序に従います。 |
| Upper Section | 148-150頁 | 91-92頁 | 構造一覧表にはLocation、DQ、FQ、決定因、内容、Special Scoreの合計が含まれます。 |
| Lower Section | 151-155頁 | 93-99頁 | 計算と表示はCoreからSelf-Perceptionまでを対象とします。 |
| 六つのSpecial Indices | 156頁 | 100-101頁 | PTI、DEPI、CDI、S-CON、HVI、OBSの条件と境界が対象に含まれます。 |
| 年齢適用と補正 | 157頁 | 100-101頁 | 年齢による実際の適用は臨床家が判断する従来の原則を維持しました。 |

### PTIの版による差

Volume 1第4版156頁は、PTI第四条件の高R分岐を`R > 16`かつ`WSum6 > 16`と印刷しています。Workbook第5版101頁とRIAP 5出力は`R > 16`かつ`WSum6 > 17`を使用します。

アプリは後発のWorkbookとその出力に合わせて`> 17`を維持します。

### S-CONと年齢

S-CONは15歳以上に適用されます。アプリは被検者の年齢を収集しません。入力された構造一覧表の値が基準を満たすかを表示し、実際の適用は年齢と臨床情報全体を把握する臨床家が判断します。

## 参照文書とAIアシスタント

五言語のInterpersonal参照文書に`GHR:PHR`の説明を追加しました。一方の優勢は人物表象の一側面を示し得ますが、この比だけで対人機能全体を結論づけられないことも明記しています。

AIアシスタントはExner包括システムの範囲に限定されます。R-PASなど別のRorschach体系の規則をExner計算に混在させず、診断・治療・法的判断など計算機の範囲外の依頼には限界を案内します。

## 既存結果への影響

既存プロトコルを再計算する必要はありません。以前のPDFを新しい形式で保存する場合は、同じプロトコルを開き直してPDFだけを再作成してください。

## 文献と著作権

公開文書には書誌情報と、計算に用いた印刷ページを掲載します。著作権のある文献の長い文章や実際の検査資料は複製しません。
