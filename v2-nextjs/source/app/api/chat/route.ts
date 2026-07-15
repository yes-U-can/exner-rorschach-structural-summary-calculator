import { NextResponse } from 'next/server';
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
import { buildSafeApiErrorResponse, logApiError, logApiEvent } from '@/lib/apiError';
import { parseJsonWithSizeLimit, REQUEST_BODY_SIZE_POLICIES } from '@/lib/requestBodyGuard';
import { normalizeEphemeralChatContext } from '@/lib/chatEphemeralContext';
import { readByokSessionFromRequest } from '@/lib/byokSession';
import { BYOK_SESSION_MISSING_CODE } from '@/lib/chatApiErrors';
import { detectChatSafetyAssessment } from '@/lib/chatSafety';
import { detectChatDomainBoundary } from '@/lib/chatDomainBoundary';
import { classifyChatProviderError } from '@/lib/chatProviderErrors';
import {
  CHAT_STREAM_CONTENT_TYPE,
  CHAT_STREAM_PROTOCOL,
  encodeChatStreamEvent,
  type ChatStreamTerminalEvent,
} from '@/lib/chatStreamProtocol';
import {
  getHybridCodingRuleChunks,
  getHybridInterpretationKnowledge,
  type RetrievalTraceEntry,
} from '@/lib/referenceHybridRetrieval';
import { buildInterpretationGuardrailPrompt } from '@/lib/interpretationGuardrails';
import { validateStructuralSummaryCsv } from '@/lib/structuralSummaryCsv';
import {
  applyAiHarnessHeaders,
  appendAiResponsePolicyPrompt,
  buildAiRunMetadata,
  createOpenAITextStream,
  getAiMaxOutputTokens,
  getAiPromptProfile,
  OPENAI_GENERATION_TIMEOUT_MS,
  type AiModelMessage,
  type OpenAITextStreamCompletion,
  type OpenAITextStreamResult,
} from '@/lib/ai/harness';

type NormalizedMessage = {
  role: 'ai' | 'user';
  content: string;
};
type ChatRequestMode = 'interpretation' | 'coding_assist';
type ChatStreamStatus =
  | 'completed'
  | 'partial_incomplete'
  | 'incomplete'
  | 'partial_failed'
  | 'failed'
  | 'partial_aborted'
  | 'aborted'
  | 'provider_init_failed'
  | 'provider_unknown';
type ProviderAbortReason = 'client_aborted' | 'timeout';

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

function getTerminalStreamStatus(
  completion: OpenAITextStreamCompletion,
  responseLength: number,
): ChatStreamStatus {
  if (completion.status === 'completed') return 'completed';
  if (completion.status === 'incomplete') {
    return responseLength > 0 ? 'partial_incomplete' : 'incomplete';
  }
  if (completion.status === 'failed') {
    return responseLength > 0 ? 'partial_failed' : 'failed';
  }
  if (completion.status === 'aborted') {
    return responseLength > 0 ? 'partial_aborted' : 'aborted';
  }
  return 'provider_unknown';
}

function buildChatStreamTerminalEvent(
  completion: OpenAITextStreamCompletion,
): ChatStreamTerminalEvent {
  if (completion.status === 'completed') {
    return { type: 'complete' };
  }
  if (completion.status === 'incomplete' || completion.status === 'aborted') {
    return {
      type: 'incomplete',
      reason:
        completion.incompleteReason ??
        (completion.status === 'aborted' ? 'aborted' : 'provider_incomplete'),
    };
  }

  const failure = classifyChatProviderError({
    code: completion.errorCode,
    message: completion.errorMessage,
  });
  return {
    type: 'error',
    code: failure.code,
    message: failure.publicMessage,
  };
}

function getProviderAbortReason(args: {
  requestSignal: AbortSignal;
  downstreamSignal: AbortSignal;
  timeoutSignal: AbortSignal;
}): ProviderAbortReason | null {
  if (args.timeoutSignal.aborted) return 'timeout';
  if (args.requestSignal.aborted || args.downstreamSignal.aborted) return 'client_aborted';
  return null;
}

function withProviderAbortReason(
  completion: OpenAITextStreamCompletion,
  reason: ProviderAbortReason | null,
): OpenAITextStreamCompletion {
  if (!reason) return completion;
  return {
    ...completion,
    status: 'aborted',
    incompleteReason: reason,
    errorCode: undefined,
    errorMessage: undefined,
  };
}

function applyChatStreamResponseHeaders(headers: Headers, structuredStreamRequested: boolean) {
  if (structuredStreamRequested) {
    headers.set('X-Chat-Stream-Protocol', CHAT_STREAM_PROTOCOL);
    headers.set('Content-Type', CHAT_STREAM_CONTENT_TYPE);
  } else {
    headers.set('Content-Type', 'text/plain; charset=utf-8');
  }
  headers.set('Cache-Control', 'no-cache, no-transform');
  headers.set('X-Accel-Buffering', 'no');
}

function buildImmediateChatResponse(args: {
  content: string;
  headers: Headers;
  structuredStreamRequested: boolean;
}) {
  applyChatStreamResponseHeaders(args.headers, args.structuredStreamRequested);
  if (!args.structuredStreamRequested) {
    return new Response(args.content, { headers: args.headers });
  }

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encodeChatStreamEvent({ type: 'delta', text: args.content }));
      controller.enqueue(encodeChatStreamEvent({ type: 'complete' }));
      controller.close();
    },
  });
  return new Response(stream, { headers: args.headers });
}

export async function POST(req: Request) {
  const requestId = randomUUID();
  const structuredStreamRequested =
    req.headers.get('X-Chat-Stream-Protocol') === CHAT_STREAM_PROTOCOL;

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
    const promptProfile = getAiPromptProfile(workflowMode);
    const workflowLocale = normalizeWorkflowLocale(body.lang);
    const provider = byokSession.provider;
    const apiKey = byokSession.apiKey;
    const selectedModel = getDefaultModelForProvider(provider);
    const safety = detectChatSafetyAssessment({
      text: userMessage.content,
      locale: workflowLocale,
      actorRole: 'user',
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
      applyAiHarnessHeaders(responseHeaders, promptProfile);
      return buildImmediateChatResponse({
        content: safety.safeResponse,
        headers: responseHeaders,
        structuredStreamRequested,
      });
    }

    const domainBoundary = detectChatDomainBoundary({
      text: userMessage.content,
      locale: workflowLocale,
    });

    if (domainBoundary.interventionTriggered && domainBoundary.safeResponse) {
      logApiEvent('chat_domain_intervention', requestId, {
        locale: workflowLocale,
        workflowType: workflowMode,
        boundaryType: domainBoundary.type,
        boundaryReason: domainBoundary.interventionReason,
      });

      const responseHeaders = new Headers();
      responseHeaders.set('X-Chat-Request-Id', requestId);
      responseHeaders.set('X-Chat-Model-Id', selectedModel.id);
      responseHeaders.set('X-Chat-Workflow-Mode', workflowMode);
      responseHeaders.set('X-Chat-Domain-Intervention', 'true');
      if (domainBoundary.type) {
        responseHeaders.set('X-Chat-Domain-Boundary', domainBoundary.type);
      }
      applyAiHarnessHeaders(responseHeaders, promptProfile);
      return buildImmediateChatResponse({
        content: domainBoundary.safeResponse,
        headers: responseHeaders,
        structuredStreamRequested,
      });
    }

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

    const normalizedMessages: NormalizedMessage[] = [...contextResult.messages, userMessage];
    const downstreamAbortController = new AbortController();
    const providerTimeoutSignal = AbortSignal.timeout(OPENAI_GENERATION_TIMEOUT_MS);
    const providerSignal = AbortSignal.any([
      req.signal,
      downstreamAbortController.signal,
      providerTimeoutSignal,
    ]);
    const readProviderAbortReason = () => getProviderAbortReason({
      requestSignal: req.signal,
      downstreamSignal: downstreamAbortController.signal,
      timeoutSignal: providerTimeoutSignal,
    });
    const retrievalQuery = buildChatRetrievalQuery({
      mode: workflowMode,
      messages: normalizedMessages,
      maxUserMessages: workflowMode === 'interpretation' ? 3 : 4,
    });

    const formattedMessages: AiModelMessage[] = normalizedMessages.map((m) => ({
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
        signal: providerSignal,
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
        [buildInterpretationGuardrailPrompt(workflowLocale), structuralSummaryContext]
          .filter(Boolean)
          .join('\n\n'),
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
        signal: providerSignal,
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
    fullSystemPrompt = appendAiResponsePolicyPrompt(fullSystemPrompt, promptProfile);

    let finalMessages: AiModelMessage[];
    if (fullSystemPrompt) {
      finalMessages = [{ role: 'system', content: fullSystemPrompt }, ...formattedMessages];
    } else {
      finalMessages = formattedMessages as AiModelMessage[];
    }

    let aiResponseContent = '';
    let streamFinalized = false;
    let latestProviderCompletion: OpenAITextStreamCompletion | null = null;
    const maxOutputTokens = getAiMaxOutputTokens(promptProfile, selectedModel.maxOutputTokens);

    const finalizeStreamResult = async (
      streamStatus: ChatStreamStatus,
      completion: OpenAITextStreamCompletion | null = latestProviderCompletion,
    ) => {
      if (streamFinalized) return;
      streamFinalized = true;

      if (streamStatus !== 'completed') {
        const runMetadata = {
          ...buildAiRunMetadata({
            profile: promptProfile,
            provider,
            modelId: selectedModel.id,
            workflowType: workflowMode,
            locale: workflowLocale,
            maxOutputTokens,
            completion,
          }),
          responseLength: aiResponseContent.length,
          retrievalMode,
          vectorHitCount,
          retrievalTrace,
          retrievedDocCount: retrievedDocIds.length,
        };
        if (
          (streamStatus === 'aborted' || streamStatus === 'partial_aborted') &&
          completion?.incompleteReason === 'client_aborted'
        ) {
          logApiEvent('chat_stream_cancelled_by_client', requestId, runMetadata);
        } else {
          logApiError(
            'chat_stream_not_completed',
            requestId,
            new Error(`Stream status: ${streamStatus}`),
            runMetadata,
          );
        }
      }
    };

    let providerResult: OpenAITextStreamResult;
    try {
      providerResult = await createOpenAITextStream({
        apiKey,
        model: selectedModel.id,
        maxOutputTokens,
        messages: finalMessages,
        signal: providerSignal,
      });
    } catch (providerError) {
      const providerFailure = classifyChatProviderError(providerError);
      await finalizeStreamResult('provider_init_failed');
      logApiError(providerFailure.code, requestId, providerError, {
        ...buildAiRunMetadata({
          profile: promptProfile,
          provider,
          modelId: selectedModel.id,
          workflowType: workflowMode,
          locale: workflowLocale,
          maxOutputTokens,
        }),
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
        const encoder = new TextEncoder();
        providerReader = providerResult.stream.getReader();

        try {
          while (true) {
            const { done, value } = await providerReader.read();
            if (done) break;
            if (!value) continue;
            const delta = decoder.decode(value, { stream: true });
            if (!delta) continue;
            aiResponseContent += delta;
            controller.enqueue(
              structuredStreamRequested
                ? encodeChatStreamEvent({ type: 'delta', text: delta })
                : encoder.encode(delta),
            );
          }

          const tail = decoder.decode();
          if (tail) {
            aiResponseContent += tail;
            controller.enqueue(
              structuredStreamRequested
                ? encodeChatStreamEvent({ type: 'delta', text: tail })
                : encoder.encode(tail),
            );
          }
          latestProviderCompletion = withProviderAbortReason(
            await providerResult.completion,
            readProviderAbortReason(),
          );
          await finalizeStreamResult(
            getTerminalStreamStatus(latestProviderCompletion, aiResponseContent.length),
            latestProviderCompletion,
          );
          if (structuredStreamRequested) {
            controller.enqueue(
              encodeChatStreamEvent(buildChatStreamTerminalEvent(latestProviderCompletion)),
            );
          }
          controller.close();
        } catch (streamError) {
          const providerAbortReason = readProviderAbortReason();
          latestProviderCompletion = withProviderAbortReason(
            await providerResult.completion,
            providerAbortReason,
          );
          if (!providerAbortReason) {
            logApiError('chat_stream_failed', requestId, streamError, {
              ...buildAiRunMetadata({
                profile: promptProfile,
                provider,
                modelId: selectedModel.id,
                workflowType: workflowMode,
                locale: workflowLocale,
                maxOutputTokens,
                completion: latestProviderCompletion,
              }),
            });
          }
          await finalizeStreamResult(
            getTerminalStreamStatus(latestProviderCompletion, aiResponseContent.length),
            latestProviderCompletion,
          );
          try {
            if (!structuredStreamRequested) {
              controller.error(streamError);
              return;
            }
            controller.enqueue(
              encodeChatStreamEvent(buildChatStreamTerminalEvent(latestProviderCompletion)),
            );
            controller.close();
          } catch {
            controller.error(streamError);
          }
        } finally {
          providerReader = null;
        }
      },
      async cancel(reason) {
        downstreamAbortController.abort('client_aborted');
        try {
          await providerReader?.cancel(reason);
        } catch {
          // The provider stream is already closing; audit finalization below is the important part.
        }
        latestProviderCompletion = withProviderAbortReason(
          await providerResult.completion,
          'client_aborted',
        );
        await finalizeStreamResult(
          getTerminalStreamStatus(latestProviderCompletion, aiResponseContent.length),
          latestProviderCompletion,
        );
      },
    });

    const responseHeaders = new Headers();
    responseHeaders.set('X-Chat-Request-Id', requestId);
    responseHeaders.set('X-Chat-Model-Id', selectedModel.id);
    responseHeaders.set('X-Chat-Workflow-Mode', workflowMode);
    applyChatStreamResponseHeaders(responseHeaders, structuredStreamRequested);
    applyAiHarnessHeaders(responseHeaders, promptProfile);

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
