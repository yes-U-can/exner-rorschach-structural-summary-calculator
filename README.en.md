# exner-sicp

Public showcase and release archive for the Rorschach Structural Summary calculator.

This repository publishes curated release notes and source snapshots for the project. Version 1 was built with Google Apps Script, and version 2 is a Next.js web app.

## Documentation Language Policy

The archive uses a purpose-based language policy:

- Korean is the canonical language for release notes and CHANGELOG entries.
- This English overview exists so global GitHub visitors can quickly understand the repository.
- The deployed web app supports five user-facing languages: Korean, English, Japanese, Spanish, and Portuguese.
- Release notes are not duplicated into all five languages by default, because repeated manual translations can drift over time.
- Command names, file paths, API names, model IDs, and test names keep their original English identifiers.
- Technical evidence under `v2-nextjs/source/` may preserve its original artifact language.

The detailed public release documentation standard is kept at [`v2-nextjs/source/docs/ops/PUBLIC_RELEASE_DOCUMENTATION.md`](./v2-nextjs/source/docs/ops/PUBLIC_RELEASE_DOCUMENTATION.md).

## Current Archive

- Latest v2 release note: [`v2-nextjs/releases/v2.1.7`](./v2-nextjs/releases/v2.1.7/)
- v2 public source snapshot: [`v2-nextjs/source`](./v2-nextjs/source/)
- AI quality gate docs: [`v2-nextjs/source/docs/ai-evals/README.md`](./v2-nextjs/source/docs/ai-evals/README.md)
- AI human rubric: [`v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md`](./v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md)
- v1 GAS archive: [`v1-gas/releases`](./v1-gas/releases/)

## v2.1.7

v2.1.7 is a documentation governance patch. It does not change the app UI/UX or assistant runtime behavior.

The release formalizes how public release notes, README files, version archive entries, and AI evaluation evidence should be written and reviewed. It also updates the public archive navigation so the latest v2.1.x records are connected consistently.

## Privacy Boundary

This public archive does not include production environment variables, API keys, Vercel local state, runtime logs, local caches, private work notes, raw AI prompts, raw model answers, or private assessment payloads.
