# [2026-07-13] v2.1.10 버그 패치

## 요약

v2.1.10은 v2.1.9 배포 뒤 진행한 최종 독립 감사에서 발견된 네 가지 후속 결함을 닫는 AI/RAG 백엔드 안정화 패치입니다.

앱 UI/UX는 변경하지 않았습니다. 계산기 기능, GPT-5.5 고정 모델 정책, BYOK, HITL 경계도 그대로 유지하면서 검색 결과의 일관성, 일본어 코드 인식, 넓은 해석 질문의 경로 제한, 빈 데이터베이스에서의 마이그레이션 재현성을 강화했습니다.

## 핵심 요약

- broad lexical fallback에서 실제 반환 문서와 진단 trace가 서로 달라질 수 있던 문제를 하나의 정렬 결과로 통합했습니다.
- `FQ+の...`, `v/+の...`, `3r+(2)/Rの...`처럼 로샤 코드에 일본어가 붙은 질문에서도 완전한 코드 토큰을 먼저 보존하도록 수정했습니다.
- 한국어, 영어, 일본어, 스페인어, 포르투갈어의 자연스러운 전체 해석 질문을 보강하고, broad query에는 해석 문서만 반환하는 명시적 경계를 적용했습니다.
- 빈 PostgreSQL/pgvector 데이터베이스에서 전체 Prisma migration history를 재생할 때 발생하던 `P3018 / 42P01` 실패를 idempotent 선행 migration으로 해결했습니다. 이미 적용된 과거 migration 파일은 수정하지 않았습니다.
- vector hit가 하나도 남지 않았을 때 검색 mode를 `hybrid`로 잘못 표시하지 않고 `lexical`로 기록하도록 수정했습니다.
- lexical/vector 후보에 ID가 없어도 title과 content를 이용한 안정적인 merge key로 중복을 합치도록 보강했습니다.
- live eval에서 공백뿐인 `OPENAI_API_KEY`를 유효한 키로 취급하지 않도록 수정했습니다.
- hybrid, batch, route 평가 증거에 앱 버전, Git commit, dirty-tree 상태를 기록하고, `/api/chat` route eval은 원문 답변 없이 안전한 JSONL 메타데이터만 저장하도록 했습니다.
- GitHub CI에 빈 pgvector 데이터베이스 전체 migration replay와 late-application 데이터 보존 검사를 추가했습니다.

## 독립 감사와 후속조치

이번 배치는 두 AI의 역할을 분리해 진행했습니다.

- **Claude Fable 5**: v2.1.9 최종 읽기 전용 독립 감사와 공격적 재현 후보 제시
- **GPT-5.6 Sol / Codex**: 각 후보의 로컬 직접 재현, 구현, 회귀 테스트, 격리 DB 및 운영 상태 검증

Fable 5의 최종 판정은 `PASS WITH NON-BLOCKING FINDINGS`, `Release blocker: NO`였습니다. 다만 제시된 네 가지 P1 후보를 그대로 넘기지 않고 모두 독립적으로 재현했으며, 네 건 모두 실제 결함으로 확인되어 v2.1.10에서 수정했습니다.

이 역할 표기는 개발 과정의 감사자와 구현자를 구분하기 위한 기록입니다. 임상적 타당성 검증, 업체 인증, 또는 미래 모델 동작에 대한 보증을 뜻하지 않습니다.

## 검증

- targeted retrieval/fusion contract: `48/48` 통과
- unit/integration: `45` files, `206` passed, `5` intentionally skipped
- 다섯 언어 hybrid challenge: `30/30` 완료
- broad hit@1: `1.0`
- broad hit@8: `1.0`
- named hit@4: `1.0`
- relation-required route coverage@8: `1.0`
- broad workflow contamination@1: `0.0`
- production-like GPT-5.5 `/api/chat` eval: HTTP `200`, stream `complete`, issue `0`
- 빈 pgvector/PostgreSQL에서 전체 `29`개 migration replay 통과
- late-application 보존 검사 통과
- 운영 OpenAI vector: `6,632/6,632`, stale `0`, 다섯 언어 ready
- production build: `221/221` static page 생성
- AI release gate: `7/7` 단계 통과
- dependency audit: 알려진 취약점 `0`

private 배포 repo에서 다음 검증을 통과한 뒤 공개 source snapshot을 갱신했습니다.

```bash
npm run ai:release-gate
npm run ai:evaluate-artifacts
npm test
npm run build
npm run db:verify-fresh-replay
git diff --check
```

상세한 before/after, v2.1.9 문구 정정, migration 판단, 실측 결과와 남아 있는 한계는 [v2.1.10 Final Independent Audit Closure Report](../../source/docs/ai-evals/2026-07-13-v2.1.10-final-independent-audit-closure-report.md)에 기록했습니다.

공개 검증 증거는 다음과 같습니다.

- [30-query hybrid retrieval artifact](../../source/docs/ai-evals/2026-07-13-v2.1.10-hybrid-retrieval-final.json)
- [sanitized GPT-5.5 route eval JSONL](../../source/docs/ai-evals/2026-07-13-v2.1.10-gpt5.5-route-final.jsonl)

## 공개 범위와 보안 경계

공개 source snapshot에는 이번 검색 수정, 테스트, 평가 스크립트, 버전 정보, 감사 보고서, 집계형 평가 증거를 포함했습니다.

API key, `.env*`, raw prompt, raw model answer, chat message, private assessment payload, patient data, 비공개 source provenance, 운영 DB 연결정보, Prisma migration history, Vercel local state, runtime log와 cache는 공개하지 않았습니다.

이번 패치는 AI가 코드를 자동 확정하거나 진단을 내리거나 임상가의 판단을 대신하게 만들지 않습니다. 기존 BYOK와 HITL 원칙은 그대로 유지합니다.

## 남아 있는 한계

- 30-query hybrid 세트는 development challenge이며 blind held-out benchmark가 아닙니다.
- broad intent는 명시적인 다국어 규칙을 사용하므로 가능한 모든 자연어 표현의 포괄을 증명하지는 못합니다.
- production-like route eval은 아직 하나의 합성 해석 시나리오를 다룹니다.
- 자동 contract는 엔지니어링 동작을 검사하며 임상적 정확성을 증명하지 않습니다.
- 실제 임상 유용성, 다국어 문장 품질, 안전성은 전문가의 사람 검토가 계속 필요합니다.
