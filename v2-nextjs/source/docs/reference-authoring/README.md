# Reference Authoring Workspace

이 디렉터리는 웹앱이 검색하는 내장 참조 코퍼스를 작성하고 검수하는 내부 작업 공간입니다.

## 디렉터리 구조

- `incoming/`: 비공개 원자료와 추출 텍스트를 두는 로컬 전용 공간입니다. Git과 공개 릴리스에 포함하지 않습니다.
- `drafts/`: 실제 코퍼스 원고입니다. `ko`, `en`, `ja`, `es`, `pt`가 같은 route 구조를 공유합니다.
- `notes/`: 내부 provenance, 배치 기록, QA 기록입니다. 공개 미러에 포함하지 않습니다.
- `runtime-promotion.json`: locale별 런타임 승격 상태를 관리합니다.

각 언어는 동일한 203개 route를 가지며, 본문과 상호 참조만 locale에 맞게 작성합니다.

## 코퍼스 원칙

1. 채점 문서와 해석 문서를 분리합니다.
2. 한 문서는 하나의 canonical route만 책임집니다.
3. 내부 링크는 `ref://...` 형식을 사용합니다.
4. 해석은 진단이 아니라 가설로 서술하고, 관련 변수와 대안 설명을 함께 제시합니다.
5. 고위험 주제는 지수 결과와 별개로 직접 평가해야 할 항목을 명시합니다.
6. 특수지수는 동일한 신뢰도로 취급하지 않고 중앙 evidence policy를 적용합니다.
7. 원자료의 제목, 파일명, 입수 경로는 런타임·UI·공개 저장소에 노출하지 않습니다.

## Frontmatter 계약

모든 `drafts/**/index.md`는 다음 필드를 가져야 합니다.

- `canonicalRoute`
- `locale`
- `docKind`
- `canonicalTitle`
- `displayTitle`
- `aliases`
- `relatedRoutes`
- `authorityPolicy: "curated-internal-reference"`
- `status`
- `runtimeReady`
- `provenanceNote`

`provenanceNote`는 저장소 안에 실제로 존재하는 내부 메모를 가리켜야 합니다. 공통 검수만 필요한 문서는 `notes/corpus-review-ledger.md`를 사용할 수 있습니다.

## 생성 흐름

원고는 다음 순서로 런타임 산출물이 됩니다.

1. `docs/reference-authoring/drafts/...` 원고 작성
2. `npm run docs:audit-authoring`으로 문자·언어·metadata 검사
3. `npm run docs:generate-corpus`로 route 문서와 검색 chunk 생성
4. locale별 retrieval eval 실행
5. embedding 재생성과 vector fingerprint 확인
6. 전체 테스트와 production build

주요 산출물:

- `generated/reference-corpus/route-docs.json`
- `generated/reference-corpus/chunks.json`
- `generated/reference-corpus/manifest.json`
- `generated/reference-corpus/qa-report.json`
- `generated/reference-corpus/release-snapshot.json`

## 자주 쓰는 명령

```powershell
npm run docs:audit-authoring
npm run docs:generate-corpus
npm run docs:evaluate-rag:all
npm run docs:verify-release
npm run ops:release-status
npm run ops:vector-status
```

문서가 바뀌면 기존 embedding은 stale 상태가 됩니다. 이때 원고를 되돌리는 것이 아니라 현재 corpus로 embedding과 vector release snapshot을 다시 생성해야 합니다.

```powershell
npm run docs:generate-embeddings:openai
npm run docs:generate-vector-release-snapshot
```

## 상태의 의미

- `draft`: 런타임에 사용할 수 있는 작성본이지만 독립적인 임상 검수 완료를 뜻하지 않습니다.
- `reviewed`: 정해진 검수 절차를 통과한 문서입니다.
- `locked`: 내용과 운영 계약이 고정된 문서입니다.

상태를 근거 없이 올리지 않습니다. 자동 철자 교정이나 retrieval 통과만으로 `reviewed`가 되지는 않습니다.

## 공개 경계

공개 미러에는 실행 가능한 앱, 공개 문서, 생성된 런타임 코퍼스만 포함합니다. 다음 항목은 제외합니다.

- `docs/reference-authoring/incoming/`
- `docs/reference-authoring/notes/`
- 비공개 작업 로그와 handoff 문서
- 환경 변수, API 키, 로컬 데이터베이스, 로그

공개 산출물은 코퍼스가 내부적으로 큐레이션되고 검수된다는 사실만 설명합니다. 특정 원자료와 코퍼스 사이의 작성 관계를 공개적으로 주장하지 않습니다.
