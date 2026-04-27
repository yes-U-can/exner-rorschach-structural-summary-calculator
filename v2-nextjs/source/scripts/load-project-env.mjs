import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_ENV_FILES = ['.env.local', '.env.production.local'];

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;

  const exportPrefix = trimmed.startsWith('export ') ? 'export ' : '';
  const withoutExport = exportPrefix ? trimmed.slice(exportPrefix.length) : trimmed;
  const separatorIndex = withoutExport.indexOf('=');
  if (separatorIndex <= 0) return null;

  const key = withoutExport.slice(0, separatorIndex).trim();
  let value = withoutExport.slice(separatorIndex + 1).trim();

  if (!key) return null;

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return { key, value };
}

export function loadProjectEnv(root = process.cwd()) {
  for (const relativePath of DEFAULT_ENV_FILES) {
    const fullPath = path.join(root, relativePath);
    if (!fs.existsSync(fullPath)) continue;

    if (typeof process.loadEnvFile === 'function') {
      try {
        process.loadEnvFile(fullPath);
        continue;
      } catch {
        // Fall through to the manual parser below.
      }
    }

    const raw = fs.readFileSync(fullPath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const parsed = parseEnvLine(line);
      if (!parsed) continue;
      if (process.env[parsed.key] === undefined) {
        process.env[parsed.key] = parsed.value;
      }
    }
  }
}
