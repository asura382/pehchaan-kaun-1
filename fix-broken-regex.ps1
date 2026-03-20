$filePath = "services\chapterService.js"
$allLines = Get-Content $filePath

# Find and remove the broken regex lines (657-672)
$linesToKeep = @()
for ($i = 0; $i -lt $allLines.Count; $i++) {
    # Skip lines 657-672 (0-indexed: 656-671)
    if ($i -ge 656 -and $i -le 671) {
        continue
    }
    $linesToKeep += $allLines[$i]
}

# Insert the correct line at position 656
$finalLines = @()
for ($i = 0; $i -lt $linesToKeep.Count; $i++) {
    if ($i -eq 656) {
        $finalLines += '      .replace(/\n\s*\n\s*\n/g, "\n\n")  // Clean up multiple line breaks'
    }
    $finalLines += $linesToKeep[$i]
}

Set-Content $filePath -Value $finalLines
Write-Host "Fixed broken regex at line 657"
