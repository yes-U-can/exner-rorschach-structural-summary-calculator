import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { randomUUID } from 'crypto';
import {
  buildSystemPrompt,
  getBuiltInKnowledge,
  KnowledgeItem,
  selectRelevantKnowledge,
} from '@/lib/chatKnowledge';
import type { ChatCitation, Language } from '@/types';
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
import {
  getHybridCodingRuleChunks,
  getHybridInterpretationKnowledge,
  type RetrievalTraceEntry,
} from '@/lib/referenceHybridRetrieval';
import {
  DEFAULT_INTERPRETATION_GUARDRAIL_PROMPT,
} from '@/lib/interpretationGuardrails';

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

function buildKnowledgeCitations(items: KnowledgeItem[], limit = 5): ChatCitation[] {
  const deduped = new Map<string, ChatCitation>();

  for (const item of items) {
    const id = item.id?.trim() || item.canonicalRoute?.trim() || item.title.trim();
    const title = item.title?.trim();
    if (!id || !title) continue;

    const key = item.canonicalRoute?.trim() || id;
    if (deduped.has(key)) continue;

    deduped.set(key, {
      id,
      title,
      canonicalRoute: item.canonicalRoute?.trim() || null,
      retrievalKind: item.retrievalKind?.trim() || null,
      locale: item.locale ?? null,
      source: item.source ?? null,
    });

    if (deduped.size >= limit) {
      break;
    }
  }

  return Array.from(deduped.values());
}

function buildCodingRuleKnowledgeItems(
  chunks: Array<{ id: string; title: string; text: string; canonicalRoute?: string; routeScope?: 'primary' | 'secondary' }>,
  locale: Language,
): KnowledgeItem[] {
  return chunks.map((chunk) => ({
    id: chunk.id,
    title: chunk.title,
    content: chunk.text,
    source: 'builtin',
    locale,
    canonicalRoute: chunk.canonicalRoute ?? (chunk.id.includes(':') ? chunk.id.split(':').slice(1).join(':') : chunk.id),
    retrievalKind: chunk.routeScope === 'secondary' ? 'graph-related' : 'runtime-chunk',
  }));
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

function encodeHeaderJson(value: unknown) {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url');
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
  const stream = await openai.chat.completions.create({
    model,
    messages,
    max_tokens: maxOutputTokens,
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        controller.enqueue(new TextEncoder().encode(chunk.choices[0]?.delta?.content || ''));
      }
      controller.close();
    },
  });
}

async function callGoogle(
  apiKey: string,
  modelId: string,
  maxOutputTokens: number,
  messages: { role: string; content: string }[],
) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelId,
    generationConfig: { maxOutputTokens },
  });

  const googleMessages: { role: string; parts: { text: string }[] }[] = [];
  for (const msg of messages) {
    const role = msg.role === 'assistant' ? 'model' : 'user';
    const last = googleMessages[googleMessages.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += '\n\n' + msg.content;
    } else {
      googleMessages.push({ role, parts: [{ text: msg.content }] });
    }
  }

  const lastMessage = googleMessages.pop();
  const chat = model.startChat({ history: googleMessages });
  const result = await chat.sendMessageStream(lastMessage?.parts || []);

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        controller.enqueue(new TextEncoder().encode(chunk.text()));
      }
      controller.close();
    },
  });
}

export async function POST(req: Request) {
  const requestId = randomUUID();

  try {
    const byokSession = readByokSessionFromRequest(req);
    if (!byokSession) {
      return NextResponse.json(
        { error: 'API key not found. Start an AI session with your API key and try again.' },
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
    let responseCitations: ChatCitation[] = [];
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
      responseCitations = buildKnowledgeCitations(selectedKnowledge);
      fullSystemPrompt = buildSystemPrompt(DEFAULT_INTERPRETATION_GUARDRAIL_PROMPT, selectedKnowledge);
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
      responseCitations = buildKnowledgeCitations(buildCodingRuleKnowledgeItems(ruleChunks, workflowLocale));
      fullSystemPrompt = buildCodingAssistSystemPrompt({
        lang: workflowLocale,
        context: codingAssistContext,
        ruleChunks,
      });
    }

    let finalMessages: { role: string; content: string }[];
    if (fullSystemPrompt) {
      if (provider === 'openai') {
        finalMessages = [{ role: 'system', content: fullSystemPrompt }, ...formattedMessages];
      } else {
        finalMessages = [{ role: 'user', content: fullSystemPrompt }, ...formattedMessages];
      }
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
    try {
      if (provider === 'openai') {
        stream = await callOpenAI(
          apiKey,
          selectedModel.id,
          selectedModel.maxOutputTokens,
          finalMessages as { role: 'system' | 'user' | 'assistant'; content: string }[],
        );
      } else if (provider === 'google') {
        stream = await callGoogle(apiKey, selectedModel.id, selectedModel.maxOutputTokens, finalMessages);
      } else {
        return new NextResponse('Provider is not supported.', { status: 400 });
      }
    } catch (providerError) {
      await finalizeStreamResult('provider_init_failed');
      logApiError('chat_provider_request_failed', requestId, providerError, {
        locale: workflowLocale,
        workflowType: workflowMode,
        modelId: selectedModel.id,
        provider,
      });
      return buildSafeApiErrorResponse({
        requestId,
        publicMessage: 'AI provider rejected the request. Check your API key access or model availability.',
        status: 502,
        code: 'chat_provider_request_failed',
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
    if (responseCitations.length > 0) {
      responseHeaders.set('X-Chat-Citations', encodeHeaderJson(responseCitations));
    }

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
