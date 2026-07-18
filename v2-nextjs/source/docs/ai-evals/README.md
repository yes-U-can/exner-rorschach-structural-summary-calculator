# AI 답변 검사 기록 / AI Answer-Quality Records

이 폴더에는 코딩 도우미와 해석 도우미가 정해 둔 답변 기준을 지키는지 확인한 기록을 보관합니다.

이 검사는 AI 답변의 **임상적 정확성을 인증하지 않습니다.** 다음과 같은 프로그램 동작을 확인합니다.

- 답변이 비어 있거나 눈에 띄게 중간에서 끊기지 않는가
- 코딩 제안을 임상가가 검토하기 전까지 후보 수준으로 제시하는가
- 해석을 확정하지 않고 입력된 자료와 참조 문서에 근거해 설명하는가
- 진단, 치료계획, 법적·법정 판단으로 답변 범위를 넓히지 않는가
- 질문과 관련된 참조 문서를 실제로 찾아 답변에 사용하는가

English summary: these records check whether the optional OpenAI assistants follow predefined product and privacy boundaries. They do not certify clinical validity or guarantee every future model response.

## 개인정보 보호 범위

공개 검사 기록에는 검사 항목 번호, 언어, 모델, 검색 방식, 완료 상태, 발견된 문제 종류, 사용량, 답변 길이, 추정 비용 같은 요약 정보가 포함될 수 있습니다.

다음 정보는 저장하지 않습니다.

- API 키
- 질문과 답변 원문
- 대화 원문
- 비공개 평가 자료

이 원칙 때문에 공개 저장소는 대화 기록 보관소가 되지 않으면서도, 어떤 검사를 했는지는 확인할 수 있습니다.

## 주요 보고서와 검사 결과

아래는 대표 보고서와 검사 기록이며, 각 버전의 전체 검사 자료는 이 폴더에서 확인할 수 있습니다.

- [`2026-07-15-v2.2.0-cultural-validity-report.md`](./2026-07-15-v2.2.0-cultural-validity-report.md)
- [`2026-07-15-v2.2.0-cultural-validity-final-production-parity-2x.jsonl`](./2026-07-15-v2.2.0-cultural-validity-final-production-parity-2x.jsonl)
- [`2026-07-15-v2.2.0-exner-domain-boundary-report.md`](./2026-07-15-v2.2.0-exner-domain-boundary-report.md)
- [`2026-07-15-v2.2.0-domain-boundary-single-final-pass-2x.jsonl`](./2026-07-15-v2.2.0-domain-boundary-single-final-pass-2x.jsonl)
- [`2026-07-15-v2.2.0-domain-boundary-multiturn-final-pass-2x.jsonl`](./2026-07-15-v2.2.0-domain-boundary-multiturn-final-pass-2x.jsonl)
- [`2026-07-15-v2.2.0-domain-boundary-valid-route-final.jsonl`](./2026-07-15-v2.2.0-domain-boundary-valid-route-final.jsonl)
- [`2026-07-13-v2.2.0-chat-ux-streaming-validation.md`](./2026-07-13-v2.2.0-chat-ux-streaming-validation.md)
- [`2026-07-14-v2.2.0-chat-cancellation-continuity.jsonl`](./2026-07-14-v2.2.0-chat-cancellation-continuity.jsonl)
- [`v2.2.0-chat-ux-baseline.jsonl`](./v2.2.0-chat-ux-baseline.jsonl)
- [`v2.2.0-chat-ux-after.jsonl`](./v2.2.0-chat-ux-after.jsonl)

<details>
<summary><strong>개발자가 검사를 다시 실행하는 방법 / Reproduction details</strong></summary>

## Local Commands

Run the static harness and retrieval contract suite:

```bash
npm run ai:evaluate-contracts
```

Run the local AI release gate:

```bash
npm run ai:release-gate
```

The release gate runs curated reference retrieval evals for every runtime locale, static harness contracts, saved eval artifact audit, human review record scorer with `--require-pass`, committed secret scan, and dependency audit in one repeatable command. To preview the command plan without executing it:

```bash
npm run ai:release-gate -- --dry-run
```

Human review rubric:

- [`HUMAN_RUBRIC.md`](./HUMAN_RUBRIC.md)
- [`human-rubric-v2.1.x.json`](./human-rubric-v2.1.x.json)
- [`human-review-records/`](./human-review-records/)
- [`2026-07-03-v2.1.4-ai-eval-hardening-report.md`](./2026-07-03-v2.1.4-ai-eval-hardening-report.md)
- [`2026-07-03-v2.1.5-ai-release-gate-report.md`](./2026-07-03-v2.1.5-ai-release-gate-report.md)
- [`2026-07-03-v2.1.6-ai-quality-closure-report.md`](./2026-07-03-v2.1.6-ai-quality-closure-report.md)
- [`2026-07-03-v2.1.6-ai-quality-closure-gate.md`](./2026-07-03-v2.1.6-ai-quality-closure-gate.md)
- [`2026-07-12-corpus-evidence-calibration-report.md`](./2026-07-12-corpus-evidence-calibration-report.md)
- [`2026-07-13-v2.1.9-rag-retrieval-hardening-report.md`](./2026-07-13-v2.1.9-rag-retrieval-hardening-report.md)
- [`2026-07-13-v2.1.10-final-independent-audit-closure-report.md`](./2026-07-13-v2.1.10-final-independent-audit-closure-report.md)

Run the five-locale hybrid retrieval development challenge with real OpenAI query embeddings and the runtime vector database:

```bash
npm run docs:evaluate-hybrid:openai -- --enforce
```

The default challenge set is a tuning set, not a blind held-out evaluation. Saved output contains fixture IDs, routes, ranks, scores, and latency only. It does not contain the API key or model-generated text.

Validate saved human review records:

```bash
npm run ai:evaluate-human-records
```

Run a live OpenAI batch when an API key is available in the local environment:

```bash
npm run ai:evaluate-live:batch -- --model gpt-4o-mini --locales ko,en --rounds 1 --budget-usd 1
```

The explicit batch runner loads `.env.local` and `.env.production.local` before checking `OPENAI_API_KEY`. The Vitest live suites still skip unless the key is already present in the current process environment, so normal test runs do not accidentally spend API budget.

When `--retrieval runtime` is used, the live suites call the same database-backed hybrid retrieval functions as `/api/chat`. They require a current vector snapshot, assert nonzero vector hits, and fail instead of silently accepting lexical fallback. Multi-turn runs rebuild the system prompt and retrieval context on every turn so row selection and conversation history are tested together.

Run a multi-turn live batch when you want to test follow-up behavior:

```bash
npm run ai:evaluate-live:batch -- --suite multiturn --model gpt-5.5 --locales en --rounds 1 --budget-usd 5
```

Run the explicit production-like `/api/chat` path with a synthetic validated Structural Summary CSV, real BYOK cookie handling, runtime hybrid RAG, GPT-5.5 streaming, and HITL contracts:

```bash
npm run ai:evaluate-live:openai:route -- --output docs/ai-evals/route-eval.jsonl
```

The route eval keeps model output in process memory only and writes a sanitized JSONL artifact containing aggregate status, contract metadata, and the public app version. It does not persist the raw response, private source identifier, or working-tree state.

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

The live contracts also check response completion, required safety/HITL signals, and substantial cross-script leakage for the expected locale. Required-signal groups accept bounded synonyms, while forbidden-claim checks reject unsafe positive conclusions. These contracts are regression evidence, not clinical correctness claims.

Human review record scoring checks:

- every review record has the required rubric fields
- workflow-specific dimension scores are valid `0` to `4` integers
- weighted scores match the rubric weights
- blocking failures force a `fail` decision
- optional release gates can require every reviewed record to pass

## Reading The Results

`issue-bearing fixture results` means the fixture either reported one or more issue types or did not complete normally. Historical tuning logs can contain issue-bearing results. Final-pass logs should have zero issue-bearing results.

`estimated cost` is computed from the local script's price table and usage metadata. It is a development estimate, not an official billing record.

`failed runs` counts live eval subprocess exits that returned a non-zero exit code. Historical tuning logs can include failed runs. Files named `final-pass` are treated as release-candidate evidence and must stay clean.

</details>

## 결과를 해석할 때의 한계

- `issue-bearing`은 준비한 질문에서 한 가지 이상의 문제를 발견했거나 답변이 정상 완료되지 않았다는 뜻입니다.
- `estimated cost`는 API 사용량을 바탕으로 계산한 개발용 추정치이며 OpenAI의 공식 청구서가 아닙니다.
- `failed run`은 검사 프로그램이 정상 종료되지 않았다는 뜻입니다.
- 최종 검사 통과는 준비한 질문과 기준을 통과했다는 뜻일 뿐, 모든 임상 질문과 미래 답변을 보증하지 않습니다.
