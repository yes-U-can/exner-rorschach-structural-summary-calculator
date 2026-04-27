import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const authoringDir = path.join(root, "docs", "reference-authoring");
const runtimeFiles = [
  path.join(root, "generated", "reference-corpus", "route-docs.json"),
  path.join(root, "generated", "reference-corpus", "chunks.json"),
];
const allowedExtensions = new Set([".txt", ".md", ".json", ".yml", ".yaml", ".ts", ".tsx", ".mjs"]);

const suspicionRules = [
  {
    label: "replacement-char",
    regex: /\uFFFD/gu,
  },
  {
    label: "utf8-latin1-a-tilde",
    regex: /\u00C3[^\s]{0,8}/gu,
  },
  {
    label: "utf8-latin1-circumflex",
    regex: /\u00C2[^\s]{0,8}/gu,
  },
  {
    label: "utf8-latin1-smart-punct",
    regex: /\u00E2[^\s]{0,8}/gu,
  },
  {
    label: "ocr-sminus-5-percent",
    regex: /\b5\s*-\s*%/gu,
  },
  {
    label: "ocr-sminus-5quote-percent",
    regex: /\b5["']\s*-\s*%/gu,
  },
  {
    label: "ocr-sminus-5line1-percent",
    regex: /\b5\s*1\s*-\s*%/gmu,
  },
  {
    label: "manual-review-xu-percent-fragment",
    regex: /Xu%-\.\\%/gu,
  },
  {
    label: "manual-review-fqx-plus-q",
    regex: /FQx\+=Q/gu,
  },
  {
    label: "manual-review-fqnone-c",
    regex: /FQnonc/gu,
  },
  {
    label: "manual-review-dot-ampersand-digit",
    regex: /\.&\d/gu,
  },
  {
    label: "manual-review-dot-digit-letter-l",
    regex: /\.\d[lL]\b/gu,
  },
  {
    label: "manual-review-fmao-tilde",
    regex: /FM\u00E3o/gu,
  },
];

const ignoredFindings = [
  {
    file: path.join("docs", "reference-authoring", "incoming", "Exner.txt"),
    label: "manual-review-dot-digit-letter-l",
    line: 41565,
    match: ".2L",
    reason: "Known OCR noise block outside drafts/runtime corpus inputs; keep visible but non-blocking until source page is reviewed.",
  },
];

function walkFiles(dirPath) {
  const files = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
      continue;
    }
    if (!allowedExtensions.has(path.extname(entry.name).toLowerCase())) {
      continue;
    }
    files.push(fullPath);
  }
  return files;
}

function loadRuntimeText() {
  return runtimeFiles
    .filter((filePath) => fs.existsSync(filePath))
    .map((filePath) => fs.readFileSync(filePath, "utf8"))
    .join("\n");
}

function getLineNumber(sourceText, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (sourceText[i] === "\n") {
      line += 1;
    }
  }
  return line;
}

function getExcerpt(sourceText, index, length) {
  const start = Math.max(0, index - 40);
  const end = Math.min(sourceText.length, index + length + 40);
  return sourceText.slice(start, end).replace(/\s+/g, " ").trim();
}

function formatMatchValue(value) {
  return JSON.stringify(value).slice(1, -1);
}

function scanFile(filePath, runtimeText) {
  const sourceText = fs.readFileSync(filePath, "utf8");
  const findings = [];

  for (const rule of suspicionRules) {
    const regex = new RegExp(rule.regex);
    for (const match of sourceText.matchAll(regex)) {
      const matchedText = match[0];
      const index = match.index ?? 0;
      const runtimeHits = matchedText ? runtimeText.split(matchedText).length - 1 : 0;

      findings.push({
        file: path.relative(root, filePath),
        label: rule.label,
        line: getLineNumber(sourceText, index),
        match: matchedText,
        runtimeHits,
        excerpt: getExcerpt(sourceText, index, matchedText.length),
      });
    }
  }

  return findings;
}

function isIgnoredFinding(finding) {
  return ignoredFindings.some(
    (ignored) =>
      ignored.file === finding.file &&
      ignored.label === finding.label &&
      ignored.line === finding.line &&
      ignored.match === finding.match,
  );
}

try {
  if (!fs.existsSync(authoringDir)) {
    throw new Error(`Missing authoring directory: ${authoringDir}`);
  }

  const runtimeText = loadRuntimeText();
  const files = walkFiles(authoringDir);
  const findings = files.flatMap((filePath) => scanFile(filePath, runtimeText));
  const blockingFindings = findings.filter((finding) => !isIgnoredFinding(finding));
  const nonBlockingFindings = findings.filter((finding) => isIgnoredFinding(finding));

  console.log("[reference-authoring-audit]");
  if (findings.length === 0) {
    console.log("No suspicious mojibake patterns found in docs/reference-authoring.");
    process.exit(0);
  }

  console.table(
    findings.map((finding) => ({
      file: finding.file,
      line: finding.line,
      label: finding.label,
      match: formatMatchValue(finding.match),
      runtimeHits: finding.runtimeHits,
    })),
  );

  for (const finding of findings) {
    console.log(
      `- ${finding.file}:${finding.line} [${finding.label}] ${formatMatchValue(finding.match)} :: ${formatMatchValue(finding.excerpt)}`,
    );
  }

  if (nonBlockingFindings.length > 0) {
    console.warn(`Known non-blocking findings: ${nonBlockingFindings.length}`);
    for (const finding of nonBlockingFindings) {
      const ignored = ignoredFindings.find(
        (entry) =>
          entry.file === finding.file &&
          entry.label === finding.label &&
          entry.line === finding.line &&
          entry.match === finding.match,
      );
      if (ignored) {
        console.warn(`  - ${finding.file}:${finding.line} ${formatMatchValue(finding.match)} :: ${ignored.reason}`);
      }
    }
  }

  if (blockingFindings.length > 0) {
    console.error(`Found ${blockingFindings.length} blocking suspicious authoring-source string(s).`);
    process.exitCode = 1;
  } else {
    console.log("Only known non-blocking authoring-source findings remain.");
    process.exitCode = 0;
  }
} catch (error) {
  console.error("[reference-authoring-audit] failed");
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
