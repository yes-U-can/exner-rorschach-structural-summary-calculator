import { describe, expect, it } from 'vitest';
import { buildSystemPrompt, selectRelevantKnowledge, type KnowledgeItem } from '@/lib/chatKnowledge';
import { buildCodingAssistSystemPrompt } from '@/lib/chatPrompts';
import { DEFAULT_INTERPRETATION_GUARDRAIL_PROMPT } from '@/lib/interpretationGuardrails';
import { DEFAULT_PROVIDER_MODEL_IDS } from '@/lib/aiModels';
import {
  appendAiResponsePolicyPrompt,
  createOpenAITextStream,
  getAiPromptProfile,
  type AiWorkflowMode,
} from '@/lib/ai/harness';
import { evaluateAiHarnessOutput } from '@/lib/ai/evalContracts';
import { getAiHarnessEvalFixtures, type AiHarnessEvalFixture } from '@/lib/ai/evalFixtures';
import type { CodingAssistContext } from '@/types';
import { selectCodingRuleChunks, type CodingRuleChunk } from '@/lib/codingAssistKnowledge';

const apiKey = process.env.OPENAI_API_KEY;
const liveEvalModel = process.env.OPENAI_LIVE_EVAL_MODEL ?? DEFAULT_PROVIDER_MODEL_IDS.openai;
const liveEvalLocale = process.env.OPENAI_LIVE_EVAL_LOCALE;
const liveEvalWorkflow = process.env.OPENAI_LIVE_EVAL_WORKFLOW as AiWorkflowMode | undefined;
const liveEvalRetrievalMode = process.env.OPENAI_LIVE_EVAL_RETRIEVAL ?? 'fixture';
const shouldPrintDebugOutput = process.env.OPENAI_LIVE_EVAL_DEBUG_OUTPUT === '1';
const liveEvalMaxOutputTokens = Number.parseInt(process.env.OPENAI_LIVE_EVAL_MAX_OUTPUT_TOKENS ?? '', 10);
const liveEvalIds = new Set(
  (process.env.OPENAI_LIVE_EVAL_IDS ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean),
);
const liveEvalLimit = Number.parseInt(
  process.env.OPENAI_LIVE_EVAL_LIMIT ?? String(liveEvalIds.size || 2),
  10,
);

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

function getCodingFixtureMaterial(fixture: AiHarnessEvalFixture): {
  card: string;
  responseMemo: string;
  ruleChunks: CodingRuleChunk[];
} {
  if (fixture.id.includes('special-score')) {
    return {
      card: 'III',
      responseMemo: 'Two figures are fused into one impossible body and are described as arguing with each other.',
      ruleChunks: [
        {
          id: 'rule:FABCOM2',
          title: 'FABCOM2',
          text: 'FABCOM2 is a severe special-score candidate for clearly bizarre or impossible combinations, relationships, or logic between independently perceived objects. Do not score it as certain unless the response detail clearly supports that level; ask for more detail when the memo is thin.',
          categoryTags: ['specialScores', 'FABCOM2'],
          canonicalRoute: 'scoring-input/special-score/FABCOM2',
          relatedRoutes: [],
          routeScope: 'primary' as const,
        },
      ],
    };
  }

  if (fixture.id.includes('fq')) {
    return {
      card: 'V',
      responseMemo: 'The respondent only said it looked like a bat shape, without describing contour fit or specific form details.',
      ruleChunks: [
        {
          id: 'rule:FQ',
          title: 'Form Quality',
          text: 'FQ candidates depend on the fit between the blot area and the described form. A vague content label alone is not enough to choose a strong FQ value; ask for contour, fit, and form-detail evidence before making a firm recommendation.',
          categoryTags: ['fq'],
          canonicalRoute: 'scoring-input/fq',
          relatedRoutes: [],
          routeScope: 'primary' as const,
        },
      ],
    };
  }

  if (fixture.id.includes('popular')) {
    return {
      card: 'V',
      responseMemo: 'The respondent said this looked like a bat, but the memo does not include the exact location or form details.',
      ruleChunks: [
        {
          id: 'rule:P',
          title: 'Popular',
          text: 'Popular response candidates depend on card-specific common responses and the response details. A familiar content label alone is not enough; confirm that the card, location, and percept match the Popular criteria before treating P as a candidate.',
          categoryTags: ['popular', 'P'],
          canonicalRoute: 'scoring-input/popular',
          relatedRoutes: [],
          routeScope: 'primary' as const,
        },
      ],
    };
  }

  if (fixture.id.includes('z-score')) {
    return {
      card: 'III',
      responseMemo: 'The respondent connected two blot areas into one organized scene, but the memo does not describe how the parts were related.',
      ruleChunks: [
        {
          id: 'rule:Z',
          title: 'Z score',
          text: 'Z score candidates require evidence of organization or meaningful integration among blot areas. Do not give Z from a simple mention of two parts alone; ask how the parts were organized or related.',
          categoryTags: ['z', 'organization'],
          canonicalRoute: 'scoring-input/z',
          relatedRoutes: [],
          routeScope: 'primary' as const,
        },
      ],
    };
  }

  return {
    card: 'I',
    responseMemo: 'A person lifting something, but the memo does not say whether the figure is human or animal-like.',
    ruleChunks: [
      {
        id: 'rule:M',
        title: 'Human movement',
        text: 'Human movement candidates require evidence of a human or human-like figure engaged in an action. If the observed response detail is ambiguous, ask for clarification before treating M as a strong code.',
        categoryTags: ['determinants', 'M'],
        canonicalRoute: 'scoring-input/determinants/M',
        relatedRoutes: [],
        routeScope: 'primary' as const,
      },
    ],
  };
}

function buildCodingAssistMessages(fixture: AiHarnessEvalFixture) {
  const material = getCodingFixtureMaterial(fixture);
  const context: CodingAssistContext = {
    rowIndex: 0,
    focusRowIndex: 0,
    selectedRowIndices: [0],
    card: material.card,
    responseMemo: material.responseMemo,
    existingCodes: emptyCodes,
    sheetRows: [
      {
        rowIndex: 0,
        card: material.card,
        responseMemo: material.responseMemo,
        existingCodes: emptyCodes,
      },
    ],
  };
  const profile = getAiPromptProfile(fixture.workflowMode);
  const ruleChunks =
    liveEvalRetrievalMode === 'runtime'
      ? selectCodingRuleChunks(context, fixture.locale, 6)
      : material.ruleChunks;

  return [
    {
      role: 'system' as const,
      content: appendAiResponsePolicyPrompt(
        buildCodingAssistSystemPrompt({
          lang: fixture.locale,
          context,
          ruleChunks,
        }),
        profile,
      ),
    },
    { role: 'user' as const, content: fixture.userMessage },
  ];
}

function buildInterpretationMessages(fixture: AiHarnessEvalFixture) {
  const fixtureKnowledge: KnowledgeItem[] = [
    {
      id: 'chunk:clinical-boundary',
      title: 'Interpretive boundaries',
      content: 'Rorschach structural-summary findings should be framed as provisional hypotheses. They do not establish diagnosis or treatment planning by themselves.',
      source: 'builtin',
      locale: fixture.locale,
      canonicalRoute: 'result-interpretation/core/boundaries',
    },
    {
      id: 'chunk:evidence-style',
      title: 'Evidence style',
      content: 'Good first-pass interpretation names a small number of data anchors, then states a cautious hypothesis and the limits of the available record.',
      source: 'builtin',
      locale: fixture.locale,
      canonicalRoute: 'result-interpretation/core/evidence-style',
    },
  ];
  const knowledge =
    liveEvalRetrievalMode === 'runtime'
      ? selectRelevantKnowledge(fixture.userMessage, undefined, fixture.locale).slice(0, 5)
      : fixtureKnowledge;
  const profile = getAiPromptProfile(fixture.workflowMode);

  return [
    {
      role: 'system' as const,
      content: appendAiResponsePolicyPrompt(
        buildSystemPrompt(DEFAULT_INTERPRETATION_GUARDRAIL_PROMPT, knowledge),
        profile,
      ),
    },
    { role: 'user' as const, content: fixture.userMessage },
  ];
}

function buildMessages(fixture: AiHarnessEvalFixture) {
  const builders: Record<AiWorkflowMode, (fixture: AiHarnessEvalFixture) => ReturnType<typeof buildCodingAssistMessages>> = {
    coding_assist: buildCodingAssistMessages,
    interpretation: buildInterpretationMessages,
  };

  return builders[fixture.workflowMode](fixture);
}

async function readStream(stream: ReadableStream<Uint8Array>) {
  const decoder = new TextDecoder();
  const reader = stream.getReader();
  let output = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) {
      output += decoder.decode(value, { stream: true });
    }
  }

  output += decoder.decode();
  return output;
}

function getLiveEvalMaxOutputTokens(profileMaxOutputTokens: number) {
  if (Number.isFinite(liveEvalMaxOutputTokens) && liveEvalMaxOutputTokens > 0) {
    return Math.min(profileMaxOutputTokens, liveEvalMaxOutputTokens);
  }

  if (liveEvalModel.startsWith('gpt-5')) {
    return profileMaxOutputTokens;
  }

  return Math.min(profileMaxOutputTokens, 700);
}

const liveFixtures = getAiHarnessEvalFixtures()
  .filter((fixture) => (liveEvalLocale ? fixture.locale === liveEvalLocale : liveEvalIds.size ? true : fixture.locale === 'en'))
  .filter((fixture) => (liveEvalWorkflow ? fixture.workflowMode === liveEvalWorkflow : true))
  .filter((fixture) => (liveEvalIds.size ? liveEvalIds.has(fixture.id) : true))
  .slice(0, liveEvalLimit);

describe.runIf(apiKey && liveFixtures.length > 0)('OpenAI live AI harness eval', () => {
  it.each(liveFixtures)(
    'completes fixture $id without leaking raw content into metadata',
    async (fixture) => {
      const profile = getAiPromptProfile(fixture.workflowMode);
      const result = await createOpenAITextStream({
        apiKey: apiKey!,
        model: liveEvalModel,
        maxOutputTokens: getLiveEvalMaxOutputTokens(profile.maxOutputTokens),
        messages: buildMessages(fixture),
      });

      const output = await readStream(result.stream);
      const completion = await result.completion;
      const contract = evaluateAiHarnessOutput(fixture, output);

      console.info(
        JSON.stringify({
          fixtureId: fixture.id,
          model: liveEvalModel,
          status: completion.status,
          incompleteReason: completion.incompleteReason ?? null,
          outputChars: output.trim().length,
          issueTypes: contract.issues.map((issue) => issue.type),
          usage: completion.usage ?? null,
        }),
      );
      if (shouldPrintDebugOutput) {
        console.info(
          JSON.stringify({
            fixtureId: fixture.id,
            outputPreview: output.trim().slice(0, 1200),
          }),
        );
      }

      expect(completion.status).toBe('completed');
      expect(output.trim().length).toBeGreaterThan(80);
      expect(contract.passed, contract.issues.map((issue) => issue.message).join('; ')).toBe(true);
    },
    60_000,
  );
});

describe.runIf(apiKey && liveFixtures.length === 0)('OpenAI live AI harness eval', () => {
  it('skips when the active live-eval filters match no fixtures', () => {
    expect(liveFixtures).toHaveLength(0);
  });
});

describe.skipIf(apiKey)('OpenAI live AI harness eval', () => {
  it('skips when OPENAI_API_KEY is not present', () => {
    expect(apiKey).toBeUndefined();
  });
});
