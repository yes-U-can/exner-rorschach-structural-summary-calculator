import { describe, expect, it } from 'vitest';
import { buildSystemPrompt, type KnowledgeItem } from '@/lib/chatKnowledge';
import { buildCodingAssistSystemPrompt } from '@/lib/chatPrompts';
import { DEFAULT_INTERPRETATION_GUARDRAIL_PROMPT } from '@/lib/interpretationGuardrails';
import { appendAiResponsePolicyPrompt, getAiPromptProfile } from '@/lib/ai/harness';
import type { CodingRuleChunk } from '@/lib/codingAssistKnowledge';
import type { CodingAssistContext } from '@/types';

const emptyCodes = {
  location: '',
  dq: '',
  determinants: [],
  fq: '',
  pair: false,
  contents: [],
  popular: false,
  z: '',
  specialScores: [],
};

describe('AI prompt contracts', () => {
  it('keeps interpretation prompts bounded, provisional, and reference-grounded', () => {
    const knowledge: KnowledgeItem[] = [
      {
        id: 'chunk:core-d',
        title: 'D and AdjD',
        content: 'D and AdjD should be reviewed as stress tolerance indicators, not diagnosis.',
        source: 'builtin',
        locale: 'ko',
        canonicalRoute: 'result-interpretation/lower-section/core/d',
      },
    ];
    const prompt = appendAiResponsePolicyPrompt(
      buildSystemPrompt(DEFAULT_INTERPRETATION_GUARDRAIL_PROMPT, knowledge),
      getAiPromptProfile('interpretation'),
    );

    expect(prompt).toContain('Do not present yourself as a diagnostic authority');
    expect(prompt).toContain('Use only the reference corpus provided in the current prompt');
    expect(prompt).toContain('Treat every answer as a professional review draft');
    expect(prompt).toContain('Rorschach data alone cannot establish a diagnosis.');
    expect(prompt).toContain('the data alone cannot diagnose, confirm, or determine the condition');
    expect(prompt).toContain('you cannot provide a treatment plan from Rorschach scores alone');
    expect(prompt).toContain('you cannot determine dangerousness, legal risk, or forensic status');
    expect(prompt).toContain('Keep diagnostic, treatment, medication, legal, and forensic conclusions out of scope.');
    expect(prompt).toContain('Finish every section or bullet group you start.');
  });

  it('keeps Korean interpretation style instructions readable', () => {
    expect(DEFAULT_INTERPRETATION_GUARDRAIL_PROMPT).toContain('검사자료');
    expect(DEFAULT_INTERPRETATION_GUARDRAIL_PROMPT).toContain('근거 수치:');
    expect(DEFAULT_INTERPRETATION_GUARDRAIL_PROMPT).toContain('해석 가설:');
    const mojibakeMarkers = [0xfffd, 0x8adb, 0x63f4, 0xf9de, 0x5bc3, 0xd765, 0x79fb, 0x3590, 0xb6a4, 0xc815, 0x81fe, 0x7aca, 0xca0c]
      .map((codePoint) => String.fromCodePoint(codePoint));
    expect(mojibakeMarkers.some((marker) => DEFAULT_INTERPRETATION_GUARDRAIL_PROMPT.includes(marker))).toBe(false);
  });

  it('keeps coding-assist prompts HITL-first and prevents automatic score application', () => {
    const context: CodingAssistContext = {
      rowIndex: 0,
      focusRowIndex: 0,
      selectedRowIndices: [0],
      card: 'I',
      responseMemo: 'A person lifting something.',
      existingCodes: emptyCodes,
      sheetRows: [
        {
          rowIndex: 0,
          card: 'I',
          responseMemo: 'A person lifting something.',
          existingCodes: emptyCodes,
        },
      ],
    };
    const ruleChunks: CodingRuleChunk[] = [
      {
        id: 'rule:M',
        title: 'Human movement',
        text: 'Human movement candidates require evidence of a human or human-like action.',
        categoryTags: ['determinants', 'M'],
        canonicalRoute: 'scoring-input/determinants/M',
        relatedRoutes: [],
        routeScope: 'primary',
      },
    ];

    const prompt = appendAiResponsePolicyPrompt(
      buildCodingAssistSystemPrompt({
        lang: 'en',
        context,
        ruleChunks,
      }),
      getAiPromptProfile('coding_assist'),
    );

    expect(prompt).toContain('Treat all proposed codes as candidates that require clinician confirmation.');
    expect(prompt).toContain('Do not imply that the app can apply your suggestion automatically.');
    expect(prompt).toContain('If the memo lacks needed observation context, ask targeted follow-up questions');
    expect(prompt).toContain('When observation evidence is thin, use candidate/provisional language');
    expect(prompt).toContain('FQnone is only for responses where form is not a codable basis');
    expect(prompt).toContain('For Popular/P specifically, a familiar content label');
    expect(prompt).toContain('For severe special scores such as FABCOM2');
    expect(prompt).toContain('For Popular/P and FQ questions, require the specific percept');
    expect(prompt).toContain('I cannot directly or automatically edit the scoring sheet');
    expect(prompt).toContain('Candidate codes require clinician confirmation.');
    expect(prompt).toContain('Do not claim that the app can apply coding changes automatically.');
  });
});
