import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import type { Provider } from '@/lib/aiModels';
import { hasValidByokApiKeyFormat } from '@/lib/byokApiKeyFormat';

export const BYOK_SESSION_TTL_SECONDS = 24 * 60 * 60;
export const BYOK_SESSION_TTL_HOURS = 24;
const COOKIE_NAME_PROD = '__Host-sicp-byok';
const COOKIE_NAME_DEV = 'sicp-byok-dev';
const COOKIE_VERSION = 'v1';
const MAX_API_KEY_LENGTH = 2048;

export type ByokSession = {
  provider: Provider;
  apiKey: string;
  createdAt: number;
  expiresAt: number;
};

export type ByokSessionStatus = {
  active: boolean;
  provider: Provider | null;
  masked: string | null;
  expiresAt: string | null;
  ttlHours: number;
};

export function getByokCookieName() {
  return process.env.NODE_ENV === 'production' ? COOKIE_NAME_PROD : COOKIE_NAME_DEV;
}

export function normalizeByokProvider(input: unknown): Provider | null {
  return input === 'openai' || input === 'google' ? input : null;
}

export function normalizeByokApiKey(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const apiKey = input.trim();
  if (!apiKey || apiKey.length > MAX_API_KEY_LENGTH) return null;
  return apiKey;
}

export function maskApiKey(apiKey: string) {
  const trimmed = apiKey.trim();
  if (!trimmed) return null;
  return `****${trimmed.slice(-4)}`;
}

function getSecretMaterial() {
  const secret = process.env.BYOK_COOKIE_SECRET;
  if (secret && secret.trim().length >= 32) {
    return secret.trim();
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('BYOK_COOKIE_SECRET must be set to at least 32 characters in production.');
  }

  return 'dev-only-byok-cookie-secret-minimum-32-bytes';
}

function getEncryptionKey() {
  return createHash('sha256').update(getSecretMaterial(), 'utf8').digest();
}

function encode(value: Buffer) {
  return value.toString('base64url');
}

function decode(value: string) {
  return Buffer.from(value, 'base64url');
}

export function encryptByokSession(session: ByokSession) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  const plaintext = Buffer.from(JSON.stringify(session), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [COOKIE_VERSION, encode(iv), encode(tag), encode(ciphertext)].join('.');
}

export function decryptByokSession(cookieValue: string | null | undefined): ByokSession | null {
  if (!cookieValue) return null;
  const [version, ivPart, tagPart, ciphertextPart] = cookieValue.split('.');
  if (version !== COOKIE_VERSION || !ivPart || !tagPart || !ciphertextPart) return null;

  try {
    const decipher = createDecipheriv('aes-256-gcm', getEncryptionKey(), decode(ivPart));
    decipher.setAuthTag(decode(tagPart));
    const plaintext = Buffer.concat([
      decipher.update(decode(ciphertextPart)),
      decipher.final(),
    ]);
    const parsed = JSON.parse(plaintext.toString('utf8')) as Partial<ByokSession>;
    const provider = normalizeByokProvider(parsed.provider);
    const apiKey = normalizeByokApiKey(parsed.apiKey);
    if (!provider || !apiKey) return null;
    if (!hasValidByokApiKeyFormat(provider, apiKey)) return null;

    const createdAt = typeof parsed.createdAt === 'number' ? parsed.createdAt : 0;
    const expiresAt = typeof parsed.expiresAt === 'number' ? parsed.expiresAt : 0;
    if (!createdAt || !expiresAt || expiresAt <= Date.now()) return null;

    return { provider, apiKey, createdAt, expiresAt };
  } catch {
    return null;
  }
}

export function readByokSessionFromRequest(request: Request): ByokSession | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  const cookieName = getByokCookieName();

  for (const segment of cookieHeader.split(';')) {
    const [rawName, ...rawValueParts] = segment.trim().split('=');
    if (rawName !== cookieName) continue;
    try {
      return decryptByokSession(decodeURIComponent(rawValueParts.join('=')));
    } catch {
      // Malformed percent-encoding in the cookie value; treat as no session.
      return null;
    }
  }

  return null;
}

export function toByokSessionStatus(session: ByokSession | null): ByokSessionStatus {
  if (!session) {
    return {
      active: false,
      provider: null,
      masked: null,
      expiresAt: null,
      ttlHours: BYOK_SESSION_TTL_HOURS,
    };
  }

  return {
    active: true,
    provider: session.provider,
    masked: maskApiKey(session.apiKey),
    expiresAt: new Date(session.expiresAt).toISOString(),
    ttlHours: BYOK_SESSION_TTL_HOURS,
  };
}

export function createByokSession(provider: Provider, apiKey: string): ByokSession {
  const now = Date.now();
  return {
    provider,
    apiKey,
    createdAt: now,
    expiresAt: now + BYOK_SESSION_TTL_SECONDS * 1000,
  };
}

export function setByokSessionCookie(response: NextResponse, session: ByokSession) {
  response.cookies.set({
    name: getByokCookieName(),
    value: encryptByokSession(session),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: BYOK_SESSION_TTL_SECONDS,
  });
}

export function clearByokSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: getByokCookieName(),
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
