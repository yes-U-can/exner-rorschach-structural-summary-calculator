# v2 Next.js

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

이 폴더에는 로샤 구조요약 계산기 v2의 릴리즈 기록과 공개 소스코드가 있습니다. 최신 변경 내용은 패치노트에서, 계산 근거는 문헌 안내에서 확인할 수 있습니다.

- 최신 패치노트: [v2.2.13 패치노트](./releases/v2.2.13/)
- 계산 근거와 문헌 범위: [계산 근거와 문헌 범위](./methodology/reference-audit-v2.2.10/)
- 최초 v2 릴리즈 패치노트: [v2.0.0 패치노트](./releases/v2.0.0/)
- 공개 소스코드: [버전 2 소스코드](./source/)

## 공개 범위

`source/`에는 앱 실행에 필요한 소스코드, 번역 파일과 공개 참조 문서가 있습니다.

선택적 AI 기능은 사용자가 본인의 OpenAI API 키를 연결해 사용합니다. API 키는 암호화된 상태로 최대 24시간만 유지되며 AI 연결을 종료하면 삭제되고, 장기 계정 자료로 보관되지 않습니다.

<details>
<summary><strong>개발자가 소스를 직접 실행하는 방법</strong></summary>

```bash
cd v2-nextjs/source
npm install
cp .env.example .env.local
npm run build
```

</details>
