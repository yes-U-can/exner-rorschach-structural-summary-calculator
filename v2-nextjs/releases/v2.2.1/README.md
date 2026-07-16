# [2026-07-16] v2.2.1 계산 정확성 핫픽스

> **2026-07-17 추가 검증:** 공개된 v2.2.1 문서와 배포 런타임은 Lower Section `FC:CF+C`를 처음부터 `FC:(CF+C+Cn)`으로 일관되게 계산·설명했습니다. 릴리즈 후 내부 재검토 과정에서 Cn을 다시 제외하는 미커밋 초안이 잠시 만들어졌지만, 독립 감사에서 Git 이력과 계산 근거에 맞지 않는 것으로 확인되어 공개 전에 철회했습니다. WSumC, S-CON criterion 7, Color-Shading은 화면 비율과 별도의 계산 경계를 사용합니다. 최신 근거와 검증 결과는 [v2.2.2 계산 정확성 재감사 핫픽스](../v2.2.2/)에서 확인할 수 있습니다.

## 요약

v2.2.1은 v2.2.0 계산 감사의 불완전한 판정을 바로잡고, 구조요약 산식의 실제 남은 결함을 교정한 핫픽스입니다. 이번 릴리즈의 중심은 API 키 없이도 사용하는 **구조요약 계산기 자체의 정확성**이며, 감사 범위는 앱이 표시하는 **Upper Section, Lower Section, Special Indices**입니다.

위 세 영역 밖의 연구용·확장 지표나 다른 로샤 체계는 이번 감사에 포함하지 않았습니다. UI/UX는 변경하지 않았고 연령 입력란도 추가하지 않았습니다. 계산기는 지금까지처럼 피검자의 연령을 요구하거나 저장하지 않습니다. 부호화와 임상 해석은 전문가의 몫이며, 선택 기능인 AI 해석 도우미만 연령 제한이 있는 지표의 해석을 직접 요청받았을 때 대화 안에서 필요한 정보를 질문합니다.

## 먼저 바로잡는 v2.2.0 기록

v2.2.0 문서는 계산 감사를 완료했다고 기록했지만 일부 판정이 틀렸습니다. 역사 기록은 삭제하지 않고 정정 고지를 추가했습니다.

- D/AdjD는 음수 0 표시만의 문제가 아니었습니다. Excel, v1 GAS, v2.2.0에 `-5`부터 `+5`까지의 상한이 남아 있었습니다.
- EBPer는 v2.2.0에서 `비율 >= 2.5`라는 잘못된 gate를 사용했습니다. 공식 규칙은 EA 구간에 따른 **양쪽 절대 차이**를 봅니다.
- GHR/PHR 판정은 7단계 순서 규칙의 일부를 축약해 특정 PHR을 GHR로 보낼 수 있었습니다.
- v1과 v2.2.0은 화면의 `FC:CF+C` 오른쪽 값에서 Cn을 누락했습니다. v2.2.1은 Cn을 포함하도록 교정했고, 배포 런타임과 공개 릴리즈 노트가 같은 계산을 기록했습니다.
- WDA%와 Afr의 분모가 0인 입력을 정의 불가가 아니라 정상적인 0으로 처리했습니다.
- v2.2.0 문서의 “연령을 계산 화면에서 확인한다”는 취지의 문장은 제품 설계 원칙과 맞지 않습니다. 계산기는 연령을 받지 않습니다.

교정된 전체 근거는 [v2.2.1 구조요약 계산 추적 원장](../../source/docs/ops/2026-07-16-v2.2.1-calculation-trace.md)에 남겼습니다.

## Excel과 구현 계보

초기 v1 GAS를 만들 때 공개 배포된 2019 Excel workbook의 셀 수식을 계산 로직의 구현 참고 자료로 사용했습니다.

- 공개 배포 위치: [Naver Blog 게시물](https://blog.naver.com/jin_k84/221539279596)
- workbook 안에서 확인되는 표기: `[Scoring Program] _by. Ju-Ri`

workbook 표기만으로 제작자의 실명을 추정하지 않습니다. 원본 파일도 저작권과 출처 경계를 고려해 공개 저장소에 재배포하지 않습니다.

계보는 다음과 같습니다.

1. 개발자는 프로그래밍을 배우기 전 Excel 수식으로 구조요약 계산을 이해했습니다.
2. v1 GAS를 만들며 해당 수식을 JavaScript로 옮겼습니다.
3. v2 Next.js에서 계산 로직이 TypeScript로 이어졌습니다.
4. 이번 감사에서는 Excel을 정답으로 가정하지 않고 Exner 명시 규칙, 완성 예제, CHESSSS, 공개 점수열과 나란히 대조했습니다.
5. 그 결과 Excel에서 시작된 오류, v1 이식 중 생긴 오류, v2에서 별도로 생긴 오류를 구분해 수정했습니다.

## 다섯 질문에 대한 답

### 1. 원본 Excel이 잘못되었는가?

**일부는 맞고 일부는 잘못됐습니다.** WSumC, EA, es, AdjEs, 자기중심성 지수의 반사반응 3배 가중, 화면 `FC:CF+C` 오른쪽 값의 Cn 포함 등 많은 핵심 수식은 맞았습니다. 그러나 다음 수식은 이 앱이 기준으로 삼은 Exner 구조요약 규칙과 달랐습니다.

- D/AdjD를 `-5`부터 `+5`까지만 반환했습니다.
- EB 양쪽이 0이 아니면 공식 gate와 무관하게 EBPer 비율을 표시했습니다.
- WDA%와 Afr는 분모가 0이면 spreadsheet 오류가 됐습니다.
- S-CON과 Color-Shading 계산에서 Cn 포함 색채 합계를 재사용했습니다.

따라서 “Excel 전체가 틀렸다”도 아니고 “Excel과 같으니 앱도 맞다”도 아닙니다.

### 2. Excel 오류는 임상적으로 얼마나 특수한 경우에 나타나는가?

발생률을 뒷받침하는 자료가 없으므로 임의의 퍼센트를 만들지 않고 정확한 발동 조건으로 설명합니다.

| 오류 | 정확한 발동 조건 | 범위 판단 |
| --- | --- | --- |
| D/AdjD 상한 | `EA-es` 또는 `EA-AdjEs`가 `+15.0`보다 크거나 `-15.0`보다 작음 | 큰 자원-부담 불균형이 필요한 극단 구간이라 비교적 드묾 |
| EBPer 무조건 표시 | EB 양쪽이 양수지만 EA, Lambda, EA 구간별 절대 차이 중 하나라도 공식 조건을 충족하지 않음 | 희귀 부호가 없어도 가능한 비교적 넓은 범위 |
| WDA% 분모 0 | W, WS, D, DS 반응이 하나도 없음 | 표준 실시에서는 매우 이례적 |
| Afr 분모 0 | I-VII 카드 반응이 하나도 없음 | 표준 카드 실시라면 불완전 입력에 가까움 |
| S-CON의 Cn 오염 | Cn이 있고 `CF+C`와 FC가 criterion 경계에 가까움 | Cn 자체가 드물지만 1점 경계를 바꿀 수 있음 |

D/AdjD 오류는 반응 한 개가 아니라 프로토콜 전체의 합에서 나타납니다. 예를 들어 `EA=3.5`, `es=19.0`이면 원차는 `-15.5`입니다. 기존 Excel은 `D=-5`에서 멈췄지만 연속되는 2.5 간격 규칙에서는 `D=-6`입니다.

기전을 설명하는 가상 반응은 “어두운 구름이 바람에 밀려 내려오고 있어요”입니다. Inquiry에서 무생물의 움직임과 명암 사용이 확인된다면 `m`과 `Y` 계열 후보가 될 수 있고, 이러한 결정인이 여러 반응에 누적되면 es가 커질 수 있습니다. 이 문장 하나만으로 코드를 확정하거나 D=-6을 만들 수는 없습니다. 최종 부호화는 반점 영역, Inquiry와 형태질을 확인한 인간 채점자가 수행합니다.

### 3. Excel을 바탕으로 만든 앱도 잘못되었는가?

**v1과 v2.2.0에 실제 오류가 있었습니다.** 다만 모든 오류가 Excel에서 그대로 복사된 것은 아닙니다.

| 항목 | 2019 Excel | v1 GAS | v2.2.0 | v2.2.1 |
| --- | --- | --- | --- | --- |
| D/AdjD | +/-5 상한 | 상한 계승 | 상한 계승 | 상한 없이 2.5 간격 계속 |
| EBPer | 양쪽 양수면 단순 비율 | 단순 비율 계승 | `EA>=4`와 비율 `>=2.5`라는 다른 오류 | 공식 gate 적용 |
| GHR/PHR | 별도 셀 판정 | 순서 일부 축약 | 축약 계승 | 7단계 순서 함수 |
| FC:CF+C 표시 | 표기는 `CF+C`지만 수식은 Cn까지 포함 | Cn 누락 | Cn 누락 | Cn 포함으로 교정, 공개 설명과 일치 |
| WDA%/Afr 0분모 | spreadsheet 오류 | 0으로 대체 | 0으로 대체 | 정의 불가 `-` |
| 자기중심성 지수 | 반사반응 x3 | x2로 오이식 | v2.2.0 이전에 x3 교정 | x3 회귀 고정 |
| all-F Lambda | 별도 문구 | 0으로 대체 | v2.2.0 이전에 무한대로 교정 | 무한대 회귀 고정 |

### 4. 앱 오류는 임상적으로 얼마나 특수한 경우에 나타나는가?

- **D/AdjD 상한:** `+/-15`를 벗어나는 좁고 극단적인 구간입니다. 방향은 같아도 심한 정도를 한 단계 이상 축소할 수 있었습니다.
- **EBPer:** 이번 결함 중 범위가 가장 넓습니다. Exner 완성 예제의 `M=7`, `WSumC=4`, `EA=11`, `Lambda=.55`는 양쪽 차이가 3이므로 EBPer가 `1.75`입니다. v2.2.0은 비율이 2.5 미만이라는 이유로 값을 숨겼습니다.
- **GHR/PHR:** 인간표상 반응에 좋은 FQ와 `ALOG`, `CONTAM` 또는 Level 2 인지 특수점수가 함께 있을 때처럼 흔하지 않지만 명시적으로 가능한 조합입니다.
- **v1·v2.2.0의 Cn 화면 누락:** Cn이 한 개 이상인 비교적 좁은 범위에서 Lower Section 비율 오른쪽 값이 작게 표시됐습니다. 배포된 v2.2.1 런타임은 이 값을 포함하도록 교정됐습니다.
- **WDA%/Afr 0분모:** 표준 실시에서는 매우 이례적입니다. 중요한 점은 정의할 수 없는 값을 정상적인 0으로 오인하지 않는 것입니다.

GHR/PHR 기전 예시: “두 사람이 서로 밀고 있어요. 둘이 떨어져 있으니 같은 사람인 게 분명해요.”라는 응답에서 영역·형태·운동이 확인되고 마지막 설명이 부적절한 논리로 판정된다면 `Do Ma H ALOG` 같은 후보가 될 수 있습니다. 좋은 FQ의 인간표상이어도 ALOG가 있으면 7단계 중 Step 2에서 PHR입니다.

Cn 기전 예시: “이건 빨간색이에요. 모양은 모르겠고 그냥 빨간색입니다.”가 순수한 색 이름 반응으로 확인되면 `Cn`, FQ none 후보입니다. Cn은 Upper Section에서 별도로 집계되고 Lower Section의 화면 `FC:CF+C` 오른쪽 값에도 포함되지만, WSumC, S-CON의 `CF+C>FC`, Color-Shading에는 더하지 않습니다.

### 5. 무엇을 기준으로 맞고 틀림을 판단했는가?

근거가 충돌하면 다음 순서를 사용했습니다.

1. John E. Exner, Jr.의 *A Rorschach Workbook for the Comprehensive System*, 5th ed.에 적힌 직접 계산식과 순서 규칙
2. 같은 책 Chapter 9의 완성 구조요약 예제
3. International Rorschach Institute가 배포하는 CHESSSS 공개 구현과 설명서
4. 점수열과 완성 구조요약이 함께 공개된 독립 사례
5. 2019 Excel 실제 셀 수식, v1 GAS, v2.2.0 TypeScript 코드의 계보
6. 경계값, 회귀, 언어 불변성, 재현 가능한 속성 테스트

어떤 프로그램도 단독 정답으로 취급하지 않았습니다. CHESSSS 설명서도 EBPer를 고려하지 않아야 하는 기록에서 값을 계산해 보일 수 있다고 밝히므로, 프로그램끼리 같다는 사실보다 명시된 규칙과 일치하는지를 우선했습니다.

확인한 공개 교차검증 자료:

- [Rorschach Workshops의 Exner Workbook 5판 서지](https://rorschachworkshops.com/product/a-rorschach-workbook-for-the-comprehensive-system-5th-ed/)
- [International Rorschach Institute의 CHESSSS 배포 페이지](https://www.rorschach-institute.org/download%20_chessss1.html)
- [CHESSSS 1 공식 설명서](https://www.rorschach-institute.org/CHESSSS%201%20HANDBOOK%20%28English%29.pdf)
- [FC, CF, C 세 결정인으로 비율을 정의한 동료평가 연구](https://www.tandfonline.com/doi/full/10.1080/00223890802634233)
- [CF+C와 CF+C+Cn을 서로 구분한 PubMed 등재 연구](https://pubmed.ncbi.nlm.nih.gov/4067799/)

## 다섯 언어 예시와 검증 범위

계산 함수는 자연어 메모가 아니라 Card, Location, DQ, Determinants, FQ, Pair, Contents, P, Z, Special Scores를 계산합니다. 따라서 같은 부호 입력이면 언어와 무관하게 같은 결과가 나와야 합니다.

| 언어 | 같은 Cn 기전을 설명하는 표현 | 가능한 후보 |
| --- | --- | --- |
| 한국어 | 이건 빨간색이에요. 모양은 모르겠고 그냥 빨간색입니다. | `Cn`, FQ none |
| English | It is red. I do not see a shape; it is just the color red. | `Cn`, FQ none |
| 日本語 | 赤い色です。形は分からず、ただ赤い色に見えます。 | `Cn`, FQ none |
| Español | Es de color rojo. No veo una forma; solo es el color rojo. | `Cn`, FQ none |
| Português | É vermelho. Não vejo uma forma; é apenas a cor vermelha. | `Cn`, FQ none |

다섯 점수열 각각에 다섯 언어 메모를 넣어 총 25회 계산하고, 메모를 제외한 전체 계산 결과가 완전히 같은지 확인했습니다. Cn을 추가하면 Lower Section의 화면 비율만 Cn만큼 변하고 WSumC·S-CON·Color-Shading 경계는 변하지 않는다는 최종 회귀 계약은 v2.2.2에서 다시 고정했습니다. 이것은 **언어 불변성 테스트**입니다. 다섯 문화권에서 별도의 임상 규준 타당성을 증명했다는 뜻은 아닙니다. 출처가 다른 사례를 국가별 3개씩 임의로 묶어 문화 검증처럼 표현하지 않았습니다.

## 핵심 수정

- D/AdjD 변환을 `+/-5`에서 멈추지 않고 2.5 간격으로 계속 계산합니다.
- EBPer는 `EA>=4`, `Lambda<1`, 양쪽 양수, EA 구간별 절대 차이를 모두 충족할 때만 계산합니다.
- GHR/PHR을 명시된 7단계 순서의 공용 함수로 계산하고 데스크톱·모바일 표시와 최종 결과가 같은 함수를 사용합니다.
- 화면의 관례적 `FC:CF+C`는 `FC:(CF+C+Cn)`으로 계산합니다. WSumC, S-CON criterion 7, Color-Shading은 별도 Cn 제외 경계를 사용합니다.
- 분모가 0인 WDA%와 Afr를 `0`이 아니라 정의 불가 `-`로 표시하고, 특수지표 조건의 수치 근거로 사용하지 않습니다.
- ZEst 유틸리티는 정수가 아닌 Zf와 비유한 값을 방어적으로 거부합니다.
- 계산기에 연령을 요구하지 않는 경계를 AI 플레이북과 계약 테스트에 고정했습니다.

## 검증

- 전체 unit/integration: `68` files, `356` passed, `6` intentionally skipped
- Exner Chapter 9의 17반응 완성 예제를 상단·하단·여섯 특수지표까지 end-to-end 대조
- 공개 점수열 3건과 2019 Excel 내장 사례 1건 회귀 검사
- D/AdjD 경계와 상한 밖, EBPer gate, `FC:CF+C`의 Cn 포함, 0분모, GHR/PHR 7단계 집중 테스트
- 5개 fixture x 5개 언어 메모 = 25회 언어 불변성 검사
- seed 고정 2,000개 합성 프로토콜과 독립 오라클 대조
- PTI·DEPI·CDI·S-CON·HVI·OBS의 42개 분기에서 true와 false 양쪽 모두 통과
- 실제 `/api/chat` 경로 4건: HTTP 200, `gpt-5.5`, 중단 0, issue 0
- 5개 언어 live eval 5건: hybrid retrieval, vector hit 2~7, 중단 0, issue 0
- v2.2.1의 확인 가능한 평가 이력에는 Cn 경계만을 직접 묻는 전용 계약이 없었습니다. v2.2.2에서 Cn 포함 화면값과 별도 제외 경계를 직접 검사하는 계약을 추가하고, 영어 코딩·해석 6/6 및 5개 언어 직접 검증 10/10으로 확인했습니다.
- OpenAI vector runtime 6,632/6,632, stale 0, 5개 언어 ready
- 다섯 언어 RAG 질의: ko 101, es 81, en 61, ja 61, pt 61 전부 통과
- AI contract 91/91, AI release gate 7/7, production build 222/222, 알려진 취약점 0
- live eval 산출물에는 API key, raw prompt, raw answer, 구조요약 원문을 저장하지 않음

주요 검증 명령:

```bash
npx vitest run __tests__/calculatorConformance.test.ts __tests__/calculatorOfficialWorkbookFixture.test.ts __tests__/calculatorLocaleInvariance.test.ts __tests__/calculatorPropertyAudit.test.ts __tests__/calculatorPublishedRiap.test.ts __tests__/gphr.test.ts
npx tsc --noEmit
npm run docs:generate-corpus
npm run ops:promote-vectors -- --skip-migrate --require-full-gate
npm run docs:verify-release
npm run ai:release-gate
npm test
npm run lint
npm run build
npm run security:check
git diff --check
```

## 공개 범위와 보안 경계

공개 source snapshot에는 교정된 계산 코드, 회귀·속성·언어 불변성 테스트, 다섯 언어 계산 설명 문서, 계산 추적 원장, 원문을 제외한 live eval 메타데이터를 포함합니다.

Excel 원본, Exner 원문 자료, API key, `.env*`, Neon/Vercel 연결 정보, raw prompt, raw model answer, chat message, 반응 메모, 구조요약 private payload, patient data, 로컬 임시 파일과 runtime log는 공개하지 않습니다.

이번 핫픽스는 AI가 부호를 자동 확정하거나 임상 해석을 대신하게 만들지 않습니다. 계산기는 입력된 부호를 정확히 집계하는 도구이고, 해석은 전문가의 몫입니다. AI 기능은 본인의 OpenAI API key로 별도 세션을 시작한 경우에만 제한적으로 열립니다.

## 남아 있는 한계

- 자동 테스트는 알려진 규칙과 생성된 조합을 넓게 검사하지만, 가능한 모든 인간 반응을 수학적으로 증명하지는 않습니다.
- 반응을 어떤 부호로 입력할지는 인간 채점자의 판단입니다. 계산기는 잘못 부호화된 입력을 임상적으로 교정하지 않습니다.
- 언어 불변성은 산식의 동일성을 뜻하며 문화적 규준 타당성 인증이 아닙니다.
- GPT-5.5 live eval은 도우미 경로의 엔지니어링 검증이며 임상적 인증이 아닙니다.
- 모바일 UI/UX 최적화는 이번 핫픽스 범위가 아니며 후속 v2.2.x에서 진행합니다.
