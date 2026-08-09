# v2 Next.js

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

このフォルダーには、ロールシャッハ構造一覧表計算機v2のリリース履歴と公開ソースコードがあります。最新の変更内容はパッチノートで、計算根拠は文献案内で確認できます。

- 最新のパッチノート：[v2.2.10パッチノート](./releases/v2.2.10/README.ja.md)
- 計算根拠と文献範囲：[計算根拠と文献範囲](./methodology/reference-audit-v2.2.10/README.ja.md)
- 最初のv2リリースノート：[v2.0.0パッチノート](./releases/v2.0.0/)
- 公開ソースコード：[バージョン2のソースコード](./source/)

## 公開範囲

`source/`には、アプリの実行に必要なソースコード、翻訳ファイル、公開参照文書があります。

任意のAI機能は、利用者自身のOpenAI APIキーを接続して使用します。APIキーは暗号化された状態で最長24時間だけ保持され、AI接続を終了すると削除され、長期のアカウント情報としては保存されません。

<details>
<summary><strong>ソースをローカルで実行する方法</strong></summary>

```bash
cd v2-nextjs/source
npm install
cp .env.example .env.local
npm run build
```

</details>
