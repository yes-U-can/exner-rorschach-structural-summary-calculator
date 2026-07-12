# Corpus Evidence Calibration Report

Date: 2026-07-12

Release: v2.1.8

Scope: local backend knowledge, retrieval, vector, and eval hardening

UI/UX changes: none

## Objective

This batch reviewed the five-locale reference corpus as an AI knowledge layer rather than only as a set of help documents. The goals were to:

- calibrate claims to the available evidence
- keep high-stakes conclusions behind clinician review
- prevent private provenance from entering runtime or public text
- preserve retrieval quality after language corrections
- refresh all vector embeddings against the revised corpus
- verify the behavior with real GPT-5.5 calls

The evidence-tier policy was cross-checked as a QA reference against a major validity meta-analysis of Comprehensive System variables: [Mihura et al. (2013), PubMed](https://pubmed.ncbi.nlm.nih.gov/22925137/). This report documents validation policy and engineering work; it does not publish private source provenance.

## Before And After

| Area | Before | After |
| --- | --- | --- |
| Special indices | Similar interpretive confidence could be implied across indices | Explicit evidence tiers distinguish supported, limited, weak, and insufficient constructs |
| Retrieval chunks | A relevant paragraph could be retrieved without its caution | Every special-index chunk carries its evidence tier and guardrail |
| High-stakes risk | S-CON cautions existed but were not a shared retrieval invariant | Every S-CON route requires direct risk assessment regardless of score |
| Duplicate knowledge | Result-variable helper text could overstate DEPI, CDI, HVI, or OBS | The helper layer now uses the same evidence contract as the vector corpus |
| Spanish and Portuguese | Large-scale missing-diacritic and OCR-style wording remained | Orthography was corrected and audited across all 203 documents per locale |
| Korean and Japanese special indices | Generic clinical prose could mix English into otherwise localized answers | Special-index entries now use locale-native clinical prose while preserving only standard index and variable codes |
| User search input | Correct accents in corpus could reduce matches for unaccented queries | Latin diacritics are folded during search while canonical text stays correct |
| Eval contracts | Some checks depended on a short list of preferred phrases | Contracts now accept equivalent bounded wording and separately reject unsafe positive claims |
| Provenance | Runtime markers and public mirror rules could expose internal paths | Runtime governance is generic and private authoring directories are excluded and purged |
| Vectors | Embeddings represented the previous corpus fingerprint | All 6,632 chunks were re-embedded and the snapshot now matches the current corpus |

## Evidence Policy

| Index | Runtime tier | Required behavior |
| --- | --- | --- |
| PTI | `supported` | Use as a screening pattern; never diagnose thought or psychotic disorder from the index alone |
| S-CON | `supported-high-stakes` | Account for false positives and false negatives; directly assess ideation, intent, plan, means, history, recent change, and protective factors |
| DEPI | `limited` | Prompt assessment of current symptoms, duration, and impairment; do not infer a diagnosis or rule depression out |
| CDI | `limited` | Review current stress, observed coping, support, and developmental-cultural context; do not infer immaturity or dependency |
| HVI | `weak-inconsistent` | Keep only as a low-confidence organizing hypothesis unless independent evidence converges |
| OBS | `insufficient` | Treat positivity as an operational rule match; verify obsessive features and impairment independently |

## Corpus And Retrieval Results

- Locales: Korean, English, Japanese, Spanish, Portuguese
- Documents: 1,015 total, 203 per locale
- Runtime chunks: 6,632 total
- Broken internal references: 0
- Runtime provenance hits: 0
- Special-index evidence-policy errors: 0
- Curated retrieval queries: 360/360 passed
- Retrieval test cases including locale schema checks: 365/365 passed
- Portuguese regressions found during review: 2
- Portuguese regressions after diacritic-folding fix: 0

The two discovered regressions were useful failures. Correct Portuguese spelling made `Cartao` stop matching `Cartão`, and `Indice` stop matching `Índice`. Search normalization now treats accented and unaccented Latin input as equivalent without degrading the source text.

## Vector Results

Provider: OpenAI

Embedding model: `text-embedding-3-large`

Dimensions: 3,072

| Locale | Chunks | Embeddings | Stale | Ready |
| --- | ---: | ---: | ---: | --- |
| ko | 1,405 | 1,405 | 0 | yes |
| en | 1,283 | 1,283 | 0 | yes |
| ja | 1,283 | 1,283 | 0 | yes |
| es | 1,406 | 1,406 | 0 | yes |
| pt | 1,255 | 1,255 | 0 | yes |

The vector release snapshot fingerprint matches the current generated corpus.

## GPT-5.5 Live Evals

Special-index artifact: [`2026-07-12-v2.1.8-special-index-evidence-v4-final-pass-3x.jsonl`](./2026-07-12-v2.1.8-special-index-evidence-v4-final-pass-3x.jsonl)

Multi-turn artifact: [`2026-07-12-v2.1.8-prompt-v4-multiturn-final-pass-2x.jsonl`](./2026-07-12-v2.1.8-prompt-v4-multiturn-final-pass-2x.jsonl)

- Model: `gpt-5.5`
- Retrieval: production-like database-backed hybrid retrieval
- Special-index locales: ko, en, es, pt, ja
- Special-index scenarios: PTI, S-CON, DEPI, CDI, HVI, OBS
- Special-index rounds: 3
- Special-index calls: 18
- Multi-turn scenarios: row-bound FQ reasoning, movement clarification, low-R caution, and missing-data resistance
- Multi-turn rounds: 2
- Multi-turn calls: 8
- Completed responses: 26/26
- Failed runs: 0
- Contract issues: 0
- Vector hits: nonzero in every call
- Final-pass estimated cost: `$0.66517` (`$0.35790` single-turn + `$0.30727` multi-turn)

The saved JSONL contains metadata, completion status, issue types, token usage, and estimated cost. It does not contain API keys, raw prompts, raw answers, or assessment payloads.

## Harness Tuning Finding

Repeated live runs exposed a weakness in the evaluator rather than in the assistant: safe answers could use natural synonyms instead of a preferred word such as `candidate`, `confirm`, or one exact Portuguese phrase. The old keyword contract could mark those answers as failures even when they preserved the same HITL and evidence boundaries.

The final evaluator checks concept groups instead:

- what is directly observed or operationally established
- what remains unsupported, provisional, or undetermined
- what requires independent interview, observation, or clinician review
- what the assistant must not claim, diagnose, invent, or apply automatically

Regression tests now preserve equivalent Portuguese, Japanese, and English formulations so future prompt changes are less likely to create false alarms.

## Release Verification

- Authoring audit: passed
- Runtime corpus readiness: 5/5 locales
- Vector runtime readiness: 5/5 locales
- Unit and integration tests: 44 files passed; 167 passed and 5 intentionally skipped
- Lint and five-locale UI copy audit: passed
- Production build: passed
- Static page generation: 221/221
- Full `docs:verify-release`: passed

## Reproduction

```bash
npm run docs:audit-authoring
npm run docs:evaluate-rag:all
npm run docs:assert-vector-runtime-ready
npm run ai:evaluate-contracts
npm run ai:evaluate-artifacts
npm test
npm run lint
npm run docs:verify-release
```

Generating embeddings and rerunning live evals requires a local, ignored OpenAI API key. Secrets must never be placed in commands saved to documentation, committed environment files, or eval artifacts.

## Remaining Limits

- Automated contracts test engineering behavior, not clinical truth.
- Phrase and rubric checks cannot replace expert review of answer quality, even after synonym hardening.
- The model is stochastic; clean three-round single-turn and two-round multi-turn runs do not prove all future answers will pass.
- The new special-index fixtures are single-turn. Existing multi-turn tests cover context retention and missing-data resistance, but the new evidence scenarios should eventually receive dedicated multi-turn variants.
- All 1,015 documents passed automated structure, retrieval, and privacy checks, but a native clinical-language editorial review of every sentence in all five locales remains outside this engineering pass.
- Private provenance is intentionally excluded from runtime and public artifacts. Internal review must preserve it separately for maintainability and auditability.
