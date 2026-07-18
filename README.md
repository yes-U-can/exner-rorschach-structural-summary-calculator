# Exner Rorschach Structural Summary Calculator

`Exner 로샤 종합체계 구조요약 계산기`의 공개 소스 및 릴리즈 아카이브입니다. 관련 문서에 근거한 AI 도우미는 선택 기능으로 제공합니다.

이 저장소는 배포된 버전의 패치노트와 소스코드를 공개하기 위한 공간입니다. v1은 Google Apps Script 웹앱으로, v2는 Next.js 웹앱으로 정리했습니다.

MOW(모오)는 웹앱의 기획, 제작, 배포, 운영, 유지보수를 맡습니다. 서울임상심리연구소(Seoul Institute of Clinical Psychology, SICP)는 초기 계산 로직 이관 검토, 계산 결과 대조, 실제 사용 관점의 임상 검수를 맡습니다.

감사의 말과 초기 학습 참고 자료는 [ACKNOWLEDGEMENTS.md](./ACKNOWLEDGEMENTS.md)에 정리했습니다.

## 문서와 언어

패치노트에는 버전별 변경 사항, 영향을 받을 수 있는 조건, 기존 결과의 재계산 필요 여부와 확인에 사용한 근거를 함께 기록했습니다.

- 공개 릴리즈 노트와 CHANGELOG는 한국어를 기준으로 작성했습니다.
- GitHub 방문자가 프로젝트를 빠르게 이해할 수 있도록 [English overview](./README.en.md)를 함께 두었습니다.
- 웹앱 화면은 한국어, 영어, 일본어, 스페인어, 포르투갈어 5개 언어를 지원합니다.
- 릴리즈 노트는 번역본 사이의 내용 차이를 막기 위해 5개 언어로 중복 작성하지 않습니다.
- 명령어, 파일 경로, API 이름, 모델명처럼 정확한 식별이 필요한 이름은 원문을 유지하고, 필요한 경우 뜻을 함께 설명합니다.

## 현재 공개된 항목

- [Next.js] 라이브 웹앱: [exner.yesucan.co.kr](https://exner.yesucan.co.kr)
- [Next.js] 버전 2 최신 릴리즈: [v2-nextjs/releases/v2.2.5](./v2-nextjs/releases/v2.2.5/)
- [Next.js] v2.2.2 계산 정확성 검산: [v2-nextjs/source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md](./v2-nextjs/source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md)
- [Next.js] v2.2.2 Cn 설명·5개 언어 실제 GPT-5.5 호출 검사: [v2-nextjs/source/docs/ai-evals/2026-07-17-v2.2.2-live-eval-report.md](./v2-nextjs/source/docs/ai-evals/2026-07-17-v2.2.2-live-eval-report.md)
- [Next.js] v2.2.0 UI 검증: [v2-nextjs/source/docs/ops/2026-07-14-v2.2.0-workspace-shell-validation.md](./v2-nextjs/source/docs/ops/2026-07-14-v2.2.0-workspace-shell-validation.md)
- [Next.js] v2.2.0 AI 경계 검증: [v2-nextjs/source/docs/ai-evals/2026-07-15-v2.2.0-exner-domain-boundary-report.md](./v2-nextjs/source/docs/ai-evals/2026-07-15-v2.2.0-exner-domain-boundary-report.md)
- [Next.js] v2.1.2 AI 답변 제어 방식 사례: [docs/case-studies/v2.1.2-ai-harness.md](./docs/case-studies/v2.1.2-ai-harness.md)
- [Next.js] AI 답변 품질 검사 안내: [v2-nextjs/source/docs/ai-evals/README.md](./v2-nextjs/source/docs/ai-evals/README.md)
- [Next.js] AI 답변 사람 검토 기준표: [v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md](./v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md)
- [Next.js] 버전 2 릴리즈 기록: [v2-nextjs/releases](./v2-nextjs/releases/)
- [Next.js] 버전 2 공개 소스코드: [v2-nextjs/source](./v2-nextjs/source/)
- [Google Apps Script] 버전 1 릴리즈 기록: [v1-gas/releases](./v1-gas/releases/)
- 최신 v1 실행본: [v1.4.1 배포링크](https://script.google.com/macros/s/AKfycbxMCx13pkrSzFs8f2qXfmxy2LRhkBpZTItFTIfEOoOi-zwurbysnKGfDIYtAeEdQP99/exec)
- 최신 v1 소스코드: [v1-gas/current](./v1-gas/current/)

## v2.1.x AI 품질 개선 흐름

v2.1.x에서는 AI 도우미가 답변을 끝까지 작성하는지, 질문에 맞는 참조 문서를 찾는지, 임상가의 판단을 대신하지 않는지, 개인정보를 남기지 않는지를 단계별로 보완했습니다. 한 번에 같은 일을 반복한 것이 아니라 실제 사용 중 새로 발견된 문제를 다음 패치에서 이어서 고쳤습니다.

- **v2.1.2-v2.1.6:** 답변 길이, 응답 중단 감지, 대화 맥락, 임상적 한계와 자동 검사 기준을 정리했습니다.
- **v2.1.7:** README, 변경 기록, 릴리즈 노트의 형식과 공개 범위를 정리했습니다.
- **v2.1.8:** 다섯 언어의 참조 문서를 다시 확인하고, AI가 검색하는 자료를 모두 새 내용으로 갱신했습니다.
- **v2.1.9:** 짧은 부호와 여러 언어의 질문에서도 알맞은 참조 문서를 더 안정적으로 찾도록 검색 방식을 고쳤습니다.
- **v2.1.10:** 앞선 검색 개선 뒤에 남아 있던 일본어 부호 인식, 넓은 해석 질문, 새 데이터베이스 설치 문제를 수정했습니다.

v2.1.8-v2.1.10에서 이어진 내용은 각 패치노트에 나누어 기록했습니다.

## v2.2.5

v2.2.5는 개별 반응의 운동 결정인 입력과 구조요약의 합계 항목을 다시 분리한 버그 패치입니다. 채점표에서는 능동형·수동형 구분이 빠진 `M`, `FM`, `m`을 더 이상 선택할 수 없으며, `Ma`, `Mp`, `Ma-p`처럼 운동의 방향이 포함된 완성 부호를 사용합니다. 구조요약 결과의 `M`, `FM`, `m` 합계와 EB, MQual, W:M 등의 계산은 그대로 유지됩니다.

올바른 완성 부호를 사용한 기존 프로토콜은 다시 계산할 필요가 없습니다. 과거 자동저장 자료에 능동형·수동형 구분이 없는 값이 남아 있으면 앱이 원본을 임의로 바꾸지 않고 계산을 멈춘 뒤 확인할 행과 부호를 알려줍니다. 다섯 언어 참조 문서, 검색 벡터 5,604개, 검색 질문 365개와 실제 GPT-5.5 경계 질문을 다시 확인했습니다. 자세한 영향 범위와 가상 CDI 경계 예시는 [v2.2.5 패치노트](./v2-nextjs/releases/v2.2.5/)에서 확인할 수 있습니다.

## v2.2.4

v2.2.4는 구조요약 계산식과 채점표 입력 방식을 바꾸지 않고, 사람이 읽는 참조 문서와 선택형 AI가 검색하는 자료를 함께 다시 정리한 버그 패치입니다. 기존 구조요약 결과를 다시 계산할 필요는 없습니다.

다섯 언어의 용어와 문체를 각 언어권의 전문 자료에 대조하고, 화면 제목과 문서 순서를 실제 채점·해석 흐름에 맞췄습니다. 참조 문서 1,015개와 검색 벡터 5,589개를 갱신했으며, 누락·오래된 벡터·본문 해시 불일치는 모두 0개였습니다. 코딩·해석 도우미의 Exner CS 범위, 프롬프트 인젝션 거절, 요청 횟수 제한을 보강하고 실제 GPT-5.5 단일·여러 차례 대화 66회를 다섯 언어에서 확인했습니다. 자세한 내용과 공개 검사 자료는 [v2.2.4 패치노트](./v2-nextjs/releases/v2.2.4/)에서 확인할 수 있습니다.

후속 점검에서는 채점 시작 방식 선택, 참조 문서의 가독성, 코딩 도우미의 스크롤 표시도 함께 다듬었습니다.

## v2.2.3

v2.2.3은 계산식과 화면 배치를 바꾸지 않고 공개 문서, 다섯 언어 검색·링크 미리보기 정보, AI 응답 평가 데이터베이스의 과도한 요청 방어를 정리한 버그 패치입니다. 기존 구조요약 결과를 다시 계산할 필요는 없습니다.

검색·공유용 홈 제목은 `Yes, U Can!`로 통일하고, 회원가입·설치·결제가 필요 없는 오픈소스 Exner Rorschach 종합체계 구조요약 계산기라는 설명과 임상 판단 비대체 원칙을 다섯 언어로 제공했습니다. 좋아요·싫어요 평가는 대화 원문을 저장하지 않는 기존 원칙을 유지하면서 요청 크기와 세션별 횟수를 제한했습니다. 자세한 날짜 표기 정리와 보안 경계는 [v2.2.3 패치노트](./v2-nextjs/releases/v2.2.3/)에서 확인할 수 있습니다.

## v2.2.2

v2.2.2는 Cn이 들어가는 계산과 들어가지 않는 계산을 다시 나누어 확인한 핫픽스입니다. 화면의 관례적 표기 `FC:CF+C`에서 오른쪽 값은 `CF+C+Cn`이지만, 이 앱이 채택한 WSumC, S-CON 7번 기준, Color-Shading 계산에서는 Cn을 제외합니다. **완성된 프로토콜에서 v2.2.1의 Cn 화면값은 이미 올바르게 계산됐으므로, 이 이유만으로 다시 계산할 필요는 없습니다.** 다만 형태질(FQ)을 아직 입력하지 않은 미완성 행이 GHR 또는 PHR로 임시 분류되지 않도록 보완했습니다.

2019 Excel, RorScore 원본 프로그램, v1 GAS, 현재 v2 코드, CHESSSS, RAP3, RIAP5는 각각 확인할 수 있는 범위가 다르므로 어느 하나만 정답으로 삼지 않았습니다. 계산과 기능 검사 376개, AI 답변 기준 검사 101개, 배포용 화면 생성 222개를 통과했고, 5개 언어 Cn 질문 10회와 대표 질문 5회도 실제 GPT-5.5 호출로 확인했습니다. UI 변경은 왼쪽 사이드바를 완전히 불투명하게 만든 것뿐이며 모바일 전용 최적화는 후속 v2.2.x에서 계속합니다.

## v2.2.1

v2.2.1은 UI/UX나 입력 항목을 바꾸지 않고, 앱이 표시하는 **Upper Section, Lower Section, Special Indices**의 계산을 바로잡은 핫픽스입니다. D/AdjD의 극단값, EBPer 표시 조건, GHR/PHR의 판정 순서, WDA%와 Afr의 0분모 처리를 수정했고, 화면의 `FC:CF+C` 오른쪽 값에는 Cn을 포함하도록 고쳤습니다.

초기 v1 개발에 참고한 2019 Excel의 공개 배포 위치와 역할도 처음 밝혔습니다. 같은 계산 입력에 다섯 언어 메모를 바꿔 넣은 검사 25회, 같은 조건에서 반복 가능한 가상 프로토콜 2,000개, 실제 GPT-5.5 해석·코딩 호출을 사용해 수정 결과를 확인했습니다.

## v2.2.0

v2.2.0은 데스크톱 화면의 주요 메뉴를 왼쪽 사이드바로 모으고, 해석 도우미를 일반적인 AI 대화 화면에 가깝게 다시 구성한 첫 v2.2.x 릴리즈입니다. 답변 중지, 메시지 복사와 평가, 대화 영역 안쪽 스크롤, 참조 문서와 버전 기록, 채점표의 확대·축소와 이동도 함께 정리했습니다.

GPT-5.5 도우미는 Exner 종합체계 밖의 질문에 답변 범위를 넓히지 않도록 제한했고, 한국어·일본어·영어 질문으로 실제 API 호출을 확인했습니다. v2.2.0에서 함께 점검한 계산식 가운데 추가 교정이 필요했던 항목은 v2.2.1과 v2.2.2에서 수정했습니다. 따라서 v2.2.0은 UI/UX 변경 기록으로, 현재 계산 기준은 v2.2.2 계산 문서로 확인할 수 있습니다. 모바일 화면은 후속 v2.2.x에서 별도로 다듬습니다.

## [Next.js] 버전 2 릴리즈 기록

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

<details>
<summary><strong>개발자가 v2 소스를 직접 실행하는 방법</strong></summary>

1. [v2-nextjs/source](./v2-nextjs/source/) 폴더를 엽니다.
2. `npm install`로 의존성을 설치합니다.
3. `.env.example`을 참고해 로컬 환경변수 파일을 만듭니다.
4. `npm run build` 또는 `npm run dev`로 앱을 확인합니다.

공개 저장소에는 실제 운영 환경변수, Vercel 설정, 로컬 로그, 캐시, 비공개 작업 노트가 포함되어 있지 않습니다.

</details>

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
- **[2025-10-19] v1.0.2 (핫픽스)** [배포링크](https://script.google.com/macros/s/AKfycbwtBFge9jPS03Mz4QD5IlUDfHOetaVGsIe48y9dZESkfWtsJ-dnYv9S5iZ_4wxx4dCOUw/exec) [패치노트/소스코드](./v1-gas/releases/v1.0.2/)
- **[2025-10-17] v1.0.1 (핫픽스)** [배포링크](https://script.google.com/macros/s/AKfycbwNNeJsgRx0sEnZO4X9XxEUEthQlVS3Ttk6k_OSmIj8aTPlpdBQV1653hmBtzLnVX8Q/exec) [패치노트/소스코드](./v1-gas/releases/v1.0.1/)
- **[2025-10-16] v1.0.0 (메이저 패치)** [배포링크](https://script.google.com/macros/s/AKfycbxYTxqKcmRNJhpE8eCGTBZPyUFVJIRQiUTbyW48lJKg2E7Bgc5RKSitdDTVcE3bzk07JA/exec) [패치노트/소스코드](./v1-gas/releases/v1.0.0/)
