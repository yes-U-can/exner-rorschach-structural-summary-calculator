# v1.0.1

## Metadata

| Field | Value |
| --- | --- |
| Version | `v1.0.1` |
| Release date | 2025-10-17 |
| Release type | 핫픽스 |
| GAS deployment | [Open GAS app](https://script.google.com/macros/s/AKfycbwNNeJsgRx0sEnZO4X9XxEUEthQlVS3Ttk6k_OSmIj8aTPlpdBQV1653hmBtzLnVX8Q/exec) |

## Patch Notes

# 주요 수정사항

## *개요*

Result 영역의 **[Lower Secection] 탭**에서 **[Special Indices] 카드**에 나타나는 HVI · OBS의 값이

**[Special Indices] 탭**의 [**HVI]/[OBS] 카드**에서 보여지는 체크박스의 숫자와 다른 문제가 있었습니다.

이를 정상적으로 출력되게 바로잡았습니다.

또한 일련의 수정사항은 [Gems 챗봇](https://gemini.google.com/gem/1QDCPHshPvq5J9iIKeV-1Nvy0EFzKPN6Y?usp=sharing)에 반영되었습니다.

---

## *세부사항*

### *HVI*

**[Special Indices] 탭**의 [**HVI] 카드**에는

”(1)번을 만족시키고 아래 (2)~(8) 항목 중 최소 4개가 해당될 경우 체크”라는 항목을 제외하면

총 8개의 체크박스가 있습니다, 그런데 (1)번 항목과 (2)~(8)번 항목의 위계가 구분되어있었죠.

```jsx
		const hvi_sub_score = Object.keys(hvi_criteria).slice(1).reduce((acc, key) => acc + (hvi_criteria[key] ? 1 : 0), 0);
    const is_hvi_positive = hvi_criteria.c1 && hvi_sub_score >= 4;
    const HVI_val = `${hvi_sub_score}, ${is_hvi_positive ? 'Positive' : 'NO'}`; // MODIFIED
```

`HVI_val`이 `hvi_sub_score`를 사용하고 있는 모습입니다.

하지만 `hvi_sub_score`는 (2)~(8)번 항목에 체크된 박스만 세고 있습니다.

그래서인지 **[Lower Secection] 탭**의 **[Special Indices] 카드**에서 HVI의 값이 1씩 작게 나왔었고,

이것을 다시 (1)~(8) 모든 항목을 세게끔 바꾸어주어야 했습니다.

```jsx
		const hvi_sub_score = Object.keys(hvi_criteria).slice(1).reduce((acc, key) => acc + (hvi_criteria[key] ? 1 : 0), 0);
    const is_hvi_positive = hvi_criteria.c1 && hvi_sub_score >= 4;
    // --- [수정된 부분 시작] ---
    // HVI 기준 8개(c1~c8) 중 true인 것의 '총 개수'를 세는 변수를 새로 만듦
    const hvi_total_checks = Object.values(hvi_criteria).filter(val => val === true).length;
    // Lower Section에 표시할 값을 'c1을 뺀 점수'가 아닌 '총 개수'로 변경
    const HVI_val = `${hvi_total_checks}, ${is_hvi_positive ? 'Positive' : 'NO'}`;
    // --- [수정된 부분 끝] ---
```

`hvi_total_checks`라는 변수를 새로 만들어서, 8개 기준이 담긴 객체 `hvi_criteria`에서

`true`인 값의 총개수를 세도록 했습니다.

그리고 **[Lower Secection] 탭**의 **[Special Indices] 카드**에서 HVI 표시값인  `HVI_val` 이,

이 `hvi_total_checks` 변수를 사용하도록 바꿨습니다.

### *OBS*

**[Special Indices] 탭**의 [**OBS] 카드**에는

“아래 조건 중 1개 이상 해당되면 체크”라는 항목을 제외하면,

4개 항목을 지닌 ‘최종규칙(`rules`)’과 5개 항목을 지닌 ‘기준(`criteria`)’라는

두 위계의 체크박스 그룹이 있습니다.

```jsx
		const obs_score = Object.values(obs_rules).filter(v => v).length;
    const is_obs_positive = obs_score > 0;
    const OBS_val = `${obs_score}, ${is_obs_positive ? 'Positive' : 'NO'}`; // MODIFIED
```

`OBS_val`이 `obs_score`를 사용하고 있는 모습입니다.

하지만 `obs_score`는  ‘기준(`criteria`)’이 아닌 ‘최종규칙(`rules`)’를 세고 있었습니다.

```jsx
		const obs_score = Object.values(obs_rules).filter(v => v).length;
    const is_obs_positive = obs_score > 0;
    // --- [수정된 부분 시작] ---
    // OBS 기준 5개(c1~c5) 중 true인 것의 '총 개수'를 세는 변수를 새로 만듦
    const obs_criteria_score = Object.values(obs_criteria).filter(val => val === true).length;
    // Lower Section에 표시할 값을 '최종 규칙 점수'가 아닌 '기준의 총 개수'로 변경
    const OBS_val = `${obs_criteria_score}, ${is_obs_positive ? 'Positive' : 'NO'}`;
    // --- [수정된 부분 끝] ---
```

`obs_criteria_score` 변수를 새로 만들어서,  ‘기준(`criteria`)’에서 체크된 박스를 세게끔 했습니다.

그리고 **[Lower Secection] 탭**의 **[Special Indices] 카드**에서 OBS 표시값인 `OBS_val` 이,

이 `obs_criteria_score` 변수를 사용하도록 바꿨습니다.

한편 ‘최종규칙(`rules`)’의 체크박스를 세던 `obs_score`는

`Positive` 여부를 판단하는 데만 쓰이도록 그대로 놔두었습니다.

---

# 향후 로드맵

v1.1.0 마이너 패치에서는 다음의 세 가지 사용자 경험을 개선하려고 준비 중에 있습니다.

- 채점표 하단에 위치한 좌우 스크롤바를 상단 배치로 변경
- 채점표의 최대 입력행을 20개에서 40개까지 확장
- 결과지 출력 시 보고 있는 화면이 아닌, 1장짜리 별도의 UI로 인쇄할 수 있는 기능 추가

## Source files

- `source/Code.gs`
- `source/index.html`

## How to use

이 버전의 코드를 재현하려면 `source/` 안의 파일을 Google Apps Script 프로젝트에 같은 파일명으로 만든 뒤 그대로 붙여넣습니다.
GAS 프로젝트에서 웹앱으로 배포하면 해당 버전의 계산기를 직접 실행할 수 있습니다.
