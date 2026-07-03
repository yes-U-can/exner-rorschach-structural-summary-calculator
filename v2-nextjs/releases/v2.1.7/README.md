# [2026-07-04] v2.1.7 버그 패치

## 요약

v2.1.7은 v2.1.x AI 품질 작업을 마감하면서, 공개 전시용 아카이브의 README, CHANGELOG, 릴리즈 노트, 버전 아카이브, AI eval 증거 문서가 따라야 할 문서 운영 원칙과 언어 범위 정책을 명문화한 거버넌스 패치입니다.

앱 UI/UX와 AI 런타임 동작은 변경하지 않았습니다. 이번 패치의 목적은 앞으로의 릴리즈 문서가 문서 목적에 맞는 언어 범위를 따르고, 공개 가능한 증거와 비공개로 남겨야 할 정보를 안정적으로 구분하도록 기준을 고정하는 것입니다.

## 핵심 요약

- 공개 릴리즈 문서 기준을 `source/docs/ops/PUBLIC_RELEASE_DOCUMENTATION.md`에 추가했습니다.
- `source/docs/ops/RELEASE_CHECKLIST.md`에 공개 아카이브와 문서 기준 확인 단계를 추가했습니다.
- `source/docs/ARCHITECTURE_GUARDRAILS.md`에 공개 전시 문서와 공개 증거의 보안 경계를 명시했습니다.
- 앱 버전 메타데이터, 푸터 버전 표시, 버전 아카이브를 v2.1.7로 갱신했습니다.
- 공개 README의 문서 언어 기준을 목적별 언어 범위 정책으로 구체화했습니다.
- 글로벌 GitHub 방문자를 위한 `README.en.md` 영어 개요를 추가했습니다.
- 공개 CHANGELOG가 v2.1.2에서 멈춰 있던 문제를 정리하고 v2.1.3부터 v2.1.7까지의 기록을 연결했습니다.

## 검증

private 배포 repo에서 다음 검증을 통과한 뒤 공개 source mirror를 갱신했습니다.

```bash
npm version 2.1.7 --no-git-tag-version
npm run ai:release-gate
npm run lint
npm test
npm run build
git diff --check
```

AI release gate는 reference retrieval, assistant contract, saved eval artifact audit, human review record scoring, secret scan, dependency audit 6개 단계를 모두 통과했습니다.

## 공개 범위와 보안 경계

이 공개 아카이브에는 문서 기준, 릴리즈 체크리스트, 아키텍처 가드레일, 버전 메타데이터, 공개 패치노트만 포함했습니다.

API key, `.env*` 파일, Vercel local state, runtime log, local cache, private work note, raw prompt, raw model answer, private assessment payload는 포함하지 않았습니다.
