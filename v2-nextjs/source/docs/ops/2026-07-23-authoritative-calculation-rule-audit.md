# 구조요약 계산 규칙 권위 근거 재검토

검토일: 2026-07-23 (KST)  
상태: 릴리즈 전 내부 검증 기록 (구현 반영분 포함, 같은 날 인수 감사에서 재검증·정정)  
범위: 이 웹앱이 표시하는 Exner Comprehensive System 구조요약의 **Upper Section, Lower Section, Special Indices**와 그 입력 부호화 경계

## 검토 원칙

이번 검토에서는 Codex, Claude Fable 5 또는 다른 AI의 결론을 계산 정답으로 사용하지 않는다. AI 감사 결과는 반례를 찾기 위한 쟁점 목록으로만 사용한다. 계산 규칙은 다음 순서로 판정한다.

1. John E. Exner의 Comprehensive System 원전과 코딩 워크북
2. Exner와 Weiner가 작성한 공식 RIAP v5 출력 및 설명
3. 해당 규칙을 직접 다룬 동료심사 논문
4. 서로 독립적인 임상·학술 자료의 일치 여부

초기 개발에 참고한 Excel, Perl, v1 GAS 및 이전 v2 코드는 제작 계보를 추적하는 자료다. 이 자료들은 무엇이 어떻게 옮겨졌는지를 설명할 수 있지만, 임상 규칙의 최종 근거가 될 수 없다. 권위 근거가 부족하거나 서로 충돌하는 항목은 계산값을 임의로 정하지 않고 근거 상태를 그대로 기록한다.

각 판정에는 근거의 확인 방식을 구분해 적는다. **직접 확인**은 이 저장소 작업 중 원문 텍스트를 실제로 읽은 경우이고, **2차 인용**은 원전 쪽수를 인용한 신뢰할 수 있는 2차 문헌으로 확인한 경우이며, **미확증**은 어느 쪽으로도 원문을 확인하지 못한 경우다.

## 판정표

| 쟁점 | 권위 근거와 확인 방식 | 현재 구현 | 판정 |
| --- | --- | --- | --- |
| 모든 반응이 순수 F인 기록의 Lambda | Meyer, Viglione, & Exner (2001)의 공개 접근 가능한 본문 요약은 all-F 기록의 Lambda가 수학적으로 **무한대**가 된다고 기술한다(직접 확인: 초록·요약 수준). "실제 CS 채점 프로그램이 순수 F 개수로 보고한다"는 구체적 서술은 전문 접근 실패로 **미확증**이다. 공식 RIAP v5 예제(직접 확인)는 이 경계 사례를 포함하지 않되, 적용 불가 파생값을 `N/A`로 표기하는 관행을 보여준다. | 분모가 0이면 `∞`를 표시하지 않고 순수 F의 개수를 보고한다. 17개 반응이 모두 순수 F이면 `17.00`. | **동작 유지, 출처 표현 정정.** `∞`를 임상 출력값으로 만들지 않는다는 제품 결정에 따라 순수 F 개수 보고를 **문서화된 소프트웨어 관행**으로 채택한다. Meyer et al.의 페이지 단위 확인 전까지 이 관행을 해당 논문이 기술한 사실로 인용하지 않는다. 원문 확인은 후속 과제로 남긴다. |
| 위치의 S | 공식 RIAP v5 예제의 Sequence of Scores는 흰 공간을 항상 `WS`, `DdS`처럼 기본 위치에 결합해 출력하고, Summary of Approach도 `I : WS.D`, `II : DdS`로 표기한다(직접 확인). Exner Vol.1 (3rd ed., p. 94)의 "S is never scored alone, but as WS, DS, or DdS"는 2차 문헌 인용으로 확인했다(2차 인용). | 입력 선택지에서 단독 `S`를 제거했고(`W, WS, D, DS, Dd, DdS`), 저장 데이터 등 레거시 경로로 들어온 단독 `S`는 5개 언어 경고와 함께 계산을 차단한다. | **구현 확정.** |
| 운동 결정인의 능동·수동 첨자와 같은 운동군 중복 | 모든 M/FM/m에 a 또는 p 첨자가 필요하고, 같은 반응에서 같은 군의 두 대상이 능동·수동으로 갈리면 두 결정인이 아니라 **`a-p` 첨자를 단 하나의 결정인**으로 기록한다(Exner Vol.1 3rd ed. pp. 109–113을 옮긴 2차 문헌 및 CS 코딩 가이드, 2차 인용). 같은 결정인을 한 반응에 두 번 넣지 않는다는 blend 규칙도 동일 경로로 확인했다(2차 인용). RIAP v5 예제의 모든 운동 부호는 첨자를 갖는다(직접 확인). | bare `M`, `FM`, `m`은 입력코드가 아니며, 같은 운동군 코드는 반응당 하나만 선택할 수 있다(UI 비활성 + 계산 차단 + 5개 언어 경고). | **구현 확정.** |
| a-p의 적용 조건 | `a-p`는 같은 군의 **서로 다른 대상**이 각각 능동·수동 운동을 보일 때 한 번 기록한다. 한 대상이 두 성질의 움직임을 함께 보이는 경우는 자동으로 a-p가 되지 않는다(위와 같은 2차 문헌·코딩 가이드, 2차 인용. 한 사례 가이드는 단일 대상 사례를 `a` 단독으로 예시한다). | 참조 코퍼스와 AI 프롬프트가 "서로 다른 대상 → a-p 한 번, 한 대상의 양방향 움직임은 자동 a-p 아님, 관찰 근거 확인 요구"로 서술한다. | **서술 유지, 근거 등재.** 이전 판에서 이 규칙의 근거가 판정표에 누락되어 있었다. |
| FQ `none`과 빈 FQ | 공식 RIAP v5 구조요약은 `none`을 정식 FQ 범주로 출력한다(FQx none = 2, 직접 확인). 반면 코딩 가이드의 종이 채점 관행은 형태가 없는 반응에서 FQ 칸을 **비워 두라**고 한다(2차 인용). 즉 종이 관행에서 공란은 formless를 뜻할 수 있으나, 소프트웨어 입력에서는 '미입력'과 '무형태'가 구분되지 않는 중의성이 생긴다. | 빈 FQ는 미완성 입력으로 차단하고, formless 반응은 명시적 `none` 선택을 요구한다. | **구현 확정.** 이는 Exner 규칙의 변경이 아니라 중의성을 없애는 데이터 무결성 정책이며, 종이 관행과의 차이를 본 문서에 기록해 둔다. |
| 화면의 `FC:CF+C` | RAP3 소프트웨어 문서가 Exner 구조요약 지시문을 거의 원문대로 옮겨 "우변은 `CF+C+Cn`의 합"이라고 기술한다(2차 인용). RIAP v5 예제는 blend의 CF까지 우변에 합산함을 보여 주지만 Cn=0이라 Cn 포함 여부는 판별 불가다(직접 확인). | `FC : (CF+C+Cn)`을 표시한다. | **현 구현 유지.** |
| WSumC | `0.5*FC + 1.0*CF + 1.5*C`이며 Cn은 제외한다(2차 인용 다수 일치). RIAP v5 예제 값 `SumC':WSumC = 1 : 5.0`이 이 식과 정확히 재계산 일치한다(직접 확인). | Cn을 제외한다. | **현 구현 유지.** |
| S-CON | 공식 RIAP v5 예제가 12개 항목 전체, "Positive if 8 or more", **"Applicable only for subjects over 14 years old"**, 색채 항목 표기 `CF + C > FC`를 그대로 출력한다(직접 확인). S-CON 색채 항목의 Cn 포함 여부는 어떤 자료에서도 명시되지 않았다(미확증, Cn 제외는 표기 문자 그대로의 해석). | 12항목·8점 기준을 구현하고 색채 조건에서 Cn을 제외한다. 계산기에는 연령 입력이 없다. | **현 구현 유지.** 연령은 지표의 적용·해석 경계이며, 별도 승인 없이 계산기 UI에 수집 항목을 추가하지 않는다. |
| Color-Shading blend | chromatic color(FC, CF, C)와 shading 또는 achromatic color가 함께 있는 blend를 센다. Cn의 포함 여부를 명시한 자료는 찾지 못했다(미확증). Cn은 정의상 사실상 단독 반응이라 blend 논점은 실무적으로 발생하기 어렵다. | Cn을 제외한다. | **현 구현 유지.** Cn 제외는 관행적 해석임을 기록해 둔다. |
| GHR/PHR 1단계 | Human Representational Variable 알고리즘(Viglione, Perry, Jansak, Meyer, & Exner, 2003)은 1단계 GHR에 FQ `+`, `o`, `u`를 요구하고, FQ `-` 또는 FQnone은 2단계에서 PHR로 보낸다(2차 인용). | 1단계 `+/o/u`, `-`·`none`은 PHR 경로. 빈 FQ는 입력 단계에서 차단된다. | **현 구현 유지.** |
| 소수점 반올림 방식 | CS 원전 텍스트 차원의 보편 규칙은 확인하지 못했다(미확증). 다만 RIAP v5 예제의 모든 비율을 원자료 수치로 재계산하면 소수 둘째 자리 일반 반올림과 일치한다(직접 확인: XA% 9/16→0.56, WDA% 7/13→0.54, X-% 5/16→0.31 등). | JavaScript 최종 표시 반올림(소수 둘째 자리)을 사용한다. | **현 구현 유지.** RIAP 관측 동작과 일치한다. |
| 분모가 0인 WDA%, Afr 등 | 원전 차원의 명시 규칙은 확인하지 못했다(미확증). RIAP v5는 적용 불가 파생값(EBPer)을 `N/A`로 출력한다(직접 확인). | 일부 값은 `-`로 표시하고 판정식에 0으로 넣지 않는다. | **현 구현 유지.** RIAP의 `N/A` 관행과 같은 계열의 소프트웨어 관행이다. |

## 이번에 코드로 반영한 내용

이번 단계에서 계산·입력 코드를 바꾼 항목은 다음과 같다.

1. **all-F Lambda**: `∞` 표시를 제거하고 순수 F 개수를 보고한다. all-F 전용 회귀 테스트와 2,000개 합성 프로토콜 oracle에 반영했다.
2. **단독 S 입력 제거**: 위치 선택지를 `W, WS, D, DS, Dd, DdS`로 고정했다. 레거시 저장 데이터의 단독 `S`는 계산 전에 차단된다.
3. **같은 운동군 중복 차단**: `Ma/Mp/Ma-p`, `FMa/FMp/FMa-p`, `ma/mp/ma-p` 각 군에서 반응당 하나만 선택할 수 있다. UI에서 같은 군의 다른 코드는 비활성화되고, 계산기는 비정상 payload도 거부한다. 같은 날 후속 보강으로, 운동 여부와 관계없이 **동일한 결정인을 두 칸에 반복 입력하는 것**도 같은 방식(UI 비활성 + 계산 차단 + 5개 언어 경고)으로 차단했다. blend에서 같은 결정인을 두 번 채점하지 않는다는 규칙(Exner Vol.1 3rd ed. 전재 2차 문헌)에 따른다.
4. **빈 FQ 차단**: 빈 FQ는 FQnone과 동일시하지 않고 미완성 입력으로 차단한다. 명시적 `none`은 정상 처리한다.
5. **검증 모듈 통합**: 위 입력 경계는 `lib/scoringInputValidation.ts`의 단일 모듈이 페이지 경고, 계산기 검증, UI 비활성에 공통 적용되며, 참여 행 판정(`isParticipatingResponse`)도 폼 훅과 검증기가 같은 술어를 공유한다.
6. **오류 문구**: 세 가지 차단 각각에 5개 언어 경고 문구를 추가했다(`standaloneSpace`, `movementConflict`, `missingFormQuality`).

## 코퍼스와 AI 계약 영향

이번 변경은 참조 코퍼스와 AI 계약 계층도 함께 수정했다. 이전 판의 "코퍼스, 벡터, AI 플레이북을 변경하지 않는다"는 서술은 사실과 달라 폐기한다.

- 다섯 언어의 `scoring-input/determinants`(개요·FM·M·m), `scoring-input/fq`(개요·none), `scoring-input/location/S` 원고에 입력 경계 규칙을 반영했다.
- 시스템 프롬프트(`lib/chatPrompts.ts`)에 단독 S, 운동군 중복, 빈 FQ에 대한 세 가지 지시를 추가했다.
- 다섯 언어 검색 평가 질의에 경계 질문 3종을 추가했다.
- 코퍼스 본문이 바뀌었으므로 임베딩·벡터 스냅샷을 재생성·재승격해야 하며, 이 절차는 인수 감사에서 수행·기록한다.
- 언어 간 규칙 불일치의 재발을 막기 위해 `docs/reference-authoring/rule-invariants.json`과 교차 언어 규칙 동등성 게이트를 추가했다. 파일 단위의 죽은 frontmatter `runtimeReady`는 전부 제거하고 재도입을 차단한다.

## 근거 자료

직접 확인한 자료:

- Exner, J. E., & Weiner, I. B. *Rorschach Interpretation Assistance Program, Version 5* 공식 예제 출력 (PAR, Version 5.00.137). https://hogrefe.se/userfiles/files/RIAP5IR_SAMPLE.pdf — Sequence of Scores의 WS/DdS 표기, S-CON 12항목과 14세 초과 적용 문구, FQx `none` 행, `FC:CF+C` 구성, 2자리 반올림, `N/A` 관행.

2차 인용으로 확인한 자료(원전 쪽수를 인용한 2차 문헌):

- Exner, J. E. *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations* — 3rd ed. p. 94 (S 단독 채점 금지), pp. 109–113 (운동 a/p/a-p 규칙), blend 중복 금지. Gurley, *Essentials of Rorschach Assessment* 3장 및 CS 코딩 가이드 경유.
- Exner, J. E. *A Rorschach Workbook for the Comprehensive System* (5th ed.) — RIAP v5가 채점 기준으로 명시.
- Viglione, D. J., Perry, W., Jansak, D., Meyer, G. J., & Exner, J. E. (2003). Modifying the Rorschach Human Experience Variable to Create the Human Representational Variable. *Journal of Personality Assessment.* — GHR/PHR 단계 규칙.
- RAP3 구조요약 문서(virtualpsychology.com) — `FC:CF+C+Cn` 우변, WSumC 가중식.

부분 확인·미확증 자료:

- Meyer, G. J., Viglione, D. J., & Exner, J. E., Jr. (2001). Superiority of Form% Over Lambda for Research on the Rorschach Comprehensive System. *Journal of Personality Assessment, 76*(1), 68–75. https://doi.org/10.1207/S15327752JPA7601_4 — 초록·공개 요약 수준으로만 확인(전문 미확보). all-F Lambda의 "무한대" 특성 기술은 확인했으나, "순수 F 개수 보고" 관행의 출처 귀속은 원문 확인 전까지 보류.
- Acklin, M. W., McDowell, C. J., Verschell, M. S., & Chan, D. (2000). Interobserver Agreement, Intraobserver Reliability, and the Rorschach Comprehensive System. *Journal of Personality Assessment, 74*(1), 15–47.

## 다음 게이트

- Meyer, Viglione, & Exner (2001) 전문을 확보해 all-F Lambda의 소프트웨어 보고 관행 서술을 원문 쪽수로 확정한다.
- S-CON 색채 항목과 Color-Shading blend의 Cn 처리 근거는 계속 미확증 상태이므로, 현 구현(제외)을 관행으로 유지하되 새 원전 근거가 나오면 재판정한다.
- 같은 반응에 동일한 결정인을 두 번 넣을 수 있던 기존 입력 허용은 제품 소유자 승인을 받아 같은 날 차단으로 반영했다(위 3번 항목). 남은 입력 경계 후보는 현재 없다.
