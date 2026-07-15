import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('AI response feedback client', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_AI_FEEDBACK_ENABLED', '1');
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('buckets response length before the request leaves the browser', async () => {
    const { submitAiResponseFeedback } = await import('@/lib/aiFeedbackClient');
    await submitAiResponseFeedback({
      feedbackId: 'ce055b4d-5efe-4ec0-b381-e46c7a57efe1',
      rating: 'helpful',
      workflowType: 'interpretation',
      locale: 'ko',
      completionState: 'completed',
      responseChars: 1_820,
      reasonCodes: ['accurate', 'clear'],
    });

    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const body = JSON.parse(String(requestInit.body)) as Record<string, unknown>;
    expect(body.lengthBucket).toBe('from_1500_to_2999');
    expect(body.reasonCodes).toEqual(['accurate', 'clear']);
    expect(body).not.toHaveProperty('responseChars');
    expect(body).not.toHaveProperty('response');
    expect(body).not.toHaveProperty('prompt');
  });
});
