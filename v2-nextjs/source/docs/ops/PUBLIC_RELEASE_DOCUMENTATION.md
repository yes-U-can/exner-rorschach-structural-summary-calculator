# Public Release Documentation Standard

Status: Active
Owner: Product + Engineering
Last Updated: 2026-07-13

## Purpose

This project keeps a private production repository and a public showcase archive. The public archive is not a raw dump of the production repository. It is a curated record that lets readers understand what changed, why it mattered, how it was verified, and which privacy boundaries were preserved.

This standard exists so release notes, README files, version archive entries, and public evidence documents stay consistent across releases.

## Scope

This standard applies to:

1. public-facing release notes under `exner-rorschach-structural-summary-calculator/v2-nextjs/releases/*/README.md`
2. public showcase navigation files such as `exner-rorschach-structural-summary-calculator/README.md`, `CHANGELOG.md`, and `v2-nextjs/README.md`
3. app version archive entries in `lib/versionArchive.ts`
4. release evidence summaries that are intended for public showcase use

This standard does not require every technical artifact under `v2-nextjs/source/` to be rewritten into one language. Source code, test names, command names, JSON keys, model IDs, API names, and raw tool output summaries may keep their original English form when that preserves technical accuracy.

## Language Coverage Policy

The language policy is based on the reader and maintenance cost, not on a single preferred language.

1. App-facing user experience can be localized into the five supported app languages: Korean, English, Japanese, Spanish, and Portuguese.
2. Public release notes and CHANGELOG entries use Korean as the canonical record because the project owner, release decisions, and operational review happen in Korean.
3. The top-level public showcase entry point should provide an English companion summary when the repository is meant to be understandable to global GitHub visitors.
4. Technical evidence documents may preserve English when they are generated artifacts, eval reports, or engineering records.
5. Do not maintain five-language release notes by default. That creates avoidable drift unless the localized documents are themselves part of the product deliverable.
6. Technical identifiers keep their original English names.
7. Dates must be absolute dates in `YYYY-MM-DD` format. Use the actual release date in Asia/Seoul when the release crosses midnight locally.

The default public archive language model is therefore:

- Korean canonical release notes
- Korean CHANGELOG
- Korean root README plus an English companion overview when useful
- original-language technical artifacts under `source/`
- five-language localization only for app user-facing content

## Release Note Shape

Use this structure for the Korean canonical public v2 Next.js release note:

```md
# [YYYY-MM-DD] vX.Y.Z 버그 패치

## 요약

한두 문단으로 이번 릴리즈의 목적과 사용자에게 중요한 의미를 설명합니다.

## 핵심 요약

- 사용자가 이해해야 하는 변경점
- 품질, 보안, 문서, 검증 기준의 변화
- UI/UX를 건드리지 않았으면 명시

## 검증

실제로 통과한 명령과 확인 내용을 적습니다.

## 공개 범위와 보안 경계

공개 아카이브에 포함한 것과 제외한 것을 적습니다.
```

Patch notes can add a short extra section when needed, but the four sections above are the default.

## Required Content

Every public-facing release record must answer these questions:

1. What changed?
2. Why was it worth a release?
3. Did the app UI/UX change?
4. What commands or checks passed?
5. Which public files were updated?
6. What secrets, raw prompts, raw model answers, private payloads, and local runtime files were excluded?

For AI-related releases, also state whether the release changed runtime assistant behavior, evaluation harnesses, or only documentation/governance.

## Version-Line Closure Wording

Release documents must distinguish between closing a specific engineering scope and ending an entire version line.

1. Do not call a patch the "last" or "final" patch of a version line unless the version line has been explicitly frozen as a release decision.
2. Prefer scope-specific wording such as "closes the initial harness scope", "completes the corpus recalibration batch", or "records the final pass of this eval run".
3. `final-pass` may describe a particular eval artifact or release candidate. It must not imply that no later corrective release can exist.
4. If later user testing or an independent audit justifies more work in the same version line, add a dated retrospective scope note to the earlier record instead of silently deleting the old claim.
5. A retrospective note must identify what the earlier release actually completed and why the later release became necessary. Historical metrics and verification results remain unchanged unless separately corrected with evidence.

## Public Archive Update Checklist

When preparing a release:

1. Add or update the app version in `package.json`, `package-lock.json`, footer version display, and `lib/versionArchive.ts`.
2. Add the new release entry at the top of the public README release list.
3. Add the new release row at the top of the public `CHANGELOG.md` table.
4. Update `v2-nextjs/README.md` so the latest patch note points to the new release.
5. Add `v2-nextjs/releases/vX.Y.Z/README.md`.
6. Update the English companion overview when the public repo's positioning, latest release, or key evidence links change.
7. Ensure public-facing release text follows the language coverage policy and stays technically precise.
8. Ensure public source mirror excludes `.env*`, `.vercel/`, `node_modules/`, runtime logs, local caches, private work notes, API keys, and raw model output.

## Agent Rule

Before writing a public release note, an AI coding assistant must read:

1. this standard
2. the latest two release notes
3. the current public README and CHANGELOG

If the assistant finds a conflict between old release-note style and this standard, it must follow this standard and mention the inconsistency in its implementation summary.
