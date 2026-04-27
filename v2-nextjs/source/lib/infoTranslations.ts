import {
  Code,
  InfoTranslation,
  Language,
  Category,
  InfoCategory,
  Gtm,
  Docs,
} from '@/types';
import { INFO_CATEGORIES_MAP } from '@/lib/constants';

const categoryNames: Record<InfoCategory, Record<Language, string>> = {
  Card: {
    ko: '카드',
    en: 'Card',
    ja: 'カード',
    es: 'Lámina',
    pt: 'Cartão',
  },
  Location: {
    ko: '반응 영역',
    en: 'Location',
    ja: '反応領域',
    es: 'Localización',
    pt: 'Localização',
  },
  DQ: {
    ko: '발달 질',
    en: 'Developmental Quality',
    ja: '発達水準',
    es: 'Calidad del Desarrollo',
    pt: 'Qualidade do Desenvolvimento',
  },
  Determinants: {
    ko: '결정인',
    en: 'Determinants',
    ja: '決定因',
    es: 'Determinantes',
    pt: 'Determinantes',
  },
  FQ: {
    ko: '형태 질',
    en: 'Form Quality',
    ja: '形態水準',
    es: 'Calidad de la Forma',
    pt: 'Qualidade da Forma',
  },
  Pair: {
    ko: '반응쌍',
    en: 'Pair',
    ja: 'ペア',
    es: 'Par',
    pt: 'Par',
  },
  Contents: {
    ko: '반응 내용',
    en: 'Contents',
    ja: '反応内容',
    es: 'Contenidos',
    pt: 'Conteúdos',
  },
  Popular: {
    ko: '평범 반응',
    en: 'Popular',
    ja: '平凡反応',
    es: 'Popular',
    pt: 'Popular',
  },
  Z: {
    ko: '조직화 활동',
    en: 'Organizational Activity',
    ja: '体制化活動',
    es: 'Actividad Organizacional',
    pt: 'Atividade Organizacional',
  },
  Score: {
    ko: 'Z 점수',
    en: 'Z Score',
    ja: 'Zスコア',
    es: 'Puntuación Z',
    pt: 'Pontuação Z',
  },
  'G/PHR': {
    ko: '인간 표상의 질',
    en: 'Good/Poor Human Representation',
    ja: '人間表象の質',
    es: 'Representación Humana Buena/Pobre',
    pt: 'Representação Humana Boa/Pobre',
  },
  'Special Score': {
    ko: '특수 점수',
    en: 'Special Scores',
    ja: '特殊スコア',
    es: 'Puntuaciones Especiales',
    pt: 'Pontuações Especiais',
  },
};

const categoryDescriptions: Record<InfoCategory, Record<Language, string>> = {
  Card: {
    ko: '로르샤흐 검사에 사용되는 10장의 잉크 반점 카드입니다. 각 카드는 고유한 특성을 가지며 다양한 심리적 측면을 탐색합니다.',
    en: 'The 10 inkblot cards used in the Rorschach test. Each card has unique characteristics and explores various psychological aspects.',
    ja: 'ロールシャッハテストで使用される10枚のインクブロットカードです。各カードは固有の特性を持ち、様々な心理的側面を探索します。',
    es: 'Las 10 láminas de manchas de tinta utilizadas en el test de Rorschach. Cada lámina tiene características únicas y explora diversos aspectos psicológicos.',
    pt: 'Os 10 cartões de manchas de tinta usados no teste de Rorschach. Cada cartão tem características únicas e explora diversos aspectos psicológicos.',
  },
  Location: {
    ko: '피험자가 잉크 반점의 어느 부분에 초점을 맞추어 반응했는지를 나타내는 채점 항목입니다.',
    en: 'Scoring item indicating which part of the inkblot the subject focused on for the response.',
    ja: '被験者がインクのどの部分に焦点を合わせて反応したかを示す採点項目です。',
    es: 'Ítem de puntuación que indica en qué parte de la mancha de tinta se centró el sujeto para su respuesta.',
    pt: 'Item de pontuação que indica em que parte da mancha de tinta o sujeito se concentrou para a resposta.',
  },
  DQ: {
    ko: '피험자가 반응 영역을 어떻게 조직하고 통합하는지를 평가하는 질적 채점 항목입니다.',
    en: 'A qualitative scoring item that assesses how the subject organizes and integrates the response area.',
    ja: '被験者が反応領域をどのように組織し統合するかを評価する質的な採点項目です。',
    es: 'Un ítem de puntuación cualitativo que evalúa cómo el sujeto organiza e integra el área de respuesta.',
    pt: 'Um item de pontuação qualitativo que avalia como o sujeito organiza e integra a área de resposta.',
  },
  Determinants: {
    ko: '피험자가 반응을 형성하는 데 어떤 특징(형태, 움직임, 색채, 음영 등)을 사용했는지를 나타냅니다.',
    en: 'Indicates what features (form, movement, color, shading, etc.) the subject used to form the response.',
    ja: '被験者が反応を形成する際にどのような特徴（形態、運動、色彩、陰影など）を使用したかを示します。',
    es: 'Indica qué características (forma, movimiento, color, sombreado, etc.) utilizó el sujeto para formar la respuesta.',
    pt: 'Indica quais características (forma, movimento, cor, sombreamento, etc.) o sujeito usou para formar a resposta.',
  },
  FQ: {
    ko: '피험자의 반응이 잉크 반점의 실제 형태와 얼마나 일치하는지를 평가하는 항목입니다.',
    en: 'This item assesses how well the subject\'s response matches the actual shape of the inkblot.',
    ja: '被験者の反応がインクブロットの実際の形態とどの程度一致するかを評価する項目です。',
    es: 'Este ítem evalúa qué tan bien la respuesta del sujeto coincide con la forma real de la mancha de tinta.',
    pt: 'Este item avalia quão bem a resposta do sujeito coincide com a forma real da mancha de tinta.',
  },
  Pair: {
    ko: '반응에서 두 개의 동일한 대상이 잉크 반점의 좌우 대칭축을 기준으로 대칭적으로 지각되었음을 나타내는 채점 항목입니다.',
    en: 'Scoring item indicating that two identical objects were perceived symmetrically based on the bilateral axis of the inkblot.',
    ja: 'インクブロットの左右対称軸を基準に、二つの同一対象が対称的に知覚されたことを示す採点項目です。',
    es: 'Ítem de puntuación que indica que dos objetos idénticos fueron percibidos simétricamente basándose en el eje bilateral de la mancha.',
    pt: 'Item de pontuação que indica que dois objetos idênticos foram percebidos simetricamente com base no eixo bilateral da mancha.',
  },
  Contents: {
    ko: '피험자가 보고한 반응의 주제적 내용을 분류하는 채점 항목입니다.',
    en: 'This item categorizes the content included in the subject\'s response (e.g., human, animal, object).',
    ja: '被験者が報告した反応の主題的内容を分類する採点項目です。',
    es: 'Este ítem categoriza el contenido incluido en la respuesta del sujeto (p. ej., humano, animal, objeto).',
    pt: 'Este item categoriza o conteúdo incluído na resposta do sujeito (p. ex., humano, animal, objeto).',
  },
  Popular: {
    ko: '해당 반점 영역에서 규준 집단의 약 1/3 이상이 보고하는 매우 흔한 반응으로, 현실 검증력과 관습적 사고를 반영합니다.',
    en: 'Very common responses reported by approximately one-third or more of normative samples for a given blot area, reflecting reality testing and conventional thinking.',
    ja: '該当するブロット領域で規準集団の約1/3以上が報告する非常に一般的な反応で、現実検討力と慣習的思考を反映します。',
    es: 'Respuestas muy comunes reportadas por aproximadamente un tercio o más de las muestras normativas, reflejando prueba de realidad y pensamiento convencional.',
    pt: 'Respostas muito comuns relatadas por aproximadamente um terço ou mais das amostras normativas, refletindo teste de realidade e pensamento convencional.',
  },
  Z: {
    ko: '피험자가 반점의 여러 영역을 의미 있게 관련짓거나 통합하는 조직화 활동의 유무와 유형을 나타내는 채점 항목입니다.',
    en: 'Scoring item indicating the presence and type of organizational activity where the subject meaningfully relates or integrates multiple areas of the blot.',
    ja: '被験者がブロットの複数の領域を意味のある形で関連付けたり統合する組織化活動の有無と種類を示す採点項目です。',
    es: 'Ítem de puntuación que indica la presencia y tipo de actividad organizacional donde el sujeto relaciona o integra significativamente múltiples áreas.',
    pt: 'Item de pontuação que indica a presença e tipo de atividade organizacional onde o sujeito relaciona ou integra significativamente múltiplas áreas.',
  },
  Score: {
    ko: '선택된 Z 유형과 카드 번호에 따라 자동으로 계산되는 조직화 활동 점수(Z Score)입니다.',
    en: 'The organizational activity score (Z Score) automatically calculated based on the selected Z type and card number.',
    ja: '選択されたZ種類とカード番号に基づいて自動的に計算される組織化活動スコア（Zスコア）です。',
    es: 'La puntuación de actividad organizacional (Puntuación Z) calculada automáticamente según el tipo Z y el número de lámina.',
    pt: 'A pontuação de atividade organizacional (Pontuação Z) calculada automaticamente com base no tipo Z e no número do cartão.',
  },
  'G/PHR': {
    ko: '각 반응의 인간 표상이 적응적(GHR)인지 부적응적(PHR)인지를 분류하는 지표로, 대인관계 지각의 질을 반영합니다.',
    en: 'An indicator classifying whether the human representation in each response is adaptive (GHR) or maladaptive (PHR), reflecting the quality of interpersonal perception.',
    ja: '各反応の人間表象が適応的(GHR)か不適応的(PHR)かを分類する指標で、対人関係知覚の質を反映します。',
    es: 'Un indicador que clasifica si la representación humana en cada respuesta es adaptativa (GHR) o desadaptativa (PHR), reflejando la calidad de la percepción interpersonal.',
    pt: 'Um indicador que classifica se a representação humana em cada resposta é adaptativa (GHR) ou desadaptativa (PHR), refletindo a qualidade da percepção interpersonal.',
  },
  'Special Score': {
    ko: '비전형적이거나 병리적인 사고 과정을 나타내는 언어적, 개념적 이상 반응이 나타날 때 채점하는 항목입니다.',
    en: 'Additional scoring items to capture unusual or irrational aspects of the response.',
    ja: '非典型的または病理的な思考過程を示す言語的・概念的異常反応が現れた際に採点する項目です。',
    es: 'Ítems de puntuación adicionales para capturar aspectos inusuales o irracionales de la respuesta.',
    pt: 'Itens de pontuação adicionais para capturar aspectos incomuns ou irracionais da resposta.',
  },
};

const rawGasCodeData: Record<string, Record<string, Record<string, string>>> = {
    'Card': {
        'I': { ko: '낯선 상황에 직면했을 때의 대처 방식과 자아상을 탐색하는 흑백 카드', en: 'Achromatic card exploring self-image and coping styles in novel situations.', ja: '慣れない状況に直面した際の対処様式と自己像を探索する黒白カード。', es: 'Lámina acromática que explora la autoimagen y los estilos de afrontamiento ante situaciones nuevas.', pt: 'Cartão acromático que explora a autoimagem e os estilos de enfrentamento em situações novas.' },
        'II': { ko: '붉은 색채가 포함되어 공격성이나 분노 등 강렬한 정서적 자극에 대한 대처 양상을 시사', en: 'Contains red color, suggesting coping patterns for intense emotional stimuli like aggression or anger.', ja: '赤色が混在し、攻撃性や怒りなど強烈な情動刺激への対処様式を示唆。', es: 'Contiene color rojo y sugiere patrones de afrontamiento frente a estímulos emocionales intensos, como agresión o ira.', pt: 'Contém a cor vermelha e sugere padrões de enfrentamento diante de estímulos emocionais intensos, como agressividade ou raiva.' },
        'III': { ko: '인간 움직임(M)이 가장 빈번하며 대인관계 지각 및 사회적 상호작용 방식을 시사', en: 'Elicits Human Movement (M) most frequently, suggesting interpersonal perception and social interaction styles.', ja: '人間運動反応(M)が最も頻繁で、対人知覚および社会的相互作用の様式を示唆。', es: 'Evoca con más frecuencia el Movimiento Humano (M), sugiriendo percepción interpersonal y estilos de interacción social.', pt: 'Evoca com maior frequência o Movimento Humano (M), sugerindo percepção interpessoal e estilos de interação social.' },
        'IV': { ko: '육중하고 어두운 형태적 특성으로 인해 권위적 대상이나 초자아에 대한 태도를 반영', en: 'Reflects attitudes toward authority figures or the superego due to its massive and dark formal qualities.', ja: '重厚で暗い形態的特性により、権威的対象や超自我に対する態度を反映。', es: 'Refleja actitudes hacia figuras de autoridad o hacia el superyó debido a sus cualidades formales masivas y oscuras.', pt: 'Reflete atitudes em relação a figuras de autoridade ou ao superego devido às suas qualidades formais maciças e escuras.' },
        'V': { ko: '가장 평이하고 구조화된 흑백 카드로 현실 검증력의 기초가 되는 평범 반응(P)을 탐색', en: 'The most structured achromatic card, used to explore Popular responses (P) underlying reality testing.', ja: '最も平凡で構造化された黒白カードで、現実検討力の基礎となる平凡反応(P)を探索。', es: 'La lámina acromática más estructurada, utilizada para explorar respuestas Populares (P) que sustentan la prueba de realidad.', pt: 'O cartão acromático mais estruturado, usado para explorar respostas Populares (P) subjacentes ao teste da realidade.' },
        'VI': { ko: '상단과 하단의 질감 차이가 두드러져 친밀감 및 의존 욕구(질감 반응)를 탐색하기 용이', en: 'Prominent texture differences facilitate exploration of intimacy and dependency needs (texture responses).', ja: '上部と下部の質感の差が著しく、親密感や依存欲求（質感反応）を探索しやすいカード。', es: 'Las marcadas diferencias de textura facilitan la exploración de la intimidad y de las necesidades de dependencia (respuestas de textura).', pt: 'As marcantes diferenças de textura facilitam a exploração da intimidade e das necessidades de dependência (respostas de textura).' },
        'VII': { ko: '공간이 뚫린 형태적 특성으로 인해 여성성이나 모성적 대상과 관련된 투사를 자주 유발', en: 'Often evokes projections related to femininity or maternal figures due to its open interior space.', ja: '空間が開いた形態的特性により、女性性や母性的対象に関連する投影を誘発しやすいカード。', es: 'Suele evocar proyecciones relacionadas con la feminidad o con figuras maternas debido a su espacio interior abierto.', pt: 'Frequentemente evoca projeções relacionadas à feminilidade ou a figuras maternas devido ao seu espaço interior aberto.' },
        'VIII': { ko: '최초의 전면 다채색 카드로 정서적 상황에서의 처리 능력 및 통합 능력을 탐색', en: 'The first fully chromatic card, exploring processing and integration abilities in emotional situations.', ja: '最初の全面有彩色カードで、情動的状況における処理能力と統合能力を探索する。', es: 'La primera lámina totalmente cromática, que explora las capacidades de procesamiento e integración en situaciones emocionales.', pt: 'O primeiro cartão totalmente cromático, que explora as capacidades de processamento e integração em situações emocionais.' },
        'IX': { ko: '색채가 혼합되고 형태가 모호하여 복잡한 정서적 상황에서의 대처와 조직화 노력을 요함', en: 'Blended colors and vague forms require coping and organizational effort in complex emotional situations.', ja: '色彩が混合し形態が曖昧なため、複雑な情動的状況での対処と体制化への努力を要する。', es: 'Los colores mezclados y las formas vagas exigen esfuerzo de afrontamiento y de organización en situaciones emocionales complejas.', pt: 'As cores misturadas e as formas vagas exigem esforço de enfrentamento e de organização em situações emocionais complexas.' },
        'X': { ko: '여러 개의 분산된 세부 영역들로 구성되어 파편화된 자극을 통합하는 능력과 시각적 조절력을 확인', en: 'Composed of scattered details, checking visual control and the ability to integrate fragmented stimuli.', ja: '複数の分散した細部領域で構成され、断片化された刺激を統合する能力と視覚的統制力を確認する。', es: 'Compuesta por detalles dispersos, permite observar el control visual y la capacidad de integrar estímulos fragmentados.', pt: 'Composto por detalhes dispersos, permite observar o controle visual e a capacidade de integrar estímulos fragmentados.' }
    },
    'Location': {
        'W': { ko: '잉크 반점의 전체(Whole)를 모두 사용하여 반응', en: 'Response using the entire inkblot (Whole).', ja: 'インクブロット全体（Whole）を用いた反応。', es: 'Respuesta que utiliza la mancha de tinta completa (Whole).', pt: 'Resposta que utiliza toda a mancha de tinta (Whole).' },
        'WS': { ko: '전체(W) 영역을 주된 자극으로 사용하며 흰 공간(S)을 배경이나 대상으로 통합', en: 'Uses the Whole (W) area as the main stimulus, integrating white Space (S) as background or object.', ja: '全体（W）領域を主刺激として用い、白地空間（S）を背景または対象として統合した反応。', es: 'Utiliza el área global (W) como estímulo principal e integra el espacio en blanco (S) como fondo u objeto.', pt: 'Utiliza a área global (W) como estímulo principal e integra o espaço em branco (S) como fundo ou objeto.' },
        'D': { ko: '반점의 영역 중 빈번하게 식별되는 흔한 세부 영역(Common Detail)을 사용', en: 'Uses a frequently identified Common Detail area of the blot.', ja: 'ブロットの中で頻繁に同定される一般的な細部領域（Common Detail）を用いた反応。', es: 'Utiliza un área de Detalle Común identificada con frecuencia dentro de la mancha.', pt: 'Utiliza uma área de Detalhe Comum identificada com frequência na mancha.' },
        'DS': { ko: '흔한 세부 영역(D)을 주된 자극으로 사용하며 흰 공간(S)을 배경이나 대상으로 통합', en: 'Uses a Common Detail (D) as the main stimulus, integrating white Space (S).', ja: '一般的な細部領域（D）を主刺激として用い、白地空間（S）を背景または対象として統合した反応。', es: 'Utiliza un Detalle Común (D) como estímulo principal e integra el espacio en blanco (S).', pt: 'Utiliza um Detalhe Comum (D) como estímulo principal e integra o espaço em branco (S).' },
        'Dd': { ko: '반점의 영역 중 빈도가 낮고 드물게 식별되는 특이한 세부 영역(Unusual Detail)을 사용', en: 'Uses an Unusual Detail area identified infrequently.', ja: 'ブロットの中で出現頻度が低く、まれに同定される特殊な細部領域（Unusual Detail）を用いた反応。', es: 'Utiliza un área de Detalle Inusual identificada con baja frecuencia.', pt: 'Utiliza uma área de Detalhe Incomum identificada com baixa frequência.' },
        'DdS': { ko: '드문 세부 영역(Dd)을 주된 자극으로 사용하며 흰 공간(S)을 배경이나 대상으로 통합', en: 'Uses an Unusual Detail (Dd) as the main stimulus, integrating white Space (S).', ja: 'まれな細部領域（Dd）を主刺激として用い、白地空間（S）を背景または対象として統合した反応。', es: 'Utiliza un Detalle Inusual (Dd) como estímulo principal e integra el espacio en blanco (S).', pt: 'Utiliza um Detalhe Incomum (Dd) como estímulo principal e integra o espaço em branco (S).' },
        'S': { ko: '잉크가 묻은 부분이 아닌 흰 배경 공간(Space)만을 단독으로 사용하여 반응', en: 'Response using only the white background Space, not the inked area.', ja: 'インクが付いた部分ではなく、白い背景空間（Space）のみを単独で用いた反応。', es: 'Respuesta que utiliza solo el espacio en blanco del fondo, y no el área entintada.', pt: 'Resposta que utiliza apenas o espaço em branco do fundo, e não a área entintada.' }
    },
    'DQ': {
        '+': { ko: '두 개 이상의 대상을 의미 있게 통합하였으며 그 형태가 구체적이고 명확함', en: 'Meaningful integration of two or more objects with specific and distinct forms.', ja: '二つ以上の対象を意味のある形で統合しており、その形態が具体的で明確な場合。', es: 'Integración significativa de dos o más objetos con formas específicas y distintas.', pt: 'Integração significativa de dois ou mais objetos com formas específicas e distintas.' },
        'o': { ko: '단일한 대상을 지각했거나 대상 간의 통합 없이 단순히 나열하였으며 형태가 명확함', en: 'Perception of a single object or simple listing without integration; form is distinct.', ja: '単一の対象を知覚するか、対象間の統合を行わず単純に列挙しており、形態が明確な場合。', es: 'Percepción de un solo objeto o listado simple sin integración; forma es distinta.', pt: 'Percepção de um único objeto ou enumeração simples sem integração; a forma é distinta.' },
        'v/+': { ko: '두 개 이상의 대상을 통합하려 시도했으나 지각된 대상의 형태가 구체적이지 않고 모호함', en: 'Attempt to integrate two or more objects, but perceived forms are vague and nonspecific.', ja: '二つ以上の対象を統合しようとしたが、知覚された対象の形態が具体的でなく曖昧な場合。', es: 'Intento de integrar dos o más objetos, pero las formas percibidas son vagas y no específicas.', pt: 'Tentativa de integrar dois ou mais objetos, mas as formas percebidas são vagas e inespecíficas.' },
        'v': { ko: '형태가 구체적이지 않고 모호한 대상(구름, 연기 등)을 지각했으며 통합하려는 노력도 없음', en: 'Perception of vague, nonspecific objects (clouds, smoke) with no effort to integrate.', ja: '形態が具体的でなく曖昧な対象（雲、煙など）を知覚しており、統合しようとする努力もない場合。', es: 'Percepción de objetos vagos y no específicos (nubes, humo) sin esfuerzo por integrar.', pt: 'Percepção de objetos vagos e inespecíficos (nuvens, fumaça), sem esforço de integração.' }
    },
    'Determinants': {
        'F': { ko: '오직 형태(Form)만을 유일한 근거로 사용하여 반응', en: 'Response based solely on Form.', ja: '形態(Form)のみを唯一の根拠として用いた反応。', es: 'Respuesta basada únicamente en la Forma.', pt: 'Resposta baseada unicamente na Forma.' },
        'M': { ko: '인간(Human) 혹은 인간적 행위의 움직임이 지각된 반응', en: 'Response perceiving human or human-like movement.', ja: '人間(Human)あるいは人間的行為の動きが知覚された反応。', es: 'Respuesta percibiendo movimiento humano o similar al humano.', pt: 'Resposta em que se percebe movimento humano ou semelhante ao humano.' },
        'Ma': { ko: '인간 움직임(M) 중 움직임의 에너지가 능동적(Active)인 경우', en: 'Human Movement (M) where the energy is Active.', ja: '人間運動(M)の中で、動きのエネルギーが能動的(Active)である場合。', es: 'Movimiento Humano (M) donde la energía es Activa.', pt: 'Movimento Humano (M) em que a energia do movimento é ativa (Active).' },
        'Ma-p': { ko: '인간 움직임(M) 내에 능동(a)과 수동(p)의 에너지가 공존하는 경우', en: 'Human Movement (M) containing both active (a) and passive (p) energy.', ja: '人間運動(M)の中に能動(a)と受動(p)のエネルギーが共存する場合。', es: 'Movimiento Humano (M) que contiene energía activa (a) y pasiva (p).', pt: 'Movimento Humano (M) em que coexistem energias ativa (a) e passiva (p).' },
        'Mp': { ko: '인간 움직임(M) 중 움직임의 에너지가 수동적(Passive)인 경우', en: 'Human Movement (M) where the energy is Passive.', ja: '人間運動(M)の中で、動きのエネルギーが受動的(Passive)である場合。', es: 'Movimiento Humano (M) donde la energía es Pasiva.', pt: 'Movimento Humano (M) em que a energia do movimento é passiva (Passive).' },
        'FM': { ko: '동물(Animal)의 생태에 부합하는 움직임이 지각된 반응', en: 'Response perceiving movement appropriate to animal species.', ja: '動物(Animal)の生態に適合する動きが知覚された反応。', es: 'Respuesta percibiendo movimiento apropiado para especies animales.', pt: 'Resposta em que se percebe movimento compatível com a espécie animal.' },
        'FMa': { ko: '동물 움직임(FM) 중 움직임의 에너지가 능동적(Active)인 경우', en: 'Animal Movement (FM) where the energy is Active.', ja: '動物運動(FM)の中で、動きのエネルギーが能動的(Active)である場合。', es: 'Movimiento Animal (FM) donde la energía es Activa.', pt: 'Movimento Animal (FM) em que a energia do movimento é ativa (Active).' },
        'FMp': { ko: '동물 움직임(FM) 중 움직임의 에너지가 수동적(Passive)인 경우', en: 'Animal Movement (FM) where the energy is Passive.', ja: '動物運動(FM)の中で、動きのエネルギーが受動的(Passive)である場合。', es: 'Movimiento Animal (FM) donde la energía es Pasiva.', pt: 'Movimento Animal (FM) em que a energia do movimento é passiva (Passive).' },
        'FMa-p': { ko: '동물 움직임(FM) 내에 능동(a)과 수동(p)의 에너지가 공존하는 경우', en: 'Animal Movement (FM) containing both active (a) and passive (p) energy.', ja: '動物運動(FM)の中に能動(a)と受動(p)のエネルギーが共存する場合。', es: 'Movimiento Animal (FM) que contiene energía activa (a) y pasiva (p).', pt: 'Movimento Animal (FM) em que coexistem energias ativa (a) e passiva (p).' },
        'm': { ko: '무생물(Inanimate)이나 자연의 힘에 의한 움직임이 지각된 반응', en: 'Response perceiving movement of inanimate objects or natural forces.', ja: '無生物(Inanimate)や自然の力による動きが知覚された反応。', es: 'Respuesta percibiendo movimiento de objetos inanimados o fuerzas naturales.', pt: 'Resposta em que se percebe movimento de objetos inanimados ou forças da natureza.' },
        'ma': { ko: '무생물 움직임(m) 중 움직임의 에너지가 능동적(Active)인 경우', en: 'Inanimate Movement (m) where the energy is Active.', ja: '無生物運動(m)の中で、動きのエネルギーが能動的(Active)である場合。', es: 'Movimiento Inanimado (m) donde la energía es Activa.', pt: 'Movimento Inanimado (m) em que a energia do movimento é ativa (Active).' },
        'mp': { ko: '무생물 움직임(m) 중 움직임의 에너지가 수동적(Passive)인 경우', en: 'Inanimate Movement (m) where the energy is Passive.', ja: '無生物運動(m)の中で、動きのエネルギーが受動的(Passive)である場合。', es: 'Movimiento Inanimado (m) donde la energía es Pasiva.', pt: 'Movimento Inanimado (m) em que a energia do movimento é passiva (Passive).' },
        'ma-p': { ko: '무생물 움직임(m) 내에 능동(a)과 수동(p)의 에너지가 공존하는 경우', en: 'Inanimate Movement (m) containing both active (a) and passive (p) energy.', ja: '無生物運動(m)の中に能動(a)と受動(p)のエネルギーが共存する場合。', es: 'Movimiento Inanimado (m) que contiene energía activa (a) y pasiva (p).', pt: 'Movimento Inanimado (m) em que coexistem energias ativa (a) e passiva (p).' },
        'FC': { ko: '형태가 주된 결정요인이며 색채(C)가 부수적으로 통합되어 사용됨', en: 'Form is the primary determinant, with Color (C) integrated secondarily.', ja: '形態が主たる決定因であり、色彩(C)が副次的に統合されて用いられる場合。', es: 'La Forma es el determinante principal, con el Color (C) integrado secundariamente.', pt: 'A forma é o determinante principal, com a cor (C) integrada de modo secundário.' },
        'CF': { ko: '색채가 주된 결정요인이며 형태(F)는 모호하거나 부수적인 역할을 함', en: 'Color is the primary determinant, with Form (F) being vague or secondary.', ja: '色彩が主たる決定因であり、形態(F)は曖昧または副次的な役割を果たす場合。', es: 'El Color es el determinante principal, con la Forma (F) siendo vaga o secundaria.', pt: 'A cor é o determinante principal, e a forma (F) é vaga ou secundária.' },
        'C': { ko: '형태를 전혀 고려하지 않고 오직 순수 색채(Pure Color)만을 근거로 반응', en: 'Response based solely on Pure Color, ignoring form.', ja: '形態をまったく考慮せず、純粋な色彩(Pure Color)のみを根拠とした反応。', es: 'Respuesta basada únicamente en Color Puro, ignorando la forma.', pt: 'Resposta baseada apenas em Cor Pura, sem considerar a forma.' },
        'Cn': { ko: '대상을 지각하는 대신 색채의 이름(Color Naming)만을 나열하거나 보고', en: 'Listing or reporting Color Naming instead of perceiving an object.', ja: '対象を知覚する代わりに、色の名称(Color Naming)だけを列挙または報告すること。', es: 'Nombrar el Color (Color Naming) en lugar de percibir un objeto.', pt: 'Nomeação da cor, em vez da percepção de um objeto.' },
        "FC'": { ko: '형태가 주된 결정요인이며 무채색(C\')이 부수적으로 통합되어 사용됨', en: 'Form is primary, with Achromatic Color (C\') integrated secondarily.', ja: '形態が主たる決定因であり、無彩色(C\\\')が副次的に統合されて用いられる場合。', es: 'La Forma es principal, con Color Acromático (C\') integrado secundariamente.', pt: 'A forma é o determinante principal, com a Cor Acromática (C\') integrada de modo secundário.' },
        "C'F": { ko: '무채색(검정/회색)이 주된 결정요인이며 형태(F)는 모호하거나 부수적인 역할을 함', en: 'Achromatic Color (black/gray) is primary; Form (F) is vague/secondary.', ja: '無彩色(黒・灰色)が主たる決定因であり、形態(F)は曖昧または副次的な役割を果たす場合。', es: 'El Color Acromático (negro/gris) es principal; la Forma (F) es vaga/secundaria.', pt: 'A Cor Acromática (preto/cinza) é o determinante principal, e a forma (F) é vaga ou secundária.' },
        "C'": { ko: '형태를 전혀 고려하지 않고 오직 순수 무채색(Pure Achromatic Color)만을 근거로 반응', en: 'Response based solely on Pure Achromatic Color, ignoring form.', ja: '形態をまったく考慮せず、純粋な無彩色(Pure Achromatic Color)のみを根拠とした反応。', es: 'Respuesta basada únicamente en Color Acromático Puro, ignorando la forma.', pt: 'Resposta baseada apenas em Cor Acromática Pura, sem considerar a forma.' },
        'FT': { ko: '형태가 주된 결정요인이며 질감(Texture)이 부수적으로 통합되어 사용됨', en: 'Form is primary, with Texture (T) integrated secondarily.', ja: '形態が主たる決定因であり、質感(Texture)が副次的に統合されて用いられる場合。', es: 'La Forma es principal, con Textura (T) integrada secundariamente.', pt: 'A forma é o determinante principal, com a Textura (T) integrada de modo secundário.' },
        'TF': { ko: '질감(T)이 주된 결정요인이며 형태(F)는 모호하거나 부수적인 역할을 함', en: 'Texture (T) is primary; Form (F) is vague/secondary.', ja: '質感(T)が主たる決定因であり、形態(F)は曖昧または副次的な役割を果たす場合。', es: 'La Textura (T) es principal; la Forma (F) es vaga/secundaria.', pt: 'A textura (T) é o determinante principal, e a forma (F) é vaga ou secundária.' },
        'T': { ko: '형태를 전혀 고려하지 않고 오직 순수 질감(Pure Texture)만을 근거로 반응', en: 'Response based solely on Pure Texture, ignoring form.', ja: '形態をまったく考慮せず、純粋な質感(Pure Texture)のみを根拠とした反応。', es: 'Respuesta basada únicamente en Textura Pura, ignorando la forma.', pt: 'Resposta baseada apenas em Textura Pura, sem considerar a forma.' },
        'FV': { ko: '형태가 주된 결정요인이며 명암에 의한 깊이감(Vista)이 부수적으로 통합되어 사용됨', en: 'Form is primary, with Vista (shading depth) integrated secondarily.', ja: '形態が主たる決定因であり、明暗による奥行き感(Vista)が副次的に統合されて用いられる場合。', es: 'La Forma es principal, con Vista (profundidad por sombreado) integrada secundariamente.', pt: 'A forma é o determinante principal, com a Vista (profundidade por sombreado) integrada de modo secundário.' },
        'VF': { ko: '깊이감(V)이 주된 결정요인이며 형태(F)는 모호하거나 부수적인 역할을 함', en: 'Vista (V) is primary; Form (F) is vague/secondary.', ja: '奥行き感(V)が主たる決定因であり、形態(F)は曖昧または副次的な役割を果たす場合。', es: 'Vista (V) es principal; la Forma (F) es vaga/secundaria.', pt: 'A Vista (V) é o determinante principal, e a forma (F) é vaga ou secundária.' },
        'V': { ko: '형태를 전혀 고려하지 않고 오직 명암에 의한 깊이감(Pure Vista)만을 근거로 반응', en: 'Response based solely on Pure Vista, ignoring form.', ja: '形態をまったく考慮せず、明暗による純粋な奥行き感(Pure Vista)のみを根拠とした反応。', es: 'Respuesta basada únicamente en Vista Pura, ignorando la forma.', pt: 'Resposta baseada apenas em Vista Pura, sem considerar a forma.' },
        'FY': { ko: '형태가 주된 결정요인이며 확산된 명암(Y)이 부수적으로 통합되어 사용됨', en: 'Form is primary, with Diffuse Shading (Y) integrated secondarily.', ja: '形態が主たる決定因であり、拡散した明暗(Y)が副次的に統合されて用いられる場合。', es: 'La Forma es principal, con Sombreado Difuso (Y) integrado secundariamente.', pt: 'A forma é o determinante principal, com o Sombreamento Difuso (Y) integrado de modo secundário.' },
        'YF': { ko: '확산된 명암(Y)이 주된 결정요인이며 형태(F)는 모호하거나 부수적인 역할을 함', en: 'Diffuse Shading (Y) is primary; Form (F) is vague/secondary.', ja: '拡散した明暗(Y)が主たる決定因であり、形態(F)は曖昧または副次的な役割を果たす場合。', es: 'El Sombreado Difuso (Y) es principal; la Forma (F) es vaga/secundaria.', pt: 'O Sombreamento Difuso (Y) é o determinante principal, e a forma (F) é vaga ou secundária.' },
        'Y': { ko: '형태를 전혀 고려하지 않고 오직 순수 확산 명암(Pure Diffuse Shading)만을 근거로 반응', en: 'Response based solely on Pure Diffuse Shading, ignoring form.', ja: '形態をまったく考慮せず、純粋な拡散明暗(Pure Diffuse Shading)のみを根拠とした反応。', es: 'Respuesta basada únicamente en Sombreado Difuso Puro, ignorando la forma.', pt: 'Resposta baseada apenas em Sombreamento Difuso Puro, sem considerar a forma.' },
        'FD': { ko: '명암(Shading)의 도움 없이 형태나 크기 원근법을 통해 깊이감(Dimension)을 지각', en: 'Perception of Dimension using form or size perspective without Shading.', ja: '明暗(Shading)の助けなしに、形態や大きさの遠近法を通して奥行き感(Dimension)を知覚した場合。', es: 'Percepción de Dimensión usando perspectiva de forma o tamaño sin Sombreado.', pt: 'Percepção de Dimensão usando forma ou perspectiva de tamanho, sem apoio do sombreado.' },
        'Fr': { ko: '반영(Reflection)이 주된 결정요인이며 형태(F)는 부수적으로 사용됨', en: 'Reflection is primary; Form (F) is secondary.', ja: '反映(Reflection)が主たる決定因であり、形態(F)が副次的に用いられる場合。', es: 'Reflejo es principal; la Forma (F) es secundaria.', pt: 'O Reflexo é o determinante principal, e a forma (F) é secundária.' },
        'rF': { ko: '반영(Reflection)이 주된 결정요인이며 형태(F)는 모호하거나 부수적인 역할을 함', en: 'Reflection is primary; Form (F) is vague or secondary.', ja: '反映(Reflection)が主たる決定因であり、形態(F)は曖昧または副次的な役割を果たす場合。', es: 'Reflejo es principal; la Forma (F) es vaga o secundaria.', pt: 'O Reflexo é o determinante principal, e a forma (F) é vaga ou secundária.' }
    },
    'FQ': {
        '+': { ko: '형태가 비범할 정도로 정교하고 구체적이며 과도하게 상세화된(Superior) 경우', en: 'Form is extraordinarily elaborated, specific, and detailed (Superior).', ja: '形態が卓越するほど精巧で具体的かつ過度に詳細化されている(Superior)場合。', es: 'La forma es extraordinariamente elaborada, específica y detallada (Superior).', pt: 'A forma é extraordinariamente elaborada, específica e detalhada (Superior).' },
        'o': { ko: '규준 집단에서 흔하게 보고되며 형태적으로 적절하고 평범한(Ordinary) 반응', en: 'Form is appropriate and common in normative samples (Ordinary).', ja: '規準集団で一般的に報告され、形態的に適切で平凡な(Ordinary)反応。', es: 'La forma es apropiada y común en muestras normativas (Ordinaria).', pt: 'A forma é apropriada e comum em amostras normativas (Comum).' },
        'u': { ko: '형태적으로 적절하지만 규준 집단에서 드물게 보고되는 독특한(Unusual) 반응', en: 'Form is appropriate but infrequently reported in norms (Unusual).', ja: '形態的には適切だが、規準集団ではまれに報告される独特な(Unusual)反応。', es: 'La forma es apropiada pero infrecuentemente reportada en normas (Inusual).', pt: 'A forma é apropriada, mas relatada com pouca frequência nas normas (Incomum).' },
        '-': { ko: '반점의 형태적 특징과 거의 일치하지 않으며 현실을 심각하게 왜곡한(Distorted) 반응', en: 'Distorted response that barely matches blot features and distorts reality.', ja: 'ブロットの形態的特徴とほとんど一致せず、現実を著しく歪めた(Distorted)反応。', es: 'Respuesta distorsionada que apenas coincide con las características de la mancha.', pt: 'Resposta distorcida que quase não coincide com as características da mancha e distorce a realidade.' },
        'none': { ko: '형태가 전혀 포함되지 않은 반응(순수 C, 순수 T 등)에 적용', en: 'Applied to responses containing no form (Pure C, Pure T, etc.).', ja: '形態がまったく含まれない反応(純粋C、純粋Tなど)に適用。', es: 'Aplicado a respuestas que no contienen forma (Color Puro, Textura Pura, etc.).', pt: 'Aplicado a respostas sem forma alguma (Cor Pura, Textura Pura etc.).' }
    },
    'Pair': {
        '(2)': { ko: '반응 내용에 두 개의 동일한 대상이 대칭적으로 나란히 지각되었음을 의미', en: 'Indicates perception of two identical objects perceived symmetrically.', ja: '反応内容に二つの同一対象が対称的に並んで知覚されたことを示す。', es: 'Indica la percepción de dos objetos idénticos percibidos simétricamente.', pt: 'Indica a percepção de dois objetos idênticos percebidos simetricamente.' }
    },
    'Contents': {
        'H': { ko: '현실에 존재하는 온전한 형태의 인간(Human)', en: 'Whole Human form existing in reality.', ja: '現実に存在する完全な形態の人間(Human)。', es: 'Forma Humana completa existente en la realidad.', pt: 'Forma Humana completa existente na realidade.' },
        '(H)': { ko: '유령, 거인, 요정, 악마 등 현실에 존재하지 않는 신화적/공상적 인간 형상', en: 'Mythological/fictional human figures like ghosts, giants, fairies, demons.', ja: '幽霊、巨人、妖精、悪魔など、現実に存在しない神話的・空想的人間像。', es: 'Figuras humanas mitológicas/ficticias como fantasmas, gigantes, hadas, demonios.', pt: 'Figuras humanas mitológicas ou fictícias, como fantasmas, gigantes, fadas ou demônios.' },
        'Hd': { ko: '인간의 팔, 다리, 얼굴 등 신체의 일부분', en: 'Parts of the human body like arms, legs, face (Human Detail).', ja: '人間の腕、脚、顔など、身体の一部分(Human Detail)。', es: 'Partes del cuerpo humano como brazos, piernas, cara (Detalle Humano).', pt: 'Partes do corpo humano, como braços, pernas ou rosto (Detalhe Humano).' },
        '(Hd)': { ko: '신화적/공상적 인간 형상의 신체 일부분(예: 천사의 날개, 악마의 뿔)', en: 'Parts of fictional/mythological human figures (e.g., angel wings).', ja: '神話的・空想的人間像の身体の一部分(例: 天使の翼、悪魔の角)。', es: 'Partes de figuras humanas ficticias/mitológicas (ej., alas de ángel).', pt: 'Partes de figuras humanas fictícias ou mitológicas (ex.: asas de anjo, chifres de demônio).' },
        'Hx': { ko: '구체적 형상 없이 인간의 정서나 감각적 경험(Human Experience) 자체를 투사', en: 'Projection of Human Experience or emotion without specific form.', ja: '具体的な形象を伴わず、人間の情緒や感覚的経験(Human Experience)そのものを投影した内容。', es: 'Proyección de Experiencia Humana o emoción sin forma específica.', pt: 'Projeção de experiência humana ou emoção, sem uma forma específica.' },
        'A': { ko: '개, 고양이, 곤충 등 현실에 존재하는 온전한 형태의 동물', en: 'Whole Animals existing in reality, like dogs, cats, insects.', ja: '現実に存在する完全な形態の動物。', es: 'Animales completos existentes en la realidad, como perros, gatos, insectos.', pt: 'Animais completos existentes na realidade, como cães, gatos ou insetos.' },
        '(A)': { ko: '유니콘, 용, 킹콩 등 현실에 존재하지 않는 신화적/공상적 동물', en: 'Mythological/fictional animals like unicorns, dragons, King Kong.', ja: 'ユニコーン、竜、キングコングなど、現実に存在しない神話的・空想的動物。', es: 'Animales mitológicos/ficticios como unicornios, dragones.', pt: 'Animais mitológicos ou fictícios, como unicórnios, dragões ou King Kong.' },
        'Ad': { ko: '동물의 머리, 다리 등 신체의 일부분', en: 'Parts of animal bodies like heads, legs (Animal Detail).', ja: '動物の頭、脚など、身体の一部分(Animal Detail)。', es: 'Partes de cuerpos de animales como cabezas, patas (Detalle Animal).', pt: 'Partes do corpo de animais, como cabeças ou patas (Detalhe Animal).' },
        '(Ad)': { ko: '신화적/공상적 동물의 신체 일부분(예: 용의 머리, 천마의 날개)', en: 'Parts of fictional/mythological animals (e.g., dragon\'s head).', ja: '神話的・空想的動物の身体の一部分(例: 竜の頭、天馬の翼)。', es: 'Partes de animales ficticios/mitológicos (ej., cabeza de dragón).', pt: 'Partes de animais fictícios ou mitológicos (ex.: cabeça de dragão, asas de cavalo alado).' },
        'An': { ko: '골격, 내장 기관, 해부도 등 신체 내부 구조(Anatomy)', en: 'Internal body structures like skeletons, organs, anatomy charts.', ja: '骨格、内臓器官、解剖図など、身体内部の構造(Anatomy)。', es: 'Estructuras internas del cuerpo como esqueletos, órganos (Anatomía).', pt: 'Estruturas internas do corpo, como esqueletos, órgãos e diagramas anatômicos.' },
        'Art': { ko: '그림, 조각상, 보석, 장식품 등 예술적 혹은 장식적 대상(Art)', en: 'Artistic or decorative objects like paintings, statues, jewelry.', ja: '絵画、彫像、宝石、装飾品など、芸術的または装飾的対象(Art)。', es: 'Objetos artísticos o decorativos como pinturas, estatuas, joyas (Arte).', pt: 'Objetos artísticos ou decorativos, como pinturas, estátuas, joias e ornamentos.' },
        'Ay': { ko: '토템, 투구, 역사적 유물 등 인류학적(Anthropology) 맥락을 지닌 대상', en: 'Objects with Anthropological context like totems, helmets, artifacts.', ja: 'トーテム、兜、歴史的遺物など、人類学的(Anthropology)文脈を持つ対象。', es: 'Objetos con contexto Antropológico como tótems, cascos, artefactos.', pt: 'Objetos com contexto antropológico, como totens, capacetes e artefatos históricos.' },
        'Bl': { ko: '피(Blood) 혹은 혈흔', en: 'Blood or bloodstains.', ja: '血(Blood)または血痕。', es: 'Sangre o manchas de sangre.', pt: 'Sangue ou manchas de sangue.' },
        'Bt': { ko: '꽃, 나무, 잎, 덤불 등 식물(Botany) 전반', en: 'Plants in general like flowers, trees, leaves, bushes (Botany).', ja: '花、木、葉、茂みなど、植物(Botany)全般。', es: 'Plantas en general como flores, árboles, hojas (Botánica).', pt: 'Plantas em geral, como flores, árvores, folhas e arbustos.' },
        'Cg': { ko: '옷, 모자, 신발, 장신구 등 착용하는 의복(Clothing)', en: 'Clothing items worn like clothes, hats, shoes, accessories.', ja: '衣服、帽子、靴、装身具など、身につける衣類(Clothing)。', es: 'Prendas de vestir como ropa, sombreros, zapatos (Ropa).', pt: 'Peças de vestuário como roupas, chapéus, sapatos e acessórios.' },
        'Cl': { ko: '구름(Cloud)을 단독으로 지각한 경우 (안개나 비는 Na로 분류)', en: 'Clouds perceived alone (fog/rain are Na).', ja: '雲(Cloud)を単独で知覚した場合(霧や雨はNaに分類)。', es: 'Nubes percibidas solas (niebla/lluvia son Na).', pt: 'Nuvens percebidas isoladamente (névoa e chuva são classificadas como Na).' },
        'Ex': { ko: '폭발(Explosion) 장면이나 폭죽 등', en: 'Explosion scenes or fireworks.', ja: '爆発(Explosion)の場面や花火など。', es: 'Escenas de Explosión o fuegos artificiales.', pt: 'Cenas de explosão ou fogos de artifício.' },
        'Fd': { ko: '사람이 먹을 수 있는 음식(Food)이나 식재료 (살아있는 동물은 A)', en: 'Edible Food for humans (living animals are A).', ja: '人が食べられる食物(Food)や食材(生きている動物はA)。', es: 'Comida comestible para humanos (animales vivos son A).', pt: 'Alimentos ou ingredientes comestíveis para humanos (animais vivos são A).' },
        'Fi': { ko: '불(Fire), 불꽃, 혹은 연기', en: 'Fire, flames, or smoke.', ja: '火(Fire)、炎、または煙。', es: 'Fuego, llamas o humo.', pt: 'Fogo, chamas ou fumaça.' },
        'Ge': { ko: '지도, 섬, 강, 호수 등 지리학적(Geography) 형상', en: 'Geographical forms like maps, islands, rivers, lakes.', ja: '地図、島、川、湖など、地理学的(Geography)形象。', es: 'Formas Geográficas como mapas, islas, ríos.', pt: 'Formas geográficas como mapas, ilhas, rios e lagos.' },
        'Hh': { ko: '가구, 식기, 침구 등 가정용품(Household)', en: 'Household items like furniture, dishes, bedding.', ja: '家具、食器、寝具など、家庭用品(Household)。', es: 'Artículos del Hogar como muebles, platos.', pt: 'Itens domésticos como móveis, louças e roupas de cama.' },
        'Id': { ko: '위의 범주에 포함되지 않는 독특하고 개별적인(Idiosyncratic) 내용', en: 'Idiosyncratic content not fitting other categories.', ja: '上記の範疇に含まれない、独特で個別的な(Idiosyncratic)内容。', es: 'Contenido Idiosincrásico no incluido en otras categorías.', pt: 'Conteúdo idiossincrático que não se encaixa nas outras categorias.' },
        'Ls': { ko: '산, 바다, 도시 전경 등 풍경(Landscape)', en: 'Landscapes like mountains, seas, cityscapes.', ja: '山、海、都市景観などの風景(Landscape)。', es: 'Paisajes como montañas, mares, paisajes urbanos.', pt: 'Paisagens como montanhas, mares e vistas urbanas.' },
        'Na': { ko: '태양, 비, 안개, 무지개 등 식물을 제외한 자연 현상(Nature)', en: 'Nature phenomena excluding plants (sun, rain, fog, rainbows).', ja: '太陽、雨、霧、虹など、植物を除く自然現象(Nature)。', es: 'Fenómenos de la Naturaleza excluyendo plantas (sol, lluvia).', pt: 'Fenômenos da natureza, excluindo plantas, como sol, chuva, névoa e arco-íris.' },
        'Sc': { ko: '현미경, 비행기, 모터, 무기 등 과학/공학적 산물(Science)', en: 'Scientific/engineering products like microscopes, planes, motors.', ja: '顕微鏡、飛行機、モーター、武器など、科学・工学的産物(Science)。', es: 'Productos de Ciencia/ingeniería como microscopios, aviones.', pt: 'Produtos científicos ou de engenharia, como microscópios, aviões, motores ou armas.' },
        'Sx': { ko: '성 기관, 성행위, 속옷 등 성(Sex)과 관련된 내용', en: 'Sex-related content like organs, intercourse, lingerie.', ja: '性器、性行為、下着など、性(Sex)に関連する内容。', es: 'Contenido Sexual como órganos, actos, lencería.', pt: 'Conteúdo sexual como órgãos sexuais, ato sexual ou lingerie.' },
        'Xy': { ko: '엑스레이, MRI, 골격 사진(X-ray) 등', en: 'X-ray, MRI, skeletal images.', ja: 'X線、MRI、骨格写真(X-ray)など。', es: 'Rayos X, resonancias magnéticas, imágenes esqueléticas.', pt: 'Raio-X, ressonância magnética ou imagens esqueléticas.' }
    },
    'Popular': {
        'P': { ko: '해당 반점 영역에서 규준 집단의 1/3 이상이 보고하는 문화적으로 매우 흔한 평범 반응', en: 'Popular response reported by 1/3+ of the normative group for that blot area.', ja: '当該ブロット領域で、規準集団の1/3以上が報告する文化的に非常に一般的な平凡反応。', es: 'Respuesta Popular reportada por 1/3+ del grupo normativo en esa área.', pt: 'Resposta Popular relatada por mais de 1/3 do grupo normativo nessa área da mancha.' }
    },
    'Z': {
        'ZW': { ko: '반점 전체(W)를 사용하면서 발달질이 양호(+, o, v/+)하여 조직화 점수가 부여되는 경우', en: 'Z score given for Whole (W) usage with good developmental quality (+, o, v/+).', ja: 'ブロット全体(W)を用い、発達水準が良好(+, o, v/+)であるため体制化得点が与えられる場合。', es: 'Puntuación Z por uso Global (W) con buena calidad evolutiva (+, o, v/+).', pt: 'Pontuação Z atribuída quando há uso Global (W) com boa qualidade evolutiva (+, o, v/+).' },
        'ZA': { ko: '서로 인접한(Adjacent) 두 개 이상의 영역을 의미 있게 통합하여 반응을 형성', en: 'Meaningful integration of two or more Adjacent areas.', ja: '互いに隣接する(Adjacent)二つ以上の領域を意味のある形で統合して反応を形成した場合。', es: 'Integración significativa de dos o más áreas Adyacentes.', pt: 'Integração significativa de duas ou mais áreas adjacentes.' },
        'ZD': { ko: '서로 인접하지 않고 떨어져 있는(Distant) 두 개 이상의 영역을 의미 있게 통합', en: 'Meaningful integration of two or more Distant (non-adjacent) areas.', ja: '互いに隣接せず離れている(Distant)二つ以上の領域を意味のある形で統合した場合。', es: 'Integración significativa de dos o más áreas Distantes (no adyacentes).', pt: 'Integração significativa de duas ou mais áreas distantes (não adjacentes).' },
        'ZS': { ko: '흰 공간(S)을 다른 영역과 의미 있게 통합(Space)하여 반응을 형성', en: 'Meaningful integration of white Space (S) with other areas.', ja: '白地空間(S)を他の領域と意味のある形で統合(Space)して反応を形成した場合。', es: 'Integración significativa del Espacio en blanco (S) con otras áreas.', pt: 'Integração significativa do espaço em branco (S) com outras áreas.' }
    },
    'Special': { // 'Special Score' mapping to 'Special'
        'DV1': { ko: '부적절하거나 독특한 단어를 사용했으나 의미 전달은 가능한 경미한 언어 일탈', en: 'Mild verbal slippage using inappropriate words but meaning is clear (Deviant Verbalization).', ja: '不適切または独特な語を用いているが、意味伝達は可能な軽度の言語逸脱。', es: 'Desliz verbal leve usando palabras inapropiadas, pero el significado es claro.', pt: 'Deslize verbal leve com uso de palavras inadequadas, mas com sentido compreensível.' },
        'DV2': { ko: '의미를 알 수 없는 신조어를 쓰거나 심각하게 부적절한 단어를 사용한 심각한 언어 일탈', en: 'Severe verbal slippage using neologisms or grossly inappropriate words.', ja: '意味の分からない新造語を用いたり、著しく不適切な語を使用した重度の言語逸脱。', es: 'Desliz verbal severo usando neologismos o palabras gravemente inapropiadas.', pt: 'Deslize verbal grave com uso de neologismos ou palavras claramente inadequadas.' },
        'INCOM1': { ko: '하나의 대상 내에 불가능한 속성을 결합(예: 빨간 곰)했으나 정도가 경미한 경우', en: 'Mild combination of impossible features in one object (e.g., red bear) (Incongruous Combination).', ja: '一つの対象の中に不可能な属性を結びつけた(例: 赤い熊)が、その程度が軽い場合。', es: 'Combinación leve de características imposibles en un objeto (ej., oso rojo).', pt: 'Combinação leve de características impossíveis em um único objeto (ex.: urso vermelho).' },
        'INCOM2': { ko: '하나의 대상 내에 기괴하고 불가능한 속성을 결합(예: 날개 달린 남자)한 심각한 경우', en: 'Severe/bizarre combination of impossible features (e.g., winged man).', ja: '一つの対象の中に奇怪で不可能な属性を結びつけた(例: 翼のある男)重度の場合。', es: 'Combinación severa/bizarra de características imposibles (ej., hombre alado).', pt: 'Combinação severa e bizarra de características impossíveis em um único objeto (ex.: homem com asas).' },
        'DR1': { ko: '질문과 무관한 이야기를 하거나 주제에서 경미하게 벗어난 일탈적 반응', en: 'Deviant Response wandering slightly off-topic or irrelevant details.', ja: '質問と無関係な話をしたり、主題からわずかに逸れた逸脱反応。', es: 'Respuesta Desviada que se aparta ligeramente del tema o detalles irrelevantes.', pt: 'Resposta desviada que se afasta levemente do tema ou inclui detalhes irrelevantes.' },
        'DR2': { ko: '완전히 엉뚱한 대답을 하거나 사고의 흐름이 기괴하게 단절된 심각한 일탈적 반응', en: 'Severe deviation with totally irrelevant answers or bizarre disjointed thought.', ja: '完全に的外れな返答をしたり、思考の流れが奇怪に断絶した重度の逸脱反応。', es: 'Desviación severa con respuestas totalmente irrelevantes o pensamiento bizarro.', pt: 'Desvio severo com respostas totalmente irrelevantes ou pensamento bizarro e desconexo.' },
        'FABCOM1': { ko: '두 대상 간의 관계가 비현실적이지만(예: 토끼가 춤을 춤) 정도가 경미한 결합', en: 'Implausible relationship between objects (e.g., dancing rabbits), but mild (Fabulized Combination).', ja: '二つの対象間の関係が非現実的(例: うさぎが踊る)だが、その程度が軽い結合。', es: 'Relación inverosímil entre objetos (ej., conejos bailando), pero leve.', pt: 'Relação inverossímil entre objetos (ex.: coelhos dançando), mas de intensidade leve.' },
        'FABCOM2': { ko: '두 대상 간의 관계가 기괴하고 불가능한(예: 두 사람이 심장을 공유함) 심각한 결합', en: 'Bizarre and impossible relationship between objects (e.g., two people sharing a heart).', ja: '二つの対象間の関係が奇怪かつ不可能(例: 二人が一つの心臓を共有する)な重度の結合。', es: 'Relación bizarra e imposible entre objetos (ej., dos personas comparten un corazón).', pt: 'Relação bizarra e impossível entre objetos (ex.: duas pessoas compartilhando um coração).' },
        'ALOG': { ko: '반응의 이유를 설명할 때 인과관계가 맞지 않거나 억지스러운 논리(Illogical)를 사용', en: 'Uses forced or causal logic that doesn\'t make sense to explain a response (Alogic).', ja: '反応の理由を説明する際、因果関係が成り立たない、またはこじつけの論理(Illogical)を用いること。', es: 'Usa lógica forzada o causal que no tiene sentido para explicar una respuesta.', pt: 'Uso de lógica forçada ou causal que não faz sentido para justificar uma resposta.' },
        'CONTAM': { ko: '두 가지 지각이 융합되어 현실에 없는 기괴한 단일 대상을 형성(Contamination)', en: 'Two perceptions fuse to form a single bizarre object not found in reality (Contamination).', ja: '二つの知覚が融合し、現実には存在しない奇怪な単一対象を形成すること(Contamination)。', es: 'Dos percepciones se fusionan para formar un objeto bizarro que no existe en la realidad.', pt: 'Duas percepções se fundem para formar um único objeto bizarro que não existe na realidade.' },
        'AB': { ko: '반점의 형태를 인간의 감정이나 추상적 개념(예: 우울함, 분노)으로 상징화(Abstraction)', en: 'Symbolizing blot form as human emotion or abstract concept (e.g., depression) (Abstraction).', ja: 'ブロットの形態を人間の感情や抽象的概念(例: 憂うつ、怒り)として象徴化すること(Abstraction)。', es: 'Simbolizar la forma de la mancha como emoción humana o concepto abstracto.', pt: 'Simbolização da forma da mancha como emoção humana ou conceito abstrato.' },
        'AG': { ko: '싸움, 파괴, 위협 등 현재 수행 중인 명백한 공격적 움직임(Aggression)이 묘사됨', en: 'Description of clear Aggressive movement like fighting, destroying, threatening.', ja: 'けんか、破壊、脅威など、現在進行中の明白な攻撃的運動(Aggression)が描写されていること。', es: 'Descripción de movimiento Agresivo claro como pelear, destruir.', pt: 'Descrição de movimento claramente agressivo, como luta, destruição ou ameaça.' },
        'COP': { ko: '두 대상이 긍정적이고 협력적인 상호작용(Cooperation)을 하고 있음이 명백히 묘사됨', en: 'Clear description of positive, Cooperative interaction between two objects.', ja: '二つの対象が肯定的で協力的な相互作用(Cooperation)をしていることが明白に描写されていること。', es: 'Descripción clara de interacción positiva y Cooperativa entre dos objetos.', pt: 'Descrição clara de interação positiva e cooperativa entre dois objetos.' },
        'CP': { ko: '무채색(흑백) 반점에서 존재하지 않는 유채색을 투사(Color Projection)하여 지각', en: 'Perceiving chromatic color projected onto an achromatic blot (Color Projection).', ja: '無彩色(白黒)のブロットに存在しない有彩色を投射(Color Projection)して知覚すること。', es: 'Percibir color cromático proyectado en una mancha acromática.', pt: 'Percepção de cor cromática projetada sobre uma mancha acromática.' },
        'GHR': { ko: '적응적이고 현실적인 대인관계 지각을 나타내는 인간 표상(Good Human Representation)', en: 'Human representation indicating adaptive, realistic interpersonal perception.', ja: '適応的で現実的な対人知覚を示す人間表象(Good Human Representation)。', es: 'Representación humana que indica percepción interpersonal adaptativa.', pt: 'Representação humana que indica percepção interpessoal adaptativa e realista.' },
        'MOR': { ko: '대상이 죽었거나 파괴되었거나 손상된 특징 혹은 우울/불쾌한 감정(Morbid)이 포함됨', en: 'Object is dead, destroyed, damaged, or includes dysphoric feeling (Morbid).', ja: '対象が死んでいる、破壊されている、損傷している、または憂うつ・不快な感情(Morbid)を含むこと。', es: 'El objeto está muerto, destruido, dañado o incluye sentimiento disfórico.', pt: 'O objeto está morto, destruído, danificado ou inclui sentimento disfórico.' },
        'PER': { ko: '반응을 정당화하기 위해 개인적인 경험이나 지식을 구체적으로 언급(Personalization)', en: 'Citing personal experience/knowledge to justify a response (Personalization).', ja: '反応を正当化するため、個人的な経験や知識を具体的に持ち出すこと(Personalization)。', es: 'Citar experiencia/conocimiento personal para justificar una respuesta.', pt: 'Citação de experiência ou conhecimento pessoal para justificar uma resposta.' },
        'PHR': { ko: '왜곡되거나 손상된 대인관계 지각을 나타내는 인간 표상(Poor Human Representation)', en: 'Human representation indicating distorted or damaged interpersonal perception.', ja: '歪んだ、または損傷した対人知覚を示す人間表象(Poor Human Representation)。', es: 'Representación humana que indica percepción interpersonal distorsionada.', pt: 'Representação humana que indica percepção interpessoal distorcida ou danificada.' },
        'PSV': { ko: '이전의 반응 내용을 부적절하게 반복하거나 같은 위치/단어를 기계적으로 반복(Perseveration)', en: 'Inappropriate repetition of previous content or mechanical repetition (Perseveration).', ja: '直前の反応内容を不適切に反復したり、同じ位置や語を機械的に繰り返すこと(Perseveration)。', es: 'Repetición inapropiada de contenido previo o repetición mecánica.', pt: 'Repetição inadequada de conteúdo anterior ou repetição mecânica perseverativa.' }
    }
};

const processedCodeData: Record<Code, InfoTranslation> = {};

// Helper to process codes
const processCodes = (categoryKey: string, codes: string[]) => {
    for (const code of codes) {
        if (rawGasCodeData[categoryKey] && rawGasCodeData[categoryKey][code]) {
            processedCodeData[code as Code] = {
                docs: {
                    ko: { title: code, description: rawGasCodeData[categoryKey][code].ko },
                    en: { title: code, description: rawGasCodeData[categoryKey][code].en },
                    ja: { title: code, description: rawGasCodeData[categoryKey][code].ja },
                    es: { title: code, description: rawGasCodeData[categoryKey][code].es },
                    pt: { title: code, description: rawGasCodeData[categoryKey][code].pt },
                }
            };
        } else {
            // Placeholder for missing codes, or for codes that are expected but not in rawGasCodeData
            // This ensures all Code enum values have an entry.
            processedCodeData[code as Code] = {
                docs: {
                    ko: { title: code, description: `[${code}] 설명이 누락되었습니다.` },
                    en: { title: code, description: `[${code}] description is missing.` },
                    ja: { title: code, description: `[${code}] の説明がありません。` },
                    es: { title: code, description: `[${code}] falta descripción.` },
                    pt: { title: code, description: `[${code}] descrição ausente.` },
                }
            };
        }
    }
};

// Process Card codes
processCodes('Card', ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']);

// Process Location codes
processCodes('Location', ['W', 'WS', 'D', 'DS', 'Dd', 'DdS', 'S']);

// Process DQ codes
processCodes('DQ', ['+', 'o', 'v/+', 'v']);

// Process Determinants codes
// Include all Determinant codes from types/index.ts. Fill from rawGasCodeData, or use placeholders.
// The list from gas/index.html was incomplete.
processCodes('Determinants', [
    'F', 'M', 'Ma', 'Ma-p', 'Mp', 'FM', 'FMa', 'FMa-p', 'FMp', 'm', 'ma', 'ma-p', 'mp',
    'FC', 'CF', 'C', 'Cn', "FC'", "C'F", "C'", 'FT', 'TF', 'T', 'FV', 'VF', 'V', 'FY',
    'YF', 'Y', 'FD', 'Fr', 'rF'
]);
// Add specific descriptions for FMa-p and ma-p as they were in previous context, but gas data is missing some details.
// These need to be manually defined here as they are not explicitly present in the gas `rawGasCodeData.Determinants` map with their own entries.
// The rawGasCodeData for Determinants had them mixed in the general Determinants description.
processedCodeData['FMa-p'] = {
  docs: {
    ko: { title: 'FMa-p', description: '동물 움직임(FM) 내에 능동(a)과 수동(p)의 에너지가 공존하는 경우' },
    en: { title: 'FMa-p', description: 'Animal Movement (FM) containing both active (a) and passive (p) energy.' },    ja: { title: 'FMa-p', description: '動物運動(FM)の中に能動(a)と受動(p)のエネルギーが共存する場合。' },
    es: { title: 'FMa-p', description: 'Movimiento Animal (FM) que contiene energía activa (a) y pasiva (p).' },    pt: { title: 'FMa-p', description: 'Movimento Animal (FM) em que coexistem energias ativa (a) e passiva (p).' },
  },
};
processedCodeData['ma-p'] = {
  docs: {
    ko: { title: 'ma-p', description: '무생물 움직임(m) 내에 능동(a)과 수동(p)의 에너지가 공존하는 경우' },
    en: { title: 'ma-p', description: 'Inanimate Movement (m) containing both active (a) and passive (p) energy.' },    ja: { title: 'ma-p', description: '無生物運動(m)の中に能動(a)と受動(p)のエネルギーが共存する場合。' },
    es: { title: 'ma-p', description: 'Movimiento Inanimado (m) que contiene energía activa (a) y pasiva (p).' },    pt: { title: 'ma-p', description: 'Movimento Inanimado (m) em que coexistem energias ativa (a) e passiva (p).' },
  },
};


// Process FQ codes
processCodes('FQ', ['+', 'o', 'u', '-', 'none']);
// Add 's-' specifically for FQ, as it's not in gas/index.html but was in previous code/understanding.
processedCodeData['s-'] = {
    docs: {
        ko: { title: 's-', description: '흰 공간(S)을 사용했으나 형태적 적합도가 심하게 왜곡된(Minus) 경우를 별도로 표기' },
        en: { title: 's-', description: 'White Space (S) used, but form quality severely distorted (Minus).' },        ja: { title: 's-', description: '白い空間(S)を使用したが、形態適合度が著しく歪められた(Minus)場合を別途表記。' },
        es: { title: 's-', description: 'Espacio en blanco (S) usado, pero con la calidad formal severamente distorsionada (Menos).' },        pt: { title: 's-', description: 'Espaço em branco (S) usado, mas com a qualidade formal severamente distorcida (Menos).' },
    }
};


// Process Pair codes
processCodes('Pair', ['(2)']);

// Process Contents codes
processCodes('Contents', [
    'H', '(H)', 'Hd', '(Hd)', 'Hx', 'A', '(A)', 'Ad', '(Ad)', 'An', 'Art', 'Ay', 'Bl',
    'Bt', 'Cg', 'Cl', 'Ex', 'Fd', 'Fi', 'Ge', 'Hh', 'Id', 'Ls', 'Na', 'Sc', 'Sx', 'Xy'
]);

// Process Popular codes
processCodes('Popular', ['P']);

// Process Z codes
processCodes('Z', ['ZW', 'ZA', 'ZD', 'ZS']);

// Process G/PHR codes
processCodes('G/PHR', ['GHR', 'PHR']);

// Process Special Score codes (using 'Special' key from gas_items)
processCodes('Special', [
    'DV1', 'DV2', 'INCOM1', 'INCOM2', 'DR1', 'DR2', 'FABCOM1', 'FABCOM2', 'ALOG', 'CONTAM',
    'AB', 'AG', 'COP', 'CP', 'MOR', 'PER', 'PSV'
]);


export const codeDescriptions: Record<Code, InfoTranslation> = processedCodeData;

export const getCategoryName = (category: Category, lang: Language): string => {
  const infoCategory = INFO_CATEGORIES_MAP[category];
  return categoryNames[infoCategory]?.[lang] ?? category;
};

export const getCategoryDescription = (
  category: InfoCategory,
  lang: Language
): string => {
  return categoryDescriptions[category]?.[lang] ?? '';
};

export const getCodeDescription = (
  code: Code,
  lang: Language
): Gtm | Docs | null => {
  const translation = codeDescriptions[code];
  if (!translation) return null;

  if ('gtm' in translation) {
    return {
      title: translation.gtm?.[lang]?.title ?? '',
      description: translation.gtm?.[lang]?.description ?? '',
    };
  }
  if ('docs' in translation) {
    return {
      title: translation.docs?.[lang]?.title ?? '',
      description: translation.docs?.[lang]?.description ?? '',
    };
  }
  return null;
};
