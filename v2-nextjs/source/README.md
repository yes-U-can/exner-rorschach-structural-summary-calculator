# Rorschach Structural Summary Calculator v2

Next.js 기반 로샤 Exner(CS) 체계 구조요약 계산 도우미입니다.

이 폴더는 공개 전시용 소스 패키지입니다. 실제 운영 환경변수, 배포 프로젝트 설정, 로컬 로그, 캐시, 비공개 작업 노트는 포함하지 않습니다.

## 주요 기능

- 구조요약 계산 입력 및 결과 확인
- 한국어, 영어, 일본어, 스페인어, 포르투갈어 UI
- 참조 문서 검색 및 AI 답변 근거용 코퍼스
- BYOK 방식의 코딩 도우미와 해석 도우미
- 라이트/다크 모드
- v1 GAS와 v2 Next.js 릴리즈 아카이브

## 실행

```bash
npm install
cp .env.example .env.local
npm run build
npm run dev
```

`.env.example`에는 필요한 환경변수 이름만 들어 있습니다. 실제 운영 키나 DB 접속 정보는 공개 저장소에 포함하지 않습니다.

## 검사 명령

```bash
npm run i18n:audit
npm run docs:generate-corpus
npm run docs:assert-runtime-ready
npm run lint
npm run test
npm run build
npm run security:secrets
```

## 공개에서 제외한 것

- `.env.local`, `.env.production.local` 등 실제 환경변수 파일
- `.vercel`, `.next`, `node_modules`, npm 캐시, 로그 파일
- 과거 실험적 운영 문서와 비공개 작업 노트
- 삭제된 비즈니스 기능의 DB 마이그레이션 과거 기록

현재 공개 소스는 v2.0.0의 작동 방식과 설계 의도를 검토하기 위한 전시용 패키지입니다.
