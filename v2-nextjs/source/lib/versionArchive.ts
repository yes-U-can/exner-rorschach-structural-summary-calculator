export type ReleaseKind = 'major' | 'minor' | 'bugfix' | 'hotfix' | 'unknown';

export type VersionArchiveEntry = {
  version: string;
  title: string;
  series: 'v2-nextjs' | 'v1-gas';
  publishedAt: string | null;
  releaseKind: ReleaseKind;
  releaseLabel: string;
  summary: string;
  gasUrl?: string | null;
  sourceUrl?: string | null;
  releaseUrl?: string | null;
  videoUrl?: string | null;
};

const exhibitionRepoUrl = 'https://github.com/yes-U-can/exner-sicp';
const v1ArchiveUrl = (version: string) => `${exhibitionRepoUrl}/tree/main/v1-gas/releases/${version}`;
const v2ReleaseUrl = (version: string) => `${exhibitionRepoUrl}/tree/main/v2-nextjs/releases/${version}`;
const v2SourceUrl = `${exhibitionRepoUrl}/tree/main/v2-nextjs/source`;

export const v2NextVersions: VersionArchiveEntry[] = [
  {
    version: 'v2.1.2',
    title: 'Version 2.1.2',
    series: 'v2-nextjs',
    publishedAt: '2026-06-28',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      'AI 응답 품질을 안정화하기 위해 OpenAI 전용 하네스, 코딩/해석 도우미별 시스템 프롬프트, HITL 경계, 응답 끊김 감지, retrieval 계약 테스트, live eval 배치와 공개용 평가 리포트를 추가한 패치입니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.1.2'),
  },
  {
    version: 'v2.1.1',
    title: 'Version 2.1.1',
    series: 'v2-nextjs',
    publishedAt: '2026-06-28',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '반응 메모 팝업이 텍스트 드래그 중 닫히던 UX 문제와 코딩 도우미 대화가 행 전환 때 초기화되던 문제를 수정하고, AI 세션을 OpenAI 전용 BYOK 흐름으로 정리한 안정화 버전입니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.1.1'),
  },
  {
    version: 'v2.1.0',
    title: 'Version 2.1.0',
    series: 'v2-nextjs',
    publishedAt: '2026-06-22',
    releaseKind: 'minor',
    releaseLabel: '마이너 패치',
    summary:
      '웹앱을 설치형 앱처럼 열 수 있도록 manifest-only PWA 지원을 추가하고, 보안 범위를 유지하기 위해 service worker와 오프라인 캐시는 도입하지 않았습니다. 초기 구현 학습 참고 자료였던 RorScore에 대한 감사 기록도 함께 정리한 버전입니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.1.0'),
  },
  {
    version: 'v2.0.3',
    title: 'Version 2.0.3',
    series: 'v2-nextjs',
    publishedAt: '2026-06-11',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '참조 문서 페이지가 참조 코퍼스 데이터 전체를 브라우저에 내려보내던 문제를 수정해 로딩 성능을 크게 개선하고, BYOK 세션 쿠키 처리 보강과 Next.js 16.2.9 보안 패치 적용을 함께 반영한 버전입니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.0.3'),
  },
  {
    version: 'v2.0.2',
    title: 'Version 2.0.2',
    series: 'v2-nextjs',
    publishedAt: '2026-05-21',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary: '구조요약 값 복사와 구조요약 CSV 내보내기의 중복 헤더 및 누락 항목 문제를 수정하고, 데이터 다운로드 항목명, 해석 도우미 입력 완료 표시, BYOK 채팅 오류 처리, OpenAI 기본 모델 GPT-5.5 전환을 함께 반영한 버전입니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.0.2'),
  },
  {
    version: 'v2.0.1',
    title: 'Version 2.0.1',
    series: 'v2-nextjs',
    publishedAt: '2026-04-27',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary: 'v2.0.0 공개 이후 AI 도우미, BYOK 세션, 다크모드, 참조 문서 라우팅, 문서 정리를 안정화한 버전입니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.0.1'),
  },
  {
    version: 'v2.0.0',
    title: 'Version 2.0.0',
    series: 'v2-nextjs',
    publishedAt: '2026-02-15',
    releaseKind: 'major',
    releaseLabel: '메이저 패치',
    summary: 'Next.js 기반 웹앱으로 재구성하고, BYOK AI 보조 기능과 참조 문서 검색을 추가한 버전입니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.0.0'),
  },
];

export const currentVersion = v2NextVersions[0];

export const v1GasVersions: VersionArchiveEntry[] = [
  {
    version: 'v1.0.0',
    title: 'v1.0.0',
    series: 'v1-gas',
    publishedAt: '2025-10-16',
    releaseKind: 'major',
    releaseLabel: '메이저 패치',
    summary: 'Google Apps Script로 만든 첫 공개 실행본입니다.',
    gasUrl: 'https://script.google.com/macros/s/AKfycbxYTxqKcmRNJhpE8eCGTBZPyUFVJIRQiUTbyW48lJKg2E7Bgc5RKSitdDTVcE3bzk07JA/exec',
    sourceUrl: v1ArchiveUrl('v1.0.0'),
  },
  {
    version: 'v1.0.1',
    title: 'v1.0.1',
    series: 'v1-gas',
    publishedAt: '2025-10-18',
    releaseKind: 'hotfix',
    releaseLabel: '핫픽스',
    summary: 'HVI/OBS 판단 지원과 계산 과정에서 확인된 오류를 빠르게 수정한 버전입니다.',
    gasUrl: 'https://script.google.com/macros/s/AKfycbwNNeJsgRx0sEnZO4X9XxEUEthQlVS3Ttk6k_OSmIj8aTPlpdBQV1653hmBtzLnVX8Q/exec',
    sourceUrl: v1ArchiveUrl('v1.0.1'),
  },
  {
    version: 'v1.0.2',
    title: 'v1.0.2',
    series: 'v1-gas',
    publishedAt: '2025-10-19',
    releaseKind: 'hotfix',
    releaseLabel: '핫픽스',
    summary: 'MQual/Form Quality 관련 로직 문제를 수정한 버전입니다.',
    gasUrl: 'https://script.google.com/macros/s/AKfycbwtBFge9jPS03Mz4QD5IlUDfHOetaVGsIe48y9dZESkfWtsJ-dnYv9S5iZ_4wxx4dCOUw/exec',
    sourceUrl: v1ArchiveUrl('v1.0.2'),
  },
  {
    version: 'v1.0.3',
    title: 'v1.0.3',
    series: 'v1-gas',
    publishedAt: '2025-10-19',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary: 'SCORING_CONFIG 리팩터링과 M- 관련 계산 오류 수정을 반영한 버전입니다.',
    gasUrl: 'https://script.google.com/macros/s/AKfycbzoiaofs_I5Ue4p7Eo5XQp0OmUtmbbqkpJuwD-FQ1R4PLscULJB_AHVBb-VylICEKJB1A/exec',
    sourceUrl: v1ArchiveUrl('v1.0.3'),
  },
  {
    version: 'v1.0.4',
    title: 'v1.0.4',
    series: 'v1-gas',
    publishedAt: '2025-10-20',
    releaseKind: 'hotfix',
    releaseLabel: '핫픽스',
    summary: 'EBPer와 Lv2 특수점수 계산 로직을 바로잡은 버전입니다.',
    gasUrl: 'https://script.google.com/macros/s/AKfycbw1GLfIvehoz4wAzC4LicjD_oB0Dpy_sLJ30da9qobx5X4wa3nJr0pLewV0lVPPv1ptGw/exec',
    sourceUrl: v1ArchiveUrl('v1.0.4'),
  },
  {
    version: 'v1.1.0',
    title: 'v1.1.0',
    series: 'v1-gas',
    publishedAt: '2025-10-23',
    releaseKind: 'minor',
    releaseLabel: '마이너 패치',
    summary: '안내 문구, 결과 화면, 인쇄 설정을 정비하고 행 추가/삭제 기능을 도입한 버전입니다.',
    gasUrl: 'https://script.google.com/macros/s/AKfycbw2J6gd4Sf_Tjx6s9GdQrWu4b_tOtqwFLtKJCs-vSFRR0c4NZ0Mlb5UFm7-V9zkBPzitg/exec',
    sourceUrl: v1ArchiveUrl('v1.1.0'),
  },
  {
    version: 'v1.1.1',
    title: 'v1.1.1',
    series: 'v1-gas',
    publishedAt: '2025-10-24',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary: 'v1.1.0 이후 확인된 버그 수정, 샘플 Response 추가, CSV 내보내기 일부를 반영한 버전입니다.',
    gasUrl: 'https://script.google.com/macros/s/AKfycbw6XZZ7D3qiCeSsJPG6aj3DzMMPdA2p0kWhT8WU21WGVFqUltOmAXs3zOx4kXw2u5ul6Q/exec',
    sourceUrl: v1ArchiveUrl('v1.1.1'),
  },
  {
    version: 'v1.1.2',
    title: 'v1.1.2',
    series: 'v1-gas',
    publishedAt: '2025-10-25',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary: 'index.html에서 styles.html을 분리하고 개인정보처리방침 안내를 독립 영역에 추가한 버전입니다.',
    gasUrl: 'https://script.google.com/macros/s/AKfycbxn8zeFQalOvh-jnZ_-REjafG2kCT1RkjyJvUahtCkXVyn6PJs9xJLZ0basm5kKEO4j2A/exec',
    sourceUrl: v1ArchiveUrl('v1.1.2'),
  },
  {
    version: 'v1.2.0',
    title: 'v1.2.0',
    series: 'v1-gas',
    publishedAt: '2025-11-20',
    releaseKind: 'minor',
    releaseLabel: '마이너 패치',
    summary: '프로그램 사용 안내와 결과지 인쇄 화면을 개선하고 UI를 크게 정리한 버전입니다.',
    gasUrl: 'https://script.google.com/macros/s/AKfycbwD7zBLaAzC5r4VjH1yt7gxfG98vvBp4gsaC3VFQW0bCwe6MNfVXmR8LIjUEpIkTZTE/exec',
    sourceUrl: v1ArchiveUrl('v1.2.0'),
  },
  {
    version: 'v1.2.1',
    title: 'v1.2.1',
    series: 'v1-gas',
    publishedAt: '2025-11-21',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary: '리바인딩, 변수명 개선, 코드 포맷팅, 중복 함수 제거, CSS 변수 도입 등 유지보수성을 개선한 버전입니다.',
    gasUrl: 'https://script.google.com/macros/s/AKfycbw6n2R3LgAncLvoXmin89SodbHB6brREdaxFfK2yHADdZelEskafqLH35xL0LFvSqMv/exec',
    sourceUrl: v1ArchiveUrl('v1.2.1'),
  },
  {
    version: 'v1.3.0',
    title: 'v1.3.0',
    series: 'v1-gas',
    publishedAt: '2025-11-25',
    releaseKind: 'minor',
    releaseLabel: '마이너 패치',
    summary: 'UI를 전면 개선하고 동적 입력 필드, 실시간 경고, 자동 제어, 데이터 무결성 관리, 다중 상태 로딩 개선을 반영한 버전입니다.',
    gasUrl: 'https://script.google.com/macros/s/AKfycbyethWbTOltcalcWo-kyXtunNSoJNMyKdKs_y7AYfV6bPE2R09ONcaCtDHSTvXTukE/exec',
    sourceUrl: v1ArchiveUrl('v1.3.0'),
  },
  {
    version: 'v1.3.1',
    title: 'v1.3.1',
    series: 'v1-gas',
    publishedAt: '2025-11-26',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary: '인쇄 화면, 자동저장 작업 불러오기, 행 삭제 관련 버그를 수정하고 사용법 영상을 추가한 버전입니다.',
    gasUrl: 'https://script.google.com/macros/s/AKfycbwOQ61Y34-iVRKB0T3isOVRzFP9xhxtQMrLZoRvVbS6PwSfEaFYzWvjuTF8IItY2p-T/exec',
    sourceUrl: v1ArchiveUrl('v1.3.1'),
    videoUrl: 'https://youtu.be/GH145Wwh-YA?si=eDeXBKX1fufPxcJY',
  },
  {
    version: 'v1.3.2',
    title: 'v1.3.2',
    series: 'v1-gas',
    publishedAt: '2025-11-27',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary: '요약보기 표의 DQ, FQ 컬럼 색상 버그를 수정하고 항목 설명 문구를 더 전문적인 용어로 개편한 버전입니다.',
    gasUrl: 'https://script.google.com/macros/s/AKfycbxbuGLdEaj0mW6eIB5QHTax86b9FcKrsfLogy0wDLauJPwbbkQC5BHey0j_ERqXtVqE/exec',
    sourceUrl: v1ArchiveUrl('v1.3.2'),
  },
  {
    version: 'v1.3.3',
    title: 'v1.3.3',
    series: 'v1-gas',
    publishedAt: '2025-12-24',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary: '바닥글 권리 정보를 2026년 기준으로 수정하고 연결 실패 Google Analytics 기능을 제거한 버전입니다.',
    gasUrl: 'https://script.google.com/macros/s/AKfycbyMG31uNG0mPIdyrzQ_86CSuSaACpFoOqy-kZGXk0uV7L92jBFAJijt1kV6nLMzcO2N/exec',
    sourceUrl: v1ArchiveUrl('v1.3.3'),
  },
  {
    version: 'v1.4.0',
    title: 'v1.4.0',
    series: 'v1-gas',
    publishedAt: '2026-01-03',
    releaseKind: 'minor',
    releaseLabel: '마이너 패치',
    summary: '한국어, 영어, 일본어, 스페인어, 포르투갈어 5개 언어 지원을 추가하고 UI 텍스트와 요약보기 항목 설명을 다국어로 번역한 버전입니다.',
    gasUrl: 'https://script.google.com/macros/s/AKfycbxWtI1q27rXuH4feBEGpoy0fIhXZU0ROJ2gRv5RbaQVPxnNgznTI9czHDrVzaS7wSMM/exec',
    sourceUrl: v1ArchiveUrl('v1.4.0'),
  },
  {
    version: 'v1.4.1',
    title: 'v1.4.1',
    series: 'v1-gas',
    publishedAt: '2026-01-07',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary: 'v1.4.0 이후 초기/재방문 모달 버튼과 스크롤 문제를 수정한 v1 GAS 최종 실행본입니다.',
    gasUrl: 'https://script.google.com/macros/s/AKfycbxMCx13pkrSzFs8f2qXfmxy2LRhkBpZTItFTIfEOoOi-zwurbysnKGfDIYtAeEdQP99/exec',
    sourceUrl: v1ArchiveUrl('v1.4.1'),
  },
];

export const versionArchiveEntries = [...v2NextVersions, ...v1GasVersions] as const;
