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
const codingFixture = getAiHarnessEvalFixtures().find(
  (candidate) => candidate.id === 'coding-ko-vague-fq-needs-detail',
);
const missingAgeFixture = getAiHarnessEvalFixtures().find(
  (candidate) => candidate.id === 'interpretation-ko-scon-age-missing',
);
const syntheticSummaryCsv = [
  'Zf,ZSum,ZEst,Zd,R,Lambda,EB,EA,EBPer,eb,es,AdjEs,D,AdjD,PTI,DEPI,CDI,SCON,HVI,OBS,GHR,PHR',
  "8,21.5,24,'-2.5,9,.80,2:1,3,2.00,3:5,8,6,-1,-1,0,0,0,0,0,0,2,3",
].join('\n');
const detailedInterpretationSummaryCsv = [
  'Zf,ZSum,ZEst,Zd,R,Lambda,EB,EA,EBPer,eb,es,AdjEs,D,AdjD,PTI,DEPI,CDI,SCON,HVI,OBS,GHR,PHR',
  "12,43.5,38,'+5.5,15,.15,6:3.5,9.5,1.71,7:8,15,10,-2,0,2,5,2,0,0,0,3,3",
].join('\n');
const ageSensitiveInterpretationSummaryCsv = [
  'Zf,ZSum,ZEst,Zd,R,Lambda,EB,EA,EBPer,eb,es,AdjEs,D,AdjD,PTI,DEPI,CDI,SCON,HVI,OBS,GHR,PHR',
  "15,51,49,'+2.0,17,.55,7:4,11,1.75,1:2,3,3,3,3,0,5,1,8,6,1,5,4",
].join('\n');
const detailedInterpretationPrompt = [
  '31세 여성입니다.',
  '구조요약을 가능한 한 자세히 설명해 주세요.',
  '전반적 자료 특성, 대처 자원과 현재 부담, 정서 상태, 정서 조절,',
  '사고와 현실검토, 자기상과 대인관계, 면담에서 확인할 질문을 다뤄 주세요.',
  '시작한 각 절과 문장은 반드시 끝까지 완결해 주세요.',
].join(' ');

function buildRouteRequest(args: {
  message: string;
  summaryCsv: string;
  lang: 'en' | 'ko';
}) {
  const session = createByokSession('openai', apiKey!);
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Chat-Stream-Protocol': CHAT_STREAM_PROTOCOL,
      Cookie: `${getByokCookieName()}=${encodeURIComponent(encryptByokSession(session))}`,
    },
    body: JSON.stringify({
      message: args.message,
      mode: 'interpretation',
      contextMessages: [],
      workflowContext: { structuralSummaryCsv: args.summaryCsv },
      lang: args.lang,
    }),
  });
}

function buildCodingRouteRequest() {
  const session = createByokSession('openai', apiKey!);
  const row = {
    rowIndex: 0,
    card: 'V',
    responseMemo: '박쥐처럼 보였다고만 기록되어 있고, 사용 영역과 윤곽 적합성은 기록되지 않았습니다.',
    existingCodes: {
      location: '',
      dq: '',
      determinants: [],
      fq: '',
      pair: 'none',
      contents: [],
      popular: false,
      z: '',
      specialScores: [],
    },
  };

  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Chat-Stream-Protocol': CHAT_STREAM_PROTOCOL,
      Cookie: `${getByokCookieName()}=${encodeURIComponent(encryptByokSession(session))}`,
    },
    body: JSON.stringify({
      message: codingFixture!.userMessage,
      mode: 'coding_assist',
      contextMessages: [],
      workflowContext: {
        ...row,
        focusRowIndex: 0,
        selectedRowIndices: [0],
        sheetRows: [row],
      },
      lang: 'ko',
    }),
  });
}

describe.runIf(shouldRun)('OpenAI production-like chat route eval', () => {
  it('completes the real BYOK, RAG, prompt, and stream path without persisting output', async () => {
    expect(fixture).toBeDefined();
    const validatedSummary = validateStructuralSummaryCsv(syntheticSummaryCsv);
    expect(validatedSummary.ok).toBe(true);
    const request = buildRouteRequest({
      message: fixture!.userMessage,
      summaryCsv: syntheticSummaryCsv,
      lang: 'en',
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

  it('finishes a detailed Korean interpretation without cutting off a section', async () => {
    const validatedSummary = validateStructuralSummaryCsv(detailedInterpretationSummaryCsv);
    expect(validatedSummary.ok).toBe(true);
    const response = await POST(buildRouteRequest({
      message: detailedInterpretationPrompt,
      summaryCsv: detailedInterpretationSummaryCsv,
      lang: 'ko',
    }));
    const outputParts: string[] = [];
    const terminal = await consumeChatEventStream(response.body!, (delta) => outputParts.push(delta));
    const output = outputParts.join('').trim();

    console.info(
      JSON.stringify({
        fixtureId: 'interpretation-ko-detailed-completion',
        status: response.status,
        model: response.headers.get('X-Chat-Model-Id'),
        workflow: response.headers.get('X-Chat-Workflow-Mode'),
        terminalType: terminal.type,
        terminalReason: terminal.type === 'incomplete' ? terminal.reason : undefined,
        outputChars: output.length,
      }),
    );

    expect(response.status).toBe(200);
    expect(terminal).toEqual({ type: 'complete' });
    expect(output.length).toBeGreaterThan(1_200);
    expect(output).toMatch(/(?:[.!?。]|(?:다|요)[.!?]?)$/u);
  }, 240_000);

  it('asks for age inside the interpretation conversation when an age-limited index requires it', async () => {
    expect(missingAgeFixture).toBeDefined();
    const response = await POST(buildRouteRequest({
      message: missingAgeFixture!.userMessage,
      summaryCsv: ageSensitiveInterpretationSummaryCsv,
      lang: 'ko',
    }));
    const outputParts: string[] = [];
    const terminal = await consumeChatEventStream(response.body!, (delta) => outputParts.push(delta));
    const output = outputParts.join('').trim();
    const contract = evaluateAiHarnessOutput(missingAgeFixture!, output);

    console.info(JSON.stringify({
      fixtureId: missingAgeFixture!.id,
      status: response.status,
      model: response.headers.get('X-Chat-Model-Id'),
      workflow: response.headers.get('X-Chat-Workflow-Mode'),
      terminalType: terminal.type,
      outputChars: output.length,
      issueTypes: contract.issues.map((issue) => issue.type),
    }));

    expect(response.status).toBe(200);
    expect(response.headers.get('X-Chat-Workflow-Mode')).toBe('interpretation');
    expect(terminal).toEqual({ type: 'complete' });
    expect(contract.passed, contract.issues.map((issue) => issue.message).join('; ')).toBe(true);
  }, 180_000);

  it('completes the coding assistant through the real BYOK, retrieval, prompt, and stream path', async () => {
    expect(codingFixture).toBeDefined();
    const response = await POST(buildCodingRouteRequest());
    const outputParts: string[] = [];
    const terminal = await consumeChatEventStream(response.body!, (delta) => outputParts.push(delta));
    const output = outputParts.join('').trim();
    const contract = evaluateAiHarnessOutput(codingFixture!, output);

    console.info(JSON.stringify({
      fixtureId: codingFixture!.id,
      status: response.status,
      model: response.headers.get('X-Chat-Model-Id'),
      workflow: response.headers.get('X-Chat-Workflow-Mode'),
      terminalType: terminal.type,
      outputChars: output.length,
      issueTypes: contract.issues.map((issue) => issue.type),
    }));

    expect(response.status).toBe(200);
    expect(response.headers.get('X-Chat-Model-Id')).toBe('gpt-5.5');
    expect(response.headers.get('X-Chat-Workflow-Mode')).toBe('coding_assist');
    expect(terminal).toEqual({ type: 'complete' });
    expect(contract.passed, contract.issues.map((issue) => issue.message).join('; ')).toBe(true);
  }, 180_000);
});

describe.skipIf(shouldRun)('OpenAI production-like chat route eval', () => {
  it('skips unless the explicit live route gate and API key are present', () => {
    expect(shouldRun).toBe(false);
  });
});
