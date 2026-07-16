# v2 Next.js

이 폴더는 로샤 구조요약 계산 도우미 v2의 공개 전시용 Next.js 자료입니다.

- 최신 패치노트: [releases/v2.2.2](./releases/v2.2.2/)
- 최신 계산 재감사: [source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md](./source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md)
- 최초 v2 릴리즈 패치노트: [releases/v2.0.0](./releases/v2.0.0/)
- 공개 소스코드: [source](./source/)

## 공개 범위

`source/`에는 앱 실행과 검토에 필요한 핵심 소스코드, 번역 파일, 참조 문서 코퍼스, 테스트, 빌드 설정을 넣었습니다.

운영 환경변수, Vercel 프로젝트 설정, 로컬 로그, 캐시, `node_modules`, 과거 실험적 운영 문서, 비공개 작업 노트, DB 마이그레이션 과거 기록은 넣지 않았습니다. 공개 목적은 작동 방식과 설계 의도를 보여주는 것이며, 운영 환경 전체를 그대로 복제하는 것이 아닙니다.

## 실행 개요

```bash
cd v2-nextjs/source
npm install
cp .env.example .env.local
npm run build
```

실제 AI 기능을 사용하려면 사용자가 본인의 OpenAI API 키를 웹앱의 BYOK 세션에 입력해야 합니다. 서버 DB에 사용자 API 키를 저장하는 구조가 아닙니다.
