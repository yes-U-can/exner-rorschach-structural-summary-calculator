# AI Eval Artifacts

This directory stores release evidence for the BYOK OpenAI assistant harness.

The eval artifacts are not meant to prove clinical correctness. They are engineering evidence that the assistant layer follows product boundaries:

- answers are not empty or visibly cut off
- coding suggestions stay candidate-level until a clinician reviews them
- interpretation answers stay provisional and data-grounded
- diagnosis, treatment planning, legal, and forensic claims stay bounded
- reference retrieval remains connected to the knowledge layer

## Local Commands

Run the static harness and retrieval contract suite:

```bash
npm run ai:evaluate-contracts
```

Run the local AI release gate:

```bash
npm run ai:release-gate
```

The release gate runs the static harness contracts, saved eval artifact audit, human review record scorer with `--require-pass`, and committed secret scan in one repeatable command. To preview the command plan without executing it:

```bash
npm run ai:release-gate -- --dry-run
```

Human review rubric:

- [`HUMAN_RUBRIC.md`](./HUMAN_RUBRIC.md)
- [`human-rubric-v2.1.x.json`](./human-rubric-v2.1.x.json)
- [`human-review-records/`](./human-review-records/)
- [`2026-07-03-v2.1.4-ai-eval-hardening-report.md`](./2026-07-03-v2.1.4-ai-eval-hardening-report.md)
- [`2026-07-03-v2.1.5-ai-release-gate-report.md`](./2026-07-03-v2.1.5-ai-release-gate-report.md)

Validate saved human review records:

```bash
npm run ai:evaluate-human-records
```

Run a live OpenAI batch when an API key is available in the local environment:

```bash
npm run ai:evaluate-live:batch -- --model gpt-4o-mini --locales ko,en --rounds 1 --budget-usd 1
```

The explicit batch runner loads `.env.local` and `.env.production.local` before checking `OPENAI_API_KEY`. The Vitest live suites still skip unless the key is already present in the current process environment, so normal test runs do not accidentally spend API budget.

Run a multi-turn live batch when you want to test follow-up behavior:

```bash
npm run ai:evaluate-live:batch -- --suite multiturn --model gpt-5.5 --locales en --rounds 1 --budget-usd 5
```

Audit the saved JSONL artifacts:

```bash
npm run ai:evaluate-artifacts
```

The artifact audit checks:

- every saved JSONL line parses
- fixture result records include required metadata
- batch summaries match the parsed fixture records
- files named `final-pass` contain zero issue-bearing fixture results and zero failed runs
- logs do not contain key-shaped secrets
- logs do not contain raw prompt, raw answer, or raw response fields

Human review record scoring checks:

- every review record has the required rubric fields
- workflow-specific dimension scores are valid `0` to `4` integers
- weighted scores match the rubric weights
- blocking failures force a `fail` decision
- optional release gates can require every reviewed record to pass

## Privacy Boundary

Saved JSONL logs may include fixture ID, locale, model, retrieval mode, status, issue type, token usage, output length, and estimated cost.

Saved JSONL logs must not include:

- API keys
- raw model output
- raw prompts
- raw chat messages
- private assessment payloads

This keeps the eval evidence useful for release review and public showcase documentation without turning the repository into a chat transcript store.

## Reading The Results

`issue-bearing fixture results` means the fixture either reported one or more issue types or did not complete normally. Historical tuning logs can contain issue-bearing results. Final-pass logs should have zero issue-bearing results.

`estimated cost` is computed from the local script's price table and usage metadata. It is a development estimate, not an official billing record.

`failed runs` counts live eval subprocess exits that returned a non-zero exit code. Historical tuning logs can include failed runs. Files named `final-pass` are treated as release-candidate evidence and must stay clean.
