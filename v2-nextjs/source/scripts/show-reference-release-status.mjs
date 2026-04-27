import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const generatedDir = path.join(root, "generated", "reference-corpus");
const releaseSnapshotPath = path.join(generatedDir, "release-snapshot.json");

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function toCommaList(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return "-";
  }

  return values.join(", ");
}

function getBlockerSummary(localeSnapshot) {
  const blockers = localeSnapshot?.runtimePromotion?.blockers ?? [];
  return blockers.length === 0 ? "-" : blockers.join("; ");
}

try {
  const releaseSnapshot = readJson(releaseSnapshotPath);
  const locales = releaseSnapshot.locales ?? [];

  const rows = locales.map((locale) => {
    const snapshot = releaseSnapshot.localeSnapshots?.[locale] ?? {};

    return {
      locale,
      source: snapshot.activeRuntimeSource ?? "-",
      runtimeReady: `${snapshot.runtimeReadyDocs ?? 0}/${snapshot.totalDocs ?? 0}`,
      promoted: snapshot.promotionEnabled ? "yes" : "no",
      readyToServe: snapshot.readyToServe ? "yes" : "no",
      brokenRefs: snapshot?.inlineRefs?.brokenTargetsCount ?? 0,
      queryCoverage: snapshot?.querySet?.coveragePass ? "pass" : "fail",
      authority: toCommaList(snapshot.authorityPolicies),
      promotedAt: snapshot.promotedAt ?? "-",
      blockers: getBlockerSummary(snapshot),
    };
  });

  console.log("[reference-release-status]");
  console.table(rows);

  const localeCount = rows.length;
  const promotedCount = rows.filter((row) => row.promoted === "yes").length;
  const readyCount = rows.filter((row) => row.readyToServe === "yes").length;
  const brokenRefLocales = rows.filter((row) => row.brokenRefs > 0).length;

  console.log(`Locales: ${localeCount}`);
  console.log(`Promoted locales: ${promotedCount}/${localeCount}`);
  console.log(`Ready-to-serve locales: ${readyCount}/${localeCount}`);
  console.log(`Locales with broken inline refs: ${brokenRefLocales}`);
  console.log(`Release version: ${releaseSnapshot.version ?? "-"}`);
} catch (error) {
  console.error("[reference-release-status] failed");
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
