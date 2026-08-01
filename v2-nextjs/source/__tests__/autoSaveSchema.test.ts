import { describe, expect, it, vi } from 'vitest';
import {
  parseAutoSaveData,
  readAutoSaveDataFromHost,
  readAutoSaveDataFromStorage,
} from '@/hooks/useAutoSave';
import type { RorschachResponse } from '@/types';

const NOW = Date.parse('2026-07-30T12:00:00.000Z');

const validResponse: RorschachResponse = {
  card: 'I',
  response: 'A bat.',
  location: 'W',
  dq: 'o',
  determinants: ['F'],
  fq: 'o',
  pair: 'none',
  contents: ['A'],
  popular: true,
  z: 'ZW',
  specialScores: [],
};

function recordWith(response: unknown) {
  return {
    timestamp: '2026-07-30T11:00:00.000Z',
    expiresAt: '2026-07-31T11:00:00.000Z',
    responses: [response],
  };
}

describe('autosave schema boundary', () => {
  it('accepts a valid saved record', () => {
    expect(parseAutoSaveData(recordWith(validResponse), NOW)?.responses).toEqual([validResponse]);
  });

  it.each([
    ['missing determinants', { ...validResponse, determinants: undefined }],
    ['non-array contents', { ...validResponse, contents: 'A' }],
    ['invalid popular flag', { ...validResponse, popular: 'true' }],
    ['invalid FQ code', { ...validResponse, fq: 'invalid' }],
    ['invalid response row', null],
  ])('rejects corrupted payloads: %s', (_label, response) => {
    expect(parseAutoSaveData(recordWith(response), NOW)).toBeNull();
  });

  it('removes legacy empty slots without discarding the response', () => {
    const parsed = parseAutoSaveData(recordWith({
      ...validResponse,
      determinants: ['F', ''],
      contents: ['A', ''],
      specialScores: ['', 'DV2'],
    }), NOW);

    expect(parsed?.responses[0]).toMatchObject({
      determinants: ['F'],
      contents: ['A'],
      specialScores: ['DV2'],
    });
  });

  it('rejects expired or invalid timestamps', () => {
    expect(parseAutoSaveData({
      ...recordWith(validResponse),
      expiresAt: '2026-07-30T11:59:59.000Z',
    }, NOW)).toBeNull();
    expect(parseAutoSaveData({
      ...recordWith(validResponse),
      timestamp: 'not-a-date',
    }, NOW)).toBeNull();
  });

  it('does not rethrow when browser storage access and cleanup are both blocked', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const blockedStorage = {
      getItem: vi.fn(() => {
        throw new DOMException('Storage access denied', 'SecurityError');
      }),
      removeItem: vi.fn(() => {
        throw new DOMException('Storage cleanup denied', 'SecurityError');
      }),
    };

    try {
      expect(readAutoSaveDataFromStorage(blockedStorage, NOW)).toBeNull();
      expect(blockedStorage.getItem).toHaveBeenCalledOnce();
      expect(blockedStorage.removeItem).toHaveBeenCalledOnce();
    } finally {
      consoleError.mockRestore();
    }
  });

  it('does not rethrow when the browser blocks access to the storage object itself', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const blockedHost = Object.defineProperty({}, 'localStorage', {
      get() {
        throw new DOMException('Storage object access denied', 'SecurityError');
      },
    });

    try {
      expect(readAutoSaveDataFromHost(blockedHost as { localStorage: Storage }, NOW)).toBeNull();
    } finally {
      consoleError.mockRestore();
    }
  });
});
