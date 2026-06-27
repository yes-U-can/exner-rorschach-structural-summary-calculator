import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const generatedDir = path.join(root, "generated", "reference-corpus");
const snapshotPath = path.join(generatedDir, "vector-release-snapshot.json");

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

try {
  const snapshot = readJson(snapshotPath);
  const providers = ["openai"];
  const rows = providers.flatMap((provider) => {
    const providerSnapshot = snapshot.providerSnapshots?.[provider] ?? {};
    const locales = providerSnapshot.locales ?? {};

    return Object.keys(locales).map((locale) => {
      const localeSnapshot = locales[locale] ?? {};
      return {
        provider,
        locale,
        embeddings: localeSnapshot.embeddedChunkCount ?? 0,
        chunkCoverage: `${localeSnapshot.embeddedChunkCount ?? 0}/${localeSnapshot.chunkCount ?? 0}`,
        ready: localeSnapshot.ready ? "yes" : "no",
        latestRefreshedAt: localeSnapshot.latestRefreshedAt ?? "-",
      };
    });
  });

  console.log("[reference-vector-status]");
  console.table(rows);
  console.log(`Generated at: ${snapshot.generatedAt ?? "-"}`);
  console.log(
    `All supported providers ready: ${
      (snapshot.totals?.readyLocalesByProvider?.openai ?? 0) === (snapshot.totals?.localeCount ?? 0)
        ? "yes"
        : "no"
    }`,
  );
  console.log(
    `OpenAI ready locales: ${snapshot.totals?.readyLocalesByProvider?.openai ?? 0}/${snapshot.totals?.localeCount ?? 0}`,
  );
} catch (error) {
  console.error("[reference-vector-status] failed");
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
