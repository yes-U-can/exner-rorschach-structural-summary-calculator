# エクスナー・ロールシャッハ包括システム構造一覧表計算機

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

`エクスナー・ロールシャッハ包括システム構造一覧表計算機`の公開ソースおよびリリースアーカイブです。関連文書に基づくAIアシスタントは、任意で利用できる機能として提供しています。

このリポジトリは、公開済みバージョンのパッチノートとソースコードを収録しています。v1はGoogle Apps Scriptウェブアプリ、v2は現在のバージョン2ウェブアプリとして整理しています。

MOW（モオ）は、ウェブアプリの企画、制作、配布、運用、保守を担当します。ソウル臨床心理研究所（Seoul Institute of Clinical Psychology, SICP）は、初期の計算結果の確認と実際の臨床利用の観点からの検討に貢献します。

謝辞と初期の学習参考資料は、[ACKNOWLEDGEMENTS.md](./ACKNOWLEDGEMENTS.ja.md)にまとめています。

## 文書と言語

各パッチノートでは、バージョンごとの変更内容、影響を受ける可能性がある条件、既存結果を再計算する必要があるかどうか、計算根拠を確認できます。

- 公開案内とパッチノートには、[English](./README.en.md)、[日本語](./README.ja.md)、[Español](./README.es.md)、[Português (Brasil)](./README.pt-BR.md)の各版を用意します。
- ウェブアプリの画面は、韓国語、英語、日本語、スペイン語、ポルトガル語の5言語に対応しています。

## 公開している内容

- [v2] 公開ウェブアプリ: [exner.yesucan.co.kr](https://exner.yesucan.co.kr)
- [v2] バージョン2の最新リリース: [v2-nextjs/releases/v2.2.12](./v2-nextjs/releases/v2.2.12/README.ja.md)
- [v2] v2.2.10の計算根拠と文献範囲: [計算根拠と文献範囲](./v2-nextjs/methodology/reference-audit-v2.2.10/README.ja.md)
- [v2] バージョン2のリリース記録: [v2-nextjs/releases](./v2-nextjs/releases/)
- [v2] バージョン2の公開ソースコード: [v2-nextjs/source](./v2-nextjs/source/)
- [Google Apps Script] バージョン1のリリース記録: [v1-gas/releases](./v1-gas/releases/)
- 最新のv1実行版: [v1.4.1 デプロイ](https://script.google.com/macros/s/AKfycbxMCx13pkrSzFs8f2qXfmxy2LRhkBpZTItFTIfEOoOi-zwurbysnKGfDIYtAeEdQP99/exec)
- 最新のv1ソースコード: [v1-gas/current](./v1-gas/current/)

## v2.2.12

v2.2.12では、訪問統計をCookieを使用しない匿名・集計方式に変更しました。新しい訪問記録にはGoogle Analyticsを使用せず、Vercel Web Analyticsにより、閲覧したページ、流入元、おおよその国・地域、ブラウザ、オペレーティングシステム、端末の種類などの一般的な訪問状況だけを確認します。

構造一覧表の入力値、計算結果、AIチャットの内容、APIキーは訪問統計に含まれません。計算式と出力値は変更していないため、既存のプロトコルを再計算する必要はありません。詳細は[v2.2.12パッチノート](./v2-nextjs/releases/v2.2.12/README.ja.md)をご確認ください。

## v2.2.11

v2.2.11では、カードI～Xがすべて入力されていれば、Rが10～13個の記録も既存の妥当性警告を表示した後に計算できるよう、計算開始基準を調整しました。カードI～Xがすべて入力され、Rが14個以上の場合は従来どおり計算します。入力されていないカードが一つでもあれば、反応数にかかわらず計算せず、不足しているカードを案内します。

スペイン語の名称はSumario Estructural、ポルトガル語の名称はSumário Estruturalに統一しました。サービス名Yes, U Can!は維持し、韓国語の検索用説明では無料利用に関する情報をより明確に反映しました。

計算式、算出値、個人情報の取り扱いは変わりません。既存プロトコルを再計算する必要はありません。反応数の少ない記録は、表示される妥当性警告と臨床上の限界を考慮し、学習と確認の目的で使用してください。

## v2.2.10

v2.2.10は、画面とPDFのLower Sectionから抜けていた`GHR:PHR`比率を原版のStructural Summary配置に合わせて復元し、PDFの通常Lower Section表とSpecial Indicesの判定表示を整理したバグ修正版です。GHRとPHRの判定・合計はすでに計算されていたため、既存プロトコルを再計算する必要はありません。

計算根拠は、エクスナー包括システムVolume 1第4版とWorkbook第5版の印刷ページに従います。R-PASや他のロールシャッハ体系の規則を、エクスナー包括システムの計算に混在させません。v2.2.10では計算式と判定基準を変更していません。

五言語のInterpersonal参照文書に`GHR:PHR`の説明を追加しました。AIアシスタントもExner包括システムの範囲内でのみ回答します。文献名、版、印刷ページ、各資料の役割、残る限界は、[v2.2.10パッチノート](./v2-nextjs/releases/v2.2.10/README.ja.md)と[計算根拠と文献範囲](./v2-nextjs/methodology/reference-audit-v2.2.10/README.ja.md)で確認できます。

## v2.2.9

v2.2.9は、[Card]の並べ替えボタンで昇順と降順を切り替えられるようにし、解釈アシスタントへ移動する途中でAIセッションを開始した場合に目的の画面を開くよう修正したバグ修正版です。解釈アシスタントで最新メッセージより上を読んでいるときは、AIの応答状態に応じて三つの点または下向き矢印を表示します。役に立った・役に立たなかった評価を選ぶと、ボタンの背景は変えず、親指だけがアプリの青い塗りつぶしアイコンに変わります。理由を省略しても評価を保存でき、同じ評価をもう一度選ぶと削除できます。

構造一覧表の計算式とAI回答規則は変更していないため、既存プロトコルを再計算する必要はありません。詳細は[v2.2.9パッチノート](./v2-nextjs/releases/v2.2.9/README.ja.md)で確認できます。

## v2.2.8

v2.2.8は、一つの反応で同じ内容コードが二重に集計される問題を防ぎ、デスクトップとモバイルで反応コードを同じように扱うバグ修正です。サンプルデータは既存の自動保存を上書きせず、最後の編集内容は保存され、壊れた自動保存データは復元されません。

構造一覧表の計算式は変更していません。規則どおり入力された既存プロトコルを再計算する必要はありません。一つの反応に同じ内容コードを重複して入力した記録、デスクトップとモバイルでLevel 1・Level 2のSpecial Scoreの値が異なって保存された記録、モバイル画面で無形態決定因（`C`、`C'`、`T`、`V`、`Y`、`Cn`）だけを入力したにもかかわらず、[FQ]が`none`以外の値として保存された記録、未対応のZコードまたはカードに属さないZ得点が残っている記録は、原資料を確認してから再計算します。五言語の文書とAI回答では、S-CONの12基準と8項目以上の判定境界を説明し、年齢入力欄は追加していません。詳細は[v2.2.8パッチノート](./v2-nextjs/releases/v2.2.8/README.ja.md)で確認できます。

## v2.2.7

v2.2.7では、採点表の三つの未完成の入力が計算に進まないようにしました。位置の選択肢から単独の`S`を削除し、白地を使う反応を常に`WS`、`DS`、`DdS`として記録するようにしました。同じ決定因や同じ運動系列の符号を一つの反応に重複して入力できないようにし、形態水準を空欄のままでは計算できないようにしました。すべての反応が純粋形態（`F`）である記録のLambdaは、無限大記号ではなく純粋Fの個数として報告します。

規則どおり入力してきた既存のプロトコルを再計算する必要はありません。過去の自動保存データに該当する値が残っている場合、アプリは元のデータを保持したまま計算を止め、確認が必要な行を五言語で知らせます。詳細は[v2.2.7パッチノート](./v2-nextjs/releases/v2.2.7/README.ja.md)で確認できます。

## v2.2.6

v2.2.6では、各言語ページが検索結果と共有リンクでその言語のタイトルと説明を正しく表示するようにしました。既存のブックマークと外部リンクはそのまま利用できます。

また、一部のWindowsブラウザで採点画面の`Alt+マウスホイール`操作が拡大・縮小ではなく画面移動になる問題も修正しました。採点表ヘッダーの説明に現れる項目名は、すべて角括弧で統一しました。構造一覧表の計算式と結果、採点入力、画面配置、参照文書検索、AIの回答方式は変更していないため、既存のプロトコルを再計算する必要はありません。詳細は[v2.2.6パッチノート](./v2-nextjs/releases/v2.2.6/README.ja.md)で確認できます。

## v2.2.5

v2.2.5以降、採点表では能動・受動の区別がない`M`、`FM`、`m`を選択できず、`Ma`、`Mp`、`Ma-p`などの完全な符号を使用します。構造一覧表の`M`、`FM`、`m`合計と、EB、MQual、W:Mなどの計算は変わりません。

すでに完全な符号を使っている既存プロトコルは再計算する必要がありません。過去の自動保存データに能動・受動の区別がない運動符号が残っている場合、アプリは元の入力を保存したまま計算を止め、確認が必要な行と符号を示します。五言語の参照文書とAIアシスタントも同じ入力境界を案内します。影響条件と仮想的なCDI境界例は、[v2.2.5パッチノート](./v2-nextjs/releases/v2.2.5/README.ja.md)で確認できます。

## v2.2.4

v2.2.4では、構造一覧表の計算式や採点表の入力方式を変更せず、参照文書と任意のAIアシスタントの検索・安全動作を改善しました。既存の構造一覧表結果を再計算する必要はありません。

五言語の参照文書は各言語の専門用語を使用し、画面タイトルと文書順序は符号化・解釈の流れに沿っています。符号化・解釈アシスタントはExner CS範囲外の質問や非公開情報を求める要求には回答せず、要求が過度に繰り返された場合は少し待つよう案内します。詳細は[v2.2.4パッチノート](./v2-nextjs/releases/v2.2.4/)で確認できます。

採点開始方法を選ぶダイアログ、参照文書の読みやすさ、符号化アシスタントのスクロール表示も調整しました。

## v2.2.3

v2.2.3では、計算式や画面配置を変えずに、五言語の検索・リンクプレビュー情報とAI回答評価への過剰な送信に対する防御を改善しました。既存の構造一覧表結果を再計算する必要はありません。

検索・共有用のホームタイトルは、すべての言語で`Yes, U Can!`に統一しました。説明文には、会員登録、インストール、支払いが不要なオープンソースのエクスナー・ロールシャッハ包括システム構造一覧表計算機であり、専門家の臨床判断に代わるものではないことを記載しました。高評価・低評価のフィードバックでは会話本文を保存せず、過度に大きい送信や頻繁な送信は受け付けません。変更内容と個人情報の説明は、[v2.2.3パッチノート](./v2-nextjs/releases/v2.2.3/)で確認できます。

## v2.2.2

v2.2.2では、Cnを含める計算と含めない計算の境界を修正しました。慣例的な表示名`FC:CF+C`の右辺は`CF+C+Cn`ですが、このアプリが採用するWSumC、S-CON第7基準、Color-Shading計算ではCnを除きます。**完成したプロトコルのCn表示値はv2.2.1ですでに正しく計算されていたため、この点だけを理由に再計算する必要はありません。** また、形態水準（FQ）が未入力の未完成行がGHRまたはPHRに暫定分類されないようにしました。

各指標にはエクスナー包括システムの定義を適用し、他のプログラムや体系の表記と動作をそのまま計算に混在させません。左サイドバーは完全に不透明になりました。

## v2.2.1

v2.2.1では、画面や入力項目を変えず、アプリが表示する**Upper Section, Lower Section, Special Indices**の計算を修正しました。D/AdjDの極端値、EBPer表示条件、GHR/PHRの判定順序、WDA%とAfrの0除算処理、`FC:CF+C`右辺へのCn算入を修正しました。

計算境界は、エクスナー包括システムの規則と完成済みの構造一覧表例に従います。

## v2.2.0

v2.2.0は、デスクトップ画面の主要メニューを左サイドバーにまとめ、解釈アシスタントを一般的なAI会話画面に近づけた最初のv2.2.xリリースです。回答停止、メッセージのコピーと評価、会話領域内のスクロール、参照文書、バージョン記録、採点表の拡大・縮小と移動も整理しました。

AIアシスタントがエクスナー包括システム以外へ回答範囲を広げないよう制限しました。v2.2.1とv2.2.2で公開したD/AdjD、EBPer、GHR/PHR、Cn境界の修正は、現在のバージョンにもすべて反映されています。

## [v2] バージョン2リリース記録

- **[2026-08-21] v2.2.11（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.2.11/README.ja.md) [ソースコード](./v2-nextjs/source/)
- **[2026-08-08] v2.2.10（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.2.10/README.ja.md) [ソースコード](./v2-nextjs/source/)
- **[2026-08-01] v2.2.9（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.2.9/README.ja.md) [ソースコード](./v2-nextjs/source/)
- **[2026-07-31] v2.2.8（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.2.8/README.ja.md) [ソースコード](./v2-nextjs/source/)
- **[2026-07-23] v2.2.7（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.2.7/README.ja.md) [ソースコード](./v2-nextjs/source/)
- **[2026-07-20] v2.2.6（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.2.6/README.ja.md) [ソースコード](./v2-nextjs/source/)
- **[2026-07-19] v2.2.5（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.2.5/README.ja.md) [ソースコード](./v2-nextjs/source/)
- **[2026-07-18] v2.2.4（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.2.4/) [ソースコード](./v2-nextjs/source/)
- **[2026-07-17] v2.2.3（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.2.3/) [ソースコード](./v2-nextjs/source/)
- **[2026-07-16] v2.2.2（ホットフィックス）** [パッチノート](./v2-nextjs/releases/v2.2.2/) [ソースコード](./v2-nextjs/source/)
- **[2026-07-15] v2.2.1（ホットフィックス）** [パッチノート](./v2-nextjs/releases/v2.2.1/) [ソースコード](./v2-nextjs/source/)
- **[2026-07-14] v2.2.0（マイナーリリース）** [パッチノート](./v2-nextjs/releases/v2.2.0/) [ソースコード](./v2-nextjs/source/)
- **[2026-07-13] v2.1.10（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.1.10/) [ソースコード](./v2-nextjs/source/)
- **[2026-07-12] v2.1.9（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.1.9/) [ソースコード](./v2-nextjs/source/)
- **[2026-07-11] v2.1.8（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.1.8/) [ソースコード](./v2-nextjs/source/)
- **[2026-07-05] v2.1.7（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.1.7/) [ソースコード](./v2-nextjs/source/)
- **[2026-07-04] v2.1.6（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.1.6/) [ソースコード](./v2-nextjs/source/)
- **[2026-07-03] v2.1.5（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.1.5/) [ソースコード](./v2-nextjs/source/)
- **[2026-07-02] v2.1.4（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.1.4/) [ソースコード](./v2-nextjs/source/)
- **[2026-06-29] v2.1.3（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.1.3/) [ソースコード](./v2-nextjs/source/)
- **[2026-06-28] v2.1.2（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.1.2/) [ソースコード](./v2-nextjs/source/)
- **[2026-06-27] v2.1.1（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.1.1/) [ソースコード](./v2-nextjs/source/)
- **[2026-06-22] v2.1.0（マイナーリリース）** [パッチノート](./v2-nextjs/releases/v2.1.0/) [ソースコード](./v2-nextjs/source/)
- **[2026-06-11] v2.0.3（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.0.3/) [ソースコード](./v2-nextjs/source/)
- **[2026-05-21] v2.0.2（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.0.2/) [ソースコード](./v2-nextjs/source/)
- **[2026-04-27] v2.0.1（バグ修正）** [パッチノート](./v2-nextjs/releases/v2.0.1/) [ソースコード](./v2-nextjs/source/)
- **[2026-02-15] v2.0.0（メジャーリリース）** [パッチノート](./v2-nextjs/releases/v2.0.0/) [ソースコード](./v2-nextjs/source/)

## v1 GASの使用方法

1. 使用したいバージョンの`パッチノート/ソースコード`リンクを開きます。
2. `source/`フォルダ内の`Code.gs`、`index.html`、`styles.html`を確認します。
3. Google Apps Scriptプロジェクトを作り、同じ名前のファイルを追加して内容を貼り付けます。
4. GASウェブアプリとしてデプロイするか、各リリースの`デプロイリンク`からそのバージョンを直接実行します。

## [Google Apps Script] バージョン1リリース記録

- **[2026-01-07] v1.4.1（バグ修正）** [デプロイ](https://script.google.com/macros/s/AKfycbxMCx13pkrSzFs8f2qXfmxy2LRhkBpZTItFTIfEOoOi-zwurbysnKGfDIYtAeEdQP99/exec) [パッチノート/ソースコード](./v1-gas/releases/v1.4.1/)
- **[2026-01-03] v1.4.0（マイナーリリース）** [デプロイ](https://script.google.com/macros/s/AKfycbxWtI1q27rXuH4feBEGpoy0fIhXZU0ROJ2gRv5RbaQVPxnNgznTI9czHDrVzaS7wSMM/exec) [パッチノート/ソースコード](./v1-gas/releases/v1.4.0/)
- **[2025-12-24] v1.3.3（バグ修正）** [デプロイ](https://script.google.com/macros/s/AKfycbyMG31uNG0mPIdyrzQ_86CSuSaACpFoOqy-kZGXk0uV7L92jBFAJijt1kV6nLMzcO2N/exec) [パッチノート/ソースコード](./v1-gas/releases/v1.3.3/)
- **[2025-11-27] v1.3.2（バグ修正）** [デプロイ](https://script.google.com/macros/s/AKfycbxbuGLdEaj0mW6eIB5QHTax86b9FcKrsfLogy0wDLauJPwbbkQC5BHey0j_ERqXtVqE/exec) [パッチノート/ソースコード](./v1-gas/releases/v1.3.2/)
- **[2025-11-26] v1.3.1（バグ修正）** [デプロイ](https://script.google.com/macros/s/AKfycbwOQ61Y34-iVRKB0T3isOVRzFP9xhxtQMrLZoRvVbS6PwSfEaFYzWvjuTF8IItY2p-T/exec) [パッチノート/ソースコード](./v1-gas/releases/v1.3.1/) [使用方法の動画](https://youtu.be/GH145Wwh-YA)
- **[2025-11-25] v1.3.0（マイナーリリース）** [デプロイ](https://script.google.com/macros/s/AKfycbyethWbTOltcalcWo-kyXtunNSoJNMyKdKs_y7AYfV6bPE2R09ONcaCtDHSTvXTukE/exec) [パッチノート/ソースコード](./v1-gas/releases/v1.3.0/)
- **[2025-11-21] v1.2.1（バグ修正）** [デプロイ](https://script.google.com/macros/s/AKfycbw6n2R3LgAncLvoXmin89SodbHB6brREdaxFfK2yHADdZelEskafqLH35xL0LFvSqMv/exec) [パッチノート/ソースコード](./v1-gas/releases/v1.2.1/)
- **[2025-11-20] v1.2.0（マイナーリリース）** [デプロイ](https://script.google.com/macros/s/AKfycbwD7zBLaAzC5r4VjH1yt7gxfG98vvBp4gsaC3VFQW0bCwe6MNfVXmR8LIjUEpIkTZTE/exec) [パッチノート/ソースコード](./v1-gas/releases/v1.2.0/)
- **[2025-10-25] v1.1.2（バグ修正）** [デプロイ](https://script.google.com/macros/s/AKfycbxn8zeFQalOvh-jnZ_-REjafG2kCT1RkjyJvUahtCkXVyn6PJs9xJLZ0basm5kKEO4j2A/exec) [パッチノート/ソースコード](./v1-gas/releases/v1.1.2/)
- **[2025-10-24] v1.1.1（バグ修正）** [デプロイ](https://script.google.com/macros/s/AKfycbw6XZZ7D3qiCeSsJPG6aj3DzMMPdA2p0kWhT8WU21WGVFqUltOmAXs3zOx4kXw2u5ul6Q/exec) [パッチノート/ソースコード](./v1-gas/releases/v1.1.1/)
- **[2025-10-23] v1.1.0（マイナーリリース）** [デプロイ](https://script.google.com/macros/s/AKfycbw2J6gd4Sf_Tjx6s9GdQrWu4b_tOtqwFLtKJCs-vSFRR0c4NZ0Mlb5UFm7-V9zkBPzitg/exec) [パッチノート/ソースコード](./v1-gas/releases/v1.1.0/)
- **[2025-10-20] v1.0.4（ホットフィックス）** [デプロイ](https://script.google.com/macros/s/AKfycbw1GLfIvehoz4wAzC4LicjD_oB0Dpy_sLJ30da9qobx5X4wa3nJr0pLewV0lVPPv1ptGw/exec) [パッチノート/ソースコード](./v1-gas/releases/v1.0.4/)
- **[2025-10-18] v1.0.3（バグ修正）** [デプロイ](https://script.google.com/macros/s/AKfycbzoiaofs_I5Ue4p7Eo5XQp0OmUtmbbqkpJuwD-FQ1R4PLscULJB_AHVBb-VylICEKJB1A/exec) [パッチノート/ソースコード](./v1-gas/releases/v1.0.3/)
- **[2025-10-18] v1.0.2（ホットフィックス）** [デプロイ](https://script.google.com/macros/s/AKfycbwtBFge9jPS03Mz4QD5IlUDfHOetaVGsIe48y9dZESkfWtsJ-dnYv9S5iZ_4wxx4dCOUw/exec) [パッチノート/ソースコード](./v1-gas/releases/v1.0.2/)
- **[2025-10-17] v1.0.1（ホットフィックス）** [デプロイ](https://script.google.com/macros/s/AKfycbwNNeJsgRx0sEnZO4X9XxEUEthQlVS3Ttk6k_OSmIj8aTPlpdBQV1653hmBtzLnVX8Q/exec) [パッチノート/ソースコード](./v1-gas/releases/v1.0.1/)
- **[2025-10-16] v1.0.0（メジャーリリース）** [デプロイ](https://script.google.com/macros/s/AKfycbxYTxqKcmRNJhpE8eCGTBZPyUFVJIRQiUTbyW48lJKg2E7Bgc5RKSitdDTVcE3bzk07JA/exec) [パッチノート/ソースコード](./v1-gas/releases/v1.0.0/)
