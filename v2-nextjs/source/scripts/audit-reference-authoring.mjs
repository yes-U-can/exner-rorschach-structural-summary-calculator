import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

const root = process.cwd();
const authoringDir = path.join(root, "docs", "reference-authoring");
const draftsDir = path.join(authoringDir, "drafts");
const notesDir = path.join(authoringDir, "notes");
const locales = new Set(["ko", "en", "ja", "es", "pt"]);
const runtimeFiles = [
  path.join(root, "generated", "reference-corpus", "route-docs.json"),
  path.join(root, "generated", "reference-corpus", "chunks.json"),
];
const allowedExtensions = new Set([".txt", ".md", ".json", ".yml", ".yaml", ".ts", ".tsx", ".mjs"]);

const suspicionRules = [
  {
    label: "utf8-bom",
    regex: /^\uFEFF/gu,
  },
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
    regex: /\u00E2(?:\u0080|\u20AC)[^\s]{0,8}/gu,
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

const localeRules = {
  ko: [
    {
      label: "ko-mixed-polite-register",
      regex: /(?:습니다|입니다|합니다|됩니다|주세요)[.]$/gmu,
    },
    {
      label: "ko-placeholder-particle",
      regex: /은\(는\)/gu,
    },
    {
      label: "ko-internal-authoring-narration",
      regex: /(?:현재 작성된 한국어 문서|한국어판에서 열린 경로|이번 작성 묶음)/gu,
    },
  ],
  ja: [
    {
      label: "ja-english-structure-heading",
      regex: /^#{1,2}\s+(?:Document Name:|Aliases \/ Search Terms|Core Definition|Application Conditions|Interpretation Points|Interpretation Notes|Cautions \/ Distinctions|Variables to Review Together|Limits of Isolated Interpretation|Cross References|Evidence Note)\b/gmu,
    },
    {
      label: "ja-mixed-polite-register",
      regex:
        /(?:だ|である|ではない|する|示す|みる|なる|ある|いる|できる|できない|しない)。$/gmu,
    },
    {
      label: "ja-internal-authoring-narration",
      regex: /(?:現在の日本語版で本文まで作成済み|現段階で開いている日本語ルート|今回の執筆バッチ)/gu,
    },
  ],
  es: [
    {
      label: "es-missing-required-diacritic",
      regex: /\b(?:Interpretacion|interpretacion|Codificacion|codificacion|Localizacion|localizacion|Definicion|definicion|comparacion|aplicacion|indice|lamina|pagina|numero|estimulo|diagnostico|publico|mas)\b/gu,
    },
    {
      label: "es-known-ocr-token",
      regex: /\b(?:acompaqar|seqlar|engaqar)\b|menc ion/gu,
    },
    {
      label: "es-unaccented-negative-copula",
      regex: /\bno esta\b/giu,
    },
    {
      label: "es-internal-authoring-narration",
      regex: /\b(?:en este batch|rutas abiertas en la versi[oó]n actual|documentos ya redactados en esta versi[oó]n)\b/giu,
    },
  ],
  pt: [
    {
      label: "pt-missing-required-diacritic",
      regex: /\b(?:Interpretacao|interpretacao|Codificacao|codificacao|Localizacao|localizacao|Definicao|definicao|nao|sao|tambem)\b/giu,
    },
    {
      label: "pt-unaccented-common-grammar",
      regex: /\b(?:n[aã]o e|por si so|so e)\b/giu,
    },
    {
      label: "pt-unaccented-definition-copula",
      regex: /^`[^`\n]+` e (?!`)/gmu,
    },
    {
      label: "pt-internal-authoring-narration",
      regex: /\b(?:neste lote de reda[cç][aã]o|rotas abertas na vers[aã]o atual|documentos j[aá] redigidos nesta vers[aã]o)\b/giu,
    },
  ],
};

const ignoredFindings = [];

function walkFiles(dirPath) {
  const files = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (path.relative(authoringDir, fullPath).split(path.sep)[0] === "incoming") {
        continue;
      }
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

  const relativePath = path.relative(draftsDir, filePath);
  const locale = relativePath && !relativePath.startsWith("..") ? relativePath.split(path.sep)[0] : null;
  const rules = [...suspicionRules, ...(localeRules[locale] ?? [])];

  for (const rule of rules) {
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

function createMetadataFinding(filePath, label, match, excerpt) {
  return {
    file: path.relative(root, filePath),
    label,
    line: 1,
    match,
    runtimeHits: 0,
    excerpt,
  };
}

function scanDraftMetadata(filePath) {
  const sourceText = fs.readFileSync(filePath, "utf8");
  const parsed = matter(sourceText);
  const findings = [];
  const relativePath = path.relative(draftsDir, filePath);
  const localeFromPath = relativePath.split(path.sep)[0];
  const authorityPolicy = String(parsed.data.authorityPolicy ?? "");
  const locale = String(parsed.data.locale ?? "");
  const provenanceNote = String(parsed.data.provenanceNote ?? "");
  const canonicalRoute = String(parsed.data.canonicalRoute ?? "");
  const canonicalTitle = String(parsed.data.canonicalTitle ?? "");
  const relatedRoutes = Array.isArray(parsed.data.relatedRoutes) ? parsed.data.relatedRoutes.map(String) : [];

  const sectionHeadings = [...parsed.content.matchAll(/^##\s+(.+?)\s*$/gmu)].map((match) => ({
    heading: match[1].trim().toLocaleLowerCase(),
    raw: match[1].trim(),
    index: match.index ?? 0,
  }));
  const seenHeadings = new Set();
  for (const section of sectionHeadings) {
    if (seenHeadings.has(section.heading)) {
      findings.push({
        file: path.relative(root, filePath),
        label: "duplicate-section-heading",
        line: getLineNumber(sourceText, section.index),
        match: section.raw,
        runtimeHits: 0,
        excerpt: `Duplicate section heading: ${section.raw}`,
      });
    }
    seenHeadings.add(section.heading);
  }

  if (authorityPolicy !== "curated-internal-reference") {
    findings.push(
      createMetadataFinding(
        filePath,
        "invalid-authority-policy",
        authorityPolicy,
        "authorityPolicy must use the generic curated-internal-reference policy.",
      ),
    );
  }

  if (locale !== localeFromPath) {
    findings.push(
      createMetadataFinding(
        filePath,
        "locale-path-mismatch",
        locale,
        `frontmatter locale does not match path locale ${localeFromPath}.`,
      ),
    );
  }

  const nonAsciiRoute = [canonicalRoute, canonicalTitle, ...relatedRoutes].find((route) => /[^\x00-\x7F]/u.test(route));
  const inlineRefWithNonAscii = [...parsed.content.matchAll(/ref:\/\/([^\s)]+)/gu)]
    .map((match) => match[1])
    .find((route) => /[^\x00-\x7F]/u.test(route));
  if (!canonicalRoute || !canonicalTitle || nonAsciiRoute || inlineRefWithNonAscii) {
    findings.push(
      createMetadataFinding(
        filePath,
        "non-ascii-canonical-route",
        nonAsciiRoute ?? inlineRefWithNonAscii ?? canonicalRoute,
        "canonicalRoute, canonicalTitle, relatedRoutes, and ref:// targets must keep stable ASCII identifiers.",
      ),
    );
  }

  const provenancePath = path.resolve(root, provenanceNote);
  const isInsideNotes = provenancePath === notesDir || provenancePath.startsWith(`${notesDir}${path.sep}`);
  if (!provenanceNote || !isInsideNotes || !fs.existsSync(provenancePath)) {
    findings.push(
      createMetadataFinding(
        filePath,
        "invalid-provenance-note",
        provenanceNote,
        "provenanceNote must resolve to an existing file under docs/reference-authoring/notes.",
      ),
    );
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
  const draftFiles = walkFiles(draftsDir).filter((filePath) => {
    if (path.extname(filePath).toLowerCase() !== ".md") return false;
    const locale = path.relative(draftsDir, filePath).split(path.sep)[0];
    return locales.has(locale);
  });
  findings.push(...draftFiles.flatMap((filePath) => scanDraftMetadata(filePath)));
  const blockingFindings = findings.filter((finding) => !isIgnoredFinding(finding));
  const nonBlockingFindings = findings.filter((finding) => isIgnoredFinding(finding));

  console.log("[reference-authoring-audit]");
  if (findings.length === 0) {
    console.log("No suspicious text or metadata findings found in docs/reference-authoring.");
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
    console.error(`Found ${blockingFindings.length} blocking authoring finding(s).`);
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
