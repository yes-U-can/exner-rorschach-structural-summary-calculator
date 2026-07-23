import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  findRuleParityViolations,
  loadRuleInvariantRegistry,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore plain ESM module without type declarations
} from '../scripts/lib/referenceRuleInvariants.mjs';

const authoringDir = path.join(process.cwd(), 'docs', 'reference-authoring');
const draftsDir = path.join(authoringDir, 'drafts');
const registryPath = path.join(authoringDir, 'rule-invariants.json');
const promotionPath = path.join(authoringDir, 'runtime-promotion.json');

describe('cross-locale clinical rule parity', () => {
  it('covers all five locales and gives every invariant per-locale assertions', () => {
    const registry = loadRuleInvariantRegistry(registryPath);

    expect(registry.locales).toEqual(['ko', 'en', 'ja', 'es', 'pt']);
    expect(registry.invariants.length).toBeGreaterThanOrEqual(5);

    for (const invariant of registry.invariants) {
      expect(invariant.paths.length).toBeGreaterThan(0);
      for (const locale of registry.locales) {
        const localePatterns = [
          ...(invariant.allLocalesMustMatch ?? []),
          ...((invariant.mustMatch ?? {})[locale] ?? []),
        ];
        expect(
          localePatterns.length,
          `invariant ${invariant.id} must assert something for locale ${locale}`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it('finds no violations in the current five-locale drafts and promotion state', () => {
    const violations = findRuleParityViolations({
      draftsDir,
      registryPath,
      promotionPath,
    });

    expect(violations).toEqual([]);
  });

  it('detects a locale that drops a required rule statement', () => {
    const registry = loadRuleInvariantRegistry(registryPath);
    const sabotaged = {
      ...registry,
      invariants: [
        {
          id: 'sabotage-check',
          description: 'self-test: this pattern must not exist',
          paths: ['scoring-input/location/s/index.md'],
          mustMatch: {
            ko: ['이 문장은 존재하지 않는다-sabotage'],
            en: ['this sentence does not exist-sabotage'],
            ja: ['この文は存在しません-sabotage'],
            es: ['esta frase no existe-sabotage'],
            pt: ['esta frase não existe-sabotage'],
          },
        },
      ],
    };
    const tmpRegistry = path.join(os.tmpdir(), `rule-invariants-selftest-${process.pid}.json`);
    fs.writeFileSync(tmpRegistry, JSON.stringify(sabotaged), 'utf8');
    try {
      const violations = findRuleParityViolations({
        draftsDir,
        registryPath: tmpRegistry,
        promotionPath: undefined,
      });
      expect(violations).toHaveLength(5);
      expect(violations.every((violation: { kind: string }) => violation.kind === 'missing-required-rule')).toBe(true);
    } finally {
      fs.unlinkSync(tmpRegistry);
    }
  });
});
