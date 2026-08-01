# [2026-07-31] v2.2.8 bug-fix release

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Main changes

### Overview

This release fixes a problem in which entering the same Content code twice in one response caused that code to be counted twice. For example, entering `Bt` in two slots could inflate the numerator of the Isolation Index and, in a boundary record, could also change the CDI result. Once a Content code is selected, it can no longer be selected again in another slot of the same response. If a duplicate remains in an older autosave, the app preserves the original data, stops calculation, and identifies the row that needs review.

The response-cleanup rules that had been maintained separately for the desktop table and mobile cards are now shared. When Level 1 and Level 2 are both present in the `DV`, `DR`, `INCOM`, or `FABCOM` family, the code just selected on screen is retained and the previously conflicting code is removed. If both levels are already present in older saved data, Level 1 is retained to preserve the previous desktop behavior. Clinicians must use the original response material to decide which level is correct. No blank Special Score is stored in the removed slot, and both screens now produce the same cleaned result from the same input.

This release does not change the Structural Summary formulas. Existing protocols entered according to the scoring rules do not need to be recalculated. Only records that meet a condition listed under “Which records can be affected?” require review against the original material and recalculation.

### Autosave and input data

- Opening the sample data no longer overwrites an existing autosave.
- The most recent edit is saved even when the screen is closed or the user moves to another page immediately after editing.
- Structurally damaged or excessively large autosave payloads are rejected instead of being restored as valid records.
- Unknown Z codes and Z scores that do not belong to the selected card are blocked before calculation.
- CSV filenames use the device's local date. During export, only strings that a spreadsheet could execute as formulas receive protective escaping; clinically valid positive and negative values and standalone scoring signs keep their original values. Cells containing commas, quotation marks, or CR and LF line breaks are quoted according to CSV rules.

### S-CON and reference documents

The S-CON reference document in all five languages now states all 12 criteria and the `8 or more` decision boundary. As before, the calculator counts the 12 criteria, checks the result at 8 or more, and displays the notice that S-CON applies to examinees aged 15 or older. No age field has been added; clinicians remain responsible for deciding whether the age condition applies.

When age has not been provided in an S-CON question, the AI interpretation assistant now reports the number of criteria met and asks for the exact age. It must not declare S-CON positive or negative or produce report-ready wording without that information.

### AI session and feedback security

- API-key session creation and chat requests now have limits that are harder to bypass by rotating session cookies.
- `null`, arrays, and other non-object JSON bodies are returned as invalid requests rather than server errors.
- Prompt-injection and crisis-language checks now also examine carried conversation context.
- A misconfigured cookie-encryption secret stops session creation instead of being silently ignored.
- AI-answer feedback continues to exclude conversation text and raw IP addresses. Feedback timestamps use UTC consistently, and the 180-day retention policy remains in place.

## Which records can be affected?

Existing Structural Summary results do not need to be recalculated unless one of these conditions applies:

1. The same Content code was entered more than once in a single response.
2. Desktop and mobile stored different cleanup results for Level 1 and Level 2 Special Scores.
3. An unsupported Z code or a Z score that does not belong to the card remains in imported data or an older autosave.
4. A record entered on the mobile interface contains only formless determinants such as `C`, `C'`, `T`, `V`, `Y`, or `Cn`, but [FQ] was stored as a value other than `none`.

For an affected record, review the original response material, correct the duplicate or invalid code, and recalculate. The app does not replace the clinician's coding judgment.

## Testing and verification

- Fixed test cases now confirm that S-CON is `Positive` with exactly 8 criteria and `NO` with 7.
- A separate OBS test case confirms the actual final-rule branch.
- Duplicate Content codes, Level 1 and Level 2 conflicts, blank Special Scores, invalid Z codes, damaged autosaves, blocked browser-storage access, and invalid BYOK JSON bodies were reproduced individually.
- The full automated suite passed 587 checks in 95 test files; 7 checks without the required execution conditions were skipped.
- All 203 reference documents in each of the five languages were confirmed ready for search.
- All 5,604 OpenAI embeddings matched the current text, with 0 stale embeddings and 0 content-hash mismatches.
- Live GPT-5.5 checks covered 62 single-turn conversations, 9 multi-turn conversations, and 4 requests through the web app's API path. In the first run, 1 S-CON question without age information did not pass the response-boundary check. After strengthening that boundary, 2 related Korean questions, including the failed case, were rerun and both passed.
- OpenAI Codex and Claude Opus 5 each ran independent paid GPT-5.5 calls. The Claude audit environment checked 25 scenarios across five languages, then called the Japanese Special Score level-pair item 3 more times after it failed one contract check. All additional 3 calls passed, for 27 passes and 1 failure across 28 calls. Codex added a regression test confirming that a correct Japanese prohibition may repeat the question wording, then called the same item 11 more times; all 11 passed. The Codex follow-up ended at 11 calls when the local tool timeout elapsed, but none of the 11 completed provider responses was interrupted.
- The single failure was not reproduced as an error in the formulas or input rules. Because the response text was not retained, no specific false-positive cause was asserted. The Claude calls cost `$0.874310`, and the Codex follow-up cost `$0.351305`. Neither API keys nor response text were included in the public record.
- The 4 feedback-database migrations and 30 RAG-database migrations were each replayed from the beginning in an empty pgvector database.
- The production build generated 222 pages. The desktop and mobile calculator screens were then opened directly, with no browser-console errors.

Live AI calls are sample checks of representative answer boundaries. They do not guarantee accuracy for every clinical question. Final interpretation and the age-applicability decision remain the clinician's responsibility.

## UI/UX, privacy, and calculation scope

- No new screen or age field was added.
- A Content code already selected in one slot is disabled in the other slots, and invalid saved data receives an explanation in all five languages.
- Unselected Structural Summary result tabs now have a subtle border, making them easier to distinguish from the current tab. In the S-CON, DEPI, CDI, and HVI cards, the summary checkbox and its first line of text are vertically centered.
- The calculation formulas and Structural Summary result sections were not changed.
- Scoring data and OpenAI API keys are not stored in the server database.
- The feedback database stores only predefined reason codes and aggregate metadata, not conversation text or raw IP addresses.

## Decisions left unchanged

Only items with sufficiently established support were changed in this release. The handling of a repeated Special Score that has no Level 1 or Level 2 distinction remains unchanged. No new clinical rule for assigning FQ to formless determinants was established; the existing desktop cleanup behavior was applied to mobile only to remove the difference between the two interfaces. Items that still require additional source support or a product decision will be reconsidered when adequate evidence is available.

## Public scope and security boundary

The public source includes input validation, autosave recovery, S-CON and OBS boundary checks, the five-language reference documents, AI-answer evaluation tools, and reproducible results.

The public-mirror cleanup script now honors `DryRun`, showing the planned cleanup without deleting files.

Production environment variables, API keys, actual users' scoring data and conversations, raw IP addresses, non-public source material, local paths, and internal work records are excluded.

## Technical appendix

<details>
<summary><strong>Commands used to repeat the checks</strong></summary>

```bash
npm test
npm run lint
npm run build
npm run security:check
npm run docs:evaluate-rag:all
npm run docs:evaluate-hybrid:openai -- --enforce
npm run docs:assert-vector-runtime-ready
npm run feedback:db:verify-fresh-replay
npm run db:verify-fresh-replay
```

The production and development dependency audits report 0 known vulnerabilities.

</details>
