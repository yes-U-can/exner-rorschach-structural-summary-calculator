# Human Review Records

This directory stores privacy-safe JSONL records for human review of AI eval outputs.

The records are not raw chat logs. Each line should describe the review metadata, rubric scores, blocking failures, and final decision for one reviewed answer.

## Validate Records

```bash
npm run ai:evaluate-human-records
```

Use the stricter release gate when every reviewed record in the input set must pass:

```bash
node scripts/score-ai-human-review-records.mjs --input docs/ai-evals/human-review-records --require-pass
```

The scorer checks:

- every saved JSONL line parses
- required rubric fields are present
- dimension scores are integers from `0` to `4`
- weighted scores match the workflow rubric weights
- blocking failures force a `fail` decision
- logs do not contain key-shaped secrets
- logs do not contain raw prompt, raw answer, or raw response fields

## Privacy Boundary

Allowed record fields include fixture ID, locale, model, reviewer role, dimension scores, blocking failure IDs, weighted score, decision, and short reviewer notes.

Do not store:

- API keys
- raw prompts
- raw model answers
- raw chat messages
- private assessment payloads

If an answer needs discussion, summarize the issue in reviewer notes instead of copying the answer.
