import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createOpenAITextStream: vi.fn(),
  getHybridInterpretationKnowledge: vi.fn(),
}));

vi.mock('@/lib/ai/harness', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/ai/harness')>();
  return {
    ...actual,
    createOpenAITextStream: mocks.createOpenAITextStream,
  };
});

vi.mock('@/lib/referenceHybridRetrieval', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/referenceHybridRetrieval')>();
  return {
    ...actual,
    getHybridInterpretationKnowledge: mocks.getHybridInterpretationKnowledge,
  };
});

import { POST } from '@/app/api/chat/route';
import {
  createByokSession,
  encryptByokSession,
  getByokCookieName,
} from '@/lib/byokSession';
import { CHAT_STREAM_PROTOCOL, consumeChatEventStream } from '@/lib/chatStreamProtocol';
import type { OpenAITextStreamCompletion, OpenAITextStreamResult } from '@/lib/ai/harness';

const VALID_SUMMARY_CSV = [
  'Zf,ZSum,ZEst,Zd,R,Lambda,EB,EA,EBPer,eb,es,AdjEs,D,AdjD,PTI,DEPI,CDI,SCON,HVI,OBS,GHR,PHR',
  "12,43.5,38,'+5.5,15,.15,6:3.5,9.5,1.71,7:8,15,10,0,0,0,0,0,0,0,0,3,3",
].join('\n');

function buildChatRequest(
  message = 'Explain the low R caution briefly.',
  signal?: AbortSignal,
) {
  const localFormatOnlyKey = ['s', 'k', '-local-route-test-key-never-sent'].join('');
  const session = createByokSession('openai', localFormatOnlyKey);

  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Chat-Stream-Protocol': CHAT_STREAM_PROTOCOL,
      Cookie: `${getByokCookieName()}=${encodeURIComponent(encryptByokSession(session))}`,
    },
    body: JSON.stringify({
      message,
      mode: 'interpretation',
      contextMessages: [],
      workflowContext: { structuralSummaryCsv: VALID_SUMMARY_CSV },
      lang: 'en',
    }),
    signal,
  });
}

function buildProviderResult(args: {
  chunks?: string[];
  completion: OpenAITextStreamCompletion;
  streamError?: Error & { status?: number; code?: string };
}): OpenAITextStreamResult {
  let chunkIndex = 0;
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      const chunk = args.chunks?.[chunkIndex];
      if (chunk !== undefined) {
        chunkIndex += 1;
        controller.enqueue(encoder.encode(chunk));
        return;
      }
      if (args.streamError) {
        controller.error(args.streamError);
        return;
      }
      controller.close();
    },
  });

  return { stream, completion: Promise.resolve(args.completion) };
}

describe('chat route structured provider streaming', () => {
  beforeEach(() => {
    mocks.createOpenAITextStream.mockReset();
    mocks.getHybridInterpretationKnowledge.mockReset();
    mocks.getHybridInterpretationKnowledge.mockResolvedValue({
      items: [],
      mode: 'lexical',
      vectorHitCount: 0,
      trace: [],
    });
  });

  it('runs the real request orchestration and emits an explicit complete event', async () => {
    mocks.createOpenAITextStream.mockResolvedValue(
      buildProviderResult({
        chunks: ['Low R requires ', 'cautious interpretation.'],
        completion: { status: 'completed', responseId: 'resp_test_complete' },
      }),
    );

    const response = await POST(buildChatRequest());
    const deltas: string[] = [];
    const terminal = await consumeChatEventStream(response.body!, (delta) => deltas.push(delta));

    expect(response.status).toBe(200);
    expect(response.headers.get('X-Chat-Stream-Protocol')).toBe(CHAT_STREAM_PROTOCOL);
    expect(deltas.join('')).toBe('Low R requires cautious interpretation.');
    expect(terminal).toEqual({ type: 'complete' });
    expect(mocks.createOpenAITextStream).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-5.5',
        maxOutputTokens: 8000,
        signal: expect.any(AbortSignal),
      }),
    );
    const providerArgs = mocks.createOpenAITextStream.mock.calls[0]?.[0];
    expect(providerArgs.messages[0]).toMatchObject({ role: 'system' });
    expect(providerArgs.messages[0].content).toContain('professional review draft');
  });

  it('preserves partial text and reports max-output incompleteness', async () => {
    mocks.createOpenAITextStream.mockResolvedValue(
      buildProviderResult({
        chunks: ['This answer is partial.'],
        completion: {
          status: 'incomplete',
          incompleteReason: 'max_output_tokens',
          responseId: 'resp_test_incomplete',
        },
      }),
    );

    const response = await POST(buildChatRequest());
    const deltas: string[] = [];
    const terminal = await consumeChatEventStream(response.body!, (delta) => deltas.push(delta));

    expect(deltas.join('')).toBe('This answer is partial.');
    expect(terminal).toEqual({ type: 'incomplete', reason: 'max_output_tokens' });
  });

  it('reports provider timeouts as incomplete instead of a generic provider failure', async () => {
    mocks.createOpenAITextStream.mockResolvedValue(
      buildProviderResult({
        chunks: ['Partial answer before the deadline.'],
        completion: {
          status: 'aborted',
          incompleteReason: 'timeout',
        },
      }),
    );

    const response = await POST(buildChatRequest());
    const deltas: string[] = [];
    const terminal = await consumeChatEventStream(response.body!, (delta) => deltas.push(delta));

    expect(deltas.join('')).toBe('Partial answer before the deadline.');
    expect(terminal).toEqual({ type: 'incomplete', reason: 'timeout' });
  });

  it('propagates downstream response cancellation to the provider signal', async () => {
    let providerSignal: AbortSignal | null = null;
    let resolveCompletion: (completion: OpenAITextStreamCompletion) => void = () => {};
    const completion = new Promise<OpenAITextStreamCompletion>((resolve) => {
      resolveCompletion = resolve;
    });
    const encoder = new TextEncoder();
    const providerStream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode('Partial response.'));
      },
      cancel() {
        resolveCompletion({ status: 'aborted', incompleteReason: 'client_aborted' });
      },
    });
    mocks.createOpenAITextStream.mockImplementation(async (args) => {
      providerSignal = args.signal ?? null;
      return { stream: providerStream, completion };
    });

    const response = await POST(buildChatRequest());
    const reader = response.body!.getReader();
    const firstChunk = await reader.read();
    expect(firstChunk.done).toBe(false);

    await reader.cancel('user_stopped');

    expect(providerSignal).not.toBeNull();
    expect(providerSignal!.aborted).toBe(true);
  });

  it('converts a mid-stream quota failure into a privacy-safe terminal event', async () => {
    const quotaError = Object.assign(new Error('private upstream quota detail'), {
      status: 429,
      code: 'insufficient_quota',
    });
    mocks.createOpenAITextStream.mockResolvedValue(
      buildProviderResult({
        chunks: ['Partial before provider failure.'],
        completion: {
          status: 'failed',
          errorCode: 'insufficient_quota',
          errorMessage: 'private upstream quota detail',
        },
        streamError: quotaError,
      }),
    );

    const response = await POST(buildChatRequest());
    const deltas: string[] = [];
    const terminal = await consumeChatEventStream(response.body!, (delta) => deltas.push(delta));

    expect(deltas.join('')).toBe('Partial before provider failure.');
    expect(terminal).toEqual({
      type: 'error',
      code: 'chat_provider_quota_or_billing',
      message: 'The AI provider reported a billing or quota problem.',
    });
    expect(JSON.stringify(terminal)).not.toContain('private upstream quota detail');
  });
});
