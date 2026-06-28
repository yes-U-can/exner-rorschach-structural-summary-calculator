import { describe, expect, it } from 'vitest';
import {
  AI_HARNESS_VERSION,
  appendAiResponsePolicyPrompt,
  applyAiHarnessHeaders,
  buildAiResponsePolicyPrompt,
  buildAiRunMetadata,
  getAiMaxOutputTokens,
  getAiPromptProfile,
  summarizeOpenAIResponse,
} from '@/lib/ai/harness';

describe('AI harness profiles', () => {
  it('uses stable prompt and response policy ids by workflow mode', () => {
    const interpretation = getAiPromptProfile('interpretation');
    const codingAssist = getAiPromptProfile('coding_assist');

    expect(interpretation).toMatchObject({
      harnessVersion: AI_HARNESS_VERSION,
      promptProfileId: 'sicp-default-v1',
      responsePolicyId: 'interpretation-concise-progressive-v1',
    });
    expect(codingAssist).toMatchObject({
      harnessVersion: AI_HARNESS_VERSION,
      promptProfileId: 'sicp-coding-assist-v1',
      responsePolicyId: 'coding-assist-concise-progressive-v1',
    });
  });

  it('keeps workflow output caps below the selected model ceiling', () => {
    const interpretation = getAiPromptProfile('interpretation');
    const codingAssist = getAiPromptProfile('coding_assist');

    expect(getAiMaxOutputTokens(interpretation, 128000)).toBe(2200);
    expect(getAiMaxOutputTokens(codingAssist, 128000)).toBe(2600);
    expect(getAiMaxOutputTokens(codingAssist, 1200)).toBe(1200);
  });

  it('adds harness metadata headers without changing response body shape', () => {
    const headers = new Headers();
    const profile = getAiPromptProfile('interpretation');

    applyAiHarnessHeaders(headers, profile);

    expect(headers.get('X-Chat-AI-Harness-Version')).toBe(AI_HARNESS_VERSION);
    expect(headers.get('X-Chat-Prompt-Profile-Id')).toBe('sicp-default-v1');
    expect(headers.get('X-Chat-Response-Policy-Id')).toBe('interpretation-concise-progressive-v1');
  });

  it('builds mode-specific response policy text for complete progressive answers', () => {
    const interpretationPolicy = buildAiResponsePolicyPrompt(getAiPromptProfile('interpretation'));
    const codingPolicy = buildAiResponsePolicyPrompt(getAiPromptProfile('coding_assist'));

    expect(interpretationPolicy).toContain('Policy id: interpretation-concise-progressive-v1');
    expect(interpretationPolicy).toContain('provisional hypothesis');
    expect(interpretationPolicy).toContain('Keep diagnostic, treatment, medication, legal, and forensic conclusions out of scope.');
    expect(codingPolicy).toContain('Policy id: coding-assist-concise-progressive-v1');
    expect(codingPolicy).toContain('Candidate codes require clinician confirmation.');
    expect(codingPolicy).toContain('Finish every section or bullet group you start.');
  });

  it('appends the harness policy after the product guardrails', () => {
    const prompt = appendAiResponsePolicyPrompt(
      '# Product Guardrails\n\nUse the reference corpus.',
      getAiPromptProfile('interpretation'),
    );

    expect(prompt).toMatch(/^# Product Guardrails/);
    expect(prompt).toContain('---\n\n# AI Harness Response Policy');
    expect(prompt).toContain('Use progressive disclosure');
  });
});

describe('OpenAI response summaries', () => {
  it('captures incomplete responses and token usage for backend audit metadata', () => {
    const completion = summarizeOpenAIResponse({
      id: 'resp_123',
      status: 'incomplete',
      incomplete_details: { reason: 'max_output_tokens' },
      usage: {
        input_tokens: 1000,
        output_tokens: 2200,
        total_tokens: 3200,
      },
    });

    expect(completion).toEqual({
      status: 'incomplete',
      responseId: 'resp_123',
      incompleteReason: 'max_output_tokens',
      usage: {
        inputTokens: 1000,
        outputTokens: 2200,
        totalTokens: 3200,
      },
    });
  });

  it('builds privacy-safe run metadata without raw prompt or chat content', () => {
    const profile = getAiPromptProfile('coding_assist');
    const metadata = buildAiRunMetadata({
      profile,
      provider: 'openai',
      modelId: 'gpt-5.5',
      workflowType: 'coding_assist',
      locale: 'ko',
      maxOutputTokens: 2600,
      completion: {
        status: 'completed',
        responseId: 'resp_456',
        usage: {
          inputTokens: 800,
          outputTokens: 300,
          totalTokens: 1100,
        },
      },
    });

    expect(metadata).toEqual({
      aiHarnessVersion: AI_HARNESS_VERSION,
      promptProfileId: 'sicp-coding-assist-v1',
      responsePolicyId: 'coding-assist-concise-progressive-v1',
      provider: 'openai',
      modelId: 'gpt-5.5',
      workflowType: 'coding_assist',
      locale: 'ko',
      maxOutputTokens: 2600,
      providerResponseStatus: 'completed',
      providerResponseId: 'resp_456',
      usageInputTokens: 800,
      usageOutputTokens: 300,
      usageTotalTokens: 1100,
    });
    expect(Object.keys(metadata)).not.toContain('messages');
    expect(Object.keys(metadata)).not.toContain('prompt');
    expect(Object.keys(metadata)).not.toContain('rawContent');
  });
});
