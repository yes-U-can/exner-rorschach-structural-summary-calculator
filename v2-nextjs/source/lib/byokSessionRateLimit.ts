import {
  consumeInMemoryRateLimit,
  type InMemoryRateLimitResult,
  type InMemoryRateLimitStore,
} from '@/lib/inMemoryRateLimit';

const BURST_WINDOW_MS = 60_000;
const BURST_LIMIT = 10;
const SUSTAINED_WINDOW_MS = 60 * 60_000;
const SUSTAINED_LIMIT = 60;
const MAX_TRACKED_KEYS = 5_000;

const globalForByokSessionRateLimit = globalThis as typeof globalThis & {
  __exnerByokSessionRateLimitStore?: InMemoryRateLimitStore;
};

const store = globalForByokSessionRateLimit.__exnerByokSessionRateLimitStore ?? new Map();
globalForByokSessionRateLimit.__exnerByokSessionRateLimitStore = store;

export function consumeByokSessionRateLimit(
  networkKey: string,
  now = Date.now(),
): InMemoryRateLimitResult {
  return consumeInMemoryRateLimit({
    store,
    key: networkKey,
    now,
    burstWindowMs: BURST_WINDOW_MS,
    burstLimit: BURST_LIMIT,
    sustainedWindowMs: SUSTAINED_WINDOW_MS,
    sustainedLimit: SUSTAINED_LIMIT,
    maxTrackedKeys: MAX_TRACKED_KEYS,
  });
}

export function resetByokSessionRateLimitForTests() {
  store.clear();
}
