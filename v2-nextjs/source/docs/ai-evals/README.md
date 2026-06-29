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

Human review rubric:

- [`HUMAN_RUBRIC.md`](./HUMAN_RUBRIC.md)
- [`human-rubric-v2.1.x.json`](./human-rubric-v2.1.x.json)

Run a live OpenAI batch when an API key is available in the local environment:

```bash
npm run ai:evaluate-live:batch -- --model gpt-4o-mini --locales ko,en --rounds 1 --budget-usd 1
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
