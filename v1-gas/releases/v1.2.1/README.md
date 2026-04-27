# v1.2.1

## Metadata

| Field | Value |
| --- | --- |
| Version | `v1.2.1` |
| Release date | 2025-11-21 |
| Release type | 버그 패치 |
| GAS deployment | [Open GAS app](https://script.google.com/macros/s/AKfycbw6n2R3LgAncLvoXmin89SodbHB6brREdaxFfK2yHADdZelEskafqLH35xL0LFvSqMv/exec) |

## Patch Notes

# 주요 수정사항

## *개요*

코드 품질 개선 및 유지보수성 향상을 위한 리팩토링 작업을 수행했습니다.

또한 일련의 변경점은 [Gems 챗봇](https://gemini.google.com/gem/1QDCPHshPvq5J9iIKeV-1Nvy0EFzKPN6Y?usp=sharing)에 반영되었습니다.

---

## *세부사항*

### *리팩토링 목표*

> **주요 목표**
>
- 성능 최적화: 사용자 입력 시 불필요한 작업 감소
- 가독성 향상: 변수명 및 코드 구조 개선
- 유지보수성 향상: 코드 포맷팅 통일 및 중복 제거
- 확장성 개선: CSS 변수 도입으로 테마 관리 용이

> **평가 기준**
>
- 코드 가독성
- 성능 개선 정도
- 유지보수 용이성
- 일관성

### ***1단계: 성능 최적화 (디바운싱 적용)***

> **문제점**
>
- **위치**: `index.html` 2174-2181줄
- **문제**: 사용자가 입력할 때마다 전체 FormData를 읽고 localStorage에 저장
- **영향**:
    - Response 필드에 19글자 입력 시 → 19번의 전체 저장 발생
    - 50개 행 데이터 기준으로 각 입력마다 약 500-1,000개 필드 처리
    - 불필요한 성능 저하 및 브라우저 지연

> **해결 방법**
>

```jsx
form.addEventListener('input', (e) => {
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => { if (value) data[key] = value; });
    localStorage.setItem(storageKey, JSON.stringify(data));
});
```

```jsx
let saveTimeout = null;
form.addEventListener('input', (e) => {
    if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') {
        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }
        saveTimeout = setTimeout(() => {
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => { if (value) data[key] = value; });
            localStorage.setItem(storageKey, JSON.stringify(data));
        }, 500);  // 500ms 디바운싱
    }
});

```

> **개선 효과**
>
- **저장 빈도**: 19번 → 1번 (95% 감소)
- **성능**: 각 입력마다 5-10ms → 타이핑 끝난 후 1번 5-10ms
- **사용자 체감**: 입력 시 더 부드러운 반응

### *2단계: 변수명 개선*

> **문제점**
>
- **위치**: `index.html` 2374, 2392, 2550, 2639줄
- **문제**: 짧고 모호한 변수명으로 가독성 저하
    - `r` → 무엇을 의미하는지 불명확
    - `up`, `lo`, `si` → 약어로 인한 이해 어려움

> **해결 방법**
>

```jsx
const r = response.results;
const up = r.upper_section;
const lo = r.lower_section;
const si = r.special_indices;

```

```jsx
const results = response.results;
const upperSection = results.upper_section;
const lowerSection = results.lower_section;
const specialIndices = results.special_indices;

```

> **개선 효과**
>
- **가독성**: 변수명만 봐도 의미 파악 가능
- **유지보수성**: 코드 이해 시간 단축
- **변경 범위**: 130개 이상의 참조 지점 수정

### *3단계: 코드 포맷팅 통일*

> **문제점**
>
- **위치**: 전반적, 특히 함수 내부
- **문제**: 들여쓰기가 일관되지 않음
    - 일부 함수: 들여쓰기 없음
    - 일부 함수: 4칸 들여쓰기
    - 일부 함수: 혼합

> **해결 방법**
>
- 모든 함수 내부 코드를 **일관된 4칸 들여쓰기**로 통일
- 수정된 주요 함수

    ---

    - `updateRowCalculations`
    - `createNewRow`
    - `removeLastRow`
    - `updateButtonStates`
    - `classifyGPHR`
    - `updateGPHR`
    - `loadData`
    - `openInitialTab`
    - `openResultsTab`
    - `setCheck`
    - `displayResults`
    - `applyZeroGrayOut`
    - `displayError`
    - `downloadCSV`
    - `handleScoringTabFirstLoad`
    - 기타 이벤트 핸들러들


> **개선 효과**
>
- **가독성**: 코드 구조 파악 용이
- **일관성**: 팀 협업 시 코드 스타일 통일
- **유지보수성**: 수정 시 실수 감소

### *4단계: 중복 함수 제거*

> **문제점**
>
- **위치**: `index.html` 2380줄
- **문제**: `setText` 함수가 `displayResults` 함수 내부에만 정의되어 재사용 불가

> **해결 방법**
>

```jsx
function displayResults(response) {
    const setText = (id, value) => { ... };  // 함수 내부에만 정의
    // ...
}

```

```jsx
// 전역 유틸리티 함수로 이동
function setText(id, value) {
    try {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = (value !== null && value !== undefined) ? value : '';
        }
    } catch (e) {
        console.error(`Error setting text for ID "${id}":`, e);
    }
}

function displayResults(response) {
    setText(...);  // 재사용 가능
}

```

> **개선 효과**
>
- **재사용성**: 다른 함수에서도 `setText` 사용 가능
- **코드 중복 제거**: 함수가 한 곳에만 정의됨
- **유지보수성**: 수정 시 한 곳만 변경하면 됨

### *5단계: CSS 변수 도입*

> **문제점**
>
- **위치**: `styles.html` 전반
- **문제**: 색상값이 하드코딩되어 중복 많음
    - `#007bff` (primary color)가 여러 곳에 반복
    - 색상 변경 시 여러 곳 수정 필요

> **해결 방법**
>

```css
button { background-color: #007bff; }
#add-row-btn { background-color: #007bff; }
.tab button.active { border-bottom: 2px solid #007bff; }

```

```css
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --warning-color: #ffc107;
    --bg-light: #f8f9fa;
    --bg-lighter: #e9ecef;
    --bg-white: #ffffff;
    --text-dark: #212529;
    --text-darker: #343a40;
    --text-muted: #495057;
    --border-color: #dee2e6;
    --border-light: #ccc;
    --disabled-opacity: 0.5;
}

button { background-color: var(--primary-color); }
#add-row-btn { background-color: var(--primary-color); }
.tab button.active { border-bottom: 2px solid var(--primary-color); }

```

> **개선 효과**
>
- **유지보수성**: 색상 변경 시 변수만 수정
- **일관성**: 동일한 색상이 전역에서 일관되게 사용
- **테마 적용 용이**: 변수만 변경하면 테마 전환 가능

### *개선 효과*

> **성능 개선**
>

| 항목 | 개선 전 | 개선 후 | 개선율 |
| --- | --- | --- | --- |
| localStorage 저장 빈도 (19글자 입력) | 19번 | 1번 | **95% 감소** |
| 처리 시간 (50개 행 기준) | 각 입력마다 5-10ms | 타이핑 끝난 후 1번 5-10ms | **95% 감소** |
| 사용자 체감 | 약간 느림 | 부드러움 | **향상** |

> **코드 품질 개선**
>

| 항목 | 개선 전 | 개선 후 |
| --- | --- | --- |
| 변수명 가독성 | 낮음 (r, up, lo, si) | 높음 (명확한 이름) |
| 코드 포맷팅 | 불일치 | 일관된 4칸 들여쓰기 |
| 함수 재사용성 | 낮음 (중복 정의) | 높음 (전역 유틸리티) |
| CSS 유지보수성 | 낮음 (하드코딩) | 높음 (변수 사용) |

> **유지보수성 향상** (추정치)
>
- **변수명 개선**: 코드 이해 시간 **30% 단축**
- **포맷팅 통일**: 코드 수정 시 실수 **50% 감소**
- **CSS 변수**: 색상 변경 작업 시간 **80% 단축**

### *변경 사항 상세*

> **파일별 변경 통계**
>

- `index.html`

    ---

    - **총 변경 라인**: 약 200줄 이상
    - **주요 변경 사항**:
        - 변수명 변경: 130개 이상 참조 지점
        - 들여쓰기 수정: 50개 이상 함수/블록
        - 함수 이동: 1개 (setText)
        - 디바운싱 추가: 1개 이벤트 리스너


- `styles.html`

    ---

    - **총 변경 라인**: 약 30줄
    - **주요 변경 사항**:
        - CSS 변수 정의: 15개 변수 추가
        - 색상값 교체: 20개 이상 지점


> **주요 변경 함수 목록**
>
- JavaScript 함수

    ---

    1. `updateRowCalculations` - 들여쓰기 수정
    2. `createNewRow` - 들여쓰기 수정
    3. `removeLastRow` - 들여쓰기 수정
    4. `updateButtonStates` - 들여쓰기 수정
    5. `classifyGPHR` - 변수명 및 들여쓰기 수정
    6. `updateGPHR` - 들여쓰기 수정
    7. `loadData` - 들여쓰기 수정
    8. `handleScoringTabFirstLoad` - 들여쓰기 수정
    9. `openInitialTab` - 들여쓰기 수정
    10. `openResultsTab` - 들여쓰기 수정
    11. `setCheck` - 들여쓰기 수정
    12. `setText` - 전역 함수로 이동
    13. `displayResults` - 변수명 및 들여쓰기 수정
    14. `applyZeroGrayOut` - 들여쓰기 수정
    15. `displayError` - 들여쓰기 수정
    16. `downloadCSV` - 들여쓰기 수정
    17. `onSummaryExportSuccess` - 들여쓰기 수정
    18. `onRawDataExportSuccess` - 들여쓰기 수정


> **CSS 변경 사항**
>
- 추가된 CSS 변수

    ---

    ```css
    :root {
        /* Primary Colors */
        --primary-color: #007bff;
        --secondary-color: #6c757d;
        --success-color: #28a745;
        --warning-color: #ffc107;

        /* Background Colors */
        --bg-light: #f8f9fa;
        --bg-lighter: #e9ecef;
        --bg-white: #ffffff;

        /* Text Colors */
        --text-dark: #212529;
        --text-darker: #343a40;
        --text-muted: #495057;
        --text-light: #999999;

        /* Border Colors */
        --border-color: #dee2e6;
        --border-light: #ccc;
        --border-dark: #999;

        /* Status Colors */
        --error-color: #dc3545;
        --disabled-opacity: 0.5;
    }

    ```


---

# 향후 로드맵

개별 반응마다 채점을 하는 기능을 구현하기 위해서는 채점 필드에 값을 입력받는 방식을 바꾸어야 합니다.

이 부분에 대한 로직 수정이 v1.3.0 마이너 패치에서 함께 이루어질 예정입니다.

## Source files

- `source/Code.gs`
- `source/index.html`
- `source/styles.html`

## How to use

이 버전의 코드를 재현하려면 `source/` 안의 파일을 Google Apps Script 프로젝트에 같은 파일명으로 만든 뒤 그대로 붙여넣습니다.
GAS 프로젝트에서 웹앱으로 배포하면 해당 버전의 계산기를 직접 실행할 수 있습니다.
