# [2026-07-17] v2.2.2 계산 정확성 재감사 핫픽스

> **v2.2.1 연속성 확인:** 배포된 v2.2.1 계산 코드와 공개 릴리즈 노트는 Lower Section `FC:CF+C`를 처음부터 `FC:(CF+C+Cn)`으로 일관되게 계산·설명했습니다. 릴리즈 후 내부 재검토 과정에서 Cn을 다시 제외하는 미커밋 초안이 만들어졌지만, 최종 독립 감사에서 Git 이력과 계산 근거에 맞지 않는 것으로 확인되어 공개 전에 철회했습니다. v2.2.2는 배포 계산값을 뒤집는 릴리즈가 아니라, 서로 다른 Cn 경계를 독립 변수·회귀 테스트·5개 언어 AI 계약으로 더 명확하게 고정한 릴리즈입니다.

## 요약

v2.2.2는 앱이 실제로 표시하는 Exner Comprehensive System 구조요약의 **Upper Section, Lower Section, Special Indices**만 다시 감사했습니다. 다른 로샤 체계, 연구용 확장 지표, 임상 진단 자동화는 범위에 포함하지 않았습니다.

이번 재감사의 핵심은 비슷해 보이는 색채 합계를 하나의 공용 값으로 취급하지 않는 것입니다.

| 사용 위치 | v2.2.2에서 고정한 계산 |
| --- | --- |
| 화면의 관례적 라벨 `FC:CF+C` | `FC : (CF + C + Cn)` |
| WSumC | `0.5*FC + 1.0*CF + 1.5*C` |
| S-CON criterion 7 | `CF + C > FC` |
| Color-Shading blend의 chromatic color | `FC`, `CF`, `C`만 포함 |

Cn은 첫 번째 화면 비율에는 들어가지만 나머지 세 계산에는 들어가지 않습니다. 하나의 `colorTotal`을 여러 계산에 재사용하면 어느 한쪽이 틀릴 수 있으므로, 코드·테스트·AI 설명에서 각 경계를 분리했습니다.

## 이번 릴리즈에서 바뀐 것과 바뀌지 않은 것

### 바뀐 것

- 릴리즈 후 내부 재검토에서 만들어진 잘못된 Cn 제외 초안을 철회하고, v2.2.1 공개 릴리즈 노트와 배포 코드가 처음부터 Cn 포함 화면값으로 일치했음을 Git 이력으로 확인했습니다.
- `displayedColorRatioRight = CF + C + Cn`과 `sconUnmodulatedColor = CF + C`를 별도 변수로 고정했습니다.
- 5개 언어의 `FC:CF+C`·Cn 참조 문서, 생성 코퍼스, 런타임 변수 설명을 같은 경계로 동기화했습니다.
- 코딩 도우미와 해석 도우미의 Cn fixture를 각각 만들고 실제 GPT-5.5 경로에서 반복 검증했습니다.
- `2:5`처럼 수식 형태인 기대값은 흩어진 숫자가 아니라 해당 문자열 자체가 있어야 통과하도록 eval 계약을 강화했습니다.
- 공개 eval JSON과 JSONL에서 사설 저장소 commit 식별자를 자동 제거하도록 공개 미러를 보강했습니다.
- 승인된 UI 변경으로 좌측 패널의 반투명·blur를 제거하고 완전 불투명 배경으로 고정했습니다.

### 바뀌지 않은 것

- v2.2.1 배포 코드가 이미 보여주던 Cn 포함 화면값은 유지했습니다.
- 계산 화면에 연령 입력 UI를 추가하지 않았습니다.
- API 키 없이 사용하는 계산기 본체의 개인정보 최소수집 원칙을 바꾸지 않았습니다.
- AI가 부호화나 임상 해석을 자동 확정하도록 범위를 넓히지 않았습니다.
- 모바일 전용 UI/UX 최적화는 후속 v2.2.x 범위로 남겼습니다.

## 개발 계보와 자료별 역할

초기 v1 Google Apps Script 계산기를 만들 때 두 공개 자료가 중요한 학습 참고점이었습니다.

1. 공개 배포된 2019 Excel scoring workbook의 셀 수식
2. Jeremy Leader의 [RorScore](https://github.com/jleader/RorScore)와 canonical [`bin/rorschach.pl`](https://github.com/jleader/RorScore/blob/master/bin/rorschach.pl)

2019 workbook의 공개 배포 위치는 [Naver Blog 게시물](https://blog.naver.com/jin_k84/221539279596)이며, workbook 안에서 확인되는 제작 표기는 `[Scoring Program] _by. Ju-Ri`입니다. 이 표기만으로 실명을 추정하지 않고 원본 파일도 재배포하지 않습니다.

두 자료는 개발 계보와 구현 비교를 설명하는 근거이지, 어느 하나를 판본 규칙의 단독 정답으로 취급하지 않았습니다. 규칙 근거, 완성 구조요약 출력, 독립 구현, Excel·v1·v2 코드 계보를 역할별로 나눠 교차대조했습니다.

| 자료 | 이번 감사에서 맡은 역할 | 단독 정답으로 쓰지 않은 이유 |
| --- | --- | --- |
| 선택한 Exner CS 명시 규칙과 완성 구조요약 | 산식·순서·표시 경계의 1차 기준 | 앱이 채택한 판본과 표시 범위를 먼저 고정해야 함 |
| CHESSSS | 공개 설명서와 배포 정보의 보조 확인 | 공개 경로에서 셀 수식을 재현하지 못해 계산식 확정 근거로 사용하지 않음 |
| RAP3·RIAP5 공개 출력 | 완성 구조요약의 표시·경계 비교 | 공개 출력만으로 모든 산식을 확정할 수 없음 |
| 검토한 RorScore canonical source | 초기 코드 계보와 독립 구현 비교 | Cn 표시, D 범위, GHR/PHR 등에서 앱 기준과 차이가 있음 |
| 2019 Excel workbook | 초기 v1 계보와 실제 셀 수식 비교 | 일부 수식은 맞고 일부는 앱 기준 규칙과 다름 |
| GPT-5.5 | 검색·설명 경로 검증 | 계산 규칙의 정답지가 아님 |

## 다섯 질문에 대한 답

### 1. 원본 Excel이 잘못되었는가?

**일부는 맞고 일부는 달랐습니다.**

맞았던 대표 항목:

- `WSumC = 0.5*FC + CF + 1.5*C`
- EA, es, AdjEs의 기본 합산
- 자기중심성 지수에서 반사반응을 3배 가중하는 구조
- 화면의 관례적 `FC:CF+C` 오른쪽 값에 Cn을 포함하는 셀 수식

앱이 선택한 규칙과 달랐던 대표 항목:

- D/AdjD를 `-5`에서 `+5`까지만 반환
- EB 양쪽이 양수이면 공식 gate와 무관하게 EBPer를 표시
- WDA%와 Afr의 분모가 0일 때 spreadsheet 오류 발생
- S-CON과 Color-Shading에서 Cn 포함 색채 합계를 재사용

같은 workbook에서 직접 재현할 수 있는 셀 계보는 다음과 같습니다.

- `Upper_Section!AF8:AF11`은 `FC`, `CF`, `C`, `Cn`이고 실제 빈도는 `AH8:AH11`에 있습니다.
- 화면 비율은 `Lower_Section!Q9 = AH8`, `S9 = SUM(AH9, AH10, AH11)`이므로 오른쪽 값은 `CF+C+Cn`입니다.
- WSumC는 `Lower_Section!S11 = SUM(AH8*0.5, AH9, AH10*1.5)`이므로 Cn을 제외합니다.
- S-CON criterion 7은 `Special_Indices!D15`가 화면용 `S9 > Q9`를 그대로 비교해 Cn을 포함합니다.
- Color-Shading은 `Scoring!AF5`의 Color 목록에 Cn이 들어 있고, `AG5`의 shading 표시와 결합한 `AH5`를 `AH4`에서 집계한 뒤 `Special_Indices!D10`이 사용합니다.

따라서 “Excel 전체가 틀렸다”도 아니고 “Excel과 같으니 앱도 맞다”도 아닙니다. 셀마다 목적과 규칙을 다시 분리해야 했습니다.

### 2. Excel의 차이는 임상적으로 얼마나 특수한 경우에 나타나는가?

공개 발생률 자료가 없으므로 임의의 퍼센트를 만들지 않고 **정확한 발동 조건**으로 설명합니다.

| 항목 | 발동 조건 | 범위 판단 |
| --- | --- | --- |
| D/AdjD 상한 | `EA-es` 또는 `EA-AdjEs`가 `+15.0`보다 크거나 `-15.0`보다 작음 | 큰 자원-부담 불균형이 필요한 극단 구간 |
| EBPer 과잉 표시 | EB 양쪽이 양수지만 EA, Lambda 또는 EA 구간별 절대 차이 gate를 충족하지 않음 | 희귀 부호 없이도 가능한 비교적 넓은 범위 |
| WDA% 0분모 | W, WS, D, DS 반응이 전혀 없음 | 표준 실시에서는 매우 이례적 |
| Afr 0분모 | I-VII 카드 반응이 전혀 없음 | 표준 카드 실시라면 불완전 입력에 가까움 |
| S-CON의 Cn 오염 | Cn이 있고 `CF+C`와 FC가 criterion 경계에 가까움 | Cn 자체가 드물지만 1점 경계를 바꿀 수 있음 |
| Color-Shading의 Cn 오염 | Cn과 shading 결정인이 같은 blend 문맥에 걸림 | 매우 특수한 조합 |

D/AdjD 예시: 프로토콜 전체 합이 `EA=3.5`, `es=19.0`이면 원차는 `-15.5`입니다. 상한형 수식은 `D=-5`에서 멈추지만, 연속되는 2.5 간격 변환은 `D=-6`입니다. “어두운 구름이 바람에 밀려 내려오고 있어요” 같은 가상 응답에서 Inquiry로 무생물 운동과 diffuse shading이 확인되면 `m`, `Y` 계열 후보가 될 수 있습니다. 다만 문장 하나로 부호나 D 값을 확정하지 않으며, 여러 반응의 누적 합이 발동 조건을 만듭니다.

EBPer 예시: `M=7`, `WSumC=4`, `EA=11`, `Lambda=.55`이면 양쪽 차이가 3이므로 EA 구간 gate를 통과해 EBPer는 `1.75`입니다. 단순히 비율이 2.5 이상인지 보는 구현은 이 값을 잘못 숨깁니다.

### 3. Excel을 바탕으로 만든 앱도 잘못되었는가?

**v1과 v2.2.0에는 실제 결함이 있었습니다.** 다만 모든 결함이 Excel에서 그대로 복사된 것은 아닙니다.

| 항목 | 2019 Excel | v1 GAS | v2.2.0 | 배포된 v2.2.1 | v2.2.2 |
| --- | --- | --- | --- | --- | --- |
| D/AdjD | `+/-5` 상한 | 상한 계승 | 상한 계승 | 상한 제거 | 재감사·회귀 고정 |
| EBPer | 단순 비율 | 단순 비율 계승 | 다른 잘못된 gate | 공식 gate | 경계 재감사 |
| GHR/PHR | 셀 기반 판정 | 순서 일부 축약 | 축약 계승 | 7단계 함수 | 7단계 우선순위 회귀와 빈 FQ 경계 재감사 |
| 화면 `FC:CF+C` | Cn 포함 | Cn 누락 | Cn 누락 | Cn 포함 | Cn 포함 유지·변수 분리 |
| WSumC | Cn 제외 | Cn 제외 | Cn 제외 | Cn 제외 | Cn 제외 회귀 고정 |
| S-CON c7 | Cn 포함 합계 재사용 | Cn 제외 | Cn 제외 | Cn 제외 | 별도 `CF+C` 변수로 고정 |
| Color-Shading | Cn 포함 범위 재사용 | Cn 제외 | Cn 제외 | Cn 제외 | `FC/CF/C` 집합으로 고정 |
| WDA%/Afr 0분모 | 오류 | 0으로 대체 | 0으로 대체 | 정의 불가 `-` | 재감사·회귀 고정 |
| 자기중심성 지수 | 반사반응 x3 | x2로 오이식 | v2.2.0 이전 x3 교정 | x3 유지 | x3 재감사 |
| ZEst | 표 기반 | 마지막 경계 오류 | 교정 이력 | 유효 정수 방어 | 표 전체 재감사 |

v2.2.1의 **계산 런타임과 공개 릴리즈 노트**는 Cn 화면값을 올바르게 포함했습니다. v2.2.2는 릴리즈 후 내부 재검토에서 생긴 잘못된 미커밋 제외 초안을 철회하고, 화면 비율·WSumC·S-CON·Color-Shading 경계를 각각 독립적으로 검증했습니다.

### 4. 앱 결함은 임상적으로 얼마나 특수한 경우에 나타났는가?

- **D/AdjD 상한:** `+/-15`를 벗어나는 좁고 극단적인 구간에서 심한 정도를 한 단계 이상 축소할 수 있었습니다.
- **EBPer:** 이번 계보 결함 중 적용 범위가 가장 넓었습니다. 희귀 부호가 없어도 gate 조합에 따라 표시 여부가 달라질 수 있었습니다.
- **GHR/PHR:** 좋은 FQ의 인간표상에 `ALOG`, `CONTAM` 또는 Level 2 인지 특수점수가 함께 있는 것처럼 흔하지 않지만 가능한 조합에서 우선순위가 달라질 수 있었습니다.
- **v1·v2.2.0의 Cn 화면 누락:** Cn이 한 개 이상인 비교적 좁은 범위에서 Lower Section 비율 오른쪽 값이 작게 표시됐습니다.
- **WDA%/Afr 0분모:** 표준 실시에서는 매우 이례적이지만, 정의할 수 없는 값을 정상적인 0으로 보이지 않는 것이 중요했습니다.

GHR/PHR 기전 예시: “두 사람이 서로 밀고 있어요. 둘이 떨어져 있으니 같은 사람인 게 분명해요.”라는 가상 응답에서 영역·형태·운동이 확인되고 마지막 설명이 ALOG로 판정된다면 `Do Ma H ALOG` 같은 후보가 될 수 있습니다. 좋은 FQ의 인간표상이어도 ALOG가 있으면 7단계 중 앞선 PHR 조건이 적용됩니다. 실제 부호화는 원반응과 Inquiry를 본 인간 채점자가 수행합니다.

Cn 기전 예시: “이건 빨간색이에요. 모양은 모르겠고 그냥 빨간색입니다.”가 순수한 색 이름 반응으로 확인되면 `Cn`, FQ none 후보입니다. `FC=2`, `CF=4`, `C=0`, `Cn=1`이라면:

- 화면 `FC:CF+C` 결과는 `2:5`
- WSumC는 `0.5*2 + 4 + 1.5*0 = 5.0`
- S-CON c7은 `4 > 2`를 판정하며 화면 우변 5를 재사용하지 않음
- Color-Shading의 chromatic color 범위에도 Cn을 넣지 않음

### 5. 무엇을 기준으로 맞고 틀림을 판단했는가?

1. 앱이 채택한 Exner Comprehensive System 판본의 명시 계산식과 순서 규칙
2. 같은 범위의 완성 구조요약 예제와 출력
3. RAP3, RIAP5, RorScore의 재현 가능한 독립 구현·출력 증거와 CHESSSS 공개 설명서
4. 2019 Excel, v1 GAS, v2 TypeScript의 실제 구현 계보
5. 경계값 테스트, 공개 fixture, 고정 seed 속성 테스트, 분기 대조
6. AI 작성 원문에서 생성 코퍼스·벡터·검색·최종 응답까지의 end-to-end 검증

공개 프로그램끼리 서로 같다는 사실만으로 판본 규칙을 확정하지 않았습니다. 특히 S-CON criterion 7과 Color-Shading의 Cn 취급은 공개 자료가 침묵하거나 서로 달라, 외부 프로그램 전체에 통용되는 유일한 공식식이라고 표현하지 않습니다. 이 릴리즈는 이 앱이 채택한 판본과 구조요약 범위의 계산 경계를 명시하고 회귀 테스트로 고정합니다. GPT-5.5의 답변도 계산 정답지가 아니라 검색·설명 경로의 검증 대상으로만 사용했습니다.

## 다섯 언어 예시와 검증 범위

계산 함수는 자연어 메모가 아니라 입력된 부호를 계산합니다. 다음 문장들은 문화권별 규준을 주장하기 위한 샘플이 아니라, 같은 Cn 기전을 설명하는 **언어 불변성 fixture**입니다.

| 언어 | 가상 응답 | 가능한 후보 |
| --- | --- | --- |
| 한국어 | 이건 빨간색이에요. 모양은 모르겠고 그냥 빨간색입니다. | `Cn`, FQ none |
| English | It is red. I do not see a shape; it is just the color red. | `Cn`, FQ none |
| 日本語 | 赤い色です。形は分からず、ただ赤い色に見えます。 | `Cn`, FQ none |
| Español | Es de color rojo. No veo una forma; solo es el color rojo. | `Cn`, FQ none |
| Português | É vermelho. Não vejo uma forma; é apenas a cor vermelha. | `Cn`, FQ none |

실제 Cn 판정에는 원반응과 Inquiry가 필요합니다. 번역문만으로 부호를 자동 확정하지 않습니다.

## AI 지식층과 live eval 강화

계산 코드만 맞고 AI 문서가 틀리면 도우미가 과거 결론을 반복할 수 있습니다. 그래서 다음 전체 경로를 함께 갱신했습니다.

`5개 언어 작성 원문 -> 생성 route 문서·chunk -> OpenAI 임베딩 -> hybrid retrieval -> GPT-5.5 응답 -> eval 계약`

v2.2.2 내부 진단의 초기 live eval에서는 코딩 도우미가 Cn의 downstream 계산 경계를 충분히 검색하지 못했습니다. 작성 원문만 바꾸고 생성 코퍼스를 갱신하지 않은 상태를 확인한 진단도 한 번 실패했습니다. 이는 공개된 v2.2.1 기록의 오류가 아니라, v2.2.2에서 전체 지식 경로를 함께 갱신해야 한다는 점을 확인한 과정입니다. 이후 5개 언어 Cn 문서, 생성 코퍼스, 6,629개 벡터를 순서대로 다시 만들고 literal formula 계약을 보강했습니다. 전 언어 벡터 prune이 locale을 무시하던 운영 결함도 교정했습니다. 실패 진단과 최종 통과 산출물을 모두 보존했습니다.

- 영어 코딩·해석 Cn 반복: 6/6 통과, failed run 0, issue 0
- 독립 감사 후 Cn 네 경계의 5개 언어 재검증: ko/en/ja/es/pt 각 2회, **10/10 통과**, failed run 0, issue 0
- 해석 도우미 Cn guardrail v7 smoke: **3/3 통과**, failed run 0, issue 0. `/api/chat` 전체 production parity 근거로는 사용하지 않음
- 기존 5개 언어 대표 경로: 5/5 통과, failed run 0, issue 0
- v2.2.2 완료 live eval: 111회, 추정 비용 `$3.544115`
- 독립 감사 후 5개 언어 Cn 재검증 비용: `$0.330270`
- 해석 도우미 guardrail v7 smoke 비용: `$0.078330`
- 실패한 중간 실행은 `diagnostic` 산출물로 보존하고 최종 통과 파일과 이름부터 구분
- vector runtime: 6,629/6,629, stale 0, OpenAI 5개 언어 ready

자세한 기록:

- [v2.2.2 계산 정확성 재감사 보고서](../../source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md)
- [v2.2.2 Cn·5개 언어 live eval 보고서](../../source/docs/ai-evals/2026-07-17-v2.2.2-live-eval-report.md)

## 검증 결과

| 검증 | 결과 |
| --- | --- |
| 집중 계산·AI 계약 테스트 | 8개 파일, 75개 테스트 통과 |
| 전체 unit/integration | 69개 파일, 376개 통과, 6개 명시적 skip |
| AI 계약 전용 | 10개 파일, 101개 테스트 통과 |
| TypeScript·lint | 통과 |
| production build | 222/222 route 통과 |
| 다섯 언어 RAG | ko 101, es 81, en/ja/pt 각 61개 통과 |
| AI release gate | 7/7 통과 |
| security check | 명백한 비밀정보 0건, 알려진 취약점 0건 |
| 좌측 패널 시각 QA | 데스크톱·모바일, 라이트·다크 모두 완전 불투명 확인 |

개발 중 검증 래퍼의 shell 기반 자식 프로세스 실행에서 Node `DEP0190` 경고가 한 차례 관찰됐습니다. 최종 독립 감사와 최종 게이트에서는 다시 나타나지 않았으며, 테스트·빌드·보안 판정 실패도 없었습니다.

## 공개 범위와 개인정보 경계

공개 저장소에는 교정된 코드·테스트·5개 언어 계산 설명·집계형 eval 결과·canonical 공개 링크를 남깁니다. 다음은 공개하지 않습니다.

- 비공개 보유 자료의 로컬 파일명, 경로, 해시, 원문, 스캔
- API key, `.env*`, Neon/Vercel 연결 정보
- raw prompt, raw model answer, chat message
- 반응 메모, 구조요약 private payload, patient data
- 사설 저장소 commit hash

공개 미러 스크립트는 eval JSON과 JSONL의 `source`에 기록된 commit 계열 식별자를 자동 제거합니다.

## 독립 감사와 한계

Claude Fable 5는 미커밋 작업본을 읽기 전용으로 적대적 감사하고, OpenAI Codex는 지적된 반례를 로컬 코드·수식·출력·테스트에서 독립 재현해 수정과 측정을 수행합니다. 두 AI의 합의 자체는 계산 정답의 근거가 아닙니다. 릴리즈 게이트에는 최종 독립 감사와 개발자 승인을 포함합니다.

자동 테스트는 알려진 규칙과 생성 조합을 넓게 검사하지만 가능한 모든 인간 반응을 수학적으로 증명하지는 않습니다. 계산기는 입력된 부호를 집계하며 잘못 부호화된 입력을 임상적으로 교정하지 않습니다. CHESSSS 배포 파일의 셀 수식은 최종 감사에서 공개 경로로 다시 확보하지 못했으므로, 공개 설명서에서 직접 확인할 수 없는 수식 주장은 최종 근거에서 제외했습니다. 최종 부호화와 해석은 자격을 갖춘 전문가의 판단 영역입니다.

## 공개 교차검증 링크

- [Rorschach Workshops: A Rorschach Workbook for the Comprehensive System, 5th ed. 서지](https://rorschachworkshops.com/product/a-rorschach-workbook-for-the-comprehensive-system-5th-ed/)
- [International Rorschach Institute: CHESSSS 1 배포 페이지](https://www.rorschach-institute.org/download%20_chessss1.html)
- [RorScore canonical repository](https://github.com/jleader/RorScore)
- [RorScore canonical Perl source](https://github.com/jleader/RorScore/blob/master/bin/rorschach.pl)
- [RAP3 Structural Summary report](https://virtualpsychology.com/documentation/rap_plus/Structural%20Summary%20report%20-%20Virtual%20Psychology.pdf)
- [RIAP5 공개 sample report](https://hogrefe.se/userfiles/files/RIAP5IR_SAMPLE.pdf)
- [2019 Excel workbook 공개 배포 게시물](https://blog.naver.com/jin_k84/221539279596)

RAP3와 RIAP5의 공개 출력, 그리고 검토한 RorScore canonical source는 독립 구현·출력 증거이며, CHESSSS 링크는 공개 설명서와 배포 정보 확인에 사용했습니다. 이 링크들을 Exner 원전의 대체물이나 임상 권위 인증으로 표현하지 않습니다.

## 소스코드

- [v2 공개 소스 snapshot](../../source/)
