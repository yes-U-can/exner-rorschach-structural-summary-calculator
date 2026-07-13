# [2026-07-12] v2.1.8 버그 패치

## 요약

v2.1.8은 AI가 참조하는 지식층을 다시 감사하고, 코퍼스·벡터 임베딩·라이브 평가를 하나의 검증 가능한 상태로 맞춘 evidence calibration 패치입니다.

앱 UI/UX는 변경하지 않았습니다. 이번 변경은 AI가 참고하는 백엔드 지식과 그 지식을 안전하게 검색·인용·평가하는 코드 및 검증 체계에 집중했습니다.

## 후속 기록 (2026-07-13)

최초 요약은 이 패치를 v2.1.x AI 품질 개선 전체의 마감으로 표현했습니다. 최종 릴리즈 흐름에서 v2.1.8이 완료한 것은 **코퍼스와 벡터 evidence calibration 범위**입니다. 이후 독립 감사에서 retrieval fusion과 다국어 질의 처리의 별도 결함이 확인되어 v2.1.9가 검색 구조를 강화했고, v2.1.10이 그 후속 감사 결함을 닫았습니다.

이 정정은 v2.1.8의 코퍼스 수, 벡터 수, 라이브 평가 및 검증 결과를 변경하지 않습니다.

## 핵심 변경

- 한국어, 영어, 일본어, 스페인어, 포르투갈어의 1,015개 지식 문서를 다시 감사하고 근거 수준에 맞게 보정했습니다.
- PTI, S-CON, DEPI, CDI, HVI, OBS에 명시적인 evidence tier와 HITL 경계를 적용했습니다.
- 고위험 S-CON 응답은 점수만으로 결론내리지 않고 직접 위험평가와 임상가 검토를 요구하도록 retrieval invariant를 강화했습니다.
- 다국어 검색에서 악센트가 있는 정식 표기와 악센트 없는 사용자 입력이 함께 검색되도록 정규화했습니다.
- 수정된 전체 코퍼스를 6,632개 chunk로 다시 생성하고 `text-embedding-3-large` 3,072차원 벡터를 전부 갱신했습니다.
- GPT-5.5를 고정 모델로 사용해 단일턴 18회와 멀티턴 8회의 production-like live eval을 수행했습니다.
- 자연스러운 동의어 표현을 오탐하지 않으면서도 진단 단정, 근거 없는 확정, 자동 적용은 계속 차단하도록 eval contract를 개선했습니다.
- 공개 미러에서 환경변수, Vercel 로컬 상태, 캐시, 로그, 비공개 작업 노트를 제외하고 기존 잔여물도 제거하도록 릴리즈 스크립트를 강화했습니다.

## 검증 결과

- 지식 문서: 5개 언어, 총 1,015개, 언어별 203개
- runtime chunk: 6,632개
- 깨진 내부 참조: 0
- runtime provenance 노출: 0
- curated retrieval query: 360/360 통과
- vector embedding: 6,632/6,632 준비, stale 0
- GPT-5.5 live eval: 26/26 완료
- live eval contract issue: 0
- 응답 중단 및 실패: 0
- unit/integration test: 44 files 통과, 167 passed, 5 intentionally skipped
- production build: 221/221 static page 생성
- dependency audit: 취약점 0

private 배포 repo에서 다음 명령을 통과한 뒤 공개 source mirror를 갱신했습니다.

```bash
npm run docs:audit-authoring
npm run docs:evaluate-rag:all
npm run docs:assert-vector-runtime-ready
npm run ai:release-gate
npm run lint
npm test
npm run build
git diff --check
```

상세한 before/after, evidence tier, 벡터 결과, 라이브 평가 범위와 남은 한계는 [Corpus Evidence Calibration Report](../../source/docs/ai-evals/2026-07-12-corpus-evidence-calibration-report.md)에 기록했습니다.

## 공개 범위와 보안 경계

공개된 eval JSONL은 시나리오 식별자, 완료 상태, issue 유형, token 사용량, 추정 비용 같은 메타데이터만 포함합니다.

API key, `.env*` 파일, Vercel local state, runtime log, local cache, 비공개 작업 노트, 원문 prompt, 원문 model answer, private assessment payload, 비공개 source provenance는 공개하지 않습니다.

## 남아 있는 한계

- 자동화된 contract 검사는 엔지니어링 동작을 검증하며 임상적 진실을 대신하지 않습니다.
- 모델 응답에는 확률성이 있으므로 이번 반복 평가의 통과가 모든 미래 응답을 보증하지는 않습니다.
- 모든 언어 문서를 자동 검사했지만, 다섯 언어 전체 문장의 원어민 임상 편집 검토는 별도의 사람 검수 영역입니다.
