import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const SOURCE_FILES = [
  'app/about/page.tsx',
  'app/page.tsx',
  'app/privacy/page.tsx',
  'app/terms/page.tsx',
  'i18n/locales/es.json',
  'i18n/locales/pt.json',
  'lib/ai/evalDomainBoundaryFixtures.ts',
  'lib/chatDomainBoundary.ts',
  'lib/chatPageUi.ts',
  'lib/docsDetailed.ts',
  'lib/seo.ts',
] as const;

const READER_FACING_LOCALIZED_FILES = [
  'app/about/page.tsx',
  'app/page.tsx',
  'app/privacy/page.tsx',
  'app/terms/page.tsx',
  'i18n/locales/es.json',
  'i18n/locales/pt.json',
  'lib/chatPageUi.ts',
  'lib/seo.ts',
] as const;

function readSource(relativePath: string) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), 'utf8');
}

describe('Spanish and Portuguese Structural Summary terminology', () => {
  it('does not reintroduce the superseded terms in the affected app and AI copy', () => {
    const source = SOURCE_FILES.map(readSource).join('\n');

    expect(source).not.toContain('Resumen Estructural');
    expect(source).not.toContain('Resumo Estrutural');
  });

  it('uses the approved terms in Spanish and Portuguese', () => {
    const source = SOURCE_FILES.map(readSource).join('\n');

    expect(source).toContain('Sumario Estructural');
    expect(source).toContain('Sumário Estrutural');
  });

  it('does not leave the English term inside Spanish or Portuguese Terms copy', () => {
    const terms = readSource('app/terms/page.tsx');

    expect(terms).not.toContain('calculadora del Structural Summary');
    expect(terms).not.toContain('cálculo del Structural Summary');
    expect(terms).not.toContain('calculadora do Structural Summary');
    expect(terms).not.toContain('cálculo do Structural Summary');
  });

  it('uses the official term instead of the legacy lowercase name in reader-facing copy', () => {
    const readerFacingCopy = READER_FACING_LOCALIZED_FILES.map(readSource).join('\n');
    const normalizedReaderFacingCopy = readerFacingCopy.toLowerCase();

    expect(normalizedReaderFacingCopy).not.toContain('resumen estructural');
    expect(normalizedReaderFacingCopy).not.toContain('resumo estrutural');
    expect(readerFacingCopy).not.toContain('sumario estructural');
    expect(readerFacingCopy).not.toContain('sumário estrutural');
  });
});
