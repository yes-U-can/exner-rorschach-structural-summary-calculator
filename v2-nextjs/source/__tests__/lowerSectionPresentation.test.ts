import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), 'utf8');

describe('Lower Section presentation', () => {
  it('places GHR : PHR above a : p on screen and in the print layout', () => {
    const screenSource = readSource('components/result/LowerSection.tsx');
    const printSource = readSource('components/result/print/PrintLowerSection.tsx');

    expect(screenSource.indexOf('label="GHR : PHR"')).toBeGreaterThan(-1);
    expect(screenSource.indexOf('label="GHR : PHR"')).toBeLessThan(
      screenSource.indexOf('label="a : p"'),
    );
    expect(printSource.indexOf("label: 'GHR : PHR'")).toBeGreaterThan(-1);
    expect(printSource.indexOf("label: 'GHR : PHR'")).toBeLessThan(
      printSource.indexOf("label: 'a : p'"),
    );
  });

  it('uses two-column tables for ordinary print sections', () => {
    const printSource = readSource('components/result/print/PrintLowerSection.tsx');

    expect(printSource).toContain('function SimpleTable');
    expect(printSource).not.toContain('function TripleTable');
    expect(printSource).not.toContain('note?: string');
  });
});
