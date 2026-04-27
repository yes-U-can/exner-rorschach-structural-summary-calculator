# v1.2.0

## Metadata

| Field | Value |
| --- | --- |
| Version | `v1.2.0` |
| Release date | 2025-11-20 |
| Release type | 마이너 패치 |
| GAS deployment | [Open GAS app](https://script.google.com/macros/s/AKfycbwD7zBLaAzC5r4VjH1yt7gxfG98vvBp4gsaC3VFQW0bCwe6MNfVXmR8LIjUEpIkTZTE/exec) |

## Patch Notes

# 주요 수정사항

## *개요*

1.2.0 마이너 패치가 적용되었습니다.

> **수정된 기능**
>
- 프로그램 사용을 안내하는 각종 문구 및 토글들을 정비했습니다.
- 결과지 인쇄 화면의 가시성을 개선했습니다.

> **새로운 기능**
>
- UI가 대폭 수정되었습니다.

또한 일련의 변경점은 [Gems 챗봇](https://gemini.google.com/gem/1QDCPHshPvq5J9iIKeV-1Nvy0EFzKPN6Y?usp=sharing)에 반영되었습니다.

---

## *세부사항*

### *수정된 기능*

- **프로그램 사용을 안내하는 각종 문구 및 토글들을 정비했습니다.**
    - 영어로 되어있던 문구들을 최대한 한글화 하였습니다.
        - 탭 명칭
            - Notice → 안내
            - Scoring → 채점 & 구조 요약
            - List → 참조
        - 안내 문구
            - 기존의 탭 명칭을 언급하던 안내 문구들
            - Calculating… → 계산 중...
        - 버튼
            - Calculate Result → 결과 계산하기
    - 외부 웹사이트로 연결되는 각종 하이퍼링크를 카드형 버튼으로 바꾸었습니다.
    - 불필요한 문구들을 삭제했습니다.
        - 인쇄 시 설정에 관한 안내사항 토글

- **결과지 인쇄 화면의 가시성을 개선했습니다.**
    - 출력 용지 변화: A4 가로 → 세로
    - 이제 Upper Section 및 Lower Section이 첫 번째 페이지에 함께 출력됩니다.
    - Special Indices와 Response List가 두 번째 페이지에 함께 출력됩니다.
    - 일련의 수정사항을 반영하며 인쇄물의 가시성을 함께 개선했습니다.


### *새로운 기능*

- **UI가 대폭 수정되었습니다.**
    - **안내** 탭 이외의 화면에서 항상 Gems 챗봇을 열 수 있는 버튼이 우측 하단에 표시됩니다.

        Gemini 3 업데이트에 맞추어, Gems 챗봇의 성능도 대폭 향상되었습니다.

        또한 개발진 측에서 별도로 준비한 로샤 관련 자료를 Gems 챗봇에게 학습시켰습니다.

        이제 단순 프로그램 이용법 외에도, 해석에 관한 질문에 더욱 잘 응답할 수 있습니다.

    - 웹앱 하단에 현재 배포된 프로그램의 버전이 표시됩니다.

        이를 참고하여 사용자가 원하는 버전을 구분하여 활용할 수 있으리라 기대합니다.


---

# 향후 로드맵

본래 v1.2.0 마이너 패치에서 예정되어있던 채점 결과 입력 방식의 다변화는 연기되었습니다.

채점 화면에 데이터를 입력받는 코드에 관한 리팩토링을 끝낸 후 진행할 계획입니다.

## Source files

- `source/Code.gs`
- `source/index.html`
- `source/styles.html`

## How to use

이 버전의 코드를 재현하려면 `source/` 안의 파일을 Google Apps Script 프로젝트에 같은 파일명으로 만든 뒤 그대로 붙여넣습니다.
GAS 프로젝트에서 웹앱으로 배포하면 해당 버전의 계산기를 직접 실행할 수 있습니다.
