# Simple line-by-line fix
$filePath = "services\chapterService.js"
$lines = Get-Content $filePath

Write-Host "Fixing broken regex patterns line-by-line..."

$newLines = @()
$skipNext = 0

for ($i = 0; $i -lt $lines.Count; $i++) {
    # Skip lines if we're in a multi-line broken pattern
    if ($skipNext -gt 0) {
        $skipNext--
        continue
    }
    
    $line = $lines[$i]
    
    # Check for known broken patterns and fix them
    if ($line -match 'cleanedContent = cleanedContent\.replace\(/\s*$') {
        Write-Host "Fixed pattern at line $($i+1)"
        $newLines += '      cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, "\n\n"); // Clean up multiple line breaks'
        $skipNext = 5  # Skip next 5 lines (they're part of the broken pattern)
    } elseif ($line -match '^\s*cleaned = cleaned\.replace\(/\s*$') {
        Write-Host "Fixed pattern at line $($i+1)"
        $newLines += '    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, "\n\n"); // Clean up multiple line breaks'
        $skipNext = 5
    } elseif ($line -match '^\s*fixed = fixed\.replace\(/\s*$') {
        Write-Host "Fixed pattern at line $($i+1)"
        $newLines += '    fixed = fixed.replace(/\n\s*\n\s*\n/g, "\n\n"); // Clean up multiple line breaks'
        $skipNext = 5
    } else {
        $newLines += $line
    }
}

Set-Content $filePath -Value $newLines

Write-Host "`nVerifying syntax..."
$syntaxCheck = node -c $filePath 2>&1

if ($syntaxCheck -eq $null -or $syntaxCheck -eq '') {
    Write-Host "SUCCESS: Syntax is valid!" -ForegroundColor Green
} else {
    Write-Host "ERROR: Syntax errors remain:"
    Write-Host $syntaxCheck
}
