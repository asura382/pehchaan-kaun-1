$filePath = "services\chapterService.js"
$lines = Get-Content $filePath

Write-Host "Finding all broken regex patterns..."

# Find lines that match the broken pattern
$brokenIndices = @()
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '=\s*cleaned\.replace\($' -or 
        $lines[$i] -match '=\s*fixed\.replace\($' -or
        $lines[$i] -match '\.replace\(/\s*$') {
        $brokenIndices += $i
        Write-Host "Found broken pattern at line $($i+1): $($lines[$i].Substring(0, [Math]::Min(50, $lines[$i].Length)))"
    }
}

if ($brokenIndices.Count -eq 0) {
    Write-Host "No broken patterns found!"
    exit 0
}

Write-Host "`nFixing $($brokenIndices.Count) broken patterns..."

# Fix each one
foreach ($idx in $brokenIndices) {
    Write-Host "  Fixing line $($idx+1)..."
    
    # Determine the correct replacement based on context
    $context = ""
    if ($idx -gt 0) { $context = $lines[$idx-1] }
    
    if ($context -match 'cleaned\s*=\s*cleaned') {
        $replacement = '    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, "\n\n");'
    } elseif ($context -match 'fixed\s*=\s*fixed') {
        $replacement = '    fixed = fixed.replace(/\n\s*\n\s*\n/g, "\n\n");'
    } else {
        $replacement = '      .replace(/\n\s*\n\s*\n/g, "\n\n")  // Clean up multiple line breaks'
    }
    
    # Find how many lines to skip (look for lines with \s*, /g, etc.)
    $linesToRemove = 1
    for ($j = $idx + 1; $j -lt $lines.Count -and $j -lt $idx + 10; $j++) {
        if ($lines[$j] -match '\\s\*' -or 
            $lines[$j] -match '/g,' -or 
            $lines[$j] -match "^\s*['\""]\s*['\""]" -or
            [string]::IsNullOrWhiteSpace($lines[$j])) {
            $linesToRemove++
        } else {
            break
        }
    }
    
    # Replace the broken line(s)
    $newLines = @()
    $skipUntil = -1
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($i -eq $idx) {
            $newLines += $replacement
            $skipUntil = $idx + $linesToRemove - 1
        } elseif ($i -gt $skipUntil) {
            $newLines += $lines[$i]
        }
    }
    $lines = $newLines
}

Set-Content $filePath -Value $lines

Write-Host "`nVerifying syntax..."
$syntaxCheck = node -c $filePath 2>&1

if ($syntaxCheck -eq $null -or $syntaxCheck -eq '') {
    Write-Host "SUCCESS: All regex patterns fixed and syntax is valid!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "ERROR: Some syntax errors remain:" -ForegroundColor Red
    Write-Host $syntaxCheck
    exit 1
}
