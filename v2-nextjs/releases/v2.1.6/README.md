# [2026-07-04] v2.1.6 버그 패치

## 요약

v2.1.6은 v2.2.0 모바일 UX 개선 작업으로 넘어가기 전에 v2.1.x AI 품질 작업을 마감한 패치입니다.

앱 UI/UX는 변경하지 않았고, 백엔드 AI 품질, reference retrieval 평가, release gate, dependency audit 정리를 중심으로 작업했습니다.

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
