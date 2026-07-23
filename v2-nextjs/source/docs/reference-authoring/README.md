# Reference Authoring Workspace

이 디렉터리는 웹앱과 AI 도우미가 검색하는 짧은 참조 문서를 작성하고 검수하는 작업 공간입니다. 참조 문서는 계산식의 정답을 바꾸지 않으며, 코딩과 해석 개념을 설명하는 보조 자료입니다.

참조 문서를 작성하고 검수할 때 지키는 핵심 원칙은 다음과 같습니다.

- 채점 문서와 해석 문서를 구분합니다.
- 해석은 진단이 아니라 확인이 필요한 가설로 씁니다.
- 고위험 주제는 지수 결과만으로 결론내리지 않고 직접 평가가 필요하다고 밝힙니다.
- 다섯 언어 문서는 같은 주제 구조를 공유하지만, 자동 번역만으로 임상적 품질을 보증하지 않습니다.
- 비공개 검토 자료의 파일명, 위치, 구체적인 작성 관계는 공개 화면과 저장소에 노출하지 않습니다.

## 디렉터리 구조

- `incoming/`: 검토 중인 자료를 두는 로컬 전용 공간입니다. Git과 공개 릴리즈에 포함하지 않습니다.
- `drafts/`: 실제 참조 문서 원고입니다. 한국어·영어·일본어·스페인어·포르투갈어가 같은 주제 구조를 공유합니다.
- `notes/`: 내부 검토와 품질 확인 기록입니다. 공개 소스에 포함하지 않습니다.
- `runtime-promotion.json`: 언어별 문서가 실제 검색에 사용될 준비 상태를 관리합니다.
- `rule-invariants.json`: 다섯 언어가 동일하게 진술해야 하는 임상 규칙 불변식 목록입니다. `docs:audit-authoring`이 언어별 규칙 문장 존재와 금지 표현을 함께 검사합니다.

각 언어는 동일한 203개 route를 가지며, 본문과 상호 참조만 locale에 맞게 작성합니다.

## 문서 상태와 런타임 승격의 의미

- `drafts/`라는 이름과 달리 이 디렉터리는 준비 공간이 아니라 **런타임 코퍼스의 유일한 편집 원본**입니다. 생성 스크립트는 이 원고에서 `generated/reference-corpus/*`를 만들고, 앱과 AI 검색은 그 산출물만 읽습니다.
- frontmatter `status`는 편집 단계 라벨입니다. 허용값은 `stub`, `draft`, `reviewed`, `locked`이며, `stub`만 런타임에서 제외됩니다. 나머지 값은 언어 단위 승격이 켜져 있으면 동일하게 서빙됩니다.
- 실제 승격은 파일 단위가 아니라 **언어 단위**입니다. `runtime-promotion.json`의 `locales.<locale>.runtimeReady`가 승격 스위치이고, 각 언어는 검색 게이트·전체 테스트·프로덕션 빌드를 통과한 뒤 승격 일자와 사유가 기록되어 있습니다.
- 파일 단위 frontmatter `runtimeReady`는 어떤 스크립트도 읽지 않는 죽은 필드였기 때문에 2026-07-23에 전부 제거했습니다. `docs:audit-authoring`이 이 필드의 재도입과 허용되지 않는 `status` 값을 차단합니다.

## 참조 문서 원칙

1. 채점 문서와 해석 문서를 분리합니다.
2. 한 문서는 하나의 공식 문서 경로만 책임집니다.
3. 내부 링크는 `ref://...` 형식을 사용합니다.
4. 해석은 진단이 아니라 가설로 서술하고, 관련 변수와 대안 설명을 함께 제시합니다.
5. 고위험 주제는 지수 결과와 별개로 직접 평가해야 할 항목을 명시합니다.
6. 특수지수를 모두 같은 신뢰도로 취급하지 않고, 지수별 근거 수준과 한계를 따릅니다.
7. 비공개 검토 자료의 제목, 파일명, 위치는 실제 웹앱·UI·공개 저장소에 노출하지 않습니다.

## 문서 순서와 문체

- 화면의 참조 문서 순서는 번역된 제목의 알파벳순이 아니라 `DOC_STRUCTURE`에 정의된 채점·구조요약 순서를 따릅니다.
- 최상위 해석 문서는 `Upper Section`, `Lower Section`, `Special Indices` 순서를 모든 언어에서 동일하게 유지합니다.
- 참조 문서는 대화 답변이 아니라 설명서입니다. 요청하거나 권하는 말투보다 정의, 조건, 주의사항을 직접 서술합니다.
- 한국어는 간결한 해설문 `-다`체로 통일하며 `-습니다`체와 `해 주세요`를 섞지 않습니다.
- 영어는 중립적인 현재 시제, 일본어는 설명문 `です・ます`체, 스페인어와 포르투갈어는 중립적인 비인칭 설명문을 기본으로 합니다.
- 일본어 원고의 제목과 문단 표제도 일본어로 작성하고, 영어 작성용 표제를 그대로 남기지 않습니다.
- 출처 비교와 provenance 메모는 원고 작업 공간에 보존하되, 사람용 참조 화면과 AI 검색 청크에서는 제외합니다.
- 번역 때문에 버튼 순서, 문서 계층, 정식 부호가 달라지지 않아야 합니다.

<details>
<summary><strong>문서 작성자와 개발자를 위한 세부 절차</strong></summary>

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

문서가 바뀌면 AI가 검색하는 기존 수치 표현도 이전 내용이 됩니다. 이때 원고를 되돌리는 것이 아니라 현재 참조 문서로 OpenAI 검색 자료와 릴리즈 상태 기록을 다시 생성해야 합니다.

```powershell
npm run docs:generate-embeddings:openai
npm run docs:generate-vector-release-snapshot
```

## 상태의 의미

- `draft`: 런타임에 사용할 수 있는 작성본이지만 독립적인 임상 검수 완료를 뜻하지 않습니다.
- `reviewed`: 정해진 검수 절차를 통과한 문서입니다.
- `locked`: 내용과 운영 계약이 고정된 문서입니다.

상태를 근거 없이 올리지 않습니다. 자동 철자 교정이나 검색 검사 통과만으로 `reviewed`가 되지는 않습니다.

</details>

## 공개 경계

공개 소스에는 실행 가능한 앱, 공개 참조 문서, AI가 검색하는 데 필요한 공개 자료만 포함합니다. 다음 항목은 제외합니다.

- `docs/reference-authoring/incoming/`
- `docs/reference-authoring/notes/`
- 비공개 작업 기록과 인수인계 문서
- 환경 변수, API 키, 로컬 데이터베이스, 로그

공개 문서는 프로젝트 안에서 선별하고 검토했다는 사실만 설명합니다. 특정 비공개 자료가 특정 참조 문서의 직접 출처라고 공개적으로 주장하지 않습니다.
