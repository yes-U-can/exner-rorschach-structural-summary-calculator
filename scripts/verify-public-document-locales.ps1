param(
  [switch]$AllowDraft,
  [switch]$UpdateHashes
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$manifestPath = Join-Path $repoRoot "docs\localization\manifest.json"
$manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
$errors = [System.Collections.Generic.List[string]]::new()

function Get-NormalizedText {
  param([Parameter(Mandatory = $true)][string]$Path)
  return ([IO.File]::ReadAllText($Path, [Text.Encoding]::UTF8) -replace "`r`n", "`n" -replace "`r", "`n")
}

function Get-Sha256 {
  param([Parameter(Mandatory = $true)][string]$Text)
  $bytes = [Text.Encoding]::UTF8.GetBytes($Text)
  $algorithm = [Security.Cryptography.SHA256]::Create()
  try {
    $hash = $algorithm.ComputeHash($bytes)
  } finally {
    $algorithm.Dispose()
  }
  return (([BitConverter]::ToString($hash)) -replace '-', '').ToLowerInvariant()
}

function Remove-FencedBlocks {
  param([Parameter(Mandatory = $true)][string]$Text)
  return [regex]::Replace($Text, '(?ms)^```.*?^```\s*$', '')
}

function Get-HeadingShape {
  param([Parameter(Mandatory = $true)][string]$Text)
  $withoutFences = Remove-FencedBlocks -Text $Text
  return @([regex]::Matches($withoutFences, '(?m)^(#{1,6})\s+') | ForEach-Object { $_.Groups[1].Value.Length })
}

function Get-LinkTargets {
  param([Parameter(Mandatory = $true)][string]$Text)
  return @([regex]::Matches($Text, '(?<!\!)\[[^\]]+\]\(([^)]+)\)') | ForEach-Object { $_.Groups[1].Value })
}

function Resolve-LocalLinkPath {
  param(
    [Parameter(Mandatory = $true)][string]$DocumentPath,
    [Parameter(Mandatory = $true)][string]$Target
  )
  if ($Target -match '^(?:[A-Za-z][A-Za-z0-9+.-]*:|//|#)') {
    return $null
  }
  $pathPart = ($Target -split '[?#]', 2)[0].Trim()
  if ($pathPart.StartsWith('<') -and $pathPart.EndsWith('>')) {
    $pathPart = $pathPart.Substring(1, $pathPart.Length - 2)
  }
  if ([string]::IsNullOrWhiteSpace($pathPart)) {
    return $null
  }
  try {
    $decoded = [Uri]::UnescapeDataString($pathPart)
    return [IO.Path]::GetFullPath((Join-Path (Split-Path -Parent $DocumentPath) $decoded)).TrimEnd([IO.Path]::DirectorySeparatorChar, [IO.Path]::AltDirectorySeparatorChar)
  } catch {
    return $null
  }
}

function Get-NumberTokens {
  param([Parameter(Mandatory = $true)][string]$Text)
  $withoutUrls = [regex]::Replace($Text, 'https?://\S+', '')
  return @(
    [regex]::Matches($withoutUrls, '(?<![\p{N}_])(?:\d{4}-\d{2}-\d{2}|v?\d+(?:[.,]\d+)*(?:%|/\d+)?)(?![\p{N}_])') |
      ForEach-Object { $_.Value } |
      Sort-Object
  )
}

function Get-CodeTokens {
  param([Parameter(Mandatory = $true)][string]$Text)
  $fenced = @([regex]::Matches($Text, '(?ms)^```[^\n]*\n(.*?)^```\s*$') | ForEach-Object { ($_.Groups[1].Value -replace "`r`n", "`n").TrimEnd() })
  $withoutFences = Remove-FencedBlocks -Text $Text
  $inline = @(
    [regex]::Matches($withoutFences, '`([^`\r\n]+)`') |
      ForEach-Object { $_.Groups[1].Value } |
      Where-Object {
        -not $_.Contains(' ') -and
        $_ -match '^[A-Za-z0-9_./:+%''-]+$' -and
        ($_ -match '[A-Za-z0-9_./:+%''-]')
      }
  )
  return @($fenced + $inline)
}

function Get-ReleaseTypeSequence {
  param(
    [Parameter(Mandatory = $true)][string]$Text,
    [Parameter(Mandatory = $true)][object]$Labels,
    [Parameter(Mandatory = $true)][string]$GroupId,
    [Parameter(Mandatory = $true)][string]$Locale
  )
  $entries = [System.Collections.Generic.List[string]]::new()
  foreach ($line in ($Text -split "`n")) {
    $isReleaseMetadata = $line -match '^\s*(?:#{1,6}\s+\[\d{4}-\d{2}-\d{2}\]\s+v\d+\.\d+\.\d+|-\s+\*\*\[\d{4}-\d{2}-\d{2}\]\s+v\d+\.\d+\.\d+|\|\s*\d{4}-\d{2}-\d{2}\s*\|\s*v\d+\.\d+\.\d+\s*\|)'
    if (-not $isReleaseMetadata) {
      continue
    }

    $versionMatch = [regex]::Match($line, '(?<![A-Za-z0-9])v\d+\.\d+\.\d+(?![A-Za-z0-9])')
    if (-not $versionMatch.Success) {
      continue
    }

    $matchedTypes = [System.Collections.Generic.List[string]]::new()
    foreach ($type in @('major', 'minor', 'bug', 'hotfix')) {
      $labelProperty = $Labels.PSObject.Properties[$type]
      if ($null -eq $labelProperty -or [string]::IsNullOrWhiteSpace([string]$labelProperty.Value)) {
        continue
      }
      if ($line.IndexOf([string]$labelProperty.Value, [StringComparison]::OrdinalIgnoreCase) -ge 0) {
        $matchedTypes.Add($type)
      }
    }

    if ($matchedTypes.Count -ne 1) {
      $found = if ($matchedTypes.Count -eq 0) { '<none>' } else { $matchedTypes -join ', ' }
      $errors.Add("[$GroupId/$Locale] Release entry '$($versionMatch.Value)' must contain exactly one approved release-category label (found $found).")
      continue
    }
    $entries.Add("$($versionMatch.Value)|$($matchedTypes[0])")
  }
  return @($entries)
}

function Assert-SequenceEqual {
  param(
    [Parameter(Mandatory = $true)][string]$Label,
    [Parameter(Mandatory = $true)][AllowNull()][AllowEmptyCollection()][object[]]$Expected,
    [Parameter(Mandatory = $true)][AllowNull()][AllowEmptyCollection()][object[]]$Actual,
    [Parameter(Mandatory = $true)][string]$GroupId,
    [Parameter(Mandatory = $true)][string]$Locale
  )
  $Expected = @($Expected)
  $Actual = @($Actual)
  $separator = [string][char]0x1f
  if (($Expected -join $separator) -ne ($Actual -join $separator)) {
    $firstDifference = 0
    $limit = [Math]::Max($Expected.Count, $Actual.Count)
    while (
      $firstDifference -lt $limit -and
      $firstDifference -lt $Expected.Count -and
      $firstDifference -lt $Actual.Count -and
      [string]$Expected[$firstDifference] -ceq [string]$Actual[$firstDifference]
    ) {
      $firstDifference += 1
    }
    $expectedValue = if ($firstDifference -lt $Expected.Count) { [string]$Expected[$firstDifference] } else { '<end>' }
    $actualValue = if ($firstDifference -lt $Actual.Count) { [string]$Actual[$firstDifference] } else { '<end>' }
    $errors.Add("[$GroupId/$Locale] $Label differs at item $($firstDifference + 1) (expected '$expectedValue', actual '$actualValue'; counts $($Expected.Count)/$($Actual.Count)).")
  }
}

function Get-OrdinalDuplicates {
  param([Parameter(Mandatory = $true)][AllowEmptyCollection()][object[]]$Values)
  $counts = [Collections.Generic.Dictionary[string, int]]::new([StringComparer]::Ordinal)
  foreach ($value in $Values) {
    $key = [string]$value
    if ($counts.ContainsKey($key)) {
      $counts[$key] += 1
    } else {
      $counts[$key] = 1
    }
  }
  return @($counts.GetEnumerator() | Where-Object { $_.Value -gt 1 } | ForEach-Object { $_.Key })
}

$expectedLocales = @('en', 'ja', 'es', 'pt-BR')
$allLocales = @('ko') + $expectedLocales
$allowedReviewStates = @('draft', 'reviewed', 'stale')
$expectedReleaseTypes = @('major', 'minor', 'bug', 'hotfix')
Assert-SequenceEqual -Label 'manifest locale order' -Expected $expectedLocales -Actual @($manifest.companionLocales) -GroupId 'manifest' -Locale 'all'

if ($null -eq $manifest.releaseTypeLabels) {
  $errors.Add('[manifest] releaseTypeLabels is missing.')
} else {
  Assert-SequenceEqual -Label 'release-label locale order' -Expected $allLocales -Actual @($manifest.releaseTypeLabels.PSObject.Properties.Name) -GroupId 'manifest' -Locale 'all'
  foreach ($locale in $allLocales) {
    $localeProperty = $manifest.releaseTypeLabels.PSObject.Properties[$locale]
    if ($null -eq $localeProperty) {
      $errors.Add("[manifest/releaseTypeLabels] Missing locale '$locale'.")
      continue
    }
    $labels = $localeProperty.Value
    Assert-SequenceEqual -Label 'release-label category order' -Expected $expectedReleaseTypes -Actual @($labels.PSObject.Properties.Name) -GroupId 'manifest' -Locale $locale
    foreach ($type in $expectedReleaseTypes) {
      $labelProperty = $labels.PSObject.Properties[$type]
      if ($null -eq $labelProperty -or [string]::IsNullOrWhiteSpace([string]$labelProperty.Value)) {
        $errors.Add("[manifest/releaseTypeLabels/$locale] Missing label for '$type'.")
      }
    }
  }
}

if ($allowedReviewStates -notcontains $manifest.pilotStatus) {
  $errors.Add("[manifest] Unknown pilotStatus '$($manifest.pilotStatus)'.")
} elseif (-not $AllowDraft -and $manifest.pilotStatus -ne 'reviewed') {
  $errors.Add("[manifest] Pilot status is '$($manifest.pilotStatus)'; strict verification requires 'reviewed'.")
}

$groupIds = @($manifest.documentGroups | ForEach-Object { $_.id })
$duplicateGroupIds = @($groupIds | Group-Object | Where-Object { $_.Count -gt 1 } | ForEach-Object { $_.Name })
if ($duplicateGroupIds.Count -gt 0) {
  $errors.Add("[manifest] Duplicate document group id(s): $($duplicateGroupIds -join ', ').")
}

$manifestPaths = [System.Collections.Generic.List[string]]::new()
foreach ($group in $manifest.documentGroups) {
  $manifestPaths.Add([string]$group.canonical)
  foreach ($locale in $expectedLocales) {
    $manifestPaths.Add([string]$group.translations.$locale)
  }
}
$duplicateManifestPaths = @($manifestPaths | Group-Object | Where-Object { $_.Count -gt 1 } | ForEach-Object { $_.Name })
if ($duplicateManifestPaths.Count -gt 0) {
  $errors.Add("[manifest] A document path belongs to more than one group: $($duplicateManifestPaths -join ', ').")
}

$localizedTargetGroups = @{}
foreach ($candidateGroup in $manifest.documentGroups) {
  $candidateCanonical = [IO.Path]::GetFullPath((Join-Path $repoRoot $candidateGroup.canonical))
  $localizedTargetGroups[$candidateCanonical] = $candidateGroup
  if ([IO.Path]::GetFileName($candidateCanonical) -ieq 'README.md') {
    $localizedTargetGroups[(Split-Path -Parent $candidateCanonical)] = $candidateGroup
  }
}

$glossaryPath = Join-Path $repoRoot $manifest.glossary
if (-not (Test-Path -LiteralPath $glossaryPath)) {
  $errors.Add("Glossary not found: $($manifest.glossary)")
} else {
  $glossary = Get-Content -LiteralPath $glossaryPath -Raw -Encoding UTF8 | ConvertFrom-Json
  if ($glossary.version -ne $manifest.glossaryVersion) {
    $errors.Add("Glossary version differs between manifest and glossary.")
  }
  if ($glossary.reviewStatus -notin @('draft-independent-review-required', 'reviewed')) {
    $errors.Add("[glossary] Unknown reviewStatus '$($glossary.reviewStatus)'.")
  } elseif (-not $AllowDraft -and $glossary.reviewStatus -ne 'reviewed') {
    $errors.Add("[glossary] Review status is '$($glossary.reviewStatus)'; strict verification requires 'reviewed'.")
  }
  Assert-SequenceEqual -Label 'glossary locale order' -Expected $allLocales -Actual @($glossary.localePolicy.PSObject.Properties.Name) -GroupId 'glossary' -Locale 'all'

  if ([string]::IsNullOrWhiteSpace([string]$glossary.evidenceRegister)) {
    $errors.Add("[glossary] evidenceRegister is missing.")
  } else {
    $evidencePath = Join-Path $repoRoot $glossary.evidenceRegister
    if (-not (Test-Path -LiteralPath $evidencePath)) {
      $errors.Add("[glossary] Evidence register not found: $($glossary.evidenceRegister)")
    }
  }

  $termIds = @($glossary.terms | ForEach-Object { $_.id })
  $duplicateTermIds = @($termIds | Group-Object | Where-Object { $_.Count -gt 1 } | ForEach-Object { $_.Name })
  if ($duplicateTermIds.Count -gt 0) {
    $errors.Add("[glossary] Duplicate term id(s): $($duplicateTermIds -join ', ').")
  }
  foreach ($term in $glossary.terms) {
    foreach ($locale in $allLocales) {
      $property = $term.PSObject.Properties[$locale]
      if ($null -eq $property -or [string]::IsNullOrWhiteSpace([string]$property.Value)) {
        $errors.Add("[glossary/$($term.id)] Missing value for locale '$locale'.")
      }
    }
  }

  $duplicateIdentifiers = @(Get-OrdinalDuplicates -Values @($glossary.protectedIdentifiers))
  if ($duplicateIdentifiers.Count -gt 0) {
    $errors.Add("[glossary] Duplicate protected identifier(s): $($duplicateIdentifiers -join ', ').")
  }
}

foreach ($group in $manifest.documentGroups) {
  $canonicalPath = Join-Path $repoRoot $group.canonical
  if (-not (Test-Path -LiteralPath $canonicalPath)) {
    $errors.Add("[$($group.id)] Canonical file not found: $($group.canonical)")
    continue
  }

  $canonicalText = Get-NormalizedText -Path $canonicalPath
  $canonicalHash = Get-Sha256 -Text $canonicalText
  if ($UpdateHashes) {
    $group.canonicalSha256 = $canonicalHash
  } elseif ($group.canonicalSha256 -ne $canonicalHash) {
    $errors.Add("[$($group.id)] Canonical hash is stale. Expected $canonicalHash but manifest contains $($group.canonicalSha256).")
  }

  if (-not $AllowDraft -and $group.reviewStatus -ne 'reviewed') {
    $errors.Add("[$($group.id)] Review status is '$($group.reviewStatus)'; strict verification requires 'reviewed'.")
  } elseif ($allowedReviewStates -notcontains $group.reviewStatus) {
    $errors.Add("[$($group.id)] Unknown review status '$($group.reviewStatus)'.")
  }

  $localePaths = @($group.canonical)
  foreach ($locale in $expectedLocales) {
    $localePaths += [string]$group.translations.$locale
  }
  $localeAbsolutePaths = @($localePaths | ForEach-Object { [IO.Path]::GetFullPath((Join-Path $repoRoot $_)) })

  $canonicalHeadings = Get-HeadingShape -Text $canonicalText
  $canonicalLinks = Get-LinkTargets -Text $canonicalText
  $canonicalNumbers = Get-NumberTokens -Text $canonicalText
  $canonicalCode = Get-CodeTokens -Text $canonicalText
  $canonicalReleaseTypes = Get-ReleaseTypeSequence -Text $canonicalText -Labels $manifest.releaseTypeLabels.ko -GroupId $group.id -Locale 'ko'

  foreach ($locale in $expectedLocales) {
    $translationRelative = $group.translations.$locale
    if ([string]::IsNullOrWhiteSpace($translationRelative)) {
      $errors.Add("[$($group.id)/$locale] Translation path is missing from the manifest.")
      continue
    }
    $translationPath = Join-Path $repoRoot $translationRelative
    if (-not (Test-Path -LiteralPath $translationPath)) {
      $errors.Add("[$($group.id)/$locale] File not found: $translationRelative")
      continue
    }

    $translationText = Get-NormalizedText -Path $translationPath
    Assert-SequenceEqual -Label 'heading structure' -Expected $canonicalHeadings -Actual (Get-HeadingShape -Text $translationText) -GroupId $group.id -Locale $locale
    $translationLinks = @(Get-LinkTargets -Text $translationText)
    if ($canonicalLinks.Count -ne $translationLinks.Count) {
      $errors.Add("[$($group.id)/$locale] Markdown link target count differs (expected $($canonicalLinks.Count), actual $($translationLinks.Count)).")
    } else {
      for ($linkIndex = 0; $linkIndex -lt $canonicalLinks.Count; $linkIndex += 1) {
        $canonicalTarget = [string]$canonicalLinks[$linkIndex]
        $translationTarget = [string]$translationLinks[$linkIndex]
        $canonicalResolved = Resolve-LocalLinkPath -DocumentPath $canonicalPath -Target $canonicalTarget
        $translationResolved = Resolve-LocalLinkPath -DocumentPath $translationPath -Target $translationTarget

        if ($null -ne $canonicalResolved -and $localeAbsolutePaths -contains $canonicalResolved) {
          if ($canonicalTarget -cne $translationTarget) {
            $errors.Add("[$($group.id)/$locale] Language navigation link $($linkIndex + 1) changed from '$canonicalTarget' to '$translationTarget'.")
          }
          continue
        }

        if ($null -ne $canonicalResolved -and $localizedTargetGroups.ContainsKey($canonicalResolved)) {
          $targetGroup = $localizedTargetGroups[$canonicalResolved]
          $expectedLocalized = [IO.Path]::GetFullPath((Join-Path $repoRoot ([string]$targetGroup.translations.$locale)))
          if ($null -eq $translationResolved -or $translationResolved -ine $expectedLocalized) {
            $errors.Add("[$($group.id)/$locale] Managed link $($linkIndex + 1) must point to '$expectedLocalized' but points to '$translationTarget'.")
          }
          continue
        }

        if ($canonicalTarget -cne $translationTarget) {
          $errors.Add("[$($group.id)/$locale] Markdown link $($linkIndex + 1) changed from '$canonicalTarget' to '$translationTarget'.")
        }
      }
    }
    Assert-SequenceEqual -Label 'numeric tokens' -Expected $canonicalNumbers -Actual (Get-NumberTokens -Text $translationText) -GroupId $group.id -Locale $locale
    Assert-SequenceEqual -Label 'inline-code and fenced-code tokens' -Expected $canonicalCode -Actual (Get-CodeTokens -Text $translationText) -GroupId $group.id -Locale $locale
    $translationLabels = $manifest.releaseTypeLabels.PSObject.Properties[$locale].Value
    Assert-SequenceEqual -Label 'release categories' -Expected $canonicalReleaseTypes -Actual (Get-ReleaseTypeSequence -Text $translationText -Labels $translationLabels -GroupId $group.id -Locale $locale) -GroupId $group.id -Locale $locale
  }

  $documentsToCheck = @(@{ Locale = 'ko'; Path = $canonicalPath; Text = $canonicalText })
  foreach ($locale in $expectedLocales) {
    $translationRelative = [string]$group.translations.$locale
    $translationPath = Join-Path $repoRoot $translationRelative
    if (Test-Path -LiteralPath $translationPath) {
      $documentsToCheck += @{ Locale = $locale; Path = $translationPath; Text = (Get-NormalizedText -Path $translationPath) }
    }
  }
  foreach ($document in $documentsToCheck) {
    $resolvedLocalTargets = [System.Collections.Generic.List[string]]::new()
    foreach ($target in (Get-LinkTargets -Text $document.Text)) {
      $resolved = Resolve-LocalLinkPath -DocumentPath $document.Path -Target $target
      if ($null -eq $resolved) {
        continue
      }
      $resolvedLocalTargets.Add($resolved)
      if (-not (Test-Path -LiteralPath $resolved)) {
        $errors.Add("[$($group.id)/$($document.Locale)] Local link target not found: $target")
      }
    }
    foreach ($expectedLocalePath in $localeAbsolutePaths) {
      if ($resolvedLocalTargets -notcontains $expectedLocalePath) {
        $errors.Add("[$($group.id)/$($document.Locale)] Language navigation does not link to: $expectedLocalePath")
      }
    }
  }
}

if ($UpdateHashes) {
  $json = ($manifest | ConvertTo-Json -Depth 20) + "`n"
  [IO.File]::WriteAllText($manifestPath, $json, [Text.UTF8Encoding]::new($false))
  Write-Host "Updated canonical hashes in docs/localization/manifest.json"
}

if ($errors.Count -gt 0) {
  $errors | ForEach-Object { Write-Host $_ -ForegroundColor Red }
  throw "Public document localization verification failed with $($errors.Count) issue(s)."
}

Write-Host "Public document localization verification passed for $($manifest.documentGroups.Count) document group(s)."
