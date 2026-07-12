import { describe, expect, it } from 'vitest';

import { getReferenceDocs, getReferenceRuntimeChunks } from '@/lib/referenceCorpus';
import { resultVariableDescriptions } from '@/lib/result-variables';

const locales = ['ko', 'en', 'ja', 'es', 'pt'] as const;
const expectedTiers = new Map([
  ['result-interpretation/special-indices', 'mixed'],
  ['result-interpretation/special-indices/PTI', 'supported'],
  ['result-interpretation/special-indices/SCON', 'supported-high-stakes'],
  ['result-interpretation/special-indices/DEPI', 'limited'],
  ['result-interpretation/special-indices/CDI', 'limited'],
  ['result-interpretation/special-indices/HVI', 'weak-inconsistent'],
  ['result-interpretation/special-indices/OBS', 'insufficient'],
]);
const expectedResultVariableTiers = new Map([
  ['PTI', 'supported'],
  ['SCON', 'supported-high-stakes'],
  ['DEPI', 'limited'],
  ['CDI', 'limited'],
  ['HVI', 'weak-inconsistent'],
  ['OBS', 'insufficient'],
]);

describe('reference special-index evidence policy', () => {
  it('applies the same evidence tier contract in every locale', () => {
    for (const locale of locales) {
      const docs = getReferenceDocs(locale);

      for (const [canonicalRoute, expectedTier] of expectedTiers) {
        const doc = docs.find((candidate) => candidate.canonicalRoute === canonicalRoute);

        expect(doc?.evidenceTier).toBe(expectedTier);
        expect(doc?.bodyText).toContain('[Evidence Strength]');
      }
    }
  });

  it('co-locates the evidence guardrail with every retrievable special-index chunk', () => {
    for (const locale of locales) {
      const chunks = getReferenceRuntimeChunks(locale);

      for (const [canonicalRoute, expectedTier] of expectedTiers) {
        const routeChunks = chunks.filter((chunk) => chunk.canonicalRoute === canonicalRoute);

        expect(routeChunks.length).toBeGreaterThan(0);
        for (const chunk of routeChunks) {
          expect(chunk.evidenceTier).toBe(expectedTier);
          expect(chunk.text).toContain(`[Evidence Guardrail] tier=${expectedTier}`);
        }
      }
    }
  });

  it('keeps runtime governance generic and canonical identifiers stable', () => {
    for (const locale of locales) {
      for (const doc of getReferenceDocs(locale)) {
        expect(doc.authorityPolicy).toBe('curated-internal-reference');
        expect(doc.bodyText).not.toContain('authorityPolicy=');
        expect(doc.canonicalRoute).toMatch(/^[\x00-\x7F]+$/);
      }
    }
  });

  it('keeps the non-vector result-variable layer on the same evidence tiers', () => {
    for (const locale of locales) {
      for (const [variableId, expectedTier] of expectedResultVariableTiers) {
        const description = resultVariableDescriptions[variableId]?.[locale]?.description;

        expect(description).toContain(`[Evidence Strength] ${expectedTier}`);
      }
    }
  });
});
