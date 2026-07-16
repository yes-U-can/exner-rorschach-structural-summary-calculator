export async function pruneProviderRows(pool, provider, locales, chunks) {
  for (const locale of locales) {
    const localeChunkIds = chunks
      .filter((chunk) => chunk.locale === locale)
      .map((chunk) => chunk.chunkId);

    if (localeChunkIds.length === 0) {
      await pool.query(
        `DELETE FROM "ReferenceChunkEmbedding"
         WHERE "provider" = $1::"EmbeddingProvider" AND "locale" = $2`,
        [provider, locale],
      );
      continue;
    }

    await pool.query(
      `
        DELETE FROM "ReferenceChunkEmbedding"
        WHERE "provider" = $1::"EmbeddingProvider"
          AND "locale" = $2
          AND NOT ("chunkId" = ANY($3::text[]))
      `,
      [provider, locale, localeChunkIds],
    );
  }
}
