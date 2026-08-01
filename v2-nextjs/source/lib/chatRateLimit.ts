import {
  consumeInMemoryRateLimit,
  type InMemoryRateLimitResult,
  type InMemoryRateLimitStore,
} from '@/lib/inMemoryRateLimit';

const BURST_WINDOW_MS = 60_000;
const BURST_LIMIT = 12;
const SUSTAINED_WINDOW_MS = 60 * 60_000;
const SUSTAINED_LIMIT = 120;
const NETWORK_BURST_LIMIT = 60;
const NETWORK_SUSTAINED_LIMIT = 600;
const MAX_TRACKED_KEYS = 5_000;

const globalForChatRateLimit = globalThis as typeof globalThis & {
  __exnerChatRateLimitStore?: InMemoryRateLimitStore;
  __exnerChatNetworkRateLimitStore?: InMemoryRateLimitStore;
};

const sessionStore = globalForChatRateLimit.__exnerChatRateLimitStore ?? new Map();
const networkStore = globalForChatRateLimit.__exnerChatNetworkRateLimitStore ?? new Map();
globalForChatRateLimit.__exnerChatRateLimitStore = sessionStore;
globalForChatRateLimit.__exnerChatNetworkRateLimitStore = networkStore;

export type ChatRateLimitResult = InMemoryRateLimitResult;

export function consumeChatRateLimit(
  sessionKey: string,
  now = Date.now(),
): ChatRateLimitResult {
  return consumeInMemoryRateLimit({
    store: sessionStore,
    key: sessionKey,
    now,
    burstWindowMs: BURST_WINDOW_MS,
    burstLimit: BURST_LIMIT,
    sustainedWindowMs: SUSTAINED_WINDOW_MS,
    sustainedLimit: SUSTAINED_LIMIT,
    maxTrackedKeys: MAX_TRACKED_KEYS,
  });
}

export function consumeChatNetworkRateLimit(
  networkKey: string,
  now = Date.now(),
): ChatRateLimitResult {
  return consumeInMemoryRateLimit({
    store: networkStore,
    key: networkKey,
    now,
    burstWindowMs: BURST_WINDOW_MS,
    burstLimit: NETWORK_BURST_LIMIT,
    sustainedWindowMs: SUSTAINED_WINDOW_MS,
    sustainedLimit: NETWORK_SUSTAINED_LIMIT,
    maxTrackedKeys: MAX_TRACKED_KEYS,
  });
}

export function resetChatRateLimitForTests() {
  sessionStore.clear();
  networkStore.clear();
}
