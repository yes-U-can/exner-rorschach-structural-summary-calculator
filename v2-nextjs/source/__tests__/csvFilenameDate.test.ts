import { describe, expect, it, vi } from 'vitest';
import { formatLocalDateForFilename } from '@/lib/csv';

describe('CSV filename date', () => {
  it('uses the local calendar date rather than a UTC date slice', () => {
    const localDate = new Date('2026-07-30T23:30:00.000Z');
    vi.spyOn(localDate, 'getFullYear').mockReturnValue(2026);
    vi.spyOn(localDate, 'getMonth').mockReturnValue(6);
    vi.spyOn(localDate, 'getDate').mockReturnValue(31);

    expect(formatLocalDateForFilename(localDate)).toBe('2026-07-31');
  });
});
