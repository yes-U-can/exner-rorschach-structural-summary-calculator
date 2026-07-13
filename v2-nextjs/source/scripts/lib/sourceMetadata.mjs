import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

function readGit(root, args) {
  try {
    return execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

export function getSourceMetadata(root) {
  const packageJson = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
  const gitCommit = readGit(root, ['rev-parse', 'HEAD']);
  const gitStatus = readGit(root, ['status', '--porcelain', '--untracked-files=no']);

  return {
    appVersion: packageJson.version ?? null,
    gitCommit,
    gitDirty: gitStatus === null ? null : gitStatus.length > 0,
  };
}
