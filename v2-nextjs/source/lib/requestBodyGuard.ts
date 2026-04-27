import { NextResponse } from 'next/server';

type RequestBodySizePolicy = {
  maxBytes: number;
  publicMessage: string;
};

export const REQUEST_BODY_SIZE_POLICIES = {
  chat: {
    maxBytes: 128 * 1024,
    publicMessage: 'Chat request is too large. Please send a smaller message.',
  },
} as const satisfies Record<string, RequestBodySizePolicy>;

function isJsonContentType(contentType: string | null) {
  if (!contentType) return false;
  const mediaType = contentType.split(';')[0]?.trim().toLowerCase();
  return mediaType === 'application/json' || mediaType?.endsWith('+json');
}

export async function parseJsonWithSizeLimit<T>(
  req: Request,
  policy: RequestBodySizePolicy,
): Promise<{ ok: true; value: T; rawText: string } | { ok: false; response: NextResponse }> {
  if (!isJsonContentType(req.headers.get('content-type'))) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Content-Type must be application/json.', code: 'unsupported_media_type' },
        { status: 415 },
      ),
    };
  }

  const declaredLength = req.headers.get('content-length');
  if (declaredLength) {
    const declaredBytes = Number(declaredLength);
    if (!Number.isFinite(declaredBytes) || declaredBytes < 0) {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Invalid Content-Length header.' }, { status: 400 }),
      };
    }
    if (declaredBytes > policy.maxBytes) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: policy.publicMessage, code: 'payload_too_large' },
          { status: 413 },
        ),
      };
    }
  }

  const reader = req.body?.getReader();
  if (!reader) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Invalid request body.' }, { status: 400 }),
    };
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      totalBytes += value.byteLength;
      if (totalBytes > policy.maxBytes) {
        await reader.cancel();
        return {
          ok: false,
          response: NextResponse.json(
            { error: policy.publicMessage, code: 'payload_too_large' },
            { status: 413 },
          ),
        };
      }
      chunks.push(value);
    }
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Invalid request body.' }, { status: 400 }),
    };
  }

  const rawText = new TextDecoder().decode(
    chunks.length === 1 ? chunks[0] : Buffer.concat(chunks),
  );

  try {
    return { ok: true, value: JSON.parse(rawText) as T, rawText };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 }),
    };
  }
}
