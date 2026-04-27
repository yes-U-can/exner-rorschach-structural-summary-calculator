import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const vercelProjectPath = path.join(root, ".vercel", "project.json");
const releaseSnapshotPath = path.join(root, "generated", "reference-corpus", "release-snapshot.json");

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function runGit(args) {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function getGitInfo() {
  return {
    branch: runGit(["branch", "--show-current"]),
    remote: runGit(["remote", "get-url", "origin"]),
    status: runGit(["status", "--short", "--branch"]),
  };
}

function getDirtySummary(statusText) {
  const lines = statusText
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean);

  const summary = {
    raw: lines,
    modified: 0,
    untracked: 0,
  };

  for (const line of lines) {
    if (line.startsWith("##")) {
      continue;
    }

    if (line.startsWith("??")) {
      summary.untracked += 1;
    } else {
      summary.modified += 1;
    }
  }

  return summary;
}

function getCorpusSummary(releaseSnapshot) {
  if (!releaseSnapshot) {
    return {
      locales: [],
      allPromoted: false,
      allReadyToServe: false,
      version: null,
    };
  }

  const locales = (releaseSnapshot.locales ?? []).map((locale) => {
    const summary = releaseSnapshot.localeSnapshots?.[locale] ?? {};
    return {
      locale,
      source: summary.activeRuntimeSource ?? "-",
      runtimeReady: `${summary.runtimeReadyDocs ?? 0}/${summary.totalDocs ?? 0}`,
      promoted: summary.promotionEnabled === true ? "yes" : "no",
      readyToServe: summary.readyToServe === true ? "yes" : "no",
      promotedAt: summary.promotedAt ?? "-",
    };
  });

  return {
    locales,
    allPromoted: locales.every((locale) => locale.promoted === "yes"),
    allReadyToServe: locales.every((locale) => locale.readyToServe === "yes"),
    version: releaseSnapshot.version ?? null,
  };
}

try {
  const gitInfo = getGitInfo();
  const dirty = getDirtySummary(gitInfo.status);
  const vercelProject = readJsonIfExists(vercelProjectPath);
  const releaseSnapshot = readJsonIfExists(releaseSnapshotPath);
  const corpus = getCorpusSummary(releaseSnapshot);

  console.log("[deploy-context]");
  console.log(`Branch: ${gitInfo.branch || "-"}`);
  console.log(`Remote: ${gitInfo.remote || "-"}`);
  console.log(`Modified entries: ${dirty.modified}`);
  console.log(`Untracked entries: ${dirty.untracked}`);

  if (vercelProject) {
    console.log(`Vercel project: ${vercelProject.projectName ?? "-"}`);
    console.log(`Vercel projectId: ${vercelProject.projectId ?? "-"}`);
    console.log(`Vercel orgId: ${vercelProject.orgId ?? "-"}`);
  } else {
    console.log("Vercel project: not linked");
  }

  if (corpus.locales.length > 0) {
    console.log("");
    console.log("[deploy-context] reference corpus runtime");
    console.table(corpus.locales);
    console.log(`All locales promoted: ${corpus.allPromoted ? "yes" : "no"}`);
    console.log(`All locales ready-to-serve: ${corpus.allReadyToServe ? "yes" : "no"}`);
    console.log(`Release version: ${corpus.version ?? "-"}`);
  } else {
    console.log("Reference release snapshot: not found");
  }

  console.log("");
  console.log("[deploy-context] next steps");
  console.log("1. Run: npm run docs:verify-release");
  console.log("2. Inspect: npm run ops:release-status");
  console.log("3. Publish: .\\scripts\\publish.ps1 -UseCurrentRepo -Message \"chore: publish sync\"");
  console.log("4. Post-deploy smoke: npm run ops:smoke-reference");
} catch (error) {
  console.error("[deploy-context] failed");
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
