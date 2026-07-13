# [2026-07-13] v2.1.9 버그 패치

## 요약

v2.1.9는 사용자의 질문에서 GPT-5.5에 전달할 참조 문서를 고르는 RAG 검색 경로를 다시 감사하고 강화한 패치입니다.

앱 UI/UX는 변경하지 않았습니다. 이번 변경은 다섯 언어 검색, lexical/vector 결합 방식, 코딩 도우미 검색 질의, 실제 API 경로 평가, 벡터 관측성과 OpenAI-only 데이터 경계에 집중했습니다.

## 핵심 요약

- 한 글자 자연어가 로샤 코드로 오인되던 문제를 줄이면서 `Card I`, `Content A`, 소문자 결정인 `m`처럼 문맥상 명시된 코드는 보존했습니다.
- 한국어 조사·어미와 일본어 단어 분절을 보강하고, `3r+(2)/R` 같은 복합 지표를 내부의 짧은 기호보다 우선하도록 수정했습니다.
- lexical 점수와 vector similarity를 직접 더하던 방식을 weighted Reciprocal Rank Fusion(RRF)으로 교체했습니다.
- vector 최소 신호 임계값과 canonical route 중복 제거를 추가했습니다.
- 코딩 도우미의 embedding query가 focus row와 사용자가 명시적으로 선택한 supporting row만 사용하도록 제한했습니다.
- 실제 `/api/chat`의 BYOK cookie, Structural Summary CSV 검증, runtime RAG, GPT-5.5 streaming, HITL contract를 함께 거치는 production-like live eval을 추가했습니다.
- vector timestamp의 UTC 표시를 바로잡고, OpenAI-only 정책 밖의 provider 데이터가 남으면 릴리즈를 차단하도록 보강했습니다.

## 독립 감사와 정정 과정

이번 작업은 두 AI의 역할을 분리해 진행했습니다.

- **Claude Fable 5**: 읽기 전용 독립 감사, 반론 제기, 2차 정정 감사
- **GPT-5.6 Sol / Codex**: 로컬 직접 재현, 반증 확인, 코드 구현, 회귀 테스트와 GPT-5.5 실측

1차 감사에서 제시된 핵심 검색 결함은 직접 재현되어 수정에 반영했습니다. 반면 OpenAI vector가 stale이라는 판단과 언어별 코퍼스가 context window를 초과한다는 판단은 원시 DB timestamp와 실제 token 수를 재측정한 결과 사실이 아닌 것으로 확인됐습니다. Claude Fable 5의 2차 감사도 이 두 판단을 정정했고, 불필요한 전체 재임베딩과 CAG 전환은 작업에서 제외했습니다.

이 기록은 AI 이름을 성능 보증처럼 사용하는 것이 아니라, 감사자와 구현자의 역할을 분리하고 틀린 판단까지 교정한 개발 과정을 공개하기 위한 것입니다. 임상적 타당성 검증이나 업체 인증을 뜻하지 않습니다.

## 검증

- 다섯 언어 curated retrieval: 365/365 통과
- 25개 hybrid development challenge: broad top-1 10% → 100%, named top-4 90% → 100%, broad coding contamination 70% → 0%
- GPT-5.5 최종 단일턴: 27/27 통과, issue 0, failed run 0
- GPT-5.5 최종 멀티턴: 4/4 conversation, 8/8 response 완료
- production-like `/api/chat` live eval: HTTP 200, stream complete, issue 0
- production provider cleanup: Google 6,597행 → 0행, OpenAI 6,632행 보존, provider enum `openai` 단일화
- vector release snapshot: unexpected provider 0, stale 0, 5/5 locale ready
- unit/integration test: 45 files, 194 passed, 5 intentionally skipped
- production build: 221/221 static page 생성
- saved eval artifact audit: raw prompt·raw answer·API key 필드 없음
- dependency audit: 알려진 취약점 0

검토 중 스페인어 3건과 포르투갈어 2건의 검색 회귀가 실제로 발견됐습니다. 각 실패를 재현하는 계약 테스트를 먼저 추가하고 규칙을 수정한 뒤 다섯 언어 전체 365개를 처음부터 다시 통과시켰습니다.

상세한 before/after, 감사 정정표, 구현 방식, 실측 비용, 남아 있는 한계는 [v2.1.9 RAG Retrieval Hardening Report](../../source/docs/ai-evals/2026-07-13-v2.1.9-rag-retrieval-hardening-report.md)에 기록했습니다.

private 배포 repo에서 OpenAI-only provider cleanup을 적용하고 다음 최종 검증을 통과했습니다.

```bash
npm run docs:evaluate-rag:all
npm run ai:evaluate-contracts
npm run ai:evaluate-artifacts
npm run ai:release-gate
npm run lint
npm test
npm run build
git diff --check
```

## 공개 범위와 보안 경계

공개 eval 증거에는 fixture ID, locale, route, rank, aggregate score, 완료 상태, issue 유형, token 사용량, 출력 길이, 추정 비용처럼 검토에 필요한 메타데이터만 포함합니다.

API key, `.env*`, raw prompt, raw model answer, chat message, private assessment payload, patient data, 비공개 source document와 provenance, Vercel local state, runtime log와 cache는 공개하지 않습니다.

이번 패치는 검색과 평가 방식을 개선하지만 AI가 최종 코드를 자동 확정하거나, 진단을 내리거나, 임상가의 판단을 대체하도록 허용하지 않습니다. 기존 BYOK·HITL 경계는 그대로 유지합니다.

## 남아 있는 한계

- 25개 hybrid 세트는 구현 조정에 사용한 development challenge이므로 blind held-out 평가가 아닙니다.
- 365개 curated query는 회귀 방지에는 유용하지만 alias 비중이 높아 실제 사용자 정확도를 독립적으로 추정하지는 못합니다.
- 자동 contract는 엔지니어링 동작을 검사하며 임상적 정확성을 증명하지 않습니다.
- GPT-5.5 응답에는 확률성이 있으므로 이번 통과가 모든 미래 응답을 보장하지 않습니다.
- 실제 임상 유용성, 다국어 문장 품질, 안전성은 전문가의 사람 검토가 계속 필요합니다.
