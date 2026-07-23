# v2 Next.js

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

このフォルダーには、ロールシャッハ構造一覧表計算機v2のリリース履歴と公開可能なソースコードがあります。最新の変更内容はパッチノートで、計算検証と実装に関する資料は公開ソースで確認できます。

- 最新のパッチノート：[releases/v2.2.7](./releases/v2.2.7/README.ja.md)
- 計算精度の再監査：[source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md](./source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md)
- 最初のv2リリースノート：[releases/v2.0.0](./releases/v2.0.0/)
- 公開ソースコード：[source](./source/)

## 公開範囲

`source/`には、アプリの実行と検討に必要な中核ソースコード、翻訳ファイル、AIが検索する短い参照文書群、自動検査、デプロイ設定を収録しています。

本番環境変数、Vercelプロジェクト設定、ローカルログ、キャッシュ、`node_modules`、過去の実験的な運用文書、非公開の作業ノート、データベース移行履歴は収録していません。公開ソースから中核となる動作と設計を確認できますが、本番環境全体を複製したものではありません。

<details>
<summary><strong>ソースをローカルで実行する方法</strong></summary>

```bash
cd v2-nextjs/source
npm install
cp .env.example .env.local
npm run build
```

任意のAI機能を使用するには、利用者自身のOpenAI APIキーをWebアプリのBYOKセッションに入力する必要があります。利用者のAPIキーをサーバーのデータベースに保存する構成ではありません。

</details>
