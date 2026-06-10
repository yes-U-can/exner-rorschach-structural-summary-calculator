export const BYOK_SESSION_MISSING_CODE = 'byok_session_missing';

export type ChatApiErrorPayload = {
  code: string | null;
  message: string;
};

export function isByokSessionMissingError(status: number, payload: ChatApiErrorPayload) {
  return status === 401 && (!payload.code || payload.code === BYOK_SESSION_MISSING_CODE);
}

export async function readChatApiErrorPayload(
  response: Response,
  fallbackMessage: string,
): Promise<ChatApiErrorPayload> {
  const responseForText = response.clone();

  try {
    const data = await response.json();
    const code = typeof data?.code === 'string' ? data.code : null;
    const message =
      code ??
      (typeof data?.error === 'string' ? data.error : null) ??
      fallbackMessage;
    return { code, message };
  } catch {
    try {
      const text = await responseForText.text();
      return { code: null, message: text || fallbackMessage };
    } catch {
      return { code: null, message: fallbackMessage };
    }
  }
}
