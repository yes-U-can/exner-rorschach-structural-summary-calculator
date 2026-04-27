import { describe, expect, it } from 'vitest';
import { escapeCsvCell } from '@/lib/csv';

describe('escapeCsvCell', () => {
  it('escapes formula-like cells to prevent spreadsheet execution', () => {
    expect(escapeCsvCell('=SUM(1,2)')).toBe('"\'=SUM(1,2)"');
    expect(escapeCsvCell('+cmd')).toBe("'+cmd");
    expect(escapeCsvCell('-10')).toBe("'-10");
    expect(escapeCsvCell('@user')).toBe("'@user");
  });

  it('detects formula-like cells after leading whitespace', () => {
    expect(escapeCsvCell('  =SUM(1,2)')).toBe('"\'  =SUM(1,2)"');
  });
});
