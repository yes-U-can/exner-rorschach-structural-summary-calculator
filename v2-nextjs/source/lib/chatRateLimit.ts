const BURST_WINDOW_MS = 60_000;
const BURST_LIMIT = 12;
const SUSTAINED_WINDOW_MS = 60 * 60_000;
const SUSTAINED_LIMIT = 120;
const MAX_TRACKED_SESSIONS = 5_000;

type SessionWindow = {
  timestamps: number[];
  touchedAt: number;
};

type ChatRateLimitStore = Map<string, SessionWindow>;

const globalForChatRateLimit = globalThis as typeof globalThis & {
  __exnerChatRateLimitStore?: ChatRateLimitStore;
};

const store: ChatRateLimitStore = globalForChatRateLimit.__exnerChatRateLimitStore ?? new Map();
globalForChatRateLimit.__exnerChatRateLimitStore = store;

export type ChatRateLimitResult =
  | { allowed: true; remainingBurst: number; remainingSustained: number }
  | { allowed: false; retryAfterSeconds: number };

function pruneStore(now: number) {
  for (const [key, value] of store) {
    if (now - value.touchedAt >= SUSTAINED_WINDOW_MS) store.delete(key);
  }

  if (store.size <= MAX_TRACKED_SESSIONS) return;
  const oldest = [...store.entries()]
    .sort((a, b) => a[1].touchedAt - b[1].touchedAt)
    .slice(0, store.size - MAX_TRACKED_SESSIONS);
  for (const [key] of oldest) store.delete(key);
}

export function consumeChatRateLimit(
  sessionKey: string,
  now = Date.now(),
): ChatRateLimitResult {
  pruneStore(now);
  const current = store.get(sessionKey) ?? { timestamps: [], touchedAt: now };
  current.timestamps = current.timestamps.filter((timestamp) => now - timestamp < SUSTAINED_WINDOW_MS);
  current.touchedAt = now;

  const burstTimestamps = current.timestamps.filter((timestamp) => now - timestamp < BURST_WINDOW_MS);
  const burstBlocked = burstTimestamps.length >= BURST_LIMIT;
  const sustainedBlocked = current.timestamps.length >= SUSTAINED_LIMIT;

  if (burstBlocked || sustainedBlocked) {
    store.set(sessionKey, current);
    const windowStart = sustainedBlocked ? current.timestamps[0] : burstTimestamps[0];
    const windowLength = sustainedBlocked ? SUSTAINED_WINDOW_MS : BURST_WINDOW_MS;
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((windowStart + windowLength - now) / 1000)),
    };
  }

  current.timestamps.push(now);
  store.set(sessionKey, current);
  return {
    allowed: true,
    remainingBurst: BURST_LIMIT - burstTimestamps.length - 1,
    remainingSustained: SUSTAINED_LIMIT - current.timestamps.length,
  };
}

export function resetChatRateLimitForTests() {
  store.clear();
}
