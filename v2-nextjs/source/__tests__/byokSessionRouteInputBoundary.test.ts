import { beforeEach, describe, expect, it } from 'vitest';

import { POST } from '@/app/api/byok/session/route';
import { resetByokSessionRateLimitForTests } from '@/lib/byokSessionRateLimit';

function buildRequest(body: unknown) {
  return new Request('http://localhost/api/byok/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-vercel-forwarded-for': '203.0.113.30',
    },
    body: JSON.stringify(body),
  });
}

describe('BYOK session route input boundary', () => {
  beforeEach(() => {
    resetByokSessionRateLimitForTests();
  });

  it.each([null, [], 'invalid'])(
    'returns 400 for a non-object JSON body: %j',
    async (body) => {
      const response = await POST(buildRequest(body));

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toMatchObject({
        error: 'Invalid JSON request body.',
        code: 'invalid_byok_request',
      });
    },
  );
});
