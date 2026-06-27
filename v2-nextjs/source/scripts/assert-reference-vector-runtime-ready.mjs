#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const GENERATED_ROOT = path.join(ROOT, 'generated', 'reference-corpus');
const LEXICAL_RELEASE_PATH = path.join(GENERATED_ROOT, 'release-snapshot.json');
const VECTOR_RELEASE_PATH = path.join(GENERATED_ROOT, 'vector-release-snapshot.json');
const PROVIDERS = ['openai'];

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing generated artifact: ${filePath}`);
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  const lexicalRelease = readJson(LEXICAL_RELEASE_PATH);
  const vectorRelease = readJson(VECTOR_RELEASE_PATH);

  assert(Array.isArray(lexicalRelease.locales) && lexicalRelease.locales.length > 0, 'Lexical release snapshot has no locales.');
  assert(Array.isArray(vectorRelease.providers), 'Vector release snapshot is missing provider data.');
  assert(
    PROVIDERS.every((provider) => vectorRelease.providers.includes(provider)),
    'Vector release snapshot must include the openai provider.',
  );
  assert(
    PROVIDERS.every((provider) => vectorRelease.totals?.readyLocalesByProvider?.[provider] === lexicalRelease.locales.length),
    'Not all vector providers are ready.',
  );

  const rows = [];

  for (const provider of PROVIDERS) {
    const providerSnapshot = vectorRelease.providerSnapshots?.[provider];
    assert(providerSnapshot, `Missing provider snapshot for ${provider}.`);

    for (const locale of lexicalRelease.locales) {
      const localeSnapshot = providerSnapshot.locales?.[locale];
      assert(localeSnapshot, `Missing vector locale snapshot for ${provider}:${locale}.`);
      assert(
        localeSnapshot.embeddedChunkCount === localeSnapshot.chunkCount,
        `Vector chunk coverage mismatch for ${provider}:${locale} (${localeSnapshot.embeddedChunkCount}/${localeSnapshot.chunkCount}).`,
      );
      assert(
        localeSnapshot.staleEmbeddingCount === 0,
        `Stale embeddings remain for ${provider}:${locale}.`,
      );
      assert(localeSnapshot.ready === true, `Vector runtime is not ready for ${provider}:${locale}.`);

      rows.push({
        provider,
        locale,
        embeddings: localeSnapshot.embeddedChunkCount,
        chunks: localeSnapshot.chunkCount,
        ready: localeSnapshot.ready,
      });
    }
  }

  console.log('[reference-vector-runtime-ready]');
  console.table(rows);
  console.log(`All ${rows.length} provider-locale vector runtimes are ready.`);
}

try {
  main();
} catch (error) {
  console.error('[reference-vector-runtime-ready] failed');
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
