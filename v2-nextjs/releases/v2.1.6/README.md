# [2026-07-04] v2.1.6 버그 패치

## 요약

v2.1.6은 v2.1.x에서 먼저 진행한 AI 하네스와 release gate 기반 공사를 하나의 검증 가능한 기준으로 묶은 패치입니다.

앱 UI/UX는 변경하지 않았고, 백엔드 AI 품질, reference retrieval 평가, release gate, dependency audit 정리를 중심으로 작업했습니다.

## 후속 기록 (2026-07-13)

최초 패치노트에는 v2.1.x AI 품질 작업 전체를 마감한 것으로 표현했지만, 이후 사용자 테스트와 독립 감사에서 코퍼스·벡터 보정 및 검색 구조의 별도 개선 범위가 확인됐습니다. 최종 릴리즈 흐름에서 v2.1.6은 **초기 하네스와 release gate 기반 공사의 마감**으로 봅니다. 이후 v2.1.7-v2.1.10은 문서 거버넌스, 코퍼스 재보정, hybrid retrieval 강화, 감사 후속 결함 수정을 각각 다룹니다.

이 정정은 v2.1.6 당시의 구현 내용과 검증 결과를 바꾸지 않습니다.

## 핵심 요약

- `docs:evaluate-rag:all`을 추가해 모든 runtime locale의 curated reference retrieval eval을 한 번에 실행할 수 있게 했습니다.
- `docs:evaluate-rag:pt`가 KO로 fallback될 수 있던 문제를 고쳐, 실제 PT query set을 평가하도록 했습니다.
- Portuguese 코딩, 해석, graph-navigation, code-like symbol 질문의 retrieval intent 처리를 개선했습니다.
- `ai:release-gate`에 전체 runtime reference retrieval eval과 dependency audit을 포함했습니다.
- dependency audit 기준을 high severity에서 moderate severity로 강화했습니다.
- 잠금된 `js-yaml` 버전을 갱신해 `npm audit` 결과가 zero vulnerabilities가 되도록 정리했습니다.
- v2.1.6 AI quality closure evidence를 `source/docs/ai-evals/`에 추가했습니다.

## 검증

로컬에서 다음 검증을 통과했습니다.

```bash
npm run ai:release-gate -- --markdown docs/ai-evals/2026-07-03-v2.1.6-ai-quality-closure-gate.md
npm run lint
npm test
npm run build
git diff --check
```

AI release gate는 다음 6개 필수 단계를 모두 통과했습니다.

1. `npm run docs:evaluate-rag:all`
2. `npm run ai:evaluate-contracts`
3. `npm run ai:evaluate-artifacts`
4. `npm run ai:evaluate-human-records -- --require-pass`
5. `npm run security:secrets`
6. `npm run security:audit`

## 공개 범위와 보안 경계

이 공개 아카이브에는 deployment secret, local environment file, API key, runtime log, private database, Vercel project setting을 포함하지 않았습니다.

저장된 AI eval artifact에는 fixture ID, status, issue type, token usage, output length, estimated cost처럼 공개 가능한 메타데이터만 기록했습니다. raw prompt, raw model answer, private assessment payload, API key는 저장하지 않았습니다.
