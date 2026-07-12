const SPECIAL_INDEX_PREFIX = 'result-interpretation/special-indices';

const COPY = {
  ko: {
    overview: {
      heading: '근거 강도',
      tier: 'mixed',
      summary: '특수지수의 경험적 근거는 서로 같지 않다. PTI와 S-CON은 상대적으로 지지가 강하고, DEPI와 CDI는 제한적이며, HVI와 OBS는 낮거나 불충분하다.',
      guardrail: '모든 지수는 선별 가설로만 사용하고, 하위 변수와 면접 자료, 행동 관찰, 병력으로 교차 확인한다.',
    },
    PTI: {
      heading: '근거 강도',
      tier: 'supported',
      summary: '특수지수 가운데 경험적 지지가 상대적으로 강한 편이지만, 사고장애나 정신병적 장애를 단독으로 진단하지는 못한다.',
      guardrail: '양성·음성 여부만 보지 말고 WSum6, Lv2, M-, X-%, XA%의 실제 패턴과 급성 스트레스, 중독, 발달적 요인, 짧은 기록을 함께 검토한다.',
    },
    SCON: {
      heading: '근거 강도',
      tier: 'supported-high-stakes',
      summary: '자살 관련 위험 신호와의 연관성은 상대적으로 강하지만, 자살은 기저율이 낮아 양성 결과에도 거짓양성이 생길 수 있고 음성 결과도 위험을 배제하지 못한다.',
      guardrail: '지수값과 관계없이 현재 자살사고, 의도, 계획, 수단 접근성, 과거 시도, 최근 변화, 보호요인을 직접 확인하고 필요한 안전조치를 우선한다.',
    },
    DEPI: {
      heading: '근거 강도',
      tier: 'limited',
      summary: '우울 관련 구성개념에 대한 경험적 지지는 제한적이다. 양성 결과는 우울 가능성을 더 살펴보라는 신호이지 특정 증상이나 진단의 증거가 아니다.',
      guardrail: '현재 기분, 흥미 저하, 수면·식욕, 죄책감, 자살사고, 지속 기간과 기능 손상을 면접에서 별도로 확인하며, 음성 결과로 우울을 배제하지 않는다.',
    },
    CDI: {
      heading: '근거 강도',
      tier: 'limited',
      summary: '대처 및 대인관계 취약성과의 경험적 연관성은 제한적이다. 양성 결과만으로 무기력, 미숙함, 의존성 또는 고정된 성격 특성을 추론하지 않는다.',
      guardrail: '현재 스트레스, 실제 대처 행동, 사회적 지지, 발달 및 문화 맥락, 관련 하위 변수를 함께 확인한다.',
    },
    HVI: {
      heading: '근거 강도',
      tier: 'weak-inconsistent',
      summary: '과도한 경계나 불신을 나타낸다는 경험적 지지는 약하고 일관되지 않다.',
      guardrail: '양성 결과는 낮은 신뢰도의 조직 가설로만 두고, 실제 위험 환경, 외상 경험, 문화적 거리두기, 면접에서 확인된 경계 행동이 독립적으로 뒷받침할 때만 제한적으로 사용한다.',
    },
    OBS: {
      heading: '근거 강도',
      tier: 'insufficient',
      summary: '강박적 성격이나 기능 손상을 뒷받침하는 구성개념 타당도 근거가 충분하지 않다.',
      guardrail: '양성 결과는 해당 변수 조합이 충족됐다는 운영적 사실로만 보고, 완벽주의·강박성·경직성은 면접과 행동 자료에서 독립적으로 확인한다.',
    },
  },
  en: {
    overview: {
      heading: 'Evidence Strength',
      tier: 'mixed',
      summary: 'The special indices do not have interchangeable empirical support. PTI and S-CON are relatively well supported, DEPI and CDI have limited support, and support for HVI and OBS is weak or insufficient.',
      guardrail: 'Use every index as a screening hypothesis and cross-check it against component variables, interview data, observed behavior, and history.',
    },
    PTI: {
      heading: 'Evidence Strength',
      tier: 'supported',
      summary: 'Empirical support is relatively strong among the special indices, but PTI cannot independently diagnose a thought disorder or psychotic disorder.',
      guardrail: 'Review the actual WSum6, Lv2, M-, X-%, and XA% pattern and consider acute stress, intoxication, developmental factors, and short records instead of relying on the positive/negative label alone.',
    },
    SCON: {
      heading: 'Evidence Strength',
      tier: 'supported-high-stakes',
      summary: 'Its association with suicide-related risk is relatively strong, but the low base rate of suicide permits false positives and a negative result cannot rule out risk.',
      guardrail: 'Regardless of the score, directly assess current ideation, intent, plan, access to means, prior attempts, recent changes, and protective factors, and prioritize appropriate safety action.',
    },
    DEPI: {
      heading: 'Evidence Strength',
      tier: 'limited',
      summary: 'Empirical support for depression-related constructs is limited. A positive result calls for further assessment; it is not evidence of particular symptoms or a diagnosis.',
      guardrail: 'Separately assess current mood, anhedonia, sleep and appetite, guilt, suicidal ideation, duration, and functional impairment, and do not use a negative result to rule out depression.',
    },
    CDI: {
      heading: 'Evidence Strength',
      tier: 'limited',
      summary: 'Empirical associations with coping and interpersonal vulnerability are limited. A positive result does not establish helplessness, immaturity, dependency, or a fixed trait.',
      guardrail: 'Review current stress, observed coping behavior, social support, developmental and cultural context, and the component variables.',
    },
    HVI: {
      heading: 'Evidence Strength',
      tier: 'weak-inconsistent',
      summary: 'Empirical support for interpreting HVI as hypervigilance or distrust is weak and inconsistent.',
      guardrail: 'Keep a positive result as a low-confidence organizing hypothesis unless actual danger, trauma history, cultural guardedness, and independently observed vigilance support it.',
    },
    OBS: {
      heading: 'Evidence Strength',
      tier: 'insufficient',
      summary: 'Construct-validity evidence for inferring obsessive personality features or impairment is insufficient.',
      guardrail: 'Treat a positive result as an operationally met variable combination only; verify perfectionism, compulsivity, rigidity, and impairment independently in interview and behavior.',
    },
  },
  ja: {
    overview: {
      heading: '根拠の強さ',
      tier: 'mixed',
      summary: '各特殊指標の実証的根拠は同じではありません。PTI と S-CON は比較的支持が強く、DEPI と CDI は限定的で、HVI と OBS は弱いか不十分です。',
      guardrail: 'すべてをスクリーニング仮説として扱い、構成変数、面接、行動観察、既往歴で照合します。',
    },
    PTI: {
      heading: '根拠の強さ',
      tier: 'supported',
      summary: '特殊指標の中では比較的強い実証的支持がありますが、思考障害や精神病性障害を単独で診断することはできません。',
      guardrail: '陽性・陰性だけで判断せず、WSum6、Lv2、M-、X-%、XA% の実際の組合せと、急性ストレス、中毒、発達要因、短い記録を確認します。',
    },
    SCON: {
      heading: '根拠の強さ',
      tier: 'supported-high-stakes',
      summary: '自殺関連リスクとの関連は比較的強い一方、自殺の基礎率が低いため偽陽性が生じ得て、陰性でもリスクを除外できません。',
      guardrail: '得点にかかわらず、自殺念慮、意図、計画、手段へのアクセス、既往企図、最近の変化、保護要因を直接確認し、安全確保を優先します。',
    },
    DEPI: {
      heading: '根拠の強さ',
      tier: 'limited',
      summary: '抑うつ関連構成概念への実証的支持は限定的です。陽性は追加評価の合図であり、特定症状や診断の証拠ではありません。',
      guardrail: '気分、興味低下、睡眠・食欲、罪責感、自殺念慮、持続期間、機能障害を別に評価し、陰性で抑うつを除外しません。',
    },
    CDI: {
      heading: '根拠の強さ',
      tier: 'limited',
      summary: '対処・対人脆弱性との実証的関連は限定的です。陽性だけで無力感、未熟さ、依存性、固定的特性を確定しません。',
      guardrail: '現在のストレス、実際の対処行動、社会的支援、発達・文化的文脈、構成変数を確認します。',
    },
    HVI: {
      heading: '根拠の強さ',
      tier: 'weak-inconsistent',
      summary: '過警戒や不信を示すという実証的支持は弱く、一貫していません。',
      guardrail: '現実の危険、外傷歴、文化的な距離、独立して観察された警戒行動が支持する場合に限り、低確信度の仮説として使います。',
    },
    OBS: {
      heading: '根拠の強さ',
      tier: 'insufficient',
      summary: '強迫的性格特徴や機能障害を推論する構成概念妥当性の根拠は不十分です。',
      guardrail: '陽性は変数の組合せが操作的基準を満たした事実としてのみ扱い、完全主義、強迫性、硬さ、機能障害は面接と行動で独立に確認します。',
    },
  },
  es: {
    overview: {
      heading: 'Fuerza de la evidencia',
      tier: 'mixed',
      summary: 'Los índices especiales no tienen el mismo respaldo empírico. PTI y S-CON cuentan con apoyo relativamente fuerte, DEPI y CDI tienen apoyo limitado, y el apoyo para HVI y OBS es débil o insuficiente.',
      guardrail: 'Use cada índice como hipótesis de cribado y contrástelo con sus variables, la entrevista, la conducta observada y la historia clínica.',
    },
    PTI: {
      heading: 'Fuerza de la evidencia',
      tier: 'supported',
      summary: 'El respaldo empírico es relativamente fuerte entre los índices especiales, pero PTI no diagnostica por sí solo un trastorno del pensamiento o psicótico.',
      guardrail: 'Revise el patrón real de WSum6, Lv2, M-, X-% y XA%, además de estrés agudo, intoxicación, factores evolutivos y protocolos breves.',
    },
    SCON: {
      heading: 'Fuerza de la evidencia',
      tier: 'supported-high-stakes',
      summary: 'La asociación con riesgo suicida es relativamente fuerte, pero la baja tasa base permite falsos positivos y un resultado negativo no descarta riesgo.',
      guardrail: 'Con cualquier puntuación, evalúe directamente ideación, intención, plan, acceso a medios, intentos previos, cambios recientes y factores protectores, y priorice la seguridad.',
    },
    DEPI: {
      heading: 'Fuerza de la evidencia',
      tier: 'limited',
      summary: 'El apoyo empírico para constructos depresivos es limitado. Un resultado positivo pide evaluación adicional; no prueba síntomas concretos ni un diagnóstico.',
      guardrail: 'Evalúe por separado ánimo, anhedonia, sueño y apetito, culpa, ideación suicida, duración y deterioro funcional; un resultado negativo no excluye depresión.',
    },
    CDI: {
      heading: 'Fuerza de la evidencia',
      tier: 'limited',
      summary: 'Las asociaciones empíricas con vulnerabilidad de afrontamiento e interpersonal son limitadas. Un resultado positivo no demuestra impotencia, inmadurez, dependencia ni un rasgo fijo.',
      guardrail: 'Revise estrés actual, conducta de afrontamiento, apoyo social, contexto evolutivo y cultural, y las variables componentes.',
    },
    HVI: {
      heading: 'Fuerza de la evidencia',
      tier: 'weak-inconsistent',
      summary: 'El apoyo empírico para interpretar HVI como hipervigilancia o desconfianza es débil e inconsistente.',
      guardrail: 'Mantenga el resultado como hipótesis de baja confianza salvo que el peligro real, el trauma, la reserva cultural y la vigilancia observada lo apoyen de forma independiente.',
    },
    OBS: {
      heading: 'Fuerza de la evidencia',
      tier: 'insufficient',
      summary: 'La evidencia de validez de constructo para inferir rasgos obsesivos o deterioro es insuficiente.',
      guardrail: 'Trate el resultado como una combinación operacional de variables y confirme perfeccionismo, compulsividad, rigidez y deterioro mediante entrevista y conducta.',
    },
  },
  pt: {
    overview: {
      heading: 'Força da evidência',
      tier: 'mixed',
      summary: 'Os índices especiais não têm o mesmo respaldo empírico. PTI e S-CON têm apoio relativamente forte, DEPI e CDI têm apoio limitado, e o apoio para HVI e OBS é fraco ou insuficiente.',
      guardrail: 'Use cada índice como hipótese de triagem e confronte-o com suas variáveis, entrevista, comportamento observado e história clínica.',
    },
    PTI: {
      heading: 'Força da evidência',
      tier: 'supported',
      summary: 'O apoio empírico é relativamente forte entre os índices especiais, mas PTI não diagnostica sozinho transtorno do pensamento ou transtorno psicótico.',
      guardrail: 'Revise o padrão real de WSum6, Lv2, M-, X-% e XA%, além de estresse agudo, intoxicação, fatores do desenvolvimento e protocolos breves.',
    },
    SCON: {
      heading: 'Força da evidência',
      tier: 'supported-high-stakes',
      summary: 'A associação com risco de suicídio é relativamente forte, mas a baixa taxa-base permite falsos positivos e um resultado negativo não exclui risco.',
      guardrail: 'Qualquer que seja o escore, avalie diretamente ideação, intenção, plano, acesso a meios, tentativas prévias, mudanças recentes e fatores protetivos, priorizando a segurança.',
    },
    DEPI: {
      heading: 'Força da evidência',
      tier: 'limited',
      summary: 'O apoio empírico para construtos depressivos é limitado. Um resultado positivo pede avaliação adicional; não comprova sintomas específicos nem diagnóstico.',
      guardrail: 'Avalie separadamente humor, anedonia, sono e apetite, culpa, ideação suicida, duração e prejuízo funcional; um resultado negativo não exclui depressão.',
    },
    CDI: {
      heading: 'Força da evidência',
      tier: 'limited',
      summary: 'As associações empíricas com vulnerabilidade de coping e interpessoal são limitadas. Um resultado positivo não comprova desamparo, imaturidade, dependência ou traço fixo.',
      guardrail: 'Revise estresse atual, comportamento de coping, apoio social, contexto do desenvolvimento e cultural, e as variáveis componentes.',
    },
    HVI: {
      heading: 'Força da evidência',
      tier: 'weak-inconsistent',
      summary: 'O apoio empírico para interpretar HVI como hipervigilância ou desconfiança é fraco e inconsistente.',
      guardrail: 'Mantenha o resultado como hipótese de baixa confiança, salvo quando perigo real, trauma, reserva cultural e vigilância observada o sustentarem de forma independente.',
    },
    OBS: {
      heading: 'Força da evidência',
      tier: 'insufficient',
      summary: 'A evidência de validade de construto para inferir traços obsessivos ou prejuízo é insuficiente.',
      guardrail: 'Trate o resultado como combinação operacional de variáveis e confirme perfeccionismo, compulsividade, rigidez e prejuízo por entrevista e comportamento.',
    },
  },
};

function getEvidenceKey(canonicalRoute) {
  const normalized = String(canonicalRoute ?? '').replace(/\/+$/, '');
  if (normalized === SPECIAL_INDEX_PREFIX) return 'overview';
  if (!normalized.startsWith(`${SPECIAL_INDEX_PREFIX}/`)) return null;

  const leaf = normalized.slice(SPECIAL_INDEX_PREFIX.length + 1).toUpperCase();
  return ['PTI', 'SCON', 'DEPI', 'CDI', 'HVI', 'OBS'].includes(leaf) ? leaf : null;
}

export function getSpecialIndexEvidence(canonicalRoute, locale) {
  const key = getEvidenceKey(canonicalRoute);
  if (!key) return null;

  const localeCopy = COPY[locale] ?? COPY.en;
  const evidence = localeCopy[key] ?? COPY.en[key];
  return evidence ? { ...evidence } : null;
}

export const SPECIAL_INDEX_EVIDENCE_TIERS = Object.freeze({
  overview: 'mixed',
  PTI: 'supported',
  SCON: 'supported-high-stakes',
  DEPI: 'limited',
  CDI: 'limited',
  HVI: 'weak-inconsistent',
  OBS: 'insufficient',
});
