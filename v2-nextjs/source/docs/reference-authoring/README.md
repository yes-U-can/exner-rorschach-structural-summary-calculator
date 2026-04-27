# Reference Authoring Workspace

이 폴더는 로샤 검사 웹앱의 `참조 문서 원본`을 준비하고 검증하는 작업 공간입니다.

쉽게 말하면:

- 원문 자료는 `incoming/`에 둡니다.
- 실제 참조 문서 초안은 `drafts/`에 둡니다.
- 출처 메모, 배치 기록, QA 기록은 `notes/`에 둡니다.

이 작업 공간의 목표는 `5개 언어가 같은 문서 구조를 공유하면서`, 언어권마다 다른 본문과 상호참조를 가진 `위키형 reference corpus`를 만드는 것입니다.

## 폴더 역할

### `incoming/`

- 논문, 책, PDF, TXT, OCR 결과 같은 원문 자료를 넣는 곳입니다.
- 원문은 가능한 한 수정하지 않고 그대로 둡니다.

### `drafts/`

- 실제 참조 문서 초안을 저장하는 곳입니다.
- 현재는 locale과 route 기준으로 관리합니다.

예시:

- `drafts/ko/scoring-input/dq/plus/index.md`
- `drafts/es/result-interpretation/lower-section/core/lambda/index.md`

### `notes/`

- 출처 우선순위 메모
- 배치 작업 로그
- 용어 충돌 메모
- QA 체크리스트
- 릴리스 검증 플레이북

## Shared-180 구조

이 프로젝트는 `5개 언어가 같은 route skeleton`을 공유합니다.

- entry route: `180개`
- category route: `23개`
- locale: `ko`, `en`, `ja`, `es`, `pt`

즉, 언어마다 페이지 개수와 route 구조는 같고, 아래 두 가지만 달라질 수 있습니다.

- 본문
- relatedRoutes

## 권위 기준

- 공통 최상위 기준: `Exner`
- 한국어: `Exner + 한국어 가이드라인`
- 스페인어: `Exner + 스페인어 manual`
- 영어/일본어/포르투갈어: `Exner base`

## 작성 원칙

- 채점 문서와 해석 문서를 분리합니다.
- 같은 기호라도 뜻이 다르면 문서를 분리합니다.
- 문서는 짧고 구조적으로 씁니다.
- 본문 안에서는 `ref://...` 형식의 인라인 위키 링크를 사용합니다.
- 자세한 출처 메모는 공개 본문보다 `notes/`에 두는 것을 기본으로 합니다.

## 런타임 구조

원본 markdown을 바로 앱이 읽는 구조가 아니라, 아래 순서로 흘러갑니다.

1. `docs/reference-authoring/drafts/...` 에서 원본 초안 작성
2. `npm run docs:generate-corpus` 로 generated artifact 생성
3. 앱은 `generated/reference-corpus/...` 를 읽음

중요 파일:

- `generated/reference-corpus/manifest.json`
- `generated/reference-corpus/qa-report.json`
- `docs/reference-authoring/runtime-promotion.json`

## 자주 쓰는 명령

### corpus 생성

```powershell
npm run docs:generate-corpus
```

### locale별 retrieval 평가

```powershell
npm run docs:evaluate-rag:ko
npm run docs:evaluate-rag:es
npm run docs:evaluate-rag:en
npm run docs:evaluate-rag:ja
npm run docs:evaluate-rag:pt
```

### 릴리스 전 전체 검증

```powershell
npm run docs:verify-release
```

이 명령은 아래 순서로 고정되어 있습니다.

1. corpus 재생성
2. 5개 locale retrieval eval
3. 전체 테스트
4. 프로덕션 빌드

### 현재 릴리스 상태 요약 보기

```powershell
npm run ops:release-status
```

이 명령은 `manifest.json`과 `qa-report.json`을 읽어서 locale별 준비 상태를 한눈에 보여줍니다.

### 현재 배포 컨텍스트 요약 보기

```powershell
npm run ops:deploy-context
```

이 명령은 아래를 한 번에 보여줍니다.

- 현재 branch
- origin remote
- 작업트리 dirty 상태
- 연결된 Vercel project 정보
- locale별 runtime source 상태
- 다음 배포 순서

## 배포 후 스모크 체크

배포된 URL이 있으면 아래처럼 점검합니다.

```powershell
$env:SMOKE_BASE_URL="https://your-deployed-url"
npm run ops:smoke-reference
npm run ops:smoke-admin
```

`SMOKE_BASE_URL`을 주지 않아도, 배포 환경에 `VERCEL_URL`이 있으면 그 값을 자동으로 사용합니다.

`ops:smoke-reference`는:

- `/ref` 로케일별 로딩
- 대표 문서 상세 페이지 로딩
- `/transparency`의 runtime source 표시

를 확인합니다.

`ops:smoke-admin`은:

- `/admin`
- `/admin/rag`
- `/admin/audit`
- `/admin/store`
- `/admin/credits`

가 5xx 없이 응답하는지 확인합니다.

## publish 스크립트

기본 publish:

```powershell
.\scripts\publish.ps1 -Message "chore: publish sync"
```

이 스크립트는 기본적으로 먼저 `npm run docs:verify-release`를 돌린 뒤, 통과한 경우에만 sync/push를 진행합니다.

즉, 특별한 이유가 없다면 `-SkipVerify`는 쓰지 않는 것이 원칙입니다.

### publish mirror 위치가 다를 때

```powershell
.\scripts\publish.ps1 -PublishRoot "D:\my-publish-repo" -Message "chore: publish sync"
```

### mirror 없이 현재 git repo에서 직접 publish할 때

```powershell
.\scripts\publish.ps1 -UseCurrentRepo -Message "chore: publish sync"
```

이 모드에서는 현재 git repo 안에서 `v2-nextjs` 경로만 stage/commit 하도록 설계되어 있습니다.

### 안전한 dry-run

```powershell
npm run ops:publish:direct-dry-run
npm run ops:publish:mirror-dry-run
```

dry-run은 실제 commit/push 없이 publish 범위만 보여줍니다.

### publish 직후 smoke까지 한 번에 돌리고 싶을 때

```powershell
.\scripts\publish.ps1 -UseCurrentRepo -Message "chore: publish sync" -SmokeBaseUrl "https://your-deployed-url"
```

cron 보호가 있는 admin health도 같이 보려면:

```powershell
.\scripts\publish.ps1 -UseCurrentRepo -Message "chore: publish sync" -SmokeBaseUrl "https://your-deployed-url" -SmokeCronSecret "your-secret"
```

이 옵션을 주면 push 후 자동으로 `ops:smoke-release`를 실행합니다.

## 기록 원칙

작업은 배치 단위로 기록합니다.

- 무엇을 읽었는지
- 무엇을 정리했는지
- 무엇이 아직 불확실한지
- 다음 배치에서 무엇을 할지

이 기록은 모두 `notes/`에 남깁니다.

## 초보자용 한 줄 정리

`incoming`은 원문, `drafts`는 문서 초안, `notes`는 작업 기록이라고 기억하면 됩니다.
