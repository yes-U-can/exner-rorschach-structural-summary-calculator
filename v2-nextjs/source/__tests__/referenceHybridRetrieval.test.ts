import { describe, expect, it } from 'vitest';
import type { KnowledgeItem } from '@/lib/chatKnowledge';
import type { CodingRuleChunk } from '@/lib/codingAssistKnowledge';
import {
  rankMergedCodingChunks,
  rankMergedKnowledge,
  rankMergedKnowledgeDetailed,
} from '@/lib/referenceHybridRetrieval';

describe('referenceHybridRetrieval', () => {
  it('keeps exact route-oriented interpretation hits above broad vector matches', () => {
    const exactRoute: KnowledgeItem = {
      id: 'route:scoring-input/dq/+',
      title: 'DQ+',
      content: 'DQ plus route summary',
      source: 'builtin',
      locale: 'en',
      aliases: ['DQ+'],
      canonicalRoute: 'scoring-input/dq/+',
      relatedRoutes: [],
      retrievalKind: 'runtime-route-summary',
    };
    const broadChunk: KnowledgeItem = {
      id: 'chunk:result-interpretation/general',
      title: 'General processing note',
      content: 'Interpretive note that happens to mention developmental quality.',
      source: 'builtin',
      locale: 'en',
      aliases: ['developmental quality'],
      canonicalRoute: 'result-interpretation/lower-section/processing/general',
      relatedRoutes: [],
      retrievalKind: 'runtime-chunk',
    };

    const ranked = rankMergedKnowledge(
      'scoring-input/dq/+',
      [exactRoute],
      [{ item: broadChunk, similarity: 0.93 }],
      4,
    );

    expect(ranked[0]?.canonicalRoute).toBe('scoring-input/dq/+');
  });

  it('rewards items that are supported by both lexical and vector retrieval', () => {
    const shared: KnowledgeItem = {
      id: 'chunk:shared',
      title: 'Form quality anchor',
      content: 'Use this section when the question is about form quality.',
      source: 'builtin',
      locale: 'en',
      aliases: ['form quality'],
      canonicalRoute: 'scoring-input/fq/overview',
      relatedRoutes: [],
      retrievalKind: 'runtime-chunk',
    };
    const lexicalOnly: KnowledgeItem = {
      id: 'chunk:lexical-only',
      title: 'Nearby topic',
      content: 'Some nearby lexical topic.',
      source: 'builtin',
      locale: 'en',
      aliases: ['form'],
      canonicalRoute: 'scoring-input/fq/nearby',
      relatedRoutes: [],
      retrievalKind: 'runtime-chunk',
    };

    const ranked = rankMergedKnowledge(
      'form quality',
      [lexicalOnly, shared],
      [{ item: shared, similarity: 0.88 }],
      4,
    );

    expect(ranked[0]?.id).toBe('chunk:shared');
  });

  it('returns score breakdown trace for the selected interpretation results', () => {
    const shared: KnowledgeItem = {
      id: 'chunk:shared',
      title: 'DQ overview',
      content: 'Route summary for DQ.',
      source: 'builtin',
      locale: 'en',
      aliases: ['dq', 'developmental quality'],
      canonicalRoute: 'scoring-input/dq/overview',
      relatedRoutes: [],
      retrievalKind: 'runtime-route-summary',
    };
    const broadChunk: KnowledgeItem = {
      id: 'chunk:broad',
      title: 'Broad interpretation',
      content: 'A broad interpretive note about organization.',
      source: 'builtin',
      locale: 'en',
      aliases: ['organization'],
      canonicalRoute: 'result-interpretation/general/organization',
      relatedRoutes: [],
      retrievalKind: 'runtime-chunk',
    };

    const ranked = rankMergedKnowledgeDetailed(
      'scoring-input/dq/overview',
      [shared, broadChunk],
      [{ item: shared, similarity: 0.81 }],
      4,
    );

    expect(ranked.items[0]?.id).toBe('chunk:shared');
    expect(ranked.trace[0]?.id).toBe('chunk:shared');
    expect(ranked.trace[0]?.sourceKinds).toEqual(['lexical', 'vector']);
    expect(ranked.trace[0]?.lexicalScore).toBeGreaterThan(0);
    expect(ranked.trace[0]?.vectorScore).toBeGreaterThan(0);
    expect(ranked.trace[0]?.rerankBonus).toBeGreaterThan(0);
    expect(ranked.trace[0]?.bothBonus).toBeGreaterThan(0);
  });

  it('keeps coding retrieval biased toward explicit scoring chunks', () => {
    const scoringChunk: CodingRuleChunk = {
      id: 'en:scoring-input/determinants/m',
      title: 'Determinants / M',
      text: 'Movement coding rule for human movement.',
      categoryTags: ['scoring-input', 'determinants', 'm'],
      canonicalRoute: 'scoring-input/determinants/m',
      relatedRoutes: [],
      routeScope: 'primary',
    };
    const semanticChunk: CodingRuleChunk = {
      id: 'en:result-interpretation/movement-theme',
      title: 'Movement theme',
      text: 'Broad interpretive note about movement themes.',
      categoryTags: ['movement', 'theme'],
      canonicalRoute: 'result-interpretation/movement-theme',
      relatedRoutes: [],
      routeScope: 'secondary',
    };

    const ranked = rankMergedCodingChunks(
      'human movement determinant m scoring-input',
      [scoringChunk],
      [{ item: semanticChunk, similarity: 0.96 }],
      4,
    );

    expect(ranked[0]?.id).toBe('en:scoring-input/determinants/m');
  });
});
