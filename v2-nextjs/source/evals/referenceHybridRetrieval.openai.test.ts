import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { getReferenceEmbeddingModel } from '@/lib/referenceEmbeddings';
import { getHybridInterpretationKnowledge } from '@/lib/referenceHybridRetrieval';
import type { Language } from '@/types';

type ChallengeBucket = 'broad' | 'named-variable' | 'relation';

type ChallengeQuery = {
  id: string;
  locale: Language;
  bucket: ChallengeBucket;
  query: string;
  requiredRoutes: string[];
  forbiddenTopRoutePrefixes?: string[];
};

type ChallengeSet = {
  version: string;
  purpose: string;
  topK: number;
  queries: ChallengeQuery[];
  candidateThresholds: {
    broadHitAt1: number;
    broadHitAt8: number;
    namedHitAt4: number;
    relationRequiredRouteCoverageAt8: number;
    broadWorkflowContaminationAt1: number;
  };
};

type FixtureResult = {
  fixtureId: string;
  locale: Language;
  bucket: ChallengeBucket;
  mode: 'lexical' | 'hybrid';
  vectorHitCount: number;
  latencyMs: number;
  returnedRoutes: string[];
  requiredRouteRanks: Record<string, number | null>;
  topRouteContaminated: boolean;
  trace: Array<{
    canonicalRoute: string | null;
    finalScore: number;
    lexicalRank: number | null;
    vectorSimilarity: number | null;
    sourceKinds: Array<'lexical' | 'vector'>;
  }>;
};

function loadChallengeSet(): ChallengeSet {
  const configuredPath =
    process.env.REFERENCE_HYBRID_EVAL_SET ??
    'docs/reference-authoring/evals/hybrid-retrieval-dev-v1.json';
  const filePath = path.resolve(process.cwd(), configuredPath);
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as ChallengeSet;
}

function percentile(values: number[], percentileValue: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil(percentileValue * sorted.length) - 1);
  return sorted[Math.max(0, index)];
}

function ratio(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}

function round(value: number, digits = 4): number {
  return Number(value.toFixed(digits));
}

function getSourceMetadata() {
  const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8')) as {
    version?: string;
  };
  const gitCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const gitDirty =
    execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], {
      encoding: 'utf8',
    }).trim().length > 0;

  return { appVersion: packageJson.version ?? null, gitCommit, gitDirty };
}

const apiKey = process.env.OPENAI_API_KEY?.trim() || undefined;
const challengeSet = loadChallengeSet();
const shouldRun = process.env.REFERENCE_HYBRID_EVAL === '1' && Boolean(apiKey);
const shouldEnforce = process.env.REFERENCE_HYBRID_EVAL_ENFORCE === '1';

describe.runIf(shouldRun)('OpenAI hybrid reference retrieval challenge', () => {
  it('records safe route-level metrics for the configured challenge set', async () => {
    const results: FixtureResult[] = [];

    for (const fixture of challengeSet.queries) {
      const startedAt = performance.now();
      const result = await getHybridInterpretationKnowledge({
        query: fixture.query,
        lang: fixture.locale,
        provider: 'openai',
        apiKey: apiKey!,
        limit: challengeSet.topK,
      });
      const latencyMs = Math.round(performance.now() - startedAt);
      const returnedRoutes = result.items
        .map((item) => item.canonicalRoute)
        .filter((route): route is string => Boolean(route));
      const requiredRouteRanks = Object.fromEntries(
        fixture.requiredRoutes.map((route) => {
          const index = returnedRoutes.indexOf(route);
          return [route, index >= 0 ? index + 1 : null];
        }),
      );
      const topRoute = returnedRoutes[0] ?? '';
      const topRouteContaminated = (fixture.forbiddenTopRoutePrefixes ?? []).some((prefix) =>
        topRoute.startsWith(prefix),
      );

      results.push({
        fixtureId: fixture.id,
        locale: fixture.locale,
        bucket: fixture.bucket,
        mode: result.mode,
        vectorHitCount: result.vectorHitCount,
        latencyMs,
        returnedRoutes,
        requiredRouteRanks,
        topRouteContaminated,
        trace: result.trace.map((entry) => ({
          canonicalRoute: entry.canonicalRoute,
          finalScore: entry.finalScore,
          lexicalRank: entry.lexicalRank,
          vectorSimilarity: entry.vectorSimilarity,
          sourceKinds: entry.sourceKinds,
        })),
      });
    }

    const broad = results.filter((result) => result.bucket === 'broad');
    const named = results.filter((result) => result.bucket === 'named-variable');
    const relation = results.filter((result) => result.bucket === 'relation');
    const broadHitAt1 = ratio(
      broad.filter((result) => Object.values(result.requiredRouteRanks).some((rank) => rank === 1)).length,
      broad.length,
    );
    const broadHitAt8 = ratio(
      broad.filter((result) => Object.values(result.requiredRouteRanks).some((rank) => rank !== null && rank <= 8)).length,
      broad.length,
    );
    const namedHitAt4 = ratio(
      named.filter((result) => Object.values(result.requiredRouteRanks).every((rank) => rank !== null && rank <= 4)).length,
      named.length,
    );
    const relationRouteRanks = relation.flatMap((result) => Object.values(result.requiredRouteRanks));
    const relationRequiredRouteCoverageAt8 = ratio(
      relationRouteRanks.filter((rank) => rank !== null && rank <= 8).length,
      relationRouteRanks.length,
    );
    const broadWorkflowContaminationAt1 = ratio(
      broad.filter((result) => result.topRouteContaminated).length,
      broad.length,
    );
    const latencies = results.map((result) => result.latencyMs);
    const summary = {
      evalVersion: challengeSet.version,
      purpose: challengeSet.purpose,
      generatedAt: new Date().toISOString(),
      embeddingModel: getReferenceEmbeddingModel('openai'),
      generationModelCalls: 0,
      embeddingQueryCalls: results.length,
      fixtureCount: results.length,
      source: getSourceMetadata(),
      metrics: {
        broadHitAt1: round(broadHitAt1),
        broadHitAt8: round(broadHitAt8),
        namedHitAt4: round(namedHitAt4),
        relationRequiredRouteCoverageAt8: round(relationRequiredRouteCoverageAt8),
        broadWorkflowContaminationAt1: round(broadWorkflowContaminationAt1),
        latencyP50Ms: percentile(latencies, 0.5),
        latencyP95Ms: percentile(latencies, 0.95),
      },
      results,
    };

    const outputPath = process.env.REFERENCE_HYBRID_EVAL_OUTPUT;
    if (outputPath) {
      const resolvedOutputPath = path.resolve(process.cwd(), outputPath);
      fs.mkdirSync(path.dirname(resolvedOutputPath), { recursive: true });
      fs.writeFileSync(resolvedOutputPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    }

    console.log('[reference-hybrid-eval]', JSON.stringify(summary.metrics));

    expect(results).toHaveLength(challengeSet.queries.length);
    expect(
      results.every((result) =>
        result.vectorHitCount > 0 ? result.mode === 'hybrid' : result.mode === 'lexical',
      ),
    ).toBe(true);

    if (shouldEnforce) {
      expect(broadHitAt1).toBeGreaterThanOrEqual(challengeSet.candidateThresholds.broadHitAt1);
      expect(broadHitAt8).toBeGreaterThanOrEqual(challengeSet.candidateThresholds.broadHitAt8);
      expect(namedHitAt4).toBeGreaterThanOrEqual(challengeSet.candidateThresholds.namedHitAt4);
      expect(relationRequiredRouteCoverageAt8).toBeGreaterThanOrEqual(
        challengeSet.candidateThresholds.relationRequiredRouteCoverageAt8,
      );
      expect(broadWorkflowContaminationAt1).toBeLessThanOrEqual(
        challengeSet.candidateThresholds.broadWorkflowContaminationAt1,
      );
    }
  }, 180_000);
});
