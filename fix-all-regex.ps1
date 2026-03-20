$filePath = "services\chapterService.js"
$allLines = Get-Content $filePath

Write-Host "Scanning for broken regex patterns..."

# Find all lines that end with .replace(/
$brokenLines = @()
for ($i = 0; $i -lt $allLines.Count; $i++) {
    if ($allLines[$i] -match '\.replace\(/\s*$' -or 
        ($allLines[$i] -match '\.replace\($' -and $i + 1 -lt $allLines.Count -and $allLines[$i+1] -match '^\s*\\')) {
        $brokenLines += $i
        Write-Host "Found broken regex at line $($i + 1)"
    }
}

if ($brokenLines.Count -eq 0) {
    Write-Host "No broken regex patterns found!"
    exit 0
}

Write-Host "Fixing $($brokenLines.Count) broken regex patterns..."

# Process from bottom to top to avoid index shifting issues
$fixedLines = $allLines
for ($idx = $brokenLines.Count - 1; $idx -ge 0; $idx--) {
    $lineIndex = $brokenLines[$idx]
    
    # Check what type of line it is and fix accordingly
    $context = ""
    if ($lineIndex -gt 0) {
        $context = $fixedLines[$lineIndex - 1]
    }
    
    # Determine replacement based on context
    if ($context -match 'cleanedContent\s*=\s*cleanedContent') {
        $replacement = '      cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, "\n\n"); // Clean up multiple line breaks'
    } elseif ($context -match 'cleaned\s*=\s*cleaned') {
        $replacement = '    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, "\n\n");'
    } elseif ($context -match 'fixed\s*=\s*fixed') {
        $replacement = '    fixed = fixed.replace(/\n\s*\n\s*\n/g, "\n\n");'
    } else {
        $replacement = '      .replace(/\n\s*\n\s*\n/g, "\n\n")  // Clean up multiple line breaks'
    }
    
    # Remove the broken lines (usually spans 5-6 lines)
    $linesToRemove = 6
    $newLines = @()
    for ($i = 0; $i -lt $fixedLines.Count; $i++) {
        if ($i -ge $lineIndex -and $i -lt $lineIndex + $linesToRemove) {
            continue
        }
        $newLines += $fixedLines[$i]
    }
    
    # Insert the fixed line
    $finalLines = @()
    for ($i = 0; $i -lt $newLines.Count; $i++) {
        if ($i -eq $lineIndex) {
            $finalLines += $replacement
        }
        $finalLines += $newLines[$i]
    }
    
    $fixedLines = $finalLines
    Write-Host "  Fixed line $($lineIndex + 1)"
}

Set-Content $filePath -Value $fixedLines
Write-Host "`nAll broken regex patterns have been fixed!"
