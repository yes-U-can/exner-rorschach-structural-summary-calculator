# [2026-06-28] v2.1.2 버그 패치

v2.1.2는 AI 응답 품질과 릴리즈 검증 체계를 보강한 버그 패치입니다. UI/UX 표면은 유지하고, 백엔드 AI 하네스와 검증 도구를 중심으로 개선했습니다.

## 핵심 요약

- OpenAI 전용 AI 하네스를 추가해 코딩 도우미와 해석 도우미의 시스템 프롬프트, 출력 길이 정책, 응답 완료 메타데이터, 스트리밍 처리를 한곳에서 관리하도록 정리했습니다.
- 코딩 도우미가 후보 코드와 임상가 검토 경계를 더 분명히 말하도록 보강했습니다. 행 자동 입력이나 자동 적용처럼 오해될 수 있는 답변은 막고, 근거가 부족하면 관찰 정보를 더 요청하도록 했습니다.
- 해석 도우미가 단일 지표만으로 진단, 치료, 법적 판단을 확정하지 않도록 guardrail을 강화했습니다. 구조요약 값이 부족한 broad question에서는 임의 지표를 지어내지 않고 점검 순서를 안내하도록 했습니다.
- 답변이 중간에 끊기거나 `max_output_tokens`에 걸리는 문제를 감지할 수 있도록 live eval과 메타데이터 검사를 추가했습니다.
- 지식층 retrieval이 실제로 관련 코딩/해석 자료를 참조하는지 확인하는 계약 테스트를 추가했습니다.
- BYOK 시작 모달의 모델명과 API 키 입력칸 정렬을 다듬어, OpenAI 모델 표시와 키 입력 흐름이 한 줄에서 더 자연스럽게 보이도록 조정했습니다.
- 푸터 버전, i18n 버전 문자열, 버전 아카이브를 v2.1.2로 갱신했습니다.

## AI eval 결과

이번 릴리즈에서는 실제 OpenAI API 호출을 포함한 live eval을 수행했습니다. API 키와 raw model output은 저장하지 않았고, JSONL 로그에는 fixture ID, 상태, issue type, token usage, 출력 길이, 비용 추정치만 남겼습니다.

- 정적 AI 계약 테스트: 28개 통과
- `gpt-4o-mini` 최종 live eval: 105회 호출, 실패 0
- `gpt-5.5` 최종 live eval: 42회 호출, 실패 0
- 저장된 JSONL 전체 fixture 결과: 777개
- 튜닝 과정에서 발견한 issue-bearing fixture: 27개
- 저장 로그 기준 비용 추정치: 약 `$1.155188`
- 평가 리포트: [`source/docs/ai-evals/2026-06-28-v2.1.2-ai-live-eval-report.md`](../../source/docs/ai-evals/2026-06-28-v2.1.2-ai-live-eval-report.md)

## 검증

private 배포 repo에서 다음 검사를 통과한 뒤 공개 소스 스냅샷을 갱신했습니다.

- `npm run ai:evaluate-contracts`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run security:secrets`
- `git diff --check -- v2-nextjs`
- 새 AI eval/test/harness/release 파일의 secret-shaped token 별도 스캔

Vercel production 배포도 최신 private commit 기준으로 READY 상태를 확인했습니다.

## 공개 범위

공개 source에는 앱 실행과 검토에 필요한 소스, 테스트, 참조문서 코퍼스, AI eval 리포트와 JSONL 메타 로그를 포함했습니다. 운영 환경변수, API 키, Vercel 로컬 설정, 로컬 캐시, `node_modules`, raw model output, 비공개 작업 노트는 포함하지 않았습니다.
