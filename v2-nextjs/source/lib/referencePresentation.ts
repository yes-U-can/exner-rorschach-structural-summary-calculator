import type { Language } from '@/types';

type LocaleLabels = Record<string, string>;

const LABELS: Record<Language, LocaleLabels> = {
  ko: {
    'scoring-input': '부호화',
    'result-interpretation': '결과 해석',
    'scoring-input/card': '카드',
    'scoring-input/location': '위치',
    'scoring-input/dq': '발달질(DQ)',
    'scoring-input/determinants': '결정인',
    'scoring-input/fq': '형태질(FQ)',
    'scoring-input/pair': '쌍반응(2)',
    'scoring-input/contents': '내용',
    'scoring-input/popular': '평범반응(P)',
    'scoring-input/z': '조직화 활동(Z)',
    'scoring-input/score': '반응 채점',
    'scoring-input/gphr': '인간표상(GHR/PHR)',
    'scoring-input/special-score': '특수점수',
    'result-interpretation/upper-section': '상단부',
    'result-interpretation/lower-section': '하단부',
    'result-interpretation/special-indices': '특수지표',
    core: '중핵',
    ideation: '사고',
    affect: '정서',
    mediation: '인지적 매개',
    processing: '정보처리',
    interpersonal: '대인관계',
    selfPerception: '자기지각',
  },
  en: {
    'scoring-input': 'Coding',
    'result-interpretation': 'Interpretation',
    'scoring-input/card': 'Card',
    'scoring-input/location': 'Location',
    'scoring-input/dq': 'Developmental Quality (DQ)',
    'scoring-input/determinants': 'Determinants',
    'scoring-input/fq': 'Form Quality (FQ)',
    'scoring-input/pair': 'Pair (2)',
    'scoring-input/contents': 'Contents',
    'scoring-input/popular': 'Popular Response (P)',
    'scoring-input/z': 'Organizational Activity (Z)',
    'scoring-input/score': 'Response Scoring',
    'scoring-input/gphr': 'Human Representation (GHR/PHR)',
    'scoring-input/special-score': 'Special Scores',
    'result-interpretation/upper-section': 'Upper Section',
    'result-interpretation/lower-section': 'Lower Section',
    'result-interpretation/special-indices': 'Special Indices',
    core: 'Core',
    ideation: 'Ideation',
    affect: 'Affect',
    mediation: 'Mediation',
    processing: 'Processing',
    interpersonal: 'Interpersonal',
    selfPerception: 'Self-Perception',
  },
  ja: {
    'scoring-input': 'スコアリング',
    'result-interpretation': '解釈',
    'scoring-input/card': 'カード',
    'scoring-input/location': '領域',
    'scoring-input/dq': '発達水準(DQ)',
    'scoring-input/determinants': '決定因',
    'scoring-input/fq': '形態水準(FQ)',
    'scoring-input/pair': 'ペア反応(2)',
    'scoring-input/contents': '反応内容',
    'scoring-input/popular': '平凡反応(P)',
    'scoring-input/z': '組織化活動(Z)',
    'scoring-input/score': '反応スコア',
    'scoring-input/gphr': '人間表象(GHR/PHR)',
    'scoring-input/special-score': '特殊スコア',
    'result-interpretation/upper-section': '上段',
    'result-interpretation/lower-section': '下段',
    'result-interpretation/special-indices': '特殊指標',
    core: '中核',
    ideation: '思考',
    affect: '感情',
    mediation: '認知的媒介',
    processing: '情報処理',
    interpersonal: '対人知覚',
    selfPerception: '自己知覚',
  },
  es: {
    'scoring-input': 'Codificación',
    'result-interpretation': 'Interpretación',
    'scoring-input/card': 'Lámina',
    'scoring-input/location': 'Localización',
    'scoring-input/dq': 'Calidad Evolutiva (DQ)',
    'scoring-input/determinants': 'Determinantes',
    'scoring-input/fq': 'Calidad Formal (FQ)',
    'scoring-input/pair': 'Respuesta de par (2)',
    'scoring-input/contents': 'Contenidos',
    'scoring-input/popular': 'Respuesta Popular (P)',
    'scoring-input/z': 'Actividad Organizativa (Z)',
    'scoring-input/score': 'Puntuación de la respuesta',
    'scoring-input/gphr': 'Representación humana (GHR/PHR)',
    'scoring-input/special-score': 'Códigos Especiales',
    'result-interpretation/upper-section': 'Sección superior',
    'result-interpretation/lower-section': 'Sección inferior',
    'result-interpretation/special-indices': 'Índices especiales',
    core: 'Núcleo',
    ideation: 'Ideación',
    affect: 'Afecto',
    mediation: 'Mediación',
    processing: 'Procesamiento',
    interpersonal: 'Relaciones interpersonales',
    selfPerception: 'Autopercepción',
  },
  pt: {
    'scoring-input': 'Codificação',
    'result-interpretation': 'Interpretação',
    'scoring-input/card': 'Prancha',
    'scoring-input/location': 'Localização',
    'scoring-input/dq': 'Qualidade Evolutiva (DQ)',
    'scoring-input/determinants': 'Determinantes',
    'scoring-input/fq': 'Qualidade Formal (FQ)',
    'scoring-input/pair': 'Resposta de par (2)',
    'scoring-input/contents': 'Conteúdos',
    'scoring-input/popular': 'Resposta Popular (P)',
    'scoring-input/z': 'Atividade Organizativa (Z)',
    'scoring-input/score': 'Pontuação da resposta',
    'scoring-input/gphr': 'Representação humana (GHR/PHR)',
    'scoring-input/special-score': 'Códigos Especiais',
    'result-interpretation/upper-section': 'Seção Superior',
    'result-interpretation/lower-section': 'Seção Inferior',
    'result-interpretation/special-indices': 'Índices Especiais',
    core: 'Núcleo',
    ideation: 'Ideação',
    affect: 'Afeto',
    mediation: 'Mediação',
    processing: 'Processamento',
    interpersonal: 'Relações Interpessoais',
    selfPerception: 'Autopercepção',
  },
};

function stripTechnicalPrefix(title: string) {
  return title.replace(/^\[[^\]]+\]\s*/u, '').trim();
}

function getCategoryRoute(canonicalRoute: string) {
  const segments = canonicalRoute.split('/').filter(Boolean);
  if (segments[0] === 'scoring-input') {
    return segments.length > 1 ? segments.slice(0, 2).join('/') : 'scoring-input';
  }
  if (segments[0] === 'result-interpretation') {
    if (segments[1] === 'lower-section' && segments[2]) return segments[2];
    return segments.length > 1 ? segments.slice(0, 2).join('/') : 'result-interpretation';
  }
  return segments[0] ?? canonicalRoute;
}

export function getReferencePresentationTitle(
  language: Language,
  canonicalRoute: string,
  storedTitle: string,
) {
  return LABELS[language][canonicalRoute] ?? (stripTechnicalPrefix(storedTitle) || canonicalRoute);
}

export function getReferencePresentationCategory(language: Language, canonicalRoute: string) {
  const categoryRoute = getCategoryRoute(canonicalRoute);
  return LABELS[language][categoryRoute] ?? stripTechnicalPrefix(categoryRoute);
}
