# [2026-06-28] v2.1.1 버그 패치

v2.1.1은 채점 입력 화면의 작은 UX 버그와 AI 세션 경험을 정리한 버그 패치입니다. Gemini/Google AI 연결을 제거하고 OpenAI BYOK 흐름으로 단순화했습니다.

## 핵심 요약

- 반응 메모 팝업 안에서 텍스트를 마우스로 드래그할 때, 팝업이 배경 클릭으로 오인되어 닫히던 문제를 수정했습니다.
- 코딩 도우미 대화 중 다른 행을 선택해도 기존 대화 기록과 진행 중인 답변이 초기화되지 않도록 세션 범위를 안정화했습니다.
- AI 연결을 OpenAI API 키 기반 흐름으로 정리하고, Google Gemini provider, Google SDK 의존성, Gemini 키 형식 허용 로직을 제거했습니다.
- BYOK 입력 창의 모델/키 안내 문구를 OpenAI 전용 흐름에 맞게 정리하고, 보안 안내 문구의 줄바꿈을 읽기 쉽게 다듬었습니다.
- 푸터 버전 표기와 버전 아카이브를 v2.1.1로 갱신했습니다.
- 개발/검증 중 확인된 Next.js nonce script hydration 경고를 정리했습니다.

## 영향받은 흐름

AI 기능은 이제 OpenAI API 키만 받습니다. 기존 Google/Gemini 키 형식은 BYOK 입력 검증에서 거부됩니다. 사용자의 API 키는 이전과 동일하게 서버 데이터베이스, `localStorage`, `sessionStorage`에 저장되지 않고, 24시간짜리 HttpOnly 쿠키에 암호화되어 보관됩니다.

코딩 도우미는 선택된 행을 참고 컨텍스트로 사용할 수 있지만, 행 선택 변경 자체가 대화 세션을 새로 만들거나 기존 메시지를 지우지 않습니다. 사용자는 대화 흐름을 유지한 상태에서 다른 행을 참고하며 이어서 질문할 수 있습니다.

반응 메모 팝업 수정은 채점값 계산 결과에는 영향을 주지 않습니다. 입력 중 팝업을 닫는 조건만 더 정확하게 조정했습니다.

## 검증

v2.1.1 배포 전 다음 검사를 통과했습니다.

- ESLint 및 i18n 문구 검사
- 단위/통합 테스트 72건
- 5개 언어 참조문서 runtime-ready 검증
- OpenAI provider 기준 참조문서 vector runtime-ready 검증
- Next.js production build
- 커밋 대상 파일의 whitespace 검사
- 공개 source에서 Gemini provider 의존성 제거 확인
- BYOK UI와 `/api/chat/models`의 OpenAI 전용 응답 확인

GitHub `main` 푸시 후 Vercel production 배포 상태와 운영 URL의 푸터/버전 아카이브 반영 여부를 확인합니다.
