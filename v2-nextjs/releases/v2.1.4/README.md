# [2026-07-03] v2.1.4 버그 패치

v2.1.4는 v2 Next.js 앱의 AI 품질 검증을 강화한 패치입니다.

완성된 UI/UX 화면은 변경하지 않았고, OpenAI 기반 도우미를 더 실제 서비스에 가까운 방식으로 검증할 수 있도록 백엔드 평가 하네스를 보강했습니다. 핵심은 멀티턴 대화, HITL 경계, 사람 검토 기록, 공개 가능한 eval 증거입니다.

## 핵심 요약

- 코딩 도우미의 후속 질문 흐름과 해석 도우미의 후속 답변 안전성을 확인하는 multi-turn eval fixture를 추가했습니다.
- assistant의 각 turn을 검사하고 turn 수 불일치를 잡는 multi-turn transcript contract evaluator를 추가했습니다.
- rubric 점수 계산, blocking failure, decision consistency, privacy-safe JSONL 형식을 검증하는 human review record scorer를 추가했습니다.
- `ai:evaluate-human-records` 명령을 추가했습니다.
- live OpenAI multi-turn eval suite를 추가했습니다.
- live eval batch runner에서 `--suite single`, `--suite multiturn` 옵션을 지원하도록 확장했습니다.
- v2.1.4 eval hardening 과정을 `docs/ai-evals/2026-07-03-v2.1.4-ai-eval-hardening-report.md`에 기록했습니다.
- footer, package, version archive 메타데이터를 v2.1.4로 갱신했습니다.

## 검증

private 배포 repo에서 다음 검증을 통과했습니다.

- `npm run ai:evaluate-contracts`
- `npm run ai:evaluate-human-records`
- `node scripts/score-ai-human-review-records.mjs --input docs/ai-evals/human-review-records --require-pass`
- `npm run ai:evaluate-artifacts`
- `npm run security:secrets`
- `npm run lint`
- `npm test`
- `npm run build`
- `git diff --check`

직접 multi-turn live Vitest suite도 호출했지만, 현재 process 환경에 `OPENAI_API_KEY`가 없어서 skip 처리되었습니다. 이 로컬 배치에서는 live API 비용이 발생하지 않았습니다.

## 공개 범위

공개 source mirror에는 eval harness 코드, 테스트, 스크립트, 문서, 릴리즈 메타데이터를 포함했습니다.

공개 아카이브에는 API key, `.env*` 파일, Vercel local state, raw model output, raw prompt, raw chat message, 비공개 운영 노트를 포함하지 않았습니다.
