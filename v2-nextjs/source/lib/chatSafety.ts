import type { Language } from '@/i18n/config';

export type RiskFlagLevel = 'none' | 'medium' | 'high';
export type RiskFlagType = 'crisis' | 'diagnostic_attempt' | null;

export type ChatSafetyAssessment = {
  level: RiskFlagLevel;
  type: RiskFlagType;
  interventionTriggered: boolean;
  interventionType: string | null;
  interventionReason: string | null;
  safeResponse: string | null;
};

const CRISIS_SIGNALS = [
  'kill myself',
  'hurt myself',
  'harm myself',
  'want to die',
  'end my life',
  'i am suicidal',
  "i'm suicidal",
  '내가 죽고 싶',
  '나는 죽고 싶',
  '저는 죽고 싶',
  '죽고 싶어',
  '죽고싶어',
  '자살하고 싶',
  '자살할 거',
  '자살하려',
  '자해하고 싶',
  '나를 해치',
  '스스로 해치',
  '목숨을 끊고 싶',
  '극단적 선택을 하',
  '死にたい',
  '自殺したい',
  '自傷したい',
  '消えたい',
  '命を絶ちたい',
  'quiero morir',
  'quiero suicidarme',
  'voy a suicidarme',
  'quiero matarme',
  'quiero hacerme daño',
  'quiero quitarme la vida',
  'quero morrer',
  'quero me matar',
  'vou me matar',
  'quero me suicidar',
  'quero me machucar',
  'quero tirar minha vida',
] as const;

const DIAGNOSTIC_ATTEMPT_SIGNALS = [
  'diagnose me',
  'what disorder',
  'which disorder',
  'am i depressed',
  '진단해',
  '진단 내려',
  '무슨 장애',
  '무슨 병',
  '우울증인가',
  '우울증이야',
  '성격장애',
  '診断して',
  '何の障害',
  'どんな障害',
  'うつ病ですか',
  'diagnostícame',
  'qué trastorno',
  'estoy deprimido',
  'depresión',
  'me diagnostique',
  'que transtorno',
  'estou deprimido',
  'depressão',
] as const;

const CRISIS_RESPONSES: Record<Language, string> = {
  ko: '저는 위기 개입을 제공할 수 없습니다. 지금 자신을 해칠 가능성이 있거나 안전을 유지하기 어렵다면 즉시 119 또는 112에 연락하거나 가까운 응급실로 가세요. 한국에서는 자살예방 상담전화 109를 24시간 이용할 수 있습니다. 가능하면 지금 믿을 수 있는 사람에게 함께 있어 달라고 요청하세요.',
  en: 'I cannot provide crisis intervention. If you may act on thoughts of harming yourself or cannot stay safe, contact your local emergency services or go to the nearest emergency department now. If possible, ask a trusted person to stay with you while you seek immediate help.',
  ja: '私は危機介入を提供できません。今すぐ自分を傷つける可能性がある、または安全を保てない場合は、地域の緊急サービスに連絡するか、最寄りの救急外来を受診してください。可能であれば、信頼できる人にそばにいてもらい、直ちに支援を求めてください。',
  es: 'No puedo ofrecer intervención en crisis. Si existe la posibilidad de que te hagas daño o no puedes mantenerte a salvo, llama ahora a los servicios de emergencia de tu localidad o acude al servicio de urgencias más cercano. Si es posible, pide a una persona de confianza que permanezca contigo mientras buscas ayuda inmediata.',
  pt: 'Não posso oferecer intervenção em crise. Se houver risco de você se machucar ou se não conseguir permanecer em segurança, entre em contato agora com o serviço de emergência da sua região ou vá ao pronto-socorro mais próximo. Se possível, peça a uma pessoa de confiança que fique com você enquanto busca ajuda imediata.',
};

export function detectChatSafetyAssessment(args: {
  text: string;
  locale: Language;
  actorRole?: 'user' | 'admin';
}): ChatSafetyAssessment {
  const normalized = args.text.toLowerCase();
  const hasCrisisSignal = CRISIS_SIGNALS.some((signal) => normalized.includes(signal));

  if (hasCrisisSignal) {
    return {
      level: 'high',
      type: 'crisis',
      interventionTriggered: true,
      interventionType: 'crisis_block',
      interventionReason: 'Possible immediate self-harm or suicide risk signal.',
      safeResponse: CRISIS_RESPONSES[args.locale],
    };
  }

  const actorRole = args.actorRole ?? 'user';
  if (actorRole === 'user') {
    const hasDiagnosticSignal = DIAGNOSTIC_ATTEMPT_SIGNALS.some((signal) =>
      normalized.includes(signal),
    );
    if (hasDiagnosticSignal) {
      return {
        level: 'medium',
        type: 'diagnostic_attempt',
        interventionTriggered: false,
        interventionType: null,
        interventionReason: null,
        safeResponse: null,
      };
    }
  }

  return {
    level: 'none',
    type: null,
    interventionTriggered: false,
    interventionType: null,
    interventionReason: null,
    safeResponse: null,
  };
}
