#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { buildReferenceCorpusFingerprint } from './lib/referenceCorpusFingerprint.mjs';

const ROOT = process.cwd();
const GENERATED_ROOT = path.join(ROOT, 'generated', 'reference-corpus');
const LEXICAL_RELEASE_PATH = path.join(GENERATED_ROOT, 'release-snapshot.json');
const VECTOR_RELEASE_PATH = path.join(GENERATED_ROOT, 'vector-release-snapshot.json');
const CHUNKS_PATH = path.join(GENERATED_ROOT, 'chunks.json');
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
  const chunksArtifact = readJson(CHUNKS_PATH);
  const currentCorpusFingerprint = buildReferenceCorpusFingerprint(chunksArtifact);

  assert(
    chunksArtifact.corpusFingerprint === currentCorpusFingerprint,
    'Current reference corpus fingerprint is missing or invalid. Regenerate the corpus.',
  );
  assert(
    vectorRelease.corpus?.fingerprint === currentCorpusFingerprint,
    'Vector release snapshot does not match the current reference corpus. Regenerate embeddings and the vector snapshot.',
  );
  assert(
    vectorRelease.corpus?.generatedAt === chunksArtifact.generatedAt,
    'Vector release snapshot was generated for a different corpus revision.',
  );

  assert(Array.isArray(lexicalRelease.locales) && lexicalRelease.locales.length > 0, 'Lexical release snapshot has no locales.');
  assert(Array.isArray(vectorRelease.providers), 'Vector release snapshot is missing provider data.');
  assert(
    PROVIDERS.every((provider) => vectorRelease.providers.includes(provider)),
    'Vector release snapshot must include the openai provider.',
  );
  assert(
    vectorRelease.providerAudit?.clean === true,
    `Unsupported provider embeddings remain in the vector store (${vectorRelease.providerAudit?.unexpectedEmbeddingCount ?? 'unknown'} rows). Apply the provider-cleanup migration and regenerate the vector snapshot.`,
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
      assert(
        localeSnapshot.contentHashMismatchCount === 0,
        `Embedding content hashes do not match the current corpus for ${provider}:${locale} (${localeSnapshot.contentHashMismatchCount ?? 'unknown'} mismatch(es)).`,
      );
      assert(localeSnapshot.ready === true, `Vector runtime is not ready for ${provider}:${locale}.`);
      assert(
        vectorRelease.corpus?.chunkCounts?.[locale] === localeSnapshot.chunkCount,
        `Vector snapshot corpus count mismatch for ${provider}:${locale}.`,
      );

      rows.push({
        provider,
        locale,
        embeddings: localeSnapshot.embeddedChunkCount,
        chunks: localeSnapshot.chunkCount,
        stale: localeSnapshot.staleEmbeddingCount,
        hashMismatches: localeSnapshot.contentHashMismatchCount,
        ready: localeSnapshot.ready,
      });
    }
  }

  assert(
    PROVIDERS.every((provider) => vectorRelease.totals?.readyLocalesByProvider?.[provider] === lexicalRelease.locales.length),
    'Not all vector providers are ready.',
  );

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
