import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { SUPPORTED_LANGUAGES, type Language } from '@/i18n/config';
import { AI_HARNESS_VERSION } from '@/lib/ai/harness';
import { FIXED_OPENAI_MODEL_ID } from '@/lib/aiModels';
import {
  deleteAiResponseFeedback,
  saveAiResponseFeedback,
} from '@/lib/aiFeedbackStore';
import { parseAiFeedbackReasonCodes } from '@/lib/aiFeedbackReasons';
import { logApiError } from '@/lib/apiError';
import { readByokSessionFromRequest } from '@/lib/byokSession';
import type {
  AiFeedbackLengthBucket,
  AiFeedbackRating,
  AiMessageCompletionState,
  ChatWorkflowMode,
} from '@/types';

const MAX_FEEDBACK_REQUEST_BYTES = 2_048;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VALID_WORKFLOWS = new Set<ChatWorkflowMode>(['interpretation', 'coding_assist']);
const VALID_COMPLETION_STATES = new Set<AiMessageCompletionState>([
  'streaming',
  'completed',
  'incomplete',
  'failed',
  'unknown',
]);
const VALID_RATINGS = new Set<AiFeedbackRating>(['helpful', 'unhelpful']);
const VALID_LENGTH_BUCKETS = new Set<AiFeedbackLengthBucket>([
  'under_500',
  'from_500_to_1499',
  'from_1500_to_2999',
  'from_3000_to_5999',
  'over_6000',
]);
const ALLOWED_FEEDBACK_FIELDS = new Set([
  'feedbackId',
  'rating',
  'workflowType',
  'locale',
  'completionState',
  'lengthBucket',
  'reasonCodes',
]);

type FeedbackRequestBody = {
  feedbackId?: unknown;
  rating?: unknown;
  workflowType?: unknown;
  locale?: unknown;
  completionState?: unknown;
  lengthBucket?: unknown;
  reasonCodes?: unknown;
};

function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && SUPPORTED_LANGUAGES.includes(value as Language);
}

function parseFeedbackRequest(body: FeedbackRequestBody) {
  if (Object.keys(body).some((key) => !ALLOWED_FEEDBACK_FIELDS.has(key))) return null;
  if (typeof body.feedbackId !== 'string' || !UUID_PATTERN.test(body.feedbackId)) return null;
  if (body.rating !== null && (
    typeof body.rating !== 'string' || !VALID_RATINGS.has(body.rating as AiFeedbackRating)
  )) return null;
  const rating = body.rating as AiFeedbackRating | null;
  if (typeof body.workflowType !== 'string' || !VALID_WORKFLOWS.has(body.workflowType as ChatWorkflowMode)) {
    return null;
  }
  if (!isLanguage(body.locale)) return null;
  if (
    typeof body.completionState !== 'string' ||
    !VALID_COMPLETION_STATES.has(body.completionState as AiMessageCompletionState)
  ) return null;
  if (
    typeof body.lengthBucket !== 'string' ||
    !VALID_LENGTH_BUCKETS.has(body.lengthBucket as AiFeedbackLengthBucket)
  ) return null;
  const reasonCodes = parseAiFeedbackReasonCodes(body.reasonCodes, rating);
  if (reasonCodes === null) return null;

  return {
    feedbackId: body.feedbackId,
    rating,
    workflowType: body.workflowType as ChatWorkflowMode,
    locale: body.locale,
    completionState: body.completionState as AiMessageCompletionState,
    lengthBucket: body.lengthBucket as AiFeedbackLengthBucket,
    reasonCodes,
  };
}

export async function POST(request: Request) {
  const requestId = randomUUID();
  const headers = { 'Cache-Control': 'no-store', 'X-Request-Id': requestId };

  try {
    if (process.env.NEXT_PUBLIC_AI_FEEDBACK_ENABLED !== '1') {
      return NextResponse.json(
        { error: 'AI response feedback is not enabled.', code: 'feedback_disabled' },
        { status: 404, headers },
      );
    }

    if (!readByokSessionFromRequest(request)) {
      return NextResponse.json(
        { error: 'An active AI session is required.', code: 'byok_session_missing' },
        { status: 401, headers },
      );
    }

    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_FEEDBACK_REQUEST_BYTES) {
      return NextResponse.json(
        { error: 'Feedback request is too large.', code: 'feedback_request_too_large' },
        { status: 413, headers },
      );
    }

    let body: FeedbackRequestBody;
    try {
      body = JSON.parse(rawBody) as FeedbackRequestBody;
    } catch {
      body = {};
    }
    const parsed = parseFeedbackRequest(body);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Invalid feedback request.', code: 'invalid_feedback_request' },
        { status: 400, headers },
      );
    }

    if (parsed.rating === null) {
      await deleteAiResponseFeedback(parsed.feedbackId);
    } else {
      await saveAiResponseFeedback({
        feedbackKey: parsed.feedbackId,
        rating: parsed.rating,
        workflow: parsed.workflowType,
        locale: parsed.locale,
        modelId: FIXED_OPENAI_MODEL_ID,
        harnessVersion: AI_HARNESS_VERSION,
        completion: parsed.completionState,
        lengthBucket: parsed.lengthBucket,
        reasonCodes: parsed.reasonCodes,
      });
    }

    return NextResponse.json({ ok: true, rating: parsed.rating }, { headers });
  } catch (error) {
    logApiError('chat_feedback_failed', requestId, error);
    return NextResponse.json(
      { error: 'Feedback is temporarily unavailable.', code: 'feedback_unavailable' },
      { status: 503, headers },
    );
  }
}
