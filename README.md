# exner-sicp

로샤 구조요약 계산 도우미의 공개 전시 및 릴리즈 아카이브입니다.

이 저장소는 배포된 버전의 패치노트와 소스코드를 공개하기 위한 공간입니다. v1은 Google Apps Script 웹앱으로, v2는 Next.js 웹앱으로 정리했습니다.

감사의 말과 초기 학습 참고 자료는 [ACKNOWLEDGEMENTS.md](./ACKNOWLEDGEMENTS.md)에 정리했습니다.

## 현재 공개된 항목

- [Next.js] 버전 2 최신 릴리즈: [v2-nextjs/releases/v2.1.2](./v2-nextjs/releases/v2.1.2/)
- [Next.js] v2.1.2 AI 하네스 케이스 스터디: [docs/case-studies/v2.1.2-ai-harness.md](./docs/case-studies/v2.1.2-ai-harness.md)
- [Next.js] AI 품질 게이트 문서: [v2-nextjs/source/docs/ai-evals/README.md](./v2-nextjs/source/docs/ai-evals/README.md)
- [Next.js] AI human rubric: [v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md](./v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md)
- [Next.js] 버전 2 릴리즈 기록: [v2-nextjs/releases](./v2-nextjs/releases/)
- [Next.js] 버전 2 공개 소스코드: [v2-nextjs/source](./v2-nextjs/source/)
- [Google Apps Script] 버전 1 릴리즈 기록: [v1-gas/releases](./v1-gas/releases/)
- 최신 v1 실행본: [v1.4.1 배포링크](https://script.google.com/macros/s/AKfycbxMCx13pkrSzFs8f2qXfmxy2LRhkBpZTItFTIfEOoOi-zwurbysnKGfDIYtAeEdQP99/exec)
- 최신 v1 소스코드: [v1-gas/current](./v1-gas/current/)

## [Next.js] 버전 2 릴리즈 기록

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
