# v1.0.2

## Metadata

| Field | Value |
| --- | --- |
| Version | `v1.0.2` |
| Release date | 2025-10-19 |
| Release type | 핫픽스 |
| GAS deployment | [Open GAS app](https://script.google.com/macros/s/AKfycbwtBFge9jPS03Mz4QD5IlUDfHOetaVGsIe48y9dZESkfWtsJ-dnYv9S5iZ_4wxx4dCOUw/exec) |

## Patch Notes

# 주요 수정사항

## *개요*

Result 영역의 **[Upper Secection] 탭**에서 **[Form Quality] 카드**에 나타나는

MQual의 값을 계산하는 로직에 오류가 있어 이를 수정했습니다.

또한 일련의 수정사항은 [Gems 챗봇](https://gemini.google.com/gem/1QDCPHshPvq5J9iIKeV-1Nvy0EFzKPN6Y?usp=sharing)에 반영되었습니다.

---

## *세부사항*

MQual(M-Quality)은 모든 인간 운동 반응이 각각 어떤 형태질(FQ)로 채점되었는지 교차 집계하는 표입니다.

여기서 '모든 인간 운동 반응'이란 다음 4가지 결정인을 모두 포함해야 합니다.

- M (인간 운동)
- Ma (능동적 인간 운동)
- Mp (수동적 인간 운동)
- Ma-p (능동-수동 인간 운동)

기존 코드는 MQual을 집계할 때 가장 기본적인 'M' 결정인을 누락하고,

Ma · Mp · Ma-p 이렇게 3가지만 검사하고 있었습니다.

```jsx
const MQualMinusDeterminants = ['Ma', 'Mp', 'Ma-p'];

    fqTypes.forEach(fq => {
        const responsesWithFq = validResponses.filter(r => r.fq === fq);
        const mqual_count = responsesWithFq.reduce((total, response) => {
            const matchingDetsInResponse = response.determinants.filter(det => MQualMinusDeterminants.includes(det)).length;
            return total + matchingDetsInResponse;
        }, 0);
...
```

이것을 바로잡고자 MQual 집계 기준이 되는 배열에 누락된 'M'을 추가하고,

혼동을 피하기 위해 변수명을 `MQualDeterminants`로 명확히 수정했습니다.

```jsx
const MQualDeterminants = ['M', 'Ma', 'Mp', 'Ma-p']; // [수정] 'M' 추가 및 변수명 변경

    fqTypes.forEach(fq => {
        const responsesWithFq = validResponses.filter(r => r.fq === fq);
        const mqual_count = responsesWithFq.reduce((total, response) => {
            // [수정] 변경된 변수명(MQualDeterminants)을 사용하도록 수정
            const matchingDetsInResponse = response.determinants.filter(det => MQualDeterminants.includes(det)).length;
            return total + matchingDetsInResponse;
        }, 0);
...
```

이에 따라 index.html에 하드코딩된 `classifyGPHR`의 내용도 수정했습니다.

```html
// 수정 전
const hasHumanMovement = hasAnyDet(["Ma", "Mp", "Ma-p"]); // 'M' 빠진 상태

// 수정 후
const hasHumanMovement = hasAnyDet(["M", "Ma", "Mp", "Ma-p"]); // 'M' 추가 (Code.gs와 동일하게)
```

---

# 향후 로드맵

[향후 로드맵](../v1.1.0/)에서 언급된 수정사항은 v1.1.0 마이너 패치에 반영될 예정입니다.

이 계획의 사전작업으로 v1.0.3 버그 패치를 한 번 더 진행합니다.

코드의 유지보수성 · 안정성 · 확장성을 확보하기 위해

`Code.gs`의 핵심 로직들을 리팩토링할 것입니다.

## Source files

- `source/Code.gs`
- `source/index.html`

## How to use

이 버전의 코드를 재현하려면 `source/` 안의 파일을 Google Apps Script 프로젝트에 같은 파일명으로 만든 뒤 그대로 붙여넣습니다.
GAS 프로젝트에서 웹앱으로 배포하면 해당 버전의 계산기를 직접 실행할 수 있습니다.
