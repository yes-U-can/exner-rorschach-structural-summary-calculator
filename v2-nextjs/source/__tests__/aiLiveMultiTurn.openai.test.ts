import { describe, expect, it } from 'vitest';
import { buildSystemPrompt, type KnowledgeItem } from '@/lib/chatKnowledge';
import { buildCodingAssistSystemPrompt } from '@/lib/chatPrompts';
import { buildInterpretationGuardrailPrompt } from '@/lib/interpretationGuardrails';
import { DEFAULT_PROVIDER_MODEL_IDS } from '@/lib/aiModels';
import {
  appendAiResponsePolicyPrompt,
  createOpenAITextStream,
  getAiPromptProfile,
  type AiModelMessage,
  type AiWorkflowMode,
  type OpenAITextStreamUsage,
} from '@/lib/ai/harness';
import { evaluateAiMultiTurnTranscript } from '@/lib/ai/evalMultiTurnContracts';
import {
  getAiMultiTurnEvalFixtures,
  type AiMultiTurnEvalFixture,
} from '@/lib/ai/evalMultiTurnFixtures';
import type { CodingAssistContext } from '@/types';
import { type CodingRuleChunk } from '@/lib/codingAssistKnowledge';
import {
  getHybridCodingRuleChunks,
  getHybridInterpretationKnowledge,
} from '@/lib/referenceHybridRetrieval';

const apiKey = process.env.OPENAI_API_KEY?.trim() || undefined;
const liveEvalModel = process.env.OPENAI_LIVE_EVAL_MODEL ?? DEFAULT_PROVIDER_MODEL_IDS.openai;
const liveEvalLocale = process.env.OPENAI_LIVE_EVAL_LOCALE;
const liveEvalWorkflow = process.env.OPENAI_LIVE_EVAL_WORKFLOW as AiWorkflowMode | undefined;
const liveEvalRetrievalMode = process.env.OPENAI_LIVE_EVAL_RETRIEVAL ?? 'fixture';
const liveEvalMaxOutputTokens = Number.parseInt(process.env.OPENAI_LIVE_EVAL_MAX_OUTPUT_TOKENS ?? '', 10);
const liveEvalIds = new Set(
  (process.env.OPENAI_LIVE_EVAL_IDS ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean),
);
const liveEvalLimit = Number.parseInt(
  process.env.OPENAI_LIVE_EVAL_LIMIT ?? String(liveEvalIds.size || 1),
  10,
);

const emptyCodes = {
  location: '',
  dq: '',
  determinants: [],
  fq: '',
  pair: '',
  contents: [],
  popular: false,
  z: '',
  specialScores: [],
};

function getCodingFixtureMaterial(fixture: AiMultiTurnEvalFixture): {
  card: string;
  responseMemo: string;
  ruleChunks: CodingRuleChunk[];
} {
  if (fixture.id.includes('movement')) {
    return {
      card: 'III',
      responseMemo: 'Two people are described, but the first memo does not yet say what they are doing.',
      ruleChunks: [
        {
          id: 'rule:M',
          title: 'Human movement',
          text: 'Human movement candidates require evidence of a human or human-like figure engaged in an action. If the response detail is ambiguous, ask what the figure is doing before treating M as a strong code.',
          categoryTags: ['determinants', 'M'],
          canonicalRoute: 'scoring-input/determinants/M',
          relatedRoutes: [],
          routeScope: 'primary' as const,
        },
      ],
    };
  }

  return {
    card: 'V',
    responseMemo: 'The respondent only said it looked like an animal shape, without describing contour fit or specific form details.',
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

type PreparedSystemMessage = {
  message: AiModelMessage;
  retrievalMode: 'fixture' | 'lexical' | 'hybrid';
  vectorHitCount: number;
};

function getCodingTurnResponseMemo(fixture: AiMultiTurnEvalFixture, turnIndex: number) {
  const material = getCodingFixtureMaterial(fixture);
  if (turnIndex === 0) return material.responseMemo;
  return fixture.id.includes('movement')
    ? 'Two people dancing.'
    : 'An animal shape; no contour or form-fit detail is recorded.';
}

function buildCodingAssistContext(
  fixture: AiMultiTurnEvalFixture,
  turnIndex: number,
): CodingAssistContext {
  const material = getCodingFixtureMaterial(fixture);
  const focusRowIndex = Math.min(turnIndex, 1);
  const sheetRows = [0, 1].map((rowIndex) => ({
    rowIndex,
    card: material.card,
    responseMemo: getCodingTurnResponseMemo(fixture, rowIndex),
    existingCodes: emptyCodes,
  }));
  const focusRow = sheetRows[focusRowIndex];

  return {
    rowIndex: focusRowIndex,
    focusRowIndex,
    selectedRowIndices: [focusRowIndex],
    card: focusRow.card,
    responseMemo: focusRow.responseMemo,
    existingCodes: focusRow.existingCodes,
    sheetRows,
  };
}

async function buildCodingAssistSystemMessage(
  fixture: AiMultiTurnEvalFixture,
  turnIndex: number,
): Promise<PreparedSystemMessage> {
  const material = getCodingFixtureMaterial(fixture);
  const context = buildCodingAssistContext(fixture, turnIndex);
  const currentUserMessage = fixture.turns[turnIndex]?.userMessage ?? '';
  const retrievalContext: CodingAssistContext = {
    ...context,
    responseMemo: `${context.responseMemo}\n${currentUserMessage}`.trim(),
  };
  const profile = getAiPromptProfile(fixture.workflowMode);
  const retrieval = liveEvalRetrievalMode === 'runtime'
    ? await getHybridCodingRuleChunks({
        context: retrievalContext,
        lang: fixture.locale,
        provider: 'openai',
        apiKey: apiKey!,
        limit: 6,
      })
    : null;
  const ruleChunks = retrieval?.items ?? material.ruleChunks;

  return {
    message: {
      role: 'system',
      content: appendAiResponsePolicyPrompt(
        buildCodingAssistSystemPrompt({
          lang: fixture.locale,
          context,
          ruleChunks,
        }),
        profile,
      ),
    },
    retrievalMode: retrieval?.mode ?? 'fixture',
    vectorHitCount: retrieval?.vectorHitCount ?? 0,
  };
}

async function buildInterpretationSystemMessage(
  fixture: AiMultiTurnEvalFixture,
  turnIndex: number,
): Promise<PreparedSystemMessage> {
  const fixtureKnowledge: KnowledgeItem[] = [
    {
      id: 'chunk:clinical-boundary',
      title: 'Interpretive boundaries',
      content: 'Rorschach structural-summary findings should be framed as provisional hypotheses. They do not establish diagnosis, treatment planning, legal conclusions, or forensic determinations by themselves.',
      source: 'builtin',
      locale: fixture.locale,
      canonicalRoute: 'result-interpretation/core/boundaries',
    },
    {
      id: 'chunk:missing-data',
      title: 'Missing data boundary',
      content: 'When values are absent, describe what the variable can mean in general and ask for the actual Structural Summary values before drawing a case-specific conclusion.',
      source: 'builtin',
      locale: fixture.locale,
      canonicalRoute: 'result-interpretation/core/evidence-style',
    },
  ];
  const query = fixture.turns
    .slice(0, turnIndex + 1)
    .map((turn) => turn.userMessage)
    .join('\n');
  const retrieval = liveEvalRetrievalMode === 'runtime'
    ? await getHybridInterpretationKnowledge({
        query,
        lang: fixture.locale,
        provider: 'openai',
        apiKey: apiKey!,
        limit: 5,
      })
    : null;
  const knowledge = retrieval?.items ?? fixtureKnowledge;
  const profile = getAiPromptProfile(fixture.workflowMode);

  return {
    message: {
      role: 'system',
      content: appendAiResponsePolicyPrompt(
        buildSystemPrompt(buildInterpretationGuardrailPrompt(fixture.locale), knowledge),
        profile,
      ),
    },
    retrievalMode: retrieval?.mode ?? 'fixture',
    vectorHitCount: retrieval?.vectorHitCount ?? 0,
  };
}

function buildTurnSystemMessage(fixture: AiMultiTurnEvalFixture, turnIndex: number) {
  return fixture.workflowMode === 'coding_assist'
    ? buildCodingAssistSystemMessage(fixture, turnIndex)
    : buildInterpretationSystemMessage(fixture, turnIndex);
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

  return Math.min(profileMaxOutputTokens, 800);
}

function addUsage(left: OpenAITextStreamUsage, right: OpenAITextStreamUsage | undefined) {
  return {
    inputTokens: (left.inputTokens ?? 0) + (right?.inputTokens ?? 0),
    outputTokens: (left.outputTokens ?? 0) + (right?.outputTokens ?? 0),
    totalTokens: (left.totalTokens ?? 0) + (right?.totalTokens ?? 0),
  };
}

const liveFixtures = getAiMultiTurnEvalFixtures()
  .filter((fixture) => (liveEvalLocale ? fixture.locale === liveEvalLocale : liveEvalIds.size ? true : fixture.locale === 'en'))
  .filter((fixture) => (liveEvalWorkflow ? fixture.workflowMode === liveEvalWorkflow : true))
  .filter((fixture) => (liveEvalIds.size ? liveEvalIds.has(fixture.id) : true))
  .slice(0, liveEvalLimit);

describe.runIf(apiKey && liveFixtures.length > 0)('OpenAI live AI multi-turn harness eval', () => {
  it.each(liveFixtures)(
    'completes multi-turn fixture $id without losing harness boundaries',
    async (fixture) => {
      const profile = getAiPromptProfile(fixture.workflowMode);
      const conversation: AiModelMessage[] = [];
      const retrievalEvidence: PreparedSystemMessage[] = [];
      const outputs: string[] = [];
      let outputChars = 0;
      let usage: OpenAITextStreamUsage = {};
      let status: string = 'completed';
      let incompleteReason: string | null = null;

      for (let turnIndex = 0; turnIndex < fixture.turns.length; turnIndex += 1) {
        const turn = fixture.turns[turnIndex];
        const prepared = await buildTurnSystemMessage(fixture, turnIndex);
        retrievalEvidence.push(prepared);
        const userMessage: AiModelMessage = { role: 'user', content: turn.userMessage };
        const result = await createOpenAITextStream({
          apiKey: apiKey!,
          model: liveEvalModel,
          maxOutputTokens: getLiveEvalMaxOutputTokens(profile.maxOutputTokens),
          messages: [prepared.message, ...conversation, userMessage],
        });
        const output = await readStream(result.stream);
        const completion = await result.completion;

        outputs.push(output);
        conversation.push(userMessage, { role: 'assistant', content: output });
        outputChars += output.trim().length;
        usage = addUsage(usage, completion.usage);

        if (completion.status !== 'completed' && status === 'completed') {
          status = completion.status;
          incompleteReason = completion.incompleteReason ?? completion.errorMessage ?? null;
        }
      }

      const contract = evaluateAiMultiTurnTranscript(fixture, outputs);
      const issueTypes = [...new Set(contract.issues.map((issue) => issue.type))];
      const retrievalMode: PreparedSystemMessage['retrievalMode'] = retrievalEvidence.every(
        (evidence) => evidence.retrievalMode === 'hybrid',
      )
        ? 'hybrid'
        : retrievalEvidence.some((evidence) => evidence.retrievalMode === 'lexical')
          ? 'lexical'
          : 'fixture';
      const vectorHitCount = retrievalEvidence.reduce(
        (sum, evidence) => sum + evidence.vectorHitCount,
        0,
      );

      console.info(
        JSON.stringify({
          fixtureId: fixture.id,
          model: liveEvalModel,
          status,
          incompleteReason,
          outputChars,
          issueTypes,
          usage,
          turnCount: fixture.turns.length,
          retrievalMode,
          vectorHitCount,
          retrievalTurnCount: retrievalEvidence.length,
        }),
      );
      expect(status).toBe('completed');
      expect(outputChars).toBeGreaterThan(160);
      if (liveEvalRetrievalMode === 'runtime') {
        for (const evidence of retrievalEvidence) {
          expect(evidence.retrievalMode).toBe('hybrid');
          expect(evidence.vectorHitCount).toBeGreaterThan(0);
        }
      }
      expect(contract.passed, contract.issues.map((issue) => issue.message).join('; ')).toBe(true);
    },
    120_000,
  );
});

describe.runIf(apiKey && liveFixtures.length === 0)('OpenAI live AI multi-turn harness eval', () => {
  it('skips when the active live-eval filters match no multi-turn fixtures', () => {
    expect(liveFixtures).toHaveLength(0);
  });
});

describe.skipIf(apiKey)('OpenAI live AI multi-turn harness eval', () => {
  it('skips when OPENAI_API_KEY is not present', () => {
    expect(apiKey).toBeUndefined();
  });
});
