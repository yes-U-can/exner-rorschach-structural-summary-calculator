# AI 답변 사람 검토 기록 / Human Review Records

이 폴더에는 AI 답변을 사람이 검토한 결과를 개인정보가 남지 않는 형식으로 보관합니다.

대화 원문을 저장하는 곳이 아닙니다. 검토한 답변마다 사용 언어와 모델, 평가 항목별 점수, 반드시 실패로 판단한 항목, 최종 통과 여부를 기록합니다.

이 기록은 정해 둔 질문에 대한 답변 품질을 사람이 같은 기준으로 비교하기 위한 것이며, 임상적 타당성 인증이나 모든 미래 답변에 대한 보증이 아닙니다.

## 개인정보 보호 범위

허용하는 정보는 검사 항목 번호, 언어, 모델, 검토자 역할, 항목별 점수, 실패 사유 코드, 종합 점수, 판정, 짧은 검토 메모입니다.

다음 정보는 저장하지 않습니다.

- API 키
- 질문과 답변 원문
- 대화 원문
- 비공개 평가 자료

답변을 논의할 필요가 있으면 원문을 복사하지 않고 문제를 짧게 요약합니다.

<details>
<summary><strong>개발자가 기록을 검사하는 방법 / Validation details</strong></summary>

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

</details>
