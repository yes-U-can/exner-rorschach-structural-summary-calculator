import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

describe('public mirror privacy boundary', () => {
  it('excludes and purges private corpus working material', () => {
    const script = fs.readFileSync(path.join(process.cwd(), 'scripts', 'publish.ps1'), 'utf8');

    expect(script).toContain('docs\\reference-authoring\\incoming');
    expect(script).toContain('docs\\reference-authoring\\notes');
    expect(script).toContain('docs\\admin');
    expect(script).toContain('docs\\adr');
    expect(script).toContain('docs\\chat');
    expect(script).toContain('prisma\\migrations');
    expect(script).toContain('.vercel');
    expect(script).toContain('.npm-cache');
    expect(script).toContain('.env.*.local');
    expect(script).toContain('*.tsbuildinfo');
    expect(script).toContain('*.txt');
    expect(script).toContain('CODEX_TASKS.md');
    expect(script).toContain('ROADMAP.md');
    expect(script).toContain('AI_SYSTEM_MASTERPLAN.md');
    expect(script).toContain('LOCAL_OPEN_SOURCE_SECURITY.md');
    expect(script).toContain('EN_Batch*.md');
    expect(script).toContain('JA_Batch*.md');
    expect(script).toContain('REF_Batch*.md');
    expect(script).toContain('HANDOFF*.md');
    expect(script).toContain('EN_Detailing_Workflow.md');
    expect(script).toContain('Remove-PublicMirrorPrivateArtifacts');
    expect(script).toContain('Remove-PrivateGitMetadataProperties');
    expect(script).toContain('Assert-NoPublicGitMetadata');
    expect(script).toContain('"gitCommit", "baseCommit", "commitSha", "sourceCommit", "commit", "gitDirty"');
    expect(script).toContain('Refusing to remove path outside publish root');
    expect(script).toContain('Refusing to publish outside publish root');
    expect(script).toContain('PublishTargetRelativePath');
    expect(script).toContain('SyncOnly');
  });
});
