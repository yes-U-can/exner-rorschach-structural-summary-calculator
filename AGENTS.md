# Public Archive Working Rules

These instructions apply to the public showcase repository.

## Repository Boundary

- This repository is a curated public archive, not the private production source.
- Never add private paths, local file names, secrets, API keys, raw prompts, unpublished source materials, private payloads, or internal work notes.
- Do not change application UI, calculation logic, corpus content, embeddings, or deployment state while performing a documentation-only task.

## Public Writing

- Read `v2-nextjs/source/docs/ops/PUBLIC_RELEASE_DOCUMENTATION.md` before editing reader-facing documents.
- Read the complete v1 GAS release-note series before a repository-wide voice rewrite. For routine work, also read the latest two v2 notes, the root README, and the root CHANGELOG.
- Write the released product story, not the draft history. Do not narrate agent conversations, internal approval, rejected drafts, or audience strategy.
- Explain the visible or clinical effect first, followed by the affected condition, recalculation guidance, verification, limitations, and then technical details.

## Five-Language Contract

- Korean is the factual canonical locale. Managed companions are English, Japanese, neutral Spanish, and Brazilian Portuguese.
- Follow `docs/localization/PUBLIC_DOCUMENT_LOCALIZATION.md` and `docs/localization/RELEASE_DOCUMENT_WORKFLOW.md`.
- Use `docs/localization/clinical-terminology.json` and verify uncertain wording against `docs/localization/TERMINOLOGY_SOURCES.md` plus independent authoritative research.
- Add every managed group to `docs/localization/manifest.json`. Keep new or changed groups in `draft` until factual parity and independent target-language review are complete.
- Run `scripts/verify-public-document-locales.ps1 -AllowDraft` while editing. Publication requires the strict command without `-AllowDraft` to pass.
- Do not commit, push, open a pull request, publish a release, or deploy unless the user explicitly requests it.
