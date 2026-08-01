import { describe, expect, it } from 'vitest';
import { escapeCsvCell } from '@/lib/csv';

describe('escapeCsvCell', () => {
  it('escapes formula-like cells to prevent spreadsheet execution', () => {
    expect(escapeCsvCell('=SUM(1,2)')).toBe('"\'=SUM(1,2)"');
    expect(escapeCsvCell('+cmd')).toBe("'+cmd");
    expect(escapeCsvCell('-cmd')).toBe("'-cmd");
    expect(escapeCsvCell('-2+3+cmd')).toBe("'-2+3+cmd");
    expect(escapeCsvCell('@user')).toBe("'@user");
  });

  it('preserves signed numeric literals and standalone scoring signs', () => {
    expect(escapeCsvCell('-10')).toBe('-10');
    expect(escapeCsvCell('-3.5')).toBe('-3.5');
    expect(escapeCsvCell('+1')).toBe('+1');
    expect(escapeCsvCell('-.5')).toBe('-.5');
    expect(escapeCsvCell('+1.25e-3')).toBe('+1.25e-3');
    expect(escapeCsvCell('-')).toBe('-');
    expect(escapeCsvCell('+')).toBe('+');
  });

  it('detects formula-like cells after leading whitespace', () => {
    expect(escapeCsvCell('  =SUM(1,2)')).toBe('"\'  =SUM(1,2)"');
  });

  it('escapes quotes and line feeds according to CSV quoting rules', () => {
    expect(escapeCsvCell('He said "hello"')).toBe('"He said ""hello"""');
    expect(escapeCsvCell('first line\nsecond line')).toBe('"first line\nsecond line"');
    expect(escapeCsvCell('first line\rsecond line')).toBe('"first line\rsecond line"');
  });
});
