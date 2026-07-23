# v2 Next.js

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

This directory contains the release history and publicly shareable source code for v2 of the Rorschach Structural Summary calculator. The patch notes describe the latest changes, while the public source contains calculation-verification and implementation materials.

- Latest patch note: [releases/v2.2.7](./releases/v2.2.7/README.en.md)
- Calculation-accuracy re-audit: [source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md](./source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md)
- Initial v2 release note: [releases/v2.0.0](./releases/v2.0.0/)
- Public source code: [source](./source/)

## Public scope

`source/` contains the core source code required to run and review the application, translation files, the compact reference corpus searched by the AI assistants, automated checks, and deployment configuration.

It does not contain production environment variables, Vercel project settings, local logs, caches, `node_modules`, historical experimental operations documents, private working notes, or the history of database migrations. The public source makes the core behavior and design reviewable, but it is not a copy of the complete production environment.

<details>
<summary><strong>Running the source locally</strong></summary>

```bash
cd v2-nextjs/source
npm install
cp .env.example .env.local
npm run build
```

To use the optional AI features, each user must enter their own OpenAI API key in the application's BYOK session. User API keys are not stored in the server database.

</details>
