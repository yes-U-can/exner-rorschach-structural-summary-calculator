# Public Release Documentation Standard

Status: Active
Owner: Product + Engineering
Last Updated: 2026-08-09

## Purpose

This project keeps a private production repository and a public showcase archive. The public archive is not a raw dump of the production repository. It is a curated record that lets readers understand what changed, why it mattered, whether their existing results are affected, and which privacy boundaries the product preserves.

This standard exists so release notes, README files, version archive entries, and public evidence documents stay consistent across releases.

Public release prose is written first for clinicians. Engineering evidence, publication operations, and internal verification records belong in separate technical or private records, not in the release note.

## Scope

This standard applies to:

1. public-facing release notes under `exner-rorschach-structural-summary-calculator/v2-nextjs/releases/*/README.md`
2. public showcase navigation files such as `exner-rorschach-structural-summary-calculator/README.md`, `CHANGELOG.md`, and `v2-nextjs/README.md`
3. app version archive entries in `lib/versionArchive.ts`
4. release evidence summaries that are intended for public showcase use

This standard does not require source code or machine-readable artifacts under `v2-nextjs/source/` to be rewritten. Test names, command names, JSON keys, model IDs, and API names may keep their original English form when that preserves technical accuracy. Human-readable README files and public reports under `source/` still follow the voice and structure rules below.

## Public Voice And Structure

Every human-readable public document must explain product and calculation changes in clear professional language.

The original v1 GAS patch notes are owner-authored historical originals as well as the project's writing reference. Do not rewrite, modernize, shorten, or otherwise editorialize them. A later non-owner insertion may be reverted only when a preserved owner-authored original proves the exact difference; any other v1 edit requires the owner's explicit approval. Their strongest pattern is simple: name the visible problem first, explain the relevant Rorschach concept in ordinary language, show when the problem appears, and then explain what was corrected. The v2 notes should preserve that human, first-hand tone while improving consistency and technical precision.

1. Write in the voice of the project or development team. Natural phrases such as "수정했습니다", "확인했습니다", and "다시 계산할 필요는 없습니다" are preferred over detached audit-report language.
2. Do not write as an AI assistant reporting to its owner, and do not refer to the project owner as "the user".
3. Begin with the released change: where the problem appeared, what changed, which protocols can be affected, whether recalculation is necessary, and what action is needed.
4. Follow the v1 explanatory order: visible symptom or affected card -> relevant scoring concept -> exact triggering condition -> correction -> verification and limitations.
5. Explain calculation changes with a concrete response or coding example whenever that helps a clinician recognize the affected condition. Make clear that the example is illustrative and that coding remains a clinician's responsibility.
6. Keep the explanation in ordinary professional language. Terms such as `uncommitted draft`, `Git history`, `runtime`, `regression test`, `fixture`, `contract`, `guardrail`, `workflow`, `production parity`, and `release gate` belong in separate developer or private records unless the term itself describes a user-facing product feature.
7. When a technical term or identifier is essential, explain it in plain language at first use. A command or variable name must never stand in for the explanation.
8. Verification tools are not the protagonists of a release note. Name an AI model only when the released product actually uses or changes that model and the fact helps readers understand the product. Never narrate agent-to-agent work allocation, internal approval dialogue, intermediate worktree state, rejected drafts, changing internal hypotheses, test reruns, database preparation, credential cleanup, build gates, or deployment preparation.
9. Describe corrections at release level. Write "v2.2.1 corrected X, and v2.2.2 added Y" instead of recounting who first believed, rejected, or rediscovered a claim during development.
10. Preserve the truth about released product behavior, clinical impact, declared release dates, measurements, and limitations. Correct editorial metadata, ordering, formatting, and inaccurate prose directly and quietly. Git history and private evidence preserve the editing history; the public note must not announce the editing act.
11. Use headings and tables only when they help clinicians understand the change. Detailed commands, file paths, hashes, test counts, build output, and reproducibility procedures belong in separate developer or evidence documents, not in the release note.
12. When a release checks or corrects a calculation, coding boundary, Structural Summary field, or Special Index, identify the bibliographic source, edition, printed page, rule that was checked, affected app output, and repeatable verification. Readers should be able to trace a released conclusion without needing access to the private source collection.
13. Cite printed book pages rather than local PDF viewer pages when printed pagination is available. Do not publish source PDFs, OCR exports, local filenames, acquisition paths, or private hashes. Paraphrase source rules and keep any indispensable quotation brief.

Public rewrites should follow these examples:

| Avoid | Prefer |
| --- | --- |
| "An uncommitted draft was rejected after an independent audit." | "v2.2.1 already calculated the displayed Cn value correctly. v2.2.2 separated the four Cn calculation boundaries and added a check for incomplete FQ rows." |
| "The project owner approved the final gate." | Omit it. Approval workflow is not a product change. |
| "The user said the workbook came from..." | "The initial v1 implementation used the publicly distributed 2019 workbook as a programming reference." |
| "Two AI systems agreed that the formula was correct." | "The formula was checked against the stated rule, completed Structural Summary examples, program output, and repeatable boundary cases." |
| "A regression contract and production-parity harness passed." | "The released calculation was checked against the stated rule and representative boundary cases." Keep exact test names outside the release note. |

## Language Coverage Policy

The public documentation has a five-language reader-facing layer and an original-language technical-evidence layer. This makes the project accessible in every supported app language without turning raw engineering evidence into separately maintained paraphrases.

1. Korean is the canonical source for reader-facing public documentation. The supported companion locales are English, Japanese, Spanish, and Brazilian Portuguese.
2. Every reader-facing document group listed in the public localization manifest must provide all five locale files. This includes public entry README files, CHANGELOG files, acknowledgements, current release notes, and clinician-readable calculation explanations selected for publication.
3. Historical v2 release notes preserve released product facts. When private provenance, agent dialogue, local-environment wording, inaccurate prose, or other internal production notes were published by mistake, edit the reader-facing text directly. Do not add a dated correction banner or describe the cleanup itself. The owner-authored v1 GAS notes remain protected by the stricter rule above.
4. Raw AI evaluation reports, machine-generated evidence, deployment checklists, architecture rules, commands, and source-level technical records may remain in their original technical language. A reader-facing README or summary that introduces those records must be available in all five locales when it is listed in the manifest.
5. Keep one prose language per file. Use separate locale files rather than placing several complete translations in one Markdown document.
6. Translation is not a literal substitution task. Use the approved locale glossary, the existing five-language reference corpus, and professional target-language sources. Preserve Exner notation and explicitly review any term whose established target-language usage is uncertain.
7. Each managed translation records the canonical Korean source hash, glossary version, and review state in the localization manifest. A canonical change makes every companion stale until it is updated and checked again.
8. Technical identifiers, formulas, code symbols, commands, file paths, model IDs, URLs, bibliographic titles, and direct quotations keep their exact original form unless the quotation is separately identified as a translation.
9. Dates must be absolute dates in `YYYY-MM-DD` format. Use the date explicitly declared for the release in Asia/Seoul after accounting for work that crossed midnight locally. A Git commit or push timestamp is supporting evidence, not an automatic replacement for the declared release date.
10. Write exact four-digit technical counts without a thousands separator in every managed locale (for example, `5604`). This prevents a comma from being read as a decimal marker in Spanish or Portuguese while preserving literal cross-locale verification. Do not apply this rule to decimal measurements, dates, versions, formulas, or direct quotations.

### Locale Voice Rules

- Korean public prose uses natural professional `~합니다` style. The compact Korean reference corpus may retain `~다` style.
- English uses direct professional prose and avoids audit-report narration in the reader-facing sections.
- Japanese uses consistent professional `です・ます` style.
- Spanish uses neutral professional Spanish and avoids region-specific colloquialisms.
- Portuguese uses professional Brazilian Portuguese. Do not mix European and Brazilian terminology within one document set.

### Translation Workflow

1. Finalize the Korean canonical document and its release-level facts.
2. Apply the approved terminology glossary before drafting companion files.
3. Draft English, Japanese, Spanish, and Brazilian Portuguese versions without changing dates, numbers, formulas, links, privacy boundaries, or recalculation guidance.
4. Run structural parity checks for headings, links, numeric tokens, inline-code identifiers, and the canonical source hash.
5. Review tone and target-language clinical terminology separately. Model-assisted review is useful, but it does not replace the project's factual source checks or final human approval.
6. Mark the translation set reviewed only after every locale passes both structural and editorial review.

### Cross-Language Release Gate

The public archive keeps the executable localization contract in `docs/localization/`:

- `manifest.json` lists every managed five-language document group and stores the Korean source hash.
- `clinical-terminology.json` protects recurring clinical terms and Exner identifiers.
- `TERMINOLOGY_SOURCES.md` records the target-language sources used to settle recurring terminology.
- `RELEASE_DOCUMENT_WORKFLOW.md` provides the repeatable authoring and independent-review checklist.
- `scripts/verify-public-document-locales.ps1` checks file coverage, source freshness, headings, links, numbers, code identifiers, and review state.

Links between managed reader-facing documents must stay in the reader's current locale. Links to raw evidence and untranslated historical documents keep their canonical target.

For every new public README, changelog, or release note:

1. Finish the Korean facts before translation.
2. Register all five paths with `reviewStatus` set to `draft`.
3. Draft each companion directly from Korean rather than through another translation.
4. Run the checker with `-UpdateHashes -AllowDraft`, then without `-UpdateHashes`.
5. Obtain an independent terminology and prose review based on authoritative sources in each target language.
6. Change the group to `reviewed` only after factual parity and editorial review are both complete.
7. Run the strict checker without `-AllowDraft`. Publication is blocked until it passes.

A changed Korean source hash invalidates the publication batch. Machine checks do not prove that the clinical terminology or prose is natural; that judgment remains a separate review step.

## Search Language Contract

The app keeps its existing `?lang=` URL values (`ko`, `en`, `ja`, `es`, and `pt`) so saved links and in-app navigation remain stable. Search and accessibility metadata use the corresponding language tags `ko`, `en`, `ja`, `es`, and `pt-BR`; Brazilian Portuguese must not be published as generic `pt` in `lang`, `hreflang`, sitemap alternates, or structured data.

The queryless URL is the Korean canonical page. Every indexable page must identify itself as canonical, list all five localized alternatives plus `x-default`, and use the same alternate set in page metadata and the sitemap. Redirect-only compatibility routes and private AI routes must not become separate search results.

## Release History Boundary

Public history begins at the released state, not at every draft considered while preparing it.

1. A release note describes what changed between released versions. It does not recount uncommitted drafts, rejected wording, changing internal hypotheses, agent conversations, or the order in which possible solutions were considered.
2. When a released note contains inaccurate prose, correct the reader-facing statement directly. If a later release changed product behavior, describe that product change in the later release and keep only the clinically necessary cross-version guidance in the older note. Never add a dated editorial correction banner.
3. When a declared release date, archive order, or formatting is corrected, update every public display consistently and quietly. Keep the reason, comparison table, commit-time discussion, and correction history in Git or private evidence, not in README, CHANGELOG, release notes, or app copy.
4. Do not change report dates, test-run dates, commit timestamps, or source history merely to match a normalized release date. Those dates describe different events.
5. Do not infer a release date solely from Git history. The project declares the release date after reviewing the Asia/Seoul working boundary.

## Version Terminology

1. `X.0.0` is a major release, `X.Y.0` is a minor release, and `X.Y.Z` is a patch release.
2. A hotfix is an urgent patch release, not a fourth numeric level.
3. Existing Korean archive labels such as `메이저 패치`, `마이너 패치`, and `버그 패치` may remain for historical continuity, provided their numeric version changes follow the rules above.

Managed companion documents use the following fixed labels:

| Category | Korean | English | Japanese | Spanish | Brazilian Portuguese |
| --- | --- | --- | --- | --- | --- |
| Major | `메이저 패치` | `major release` | `メジャーリリース` | `versión mayor` | `versão principal` |
| Minor | `마이너 패치` | `minor release` | `マイナーリリース` | `versión menor` | `versão menor` |
| Bug fix | `버그 패치` | `bug-fix release` | `バグ修正` | `corrección de errores` | `correção de erros` |
| Urgent fix | `핫픽스` | `hotfix` | `ホットフィックス` | `hotfix` | `hotfix` |

The public archive stores the executable mapping in `docs/localization/manifest.json`. Its locale verifier checks release headings, archive lists, and changelog rows against the Korean canonical entries.

The default public archive language model is therefore:

- Korean canonical reader-facing documents
- English, Japanese, Spanish, and Brazilian Portuguese companion documents for every managed public document group
- unchanged Korean historical originals with controlled companion-translation backfill
- original-language technical evidence under `source/`, introduced through localized reader-facing summaries
- automated source-hash and structural-parity checks before publication

## Release Note Shape

Use this structure for the Korean canonical public v2 Next.js release note. The headings deliberately continue the style of the v1 GAS patch notes:

```md
# [YYYY-MM-DD] vX.Y.Z 버그 패치

## 주요 수정사항

### 개요

어느 화면에서 어떤 문제가 있었는지, 어떤 자료가 영향을 받을 수 있는지, 기존 결과를 다시 계산해야 하는지를 먼저 설명합니다.

### 세부사항

관련 로샤 개념, 정확한 발동 조건, 구체적인 예, 수정 내용을 순서대로 설명합니다.

## 기존 결과를 다시 계산해야 하나요?

영향받는 조건과 사용자가 해야 할 일을 직접 설명합니다.

## 근거와 한계

임상적으로 필요한 출처, 확인된 결론, 남아 있는 한계만 간단히 설명합니다. 내부 검사 절차와 개발 명령은 별도 기록에 둡니다.
```

Patch notes can add a short extra section when needed, but the order above is the default.

## Required Content

Every public-facing release record must answer these questions:

1. What changed?
2. Which completed or incomplete protocols can be affected?
3. Do existing results need to be recalculated, or is any other action required?
4. Why was it worth a release?
5. Did the app UI/UX, data collection, or privacy behavior change?
6. What evidence supports the conclusion, expressed in plain language without narrating the internal checking process?
7. For a calculation or coding change, which source edition and printed pages support it, and what clinically relevant limitation remains?

For AI-related releases, state whether the user-visible assistant behavior changed. Internal evaluation harness changes belong in technical evidence, not in the reader-facing release story.

## Version-Line Closure Wording

Release documents must distinguish between closing a specific engineering scope and ending an entire version line.

1. Do not call a patch the "last" or "final" patch of a version line unless the version line has actually ended as a product decision.
2. Describe the concrete product change instead of an internal engineering milestone, evaluation run, or closure label.
3. If later work makes an old summary inaccurate, rewrite the summary so it states the released scope accurately. Do not add a follow-up banner explaining that the old wording was changed.

## Public Archive Update Checklist

When preparing a release:

1. Add or update the app version in `package.json`, `package-lock.json`, footer version display, and `lib/versionArchive.ts`.
2. Add the new release entry at the top of the public README release list.
3. Add the new release row at the top of the public `CHANGELOG.md` table.
4. Update `v2-nextjs/README.md` so the latest patch note points to the new release.
5. Add `v2-nextjs/releases/vX.Y.Z/README.md`.
6. Update all four companion locales when a managed Korean canonical document changes.
7. Run the public documentation localization check and resolve stale hashes, missing files, or structural drift.
8. Ensure public-facing release text follows the language coverage policy and stays technically precise.
9. Ensure the public source mirror excludes secrets, private work material, and raw model output. Enforce this as a publication check; do not turn the excluded-item inventory into reader-facing prose.
10. Confirm that the impact, affected condition, need for recalculation, and limitations are clear, and remove technical material that does not help a clinician act on the release.
11. Remove dated correction notices, archive/date/order maintenance, documentation synchronization, AI-to-owner reporting language, agent names, local-environment narration, test and model-call counts, credential or database cleanup, build and deployment preparation, mirror mechanics, commands, file-level diffs, and unexplained internal engineering terms from the reader-facing document.
12. For calculation-related releases, verify every public source citation against the private source page before publication, and confirm that no copyrighted source file or extended passage entered the public mirror.

## Agent Rule

Before writing a public release note, an AI coding assistant must read:

1. this standard
2. representative v1 notes written in the project's original voice, including `v1.0.1`, `v1.0.2`, `v1.0.4`, and the latest v1 note
3. the latest two v2 release notes
4. the current public README and CHANGELOG

For a repository-wide voice rewrite, the assistant must read the complete v1 GAS release-note series before editing. For a routine new release after that baseline has been established, the representative v1 notes above are sufficient unless the new release revisits an older calculation or historical claim.

The assistant must then perform a plain-language voice review before publication. It must specifically search every reader-facing file for dated correction or follow-up notices, archive/date/order maintenance, documentation synchronization, third-person references to the project owner, and internal-process expressions such as uncommitted work, adversarial audit, independent reproduction, release gate, developer approval, runtime, fixture, regression contract, test reruns, database reconstruction, credential cleanup, build output, and deployment preparation. A literal keyword scan is not sufficient: the final reviewer must ask whether each sentence helps a clinician understand or act on the released product.

If the assistant finds a conflict between old release-note style and this standard, it must follow this standard and mention the inconsistency in its private implementation summary. That inconsistency does not belong in the public release narrative unless it changes the facts readers need to know.
