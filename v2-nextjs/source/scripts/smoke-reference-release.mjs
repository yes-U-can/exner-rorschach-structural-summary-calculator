#!/usr/bin/env node

function resolveBaseUrl() {
  if (process.env.SMOKE_BASE_URL) {
    return process.env.SMOKE_BASE_URL;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return process.env.VERCEL_URL.startsWith("http")
      ? process.env.VERCEL_URL
      : `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

const DEFAULT_BASE_URL = resolveBaseUrl();
const SUPPORTED_LOCALES = ['ko', 'en', 'ja', 'es', 'pt'];
const DETAIL_PATHS = [
  '/ref/scoring-input/dq/o',
  '/ref/result-interpretation/lower-section/core/Lambda',
];
function normalizeBaseUrl(raw) {
  try {
    const url = new URL(raw);
    return url.origin;
  } catch {
    throw new Error(`Invalid base URL: ${raw}`);
  }
}

async function request(path) {
  const baseUrl = normalizeBaseUrl(DEFAULT_BASE_URL);
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, { redirect: 'manual' });
  const body = await res.text();
  return { url, status: res.status, body };
}

function assertOk(result, label) {
  if (result.status >= 500) {
    throw new Error(`${label} failed with ${result.status}: ${result.url}`);
  }
  if (result.status !== 200) {
    throw new Error(`${label} expected 200, got ${result.status}: ${result.url}`);
  }
  if (result.body.includes('Application error')) {
    throw new Error(`${label} rendered an application error page: ${result.url}`);
  }
}

function assertIncludes(result, needle, label) {
  if (!result.body.includes(needle)) {
    throw new Error(`${label} missing expected text "${needle}": ${result.url}`);
  }
}

async function checkReferenceIndex(locale) {
  const result = await request(`/ref?lang=${locale}&q=dq`);
  assertOk(result, `reference index (${locale})`);
  assertIncludes(result, '/ref/', `reference index (${locale})`);
  console.log(`[ok] /ref?lang=${locale}&q=dq -> 200`);
}

async function checkReferenceDetail(locale, path) {
  const result = await request(`${path}?lang=${locale}`);
  assertOk(result, `reference detail (${locale})`);
  assertIncludes(result, '?lang=', `reference detail (${locale})`);
  console.log(`[ok] ${path}?lang=${locale} -> 200`);
}

async function main() {
  console.log(`Reference smoke target: ${normalizeBaseUrl(DEFAULT_BASE_URL)}`);

  for (const locale of SUPPORTED_LOCALES) {
    await checkReferenceIndex(locale);
    for (const path of DETAIL_PATHS) {
      await checkReferenceDetail(locale, path);
    }
  }

  console.log('Reference smoke checks completed.');
}

main().catch((error) => {
  console.error('Reference smoke checks failed.');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
