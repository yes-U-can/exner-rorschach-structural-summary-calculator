# [2026-06-22] v2.1.0 마이너 패치

v2.1.0은 설치형 웹앱 경험을 위한 manifest-only PWA 지원, 초기 구현 학습 참고 자료였던 RorScore에 대한 감사 기록, 그리고 AI 참조문서 검색 랭킹 보정을 함께 반영한 마이너 패치입니다.

## 핵심 요약

- Chrome/Edge 등 지원 브라우저에서 웹앱을 설치형 앱처럼 열 수 있도록 Next.js 표준 `app/manifest.ts` 기반 PWA manifest를 추가했습니다.
- 보안 범위를 좁게 유지하기 위해 service worker, 오프라인 캐시, push 알림, background sync는 추가하지 않았습니다.
- PWA manifest가 192px/512px 앱 아이콘을 명시하도록 하고, 관련 네이티브 앱 설치 유도 없이 현재 웹앱만 설치 대상으로 노출되도록 테스트를 추가했습니다.
- `DQ+` 같은 코딩 질문에서 AI 참조문서 검색이 비교 대상으로 언급된 해석 문서보다 해당 채점 입력 문서를 먼저 찾도록 랭킹을 보정했습니다.
- 초기 Google Apps Script 구현 시기에 Jeremy Leader의 RorScore가 중요한 학습 참고 자료였음을 `ACKNOWLEDGEMENTS.md`에 기록했습니다.

## 영향받은 흐름

PWA 변경은 앱의 저장 방식이나 API 키 보안 모델을 바꾸지 않습니다. 사용자가 입력한 BYOK API 키는 기존과 동일하게 서버 데이터베이스, `localStorage`, `sessionStorage`에 저장되지 않고, 24시간짜리 HttpOnly 쿠키에 암호화되어 보관됩니다.

이번 버전의 PWA 지원은 앱 이름, 시작 주소, 표시 방식, 아이콘 같은 설치 메타데이터를 브라우저에 알려주는 수준입니다. 민감한 평가 데이터나 AI 응답을 오프라인 캐시에 저장하는 service worker 계층은 도입하지 않았습니다.

AI 참조문서 검색 보정은 계산 결과에는 영향을 주지 않습니다. 다만 코딩 도우미가 "DQ+는 언제 DQo나 DQv/+가 아니라 DQ+로 코딩해야 하나?" 같은 질문을 받았을 때, 해석 문서보다 채점 입력 문서를 우선 참고하도록 품질을 개선했습니다.

## 감사 기록

v2.1.0에는 RorScore에 대한 뒤늦은 감사 기록도 포함됩니다. 이 프로젝트는 RorScore의 코드를 복사하거나 포함하지 않지만, 초기 GAS 구현을 시작하던 시기에 RorScore는 로샤 구조요약 계산 로직을 코드로 표현할 수 있다는 것을 보여준 중요한 학습 참고 자료였습니다.

자세한 내용은 루트의 `ACKNOWLEDGEMENTS.md`에서 확인할 수 있습니다.

## 검증

v2.1.0 배포 전 다음 검사를 통과했습니다.

- ESLint 및 i18n 문구 검사
- 단위/통합 테스트 68건
- 5개 언어 참조문서 RAG 릴리즈 평가
- 참조문서 runtime-ready 검증
- Next.js production build
- `npm run security:check` high 기준 보안 점검
- PWA manifest 응답 확인 (`/manifest.webmanifest`)

GitHub `main` 푸시 후 Vercel production 배포 상태와 운영 URL의 푸터/버전 아카이브 반영 여부를 확인합니다.
