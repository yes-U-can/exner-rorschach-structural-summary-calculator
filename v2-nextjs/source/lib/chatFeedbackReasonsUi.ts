import type { AiFeedbackReasonCode, Language } from '@/types';

type ChatFeedbackReasonsUi = {
  title: string;
  privacyNote: string;
  skip: string;
  submit: string;
  submitting: string;
  close: string;
  reasonLabels: Record<AiFeedbackReasonCode, string>;
};

const COPY: Record<Language, ChatFeedbackReasonsUi> = {
  ko: {
    title: '의견 보내기',
    privacyNote: '선택한 이유만 평가에 추가됩니다. 대화 내용은 저장되지 않습니다.',
    skip: '건너뛰기',
    submit: '보내기',
    submitting: '보내는 중',
    close: '닫기',
    reasonLabels: {
      accurate: '정확함',
      well_grounded: '근거가 명확함',
      clear: '이해하기 쉬움',
      right_level_of_detail: '분량이 적절함',
      respects_clinical_boundaries: '임상적 한계를 지킴',
      incorrect: '부정확함',
      missed_context: '맥락을 놓침',
      unsupported: '근거가 부족함',
      overconfident: '지나치게 단정적임',
      too_long: '너무 길거나 반복적임',
      too_short: '설명이 부족함',
      incomplete: '답변이 중단됨',
      unclear: '이해하기 어려움',
      unsafe_or_inappropriate: '안전 또는 임상적 경계 문제',
      other: '기타',
    },
  },
  en: {
    title: 'Send feedback',
    privacyNote: 'Only selected reasons are added to the rating. Chat content is not stored.',
    skip: 'Skip',
    submit: 'Send',
    submitting: 'Sending',
    close: 'Close',
    reasonLabels: {
      accurate: 'Accurate',
      well_grounded: 'Well grounded',
      clear: 'Clear and easy to understand',
      right_level_of_detail: 'Right level of detail',
      respects_clinical_boundaries: 'Respects clinical boundaries',
      incorrect: 'Incorrect',
      missed_context: 'Missed context',
      unsupported: 'Weak or mismatched support',
      overconfident: 'Overconfident',
      too_long: 'Too long or repetitive',
      too_short: 'Not enough detail',
      incomplete: 'Incomplete response',
      unclear: 'Hard to understand',
      unsafe_or_inappropriate: 'Safety or clinical-boundary concern',
      other: 'Other',
    },
  },
  ja: {
    title: 'フィードバックを送信',
    privacyNote: '選択した理由だけが評価に追加されます。会話内容は保存されません。',
    skip: 'スキップ',
    submit: '送信',
    submitting: '送信中',
    close: '閉じる',
    reasonLabels: {
      accurate: '正確',
      well_grounded: '根拠が明確',
      clear: '分かりやすい',
      right_level_of_detail: '詳しさが適切',
      respects_clinical_boundaries: '臨床上の限界を遵守',
      incorrect: '不正確',
      missed_context: '文脈を見落としている',
      unsupported: '根拠が不十分',
      overconfident: '断定的すぎる',
      too_long: '長すぎる・繰り返しが多い',
      too_short: '説明が不足',
      incomplete: '回答が不完全',
      unclear: '分かりにくい',
      unsafe_or_inappropriate: '安全性または臨床的境界の問題',
      other: 'その他',
    },
  },
  es: {
    title: 'Enviar feedback',
    privacyNote: 'Solo se añaden los motivos seleccionados. No se guarda el contenido del chat.',
    skip: 'Omitir',
    submit: 'Enviar',
    submitting: 'Enviando',
    close: 'Cerrar',
    reasonLabels: {
      accurate: 'Preciso',
      well_grounded: 'Bien fundamentado',
      clear: 'Claro y fácil de entender',
      right_level_of_detail: 'Nivel de detalle adecuado',
      respects_clinical_boundaries: 'Respeta los límites clínicos',
      incorrect: 'Inexacto',
      missed_context: 'Omite el contexto',
      unsupported: 'Fundamento insuficiente',
      overconfident: 'Demasiado categórico',
      too_long: 'Demasiado largo o repetitivo',
      too_short: 'Falta de explicación',
      incomplete: 'Respuesta incompleta',
      unclear: 'Difícil de entender',
      unsafe_or_inappropriate: 'Problema de seguridad o límites clínicos',
      other: 'Otro',
    },
  },
  pt: {
    title: 'Enviar feedback',
    privacyNote: 'Somente os motivos selecionados são adicionados. O conteúdo da conversa não é armazenado.',
    skip: 'Pular',
    submit: 'Enviar',
    submitting: 'Enviando',
    close: 'Fechar',
    reasonLabels: {
      accurate: 'Preciso',
      well_grounded: 'Bem fundamentado',
      clear: 'Claro e fácil de entender',
      right_level_of_detail: 'Nível de detalhe adequado',
      respects_clinical_boundaries: 'Respeita os limites clínicos',
      incorrect: 'Impreciso',
      missed_context: 'Ignora o contexto',
      unsupported: 'Fundamentação insuficiente',
      overconfident: 'Confiança excessiva',
      too_long: 'Longo ou repetitivo demais',
      too_short: 'Falta de explicação',
      incomplete: 'Resposta incompleta',
      unclear: 'Difícil de entender',
      unsafe_or_inappropriate: 'Problema de segurança ou limites clínicos',
      other: 'Outro',
    },
  },
};

export function getChatFeedbackReasonsUi(language: Language): ChatFeedbackReasonsUi {
  return COPY[language] ?? COPY.ko;
}
