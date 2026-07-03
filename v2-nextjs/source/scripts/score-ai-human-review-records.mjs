#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const DEFAULT_INPUT = 'docs/ai-evals/human-review-records';
const DEFAULT_RUBRIC = 'docs/ai-evals/human-rubric-v2.1.x.json';
const WEIGHTED_SCORE_TOLERANCE = 0.01;

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

const ALLOWED_OUTPUT_METADATA_KEYS = new Set(['outputchars', 'outputtokens']);

function parseArgs(argv) {
  const args = {
    input: DEFAULT_INPUT,
    json: false,
    requirePass: false,
    rubric: DEFAULT_RUBRIC,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];

    if (key === '--json') {
      args.json = true;
      continue;
    }

    if (key === '--require-pass') {
      args.requirePass = true;
      continue;
    }

    const value = argv[index + 1];
    if (key === '--input') {
      args.input = value;
      index += 1;
      continue;
    }

    if (key === '--rubric') {
      args.rubric = value;
      index += 1;
      continue;
    }
  }

  if (!args.input) throw new Error('--input must not be empty.');
  if (!args.rubric) throw new Error('--rubric must not be empty.');

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

function roundWeightedScore(value) {
  return Number(value.toFixed(2));
}

function expectedDecision(weightedScore, blockingFailures, minimumWeightedScore) {
  if (blockingFailures.length > 0) return 'fail';
  if (weightedScore >= minimumWeightedScore) return 'pass';
  if (weightedScore >= 60) return 'revise';
  return 'fail';
}

function getJsonlFiles(inputPath) {
  const resolved = resolve(inputPath);
  if (!existsSync(resolved)) {
    throw new Error(`Human review record path does not exist: ${resolved}`);
  }

  const stats = statSync(resolved);
  if (stats.isFile()) {
    if (!resolved.endsWith('.jsonl')) {
      throw new Error(`Human review record file must end with .jsonl: ${resolved}`);
    }
    return [resolved];
  }

  if (!stats.isDirectory()) {
    throw new Error(`Human review record path is not a file or directory: ${resolved}`);
  }

  const files = readdirSync(resolved)
    .filter((fileName) => fileName.endsWith('.jsonl'))
    .sort()
    .map((fileName) => join(resolved, fileName));

  if (!files.length) {
    throw new Error(`No JSONL human review records found in ${resolved}`);
  }

  return files;
}

function validateRecord(fileName, lineNumber, record, rubric, indexes, args) {
  const findings = [];

  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return {
      recordSummary: null,
      findings: [
        {
          file: fileName,
          line: lineNumber,
          type: 'invalid_record',
          message: 'Record must be a JSON object.',
        },
      ],
    };
  }

  if (record.type !== 'human_review_record') {
    findings.push({
      file: fileName,
      line: lineNumber,
      type: 'invalid_record',
      message: 'type must be human_review_record.',
    });
  }

  for (const field of rubric.reviewRecordSchema.requiredFields) {
    if (!(field in record)) {
      findings.push({
        file: fileName,
        line: lineNumber,
        type: 'missing_required_field',
        message: `Missing required field: ${field}`,
      });
    }
  }

  const workflowMode = record.workflowMode;
  const workflowProfile = indexes.workflowProfiles.get(workflowMode);
  if (!workflowProfile) {
    findings.push({
      file: fileName,
      line: lineNumber,
      type: 'invalid_workflow_mode',
      message: `Unknown workflowMode: ${workflowMode}`,
    });
  }

  const decisionValues = new Set(rubric.reviewRecordSchema.decisionValues);
  if (!decisionValues.has(record.decision)) {
    findings.push({
      file: fileName,
      line: lineNumber,
      type: 'invalid_decision',
      message: `decision must be one of: ${rubric.reviewRecordSchema.decisionValues.join(', ')}`,
    });
  }

  for (const field of ['artifactId', 'fixtureId', 'locale', 'model', 'reviewerRole', 'notes']) {
    if (typeof record[field] !== 'string' || !record[field]) {
      findings.push({
        file: fileName,
        line: lineNumber,
        type: 'invalid_record',
        message: `${field} must be a non-empty string.`,
      });
    }
  }

  const dimensionScores = record.dimensionScores;
  if (!dimensionScores || typeof dimensionScores !== 'object' || Array.isArray(dimensionScores)) {
    findings.push({
      file: fileName,
      line: lineNumber,
      type: 'invalid_dimension_scores',
      message: 'dimensionScores must be an object.',
    });
  }

  const blockingFailures = record.blockingFailures;
  if (!Array.isArray(blockingFailures) || blockingFailures.some((item) => typeof item !== 'string')) {
    findings.push({
      file: fileName,
      line: lineNumber,
      type: 'invalid_blocking_failures',
      message: 'blockingFailures must be an array of strings.',
    });
  }

  if (typeof record.weightedScore !== 'number' || !Number.isFinite(record.weightedScore)) {
    findings.push({
      file: fileName,
      line: lineNumber,
      type: 'invalid_weighted_score',
      message: 'weightedScore must be a finite number.',
    });
  }

  let computedWeightedScore = null;
  let computedDecision = null;

  if (workflowProfile && dimensionScores && typeof dimensionScores === 'object' && !Array.isArray(dimensionScores)) {
    const expectedDimensionIds = Object.keys(workflowProfile.dimensionWeights);
    const actualDimensionIds = Object.keys(dimensionScores);

    for (const dimensionId of expectedDimensionIds) {
      if (!(dimensionId in dimensionScores)) {
        findings.push({
          file: fileName,
          line: lineNumber,
          type: 'missing_dimension_score',
          message: `Missing dimension score: ${dimensionId}`,
        });
      }
    }

    for (const dimensionId of actualDimensionIds) {
      const dimension = indexes.dimensions.get(dimensionId);
      if (!dimension) {
        findings.push({
          file: fileName,
          line: lineNumber,
          type: 'unknown_dimension_score',
          message: `Unknown dimension score: ${dimensionId}`,
        });
        continue;
      }

      if (!dimension.appliesTo.includes(workflowMode)) {
        findings.push({
          file: fileName,
          line: lineNumber,
          type: 'wrong_workflow_dimension',
          message: `Dimension ${dimensionId} does not apply to ${workflowMode}.`,
        });
      }

      if (!(dimensionId in workflowProfile.dimensionWeights)) {
        findings.push({
          file: fileName,
          line: lineNumber,
          type: 'unexpected_dimension_score',
          message: `Dimension ${dimensionId} is not weighted for ${workflowMode}.`,
        });
      }

      const score = dimensionScores[dimensionId];
      if (!Number.isInteger(score) || score < 0 || score > 4) {
        findings.push({
          file: fileName,
          line: lineNumber,
          type: 'invalid_dimension_score',
          message: `Dimension ${dimensionId} must be an integer from 0 to 4.`,
        });
      }
    }

    computedWeightedScore = roundWeightedScore(
      Object.entries(workflowProfile.dimensionWeights).reduce((sum, [dimensionId, weight]) => {
        const score = dimensionScores[dimensionId];
        if (!Number.isInteger(score) || score < 0 || score > 4) return sum;
        return sum + (score / 4) * weight;
      }, 0),
    );
  }

  const safeBlockingFailures = Array.isArray(blockingFailures)
    ? blockingFailures.filter((item) => typeof item === 'string')
    : [];

  for (const failureId of safeBlockingFailures) {
    const failure = indexes.blockingFailures.get(failureId);
    if (!failure) {
      findings.push({
        file: fileName,
        line: lineNumber,
        type: 'unknown_blocking_failure',
        message: `Unknown blocking failure: ${failureId}`,
      });
      continue;
    }

    if (!failure.appliesTo.includes(workflowMode)) {
      findings.push({
        file: fileName,
        line: lineNumber,
        type: 'wrong_workflow_blocking_failure',
        message: `Blocking failure ${failureId} does not apply to ${workflowMode}.`,
      });
    }
  }

  if (computedWeightedScore !== null) {
    if (
      typeof record.weightedScore === 'number' &&
      Math.abs(record.weightedScore - computedWeightedScore) > WEIGHTED_SCORE_TOLERANCE
    ) {
      findings.push({
        file: fileName,
        line: lineNumber,
        type: 'weighted_score_mismatch',
        message: `weightedScore=${record.weightedScore} but computed weightedScore=${computedWeightedScore}.`,
      });
    }

    computedDecision = expectedDecision(
      computedWeightedScore,
      safeBlockingFailures,
      rubric.passingPolicy.minimumWeightedScore,
    );

    if (record.decision && record.decision !== computedDecision) {
      findings.push({
        file: fileName,
        line: lineNumber,
        type: 'decision_mismatch',
        message: `decision=${record.decision} but computed decision=${computedDecision}.`,
      });
    }

    if (args.requirePass && computedDecision !== 'pass') {
      findings.push({
        file: fileName,
        line: lineNumber,
        type: 'non_passing_review_record',
        message: `Release gate requires pass, but computed decision=${computedDecision}.`,
      });
    }
  }

  return {
    recordSummary: {
      artifactId: record.artifactId,
      fixtureId: record.fixtureId,
      workflowMode,
      locale: record.locale,
      model: record.model,
      decision: record.decision,
      computedDecision,
      weightedScore: record.weightedScore,
      computedWeightedScore,
      blockingFailureCount: safeBlockingFailures.length,
    },
    findings,
  };
}

function summarizeFile(filePath, rubric, indexes, args) {
  const fileName = basename(filePath);
  const text = readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  const findings = [];
  const records = [];
  const decisionCounts = new Map();
  const workflowCounts = new Map();

  scanSecrets(fileName, text, findings);

  for (let index = 0; index < lines.length; index += 1) {
    const lineNumber = index + 1;
    const line = lines[index];
    let record;

    try {
      record = JSON.parse(line);
    } catch (error) {
      findings.push({
        file: fileName,
        line: lineNumber,
        type: 'invalid_json',
        message: error.message,
      });
      continue;
    }

    scanRawOutputFields(fileName, lineNumber, record, findings);
    const validation = validateRecord(fileName, lineNumber, record, rubric, indexes, args);
    findings.push(...validation.findings);

    if (validation.recordSummary) {
      records.push(validation.recordSummary);
      increment(decisionCounts, validation.recordSummary.computedDecision ?? validation.recordSummary.decision);
      increment(workflowCounts, validation.recordSummary.workflowMode);
    }
  }

  return {
    file: fileName,
    lines: lines.length,
    records: records.length,
    decisionCounts: objectFromMap(decisionCounts),
    workflowCounts: objectFromMap(workflowCounts),
    findings,
    recordSummaries: records,
  };
}

function aggregate(fileSummaries) {
  const decisionCounts = new Map();
  const workflowCounts = new Map();
  let weightedScoreTotal = 0;
  let weightedScoreCount = 0;

  for (const summary of fileSummaries) {
    Object.entries(summary.decisionCounts).forEach(([key, value]) => increment(decisionCounts, key, value));
    Object.entries(summary.workflowCounts).forEach(([key, value]) => increment(workflowCounts, key, value));

    for (const record of summary.recordSummaries) {
      if (typeof record.computedWeightedScore === 'number') {
        weightedScoreTotal += record.computedWeightedScore;
        weightedScoreCount += 1;
      }
    }
  }

  return {
    files: fileSummaries.length,
    records: fileSummaries.reduce((sum, summary) => sum + summary.records, 0),
    decisionCounts: objectFromMap(decisionCounts),
    workflowCounts: objectFromMap(workflowCounts),
    averageWeightedScore: weightedScoreCount
      ? roundWeightedScore(weightedScoreTotal / weightedScoreCount)
      : null,
    findings: fileSummaries.flatMap((summary) => summary.findings),
  };
}

function printHumanReport(result) {
  console.log('AI human review record summary');
  console.log(`- files: ${result.total.files}`);
  console.log(`- records: ${result.total.records}`);
  console.log(`- decisions: ${JSON.stringify(result.total.decisionCounts)}`);
  console.log(`- workflows: ${JSON.stringify(result.total.workflowCounts)}`);
  console.log(`- average weighted score: ${result.total.averageWeightedScore ?? 'n/a'}`);

  console.log('\nPer-file results:');
  for (const summary of result.files) {
    const status = summary.findings.length ? 'FAIL' : 'PASS';
    console.log(`- ${status} ${summary.file}: records=${summary.records}, decisions=${JSON.stringify(summary.decisionCounts)}`);
  }

  if (result.total.findings.length) {
    console.log('\nFindings:');
    for (const finding of result.total.findings) {
      const location = finding.line ? `${finding.file}:${finding.line}` : finding.file;
      console.log(`- ${location} [${finding.type}] ${finding.message}`);
    }
    return;
  }

  console.log('\nChecks passed: valid JSONL, no key-shaped secrets, no raw model output fields, scores and decisions match the rubric.');
}

const args = parseArgs(process.argv.slice(2));
const rubric = JSON.parse(readFileSync(resolve(args.rubric), 'utf8'));
const indexes = {
  blockingFailures: new Map(rubric.blockingFailures.map((failure) => [failure.id, failure])),
  dimensions: new Map(rubric.dimensions.map((dimension) => [dimension.id, dimension])),
  workflowProfiles: new Map(Object.entries(rubric.workflowProfiles)),
};
const files = getJsonlFiles(args.input);
const fileSummaries = files.map((filePath) => summarizeFile(filePath, rubric, indexes, args));
const result = {
  input: resolve(args.input),
  rubric: resolve(args.rubric),
  requirePass: args.requirePass,
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
