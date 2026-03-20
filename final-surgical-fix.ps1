# Final surgical fix - only fix broken multi-line regex, preserve everything else
$filePath = "services\chapterService.js"
$content = Get-Content $filePath -Raw

Write-Host "Applying surgical regex fixes..."

# Fix 1: Replace broken .replace(/\n\s*\n\s*\n/g patterns
# These are currently split across 6 lines and need to be on ONE line

$fixesApplied = 0

# Pattern to find: .replace(/ followed by newlines with \s*
$pattern = '\.replace\(\s*\n\s*\\s\*\s*\n\s*\\s\*\s*/g,\s*\n\s*["\x27]\s*\n\s*["\x27]\s*\)'

# We need to do this multiple times for each occurrence
for ($i = 0; $i -lt 10; $i++) {
    if ($content -match $pattern) {
        # Check what variable is being used in context
        $matchIndex = $content.IndexOf($matches[0])
        $contextStart = [Math]::Max(0, $matchIndex - 200)
        $context = $content.Substring($contextStart, $matchIndex - $contextStart + 50)
        
        # Determine correct replacement
        if ($context -match 'cleanedContent\s*=\s*cleanedContent') {
            $replacement = '      cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, "\n\n")'
        } elseif ($context -match 'cleaned\s*=\s*cleaned') {
            $replacement = '    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, "\n\n")'
        } elseif ($context -match 'fixed\s*=\s*fixed') {
            $replacement = '    fixed = fixed.replace(/\n\s*\n\s*\n/g, "\n\n")'
        } else {
            $replacement = '      .replace(/\n\s*\n\s*\n/g, "\n\n")'
        }
        
        $content = $content -replace $pattern, $replacement
        $fixesApplied++
        Write-Host "Fixed pattern #$($i+1)"
    } else {
        break
    }
}

Write-Host "Applied $fixesApplied regex fixes"

# Save
Set-Content $filePath -Value $content -NoNewline

Write-Host "`nVerifying syntax..."
$syntaxCheck = node -c $filePath 2>&1

if ($syntaxCheck -eq $null -or $syntaxCheck -eq '') {
    Write-Host "SUCCESS: Syntax is valid! All broken regex patterns fixed." -ForegroundColor Green
    exit 0
} else {
    Write-Host "ERROR: Syntax errors remain:" -ForegroundColor Red
    Write-Host $syntaxCheck
    exit 1
}
