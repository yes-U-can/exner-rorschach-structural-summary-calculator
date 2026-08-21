# v2 Next.js

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

This directory contains the release history and public source code for v2 of the Rorschach Structural Summary calculator. The patch notes describe the latest changes, and the literature guide explains the calculation sources.

- Latest patch note: [v2.2.11 patch note](./releases/v2.2.11/README.en.md)
- Calculation sources and literature scope: [calculation sources and literature scope](./methodology/reference-audit-v2.2.10/README.en.md)
- Initial v2 release note: [v2.0.0 patch note](./releases/v2.0.0/)
- Public source code: [version 2 source code](./source/)

## Public scope

`source/` contains the source code, translations, and public reference documents required to run the application.

The optional AI features use the user's own OpenAI API key. The key is kept in encrypted form for no more than 24 hours, deleted when the AI connection ends, and not retained as a long-term account record.

<details>
<summary><strong>Running the source locally</strong></summary>

```bash
cd v2-nextjs/source
npm install
cp .env.example .env.local
npm run build
```

</details>
