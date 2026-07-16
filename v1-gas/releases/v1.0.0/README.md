# v1.0.0

## Metadata

| Field | Value |
| --- | --- |
| Version | `v1.0.0` |
| Release date | 2025-10-16 |
| Release type | 메이저 패치 |
| GAS deployment | [Open GAS app](https://script.google.com/macros/s/AKfycbxYTxqKcmRNJhpE8eCGTBZPyUFVJIRQiUTbyW48lJKg2E7Bgc5RKSitdDTVcE3bzk07JA/exec) |

> **2026-07-17 계보 보충:** 초기 v1 구현은 공개 배포된 2019 Excel scoring workbook의 셀 수식과 Jeremy Leader의 [RorScore](https://github.com/jleader/RorScore)를 학습 참고 자료로 삼았습니다. 이 파일들은 코드를 만들 수 있다는 출발점과 계산 구조를 이해하는 데 도움을 주었지만 단독 정답으로 복사하지 않았습니다. 이후 확인된 Excel·RorScore·v1·v2 사이의 차이와 교정 범위는 [Acknowledgements](../../../ACKNOWLEDGEMENTS.md)와 [v2.2.2 계산 정확성 재감사](../../../v2-nextjs/releases/v2.2.2/)에 공개했습니다. 아래 내용과 소스는 당시 기록으로 보존합니다.

## Patch Notes

# 안내

안녕하세요, 신뢰와 전통의 서울임상심리연구소입니다.

로샤 구조 요약지 계산 및 출력을 도와주는 프로그램을 개발해보았습니다.

👉🏻  https://script.google.com/macros/s/AKfycbwq_Gd9j_onmJ_cFVDumr34gYq-wSWefiiMD-lZAf3GX8lIe45sZzeoeeBfNSdLn3cC/exec

수기로 직접 계산하다가 자동으로 계산하는 프로그램을 만들기 위해,

이제까지 여러 전문가 선생님들의 노력이 있었습니다.

당시에는 .exe 파일 형태로 배포되던 프로그램부터,

엑셀 매크로를 활용하여 구조 요약지를 출력해주는 시트를 만들어주신 분도 계십니다.

이 프로젝트는 구글앱스크립트(GAS)라는 도구를 이용하여,

컴퓨터에 별도의 설치 과정이 필요없는 웹앱 형태로 제작해 보았으니 널리 사용해주세요.

개선사항 및 오류를 발견 시 제보해주시면 수정해 나가겠습니다.

네이버 블로그의 [[로샤 구조 요약지 계산 프로그램의 개발](https://blog.naver.com/yes-u-can/224043775130)] 게시물에 댓글 달아주세요.

아울러 구글 계정이 있으시다면 이 프로그램을 조작하는 데에 도움을 주는

Gems 챗봇을 이용할 수 있습니다.

👉🏻  https://gemini.google.com/gem/1QDCPHshPvq5J9iIKeV-1Nvy0EFzKPN6Y?usp=sharing

## Source files

- `source/Code.gs`
- `source/index.html`

## How to use

이 버전의 코드를 재현하려면 `source/` 안의 파일을 Google Apps Script 프로젝트에 같은 파일명으로 만든 뒤 그대로 붙여넣습니다.
GAS 프로젝트에서 웹앱으로 배포하면 해당 버전의 계산기를 직접 실행할 수 있습니다.
