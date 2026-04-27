# v1.0.4

## Metadata

| Field | Value |
| --- | --- |
| Version | `v1.0.4` |
| Release date | 2025-10-20 |
| Release type | 핫픽스 |
| GAS deployment | [Open GAS app](https://script.google.com/macros/s/AKfycbw1GLfIvehoz4wAzC4LicjD_oB0Dpy_sLJ30da9qobx5X4wa3nJr0pLewV0lVPPv1ptGw/exec) |

## Patch Notes

# 주요 수정사항

## *개요*

샘플데이터를 새롭게 교체하여 PoC를 진행 중 오류를 발견하게 되었습니다.

Result 영역의 **[Lower Secection] 탭**에서 값을 나타내는 부분 중

다음 두 가지 항목에 대하여 로직상의 문제가 있어 이를 바로잡았습니다.

- **[Core] 카드**의 EBPer
- **[Ideation] 카드**의 Lv2

또한 일련의 수정사항은 [Gems 챗봇](https://gemini.google.com/gem/1QDCPHshPvq5J9iIKeV-1Nvy0EFzKPN6Y?usp=sharing)에 반영되었습니다.

---

## *세부사항*

### ***[Core] 카드**의 EBPer*

EBPer(Experience Balance Pervasiveness)는 내향형(M)과 외향형(WSumC) 중 어느 한쪽이 우세할 때,

그 스타일이 '얼마나 일관되게 나타나는지'를 보는 비율이며, 계산 원리는 아래와 같습니다.

- M과 WSumC가 **둘 다 0보다 클 때** 계산합니다.
- (둘 중 하나라도 0이면 이 비율은 의미가 없으므로 'N/A' 또는 '-'로 표기합니다.
- 계산식은 `[M과 WSumC 중 큰 값] / [M과 WSumC 중 작은 값]` 입니다.

EBPer을 계산하기에 앞서 기존 코드가 고려하던 조건들은 아래와 같습니다.

- 비율이 `RATIO_THRESHOLD` (2.5) 보다 커야 한다.
- EA가 `EA_THRESHOLD` (4.0) 보다 크거나 같아야 한다

만일 입력된 데이터가 이 조건들을 모두 만족하지 못하면 EBPer을 계산조차 하지 않고 ‘-’로 표시했었습니다.

```jsx
    const D_bucket    = dTable(EA - es);
    const AdjD_bucket = dTable(EA - AdjEs);

    let EBPer = '-';
    // [수정] EBPer (48-50행) : 매직 넘버를 CONFIG에서 참조
    const { RATIO_THRESHOLD, EA_THRESHOLD, DIV_BY_ZERO_FALLBACK } = SCORING_CONFIG.CRITERIA.EBPER;
    if (M_total > 0 || WSumC > 0) {
      if (M_total / (WSumC || 1) > RATIO_THRESHOLD && EA >= EA_THRESHOLD ) {
          EBPer = M_total / (WSumC || DIV_BY_ZERO_FALLBACK);
      } else if (WSumC / (M_total || 1) > RATIO_THRESHOLD && EA >= EA_THRESHOLD) {
          EBPer = WSumC / (M_total || DIV_BY_ZERO_FALLBACK);
      }
      if (typeof EBPer === 'number') {
        EBPer = fix2(EBPer);
      }
    }
```

그런데 이 조건들은 EBPer 값을 계산할지 말지를 결정하는 조건이 아니라,

계산된 EA와 EB를 바탕으로 그 사람의 경험 양식(EB)을

'내향형' / '외향형' / '양가형'으로 명명(naming)하는 규칙의 일부입니다.

따라서 올바른 조건을 다시 적어줍니다.

> M(`M_total`)과 `WSumC` 값이 둘 다 0보다 크면,
별다른 추가 조건 없이 항상 **[큰 값 / 작은 값]**의 비율을 계산하여 `EBPer` 값을 표시
>

```jsx
    const D_bucket    = dTable(EA - es);
        const AdjD_bucket = dTable(EA - AdjEs);

        let EBPer = '-';
    // [수정] EBPer : 로직(간단한 비율)으로 변경
        const { DIV_BY_ZERO_FALLBACK } = SCORING_CONFIG.CRITERIA.EBPER;

        // 로직: IF(OR(M_total=0, WSumC=0), "N/A", ...)
        // 즉, M_total과 WSumC 둘 다 0보다 커야 계산합니다.
    if (M_total > 0 && WSumC > 0) {
            // 로직: LARGE(..., 1) / LARGE(..., 2) -> (큰 값 / 작은 값)
            const largerVal = Math.max(M_total, WSumC);
    const smallerVal = Math.min(M_total, WSumC);

            // (작은 값이 0일 리는 없지만, 안전하게 DIV_BY_ZERO_FALLBACK 사용)
    EBPer = fix2(largerVal / (smallerVal || DIV_BY_ZERO_FALLBACK));
    }
        // 둘 중 하나라도 0이면 EBPer는 초기값 '-'를 유지합니다.
```

### ***[Ideation] 카드**의 Lv2*

‘인지적 특수 점수 (Cognitive Special Scores)’는 사고장애의 심각도를 평가하며,

Level 1과 Level 2로 나뉩니다.

- **Level 1 (경도):** `DV1`, `INCOM1`, `DR1`, `FABCOM1`
- **Level 2 (중증도):** `DV2`, `INCOM2`, `DR2`, `FABCOM2`

기존 코드는 `LEVEL_2_SS` 배열에 `ALOG`와 `CONTAM`을 포함시켰습니다.

하지만 `ALOG`와 `CONTAM`은 Level 1이나 2로 분류되기보다,

그 자체로 가장 심각한 수준의 인지적 왜곡을 나타내는 별개의 범주입니다.

```jsx
LEVEL_2_SS:     ['DV2', 'INCOM2', 'DR2', 'FABCOM2', 'ALOG', 'CONTAM'],
```

이를 정상적으로 작동하게끔 바꾸어주었습니다.

```jsx
LEVEL_2_SS:     ['DV2', 'INCOM2', 'DR2', 'FABCOM2'],
```

> 참고
>

변수 `Level2_count`는 PTI같은 특정 지표를 계산할 때

'Level 2 점수가 총 몇 개인가'를 세기 위해 사용됩니다.

이 때 `ALOG`나 `CONTAM`은 포함하지 않고, 순수하게 `DV2`, `INCOM2`, `DR2`, `FABCOM2` 의 개수만 세는 것이

엑스너의 원리입니다. (`ALOG`와 `CONTAM`은 `WSum6`를 계산할 때 별도의 높은 가중치를 받아 반영됩니다.)

---

# 향후 로드맵

특이사항이 없다면 일정 변동 없이 v1.1.0 마이너패치가 2025년 10월 26일 전까지 완료됩니다.

## Source files

- `source/Code.gs`
- `source/index.html`

## How to use

이 버전의 코드를 재현하려면 `source/` 안의 파일을 Google Apps Script 프로젝트에 같은 파일명으로 만든 뒤 그대로 붙여넣습니다.
GAS 프로젝트에서 웹앱으로 배포하면 해당 버전의 계산기를 직접 실행할 수 있습니다.
