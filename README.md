# Exner Rorschach Structural Summary Calculator

Exner 종합체계 기반 로샤 구조요약 계산기의 공개 소스 및 릴리즈 아카이브입니다. 관련 문서에 근거한 AI 도우미는 선택 기능으로 제공합니다.

이 저장소는 배포된 버전의 패치노트와 소스코드를 공개하기 위한 공간입니다. v1은 Google Apps Script 웹앱으로, v2는 Next.js 웹앱으로 정리했습니다.

감사의 말과 초기 학습 참고 자료는 [ACKNOWLEDGEMENTS.md](./ACKNOWLEDGEMENTS.md)에 정리했습니다.

## 문서 언어 기준

이 공개 전시용 아카이브는 문서 목적에 따라 언어 범위를 나눕니다.

- 공개 릴리즈 노트와 CHANGELOG는 한국어를 canonical 기록으로 둡니다.
- GitHub 방문자가 프로젝트를 빠르게 이해할 수 있도록 [English overview](./README.en.md)를 함께 둡니다.
- 웹앱 안의 사용자 경험은 한국어, 영어, 일본어, 스페인어, 포르투갈어 5개 언어를 지원합니다.
- 릴리즈 노트를 5개 언어로 매번 중복 작성하지는 않습니다. 유지보수 중 drift가 생길 수 있기 때문입니다.
- 명령어, 파일 경로, API 이름, 모델명, 테스트 이름처럼 원문 식별성이 중요한 기술 용어는 영어 표기를 유지합니다.
- `v2-nextjs/source/` 안의 기술 증거 문서는 실제 개발 산출물을 보존하기 위해 원문 형식을 유지할 수 있습니다.
- 공개 릴리즈 문서 기준은 [v2-nextjs/source/docs/ops/PUBLIC_RELEASE_DOCUMENTATION.md](./v2-nextjs/source/docs/ops/PUBLIC_RELEASE_DOCUMENTATION.md)에 명시했습니다.

## 현재 공개된 항목

- [Next.js] 버전 2 최신 릴리즈: [v2-nextjs/releases/v2.2.2](./v2-nextjs/releases/v2.2.2/)
- [Next.js] v2.2.2 계산 정확성 재감사: [v2-nextjs/source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md](./v2-nextjs/source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md)
- [Next.js] v2.2.2 Cn·5개 언어 live eval: [v2-nextjs/source/docs/ai-evals/2026-07-17-v2.2.2-live-eval-report.md](./v2-nextjs/source/docs/ai-evals/2026-07-17-v2.2.2-live-eval-report.md)
- [Next.js] v2.2.0 UI 검증: [v2-nextjs/source/docs/ops/2026-07-14-v2.2.0-workspace-shell-validation.md](./v2-nextjs/source/docs/ops/2026-07-14-v2.2.0-workspace-shell-validation.md)
- [Next.js] v2.2.0 AI 경계 검증: [v2-nextjs/source/docs/ai-evals/2026-07-15-v2.2.0-exner-domain-boundary-report.md](./v2-nextjs/source/docs/ai-evals/2026-07-15-v2.2.0-exner-domain-boundary-report.md)
- [Next.js] v2.1.2 AI 하네스 케이스 스터디: [docs/case-studies/v2.1.2-ai-harness.md](./docs/case-studies/v2.1.2-ai-harness.md)
- [Next.js] AI 품질 게이트 문서: [v2-nextjs/source/docs/ai-evals/README.md](./v2-nextjs/source/docs/ai-evals/README.md)
- [Next.js] AI human rubric: [v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md](./v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md)
- [Next.js] 버전 2 릴리즈 기록: [v2-nextjs/releases](./v2-nextjs/releases/)
- [Next.js] 버전 2 공개 소스코드: [v2-nextjs/source](./v2-nextjs/source/)
- [Google Apps Script] 버전 1 릴리즈 기록: [v1-gas/releases](./v1-gas/releases/)
- 최신 v1 실행본: [v1.4.1 배포링크](https://script.google.com/macros/s/AKfycbxMCx13pkrSzFs8f2qXfmxy2LRhkBpZTItFTIfEOoOi-zwurbysnKGfDIYtAeEdQP99/exec)
- 최신 v1 소스코드: [v1-gas/current](./v1-gas/current/)

## v2.1.x AI 품질 개선 흐름

v2.1.x의 AI 관련 패치는 하나의 “마지막 패치”를 반복한 것이 아니라, 실제 사용과 독립 감사에서 새로 확인된 범위를 순서대로 닫은 과정입니다.

- **v2.1.2-v2.1.6:** OpenAI 전용 하네스, 시스템 프롬프트, 스트리밍 계약, eval, release gate 기반 공사
- **v2.1.7:** 공개 README·CHANGELOG·릴리즈 증거의 문서 거버넌스 확립
- **v2.1.8:** 다섯 언어 코퍼스와 OpenAI 벡터 임베딩의 evidence calibration
- **v2.1.9:** 독립 감사에 따른 hybrid retrieval, 다국어 검색, OpenAI-only 데이터 경계 강화
- **v2.1.10:** v2.1.9 후속 감사에서 재현된 검색·migration 결함 수정

과거 패치노트에서 버전 라인 전체를 “마감”한다고 표현한 부분은 날짜가 명시된 후속 기록으로 범위를 바로잡았습니다. 당시 구현과 검증 결과는 그대로 보존합니다.

## v2.2.0

v2.2.0은 전역 sidebar, cardless 해석 대화, 내부 대화 scroll, 응답 중지, message action, 구조화된 개인정보 최소수집 피드백, 참조 문서·버전 아카이브·채점표 UX를 포함하는 desktop 중심의 첫 v2.2.x 릴리즈입니다.

2019년 공개 배포 Excel 수식, v1 GAS 계보, 현재 TypeScript 구현, 세 출판 자료의 공개 점수열을 교차검산해 일곱 계산 경계 결함을 수정했습니다. GPT-5.5 도우미에는 Exner(CS) domain boundary를 추가하고 한국어·일본어·영어 production-parity 평가를 수행했습니다. 모바일 전용 최적화는 후속 v2.2.x에서 계속합니다.

계산 감사의 일부 판정은 v2.2.1과 v2.2.2에서 단계적으로 정정했습니다. v2.2.0은 UI/UX 변경 기록으로 보존하고, 계산식의 현재 판정은 v2.2.2 재감사 보고서를 기준으로 합니다.

## v2.2.1

v2.2.1은 UI/UX를 변경하거나 연령 입력을 추가하지 않고, 계산기 자체의 정확성을 교정한 핫픽스입니다. 감사 범위는 앱이 표시하는 **Upper Section, Lower Section, Special Indices**로 한정했습니다. D/AdjD 상한, EBPer gate, GHR/PHR 순서, WDA%/Afr 0분모 처리를 바로잡았고, 화면 `FC:CF+C` 값도 Cn을 포함하도록 교정했습니다. 배포 런타임과 공개 v2.2.1 릴리즈 노트는 이 Cn 포함 계산을 처음부터 일관되게 기록했습니다.

2019 Excel이 초기 v1 구현에 사용된 계보와 공개 배포 위치도 처음으로 명시했습니다. 다섯 언어 산술 불변성 25회, seed 고정 합성 프로토콜 2,000개, 실제 GPT-5.5 해석·코딩 호출, 6,632개 OpenAI 벡터 갱신으로 검증했습니다.

## v2.2.2

v2.2.2는 v2.2.1의 Cn 교정을 독립적으로 다시 확인하고 계산 경계를 더 분명하게 고정한 핫픽스입니다. 화면의 관례적 `FC:CF+C`는 `FC:(CF+C+Cn)`으로 계산하지만, 이 앱이 채택한 WSumC·S-CON criterion 7·Color-Shading 계산에서는 Cn을 제외합니다. 배포된 v2.2.1의 화면값과 공개 릴리즈 노트는 이미 올바른 방향이었으므로 결과를 다시 뒤집지 않고, 계산 변수·회귀 테스트·5개 언어 문서·생성 코퍼스·OpenAI 벡터·GPT-5.5 eval 계약을 같은 경계로 고정했습니다.

2019 Excel, RorScore canonical Perl source, v1 GAS, v2 TypeScript, CHESSSS, RAP3, RIAP5의 역할을 분리해 계보를 공개했습니다. 전체 376개 테스트, AI 계약 101개, production build 222/222, vector runtime 6,629/6,629, 독립 감사 후 Cn 네 경계의 5개 언어 직접 검증 10/10, 해석 도우미 guardrail v7 smoke 3/3, 기존 5개 언어 대표 live eval 5/5를 확인했습니다. 승인된 UI 변경은 좌측 패널의 완전 불투명화뿐이며 모바일 전용 최적화는 후속 v2.2.x에서 계속합니다.

## [Next.js] 버전 2 릴리즈 기록

- **[2026-07-17] v2.2.2 (핫픽스)** [패치노트](./v2-nextjs/releases/v2.2.2/) [소스코드](./v2-nextjs/source/)
- **[2026-07-16] v2.2.1 (핫픽스)** [패치노트](./v2-nextjs/releases/v2.2.1/) [소스코드](./v2-nextjs/source/)
- **[2026-07-16] v2.2.0 (마이너 패치)** [패치노트](./v2-nextjs/releases/v2.2.0/) [소스코드](./v2-nextjs/source/)
- **[2026-07-13] v2.1.10 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.10/) [소스코드](./v2-nextjs/source/)
- **[2026-07-13] v2.1.9 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.9/) [소스코드](./v2-nextjs/source/)
- **[2026-07-12] v2.1.8 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.8/) [소스코드](./v2-nextjs/source/)
- **[2026-07-04] v2.1.7 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.7/) [소스코드](./v2-nextjs/source/)
- **[2026-07-04] v2.1.6 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.6/) [소스코드](./v2-nextjs/source/)
- **[2026-07-03] v2.1.5 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.5/) [소스코드](./v2-nextjs/source/)
- **[2026-07-03] v2.1.4 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.4/) [소스코드](./v2-nextjs/source/)
- **[2026-06-29] v2.1.3 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.3/) [소스코드](./v2-nextjs/source/)
- **[2026-06-28] v2.1.2 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.2/) [소스코드](./v2-nextjs/source/)
- **[2026-06-28] v2.1.1 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.1.1/) [소스코드](./v2-nextjs/source/)
- **[2026-06-22] v2.1.0 (마이너 패치)** [패치노트](./v2-nextjs/releases/v2.1.0/) [소스코드](./v2-nextjs/source/)
- **[2026-06-11] v2.0.3 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.0.3/) [소스코드](./v2-nextjs/source/)
- **[2026-05-21] v2.0.2 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.0.2/) [소스코드](./v2-nextjs/source/)
- **[2026-04-27] v2.0.1 (버그 패치)** [패치노트](./v2-nextjs/releases/v2.0.1/) [소스코드](./v2-nextjs/source/)
- **[2026-02-15] v2.0.0 (메이저 패치)** [패치노트](./v2-nextjs/releases/v2.0.0/) [소스코드](./v2-nextjs/source/)

## v2 Next.js 사용 방법

1. [v2-nextjs/source](./v2-nextjs/source/) 폴더를 엽니다.
2. `npm install`로 의존성을 설치합니다.
3. `.env.example`을 참고해 로컬 환경변수 파일을 만듭니다.
4. `npm run build` 또는 `npm run dev`로 앱을 확인합니다.

공개 저장소에는 실제 운영 환경변수, Vercel 설정, 로컬 로그, 캐시, 비공개 작업 노트가 포함되어 있지 않습니다.

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
- **[2025-11-26] v1.3.1 (버그 패치)** [배포링크](https://script.google.com/macros/s/AKfycbwOQ61Y34-iVRKB0T3isOVRzFP9xhxtQMrLZoRvVbS6PwSfEaFYzWvjuTF8IItY2p-T/exec) [패치노트/소스코드](./v1-gas/releases/v1.3.1/) [사용법 영상](https://youtu.be/GH145Wwh-YA?si=eDeXBKX1fufPxcJY)
- **[2025-11-25] v1.3.0 (마이너 패치)** [배포링크](https://script.google.com/macros/s/AKfycbyethWbTOltcalcWo-kyXtunNSoJNMyKdKs_y7AYfV6bPE2R09ONcaCtDHSTvXTukE/exec) [패치노트/소스코드](./v1-gas/releases/v1.3.0/)
- **[2025-11-21] v1.2.1 (버그 패치)** [배포링크](https://script.google.com/macros/s/AKfycbw6n2R3LgAncLvoXmin89SodbHB6brREdaxFfK2yHADdZelEskafqLH35xL0LFvSqMv/exec) [패치노트/소스코드](./v1-gas/releases/v1.2.1/)
- **[2025-11-20] v1.2.0 (마이너 패치)** [배포링크](https://script.google.com/macros/s/AKfycbwD7zBLaAzC5r4VjH1yt7gxfG98vvBp4gsaC3VFQW0bCwe6MNfVXmR8LIjUEpIkTZTE/exec) [패치노트/소스코드](./v1-gas/releases/v1.2.0/)
- **[2025-10-25] v1.1.2 (버그 패치)** [배포링크](https://script.google.com/macros/s/AKfycbxn8zeFQalOvh-jnZ_-REjafG2kCT1RkjyJvUahtCkXVyn6PJs9xJLZ0basm5kKEO4j2A/exec) [패치노트/소스코드](./v1-gas/releases/v1.1.2/)
- **[2025-10-24] v1.1.1 (버그 패치)** [배포링크](https://script.google.com/macros/s/AKfycbw6XZZ7D3qiCeSsJPG6aj3DzMMPdA2p0kWhT8WU21WGVFqUltOmAXs3zOx4kXw2u5ul6Q/exec) [패치노트/소스코드](./v1-gas/releases/v1.1.1/)
- **[2025-10-23] v1.1.0 (마이너 패치)** [배포링크](https://script.google.com/macros/s/AKfycbw2J6gd4Sf_Tjx6s9GdQrWu4b_tOtqwFLtKJCs-vSFRR0c4NZ0Mlb5UFm7-V9zkBPzitg/exec) [패치노트/소스코드](./v1-gas/releases/v1.1.0/)
- **[2025-10-20] v1.0.4 (핫픽스)** [배포링크](https://script.google.com/macros/s/AKfycbw1GLfIvehoz4wAzC4LicjD_oB0Dpy_sLJ30da9qobx5X4wa3nJr0pLewV0lVPPv1ptGw/exec) [패치노트/소스코드](./v1-gas/releases/v1.0.4/)
- **[2025-10-19] v1.0.3 (버그 패치)** [배포링크](https://script.google.com/macros/s/AKfycbzoiaofs_I5Ue4p7Eo5XQp0OmUtmbbqkpJuwD-FQ1R4PLscULJB_AHVBb-VylICEKJB1A/exec) [패치노트/소스코드](./v1-gas/releases/v1.0.3/)
- **[2025-10-19] v1.0.2 (핫픽스)** [배포링크](https://script.google.com/macros/s/AKfycbwtBFge9jPS03Mz4QD5IlUDfHOetaVGsIe48y9dZESkfWtsJ-dnYv9S5iZ_4wxx4dCOUw/exec) [패치노트/소스코드](./v1-gas/releases/v1.0.2/)
- **[2025-10-18] v1.0.1 (핫픽스)** [배포링크](https://script.google.com/macros/s/AKfycbwNNeJsgRx0sEnZO4X9XxEUEthQlVS3Ttk6k_OSmIj8aTPlpdBQV1653hmBtzLnVX8Q/exec) [패치노트/소스코드](./v1-gas/releases/v1.0.1/)
- **[2025-10-16] v1.0.0 (메이저 패치)** [배포링크](https://script.google.com/macros/s/AKfycbxYTxqKcmRNJhpE8eCGTBZPyUFVJIRQiUTbyW48lJKg2E7Bgc5RKSitdDTVcE3bzk07JA/exec) [패치노트/소스코드](./v1-gas/releases/v1.0.0/)
