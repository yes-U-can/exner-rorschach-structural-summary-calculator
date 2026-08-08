# [2026-07-02] v2.1.4 버그 패치

v2.1.4는 v2 Next.js 앱의 AI 품질 검증을 강화한 패치입니다.

UI/UX는 변경하지 않았습니다. 한 번의 질문만 확인하던 검사에서 더 나아가, 앞선 대화를 기억하며 이어 묻는 상황에서도 답변이 일관되고 임상가의 최종 판단 범위를 지키는지 확인하도록 검사 범위를 넓혔습니다.

## 핵심 요약

- 코딩 도우미의 후속 질문과 해석 도우미의 이어지는 답변을 확인하는 여러 차례 대화 예시를 추가했습니다.
- 대화의 각 답변을 검사하고 질문·답변 횟수가 맞지 않는 경우를 찾도록 했습니다.
- 사람 검토 점수, 반드시 실패로 판단할 항목, 최종 판정의 일관성, 개인정보를 담지 않는 기록 형식을 확인하는 도구를 추가했습니다.
- `ai:evaluate-human-records` 명령을 추가했습니다.
- 여러 차례 이어지는 대화의 답변 경계를 확인하는 검사 모음을 추가했습니다.
- 한 번 묻는 검사와 이어 묻는 검사를 나누어 실행할 수 있게 했습니다.
- v2.1.4에서 검사 범위를 넓힌 과정은 [AI 대화 검사 보강 보고서](../../source/docs/ai-evals/2026-07-03-v2.1.4-ai-eval-hardening-report.md)에 기록했습니다.
- footer, package, version archive 메타데이터를 v2.1.4로 갱신했습니다.

## 어떻게 확인했나요?

답변 기준, 사람 검토 기록, 저장 결과, 비밀정보, 전체 기능과 배포용 페이지 검사를 통과했습니다.

<details>
<summary><strong>개발자가 같은 검사를 다시 실행할 때 사용하는 명령</strong></summary>

- `npm run ai:evaluate-contracts`
- `npm run ai:evaluate-human-records`
- `node scripts/score-ai-human-review-records.mjs --input docs/ai-evals/human-review-records --require-pass`
- `npm run ai:evaluate-artifacts`
- `npm run security:secrets`
- `npm run lint`
- `npm test`
- `npm run build`
- `git diff --check`

</details>

이 릴리즈에서는 여러 차례 이어지는 대화의 검사 틀을 추가했으며, 실제 답변 경로 확인은 후속 릴리즈에서 진행했습니다.
