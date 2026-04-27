import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const localesDir = path.join(rootDir, 'i18n', 'locales');

const localeFiles = fs
  .readdirSync(localesDir)
  .filter((name) => name.endsWith('.json'))
  .sort();

const uiCopyFiles = [
  path.join(rootDir, 'components', 'byok', 'ByokSessionDialog.tsx'),
  path.join(rootDir, 'components', 'chat', 'ChatBubble.tsx'),
  path.join(rootDir, 'components', 'chat', 'ChatWidget.tsx'),
  path.join(rootDir, 'components', 'input', 'InputTable.tsx'),
  path.join(rootDir, 'components', 'layout', 'Footer.tsx'),
  path.join(rootDir, 'components', 'layout', 'LanguageSelector.tsx'),
  path.join(rootDir, 'components', 'ref', 'ReferenceRelatedPanel.tsx'),
];

const mojibakeFragments = [
  '\uFFFD',
  '\u613F',
  '\u81FE',
  '\uF9E1',
  '\uAFC8',
];

const checks = [
  {
    name: 'replacement character',
    test: (value) => value.includes('\uFFFD'),
  },
  {
    name: 'double question marks',
    test: (value) => value.includes('??'),
  },
  {
    name: 'question mark inside a word',
    test: (value) => /(?<=\p{L})\?(?=\p{L})/u.test(value),
  },
  {
    name: 'common mojibake sequence',
    test: (value) => mojibakeFragments.some((fragment) => value.includes(fragment)),
  },
];

const allowedHangulKeys = new Set([
  'language.ko',
  'footer.copyright',
]);

function walk(value, keys, callback) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, [...keys, String(index)], callback));
    return;
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => walk(item, [...keys, key], callback));
    return;
  }

  if (typeof value === 'string') {
    callback(value, keys);
  }
}

function extractStringLiterals(content) {
  const literals = [];
  const stringLiteralPattern =
    /'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/gs;
  let match;

  while ((match = stringLiteralPattern.exec(content)) !== null) {
    const raw = match[0];
    literals.push({
      raw,
      value: raw.slice(1, -1),
    });
  }

  return literals;
}

function shouldAuditSourceLiteral(value) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/^(https?:\/\/|\/|#)/.test(trimmed)) return false;
  if (trimmed.includes('?') && /[=&]/.test(trimmed)) return false;
  return true;
}

const findings = [];

for (const fileName of localeFiles) {
  const filePath = path.join(localesDir, fileName);
  const lang = path.basename(fileName, '.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  walk(data, [], (value, keys) => {
    for (const check of checks) {
      if (check.test(value)) {
        findings.push({
          file: path.relative(rootDir, filePath),
          key: keys.join('.'),
          reason: check.name,
          value,
        });
      }
    }

    const keyPath = keys.join('.');
    if (lang !== 'ko' && !allowedHangulKeys.has(keyPath) && /[\uAC00-\uD7AF]/u.test(value)) {
      findings.push({
        file: path.relative(rootDir, filePath),
        key: keyPath,
        reason: 'Hangul in non-Korean locale',
        value,
      });
    }
  });
}

for (const filePath of uiCopyFiles) {
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  const sourceLiterals = extractStringLiterals(content);

  for (const literal of sourceLiterals.filter((literal) => shouldAuditSourceLiteral(literal.value))) {
    for (const check of checks) {
      if (check.test(literal.value)) {
        findings.push({
          file: path.relative(rootDir, filePath),
          key: '(source string)',
          reason: check.name,
          value: literal.raw.length > 160 ? `${literal.raw.slice(0, 160)}...` : literal.raw,
        });
      }
    }
  }

  const sourceChecks = checks.filter((check) => !['double question marks', 'question mark inside a word'].includes(check.name));
  for (const check of sourceChecks) {
    if (check.test(content)) {
      findings.push({
        file: path.relative(rootDir, filePath),
        key: '(source copy)',
        reason: check.name,
        value: 'source file contains likely broken visible copy',
      });
    }
  }
}

if (findings.length > 0) {
  console.error('i18n copy audit failed:');
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.key} [${finding.reason}] ${JSON.stringify(finding.value)}`);
  }
  process.exit(1);
}

console.log(`i18n copy audit passed (${localeFiles.length} locale files, ${uiCopyFiles.length} UI copy files).`);
