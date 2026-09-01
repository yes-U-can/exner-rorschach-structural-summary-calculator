# Exner Rorschach Structural Summary Calculator

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

`Exner 로샤 종합체계 구조요약 계산기`의 공개 소스 및 릴리즈 아카이브입니다. 관련 문서에 근거한 AI 도우미는 선택 기능으로 제공합니다.

이 저장소는 배포된 버전의 패치노트와 소스코드를 공개하기 위한 공간입니다. v1은 Google Apps Script 웹앱으로, v2는 현재 버전 2 웹앱으로 정리했습니다.

MOW(모오)는 웹앱의 기획, 제작, 배포, 운영과 유지보수를 맡습니다. 서울임상심리연구소(Seoul Institute of Clinical Psychology, SICP)는 초기 계산 결과 확인과 실제 임상 사용 관점의 검토에 기여합니다.

감사의 말과 초기 학습 참고 자료는 [ACKNOWLEDGEMENTS.md](./ACKNOWLEDGEMENTS.md)에 정리했습니다.

## 문서와 언어

패치노트에서 버전별 변경 사항, 영향을 받을 수 있는 조건, 기존 결과의 재계산 필요 여부와 계산 근거를 확인할 수 있습니다.

- 공개 안내와 패치노트는 [English](./README.en.md), [日本語](./README.ja.md), [Español](./README.es.md), [Português (Brasil)](./README.pt-BR.md) 동반 문서로 제공합니다.
- 웹앱 화면은 한국어, 영어, 일본어, 스페인어, 포르투갈어 5개 언어를 지원합니다.

## 현재 공개된 항목

- [v2] 라이브 웹앱: [exner.yesucan.co.kr](https://exner.yesucan.co.kr)
- [v2] 버전 2 최신 릴리즈: [v2-nextjs/releases/v2.2.12](./v2-nextjs/releases/v2.2.12/)
- [v2] v2.2.10 계산 근거와 문헌 범위: [계산 근거와 문헌 범위](./v2-nextjs/methodology/reference-audit-v2.2.10/)
- [v2] 버전 2 릴리즈 기록: [v2-nextjs/releases](./v2-nextjs/releases/)
- [v2] 버전 2 공개 소스코드: [v2-nextjs/source](./v2-nextjs/source/)
- [Google Apps Script] 버전 1 릴리즈 기록: [v1-gas/releases](./v1-gas/releases/)
- 최신 v1 실행본: [v1.4.1 배포링크](https://script.google.com/macros/s/AKfycbxMCx13pkrSzFs8f2qXfmxy2LRhkBpZTItFTIfEOoOi-zwurbysnKGfDIYtAeEdQP99/exec)
- 최신 v1 소스코드: [v1-gas/current](./v1-gas/current/)

## v2.2.12

v2.2.12는 방문 통계를 쿠키 없는 익명·집계 방식으로 변경했습니다. 새 방문 기록에는 Google Analytics를 사용하지 않으며, Vercel Web Analytics를 통해 방문한 페이지, 접속 경로, 대략적인 국가·지역, 브라우저·운영체제·기기 유형 같은 일반적인 방문 현황만 확인합니다.

구조요약 입력값, 계산 결과, AI 대화 내용과 API 키는 방문 통계에 포함되지 않습니다. 계산식과 산출값은 바뀌지 않았으므로 기존 프로토콜을 다시 계산할 필요가 없습니다. 자세한 내용은 [v2.2.12 패치노트](./v2-nextjs/releases/v2.2.12/)에서 확인할 수 있습니다.

## v2.2.11

v2.2.11은 카드 I–X가 모두 입력되어 있으면 R이 10–13개인 기록도 기존 타당도 경고를 표시한 뒤 계산할 수 있도록 계산 시작 기준을 조정했습니다. 카드 I–X가 모두 입력되어 있고 R이 14개 이상이면 이전과 같이 계산하며, 입력되지 않은 카드가 하나라도 있으면 반응 수와 관계없이 계산하지 않고 누락된 카드를 안내합니다.

스페인어 구조요약 명칭은 Sumario Estructural, 포르투갈어 명칭은 Sumário Estrutural로 통일했습니다. 서비스 이름 Yes, U Can!은 유지하면서 한국어 검색 설명에는 무료 이용 정보를 더 분명하게 반영했습니다.

계산식과 산출값, 개인정보 처리 방식은 바뀌지 않았습니다. 기존 프로토콜을 다시 계산할 필요가 없으며, 반응 수가 적은 기록은 표시되는 타당도 경고와 임상적 한계를 고려해 학습과 검토 목적으로 사용해야 합니다.

## v2.2.10

v2.2.10은 Lower Section 화면과 PDF에 빠져 있던 `GHR:PHR` 비율을 원전의 구조요약 배치에 맞춰 복원하고, PDF의 일반 Lower Section 표와 Special Indices 판정 표시를 정리한 버그 패치입니다. GHR와 PHR의 판정과 합계는 이미 계산되고 있었으므로 기존 프로토콜을 다시 계산할 필요는 없습니다.

계산 근거는 Exner 종합체계 Volume 1 제4판과 Workbook 제5판의 인쇄 쪽수를 따릅니다. R-PAS와 그 밖의 로르샤흐 체계는 Exner 종합체계 계산에 섞지 않습니다. v2.2.10에서는 계산식과 판정 기준을 변경하지 않았습니다.

다섯 언어의 Interpersonal 참조 문서에 `GHR:PHR` 설명을 추가했습니다. AI 도우미도 Exner 종합체계 범위 안에서만 답합니다. 문헌명, 판, 인쇄 쪽수, 자료별 역할과 남은 한계는 [v2.2.10 패치노트](./v2-nextjs/releases/v2.2.10/)와 [계산 근거와 문헌 범위](./v2-nextjs/methodology/reference-audit-v2.2.10/)에서 확인할 수 있습니다.

## v2.2.9

v2.2.9는 [Card] 정렬 버튼을 오름차순과 내림차순으로 전환할 수 있게 고치고, 해석 도우미로 들어가며 AI 세션을 시작했을 때 목적 화면으로 바로 이동하게 한 버그 패치입니다. 해석 도우미에서 대화의 최신 메시지보다 위를 보고 있을 때에는 AI의 응답 상태에 따라 점 세 개 또는 아래 화살표를 표시합니다. 추천·비추천을 선택하면 버튼 배경은 그대로 두고 엄지손가락 아이콘만 앱의 푸른색 실선 아이콘으로 바뀝니다. 이유를 건너뛰어도 평가를 저장할 수 있고, 같은 평가를 다시 누르면 삭제됩니다.

구조요약 계산식과 AI 답변 규칙은 바뀌지 않았으며 기존 프로토콜을 다시 계산할 필요가 없습니다. 자세한 내용은 [v2.2.9 패치노트](./v2-nextjs/releases/v2.2.9/)에서 확인할 수 있습니다.

## v2.2.8

v2.2.8은 한 반응에 같은 내용 부호가 두 번 들어가 중복 집계되던 문제를 막고, 데스크톱과 모바일에서 반응 부호를 같은 방식으로 처리한 버그 패치입니다. 샘플 데이터는 기존 자동저장본을 덮어쓰지 않으며, 마지막 편집 내용은 저장되고 손상된 자동저장 자료는 복원되지 않습니다.

구조요약 계산식은 바뀌지 않았습니다. 규칙대로 입력한 기존 프로토콜은 다시 계산할 필요가 없습니다. 한 반응에 같은 내용 부호가 중복된 기록, 데스크톱과 모바일에서 Level 1·Level 2 특수점수 값이 서로 다르게 저장된 기록, 모바일 화면에서 무형태 결정인(`C`, `C'`, `T`, `V`, `Y`, `Cn`)만 입력했는데 [FQ]가 `none`이 아닌 값으로 저장된 기록, 허용되지 않은 Z 부호나 카드에 맞지 않는 Z 점수가 남은 기록은 원자료를 확인한 뒤 다시 계산합니다. 다섯 언어 문서와 AI 답변에는 S-CON 12개 기준과 8개 이상 판정 경계를 명시했으며, 나이 입력란은 추가하지 않았습니다. 자세한 내용은 [v2.2.8 패치노트](./v2-nextjs/releases/v2.2.8/)에서 확인할 수 있습니다.

## v2.2.7

v2.2.7은 채점표의 세 가지 미완성 입력이 계산으로 이어지지 않도록 막은 버그 패치입니다. 위치 선택지에서 단독 `S`를 제거해 흰 여백 반응을 항상 `WS`, `DS`, `DdS`로 기록하게 했고, 같은 결정인이나 같은 운동 계열의 부호를 한 반응에 중복 입력할 수 없게 했으며, 형태질을 비워 둔 채 계산할 수 없게 했습니다. 모든 반응이 순수 형태(`F`)인 기록의 Lambda는 무한대 기호 대신 순수 F 개수로 보고합니다.

규칙대로 입력해 온 기존 프로토콜은 다시 계산할 필요가 없습니다. 과거 자동저장 자료에 해당 값이 남아 있으면 앱이 원본을 보존한 채 계산을 멈추고 확인할 행을 다섯 언어로 알려줍니다. 자세한 내용은 [v2.2.7 패치노트](./v2-nextjs/releases/v2.2.7/)에서 확인할 수 있습니다.

## v2.2.6

v2.2.6은 다섯 언어 페이지가 검색 결과와 링크 공유에서 해당 언어의 제목과 설명을 올바르게 표시하도록 수정한 버그 패치입니다. 기존 즐겨찾기와 외부 링크는 그대로 사용할 수 있습니다.

일부 Windows 브라우저에서 채점 화면의 `Alt+마우스 휠` 확대·축소가 화면 이동으로 처리되던 문제도 함께 수정했습니다. 채점표 헤더 설명에 나타나는 항목 이름은 모두 대괄호로 구분했습니다. 구조요약 계산식과 결과, 입력값, 화면 배치, 참조 문서 검색과 AI 답변 방식은 변경하지 않았으며 기존 프로토콜을 다시 계산할 필요가 없습니다. 자세한 내용은 [v2.2.6 패치노트](./v2-nextjs/releases/v2.2.6/)에서 확인할 수 있습니다.

## v2.2.5

v2.2.5부터 채점표에서는 능동형·수동형 구분이 빠진 `M`, `FM`, `m`을 더 이상 선택할 수 없으며, `Ma`, `Mp`, `Ma-p`처럼 운동의 방향이 포함된 완성 부호를 사용합니다. 구조요약 결과의 `M`, `FM`, `m` 합계와 EB, MQual, W:M 등의 계산은 그대로 유지됩니다.

올바른 완성 부호를 사용한 기존 프로토콜은 다시 계산할 필요가 없습니다. 과거 자동저장 자료에 능동형·수동형 구분이 없는 값이 남아 있으면 앱이 원본을 임의로 바꾸지 않고 계산을 멈춘 뒤 확인할 행과 부호를 알려줍니다. 다섯 언어 참조 문서와 AI 도우미도 같은 입력 경계를 안내합니다. 자세한 영향 범위와 가상 CDI 경계 예시는 [v2.2.5 패치노트](./v2-nextjs/releases/v2.2.5/)에서 확인할 수 있습니다.

## v2.2.4

v2.2.4는 구조요약 계산식과 채점표 입력 방식을 바꾸지 않고, 참조 문서와 선택형 AI 도우미의 검색·안전 동작을 개선한 버그 패치입니다. 기존 구조요약 결과를 다시 계산할 필요는 없습니다.

다섯 언어 참조 문서는 각 언어권의 전문 용례를 사용하며, 화면 제목과 문서 순서는 채점·해석 흐름을 따릅니다. 코딩·해석 도우미는 Exner CS 범위 밖의 질문이나 비공개 정보를 요구하는 요청에는 답하지 않으며, 요청이 지나치게 반복되면 잠시 기다리도록 안내합니다. 자세한 내용은 [v2.2.4 패치노트](./v2-nextjs/releases/v2.2.4/)에서 확인할 수 있습니다.

채점 시작 방식을 고르는 대화상자, 참조 문서의 가독성, 코딩 도우미의 스크롤 표시도 함께 다듬었습니다.

## v2.2.3

v2.2.3은 계산식과 화면 배치를 바꾸지 않고, 다섯 언어의 검색·링크 미리보기 정보와 AI 응답 평가의 과도한 요청 방어를 개선한 버그 패치입니다. 기존 구조요약 결과를 다시 계산할 필요는 없습니다.

검색·공유용 홈 제목은 `Yes, U Can!`로 통일하고, 회원가입·설치·결제가 필요 없는 오픈소스 Exner Rorschach 종합체계 구조요약 계산기라는 설명과 임상 판단 비대체 원칙을 다섯 언어로 제공했습니다. 좋아요·싫어요 평가는 대화 원문을 저장하지 않으며, 지나치게 크거나 빈번한 전송은 받지 않습니다. 자세한 변경 사항과 개인정보 안내는 [v2.2.3 패치노트](./v2-nextjs/releases/v2.2.3/)에서 확인할 수 있습니다.

## v2.2.2

v2.2.2는 Cn이 들어가는 계산과 들어가지 않는 계산의 경계를 바로잡은 핫픽스입니다. 화면의 관례적 표기 `FC:CF+C`에서 오른쪽 값은 `CF+C+Cn`이지만, 이 앱이 채택한 WSumC, S-CON 7번 기준, Color-Shading 계산에서는 Cn을 제외합니다. **완성된 프로토콜에서 v2.2.1의 Cn 화면값은 이미 올바르게 계산됐으므로, 이 이유만으로 다시 계산할 필요는 없습니다.** 다만 형태질(FQ)을 아직 입력하지 않은 미완성 행이 GHR 또는 PHR로 임시 분류되지 않도록 보완했습니다.

각 지표에는 Exner 종합체계의 정의를 적용하며, 다른 프로그램이나 체계의 표기와 동작을 그대로 섞지 않습니다. 화면에서는 왼쪽 사이드바를 완전히 불투명하게 바꿨습니다.

## v2.2.1

v2.2.1은 화면이나 입력 항목을 바꾸지 않고, 앱이 표시하는 **Upper Section, Lower Section, Special Indices**의 계산을 바로잡은 핫픽스입니다. D/AdjD의 극단값, EBPer 표시 조건, GHR/PHR의 판정 순서, WDA%와 Afr의 0분모 처리를 수정했고, 화면의 `FC:CF+C` 오른쪽 값에는 Cn을 포함하도록 고쳤습니다.

계산 경계는 Exner 종합체계의 규칙과 완성된 구조요약 사례를 따릅니다.

## v2.2.0

v2.2.0은 데스크톱 화면의 주요 메뉴를 왼쪽 사이드바로 모으고, 해석 도우미를 일반적인 AI 대화 화면에 가깝게 다시 구성한 첫 v2.2.x 릴리즈입니다. 답변 중지, 메시지 복사와 평가, 대화 영역 안쪽 스크롤, 참조 문서와 버전 기록, 채점표의 확대·축소와 이동도 함께 정리했습니다.

AI 도우미는 Exner 종합체계 밖의 질문에 답변 범위를 넓히지 않도록 제한했습니다. D/AdjD, EBPer, GHR/PHR, Cn 경계 등 계산 수정은 v2.2.1과 v2.2.2에 포함되어 있으며 현재 버전에도 모두 반영되어 있습니다.

## [v2] 버전 2 릴리즈 기록

- **[2026-08-21] v2.2.11 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.2.11/) [소스코드](./v2-nextjs/source/)
- **[2026-08-08] v2.2.10 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.2.10/) [소스코드](./v2-nextjs/source/)
- **[2026-08-01] v2.2.9 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.2.9/) [소스코드](./v2-nextjs/source/)
- **[2026-07-31] v2.2.8 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.2.8/) [소스코드](./v2-nextjs/source/)
- **[2026-07-23] v2.2.7 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.2.7/) [소스코드](./v2-nextjs/source/)
- **[2026-07-20] v2.2.6 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.2.6/) [소스코드](./v2-nextjs/source/)
- **[2026-07-19] v2.2.5 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.2.5/) [소스코드](./v2-nextjs/source/)
- **[2026-07-18] v2.2.4 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.2.4/) [소스코드](./v2-nextjs/source/)
- **[2026-07-17] v2.2.3 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.2.3/) [소스코드](./v2-nextjs/source/)
- **[2026-07-16] v2.2.2 (핫픽스)** [패치노트](./v2-nextjs/releases/v2.2.2/) [소스코드](./v2-nextjs/source/)
- **[2026-07-15] v2.2.1 (핫픽스)** [패치노트](./v2-nextjs/releases/v2.2.1/) [소스코드](./v2-nextjs/source/)
- **[2026-07-14] v2.2.0 (마이너 패치)** [패치노트](./v2-nextjs/releases/v2.2.0/) [소스코드](./v2-nextjs/source/)
- **[2026-07-13] v2.1.10 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.10/) [소스코드](./v2-nextjs/source/)
- **[2026-07-12] v2.1.9 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.9/) [소스코드](./v2-nextjs/source/)
- **[2026-07-11] v2.1.8 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.8/) [소스코드](./v2-nextjs/source/)
- **[2026-07-05] v2.1.7 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.7/) [소스코드](./v2-nextjs/source/)
- **[2026-07-04] v2.1.6 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.6/) [소스코드](./v2-nextjs/source/)
- **[2026-07-03] v2.1.5 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.5/) [소스코드](./v2-nextjs/source/)
- **[2026-07-02] v2.1.4 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.4/) [소스코드](./v2-nextjs/source/)
- **[2026-06-29] v2.1.3 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.3/) [소스코드](./v2-nextjs/source/)
- **[2026-06-28] v2.1.2 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.2/) [소스코드](./v2-nextjs/source/)
- **[2026-06-27] v2.1.1 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.1/) [소스코드](./v2-nextjs/source/)
- **[2026-06-22] v2.1.0 (마이너 패치)** [패치노트](./v2-nextjs/releases/v2.1.0/) [소스코드](./v2-nextjs/source/)
- **[2026-06-11] v2.0.3 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.0.3/) [소스코드](./v2-nextjs/source/)
- **[2026-05-21] v2.0.2 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.0.2/) [소스코드](./v2-nextjs/source/)
- **[2026-04-27] v2.0.1 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.0.1/) [소스코드](./v2-nextjs/source/)
- **[2026-02-15] v2.0.0 (메이저 패치)** [패치노트](./v2-nextjs/releases/v2.0.0/) [소스코드](./v2-nextjs/source/)

## v1 GAS 사용 방법

1. 원하는 버전의 `패치노트/소스코드` 링크를 엽니다.
2. `source/` 폴더 안의 `Code.gs`, `index.html`, `styles.html` 파일을 확인합니다.
3. Google Apps Script 프로젝트를 새로 만들고 같은 이름의 파일을 만든 뒤 내용을 붙여넣습니다.
4. GAS에서 웹앱으로 배포하거나, 각 버전의 `배포링크`로 해당 버전을 직접 실행합니다.

## [Google Apps Script] 버전 1 릴리즈 기록

- **[2026-01-07] v1.4.1 (버그 패치)** [배포링크](https://script.google.com/macros/s/AKfycbxMCx13pkrSzFs8f2qXfmxy2LRhkBpZTItFTIfEOoOi-zwurbysnKGfDIYtAeEdQP99/exec) [패치노트/소스코드](./v1-gas/releases/v1.4.1/)
- **[2026-01-03] v1.4.0 (마이너 패치)** [배포링크](https://script.google.com/macros/s/AKfycbxWtI1q27rXuH4feBEGpoy0fIhXZU0ROJ2gRv5RbaQVPxnNgznTI9czHDrVzaS7wSMM/exec) [패치노트/소스코드](./v1-gas/releases/v1.4.0/)
- **[2025-12-24] v1.3.3 (버그 패치)** [배포링크](https://script.google.com/macros/s/AKfycbyMG31uNG0mPIdyrzQ_86CSuSaACpFoOqy-kZGXk0uV7L92jBFAJijt1kV6nLMzcO2N/exec) [패치노트/소스코드](./v1-gas/releases/v1.3.3/)
- **[2025-11-27] v1.3.2 (버그 패치)** [배포링크](https://script.google.com/macros/s/AKfycbxbuGLdEaj0mW6eIB5QHTax86b9FcKrsfLogy0wDLauJPwbbkQC5BHey0j_ERqXtVqE/exec) [패치노트/소스코드](./v1-gas/releases/v1.3.2/)
- **[2025-11-26] v1.3.1 (버그 패치)** [배포링크](https://script.google.com/macros/s/AKfycbwOQ61Y34-iVRKB0T3isOVRzFP9xhxtQMrLZoRvVbS6PwSfEaFYzWvjuTF8IItY2p-T/exec) [패치노트/소스코드](./v1-gas/releases/v1.3.1/) [사용법 영상](https://youtu.be/GH145Wwh-YA)
- **[2025-11-25] v1.3.0 (마이너 패치)** [배포링크](https://script.google.com/macros/s/AKfycbyethWbTOltcalcWo-kyXtunNSoJNMyKdKs_y7AYfV6bPE2R09ONcaCtDHSTvXTukE/exec) [패치노트/소스코드](./v1-gas/releases/v1.3.0/)
- **[2025-11-21] v1.2.1 (버그 패치)** [배포링크](https://script.google.com/macros/s/AKfycbw6n2R3LgAncLvoXmin89SodbHB6brREdaxFfK2yHADdZelEskafqLH35xL0LFvSqMv/exec) [패치노트/소스코드](./v1-gas/releases/v1.2.1/)
- **[2025-11-20] v1.2.0 (마이너 패치)** [배포링크](https://script.google.com/macros/s/AKfycbwD7zBLaAzC5r4VjH1yt7gxfG98vvBp4gsaC3VFQW0bCwe6MNfVXmR8LIjUEpIkTZTE/exec) [패치노트/소스코드](./v1-gas/releases/v1.2.0/)
- **[2025-10-25] v1.1.2 (버그 패치)** [배포링크](https://script.google.com/macros/s/AKfycbxn8zeFQalOvh-jnZ_-REjafG2kCT1RkjyJvUahtCkXVyn6PJs9xJLZ0basm5kKEO4j2A/exec) [패치노트/소스코드](./v1-gas/releases/v1.1.2/)
- **[2025-10-24] v1.1.1 (버그 패치)** [배포링크](https://script.google.com/macros/s/AKfycbw6XZZ7D3qiCeSsJPG6aj3DzMMPdA2p0kWhT8WU21WGVFqUltOmAXs3zOx4kXw2u5ul6Q/exec) [패치노트/소스코드](./v1-gas/releases/v1.1.1/)
- **[2025-10-23] v1.1.0 (마이너 패치)** [배포링크](https://script.google.com/macros/s/AKfycbw2J6gd4Sf_Tjx6s9GdQrWu4b_tOtqwFLtKJCs-vSFRR0c4NZ0Mlb5UFm7-V9zkBPzitg/exec) [패치노트/소스코드](./v1-gas/releases/v1.1.0/)
- **[2025-10-20] v1.0.4 (핫픽스)** [배포링크](https://script.google.com/macros/s/AKfycbw1GLfIvehoz4wAzC4LicjD_oB0Dpy_sLJ30da9qobx5X4wa3nJr0pLewV0lVPPv1ptGw/exec) [패치노트/소스코드](./v1-gas/releases/v1.0.4/)
- **[2025-10-18] v1.0.3 (버그 패치)** [배포링크](https://script.google.com/macros/s/AKfycbzoiaofs_I5Ue4p7Eo5XQp0OmUtmbbqkpJuwD-FQ1R4PLscULJB_AHVBb-VylICEKJB1A/exec) [패치노트/소스코드](./v1-gas/releases/v1.0.3/)
- **[2025-10-18] v1.0.2 (핫픽스)** [배포링크](https://script.google.com/macros/s/AKfycbwtBFge9jPS03Mz4QD5IlUDfHOetaVGsIe48y9dZESkfWtsJ-dnYv9S5iZ_4wxx4dCOUw/exec) [패치노트/소스코드](./v1-gas/releases/v1.0.2/)
- **[2025-10-17] v1.0.1 (핫픽스)** [배포링크](https://script.google.com/macros/s/AKfycbwNNeJsgRx0sEnZO4X9XxEUEthQlVS3Ttk6k_OSmIj8aTPlpdBQV1653hmBtzLnVX8Q/exec) [패치노트/소스코드](./v1-gas/releases/v1.0.1/)
- **[2025-10-16] v1.0.0 (메이저 패치)** [배포링크](https://script.google.com/macros/s/AKfycbxYTxqKcmRNJhpE8eCGTBZPyUFVJIRQiUTbyW48lJKg2E7Bgc5RKSitdDTVcE3bzk07JA/exec) [패치노트/소스코드](./v1-gas/releases/v1.0.0/)
