param(
  [string]$Message = "chore: publish sync",
  [switch]$DryRun,
  [switch]$SkipVerify,
  [string]$PublishRoot,
  [string]$PublishTargetRelativePath = "v2-nextjs",
  [switch]$SyncOnly,
  [switch]$UseCurrentRepo,
  [string]$SanitizeOnlyRoot,
  [string]$SmokeBaseUrl,
  [string]$SmokeCronSecret
)

$ErrorActionPreference = "Stop"

$sourceRoot = (Resolve-Path ".").Path
$privateReferencePolicy = @('curated', 'internal', 'reference') -join '-'
$publicReferencePolicy = 'curated-reference'
$internalAiGuidanceMarker = '[' + (@('AI', 'Usage', 'Guideline') -join ' ') + ']'

function Assert-NativeCommandSucceeded {
  param(
    [Parameter(Mandatory = $true)]
    [int]$ExitCode,
    [Parameter(Mandatory = $true)]
    [string]$Operation
  )

  if ($ExitCode -ne 0) {
    throw "$Operation failed with exit code $ExitCode."
  }
}

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
    "docs\ai-evals\private-runs",
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

  foreach ($file in Get-ChildItem -LiteralPath $resolvedRoot -File -Recurse -Force -ErrorAction SilentlyContinue) {
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

  if (
    $null -eq $Value -or
    $Value -is [string] -or
    $Value -is [datetime] -or
    $Value -is [datetimeoffset] -or
    $Value -is [guid] -or
    $Value -is [decimal] -or
    $Value.GetType().IsPrimitive
  ) {
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

  foreach ($file in Get-ChildItem -LiteralPath $evalRoot -File -Filter "*.jsonl" -Recurse -Force) {
    $changed = $false
    $sanitizedLines = @(foreach ($line in [IO.File]::ReadAllLines($file.FullName)) {
      if ([string]::IsNullOrWhiteSpace($line)) {
        continue
      }

      $record = $line | ConvertFrom-Json
      $removed = Remove-PrivateGitMetadataProperties -Value $record -FieldNames $privateGitMetadataFields
      if ($removed -gt 0) {
        $changed = $true
      }
      $record | ConvertTo-Json -Compress -Depth 100
    })

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

  foreach ($file in Get-ChildItem -LiteralPath $evalRoot -File -Filter "*.json" -Recurse -Force) {
    $rawJson = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8
    $isJsonArray = $rawJson.TrimStart().StartsWith("[", [StringComparison]::Ordinal)
    $record = $rawJson | ConvertFrom-Json
    $changed = (Remove-PrivateGitMetadataProperties -Value $record -FieldNames $privateGitMetadataFields) -gt 0

    if (-not $changed) {
      continue
    }

    if ($WhatIf) {
      Write-Host "[dry-run] would remove private git metadata from: $($file.FullName)"
      continue
    }

    $content = if ($isJsonArray) {
      (ConvertTo-Json -InputObject @($record) -Depth 100) + "`n"
    } else {
      (ConvertTo-Json -InputObject $record -Depth 100) + "`n"
    }
    [IO.File]::WriteAllText($file.FullName, $content, [Text.UTF8Encoding]::new($false))
  }
}

function Assert-NoPublicGitMetadata {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Root
  )

  $fieldPattern = '"(?:gitCommit|baseCommit|commitSha|sourceCommit|commit|gitDirty)"\s*:'
  $excludedPrefixes = @(
    "node_modules",
    ".git",
    ".next",
    ".vercel",
    ".npm-cache"
  ) | ForEach-Object {
    [IO.Path]::GetFullPath((Join-Path $Root $_)).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
  }
  $leaks = @()
  foreach ($file in Get-ChildItem -LiteralPath $Root -File -Recurse -Force -ErrorAction SilentlyContinue) {
    $fullPath = [IO.Path]::GetFullPath($file.FullName)
    if ($excludedPrefixes | Where-Object { $fullPath.StartsWith($_, [StringComparison]::OrdinalIgnoreCase) }) {
      continue
    }
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
  $excludedPrefixes = @(
    'node_modules',
    '.next',
    '.git',
    '.npm-cache',
    '.vercel',
    'v2-nextjs\source\node_modules',
    'v2-nextjs\source\.next'
  ) | ForEach-Object {
    [IO.Path]::GetFullPath((Join-Path $Root $_)).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
  }
  foreach ($file in Get-ChildItem -LiteralPath $Root -File -Filter '*.md' -Recurse -Force -ErrorAction SilentlyContinue) {
    $fullPath = [IO.Path]::GetFullPath($file.FullName)
    if ($excludedPrefixes | Where-Object { $fullPath.StartsWith($_, [StringComparison]::OrdinalIgnoreCase) }) {
      continue
    }
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

function Assert-NoReaderFacingProductionNarrative {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Root
  )

  $resolvedRoot = [IO.Path]::GetFullPath($Root).TrimEnd([IO.Path]::DirectorySeparatorChar)
  $appRootCandidate = Join-Path $resolvedRoot 'v2-nextjs'
  $appRoot = if (Test-Path -LiteralPath $appRootCandidate -PathType Container) {
    $appRootCandidate
  } else {
    $resolvedRoot
  }

  $readerFiles = @()
  foreach ($scanRoot in @($resolvedRoot, $appRoot) | Select-Object -Unique) {
    if (-not (Test-Path -LiteralPath $scanRoot -PathType Container)) {
      continue
    }
    $readerFiles += Get-ChildItem -LiteralPath $scanRoot -File -Filter '*.md' -ErrorAction SilentlyContinue |
      Where-Object { $_.Name -like 'README*.md' -or $_.Name -like 'CHANGELOG*.md' }
  }
  foreach ($relativeRoot in @('releases', 'methodology')) {
    $scanRoot = Join-Path $appRoot $relativeRoot
    if (Test-Path -LiteralPath $scanRoot -PathType Container) {
      $readerFiles += Get-ChildItem -LiteralPath $scanRoot -File -Filter '*.md' -Recurse -ErrorAction SilentlyContinue
    }
  }
  $opsRoot = Join-Path $appRoot 'source\docs\ops'
  if (Test-Path -LiteralPath $opsRoot -PathType Container) {
    $readerFiles += Get-ChildItem -LiteralPath $opsRoot -File -Filter '*calculation-source-crosscheck*.md' -ErrorAction SilentlyContinue
  }
  $readerFiles = @($readerFiles | Sort-Object -Property FullName -Unique)

  $patterns = @(
    [regex]::Escape($internalAiGuidanceMarker),
    'Codex',
    'Claude',
    'worktree',
    'uncommitted',
    '\bpublic[- ]mirror\b',
    '\blocal PDF\b',
    '\bPDF viewer\b',
    '\bprivate repositor(?:y|ies)\b',
    '\bpaid API\b',
    '\bAPI cost\b',
    '\bestimated cost\b',
    '\bactual API calls?\b',
    '\blive GPT',
    '^#{1,6}\s+Public scope and security boundary\s*$',
    '\bThe public source includes\b',
    '\bOpenAI embeddings?\b',
    '\bcontent[- ]hash mismatch(?:es)?\b',
    'pgvector',
    '\uB85C\uCEEC\s*PDF',
    'PDF\s*\uBDF0\uC5B4',
    '\uACF5\uAC1C\s*\uBBF8\uB7EC',
    '\uBBF8\uCEE4\uBC0B',
    '\uC0AC\uC124\s*\uC800\uC7A5\uC18C',
    '\uBE44\uACF5\uAC1C\s*\uBCF4\uC720',
    '\uB85C\uCEEC\s*\uD30C\uC77C\uBA85',
    '\uB85C\uCEEC\s*\uACBD\uB85C',
    '\uB0B4\uBD80\s*\uBC84\uC804\s*\uC2DD\uBCC4',
    '\uC720\uB8CC\s*API',
    '\uCD94\uC815\s*\uBE44\uC6A9',
    '\uC2E4\uC81C\s*API\s*\uD638\uCD9C',
    '^#{1,6}\s+\uACF5\uAC1C\s*\uBC94\uC704\uC640\s*\uBCF4\uC548\s*\uACBD\uACC4\s*$',
    '\uACF5\uAC1C\s*\uC18C\uC2A4\uC5D0\uB294',
    '\uC784\uBCA0\uB529',
    '\uBCF8\uBB38\s*\uD574\uC2DC\s*\uBD88\uC77C\uCE58',
    '\u6709\u6599API',
    '\u63A8\u5B9A\u8CBB\u7528',
    '\u5B9F\u969B\u306E(?:GPT|API)',
    '^#{1,6}\s+\u516C\u958B\u7BC4\u56F2\u3068\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3\u5883\u754C\s*$',
    '\u516C\u958B\u30BD\u30FC\u30B9\u306B\u306F',
    '\u57CB\u3081\u8FBC\u307F',
    'llamadas? de pago a la API',
    'llamadas? reales? (?:a|de)',
    'costo estimado',
    'incrustaciones vectoriales',
    '^#{1,6}\s+Alcance p\u00FAblico y l\u00EDmite de seguridad\s*$',
    'El c\u00F3digo p\u00FAblico incluye',
    'chamadas? pagas? (?:a|\u00E0) API',
    'chamadas? reais?',
    'custo estimado',
    'embeddings vetoriais',
    '^#{1,6}\s+Escopo p\u00FAblico e limite de seguran\u00E7a\s*$',
    'O c\u00F3digo p\u00FAblico inclui'
  )

  $leaks = @()
  foreach ($file in $readerFiles) {
    foreach ($pattern in $patterns) {
      foreach ($match in Select-String -LiteralPath $file.FullName -Pattern $pattern -CaseSensitive:$false) {
        $leaks += "$($file.FullName):$($match.LineNumber): $($match.Line.Trim())"
      }
    }
  }

  if ($leaks.Count -gt 0) {
    throw "Internal production narrative remains in reader-facing public documents:`n$($leaks -join "`n")"
  }
}

function Remove-PublicAuthoringMetadata {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Root,
    [switch]$WhatIf
  )

  $resolvedRoot = [IO.Path]::GetFullPath($Root).TrimEnd([IO.Path]::DirectorySeparatorChar)
  $draftRoot = Join-Path $resolvedRoot "docs\reference-authoring\drafts"
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  $evidenceTailPattern = '(?ms)\r?\n##\s+(?:Evidence Note|\uADFC\uAC70 \uBA54\uBAA8|\u6839\u62E0\u30E1\u30E2|Nota de base|Nota de fundamento)\s*\r?\n.*\z'

  if (Test-Path -LiteralPath $draftRoot) {
    foreach ($file in Get-ChildItem -LiteralPath $draftRoot -File -Filter '*.md' -Recurse -Force) {
      $text = [IO.File]::ReadAllText($file.FullName)
      $sanitized = [regex]::Replace($text, '(?m)^provenanceNote:[^\r\n]*(?:\r?\n)', '')
      $sanitized = [regex]::Replace($sanitized, $evidenceTailPattern, '')
      $sanitized = $sanitized.Replace($privateReferencePolicy, $publicReferencePolicy).TrimEnd() + "`n"
      if ($sanitized -eq $text) {
        continue
      }
      if ($WhatIf) {
        Write-Host "[dry-run] would sanitize public authoring metadata: $($file.FullName)"
      } else {
        [IO.File]::WriteAllText($file.FullName, $sanitized, $utf8NoBom)
      }
    }
  }

  $authoringReadme = Join-Path $resolvedRoot 'docs\reference-authoring\README.md'
  if (Test-Path -LiteralPath $authoringReadme -PathType Leaf) {
    $text = [IO.File]::ReadAllText($authoringReadme)
    $sanitized = [regex]::Replace($text, '(?m)^-\s*`?provenanceNote`?\s*\r?\n', '')
    $sanitized = [regex]::Replace($sanitized, '(?m)^`provenanceNote`[^\r\n]*(?:\r?\n)?', '')
    $publicBoundary = [regex]::Unescape('## \uACF5\uAC1C \uBC94\uC704\n\n\uACF5\uAC1C \uC800\uC7A5\uC18C\uC758 \uCC38\uC870 \uBB38\uC11C\uB294 \uACF5\uAC1C \uAC00\uB2A5\uD55C \uC784\uC0C1 \uC124\uBA85\uACFC \uACF5\uAC1C \uADFC\uAC70\uB9CC \uD3EC\uD568\uD569\uB2C8\uB2E4. \uCD9C\uCC98 \uB300\uC870 \uAE30\uB85D\uC740 \uC6D0\uACE0 \uC791\uC5C5 \uACF5\uAC04\uC5D0 \uBCC4\uB3C4\uB85C \uBCF4\uC874\uD558\uBA70 \uACF5\uAC1C \uC6D0\uACE0 frontmatter\uC5D0\uB294 \uD3EC\uD568\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.\n')
    $sanitized = [regex]::Replace(
      $sanitized,
      '(?ms)^##\s+\uACF5\uAC1C\s+\uACBD\uACC4\s*\r?\n.*\z',
      $publicBoundary
    )
    $sanitized = $sanitized.Replace($privateReferencePolicy, $publicReferencePolicy)
    if ($sanitized -ne $text) {
      if ($WhatIf) {
        Write-Host "[dry-run] would sanitize public authoring guide: $authoringReadme"
      } else {
        [IO.File]::WriteAllText($authoringReadme, $sanitized.TrimEnd() + "`n", $utf8NoBom)
      }
    }
  }

  $textExtensions = @('.json', '.jsonl', '.js', '.mjs', '.ts', '.tsx', '.md')
  $excludedPrefixes = @(
    'node_modules',
    '.next',
    '.git',
    '.npm-cache',
    '.vercel'
  ) | ForEach-Object {
    [IO.Path]::GetFullPath((Join-Path $resolvedRoot $_)).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
  }
  foreach ($file in Get-ChildItem -LiteralPath $resolvedRoot -File -Recurse -Force -ErrorAction SilentlyContinue) {
    $fullPath = [IO.Path]::GetFullPath($file.FullName)
    if ($excludedPrefixes | Where-Object { $fullPath.StartsWith($_, [StringComparison]::OrdinalIgnoreCase) }) {
      continue
    }
    if ($file.Extension -notin $textExtensions) {
      continue
    }
    $text = [IO.File]::ReadAllText($file.FullName)
    if (-not $text.Contains($privateReferencePolicy)) {
      continue
    }
    if ($WhatIf) {
      Write-Host "[dry-run] would neutralize public reference policy label: $($file.FullName)"
    } else {
      [IO.File]::WriteAllText(
        $file.FullName,
        $text.Replace($privateReferencePolicy, $publicReferencePolicy),
        $utf8NoBom
      )
    }
  }
}

function Assert-NoPublicAuthoringMetadata {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Root
  )

  $patterns = @(
    'provenanceNote\s*:',
    '^\s*-\s*`?provenanceNote`?\s*$',
    'notes/corpus-review-ledger\.md',
    'docs/reference-authoring/notes',
    [regex]::Escape($privateReferencePolicy),
    [regex]::Escape($internalAiGuidanceMarker),
    '^##\s+(?:Evidence Note|\uADFC\uAC70 \uBA54\uBAA8|\u6839\u62E0\u30E1\u30E2|Nota de base|Nota de fundamento)\s*$',
    '\[Corpus Governance\]',
    'reviewed internally',
    '\uB0B4\uBD80 \uAC80\uC218',
    '\u5185\u90E8\u3067\u9078\u5225',
    'revisad[oa] internamente'
  )
  $roots = @(
    (Join-Path $Root 'docs\reference-authoring\README.md'),
    (Join-Path $Root 'docs\reference-authoring\drafts'),
    (Join-Path $Root 'generated\reference-corpus'),
    (Join-Path $Root 'lib\docsDetailed.ts')
  )
  $leaks = @()
  foreach ($scanRoot in $roots) {
    if (-not (Test-Path -LiteralPath $scanRoot)) {
      continue
    }
    $files = if (Test-Path -LiteralPath $scanRoot -PathType Leaf) {
      @(Get-Item -LiteralPath $scanRoot)
    } else {
      @(Get-ChildItem -LiteralPath $scanRoot -File -Recurse -Force)
    }
    foreach ($file in $files) {
      if ($file.Extension -notin @('.md', '.json', '.jsonl', '.ts', '.tsx')) {
        continue
      }
      foreach ($pattern in $patterns) {
        foreach ($match in Select-String -LiteralPath $file.FullName -Pattern $pattern -CaseSensitive:$false) {
          $leaks += "$($file.FullName):$($match.LineNumber): $($match.Line.Trim())"
        }
      }
    }
  }

  if ($leaks.Count -gt 0) {
    throw "Private authoring metadata remains in public reference files:`n$($leaks -join "`n")"
  }
}

if ($SanitizeOnlyRoot) {
  $resolvedSanitizeRoot = (Resolve-Path -LiteralPath $SanitizeOnlyRoot).Path
  $normalizedSourceRoot = [IO.Path]::GetFullPath($sourceRoot).TrimEnd(
    [IO.Path]::DirectorySeparatorChar,
    [IO.Path]::AltDirectorySeparatorChar
  )
  $normalizedSanitizeRoot = [IO.Path]::GetFullPath($resolvedSanitizeRoot).TrimEnd(
    [IO.Path]::DirectorySeparatorChar,
    [IO.Path]::AltDirectorySeparatorChar
  )
  $sourcePrefix = $normalizedSourceRoot + [IO.Path]::DirectorySeparatorChar
  $sanitizePrefix = $normalizedSanitizeRoot + [IO.Path]::DirectorySeparatorChar
  $rootsOverlap = (
    [string]::Equals(
      $normalizedSanitizeRoot,
      $normalizedSourceRoot,
      [StringComparison]::OrdinalIgnoreCase
    ) -or
    $normalizedSourceRoot.StartsWith($sanitizePrefix, [StringComparison]::OrdinalIgnoreCase) -or
    $normalizedSanitizeRoot.StartsWith($sourcePrefix, [StringComparison]::OrdinalIgnoreCase)
  )
  if ($rootsOverlap) {
    throw "Refusing to sanitize a path that overlaps the private source root."
  }
  Remove-PublicMirrorPrivateArtifacts -Root $resolvedSanitizeRoot -WhatIf:$DryRun
  Remove-PublicEvalPrivateMetadata -Root $resolvedSanitizeRoot -WhatIf:$DryRun
  Remove-PublicAuthoringMetadata -Root $resolvedSanitizeRoot -WhatIf:$DryRun
  if ($DryRun) {
    Write-Host "[dry-run] sanitize-only simulation completed."
  } else {
    Assert-NoPublicGitMetadata -Root $resolvedSanitizeRoot
    Assert-NoPublicAuthoringMetadata -Root $resolvedSanitizeRoot
    Assert-NoPublicEditorialLeak -Root $resolvedSanitizeRoot
    Assert-NoReaderFacingProductionNarrative -Root $resolvedSanitizeRoot
    Write-Host "[sanitize-only] public mirror boundary verified."
  }
  exit 0
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
  "docs\ai-evals\private-runs",
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
    Assert-NativeCommandSucceeded -ExitCode $LASTEXITCODE -Operation "git status"
    if ($SmokeBaseUrl) {
      Write-Host "[dry-run] post-publish smoke target would be $SmokeBaseUrl"
    }
    exit 0
  }

  git -C $gitRoot add --all -- $relativePath
  Assert-NativeCommandSucceeded -ExitCode $LASTEXITCODE -Operation "git add"

  git -C $gitRoot diff --cached --quiet -- $relativePath
  $stagedDiffExitCode = $LASTEXITCODE
  if ($stagedDiffExitCode -eq 1) {
    git -C $gitRoot commit --only -m $Message -- $relativePath | Out-Host
    Assert-NativeCommandSucceeded -ExitCode $LASTEXITCODE -Operation "git commit"
  } elseif ($stagedDiffExitCode -eq 0) {
    Write-Host "[git] nothing to commit for path $relativePath."
  } else {
    throw "git diff --cached failed with exit code $stagedDiffExitCode."
  }

  $currentBranchOutput = git -C $gitRoot branch --show-current
  Assert-NativeCommandSucceeded -ExitCode $LASTEXITCODE -Operation "git branch --show-current"
  $currentBranch = ($currentBranchOutput | Out-String).Trim()
  if (-not $currentBranch) {
    throw "Current branch could not be resolved."
  }

  git -C $gitRoot push origin $currentBranch
  Assert-NativeCommandSucceeded -ExitCode $LASTEXITCODE -Operation "git push"
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
Remove-PublicAuthoringMetadata -Root $targetRoot -WhatIf:$DryRun
if (-not $DryRun) {
  Assert-NoPublicGitMetadata -Root $targetRoot
  Assert-NoPublicAuthoringMetadata -Root $targetRoot
  Assert-NoPublicEditorialLeak -Root $resolvedPublishRoot
  Assert-NoReaderFacingProductionNarrative -Root $resolvedPublishRoot
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
Assert-NativeCommandSucceeded -ExitCode $LASTEXITCODE -Operation "public mirror git add"

git -c $safe -C $targetRoot diff --cached --quiet
$publicStagedDiffExitCode = $LASTEXITCODE
if ($publicStagedDiffExitCode -eq 1) {
  git -c $safe -C $targetRoot commit -m $Message | Out-Host
  Assert-NativeCommandSucceeded -ExitCode $LASTEXITCODE -Operation "public mirror git commit"
} elseif ($publicStagedDiffExitCode -eq 0) {
  Write-Host "[git] nothing to commit."
} else {
  throw "public mirror git diff --cached failed with exit code $publicStagedDiffExitCode."
}

git -c $safe -C $targetRoot push origin main
Assert-NativeCommandSucceeded -ExitCode $LASTEXITCODE -Operation "public mirror git push"
if ($SmokeBaseUrl) {
  Invoke-ReleaseSmoke -BaseUrl $SmokeBaseUrl -CronSecret $SmokeCronSecret
} else {
  Write-Host "[smoke] skipped (use -SmokeBaseUrl to run post-publish smoke checks)"
}
Write-Host "[done] publish completed."
