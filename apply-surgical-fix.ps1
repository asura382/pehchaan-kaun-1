# Surgical fix for broken multi-line regex in chapterService.js
$filePath = "services\chapterService.js"
$content = Get-Content $filePath -Raw

Write-Host "Fixing broken regex patterns..."

# Fix Pattern: .replace(/\n\s*\n\s*\n/g split across lines  
$pattern = '\.replace\(\s*\n\s*\\s\*\s*\n\s*\\s\*\s*/g,\s*.'
$replacement = '.replace(/\n\s*\n\s*\n/g, "\n\n")'

# Count fixes
$fixCount = 0

# Use regex to find and replace broken patterns
while ($content -match $pattern) {
    $content = $content -replace $pattern, $replacement
    $fixCount++
    if ($fixCount -gt 10) { break } # Safety limit
}

Write-Host "Fixed $fixCount broken regex pattern(s)"

# Save the file
Set-Content $filePath -Value $content -NoNewline

Write-Host "Verifying syntax..."
$syntaxCheck = node -c $filePath 2>&1

if ($syntaxCheck -eq $null -or $syntaxCheck -eq '') {
    Write-Host "SUCCESS: Syntax is valid!" 
} else {
    Write-Host "ERROR: Syntax errors remain:" 
    Write-Host $syntaxCheck
}
