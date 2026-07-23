# エクスナー・ロールシャッハ包括システム構造一覧表計算機

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

`エクスナー・ロールシャッハ包括システム構造一覧表計算機`の公開ソースおよびリリースアーカイブです。関連文書に基づくAIアシスタントは、任意で利用できる機能として提供しています。

このリポジトリは、公開済みバージョンのパッチノートとソースコードを収録しています。v1はGoogle Apps Scriptウェブアプリ、v2はNext.jsウェブアプリとして整理しています。

MOW（モオ）は、ウェブアプリの企画、制作、配布、運用、保守を担当します。ソウル臨床心理研究所（Seoul Institute of Clinical Psychology, SICP）は、初期の計算ロジック移植の確認、計算結果の照合、実使用の観点からの臨床的検討を担当します。

謝辞と初期の学習参考資料は、[ACKNOWLEDGEMENTS.md](./ACKNOWLEDGEMENTS.ja.md)にまとめています。

## 文書と言語

各パッチノートには、バージョンごとの変更内容、影響を受ける可能性がある条件、既存結果を再計算する必要があるかどうか、確認に用いた根拠を記録しています。

- 文書内容の正本は韓国語版です。
- 人が読む公開案内とパッチノートには、[English](./README.en.md)、[日本語](./README.ja.md)、[Español](./README.es.md)、[Português (Brasil)](./README.pt-BR.md)の各版を用意します。
- ウェブアプリの画面は、韓国語、英語、日本語、スペイン語、ポルトガル語の5言語に対応しています。
- 正本を変更したときは、四つの翻訳版にある数値、式、リンク、バージョン、日付も更新されたか自動的に確認します。
- コマンド、ファイルパス、API名、モデル名など、正確な識別が必要な名称は原文を保ち、必要に応じて意味を説明します。

## 公開している内容

- [Next.js] 公開ウェブアプリ: [exner.yesucan.co.kr](https://exner.yesucan.co.kr)
- [Next.js] バージョン2の最新リリース: [v2-nextjs/releases/v2.2.7](./v2-nextjs/releases/v2.2.7/README.ja.md)
- [Next.js] v2.2.2の計算精度再点検: [v2-nextjs/source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md](./v2-nextjs/source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md)
- [Next.js] v2.2.2のCn説明と5言語でのGPT-5.5実呼び出し検査: [v2-nextjs/source/docs/ai-evals/2026-07-17-v2.2.2-live-eval-report.md](./v2-nextjs/source/docs/ai-evals/2026-07-17-v2.2.2-live-eval-report.md)
- [Next.js] v2.2.0のUI検証: [v2-nextjs/source/docs/ops/2026-07-14-v2.2.0-workspace-shell-validation.md](./v2-nextjs/source/docs/ops/2026-07-14-v2.2.0-workspace-shell-validation.md)
- [Next.js] v2.2.0のAI回答範囲の検証: [v2-nextjs/source/docs/ai-evals/2026-07-15-v2.2.0-exner-domain-boundary-report.md](./v2-nextjs/source/docs/ai-evals/2026-07-15-v2.2.0-exner-domain-boundary-report.md)
- [Next.js] v2.1.2のAI回答制御に関する事例: [docs/case-studies/v2.1.2-ai-harness.md](./docs/case-studies/v2.1.2-ai-harness.md)
- [Next.js] AI回答品質検査の案内: [v2-nextjs/source/docs/ai-evals/README.md](./v2-nextjs/source/docs/ai-evals/README.md)
- [Next.js] AI回答を人が確認するための評価基準: [v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md](./v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md)
- [Next.js] バージョン2のリリース記録: [v2-nextjs/releases](./v2-nextjs/releases/)
- [Next.js] バージョン2の公開ソースコード: [v2-nextjs/source](./v2-nextjs/source/)
- [Google Apps Script] バージョン1のリリース記録: [v1-gas/releases](./v1-gas/releases/)
- 最新のv1実行版: [v1.4.1 デプロイ](https://script.google.com/macros/s/AKfycbxMCx13pkrSzFs8f2qXfmxy2LRhkBpZTItFTIfEOoOi-zwurbysnKGfDIYtAeEdQP99/exec)
- 最新のv1ソースコード: [v1-gas/current](./v1-gas/current/)

## v2.1.xにおけるAI品質改善の流れ

v2.1.xでは、AIアシスタントが回答を最後まで作成するか、質問に合う参照文書を探せるか、臨床家の判断を代行しないか、個人情報を残さないかを段階的に改善しました。同じ作業を繰り返したのではなく、実使用で新たに見つかった問題を次のパッチで修正しました。

- **v2.1.2-v2.1.6:** 回答の長さ、中断検知、会話文脈、臨床的限界、自動検査基準を整理しました。
- **v2.1.7:** README、変更記録、リリースノートの形式と公開範囲を整理しました。
- **v2.1.8:** 五言語の参照文書を再確認し、AIアシスタントが検索する資料をすべて更新しました。
- **v2.1.9:** 短い符号や複数言語の質問でも、適切な参照文書をより安定して探せるようにしました。
- **v2.1.10:** 残っていた日本語の符号認識、広い解釈質問、新規データベース設定の問題を修正しました。

v2.1.8からv2.1.10までの関連作業は、各パッチノートに分けて記録しています。

## v2.2.7

v2.2.7では、採点表の三つの未完成の入力が計算に進まないようにしました。位置の選択肢から単独の`S`を削除し、白地を使う反応を常に`WS`、`DS`、`DdS`として記録するようにしました。同じ運動系列の符号を一つの反応に重複して入力できないようにし、形態水準を空欄のままでは計算できないようにしました。すべての反応が純粋形態（`F`）である記録のLambdaは、無限大記号ではなく純粋Fの個数として報告します。

規則どおり入力してきた既存のプロトコルを再計算する必要はありません。過去の自動保存データに該当する値が残っている場合、アプリは元のデータを保持したまま計算を止め、確認が必要な行を五言語で知らせます。五言語の参照文書が同じ臨床規則を記述しているかを自動的に検査する規則リストも導入しました。詳細は[v2.2.7パッチノート](./v2-nextjs/releases/v2.2.7/README.ja.md)で確認できます。

## v2.2.6

v2.2.6では、五言語ページの検索タイトル、説明、正規URL、代替言語情報を画面の言語と一致させました。言語指定のないURLは韓国語に統一し、既存の`?lang=pt` URLを維持しながら、検索エンジンにはブラジルポルトガル語を示す`pt-BR`として伝えます。

また、一部のWindowsブラウザで採点画面の`Alt+マウスホイール`操作が拡大・縮小ではなく画面移動になる問題も修正しました。採点表ヘッダーの説明に現れる項目名は、すべて角括弧で統一しました。構造一覧表の計算式と結果、採点入力、画面配置、AIコーパス、アシスタントの応答規則は変更していないため、既存のプロトコルを再計算する必要はありません。詳細は[v2.2.6パッチノート](./v2-nextjs/releases/v2.2.6/README.ja.md)で確認できます。

## v2.2.5

v2.2.5では、個々の反応に入力する運動決定因と、構造一覧表に表示する運動群の合計を明確に分けました。採点表では、能動・受動の区別がない`M`、`FM`、`m`を選択できなくし、代わりに`Ma`、`Mp`、`Ma-p`などの完全な符号を使用します。構造一覧表の`M`、`FM`、`m`合計と、EB、MQual、W:Mなどの計算は変わりません。

すでに完全な符号を使っている既存プロトコルは再計算する必要がありません。過去の自動保存データに能動・受動の区別がない運動符号が残っている場合、アプリは元の入力を保存したまま計算を止め、確認が必要な行と符号を示します。五言語の参照文書、5,604個の検索ベクトル、365件の検索質問、GPT-5.5の実際の境界質問を再確認しました。影響条件と仮想的なCDI境界例は、[v2.2.5パッチノート](./v2-nextjs/releases/v2.2.5/README.ja.md)で確認できます。

## v2.2.4

v2.2.4では、構造一覧表の計算式や採点表の入力方式を変更せず、人が読む参照文書と任意のAIアシスタントが検索する資料を整理し直しました。既存の構造一覧表結果を再計算する必要はありません。

五言語の用語と文体を各言語の専門資料に照合し、画面タイトルと文書順序を実際の符号化・解釈の流れに合わせました。1,015件の参照文書と5,589個の検索ベクトルを更新し、欠落、古いベクトル、本文ハッシュ不一致はいずれも0件でした。AIアシスタントのExner CS範囲、プロンプトインジェクション拒否、リクエスト回数制限も強化し、五言語で実際のGPT-5.5単一会話・複数会話66件を確認しました。詳細と公開検査資料は、[v2.2.4パッチノート](./v2-nextjs/releases/v2.2.4/)で確認できます。

その後の点検では、採点開始方法の選択、参照文書の読みやすさ、符号化アシスタントのスクロール表示も調整しました。

## v2.2.3

v2.2.3では、計算式や画面配置を変えずに、公開文書、五言語の検索・リンクプレビュー情報、AI回答評価データベースへの過剰な送信に対する防御を整理しました。既存の構造一覧表結果を再計算する必要はありません。

検索・共有用のホームタイトルは、すべての言語で`Yes, U Can!`に統一しました。説明文には、会員登録、インストール、支払いが不要なオープンソースのエクスナー・ロールシャッハ包括システム構造一覧表計算機であり、専門家の臨床判断に代わるものではないことを記載しました。高評価・低評価のフィードバックでは会話本文を保存しない従来の方針を保ちながら、リクエストサイズとセッションごとの送信回数を制限しました。日付表記の整理とセキュリティ境界は、[v2.2.3パッチノート](./v2-nextjs/releases/v2.2.3/)で確認できます。

## v2.2.2

v2.2.2では、Cnを含める計算と含めない計算を分けて再確認しました。慣例的な表示名`FC:CF+C`の右辺は`CF+C+Cn`ですが、このアプリが採用するWSumC、S-CON第7基準、Color-Shading計算ではCnを除きます。**完成したプロトコルのCn表示値はv2.2.1ですでに正しく計算されていたため、この点だけを理由に再計算する必要はありません。** また、形態水準（FQ）が未入力の未完成行がGHRまたはPHRに暫定分類されないようにしました。

2019年のExcel、RorScore原プログラム、v1 GAS、現行v2コード、CHESSSS、RAP3、RIAP5は、それぞれ確認できる範囲が異なるため、いずれか一つだけを正解とはしませんでした。計算・機能検査376件、AI回答基準検査101件、配布用画面生成222件を通過し、5言語のCn質問10件と代表質問5件も実際のGPT-5.5呼び出しで確認しました。UI変更は左サイドバーを完全に不透明にしたことだけで、モバイル専用の最適化は後続のv2.2.xで続けます。

## v2.2.1

v2.2.1では、UI/UXや入力項目を変えず、アプリが表示する**Upper Section, Lower Section, Special Indices**の計算を修正しました。D/AdjDの極端値、EBPer表示条件、GHR/PHRの判定順序、WDA%とAfrの0除算処理、`FC:CF+C`右辺へのCn算入を修正しました。

初期v1開発で参照した2019年Excelの公開配布場所と役割も初めて明記しました。同じ符号に異なる言語のメモを入れた計算25件、同一条件で繰り返せる仮想プロトコル2,000件、実際のGPT-5.5符号化・解釈呼び出しで修正結果を確認しました。

## v2.2.0

v2.2.0は、デスクトップ画面の主要メニューを左サイドバーにまとめ、解釈アシスタントを一般的なAI会話画面に近づけた最初のv2.2.xリリースです。回答停止、メッセージのコピーと評価、会話領域内のスクロール、参照文書、バージョン記録、採点表の拡大・縮小と移動も整理しました。

GPT-5.5アシスタントがエクスナー包括システム以外へ回答範囲を広げないよう制限し、韓国語・日本語・英語の質問で実際のAPI呼び出しを確認しました。v2.2.0で点検した計算式のうち追加修正が必要だった項目は、v2.2.1とv2.2.2で修正しました。そのため、UI/UX変更の記録はv2.2.0、現在の計算基準はv2.2.2の計算文書で確認できます。モバイル画面は後続のv2.2.xで別に調整します。

## [Next.js] バージョン2リリース記録

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

<details>
<summary><strong>開発者がv2ソースを直接実行する方法</strong></summary>

1. [v2-nextjs/source](./v2-nextjs/source/)フォルダを開きます。
2. `npm install`で依存関係をインストールします。
3. `.env.example`を参照してローカル環境変数ファイルを作成します。
4. `npm run build`または`npm run dev`でアプリを確認します。

公開リポジトリには、実際の運用環境変数、Vercel設定、ローカルログ、キャッシュ、非公開作業ノートは含まれていません。

</details>

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
- **[2025-10-19] v1.0.2（ホットフィックス）** [デプロイ](https://script.google.com/macros/s/AKfycbwtBFge9jPS03Mz4QD5IlUDfHOetaVGsIe48y9dZESkfWtsJ-dnYv9S5iZ_4wxx4dCOUw/exec) [パッチノート/ソースコード](./v1-gas/releases/v1.0.2/)
- **[2025-10-17] v1.0.1（ホットフィックス）** [デプロイ](https://script.google.com/macros/s/AKfycbwNNeJsgRx0sEnZO4X9XxEUEthQlVS3Ttk6k_OSmIj8aTPlpdBQV1653hmBtzLnVX8Q/exec) [パッチノート/ソースコード](./v1-gas/releases/v1.0.1/)
- **[2025-10-16] v1.0.0（メジャーリリース）** [デプロイ](https://script.google.com/macros/s/AKfycbxYTxqKcmRNJhpE8eCGTBZPyUFVJIRQiUTbyW48lJKg2E7Bgc5RKSitdDTVcE3bzk07JA/exec) [パッチノート/ソースコード](./v1-gas/releases/v1.0.0/)
