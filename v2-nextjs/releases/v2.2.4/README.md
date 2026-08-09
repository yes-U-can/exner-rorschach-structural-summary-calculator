# [2026-07-18] v2.2.4 버그 패치

## 먼저 확인하실 점

v2.2.4는 **구조요약 계산식과 채점표의 입력 방식을 바꾸지 않은** 참조 문서·AI 검색·안전성 보완 패치입니다. 완성된 프로토콜의 구조요약 결과를 다시 계산할 필요가 없습니다. API 키 없이 계산기만 사용하는 경우에도 새로 입력해야 하는 피검자 정보는 없습니다.

이번 패치에서는 참조 문서와 AI 검색 자료를 개선했습니다. 다섯 언어의 임상 용어는 단순 직역으로 맞추지 않고, 각 언어권의 전문 문헌과 학술 자료에서 실제로 쓰이는 표현을 우선했습니다. 문서의 제목과 배열도 알파벳순이 아니라 채점과 구조요약을 따라가기 쉬운 순서로 정리했습니다.

선택 기능인 코딩 도우미와 해석 도우미는 Exner Comprehensive System(CS) 범위 안에서만 답합니다. 다른 검사 체계나 비공개 정보를 요구하는 질문에는 답하지 않습니다.

## 참조 문서

### 화면에서 읽기 쉬운 제목과 순서

기존 참조 문서 링크는 그대로 유지하면서 화면에 보이는 제목을 각 언어의 임상 용어에 맞게 바꿨습니다. 버튼에는 `부호화`, `형태질(FQ)`, `특수지표`처럼 뜻을 알 수 있는 제목이 나타납니다.

상위 문서는 다음 흐름으로 배열했습니다.

1. 부호화
2. 해석
3. Upper Section
4. Lower Section
5. Special Indices

부호화 문서는 카드, 영역, 발달질(DQ), 결정인, 형태질(FQ), 쌍반응, 내용, 평범반응(P), 조직화 활동(Z), 점수, GHR/PHR, 특수점수 순으로 이어집니다. 알파벳순은 같은 범주의 세부 항목을 찾을 때만 사용합니다.

### 다섯 언어의 임상 용어

한국어, 영어, 일본어, 스페인어, 브라질 포르투갈어 문서는 각 언어에서 자연스러운 전문 용어를 사용합니다. 각 문서는 핵심 정의, 적용 조건, 주의점과 관련 항목을 설명합니다.

대표적으로 다음 내용을 바로잡았습니다.

- 영어 PHR 문서에서 `ALOG`가 판정 순서의 초기 PHR 조건에 포함된다는 점을 명확히 했습니다.
- 영어와 스페인어의 자연 내용 부호에서 `Na`가 적용되면 같은 반응에 `Bt` 또는 `Ls`를 함께 부호화하지 않는 우선순위를 명확히 했습니다.
- 일본어 문서에서 `Ay`를 해부학적 내용이 아니라 문화·역사적 내용으로 설명하도록 바로잡았습니다.
- 한국어 문서에서 원시 빈도인 `S-`와 별도 비율인 `S-%`를 구분했습니다.
- 한국어 S-CON 문서에 만 15세 이상 적용 경계와 12개 구성 기준을 명시했습니다.

이 변경은 임상가가 반응기록과 질문단계(Inquiry)를 확인하고 수행하는 부호화를 대신하지 않습니다. 참조 문서는 부호의 정의와 구분 기준을 확인하는 보조 자료이며, 개별 반응의 최종 부호화는 계속 인간 채점자의 책임입니다.

## AI 참조 문서 검색

AI 도우미는 현재 참조 문서에서 질문과 관련된 내용을 찾습니다.

다음과 같은 짧은 질문에서도 관련 설명을 함께 찾습니다.

- Cn과 WSumC의 관계를 묻는 짧은 질문에서도 Cn이 들어가는 화면값과 들어가지 않는 WSumC 설명을 함께 찾도록 했습니다.
- `Na`, `Bt`, `Ls`의 우선순위를 묻는 질문이 세 내용 부호의 일반 설명만 찾고 정확한 우선순위 문장을 놓치지 않도록 했습니다.

## 코딩 도우미와 해석 도우미의 범위

두 도우미는 다음 원칙을 따릅니다.

- Exner Comprehensive System(CS)의 부호화와 구조요약 질문에만 답합니다.
- R-PAS, MMPI처럼 별도의 검사 체계나 일반 상담·진단 질문으로 답변 범위를 넓히지 않습니다.
- 서비스의 비공개 정보나 사용자의 API 키·연결 정보 공개를 요구하는 요청을 거절합니다.
- 해석에 연령이 실제로 필요한 경우에는 AI 대화 안에서 필요한 이유를 설명하고 질문할 수 있지만, 계산기 본체에 연령 입력을 요구하지 않습니다.
- 구조요약만으로 진단이나 위험을 확정하지 않으며, 면담·행동관찰·원자료와 임상가의 판단을 우선합니다.

Exner CS 범위를 벗어나거나 비공개 정보를 요구하는 요청에는 답하지 않고, 답변 가능한 부호화 또는 구조요약 질문을 안내합니다.

## AI 요청의 과도한 반복 방지

AI 대화 요청은 1분에 12회 또는 1시간에 120회를 넘기면 잠시 기다리도록 안내합니다. 이 제한은 실수로 같은 요청을 반복하거나 예상보다 비용이 커지는 일을 줄입니다. 요청 횟수를 제한하기 위해 API 키, 질문, 답변, 구조요약 원문이나 임상 내용을 별도로 저장하지 않습니다.

좋아요·싫어요 평가는 대화 원문을 저장하지 않으며 최대 180일 보관합니다.

## 화면과 서비스 설명에서 바뀐 점

- 왼쪽 사이드바는 뒤의 본문이 비치지 않는 불투명 배경으로 고정했습니다.
- 사이드바가 접힌 상태에서 언어 메뉴를 열 때 메뉴가 잘리거나 본문 위에 어긋나던 문제를 고쳤습니다.
- 참조 문서 버튼에는 다섯 언어 제목과 채점·해석 흐름에 맞춘 순서를 적용했습니다.
- 채점 화면에 들어올 때마다 새 데이터, 샘플 데이터, 저장 데이터 중 시작 방식을 다시 선택하는 창이 열리도록 복원했습니다.
- 참조 문서의 코드형 핵심 구절은 라이트·다크 모드 모두에서 구분하기 쉬운 붉은색으로 표시합니다.
- 코딩 도우미에서 이전 대화를 읽으려고 위로 이동하면 나타나는 아래쪽 화살표를 입력 영역 바로 위에 배치했습니다. 긴 답변에서도 화살표가 대화창 한가운데를 가리지 않습니다.
- 버전 2와 버전 1 기록은 처음 들어왔을 때 접힌 상태로 표시합니다.
- 서비스 명칭은 `Exner 로샤 종합체계 구조요약 계산기`로 통일했습니다.
- 서비스 소개에는 MOW(모오)의 제작과 서울임상심리연구소(Seoul Institute of Clinical Psychology, SICP)의 초기 계산 결과 확인·실제 임상 사용 관점 검토 기여를 표시합니다.

채점표의 열, 드롭다운, 계산 버튼, 확대·축소 조작과 구조요약 결과 화면은 바뀌지 않았습니다. 모바일 화면도 그대로 유지됩니다.

AI 응답은 매번 달라질 수 있으며 모든 실제 질문의 임상적 정확성을 보증하지 않습니다. 구조요약 계산의 정답을 AI 답변으로 판정하지도 않습니다.

## 다섯 언어 용어의 공개 출처

각 언어의 전문 용례를 우선하며 Comprehensive System의 부호와 식별자는 그대로 유지합니다. 단일 출처를 모든 언어의 정답으로 삼지 않습니다.

- 한국어: [KCI - Exner의 종합체계에 근거한 한국형 아동 로르샤하 종합체계의 구성](https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001392063), [KCI - 로샤 검사에 나타난 북한이탈주민의 대처와 방어](https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001391524)
- 영어: [International Rorschach Institute manuals](https://www.rorschach-institute.org/manuals.html), [Meyer and Viglione, An Introduction to Rorschach Assessment](https://www.utoledo.edu/al/psychology/pdfs/meyer/MeyerViglione2008IntroRorschach.pdf)
- 일본어: [誠信書房 - 包括システムによるロールシャッハ臨床](https://www.seishinshobo.co.jp/book/b88274.html)
- 스페인어: [Sociedad Española de Rorschach y Métodos Proyectivos](https://www.rorschach.es/index.php/programas-de-los-cursos), [CHESSSS](https://rorschachspain.org/chessss/), [Manual de codificación del Rorschach para el Sistema Comprehensivo](https://www.psimatica.com/tienda/psicodiagnostico/23-manual-de-codificacion-del-rorschach-autor-john-exner.html)
- 브라질 포르투갈어: [SciELO - Localização e qualidade formal do Rorschach-SC no Brasil](https://www.scielo.br/j/pusf/a/kFHxFGKH3qx9gdVtyC6nqWS/), [SciELO - Indícios de validade do déficit relacional no Método de Rorschach](https://www.scielo.br/j/pusf/a/6Xy8zSJGCNq49BWjXRpYNhx/)
- 공통 번역·적응 원칙: [International Test Commission Guidelines](https://www.intestcom.org/page/14)
