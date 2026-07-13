import { describe, expect, it } from 'vitest';

import { POST } from '@/app/api/chat/route';
import { evaluateAiHarnessOutput } from '@/lib/ai/evalContracts';
import { getAiHarnessEvalFixtures } from '@/lib/ai/evalFixtures';
import {
  createByokSession,
  encryptByokSession,
  getByokCookieName,
} from '@/lib/byokSession';
import { CHAT_STREAM_PROTOCOL, consumeChatEventStream } from '@/lib/chatStreamProtocol';
import { validateStructuralSummaryCsv } from '@/lib/structuralSummaryCsv';

const apiKey = process.env.OPENAI_API_KEY?.trim() || undefined;
const shouldRun = process.env.OPENAI_ROUTE_LIVE_EVAL === '1' && Boolean(apiKey);
const fixture = getAiHarnessEvalFixtures().find(
  (candidate) => candidate.id === 'interpretation-en-low-r-validity',
);
const syntheticSummaryCsv = [
  'Zf,ZSum,ZEst,Zd,R,Lambda,EB,EA,EBPer,eb,es,AdjEs,D,AdjD,PTI,DEPI,CDI,SCON,HVI,OBS,GHR,PHR',
  "8,21.5,24,'-2.5,9,.80,2:1,3,2.00,3:5,8,6,-1,-1,0,0,0,0,0,0,2,3",
].join('\n');

describe.runIf(shouldRun)('OpenAI production-like chat route eval', () => {
  it('completes the real BYOK, RAG, prompt, and stream path without persisting output', async () => {
    expect(fixture).toBeDefined();
    const validatedSummary = validateStructuralSummaryCsv(syntheticSummaryCsv);
    expect(validatedSummary.ok).toBe(true);
    const session = createByokSession('openai', apiKey!);
    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Chat-Stream-Protocol': CHAT_STREAM_PROTOCOL,
        Cookie: `${getByokCookieName()}=${encodeURIComponent(encryptByokSession(session))}`,
      },
      body: JSON.stringify({
        message: fixture!.userMessage,
        mode: 'interpretation',
        contextMessages: [],
        workflowContext: { structuralSummaryCsv: syntheticSummaryCsv },
        lang: 'en',
      }),
    });

    const response = await POST(request);
    const outputParts: string[] = [];
    const terminal = await consumeChatEventStream(response.body!, (delta) => outputParts.push(delta));
    const output = outputParts.join('');
    const contract = evaluateAiHarnessOutput(fixture!, output);

    console.info(
      JSON.stringify({
        fixtureId: fixture!.id,
        status: response.status,
        model: response.headers.get('X-Chat-Model-Id'),
        workflow: response.headers.get('X-Chat-Workflow-Mode'),
        terminalType: terminal.type,
        outputChars: output.trim().length,
        issueTypes: contract.issues.map((issue) => issue.type),
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('X-Chat-Stream-Protocol')).toBe(CHAT_STREAM_PROTOCOL);
    expect(response.headers.get('X-Chat-Model-Id')).toBe('gpt-5.5');
    expect(response.headers.get('X-Chat-Workflow-Mode')).toBe('interpretation');
    expect(terminal).toEqual({ type: 'complete' });
    expect(output.trim().length).toBeGreaterThan(80);
    expect(contract.passed, contract.issues.map((issue) => issue.message).join('; ')).toBe(true);
  }, 180_000);
});

describe.skipIf(shouldRun)('OpenAI production-like chat route eval', () => {
  it('skips unless the explicit live route gate and API key are present', () => {
    expect(shouldRun).toBe(false);
  });
});
