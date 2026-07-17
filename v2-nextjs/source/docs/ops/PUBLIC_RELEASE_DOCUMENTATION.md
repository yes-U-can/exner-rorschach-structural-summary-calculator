# Public Release Documentation Standard

Status: Active
Owner: Product + Engineering
Last Updated: 2026-07-17

## Purpose

This project keeps a private production repository and a public showcase archive. The public archive is not a raw dump of the production repository. It is a curated record that lets readers understand what changed, why it mattered, how it was verified, and which privacy boundaries were preserved.

This standard exists so release notes, README files, version archive entries, and public evidence documents stay consistent across releases.

The primary readers are clinical psychologists who may use the calculator without having software-development knowledge. Public prose must therefore explain the clinical and practical meaning first. Developers and automated readers remain expected secondary readers, so reproducible engineering details should follow after the plain-language explanation instead of being removed.

## Scope

This standard applies to:

1. public-facing release notes under `exner-rorschach-structural-summary-calculator/v2-nextjs/releases/*/README.md`
2. public showcase navigation files such as `exner-rorschach-structural-summary-calculator/README.md`, `CHANGELOG.md`, and `v2-nextjs/README.md`
3. app version archive entries in `lib/versionArchive.ts`
4. release evidence summaries that are intended for public showcase use

This standard does not require source code or machine-readable artifacts under `v2-nextjs/source/` to be rewritten. Test names, command names, JSON keys, model IDs, and API names may keep their original English form when that preserves technical accuracy. Human-readable README files and public reports under `source/` still follow the reader and voice rules below.

## Primary Reader And Voice

Every human-readable public document must be understandable to a clinical psychologist who does not write software.

The original v1 GAS patch notes are the project's writing reference. Their strongest pattern is simple: name the visible problem first, explain the relevant Rorschach concept in ordinary language, show when the problem appears, and then explain what was corrected. The v2 notes should preserve that human, first-hand tone while improving consistency and technical precision.

1. Write in the voice of the project or development team. Natural phrases such as "수정했습니다", "확인했습니다", and "다시 계산할 필요는 없습니다" are preferred over detached audit-report language.
2. Do not write as an AI assistant reporting to its owner, and do not refer to the project owner as "the user".
3. Begin with what readers need to know: where the problem appeared, what changed, which protocols can be affected, whether recalculation is necessary, and what action readers should take.
4. Follow the v1 explanatory order: visible symptom or affected card -> relevant scoring concept -> exact triggering condition -> correction -> verification and limitations.
5. Explain calculation changes with a concrete response or coding example whenever that helps a clinician recognize the affected condition. Make clear that the example is illustrative and that coding remains a clinician's responsibility.
6. Keep the main explanation in ordinary professional language. Terms such as `uncommitted draft`, `Git history`, `runtime`, `regression test`, `fixture`, `contract`, `guardrail`, `workflow`, `production parity`, and `release gate` belong in a technical appendix unless the term itself is essential.
7. When a technical term or identifier is essential, explain it in plain language at first use. A command or variable name must never stand in for the explanation.
8. Verification tools are not the protagonists of a release note. Name an AI model only when the release actually changes or tests that model-facing feature and the fact helps readers understand the result. Never narrate agent-to-agent work allocation, internal approval dialogue, intermediate worktree state, rejected drafts, or changing internal hypotheses.
9. Describe corrections at release level. Write "v2.2.1 corrected X, and v2.2.2 added Y" instead of recounting who first believed, rejected, or rediscovered a claim during development.
10. Preserve historical facts, declared release dates, measurements, failures, and limitations. Improve the explanation without silently rewriting released behavior.
11. Use headings and tables to help readers find the clinical impact first. Detailed commands, file paths, hashes, and reproducibility notes may follow under a clearly labeled technical appendix.

Reader-facing rewrites should follow these examples:

| Avoid | Prefer |
| --- | --- |
| "An uncommitted draft was rejected after an independent audit." | "v2.2.1 already calculated the displayed Cn value correctly. v2.2.2 separated the four Cn calculation boundaries and added a check for incomplete FQ rows." |
| "The project owner approved the final gate." | Omit it. Approval workflow is not a product change. |
| "The user said the workbook came from..." | "The initial v1 implementation used the publicly distributed 2019 workbook as a programming reference." |
| "Two AI systems agreed that the formula was correct." | "The formula was checked against the stated rule, completed Structural Summary examples, program output, and repeatable boundary cases." |
| "A regression contract and production-parity harness passed." | "The same calculation and answer path used by the web app passed repeatable checks." Put exact test names in the technical appendix. |

## Language Coverage Policy

The language policy is based on the reader and maintenance cost, not on a single preferred language.

1. App-facing user experience can be localized into the five supported app languages: Korean, English, Japanese, Spanish, and Portuguese.
2. Public release notes and CHANGELOG entries use Korean as the canonical record because release decisions and operational review for this project happen in Korean.
3. The top-level public showcase entry point should provide an English companion summary when the repository is meant to be understandable to global GitHub visitors.
4. Machine-generated evidence may preserve English. A human-readable introduction or README for that evidence must still explain its purpose in plain language.
5. Do not maintain five-language release notes by default. That creates avoidable drift unless the localized documents are themselves part of the product deliverable.
6. Technical identifiers keep their original English names.
7. Dates must be absolute dates in `YYYY-MM-DD` format. Use the date explicitly declared for the release in Asia/Seoul after accounting for work that crossed midnight locally. A Git commit or push timestamp is supporting evidence, not an automatic replacement for the declared release date.

## Release History Boundary

Public history begins at the released state, not at every draft considered while preparing it.

1. A release note describes what changed between released versions. It does not recount uncommitted drafts, rejected wording, changing internal hypotheses, agent conversations, or the order in which possible solutions were considered.
2. When a released note contains a factual mistake, preserve the released statement and add a dated correction that points to the release where behavior was corrected.
3. When a declared release date is later normalized because a working session crossed midnight, update every archive display consistently and record the normalization once in the CHANGELOG and the release that performs the documentation correction.
4. Do not change report dates, test-run dates, commit timestamps, or source history merely to match a normalized release date. Those dates describe different events.
5. Do not infer a release date solely from Git history. The project declares the release date after reviewing the Asia/Seoul working boundary.

## Version Terminology

1. `X.0.0` is a major release, `X.Y.0` is a minor release, and `X.Y.Z` is a patch release.
2. A hotfix is an urgent patch release, not a fourth numeric level.
3. Existing Korean archive labels such as `메이저 패치`, `마이너 패치`, and `버그 패치` may remain for historical continuity, provided their numeric version changes follow the rules above.

The default public archive language model is therefore:

- Korean canonical release notes
- Korean CHANGELOG
- Korean root README plus an English companion overview when useful
- original-language technical artifacts under `source/`
- five-language localization only for app user-facing content

## Release Note Shape

Use this structure for the Korean canonical public v2 Next.js release note. The headings deliberately continue the style of the v1 GAS patch notes:

```md
# [YYYY-MM-DD] vX.Y.Z 버그 패치

## 주요 수정사항

### 개요

어느 화면에서 어떤 문제가 있었는지, 어떤 자료가 영향을 받을 수 있는지, 기존 결과를 다시 계산해야 하는지를 먼저 설명합니다.

### 세부사항

관련 로샤 개념, 정확한 발동 조건, 구체적인 예, 수정 내용을 순서대로 설명합니다.

## 테스트 및 검증

검산에 사용한 근거와 반복 확인 결과를 비개발자도 이해할 수 있는 말로 설명합니다. 명령어와 파일 경로는 필요한 경우 기술 부록에 적습니다.

## 공개 범위와 보안 경계

공개 아카이브에 포함한 것과 제외한 것을 적습니다.

## 기술 부록

재현에 필요한 명령어, 파일, 수치와 같은 개발 세부 사항을 적습니다.
```

Patch notes can add a short extra section when needed, but the reader-first order above is the default.

## Required Content

Every public-facing release record must answer these questions:

1. What changed?
2. Which completed or incomplete protocols can be affected?
3. Does a reader need to recalculate an existing result or take any other action?
4. Why was it worth a release?
5. Did the app UI/UX, data collection, or privacy behavior change?
6. What evidence and checks support the conclusion, expressed first in plain language?
7. Which public files were updated?
8. What secrets, raw prompts, raw model answers, private payloads, and local runtime files were excluded?

For AI-related releases, also state whether the release changed runtime assistant behavior, evaluation harnesses, or only documentation/governance.

## Version-Line Closure Wording

Release documents must distinguish between closing a specific engineering scope and ending an entire version line.

1. Do not call a patch the "last" or "final" patch of a version line unless the version line has been explicitly frozen as a release decision.
2. Prefer scope-specific wording such as "closes the initial harness scope", "completes the corpus recalibration batch", or "records the final pass of this eval run".
3. `final-pass` may describe a particular eval artifact or release candidate. It must not imply that no later corrective release can exist.
4. If later use reveals more work in the same version line, add a short scope clarification instead of silently deleting the old claim.
5. The clarification must describe releases, not internal deliberation. State what the earlier release completed and which later release added or corrected the remaining behavior. Historical metrics and verification results remain unchanged unless separately corrected with evidence.

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
9. Read the final public prose as a non-developer clinical psychologist: the impact, affected condition, need for recalculation, and limitations must be clear before technical details appear.
10. Remove AI-to-owner reporting language and unexplained internal engineering terms from the main narrative.

## Agent Rule

Before writing a public release note, an AI coding assistant must read:

1. this standard
2. representative v1 notes written in the project's original voice, including `v1.0.1`, `v1.0.2`, `v1.0.4`, and the latest v1 note
3. the latest two v2 release notes
4. the current public README and CHANGELOG

For a repository-wide voice rewrite, the assistant must read the complete v1 GAS release-note series before editing. For a routine new release after that baseline has been established, the representative v1 notes above are sufficient unless the new release revisits an older calculation or historical claim.

The assistant must then perform a plain-language voice review before publication. It must specifically search for third-person references to the project owner and internal-process expressions such as uncommitted work, adversarial audit, independent reproduction, release gate, developer approval, runtime, fixture, and regression contract.

If the assistant finds a conflict between old release-note style and this standard, it must follow this standard and mention the inconsistency in its private implementation summary. That inconsistency does not belong in the public release narrative unless it changes the facts readers need to know.
