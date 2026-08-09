import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

describe('public mirror privacy boundary', () => {
  it('excludes and purges private corpus working material', () => {
    const script = fs.readFileSync(path.join(process.cwd(), 'scripts', 'publish.ps1'), 'utf8');
    const releaseProseGuard = fs.readFileSync(
      path.join(process.cwd(), 'scripts', 'assert-reader-facing-release-prose.ps1'),
      'utf8',
    );
    const internalGuidanceGuard = '[regex]::Escape($internalAiGuidanceMarker)';
    const readerFacingGuard = script.slice(
      script.indexOf('function Assert-NoReaderFacingProductionNarrative'),
      script.indexOf('function Remove-PublicAuthoringMetadata'),
    );
    const authoringGuard = script.slice(script.indexOf('function Assert-NoPublicAuthoringMetadata'));

    expect(script).toContain('docs\\reference-authoring\\incoming');
    expect(script).toContain('docs\\reference-authoring\\notes');
    expect(script).toContain('docs\\admin');
    expect(script).toContain('docs\\adr');
    expect(script).toContain('docs\\chat');
    expect(script).toContain('docs\\ai-evals\\private-runs');
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
    expect(script).toContain('Assert-NoPublicAuthoringMetadata');
    expect(script).toContain('Assert-NoReaderFacingProductionNarrative');
    expect(script).toContain(". $readerFacingReleaseGuard");
    expect(script.match(/Assert-NoReaderFacingReleaseProcessNarrative/g)?.length).toBeGreaterThanOrEqual(3);
    expect(releaseProseGuard).toContain("'^v2\\.\\d+\\.\\d+$'");
    expect(releaseProseGuard).toContain('Get-ReaderFacingReleaseProcessLeaks');
    expect(releaseProseGuard).toContain('Test-IsProtectedV1ReleasePath');
    expect(releaseProseGuard).toContain('Get-ReaderFacingV2ArchiveSummaries');
    expect(releaseProseGuard).toContain("series:\\s*'v2-nextjs'");
    expect(readerFacingGuard).toContain(internalGuidanceGuard);
    expect(authoringGuard).toContain(internalGuidanceGuard);
    expect(script).toContain('-Recurse -Force');
    expect(script).toContain('$sanitizedLines = @(foreach');
    expect(script).toContain('ConvertTo-Json -InputObject @($record)');
    expect(script).toContain('"gitCommit", "baseCommit", "commitSha", "sourceCommit", "commit", "gitDirty"');
    expect(script).toContain('Refusing to remove path outside publish root');
    expect(script).toContain('Refusing to publish outside publish root');
    expect(script).toContain('PublishTargetRelativePath');
    expect(script).toContain('SyncOnly');

    const publicLocalizationCheck = path.resolve(
      process.cwd(),
      '..',
      '..',
      'scripts',
      'verify-public-document-locales.ps1',
    );
    if (fs.existsSync(publicLocalizationCheck)) {
      const localizationScript = fs.readFileSync(publicLocalizationCheck, 'utf8');
      expect(localizationScript).toContain('Get-ReaderFacingReleaseProcessLeaks -Root $repoRoot');
      expect(localizationScript).toContain('[reader-facing-release-prose]');
      const releaseProseFailure = localizationScript.indexOf(
        'if ($releaseProseLeaks.Count -gt 0)',
      );
      const hashUpdate = localizationScript.indexOf('if ($UpdateHashes)');
      expect(releaseProseFailure).toBeGreaterThan(0);
      expect(hashUpdate).toBeGreaterThan(releaseProseFailure);
    }
  });
});
