---
canonicalRoute: "scoring-input/location"
locale: "ko"
docKind: "coding-overview"
canonicalTitle: "scoring-input/location"
displayTitle: "[채점 입력] Location"
aliases:
  - "Location"
relatedRoutes:
  - "scoring-input/location/W"
  - "scoring-input/location/WS"
  - "scoring-input/location/D"
  - "scoring-input/location/DS"
  - "scoring-input/location/Dd"
  - "scoring-input/location/DdS"
  - "scoring-input/location/S"
  - "result-interpretation/upper-section/W"
  - "result-interpretation/upper-section/D"
  - "result-interpretation/upper-section/Dd"
  - "result-interpretation/upper-section/S"
authorityPolicy: "curated-internal-reference"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance/ko/scoring-input/location/index.md"
---

# [채점 입력] Location

## 별칭/검색어

- Location

## 핵심 정의

Location은 피검자가 반응을 구성할 때 사용한 잉크반점 영역을 기록하는 부호다. 전체 반점, 흔히 사용하는 세부영역, 드물게 사용하는 세부영역, 흰 여백의 관여 여부를 구분한다.

## 채점/적용 조건

- 전체 반점을 사용하면 [`W`](ref://scoring-input/location/W)를 검토한다.
- 흔히 사용하는 세부영역이면 [`D`](ref://scoring-input/location/D), 드물게 사용하는 세부영역이면 [`Dd`](ref://scoring-input/location/Dd)를 검토한다.
- 흰 여백이 반응 형성에 관여하면 실제 사용 영역에 맞추어 `S`, [`WS`](ref://scoring-input/location/WS), [`DS`](ref://scoring-input/location/DS), [`DdS`](ref://scoring-input/location/DdS)를 구분한다.
- Location Sheet와 Inquiry에서 사용 영역을 정확히 확인한다.

## 주의사항/감별 기준

- Location은 사용 영역을 기록하며 조직화 수준이나 형태 적합성을 뜻하지 않는다. 해당 정보는 [`DQ`](ref://scoring-input/dq)와 [`FQ`](ref://scoring-input/fq)에서 별도로 부호화한다.
- `D`와 `Dd`는 단순한 면적 크기가 아니라 해당 영역이 통상적으로 사용되는 정도에 따라 구분한다.
- 흰 여백의 사용은 추정하지 않고 반응 형성에 실제로 관여했는지 확인한다.

## 상호 참조

인접 규칙이나 연결된 해석 맥락이 필요할 때는 아래 문서를 함께 확인한다.

- [scoring-input/location/W](ref://scoring-input%2Flocation%2FW)
- [scoring-input/location/WS](ref://scoring-input%2Flocation%2FWS)
- [scoring-input/location/D](ref://scoring-input%2Flocation%2FD)
- [scoring-input/location/DS](ref://scoring-input%2Flocation%2FDS)
- [scoring-input/location/Dd](ref://scoring-input%2Flocation%2FDd)
- [scoring-input/location/DdS](ref://scoring-input%2Flocation%2FDdS)
- [scoring-input/location/S](ref://scoring-input%2Flocation%2FS)
- [result-interpretation/upper-section/W](ref://result-interpretation%2Fupper-section%2FW)
- [result-interpretation/upper-section/D](ref://result-interpretation%2Fupper-section%2FD)
- [result-interpretation/upper-section/Dd](ref://result-interpretation%2Fupper-section%2FDd)
- [result-interpretation/upper-section/S](ref://result-interpretation%2Fupper-section%2FS)

## 근거 메모

세부 출처 비교와 판단 근거는 내부 검토 메모에서 관리한다.
