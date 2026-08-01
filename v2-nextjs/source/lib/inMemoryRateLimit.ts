export type InMemoryRateLimitWindow = {
  timestamps: number[];
  touchedAt: number;
};

export type InMemoryRateLimitStore = Map<string, InMemoryRateLimitWindow>;

export type InMemoryRateLimitResult =
  | { allowed: true; remainingBurst: number; remainingSustained: number }
  | { allowed: false; retryAfterSeconds: number };

function evictLeastRecentlyUsedKey(
  store: InMemoryRateLimitStore,
  protectedKey: string,
): boolean {
  let evictionKey: string | null = null;
  let oldestTouchedAt = Number.POSITIVE_INFINITY;

  for (const [key, value] of store) {
    if (key === protectedKey) continue;
    if (value.touchedAt < oldestTouchedAt) {
      evictionKey = key;
      oldestTouchedAt = value.touchedAt;
    }
  }

  if (evictionKey !== null) {
    return store.delete(evictionKey);
  }

  return false;
}

export function consumeInMemoryRateLimit(args: {
  store: InMemoryRateLimitStore;
  key: string;
  now: number;
  burstWindowMs: number;
  burstLimit: number;
  sustainedWindowMs: number;
  sustainedLimit: number;
  maxTrackedKeys: number;
}): InMemoryRateLimitResult {
  if (!Number.isInteger(args.maxTrackedKeys) || args.maxTrackedKeys < 1) {
    throw new RangeError('maxTrackedKeys must be a positive integer.');
  }

  for (const [key, value] of args.store) {
    if (args.now - value.touchedAt >= args.sustainedWindowMs) {
      args.store.delete(key);
    }
  }

  if (!args.store.has(args.key) && args.store.size >= args.maxTrackedKeys) {
    while (args.store.size >= args.maxTrackedKeys) {
      if (!evictLeastRecentlyUsedKey(args.store, args.key)) break;
    }
  }

  const current = args.store.get(args.key) ?? { timestamps: [], touchedAt: args.now };
  current.timestamps = current.timestamps.filter(
    (timestamp) => args.now - timestamp < args.sustainedWindowMs,
  );
  current.touchedAt = args.now;

  const burstTimestamps = current.timestamps.filter(
    (timestamp) => args.now - timestamp < args.burstWindowMs,
  );
  const burstBlocked = burstTimestamps.length >= args.burstLimit;
  const sustainedBlocked = current.timestamps.length >= args.sustainedLimit;

  if (burstBlocked || sustainedBlocked) {
    args.store.set(args.key, current);
    const windowStart = sustainedBlocked ? current.timestamps[0] : burstTimestamps[0];
    const windowLength = sustainedBlocked ? args.sustainedWindowMs : args.burstWindowMs;
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((windowStart + windowLength - args.now) / 1000),
      ),
    };
  }

  current.timestamps.push(args.now);
  args.store.set(args.key, current);
  return {
    allowed: true,
    remainingBurst: args.burstLimit - burstTimestamps.length - 1,
    remainingSustained: args.sustainedLimit - current.timestamps.length,
  };
}
