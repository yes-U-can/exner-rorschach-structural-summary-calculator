# v1.1.2

## Metadata

| Field | Value |
| --- | --- |
| Version | `v1.1.2` |
| Release date | 2025-10-25 |
| Release type | 버그 패치 |
| GAS deployment | [Open GAS app](https://script.google.com/macros/s/AKfycbxn8zeFQalOvh-jnZ_-REjafG2kCT1RkjyJvUahtCkXVyn6PJs9xJLZ0basm5kKEO4j2A/exec) |

## Patch Notes

# 주요 수정사항

## *개요*

코드를 더욱 깔끔하게 수정하고, 개인정보처리방침을 웹 내에 기재했습니다.

또한 일련의 변경점은 [Gems 챗봇](https://gemini.google.com/gem/1QDCPHshPvq5J9iIKeV-1Nvy0EFzKPN6Y?usp=sharing)에 반영되었습니다.

---

## *세부사항*

코드를 더욱 깔끔하게 수정했습니다.

`index.html` 파일을 리팩토링하여 css에 대한 것을 `styles.html` 파일로 분리했습니다.

그리고 주석으로 순번을 달고, 목차를 정리했습니다.

Google 애널리틱스를 연결하여 웹앱 사용 정보를 추적하게 되었습니다.

‘개인정보처리방침’이라고 적힌 바닥글을 클릭하면 팝업 메시지로 확인 가능합니다.

---

# 향후 로드맵

[v1.1.1의 향후 로드맵](../v1.1.1/) 를 참조해주세요, 변경된 점은 없습니다.

## Source files

- `source/Code.gs`
- `source/index.html`
- `source/styles.html`

## How to use

이 버전의 코드를 재현하려면 `source/` 안의 파일을 Google Apps Script 프로젝트에 같은 파일명으로 만든 뒤 그대로 붙여넣습니다.
GAS 프로젝트에서 웹앱으로 배포하면 해당 버전의 계산기를 직접 실행할 수 있습니다.
