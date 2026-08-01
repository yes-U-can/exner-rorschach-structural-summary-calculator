import { describe, expect, it } from 'vitest';

import {
  consumeInMemoryRateLimit,
  type InMemoryRateLimitStore,
} from './inMemoryRateLimit';

const POLICY = {
  burstWindowMs: 60_000,
  burstLimit: 2,
  sustainedWindowMs: 3_600_000,
  sustainedLimit: 4,
  maxTrackedKeys: 3,
} as const;

function consume(
  store: InMemoryRateLimitStore,
  key: string,
  now: number,
) {
  return consumeInMemoryRateLimit({
    store,
    key,
    now,
    ...POLICY,
  });
}

describe('bounded in-memory rate limit storage', () => {
  it('admits a new client at capacity by evicting the least recently used key', () => {
    const store: InMemoryRateLimitStore = new Map([
      ['oldest', { timestamps: [100], touchedAt: 100 }],
      ['middle', { timestamps: [200], touchedAt: 200 }],
      ['newest', { timestamps: [300], touchedAt: 300 }],
    ]);

    expect(consume(store, 'new-client', 400).allowed).toBe(true);
    expect([...store.keys()]).toEqual(['middle', 'newest', 'new-client']);
    expect(store.size).toBe(POLICY.maxTrackedKeys);
  });

  it('keeps an existing client counter intact when the store is full', () => {
    const store: InMemoryRateLimitStore = new Map([
      ['client-a', { timestamps: [100], touchedAt: 100 }],
      ['client-b', { timestamps: [200], touchedAt: 200 }],
      ['client-c', { timestamps: [300], touchedAt: 300 }],
    ]);

    expect(consume(store, 'client-a', 400)).toMatchObject({
      allowed: true,
      remainingBurst: 0,
    });
    expect(store.size).toBe(POLICY.maxTrackedKeys);
    expect(store.get('client-a')?.timestamps).toEqual([100, 400]);
  });

  it('removes expired keys before considering an active-key eviction', () => {
    const store: InMemoryRateLimitStore = new Map([
      ['expired', { timestamps: [0], touchedAt: 0 }],
      ['active-a', { timestamps: [3_500_000], touchedAt: 3_500_000 }],
      ['active-b', { timestamps: [3_550_000], touchedAt: 3_550_000 }],
    ]);

    expect(consume(store, 'new-client', 3_600_000).allowed).toBe(true);
    expect([...store.keys()]).toEqual(['active-a', 'active-b', 'new-client']);
    expect(store.has('expired')).toBe(false);
  });

  it('stays bounded without globally denying clients during sustained key churn', () => {
    const store: InMemoryRateLimitStore = new Map();
    const maxTrackedKeys = 64;

    for (let index = 0; index < 1_024; index += 1) {
      const result = consumeInMemoryRateLimit({
        store,
        key: `client-${index}`,
        now: index,
        ...POLICY,
        maxTrackedKeys,
      });

      expect(result.allowed).toBe(true);
      expect(store.size).toBeLessThanOrEqual(maxTrackedKeys);
    }

    expect(store.size).toBe(maxTrackedKeys);
    expect(store.has('client-0')).toBe(false);
    expect(store.has('client-1023')).toBe(true);
  });

  it('returns an inherited over-capacity store to the configured bound', () => {
    const store: InMemoryRateLimitStore = new Map([
      ['client-a', { timestamps: [100], touchedAt: 100 }],
      ['client-b', { timestamps: [200], touchedAt: 200 }],
      ['client-c', { timestamps: [300], touchedAt: 300 }],
      ['client-d', { timestamps: [400], touchedAt: 400 }],
    ]);

    expect(consume(store, 'new-client', 500).allowed).toBe(true);
    expect([...store.keys()]).toEqual(['client-c', 'client-d', 'new-client']);
    expect(store.size).toBe(POLICY.maxTrackedKeys);
  });

  it('rejects an invalid storage bound instead of silently growing beyond it', () => {
    expect(() => consumeInMemoryRateLimit({
      store: new Map(),
      key: 'client',
      now: 0,
      ...POLICY,
      maxTrackedKeys: 0,
    })).toThrow(/positive integer/);
  });
});
