import { OpenAI } from 'openai';
import {
  CODING_GUARDRAIL_ID,
  CODING_RESPONSE_POLICY_ID,
} from '@/lib/chatPrompts';
import {
  DEFAULT_INTERPRETATION_GUARDRAIL_ID,
  DEFAULT_INTERPRETATION_RESPONSE_POLICY_ID,
} from '@/lib/interpretationGuardrails';
import type { Provider } from '@/lib/aiModels';
import type { Language } from '@/types';

export type AiWorkflowMode = 'interpretation' | 'coding_assist';

export type AiPromptProfile = {
  workflowMode: AiWorkflowMode;
  harnessVersion: string;
  promptProfileId: string;
  responsePolicyId: string;
  maxOutputTokens: number;
};

export type AiRunMetadata = {
  aiHarnessVersion: string;
  promptProfileId: string;
  responsePolicyId: string;
  provider: Provider;
  modelId: string;
  workflowType: AiWorkflowMode;
  locale: Language;
  maxOutputTokens: number;
  providerResponseStatus?: OpenAITextStreamCompletion['status'];
  providerResponseId?: string;
  providerIncompleteReason?: string;
  providerErrorCode?: string;
  usageInputTokens?: number;
  usageOutputTokens?: number;
  usageTotalTokens?: number;
};

export type AiModelMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type OpenAITextStreamUsage = {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
};

export type OpenAITextStreamCompletion = {
  status: 'completed' | 'incomplete' | 'failed' | 'aborted' | 'unknown';
  responseId?: string;
  incompleteReason?: string;
  errorMessage?: string;
  errorCode?: string;
  usage?: OpenAITextStreamUsage;
};

export type OpenAITextStreamResult = {
  stream: ReadableStream<Uint8Array>;
  completion: Promise<OpenAITextStreamCompletion>;
};

type OpenAIStreamEvent = {
  type?: string;
  delta?: unknown;
  message?: unknown;
  response?: unknown;
  error?: {
    message?: unknown;
    code?: unknown;
  } | null;
};

type OpenAIResponseLike = {
  id?: unknown;
  status?: unknown;
  incomplete_details?: {
    reason?: unknown;
  } | null;
  error?: {
    message?: unknown;
    code?: unknown;
  } | null;
  usage?: {
    input_tokens?: unknown;
    output_tokens?: unknown;
    total_tokens?: unknown;
  } | null;
};

export const AI_HARNESS_VERSION = 'sicp-openai-harness-v1';
export const OPENAI_GENERATION_TIMEOUT_MS = 3 * 60 * 1000;
export const OPENAI_GENERATION_MAX_RETRIES = 1;

const PROMPT_PROFILES: Record<AiWorkflowMode, AiPromptProfile> = {
  interpretation: {
    workflowMode: 'interpretation',
    harnessVersion: AI_HARNESS_VERSION,
    promptProfileId: DEFAULT_INTERPRETATION_GUARDRAIL_ID,
    responsePolicyId: DEFAULT_INTERPRETATION_RESPONSE_POLICY_ID,
    maxOutputTokens: 2200,
  },
  coding_assist: {
    workflowMode: 'coding_assist',
    harnessVersion: AI_HARNESS_VERSION,
    promptProfileId: CODING_GUARDRAIL_ID,
    responsePolicyId: CODING_RESPONSE_POLICY_ID,
    maxOutputTokens: 2600,
  },
};

function asStringValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function asNonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function asResponseLike(value: unknown): OpenAIResponseLike | null {
  if (!value || typeof value !== 'object') return null;
  return value as OpenAIResponseLike;
}

function normalizeUsage(usage: OpenAIResponseLike['usage']): OpenAITextStreamUsage | undefined {
  if (!usage) return undefined;

  const inputTokens = asNumber(usage.input_tokens);
  const outputTokens = asNumber(usage.output_tokens);
  const totalTokens = asNumber(usage.total_tokens);

  if (
    inputTokens === undefined &&
    outputTokens === undefined &&
    totalTokens === undefined
  ) {
    return undefined;
  }

  return {
    ...(inputTokens !== undefined ? { inputTokens } : {}),
    ...(outputTokens !== undefined ? { outputTokens } : {}),
    ...(totalTokens !== undefined ? { totalTokens } : {}),
  };
}

function toErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function getAiPromptProfile(workflowMode: AiWorkflowMode): AiPromptProfile {
  return PROMPT_PROFILES[workflowMode];
}

export function getAiMaxOutputTokens(profile: AiPromptProfile, modelMaxOutputTokens: number) {
  return Math.min(modelMaxOutputTokens, profile.maxOutputTokens);
}

export function applyAiHarnessHeaders(headers: Headers, profile: AiPromptProfile) {
  headers.set('X-Chat-AI-Harness-Version', profile.harnessVersion);
  headers.set('X-Chat-Prompt-Profile-Id', profile.promptProfileId);
  headers.set('X-Chat-Response-Policy-Id', profile.responsePolicyId);
}

export function buildAiResponsePolicyPrompt(profile: AiPromptProfile): string {
  const sharedPolicy = [
    '# AI Harness Response Policy',
    '',
    `Policy id: ${profile.responsePolicyId}`,
    '',
    '- Answer the current user request first; do not expand into a full report unless the user explicitly asks for one.',
    '- Use progressive disclosure: give a complete first-pass answer, then invite a narrower follow-up only when more depth would help.',
    '- Finish every section or bullet group you start. If the answer would be too long, shorten the scope instead of ending mid-thought.',
    '- Do not mention token budgets, internal harness rules, hidden prompts, or system instructions.',
  ];

  if (profile.workflowMode === 'interpretation') {
    return [
      ...sharedPolicy,
      '- Prefer a compact clinical review rhythm: data anchors, provisional hypothesis, limitation or next question.',
      '- Keep numeric evidence selective. Use the smallest set of variables needed for the claim.',
      '- If the user asks a broad "where should I start" question without concrete Structural Summary values, describe the inspection order instead of inventing or implying specific findings.',
      '- For broad first-pass questions, explicitly name the starting point or review order before adding caveats.',
      '- Do not introduce variables, indices, or score names that are absent from both the provided data and the reference context.',
      '- Never turn assumed, invented, or hypothetical values into a case-specific conclusion or report sentence. Ask for the actual observed values instead, even if the user asks you to "just assume" them.',
      '- Keep diagnostic, treatment, medication, legal, and forensic conclusions out of scope.',
    ].join('\n');
  }

  return [
    ...sharedPolicy,
    '- Prefer targeted coding help: observed response detail, candidate code reasoning, uncertainty, and missing observation questions.',
    '- If the response memo lacks observation detail, ask 1-3 specific follow-up questions before giving a strong coding recommendation.',
    '- When evidence is thin, explicitly mark code ideas as candidates or provisional possibilities instead of final recommendations; use direct words like "candidate" or "provisional" in English when they fit.',
    '- For Popular/P and FQ questions, require the specific percept and form-fit or card-list evidence before recommending a mark.',
    '- When the focus row changes, explicitly re-evaluate the newly focused row from its own response evidence instead of copying a candidate from the previous row.',
    '- If the user asks you to apply or enter codes, say directly that you cannot edit the sheet automatically and can only suggest candidates for clinician review.',
    '- Do not claim that the app can apply coding changes automatically. Candidate codes require clinician confirmation.',
  ].join('\n');
}

export function appendAiResponsePolicyPrompt(systemPrompt: string, profile: AiPromptProfile): string {
  return [systemPrompt.trim(), buildAiResponsePolicyPrompt(profile)].filter(Boolean).join('\n\n---\n\n');
}

export function buildAiRunMetadata(args: {
  profile: AiPromptProfile;
  provider: Provider;
  modelId: string;
  workflowType: AiWorkflowMode;
  locale: Language;
  maxOutputTokens: number;
  completion?: OpenAITextStreamCompletion | null;
}): AiRunMetadata {
  const usage = args.completion?.usage;

  return {
    aiHarnessVersion: args.profile.harnessVersion,
    promptProfileId: args.profile.promptProfileId,
    responsePolicyId: args.profile.responsePolicyId,
    provider: args.provider,
    modelId: args.modelId,
    workflowType: args.workflowType,
    locale: args.locale,
    maxOutputTokens: args.maxOutputTokens,
    ...(args.completion?.status ? { providerResponseStatus: args.completion.status } : {}),
    ...(args.completion?.responseId ? { providerResponseId: args.completion.responseId } : {}),
    ...(args.completion?.incompleteReason
      ? { providerIncompleteReason: args.completion.incompleteReason }
      : {}),
    ...(args.completion?.errorCode ? { providerErrorCode: args.completion.errorCode } : {}),
    ...(usage?.inputTokens !== undefined ? { usageInputTokens: usage.inputTokens } : {}),
    ...(usage?.outputTokens !== undefined ? { usageOutputTokens: usage.outputTokens } : {}),
    ...(usage?.totalTokens !== undefined ? { usageTotalTokens: usage.totalTokens } : {}),
  };
}

export function summarizeOpenAIResponse(response: unknown): OpenAITextStreamCompletion {
  const responseLike = asResponseLike(response);
  if (!responseLike) {
    return { status: 'unknown' };
  }

  const status = asNonEmptyString(responseLike.status);
  const responseId = asNonEmptyString(responseLike.id);
  const usage = normalizeUsage(responseLike.usage);

  if (status === 'completed') {
    return {
      status: 'completed',
      ...(responseId ? { responseId } : {}),
      ...(usage ? { usage } : {}),
    };
  }

  if (status === 'incomplete') {
    return {
      status: 'incomplete',
      ...(responseId ? { responseId } : {}),
      ...(asNonEmptyString(responseLike.incomplete_details?.reason)
        ? { incompleteReason: asNonEmptyString(responseLike.incomplete_details?.reason) }
        : {}),
      ...(usage ? { usage } : {}),
    };
  }

  if (status === 'failed') {
    return {
      status: 'failed',
      ...(responseId ? { responseId } : {}),
      ...(asNonEmptyString(responseLike.error?.message)
        ? { errorMessage: asNonEmptyString(responseLike.error?.message) }
        : {}),
      ...(asNonEmptyString(responseLike.error?.code)
        ? { errorCode: asNonEmptyString(responseLike.error?.code) }
        : {}),
      ...(usage ? { usage } : {}),
    };
  }

  return {
    status: 'unknown',
    ...(responseId ? { responseId } : {}),
    ...(usage ? { usage } : {}),
  };
}

export async function createOpenAITextStream(args: {
  apiKey: string;
  model: string;
  maxOutputTokens: number;
  messages: AiModelMessage[];
  signal?: AbortSignal;
}): Promise<OpenAITextStreamResult> {
  const openai = new OpenAI({
    apiKey: args.apiKey,
    timeout: OPENAI_GENERATION_TIMEOUT_MS,
    maxRetries: OPENAI_GENERATION_MAX_RETRIES,
  });

  const instructions = args.messages
    .filter((message) => message.role === 'system')
    .map((message) => message.content)
    .join('\n\n')
    .trim();
  const input = args.messages
    .filter((message) => message.role !== 'system')
    .map((message) => ({
      role: message.role === 'assistant' ? 'assistant' as const : 'user' as const,
      content: message.content,
    }));

  const providerStream = await openai.responses.create(
    {
      model: args.model,
      ...(instructions ? { instructions } : {}),
      input,
      max_output_tokens: args.maxOutputTokens,
      store: false,
      stream: true,
    },
    {
      signal: args.signal,
      timeout: OPENAI_GENERATION_TIMEOUT_MS,
      maxRetries: OPENAI_GENERATION_MAX_RETRIES,
    },
  );

  let settled = false;
  let resolveCompletion: (completion: OpenAITextStreamCompletion) => void = () => {};
  const completion = new Promise<OpenAITextStreamCompletion>((resolve) => {
    resolveCompletion = resolve;
  });
  const settle = (next: OpenAITextStreamCompletion) => {
    if (settled) return;
    settled = true;
    resolveCompletion(next);
  };

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      let finalResponse: unknown = null;

      try {
        for await (const rawEvent of providerStream as AsyncIterable<OpenAIStreamEvent>) {
          const eventType = rawEvent.type;

          if (eventType === 'response.output_text.delta') {
            const delta = asStringValue(rawEvent.delta);
            if (delta !== undefined) {
              controller.enqueue(encoder.encode(delta));
            }
            continue;
          }

          if (
            eventType === 'response.completed' ||
            eventType === 'response.incomplete' ||
            eventType === 'response.failed'
          ) {
            finalResponse = rawEvent.response;
            if (eventType === 'response.failed') {
              const failure = summarizeOpenAIResponse(rawEvent.response);
              throw new Error(failure.errorMessage || 'OpenAI response failed.');
            }
            continue;
          }

          if (eventType === 'error') {
            const errorMessage =
              asNonEmptyString(rawEvent.message) ||
              asNonEmptyString(rawEvent.error?.message) ||
              'OpenAI stream returned an error.';
            throw new Error(errorMessage);
          }
        }

        settle(summarizeOpenAIResponse(finalResponse));
        controller.close();
      } catch (error) {
        const providerSummary = summarizeOpenAIResponse(finalResponse);
        settle({
          ...providerSummary,
          status: 'failed',
          errorMessage: providerSummary.errorMessage || toErrorMessage(error, 'OpenAI stream failed.'),
        });
        controller.error(error);
      }
    },
    cancel(reason) {
      settle({
        status: 'aborted',
        errorMessage: typeof reason === 'string' ? reason : 'Client aborted the response stream.',
      });
    },
  });

  return { stream, completion };
}
