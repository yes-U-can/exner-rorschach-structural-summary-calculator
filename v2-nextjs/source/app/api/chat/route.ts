import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { randomUUID } from 'crypto';
import {
  buildSystemPrompt,
  getBuiltInKnowledge,
  KnowledgeItem,
  selectRelevantKnowledge,
} from '@/lib/chatKnowledge';
import type { Language } from '@/types';
import { getDefaultModelForProvider } from '@/lib/aiModels';
import {
  normalizeChatWorkflowMode,
  parseChatWorkflowMode,
  buildChatRetrievalQuery,
  normalizeCodingAssistContext,
  normalizeWorkflowLocale,
} from '@/lib/chatWorkflow';
import { buildCodingAssistSystemPrompt } from '@/lib/chatPrompts';
import {
  buildSupportingInterpretationChunks,
  selectCodingRuleChunks,
} from '@/lib/codingAssistKnowledge';
import { buildSafeApiErrorResponse, logApiError } from '@/lib/apiError';
import { parseJsonWithSizeLimit, REQUEST_BODY_SIZE_POLICIES } from '@/lib/requestBodyGuard';
import { normalizeEphemeralChatContext } from '@/lib/chatEphemeralContext';
import { readByokSessionFromRequest } from '@/lib/byokSession';
import { BYOK_SESSION_MISSING_CODE } from '@/lib/chatApiErrors';
import {
  getHybridCodingRuleChunks,
  getHybridInterpretationKnowledge,
  type RetrievalTraceEntry,
} from '@/lib/referenceHybridRetrieval';
import {
  DEFAULT_INTERPRETATION_GUARDRAIL_PROMPT,
} from '@/lib/interpretationGuardrails';
import { validateStructuralSummaryCsv } from '@/lib/structuralSummaryCsv';

type NormalizedMessage = {
  role: 'ai' | 'user';
  content: string;
};
type ChatRequestMode = 'interpretation' | 'coding_assist';
type RiskFlagLevel = 'none' | 'medium' | 'high';
type RiskFlagType = 'crisis' | 'diagnostic_attempt' | null;
type SafetyAssessment = {
  level: RiskFlagLevel;
  type: RiskFlagType;
  interventionTriggered: boolean;
  interventionType: string | null;
  interventionReason: string | null;
  safeResponse: string | null;
};

function getWorkflowMaxOutputTokens(mode: ChatRequestMode, modelMaxOutputTokens: number) {
  const workflowCap = mode === 'coding_assist' ? 1800 : 950;
  return Math.min(modelMaxOutputTokens, workflowCap);
}

function getStructuralSummaryCsvFromWorkflowContext(input: unknown) {
  if (!input || typeof input !== 'object') return '';
  const candidate = (input as { structuralSummaryCsv?: unknown }).structuralSummaryCsv;
  return typeof candidate === 'string' ? candidate : '';
}

function selectSupportingCodingKnowledge(args: {
  lang: Language;
  query: string;
  primaryItems: KnowledgeItem[];
  limit?: number;
}): KnowledgeItem[] {
  const relatedRoutes = [...new Set(args.primaryItems.flatMap((item) => item.relatedRoutes ?? []))]
    .filter((route) => route.startsWith('scoring-input/'));

  if (!relatedRoutes.length) {
    return [];
  }

  const builtInSubset = getBuiltInKnowledge(args.lang)
    .filter((item) => item.canonicalRoute && relatedRoutes.includes(item.canonicalRoute));

  return selectRelevantKnowledge(args.query, builtInSubset, args.lang)
    .slice(0, args.limit ?? 2);
}

function normalizeIncomingMessage(input: unknown): NormalizedMessage | null {
  if (typeof input !== 'string') {
    return null;
  }

  const content = input.trim();
  if (!content || content.length > 64000) {
    return null;
  }

  return { role: 'user', content };
}

function detectSafetyAssessment(text: string, actorRole: 'user' | 'admin'): SafetyAssessment {
  const normalized = text.toLowerCase();
  const crisisSignals = [
    'suicide',
    'kill myself',
    'self-harm',
    'self harm',
    'want to die',
    'end my life',
    '자살',
    '죽고 싶',
    '죽고싶',
    '자해',
    '나를 해치',
    '스스로 해치',
    '목숨을 끊',
    '극단적 선택',
    '死にたい',
    '自殺',
    '自傷',
    '消えたい',
    '命を絶ち',
    'suicidio',
    'suicidarme',
    'suicid',
    'quitarme la vida',
    'matarme',
    'hacerme daño',
    'quiero morir',
    'suicídio',
    'suicidar',
    'me matar',
    'tirar minha vida',
    'me machucar',
    'quero morrer',
  ];
  const diagnosticAttemptSignals = [
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
  ];

  const hasCrisisSignal = crisisSignals.some((signal) => normalized.includes(signal));
  if (hasCrisisSignal) {
    return {
      level: 'high',
      type: 'crisis',
      interventionTriggered: true,
      interventionType: 'crisis_block',
      interventionReason: 'Possible immediate self-harm or suicide risk signal.',
      safeResponse:
        'I cannot provide crisis intervention. If you may be in immediate danger, please contact local emergency services now. In South Korea, call 1577-0199 for mental health crisis support.',
    };
  }

  if (actorRole === 'user') {
    const hasDiagnosticSignal = diagnosticAttemptSignals.some((signal) => normalized.includes(signal));
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

async function callOpenAI(
  apiKey: string,
  model: string,
  maxOutputTokens: number,
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
) {
  const openai = new OpenAI({ apiKey });

  const instructions = messages
    .filter((message) => message.role === 'system')
    .map((message) => message.content)
    .join('\n\n')
    .trim();
  const input = messages
    .filter((message) => message.role !== 'system')
    .map((message) => ({
      role: message.role === 'assistant' ? 'assistant' as const : 'user' as const,
      content: message.content,
    }));

  const stream = await openai.responses.create({
    model,
    ...(instructions ? { instructions } : {}),
    input,
    max_output_tokens: maxOutputTokens,
    store: false,
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const event of stream) {
        if (event.type === 'response.output_text.delta') {
          controller.enqueue(encoder.encode(event.delta));
          continue;
        }
        if (event.type === 'error') {
          throw new Error(event.message);
        }
        if (event.type === 'response.failed') {
          const message = event.response.error?.message || 'OpenAI response failed.';
          throw new Error(message);
        }
      }
      controller.close();
    },
  });
}

function classifyProviderError(error: unknown): {
  code: string;
  publicMessage: string;
  status: number;
} {
  const candidate = error as {
    status?: number;
    code?: string;
    type?: string;
    message?: string;
    error?: { code?: string; type?: string; message?: string };
  };
  const status = Number(candidate?.status ?? 0);
  const code = String(candidate?.code ?? candidate?.error?.code ?? '').toLowerCase();
  const type = String(candidate?.type ?? candidate?.error?.type ?? '').toLowerCase();
  const message = String(candidate?.message ?? candidate?.error?.message ?? '').toLowerCase();
  const haystack = [code, type, message].join(' ');

  if (status === 401 || haystack.includes('invalid_api_key') || haystack.includes('api key')) {
    return {
      code: 'chat_provider_invalid_api_key',
      publicMessage: 'The API key was rejected by the AI provider.',
      status: 401,
    };
  }

  if (
    status === 402 ||
    status === 429 ||
    haystack.includes('insufficient_quota') ||
    haystack.includes('quota') ||
    haystack.includes('billing') ||
    haystack.includes('payment')
  ) {
    return {
      code: 'chat_provider_quota_or_billing',
      publicMessage: 'The AI provider reported a billing, quota, or rate-limit problem.',
      status: 402,
    };
  }

  if (
    status === 404 ||
    haystack.includes('model_not_found') ||
    (haystack.includes('model') && (
      haystack.includes('does not exist') ||
      haystack.includes('not found') ||
      haystack.includes('not available') ||
      haystack.includes('not supported') ||
      haystack.includes('access')
    ))
  ) {
    return {
      code: 'chat_provider_model_unavailable',
      publicMessage: 'The selected AI model is not available for this API key.',
      status: 502,
    };
  }

  return {
    code: 'chat_provider_request_failed',
    publicMessage: 'AI provider rejected the request. Check your API key access or model availability.',
    status: 502,
  };
}

export async function POST(req: Request) {
  const requestId = randomUUID();

  try {
    const byokSession = readByokSessionFromRequest(req);
    if (!byokSession) {
      return NextResponse.json(
        {
          error: 'API key not found. Start an AI session with your API key and try again.',
          code: BYOK_SESSION_MISSING_CODE,
        },
        { status: 401 },
      );
    }

    const parsedBody = await parseJsonWithSizeLimit<{
      message?: string;
      messages?: unknown;
      contextMessages?: unknown;
      lang?: Language;
      mode?: ChatRequestMode;
      workflowContext?: unknown;
    }>(req, REQUEST_BODY_SIZE_POLICIES.chat);
    if (!parsedBody.ok) {
      return parsedBody.response;
    }

    const body = parsedBody.value;
    if (Array.isArray(body.messages)) {
      return NextResponse.json(
        {
          error: 'Legacy messages[] payload is no longer accepted. Send only the new message text.',
        },
        { status: 400 },
      );
    }

    const userMessage = normalizeIncomingMessage(body.message);
    if (!userMessage) {
      return NextResponse.json(
        { error: 'Invalid message payload. Provide a non-empty message string.' },
        { status: 400 },
      );
    }

    if (body.mode !== undefined && !parseChatWorkflowMode(body.mode)) {
      return NextResponse.json(
        { error: 'Unsupported chat mode. Only interpretation and coding_assist are allowed.' },
        { status: 400 },
      );
    }

    const contextResult = normalizeEphemeralChatContext(body.contextMessages);
    if (!contextResult.ok) {
      return NextResponse.json({ error: contextResult.error }, { status: 400 });
    }

    const workflowMode = normalizeChatWorkflowMode(body.mode);
    const workflowLocale = normalizeWorkflowLocale(body.lang);
    const codingAssistContext =
      workflowMode === 'coding_assist' ? normalizeCodingAssistContext(body.workflowContext) : null;
    if (workflowMode === 'coding_assist' && !codingAssistContext) {
      return NextResponse.json(
        { error: 'Coding assist requires a card and response memo context.' },
        { status: 400 },
      );
    }
    const structuralSummaryCsv =
      workflowMode === 'interpretation'
        ? validateStructuralSummaryCsv(getStructuralSummaryCsvFromWorkflowContext(body.workflowContext))
        : null;
    if (workflowMode === 'interpretation' && (!structuralSummaryCsv || !structuralSummaryCsv.ok)) {
      return NextResponse.json(
        {
          error: 'Invalid structural summary CSV. Copy the values from the calculation result screen.',
          code: 'invalid_structural_summary_csv',
        },
        { status: 400 },
      );
    }

    const provider = byokSession.provider;
    const apiKey = byokSession.apiKey;
    const selectedModel = getDefaultModelForProvider(provider);

    const safety = detectSafetyAssessment(userMessage.content, 'user');

    const normalizedMessages: NormalizedMessage[] = [...contextResult.messages, userMessage];
    const retrievalQuery = buildChatRetrievalQuery({
      mode: workflowMode,
      messages: normalizedMessages,
      maxUserMessages: workflowMode === 'interpretation' ? 3 : 4,
    });

    if (safety.interventionTriggered && safety.safeResponse) {
      logApiError('chat_safety_intervention', requestId, new Error('Safety intervention triggered.'), {
        locale: workflowLocale,
        workflowType: workflowMode,
        riskFlagLevel: safety.level,
        riskFlagType: safety.type,
      });

      const responseHeaders = new Headers();
      responseHeaders.set('X-Chat-Request-Id', requestId);
      responseHeaders.set('X-Chat-Model-Id', selectedModel.id);
      responseHeaders.set('X-Chat-Workflow-Mode', workflowMode);
      responseHeaders.set('X-Chat-Safety-Intervention', 'true');
      return new Response(safety.safeResponse, { headers: responseHeaders });
    }

    const formattedMessages = normalizedMessages.map((m) => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.content,
    }));

    let retrievedDocIds: string[] = [];
    let selectedKnowledge: KnowledgeItem[] = [];
    let fullSystemPrompt = '';
    let retrievalMode: 'none' | 'lexical' | 'hybrid' = 'none';
    let vectorHitCount = 0;
    let retrievalTrace: RetrievalTraceEntry[] = [];

    if (workflowMode === 'interpretation') {
      const hybridKnowledge = await getHybridInterpretationKnowledge({
        query: retrievalQuery || userMessage.content,
        lang: workflowLocale,
        provider,
        apiKey,
      });
      const primaryKnowledge = hybridKnowledge.items;
      retrievalMode = hybridKnowledge.mode;
      vectorHitCount = hybridKnowledge.vectorHitCount;
      retrievalTrace = hybridKnowledge.trace.slice(0, 4);
      selectedKnowledge = primaryKnowledge;
      if (!selectedKnowledge.length) {
        selectedKnowledge = selectRelevantKnowledge(
          retrievalQuery || userMessage.content,
          undefined,
          workflowLocale,
        );
      }
      const supportingKnowledge = selectSupportingCodingKnowledge({
        lang: workflowLocale,
        query: retrievalQuery || userMessage.content,
        primaryItems: selectedKnowledge,
      });
      selectedKnowledge = [...selectedKnowledge, ...supportingKnowledge]
        .filter((item, index, items) => {
          const key = item.id ?? item.canonicalRoute ?? item.title;
          return items.findIndex((candidate) => (candidate.id ?? candidate.canonicalRoute ?? candidate.title) === key) === index;
        })
        .slice(0, 10);
      retrievedDocIds = selectedKnowledge
        .map((k) => k.id?.trim() || k.canonicalRoute?.trim() || k.title.trim())
        .filter(Boolean)
        .slice(0, 30);
      const structuralSummaryContext = structuralSummaryCsv?.ok
        ? [
            '## Structural Summary CSV from this web app',
            'The CSV below was generated by this product. It is expected to contain exactly one header row and one value row. Do not describe that shape as misaligned, broken, or suspicious.',
            'Use these values as the structural-summary data source for this conversation.',
            '```csv',
            structuralSummaryCsv.csv,
            '```',
          ].join('\n')
        : '';
      fullSystemPrompt = buildSystemPrompt(
        [DEFAULT_INTERPRETATION_GUARDRAIL_PROMPT, structuralSummaryContext].filter(Boolean).join('\n\n'),
        selectedKnowledge,
      );
    } else if (codingAssistContext) {
      const codingContextForRetrieval = {
        ...codingAssistContext,
        responseMemo: `${codingAssistContext.responseMemo}\n${userMessage.content}`.trim(),
      };
      const codingKnowledge = await getHybridCodingRuleChunks({
        context: codingContextForRetrieval,
        lang: workflowLocale,
        provider,
        apiKey,
      });
      const primaryRuleChunks =
        codingKnowledge.items.length > 0
          ? codingKnowledge.items
          : selectCodingRuleChunks(
              codingContextForRetrieval,
              workflowLocale,
            );
      const supportingRuleChunks = buildSupportingInterpretationChunks({
        lang: workflowLocale,
        relatedRoutes: primaryRuleChunks.flatMap((chunk) => chunk.relatedRoutes),
        query: retrievalQuery || userMessage.content || codingContextForRetrieval.responseMemo,
      });
      const ruleChunks = [...primaryRuleChunks, ...supportingRuleChunks]
        .filter((chunk, index, items) => items.findIndex((candidate) => candidate.id === chunk.id) === index)
        .slice(0, 8);
      retrievalMode = codingKnowledge.mode;
      vectorHitCount = codingKnowledge.vectorHitCount;
      retrievalTrace = codingKnowledge.trace.slice(0, 4);
      retrievedDocIds = ruleChunks.map((chunk) => chunk.id);
      fullSystemPrompt = buildCodingAssistSystemPrompt({
        lang: workflowLocale,
        context: codingAssistContext,
        ruleChunks,
      });
    }

    let finalMessages: { role: string; content: string }[];
    if (fullSystemPrompt) {
      finalMessages = [{ role: 'system', content: fullSystemPrompt }, ...formattedMessages];
    } else {
      finalMessages = formattedMessages;
    }

    let aiResponseContent = '';
    let streamFinalized = false;

    const finalizeStreamResult = async (
      streamStatus: 'completed' | 'partial_failed' | 'failed' | 'partial_aborted' | 'aborted' | 'provider_init_failed',
    ) => {
      if (streamFinalized) return;
      streamFinalized = true;

      if (streamStatus !== 'completed') {
        logApiError('chat_stream_not_completed', requestId, new Error(`Stream status: ${streamStatus}`), {
          locale: workflowLocale,
          workflowType: workflowMode,
          modelId: selectedModel.id,
          provider,
          responseLength: aiResponseContent.length,
          retrievalMode,
          vectorHitCount,
          retrievalTrace,
          retrievedDocCount: retrievedDocIds.length,
        });
      }
    };

    let stream: ReadableStream;
    const maxOutputTokens = getWorkflowMaxOutputTokens(workflowMode, selectedModel.maxOutputTokens);
    try {
      stream = await callOpenAI(
        apiKey,
        selectedModel.id,
        maxOutputTokens,
        finalMessages as { role: 'system' | 'user' | 'assistant'; content: string }[],
      );
    } catch (providerError) {
      const providerFailure = classifyProviderError(providerError);
      await finalizeStreamResult('provider_init_failed');
      logApiError(providerFailure.code, requestId, providerError, {
        locale: workflowLocale,
        workflowType: workflowMode,
        modelId: selectedModel.id,
        provider,
      });
      return buildSafeApiErrorResponse({
        requestId,
        publicMessage: providerFailure.publicMessage,
        status: providerFailure.status,
        code: providerFailure.code,
      });
    }

    let providerReader: ReadableStreamDefaultReader<Uint8Array> | null = null;
    const responseStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const decoder = new TextDecoder();
        providerReader = stream.getReader();

        try {
          while (true) {
            const { done, value } = await providerReader.read();
            if (done) break;
            if (!value) continue;
            aiResponseContent += decoder.decode(value, { stream: true });
            controller.enqueue(value);
          }

          const tail = decoder.decode();
          if (tail) aiResponseContent += tail;
          await finalizeStreamResult('completed');
          controller.close();
        } catch (streamError) {
          logApiError('chat_stream_failed', requestId, streamError, {
            modelId: selectedModel.id,
          });
          await finalizeStreamResult(aiResponseContent ? 'partial_failed' : 'failed');
          controller.error(streamError);
        } finally {
          providerReader = null;
        }
      },
      async cancel(reason) {
        try {
          await providerReader?.cancel(reason);
        } catch {
          // The provider stream is already closing; audit finalization below is the important part.
        }
        await finalizeStreamResult(aiResponseContent ? 'partial_aborted' : 'aborted');
      },
    });

    const responseHeaders = new Headers();
    responseHeaders.set('X-Chat-Request-Id', requestId);
    responseHeaders.set('X-Chat-Model-Id', selectedModel.id);
    responseHeaders.set('X-Chat-Workflow-Mode', workflowMode);

    return new Response(responseStream, { headers: responseHeaders });
  } catch (error) {
    logApiError('chat_post_failed', requestId, error);
    return buildSafeApiErrorResponse({
      requestId,
      publicMessage: 'Failed to process chat request.',
      status: 500,
      code: 'chat_post_failed',
    });
  }
}
