const ALLOWED_PLACEHOLDERS = new Set([
  '<your-database-url>',
  '<your-read-only-rag-database-url>',
  '<your-local-write-rag-database-url>',
  '<high-entropy-cookie-secret>',
]);

export const securityPatterns = [
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
    regex: /^[^\S\r\n]*(?:export[^\S\r\n]+)?(?:BYOK_COOKIE_SECRET|AI_FEEDBACK_DATABASE_URL|RAG_DATABASE_URL|RAG_WRITE_DATABASE_URL|DATABASE_URL|OPENAI_API_KEY|GOOGLE_API_KEY|REFERENCE_EMBEDDING_OPENAI_API_KEY|REFERENCE_EMBEDDING_GOOGLE_API_KEY)[^\S\r\n]*=[^\S\r\n]*(.*)$/gm,
    validate(match) {
      const value = String(match[1] ?? '').trim();
      return value && !ALLOWED_PLACEHOLDERS.has(value) && !value.startsWith('<') && !value.includes('CHANGE_ME');
    },
  },
];

export function findSecretPatterns(text) {
  const findings = [];
  for (const pattern of securityPatterns) {
    pattern.regex.lastIndex = 0;
    for (const match of text.matchAll(pattern.regex)) {
      if (pattern.validate && !pattern.validate(match)) continue;
      findings.push({
        pattern: pattern.name,
        index: match.index ?? 0,
      });
    }
  }
  return findings;
}
