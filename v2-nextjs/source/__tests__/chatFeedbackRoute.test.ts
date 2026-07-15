import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  saveAiResponseFeedback: vi.fn(),
  deleteAiResponseFeedback: vi.fn(),
}));

vi.mock('@/lib/aiFeedbackStore', () => mocks);

import { POST } from '@/app/api/chat/feedback/route';
import {
  createByokSession,
  encryptByokSession,
  getByokCookieName,
} from '@/lib/byokSession';

const FEEDBACK_ID = 'ce055b4d-5efe-4ec0-b381-e46c7a57efe1';

function buildFeedbackRequest(overrides: Record<string, unknown> = {}, withSession = true) {
  const localFormatOnlyKey = ['s', 'k', '-local-feedback-test-key-never-sent'].join('');
  const session = createByokSession('openai', localFormatOnlyKey);
  return new Request('http://localhost/api/chat/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(withSession
        ? { Cookie: `${getByokCookieName()}=${encodeURIComponent(encryptByokSession(session))}` }
        : {}),
    },
    body: JSON.stringify({
      feedbackId: FEEDBACK_ID,
      rating: 'helpful',
      workflowType: 'interpretation',
      locale: 'ko',
      completionState: 'completed',
      lengthBucket: 'from_1500_to_2999',
      reasonCodes: ['accurate', 'clear'],
      ...overrides,
    }),
  });
}

describe('chat response feedback route', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_AI_FEEDBACK_ENABLED', '1');
    mocks.saveAiResponseFeedback.mockReset();
    mocks.deleteAiResponseFeedback.mockReset();
    mocks.saveAiResponseFeedback.mockResolvedValue(undefined);
    mocks.deleteAiResponseFeedback.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('fails closed when the public feedback feature is disabled', async () => {
    vi.stubEnv('NEXT_PUBLIC_AI_FEEDBACK_ENABLED', '0');
    const response = await POST(buildFeedbackRequest());
    expect(response.status).toBe(404);
    expect(mocks.saveAiResponseFeedback).not.toHaveBeenCalled();
  });

  it('requires an active encrypted BYOK session', async () => {
    const response = await POST(buildFeedbackRequest({}, false));
    expect(response.status).toBe(401);
    expect(mocks.saveAiResponseFeedback).not.toHaveBeenCalled();
  });

  it('stores only privacy-safe aggregate metadata and predefined reason codes', async () => {
    const response = await POST(buildFeedbackRequest());

    expect(response.status).toBe(200);
    expect(mocks.saveAiResponseFeedback).toHaveBeenCalledWith({
      feedbackKey: FEEDBACK_ID,
      rating: 'helpful',
      workflow: 'interpretation',
      locale: 'ko',
      modelId: 'gpt-5.5',
      harnessVersion: 'sicp-openai-harness-v4',
      completion: 'completed',
      lengthBucket: 'from_1500_to_2999',
      reasonCodes: ['accurate', 'clear'],
    });
  });

  it('accepts an already-open legacy client that omits optional reason codes', async () => {
    const response = await POST(buildFeedbackRequest({ reasonCodes: undefined }));

    expect(response.status).toBe(200);
    expect(mocks.saveAiResponseFeedback).toHaveBeenCalledWith(expect.objectContaining({
      reasonCodes: [],
    }));
  });

  it('rejects payloads that try to include prompt or response content', async () => {
    const response = await POST(buildFeedbackRequest({
      response: 'must never be accepted or forwarded',
    }));

    expect(response.status).toBe(400);
    expect(mocks.saveAiResponseFeedback).not.toHaveBeenCalled();
  });

  it('rejects unknown, duplicate, or rating-incompatible reason codes', async () => {
    const unknown = await POST(buildFeedbackRequest({ reasonCodes: ['free_text_reason'] }));
    const duplicate = await POST(buildFeedbackRequest({ reasonCodes: ['accurate', 'accurate'] }));
    const incompatible = await POST(buildFeedbackRequest({ reasonCodes: ['incorrect'] }));

    expect(unknown.status).toBe(400);
    expect(duplicate.status).toBe(400);
    expect(incompatible.status).toBe(400);
    expect(mocks.saveAiResponseFeedback).not.toHaveBeenCalled();
  });

  it('removes a prior rating when the selected thumb is pressed again', async () => {
    const response = await POST(buildFeedbackRequest({ rating: null, reasonCodes: [] }));
    expect(response.status).toBe(200);
    expect(mocks.deleteAiResponseFeedback).toHaveBeenCalledWith(FEEDBACK_ID);
    expect(mocks.saveAiResponseFeedback).not.toHaveBeenCalled();
  });

  it('does not accept reason codes when a rating is removed', async () => {
    const response = await POST(buildFeedbackRequest({ rating: null, reasonCodes: ['accurate'] }));
    expect(response.status).toBe(400);
    expect(mocks.deleteAiResponseFeedback).not.toHaveBeenCalled();
  });

  it('rejects invalid identifiers and unsupported metadata', async () => {
    const response = await POST(buildFeedbackRequest({ feedbackId: 'not-a-uuid' }));
    expect(response.status).toBe(400);
    expect(mocks.saveAiResponseFeedback).not.toHaveBeenCalled();
  });

  it('rejects exact response lengths instead of accepting more precise metadata', async () => {
    const response = await POST(buildFeedbackRequest({
      lengthBucket: undefined,
      responseChars: 1_820,
    }));
    expect(response.status).toBe(400);
    expect(mocks.saveAiResponseFeedback).not.toHaveBeenCalled();
  });
});
