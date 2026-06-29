# [2026-06-29] v2.1.3 버그 패치

v2.1.3은 AI 기능의 화면 동작을 바꾸기보다, v2.1.2에서 만든 OpenAI 하네스와 live eval 결과를 더 신뢰할 수 있게 보여주고 재검증할 수 있도록 정리한 품질 강화 패치입니다.

UI/UX 레이아웃은 유지하고, 릴리즈 검증 도구, 공개 문서, human review rubric, 버전 아카이브를 중심으로 정리했습니다.

## 핵심 요약

- saved live eval JSONL 로그를 다시 검사하는 `ai:evaluate-artifacts` 명령을 추가했습니다.
- eval artifact audit가 JSONL 파싱, fixture metadata, batch summary 일치 여부, key-shaped secret, raw prompt/raw output 저장 여부를 확인하도록 했습니다.
- `final-pass` eval 로그는 issue-bearing fixture와 failed run이 0이어야 통과하도록 별도 release-candidate 기준을 세웠습니다.
- artifact audit 자체가 깨지지 않도록 회귀 테스트를 추가했습니다.
- 자동 eval만으로 판단하기 어려운 실제 답변 유용성을 사람이 같은 기준으로 검토할 수 있도록 human rubric을 추가했습니다.
- AI assistant behavior change가 지나야 할 품질 게이트를 architecture guardrail과 release checklist에 명시했습니다.
- 공개 repo에서 AI 품질 게이트, human rubric, v2.1.2 AI harness case study를 바로 찾을 수 있도록 README 링크를 보강했습니다.
- 푸터 버전, i18n 버전 문자열, package version, 버전 아카이브를 v2.1.3으로 갱신했습니다.

## AI 품질 게이트

이번 패치 이후 AI 관련 변경은 다음 세 층으로 검토할 수 있습니다.

1. Contract quality: `npm run ai:evaluate-contracts`
2. Artifact quality: `npm run ai:evaluate-artifacts`
3. Human usefulness: `docs/ai-evals/HUMAN_RUBRIC.md`

이 구조는 "AI가 좋아졌다"는 주장보다, 어떤 기준을 통과했는지 남기는 쪽에 초점을 둡니다.

## 검증

private 배포 repo에서 다음 검증을 통과한 뒤 공개 source mirror를 갱신했습니다.

- `npm run ai:evaluate-contracts`
- `npm run ai:evaluate-artifacts`
- `npm run i18n:audit`
- `npm run security:secrets`
- `git diff --check`

추가로 v2.1.x 누적 변경 이후 전체 테스트도 통과했습니다.

- `npm test`
- 결과: 32개 test file, 108 passed, 3 skipped

## 공개 범위

공개 source에는 AI 품질 게이트 스크립트, 테스트, saved eval artifact audit 문서, human rubric, release checklist, architecture guardrail 문서를 포함했습니다.

API 키, `.env*`, Vercel 로컬 설정, raw model output, raw prompt, 비공개 작업 노트는 포함하지 않았습니다.
