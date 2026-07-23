param(
  [string]$Message = "chore: publish sync",
  [switch]$DryRun,
  [switch]$SkipVerify,
  [string]$PublishRoot,
  [string]$PublishTargetRelativePath = "v2-nextjs",
  [switch]$SyncOnly,
  [switch]$UseCurrentRepo,
  [string]$SmokeBaseUrl,
  [string]$SmokeCronSecret
)

$ErrorActionPreference = "Stop"

$sourceRoot = (Resolve-Path ".").Path

function Invoke-ReleaseSmoke {
  param(
    [Parameter(Mandatory = $true)]
    [string]$BaseUrl,
    [string]$CronSecret
  )

  Write-Host "[smoke] running release smoke against $BaseUrl"

  $previousBaseUrl = $env:SMOKE_BASE_URL
  $previousCronSecret = $env:SMOKE_CRON_SECRET

  $env:SMOKE_BASE_URL = $BaseUrl
  if ($CronSecret) {
    $env:SMOKE_CRON_SECRET = $CronSecret
  } else {
    Remove-Item Env:SMOKE_CRON_SECRET -ErrorAction SilentlyContinue
  }

  Push-Location $sourceRoot
  try {
    npm.cmd run ops:smoke-release
    if ($LASTEXITCODE -ne 0) {
      throw "release smoke failed with exit code $LASTEXITCODE"
    }
  } finally {
    Pop-Location
    if ($null -ne $previousBaseUrl) {
      $env:SMOKE_BASE_URL = $previousBaseUrl
    } else {
      Remove-Item Env:SMOKE_BASE_URL -ErrorAction SilentlyContinue
    }

    if ($null -ne $previousCronSecret) {
      $env:SMOKE_CRON_SECRET = $previousCronSecret
    } else {
      Remove-Item Env:SMOKE_CRON_SECRET -ErrorAction SilentlyContinue
    }
  }
}

function Get-RelativePathCompat {
  param(
    [Parameter(Mandatory = $true)]
    [string]$BasePath,
    [Parameter(Mandatory = $true)]
    [string]$TargetPath
  )

  $resolvedBase = (Resolve-Path $BasePath).Path
  $resolvedTarget = (Resolve-Path $TargetPath).Path

  $baseUri = [Uri]($resolvedBase.TrimEnd('\') + '\')
  $targetUri = [Uri]$resolvedTarget
  $relativeUri = $baseUri.MakeRelativeUri($targetUri)
  $relativePath = [Uri]::UnescapeDataString($relativeUri.ToString()).Replace('/', [System.IO.Path]::DirectorySeparatorChar)

  if ([string]::IsNullOrWhiteSpace($relativePath)) {
    return "."
  }

  return $relativePath
}

function Remove-PublicMirrorPrivateArtifacts {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Root,
    [switch]$WhatIf
  )

  $resolvedRoot = [IO.Path]::GetFullPath($Root).TrimEnd([IO.Path]::DirectorySeparatorChar)
  $rootPrefix = $resolvedRoot + [IO.Path]::DirectorySeparatorChar
  $privateDirectories = @(
    ".vercel",
    ".npm-cache",
    ".secrets",
    ".agents",
    ".claude",
    ".cursor",
    "notes",
    "docs\ref",
    "docs\admin",
    "docs\adr",
    "docs\chat",
    "docs\reference-authoring\incoming",
    "docs\reference-authoring\notes",
    "prisma\migrations",
    "prisma\feedback\migrations"
  )
  $privateFilePatterns = @(
    ".env",
    ".env.local",
    ".env.*.local",
    "*.db",
    "*.sqlite",
    "*.sqlite3",
    "*.tsbuildinfo",
    "*.log",
    "*.txt",
    "CODEX_TASKS.md",
    "ROADMAP.md",
    "AI_Knowledge_Item_Template.md",
    "AI_SYSTEM_MASTERPLAN.md",
    "LOCAL_OPEN_SOURCE_SECURITY.md",
    "EN_Batch*.md",
    "JA_Batch*.md",
    "REF_Batch*.md",
    "HANDOFF*.md",
    "EN_Detailing_Workflow.md",
    "AGENTS.md"
  )

  foreach ($relativePath in $privateDirectories) {
    $candidate = [IO.Path]::GetFullPath((Join-Path $resolvedRoot $relativePath))
    if (-not $candidate.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) {
      throw "Refusing to remove path outside publish root: $candidate"
    }
    if (Test-Path -LiteralPath $candidate) {
      if ($WhatIf) {
        Write-Host "[dry-run] would remove private mirror directory: $candidate"
      } else {
        Remove-Item -LiteralPath $candidate -Recurse -Force
      }
    }
  }

  foreach ($file in Get-ChildItem -LiteralPath $resolvedRoot -File -Recurse -ErrorAction SilentlyContinue) {
    if (-not ($privateFilePatterns | Where-Object { $file.Name -like $_ })) {
      continue
    }
    $candidate = [IO.Path]::GetFullPath($file.FullName)
    if (-not $candidate.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) {
      throw "Refusing to remove file outside publish root: $candidate"
    }
    if ($WhatIf) {
      Write-Host "[dry-run] would remove private mirror file: $candidate"
    } else {
      Remove-Item -LiteralPath $candidate -Force
    }
  }
}

function Remove-PrivateGitMetadataProperties {
  param(
    [object]$Value,
    [Parameter(Mandatory = $true)]
    [string[]]$FieldNames
  )

  if ($null -eq $Value -or $Value -is [string] -or $Value.GetType().IsPrimitive) {
    return 0
  }

  $removed = 0
  if ($Value -is [System.Collections.IEnumerable]) {
    foreach ($item in $Value) {
      $removed += Remove-PrivateGitMetadataProperties -Value $item -FieldNames $FieldNames
    }
    return $removed
  }

  foreach ($property in @($Value.PSObject.Properties)) {
    if ($FieldNames -contains $property.Name) {
      $Value.PSObject.Properties.Remove($property.Name)
      $removed += 1
      continue
    }
    $removed += Remove-PrivateGitMetadataProperties -Value $property.Value -FieldNames $FieldNames
  }

  return $removed
}

function Remove-PublicEvalPrivateMetadata {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Root,
    [switch]$WhatIf
  )

  $evalRoot = Join-Path $Root "docs\ai-evals"
  if (-not (Test-Path -LiteralPath $evalRoot)) {
    return
  }

  $privateGitMetadataFields = @("gitCommit", "baseCommit", "commitSha", "sourceCommit", "commit", "gitDirty")

  foreach ($file in Get-ChildItem -LiteralPath $evalRoot -File -Filter "*.jsonl" -Recurse) {
    $changed = $false
    $sanitizedLines = foreach ($line in [IO.File]::ReadAllLines($file.FullName)) {
      if ([string]::IsNullOrWhiteSpace($line)) {
        continue
      }

      $record = $line | ConvertFrom-Json
      $removed = Remove-PrivateGitMetadataProperties -Value $record -FieldNames $privateGitMetadataFields
      if ($removed -gt 0) {
        $changed = $true
      }
      $record | ConvertTo-Json -Compress -Depth 100
    }

    if (-not $changed) {
      continue
    }

    if ($WhatIf) {
      Write-Host "[dry-run] would remove private git metadata from: $($file.FullName)"
      continue
    }

    $content = if ($sanitizedLines.Count -gt 0) {
      ($sanitizedLines -join "`n") + "`n"
    } else {
      ""
    }
    [IO.File]::WriteAllText($file.FullName, $content, [Text.UTF8Encoding]::new($false))
  }

  foreach ($file in Get-ChildItem -LiteralPath $evalRoot -File -Filter "*.json" -Recurse) {
    $record = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
    $changed = (Remove-PrivateGitMetadataProperties -Value $record -FieldNames $privateGitMetadataFields) -gt 0

    if (-not $changed) {
      continue
    }

    if ($WhatIf) {
      Write-Host "[dry-run] would remove private git metadata from: $($file.FullName)"
      continue
    }

    $content = ($record | ConvertTo-Json -Depth 100) + "`n"
    [IO.File]::WriteAllText($file.FullName, $content, [Text.UTF8Encoding]::new($false))
  }
}

function Assert-NoPublicGitMetadata {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Root
  )

  $fieldPattern = '"(?:gitCommit|baseCommit|commitSha|sourceCommit|commit|gitDirty)"\s*:'
  $leaks = @()
  foreach ($file in Get-ChildItem -LiteralPath $Root -File -Recurse -ErrorAction SilentlyContinue) {
    if ($file.Extension -notin @('.json', '.jsonl')) {
      continue
    }
    if (Select-String -LiteralPath $file.FullName -Pattern $fieldPattern -Quiet) {
      $leaks += $file.FullName
    }
  }

  if ($leaks.Count -gt 0) {
    throw "Private git metadata remains in public JSON artifacts:`n$($leaks -join "`n")"
  }
}

function Assert-NoPublicEditorialLeak {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Root
  )

  $patterns = @(
    '\ube44\uac1c\ubc1c\uc790(?:\s*\ub3c5\uc790)?',
    '\uc608\uc0c1\s*\ub3c5\uc790',
    '\ub3c5\uc790\uac00\s*\uba3c\uc800\s*\uc54c\uc544\uc57c\s*\ud560',
    '\uc784\uc0c1\uc2ec\ub9ac\uc0ac\uac00\s*\uba3c\uc800\s*\uc774\ud574',
    '\uc784\uc0c1\uac00\uac00\s*\uba3c\uc800\s*\uc54c\uc544\uc57c\s*\ud560',
    '\bWho These Documents Are For\b',
    '\bnon-developer(?:s)?\b',
    '\bprimary readers?\b',
    '\btarget reader\b',
    '\bintended readers?\b',
    '\bclinician-first\b',
    '\breader-first\b',
    '\uC6D0\uC804[^\r\n]*\uD655\uBCF4',
    '\uC6D0\uC804[^\r\n]*\uC785\uC218',
    '\uC6D0\uBB38[^\r\n]*\uD655\uBCF4',
    '\uC804\uBB38\s*\uBBF8\uD655\uBCF4',
    '\uC804\uBB38\uC744\s*\uD655\uBCF4',
    '\u539F\u5178\u306E?\u30DA\u30FC\u30B8.*\u78BA\u4FDD',
    '\bsource-text page\b.*\bobtained\b',
    'p\u00E1gina de la obra original',
    'p\u00E1gina da obra original'
  )

  $leaks = @()
  foreach ($file in Get-ChildItem -LiteralPath $Root -File -Filter '*.md' -Recurse -ErrorAction SilentlyContinue) {
    foreach ($pattern in $patterns) {
      foreach ($match in Select-String -LiteralPath $file.FullName -Pattern $pattern -CaseSensitive:$false) {
        $leaks += "$($file.FullName):$($match.LineNumber): $($match.Line.Trim())"
      }
    }
  }

  if ($leaks.Count -gt 0) {
    throw "Internal audience or editorial labels remain in public Markdown:`n$($leaks -join "`n")"
  }
}

$excludeDirs = @(
  ".git",
  ".next",
  ".vercel",
  ".npm-cache",
  "node_modules",
  ".secrets",
  ".agents",
  ".claude",
  ".cursor",
  "notes",
  "docs\ref",
  "docs\admin",
  "docs\adr",
  "docs\chat",
  "docs\reference-authoring\incoming",
  "docs\reference-authoring\notes",
  "prisma\migrations",
  "prisma\feedback\migrations"
)

$excludeFiles = @(
  ".env",
  ".env.local",
  ".env.*.local",
  "*.db",
  "*.sqlite",
  "*.sqlite3",
  "*.log",
  "*.tsbuildinfo",
  "*.txt",
  ".tmp-*",
  "*.out",
  "*.err",
  ".cursorrules",
  "CODEX_TASKS.md",
  "ROADMAP.md",
  "AI_Knowledge_Item_Template.md",
  "AI_SYSTEM_MASTERPLAN.md",
  "LOCAL_OPEN_SOURCE_SECURITY.md",
  "EN_Batch*.md",
  "JA_Batch*.md",
  "REF_Batch*.md",
  "HANDOFF*.md",
  "EN_Detailing_Workflow.md",
  "AGENTS.md"
)

if (-not $SkipVerify) {
  Write-Host "[verify] running release verification before publish"
  Push-Location $sourceRoot
  try {
    npm.cmd run docs:verify-release
    if ($LASTEXITCODE -ne 0) {
      throw "release verification failed with exit code $LASTEXITCODE"
    }
  } finally {
    Pop-Location
  }
} else {
  Write-Host "[verify] skipped by -SkipVerify"
}

if ($UseCurrentRepo) {
  $gitRoot = (git -C $sourceRoot rev-parse --show-toplevel).Trim()
  if (-not $gitRoot) {
    throw "Current repo root could not be resolved from $sourceRoot"
  }

  $relativePath = Get-RelativePathCompat -BasePath $gitRoot -TargetPath $sourceRoot
  if ([string]::IsNullOrWhiteSpace($relativePath)) {
    $relativePath = "."
  }

  Write-Host "[direct] repo root: $gitRoot"
  Write-Host "[direct] pathspec: $relativePath"

  if ($DryRun) {
    Write-Host "[dry-run] showing direct publish scope"
    git -C $gitRoot status --short -- $relativePath
    if ($SmokeBaseUrl) {
      Write-Host "[dry-run] post-publish smoke target would be $SmokeBaseUrl"
    }
    exit 0
  }

  git -C $gitRoot add --all -- $relativePath
  try {
    git -C $gitRoot commit --only -m $Message -- $relativePath | Out-Host
  } catch {
    Write-Host "[git] nothing to commit for path $relativePath (or commit failed)."
  }

  $currentBranch = (git -C $gitRoot branch --show-current).Trim()
  if (-not $currentBranch) {
    throw "Current branch could not be resolved."
  }

  git -C $gitRoot push origin $currentBranch
  if ($SmokeBaseUrl) {
    Invoke-ReleaseSmoke -BaseUrl $SmokeBaseUrl -CronSecret $SmokeCronSecret
  } else {
    Write-Host "[smoke] skipped (use -SmokeBaseUrl to run post-publish smoke checks)"
  }
  Write-Host "[done] direct publish completed."
  exit 0
}

$publishRoot = if ($PublishRoot) {
  (Resolve-Path $PublishRoot).Path
} else {
  Join-Path (Resolve-Path "..").Path "repo_publish"
}
$resolvedPublishRoot = [IO.Path]::GetFullPath($publishRoot).TrimEnd([IO.Path]::DirectorySeparatorChar)
$publishRootPrefix = $resolvedPublishRoot + [IO.Path]::DirectorySeparatorChar
$targetRoot = [IO.Path]::GetFullPath((Join-Path $resolvedPublishRoot $PublishTargetRelativePath)).TrimEnd([IO.Path]::DirectorySeparatorChar)

if (-not $targetRoot.StartsWith($publishRootPrefix, [StringComparison]::OrdinalIgnoreCase)) {
  throw "Refusing to publish outside publish root: $targetRoot"
}

if (-not (Test-Path $targetRoot)) {
  throw "Publish target not found: $targetRoot`nHint: pass -PublishRoot <public-repo-path> and -PublishTargetRelativePath <mirror-path>, or use -UseCurrentRepo to publish from the current git repository."
}

$args = @(
  $sourceRoot,
  $targetRoot,
  "/MIR",
  "/R:2",
  "/W:1",
  "/NFL",
  "/NDL",
  "/NP"
)

if ($excludeDirs.Count -gt 0) {
  $args += "/XD"
  $args += $excludeDirs
}

if ($excludeFiles.Count -gt 0) {
  $args += "/XF"
  $args += $excludeFiles
}

if ($DryRun) {
  $args += "/L"
}

Write-Host "[sync] $sourceRoot -> $targetRoot"
robocopy @args | Out-Host
$rc = $LASTEXITCODE
if ($rc -ge 8) {
  throw "robocopy failed with exit code $rc"
}

Remove-PublicMirrorPrivateArtifacts -Root $targetRoot -WhatIf:$DryRun
Remove-PublicEvalPrivateMetadata -Root $targetRoot -WhatIf:$DryRun
if (-not $DryRun) {
  Assert-NoPublicGitMetadata -Root $targetRoot
  Assert-NoPublicEditorialLeak -Root $resolvedPublishRoot
}

if ($DryRun) {
  Write-Host "[dry-run] sync simulation completed."
  if ($SmokeBaseUrl) {
    Write-Host "[dry-run] post-publish smoke target would be $SmokeBaseUrl"
  }
  exit 0
}

if ($SyncOnly) {
  Write-Host "[sync-only] mirror updated without committing or pushing."
  exit 0
}

$localizationCheck = Join-Path $resolvedPublishRoot "scripts\verify-public-document-locales.ps1"
if (-not (Test-Path -LiteralPath $localizationCheck)) {
  throw "Public document localization check not found: $localizationCheck"
}
$powerShellHost = if (Get-Command pwsh -ErrorAction SilentlyContinue) {
  "pwsh"
} else {
  "powershell.exe"
}
Write-Host "[docs] strict five-language public document check"
& $powerShellHost -NoProfile -ExecutionPolicy Bypass -File $localizationCheck
if ($LASTEXITCODE -ne 0) {
  throw "Public document localization check failed with exit code $LASTEXITCODE."
}

Write-Host "[git] commit + push in $targetRoot"
$env:HOME = $sourceRoot
$env:GIT_CONFIG_NOSYSTEM = "1"
$safe = "safe.directory=$publishRoot"

git -c $safe -C $targetRoot add .
try {
  git -c $safe -C $targetRoot commit -m $Message | Out-Host
} catch {
  Write-Host "[git] nothing to commit (or commit failed)."
}

git -c $safe -C $targetRoot push origin main
if ($SmokeBaseUrl) {
  Invoke-ReleaseSmoke -BaseUrl $SmokeBaseUrl -CronSecret $SmokeCronSecret
} else {
  Write-Host "[smoke] skipped (use -SmokeBaseUrl to run post-publish smoke checks)"
}
Write-Host "[done] publish completed."
