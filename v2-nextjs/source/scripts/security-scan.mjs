import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const MAX_FILE_BYTES = 2 * 1024 * 1024;
const ALLOWED_PLACEHOLDERS = new Set([
  '<your-database-url>',
  '<your-read-only-rag-database-url>',
  '<your-local-write-rag-database-url>',
  '<high-entropy-cookie-secret>',
]);

const patterns = [
  {
    name: 'OpenAI-style secret key',
    regex: /\bsk-[A-Za-z0-9_-]{20,}\b/g,
  },
  {
    name: 'Google API key',
    regex: /\bAIza[0-9A-Za-z_-]{30,}\b/g,
  },
  {
    name: 'Private key block',
    regex: /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/g,
  },
  {
    name: 'Database URL with inline password',
    regex: /\bpostgres(?:ql)?:\/\/[^:\s"'`]+:[^@\s"'`]+@/gi,
  },
  {
    name: 'Committed env secret assignment',
    regex: /^(?:BYOK_COOKIE_SECRET|RAG_DATABASE_URL|RAG_WRITE_DATABASE_URL|DATABASE_URL|OPENAI_API_KEY|GOOGLE_API_KEY|REFERENCE_EMBEDDING_OPENAI_API_KEY|REFERENCE_EMBEDDING_GOOGLE_API_KEY)[^\S\r\n]*=[^\S\r\n]*(.*)$/gm,
    validate(match) {
      const value = String(match[1] ?? '').trim();
      return value && !ALLOWED_PLACEHOLDERS.has(value) && !value.startsWith('<') && !value.includes('CHANGE_ME');
    },
  },
];

function getTrackedFiles() {
  const output = execFileSync('git', ['ls-files', '-z', '--full-name', '--', '.'], { encoding: 'utf8' });
  return output.split('\0').filter(Boolean);
}

const findings = [];
const repoRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();

for (const file of getTrackedFiles()) {
  const absolutePath = resolve(repoRoot, file);
  let stats;
  try {
    stats = statSync(absolutePath);
  } catch {
    continue;
  }
  if (!stats.isFile() || stats.size > MAX_FILE_BYTES) continue;

  const text = readFileSync(absolutePath, 'utf8');
  for (const pattern of patterns) {
    pattern.regex.lastIndex = 0;
    for (const match of text.matchAll(pattern.regex)) {
      if (pattern.validate && !pattern.validate(match)) continue;
      findings.push({
        file: relative(repoRoot, absolutePath),
        pattern: pattern.name,
        index: match.index ?? 0,
      });
    }
  }
}

if (findings.length > 0) {
  console.error('Potential committed secrets found:');
  for (const finding of findings) {
    console.error(`- ${finding.file}: ${finding.pattern} at byte ${finding.index}`);
  }
  process.exit(1);
}

console.log('No obvious committed secrets found in tracked files.');
