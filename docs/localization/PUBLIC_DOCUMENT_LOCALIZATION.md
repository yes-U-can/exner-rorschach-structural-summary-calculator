# Public Document Localization

Status: Draft pilot
Canonical locale: Korean (`ko`)
Companion locales: English (`en`), Japanese (`ja`), neutral Spanish (`es`), Brazilian Portuguese (`pt-BR`)

## Scope

The public archive separates documents by function.

- Reader-facing documents are managed as five-file locale groups.
- Korean is the factual source of truth for each group.
- Raw evaluation evidence, deployment checklists, source code, commands, and machine-readable artifacts keep their original technical language.
- A technical collection receives five-language entry documentation when its README is added to the localization manifest; individual raw evidence files are not translated by default.

The initial pilot covers the repository entry points, archive summaries, acknowledgements, changelogs, and the latest release note. Historical release notes are backfilled only after the pilot's tone and terminology have been independently reviewed.

## File Names

For a Korean canonical file named `README.md`, the companion files are:

- `README.en.md`
- `README.ja.md`
- `README.es.md`
- `README.pt-BR.md`

The same suffix rule applies to other managed Markdown files, such as `CHANGELOG.md`.

## Editorial Rules

1. Preserve release facts, dates, versions, formulas, numeric results, links, recalculation guidance, privacy boundaries, and stated limitations.
2. Translate meaning rather than Korean word order.
3. Use the project's v1 GAS notes as the voice reference: identify the visible problem, explain the relevant Rorschach concept, show the condition in which it appears, and state what was corrected.
4. Keep Exner codes and conventional Structural Summary labels unchanged.
5. Use the approved glossary before choosing a new clinical term. When an established target-language term is uncertain, keep the English term in parentheses and mark the entry for review rather than inventing a translation.
6. Do not narrate internal agent conversations, rejected drafts, or approval workflow in reader-facing prose.
7. Keep one prose language per file. Bibliographic titles, code, URLs, and direct quotations may remain in their original language.
8. Describe only the state that readers receive in the release. Do not recount abandoned drafts, agent conversations, or internal indecision unless that history itself changes how a clinical result must be understood.
9. Lead with the clinical effect in ordinary professional language. Put implementation details, test counts, and file-level evidence after the reader can understand what changed and whether recalculation is needed.
10. Never expose local paths, private file names, API keys, raw prompts, unpublished source materials, or labels that describe the intended audience.
11. When one managed reader-facing document links to another, each companion must link to the matching locale file. Raw evidence and untranslated historical documents keep the canonical target.

## Locale Voice

- `ko`: natural professional `~합니다` style. The compact reference corpus remains outside this policy and may use `~다` style.
- `en`: direct professional prose written for clinicians and developers without audit-report narration.
- `ja`: consistent professional `です・ます` style.
- `es`: neutral professional Spanish without region-specific colloquialisms.
- `pt-BR`: professional Brazilian Portuguese; do not mix European Portuguese terminology into the same set.

## Release Category Labels

Use one fixed label set in release headings, archive lists, and changelog rows. Korean keeps the project's established labels; companion languages use natural release terminology rather than translating `패치` word for word.

| Category | `ko` | `en` | `ja` | `es` | `pt-BR` |
| --- | --- | --- | --- | --- | --- |
| Major | `메이저 패치` | `major release` | `メジャーリリース` | `versión mayor` | `versão principal` |
| Minor | `마이너 패치` | `minor release` | `マイナーリリース` | `versión menor` | `versão menor` |
| Bug fix | `버그 패치` | `bug-fix release` | `バグ修正` | `corrección de errores` | `correção de erros` |
| Urgent fix | `핫픽스` | `hotfix` | `ホットフィックス` | `hotfix` | `hotfix` |

The executable copy of this mapping lives in `manifest.json`. The locale verifier compares every managed release entry with the Korean version and blocks missing or inconsistent labels.

## Review States

- `draft`: translated and structurally checked, but not yet accepted after editorial and terminology review.
- `reviewed`: tone and terminology have been reviewed and all structural checks pass.
- `stale`: the Korean canonical file changed after the companion files were prepared.

The strict repository check accepts only `reviewed`. Local work may use `-AllowDraft` while preparing an independent review package.

`reviewed` means that both of the following have been completed:

- a factual parity review against the finalized Korean canonical document
- an independent target-language review of clinical terminology and natural prose

Machine checks support these reviews but do not replace them.

## Release Workflow

Use the same sequence for every new public README, changelog, or release note.

1. Finalize the release facts in Korean. State the visible change, the condition under which it matters, whether an existing result must be recalculated, and how the correction was checked.
2. Add the Korean file and four companion paths to `docs/localization/manifest.json` with `reviewStatus` set to `draft`.
3. Draft English, Japanese, neutral Spanish, and Brazilian Portuguese from the Korean canonical file. Use `clinical-terminology.json` and `TERMINOLOGY_SOURCES.md`; do not translate from another companion language.
4. Run `scripts/verify-public-document-locales.ps1 -UpdateHashes -AllowDraft`, then run it again without `-UpdateHashes`.
5. Ask an independent reviewer to research authoritative sources in every target language, edit the files directly, and record unresolved terminology instead of guessing.
6. Re-run the draft check. When factual parity, terminology, and prose have all been accepted, change the document group's `reviewStatus` to `reviewed`.
7. Set `pilotStatus` to `reviewed` only when every group in the current publication batch is reviewed, then run the strict check without `-AllowDraft`.
8. Publish only after the strict check passes. A later change to a Korean canonical file invalidates its stored hash and blocks publication until all four companions are refreshed.

The operator checklist and release-note outline are in `RELEASE_DOCUMENT_WORKFLOW.md`.

## Evidence Rules

- Prefer official manuals and professional associations, peer-reviewed target-language articles, academic publishers, and university repositories.
- Use search results, machine translation, existing corpus text, and third-party copies only as leads. They are not sufficient by themselves to approve a term.
- Record the source used to settle a recurring term in `TERMINOLOGY_SOURCES.md` and update `clinical-terminology.json` only after review.
- Keep Exner Comprehensive System terminology separate from R-PAS and other Rorschach systems even when a target-language source discusses both.

## Verification

Run:

```powershell
pwsh -File scripts/verify-public-document-locales.ps1 -AllowDraft
```

The checker verifies:

- all five files exist
- the Korean source hash matches the manifest
- heading structure is unchanged
- Markdown link targets remain aligned
- versions, dates, and other numeric tokens remain aligned
- inline-code identifiers and fenced command blocks remain aligned
- the glossary and manifest use the expected locale set

Use `-UpdateHashes` only after the Korean canonical text is final and every companion has been updated from that exact version.
