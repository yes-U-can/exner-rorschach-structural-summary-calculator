# [2026-07-03] v2.1.5 버그 패치

v2.1.5는 v2 Next.js 앱의 AI 릴리즈 준비도를 강화한 패치입니다.

완성된 UI/UX 화면은 변경하지 않았고, 이후 릴리즈에서 assistant harness를 로컬과 GitHub Actions에서 같은 방식으로 확인할 수 있도록 반복 가능한 AI release gate를 추가했습니다.

## 핵심 요약

- `npm run ai:release-gate` 명령을 추가했습니다.
- dry-run, JSON, markdown report를 지원하는 privacy-safe AI release gate runner를 추가했습니다.
- AI release gate runner 테스트를 추가했습니다.
- release gate 자체를 `npm run ai:evaluate-contracts` 검증 범위에 포함했습니다.
- GitHub Actions `security-check`가 dependency/security check 전에 AI release gate를 실행하도록 연결했습니다.
- `docs/ai-evals/2026-07-03-v2.1.5-ai-release-gate-report.md`를 추가했습니다.
- footer, package, version archive 메타데이터를 v2.1.5로 갱신했습니다.

## 릴리즈 게이트

새 gate는 다음 명령을 실행합니다.

1. `npm run ai:evaluate-contracts`
2. `npm run ai:evaluate-artifacts`
3. `npm run ai:evaluate-human-records -- --require-pass`
4. `npm run security:secrets`

필수 단계가 실패하면 즉시 중단하고 non-zero exit code를 반환합니다. 그래서 로컬 검증과 CI 검증에서 같은 기준으로 사용할 수 있습니다.

## 검증

private 배포 repo에서 다음 검증을 통과했습니다.

- `npm run ai:release-gate`
- `npm run lint`
- `npm run build`
- `npm run security:check`
- `git diff --check`

당시 `npm run security:check`는 high-severity gate 기준으로 통과했습니다. `gray-matter` 하위의 transitive `js-yaml` moderate advisory는 non-blocking follow-up으로 기록했습니다. 이 항목은 이후 v2.1.6에서 정리되었습니다.

## 공개 범위

공개 source mirror에는 gate runner, 테스트, 문서, 릴리즈 메타데이터를 포함했습니다.

공개 아카이브에는 API key, `.env*` 파일, Vercel local state, raw model output, raw prompt, raw chat message, 비공개 운영 노트를 포함하지 않았습니다.
