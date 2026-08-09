function Get-ReaderFacingV2AppRoot {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Root
  )

  $resolvedRoot = [IO.Path]::GetFullPath($Root).TrimEnd(
    [IO.Path]::DirectorySeparatorChar,
    [IO.Path]::AltDirectorySeparatorChar
  )
  $appRootCandidate = Join-Path $resolvedRoot 'v2-nextjs'
  if (Test-Path -LiteralPath $appRootCandidate -PathType Container) {
    return $appRootCandidate
  }
  return $resolvedRoot
}

function Test-IsProtectedV1ReleasePath {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path
  )

  $fullPath = [IO.Path]::GetFullPath($Path)
  return $fullPath -match '(?i)(?:^|[\\/])v1-gas[\\/]releases(?:[\\/]|$)'
}

function Get-ReaderFacingV2ReleaseFiles {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Root
  )

  $resolvedRoot = [IO.Path]::GetFullPath($Root).TrimEnd(
    [IO.Path]::DirectorySeparatorChar,
    [IO.Path]::AltDirectorySeparatorChar
  )
  $appRoot = Get-ReaderFacingV2AppRoot -Root $resolvedRoot
  $rootIsSourceTree = (
    (Test-Path -LiteralPath (Join-Path $resolvedRoot 'package.json') -PathType Leaf) -and
    (Test-Path -LiteralPath (Join-Path $resolvedRoot 'lib\versionArchive.ts') -PathType Leaf)
  )

  $readerFiles = @()
  foreach ($scanRoot in @($resolvedRoot, $appRoot) | Select-Object -Unique) {
    if (-not (Test-Path -LiteralPath $scanRoot -PathType Container)) {
      continue
    }
    if (
      $rootIsSourceTree -and
      [string]::Equals($scanRoot, $resolvedRoot, [StringComparison]::OrdinalIgnoreCase)
    ) {
      continue
    }
    $readerFiles += Get-ChildItem -LiteralPath $scanRoot -File -ErrorAction SilentlyContinue |
      Where-Object { $_.Name -like 'README*.md' -or $_.Name -like 'CHANGELOG*.md' }
  }

  $releaseRoot = Join-Path $appRoot 'releases'
  if (Test-Path -LiteralPath $releaseRoot -PathType Container) {
    foreach ($versionDirectory in Get-ChildItem -LiteralPath $releaseRoot -Directory -ErrorAction SilentlyContinue) {
      if ($versionDirectory.Name -notmatch '^v2\.\d+\.\d+$') {
        continue
      }
      $readerFiles += Get-ChildItem -LiteralPath $versionDirectory.FullName -File -Filter 'README*.md' -ErrorAction SilentlyContinue
    }
  }

  return @(
    $readerFiles |
      Where-Object { -not (Test-IsProtectedV1ReleasePath -Path $_.FullName) } |
      Sort-Object -Property FullName -Unique
  )
}

function Get-ReaderFacingV2ArchiveSummaries {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Root
  )

  $appRoot = Get-ReaderFacingV2AppRoot -Root $Root
  $archiveCandidates = @(
    (Join-Path $appRoot 'lib\versionArchive.ts'),
    (Join-Path $appRoot 'source\lib\versionArchive.ts')
  ) | Select-Object -Unique
  $summaries = @()

  foreach ($archivePath in $archiveCandidates) {
    if (-not (Test-Path -LiteralPath $archivePath -PathType Leaf)) {
      continue
    }

    $resolvedArchive = (Resolve-Path -LiteralPath $archivePath).Path
    $lines = [IO.File]::ReadAllLines($resolvedArchive, [Text.Encoding]::UTF8)
    $entryStart = -1
    $entryLines = @()

    for ($lineIndex = 0; $lineIndex -lt $lines.Count; $lineIndex += 1) {
      $line = $lines[$lineIndex]
      if ($entryStart -lt 0) {
        if ($line -match '^\s*\{\s*$') {
          $entryStart = $lineIndex
          $entryLines = @($line)
        }
        continue
      }

      $entryLines += $line
      if ($line -notmatch '^\s*\},?\s*$') {
        continue
      }

      $entryText = $entryLines -join "`n"
      if ($entryText -match "(?m)^\s*series:\s*'v2-nextjs'\s*,?\s*$") {
        for ($entryLineIndex = 0; $entryLineIndex -lt $entryLines.Count; $entryLineIndex += 1) {
          if ($entryLines[$entryLineIndex] -notmatch '^\s*summary\s*:') {
            continue
          }

          $summaryLines = @($entryLines[$entryLineIndex])
          $summaryEndIndex = $entryLineIndex
          while (
            $summaryEndIndex + 1 -lt $entryLines.Count -and
            ($summaryLines -join "`n") -notmatch "['`"]\s*,?\s*$"
          ) {
            $summaryEndIndex += 1
            $summaryLines += $entryLines[$summaryEndIndex]
          }
          $summaries += [PSCustomObject]@{
            FullName = $resolvedArchive
            LineNumber = $entryStart + $entryLineIndex + 1
            Text = ($summaryLines -join "`n").Trim()
          }
          break
        }
      }

      $entryStart = -1
      $entryLines = @()
    }
  }

  return @($summaries)
}

function Get-ReaderFacingReleaseProcessLeaks {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Root
  )

  # These patterns require either explicit editorial/process narration or a
  # high-confidence engineering marker. Product behavior, clinical review,
  # ordinary calculation verification, recalculation guidance, and privacy
  # statements about databases or API keys remain valid reader prose.
  $patterns = @(
    '(?m)^\s*(?:#{1,6}\s+|[-*>]\s*)?(?:\*{0,2})?\[?20\d{2}-\d{2}-\d{2}\]?(?:\*{0,2})?\s*(?:[:\-\u2013\u2014]\s*)?(?:\uBB38\uC11C\s*(?:\uC815\uC815|\uC218\uC815)|\uCD94\uAC00\s*(?:\uD655\uC778|\uAC80\uC99D)|\uD6C4\uC18D\s*(?:\uD655\uC778|\uAC80\uC99D)|document\s+(?:correction|update)|additional\s+(?:check|verification|review)|follow-up\s+(?:check|verification|review)|\u6587\u66F8(?:\u8A02\u6B63|\u4FEE\u6B63)|\u8FFD\u52A0(?:\u78BA\u8A8D|\u691C\u8A3C)|\u8FFD\u88DC(?:\u78BA\u8A8D|\u691C\u8A3C)|correcci[o\u00F3]n\s+(?:del\s+)?documento|(?:comprobaci[o\u00F3]n|verificaci[o\u00F3]n)\s+adicional|corre[c\u00E7][a\u00E3]o\s+(?:do\s+)?documento|verifica[c\u00E7][a\u00E3]o\s+adicional)',
    '(?m)^#{1,6}\s+[^\r\n]{0,80}(?:\uCD94\uAC00\s*(?:\uD655\uC778|\uAC80\uC99D)|\uC7AC\uD655\uC778|\uD6C4\uC18D\s*(?:\uD655\uC778|\uAC80\uC99D)|additional\s+(?:check|verification|review)|follow-up\s+(?:check|verification|review)|recheck(?:ed|ing)?|\u8FFD\u52A0(?:\u78BA\u8A8D|\u691C\u8A3C)|\u518D\u78BA\u8A8D|(?:comprobaci[o\u00F3]n|verificaci[o\u00F3]n)\s+adicional|verifica[c\u00E7][a\u00E3]o\s+adicional)',
    '(?m)^\s*#{1,6}\s+[^\r\n]{0,80}(?:\uB9B4\uB9AC\uC988\s*\uB178\uD2B8[^\r\n]{0,20}(?:\uC815\uC815|\uC218\uC815|\uC815\uB9AC|\uC815\uBE44|\uB3D9\uAE30\uD654)|\uBB38\uC11C\s*(?:\uBB38\uAD6C\s*)?(?:\uC815\uC815|\uC218\uC815|\uC815\uB9AC|\uC815\uBE44|\uB3D9\uAE30\uD654))\s*$',
    '(?im)^\s*#{1,6}\s+[^\r\n]{0,80}(?:(?:release\s+note|document(?:ation)?|editorial)\s+(?:correction|update|cleanup|revision|alignment)|(?:correction|cleanup|revision)\s+(?:notice|note))[^\r\n]*$',
    '(?m)^\s*#{1,6}\s+[^\r\n]{0,80}(?:(?:\u30EA\u30EA\u30FC\u30B9\u30CE\u30FC\u30C8|\u6587\u66F8|\u6587\u8A00)(?:\u306E)?(?:\u8A02\u6B63|\u4FEE\u6B63|\u6574\u7406|\u540C\u671F)|(?:correcci[o\u00F3]n|actualizaci[o\u00F3]n|limpieza)\s+(?:de\s+)?(?:la\s+)?(?:nota\s+de\s+la\s+versi[o\u00F3]n|documentaci[o\u00F3]n|documento)|(?:corre[c\u00E7][a\u00E3]o|atualiza[c\u00E7][a\u00E3]o|limpeza)\s+(?:da\s+|do\s+)?(?:nota\s+de\s+lan[c\u00E7]amento|documenta[c\u00E7][a\u00E3]o|documento))[^\r\n]*$',
    '(?:\uB9B4\uB9AC\uC988\s*\uB178\uD2B8|\uACF5\uAC1C\s*\uBB38\uC11C|\uBB38\uC11C\s*\uBB38\uAD6C|\uB0B4\uBD80\s*(?:\uC0AC\uC815|\uC6A9\uC5B4|\uD45C\uD604|\uBB38\uAD6C))[^\r\n]{0,100}(?:\uACE0\uCE58|\uC218\uC815|\uC815\uB9AC|\uC815\uC815|\uC0AD\uC81C|\uAC77\uC5B4|\uB9DE\uCD94|\uB3D9\uAE30\uD654)',
    '(?i)\b(?:this\s+)?(?:release note|public document(?:ation)?|document wording|release wording)\b[^\r\n]{0,100}\b(?:edit(?:ed)?|rewrit(?:e|ten)|reword(?:ed)?|updat(?:e|ed)|correct(?:ed)?|clean(?:ed)?\s+up|align(?:ed)?|synchroniz(?:e|ed))\b',
    '(?i)\b(?:nota\s+de\s+la\s+versi[o\u00F3]n|documentaci[o\u00F3]n\s+p[u\u00FA]blica|redacci[o\u00F3]n\s+del\s+documento|nota\s+de\s+lan[c\u00E7]amento|documenta[c\u00E7][a\u00E3]o\s+p[u\u00FA]blica|reda[c\u00E7][a\u00E3]o\s+do\s+documento)[^\r\n]{0,100}(?:actualiz|corrig|limp|alinh|sincroniz|revis)',
    '(?i)\b(?:archive|version history|release archive)\b[^\r\n]{0,80}\b(?:date|order|number(?:ing| format)?|metadata|wording)\b[^\r\n]{0,80}\b(?:align(?:ed|ment)?|synchroniz(?:e|ed|ation)|correct(?:ed|ion)?|normaliz(?:e|ed|ation)|restor(?:e|ed|ation)|clean(?:ed)? up)\b',
    '(?:\uC544\uCE74\uC774\uBE0C|\uBC84\uC804\s*\uAE30\uB85D|\uB9B4\uB9AC\uC988\s*\uB178\uD2B8)[^\r\n]{0,80}(?:\uB0A0\uC9DC|\uC21C\uC11C|\uBC88\uD638\s*\uD45C\uAE30|\uBA54\uD0C0\uB370\uC774\uD130|\uBB38\uAD6C)[^\r\n]{0,80}(?:\uB9DE\uCD94|\uC77C\uCE58|\uB3D9\uAE30\uD654|\uC815\uC815|\uBCF5\uC6D0|\uC815\uB9AC|\uD1B5\uC77C)',
    '(?:\u30A2\u30FC\u30AB\u30A4\u30D6|\u30D0\u30FC\u30B8\u30E7\u30F3\u5C65\u6B74)[^\r\n]{0,80}(?:\u65E5\u4ED8|\u9806\u5E8F|\u756A\u53F7\u8868\u8A18|\u30E1\u30BF\u30C7\u30FC\u30BF|\u6587\u8A00)[^\r\n]{0,80}(?:\u4FEE\u6B63|\u7D71\u4E00|\u6574\u7406|\u540C\u671F|\u5FA9\u5143|\u4E00\u81F4)',
    '(?i)(?:\b(?:archivo|historial\s+de\s+versiones)\b[^\r\n]{0,80}\b(?:fecha|orden|numeraci[o\u00F3]n|metadatos|redacci[o\u00F3]n)\b[^\r\n]{0,80}(?:aline|sincroniz|corrig|normaliz|restaur|limpi)|\b(?:arquivo|hist[o\u00F3]rico\s+de\s+vers[o\u00F5]es)\b[^\r\n]{0,80}\b(?:data|ordem|numera[c\u00E7][a\u00E3]o|metadados|reda[c\u00E7][a\u00E3]o)\b[^\r\n]{0,80}(?:alinh|sincroniz|corrig|normaliz|restaur|limp))',
    '(?i)\b(?:Codex|Claude|worktree|uncommitted draft|draft status|release gate|test fixture|regression contract|production[- ]parity|audit (?:report|log|record)|ops (?:report|log|record)|mirror synchronization|source archive alignment)\b',
    '(?i)\b(?:internal (?:workflow|process|review|approval|terminology|wording|circumstances)|runtime|fixture|contract|regression test|guardrail|owner approval|owner decision|project owner approved|draft review)\b',
    '(?:\uB0B4\uBD80\s*(?:\uC791\uC5C5\s*\uD750\uB984|\uC6CC\uD06C\uD50C\uB85C|\uC808\uCC28|\uAC80\uD1A0|\uC2B9\uC778|\uC6A9\uC5B4|\uBB38\uAD6C|\uC0AC\uC815)|\uC2E4\uD589\s*\uD658\uACBD|\uD14C\uC2A4\uD2B8\s*\uD53D\uC2A4\uCC98|\uD68C\uADC0\s*\uD14C\uC2A4\uD2B8|\uAC00\uB4DC\uB808\uC77C|(?:\uC18C\uC720\uC790|\uC0AC\uC6A9\uC790)\s*(?:\uC2B9\uC778|\uACB0\uC815)|\uCD08\uC548\s*\uAC80\uD1A0)',
    '(?i)\b(?:reader-facing|intended readers?|primary readers?|non-developer readers?|clinician-first)\b|(?:\uC0AC\uB78C\uC774\s*\uC77D\uB294|\uB3C5\uC790\s*(?:\uB300\uC0C1|\uC6A9)|\uC784\uC0C1\uAC00\s*\uC6B0\uC120)|(?:\u4EBA\u304C\u8AAD\u3080|\u8AAD\u8005\u5411\u3051|\u81E8\u5E8A\u5BB6\u5411\u3051)|(?:dirigid[ao]s?\s+a\s+(?:los\s+)?lectores|destinad[ao]s?\s+aos?\s+leitores|para\s+leitores)',
    '(?i)\b(?:AI|Codex|Claude|agent)\b[^\r\n]{0,100}\b(?:draft|audit|internal review|owner approval|approved by (?:the )?owner)\b',
    '(?:AI|Codex|Claude|\uC5D0\uC774\uC804\uD2B8)[^\r\n]{0,100}(?:\uCD08\uC548|\uAC80\uC218|\uAC10\uC0AC|\uB0B4\uBD80\s*\uAC80\uD1A0|(?:\uC18C\uC720\uC790|\uC0AC\uC6A9\uC790)\s*\uC2B9\uC778)',
    '(?:AI\s*(?:\uAC80\uC218|\uAC10\uC0AC)|\uC5D0\uC774\uC804\uD2B8\s*(?:\uC5ED\uD560|\uBC30\uC815)|\uB0B4\uBD80\s*\uAC10\uC0AC|\uC791\uC5C5\s*\uD2B8\uB9AC|\uBBF8\uCEE4\uBC0B|\uCD08\uC548\s*\uC0C1\uD0DC|\uB9B4\uB9AC\uC988\s*\uAC8C\uC774\uD2B8|\uC6B4\uC601\s*\uAE30\uB85D|AI\s*(?:\u76E3\u67FB|\u691C\u8A3C)|\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\s*(?:\u5F79\u5272|\u5272\u308A\u5F53\u3066)|\u5185\u90E8\s*\u76E3\u67FB|\u4F5C\u696D\s*\u30C4\u30EA\u30FC|\u672A\u30B3\u30DF\u30C3\u30C8|\u30C9\u30E9\u30D5\u30C8\s*\u72B6\u614B|\u30EA\u30EA\u30FC\u30B9\s*\u30B2\u30FC\u30C8|\u904B\u7528\s*\u8A18\u9332)',
    '(?i)(?:informe\s+de\s+auditor[i\u00ED]a|registro\s+de\s+operaciones|estado\s+del\s+borrador|puerta\s+de\s+lanzamiento|[a\u00E1]rbol\s+de\s+trabajo|relat[o\u00F3]rio\s+de\s+auditoria|registro\s+operacional|estado\s+do\s+rascunho|port[a\u00E3]o\s+de\s+lan[c\u00E7]amento|[a\u00E1]rvore\s+de\s+trabalho)',
    '(?i)\b(?:(?:first|initial|second|final|rerun|retry)\s+)?(?:tests?|build)(?:\s+run)?\s+(?:failed|passed|succeeded|completed|retried)\b|\b(?:all|\d+)\s+(?:tests?|checks?)\s+(?:passed|failed|succeeded)\b|\b(?:first|initial|rerun|retry)\s+verification(?:\s+run)?\s+(?:failed|passed|succeeded|completed|retried)\b',
    '(?:\uD14C\uC2A4\uD2B8|\uBE4C\uB4DC)[^\r\n]{0,24}(?:\uC2E4\uD328|\uD1B5\uACFC|\uC131\uACF5|\uC644\uB8CC|\uC7AC\uC2E4\uD589|\uC7AC\uC2DC\uB3C4)|\uAC80\uC99D\s*(?:\uC2E4\uD589|\uC7AC\uC2E4\uD589|\uC7AC\uC2DC\uB3C4)[^\r\n]{0,16}(?:\uC2E4\uD328|\uD1B5\uACFC|\uC131\uACF5|\uC644\uB8CC)',
    '(?:\u30C6\u30B9\u30C8|\u30D3\u30EB\u30C9)[^\r\n]{0,24}(?:\u5931\u6557|\u5408\u683C|\u6210\u529F|\u5B8C\u4E86|\u518D\u5B9F\u884C|\u518D\u8A66\u884C)|\u691C\u8A3C\s*(?:\u5B9F\u884C|\u518D\u5B9F\u884C|\u518D\u8A66\u884C)[^\r\n]{0,16}(?:\u5931\u6557|\u5408\u683C|\u6210\u529F|\u5B8C\u4E86)',
    '(?i)(?:\bpruebas?\b(?!\s+(?:(?:de|del|do)\s+)?Rorschach\b)|\btestes?\b(?!\s+(?:(?:de|del|do)\s+)?Rorschach\b)|\bcompilaci[o\u00F3]n\b|\bcompila[c\u00E7][a\u00E3]o\b)[^\r\n]{0,24}(?:fall|superad|complet|reintent|falh|aprov|sucess|conclu|reexecut)',
    '(?i)\bCI\b[^\r\n]{0,80}\b(?:green|red|passed|failed|succeeded|completed|rerun|retry|build|tests?)\b|\b(?:build|tests?)\b[^\r\n]{0,80}\bCI\b',
    '(?i)\bnpm(?:\.cmd)?\s+(?:run\s+)?(?:build|test|lint|typecheck|verify)[^\r\n]{0,80}\b(?:passed|failed|succeeded|completed|rerun|retry|CI|commit|PR)\b',
    '(?i)\b(?:commit(?:ted)?\s+(?:[a-f0-9]{6,40}|hash|SHA)|PR\s*#\d+|pull request\s*#\d+)\b',
    '(?i)\b(?:deployment|build)\s+(?:preparation|checklist|gate|artifact|record|completed|passed|failed|cleanup)\b|\bdeployed artifacts?\b',
    '(?:\uBC30\uD3EC|\uBE4C\uB4DC)[^\r\n]{0,20}(?:\uC900\uBE44|\uCCB4\uD06C\uB9AC\uC2A4\uD2B8|\uAC8C\uC774\uD2B8|\uC0B0\uCD9C\uBB3C|\uAE30\uB85D|\uC644\uB8CC|\uD1B5\uACFC|\uC2E4\uD328|\uC815\uB9AC)|(?:\u30C7\u30D7\u30ED\u30A4|\u30D3\u30EB\u30C9)[^\r\n]{0,20}(?:\u6E96\u5099|\u30C1\u30A7\u30C3\u30AF\u30EA\u30B9\u30C8|\u30B2\u30FC\u30C8|\u6210\u679C\u7269|\u8A18\u9332|\u5B8C\u4E86|\u5408\u683C|\u5931\u6557|\u6574\u7406)',
    '(?i)(?:despliegue|implantaci[o\u00F3]n|compilaci[o\u00F3]n|implanta[c\u00E7][a\u00E3]o|compila[c\u00E7][a\u00E3]o|build)[^\r\n]{0,24}(?:prepar|lista\s+de\s+control|checklist|gate|artefact|registro|complet|superad|fall|conclu|aprov|falh)',
    '(?i)\b(?:database|DB)\s+(?:rebuild|reset|replay|seed(?:ing|ed)?|cleanup|preparation)\b|\b(?:local|test|temporary)\s+(?:API\s+)?key\b|\bcredential cleanup\b',
    '(?:\uB370\uC774\uD130\uBCA0\uC774\uC2A4|DB)\s*(?:\uC7AC\uAD6C\uCD95|\uCD08\uAE30\uD654|\uC7AC\uC0DD|\uC2DC\uB4DC(?:\s*\uC791\uC5C5)?|\uC815\uB9AC\s*\uC791\uC5C5|\uC900\uBE44\s*\uC791\uC5C5)|(?:\uB85C\uCEEC|\uD14C\uC2A4\uD2B8|\uC784\uC2DC)[^\r\n]{0,10}(?:API\s*)?\uD0A4',
    '(?:\u30C7\u30FC\u30BF\u30D9\u30FC\u30B9|DB)\s*(?:\u518D\u69CB\u7BC9|\u521D\u671F\u5316|\u518D\u4F5C\u6210|\u30B7\u30FC\u30C9(?:\u4F5C\u696D)?|\u6574\u7406\u4F5C\u696D|\u6E96\u5099\u4F5C\u696D)|(?:\u30ED\u30FC\u30AB\u30EB|\u30C6\u30B9\u30C8|\u4E00\u6642)[^\r\n]{0,10}(?:API\s*)?\u30AD\u30FC',
    '(?i)(?:base\s+de\s+datos|banco\s+de\s+dados|BD)\s+(?:reconstru|reinici|limpieza|limpeza|preparaci|prepara)|(?:clave|chave)\s+(?:local|de\s+prueba|de\s+teste|temporal|tempor[a\u00E1]ria)',
    '(?i)\b(?:document generation|search data|source archive|public mirror)\s+(?:rebuild|rule|gate|sync|synchronization|alignment|restoration)\b|\b(?:manifest|content) hash mismatch(?:es)?\b',
    '(?:\uBB38\uC11C\s*\uC0DD\uC131|\uAC80\uC0C9\s*\uC790\uB8CC|\uC18C\uC2A4\s*\uC544\uCE74\uC774\uBE0C|\uACF5\uAC1C\s*\uBBF8\uB7EC)[^\r\n]{0,20}(?:\uC7AC\uAD6C\uCD95|\uADDC\uCE59|\uAC8C\uC774\uD2B8|\uB3D9\uAE30\uD654|\uC815\uD569|\uBCF5\uC6D0)|(?:\u6587\u66F8\u751F\u6210|\u691C\u7D22\u30C7\u30FC\u30BF|\u30BD\u30FC\u30B9\u30A2\u30FC\u30AB\u30A4\u30D6|\u516C\u958B\u30DF\u30E9\u30FC)[^\r\n]{0,20}(?:\u518D\u69CB\u7BC9|\u898F\u5247|\u30B2\u30FC\u30C8|\u540C\u671F|\u6574\u5408|\u5FA9\u5143)',
    '(?i)(?:generaci[o\u00F3]n\s+de\s+documentos|datos\s+de\s+b[u\u00FA]squeda|archivo\s+fuente|espejo\s+p[u\u00FA]blico|gera[c\u00E7][a\u00E3]o\s+de\s+documentos|dados\s+de\s+busca|arquivo\s+fonte|espelho\s+p[u\u00FA]blico)[^\r\n]{0,24}(?:reconstru|regla|regra|gate|sincroniz|alinh|restaur)',
    '(?i)\b(?:local|private|source|repository|file)\s+paths?\b|(?:\uB85C\uCEEC|\uBE44\uACF5\uAC1C|\uC18C\uC2A4|\uC800\uC7A5\uC18C|\uD30C\uC77C)\s*\uACBD\uB85C',
    '(?i)(?:[A-Za-z]:[\\/](?:Users|Documents|dev|home)[\\/]|/(?:Users|home)/[^\s`]+)',
    '(?i)\b(?:content|manifest|file|source|archive)\s+(?:SHA-?(?:1|256|512)\s+)?hash(?:es)?\b|\b(?:SHA-?(?:1|256|512)|MD5)\s*[:=]\s*[a-f0-9]{8,}\b|(?:\uBCF8\uBB38|\uB9E4\uB2C8\uD398\uC2A4\uD2B8|\uD30C\uC77C|\uC18C\uC2A4|\uC544\uCE74\uC774\uBE0C)\s*\uD574\uC2DC'
  )

  $leaks = @()
  foreach ($file in Get-ReaderFacingV2ReleaseFiles -Root $Root) {
    foreach ($pattern in $patterns) {
      foreach ($match in Select-String -LiteralPath $file.FullName -Pattern $pattern -CaseSensitive:$false -Encoding UTF8) {
        $leaks += "$($file.FullName):$($match.LineNumber): $($match.Line.Trim())"
      }
    }
  }
  foreach ($summary in Get-ReaderFacingV2ArchiveSummaries -Root $Root) {
    foreach ($pattern in $patterns) {
      if ([regex]::IsMatch($summary.Text, $pattern, [Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
        $leaks += "$($summary.FullName):$($summary.LineNumber): $($summary.Text)"
      }
    }
  }

  return @($leaks | Sort-Object -Unique)
}

function Assert-NoReaderFacingReleaseProcessNarrative {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Root
  )

  $leaks = @(Get-ReaderFacingReleaseProcessLeaks -Root $Root)
  if ($leaks.Count -gt 0) {
    throw "Internal release-process narrative remains in reader-facing v2 documents:`n$($leaks -join "`n")"
  }
}
