param(
  [string]$Message = "chore: publish sync",
  [switch]$DryRun,
  [switch]$SkipVerify,
  [string]$PublishRoot,
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

$excludeDirs = @(
  ".git",
  ".next",
  "node_modules",
  ".secrets",
  ".agents",
  ".claude",
  ".cursor",
  "docs\\ref"
)

$excludeFiles = @(
  ".env",
  ".env.local",
  "*.db",
  "*.sqlite",
  "*.sqlite3",
  "*.log",
  ".cursorrules"
)

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
$targetRoot = Join-Path $publishRoot "v2-nextjs"

if (-not (Test-Path $targetRoot)) {
  throw "Publish target not found: $targetRoot`nHint: pass -PublishRoot <path-to-parent-folder-containing-v2-nextjs> if your publish repo lives elsewhere, or use -UseCurrentRepo to publish from the current git repository."
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

if ($DryRun) {
  Write-Host "[dry-run] sync simulation completed."
  if ($SmokeBaseUrl) {
    Write-Host "[dry-run] post-publish smoke target would be $SmokeBaseUrl"
  }
  exit 0
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
