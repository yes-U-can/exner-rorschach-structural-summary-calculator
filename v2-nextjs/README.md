# v2 Next.js

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

이 폴더에는 로샤 구조요약 계산기 v2의 릴리즈 기록과 공개 가능한 소스코드가 있습니다. 최신 변경 내용은 패치노트에서, 검산과 구현 자료는 공개 소스에서 확인할 수 있습니다.

- 최신 패치노트: [releases/v2.2.7](./releases/v2.2.7/)
- 계산 정확성 재감사: [source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md](./source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md)
- 최초 v2 릴리즈 패치노트: [releases/v2.0.0](./releases/v2.0.0/)
- 공개 소스코드: [source](./source/)

## 공개 범위

`source/`에는 앱 실행과 검토에 필요한 핵심 소스코드, 번역 파일, AI가 검색하는 짧은 참조 문서 모음, 자동 검사, 배포 설정을 넣었습니다.

운영 환경변수, Vercel 프로젝트 설정, 로컬 로그, 캐시, `node_modules`, 과거 실험적 운영 문서, 비공개 작업 노트, DB 마이그레이션 과거 기록은 넣지 않았습니다. 공개 소스에서 핵심 작동 방식과 설계를 확인할 수 있지만 운영 환경 전체가 포함되지는 않습니다.

<details>
<summary><strong>개발자가 소스를 직접 실행하는 방법</strong></summary>

```bash
cd v2-nextjs/source
npm install
cp .env.example .env.local
npm run build
```

실제 AI 기능을 사용하려면 사용자가 본인의 OpenAI API 키를 웹앱의 BYOK 세션에 입력해야 합니다. 서버 DB에 사용자 API 키를 저장하는 구조가 아닙니다.

</details>
