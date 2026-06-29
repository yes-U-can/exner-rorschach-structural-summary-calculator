#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const DEFAULT_EVAL_DIR = 'docs/ai-evals';
const COST_TOLERANCE_USD = 0.00001;

const SECRET_PATTERNS = [
  { name: 'OpenAI-style secret key', regex: /\bsk-[A-Za-z0-9_-]{20,}\b/g },
  { name: 'Google API key', regex: /\bAIza[0-9A-Za-z_-]{30,}\b/g },
  { name: 'Private key block', regex: /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/g },
];

const RAW_MODEL_OUTPUT_KEYS = new Set([
  'answer',
  'completion',
  'content',
  'message',
  'messages',
  'output',
  'prompt',
  'raw',
  'raw_output',
  'rawoutput',
  'rawresponse',
  'response',
  'responsetext',
  'text',
]);

const ALLOWED_OUTPUT_METADATA_KEYS = new Set([
  'outputchars',
  'outputtokens',
]);

function parseArgs(argv) {
  const args = {
    dir: DEFAULT_EVAL_DIR,
    json: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === '--json') {
      args.json = true;
      continue;
    }

    const value = argv[index + 1];
    if (key === '--dir') {
      args.dir = value;
      index += 1;
    }
  }

  if (!args.dir) {
    throw new Error('--dir must not be empty.');
  }

  return args;
}

function normalizeKey(key) {
  return String(key).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function scanSecrets(fileName, text, findings) {
  for (const pattern of SECRET_PATTERNS) {
    pattern.regex.lastIndex = 0;
    for (const match of text.matchAll(pattern.regex)) {
      findings.push({
        file: fileName,
        type: 'secret_shaped_value',
        message: `${pattern.name} at byte ${match.index ?? 0}`,
      });
    }
  }
}

function scanRawOutputFields(fileName, lineNumber, value, findings, path = []) {
  if (!value || typeof value !== 'object') return;

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      scanRawOutputFields(fileName, lineNumber, item, findings, [...path, String(index)]);
    });
    return;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    const normalized = normalizeKey(key);
    if (RAW_MODEL_OUTPUT_KEYS.has(normalized) && !ALLOWED_OUTPUT_METADATA_KEYS.has(normalized)) {
      findings.push({
        file: fileName,
        line: lineNumber,
        type: 'raw_model_output_field',
        message: `Disallowed raw output-like field: ${[...path, key].join('.')}`,
      });
      continue;
    }

    scanRawOutputFields(fileName, lineNumber, nestedValue, findings, [...path, key]);
  }
}

function increment(map, key, amount = 1) {
  if (!key) return;
  map.set(key, (map.get(key) ?? 0) + amount);
}

function objectFromMap(map) {
  return Object.fromEntries([...map.entries()].sort(([left], [right]) => left.localeCompare(right)));
}

function compareIssueCounts(expected = {}, actualMap) {
  const actual = objectFromMap(actualMap);
  const keys = new Set([...Object.keys(expected), ...Object.keys(actual)]);

  for (const key of keys) {
    if ((expected[key] ?? 0) !== (actual[key] ?? 0)) {
      return false;
    }
  }

  return true;
}

function validateFixtureResult(fileName, lineNumber, event, findings) {
  const requiredStringFields = ['fixtureId', 'status', 'locale', 'model', 'retrieval'];
  for (const field of requiredStringFields) {
    if (typeof event[field] !== 'string' || !event[field]) {
      findings.push({
        file: fileName,
        line: lineNumber,
        type: 'invalid_fixture_result',
        message: `Missing string field: ${field}`,
      });
    }
  }

  if (!Array.isArray(event.issueTypes)) {
    findings.push({
      file: fileName,
      line: lineNumber,
      type: 'invalid_fixture_result',
      message: 'issueTypes must be an array.',
    });
  }

  for (const field of ['costUsd', 'outputChars']) {
    if (typeof event[field] !== 'number' || !Number.isFinite(event[field]) || event[field] < 0) {
      findings.push({
        file: fileName,
        line: lineNumber,
        type: 'invalid_fixture_result',
        message: `${field} must be a non-negative number.`,
      });
    }
  }

  if (!event.usage || typeof event.usage !== 'object') {
    findings.push({
      file: fileName,
      line: lineNumber,
      type: 'invalid_fixture_result',
      message: 'usage must be present.',
    });
    return;
  }

  for (const field of ['inputTokens', 'outputTokens', 'totalTokens']) {
    if (typeof event.usage[field] !== 'number' || !Number.isFinite(event.usage[field]) || event.usage[field] < 0) {
      findings.push({
        file: fileName,
        line: lineNumber,
        type: 'invalid_fixture_result',
        message: `usage.${field} must be a non-negative number.`,
      });
    }
  }
}

function summarizeFile(filePath) {
  const fileName = basename(filePath);
  const text = readFileSync(filePath, 'utf8');
  const findings = [];
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  const issueCounts = new Map();
  const statusCounts = new Map();
  const models = new Set();
  const locales = new Set();
  const retrievalModes = new Set();
  const types = new Map();

  const summary = {
    file: fileName,
    lines: lines.length,
    fixtureResults: 0,
    issueBearingFixtureResults: 0,
    failedRuns: 0,
    totalCostUsd: 0,
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    outputChars: 0,
    models: [],
    locales: [],
    retrievalModes: [],
    issueCounts: {},
    statusCounts: {},
    hasBatchSummary: false,
    isFinalPass: fileName.includes('final-pass'),
    findings,
  };

  scanSecrets(fileName, text, findings);

  let batchSummary = null;
  for (let index = 0; index < lines.length; index += 1) {
    const lineNumber = index + 1;
    const line = lines[index];
    let event;

    try {
      event = JSON.parse(line);
    } catch (error) {
      findings.push({
        file: fileName,
        line: lineNumber,
        type: 'invalid_json',
        message: error.message,
      });
      continue;
    }

    scanRawOutputFields(fileName, lineNumber, event, findings);
    increment(types, event.type ?? 'missing_type');

    if (event.type === 'fixture_result') {
      validateFixtureResult(fileName, lineNumber, event, findings);
      summary.fixtureResults += 1;
      summary.totalCostUsd += event.costUsd ?? 0;
      summary.outputChars += event.outputChars ?? 0;
      summary.inputTokens += event.usage?.inputTokens ?? 0;
      summary.outputTokens += event.usage?.outputTokens ?? 0;
      summary.totalTokens += event.usage?.totalTokens ?? 0;
      increment(statusCounts, event.status);
      models.add(event.model);
      locales.add(event.locale);
      retrievalModes.add(event.retrieval);

      const issueTypes = Array.isArray(event.issueTypes) ? event.issueTypes : [];
      if (issueTypes.length > 0 || event.status !== 'completed') {
        summary.issueBearingFixtureResults += 1;
      }
      for (const issueType of issueTypes) {
        increment(issueCounts, issueType);
      }
    } else if (event.type === 'run_end') {
      if (event.exitCode !== 0) {
        summary.failedRuns += 1;
      }
    } else if (event.type === 'batch_summary') {
      batchSummary = event;
      summary.hasBatchSummary = true;
    }
  }

  summary.totalCostUsd = Number(summary.totalCostUsd.toFixed(8));
  summary.models = [...models].sort();
  summary.locales = [...locales].sort();
  summary.retrievalModes = [...retrievalModes].sort();
  summary.issueCounts = objectFromMap(issueCounts);
  summary.statusCounts = objectFromMap(statusCounts);
  summary.eventTypes = objectFromMap(types);

  if (batchSummary) {
    if (batchSummary.totalCalls !== summary.fixtureResults) {
      findings.push({
        file: fileName,
        type: 'batch_summary_mismatch',
        message: `batch_summary.totalCalls=${batchSummary.totalCalls} but parsed fixtureResults=${summary.fixtureResults}`,
      });
    }

    if (Math.abs((batchSummary.totalCostUsd ?? 0) - summary.totalCostUsd) > COST_TOLERANCE_USD) {
      findings.push({
        file: fileName,
        type: 'batch_summary_mismatch',
        message: `batch_summary.totalCostUsd=${batchSummary.totalCostUsd} but parsed totalCostUsd=${summary.totalCostUsd}`,
      });
    }

    if (batchSummary.failedRuns !== summary.failedRuns) {
      findings.push({
        file: fileName,
        type: 'batch_summary_mismatch',
        message: `batch_summary.failedRuns=${batchSummary.failedRuns} but parsed failedRuns=${summary.failedRuns}`,
      });
    }

    if (!compareIssueCounts(batchSummary.issueCounts, issueCounts)) {
      findings.push({
        file: fileName,
        type: 'batch_summary_mismatch',
        message: 'batch_summary.issueCounts does not match parsed fixture_result issueTypes.',
      });
    }
  }

  if (summary.isFinalPass && summary.issueBearingFixtureResults > 0) {
    findings.push({
      file: fileName,
      type: 'final_pass_regression',
      message: `Final-pass artifact has ${summary.issueBearingFixtureResults} issue-bearing fixture result(s).`,
    });
  }

  if (summary.isFinalPass && summary.failedRuns > 0) {
    findings.push({
      file: fileName,
      type: 'final_pass_regression',
      message: `Final-pass artifact has ${summary.failedRuns} failed run(s).`,
    });
  }

  return summary;
}

function aggregate(fileSummaries) {
  const issueCounts = new Map();
  const statusCounts = new Map();
  const models = new Set();
  const locales = new Set();
  const retrievalModes = new Set();

  const total = {
    files: fileSummaries.length,
    fixtureResults: 0,
    issueBearingFixtureResults: 0,
    failedRuns: 0,
    totalCostUsd: 0,
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    outputChars: 0,
    finalPassFiles: 0,
    finalPassFixtureResults: 0,
    finalPassIssueBearingFixtureResults: 0,
    finalPassFailedRuns: 0,
    models: [],
    locales: [],
    retrievalModes: [],
    issueCounts: {},
    statusCounts: {},
    findings: fileSummaries.flatMap((summary) => summary.findings),
  };

  for (const summary of fileSummaries) {
    total.fixtureResults += summary.fixtureResults;
    total.issueBearingFixtureResults += summary.issueBearingFixtureResults;
    total.failedRuns += summary.failedRuns;
    total.totalCostUsd += summary.totalCostUsd;
    total.inputTokens += summary.inputTokens;
    total.outputTokens += summary.outputTokens;
    total.totalTokens += summary.totalTokens;
    total.outputChars += summary.outputChars;
    if (summary.isFinalPass) {
      total.finalPassFiles += 1;
      total.finalPassFixtureResults += summary.fixtureResults;
      total.finalPassIssueBearingFixtureResults += summary.issueBearingFixtureResults;
      total.finalPassFailedRuns += summary.failedRuns;
    }
    summary.models.forEach((item) => models.add(item));
    summary.locales.forEach((item) => locales.add(item));
    summary.retrievalModes.forEach((item) => retrievalModes.add(item));
    Object.entries(summary.issueCounts).forEach(([key, value]) => increment(issueCounts, key, value));
    Object.entries(summary.statusCounts).forEach(([key, value]) => increment(statusCounts, key, value));
  }

  total.totalCostUsd = Number(total.totalCostUsd.toFixed(8));
  total.models = [...models].sort();
  total.locales = [...locales].sort();
  total.retrievalModes = [...retrievalModes].sort();
  total.issueCounts = objectFromMap(issueCounts);
  total.statusCounts = objectFromMap(statusCounts);

  return total;
}

function printHumanReport(result) {
  console.log('AI eval artifact summary');
  console.log(`- files: ${result.total.files}`);
  console.log(`- fixture results: ${result.total.fixtureResults}`);
  console.log(`- issue-bearing fixture results: ${result.total.issueBearingFixtureResults}`);
  console.log(`- failed runs: ${result.total.failedRuns}`);
  console.log(`- final-pass files: ${result.total.finalPassFiles}`);
  console.log(`- final-pass fixture results: ${result.total.finalPassFixtureResults}`);
  console.log(`- final-pass issue-bearing fixture results: ${result.total.finalPassIssueBearingFixtureResults}`);
  console.log(`- final-pass failed runs: ${result.total.finalPassFailedRuns}`);
  console.log(`- estimated cost: $${result.total.totalCostUsd.toFixed(6)}`);
  console.log(`- tokens: input=${result.total.inputTokens}, output=${result.total.outputTokens}, total=${result.total.totalTokens}`);
  console.log(`- models: ${result.total.models.join(', ') || 'none'}`);
  console.log(`- locales: ${result.total.locales.join(', ') || 'none'}`);
  console.log(`- retrieval modes: ${result.total.retrievalModes.join(', ') || 'none'}`);
  console.log(`- issue counts: ${JSON.stringify(result.total.issueCounts)}`);

  console.log('\nPer-file results:');
  for (const summary of result.files) {
    const status = summary.findings.length ? 'FAIL' : 'PASS';
    const finalPass = summary.isFinalPass ? ', finalPass=yes' : '';
    console.log(`- ${status} ${summary.file}: fixtures=${summary.fixtureResults}, issues=${summary.issueBearingFixtureResults}, cost=$${summary.totalCostUsd.toFixed(6)}, summary=${summary.hasBatchSummary ? 'yes' : 'no'}${finalPass}`);
  }

  if (result.total.findings.length) {
    console.log('\nFindings:');
    for (const finding of result.total.findings) {
      const location = finding.line ? `${finding.file}:${finding.line}` : finding.file;
      console.log(`- ${location} [${finding.type}] ${finding.message}`);
    }
    return;
  }

  console.log('\nChecks passed: valid JSONL, no key-shaped secrets, no raw model output fields, matching batch summaries.');
}

const args = parseArgs(process.argv.slice(2));
const evalDir = resolve(args.dir);
const stats = statSync(evalDir);
if (!stats.isDirectory()) {
  throw new Error(`Eval artifact path is not a directory: ${evalDir}`);
}

const files = readdirSync(evalDir)
  .filter((fileName) => fileName.endsWith('.jsonl'))
  .sort()
  .map((fileName) => join(evalDir, fileName));

if (!files.length) {
  throw new Error(`No JSONL eval artifacts found in ${evalDir}`);
}

const fileSummaries = files.map(summarizeFile);
const result = {
  directory: evalDir,
  files: fileSummaries,
  total: aggregate(fileSummaries),
};

if (args.json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  printHumanReport(result);
}

if (result.total.findings.length) {
  process.exitCode = 1;
}
