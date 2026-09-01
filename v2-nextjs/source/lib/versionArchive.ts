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

export function sortVersionArchiveEntries(
  entries: VersionArchiveEntry[],
  sortOrder: 'desc' | 'asc',
) {
  return [...entries].sort((a, b) => {
    const leftDate = a.publishedAt ?? '';
    const rightDate = b.publishedAt ?? '';
    const dateComparison = leftDate.localeCompare(rightDate);

    if (dateComparison !== 0) {
      return sortOrder === 'asc' ? dateComparison : -dateComparison;
    }

    const versionComparison = a.version.localeCompare(b.version, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
    return sortOrder === 'asc' ? versionComparison : -versionComparison;
  });
}

const exhibitionRepoUrl = 'https://github.com/yes-U-can/exner-rorschach-structural-summary-calculator';
const v1ArchiveUrl = (version: string) => `${exhibitionRepoUrl}/tree/main/v1-gas/releases/${version}`;
const v2ReleaseUrl = (version: string) => `${exhibitionRepoUrl}/tree/main/v2-nextjs/releases/${version}`;
const v2SourceUrl = `${exhibitionRepoUrl}/tree/main/v2-nextjs/source`;

export const v2NextVersions: VersionArchiveEntry[] = [
  {
    version: 'v2.2.12',
    title: 'Version 2.2.12',
    series: 'v2-nextjs',
    publishedAt: '2026-09-01',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '쿠키 없는 익명·집계 방문 통계를 위해 Vercel Web Analytics를 사용하기 시작했습니다. 새로고침할 때 채점표가 순간적으로 움직이던 현상을 고치고, 시작 선택창에는 서울임상심리연구소 CI와 홈페이지 연결을 추가했습니다. 계산식과 산출값은 바뀌지 않아 기존 결과를 다시 계산할 필요가 없습니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.2.12'),
  },
  {
    version: 'v2.2.11',
    title: 'Version 2.2.11',
    series: 'v2-nextjs',
    publishedAt: '2026-08-21',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '카드 I–X가 모두 입력된 10–13개 반응 기록은 기존 타당도 주의를 표시한 뒤 계산할 수 있으며, 한 카드라도 빠진 기록은 계산을 멈춥니다. 스페인어와 포르투갈어의 구조요약 명칭을 공식 표기로 통일하고, Yes, U Can! 이름을 유지하면서 무료 이용 정보를 검색 설명에 더 분명히 표시했습니다. 기존 계산 결과는 다시 계산할 필요가 없습니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.2.11'),
  },
  {
    version: 'v2.2.10',
    title: 'Version 2.2.10',
    series: 'v2-nextjs',
    publishedAt: '2026-08-08',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      'Lower Section 화면과 PDF에 빠져 있던 GHR:PHR 비율을 원전의 구조요약 배치에 맞춰 복원하고, PDF의 일반 Lower Section 표와 Special Indices 판정 표시를 정리했습니다. 다섯 언어 Interpersonal 참조 문서에도 GHR:PHR 설명을 추가하고, 다른 로샤 체계의 규칙이 Exner 계산에 섞이지 않도록 했습니다. 계산식은 변경하지 않았습니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.2.10'),
  },
  {
    version: 'v2.2.9',
    title: 'Version 2.2.9',
    series: 'v2-nextjs',
    publishedAt: '2026-08-01',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '[Card] 정렬 버튼을 오름차순과 내림차순으로 전환할 수 있게 고치고, 해석 도우미로 들어가며 AI 세션을 시작했을 때 목적 화면으로 바로 이동하게 했습니다. 대화 중에는 응답 상태에 따라 최신 메시지 이동 버튼이 점 세 개 또는 아래 화살표로 바뀝니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.2.9'),
  },
  {
    version: 'v2.2.8',
    title: 'Version 2.2.8',
    series: 'v2-nextjs',
    publishedAt: '2026-07-31',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '구조요약 계산식은 유지하면서, 한 반응 안의 중복 내용 부호와 잘못된 Z 점수를 계산 전에 차단하고 Level 1·Level 2 충돌을 데스크톱과 모바일에서 같은 방식으로 처리합니다. 자동저장 자료를 보호하고, AI 요청이 지나치게 반복되면 기다리도록 안내합니다. 이어지는 대화에서 비공개 정보 공개 요청에는 응답하지 않고, 위기 관련 표현에는 긴급 도움 안내를 제공합니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.2.8'),
  },
  {
    version: 'v2.2.7',
    title: 'Version 2.2.7',
    series: 'v2-nextjs',
    publishedAt: '2026-07-23',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '채점 입력에서 단독 S 위치, 같은 결정인과 같은 운동 계열 부호의 중복 입력, 비어 있는 형태질이 계산으로 이어지지 않도록 다섯 언어 안내와 함께 차단했습니다. 모든 반응이 순수 F인 기록의 Lambda는 무한대 기호 대신 순수 F 개수로 보고합니다. 유효한 기존 프로토콜의 계산 결과는 변하지 않습니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.2.7'),
  },
  {
    version: 'v2.2.6',
    title: 'Version 2.2.6',
    series: 'v2-nextjs',
    publishedAt: '2026-07-20',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '다섯 언어 페이지가 검색 결과와 공유 링크에서 해당 언어의 제목과 설명을 올바르게 표시하도록 수정하고, Alt+마우스 휠 조작이 일부 Windows 브라우저에서 화면 이동으로 처리되던 문제를 고쳤습니다. 구조요약 계산식, 입력값과 개인정보 처리 방식은 변경하지 않았습니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.2.6'),
  },
  {
    version: 'v2.2.5',
    title: 'Version 2.2.5',
    series: 'v2-nextjs',
    publishedAt: '2026-07-19',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '개별 반응에 필요한 능동형·수동형 구분 없이 M, FM, m을 입력할 수 있었던 문제를 수정하고, 과거 자동저장 자료의 무효 부호를 원본 보존 방식으로 차단했습니다. 구조요약의 M, FM, m 합계와 관련 계산은 그대로 유지합니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.2.5'),
  },
  {
    version: 'v2.2.4',
    title: 'Version 2.2.4',
    series: 'v2-nextjs',
    publishedAt: '2026-07-18',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '다섯 언어 참조 문서는 각 언어권의 전문 용례와 채점·해석 흐름을 따릅니다. AI 도우미는 관련 문서를 우선 찾고 Exner CS 범위 밖의 질문이나 비공개 정보를 요구하는 요청에는 답하지 않으며, 요청이 지나치게 반복되면 기다리도록 안내합니다. 계산식과 채점 화면 배치는 변경하지 않았습니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.2.4'),
  },
  {
    version: 'v2.2.3',
    title: 'Version 2.2.3',
    series: 'v2-nextjs',
    publishedAt: '2026-07-17',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '다섯 언어의 검색·링크 미리보기 정보를 화면 언어에 맞추고, 선택형 AI 응답 평가가 짧은 시간에 과도하게 반복되지 않도록 보호한 패치입니다. 계산식과 화면 배치는 변경하지 않았습니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.2.3'),
  },
  {
    version: 'v2.2.2',
    title: 'Version 2.2.2',
    series: 'v2-nextjs',
    publishedAt: '2026-07-16',
    releaseKind: 'hotfix',
    releaseLabel: '핫픽스',
    summary:
      '화면의 FC:CF+C 오른쪽 값에는 Cn을 포함하고 WSumC, S-CON 7번 기준, Color-Shading 계산에서는 Cn을 제외하도록 경계를 분리했습니다. 형태질이 비어 있는 미완성 행의 GHR/PHR 임시 분류도 막았습니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.2.2'),
  },
  {
    version: 'v2.2.1',
    title: 'Version 2.2.1',
    series: 'v2-nextjs',
    publishedAt: '2026-07-15',
    releaseKind: 'hotfix',
    releaseLabel: '핫픽스',
    summary:
      'D/AdjD의 극단값, EBPer 표시 조건, GHR/PHR 판정 순서, WDA%와 Afr의 0분모 처리, FC:CF+C 오른쪽 값의 Cn 포함을 바로잡았습니다. 나이를 입력받지 않으며 연령에 따른 해석을 자동화하지 않습니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.2.1'),
  },
  {
    version: 'v2.2.0',
    title: 'Version 2.2.0',
    series: 'v2-nextjs',
    publishedAt: '2026-07-14',
    releaseKind: 'minor',
    releaseLabel: '마이너 패치',
    summary:
      '데스크톱 주요 메뉴를 왼쪽 사이드바로 모으고 해석 도우미를 일반적인 AI 대화 화면에 가깝게 구성했습니다. 답변 중지, 메시지 복사와 평가, 대화 스크롤, 참조 문서와 버전 기록 이용 방식도 개선하고, AI 답변은 Exner 종합체계 범위 안으로 제한했습니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.2.0'),
  },
  {
    version: 'v2.1.10',
    title: 'Version 2.1.10',
    series: 'v2-nextjs',
    publishedAt: '2026-07-13',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '일본어 문장에 붙은 로샤 부호를 보존하고, 넓은 해석 질문에는 해석 문서만 제시하며, 같은 참조 문서가 중복으로 나타나지 않도록 했습니다. 처음 사용할 때부터 참조 문서를 정상적으로 검색할 수 있습니다. 앱 화면과 계산식은 변경하지 않았습니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.1.10'),
  },
  {
    version: 'v2.1.9',
    title: 'Version 2.1.9',
    series: 'v2-nextjs',
    publishedAt: '2026-07-12',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '코딩 도우미와 해석 도우미가 다섯 언어 질문의 핵심 용어와 관련 참조 문서를 더 안정적으로 찾도록 개선했습니다. 앱 화면과 계산식은 변경하지 않았습니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.1.9'),
  },
  {
    version: 'v2.1.8',
    title: 'Version 2.1.8',
    series: 'v2-nextjs',
    publishedAt: '2026-07-11',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      'AI 도우미가 다섯 언어의 참조 문서에서 질문과 가까운 근거를 먼저 찾도록 개선했습니다. 앱 화면과 구조요약 계산식은 변경하지 않았습니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.1.8'),
  },
  {
    version: 'v2.1.7',
    title: 'Version 2.1.7',
    series: 'v2-nextjs',
    publishedAt: '2026-07-05',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '사용자 기능, 앱 화면, 구조요약 계산식과 AI 답변 방식은 변경되지 않았습니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.1.7'),
  },
  {
    version: 'v2.1.6',
    title: 'Version 2.1.6',
    series: 'v2-nextjs',
    publishedAt: '2026-07-04',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '포르투갈어 질문에서 코딩, 해석, 관련 문서 찾기와 짧은 부호 질문을 더 정확히 구분하고, 당시 알려진 웹앱 보안 문제를 해결했습니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.1.6'),
  },
  {
    version: 'v2.1.5',
    title: 'Version 2.1.5',
    series: 'v2-nextjs',
    publishedAt: '2026-07-03',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '앱 화면과 구조요약 계산식은 변경되지 않았습니다. 코딩·해석 도우미는 임상가의 최종 판단을 대신하지 않습니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.1.5'),
  },
  {
    version: 'v2.1.4',
    title: 'Version 2.1.4',
    series: 'v2-nextjs',
    publishedAt: '2026-07-02',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '앱 화면과 구조요약 계산식은 변경되지 않았습니다. 이어지는 대화에서도 AI 도우미는 임상가의 최종 판단을 대신하지 않습니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.1.4'),
  },
  {
    version: 'v2.1.3',
    title: 'Version 2.1.3',
    series: 'v2-nextjs',
    publishedAt: '2026-06-29',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '앱 화면, 구조요약 계산과 AI 답변 방식은 변경되지 않았습니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.1.3'),
  },
  {
    version: 'v2.1.2',
    title: 'Version 2.1.2',
    series: 'v2-nextjs',
    publishedAt: '2026-06-28',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '코딩 도우미는 후보 부호와 임상가가 확인할 범위를 설명하고, 해석 도우미는 단일 지표만으로 진단·치료·법적 판단을 확정하지 않습니다.',
    sourceUrl: v2SourceUrl,
    releaseUrl: v2ReleaseUrl('v2.1.2'),
  },
  {
    version: 'v2.1.1',
    title: 'Version 2.1.1',
    series: 'v2-nextjs',
    publishedAt: '2026-06-27',
    releaseKind: 'bugfix',
    releaseLabel: '버그 패치',
    summary:
      '반응 메모 팝업이 텍스트 드래그 중 닫히던 문제와 코딩 도우미 대화가 행 전환 때 초기화되던 문제를 수정하고, 사용자가 제공한 OpenAI API 키로 AI 도우미에 연결하도록 했습니다.',
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
      '지원 브라우저에서 웹앱을 설치형 앱처럼 열 수 있습니다. 민감한 평가 자료나 AI 응답을 기기에 별도로 저장하는 오프라인 기능은 추가하지 않았습니다.',
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
      '참조 문서 화면이 더 빠르게 열리도록 개선하고, 잘못되거나 만료된 AI 연결 정보는 안전하게 처리하며, 당시 알려진 웹앱 보안 문제를 해결했습니다.',
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
    summary: '구조요약 값 복사와 CSV 내보내기의 중복 헤더 및 누락 항목 문제를 수정하고, 데이터 다운로드 항목명, 해석 도우미 입력 완료 표시, 사용자 API 키 연결 오류 처리와 OpenAI 기본 모델 변경을 반영했습니다.',
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
    summary: '결과 화면에서 복사한 구조요약 값을 해석 도우미에 붙여넣을 수 있게 하고, AI 자동 채우기를 제거했으며, 다크모드 안내와 참조 문서 링크를 바로잡았습니다.',
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
    summary: '새로운 웹앱으로 전면 개편하고, 사용자가 제공한 API 키로 연결하는 선택형 AI 도우미와 참조 문서 검색을 추가했습니다.',
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
    publishedAt: '2025-10-17',
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
    publishedAt: '2025-10-18',
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
    publishedAt: '2025-10-18',
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
    videoUrl: 'https://youtu.be/GH145Wwh-YA',
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
