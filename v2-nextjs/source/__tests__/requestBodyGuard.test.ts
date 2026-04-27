import { describe, expect, it } from 'vitest';
import { parseJsonWithSizeLimit } from '@/lib/requestBodyGuard';

const policy = {
  maxBytes: 16,
  publicMessage: 'Request is too large.',
};

describe('parseJsonWithSizeLimit', () => {
  it('rejects non-json content types', async () => {
    const result = await parseJsonWithSizeLimit(
      new Request('http://localhost/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: '{}',
      }),
      policy,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.response.status).toBe(415);
  });

  it('rejects oversized declared content-length before reading', async () => {
    const result = await parseJsonWithSizeLimit(
      new Request('http://localhost/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': '999',
        },
        body: '{}',
      }),
      policy,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.response.status).toBe(413);
  });

  it('rejects oversized bodies while streaming', async () => {
    const result = await parseJsonWithSizeLimit(
      new Request('http://localhost/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: 'this body is too large' }),
      }),
      policy,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.response.status).toBe(413);
  });

  it('parses normal json bodies', async () => {
    const result = await parseJsonWithSizeLimit<{ ok: boolean }>(
      new Request('http://localhost/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{"ok":true}',
      }),
      policy,
    );

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.ok).toBe(true);
  });
});
