import type {
  AiFeedbackRating,
  AiFeedbackReasonCode,
  AiMessageCompletionState,
  ChatWorkflowMode,
  Language,
} from '@/types';
import { getAiFeedbackLengthBucket } from '@/lib/aiFeedback';

export const AI_RESPONSE_FEEDBACK_ENABLED =
  process.env.NEXT_PUBLIC_AI_FEEDBACK_ENABLED === '1';

export function createClientFeedbackId(): string {
  return globalThis.crypto.randomUUID();
}

export async function submitAiResponseFeedback(args: {
  feedbackId: string;
  rating: AiFeedbackRating | null;
  workflowType: ChatWorkflowMode;
  locale: Language;
  completionState: AiMessageCompletionState;
  responseChars: number;
  reasonCodes: AiFeedbackReasonCode[];
}) {
  if (!AI_RESPONSE_FEEDBACK_ENABLED) throw new Error('feedback_disabled');
  const response = await fetch('/api/chat/feedback', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      feedbackId: args.feedbackId,
      rating: args.rating,
      workflowType: args.workflowType,
      locale: args.locale,
      completionState: args.completionState,
      lengthBucket: getAiFeedbackLengthBucket(args.responseChars),
      reasonCodes: args.reasonCodes,
    }),
  });
  if (!response.ok) throw new Error('feedback_request_failed');
}
