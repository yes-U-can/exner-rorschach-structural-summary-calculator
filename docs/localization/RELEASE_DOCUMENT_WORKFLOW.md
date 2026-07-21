# Five-Language Release Documentation Workflow

This checklist is for maintainers preparing public README files, changelogs, and release notes. Reader-facing documents should contain the finished release story, not this internal workflow.

## 1. Freeze the Korean Facts

Write the Korean canonical document first. Before translation, confirm that it answers these questions in this order:

1. What changed?
2. Under what response or data condition does it matter?
3. Could an earlier result be affected?
4. Does an existing protocol need to be recalculated?
5. What evidence or test was used to check the change?
6. What remains unchanged or outside this release?

Use the natural `~합니다` tone found in the v1 GAS release notes. Explain the clinical effect before implementation details and state each point directly in the project's voice. Do not narrate internal review, label audience categories, or describe abandoned drafts.

## 2. Register the Document Group

Add the Korean canonical path and the four companion paths to `manifest.json`:

```text
README.md
README.en.md
README.ja.md
README.es.md
README.pt-BR.md
```

Set `reviewStatus` to `draft`. Run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts\verify-public-document-locales.ps1 -UpdateHashes -AllowDraft
```

## 3. Draft Each Language Independently

Translate every companion directly from the Korean canonical document.

- English: plain professional English
- Japanese: professional `です・ます` prose
- Spanish: neutral professional Spanish
- Portuguese: Brazilian Portuguese

Use `clinical-terminology.json` and `TERMINOLOGY_SOURCES.md`. Preserve Exner codes, formulas, versions, dates, links, test counts, and recalculation guidance. If a recurring term is uncertain, mark it for review in the evidence register; do not invent a confident translation.

Use the release-category labels in `manifest.json` exactly. This keeps release headings, archive lists, and changelog rows consistent while allowing each language to use natural terminology.

## 4. Run Structural Checks

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts\verify-public-document-locales.ps1 -AllowDraft
```

This catches missing files and many factual drifts. It does not prove that clinical terminology or prose is natural.

## 5. Independent Editorial Review

The reviewer must:

- read every Korean canonical file and all four companions
- independently consult authoritative sources in each target language
- edit awkward or clinically inaccurate wording directly
- preserve factual parity and all protected codes
- report unresolved terminology instead of guessing
- check that the same workflow will support the next release without ad hoc decisions

After acceptance, set each reviewed group to `reviewed`. Set `pilotStatus` to `reviewed` only when the whole publication batch is ready.

## 6. Release Gate

Run the strict check:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts\verify-public-document-locales.ps1
```

Do not publish if it fails. A changed Korean hash means all four companion documents must be reviewed again.

## Release Note Outline

Use headings that fit the actual release; do not force empty sections. A typical note follows this order:

```markdown
# vX.Y.Z

[language navigation]

## 무엇이 달라졌나요?

## 어떤 경우에 영향을 받나요?

## 기존 결과를 다시 계산해야 하나요?

## 어떻게 확인했나요?

## 함께 확인할 내용
```

The translated headings should sound natural in their own language rather than mirror Korean word order.
